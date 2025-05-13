'use client'

import {
  Box,
  Flex,
  Text,
  Badge,
  Avatar,
  Button,
  Spacer,
} from '@chakra-ui/react'
import { useSession, signOut } from 'next-auth/react'
import SearchBar from '../layout/Searchbar'

export default function DashboardHeader() {
  const { data: session } = useSession()

  if (!session?.user) return null

  const { email, tipoUsuario, image, name, perfil } = session.user

  return (
    <Box as="header" w="full" p="4" borderBottom="1px solid" borderColor="gray.200">
      <Flex align="center" gap="4">
        <SearchBar />

        <Spacer />

        <Flex align="center" gap="3">
          <Avatar.Root>
            <Avatar.Fallback name={name ?? ''} />
            <Avatar.Image src={image ?? ''} />
          </Avatar.Root>

          <Box>
            <Text fontWeight="medium">{email}</Text>
            {perfil?.nombre && (
              <Text fontSize="sm" color="gray.600">
                {perfil.nombre} • {perfil.telefonoPrincipal}
              </Text>
            )}
            <Badge colorScheme="teal" mt="1" fontSize="xs">
              {tipoUsuario}
            </Badge>
          </Box>

          <Button
            size="sm"
            variant="outline"
            colorScheme="red"
            onClick={() => signOut({ callbackUrl: '/' })}
          >
            Cerrar sesión
          </Button>
        </Flex>
      </Flex>
    </Box>
  )
}