import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { generateAppointmentsPdfDocument, createPdfBufferFromDocument } from '@/lib/pdf'
import { forbidden, getApiToken, unauthorized } from '@/lib/api-auth'

export async function GET(req: Request) {
  const token = await getApiToken(req)
  if (!token) return unauthorized()

  const url = new URL(req.url)
  const format = url.searchParams.get('format') || 'pdf'
  const pelangganId = url.searchParams.get('pelangganId')

  if (token.role === 'CLIENT') {
    if (pelangganId && pelangganId !== (token as any).id) return forbidden()
  } else if (token.role !== 'ADMIN' && token.role !== 'DOKTER') {
    return forbidden()
  }

  try {
    const where = token.role === 'CLIENT' ? { pelangganId: pelangganId || (token as any).id } : undefined
    const appointments = await prisma.appointment.findMany({ where, include: { hewan: true, pelanggan: true, dokter: true } })
    if (format === 'xlsx') {
      return NextResponse.json({ data: appointments })
    }

    const doc = generateAppointmentsPdfDocument(appointments)
    const buffer = await createPdfBufferFromDocument(doc)
    return new Response(buffer, { status: 200, headers: { 'Content-Type': 'application/pdf', 'Content-Disposition': 'attachment; filename="laporan-appointments.pdf"' } })
  } catch (err) {
    return NextResponse.json({ message: 'Error generating report' }, { status: 500 })
  }
}
