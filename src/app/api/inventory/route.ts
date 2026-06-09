import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { z } from 'zod'
import { forbidden, getApiToken, unauthorized } from '@/lib/api-auth'

const createSchema = z.object({ namaItem: z.string(), kategori: z.string(), stok: z.number(), satuan: z.string(), harga: z.number(), stokMinimal: z.number() })

export async function GET(req: Request) {
  try {
    const token = await getApiToken(req)
    if (!token) return unauthorized()
    if (token.role !== 'ADMIN') return forbidden()

    const url = new URL(req.url)
    const page = Number(url.searchParams.get('page') || '1')
    const limit = Number(url.searchParams.get('limit') || '20')
    const skip = (page - 1) * limit
    const [data, total] = await Promise.all([
      prisma.inventory.findMany({ skip, take: limit }),
      prisma.inventory.count(),
    ])
    return NextResponse.json({ data, meta: { page, limit, total } })
  } catch (err) {
    return NextResponse.json({ message: 'Error fetching inventory' }, { status: 500 })
  }
}

export async function POST(req: Request) {
  try {
    const token = await getApiToken(req)
    if (!token) return unauthorized()
    if (token.role !== 'ADMIN') return forbidden()

    const body = await req.json()
    const parsed = createSchema.parse(body)
    const created = await prisma.inventory.create({ data: parsed as any })
    return NextResponse.json(created, { status: 201 })
  } catch (err: any) {
    return NextResponse.json({ message: err.message || 'Invalid input' }, { status: 400 })
  }
}
