import { useEffect, useState } from 'react'
import TradingViewChart from '@/components/chart/TradingViewChart'
import { useTradingStore, type Timeframe } from '@/store/trading-store'
import { useTwelveData } from '@/hooks/useTwelveData'

const TIMEFRAMES: Timeframe[] = ['1m', '5m', '15m', '1h', '4h', '1D']
const FREE_TFS: Timeframe[] = ['1h']

export default function ChartPage() {
  const { activeSymbol, activeTimeframe, setActiveTimeframe, signal, mode, setMode, tier } = useTradingStore()
  const { candles, price, change, isLoading, fetchCandles } = useTwelveData()
  const isPro = tier === 'pro' || tier === 'pro_lifetime'
  const isPositive = (change ?? 0) >= 0
  const [showDemo, setShowDemo] = useState(false)

  useEffect(() => {
    fetchCandles(activeSymbol, activeTimeframe)
  }, [activeSymbol, activeTimeframe])

  return (
    <div className="flex flex-col h-full overflow-hidden pb-14 md:pb-0">
      {/* Top bar */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-border shrink-0">
        <div className="flex items-center gap-3">
          <span className="font-display text-lg font-bold text-white">{activeSymbol}</span>
          <span className="text-[10px] font-semibold text-bull bg-bull/10 border border-bull/20 rounded-full px-2 py-0.5">LIVE</span>
        </div>
        {/* Real / Demo toggle */}
        <div className="flex items-center bg-card2 rounded-xl p-0.5 border border-border">
          {(['real', 'demo'] as const).map((m) => (
            <button
              key={m}
              onClick={() => setMode(m)}
              className={`px-3 py-1 rounded-[10px] text-xs font-semibold transition-all ${
                mode === m
                  ? m === 'real'
                    ? 'bg-accent2 text-white'
                    : 'bg-demo/20 text-demo'
                  : 'text-muted'
              }`}
            >
              {m === 'real' ? 'Real' : 'Demo'}
            </button>
          ))}
        </div>
      </div>

      {/* Demo banner */}
      {mode === 'demo' && (
        <div className="mx-4 mt-2 bg-demo/10 border border-demo/20 rounded-lg px-3 py-1.5 text-center shrink-0">
          <span className="text-demo text-xs">Paper trading — no real funds at risk</span>
        </div>
      )}

      <div className="flex-1 overflow-y-auto px-4 py-3 space-y-4">
        {/* Price */}
        <div className="flex items-baseline gap-3">
          <span className="font-mono text-3xl font-semibold text-white">
            {price ? price.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 4 }) : '—'}
          </span>
          {change !== null && (
            <span className={`text-sm font-medium ${isPositive ? 'text-bull' : 'text-bear'}`}>
              {isPositive ? '+' : ''}{change.toFixed(2)}%
            </span>
          )}
        </div>

        {/* Timeframe pills */}
        <div className="flex gap-1.5 flex-wrap">
          {TIMEFRAMES.map((tf) => {
            const locked = !isPro && !FREE_TFS.includes(tf)
            return (
              <button
                key={tf}
                onClick={() => !locked && setActiveTimeframe(tf)}
                className={`px-3 py-1 rounded-xl border text-xs font-medium transition-all relative ${
                  activeTimeframe === tf
                    ? 'bg-card2 border-border2 text-accent'
                    : locked
                    ? 'border-border text-muted/40 cursor-not-allowed'
                    : 'border-border text-muted hover:text-white hover:border-border2'
                }`}
              >
                {tf}
                {locked && <span className="ml-1 text-[8px]">🔒</span>}
              </button>
            )
          })}
        </div>

        {/* Chart */}
        <div className="rounded-2xl border border-border overflow-hidden bg-card" style={{ height: 280 }}>
          {isLoading ? (
            <div className="flex h-full items-center justify-center">
              <div className="h-6 w-6 animate-spin rounded-full border-2 border-accent border-t-transparent" />
            </div>
          ) : (
            <TradingViewChart candles={candles} />
          )}
        </div>

        {/* Signal cards */}
        <div className="grid grid-cols-3 gap-2">
          <div className="bg-card border border-border rounded-xl p-3">
            <p className="text-[9px] text-muted uppercase tracking-wider mb-1.5">Signal</p>
            <p className={`text-sm font-semibold ${
              signal?.direction === 'buy' ? 'text-bull' :
              signal?.direction === 'sell' ? 'text-bear' : 'text-accent'
            }`}>
              {signal
                ? signal.direction === 'buy' ? '↑ BUY'
                : signal.direction === 'sell' ? '↓ SELL'
                : '◈ WATCH'
                : '—'}
            </p>
          </div>
          <div className="bg-card border border-border rounded-xl p-3">
            <p className="text-[9px] text-muted uppercase tracking-wider mb-1.5">Confidence</p>
            {isPro
              ? <p className="text-sm font-semibold text-accent">{signal ? `${signal.confidence}%` : '—'}</p>
              : <p className="text-xs text-muted">Pro only 🔒</p>
            }
          </div>
          <div className="bg-card border border-border rounded-xl p-3">
            <p className="text-[9px] text-muted uppercase tracking-wider mb-1.5">Paper P&L</p>
            <p className="text-sm font-semibold text-white">+$0.00</p>
            <p className="text-[8px] text-muted mt-0.5">simulated</p>
          </div>
        </div>

        {/* Forecast */}
        <div>
          <p className="text-[10px] text-muted uppercase tracking-wider mb-2">Kronos Forecast</p>
          {isPro ? (
            <div className="bg-card border border-border rounded-xl overflow-hidden">
              {(signal?.forecast ?? [
                { hour: '+1h', pct: 0.23 },
                { hour: '+2h', pct: 0.41 },
                { hour: '+3h', pct: -0.12 },
                { hour: '+4h', pct: 0.18 },
                { hour: '+5h', pct: 0.35 },
              ]).map((fc, i) => (
                <div key={i} className="flex items-center px-4 py-2.5 border-t border-border first:border-t-0">
                  <span className="text-[11px] text-muted w-8 font-mono">{fc.hour}</span>
                  <div className="flex-1 bg-card2 rounded h-1.5 mx-3 overflow-hidden">
                    <div
                      className={`h-full rounded transition-all ${fc.pct >= 0 ? 'bg-bull' : 'bg-bear'}`}
                      style={{ width: `${Math.min(Math.abs(fc.pct) * 200, 100)}%` }}
                    />
                  </div>
                  <span className={`text-[11px] font-mono font-medium w-14 text-right ${fc.pct >= 0 ? 'text-bull' : 'text-bear'}`}>
                    {fc.pct >= 0 ? '+' : ''}{fc.pct.toFixed(2)}%
                  </span>
                </div>
              ))}
            </div>
          ) : (
            <div className="bg-card border border-border rounded-xl p-6 text-center">
              <p className="text-white text-sm font-semibold mb-1">Unlock Forecast</p>
              <p className="text-muted text-xs mb-4">Full Kronos AI forecast breakdown is a Pro feature.</p>
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
    </div>
  )
}
