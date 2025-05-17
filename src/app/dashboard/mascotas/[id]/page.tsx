// src/app/mascotas/[id]/page.tsx
import { Suspense } from "react";
import { notFound } from "next/navigation";
import { Metadata } from "next";
import { Spinner, Box, HStack, Text, List, Button } from "@chakra-ui/react";
import {
  PawPrint,
  HeartPulse,
  ShieldCheck,
  Ruler,
  Barcode,
  User,
  CalendarDays,
  CheckCircle,
  ArrowLeft,
} from "lucide-react";
import Link from "next/link";
import TarjetaBase from "@/components/ui/TarjetaBase";

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
        <Box bg="tema.suave" borderRadius="2xl" px="3" py="4" mb="1">
          <HStack gap="2">
            <PawPrint size={30} color="white" />
            <Text fontWeight="bold" color="tema.claro" textAlign="center">
              {mascota.nombre}
            </Text>
          </HStack>
        </Box>

        <Box
          bg="tema.llamativo"
          borderRadius="full"
          px="4"
          py="1"
          display="inline-flex"
          mb="2"
          boxShadow="sm"
        >
          <HStack gap="2">
            <HeartPulse size={20} color="white" />
            <Text fontWeight="bold" color="tema.claro" fontSize="sm">
              {iconoEspecie[mascota.especie]} {mascota.especie}
            </Text>
          </HStack>
        </Box>

        <List.Root gap="3" variant="plain">
          <List.Item>
            <List.Indicator asChild color="cyan.500">
              <User />
            </List.Indicator>
            <HStack>
              <Text color="tema.suave" fontWeight="medium">
                Tutor:
              </Text>
              <Text color="tema.suave" fontWeight="light">
                {mascota.perfil.nombre}
              </Text>
            </HStack>
          </List.Item>

          <List.Item>
            <List.Indicator asChild color="teal.500">
              <ShieldCheck />
            </List.Indicator>
            <HStack>
              <Text color="tema.suave" fontWeight="medium">
                Raza:
              </Text>
              <Text color="tema.suave" fontWeight="light">
                {mascota.raza?.nombre ?? "—"}
              </Text>
            </HStack>
          </List.Item>

          <List.Item>
            <List.Indicator asChild color="pink.500">
              <ShieldCheck />
            </List.Indicator>
            <HStack>
              <Text color="tema.suave" fontWeight="medium">
                Sexo:
              </Text>
              <Text color="tema.suave" fontWeight="light">
                {mascota.sexo}
              </Text>
            </HStack>
          </List.Item>

          <List.Item>
            <List.Indicator asChild color="purple.400">
              <ShieldCheck />
            </List.Indicator>
            <HStack>
              <Text color="tema.suave" fontWeight="medium">
                Esterilizado:
              </Text>
              <Text color="tema.suave" fontWeight="light">
                {mascota.esterilizado}
              </Text>
            </HStack>
          </List.Item>

          <List.Item>
            <List.Indicator asChild color="orange.500">
              <CalendarDays />
            </List.Indicator>
            <HStack>
              <Text color="tema.suave" fontWeight="medium">
                Edad:
              </Text>
              <Text color="tema.suave" fontWeight="light">
                {edad}
              </Text>
            </HStack>
          </List.Item>

          <List.Item>
            <List.Indicator asChild color="gray.500">
              <Ruler />
            </List.Indicator>
            <HStack>
              <Text color="tema.suave" fontWeight="medium">
                Color:
              </Text>
              <Text color="tema.suave" fontWeight="light">
                {mascota.color ?? "—"}
              </Text>
            </HStack>
          </List.Item>

          <List.Item>
            <List.Indicator asChild color="gray.600">
              <Barcode />
            </List.Indicator>
            <HStack>
              <Text color="tema.suave" fontWeight="medium">
                Microchip:
              </Text>
              <Text color="tema.suave" fontWeight="light">
                {mascota.microchip ?? "—"}
              </Text>
            </HStack>
          </List.Item>

          <List.Item>
            <List.Indicator
              asChild
              color={mascota.activo ? "green.500" : "red.500"}
            >
              <CheckCircle />
            </List.Indicator>
            <HStack>
              <Text color="tema.suave" fontWeight="medium">
                Activo:
              </Text>
              <Text color="tema.suave" fontWeight="light">
                {mascota.activo ? "Sí" : "No"}
              </Text>
            </HStack>
          </List.Item>
        </List.Root>

        {/* Botón para regresar al perfil */}
        <Box mt="6">
          <Link href={`/dashboard/perfiles/${mascota.perfil.id}`}>
            <Button colorScheme="gray" variant="outline">
              <HStack>
                <ArrowLeft size={16} />
                <Text>Volver al perfil</Text>
              </HStack>
            </Button>
          </Link>
        </Box>
      </TarjetaBase>
    </Box>
  );
}
