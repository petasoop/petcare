import { auth } from '@/auth'
import { redirect } from 'next/navigation'
import { prisma } from '@/lib/prisma'

export default async function DokterKonsultasiPage() {
  const session = await auth()
  if (!session || (session.user as any)?.role !== 'DOKTER') redirect('/dashboard')

  const dokterId = (session.user as any)?.id as string
  const messages = await prisma.pesan.findMany({
    where: { OR: [{ senderId: dokterId }, { receiverId: dokterId }] },
    include: { sender: true, receiver: true, appointment: true },
    orderBy: { createdAt: 'desc' },
    take: 20,
  })

  return (
    <div>
      <h2 className="text-2xl font-semibold text-teal-700">Konsultasi</h2>
      <p className="mt-1 text-sm text-slate-500">Daftar pesan terbaru yang melibatkan akun Anda.</p>
      <div className="mt-6 space-y-3">
        {messages.length === 0 ? (
          <div className="rounded-xl bg-white p-4 shadow-sm border border-slate-100">Belum ada percakapan.</div>
        ) : (
          messages.map((message) => (
            <div key={message.id} className="rounded-xl bg-white p-4 shadow-sm border border-slate-100">
              <div className="font-semibold text-slate-900">{message.sender.name} → {message.receiver.name}</div>
              <div className="mt-1 text-sm text-slate-600">{message.isi}</div>
              <div className="text-xs text-slate-400">{new Date(message.createdAt).toLocaleString()}</div>
            </div>
          ))
        )}
      </div>
    </div>
  )
}