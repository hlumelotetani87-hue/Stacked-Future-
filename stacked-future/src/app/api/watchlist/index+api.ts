import { auth } from "@clerk/expo/server";
import { getWatchlist, addToWatchlist } from "@/lib/server/db-actions";
import { watchlistAddSchema } from "@/lib/server/security";

export async function GET(req: Request) {
  const { userId } = await auth();
  if (!userId) return Response.json({ error: "Unauthorized" }, { status: 401 });
  const items = await getWatchlist(userId);
  return Response.json({ items });
}

export async function POST(req: Request) {
  const { userId } = await auth();
  if (!userId) return Response.json({ error: "Unauthorized" }, { status: 401 });
  const body = await req.json();
  const parsed = watchlistAddSchema.safeParse(body);
  if (!parsed.success) return Response.json({ error: parsed.error.flatten() }, { status: 400 });
  const item = await addToWatchlist(userId, parsed.data.symbol, parsed.data.name, parsed.data.category);
  return Response.json({ item }, { status: 201 });
}
