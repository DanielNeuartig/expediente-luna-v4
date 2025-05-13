'use client'

import { useState, useEffect, useRef } from 'react'
import { useRouter } from 'next/navigation'
import {
  Box,
  Input,
  List,
  Spinner,
  HStack,
  Text,
} from '@chakra-ui/react'
import { useQuery } from '@tanstack/react-query'
import { UserRound } from 'lucide-react'

interface ResultadoPerfil {
  id: number
  nombre: string
  telefonoPrincipal: string
}

export default function SearchBar() {
  const [query, setQuery] = useState('')
  const [isOpen, setIsOpen] = useState(false)
  const [selectedIndex, setSelectedIndex] = useState(0)
  const containerRef = useRef<HTMLDivElement>(null)
  const router = useRouter()

  const { data = [], isFetching } = useQuery<ResultadoPerfil[]>({
    queryKey: ['buscar-perfil', query],
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
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [])

  const formatearTelefono = (telefono: string) =>
    telefono.replace(/\D/g, '').replace(/(\d{2})(?=\d)/g, '$1 ').trim()

  const manejarSeleccion = (id: number) => {
    setIsOpen(false)
    setQuery('')
    router.push(`/dashboard/perfiles/${id}`)
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (!isOpen) return

    if (e.key === 'ArrowDown') {
      e.preventDefault()
      setSelectedIndex((prev) => Math.min(prev + 1, data.length - 1))
    }

    if (e.key === 'ArrowUp') {
      e.preventDefault()
      setSelectedIndex((prev) => Math.max(prev - 1, 0))
    }

    if (e.key === 'Enter') {
      e.preventDefault()
      const perfil = data[selectedIndex]
      if (perfil) manejarSeleccion(perfil.id)
    }

    if (e.key === 'Escape') {
      setIsOpen(false)
    }
  }

  return (
    <Box ref={containerRef} position="relative" maxW="md" w="full">
      <Input
        placeholder="Buscar perfil..."
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        onKeyDown={handleKeyDown}
        bg="black"
      />
      {isFetching && (
        <Spinner size="sm" position="absolute" top="2" right="2" />
      )}

      {isOpen && (
        <Box
          mt="1"
          border="1px solid #ccc"
          borderRadius="md"
          bg="black"
          zIndex="10"
          position="absolute"
          width="full"
          maxHeight="250px"
          overflowY="auto"
          shadow="md"
        >
          <List.Root>
            {data.map((perfil, index) => (
              <List.Item
                key={perfil.id}
                bg={index === selectedIndex ? 'gray.100' : 'black'}
                px="3"
                py="2"
                _hover={{ bg: 'gray.800', cursor: 'pointer' }}
                onMouseEnter={() => setSelectedIndex(index)}
                onClick={() => manejarSeleccion(perfil.id)}
              >
                <HStack>
                  <UserRound size={18} />
                  <Text>
                    {perfil.nombre} – {formatearTelefono(perfil.telefonoPrincipal)}
                  </Text>
                </HStack>
              </List.Item>
            ))}
          </List.Root>
        </Box>
      )}
    </Box>
  )
}