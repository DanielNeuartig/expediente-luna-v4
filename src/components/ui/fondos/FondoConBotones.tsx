// src/components/ui/FondoConBotones.tsx
"use client";

import {
  Box,
  Button,
  Icon,
  Image,
  Text,
  VStack,
} from "@chakra-ui/react";
import { signIn } from "next-auth/react";
import { LogIn } from "lucide-react";
import React from "react";

export default function FondoConBotones({ children }: { children: React.ReactNode }) {
  return (
<Box
  minH="100dvh"
  overflow="hidden"
  backgroundImage="url('/imagenes/FondoHomepage.png')"
  backgroundSize="cover"
  backgroundPosition="center"
  backgroundRepeat="no-repeat"
  backgroundAttachment="fixed" // ✅ esto detiene el zoom visual
>
      {children}

      <Box
        position="fixed"
        bottom="6"
        right="6"
        zIndex="overlay"
        display="flex"
        flexDirection="row"
        gap="4"
        alignItems="center"
      >
        
        <VStack>

            <Button
          size="lg"
          borderRadius="full"
          shadow="lg"
          bg="tema.intenso"
          color="tema.llamativo"
          gap="2"
          px="4"
          py="2"
        >
          <Text fontWeight="md" fontSize="sm">
            {"Daniel Neuartig </>"}
          </Text>
        </Button>


         <Button
          size="lg"
          borderRadius="full"
          shadow="lg"
          bg="white"
          color="tema.intenso"
          gap="2"
          px="4"
          py="2"
        >
          <Text fontWeight="light" fontSize="sm">
            Un desarrollo de
          </Text>
          <Image
            src="/imagenes/LogoELDOCsm.png"
            alt="Logo ELDOC"
            borderRadius="md"
            bg="white"
            h="10"
            w="10"
          />
        </Button>


       

        <Box
          onClick={() => signIn("google")}
          borderRadius="full"
          shadow="lg"
          bg="tema.intenso"
          color="white"
          _hover={{ bg: "tema.llamativo" }}
          px="6"
          py="3"
        >
          <Icon as={LogIn} boxSize="4" mr="2" />
          ¿Usuario beta?
        </Box>
                </VStack>
      </Box>
    </Box>
  );
}