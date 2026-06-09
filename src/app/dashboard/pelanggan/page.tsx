"use client"

import React from 'react'
import { useSession } from 'next-auth/react'
import { useHewan } from '@/hooks/useHewan'
import { useAppointment } from '@/hooks/useAppointment'
import { useNotifikasi } from '@/hooks/useNotifikasi'

export default function PelangganHome() {
  const { data: session, status } = useSession()
  const userId = (session?.user as any)?.id
  const { data: hewanData } = useHewan(1, 20, userId)
  const { data: appointmentData } = useAppointment({ pelangganId: userId })
  const { data: notifikasiData } = useNotifikasi(userId)

  const hewanCount = (hewanData as { data: any[] } | undefined)?.data?.length || 0
  const appointmentCount = (appointmentData as { data: any[] } | undefined)?.data?.length || 0
  const unreadNotifications = (notifikasiData as { data: any[] } | undefined)?.data?.filter((n) => !n.isRead).length || 0

  if (status === 'loading') return <div>Memuat data...</div>

  return (
    <div>
      <h2 className="text-2xl font-semibold text-teal-700">Selamat datang, {session?.user?.name || 'Pelanggan'}</h2>
      <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="p-4 bg-white rounded shadow">Total Hewan: {hewanCount}</div>
        <div className="p-4 bg-white rounded shadow">Upcoming Appointment: {appointmentCount}</div>
        <div className="p-4 bg-white rounded shadow">Unread Notifications: {unreadNotifications}</div>
      </div>
    </div>
  )
}
