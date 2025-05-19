'use client'

import { useState } from 'react'
import { useMutation } from '@tanstack/react-query'
import {
  Box,
  Button,
  HStack,
  VStack,
  Text,
} from '@chakra-ui/react'
import {
  ClipboardList,
  Stethoscope,
  Hospital,
  FlaskConical,
  AlertTriangle,
} from 'lucide-react'
import { toaster } from '@/components/ui/toaster'
import { z } from 'zod'

// Tipo mínimo para lo que usamos en expedienteCreado
type ExpedienteMedico = {
  id: number
  tipo: 'CONSULTA' | 'CIRUGIA' | 'HOSPITALIZACION' | 'LABORATORIO' | 'OTRO'
  fechaCreacion: string
}

const tiposExpediente = [
  { tipo: 'CONSULTA', icono: <Stethoscope size={16} />, texto: 'Consulta' },
  { tipo: 'CIRUGIA', icono: <ClipboardList size={16} />, texto: 'Cirugía' },
  { tipo: 'HOSPITALIZACION', icono: <Hospital size={16} />, texto: 'Hospitalización' },
  { tipo: 'LABORATORIO', icono: <FlaskConical size={16} />, texto: 'Laboratorio' },
  { tipo: 'OTRO', icono: <AlertTriangle size={16} />, texto: 'Otro' },
]

const schema = z.object({
  tipo: z.enum(['CONSULTA', 'CIRUGIA', 'HOSPITALIZACION', 'LABORATORIO', 'OTRO']),
  mascotaId: z.number(),
  contenidoAdaptado: z.string().optional(),
  notasGenerales: z.string().optional(),
  visibleParaTutor: z.boolean().optional(),
})

export default function BotoneraExpediente({ mascotaId }: { mascotaId: number }) {
  const [expedienteCreado, setExpedienteCreado] = useState<ExpedienteMedico | null>(null)

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
    onSuccess: (data) => {
      setExpedienteCreado(data)
      toaster.create({ description: 'Expediente creado', type: 'success' })
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

      {expedienteCreado && (
        <Box w="full" bg="gray.900" borderRadius="lg" p="4">
          <Text fontWeight="bold">Expediente #{expedienteCreado.id}</Text>
          <Text>Tipo: {expedienteCreado.tipo}</Text>
          <Text>Fecha: {new Date(expedienteCreado.fechaCreacion).toLocaleString()}</Text>
        </Box>
      )}
    </VStack>
  )
}