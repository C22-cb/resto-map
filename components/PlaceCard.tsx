'use client'

import { X, MapPin, ExternalLink, Star, Navigation } from 'lucide-react'
import Link from 'next/link'
import type { Place } from '@/lib/types'
import {
  getTypeColor, getTypeBg, getTypeLabel, getPriceLabel,
  getStatusLabel, getStatusStyle, getSourceLabel, formatDate,
} from '@/lib/utils'

interface Props {
  place: Place
  onClose: () => void
}

export default function PlaceCard({ place, onClose }: Props) {
  const typeColor = getTypeColor(place.type)
  const typeBg = getTypeBg(place.type)
  const statusStyle = getStatusStyle(place.status)
  const allTags = [...(place.occasion_tags ?? []), ...(place.ambiance_tags ?? [])]

  return (
    <div className="fixed inset-0 z-[2000] flex flex-col justify-end">
      {/* Scrim */}
      <div className="absolute inset-0 bg-black/30 animate-fade-in" onClick={onClose} />

      {/* Sheet */}
      <div className="relative z-10 animate-slide-up">
        <div className="bg-white rounded-t-[28px] overflow-hidden shadow-sheet max-h-[82vh] flex flex-col">

          {/* Drag handle */}
          <div className="flex justify-center pt-3 pb-2 flex-shrink-0">
            <div className="w-9 h-[3px] bg-app-border rounded-full" />
          </div>

          <div className="overflow-y-auto scroll-area">
            <div className="px-5 pb-2">

              {/* Type badge + close */}
              <div className="flex items-center justify-between mb-3">
                <span
                  className="text-xs font-bold px-3 py-1.5 rounded-full tracking-wide uppercase"
                  style={{ backgroundColor: typeBg, color: typeColor }}
                >
                  {getTypeLabel(place.type)}
                  {place.cuisine && ` · ${place.cuisine}`}
                </span>
                <button
                  onClick={onClose}
                  className="p-2 rounded-full hover:bg-surface-2 text-ink-3 transition-colors"
                >
                  <X size={18} />
                </button>
              </div>

              {/* Name */}
              <h2 className="text-[26px] font-bold text-ink leading-tight tracking-tight mb-1">
                {place.name}
              </h2>

              {/* Stats */}
              <div className="flex items-center gap-3 mb-5">
                {place.rating && (
                  <div className="flex items-center gap-1">
                    <Star size={14} className="text-amber-400" fill="currentColor" />
                    <span className="text-sm font-bold text-ink">{place.rating}</span>
                    <span className="text-xs text-ink-3">/5</span>
                  </div>
                )}
                {place.price_level && (
                  <span className="text-sm font-semibold text-ink-2">
                    {getPriceLabel(place.price_level)}
                  </span>
                )}
                {place.arrondissement && (
                  <span className="text-xs text-ink-3">Paris {place.arrondissement}e</span>
                )}
                <span
                  className="ml-auto text-xs font-semibold px-2.5 py-1 rounded-full"
                  style={{ backgroundColor: statusStyle.bg, color: statusStyle.text }}
                >
                  {getStatusLabel(place.status)}
                </span>
              </div>

              {/* Address */}
              {place.address && (
                <a
                  href={`https://maps.google.com/?q=${encodeURIComponent(place.address)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-3 mb-5 group"
                >
                  <span className="w-9 h-9 rounded-xl bg-surface-2 flex items-center justify-center flex-shrink-0">
                    <MapPin size={15} className="text-ink-2" />
                  </span>
                  <span className="text-sm text-ink-2 group-hover:text-ink transition-colors">
                    {place.address}
                  </span>
                </a>
              )}

              {/* Tags */}
              {allTags.length > 0 && (
                <div className="flex flex-wrap gap-2 mb-5">
                  {allTags.map(tag => (
                    <span
                      key={tag}
                      className="text-xs px-3 py-1.5 bg-surface-2 text-ink-2 rounded-full font-medium capitalize"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              )}

              {/* Notes */}
              {place.notes && (
                <div className="bg-surface-2 rounded-2xl p-4 mb-5">
                  <p className="text-sm text-ink-2 leading-relaxed">{place.notes}</p>
                </div>
              )}

              {/* Source */}
              {place.source_link && (
                <a
                  href={place.source_link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 text-sm font-semibold text-accent mb-4"
                >
                  <ExternalLink size={14} />
                  View on {getSourceLabel(place.source_type)}
                </a>
              )}

              <p className="text-xs text-ink-3 mb-4">Added {formatDate(place.created_at)}</p>
            </div>

            {/* Actions */}
            <div className="px-5 pb-10 flex gap-3">
              {place.address && (
                <a
                  href={`https://maps.google.com/?q=${encodeURIComponent(place.address)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1 flex items-center justify-center gap-2 py-3.5 bg-surface-2 rounded-2xl text-sm font-semibold text-ink press-scale"
                >
                  <Navigation size={16} />
                  Directions
                </a>
              )}
              <Link
                href={`/place/${place.id}`}
                onClick={onClose}
                className="flex-1 flex items-center justify-center py-3.5 rounded-2xl text-sm font-bold text-white press-scale"
                style={{ backgroundColor: typeColor }}
              >
                Full Details
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
