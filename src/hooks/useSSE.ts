import { useEffect } from 'react'
import { useQueryClient } from '@tanstack/react-query'

export default function useSSE(userId?: string, onMessage?: (payload: any) => void) {
  const qc = useQueryClient()

  useEffect(() => {
    if (!userId) return
    const es = new EventSource(`/api/konsultasi/sse?userId=${userId}`)
    es.addEventListener('message', (e: any) => {
      try {
        const payload = JSON.parse(e.data)
        qc.invalidateQueries({ queryKey: ['konsultasi', { userId }] })
        onMessage?.(payload)
      } catch (err) {
        // ignore
      }
    })
    return () => es.close()
  }, [userId, qc, onMessage])
}
