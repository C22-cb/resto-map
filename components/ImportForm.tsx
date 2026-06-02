'use client'

import { useState } from 'react'
import { Link2, Loader2, ChevronRight, AlertCircle, Sparkles } from 'lucide-react'
import AddPlaceForm from './AddPlaceForm'
import type { ExtractedPlace, PlaceInput } from '@/lib/types'
import { detectSourceType } from '@/lib/utils'

type Step = 'url' | 'fallback' | 'form'

export default function ImportForm() {
  const [step, setStep] = useState<Step>('url')
  const [url, setUrl] = useState('')
  const [caption, setCaption] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [extracted, setExtracted] = useState<ExtractedPlace | null>(null)

  async function handleExtract() {
    if (!url.trim()) return
    setLoading(true)
    setError('')

    try {
      const res = await fetch('/api/extract', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url: url.trim() }),
      })
      const data: ExtractedPlace & { message?: string } = await res.json()
      setExtracted(data)

      if (data.success && (data.name || data.raw)) {
        setStep('form')
      } else {
        setStep('fallback')
      }
    } catch {
      setError('Could not process URL. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  function handleCaptionContinue() {
    if (!caption.trim()) {
      setError('Please paste the caption or description.')
      return
    }
    const lines = caption.split('\n').filter(l => l.trim())
    const firstLine = lines[0]?.trim() ?? ''
    const mentionMatch = caption.match(/@([a-zA-Z0-9._]{3,30})/)
    const guessedName = mentionMatch
      ? mentionMatch[1].replace(/[._]/g, ' ')
      : firstLine.slice(0, 60)

    setExtracted({
      ...(extracted ?? {}),
      success: true,
      source_type: detectSourceType(url),
      name: guessedName,
      raw: caption,
    })
    setStep('form')
  }

  const initialData: Partial<PlaceInput> = {
    name: extracted?.name ?? '',
    address: extracted?.address ?? null,
    notes: extracted?.raw ? `From import:\n${extracted.raw.slice(0, 300)}` : null,
  }

  return (
    <div>
      {/* Step: URL input */}
      {step === 'url' && (
        <div className="px-4 py-6 space-y-5">
          {/* Info card */}
          <div className="bg-white rounded-3xl p-5 shadow-soft border border-app-border">
            <div className="w-10 h-10 bg-accent/10 rounded-2xl flex items-center justify-center mb-3">
              <Sparkles size={18} className="text-accent" />
            </div>
            <h2 className="font-bold text-ink mb-1">Paste a TikTok or Instagram link</h2>
            <p className="text-sm text-ink-3 leading-relaxed">
              We'll try to extract the restaurant name automatically.
              If the post is private, you can paste the caption manually.
            </p>
          </div>

          {error && (
            <div className="flex items-center gap-2 bg-red-50 text-red-600 text-sm rounded-2xl px-4 py-3 font-medium">
              <AlertCircle size={16} className="flex-shrink-0" />
              {error}
            </div>
          )}

          <div className="space-y-2">
            <label className="text-[10px] font-black text-ink-3 uppercase tracking-widest">Social media URL</label>
            <div className="flex items-center gap-3 bg-surface-2 rounded-2xl px-4 py-3.5 border border-transparent focus-within:border-accent/20 focus-within:ring-2 focus-within:ring-accent/40 transition-all">
              <Link2 size={16} className="text-ink-3 flex-shrink-0" />
              <input
                type="url"
                value={url}
                onChange={e => setUrl(e.target.value)}
                placeholder="https://www.tiktok.com/..."
                className="flex-1 bg-transparent text-sm text-ink outline-none placeholder:text-ink-3"
                autoFocus
              />
            </div>
          </div>

          <div className="space-y-2">
            <button
              onClick={handleExtract}
              disabled={!url.trim() || loading}
              className="w-full py-4 bg-accent text-white rounded-2xl font-bold disabled:opacity-60 flex items-center justify-center gap-2 press-scale shadow-accent"
            >
              {loading
                ? <><Loader2 size={18} className="animate-spin" /> Extracting...</>
                : <><ChevronRight size={18} /> Extract info</>
              }
            </button>

            <button
              onClick={() => { setStep('fallback'); setExtracted({ success: false, source_type: detectSourceType(url) }) }}
              className="w-full py-3 text-sm text-ink-3 font-semibold press-scale"
            >
              Skip — I'll paste the caption manually
            </button>
          </div>
        </div>
      )}

      {/* Step: Caption fallback */}
      {step === 'fallback' && (
        <div className="px-4 py-6 space-y-5">
          <div className="bg-white rounded-3xl p-5 shadow-soft border border-app-border">
            <h2 className="font-bold text-ink mb-1">Paste the caption</h2>
            <p className="text-sm text-ink-3 leading-relaxed">
              Copy the caption or description from the post and paste it below.
              We'll extract the restaurant name from the text.
            </p>
          </div>

          {error && (
            <div className="flex items-center gap-2 bg-red-50 text-red-600 text-sm rounded-2xl px-4 py-3 font-medium">
              <AlertCircle size={16} className="flex-shrink-0" />
              {error}
            </div>
          )}

          <div className="space-y-2">
            <label className="text-[10px] font-black text-ink-3 uppercase tracking-widest">Caption or description</label>
            <textarea
              value={caption}
              onChange={e => { setCaption(e.target.value); setError('') }}
              placeholder="Paste the TikTok or Instagram caption here..."
              rows={6}
              className="w-full px-4 py-3.5 bg-surface-2 rounded-2xl text-sm text-ink outline-none focus:ring-2 focus:ring-accent/40 border border-transparent focus:border-accent/20 transition-all resize-none"
              autoFocus
            />
          </div>

          <div className="space-y-2">
            <button
              onClick={handleCaptionContinue}
              disabled={!caption.trim()}
              className="w-full py-4 bg-accent text-white rounded-2xl font-bold disabled:opacity-60 flex items-center justify-center gap-2 press-scale shadow-accent"
            >
              <ChevronRight size={18} />
              Continue
            </button>

            <button
              onClick={() => setStep('url')}
              className="w-full py-3 text-sm text-ink-3 font-semibold press-scale"
            >
              Back
            </button>
          </div>
        </div>
      )}

      {/* Step: Confirm + fill form */}
      {step === 'form' && (
        <div>
          <div className="px-4 pt-4 pb-2">
            <div className="bg-white rounded-2xl px-4 py-3.5 flex items-center gap-3 shadow-soft border border-app-border">
              <div className="w-7 h-7 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0">
                <span className="text-green-600 text-sm font-black">✓</span>
              </div>
              <div>
                <p className="text-sm font-bold text-ink">Info extracted</p>
                <p className="text-xs text-ink-3">Review details below, then save.</p>
              </div>
            </div>
          </div>

          <AddPlaceForm
            initialData={initialData}
            sourceLink={url || undefined}
            sourceType={extracted?.source_type}
          />
        </div>
      )}
    </div>
  )
}
