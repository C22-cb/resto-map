'use client'

import { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { ChevronLeft, Star, MapPin, ExternalLink, Navigation, Trash2 } from 'lucide-react'
import type { Place } from '@/lib/types'
import {
  getTypeColor, getTypeBg, getTypeLabel, getPriceLabel,
  getStatusLabel, getStatusStyle, getSourceLabel, formatDate,
} from '@/lib/utils'

export default function PlaceDetailPage() {
  const { id } = useParams<{ id: string }>()
  const router = useRouter()
  const [place, setPlace] = useState<Place | null>(null)
  const [loading, setLoading] = useState(true)
  const [deleting, setDeleting] = useState(false)

  useEffect(() => {
    fetch(`/api/places/${id}`)
      .then(r => r.json())
      .then(data => {
        setPlace(data.error ? null : data)
        setLoading(false)
      })
      .catch(() => setLoading(false))
  }, [id])

  async function handleDelete() {
    if (!confirm('Delete this place?')) return
    setDeleting(true)
    await fetch(`/api/places/${id}`, { method: 'DELETE' })
    router.push('/discover')
    router.refresh()
  }

  if (loading) {
    return (
      <div className="flex flex-col h-full bg-app-bg">
        <div className="flex-shrink-0 h-56 bg-surface-3 animate-skeleton" />
        <div className="px-5 pt-6 space-y-3">
          <div className="w-20 h-5 bg-surface-3 rounded-full animate-skeleton" />
          <div className="w-64 h-8 bg-surface-3 rounded-xl animate-skeleton" />
          <div className="w-40 h-4 bg-surface-3 rounded-lg animate-skeleton" />
        </div>
      </div>
    )
  }

  if (!place) {
    return (
      <div className="flex flex-col items-center justify-center h-full bg-app-bg">
        <p className="text-lg font-bold text-ink mb-2">Place not found</p>
        <button onClick={() => router.back()} className="text-accent font-semibold text-sm">
          Go back
        </button>
      </div>
    )
  }

  const typeColor = getTypeColor(place.type)
  const typeBg = getTypeBg(place.type)
  const statusStyle = getStatusStyle(place.status)
  const allOccasion = place.occasion_tags ?? []
  const allAmbiance = place.ambiance_tags ?? []

  return (
    <div className="flex flex-col h-full bg-app-bg">
      <div className="flex-1 overflow-y-auto scroll-area">
        {/* Hero gradient */}
        <div
          className="relative h-56 flex flex-col justify-between"
          style={{ background: `linear-gradient(160deg, ${typeColor}CC 0%, ${typeColor}88 100%)` }}
        >
          {/* Back + delete */}
          <div className="flex items-center justify-between px-4 pt-14">
            <button
              onClick={() => router.back()}
              className="w-10 h-10 bg-black/20 backdrop-blur-md rounded-full flex items-center justify-center"
            >
              <ChevronLeft size={22} className="text-white" />
            </button>
            <button
              onClick={handleDelete}
              disabled={deleting}
              className="w-10 h-10 bg-black/20 backdrop-blur-md rounded-full flex items-center justify-center"
            >
              <Trash2 size={18} className="text-white/80" />
            </button>
          </div>

          {/* Name on gradient */}
          <div className="px-5 pb-5">
            <span
              className="text-[10px] font-black px-2.5 py-1 rounded-full uppercase tracking-wider mb-3 inline-block"
              style={{ backgroundColor: 'rgba(255,255,255,0.2)', color: 'white' }}
            >
              {getTypeLabel(place.type)}
              {place.cuisine && ` · ${place.cuisine}`}
            </span>
            <h1 className="text-[28px] font-black text-white leading-tight tracking-tight drop-shadow-sm">
              {place.name}
            </h1>
          </div>
        </div>

        {/* Content card */}
        <div className="bg-white rounded-t-[28px] -mt-5 relative px-5 pt-5 pb-10">

          {/* Stats */}
          <div className="flex items-center gap-3 mb-5">
            {place.rating && (
              <div className="flex items-center gap-1.5 bg-amber-50 px-3 py-1.5 rounded-full">
                <Star size={14} className="text-amber-400" fill="currentColor" />
                <span className="text-sm font-bold text-amber-700">{place.rating}/5</span>
              </div>
            )}
            {place.price_level && (
              <div className="bg-surface-2 px-3 py-1.5 rounded-full">
                <span className="text-sm font-bold text-ink-2">{getPriceLabel(place.price_level)}</span>
              </div>
            )}
            {place.arrondissement && (
              <span className="text-xs text-ink-3 font-medium">Paris {place.arrondissement}e</span>
            )}
            <span
              className="ml-auto text-xs font-bold px-3 py-1.5 rounded-full"
              style={{ backgroundColor: statusStyle.bg, color: statusStyle.text }}
            >
              {getStatusLabel(place.status)}
            </span>
          </div>

          {/* Address */}
          {place.address && (
            <div className="mb-5">
              <p className="text-[10px] font-black text-ink-3 uppercase tracking-widest mb-2">Address</p>
              <a
                href={`https://maps.google.com/?q=${encodeURIComponent(place.address)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-3 bg-surface-2 rounded-2xl p-3.5"
              >
                <MapPin size={18} className="text-ink-2 flex-shrink-0" />
                <span className="text-sm text-ink-2 flex-1">{place.address}</span>
                <Navigation size={14} className="text-ink-3" />
              </a>
            </div>
          )}

          {/* Occasion tags */}
          {allOccasion.length > 0 && (
            <div className="mb-5">
              <p className="text-[10px] font-black text-ink-3 uppercase tracking-widest mb-2">Occasion</p>
              <div className="flex flex-wrap gap-2">
                {allOccasion.map(tag => (
                  <span
                    key={tag}
                    className="px-3 py-1.5 rounded-full text-xs font-bold capitalize"
                    style={{ backgroundColor: typeBg, color: typeColor }}
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Ambiance tags */}
          {allAmbiance.length > 0 && (
            <div className="mb-5">
              <p className="text-[10px] font-black text-ink-3 uppercase tracking-widest mb-2">Ambiance</p>
              <div className="flex flex-wrap gap-2">
                {allAmbiance.map(tag => (
                  <span
                    key={tag}
                    className="px-3 py-1.5 bg-surface-2 text-ink-2 rounded-full text-xs font-bold capitalize"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Notes */}
          {place.notes && (
            <div className="mb-5">
              <p className="text-[10px] font-black text-ink-3 uppercase tracking-widest mb-2">Notes</p>
              <div className="bg-surface-2 rounded-2xl p-4">
                <p className="text-sm text-ink-2 leading-relaxed">{place.notes}</p>
              </div>
            </div>
          )}

          {/* Source */}
          {place.source_link && (
            <div className="mb-5">
              <p className="text-[10px] font-black text-ink-3 uppercase tracking-widest mb-2">Source</p>
              <a
                href={place.source_link}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-3 bg-surface-2 rounded-2xl p-3.5"
              >
                <ExternalLink size={16} className="text-ink-2 flex-shrink-0" />
                <span className="text-sm font-semibold text-ink-2">
                  View on {getSourceLabel(place.source_type)}
                </span>
              </a>
            </div>
          )}

          <p className="text-xs text-ink-3">Added {formatDate(place.created_at)}</p>
        </div>
      </div>
    </div>
  )
}
