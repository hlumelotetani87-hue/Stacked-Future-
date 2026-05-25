import { Routes, Route, NavLink, Navigate } from 'react-router-dom'
import { useAuth } from '@clerk/clerk-react'
import ChartPage from './Chart'
import WatchlistPage from './Watchlist'
import HistoryPage from './History'
import SettingsPage from './Settings'

const NAV = [
  { to: '/', label: 'Chart', icon: '📊', end: true },
  { to: '/watchlist', label: 'Watchlist', icon: '⭐', end: false },
  { to: '/history', label: 'History', icon: '🕐', end: false },
  { to: '/settings', label: 'Settings', icon: '⚙️', end: false },
]

export default function DashboardLayout() {
  return (
    <div className="flex h-screen overflow-hidden bg-bg">
      {/* Sidebar — desktop */}
      <aside className="hidden md:flex flex-col w-56 border-r border-border bg-card shrink-0">
        <div className="flex items-center gap-2.5 px-5 py-5 border-b border-border">
          <div className="w-7 h-7 rounded-lg bg-accent2 flex items-center justify-center shrink-0">
            <span className="text-white text-xs font-bold">SF</span>
          </div>
          <span className="font-display text-base font-bold text-white tracking-tight">Stacked Future</span>
        </div>
        <nav className="flex-1 py-4 px-2 flex flex-col gap-1">
          {NAV.map(({ to, label, icon, end }) => (
            <NavLink
              key={to}
              to={to}
              end={end}
              className={({ isActive }) =>
                `flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-colors ${
                  isActive
                    ? 'bg-accent/10 text-accent border border-accent/20'
                    : 'text-muted hover:text-white hover:bg-card2'
                }`
              }
            >
              <span className="text-base">{icon}</span>
              {label}
            </NavLink>
          ))}
        </nav>
        <div className="px-2 pb-4">
          <NavLink
            to="/settings"
            className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-muted hover:text-white hover:bg-card2 transition-colors"
          />
        </div>
      </aside>

      {/* Main content */}
      <main className="flex-1 flex flex-col overflow-hidden">
        <Routes>
          <Route path="/" element={<ChartPage />} />
          <Route path="/watchlist" element={<WatchlistPage />} />
          <Route path="/history" element={<HistoryPage />} />
          <Route path="/settings" element={<SettingsPage />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>

      {/* Bottom nav — mobile */}
      <nav className="md:hidden fixed bottom-0 inset-x-0 bg-card border-t border-border flex z-50">
        {NAV.map(({ to, label, icon, end }) => (
          <NavLink
            key={to}
            to={to}
            end={end}
            className={({ isActive }) =>
              `flex-1 flex flex-col items-center py-3 gap-0.5 text-xs font-medium transition-colors ${
                isActive ? 'text-accent' : 'text-muted'
              }`
            }
          >
            <span className="text-lg">{icon}</span>
            <span>{label}</span>
          </NavLink>
        ))}
      </nav>
    </div>
  )
}
