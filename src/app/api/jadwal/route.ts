import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { z } from 'zod'
import { forbidden, getApiToken, getTokenUserId, unauthorized } from '@/lib/api-auth'

const createSchema = z.object({ dokterId: z.string(), hari: z.string(), jamMulai: z.string(), jamSelesai: z.string(), isAktif: z.boolean().optional() })

export async function GET(req: Request) {
  try {
    const token = await getApiToken(req)
    if (!token) return unauthorized()

    const url = new URL(req.url)
    const dokterId = url.searchParams.get('dokterId')
    const where: any = {}

    if (token.role === 'ADMIN' || token.role === 'DOKTER') {
      if (dokterId) where.dokterId = dokterId
      if (token.role === 'DOKTER' && !dokterId) where.dokterId = getTokenUserId(token)
    } else {
      return forbidden()
    }

    const data = await prisma.jadwalDokter.findMany({ where })
    return NextResponse.json({ data })
  } catch (err) {
    return NextResponse.json({ message: 'Error fetching jadwal' }, { status: 500 })
  }
}

export async function POST(req: Request) {
  try {
    const token = await getApiToken(req)
    if (!token) return unauthorized()
    if (token.role !== 'ADMIN') return forbidden()

    const body = await req.json()
    const parsed = createSchema.parse(body)
    const created = await prisma.jadwalDokter.create({ data: parsed as any })
    return NextResponse.json(created, { status: 201 })
  } catch (err: any) {
    return NextResponse.json({ message: err.message || 'Invalid input' }, { status: 400 })
  }
}
