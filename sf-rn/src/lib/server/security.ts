import { z } from "zod";

// ── Input schemas ──────────────────────────────────────────
export const symbolSchema = z
  .string()
  .min(1)
  .max(12)
  .regex(/^[A-Z0-9.\/]+$/, "Invalid symbol");

export const timeframeSchema = z.enum(["1m", "5m", "15m", "1h", "4h", "1D"]);

export const watchlistAddSchema = z.object({
  symbol: symbolSchema,
  name: z.string().min(1).max(80),
  category: z.enum(["forex", "crypto", "stocks", "etfs", "indices"]),
});

export const paperTradeSchema = z.object({
  signalId: z.string().optional(),
  symbol: symbolSchema,
  direction: z.enum(["buy", "sell"]),
  entryPrice: z.number().positive(),
  lots: z.number().min(0.01).max(100).default(0.01),
});

export const paperTradeCloseSchema = z.object({
  exitPrice: z.number().positive(),
});

// ── Auth header check ──────────────────────────────────────
export function validateApiKey(req: Request): boolean {
  const key = req.headers.get("x-api-key");
  return key === process.env.API_SECRET_KEY;
}

// ── Sentry config helper ───────────────────────────────────
export const sentryBeforeSend = (event: any) => {
  if (event.request?.headers) {
    delete event.request.headers["Authorization"];
    delete event.request.headers["x-api-key"];
    delete event.request.headers["cookie"];
  }
  return event;
};
