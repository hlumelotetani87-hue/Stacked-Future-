import { create } from "zustand";

export type Timeframe = "1m" | "5m" | "15m" | "1h" | "4h" | "1D";
export type Direction = "buy" | "sell" | "watch";
export type Mode = "real" | "demo";
export type Tier = "free" | "pro" | "pro_lifetime";

export type WatchlistItem = {
  id: string;
  symbol: string;
  name: string;
  category: string;
  signal?: Direction;
  confidence?: number;
};

export type SignalData = {
  direction: Direction;
  confidence: number;
  forecast: { hour: string; pct: number }[];
  generatedAt: number;
};

export type PaperTrade = {
  id: string;
  symbol: string;
  direction: "buy" | "sell";
  entryPrice: number;
  exitPrice?: number;
  lots: number;
  pnl?: number;
  status: "open" | "closed";
  openedAt: number;
  closedAt?: number;
};

type TradingStore = {
  // Account
  mode: Mode;
  tier: Tier;
  paperBalance: number;
  setMode: (mode: Mode) => void;
  setTier: (tier: Tier) => void;

  // Active chart
  activeSymbol: string;
  activeTimeframe: Timeframe;
  setActiveSymbol: (symbol: string) => void;
  setActiveTimeframe: (tf: Timeframe) => void;

  // Signal
  signal: SignalData | null;
  isLoadingSignal: boolean;
  setSignal: (signal: SignalData | null) => void;
  setLoadingSignal: (v: boolean) => void;

  // Watchlist
  watchlist: WatchlistItem[];
  isLoadingWatchlist: boolean;
  loadWatchlist: () => Promise<void>;
  addToWatchlist: (item: Omit<WatchlistItem, "id">) => Promise<void>;
  removeFromWatchlist: (id: string) => Promise<void>;

  // Paper trades
  paperTrades: PaperTrade[];
  isLoadingTrades: boolean;
  loadPaperTrades: () => Promise<void>;
  openPaperTrade: (data: { symbol: string; direction: "buy" | "sell"; entryPrice: number; lots: number; signalId?: string }) => Promise<void>;
  closePaperTrade: (id: string, exitPrice: number) => Promise<void>;

  // Licence
  checkLicence: () => Promise<void>;
};

export const useTradingStore = create<TradingStore>((set, get) => ({
  mode: "demo",
  tier: "free",
  paperBalance: 10000,
  setMode: (mode) => set({ mode }),
  setTier: (tier) => set({ tier }),

  activeSymbol: "XAUUSD",
  activeTimeframe: "1h",
  setActiveSymbol: (activeSymbol) => set({ activeSymbol }),
  setActiveTimeframe: (activeTimeframe) => set({ activeTimeframe }),

  signal: null,
  isLoadingSignal: false,
  setSignal: (signal) => set({ signal }),
  setLoadingSignal: (isLoadingSignal) => set({ isLoadingSignal }),

  watchlist: [],
  isLoadingWatchlist: false,
  loadWatchlist: async () => {
    set({ isLoadingWatchlist: true });
    try {
      const res = await fetch("/api/watchlist");
      if (res.ok) {
        const { items } = await res.json();
        set({ watchlist: items });
      }
    } catch (e) {
      console.error("loadWatchlist error:", e);
    } finally {
      set({ isLoadingWatchlist: false });
    }
  },
  addToWatchlist: async (item) => {
    try {
      const res = await fetch("/api/watchlist", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(item),
      });
      if (res.ok) {
        const { item: newItem } = await res.json();
        set((s) => ({ watchlist: [newItem, ...s.watchlist] }));
      }
    } catch (e) {
      console.error("addToWatchlist error:", e);
    }
  },
  removeFromWatchlist: async (id) => {
    try {
      await fetch(`/api/watchlist/${id}`, { method: "DELETE" });
      set((s) => ({ watchlist: s.watchlist.filter((w) => w.id !== id) }));
    } catch (e) {
      console.error("removeFromWatchlist error:", e);
    }
  },

  paperTrades: [],
  isLoadingTrades: false,
  loadPaperTrades: async () => {
    set({ isLoadingTrades: true });
    try {
      const res = await fetch("/api/paper-trades");
      if (res.ok) {
        const { trades } = await res.json();
        set({ paperTrades: trades });
      }
    } catch (e) {
      console.error("loadPaperTrades error:", e);
    } finally {
      set({ isLoadingTrades: false });
    }
  },
  openPaperTrade: async (data) => {
    try {
      const res = await fetch("/api/paper-trades", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (res.ok) {
        const { trade } = await res.json();
        set((s) => ({ paperTrades: [trade, ...s.paperTrades] }));
      }
    } catch (e) {
      console.error("openPaperTrade error:", e);
    }
  },
  closePaperTrade: async (id, exitPrice) => {
    try {
      const res = await fetch(`/api/paper-trades/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ exitPrice }),
      });
      if (res.ok) {
        const { trade } = await res.json();
        set((s) => ({
          paperTrades: s.paperTrades.map((t) => (t.id === id ? trade : t)),
        }));
      }
    } catch (e) {
      console.error("closePaperTrade error:", e);
    }
  },

  checkLicence: async () => {
    try {
      const res = await fetch("/api/licence");
      if (res.ok) {
        const { tier } = await res.json();
        set({ tier });
      }
    } catch (e) {
      console.error("checkLicence error:", e);
    }
  },
}));
