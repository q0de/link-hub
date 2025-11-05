import { Domain, Theme } from '../../types/database'
import { motion } from 'framer-motion'

interface DomainCardProps {
  domain: Domain
  theme: Theme
  onClick: () => void
}

export default function DomainCard({ domain, theme, onClick }: DomainCardProps) {
  const handleBuyClick = (e: React.MouseEvent) => {
    if (domain.buy_url) {
      onClick()
      window.open(domain.buy_url, '_blank', 'noopener,noreferrer')
    } else {
      // Could open a contact form or modal
      alert(`Contact owner about ${domain.domain_name}`)
    }
    e.preventDefault()
  }

  return (
    <motion.div
      className="bg-dark-card border border-dark-border rounded-xl p-6 hover:shadow-lg transition-shadow"
      whileHover={{ scale: 1.02 }}
      style={{ borderColor: theme.accentColor + '40' }}
    >
      <h3 className="text-xl font-bold mb-2">{domain.domain_name}</h3>
      <p className="text-2xl font-bold mb-4" style={{ color: theme.accentColor }}>
        ${domain.price.toLocaleString()}
      </p>
      {domain.description && (
        <p className="text-gray-400 text-sm mb-4">{domain.description}</p>
      )}
      <button
        onClick={handleBuyClick}
        className="w-full px-4 py-2 rounded-lg font-semibold transition-colors"
        style={{
          backgroundColor: theme.accentColor,
          color: '#ffffff',
        }}
      >
        {domain.buy_url ? 'Buy Now' : 'Contact Owner'}
      </button>
    </motion.div>
  )
}

