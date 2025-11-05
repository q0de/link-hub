import { useState, useEffect } from 'react'
import { Routes, Route, Link, useLocation, useNavigate, Navigate } from 'react-router-dom'
import { supabase } from '../lib/supabase'
import type { Profile } from '../types/database'
import LinksTab from '../components/dashboard/LinksTab'
import DomainsTab from '../components/dashboard/DomainsTab'
import SettingsTab from '../components/dashboard/SettingsTab'
import AnalyticsTab from '../components/dashboard/AnalyticsTab'

export default function Dashboard() {
  const location = useLocation()
  const navigate = useNavigate()
  const [profile, setProfile] = useState<Profile | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadProfile()
  }, [])

  const loadProfile = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) return

      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single()

      if (error) throw error
      setProfile(data)
    } catch (err) {
      console.error('Error loading profile:', err)
    } finally {
      setLoading(false)
    }
  }

  const handleLogout = async () => {
    await supabase.auth.signOut()
    navigate('/auth')
  }

  const tabs = [
    { path: 'links', label: 'Links', icon: '🔗' },
    { path: 'domains', label: 'Domains', icon: '🌐' },
    { path: 'analytics', label: 'Analytics', icon: '📊' },
    { path: 'settings', label: 'Settings', icon: '⚙️' },
  ]

  // Get current tab from pathname - handle /dashboard and /dashboard/links, etc.
  const pathParts = location.pathname.split('/').filter(Boolean)
  const currentTab = pathParts[pathParts.length - 1] || 'links'

  if (loading) {
    return (
      <div className="min-h-screen bg-dark-bg flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-accent"></div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-dark-bg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold mb-2">Dashboard</h1>
            {profile && (
              <a
                href={`/u/${profile.username}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-accent hover:underline"
              >
                View your profile → {window.location.origin}/u/{profile.username}
              </a>
            )}
          </div>
          <button
            onClick={handleLogout}
            className="px-4 py-2 bg-dark-card border border-dark-border rounded-lg hover:bg-dark-border transition-colors"
          >
            Logout
          </button>
        </div>

        {/* Tabs */}
        <div className="flex gap-2 mb-8 border-b border-dark-border">
          {tabs.map((tab) => (
            <Link
              key={tab.path}
              to={`/dashboard/${tab.path}`}
              className={`px-6 py-3 font-medium transition-colors border-b-2 ${
                currentTab === tab.path
                  ? 'border-accent text-accent'
                  : 'border-transparent text-gray-400 hover:text-white'
              }`}
            >
              <span className="mr-2">{tab.icon}</span>
              {tab.label}
            </Link>
          ))}
        </div>

        {/* Tab Content */}
        <Routes>
          <Route path="" element={<Navigate to="links" replace />} />
          <Route path="links" element={profile ? <LinksTab profileId={profile.id} /> : <div className="text-center py-12"><p className="text-gray-400">Loading...</p></div>} />
          <Route path="domains" element={profile ? <DomainsTab profileId={profile.id} /> : <div className="text-center py-12"><p className="text-gray-400">Loading...</p></div>} />
          <Route path="analytics" element={profile ? <AnalyticsTab profileId={profile.id} /> : <div className="text-center py-12"><p className="text-gray-400">Loading...</p></div>} />
          <Route path="settings" element={<SettingsTab profile={profile} onUpdate={loadProfile} />} />
          <Route path="*" element={<Navigate to="links" replace />} />
        </Routes>
      </div>
    </div>
  )
}

