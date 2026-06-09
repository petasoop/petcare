"use client"
import React from 'react'
import { signOut, useSession } from 'next-auth/react'
import NotificationBell from '@/components/shared/NotificationBell'

export default function Navbar({ title }: { title?: string }) {
  const { data: session } = useSession()
  const userName = session?.user?.name || 'User'

  return (
    <header className="w-full bg-white shadow px-4 py-2 flex items-center justify-between">
      <div>
        <h1 className="text-lg font-semibold text-teal-700">{title || 'Dashboard'}</h1>
        <p className="text-sm text-slate-500">Halo, {userName}</p>
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
