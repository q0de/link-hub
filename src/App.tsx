import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { useState, useEffect } from 'react'
import { supabase } from './lib/supabase'
import type { User } from '@supabase/supabase-js'
import Auth from './pages/Auth'
import Dashboard from './pages/Dashboard'
import PublicProfile from './pages/PublicProfile'
import Loading from './components/Loading'

function App() {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Check active session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null)
      setLoading(false)
    })

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null)
    })

    return () => subscription.unsubscribe()
  }, [])

  if (loading) {
    return <Loading />
  }

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/auth" element={user ? <Navigate to="/dashboard" /> : <Auth />} />
        <Route path="/dashboard/*" element={user ? <Dashboard /> : <Navigate to="/auth" />} />
        <Route path="/u/:username" element={<PublicProfile />} />
        <Route path="/" element={<Navigate to={user ? "/dashboard" : "/auth"} />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App

