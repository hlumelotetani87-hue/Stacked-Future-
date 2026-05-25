import { create } from 'zustand'

export type Timeframe = '1m' | '5m' | '15m' | '1h' | '4h' | '1D'
export type Direction = 'buy' | 'sell' | 'watch'
export type Mode = 'real' | 'demo'
export type Tier = 'free' | 'pro' | 'pro_lifetime'

export type WatchlistItem = {
  id: string
  symbol: string
  name: string
  category: string
  signal?: Direction
  confidence?: number
}

export type SignalData = {
  direction: Direction
  confidence: number
  forecast: { hour: string; pct: number }[]
  generatedAt: number
}

export type PaperTrade = {
  id: string
  symbol: string
  direction: 'buy' | 'sell'
  entryPrice: number
  exitPrice?: number
  lots: number
  pnl?: number
  status: 'open' | 'closed'
  openedAt: number
  closedAt?: number
}

type TradingStore = {
  mode: Mode
  tier: Tier
  paperBalance: number
  setMode: (mode: Mode) => void
  setTier: (tier: Tier) => void
  activeSymbol: string
  activeTimeframe: Timeframe
  setActiveSymbol: (symbol: string) => void
  setActiveTimeframe: (tf: Timeframe) => void
  signal: SignalData | null
  isLoadingSignal: boolean
  setSignal: (signal: SignalData | null) => void
  setLoadingSignal: (v: boolean) => void
  watchlist: WatchlistItem[]
  isLoadingWatchlist: boolean
  addToWatchlist: (item: Omit<WatchlistItem, 'id'>) => void
  removeFromWatchlist: (id: string) => void
  paperTrades: PaperTrade[]
  openPaperTrade: (data: { symbol: string; direction: 'buy' | 'sell'; entryPrice: number; lots: number }) => void
  closePaperTrade: (id: string, exitPrice: number) => void
}

export const useTradingStore = create<TradingStore>((set) => ({
  mode: 'demo',
  tier: 'free',
  paperBalance: 10000,
  setMode: (mode) => set({ mode }),
  setTier: (tier) => set({ tier }),

  activeSymbol: 'XAU/USD',
  activeTimeframe: '1h',
  setActiveSymbol: (activeSymbol) => set({ activeSymbol }),
  setActiveTimeframe: (activeTimeframe) => set({ activeTimeframe }),

  signal: null,
  isLoadingSignal: false,
  setSignal: (signal) => set({ signal }),
  setLoadingSignal: (isLoadingSignal) => set({ isLoadingSignal }),

  watchlist: [
    { id: '1', symbol: 'XAU/USD', name: 'Gold', category: 'Forex', signal: 'buy', confidence: 78 },
    { id: '2', symbol: 'BTC/USD', name: 'Bitcoin', category: 'Crypto', signal: 'watch', confidence: 55 },
    { id: '3', symbol: 'EUR/USD', name: 'Euro / Dollar', category: 'Forex', signal: 'sell', confidence: 82 },
  ],
  isLoadingWatchlist: false,
  addToWatchlist: (item) =>
    set((s) => ({ watchlist: [{ ...item, id: Date.now().toString() }, ...s.watchlist] })),
  removeFromWatchlist: (id) =>
    set((s) => ({ watchlist: s.watchlist.filter((w) => w.id !== id) })),

  paperTrades: [],
  openPaperTrade: (data) =>
    set((s) => ({
      paperTrades: [
        { ...data, id: Date.now().toString(), status: 'open', openedAt: Date.now() },
        ...s.paperTrades,
      ],
    })),
  closePaperTrade: (id, exitPrice) =>
    set((s) => ({
      paperTrades: s.paperTrades.map((t) =>
        t.id === id
          ? {
              ...t,
              exitPrice,
              status: 'closed' as const,
              closedAt: Date.now(),
              pnl: (exitPrice - t.entryPrice) * t.lots * (t.direction === 'buy' ? 1 : -1) * 100,
            }
          : t
      ),
    })),
}))
