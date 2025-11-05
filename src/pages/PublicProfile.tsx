import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { supabase } from '../lib/supabase'
import type { Profile, Link as LinkType, Domain, Theme } from '../types/database'
import { motion } from 'framer-motion'
import ProfileHeader from '../components/public/ProfileHeader'
import LinkButton from '../components/public/LinkButton'
import DomainCard from '../components/public/DomainCard'

export default function PublicProfile() {
  const { username } = useParams<{ username: string }>()
  const navigate = useNavigate()
  const [profile, setProfile] = useState<Profile | null>(null)
  const [links, setLinks] = useState<LinkType[]>([])
  const [domains, setDomains] = useState<Domain[]>([])
  const [loading, setLoading] = useState(true)
  const [isOwnProfile, setIsOwnProfile] = useState(false)
  const [theme, setTheme] = useState<Theme>({
    backgroundColor: '#0f0f0f',
    textColor: '#ffffff',
    accentColor: '#ff7e29',
    buttonStyle: 'rounded',
  })

  useEffect(() => {
    if (username) {
      loadProfile()
    }
  }, [username])

  useEffect(() => {
    if (profile) {
      checkIfOwnProfile()
    }
  }, [profile])

  const checkIfOwnProfile = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser()
      if (user && profile) {
        setIsOwnProfile(user.id === profile.id)
      }
    } catch (err) {
      console.error('Error checking profile ownership:', err)
    }
  }

  const loadProfile = async () => {
    try {
      // Load profile
      const { data: profileData, error: profileError } = await supabase
        .from('profiles')
        .select('*')
        .eq('username', username)
        .single()

      if (profileError) throw profileError
      if (!profileData) {
        setLoading(false)
        return
      }

      setProfile(profileData)
      setTheme(profileData.theme || theme)

      // Load links and domains
      const [linksRes, domainsRes] = await Promise.all([
        supabase
          .from('links')
          .select('*')
          .eq('profile_id', profileData.id)
          .order('order_index', { ascending: true }),
        supabase
          .from('domains')
          .select('*')
          .eq('profile_id', profileData.id)
          .order('created_at', { ascending: false }),
      ])

      if (linksRes.data) setLinks(linksRes.data)
      if (domainsRes.data) setDomains(domainsRes.data)
    } catch (err) {
      console.error('Error loading profile:', err)
    } finally {
      setLoading(false)
    }
  }

  const trackClick = async (linkId: string | null, domainId: string | null) => {
    try {
      await supabase.from('click_events').insert({
        link_id: linkId,
        domain_id: domainId,
        referrer: document.referrer || null,
      })
    } catch (err) {
      console.error('Error tracking click:', err)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: theme.backgroundColor }}>
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2" style={{ borderColor: theme.accentColor }}></div>
      </div>
    )
  }

  if (!profile) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: theme.backgroundColor }}>
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-2">Profile Not Found</h1>
          <p style={{ color: theme.textColor, opacity: 0.7 }}>This profile doesn't exist.</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen" style={{ backgroundColor: theme.backgroundColor, color: theme.textColor }}>
      <div className="max-w-2xl mx-auto px-4 py-12">
        {/* Back to Dashboard Button (only if viewing own profile) */}
        {isOwnProfile && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-6"
          >
            <button
              onClick={() => navigate('/dashboard')}
              className="flex items-center gap-2 px-4 py-2 rounded-lg border transition-all hover:opacity-80"
              style={{
                borderColor: theme.accentColor,
                color: theme.textColor,
                backgroundColor: theme.backgroundColor,
              }}
            >
              <span>←</span>
              <span>Back to Dashboard</span>
            </button>
          </motion.div>
        )}

        {/* Profile Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <ProfileHeader profile={profile} theme={theme} />
        </motion.div>

        {/* Links Section */}
        {links.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="mb-12"
          >
            <div className="space-y-3">
              {links.map((link, index) => (
                <motion.div
                  key={link.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 + index * 0.05 }}
                >
                  <LinkButton
                    link={link}
                    theme={theme}
                    onClick={() => trackClick(link.id, null)}
                  />
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}

        {/* Domains Section */}
        {domains.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <h2 className="text-2xl font-bold mb-6 text-center">Domains for Sale</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {domains.map((domain, index) => (
                <motion.div
                  key={domain.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 + index * 0.05 }}
                >
                  <DomainCard
                    domain={domain}
                    theme={theme}
                    onClick={() => trackClick(null, domain.id)}
                  />
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}
      </div>
    </div>
  )
}

