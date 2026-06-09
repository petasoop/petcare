"use client"

import React, { useState } from 'react'
import { useSession } from 'next-auth/react'
import { useNotifikasi, useMarkRead } from '@/hooks/useNotifikasi'
import type { Notifikasi, SessionUser } from '@/types'
import { Bell, CheckCircle2, Inbox, X } from 'lucide-react'

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
      <button
        type="button"
        onClick={toggleOpen}
        className="relative inline-flex h-11 w-11 items-center justify-center rounded-2xl border border-slate-200 bg-white text-slate-700 transition hover:bg-slate-50 hover:text-teal-700"
      >
        <Bell size={20} />
        {unreadCount > 0 && <span className="absolute -top-1 -right-1 inline-flex h-3 w-3 items-center justify-center rounded-full bg-rose-500 text-[10px] text-white shadow-sm" />}
      </button>

      {open && (
        <div className="absolute right-0 z-50 mt-3 w-96 overflow-hidden rounded-[1.5rem] border border-slate-200 bg-white shadow-[0_24px_80px_rgba(15,23,42,0.12)]">
          <div className="flex items-center justify-between gap-3 border-b border-slate-200/80 bg-slate-50 px-5 py-4">
            <div className="flex items-center gap-3">
              <span className="inline-flex h-11 w-11 items-center justify-center rounded-2xl bg-teal-500/10 text-teal-700">
                <Inbox size={18} />
              </span>
              <div>
                <div className="text-sm font-semibold text-slate-900">Notifikasi</div>
                <p className="text-xs text-slate-500">{unreadCount} belum dibaca</p>
              </div>
            </div>
            <button
              type="button"
              onClick={async () => {
                await Promise.all(
                  notifications
                    .filter((notification: Notifikasi) => !notification.isRead)
                    .map((notification: Notifikasi) => markRead.mutateAsync(notification.id))
                )
              }}
              disabled={markRead.status === 'pending' || unreadCount === 0}
              className="rounded-2xl px-4 py-2 text-xs font-semibold text-teal-700 transition hover:bg-teal-50 disabled:text-slate-300 disabled:hover:bg-transparent"
            >
              Tandai semua dibaca
            </button>
          </div>
          <div className="max-h-80 space-y-1 overflow-y-auto p-3">
            {isLoading ? (
              <div className="flex items-center gap-2 rounded-3xl bg-slate-100 px-4 py-4 text-sm text-slate-600">
                <span className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-slate-200">
                  <X size={14} />
                </span>
                Memuat notifikasi...
              </div>
            ) : notifications.length ? (
              notifications.map((notification: Notifikasi) => (
                <button
                  key={notification.id}
                  type="button"
                  onClick={() => markRead.mutateAsync(notification.id)}
                  className={`w-full rounded-[1.5rem] border px-4 py-4 text-left transition ${
                    notification.isRead ? 'border-slate-200 bg-white hover:border-slate-300' : 'border-teal-100 bg-teal-50 text-slate-900 hover:bg-teal-100'
                  }`}
                >
                  <div className="flex items-center justify-between gap-3">
                    <div className="text-sm font-semibold">{notification.judul}</div>
                    {notification.isRead ? <CheckCircle2 size={16} className="text-slate-400" /> : <span className="inline-flex rounded-full bg-rose-500 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-[0.18em] text-white">Baru</span>}
                  </div>
                  <p className="mt-1 text-sm leading-6 text-slate-600">{notification.isi}</p>
                </button>
              ))
            ) : (
              <div className="rounded-[1.5rem] bg-slate-100 p-5 text-sm text-slate-500">
                Tidak ada notifikasi baru.
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
