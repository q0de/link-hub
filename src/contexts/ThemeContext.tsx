import { createContext, useContext, useEffect, useState } from 'react'
import { supabase } from '../lib/supabase'
import type { Theme } from '../types/database'

interface ThemeContextType {
  theme: Theme | null
  loading: boolean
}

const ThemeContext = createContext<ThemeContextType>({ theme: null, loading: true })

export const useTheme = () => useContext(ThemeContext)

export function ThemeProvider({ children, userId }: { children: React.ReactNode; userId: string | null }) {
  const [theme, setTheme] = useState<Theme | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!userId) {
      setLoading(false)
      return
    }

    loadTheme()
  }, [userId])

  const loadTheme = async () => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('theme')
        .eq('id', userId)
        .single()

      if (error) throw error
      setTheme(data?.theme || {
        backgroundColor: '#0f0f0f',
        textColor: '#ffffff',
        accentColor: '#ff7e29',
        buttonStyle: 'rounded',
      })
    } catch (err) {
      console.error('Error loading theme:', err)
      setTheme({
        backgroundColor: '#0f0f0f',
        textColor: '#ffffff',
        accentColor: '#ff7e29',
        buttonStyle: 'rounded',
      })
    } finally {
      setLoading(false)
    }
  }

  // Apply theme to document root
  useEffect(() => {
    if (theme) {
      document.documentElement.style.setProperty('--theme-bg', theme.backgroundColor)
      document.documentElement.style.setProperty('--theme-text', theme.textColor)
      document.documentElement.style.setProperty('--theme-accent', theme.accentColor)
    }
  }, [theme])

  return (
    <ThemeContext.Provider value={{ theme, loading }}>
      {children}
    </ThemeContext.Provider>
  )
}

