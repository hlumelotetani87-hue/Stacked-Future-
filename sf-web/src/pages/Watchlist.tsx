import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useTradingStore } from '@/store/trading-store'

const CATEGORIES = ['All', 'Forex', 'Crypto', 'Stocks', 'ETFs', 'Indices']
const FREE_LIMIT = 3

const POPULAR = [
  { symbol: 'XAU/USD', name: 'Gold', category: 'Forex' },
  { symbol: 'BTC/USD', name: 'Bitcoin', category: 'Crypto' },
  { symbol: 'EUR/USD', name: 'Euro / Dollar', category: 'Forex' },
  { symbol: 'GBP/USD', name: 'Pound / Dollar', category: 'Forex' },
  { symbol: 'ETH/USD', name: 'Ethereum', category: 'Crypto' },
  { symbol: 'US500', name: 'S&P 500', category: 'Indices' },
  { symbol: 'NAS100', name: 'Nasdaq 100', category: 'Indices' },
  { symbol: 'AAPL', name: 'Apple Inc.', category: 'Stocks' },
]

function directionColor(d?: string) {
  if (d === 'buy') return { bg: 'bg-bull/10', text: 'text-bull', border: 'border-bull/20', label: '↑ BUY' }
  if (d === 'sell') return { bg: 'bg-bear/10', text: 'text-bear', border: 'border-bear/20', label: '↓ SELL' }
  return { bg: 'bg-accent/10', text: 'text-accent', border: 'border-accent/20', label: '◈ WATCH' }
}

export default function WatchlistPage() {
  const { watchlist, setActiveSymbol, removeFromWatchlist, addToWatchlist, tier } = useTradingStore()
  const isPro = tier === 'pro' || tier === 'pro_lifetime'
  const navigate = useNavigate()
  const [search, setSearch] = useState('')
  const [category, setCategory] = useState('All')
  const [showAdd, setShowAdd] = useState(false)

  const filtered = watchlist.filter((item) => {
    const q = search.toLowerCase()
    return (
      (item.symbol.toLowerCase().includes(q) || item.name.toLowerCase().includes(q)) &&
      (category === 'All' || item.category === category)
    )
  })
  const displayList = isPro ? filtered : filtered.slice(0, FREE_LIMIT)

  return (
    <div className="flex flex-col h-full overflow-hidden pb-14 md:pb-0">
      <div className="flex items-center justify-between px-4 py-3 border-b border-border shrink-0">
        <h1 className="font-display text-xl font-bold text-white">Watchlist</h1>
        <button
          onClick={() => setShowAdd(!showAdd)}
          className="text-accent text-sm font-medium hover:text-white transition-colors"
        >
          + Add
        </button>
      </div>

      {/* Add panel */}
      {showAdd && (
        <div className="border-b border-border bg-card2 px-4 py-3 shrink-0">
          <p className="text-xs text-muted mb-2">Popular symbols</p>
          <div className="flex flex-wrap gap-2">
            {POPULAR.filter(p => !watchlist.find(w => w.symbol === p.symbol)).map(s => (
              <button
                key={s.symbol}
                onClick={() => {
                  if (!isPro && watchlist.length >= FREE_LIMIT) return
                  addToWatchlist({ ...s, signal: undefined, confidence: undefined })
                  setShowAdd(false)
                }}
                disabled={!isPro && watchlist.length >= FREE_LIMIT}
                className="px-3 py-1 bg-card border border-border rounded-lg text-xs text-white hover:border-accent/40 transition-colors disabled:opacity-40"
              >
                {s.symbol}
              </button>
            ))}
          </div>
          {!isPro && watchlist.length >= FREE_LIMIT && (
            <p className="text-xs text-bear mt-2">Free plan limit reached. Upgrade to Pro for unlimited symbols.</p>
          )}
        </div>
      )}

      {/* Search */}
      <div className="px-4 pt-3 pb-2 shrink-0">
        <input
          type="text"
          placeholder="Search symbols…"
          value={search}
          onChange={(e) => setSearch(e.target.value.toUpperCase())}
          className="w-full bg-card2 border border-border rounded-xl px-3 py-2 text-sm text-white placeholder-muted outline-none focus:border-border2 transition-colors"
        />
      </div>

      {/* Category pills */}
      <div className="flex gap-1.5 px-4 pb-3 overflow-x-auto shrink-0 scrollbar-none">
        {CATEGORIES.map((c) => (
          <button
            key={c}
            onClick={() => setCategory(c)}
            className={`px-3 py-1 rounded-xl border text-xs font-medium whitespace-nowrap transition-all ${
              category === c ? 'bg-card2 border-border2 text-accent' : 'border-border text-muted hover:text-white'
            }`}
          >
            {c}
          </button>
        ))}
      </div>

      {/* List */}
      <div className="flex-1 overflow-y-auto">
        {displayList.length === 0 && (
          <p className="text-muted text-sm text-center mt-12">No symbols. Tap + Add to get started.</p>
        )}
        {displayList.map((item) => {
          const d = directionColor(item.signal)
          return (
            <div
              key={item.id}
              onClick={() => { setActiveSymbol(item.symbol); navigate('/') }}
              className="flex items-center px-4 py-3 border-t border-[#111] hover:bg-card/40 cursor-pointer transition-colors"
            >
              <div className="w-9 h-9 rounded-full bg-card2 border border-border2 flex items-center justify-center mr-3 shrink-0">
                <span className="text-[10px] font-bold text-accent">{item.symbol.slice(0, 3)}</span>
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-white">{item.symbol}</p>
                <p className="text-[11px] text-muted truncate">{item.name}</p>
              </div>
              <div className="flex items-center gap-2 ml-2">
                <span className={`text-[9px] font-semibold px-1.5 py-0.5 rounded border ${d.bg} ${d.border} ${d.text}`}>
                  {d.label}
                </span>
                <button
                  onClick={(e) => { e.stopPropagation(); removeFromWatchlist(item.id) }}
                  className="text-muted hover:text-bear transition-colors text-base leading-none"
                >
                  ×
                </button>
              </div>
            </div>
          )
        })}

        {!isPro && watchlist.length > FREE_LIMIT && (
          <div className="mx-4 mt-3 bg-card rounded-xl p-4 border border-border text-center">
            <p className="text-white text-sm font-semibold mb-1">Free plan limit</p>
            <p className="text-muted text-xs mb-3">Upgrade to Pro for unlimited watchlist symbols.</p>
            <a
              href="https://stackedfuture.lemonsqueezy.com"
              target="_blank"
              rel="noreferrer"
              className="inline-block bg-accent2 text-white text-sm font-semibold px-5 py-2 rounded-lg hover:bg-accent2/80 transition-colors"
            >
              Upgrade to Pro
            </a>
          </div>
        )}
      </div>
    </div>
  )
}
