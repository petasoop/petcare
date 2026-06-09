"use client"

import React, { useState } from 'react'
import { useSession } from 'next-auth/react'
import { useNotifikasi, useMarkRead } from '@/hooks/useNotifikasi'
import type { Notifikasi, SessionUser } from '@/types'

export default function NotificationBell(): React.ReactElement {
  const [open, setOpen] = useState(false)
  const { data: session } = useSession()
  const userId = (session?.user as unknown as SessionUser | undefined)?.id
  const { data, isLoading } = useNotifikasi(userId)
  const markRead = useMarkRead(userId)

  const notifications: Notifikasi[] = data?.data || []
  const unreadCount = notifications.filter((notification: Notifikasi) => !notification.isRead).length

  const toggleOpen = (): void => setOpen((value) => !value)

  return (
    <div className="relative">
      <button onClick={toggleOpen} className="relative px-3 py-2 bg-white border rounded-full hover:bg-slate-50">
        🔔
        {unreadCount > 0 && <span className="absolute -top-1 -right-1 w-2 h-2 bg-red-500 rounded-full" />}
      </button>
      {open && (
        <div className="absolute right-0 mt-2 w-96 bg-white border rounded shadow p-3 z-50">
          <div className="flex items-center justify-between mb-3">
            <div className="text-sm font-medium">Notifikasi</div>
            <button
              onClick={async () => {
                await Promise.all(
                  notifications.filter((notification: Notifikasi) => !notification.isRead).map((notification: Notifikasi) => markRead.mutateAsync(notification.id))
                )
              }}
              disabled={markRead.status === 'pending' || unreadCount === 0}
              className="text-xs text-teal-600 hover:underline disabled:text-slate-300"
            >
              Tandai semua dibaca
            </button>
          </div>
          <div className="space-y-2 max-h-72 overflow-auto">
            {isLoading ? (
              <div className="text-sm text-gray-500">Memuat...</div>
            ) : notifications.length ? (
              notifications.map((notification: Notifikasi) => (
                <button
                  key={notification.id}
                  onClick={() => markRead.mutateAsync(notification.id)}
                  className={`w-full text-left p-2 rounded ${notification.isRead ? 'bg-white' : 'bg-teal-50 hover:bg-teal-100'}`}>
                  <div className="font-semibold">{notification.judul}</div>
                  <div className="text-xs text-gray-600">{notification.isRead ? 'Telah dibaca' : 'Baru'}</div>
                  <div className="text-sm text-slate-600 mt-1">{notification.isi}</div>
                </button>
              ))
            ) : (
              <div className="text-sm text-gray-500">Tidak ada notifikasi</div>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
