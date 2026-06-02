import { ChevronLeft } from 'lucide-react'
import Link from 'next/link'
import ImportForm from '@/components/ImportForm'
import BottomNav from '@/components/BottomNav'

export default function ImportPage() {
  return (
    <div className="flex flex-col h-full bg-app-bg">
      <header className="flex-shrink-0 bg-app-bg px-4 pt-14 pb-4 flex items-center gap-3">
        <Link href="/map" className="w-10 h-10 bg-white rounded-full shadow-soft flex items-center justify-center border border-app-border flex-shrink-0">
          <ChevronLeft size={20} className="text-ink" />
        </Link>
        <div>
          <p className="text-xs font-bold text-ink-3 tracking-widest uppercase">Import</p>
          <h1 className="text-xl font-bold text-ink leading-tight">From TikTok · Instagram</h1>
        </div>
      </header>

      <main className="flex-1 overflow-y-auto scroll-area">
        <ImportForm />
      </main>

      <BottomNav />
    </div>
  )
}
