import { useEffect } from 'react'
import { useQueryClient } from '@tanstack/react-query'

export default function useQueueSSE() {
  const qc = useQueryClient()
  useEffect(() => {
    const es = new EventSource('/api/appointment/sse')
    es.addEventListener('queue:update', (e: any) => {
      try {
        qc.invalidateQueries({ queryKey: ['appointment'] })
      } catch (err) {}
    })
    return () => es.close()
  }, [qc])
}
