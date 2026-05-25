import { useState } from 'react'
import { useTradingStore } from '@/store/trading-store'

type Tab = 'signals' | 'paper'

export default function HistoryPage() {
  const [tab, setTab] = useState<Tab>('signals')
  const { paperTrades, closePaperTrade, tier } = useTradingStore()
  const isPro = tier === 'pro' || tier === 'pro_lifetime'

  const closedTrades = paperTrades.filter((t) => t.status === 'closed')
  const openTrades = paperTrades.filter((t) => t.status === 'open')
  const totalPnl = closedTrades.reduce((sum, t) => sum + (t.pnl ?? 0), 0)
  const wins = closedTrades.filter((t) => (t.pnl ?? 0) > 0).length
  const winRate = closedTrades.length > 0 ? Math.round((wins / closedTrades.length) * 100) : 0

  return (
    <div className="flex flex-col h-full overflow-hidden pb-14 md:pb-0">
      <div className="px-4 py-3 border-b border-border shrink-0">
        <h1 className="font-display text-xl font-bold text-white">History</h1>
      </div>

      {/* Segment */}
      <div className="flex bg-card2 mx-4 mt-3 mb-3 rounded-xl p-0.5 border border-border shrink-0">
        {(['signals', 'paper'] as Tab[]).map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={`flex-1 py-1.5 rounded-[10px] text-xs font-medium transition-all ${
              tab === t ? 'bg-card text-white' : 'text-muted'
            }`}
          >
            {t === 'signals' ? 'Signals' : 'Paper Trades'}
          </button>
        ))}
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-2 px-4 mb-3 shrink-0">
        {[
          { label: 'Total', value: paperTrades.length, color: 'text-accent' },
          { label: 'Win Rate', value: `${winRate}%`, color: 'text-bull' },
          { label: 'Paper P&L', value: `${totalPnl >= 0 ? '+' : ''}$${totalPnl.toFixed(2)}`, color: totalPnl >= 0 ? 'text-bull' : 'text-bear' },
        ].map(({ label, value, color }) => (
          <div key={label} className="bg-card border border-border rounded-xl p-3">
            <p className="text-[9px] text-muted uppercase tracking-wider mb-1">{label}</p>
            <p className={`text-sm font-semibold font-mono ${color}`}>{value}</p>
          </div>
        ))}
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto">
        {tab === 'paper' && !isPro ? (
          <div className="mx-4 mt-4 bg-card border border-border rounded-xl p-6 text-center">
            <p className="text-white text-sm font-semibold mb-1">Pro Feature</p>
            <p className="text-muted text-xs mb-4">Full paper trade history requires a Pro plan.</p>
            <a
              href="https://stackedfuture.lemonsqueezy.com"
              target="_blank"
              rel="noreferrer"
              className="inline-block bg-accent2 text-white text-sm font-semibold px-5 py-2 rounded-lg"
            >
              Upgrade to Pro
            </a>
          </div>
        ) : tab === 'paper' ? (
          <>
            {openTrades.length > 0 && (
              <>
                <p className="text-[10px] text-muted uppercase tracking-wider px-4 py-2">Open Positions</p>
                {openTrades.map((trade) => (
                  <div key={trade.id} className="flex items-center px-4 py-3 border-t border-[#111]">
                    <div className={`w-8 h-8 rounded-xl flex items-center justify-center mr-3 ${trade.direction === 'buy' ? 'bg-bull/10 text-bull' : 'bg-bear/10 text-bear'}`}>
                      {trade.direction === 'buy' ? '↑' : '↓'}
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-semibold text-white">{trade.symbol} <span className={`text-[10px] ${trade.direction === 'buy' ? 'text-bull' : 'text-bear'}`}>{trade.direction.toUpperCase()}</span></p>
                      <p className="text-[11px] text-muted">Entry: {trade.entryPrice.toFixed(4)} · {trade.lots} lots</p>
                    </div>
                    <button
                      onClick={() => closePaperTrade(trade.id, trade.entryPrice * 1.002)}
                      className="bg-accent/10 border border-accent/20 text-accent text-xs font-medium px-3 py-1.5 rounded-lg hover:bg-accent/20 transition-colors"
                    >
                      Close
                    </button>
                  </div>
                ))}
              </>
            )}
            {closedTrades.length > 0 && (
              <>
                <p className="text-[10px] text-muted uppercase tracking-wider px-4 py-2 mt-2">Closed</p>
                {closedTrades.map((trade) => (
                  <div key={trade.id} className="flex items-center px-4 py-3 border-t border-[#111]">
                    <div className={`w-8 h-8 rounded-xl flex items-center justify-center mr-3 ${trade.direction === 'buy' ? 'bg-bull/10 text-bull' : 'bg-bear/10 text-bear'}`}>
                      {trade.direction === 'buy' ? '↑' : '↓'}
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-semibold text-white">{trade.symbol}</p>
                      <p className="text-[11px] text-muted">{new Date(trade.openedAt).toLocaleDateString()}</p>
                    </div>
                    <p className={`text-sm font-semibold font-mono ${(trade.pnl ?? 0) >= 0 ? 'text-bull' : 'text-bear'}`}>
                      {(trade.pnl ?? 0) >= 0 ? '+' : ''}${(trade.pnl ?? 0).toFixed(2)}
                    </p>
                  </div>
                ))}
              </>
            )}
            {paperTrades.length === 0 && (
              <p className="text-muted text-sm text-center mt-12">No paper trades yet. Go to Chart to open one.</p>
            )}
          </>
        ) : (
          <p className="text-muted text-sm text-center mt-12">Signal history coming soon.</p>
        )}
      </div>
    </div>
  )
}
