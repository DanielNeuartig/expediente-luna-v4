'use client'

import { useEffect, useState } from 'react'
import {
  VStack,
  Box,
  Text,
  Spinner,
  HStack,
  Badge,
} from '@chakra-ui/react'
import { CalendarDays, FileText } from 'lucide-react'

type Expediente = {
  id: number
  tipo: string
  fechaCreacion: string
}

export default function ListaExpedientesMascota({ mascotaId }: { mascotaId: number }) {
  const [expedientes, setExpedientes] = useState<Expediente[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(false)

  useEffect(() => {
    async function fetchExpedientes() {
      setLoading(true)
      setError(false)
      try {
        const res = await fetch(`/api/mascotas/${mascotaId}/expedientes`)
        if (!res.ok) throw new Error()
        const data: Expediente[] = await res.json()

        const ordenados = [...data].sort((a, b) =>
          new Date(b.fechaCreacion).getTime() - new Date(a.fechaCreacion).getTime()
        )

        setExpedientes(ordenados)
      } catch {
        setError(true)
      } finally {
        setLoading(false)
      }
    }

    fetchExpedientes()
  }, [mascotaId])

  if (loading) {
    return <Spinner size="lg" color="tema.llamativo" />
  }

  if (error) {
    return <Text color="red.500">Error al cargar expedientes.</Text>
  }

  return (
    <VStack align="start" gap="4" w="full">
      <Text fontSize="xl" fontWeight="bold" color="tema.suave">
        Expedientes previos
      </Text>

      {expedientes.length === 0 ? (
        <Text color="tema.suave" fontStyle="italic">
          No hay expedientes registrados.
        </Text>
      ) : (
        expedientes.map((exp) => (
          <Box
            key={exp.id}
            bg="tema.intenso"
            p="3"
            borderRadius="xl"
            w="full"
          >
            <HStack justify="space-between">
              <HStack gap="2">
                <FileText size={20} color="white" />
                <Text color="tema.claro" fontWeight="bold">
                  #{exp.id} · {exp.tipo}
                </Text>
              </HStack>
              <Badge colorScheme="blue" variant="subtle">
                <HStack>
                  <CalendarDays size={14} />
                  <Text fontSize="xs">
                    {new Date(exp.fechaCreacion).toLocaleString()}
                  </Text>
                </HStack>
              </Badge>
            </HStack>
          </Box>
        ))
      )}
    </VStack>
  )
}