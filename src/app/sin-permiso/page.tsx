"use client";

import { Box, Flex, Text, Badge, Avatar, Button } from "@chakra-ui/react";
import { useSession, signOut } from "next-auth/react";

export default function SinPermisoPage() {
  const { data: session } = useSession();

  if (!session?.user) return null;

  const { email, tipoUsuario, image, name, perfil } = session.user;

  return (
    <Box
      minH="100dvh"
      overflow="hidden"
      backgroundImage="url('/imagenes/FondoHomepage.png')"
      backgroundSize="cover"
      backgroundPosition="center"
      backgroundRepeat="no-repeat"
    >
      <Flex
        direction="column"
        justify="center"
        align="center"
        minH="100dvh"
        px={{ base: 4, md: 0 }}
      >
        <Box
          textAlign="center"
          w={{ base: "90%", md: "90%", lg: "30%" }}
          bg="tema.intenso"
          borderRadius="2xl"
          shadow="lg"
          px="6"
          display="flex"
          flexDirection="column"
          alignItems="center"
          animation="fadeInUp"
          py="6"
        >
          <Text fontSize="2xl" fontWeight="bold" color="red.600">
            No tienes permiso para acceder
          </Text>

          <Flex align="center" gap="4">
            <Avatar.Root>
              <Avatar.Fallback name={name ?? ""} />
              <Avatar.Image src={image ?? ""} />
            </Avatar.Root>

            <Box>
              <Text color="tema.claro" fontWeight="medium" fontSize="sm">
                {email}
              </Text>
              {perfil?.nombre && (
                <Text fontSize="sm" color="gray.600" fontWeight="light">
                  {perfil.nombre} • {perfil.telefonoPrincipal}
                </Text>
              )}
            </Box>
          </Flex>

          <Badge
            bg="tema.llamativo"
            color="white"
            px="2"
            py="1"
            borderRadius="md"
          >
            {tipoUsuario}
          </Badge>

          <Button
            mt="4"
            bg="tema.suave"
            size="md"
            color="white"
            onClick={() => {
              signOut({ callbackUrl: "/", redirect: true });
            }}
            _hover={{ bg: "tema.llamativo" }}
          >
            Volver a la pantalla principal
          </Button>
        </Box>
      </Flex>
    </Box>
  );
}
