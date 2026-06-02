import type { SourceType } from './types'

export const PLACE_TYPES = [
  { value: 'restaurant', label: 'Restaurant' },
  { value: 'bar', label: 'Bar' },
  { value: 'cafe', label: 'Café' },
  { value: 'other', label: 'Other' },
] as const

export const STATUSES = [
  { value: 'to_try', label: 'To Try' },
  { value: 'tried', label: 'Tried' },
  { value: 'favorite', label: 'Favorite' },
] as const

export const OCCASION_TAGS = [
  'date night', 'friends', 'casual', 'business', 'quick lunch', 'dinner', 'drinks',
] as const

export const AMBIANCE_TAGS = [
  'cozy', 'lively', 'quiet', 'romantic', 'trendy', 'classic', 'outdoor', 'rooftop',
] as const

export const CUISINES = [
  'French', 'Italian', 'Japanese', 'Chinese', 'Thai', 'Indian',
  'American', 'Mediterranean', 'Mexican', 'Middle Eastern',
  'Seafood', 'Vegetarian', 'Brunch', 'Wine bar', 'Cocktail bar', 'Other',
] as const

// Premium type colors — updated from default Tailwind palette
export function getTypeColor(type: string): string {
  const colors: Record<string, string> = {
    restaurant: '#E8472A',
    bar: '#6D28D9',
    cafe: '#B45309',
    other: '#0369A1',
  }
  return colors[type] ?? colors.other
}

export function getTypeBg(type: string): string {
  const colors: Record<string, string> = {
    restaurant: '#FFF1EE',
    bar: '#EDE9FF',
    cafe: '#FFFBEB',
    other: '#E0F2FE',
  }
  return colors[type] ?? colors.other
}

export function getPriceLabel(level: number | null): string {
  if (!level) return ''
  return '€'.repeat(level)
}

export function getStatusLabel(status: string): string {
  return STATUSES.find(s => s.value === status)?.label ?? status
}

export function getStatusStyle(status: string): { bg: string; text: string } {
  const map: Record<string, { bg: string; text: string }> = {
    favorite: { bg: '#FFF1EE', text: '#E8472A' },
    tried: { bg: '#F0FDF4', text: '#15803D' },
    to_try: { bg: '#EFF6FF', text: '#1D4ED8' },
  }
  return map[status] ?? map.to_try
}

export function getTypeLabel(type: string): string {
  return PLACE_TYPES.find(t => t.value === type)?.label ?? type
}

export function getRatingStars(rating: number | null): string {
  if (!rating) return ''
  return '★'.repeat(rating) + '☆'.repeat(5 - rating)
}

export function detectSourceType(url: string): SourceType {
  if (url.includes('tiktok.com')) return 'tiktok'
  if (url.includes('instagram.com/reel')) return 'instagram_reel'
  if (url.includes('instagram.com')) return 'instagram_post'
  return 'manual'
}

export function getSourceLabel(type: SourceType | null): string {
  if (!type) return ''
  const labels: Record<SourceType, string> = {
    tiktok: 'TikTok',
    instagram_post: 'Instagram',
    instagram_reel: 'Instagram Reel',
    manual: 'Manual',
  }
  return labels[type]
}

export function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString('fr-FR', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  })
}
