'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Compass, Map, Bookmark, User } from 'lucide-react'

const tabs = [
  { href: '/discover', label: 'Discover', icon: Compass },
  { href: '/map', label: 'Map', icon: Map },
  { href: '/saved', label: 'Saved', icon: Bookmark },
  { href: '/profile', label: 'Profile', icon: User },
]

export default function BottomNav() {
  const pathname = usePathname()

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-[1000] bg-white/95 backdrop-blur-xl border-t border-app-border tab-bar">
      <div className="flex items-start justify-around px-1 pt-2">
        {tabs.map(({ href, label, icon: Icon }) => {
          const active = pathname === href || pathname.startsWith(href + '/')
          return (
            <Link
              key={href}
              href={href}
              className="flex flex-col items-center gap-[3px] px-4 py-1 min-w-[56px]"
            >
              <span
                className={`flex items-center justify-center w-10 h-7 rounded-xl transition-all duration-200
                  ${active ? 'bg-accent-light' : ''}`}
              >
                <Icon
                  size={22}
                  strokeWidth={active ? 2.2 : 1.6}
                  className={active ? 'text-accent' : 'text-ink-3'}
                />
              </span>
              <span
                className={`text-[10px] tracking-wide font-semibold transition-colors
                  ${active ? 'text-accent' : 'text-ink-3'}`}
              >
                {label}
              </span>
            </Link>
          )
        })}
      </div>
    </nav>
  )
}
