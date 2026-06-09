import { auth } from '@/auth'
import { redirect } from 'next/navigation'
import { prisma } from '@/lib/prisma'
import Link from 'next/link'
import { CalendarDays, ClipboardList, Package, ShoppingBag, CreditCard } from 'lucide-react'
import PageHeader from '@/components/shared/PageHeader'
import StatsCard from '@/components/shared/StatsCard'

export default async function StaffDashboard() {
  const session = await auth()
  if (!session || (session.user as any)?.role !== 'STAFF') redirect('/dashboard')

  const [appointmentCount, inventoryCount] = await Promise.all([
    prisma.appointment.count(),
    prisma.inventory.count(),
  ])

  return (
    <div>
      <PageHeader title="Staff Dashboard" subtitle="Selesaikan tugas harian Anda dengan kontrol operasional yang mudah dijangkau dan statistik ringkas." />

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <StatsCard icon={<CalendarDays size={24} />} label="Appointment" value={appointmentCount} trend={{ direction: 'up', percent: 6, label: 'minggu ini' }} />
        <StatsCard icon={<Package size={24} />} label="Inventory" value={inventoryCount} trend={{ direction: 'up', percent: 4, label: 'stok aktif' }} />
      </div>

      <section className="mt-8 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <Link href="/dashboard/staff/appointment" className="group rounded-[1.75rem] border border-slate-200 bg-white p-6 shadow-sm transition hover:-translate-y-0.5 hover:border-teal-300 hover:shadow-[0_20px_50px_rgba(15,23,42,0.08)]">
          <div className="flex items-center justify-between gap-4">
            <div>
              <p className="text-sm text-slate-500">Atur jadwal janji</p>
              <h3 className="mt-3 text-lg font-semibold text-slate-900">Appointment</h3>
            </div>
            <ClipboardList size={28} className="text-teal-600" />
          </div>
        </Link>

        <Link href="/dashboard/staff/inventory" className="group rounded-[1.75rem] border border-slate-200 bg-white p-6 shadow-sm transition hover:-translate-y-0.5 hover:border-teal-300 hover:shadow-[0_20px_50px_rgba(15,23,42,0.08)]">
          <div className="flex items-center justify-between gap-4">
            <div>
              <p className="text-sm text-slate-500">Kelola produk</p>
              <h3 className="mt-3 text-lg font-semibold text-slate-900">Inventory</h3>
            </div>
            <Package size={28} className="text-teal-600" />
          </div>
        </Link>

        <Link href="/dashboard/staff/petshop" className="group rounded-[1.75rem] border border-slate-200 bg-white p-6 shadow-sm transition hover:-translate-y-0.5 hover:border-teal-300 hover:shadow-[0_20px_50px_rgba(15,23,42,0.08)]">
          <div className="flex items-center justify-between gap-4">
            <div>
              <p className="text-sm text-slate-500">Kelola penjualan</p>
              <h3 className="mt-3 text-lg font-semibold text-slate-900">Petshop</h3>
            </div>
            <ShoppingBag size={28} className="text-teal-600" />
          </div>
        </Link>

        <Link href="/dashboard/staff/invoice" className="group rounded-[1.75rem] border border-slate-200 bg-white p-6 shadow-sm transition hover:-translate-y-0.5 hover:border-teal-300 hover:shadow-[0_20px_50px_rgba(15,23,42,0.08)]">
          <div className="flex items-center justify-between gap-4">
            <div>
              <p className="text-sm text-slate-500">Kelola faktur</p>
              <h3 className="mt-3 text-lg font-semibold text-slate-900">Invoice</h3>
            </div>
            <CreditCard size={28} className="text-teal-600" />
          </div>
        </Link>
      </section>
    </div>
  )
}
