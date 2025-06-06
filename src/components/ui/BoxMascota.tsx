"use client";

import { Box, HStack, Text, VStack } from "@chakra-ui/react";
import {
  Barcode,
  Mars,
  Venus,
  Circle,
  Egg,
  EggOff,
  CircleHelp,
  CircleUser,
  Heart,
  HeartOff,
} from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { format, differenceInYears, differenceInMonths } from "date-fns";
import { es } from "date-fns/locale";

export type ResultadoMascota = {
  id: number;
  nombre: string;
  tipo: "mascota";
  especie?: string;
  fechaNacimiento?: string;
  raza?: string;
  sexo?: "MACHO" | "HEMBRA" | "DESCONOCIDO";
  esterilizado?: "ESTERILIZADO" | "NO_ESTERILIZADO" | "DESCONOCIDO";
  microchip?: string | null;
  activo?: boolean;
  perfilId?: number;
  nombrePerfil?: string | null;
};

type Props = {
  mascota: ResultadoMascota;
  redirigirPerfil?: boolean;
};

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

export default function BoxMascota({
  mascota,
  redirigirPerfil = false,
}: Props) {
  const router = useRouter();

  const edad = mascota.fechaNacimiento
    ? `${differenceInYears(new Date(), new Date(mascota.fechaNacimiento))}A ${
        differenceInMonths(new Date(), new Date(mascota.fechaNacimiento)) % 12
      }M`
    : null;

  const irAlPerfil = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (mascota.perfilId) {
      router.push(`/dashboard/perfiles/${mascota.perfilId}`);
    }
  };

  return (
    <Link href={`/dashboard/mascotas/${mascota.id}`}>
      <Box
        bg="tema.intenso"
        borderRadius="xl"
        p="3"
        _hover={{ bg: "tema.suave", cursor: "pointer" }}
        width="100%"
      >
        <VStack align="start" gap="2">
          <HStack flexWrap="wrap" align="center" gap="2">
            {mascota.especie && (
              <Text fontSize="sm">
                {iconoEspecie[mascota.especie] ?? iconoEspecie["OTRO"]}
              </Text>
            )}

            <Text fontWeight="bold" fontSize="sm" color="tema.claro">
              {mascota.nombre}
            </Text>

            <Text fontSize="xs" fontWeight="light" color="tema.claro">
              #{mascota.id}
            </Text>

            {typeof mascota.activo === "boolean" && (
              <Box
                bg={mascota.activo ? "tema.verde" : "tema.rojo"}
                borderRadius="full"
                px="2"
                py="1"
              >
                {mascota.activo ? (
                  <Heart size={16} color="white" />
                ) : (
                  <HeartOff size={16} color="white" />
                )}
              </Box>
            )}

            {mascota.sexo && (
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
            )}

            {mascota.esterilizado && (
              <Box
                bg={
                  mascota.esterilizado === "ESTERILIZADO"
                    ? "tema.verde"
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
            )}
          </HStack>

          <HStack flexWrap="wrap" align="center" gap="2">
            {mascota.raza && (
              <Box bg="tema.suave" borderRadius="full" px="2" py="1">
                <Text fontWeight="bold" fontSize="xs" color="tema.claro">
                  🐾 {mascota.raza}
                </Text>
              </Box>
            )}

            {mascota.fechaNacimiento && edad && (
              <>
                <Box bg="tema.suave" borderRadius="full" px="2" py="1">
                  <Text fontWeight="bold" fontSize="xs" color="tema.claro">
                    📆{" "}
                    {format(new Date(mascota.fechaNacimiento), "dd/MM/yyyy", {
                      locale: es,
                    })}
                  </Text>
                </Box>

                <Box bg="tema.suave" borderRadius="full" px="2" py="1">
                  <Text fontWeight="bold" fontSize="xs" color="tema.claro">
                    ⏳ {edad}
                  </Text>
                </Box>
              </>
            )}

            {mascota.microchip && (
              <Box bg="tema.suave" borderRadius="full" px="2" py="1">
                <HStack gap="1">
                  <Barcode size={16} color="white" />
                  <Text fontWeight="bold" fontSize="xs" color="tema.claro">
                    {mascota.microchip}
                  </Text>
                </HStack>
              </Box>
            )}
          </HStack>

          {mascota.nombrePerfil && mascota.perfilId && (
            <Box
              bg="tema.suave"
              borderRadius="full"
              px="2"
              py="1"
              _hover={
                redirigirPerfil
                  ? { bg: "tema.llamativo", cursor: "pointer" }
                  : undefined
              }
              onClick={redirigirPerfil ? irAlPerfil : undefined}
            >
              <HStack gap="1">
                <CircleUser size={16} color="white" />
                <Text fontSize="xs" fontWeight="medium" color="tema.claro">
                  {mascota.nombrePerfil} #{mascota.perfilId}
                </Text>
              </HStack>
            </Box>
          )}
        </VStack>
      </Box>
    </Link>
  );
}
