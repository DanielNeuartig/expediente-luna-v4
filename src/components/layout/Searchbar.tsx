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
import { CircleUserRound } from 'lucide-react'

interface ResultadoPerfil {
  id: number
  nombre: string
  telefonoPrincipal: string
}

export default function SearchBar() {
  const [query, setQuery] = useState('')
  const [isOpen, setIsOpen] = useState(false)
  const [selectedIndex, setSelectedIndex] = useState(0)
  const [usandoTeclado, setUsandoTeclado] = useState(false)
  const containerRef = useRef<HTMLDivElement>(null)
  const itemRefs = useRef<(HTMLLIElement | null)[]>([])
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

  const formatearTelefono = (telefono: string) =>
    telefono.replace(/\D/g, '').replace(/(\d{2})(?=\d)/g, '$1 ').trim()

  const manejarSeleccion = (id: number) => {
    setIsOpen(false)
    setQuery('')
    router.push(`/dashboard/perfiles/${id}`)
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
      const perfil = data[selectedIndex]
      if (perfil) manejarSeleccion(perfil.id)
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
        <Spinner size="sm" position="absolute" top="2" right="2" />
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
          maxHeight="250px"
          overflowY="auto"
          onMouseMove={() => setUsandoTeclado(false)}
        >
          <List.Root>
            {data.map((perfil, index) => (
              <List.Item
                ref={(el) => {
                  itemRefs.current[index] = el
                }}
                key={perfil.id}
                bg={index === selectedIndex ? 'tema.llamativo' : 'tema.intenso'}
                color="tema.claro"
                px="4"
                py="1"
                borderBottom="0px solid"
                borderColor="gray.400"
                _hover={
                  usandoTeclado
                    ? {}
                    : {
                        bg:
                          index === selectedIndex
                            ? 'tema.llamativo'
                            : 'tema.suave',
                        cursor: 'pointer',
                      }
                }
                onMouseEnter={() => setSelectedIndex(index)}
                onClick={() => manejarSeleccion(perfil.id)}
              >
                <HStack>
                  <CircleUserRound size={24} />
                  <Text>
                    {perfil.nombre} –{' '}
                    {formatearTelefono(perfil.telefonoPrincipal)}
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