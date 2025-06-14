"use client";

//import { signIn } from "next-auth/react";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import {
  Box,
  Flex,
  Center,
  Heading,
  SimpleGrid,
  Icon,
  Text,
  VStack,
  Spinner,
  Image,
} from "@chakra-ui/react";
import {
  CircleUserRound,
  Cloud,
  Stethoscope,
  Hospital,
} from "lucide-react";
import FondoConBotones from "@/components/ui/fondos/FondoConBotones";

export default function HomePage() {
  const { status, data } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === "authenticated" && data?.user?.activo) {
      router.push("/dashboard");
    } else if (status === "authenticated" && !data?.user?.activo) {
      router.push("/sin-permiso");
    }
  }, [status, data, router]);

  if (status === "loading") {
    return (
      <Center minH="100vh">
        <Spinner size="xl" />
      </Center>
    );
  }

  return (
    <FondoConBotones>
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
        >
          <VStack gap="10" align="center">
            <Image
              src="/imagenes/LogoBordesReducidos.png"
              alt="Logo"
              w="70%"
              borderRadius="xl"
            />

            <Heading
              as="h2"
              fontSize={{ base: "2xl", md: "2xl" }}
              color="tema.claro"
            >
              EXPEDIENTE UNIVERSAL PARA MASCOTAS
            </Heading>

            <SimpleGrid columns={{ base: 3, md: 3 }} gap="4" w="100%">
              <VStack
                bg="tema.claro"
                p="4"
                h="130px"
                w="full"
                borderRadius="xl"
                shadow="md"
                gap="2"
                justify="center"
                align="center"
              >
                <Icon as={Stethoscope} boxSize="10" color="tema.suave" />
                <Text fontWeight="light" color="tema.suave">
                  Para médicos
                </Text>
              </VStack>

              <VStack
                bg="tema.claro"
                p="4"
                h="130px"
                w="full"
                borderRadius="xl"
                shadow="md"
                gap="2"
                justify="center"
                align="center"
              >
                <Icon as={Hospital} boxSize="10" color="tema.suave" />
                <Text fontWeight="light" color="tema.suave">
                  Para clínicas
                </Text>
              </VStack>

              <VStack
                bg="tema.claro"
                p="4"
                h="130px"
                w="full"
                borderRadius="xl"
                shadow="md"
                gap="2"
                justify="center"
                align="center"
              >
                <Icon as={CircleUserRound} boxSize="10" color="tema.suave" />
                <Text fontWeight="light" color="tema.suave" fontSize="md">
                  Para tutores
                </Text>
              </VStack>
            </SimpleGrid>

            <Box bg="tema.suave" p="4" borderRadius="xl">
              <Icon
                as={Cloud}
                boxSize="10"
                color="tema.llamativo"
                animation="pulseCloud"
              />
              <Text fontSize="lg" fontWeight="bold" color="tema.claro">
                TOTALMENTE EN LA NUBE
              </Text>
            </Box>
            <Box>
              <Spinner
                animationDuration="1s"
                borderWidth="9px"
                size="xl"
                color="tema.llamativo"
                css={{ "--spinner-track-color": "colors.gray.100" }}
              />
              <Text fontSize="md" fontWeight="light" color="tema.llamativo">
                En desarrollo...
              </Text>
            </Box>
          </VStack>
        </Box>
      </Flex>
    </FondoConBotones>
  );
}
