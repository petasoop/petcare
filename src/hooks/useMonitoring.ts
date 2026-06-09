'use client'

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import type { UseQueryResult, UseMutationResult } from '@tanstack/react-query'
import type { MonitoringHarian, MonitoringHarianCreateInput } from '@/types'

interface MonitoringResponse {
  data: MonitoringHarian[]
}

const fetchMonitoring = async (hewanId: string): Promise<MonitoringResponse> => {
  const res = await fetch(`/api/monitoring?hewanId=${hewanId}`)
  if (!res.ok) throw new Error('Error fetching monitoring')
  return res.json()
}

export function useMonitoring(hewanId?: string): UseQueryResult<MonitoringResponse, Error> {
  return useQuery<MonitoringResponse, Error>({
    queryKey: ['monitoring', hewanId],
    queryFn: () => fetchMonitoring(hewanId || ''),
    enabled: !!hewanId,
  })
}

export function useCreateMonitoring(): UseMutationResult<MonitoringHarian, Error, MonitoringHarianCreateInput> {
  const qc = useQueryClient()
  return useMutation<MonitoringHarian, Error, MonitoringHarianCreateInput>({
    mutationFn: async (data: MonitoringHarianCreateInput) => {
      const res = await fetch('/api/monitoring', {
        method: 'POST',
        body: JSON.stringify(data),
        headers: { 'Content-Type': 'application/json' },
      })
      if (!res.ok) throw new Error('Error creating monitoring')
      return res.json()
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ['monitoring'] }),
  })
}
