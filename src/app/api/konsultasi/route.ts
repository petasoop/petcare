import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { z } from 'zod'
import { forbidden, getApiToken, getTokenUserId, notFound, unauthorized } from '@/lib/api-auth'

const createSchema = z.object({
  receiverId: z.string(),
  appointmentId: z.string().optional(),
  isi: z.string(),
})

export async function GET(req: Request) {
  try {
    const token = await getApiToken(req)
    if (!token) return unauthorized()

    const userId = getTokenUserId(token)
    const role = token.role
    const url = new URL(req.url)
    const appointmentId = url.searchParams.get('appointmentId')
    const peerId = url.searchParams.get('peerId') || url.searchParams.get('senderId')
    const where: any = {}

    if (appointmentId) {
      const appointment = await prisma.appointment.findUnique({
        where: { id: appointmentId },
        select: { pelangganId: true, dokterId: true },
      })
      if (!appointment) return notFound('Appointment not found')
      if (role !== 'ADMIN' && userId !== appointment.pelangganId && userId !== appointment.dokterId) return forbidden()
      where.appointmentId = appointmentId
    } else if (peerId) {
      where.OR = [
        { senderId: userId, receiverId: peerId },
        { senderId: peerId, receiverId: userId },
      ]
    } else {
      where.OR = [{ senderId: userId }, { receiverId: userId }]
    }

    const data = await prisma.pesan.findMany({ where, orderBy: { createdAt: 'asc' } })
    return NextResponse.json({ data })
  } catch (err) {
    return NextResponse.json({ message: 'Error fetching messages' }, { status: 500 })
  }
}

export async function POST(req: Request) {
  try {
    const token = await getApiToken(req)
    if (!token) return unauthorized()

    const senderId = getTokenUserId(token)
    if (!senderId) return unauthorized()

    const body = await req.json()
    const parsed = createSchema.parse(body)

    if (parsed.appointmentId) {
      const appointment = await prisma.appointment.findUnique({
        where: { id: parsed.appointmentId },
        select: { pelangganId: true, dokterId: true },
      })
      if (!appointment) return notFound('Appointment not found')
      if (token.role !== 'ADMIN' && senderId !== appointment.pelangganId && senderId !== appointment.dokterId) return forbidden()
    }

    const created = await prisma.pesan.create({ data: { ...parsed, senderId } as any })

    // publish via SSE
    try {
      const { sseService } = await import('../../../lib/sse')
      sseService.publish({ type: `message:${parsed.receiverId}`, payload: created })
      sseService.publish({ type: `message:global`, payload: created })
    } catch (e) {
      // ignore
    }

    return NextResponse.json(created, { status: 201 })
  } catch (err: any) {
    return NextResponse.json({ message: err.message || 'Invalid input' }, { status: 400 })
  }
}
