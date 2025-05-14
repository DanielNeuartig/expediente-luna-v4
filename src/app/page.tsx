"use client";

import { signIn } from "next-auth/react";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import {
  Box,
  Button,
  Center,
  Heading,
  SimpleGrid,
  Icon,
  Text,
  VStack,
  Spinner,
  Image,

} from "@chakra-ui/react";
import { CircleUserRound, Cloud, Stethoscope, Hospital,   LogIn,} from "lucide-react";

export default function HomePage() {
  const { status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === "authenticated") {
      router.push("/dashboard");
    }
  }, [status, router]);

  if (status === "loading") {
    return (
      <Center minH="100vh">
        <Spinner size="xl" />
      </Center>
    );
  }

  return (
    <Box
      minH="100dvh"
      backgroundImage="url('/imagenes/FondoHomepage.png')"
      backgroundSize="cover"
      backgroundPosition="center"
      backgroundRepeat="no-repeat"
    >
      <Center minH="100vh">
        <Box
          textAlign="center"
          w="30%"
          bg="tema.intenso"
          borderRadius="2xl"
          shadow="lg"
          p="6"
          display="flex"
          flexDirection="column"
          alignItems="center"
        >
          <Image
            src="/imagenes/Logo3X2.png"
            boxSize="200px"
            borderRadius="2xl"
            w="80%"
          />

          {/* 🏷 Título principal */}
          <Heading
            as="h2"
            fontSize={{ base: "3xl", md: "3xl" }}
            color="tema.llamativo"
            mb="12"
          >
            Expediente universal
          </Heading>

          {/* 👥 Tres beneficios principales */}
          <SimpleGrid columns={{ base: 1, md: 3 }} gap="8" mb="16">
            <VStack
              bg="white"
              p="6"
              borderRadius="xl"
              shadow="md"
              gap="4"
              align="center"
            >
              <Icon as={Stethoscope} boxSize="14" color="tema.llamativo" />
              <Text fontWeight="bold" color="tema.intenso">
                Para médicos
              </Text>
            </VStack>

            <VStack
              bg="white"
              p="6"
              borderRadius="xl"
              shadow="md"
              gap="4"
              align="center"
            >
              <Icon as={Hospital} boxSize="14" color="tema.llamativo" />
              <Text fontWeight="bold" color="tema.intenso">
                Para clínicas
              </Text>
            </VStack>

            <VStack
              bg="white"
              p="6"
              borderRadius="xl"
              shadow="md"
              gap="4"
              align="center"
            >
              <Icon as={CircleUserRound} boxSize="14" color="tema.llamativo" />
              <Text fontWeight="bold" color="tema.intenso">
                Para propietarios
              </Text>
            </VStack>
          </SimpleGrid>

          <VStack gap="10">
            {/* 🌐 Disponibilidad universal */}
            <Box bg="tema.suave" p="6" borderRadius="2xl">
              <Icon as={Cloud} boxSize="14" color="tema.claro" />
              <Text fontSize="2xl" fontWeight="bold" color="tema.claro">
                TOTALMENTE EN LA NUBE
              </Text>
            </Box>
            <Spinner
            animationDuration="3s"
            borderWidth="9px"
              size="xl"
              color="tema.llamativo"
              css={{ "--spinner-track-color": "colors.gray.100" }}
            />
            </VStack>
            <VStack>
            <Text fontSize="lg" fontWeight="bold" color="tema.llamativo">
              En desarrollo...
            </Text>
          </VStack>
<Button
  onClick={() => signIn('google')}
  position="fixed"
  bottom="6"
  right="6"
  zIndex="overlay"
  size="lg"
  borderRadius="full"
  shadow="lg"
  bg="tema.intenso"
  color="white"
  _hover={{ bg: 'tema.llamativo' }}
>
    <Icon as={LogIn} boxSize="4" />
    <Text>¿Usuario beta?</Text>
</Button>
        </Box>
      </Center>
    </Box>
  );
}
