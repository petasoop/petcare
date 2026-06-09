import { NextResponse } from 'next/server'
import sendUpcomingAppointmentReminders from '@/lib/reminders'
import { forbidden, getApiToken, unauthorized } from '@/lib/api-auth'

export async function POST(req: Request) {
  try {
    const token = await getApiToken(req)
    if (!token) return unauthorized()
    if (token.role !== 'ADMIN') return forbidden()

    const body = await req.json().catch(() => ({}))
    const hours = Number(body.hours || 24)
    const result = await sendUpcomingAppointmentReminders(hours)
    return NextResponse.json({ message: 'Reminders sent', ...result })
  } catch (err) {
    return NextResponse.json({ message: 'Error sending reminders' }, { status: 500 })
  }
}
