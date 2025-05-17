'use client'

import {
  Box,
  Input,
  List,
  Spinner,
} from '@chakra-ui/react'
import { useRouter } from 'next/navigation'
import { useQuery } from '@tanstack/react-query'
import { useEffect, useRef, useState } from 'react'
import ResultadoMascotaCompacto from '@/components/ui/ResultadoMascotaCompacto'
import ResultadoPerfilCompacto from '@/components/ui/ResultadoPerfilCompacto'

export type ResultadoBusqueda = {
  id: number
  nombre: string
  tipo: 'perfil' | 'mascota'
  telefonoPrincipal?: string
  especie?: string
  fechaNacimiento?: string
  raza?: string
  sexo?: 'MACHO' | 'HEMBRA' | 'DESCONOCIDO'
  esterilizado?: 'ESTERILIZADO' | 'NO_ESTERILIZADO' | 'DESCONOCIDO'
  microchip?: string
  activo?: boolean
}

export type ResultadoMascota = Extract<ResultadoBusqueda, { tipo: 'mascota' }>
export type ResultadoPerfil = Extract<ResultadoBusqueda, { tipo: 'perfil' }>

export default function Searchbar() {
  const [query, setQuery] = useState('')
  const [isOpen, setIsOpen] = useState(false)
  const [selectedIndex, setSelectedIndex] = useState(0)
  const [usandoTeclado, setUsandoTeclado] = useState(false)
  const containerRef = useRef<HTMLDivElement>(null)
  const itemRefs = useRef<(HTMLLIElement | null)[]>([])
  const router = useRouter()

  const { data = [], isFetching } = useQuery<ResultadoBusqueda[]>({
    queryKey: ['buscar', query],
    queryFn: async () => {
      const res = await fetch(`/api/perfiles/buscar?q=${query}`)
      return res.json()
    },
    enabled: query.length >= 2,
  })

  useEffect(() => {
    if (data.length > 0) {
      setIsOpen(true)
      setSelectedIndex(0)
    } else {
      setIsOpen(false)
    }
  }, [data])

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false)
        setQuery('')
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [])

  useEffect(() => {
    const el = itemRefs.current[selectedIndex]
    if (el) {
      el.scrollIntoView({ block: 'nearest', behavior: 'smooth' })
    }
  }, [selectedIndex])

  const manejarSeleccion = (item: ResultadoBusqueda) => {
    setIsOpen(false)
    setQuery('')
    const ruta =
      item.tipo === 'mascota'
        ? `/dashboard/mascotas/${item.id}`
        : `/dashboard/perfiles/${item.id}`
    router.push(ruta)
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (!isOpen && e.key === 'Escape') {
      setQuery('')
      return
    }

    if (e.key === 'ArrowDown') {
      e.preventDefault()
      setUsandoTeclado(true)
      setSelectedIndex((prev) => Math.min(prev + 1, data.length - 1))
    }

    if (e.key === 'ArrowUp') {
      e.preventDefault()
      setUsandoTeclado(true)
      setSelectedIndex((prev) => Math.max(prev - 1, 0))
    }

    if (e.key === 'Enter') {
      e.preventDefault()
      const item = data[selectedIndex]
      if (item) manejarSeleccion(item)
    }

    if (e.key === 'Escape') {
      setIsOpen(false)
      setQuery('')
    }
  }

  return (
    <Box ref={containerRef} position="relative" maxW="md" w="full">
      <Input
        placeholder="buscar..."
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        onKeyDown={handleKeyDown}
        bg="gray.200"
        color="tema.suave"
        border="none"
        borderRadius="3xl"
        _focus={{ boxShadow: 'none', border: 'none' }}
        _hover={{ boxShadow: 'none', border: 'none' }}
      />

      {isFetching && (
        <Spinner size="lg" position="absolute" top="2" right="2" />
      )}

      {isOpen && (
        <Box
          mt="1"
          bg="white"
          border="none"
          borderRadius="lg"
          zIndex="10"
          position="absolute"
          width="full"
          maxHeight="300px"
          overflowY="auto"
          onMouseMove={() => setUsandoTeclado(false)}
        >
          <List.Root>
            {data.map((item, index) => (
              <List.Item
                key={`${item.tipo}-${item.id}`}
                ref={(el) => {
                  itemRefs.current[index] = el
                }}
                bg={index === selectedIndex ? 'tema.llamativo' : 'tema.intenso'}
                px="4"
                py="2"
                _hover={
                  usandoTeclado
                    ? {}
                    : { bg: 'tema.suave', cursor: 'pointer' }
                }
                onMouseEnter={() => setSelectedIndex(index)}
                onClick={() => manejarSeleccion(item)}
              >
                {item.tipo === 'mascota' && (
                  <ResultadoMascotaCompacto mascota={item as ResultadoMascota} />
                )}
                {item.tipo === 'perfil' && (
  <ResultadoPerfilCompacto perfil={item as ResultadoPerfil} />
                )}
              </List.Item>
            ))}
          </List.Root>
        </Box>
      )}
    </Box>
  )
}