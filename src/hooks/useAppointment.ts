'use client'

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import type { UseQueryResult, UseMutationResult } from '@tanstack/react-query'
import type { Appointment, ApiPaginatedResponse, AppointmentCreateInput } from '@/types'

const fetchAppointments = async (
  page = 1,
  limit = 20,
  pelangganId?: string,
  dokterId?: string
): Promise<ApiPaginatedResponse<Appointment>> => {
  const params = new URLSearchParams({ page: String(page), limit: String(limit) })
  if (pelangganId) params.set('pelangganId', pelangganId)
  if (dokterId) params.set('dokterId', dokterId)
  const res = await fetch(`/api/appointment?${params.toString()}`)
  if (!res.ok) throw new Error('Error fetching appointments')
  return res.json()
}

interface UseAppointmentParams {
  page?: number
  limit?: number
  pelangganId?: string
  dokterId?: string
}

export function useAppointment({
  page = 1,
  limit = 20,
  pelangganId,
  dokterId,
}: UseAppointmentParams = {}): UseQueryResult<ApiPaginatedResponse<Appointment>, Error> {
  return useQuery<ApiPaginatedResponse<Appointment>, Error>({
    queryKey: ['appointment', page, limit, pelangganId, dokterId],
    queryFn: () => fetchAppointments(page, limit, pelangganId, dokterId),
  })
}

export function useCreateAppointment(): UseMutationResult<Appointment, Error, AppointmentCreateInput> {
  const qc = useQueryClient()
  return useMutation<Appointment, Error, AppointmentCreateInput>({
    mutationFn: async (data: AppointmentCreateInput) => {
      const res = await fetch('/api/appointment', {
        method: 'POST',
        body: JSON.stringify(data),
        headers: { 'Content-Type': 'application/json' },
      })
      if (!res.ok) throw new Error('Error creating appointment')
      return res.json()
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ['appointment'] }),
  })
}
