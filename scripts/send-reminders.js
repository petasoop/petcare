/**
 * Simple script to trigger appointment reminders.
 * Run with: `npm run send-reminders` from project root.
 */
const url = process.env.NOW_URL || process.env.NEXTAUTH_URL || 'http://localhost:3000'

async function run() {
  try {
    const res = await fetch(`${url}/api/appointments/send-reminders`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ hours: 24 }),
    })
    const data = await res.json()
    console.log('send-reminders result:', data)
  } catch (err) {
    console.error('Failed to send reminders:', err)
    process.exitCode = 1
  }
}

run()
