"use client";

import { Stack, Box, HStack, Badge } from "@chakra-ui/react";
import BoxMascota from "../BoxMascota";
import { formatDistanceToNow } from "date-fns";
import { es } from "date-fns/locale";
import { Especie, Sexo, Esterilizacion } from "@prisma/client";
import {
  HiClipboardList,
  HiBookmark,
  HiCheckCircle,
  HiClock,
  HiUser,
} from "react-icons/hi";

type ExpedienteReciente = {
  id: number;
  nombre: string | null;
  tipo: string;
  estado: string;
  ultimaActividad: string;
  autor: { nombre: string; prefijo: string };
  mascota: {
    id: number;
    nombre: string;
    especie: Especie;
    fechaNacimiento?: string | Date;
    sexo: Sexo;
    esterilizado: Esterilizacion;
    microchip?: string | null;
    activo: boolean;
    raza?: { nombre: string } | null;
    perfil?: { id: number; nombre: string } | null;
  };
};

export default function ListaExpedientesRecientes({
  expedientes,
}: {
  expedientes: ExpedienteReciente[];
}) {
  return (
    <Stack gap={6}>
      {expedientes.map((exp) => (
        <Box key={exp.id} bg="tema.suave" borderRadius="xl" p="3">
          <BoxMascota
            mascota={{
              id: exp.mascota.id,
              nombre: exp.mascota.nombre,
              tipo: "mascota",
              especie: exp.mascota.especie,
              fechaNacimiento: exp.mascota.fechaNacimiento
                ? new Date(exp.mascota.fechaNacimiento).toISOString()
                : undefined,
              raza: exp.mascota.raza?.nombre,
              sexo: exp.mascota.sexo,
              esterilizado: exp.mascota.esterilizado,
              microchip: exp.mascota.microchip,
              activo: exp.mascota.activo,
              perfilId: exp.mascota.perfil?.id,
              nombrePerfil: exp.mascota.perfil?.nombre,
            }}
            redirigirPerfil
          />

          <HStack wrap="wrap" gap={2} mt={2} pl="2">
            <Badge
              variant="solid"
              colorPalette="blue"
              color="tema.claro"
              display="flex"
              alignItems="center"
              gap={1}
            >
              <HiClipboardList />
              {exp.nombre ?? "Sin nombre"}
            </Badge>

            <Badge
              variant="solid"
              colorPalette="purple"
              color="tema.claro"
              display="flex"
              alignItems="center"
              gap={1}
            >
              <HiBookmark />
              {exp.tipo}
            </Badge>

            <Badge
              variant="solid"
              colorPalette={exp.estado === "ACTIVO" ? "green" : "red"}
              color="tema.claro"
              display="flex"
              alignItems="center"
              gap={1}
            >
              <HiCheckCircle />
              {exp.estado}
            </Badge>

            <Badge
              variant="solid"
              colorPalette="orange"
              color="tema.claro"
              display="flex"
              alignItems="center"
              gap={1}
            >
              <HiClock />
              {formatDistanceToNow(new Date(exp.ultimaActividad), {
                addSuffix: true,
                locale: es,
              })}
            </Badge>

            <Badge
              variant="solid"
              colorPalette="pink"
              color="tema.claro"
              display="flex"
              alignItems="center"
              gap={1}
            >
              <HiUser />
              {exp.autor.prefijo} {exp.autor.nombre}
            </Badge>
          </HStack>
        </Box>
      ))}
    </Stack>
  );
}