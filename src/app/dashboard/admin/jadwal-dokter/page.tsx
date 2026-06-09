import { auth } from '@/auth'
import { redirect } from 'next/navigation'
import AdminJadwalManager from '@/components/dashboard/admin/AdminJadwalManager'

export default async function AdminJadwalDokterPage() {
  const session = await auth()
  if (!session || (session.user as any)?.role !== 'ADMIN') redirect('/dashboard')

  return (
    <div>
      <h2 className="text-2xl font-semibold text-teal-700">Jadwal Dokter</h2>
      <p className="mt-1 text-sm text-slate-500">Semua jadwal praktek yang terdaftar.</p>
      <div className="mt-6 space-y-4">
        {schedules.length === 0 ? (
          <div className="rounded-xl bg-white p-4 shadow-sm border border-slate-100">Belum ada jadwal dokter.</div>
        ) : (
          schedules.map((schedule) => (
            <div key={schedule.id} className="rounded-xl bg-white p-4 shadow-sm border border-slate-100">
              <div className="font-semibold text-slate-900">{schedule.dokter?.name || schedule.dokterId}</div>
              <div className="mt-1 text-sm text-slate-600">{schedule.hari} • {schedule.jamMulai} - {schedule.jamSelesai}</div>
              <div className="text-sm text-slate-600">Status: {schedule.isAktif ? 'Aktif' : 'Nonaktif'}</div>
            </div>
          ))
        )}
      </div>
    </div>
  )
}