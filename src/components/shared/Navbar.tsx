"use client"
import React from 'react'
import { signOut, useSession } from 'next-auth/react'
import { LogOut, Menu } from 'lucide-react'
import NotificationBell from '@/components/shared/NotificationBell'

export default function Navbar({ title, onOpenSidebar }: { title?: string; onOpenSidebar?: () => void }) {
  const { data: session } = useSession()
  const userName = session?.user?.name || 'User'

  return (
    <header className="sticky top-0 z-20 bg-white/95 backdrop-blur border-b border-slate-200 px-4 py-4 shadow-sm sm:px-6">
      <div className="mx-auto flex h-14 max-w-7xl items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          {onOpenSidebar ? (
            <button
              type="button"
              onClick={onOpenSidebar}
              className="inline-flex h-11 w-11 items-center justify-center rounded-2xl border border-slate-200 bg-white text-slate-700 shadow-sm transition hover:border-teal-300 hover:text-teal-700 sm:hidden"
            >
              <Menu size={20} />
            </button>
          ) : null}
          <div>
            <h1 className="text-lg font-semibold text-slate-900">{title || 'Dashboard'}</h1>
            <p className="text-sm text-slate-500">Selamat datang, {userName}</p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <NotificationBell />
          <button
            type="button"
            onClick={() => signOut({ callbackUrl: '/' })}
            className="inline-flex items-center gap-2 rounded-2xl border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-700 transition hover:border-teal-300 hover:bg-teal-50 hover:text-teal-700"
          >
            <LogOut size={16} /> Logout
          </button>
        </div>
      </div>
    </header>
  )
}
