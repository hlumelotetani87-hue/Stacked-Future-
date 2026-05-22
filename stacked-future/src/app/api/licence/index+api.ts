import { auth } from "@clerk/expo/server";
import { getUserTier } from "@/lib/server/db-actions";

export async function GET(req: Request) {
  const { userId } = await auth();
  if (!userId) return Response.json({ error: "Unauthorized" }, { status: 401 });
  const tier = await getUserTier(userId);
  return Response.json({ tier });
}
