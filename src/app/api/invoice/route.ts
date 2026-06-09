import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { z } from 'zod'
import { forbidden, getCurrentUserWithRole, unauthorized } from '@/lib/api-auth'
import { logError } from '@/lib/error-logging'

const invoiceItemSchema = z.object({
  inventoryId: z.string().optional(),
  namaItem: z.string().min(1),
  quantity: z.coerce.number().int().min(1),
  unitPrice: z.coerce.number().min(0),
})

const createSchema = z.object({
  customerId: z.string().min(1),
  hewanId: z.string().optional(),
  items: z.array(invoiceItemSchema).min(1),
})

async function generateInvoiceNumber() {
  const now = new Date()
  const datePart = now.toISOString().slice(0, 10).replace(/-/g, '')
  const startOfDay = new Date(`${now.toISOString().slice(0, 10)}T00:00:00.000Z`)
  const endOfDay = new Date(`${now.toISOString().slice(0, 10)}T23:59:59.999Z`)
  const countToday = await prisma.invoice.count({
    where: {
      createdAt: {
        gte: startOfDay,
        lte: endOfDay,
      },
    },
  })
  const sequence = String(countToday + 1).padStart(4, '0')
  return `INV-${datePart}-${sequence}`
}

export async function GET(req: Request) {
  try {
    const token = await getCurrentUserWithRole(req)
    if (!token) return unauthorized()
    if (token.role !== 'ADMIN' && token.role !== 'STAFF') return forbidden()

    const url = new URL(req.url)
    const status = url.searchParams.get('status') as string | null
    const invoices = await prisma.invoice.findMany({
      where: status ? { status } : undefined,
      orderBy: { createdAt: 'desc' },
      include: { customer: true, hewan: true, approvedBy: true, printedBy: true, items: true },
    })

    return NextResponse.json({ data: invoices })
  } catch (error) {
    logError(error, { fileName: 'invoice/route.ts', functionName: 'GET' })
    return NextResponse.json({ message: 'Error fetching invoices' }, { status: 500 })
  }
}

export async function POST(req: Request) {
  try {
    const token = await getCurrentUserWithRole(req)
    if (!token) return unauthorized()
    if (token.role !== 'ADMIN' && token.role !== 'STAFF') return forbidden()

    const body = await req.json()
    const parsed = createSchema.parse(body)
    const total = parsed.items.reduce((sum, item) => sum + item.quantity * item.unitPrice, 0)

    const created = await prisma.invoice.create({
      data: {
        invoiceNumber: await generateInvoiceNumber(),
        customerId: parsed.customerId,
        hewanId: parsed.hewanId,
        total,
        status: 'DRAFT',
        items: {
          create: parsed.items.map((item) => ({
            inventoryId: item.inventoryId,
            namaItem: item.namaItem,
            quantity: item.quantity,
            unitPrice: item.unitPrice,
            subTotal: item.quantity * item.unitPrice,
          })),
        },
      },
      include: { items: true },
    })

    return NextResponse.json(created, { status: 201 })
  } catch (error) {
    logError(error, { fileName: 'invoice/route.ts', functionName: 'POST' })
    return NextResponse.json({ message: error instanceof Error ? error.message : 'Invalid input' }, { status: 400 })
  }
}
