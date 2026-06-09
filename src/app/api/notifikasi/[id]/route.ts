import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { z } from 'zod'

const updateSchema = z.object({
  isRead: z.boolean(),
})

export async function PATCH(req: Request, { params }: { params: { id: string } }) {
  try {
    const body = await req.json()
    const parsed = updateSchema.parse(body)
    const updated = await prisma.notifikasi.update({
      where: { id: params.id },
      data: { isRead: parsed.isRead },
    })
    return NextResponse.json(updated)
  } catch (err: any) {
    return NextResponse.json({ message: err.message || 'Error updating notification' }, { status: 400 })
  }
}
