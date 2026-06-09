import { auth } from '@/auth'
import { redirect } from 'next/navigation'
import AdminAppointmentManager from '@/components/dashboard/admin/AdminAppointmentManager'

export default async function AdminAppointmentPage() {
  const session = await auth()
  if (!session || (session.user as any)?.role !== 'ADMIN') redirect('/dashboard')

  return (
    <div>
      <h2 className="text-2xl font-semibold text-teal-700">Appointment</h2>
      <p className="mt-1 text-sm text-slate-500">Daftar appointment terbaru di seluruh klinik.</p>
      <AdminAppointmentManager />
    </div>
  )
}