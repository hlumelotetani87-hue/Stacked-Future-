import { Routes, Route, Navigate } from 'react-router-dom'
import { useAuth } from '@clerk/clerk-react'
import SignInPage from '@/pages/SignIn'
import DashboardLayout from '@/pages/DashboardLayout'

export default function App() {
  const { isSignedIn, isLoaded } = useAuth()

  if (!isLoaded) {
    return (
      <div className="flex h-screen items-center justify-center bg-bg">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-accent border-t-transparent" />
      </div>
    )
  }

  return (
    <Routes>
      <Route path="/sign-in" element={isSignedIn ? <Navigate to="/" replace /> : <SignInPage />} />
      <Route path="/*" element={isSignedIn ? <DashboardLayout /> : <Navigate to="/sign-in" replace />} />
    </Routes>
  )
}
