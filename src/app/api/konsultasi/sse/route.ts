import { NextResponse } from 'next/server'
import { sseService } from '../../../../lib/sse'
import { getApiToken, getTokenUserId, unauthorized } from '@/lib/api-auth'

export async function GET(req: Request) {
  const token = await getApiToken(req)
  if (!token) return unauthorized()

  const url = new URL(req.url)
  const requestedUserId = url.searchParams.get('userId')
  if (requestedUserId === 'global' && token.role !== 'ADMIN') return unauthorized()

  const userId = requestedUserId === 'global' ? 'global' : getTokenUserId(token)

  const stream = new ReadableStream({
    start(controller) {
      const send = (data: any) => {
        try {
          controller.enqueue(encodeEvent(data))
        } catch (e) {
          // ignore
        }
      }

      const handler = (payload: any) => {
        if (!userId) return
        // send only events targeted to this user
        send({ event: 'message', data: JSON.stringify(payload) })
      }

        sseService.subscribe(`message:${userId}`, handler)
        if (userId === 'global') {
          sseService.subscribe('message:global', handler)
        }

      // keep-alive
      const iv = setInterval(() => controller.enqueue(encodeEvent({ event: 'ping', data: JSON.stringify({ t: Date.now() }) })), 20000)

      controller.close = () => {
        clearInterval(iv)
      }
    }
  })

  return new Response(stream, {
    headers: {
      'Content-Type': 'text/event-stream',
      Connection: 'keep-alive',
      'Cache-Control': 'no-cache',
    },
  })
}

function encodeEvent(event: { event?: string; data: any }) {
  const lines = []
  if (event.event) lines.push(`event: ${event.event}`)
  const payload = typeof event.data === 'string' ? event.data : JSON.stringify(event.data)
  payload.split('\n').forEach((line: string) => lines.push(`data: ${line}`))
  lines.push('\n')
  return new TextEncoder().encode(lines.join('\n'))
}
