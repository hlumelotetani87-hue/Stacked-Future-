import { auth } from "@clerk/expo/server";
import { getPaperTrades, openPaperTrade } from "@/lib/server/db-actions";
import { paperTradeSchema } from "@/lib/server/security";

export async function GET(req: Request) {
  const { userId } = await auth();
  if (!userId) return Response.json({ error: "Unauthorized" }, { status: 401 });
  const trades = await getPaperTrades(userId);
  return Response.json({ trades });
}

export async function POST(req: Request) {
  const { userId } = await auth();
  if (!userId) return Response.json({ error: "Unauthorized" }, { status: 401 });
  const body = await req.json();
  const parsed = paperTradeSchema.safeParse(body);
  if (!parsed.success) return Response.json({ error: parsed.error.flatten() }, { status: 400 });
  const trade = await openPaperTrade(userId, parsed.data);
  return Response.json({ trade }, { status: 201 });
}
