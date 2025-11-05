import { useState } from 'react'
import { supabase } from '../lib/supabase'
import { motion } from 'framer-motion'

export default function Auth() {
  const [isLogin, setIsLogin] = useState(true)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [username, setUsername] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    try {
      if (isLogin) {
        const { error } = await supabase.auth.signInWithPassword({
          email,
          password,
        })
        if (error) throw error
      } else {
        const { error: signUpError } = await supabase.auth.signUp({
          email,
          password,
          options: {
            data: {
              username: username,
            },
          },
        })
        if (signUpError) throw signUpError

        // Profile is created automatically by database trigger
        // Wait a moment for trigger to complete, then update username
        await new Promise(resolve => setTimeout(resolve, 500))
        const { data: { user } } = await supabase.auth.getUser()
        if (user) {
          // Update profile with username (trigger creates it with default username)
          const { error: profileError } = await supabase
            .from('profiles')
            .update({ username: username })
            .eq('id', user.id)
          // Ignore error if profile doesn't exist yet or username already set
          if (profileError && !profileError.message.includes('duplicate')) {
            console.error('Profile update error:', profileError)
          }
        }
      }
    } catch (err: any) {
      console.error('Auth error:', err)
      // Show user-friendly error messages
      if (err.message?.includes('duplicate key') || err.message?.includes('username')) {
        setError('This username is already taken. Please choose another one.')
      } else if (err.message?.includes('email')) {
        setError('This email is already registered. Try logging in instead.')
      } else {
        setError(err.message || 'An error occurred. Please try again.')
      }
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-dark-bg flex items-center justify-center px-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md"
      >
        <div className="bg-dark-card rounded-2xl p-8 shadow-xl border border-dark-border">
          <h1 className="text-3xl font-bold text-center mb-2">Link Hub</h1>
          <p className="text-gray-400 text-center mb-8">Your link in bio platform</p>

          <div className="flex gap-4 mb-6">
            <button
              onClick={() => setIsLogin(true)}
              className={`flex-1 py-2 px-4 rounded-lg font-medium transition-colors ${
                isLogin
                  ? 'bg-accent text-white'
                  : 'bg-dark-bg text-gray-400 hover:text-white'
              }`}
            >
              Login
            </button>
            <button
              onClick={() => setIsLogin(false)}
              className={`flex-1 py-2 px-4 rounded-lg font-medium transition-colors ${
                !isLogin
                  ? 'bg-accent text-white'
                  : 'bg-dark-bg text-gray-400 hover:text-white'
              }`}
            >
              Sign Up
            </button>
          </div>

          <form onSubmit={handleAuth} className="space-y-4">
            {!isLogin && (
              <div>
                <label className="block text-sm font-medium mb-2">Username</label>
                <input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="w-full px-4 py-2 bg-dark-bg border border-dark-border rounded-lg focus:outline-none focus:ring-2 focus:ring-accent"
                  required
                  placeholder="johndoe"
                />
              </div>
            )}
            <div>
              <label className="block text-sm font-medium mb-2">Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-2 bg-dark-bg border border-dark-border rounded-lg focus:outline-none focus:ring-2 focus:ring-accent"
                required
                placeholder="you@example.com"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Password</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-2 bg-dark-bg border border-dark-border rounded-lg focus:outline-none focus:ring-2 focus:ring-accent"
                required
                placeholder="••••••••"
                minLength={6}
              />
            </div>

            {error && (
              <div className="bg-red-500/20 border border-red-500 text-red-400 px-4 py-3 rounded-lg text-sm">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-accent hover:bg-accent/90 text-white font-semibold py-3 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Loading...' : isLogin ? 'Login' : 'Sign Up'}
            </button>
          </form>
        </div>
      </motion.div>
    </div>
  )
}

