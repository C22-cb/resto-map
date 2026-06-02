'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { MapPin, Loader2, Check } from 'lucide-react'
import type { PlaceInput } from '@/lib/types'
import { PLACE_TYPES, STATUSES, OCCASION_TAGS, AMBIANCE_TAGS, CUISINES, getTypeColor } from '@/lib/utils'

interface Props {
  initialData?: Partial<PlaceInput>
  sourceLink?: string
  sourceType?: PlaceInput['source_type']
}

const EMPTY: PlaceInput = {
  name: '',
  type: 'restaurant',
  address: null,
  arrondissement: 9,
  lat: null,
  lng: null,
  cuisine: null,
  price_level: null,
  rating: null,
  status: 'to_try',
  occasion_tags: [],
  ambiance_tags: [],
  source_link: null,
  source_type: 'manual',
  notes: null,
}

export default function AddPlaceForm({ initialData, sourceLink, sourceType }: Props) {
  const router = useRouter()
  const [form, setForm] = useState<PlaceInput>({
    ...EMPTY,
    ...initialData,
    source_link: sourceLink ?? null,
    source_type: sourceType ?? 'manual',
  })
  const [geocoding, setGeocoding] = useState(false)
  const [geocoded, setGeocoded] = useState(false)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')

  function set<K extends keyof PlaceInput>(key: K, value: PlaceInput[K]) {
    setForm(prev => ({ ...prev, [key]: value }))
    if (key === 'address') setGeocoded(false)
  }

  function toggleTag(field: 'occasion_tags' | 'ambiance_tags', tag: string) {
    setForm(prev => ({
      ...prev,
      [field]: prev[field].includes(tag)
        ? prev[field].filter(t => t !== tag)
        : [...prev[field], tag],
    }))
  }

  async function geocode() {
    if (!form.address) return
    setGeocoding(true)
    setError('')
    try {
      const res = await fetch('/api/geocode', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ address: form.address }),
      })
      const data = await res.json()
      if (data.error) {
        setError('Address not found. Try a more specific address.')
      } else {
        setForm(prev => ({ ...prev, lat: data.lat, lng: data.lng }))
        setGeocoded(true)
      }
    } catch {
      setError('Geocoding failed. Please try again.')
    } finally {
      setGeocoding(false)
    }
  }

  async function save(e: React.FormEvent) {
    e.preventDefault()
    if (!form.name.trim()) {
      setError('Name is required.')
      return
    }
    setSaving(true)
    setError('')
    try {
      const payload = {
        ...form,
        name: form.name.trim(),
        address: form.address?.trim() || null,
        notes: form.notes?.trim() || null,
        cuisine: form.cuisine || null,
      }
      const res = await fetch('/api/places', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })
      if (!res.ok) throw new Error('Save failed')
      router.push('/map')
      router.refresh()
    } catch {
      setError('Could not save. Please try again.')
      setSaving(false)
    }
  }

  return (
    <form onSubmit={save} className="px-4 py-4 space-y-6 pb-28">
      {error && (
        <div className="bg-red-50 text-red-600 text-sm rounded-2xl px-4 py-3 font-medium">
          {error}
        </div>
      )}

      {/* Name */}
      <div className="space-y-2">
        <label className="text-[10px] font-black text-ink-3 uppercase tracking-widest">Name *</label>
        <input
          type="text"
          value={form.name}
          onChange={e => set('name', e.target.value)}
          placeholder="Restaurant or bar name"
          className="w-full px-4 py-3.5 bg-surface-2 rounded-2xl text-sm text-ink outline-none focus:ring-2 focus:ring-accent/40 border border-transparent focus:border-accent/20 transition-all"
          required
        />
      </div>

      {/* Type */}
      <div className="space-y-2">
        <label className="text-[10px] font-black text-ink-3 uppercase tracking-widest">Type</label>
        <div className="flex gap-2">
          {PLACE_TYPES.map(t => (
            <button
              key={t.value}
              type="button"
              onClick={() => set('type', t.value as PlaceInput['type'])}
              className="flex-1 py-2.5 rounded-xl text-xs font-bold transition-all press-scale"
              style={
                form.type === t.value
                  ? { backgroundColor: getTypeColor(t.value), color: 'white' }
                  : { backgroundColor: 'var(--color-surface-2)', color: 'var(--color-ink-2)' }
              }
            >
              {t.label}
            </button>
          ))}
        </div>
      </div>

      {/* Cuisine */}
      <div className="space-y-2">
        <label className="text-[10px] font-black text-ink-3 uppercase tracking-widest">Cuisine / Category</label>
        <select
          value={form.cuisine ?? ''}
          onChange={e => set('cuisine', e.target.value || null)}
          className="w-full px-4 py-3.5 bg-surface-2 rounded-2xl text-sm text-ink outline-none focus:ring-2 focus:ring-accent/40 border border-transparent focus:border-accent/20 transition-all appearance-none"
        >
          <option value="">Select...</option>
          {CUISINES.map(c => <option key={c}>{c}</option>)}
        </select>
      </div>

      {/* Address */}
      <div className="space-y-2">
        <label className="text-[10px] font-black text-ink-3 uppercase tracking-widest">Address</label>
        <div className="flex gap-2">
          <input
            type="text"
            value={form.address ?? ''}
            onChange={e => set('address', e.target.value || null)}
            placeholder="Street address..."
            className="flex-1 px-4 py-3.5 bg-surface-2 rounded-2xl text-sm text-ink outline-none focus:ring-2 focus:ring-accent/40 border border-transparent focus:border-accent/20 transition-all"
          />
          <button
            type="button"
            onClick={geocode}
            disabled={!form.address || geocoding}
            className={`w-12 h-12 rounded-2xl flex items-center justify-center transition-all press-scale disabled:opacity-40 flex-shrink-0
              ${geocoded ? 'bg-green-100 text-green-600' : 'bg-surface-2 text-ink-2'}`}
          >
            {geocoding
              ? <Loader2 size={18} className="animate-spin" />
              : geocoded
              ? <Check size={18} />
              : <MapPin size={18} />
            }
          </button>
        </div>
        {geocoded && (
          <p className="text-xs text-green-600 font-semibold px-1">
            Pinned: {form.lat?.toFixed(5)}, {form.lng?.toFixed(5)}
          </p>
        )}
        <div className="flex items-center gap-3 px-1">
          <label className="text-xs text-ink-3 font-medium">Arrondissement</label>
          <input
            type="number"
            min={1}
            max={20}
            value={form.arrondissement ?? ''}
            onChange={e => set('arrondissement', parseInt(e.target.value) || null)}
            className="w-16 px-2 py-1.5 bg-surface-2 rounded-xl text-sm text-ink text-center outline-none focus:ring-2 focus:ring-accent/40"
          />
        </div>
      </div>

      {/* Price level */}
      <div className="space-y-2">
        <label className="text-[10px] font-black text-ink-3 uppercase tracking-widest">Price</label>
        <div className="flex gap-2">
          {[1, 2, 3, 4].map(lvl => (
            <button
              key={lvl}
              type="button"
              onClick={() => set('price_level', form.price_level === lvl ? null : lvl as PlaceInput['price_level'])}
              className={`flex-1 py-2.5 rounded-xl text-sm font-bold transition-all press-scale
                ${form.price_level === lvl ? 'bg-ink text-white' : 'bg-surface-2 text-ink-2'}`}
            >
              {'€'.repeat(lvl)}
            </button>
          ))}
        </div>
      </div>

      {/* Rating */}
      <div className="space-y-2">
        <label className="text-[10px] font-black text-ink-3 uppercase tracking-widest">Rating</label>
        <div className="flex gap-1">
          {[1, 2, 3, 4, 5].map(star => (
            <button
              key={star}
              type="button"
              onClick={() => set('rating', form.rating === star ? null : star as PlaceInput['rating'])}
              className={`flex-1 py-2.5 rounded-xl text-xl transition-all press-scale
                ${(form.rating ?? 0) >= star ? 'text-amber-400' : 'text-surface-3'}`}
            >
              ★
            </button>
          ))}
        </div>
      </div>

      {/* Status */}
      <div className="space-y-2">
        <label className="text-[10px] font-black text-ink-3 uppercase tracking-widest">Status</label>
        <div className="flex gap-2">
          {STATUSES.map(s => (
            <button
              key={s.value}
              type="button"
              onClick={() => set('status', s.value as PlaceInput['status'])}
              className={`flex-1 py-2.5 rounded-xl text-xs font-bold transition-all press-scale
                ${form.status === s.value ? 'bg-ink text-white' : 'bg-surface-2 text-ink-2'}`}
            >
              {s.label}
            </button>
          ))}
        </div>
      </div>

      {/* Occasion tags */}
      <div className="space-y-2">
        <label className="text-[10px] font-black text-ink-3 uppercase tracking-widest">Occasion</label>
        <div className="flex flex-wrap gap-2">
          {OCCASION_TAGS.map(tag => (
            <button
              key={tag}
              type="button"
              onClick={() => toggleTag('occasion_tags', tag)}
              className={`px-3 py-1.5 rounded-full text-xs font-bold capitalize transition-all press-scale
                ${form.occasion_tags.includes(tag)
                  ? 'bg-accent text-white'
                  : 'bg-surface-2 text-ink-2'}`}
            >
              {tag}
            </button>
          ))}
        </div>
      </div>

      {/* Ambiance tags */}
      <div className="space-y-2">
        <label className="text-[10px] font-black text-ink-3 uppercase tracking-widest">Ambiance</label>
        <div className="flex flex-wrap gap-2">
          {AMBIANCE_TAGS.map(tag => (
            <button
              key={tag}
              type="button"
              onClick={() => toggleTag('ambiance_tags', tag)}
              className={`px-3 py-1.5 rounded-full text-xs font-bold capitalize transition-all press-scale
                ${form.ambiance_tags.includes(tag)
                  ? 'bg-ink text-white'
                  : 'bg-surface-2 text-ink-2'}`}
            >
              {tag}
            </button>
          ))}
        </div>
      </div>

      {/* Notes */}
      <div className="space-y-2">
        <label className="text-[10px] font-black text-ink-3 uppercase tracking-widest">Notes</label>
        <textarea
          value={form.notes ?? ''}
          onChange={e => set('notes', e.target.value || null)}
          placeholder="Anything to remember..."
          rows={3}
          className="w-full px-4 py-3.5 bg-surface-2 rounded-2xl text-sm text-ink outline-none focus:ring-2 focus:ring-accent/40 border border-transparent focus:border-accent/20 transition-all resize-none"
        />
      </div>

      {/* Source link */}
      {sourceLink && (
        <div className="space-y-2">
          <label className="text-[10px] font-black text-ink-3 uppercase tracking-widest">Source</label>
          <p className="text-xs text-ink-3 bg-surface-2 rounded-2xl px-4 py-3 truncate font-medium">
            {sourceLink}
          </p>
        </div>
      )}

      <button
        type="submit"
        disabled={saving}
        className="w-full py-4 bg-accent text-white rounded-2xl font-bold text-base disabled:opacity-60 flex items-center justify-center gap-2 press-scale shadow-accent"
      >
        {saving && <Loader2 size={18} className="animate-spin" />}
        {saving ? 'Saving...' : 'Save Place'}
      </button>
    </form>
  )
}
