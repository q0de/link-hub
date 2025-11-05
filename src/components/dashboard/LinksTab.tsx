import { useState, useEffect } from 'react'
import { DndContext, closestCenter, KeyboardSensor, PointerSensor, useSensor, useSensors, DragEndEvent } from '@dnd-kit/core'
import { arrayMove, SortableContext, sortableKeyboardCoordinates, verticalListSortingStrategy, useSortable } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import { supabase } from '../../lib/supabase'
import { Link as LinkType } from '../../types/database'
import { motion } from 'framer-motion'

interface LinksTabProps {
  profileId: string
}

function SortableLinkItem({ link, onEdit, onDelete }: { link: LinkType; onEdit: (link: LinkType) => void; onDelete: (id: string) => void }) {
  const { attributes, listeners, setNodeRef, transform, transition } = useSortable({ id: link.id })

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  }

  return (
    <div ref={setNodeRef} style={style} className="bg-dark-card border border-dark-border rounded-xl p-4 flex items-center justify-between">
      <div className="flex items-center gap-4 flex-1">
        <div {...attributes} {...listeners} className="cursor-grab active:cursor-grabbing text-gray-400 hover:text-white">
          ☰
        </div>
        {link.icon && <span className="text-2xl">{link.icon}</span>}
        <div className="flex-1">
          <h3 className="font-semibold">{link.title}</h3>
          <p className="text-sm text-gray-400 truncate">{link.url}</p>
        </div>
      </div>
      <div className="flex gap-2">
        <button
          onClick={() => onEdit(link)}
          className="px-3 py-1 bg-dark-bg border border-dark-border rounded-lg hover:bg-dark-border transition-colors"
        >
          Edit
        </button>
        <button
          onClick={() => onDelete(link.id)}
          className="px-3 py-1 bg-red-500/20 border border-red-500 text-red-400 rounded-lg hover:bg-red-500/30 transition-colors"
        >
          Delete
        </button>
      </div>
    </div>
  )
}

export default function LinksTab({ profileId }: LinksTabProps) {
  const [links, setLinks] = useState<LinkType[]>([])
  const [loading, setLoading] = useState(true)
  const [showModal, setShowModal] = useState(false)
  const [editingLink, setEditingLink] = useState<LinkType | null>(null)
  const [formData, setFormData] = useState({ title: '', url: '', icon: '' })

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  )

  useEffect(() => {
    loadLinks()
  }, [profileId])

  const loadLinks = async () => {
    try {
      const { data, error } = await supabase
        .from('links')
        .select('*')
        .eq('profile_id', profileId)
        .order('order_index', { ascending: true })

      if (error) throw error
      setLinks(data || [])
    } catch (err) {
      console.error('Error loading links:', err)
    } finally {
      setLoading(false)
    }
  }

  const handleAdd = () => {
    setEditingLink(null)
    setFormData({ title: '', url: '', icon: '' })
    setShowModal(true)
  }

  const handleEdit = (link: LinkType) => {
    setEditingLink(link)
    setFormData({ title: link.title, url: link.url, icon: link.icon || '' })
    setShowModal(true)
  }

  const handleSave = async () => {
    try {
      if (editingLink) {
        const { error } = await supabase
          .from('links')
          .update({ title: formData.title, url: formData.url, icon: formData.icon || null })
          .eq('id', editingLink.id)
        if (error) throw error
      } else {
        const maxOrder = links.length > 0 ? Math.max(...links.map(l => l.order_index)) : -1
        const { error } = await supabase
          .from('links')
          .insert({
            profile_id: profileId,
            title: formData.title,
            url: formData.url,
            icon: formData.icon || null,
            order_index: maxOrder + 1,
          })
        if (error) throw error
      }
      setShowModal(false)
      loadLinks()
    } catch (err) {
      console.error('Error saving link:', err)
      alert('Error saving link')
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this link?')) return
    try {
      const { error } = await supabase.from('links').delete().eq('id', id)
      if (error) throw error
      loadLinks()
    } catch (err) {
      console.error('Error deleting link:', err)
      alert('Error deleting link')
    }
  }

  const handleDragEnd = async (event: DragEndEvent) => {
    const { active, over } = event
    if (!over || active.id === over.id) return

    const oldIndex = links.findIndex((link) => link.id === active.id)
    const newIndex = links.findIndex((link) => link.id === over.id)

    const newLinks = arrayMove(links, oldIndex, newIndex)
    setLinks(newLinks)

    // Update order_index in database
    const updates = newLinks.map((link, index) => ({
      id: link.id,
      order_index: index,
    }))

    for (const update of updates) {
      await supabase
        .from('links')
        .update({ order_index: update.order_index })
        .eq('id', update.id)
    }
  }

  if (loading) {
    return <div className="text-center py-8">Loading...</div>
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">Your Links</h2>
        <button
          onClick={handleAdd}
          className="px-4 py-2 bg-accent hover:bg-accent/90 text-white rounded-lg font-medium transition-colors"
        >
          + Add Link
        </button>
      </div>

      <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
        <SortableContext items={links.map(l => l.id)} strategy={verticalListSortingStrategy}>
          <div className="space-y-3">
            {links.length === 0 ? (
              <div className="text-center py-12 text-gray-400">
                <p className="text-lg mb-2">No links yet</p>
                <p>Add your first link to get started!</p>
              </div>
            ) : (
              links.map((link) => (
                <SortableLinkItem
                  key={link.id}
                  link={link}
                  onEdit={handleEdit}
                  onDelete={handleDelete}
                />
              ))
            )}
          </div>
        </SortableContext>
      </DndContext>

      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-dark-card border border-dark-border rounded-2xl p-6 w-full max-w-md"
          >
            <h3 className="text-xl font-bold mb-4">{editingLink ? 'Edit Link' : 'Add Link'}</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">Title</label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className="w-full px-4 py-2 bg-dark-bg border border-dark-border rounded-lg focus:outline-none focus:ring-2 focus:ring-accent"
                  placeholder="My Website"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">URL</label>
                <input
                  type="url"
                  value={formData.url}
                  onChange={(e) => setFormData({ ...formData, url: e.target.value })}
                  className="w-full px-4 py-2 bg-dark-bg border border-dark-border rounded-lg focus:outline-none focus:ring-2 focus:ring-accent"
                  placeholder="https://example.com"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Icon (emoji)</label>
                <input
                  type="text"
                  value={formData.icon}
                  onChange={(e) => setFormData({ ...formData, icon: e.target.value })}
                  className="w-full px-4 py-2 bg-dark-bg border border-dark-border rounded-lg focus:outline-none focus:ring-2 focus:ring-accent"
                  placeholder="🔗"
                  maxLength={2}
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

