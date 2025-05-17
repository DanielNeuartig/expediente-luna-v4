'use client'

import {
  Box,
  HStack,
  Text,
  VStack,
} from '@chakra-ui/react'
import {
  CheckCircle,
  Barcode,
  Mars,
  Venus,
  Circle,
  Egg,
  EggOff,
  CircleHelp,
} from 'lucide-react'
import Link from 'next/link'
import { format } from 'date-fns'
import { es } from 'date-fns/locale'

type ResultadoMascota = {
  id: number
  nombre: string
  tipo: 'mascota'
  especie?: string
  fechaNacimiento?: string
  raza?: string
  sexo?: 'MACHO' | 'HEMBRA' | 'DESCONOCIDO'
  esterilizado?: 'ESTERILIZADO' | 'NO_ESTERILIZADO' | 'DESCONOCIDO'
  microchip?: string
  activo?: boolean
}

const iconoEspecie: Record<string, string> = {
  CANINO: '🐶',
  FELINO: '🐱',
  AVE_PSITACIDA: '🦜',
  AVE_OTRA: '🐦',
  OFIDIO: '🐍',
  QUELONIO: '🐢',
  LAGARTIJA: '🦎',
  ROEDOR: '🐹',
  LAGOMORFO: '🐰',
  HURON: '🦡',
  PORCINO: '🐷',
  OTRO: '❓',
}

const calcularEdad = (fecha: string) => {
  const nacimiento = new Date(fecha)
  const hoy = new Date()
  const años = hoy.getFullYear() - nacimiento.getFullYear()
  const meses =
    hoy.getMonth() -
    nacimiento.getMonth() +
    (hoy.getDate() < nacimiento.getDate() ? -1 : 0)

  return `${años}A ${meses >= 0 ? meses : meses + 12}M`
}

export default function ResultadoMascotaCompacto({
  mascota,
}: {
  mascota: ResultadoMascota
}) {
  console.log('🐾 Datos mascota:', JSON.stringify(mascota, null, 2))

  return (
    <Link href={`/dashboard/mascotas/${mascota.id}`}>
      <Box
        bg="tema.intenso"
        borderRadius="xl"
        p="3"
        _hover={{ bg: 'tema.suave', cursor: 'pointer' }}
        width="100%"
      >
        <VStack align="start" gap="2">
          {/* Línea superior: nombre, especie, estado, sexo, esterilización */}
          <HStack flexWrap="wrap" align="center" gap="2">
            <Text fontSize="sm">{iconoEspecie[mascota.especie ?? 'OTRO']}</Text>
            <Text fontWeight="bold" fontSize="sm" color="tema.claro">
              {mascota.nombre}
            </Text>

            <Box
              bg={mascota.activo ? 'green.600' : 'red.600'}
              borderRadius="full"
              px="2"
              py="1"
            >
              <CheckCircle size={10} color="white" />
            </Box>

            <Box
              bg={
                mascota.sexo === 'MACHO'
                  ? 'blue.600'
                  : mascota.sexo === 'HEMBRA'
                  ? 'purple.600'
                  : 'gray.600'
              }
              borderRadius="full"
              px="2"
              py="1"
            >
              <HStack gap="1">
                {mascota.sexo === 'MACHO' && <Mars size={16} color="white" />}
                {mascota.sexo === 'HEMBRA' && <Venus size={16} color="white" />}
                {mascota.sexo === 'DESCONOCIDO' && (
                  <Circle size={16} color="white" />
                )}
              </HStack>
            </Box>

            <Box
              bg={
                mascota.esterilizado === 'ESTERILIZADO'
                  ? 'green.600'
                  : mascota.esterilizado === 'NO_ESTERILIZADO'
                  ? 'red.600'
                  : 'gray.600'
              }
              borderRadius="full"
              px="2"
              py="1"
            >
              <HStack gap="1">
                {mascota.esterilizado === 'ESTERILIZADO' && (
                  <EggOff size={16} color="white" />
                )}
                {mascota.esterilizado === 'NO_ESTERILIZADO' && (
                  <Egg size={16} color="white" />
                )}
                {mascota.esterilizado === 'DESCONOCIDO' && (
                  <CircleHelp size={16} color="white" />
                )}
              </HStack>
            </Box>
          </HStack>

          {/* Línea inferior: raza, nacimiento, edad, microchip */}
          <HStack flexWrap="wrap" align="center" gap="2">
            {mascota.raza && (
              <Box bg="tema.suave" borderRadius="full" px="2" py="1">
                <Text fontWeight="bold" fontSize="xs" color="tema.claro">
                  🐾 {mascota.raza}
                </Text>
              </Box>
            )}

            {mascota.fechaNacimiento && (
              <>
                <Box bg="tema.suave" borderRadius="full" px="2" py="1">
                  <Text fontWeight="bold" fontSize="xs" color="tema.claro">
                    📆 {format(new Date(mascota.fechaNacimiento), 'dd/MM/yyyy', { locale: es })}
                  </Text>
                </Box>

                <Box bg="tema.suave" borderRadius="full" px="2" py="1">
                  <Text fontWeight="bold" fontSize="xs" color="tema.claro">
                    ⏳ {calcularEdad(mascota.fechaNacimiento)}
                  </Text>
                </Box>
              </>
            )}

            {mascota.microchip && (
              <Box bg="tema.suave" borderRadius="full" px="2" py="1">
                <HStack gap="1">
                  <Barcode size={16} color="white" />
                  <Text fontWeight="bold" fontSize="xs" color="tema.claro">
                    {mascota.microchip}
                  </Text>
                </HStack>
              </Box>
            )}
          </HStack>
        </VStack>
      </Box>
    </Link>
  )
}