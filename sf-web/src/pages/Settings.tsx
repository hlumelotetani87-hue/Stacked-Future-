import { useAuth, useUser } from '@clerk/clerk-react'
import { useTradingStore } from '@/store/trading-store'

const LEMON_URL = 'https://stackedfuture.lemonsqueezy.com'

type RowProps = {
  icon: string
  iconBg: string
  title: string
  sub?: string
  href?: string
  onClick?: () => void
  titleColor?: string
  right?: React.ReactNode
}

function Row({ icon, iconBg, title, sub, href, onClick, titleColor, right }: RowProps) {
  const Tag = href ? 'a' : 'div'
  return (
    <Tag
      href={href}
      target={href ? '_blank' : undefined}
      rel={href ? 'noreferrer' : undefined}
      onClick={onClick}
      className={`flex items-center px-4 py-3 border-t border-border first:border-t-0 transition-colors ${onClick || href ? 'cursor-pointer hover:bg-card2' : ''}`}
    >
      <div className={`w-7 h-7 rounded-lg flex items-center justify-center mr-3 shrink-0 ${iconBg}`}>
        <span className="text-sm">{icon}</span>
      </div>
      <div className="flex-1 min-w-0">
        <p className={`text-sm ${titleColor ?? 'text-white'}`}>{title}</p>
        {sub && <p className="text-[11px] text-muted mt-0.5">{sub}</p>}
      </div>
      {right !== undefined ? right : <span className="text-muted text-base">›</span>}
    </Tag>
  )
}

function Section({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="mb-5">
      <p className="text-[11px] text-muted uppercase tracking-wider px-4 mb-2">{label}</p>
      <div className="mx-4 bg-card rounded-2xl border border-border overflow-hidden">{children}</div>
    </div>
  )
}

export default function SettingsPage() {
  const { signOut } = useAuth()
  const { user } = useUser()
  const { tier } = useTradingStore()
  const isPro = tier === 'pro' || tier === 'pro_lifetime'

  const initials = (user?.fullName ?? user?.emailAddresses?.[0]?.emailAddress ?? '?')
    .split(' ').map((w: string) => w[0]).join('').slice(0, 2).toUpperCase()

  return (
    <div className="flex flex-col h-full overflow-hidden pb-14 md:pb-0">
      <div className="px-4 py-3 border-b border-border shrink-0">
        <h1 className="font-display text-xl font-bold text-white">Settings</h1>
      </div>

      <div className="flex-1 overflow-y-auto py-4">
        {/* Profile */}
        <div className="mx-4 mb-5 bg-card border border-border rounded-2xl p-4 flex items-center gap-3">
          <div className="w-12 h-12 rounded-full bg-accent2 flex items-center justify-center shrink-0">
            <span className="text-white text-base font-bold">{initials}</span>
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-semibold text-white truncate">{user?.fullName ?? '—'}</p>
            <p className="text-[12px] text-muted truncate">{user?.emailAddresses?.[0]?.emailAddress}</p>
            <span className="inline-block mt-1 text-[10px] text-accent bg-accent/10 border border-accent/20 rounded-full px-2 py-0.5 capitalize">{tier} plan</span>
          </div>
        </div>

        {/* Pro upgrade */}
        {!isPro && (
          <div className="mx-4 mb-5">
            <a
              href={LEMON_URL}
              target="_blank"
              rel="noreferrer"
              className="block bg-accent2/10 border border-accent2/30 rounded-2xl p-4 hover:bg-accent2/15 transition-colors"
            >
              <p className="text-white text-sm font-semibold mb-1">Upgrade to Pro ✦</p>
              <p className="text-muted text-xs leading-5">Unlock all timeframes, confidence scores, full forecast, unlimited watchlist and paper trade history.</p>
              <div className="bg-accent2 rounded-lg mt-3 py-2.5 text-center">
                <span className="text-white text-sm font-semibold">Get Pro — $4.99/month</span>
              </div>
            </a>
          </div>
        )}

        <Section label="Trading">
          <Row icon="📡" iconBg="bg-accent2/10" title="Connect broker" sub="MetaApi · MT4/MT5" />
          <Row icon="🕐" iconBg="bg-bull/10" title="Default timeframe" sub="1 hour" right={<span />} />
          <Row icon="💰" iconBg="bg-yellow-400/10" title="Paper balance" sub="$10,000.00" right={<span />} />
        </Section>

        <Section label="Notifications">
          <Row icon="🔔" iconBg="bg-accent/10" title="Signal alerts" sub="Push notifications" />
          <Row icon="%" iconBg="bg-bear/10" title="Min. confidence" sub="Alert above 60%" />
        </Section>

        <Section label="About">
          <Row icon="📄" iconBg="bg-muted/10" title="Open source licenses" sub="MIT · Kronos AI · ShiYu 2025" right={<span />} />
          <Row icon="🔒" iconBg="bg-muted/10" title="Privacy Policy" href="https://stackedfuture.com/privacy" />
          <Row icon="📋" iconBg="bg-muted/10" title="Terms of Service" href="https://stackedfuture.com/terms" />
          <Row icon="ℹ️" iconBg="bg-muted/10" title="Version" sub="1.0.0" right={<span />} />
        </Section>

        <Section label="Account">
          <Row
            icon="🚪"
            iconBg="bg-bear/10"
            title="Sign out"
            titleColor="text-bear"
            right={<span />}
            onClick={() => {
              if (confirm('Are you sure you want to sign out?')) signOut()
            }}
          />
        </Section>
      </div>
    </div>
  )
}
