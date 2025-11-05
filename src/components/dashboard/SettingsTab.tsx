import { useState, useEffect } from 'react'
import { supabase } from '../../lib/supabase'
import type { Profile, Theme } from '../../types/database'
import { themePresets, type ThemePreset } from '../../lib/themes'

interface SettingsTabProps {
  profile: Profile | null
  onUpdate: () => void
}

export default function SettingsTab({ profile, onUpdate }: SettingsTabProps) {
  const [formData, setFormData] = useState({
    username: '',
    bio: '',
    backgroundColor: '#0f0f0f',
    textColor: '#ffffff',
    accentColor: '#ff7e29',
    buttonStyle: 'rounded' as 'solid' | 'outline' | 'rounded',
  })
  const [avatarFile, setAvatarFile] = useState<File | null>(null)
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    if (profile) {
      setFormData({
        username: profile.username,
        bio: profile.bio || '',
        backgroundColor: profile.theme?.backgroundColor || '#0f0f0f',
        textColor: profile.theme?.textColor || '#ffffff',
        accentColor: profile.theme?.accentColor || '#ff7e29',
        buttonStyle: profile.theme?.buttonStyle || 'rounded',
      })
    }
  }, [profile])

  const handleSave = async () => {
    if (!profile) return
    setSaving(true)

    try {
      let avatarUrl = profile.avatar_url

      // Upload avatar if selected
      if (avatarFile) {
        const fileExt = avatarFile.name.split('.').pop()
        const fileName = `${profile.id}-${Math.random()}.${fileExt}`
        const { error: uploadError } = await supabase.storage
          .from('avatars')
          .upload(fileName, avatarFile)

        if (uploadError) {
          if (uploadError.message.includes('Bucket not found')) {
            throw new Error('Storage bucket "avatars" not found. Please create it in Supabase Storage settings.')
          }
          throw uploadError
        }

        const { data } = supabase.storage.from('avatars').getPublicUrl(fileName)
        avatarUrl = data.publicUrl
      }

      // Update profile
      const theme: Theme = {
        backgroundColor: formData.backgroundColor,
        textColor: formData.textColor,
        accentColor: formData.accentColor,
        buttonStyle: formData.buttonStyle,
      }

      const { error } = await supabase
        .from('profiles')
        .update({
          username: formData.username,
          bio: formData.bio || null,
          avatar_url: avatarUrl,
          theme,
        })
        .eq('id', profile.id)

      if (error) throw error
      onUpdate()
      alert('Settings saved!')
    } catch (err: any) {
      console.error('Error saving settings:', err)
      alert('Error saving settings: ' + err.message)
    } finally {
      setSaving(false)
    }
  }

  if (!profile) {
    return (
      <div className="max-w-2xl">
        <h2 className="text-2xl font-bold mb-6">Settings</h2>
        <div className="text-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-accent mx-auto mb-4"></div>
          <p className="text-gray-400">Loading profile settings...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-2xl">
      <h2 className="text-2xl font-bold mb-6">Settings</h2>

      <div className="space-y-6">
        {/* Profile Section */}
        <div className="bg-dark-card border border-dark-border rounded-xl p-6">
          <h3 className="text-lg font-semibold mb-4">Profile</h3>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2">Avatar</label>
              <div className="flex items-center gap-4">
                {profile.avatar_url && (
                  <img
                    src={profile.avatar_url}
                    alt="Avatar"
                    className="w-16 h-16 rounded-full object-cover"
                  />
                )}
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => setAvatarFile(e.target.files?.[0] || null)}
                  className="text-sm"
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Username</label>
              <input
                type="text"
                value={formData.username}
                onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                className="w-full px-4 py-2 bg-dark-bg border border-dark-border rounded-lg focus:outline-none focus:ring-2 focus:ring-accent"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Bio</label>
              <textarea
                value={formData.bio}
                onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                className="w-full px-4 py-2 bg-dark-bg border border-dark-border rounded-lg focus:outline-none focus:ring-2 focus:ring-accent"
                rows={3}
                placeholder="Tell us about yourself..."
              />
            </div>
          </div>
        </div>

        {/* Theme Section */}
        <div className="bg-dark-card border border-dark-border rounded-xl p-6">
          <h3 className="text-lg font-semibold mb-4">Theme</h3>
          
          {/* Live Preview */}
          <div className="mb-6 p-4 rounded-xl border border-dark-border" style={{ backgroundColor: formData.backgroundColor }}>
            <div className="text-center mb-4">
              <div
                className="w-16 h-16 rounded-full mx-auto mb-3 flex items-center justify-center text-2xl font-bold border-4"
                style={{ 
                  borderColor: formData.accentColor,
                  backgroundColor: formData.accentColor + '20'
                }}
              >
                {profile?.username?.charAt(0).toUpperCase() || 'U'}
              </div>
              <h4 className="font-bold text-lg mb-1" style={{ color: formData.textColor }}>
                {profile?.username || 'Your Name'}
              </h4>
              <p className="text-sm opacity-80" style={{ color: formData.textColor }}>
                {profile?.bio || 'Your bio will appear here'}
              </p>
            </div>
            <div className="space-y-2">
              <div
                className={`w-full px-4 py-2 font-semibold text-center transition-all ${
                  formData.buttonStyle === 'solid'
                    ? 'rounded-lg'
                    : formData.buttonStyle === 'outline'
                    ? 'border-2 rounded-lg'
                    : 'rounded-2xl'
                }`}
                style={{
                  backgroundColor: formData.buttonStyle === 'solid' || formData.buttonStyle === 'rounded' 
                    ? formData.accentColor 
                    : 'transparent',
                  borderColor: formData.buttonStyle === 'outline' ? formData.accentColor : 'transparent',
                  color: formData.buttonStyle === 'outline' ? formData.accentColor : '#ffffff',
                }}
              >
                🔗 Example Link
              </div>
              <div
                className={`w-full px-4 py-2 font-semibold text-center transition-all ${
                  formData.buttonStyle === 'solid'
                    ? 'rounded-lg'
                    : formData.buttonStyle === 'outline'
                    ? 'border-2 rounded-lg'
                    : 'rounded-2xl'
                }`}
                style={{
                  backgroundColor: formData.buttonStyle === 'solid' || formData.buttonStyle === 'rounded' 
                    ? formData.accentColor 
                    : 'transparent',
                  borderColor: formData.buttonStyle === 'outline' ? formData.accentColor : 'transparent',
                  color: formData.buttonStyle === 'outline' ? formData.accentColor : '#ffffff',
                }}
              >
                🌐 Another Link
              </div>
            </div>
          </div>

          {/* Theme Presets */}
          <div className="mb-6">
            <label className="block text-sm font-medium mb-3">Choose a Preset Theme</label>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {themePresets.map((preset) => {
                const isActive = 
                  formData.backgroundColor === preset.backgroundColor &&
                  formData.textColor === preset.textColor &&
                  formData.accentColor === preset.accentColor &&
                  formData.buttonStyle === preset.buttonStyle

                return (
                  <button
                    key={preset.name}
                    onClick={() => {
                      setFormData({
                        ...formData,
                        backgroundColor: preset.backgroundColor,
                        textColor: preset.textColor,
                        accentColor: preset.accentColor,
                        buttonStyle: preset.buttonStyle,
                      })
                    }}
                    className={`p-4 border-2 rounded-xl transition-all text-left ${
                      isActive
                        ? 'border-accent bg-accent/10'
                        : 'border-dark-border hover:border-accent/50'
                    }`}
                  >
                    <div className="text-2xl mb-2">{preset.preview}</div>
                    <div className="font-semibold text-sm mb-1">{preset.name}</div>
                    <div className="text-xs text-gray-400">{preset.description}</div>
                    <div className="flex gap-1 mt-2">
                      <div
                        className="w-4 h-4 rounded-full border border-dark-border"
                        style={{ backgroundColor: preset.backgroundColor }}
                      />
                      <div
                        className="w-4 h-4 rounded-full border border-dark-border"
                        style={{ backgroundColor: preset.accentColor }}
                      />
                    </div>
                  </button>
                )
              })}
            </div>
          </div>

          <div className="border-t border-dark-border pt-4 mt-4">
            <label className="block text-sm font-medium mb-4">Customize Colors</label>
            <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2">Background Color</label>
              <div className="flex gap-3">
                <input
                  type="color"
                  value={formData.backgroundColor}
                  onChange={(e) => setFormData({ ...formData, backgroundColor: e.target.value })}
                  className="w-16 h-10 rounded cursor-pointer"
                />
                <input
                  type="text"
                  value={formData.backgroundColor}
                  onChange={(e) => setFormData({ ...formData, backgroundColor: e.target.value })}
                  className="flex-1 px-4 py-2 bg-dark-bg border border-dark-border rounded-lg focus:outline-none focus:ring-2 focus:ring-accent"
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Text Color</label>
              <div className="flex gap-3">
                <input
                  type="color"
                  value={formData.textColor}
                  onChange={(e) => setFormData({ ...formData, textColor: e.target.value })}
                  className="w-16 h-10 rounded cursor-pointer"
                />
                <input
                  type="text"
                  value={formData.textColor}
                  onChange={(e) => setFormData({ ...formData, textColor: e.target.value })}
                  className="flex-1 px-4 py-2 bg-dark-bg border border-dark-border rounded-lg focus:outline-none focus:ring-2 focus:ring-accent"
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Accent Color</label>
              <div className="flex gap-3">
                <input
                  type="color"
                  value={formData.accentColor}
                  onChange={(e) => setFormData({ ...formData, accentColor: e.target.value })}
                  className="w-16 h-10 rounded cursor-pointer"
                />
                <input
                  type="text"
                  value={formData.accentColor}
                  onChange={(e) => setFormData({ ...formData, accentColor: e.target.value })}
                  className="flex-1 px-4 py-2 bg-dark-bg border border-dark-border rounded-lg focus:outline-none focus:ring-2 focus:ring-accent"
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Button Style</label>
              <div className="flex gap-3">
                {(['solid', 'outline', 'rounded'] as const).map((style) => (
                  <button
                    key={style}
                    onClick={() => setFormData({ ...formData, buttonStyle: style })}
                    className={`flex-1 px-4 py-2 border rounded-lg font-medium transition-colors capitalize ${
                      formData.buttonStyle === style
                        ? 'bg-accent border-accent text-white'
                        : 'bg-dark-bg border-dark-border hover:bg-dark-border'
                    }`}
                  >
                    {style}
                  </button>
                ))}
              </div>
            </div>
          </div>
          </div>
        </div>

        <button
          onClick={handleSave}
          disabled={saving}
          className="w-full px-4 py-3 bg-accent hover:bg-accent/90 text-white rounded-lg font-semibold transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {saving ? 'Saving...' : 'Save Settings'}
        </button>
      </div>
    </div>
  )
}

