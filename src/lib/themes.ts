export interface ThemePreset {
  name: string
  description: string
  backgroundColor: string
  textColor: string
  accentColor: string
  buttonStyle: 'solid' | 'outline' | 'rounded'
  preview: string // emoji or icon
}

export const themePresets: ThemePreset[] = [
  {
    name: 'Dark',
    description: 'Classic dark theme',
    backgroundColor: '#0f0f0f',
    textColor: '#ffffff',
    accentColor: '#ff7e29',
    buttonStyle: 'rounded',
    preview: '🌙',
  },
  {
    name: 'Ocean',
    description: 'Cool blue tones',
    backgroundColor: '#0a1929',
    textColor: '#e3f2fd',
    accentColor: '#4fc3f7',
    buttonStyle: 'rounded',
    preview: '🌊',
  },
  {
    name: 'Sunset',
    description: 'Warm orange and pink',
    backgroundColor: '#1a0f1a',
    textColor: '#fff5e6',
    accentColor: '#ff6b6b',
    buttonStyle: 'rounded',
    preview: '🌅',
  },
  {
    name: 'Forest',
    description: 'Natural green vibes',
    backgroundColor: '#0d1b0f',
    textColor: '#f1f8f4',
    accentColor: '#51cf66',
    buttonStyle: 'rounded',
    preview: '🌲',
  },
  {
    name: 'Purple',
    description: 'Royal purple theme',
    backgroundColor: '#1a0d1f',
    textColor: '#f3e5f5',
    accentColor: '#ab47bc',
    buttonStyle: 'rounded',
    preview: '💜',
  },
  {
    name: 'Minimal',
    description: 'Clean and simple',
    backgroundColor: '#ffffff',
    textColor: '#1a1a1a',
    accentColor: '#000000',
    buttonStyle: 'outline',
    preview: '⚪',
  },
  {
    name: 'Cyber',
    description: 'Neon cyberpunk',
    backgroundColor: '#000000',
    textColor: '#00ff41',
    accentColor: '#ff0080',
    buttonStyle: 'solid',
    preview: '💻',
  },
  {
    name: 'Golden',
    description: 'Luxurious gold',
    backgroundColor: '#1a1508',
    textColor: '#f9f7f0',
    accentColor: '#ffd700',
    buttonStyle: 'rounded',
    preview: '✨',
  },
]

