export interface Profile {
  id: string
  username: string
  avatar_url: string | null
  bio: string | null
  theme: Theme | null
  created_at: string
}

export interface Theme {
  backgroundColor: string
  textColor: string
  accentColor: string
  buttonStyle: 'solid' | 'outline' | 'rounded'
}

export interface Link {
  id: string
  profile_id: string
  title: string
  url: string
  icon: string | null
  order_index: number
  created_at: string
}

export interface Domain {
  id: string
  profile_id: string
  domain_name: string
  price: number
  description: string | null
  buy_url: string | null
  created_at: string
}

export interface ClickEvent {
  id: string
  link_id: string | null
  domain_id: string | null
  referrer: string | null
  timestamp: string
  ip_hash: string | null
}

