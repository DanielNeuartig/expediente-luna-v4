// src/app/mascotas/[id]/page.tsx
import { Suspense } from "react";
import { notFound } from "next/navigation";
import { Metadata } from "next";
import { format } from "date-fns";
import { Spinner, Box, HStack, Text, Button, VStack } from "@chakra-ui/react";
import {
  Barcode,
  CheckCircle,
  ArrowLeft,
  Circle,
  Venus,
  Mars,
  Egg,
  EggOff,
  CircleHelp,
} from "lucide-react";
import Link from "next/link";
import TarjetaBase from "@/components/ui/TarjetaBase";
import { estilosBotonEspecial } from "@/components/ui/config/estilosBotonEspecial";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const { id } = await params;
  return { title: `Mascota #${id} · Expediente Luna` };
}

export default function MascotaDetallePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  return (
    <Suspense
      fallback={
        <Box p="4">
          <Spinner size="xl" color="tema.llamativo" />
        </Box>
      }
    >
      <AsyncMascotaComponent params={params} />
    </Suspense>
  );
}

async function AsyncMascotaComponent({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const idNum = Number(id);
  if (isNaN(idNum)) return notFound();

  const { prisma } = await import("@/lib/prisma");
  const mascota = await prisma.mascota.findUnique({
    where: { id: idNum },
    include: {
      raza: true,
      perfil: true,
    },
  });

  if (!mascota) return notFound();

  const { differenceInYears, differenceInMonths } = await import("date-fns");
  const edad = mascota.fechaNacimiento
    ? `${differenceInYears(new Date(), mascota.fechaNacimiento)}A ${
        differenceInMonths(new Date(), mascota.fechaNacimiento) % 12
      }M`
    : "Edad desconocida";

  const iconoEspecie: Record<string, string> = {
    CANINO: "🐶",
    FELINO: "🐱",
    AVE_PSITACIDA: "🦜",
    AVE_OTRA: "🐦",
    OFIDIO: "🐍",
    QUELONIO: "🐢",
    LAGARTIJA: "🦎",
    ROEDOR: "🐹",
    LAGOMORFO: "🐰",
    HURON: "🦡",
    PORCINO: "🐷",
    OTRO: "❓",
  };

  return (
    <Box gridColumn="1" gridRow="1">
      <TarjetaBase>
        <Box bg="tema.intenso" borderRadius="2xl" px="3" py="4" mb="1">
          <VStack align="start" width="100%">
            <HStack gap="1" width="100%" justify="flex-start">
              <Text fontSize="3xl" as="span" role="img">
                {iconoEspecie[mascota.especie]}
              </Text>
              <Text
                fontSize="xl"
                fontWeight="bold"
                color="tema.claro"
              >
                {mascota.nombre}
              </Text>
              <Box
                bg={mascota.activo ? "green.600" : "red.600"}
                borderRadius="full"
                px="2"
                py="1"
              >
                <CheckCircle size={16} color="white" />
              </Box>

              <Box
                bg={
                  mascota.sexo === "MACHO"
                    ? "blue.600"
                    : mascota.sexo === "HEMBRA"
                    ? "purple.600"
                    : "gray.600"
                }
                borderRadius="full"
                px="2"
                py="1"
              >
                <HStack gap="1">
                  {mascota.sexo === "MACHO" && <Mars size={16} color="white" />}
                  {mascota.sexo === "HEMBRA" && (
                    <Venus size={16} color="white" />
                  )}
                  {mascota.sexo === "DESCONOCIDO" && (
                    <Circle size={16} color="white" />
                  )}
                </HStack>
              </Box>
              <Box
                bg={
                  mascota.esterilizado === "ESTERILIZADO"
                    ? "green.600"
                    : mascota.esterilizado === "NO_ESTERILIZADO"
                    ? "red.600"
                    : "gray.600"
                }
                borderRadius="full"
                px="2"
                py="1"
              >
                <HStack gap="1">
                  {mascota.esterilizado === "ESTERILIZADO" && (
                    <EggOff size={16} color="white" />
                  )}
                  {mascota.esterilizado === "NO_ESTERILIZADO" && (
                    <Egg size={16} color="white" />
                  )}
                  {mascota.esterilizado === "DESCONOCIDO" && (
                    <CircleHelp size={16} color="white" />
                  )}
                </HStack>
              </Box>
              <Box bg="tema.suave" borderRadius="full" px="1" py="1">
                <Text fontWeight="bold" color="tema.claro" fontSize="sm">
                  ⏳{edad}
                </Text>
              </Box>
            </HStack>

            <HStack width="100%" justify="flex-start">
              <Box bg="tema.suave" borderRadius="full" px="1" py="1">
                <Text fontWeight="bold" color="tema.claro" fontSize="sm">
                  {mascota.raza?.nombre ?? "—"}{" "}
                </Text>
              </Box>

              <Box bg="tema.suave" borderRadius="full" px="1" py="1">
                <Text fontWeight="bold" color="tema.claro" fontSize="sm">
                  {mascota.fechaNacimiento
                    ? format(new Date(mascota.fechaNacimiento), "dd/MM/yyyy")
                    : "—"}
                </Text>
              </Box>

              <Box bg="tema.suave" borderRadius="full" px="1" py="1">
                <HStack gap="1">
                  <Barcode size={16} color="white" />
                  <Text fontWeight="bold" color="tema.claro" fontSize="sm">
                    {mascota.microchip ?? "—"}
                  </Text>
                </HStack>
              </Box>
            </HStack>
            <HStack width="100%" justify="flex-start">
              <Button {...estilosBotonEspecial}>
                <Link href={`/dashboard/perfiles/${mascota.perfil.id}`}>
                  <HStack gap="1">
                    <ArrowLeft size={20} color="white" />
                    <Text fontWeight="bold" color="tema.claro" fontSize="sm">
                      {mascota.perfil.nombre} {mascota.perfil.clave}{" "}
                      {mascota.perfil.telefonoPrincipal}
                    </Text>
                  </HStack>
                </Link>
              </Button>
            </HStack>
          </VStack>
        </Box>

        <VStack gap="1" align="flex-start" mb="4">
          {/* Fila 1 */}
        </VStack>
      </TarjetaBase>
    </Box>
  );
}
