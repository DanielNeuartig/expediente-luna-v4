'use client'

import { Box, VStack, Text } from '@chakra-ui/react'
import { Home, PlusSquare } from 'lucide-react'
import Link from 'next/link'

export default function Sidebar() {
  const menu = [
    { label: 'Inicio', icon: Home, href: '/dashboard' },
    { label: 'Crear perfil', icon: PlusSquare, href: '/dashboard/crear-perfil-propietario' },
  ]

  return (
    <Box
      as="aside"
      w="64"
      p="4"
      minH="100dvh"
      borderRight="1px solid"
      position="sticky"
      top={0}
    >
      <VStack align="start" justify="center" h="full" gap={4}>
        {menu.map(({ label, icon: Icon, href }) => (
          <Link key={label} href={href} passHref>
            <Box
              as="span"
              display="flex"
              alignItems="center"
              gap={2}
              _hover={{ color: 'blue.500', cursor: 'pointer' }}
            >
              <Icon size={30} />
              <Text fontSize= "2xl"fontWeight="medium">{label}</Text>
            </Box>
          </Link>
        ))}
      </VStack>
    </Box>
  )
}