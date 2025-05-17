// src/lib/hooks/useRazas.ts
import { useQuery } from '@tanstack/react-query'

export type Raza = {
  id: number
  nombre: string
  especie: string
}

export function useRazas(especie?: string) {
  return useQuery<Raza[]>({
    queryKey: ['razas', especie],
    queryFn: async () => {
      const url = especie
        ? `/api/razas?especie=${encodeURIComponent(especie)}`
        : '/api/razas'
      const res = await fetch(url)
      if (!res.ok) throw new Error('Error al obtener razas')
      return res.json()
    },
    enabled: !!especie, // ✅ Solo ejecuta la query si hay especie seleccionada
  })
}