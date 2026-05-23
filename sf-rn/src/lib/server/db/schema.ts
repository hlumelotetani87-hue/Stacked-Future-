import { bigint, boolean, integer, numeric, pgTable, text, timestamp } from "drizzle-orm/pg-core";

// ── Users ─────────────────────────────────────────────────
export const users = pgTable("users", {
  id: text("id").primaryKey(),           // Clerk userId
  email: text("email").notNull(),
  name: text("name"),
  tier: text("tier").notNull().default("free"), // free | pro | pro_lifetime
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

// ── Watchlist ──────────────────────────────────────────────
export const watchlist = pgTable("watchlist", {
  id: text("id").primaryKey(),
  userId: text("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
  symbol: text("symbol").notNull(),       // e.g. XAUUSD
  name: text("name").notNull(),           // e.g. Gold vs US Dollar
  category: text("category").notNull(),   // forex | crypto | stocks | etfs | indices
  addedAt: bigint("added_at", { mode: "number" }).notNull(),
});

// ── Signals ────────────────────────────────────────────────
export const signals = pgTable("signals", {
  id: text("id").primaryKey(),
  userId: text("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
  symbol: text("symbol").notNull(),
  timeframe: text("timeframe").notNull(),  // 1m | 5m | 15m | 1h | 4h | 1D
  direction: text("direction").notNull(),  // buy | sell | watch
  confidence: integer("confidence").notNull(), // 0-100
  forecastJson: text("forecast_json").notNull(), // JSON array of {hour, pct} objects
  createdAt: bigint("created_at", { mode: "number" }).notNull(),
  outcome: text("outcome"),               // win | loss | pending
  closedAt: bigint("closed_at", { mode: "number" }),
  closePct: numeric("close_pct", { precision: 10, scale: 4 }),
});

// ── Paper Trades ───────────────────────────────────────────
export const paperTrades = pgTable("paper_trades", {
  id: text("id").primaryKey(),
  userId: text("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
  signalId: text("signal_id").references(() => signals.id),
  symbol: text("symbol").notNull(),
  direction: text("direction").notNull(), // buy | sell
  entryPrice: numeric("entry_price", { precision: 18, scale: 6 }).notNull(),
  exitPrice: numeric("exit_price", { precision: 18, scale: 6 }),
  lots: numeric("lots", { precision: 10, scale: 2 }).notNull().default("0.01"),
  pnl: numeric("pnl", { precision: 18, scale: 2 }),
  status: text("status").notNull().default("open"), // open | closed
  openedAt: bigint("opened_at", { mode: "number" }).notNull(),
  closedAt: bigint("closed_at", { mode: "number" }),
});

// ── Licences ───────────────────────────────────────────────
export const licences = pgTable("licences", {
  id: text("id").primaryKey(),
  userId: text("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
  provider: text("provider").notNull(),   // lemonsqueezy
  orderId: text("order_id").notNull(),
  variantId: text("variant_id"),
  type: text("type").notNull(),           // monthly | yearly | lifetime
  status: text("status").notNull(),       // active | cancelled | expired
  validUntil: bigint("valid_until", { mode: "number" }),
  createdAt: bigint("created_at", { mode: "number" }).notNull(),
  updatedAt: bigint("updated_at", { mode: "number" }).notNull(),
});

// ── Broker Connections ─────────────────────────────────────
export const brokerConnections = pgTable("broker_connections", {
  id: text("id").primaryKey(),
  userId: text("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
  broker: text("broker").notNull(),       // e.g. FBS, IC Markets, XM
  accountId: text("account_id").notNull(), // MetaApi account ID (stored encrypted)
  platform: text("platform").notNull(),   // mt4 | mt5
  connected: boolean("connected").notNull().default(false),
  connectedAt: bigint("connected_at", { mode: "number" }),
});
