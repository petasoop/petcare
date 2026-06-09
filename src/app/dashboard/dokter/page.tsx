import { auth } from '@/auth'
import { redirect } from 'next/navigation'
import { prisma } from '@/lib/prisma'
import Link from 'next/link'

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
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <p className="text-sm text-slate-500">Selamat datang,</p>
          <h2 className="text-2xl font-semibold text-teal-700">{session.user?.name || 'Dokter'}</h2>
        </div>
        <div className="flex flex-wrap gap-2 text-sm">
          <Link href="/dashboard/dokter/antrian" className="px-3 py-2 rounded bg-teal-600 text-white">Antrian</Link>
          <Link href="/dashboard/dokter/rekam-medis" className="px-3 py-2 rounded bg-white border border-slate-200 text-slate-700">Rekam Medis</Link>
          <Link href="/dashboard/dokter/konsultasi" className="px-3 py-2 rounded bg-white border border-slate-200 text-slate-700">Konsultasi</Link>
        </div>
      </div>

      <div className="mt-6 grid grid-cols-1 gap-4 md:grid-cols-4">
        <div className="rounded-xl bg-white p-4 shadow-sm border border-slate-100">
          <div className="text-sm text-slate-500">Antrian Mendatang</div>
          <div className="mt-2 text-3xl font-semibold text-slate-900">{totalUpcoming}</div>
        </div>
        <div className="rounded-xl bg-white p-4 shadow-sm border border-slate-100">
          <div className="text-sm text-slate-500">Rekam Medis</div>
          <div className="mt-2 text-3xl font-semibold text-slate-900">{totalRecords}</div>
        </div>
        <div className="rounded-xl bg-white p-4 shadow-sm border border-slate-100">
          <div className="text-sm text-slate-500">Jadwal Aktif</div>
          <div className="mt-2 text-3xl font-semibold text-slate-900">{totalSchedules}</div>
        </div>
        <div className="rounded-xl bg-white p-4 shadow-sm border border-slate-100">
          <div className="text-sm text-slate-500">Pesan Masuk/Keluar</div>
          <div className="mt-2 text-3xl font-semibold text-slate-900">{totalMessages}</div>
        </div>
      </div>

      <div className="mt-6 grid grid-cols-1 gap-4 md:grid-cols-3 xl:grid-cols-6">
        <Link href="/dashboard/dokter/antrian" className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm hover:border-teal-300">
          <div className="text-sm text-slate-500">Masuk antrian</div>
          <div className="mt-1 font-semibold text-slate-900">Antrian</div>
        </Link>
        <Link href="/dashboard/dokter/rekam-medis" className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm hover:border-teal-300">
          <div className="text-sm text-slate-500">Catatan klinis</div>
          <div className="mt-1 font-semibold text-slate-900">Rekam Medis</div>
        </Link>
        <Link href="/dashboard/dokter/jadwal" className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm hover:border-teal-300">
          <div className="text-sm text-slate-500">Atur waktu praktek</div>
          <div className="mt-1 font-semibold text-slate-900">Jadwal</div>
        </Link>
        <Link href="/dashboard/dokter/monitoring" className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm hover:border-teal-300">
          <div className="text-sm text-slate-500">Pantau harian</div>
          <div className="mt-1 font-semibold text-slate-900">Monitoring</div>
        </Link>
        <Link href="/dashboard/dokter/konsultasi" className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm hover:border-teal-300">
          <div className="text-sm text-slate-500">Balas chat</div>
          <div className="mt-1 font-semibold text-slate-900">Konsultasi</div>
        </Link>
        <Link href="/dashboard/dokter/riwayat" className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm hover:border-teal-300">
          <div className="text-sm text-slate-500">Lihat histori</div>
          <div className="mt-1 font-semibold text-slate-900">Riwayat</div>
        </Link>
      </div>

      <div className="mt-6 rounded-2xl bg-white p-5 shadow-sm border border-slate-100">
        <h3 className="text-lg font-semibold text-slate-900">Daftar Janji Selanjutnya</h3>
        <div className="mt-4 space-y-3">
          {appointments.length === 0 ? (
            <div className="text-slate-500">Tidak ada janji dalam waktu dekat.</div>
          ) : (
            appointments.map((appointment) => (
              <div key={appointment.id} className="rounded-xl border border-slate-200 p-4">
                <div className="font-semibold text-slate-900">{new Date(appointment.tanggal).toLocaleDateString()} {appointment.waktu}</div>
                <div className="mt-1 text-sm text-slate-600">Hewan: {appointment.hewan?.nama || appointment.hewanId}</div>
                <div className="text-sm text-slate-600">Pemilik: {appointment.pelanggan?.name || '-'}</div>
                <div className="text-sm text-slate-600">Jenis: {appointment.jenis}</div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  )
}
