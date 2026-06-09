"use client"
import Link from 'next/link'
import React from 'react'

const NAV_LINKS: Record<string, { label: string; href: string }[]> = {
  ADMIN: [
    { label: 'Dashboard', href: '/dashboard/admin' },
    { label: 'Users', href: '/dashboard/admin/users' },
    { label: 'Inventory', href: '/dashboard/admin/inventory' },
    { label: 'Reports', href: '/dashboard/admin/reports' },
  ],
  DOKTER: [
    { label: 'Dashboard', href: '/dashboard/dokter' },
    { label: 'Antrian', href: '/dashboard/dokter' },
    { label: 'Rekam Medis', href: '/dashboard/dokter' },
  ],
  PELANGGAN: [
    { label: 'Dashboard', href: '/dashboard/pelanggan' },
    { label: 'Hewan', href: '/dashboard/pelanggan/hewan' },
    { label: 'Appointment', href: '/dashboard/pelanggan/appointment' },
    { label: 'Konsultasi', href: '/dashboard/pelanggan/konsultasi' },
  ],
}

export default function Sidebar({ role }: { role: string }) {
  const links = NAV_LINKS[role] || NAV_LINKS.PELANGGAN

  return (
    <aside className="w-64 bg-white border-r p-4 hidden md:block">
      <div className="mb-6 text-xl font-semibold text-teal-700">Klinik Hewan</div>
      <nav className="space-y-2">
        {links.map((link) => (
          <Link key={link.href} href={link.href} className="block px-3 py-2 rounded hover:bg-teal-50 text-sm font-medium text-slate-700">
            {link.label}
          </Link>
        ))}
      </nav>
      <div className="mt-8 pt-6 border-t text-sm text-slate-500">Silakan pilih menu di atas untuk mengelola klinik.</div>
    </aside>
  )
}
