import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { generateAppointmentsPdfDocument, createPdfBufferFromDocument } from '@/lib/pdf'
import { forbidden, getApiToken, unauthorized } from '@/lib/api-auth'

export async function GET(req: Request) {
  const token = await getApiToken(req)
  if (!token) return unauthorized()
  if (token.role !== 'ADMIN' && token.role !== 'DOKTER') return forbidden()

  const url = new URL(req.url)
  const format = url.searchParams.get('format') || 'pdf'
  try {
    const appointments = await prisma.appointment.findMany({ include: { hewan: true, pelanggan: true, dokter: true } })
    if (format === 'xlsx') {
      // return JSON for now; client can call XLSX export endpoint
      return NextResponse.json({ data: appointments })
    }

    const doc = generateAppointmentsPdfDocument(appointments)
    const buffer = await createPdfBufferFromDocument(doc)
    return new Response(buffer, { status: 200, headers: { 'Content-Type': 'application/pdf', 'Content-Disposition': 'attachment; filename="laporan-appointments.pdf"' } })
  } catch (err) {
    return NextResponse.json({ message: 'Error generating report' }, { status: 500 })
  }
}
