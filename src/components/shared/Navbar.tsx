"use client"
import React from 'react'
import { signOut, useSession } from 'next-auth/react'
import NotificationBell from '@/components/shared/NotificationBell'

export default function Navbar({ title, onOpenSidebar }: { title?: string; onOpenSidebar?: () => void }) {
  const { data: session } = useSession()
  const userName = session?.user?.name || 'User'

  return (
    <header className="w-full bg-white shadow px-4 py-3 flex items-center justify-between gap-4 sm:px-6">
      <div className="flex items-center gap-3">
        {onOpenSidebar ? (
          <button
            type="button"
            onClick={onOpenSidebar}
            className="inline-flex h-10 w-10 items-center justify-center rounded-2xl border border-slate-200 bg-white text-slate-700 shadow-sm sm:hidden"
          >
            ☰
          </button>
        ) : null}
        <div>
          <h1 className="text-lg font-semibold text-teal-700">{title || 'Dashboard'}</h1>
          <p className="text-sm text-slate-500">Halo, {userName}</p>
        </div>
      </div>
      <div className="flex items-center space-x-4">
        <NotificationBell />
        <button type="button" onClick={() => signOut({ callbackUrl: '/' })} className="text-sm text-slate-700 hover:text-teal-700">
          Logout
        </button>
      </div>
    </header>
  )
}
