import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { z } from 'zod'
import { forbidden, getApiToken, getTokenUserId, notFound, unauthorized } from '@/lib/api-auth'

const updateSchema = z.object({ beratBadan: z.number().optional(), suhu: z.number().optional(), nafsuMakan: z.string().optional(), aktivitas: z.string().optional(), catatanGejala: z.string().optional() })

export async function GET(req: Request, { params }: { params: { id: string } }) {
  try {
    const token = await getApiToken(req)
    if (!token) return unauthorized()

    const { id } = params
    const item = await prisma.monitoringHarian.findUnique({ where: { id }, select: { hewan: { select: { pelangganId: true } }, id: true, hewanId: true, tanggal: true, beratBadan: true, suhu: true, nafsuMakan: true, aktivitas: true, catatanGejala: true, createdAt: true } })
    if (!item) return notFound()

    const userId = getTokenUserId(token)
    if (token.role !== 'ADMIN' && token.role !== 'DOKTER' && item.hewan.pelangganId !== userId) return forbidden()

    return NextResponse.json(item)
  } catch (err) {
    return NextResponse.json({ message: 'Error' }, { status: 500 })
  }
}

export async function PUT(req: Request, { params }: { params: { id: string } }) {
  try {
    const token = await getApiToken(req)
    if (!token) return unauthorized()

    const { id } = params
    const item = await prisma.monitoringHarian.findUnique({ where: { id }, select: { hewan: { select: { pelangganId: true } } } })
    if (!item) return notFound()

    const userId = getTokenUserId(token)
    if (token.role !== 'ADMIN' && token.role !== 'DOKTER' && item.hewan.pelangganId !== userId) return forbidden()

    const body = await req.json()
    const parsed = updateSchema.parse(body)
    const updated = await prisma.monitoringHarian.update({ where: { id }, data: parsed as any })
    return NextResponse.json(updated)
  } catch (err: any) {
    return NextResponse.json({ message: err.message || 'Invalid input' }, { status: 400 })
  }
}

export async function DELETE(req: Request, { params }: { params: { id: string } }) {
  try {
    const token = await getApiToken(req)
    if (!token) return unauthorized()

    const { id } = params
    const item = await prisma.monitoringHarian.findUnique({ where: { id }, select: { hewan: { select: { pelangganId: true } } } })
    if (!item) return notFound()

    const userId = getTokenUserId(token)
    if (token.role !== 'ADMIN' && token.role !== 'DOKTER' && item.hewan.pelangganId !== userId) return forbidden()

    await prisma.monitoringHarian.delete({ where: { id } })
    return NextResponse.json({ message: 'Deleted' })
  } catch (err) {
    return NextResponse.json({ message: 'Error deleting' }, { status: 500 })
  }
}
