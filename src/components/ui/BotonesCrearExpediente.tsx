'use client'

import { useQueryClient, useMutation } from '@tanstack/react-query'
import {
  Button,
  HStack,
  VStack,
  Text,
} from '@chakra-ui/react'
import {
  ClipboardList,
  Stethoscope,
  Hospital,
  Scissors,
} from 'lucide-react'
import { toaster } from '@/components/ui/toaster'
import { z } from 'zod'

type ExpedienteMedico = {
  id: number
  tipo: 'CONSULTA' | 'SEGUIMIENTO' | 'CIRUGIA' | 'HOSPITALIZACION' | 'LABORATORIO' | 'OTRO'
  fechaCreacion: string
}

const tiposExpediente = [
  { tipo: 'CONSULTA', icono: <Stethoscope size={16} />, texto: 'Consulta' },
  { tipo: 'SEGUIMIENTO', icono: <Scissors size={16} />, texto: 'Seguimiento' },
  { tipo: 'CIRUGIA', icono: <ClipboardList size={16} />, texto: 'Cirugía' },
  { tipo: 'HOSPITALIZACION', icono: <Hospital size={16} />, texto: 'Hospitalización' },
  /*{ tipo: 'LABORATORIO', icono: <FlaskConical size={16} />, texto: 'Laboratorio' },
  { tipo: 'OTRO', icono: <AlertTriangle size={16} />, texto: 'Otro' },*/
]

const schema = z.object({
  tipo: z.enum(['CONSULTA', 'SEGUIMIENTO','CIRUGIA', 'HOSPITALIZACION', 'LABORATORIO', 'OTRO']),
  mascotaId: z.number(),
  contenidoAdaptado: z.string().optional(),
  notasGenerales: z.string().optional(),
  visibleParaTutor: z.boolean().optional(),
})

export default function BotoneraExpediente({ mascotaId }: { mascotaId: number }) {
  const queryClient = useQueryClient()

  const { mutate, isPending } = useMutation({
    mutationFn: async (tipo: string): Promise<ExpedienteMedico> => {
      const body = schema.parse({ tipo, mascotaId })
      const res = await fetch('/api/expedientes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      })
      if (!res.ok) throw new Error('Error al crear expediente')
      return res.json()
    },
    onSuccess: () => {
      toaster.create({ description: 'Expediente creado', type: 'success' })
      queryClient.invalidateQueries({ queryKey: ['expedientes', mascotaId] })
    },
    onError: () => {
      toaster.create({ description: 'Error al crear expediente', type: 'error' })
    },
  })

  return (
    <VStack align="start" gap="4">
      <Text fontSize="xl" fontWeight="bold" color="tema.suave">
        Crear nuevo expediente
      </Text>

      <HStack wrap="wrap" gap="2">
        {tiposExpediente.map((op) => (
          <Button
            key={op.tipo}
            onClick={() => mutate(op.tipo)}
            size="sm"
            colorScheme="blue"
            disabled={isPending}
            borderRadius="full"
          >
            <HStack gap="1">
              {op.icono}
              <Text>{op.texto}</Text>
            </HStack>
          </Button>
        ))}
      </HStack>
    </VStack>
  )
}