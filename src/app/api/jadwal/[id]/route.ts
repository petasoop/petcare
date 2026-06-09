import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { z } from 'zod'
import { forbidden, getApiToken, getTokenUserId, notFound, unauthorized } from '@/lib/api-auth'

const updateSchema = z.object({
  hari: z.string().optional(),
  jamMulai: z.string().optional(),
  jamSelesai: z.string().optional(),
  isAktif: z.boolean().optional(),
})

export async function PUT(req: Request, { params }: { params: { id: string } }) {
  try {
    const token = await getApiToken(req)
    if (!token) return unauthorized()

    const jadwal = await prisma.jadwalDokter.findUnique({ where: { id: params.id }, select: { dokterId: true } })
    if (!jadwal) return notFound()
    if (token.role !== 'ADMIN' && token.role !== 'DOKTER') return forbidden()
    if (token.role === 'DOKTER' && getTokenUserId(token) !== jadwal.dokterId) return forbidden()

    const body = await req.json()
    const parsed = updateSchema.parse(body)
    const updated = await prisma.jadwalDokter.update({ where: { id: params.id }, data: parsed })
    return NextResponse.json(updated)
  } catch (err: any) {
    return NextResponse.json({ message: err.message || 'Invalid input' }, { status: 400 })
  }
}

export async function DELETE(req: Request, { params }: { params: { id: string } }) {
  try {
    const token = await getApiToken(req)
    if (!token) return unauthorized()

    const jadwal = await prisma.jadwalDokter.findUnique({ where: { id: params.id }, select: { dokterId: true } })
    if (!jadwal) return notFound()
    if (token.role !== 'ADMIN' && token.role !== 'DOKTER') return forbidden()
    if (token.role === 'DOKTER' && getTokenUserId(token) !== jadwal.dokterId) return forbidden()

    await prisma.jadwalDokter.delete({ where: { id: params.id } })
    return NextResponse.json({ message: 'Deleted' })
  } catch (err) {
    return NextResponse.json({ message: 'Error deleting jadwal' }, { status: 500 })
  }
}
