import { SignIn } from '@clerk/clerk-react'

export default function SignInPage() {
  return (
    <div className="min-h-screen bg-bg flex flex-col items-center justify-center px-4">
      <div className="mb-8 text-center">
        <div className="inline-flex items-center gap-2 mb-3">
          <div className="w-8 h-8 rounded-lg bg-accent2 flex items-center justify-center">
            <span className="text-white text-sm font-bold">SF</span>
          </div>
          <span className="font-display text-xl font-bold text-white tracking-tight">Stacked Future</span>
        </div>
        <p className="text-muted text-sm">AI-powered trading signals</p>
      </div>
      <SignIn
        appearance={{
          elements: {
            rootBox: 'w-full max-w-sm',
            card: 'bg-card border border-border rounded-2xl shadow-none',
            headerTitle: 'text-white font-display',
            headerSubtitle: 'text-muted',
            socialButtonsBlockButton: 'bg-card2 border border-border text-white hover:bg-border transition-colors',
            formFieldInput: 'bg-card2 border-border text-white placeholder-muted',
            formButtonPrimary: 'bg-accent2 hover:bg-accent2/80 text-white',
            footerActionLink: 'text-accent hover:text-accent/80',
          },
        }}
      />
    </div>
  )
}
