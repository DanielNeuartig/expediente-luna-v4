'use client'

import { useQuery } from '@tanstack/react-query'

export function useExpedienteMedico(expedienteId?: number) {
  const enabled = !!expedienteId

  const query = useQuery({
    queryKey: ['expediente', expedienteId],
    queryFn: async () => {
      const res = await fetch(`/api/expedientes/${expedienteId}`)
      if (!res.ok) throw new Error('Error al obtener expediente')
      return res.json()
    },
    enabled,
    staleTime: 1000 * 60 * 2, // 2 minutos
  })

  return query
}