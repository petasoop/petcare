import { auth } from '@/auth'
import { redirect } from 'next/navigation'
import { prisma } from '@/lib/prisma'
import Link from 'next/link'
import { Activity, CalendarDays, MessageCircle, Stethoscope } from 'lucide-react'
import PageHeader from '@/components/shared/PageHeader'
import StatsCard from '@/components/shared/StatsCard'

export default async function DokterDashboard() {
  const session = await auth()
  if (!session || (session.user as any)?.role !== 'DOKTER') redirect('/dashboard')
  const dokterId = (session?.user as any)?.id
  const today = new Date()
  const [appointments, totalUpcoming, totalRecords, totalSchedules, totalMessages] = await Promise.all([
    prisma.appointment.findMany({
      where: { dokterId, tanggal: { gte: today } },
      orderBy: { tanggal: 'asc' },
      take: 5,
      include: { hewan: true, pelanggan: true },
    }),
    prisma.appointment.count({ where: { dokterId, tanggal: { gte: today } } }),
    prisma.rekamMedis.count({ where: { dokterId } }),
    prisma.jadwalDokter.count({ where: { dokterId, isAktif: true } }),
    prisma.pesan.count({ where: { OR: [{ senderId: dokterId }, { receiverId: dokterId }] } }),
  ])

  return (
    <div>
      <PageHeader
        title={`Halo, ${session.user?.name || 'Dokter'}`}
        subtitle="Kelola jadwal, rekam medis, dan komunikasi pasien dari satu panel yang fokus pada pelayanan klinik Anda."
      />

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <StatsCard icon={<CalendarDays size={24} />} label="Antrian" value={totalUpcoming} trend={{ direction: 'up', percent: 10, label: 'hari ini' }} />
        <StatsCard icon={<Stethoscope size={24} />} label="Rekam Medis" value={totalRecords} trend={{ direction: 'up', percent: 8, label: 'bulan ini' }} />
        <StatsCard icon={<Activity size={24} />} label="Jadwal Aktif" value={totalSchedules} trend={{ direction: 'up', percent: 5, label: 'aktif' }} />
        <StatsCard icon={<MessageCircle size={24} />} label="Pesan" value={totalMessages} trend={{ direction: 'up', percent: 3, label: 'baru' }} />
      </div>

      <section className="mt-8 grid gap-4 lg:grid-cols-3">
        <Link href="/dashboard/dokter/antrian" className="group rounded-[1.75rem] border border-slate-200 bg-white p-6 shadow-sm transition hover:-translate-y-0.5 hover:border-teal-300 hover:shadow-[0_20px_50px_rgba(15,23,42,0.08)]">
          <div className="flex items-center justify-between gap-4">
            <div>
              <p className="text-sm text-slate-500">Kelola antrean</p>
              <h3 className="mt-3 text-lg font-semibold text-slate-900">Antrian</h3>
            </div>
            <Activity size={28} className="text-teal-600" />
          </div>
        </Link>

        <Link href="/dashboard/dokter/rekam-medis" className="group rounded-[1.75rem] border border-slate-200 bg-white p-6 shadow-sm transition hover:-translate-y-0.5 hover:border-teal-300 hover:shadow-[0_20px_50px_rgba(15,23,42,0.08)]">
          <div className="flex items-center justify-between gap-4">
            <div>
              <p className="text-sm text-slate-500">Buka catatan pasien</p>
              <h3 className="mt-3 text-lg font-semibold text-slate-900">Rekam Medis</h3>
            </div>
            <Stethoscope size={28} className="text-teal-600" />
          </div>
        </Link>

        <Link href="/dashboard/dokter/monitoring" className="group rounded-[1.75rem] border border-slate-200 bg-white p-6 shadow-sm transition hover:-translate-y-0.5 hover:border-teal-300 hover:shadow-[0_20px_50px_rgba(15,23,42,0.08)]">
          <div className="flex items-center justify-between gap-4">
            <div>
              <p className="text-sm text-slate-500">Pantau perkembangan</p>
              <h3 className="mt-3 text-lg font-semibold text-slate-900">Monitoring</h3>
            </div>
            <CalendarDays size={28} className="text-teal-600" />
          </div>
        </Link>
      </section>

      <section className="mt-8 rounded-[1.75rem] border border-slate-200 bg-white p-6 shadow-sm">
        <div className="flex items-center justify-between gap-4">
          <div>
            <h3 className="text-lg font-semibold text-slate-900">Janji Mendatang</h3>
            <p className="text-sm text-slate-500">5 janji terdekat berdasarkan jadwal Anda.</p>
          </div>
          <span className="inline-flex rounded-full bg-teal-50 px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-teal-700">{appointments.length} item</span>
        </div>

        <div className="mt-6 grid gap-4">
          {appointments.length === 0 ? (
            <div className="rounded-[1.5rem] border border-dashed border-slate-200 bg-slate-50 p-6 text-sm text-slate-500">Tidak ada janji dalam waktu dekat.</div>
          ) : (
            appointments.map((appointment) => (
              <div key={appointment.id} className="rounded-[1.5rem] border border-slate-200 bg-slate-50 p-5 shadow-sm transition hover:border-teal-300 hover:bg-white">
                <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                  <div>
                    <p className="text-sm text-teal-700">{new Date(appointment.tanggal).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}</p>
                    <h4 className="mt-1 text-lg font-semibold text-slate-900">{appointment.waktu}</h4>
                  </div>
                  <div className="rounded-3xl bg-white px-4 py-2 text-xs font-semibold uppercase tracking-[0.2em] text-slate-600 shadow-sm">{appointment.jenis}</div>
                </div>
                <div className="mt-4 grid gap-2 sm:grid-cols-2">
                  <div className="rounded-3xl bg-white p-4 text-sm text-slate-700">Hewan: <span className="font-semibold text-slate-900">{appointment.hewan?.nama || appointment.hewanId}</span></div>
                  <div className="rounded-3xl bg-white p-4 text-sm text-slate-700">Pemilik: <span className="font-semibold text-slate-900">{appointment.pelanggan?.name || '-'}</span></div>
                </div>
              </div>
            ))
          )}
        </div>
      </section>
    </div>
  )
}
