// app/mi-perfil/page.tsx
"use client";

import FormularioPerfil from "@/components/ui/FormularioPerfil";
import { Box, Flex, Text, Button } from "@chakra-ui/react";
import { signOut } from "next-auth/react";

export default function MiPerfilPage() {
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
        maxW="md" // ✅ 
        px={{ base: 4, md: 0 }}
      >
        <Text color="tema.claro" fontWeight={"bold"} fontSize={"xl"}>
          *Es necesario crear un perfil para continuar
        </Text>
        <FormularioPerfil />
      </Flex>
      <Button
        bg="tema.suave"
        size="sm"
        variant="outline"
        colorScheme="red"
        onClick={() => {
          signOut({ callbackUrl: "/", redirect: true });
        }}
        _hover={{ bg: "tema.llamativo" }}
      >
        Cerrar sesión
      </Button>
    </Box>
  );
}
