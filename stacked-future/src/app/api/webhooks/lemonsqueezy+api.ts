import { upsertLicence, upsertUser } from "@/lib/server/db-actions";
import { db } from "@/lib/server/db/client";
import { users } from "@/lib/server/db/schema";
import { eq } from "drizzle-orm";

const VARIANT_1 = process.env.LEMONSQUEEZY_VARIANT_ID_1;
const VARIANT_2 = process.env.LEMONSQUEEZY_VARIANT_ID_2;
const WEBHOOK_SECRET = process.env.LEMONSQUEEZY_WEBHOOK_SECRET;

function variantToType(variantId: string): string {
  if (variantId === VARIANT_1) return "monthly";
  if (variantId === VARIANT_2) return "yearly";
  return "monthly";
}

export async function POST(req: Request) {
  // Verify signature
  const sig = req.headers.get("x-signature");
  if (!sig || !WEBHOOK_SECRET) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  const raw = await req.text();
  const event = JSON.parse(raw);
  const eventName = event.meta?.event_name;
  const data = event.data?.attributes;
  const userEmail = data?.user_email;
  const orderId = String(event.data?.id);
  const variantId = String(data?.variant_id);

  // Find user by email
  const [user] = await db.select().from(users).where(eq(users.email, userEmail)).limit(1);
  if (!user) return Response.json({ ok: true }); // user hasn't signed up yet, skip

  const type = variantToType(variantId);

  if (eventName === "order_created" || eventName === "subscription_created") {
    await upsertLicence({
      userId: user.id,
      provider: "lemonsqueezy",
      orderId,
      variantId,
      type,
      status: "active",
      validUntil: type === "monthly"
        ? Date.now() + 31 * 24 * 60 * 60 * 1000
        : Date.now() + 366 * 24 * 60 * 60 * 1000,
    });
    // Upgrade user tier
    await db.update(users).set({ tier: "pro" }).where(eq(users.id, user.id));
  }

  if (eventName === "subscription_cancelled" || eventName === "subscription_expired") {
    await upsertLicence({
      userId: user.id, provider: "lemonsqueezy", orderId, variantId, type, status: "cancelled",
    });
    await db.update(users).set({ tier: "free" }).where(eq(users.id, user.id));
  }

  return Response.json({ ok: true });
}
