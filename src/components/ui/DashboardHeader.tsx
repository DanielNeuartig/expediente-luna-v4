'use client';

import {
  Box,
  Flex,
  Text,
  Badge,
  Avatar,
  Button,
  Drawer,
  Portal,
  VStack,
  Image,
  CloseButton,
  Icon,
} from '@chakra-ui/react';
import { useSession, signOut } from 'next-auth/react';
import SearchBar from '../layout/Searchbar';
import { Menu, Home, PlusSquare } from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function DashboardHeader() {
  const { data: session } = useSession();
  const pathname = usePathname();

  if (!session?.user) return null;

  const { email, tipoUsuario, image, name, perfil } = session.user;

  const menu = [
    { label: 'Inicio', icon: Home, href: '/dashboard' },
    { label: 'Crear perfil', icon: PlusSquare, href: '/dashboard/crear-perfil-propietario' },
  ];

  return (
    <Box
      bg="tema.intenso"
      as="header"
      position="fixed"
      top={0}
      left={0}
      ml={{ base: 0, md: '60' }}
      w={{ base: '100%', md: 'calc(100% - 15rem)' }}
      h="auto"
      zIndex="overlay"
      borderBottom="1px solid"
      borderColor="gray.300"
      px="4"
      py="2"
    >
      <Flex
        align="center"
        gap="3"
        wrap="wrap"
        justify="space-between"
        direction="row"
      >
        {/* Botón Drawer móvil */}
        <Box display={{ base: 'block', md: 'none' }}>
          <Drawer.Root placement="start">
            <Drawer.Trigger asChild>
              <Button variant="ghost" size="sm" px="2" aria-label="Abrir menú">
                <Icon boxSize="5" color="tema.claro">
                  <Menu />
                </Icon>
              </Button>
            </Drawer.Trigger>

            <Portal>
              <Drawer.Backdrop />
              <Drawer.Positioner>
                <Drawer.Content
                  w="60"
                  h="100dvh"
                  bg="tema.intenso"
                  py="6"
                  px="4"
                  display="flex"
                  flexDirection="column"
                  justifyContent="space-between"
                  boxShadow="lg"
                >
                  <Drawer.Header borderBottom="1px solid" borderColor="whiteAlpha.300">
                    <Image
                      src="/imagenes/LogoBordesReducidos.png"
                      alt="Logo"
                      w="80%"
                      mx="auto"
                      borderRadius="xl"
                    />
                  </Drawer.Header>

                  <Drawer.Body>
                    <VStack align="stretch" gap="2" mt="4">
                      {menu.map(({ label, icon: MenuIcon, href }) => {
                        const isActive = pathname === href;
                        return (
                          <Link key={label} href={href} passHref>
                            <Box
                              as="span"
                              display="flex"
                              alignItems="center"
                              gap="3"
                              px="4"
                              py="2"
                              borderRadius="lg"
                              transition="all 0.2s"
                              position="relative"
                              bg={isActive ? '#1A1E24' : 'transparent'}
                              color={isActive ? 'tema.llamativo' : 'inherit'}
                              _hover={
                                isActive
                                  ? {}
                                  : {
                                      bg: 'gray.500',
                                      cursor: 'pointer',
                                    }
                              }
                              _before={
                                isActive
                                  ? {
                                      content: '""',
                                      position: 'absolute',
                                      left: 0,
                                      top: '8%',
                                      bottom: '8%',
                                      width: '4px',
                                      borderRadius: 'full',
                                      bg: 'tema.llamativo',
                                    }
                                  : undefined
                              }
                            >
                              <Icon as={MenuIcon} boxSize="5" color="tema.claro" />
                              <Text color="tema.claro" fontSize="sm">
                                {label}
                              </Text>
                            </Box>
                          </Link>
                        );
                      })}
                    </VStack>
                  </Drawer.Body>

                  <Drawer.Footer justifyContent="center">
                    <Text fontSize="xs" color="whiteAlpha.600">
                      Expediente Luna © 2025
                    </Text>
                  </Drawer.Footer>

                  <Drawer.CloseTrigger asChild>
                    <CloseButton
                      size="sm"
                      position="absolute"
                      top="4"
                      right="4"
                      aria-label="Cerrar"
                    />
                  </Drawer.CloseTrigger>
                </Drawer.Content>
              </Drawer.Positioner>
            </Portal>
          </Drawer.Root>
        </Box>

        {/* Buscador */}
        <Box flex="1" minW="150px">
          <SearchBar />
        </Box>

        {/* Tipo de usuario */}
        <Badge bg="tema.llamativo" fontSize="xs" fontWeight="medium">
          {tipoUsuario}
        </Badge>

        {/* Usuario */}
        <Flex
          align="center"
          direction="row"
          gap="3"
          wrap="wrap"
          minW="200px"
        >
          <Avatar.Root>
            <Avatar.Fallback name={name ?? ''} />
            <Avatar.Image src={image ?? ''} />
          </Avatar.Root>

          <Box minW="150px">
          <Text color="tema.claro" fontWeight="md" fontSize="sm" truncate>
              {email}
            </Text>
            {perfil?.nombre && (
           <Text fontSize="sm" color="tema.claro" fontWeight="light" truncate>
                {perfil.nombre} • {perfil.telefonoPrincipal}
              </Text>
            )}
          </Box>

          <Button
            bg="tema.suave"
            size="sm"
            variant="outline"
            colorScheme="red"
            onClick={() => signOut({ callbackUrl: '/' })}
            _hover={{ bg: 'tema.llamativo' }}
          >
            Cerrar sesión
          </Button>
        </Flex>
      </Flex>
    </Box>
  );
}