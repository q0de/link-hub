import { useState, useEffect } from 'react'
import { supabase } from '../../lib/supabase'
import type { Domain } from '../../types/database'
import { motion } from 'framer-motion'

interface DomainsTabProps {
  profileId: string
}

export default function DomainsTab({ profileId }: DomainsTabProps) {
  const [domains, setDomains] = useState<Domain[]>([])
  const [loading, setLoading] = useState(true)
  const [showModal, setShowModal] = useState(false)
  const [editingDomain, setEditingDomain] = useState<Domain | null>(null)
  const [formData, setFormData] = useState({
    domain_name: '',
    price: '',
    description: '',
    buy_url: '',
  })

  useEffect(() => {
    loadDomains()
  }, [profileId])

  const loadDomains = async () => {
    try {
      const { data, error } = await supabase
        .from('domains')
        .select('*')
        .eq('profile_id', profileId)
        .order('created_at', { ascending: false })

      if (error) throw error
      setDomains(data || [])
    } catch (err) {
      console.error('Error loading domains:', err)
    } finally {
      setLoading(false)
    }
  }

  const handleAdd = () => {
    setEditingDomain(null)
    setFormData({ domain_name: '', price: '', description: '', buy_url: '' })
    setShowModal(true)
  }

  const handleEdit = (domain: Domain) => {
    setEditingDomain(domain)
    setFormData({
      domain_name: domain.domain_name,
      price: domain.price.toString(),
      description: domain.description || '',
      buy_url: domain.buy_url || '',
    })
    setShowModal(true)
  }

  const handleSave = async () => {
    try {
      if (editingDomain) {
        const { error } = await supabase
          .from('domains')
          .update({
            domain_name: formData.domain_name,
            price: parseFloat(formData.price),
            description: formData.description || null,
            buy_url: formData.buy_url || null,
          })
          .eq('id', editingDomain.id)
        if (error) throw error
      } else {
        const { error } = await supabase
          .from('domains')
          .insert({
            profile_id: profileId,
            domain_name: formData.domain_name,
            price: parseFloat(formData.price),
            description: formData.description || null,
            buy_url: formData.buy_url || null,
          })
        if (error) throw error
      }
      setShowModal(false)
      loadDomains()
    } catch (err) {
      console.error('Error saving domain:', err)
      alert('Error saving domain')
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this domain listing?')) return
    try {
      const { error } = await supabase.from('domains').delete().eq('id', id)
      if (error) throw error
      loadDomains()
    } catch (err) {
      console.error('Error deleting domain:', err)
      alert('Error deleting domain')
    }
  }

  if (loading) {
    return <div className="text-center py-8">Loading...</div>
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">Domains for Sale</h2>
        <button
          onClick={handleAdd}
          className="px-4 py-2 bg-accent hover:bg-accent/90 text-white rounded-lg font-medium transition-colors"
        >
          + Add Domain
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {domains.length === 0 ? (
          <div className="col-span-full text-center py-12 text-gray-400">
            <p className="text-lg mb-2">No domains listed yet</p>
            <p>Add domains you own or are selling!</p>
          </div>
        ) : (
          domains.map((domain) => (
            <motion.div
              key={domain.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-dark-card border border-dark-border rounded-xl p-6"
            >
              <h3 className="text-xl font-bold mb-2">{domain.domain_name}</h3>
              <p className="text-2xl font-bold text-accent mb-4">${domain.price.toLocaleString()}</p>
              {domain.description && (
                <p className="text-gray-400 text-sm mb-4">{domain.description}</p>
              )}
              <div className="flex gap-2 mt-4">
                <button
                  onClick={() => handleEdit(domain)}
                  className="flex-1 px-3 py-2 bg-dark-bg border border-dark-border rounded-lg hover:bg-dark-border transition-colors text-sm"
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(domain.id)}
                  className="px-3 py-2 bg-red-500/20 border border-red-500 text-red-400 rounded-lg hover:bg-red-500/30 transition-colors text-sm"
                >
                  Delete
                </button>
              </div>
            </motion.div>
          ))
        )}
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-dark-card border border-dark-border rounded-2xl p-6 w-full max-w-md"
          >
            <h3 className="text-xl font-bold mb-4">{editingDomain ? 'Edit Domain' : 'Add Domain'}</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">Domain Name</label>
                <input
                  type="text"
                  value={formData.domain_name}
                  onChange={(e) => setFormData({ ...formData, domain_name: e.target.value })}
                  className="w-full px-4 py-2 bg-dark-bg border border-dark-border rounded-lg focus:outline-none focus:ring-2 focus:ring-accent"
                  placeholder="example.io"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Price ($)</label>
                <input
                  type="number"
                  step="0.01"
                  value={formData.price}
                  onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                  className="w-full px-4 py-2 bg-dark-bg border border-dark-border rounded-lg focus:outline-none focus:ring-2 focus:ring-accent"
                  placeholder="1500.00"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Description (optional)</label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full px-4 py-2 bg-dark-bg border border-dark-border rounded-lg focus:outline-none focus:ring-2 focus:ring-accent"
                  rows={3}
                  placeholder="Brief description of the domain..."
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Buy URL (optional)</label>
                <input
                  type="url"
                  value={formData.buy_url}
                  onChange={(e) => setFormData({ ...formData, buy_url: e.target.value })}
                  className="w-full px-4 py-2 bg-dark-bg border border-dark-border rounded-lg focus:outline-none focus:ring-2 focus:ring-accent"
                  placeholder="https://..."
                />
              </div>
            </div>
            <div className="flex gap-3 mt-6">
              <button
                onClick={() => setShowModal(false)}
                className="flex-1 px-4 py-2 bg-dark-bg border border-dark-border rounded-lg hover:bg-dark-border transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleSave}
                className="flex-1 px-4 py-2 bg-accent hover:bg-accent/90 text-white rounded-lg font-medium transition-colors"
              >
                Save
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  )
}

