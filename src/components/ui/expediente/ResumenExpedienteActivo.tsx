"use client";

import { Box, HStack, Spinner, Text } from "@chakra-ui/react";
import { useMemo } from "react";
import { differenceInMinutes, format } from "date-fns";
import { es } from "date-fns/locale";
import { EstadoNotaClinica } from "@prisma/client";

type Props = {
  fechaInicio: string;
  notas: {
    estado: EstadoNotaClinica;
    fechaCreacion: string;
  }[];
  ultimaActividad?: string | null;
};

function tiempoHumano(min: number) {
  if (min < 1) return "hace menos de 1 minuto";
  if (min < 60) return `hace ${min} min`;
  if (min < 1440) return `hace ${Math.floor(min / 60)} h`;
  return `hace ${Math.floor(min / 1440)} día${min >= 2880 ? "s" : ""}`;
}

export default function ResumenExpedienteActivo({
  fechaInicio,
  notas,
  ultimaActividad,
}: Props) {
  const horaInicio = useMemo(
    () => format(new Date(fechaInicio), "HH:mm", { locale: es }),
    [fechaInicio]
  );

  const minutosDesdeUltimaActividad = useMemo(() => {
    if (!ultimaActividad) return null;
    return differenceInMinutes(new Date(), new Date(ultimaActividad));
  }, [ultimaActividad]);

  const totalNotasRelevantes = useMemo(
    () =>
      notas.filter(
        (n) =>
          n.estado === EstadoNotaClinica.FINALIZADA 
      ).length,
    [notas]
  );

  const bordeColor = useMemo(() => {
    if (minutosDesdeUltimaActividad === null) return "green.300";
    if (minutosDesdeUltimaActividad < 60) return "green.300";
    if (minutosDesdeUltimaActividad < 360) return "yellow.300";
    return "red.300";
  }, [minutosDesdeUltimaActividad]);

  const fondoColor = useMemo(() => {
    if (minutosDesdeUltimaActividad === null) return "green.50";
    if (minutosDesdeUltimaActividad < 60) return "green.50";
    if (minutosDesdeUltimaActividad < 360) return "yellow.50";
    return "red.50";
  }, [minutosDesdeUltimaActividad]);

  const fraseUltimaActividad = useMemo(() => {
    return minutosDesdeUltimaActividad != null
      ? `· Última actividad ${tiempoHumano(minutosDesdeUltimaActividad)}`
      : "";
  }, [minutosDesdeUltimaActividad]);

  return (
    <Box
      bg={fondoColor}
      border="1px solid"
      borderColor={bordeColor}
      borderRadius="md"
      p="3"
      mb="4"
      mt="1"
    >
      <HStack gap="4">
        <Spinner size="lg" color={bordeColor} />
        <Text color="tema.suave" fontWeight="medium" fontSize="lg">
          Expediente activo
        </Text>
        <Text color="tema.intenso" fontWeight="medium" fontSize="sm">
          Creado {horaInicio} · {totalNotasRelevantes} nota
          {totalNotasRelevantes === 1 ? "" : "s"} clínica
          {fraseUltimaActividad && ` ${fraseUltimaActividad}`}
        </Text>
      </HStack>
    </Box>
  );
}