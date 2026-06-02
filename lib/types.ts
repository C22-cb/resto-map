export type PlaceType = 'restaurant' | 'bar' | 'cafe' | 'other'
export type Status = 'to_try' | 'tried' | 'favorite'
export type SourceType = 'tiktok' | 'instagram_post' | 'instagram_reel' | 'manual'

export interface Place {
  id: string
  name: string
  type: PlaceType
  address: string | null
  arrondissement: number | null
  lat: number | null
  lng: number | null
  cuisine: string | null
  price_level: 1 | 2 | 3 | 4 | null
  rating: 1 | 2 | 3 | 4 | 5 | null
  status: Status
  occasion_tags: string[]
  ambiance_tags: string[]
  source_link: string | null
  source_type: SourceType | null
  notes: string | null
  created_at: string
}

export type PlaceInput = Omit<Place, 'id' | 'created_at'>

export interface ExtractedPlace {
  name?: string
  address?: string
  source_type: SourceType
  success: boolean
  raw?: string
}

export interface GeocodeResult {
  lat: number
  lng: number
  display_name: string
}
