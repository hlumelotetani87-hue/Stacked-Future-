import { db } from "./db/client";
import { users, watchlist, signals, paperTrades, licences } from "./db/schema";
import { eq, and, desc } from "drizzle-orm";
import { randomUUID } from "expo-crypto";

// ── Users ──────────────────────────────────────────────────
export async function upsertUser(userId: string, email: string, name?: string) {
  const existing = await db.select().from(users).where(eq(users.id, userId)).limit(1);
  if (existing.length > 0) return existing[0];
  const [user] = await db.insert(users).values({ id: userId, email, name }).returning();
  return user;
}

export async function getUserTier(userId: string): Promise<string> {
  const [user] = await db.select({ tier: users.tier }).from(users).where(eq(users.id, userId)).limit(1);
  return user?.tier ?? "free";
}

// ── Watchlist ──────────────────────────────────────────────
export async function getWatchlist(userId: string) {
  return db.select().from(watchlist).where(eq(watchlist.userId, userId)).orderBy(desc(watchlist.addedAt));
}

export async function addToWatchlist(userId: string, symbol: string, name: string, category: string) {
  const [item] = await db.insert(watchlist).values({
    id: randomUUID(),
    userId,
    symbol,
    name,
    category,
    addedAt: Date.now(),
  }).returning();
  return item;
}

export async function removeFromWatchlist(userId: string, id: string) {
  await db.delete(watchlist).where(and(eq(watchlist.id, id), eq(watchlist.userId, userId)));
}

// ── Signals ────────────────────────────────────────────────
export async function saveSignal(userId: string, data: {
  symbol: string; timeframe: string; direction: string;
  confidence: number; forecastJson: string;
}) {
  const [signal] = await db.insert(signals).values({
    id: randomUUID(),
    userId,
    ...data,
    createdAt: Date.now(),
    outcome: "pending",
  }).returning();
  return signal;
}

export async function getSignalHistory(userId: string, limit = 50) {
  return db.select().from(signals).where(eq(signals.userId, userId))
    .orderBy(desc(signals.createdAt)).limit(limit);
}

// ── Paper Trades ───────────────────────────────────────────
export async function openPaperTrade(userId: string, data: {
  signalId?: string; symbol: string; direction: string;
  entryPrice: number; lots: number;
}) {
  const [trade] = await db.insert(paperTrades).values({
    id: randomUUID(),
    userId,
    signalId: data.signalId,
    symbol: data.symbol,
    direction: data.direction,
    entryPrice: String(data.entryPrice),
    lots: String(data.lots),
    status: "open",
    openedAt: Date.now(),
  }).returning();
  return trade;
}

export async function closePaperTrade(userId: string, id: string, exitPrice: number) {
  const [trade] = await db.select().from(paperTrades)
    .where(and(eq(paperTrades.id, id), eq(paperTrades.userId, userId))).limit(1);
  if (!trade) throw new Error("Trade not found");

  const entry = parseFloat(String(trade.entryPrice));
  const lots = parseFloat(String(trade.lots));
  const diff = trade.direction === "buy" ? exitPrice - entry : entry - exitPrice;
  const pnl = diff * lots * 100;

  const [updated] = await db.update(paperTrades).set({
    exitPrice: String(exitPrice),
    pnl: String(pnl.toFixed(2)),
    status: "closed",
    closedAt: Date.now(),
  }).where(eq(paperTrades.id, id)).returning();
  return updated;
}

export async function getPaperTrades(userId: string) {
  return db.select().from(paperTrades).where(eq(paperTrades.userId, userId))
    .orderBy(desc(paperTrades.openedAt));
}

// ── Licences ───────────────────────────────────────────────
export async function getUserLicence(userId: string) {
  return db.select().from(licences)
    .where(and(eq(licences.userId, userId), eq(licences.status, "active")))
    .limit(1);
}

export async function upsertLicence(data: {
  userId: string; provider: string; orderId: string;
  variantId?: string; type: string; status: string; validUntil?: number;
}) {
  const existing = await db.select().from(licences)
    .where(and(eq(licences.userId, data.userId), eq(licences.orderId, data.orderId))).limit(1);

  if (existing.length > 0) {
    const [updated] = await db.update(licences).set({
      status: data.status,
      validUntil: data.validUntil,
      updatedAt: Date.now(),
    }).where(eq(licences.id, existing[0].id)).returning();
    return updated;
  }

  const [licence] = await db.insert(licences).values({
    id: randomUUID(),
    ...data,
    createdAt: Date.now(),
    updatedAt: Date.now(),
  }).returning();
  return licence;
}
