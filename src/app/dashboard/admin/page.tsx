import { auth } from '@/auth'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import { prisma } from '@/lib/prisma'
import { ClipboardList, CreditCard, PawPrint, Stethoscope, ShoppingBag, Users } from 'lucide-react'
import PageHeader from '@/components/shared/PageHeader'
import StatsCard from '@/components/shared/StatsCard'

export default async function AdminDashboard() {
  const session = await auth()
  if (!session || (session.user as any)?.role !== 'ADMIN') redirect('/dashboard')
  const [clientCount, dokterCount, hewanCount, appointmentCount, invoiceCount] = await Promise.all([
    prisma.user.count({ where: { role: 'CLIENT' } }),
    prisma.user.count({ where: { role: 'DOKTER' } }),
    prisma.hewan.count(),
    prisma.appointment.count(),
    prisma.invoice.count(),
  ])

  return (
    <div>
      <PageHeader
        title="Admin Dashboard"
        subtitle="Pantau operasional klinik hewan Anda dengan data real-time, navigasi cepat, dan insight yang fokus pada pertumbuhan." 
      />

      <div className="grid gap-4 xl:grid-cols-4">
        <StatsCard icon={<Users size={24} />} label="Pelanggan" value={clientCount} trend={{ direction: 'up', percent: 12, label: 'bulan ini' }} />
        <StatsCard icon={<ClipboardList size={24} />} label="Janji Temu" value={appointmentCount} trend={{ direction: 'up', percent: 8, label: 'dibanding minggu lalu' }} />
        <StatsCard icon={<PawPrint size={24} />} label="Hewan Terdaftar" value={hewanCount} trend={{ direction: 'up', percent: 5, label: 'pertumbuhan' }} />
        <StatsCard icon={<CreditCard size={24} />} label="Invoice" value={invoiceCount} trend={{ direction: 'up', percent: 14, label: 'dibayar' }} />
      </div>

      <section className="mt-8 grid gap-4 lg:grid-cols-3">
        <Link href="/dashboard/admin/appointment" className="group rounded-[1.75rem] border border-slate-200 bg-white p-6 shadow-sm transition hover:-translate-y-0.5 hover:border-teal-300 hover:shadow-[0_20px_50px_rgba(15,23,42,0.08)]">
          <div className="flex items-center justify-between gap-4">
            <div>
              <p className="text-sm text-slate-500">Pantau janji temu</p>
              <h3 className="mt-3 text-lg font-semibold text-slate-900">Appointment</h3>
            </div>
            <ClipboardList size={28} className="text-teal-600" />
          </div>
        </Link>

        <Link href="/dashboard/admin/jadwal-dokter" className="group rounded-[1.75rem] border border-slate-200 bg-white p-6 shadow-sm transition hover:-translate-y-0.5 hover:border-teal-300 hover:shadow-[0_20px_50px_rgba(15,23,42,0.08)]">
          <div className="flex items-center justify-between gap-4">
            <div>
              <p className="text-sm text-slate-500">Atur jadwal dokter</p>
              <h3 className="mt-3 text-lg font-semibold text-slate-900">Jadwal Dokter</h3>
            </div>
            <Stethoscope size={28} className="text-teal-600" />
          </div>
        </Link>

        <Link href="/dashboard/admin/petshop" className="group rounded-[1.75rem] border border-slate-200 bg-white p-6 shadow-sm transition hover:-translate-y-0.5 hover:border-teal-300 hover:shadow-[0_20px_50px_rgba(15,23,42,0.08)]">
          <div className="flex items-center justify-between gap-4">
            <div>
              <p className="text-sm text-slate-500">Kelola penjualan</p>
              <h3 className="mt-3 text-lg font-semibold text-slate-900">Petshop</h3>
            </div>
            <ShoppingBag size={28} className="text-teal-600" />
          </div>
        </Link>
      </section>

      <section className="mt-8 rounded-[1.75rem] border border-slate-200 bg-white p-6 shadow-sm">
        <div className="flex items-center justify-between gap-4">
          <div>
            <p className="text-sm text-slate-500">Data ringkas</p>
            <h3 className="mt-2 text-xl font-semibold text-slate-900">Hewan Terdaftar</h3>
          </div>
          <PawPrint size={26} className="text-teal-600" />
        </div>
        <div className="mt-6 rounded-[1.5rem] bg-slate-50 p-5 text-lg font-semibold text-slate-900">Total hewan: {hewanCount}</div>
      </section>
    </div>
  )
}
