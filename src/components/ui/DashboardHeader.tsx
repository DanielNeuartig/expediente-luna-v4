"use client";

import {
  Box,
  Flex,
  Text,
  Badge,
  Avatar,
  Button,
  Spacer,
} from "@chakra-ui/react";
import { useSession, signOut } from "next-auth/react";
import SearchBar from "../layout/Searchbar";

export default function DashboardHeader() {
  const { data: session } = useSession();

  if (!session?.user) return null;

  const { email, tipoUsuario, image, name, perfil } = session.user;

  return (
    <Box
bg="tema.intenso"
      as="header"
      position="fixed"
      top={0}
      left={0}
      ml="60"
      w="calc(100% - 15rem)"
      h="16"
      zIndex="overlay"
      borderBottom="1px solid"
      borderColor="gray.300"
      px="4"
    >
     <Flex align="center" gap="4" h="100%">
        <SearchBar />

        <Spacer />
                    <Badge bg="tema.llamativo" mt="1" fontSize="xs" fontWeight="medium">
              {tipoUsuario}
            </Badge>

        <Flex align="center" gap="3">
          <Avatar.Root>
            <Avatar.Fallback name={name ?? ""} />
            <Avatar.Image src={image ?? ""} />
          </Avatar.Root>

          <Box>
            <Text color="tema.claro" fontWeight="md" fontSize="sm" >
              {email}
            </Text>
            {perfil?.nombre && (
              <Text fontSize="sm" color="tema.claro" fontWeight="light" >
                {perfil.nombre} • {perfil.telefonoPrincipal}
              </Text>
            )}
          </Box>

          <Button
            bg="tema.suave"
            size="sm"
            variant="outline"
            colorScheme="red"
            onClick={() => signOut({ callbackUrl: "/" })}
              _hover={{ bg: 'tema.llamativo' }}
          >
            Cerrar sesión
          </Button>
        </Flex>
      </Flex>
    </Box>
  );
}
