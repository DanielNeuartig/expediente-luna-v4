/*'use client'

import { Box, Button, Icon, Text, VStack, Link } from '@chakra-ui/react'
import { LuLogOut, LuLayoutDashboard, LuUser } from 'react-icons/lu'
import NextLink from 'next/link'
import { useAuth } from '@/context/AuthContext'
import { useAbility } from '@/lib/casl/AbilityContext'

export default function Sidebar({
  sidebarOpen,
  setSidebarOpen,
}: {
  sidebarOpen: boolean
  setSidebarOpen: (open: boolean) => void
}) {
  const { usuario, logout } = useAuth()
  const ability = useAbility()

  const menu = [
    {
      label: 'Inicio',
      href: '/dashboard',
      icon: LuLayoutDashboard,
      permiso: () => ability.can('view', 'Dashboard'),
    },
    {
      label: 'Mi perfil',
      href: '/dashboard/usuario',
      icon: LuUser,
      permiso: () => ability.can('view', 'Perfil'),
    },
  ]

  return (
    <Box
      as="nav"
      w={{ base: '200px', md: '200px' }}
      display={{ base: sidebarOpen ? 'block' : 'none', md: 'block' }}
      bg="gray.800"
      color="white"
      px={4}
      py={6}
    >
      <Text fontSize="xl" fontWeight="bold" mb={6}>
        Expediente Luna
      </Text>

      {usuario && (
        <Box mb={6}>
          <Text fontSize="sm">{usuario.correo}</Text>
          <Text fontSize="xs" color="gray.400">
            Rol: {usuario.rol}
          </Text>
        </Box>
      )}

      <VStack align="stretch" gap={2}>
        {menu.map(
          (item) =>
            item.permiso() && (
              <Link
                key={item.href}
                as={NextLink}
                href={item.href}
                style={{ textDecoration: 'none' }}
                onClick={() => setSidebarOpen(false)}
              >
                <Button
                  justifyContent="start"
                  colorScheme="gray"
                  variant="ghost"
                  w="full"
                >
                  <Icon as={item.icon} mr={2} />
                  {item.label}
                </Button>
              </Link>
            )
        )}

        <Button
          aria-label="Cerrar sesión"
          colorScheme="red"
          variant="ghost"
          onClick={logout}
          w="full"
          justifyContent="start"
        >
          <Icon as={LuLogOut} mr={2} />
          Cerrar sesión
        </Button>
      </VStack>
    </Box>
  )
}*/