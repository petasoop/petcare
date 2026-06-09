import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { z } from 'zod'
import bcrypt from 'bcryptjs'
import { forbidden, getCurrentUserWithRole, getTokenUserId, notFound, unauthorized } from '@/lib/api-auth'
import { logError } from '@/lib/error-logging'

const updateSchema = z.object({
  name: z.string().optional(),
  email: z.string().email().optional(),
  phone: z.string().optional(),
  role: z.enum(['ADMIN', 'STAFF', 'DOKTER', 'CLIENT']).optional(),
  password: z.string().min(6).optional(),
})

export async function GET(_: Request, { params }: { params: { id: string } }) {
  try {
    const token = await getCurrentUserWithRole(_)
    if (!token) return unauthorized()
    if (token.role !== 'ADMIN' && getTokenUserId(token) !== params.id) return forbidden()

    const user = await prisma.user.findUnique({
      where: { id: params.id },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        phone: true,
        avatar: true,
        createdAt: true,
        updatedAt: true,
      },
    })
    if (!user) return notFound()
    return NextResponse.json(user)
  } catch (error) {
    logError(error, { fileName: 'users/[id]/route.ts', functionName: 'GET' })
    return NextResponse.json({ message: 'Error fetching user' }, { status: 500 })
  }
}

export async function PUT(req: Request, { params }: { params: { id: string } }) {
  try {
    const token = await getCurrentUserWithRole(req)
    if (!token) return unauthorized()
    if (token.role !== 'ADMIN' && getTokenUserId(token) !== params.id) return forbidden()

    const body = await req.json()
    const parsed = updateSchema.parse(body)
    const data = { ...parsed }

    if (parsed.password) {
      const salt = await bcrypt.genSalt(10)
      data.password = await bcrypt.hash(parsed.password, salt)
    }

    const updated = await prisma.user.update({ where: { id: params.id }, data })
    return NextResponse.json(updated)
  } catch (error) {
    logError(error, { fileName: 'users/[id]/route.ts', functionName: 'PUT' })
    return NextResponse.json({ message: error instanceof Error ? error.message : 'Invalid input' }, { status: 400 })
  }
}

export async function DELETE(_: Request, { params }: { params: { id: string } }) {
  try {
    const token = await getCurrentUserWithRole(_)
    if (!token) return unauthorized()
    if (token.role !== 'ADMIN') return forbidden()
    await prisma.user.delete({ where: { id: params.id } })
    return NextResponse.json({ message: 'Deleted' })
  } catch (error) {
    logError(error, { fileName: 'users/[id]/route.ts', functionName: 'DELETE' })
    return NextResponse.json({ message: 'Error deleting' }, { status: 500 })
  }
}
