import { useState, useEffect } from 'react'
import { supabase } from '../../lib/supabase'
import type { Link as LinkType, Domain, ClickEvent } from '../../types/database'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts'

interface AnalyticsTabProps {
  profileId: string
}

interface LinkStats {
  id: string
  title: string
  clicks: number
}

interface DomainStats {
  id: string
  domain_name: string
  clicks: number
}

export default function AnalyticsTab({ profileId }: AnalyticsTabProps) {
  const [linkStats, setLinkStats] = useState<LinkStats[]>([])
  const [domainStats, setDomainStats] = useState<DomainStats[]>([])
  const [totalViews, setTotalViews] = useState(0)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadAnalytics()
  }, [profileId])

  const loadAnalytics = async () => {
    try {
      // Load links and domains
      const [linksRes, domainsRes] = await Promise.all([
        supabase.from('links').select('*').eq('profile_id', profileId),
        supabase.from('domains').select('*').eq('profile_id', profileId),
      ])

      const links = linksRes.data || []
      const domains = domainsRes.data || []

      // Load click events
      const linkIds = links.map((l) => l.id)
      const domainIds = domains.map((d) => d.id)

      const { data: clickEvents } = await supabase
        .from('click_events')
        .select('*')
        .or(`link_id.in.(${linkIds.join(',')}),domain_id.in.(${domainIds.join(',')})`)

      // Calculate stats
      const linkClicks = new Map<string, number>()
      const domainClicks = new Map<string, number>()

      clickEvents?.forEach((event) => {
        if (event.link_id) {
          linkClicks.set(event.link_id, (linkClicks.get(event.link_id) || 0) + 1)
        }
        if (event.domain_id) {
          domainClicks.set(event.domain_id, (domainClicks.get(event.domain_id) || 0) + 1)
        }
      })

      setLinkStats(
        links.map((link) => ({
          id: link.id,
          title: link.title,
          clicks: linkClicks.get(link.id) || 0,
        }))
      )

      setDomainStats(
        domains.map((domain) => ({
          id: domain.id,
          domain_name: domain.domain_name,
          clicks: domainClicks.get(domain.id) || 0,
        }))
      )

      setTotalViews(clickEvents?.length || 0)
    } catch (err) {
      console.error('Error loading analytics:', err)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return <div className="text-center py-8">Loading analytics...</div>
  }

  const COLORS = ['#ff7e29', '#4ade80', '#60a5fa', '#f472b6', '#a78bfa']

  return (
    <div>
      <h2 className="text-2xl font-bold mb-6">Analytics</h2>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        <div className="bg-dark-card border border-dark-border rounded-xl p-6">
          <div className="text-3xl font-bold text-accent mb-2">{totalViews}</div>
          <div className="text-gray-400">Total Clicks</div>
        </div>
        <div className="bg-dark-card border border-dark-border rounded-xl p-6">
          <div className="text-3xl font-bold text-accent mb-2">{linkStats.length}</div>
          <div className="text-gray-400">Total Links</div>
        </div>
        <div className="bg-dark-card border border-dark-border rounded-xl p-6">
          <div className="text-3xl font-bold text-accent mb-2">{domainStats.length}</div>
          <div className="text-gray-400">Total Domains</div>
        </div>
      </div>

      {/* Link Clicks Chart */}
      {linkStats.length > 0 && (
        <div className="bg-dark-card border border-dark-border rounded-xl p-6 mb-6">
          <h3 className="text-lg font-semibold mb-4">Link Clicks</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={linkStats}>
              <CartesianGrid strokeDasharray="3 3" stroke="#2a2a2a" />
              <XAxis dataKey="title" stroke="#888" />
              <YAxis stroke="#888" />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#1a1a1a',
                  border: '1px solid #2a2a2a',
                  borderRadius: '8px',
                }}
              />
              <Bar dataKey="clicks" fill="#ff7e29" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      )}

      {/* Domain Clicks Chart */}
      {domainStats.length > 0 && (
        <div className="bg-dark-card border border-dark-border rounded-xl p-6">
          <h3 className="text-lg font-semibold mb-4">Domain Clicks</h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={domainStats as any}
                dataKey="clicks"
                nameKey="domain_name"
                cx="50%"
                cy="50%"
                outerRadius={100}
                label
              >
                {domainStats.map((_, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip
                contentStyle={{
                  backgroundColor: '#1a1a1a',
                  border: '1px solid #2a2a2a',
                  borderRadius: '8px',
                }}
              />
            </PieChart>
          </ResponsiveContainer>
        </div>
      )}

      {linkStats.length === 0 && domainStats.length === 0 && (
        <div className="text-center py-12 text-gray-400">
          <p className="text-lg mb-2">No analytics data yet</p>
          <p>Start adding links and domains to see your analytics!</p>
        </div>
      )}
    </div>
  )
}

