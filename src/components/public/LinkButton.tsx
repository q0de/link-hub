import type { Link as LinkType, Theme } from '../../types/database'
import { motion } from 'framer-motion'

interface LinkButtonProps {
  link: LinkType
  theme: Theme
  onClick: () => void
}

export default function LinkButton({ link, theme, onClick }: LinkButtonProps) {
  const getButtonClasses = () => {
    const baseClasses = 'w-full px-6 py-4 font-semibold transition-all duration-200 flex items-center justify-center gap-3'
    
    switch (theme.buttonStyle) {
      case 'solid':
        return `${baseClasses} rounded-lg`
      case 'outline':
        return `${baseClasses} border-2 rounded-lg`
      case 'rounded':
      default:
        return `${baseClasses} rounded-2xl`
    }
  }

  const getButtonStyle = () => {
    switch (theme.buttonStyle) {
      case 'solid':
        return {
          backgroundColor: theme.accentColor,
          color: '#ffffff',
        }
      case 'outline':
        return {
          borderColor: theme.accentColor,
          color: theme.accentColor,
          backgroundColor: 'transparent',
        }
      case 'rounded':
      default:
        return {
          backgroundColor: theme.accentColor,
          color: '#ffffff',
        }
    }
  }

  return (
    <motion.a
      href={link.url}
      target="_blank"
      rel="noopener noreferrer"
      onClick={onClick}
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      className={getButtonClasses()}
      style={getButtonStyle()}
    >
      {link.icon && <span className="text-xl">{link.icon}</span>}
      <span>{link.title}</span>
    </motion.a>
  )
}

