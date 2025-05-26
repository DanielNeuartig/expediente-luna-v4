"use client";

import {
  Box,
  HStack,
  Spinner,
  Text,
  Portal,
  Menu,
  IconButton,
  Dialog,
  Button,
  CloseButton,
} from "@chakra-ui/react";
import { useState, useMemo } from "react";
import { differenceInMinutes, format } from "date-fns";
import { es } from "date-fns/locale";
import { EstadoNotaClinica } from "@prisma/client";
import { MoreVertical } from "lucide-react";

type Props = {
  fechaInicio: string;
  notas: {
    estado: EstadoNotaClinica;
    fechaCreacion: string;
  }[];
  ultimaActividad?: string | null;
  nombre: string;
  puedeFinalizar: boolean;
  onFinalizarExpediente: () => void;
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
  nombre,
  puedeFinalizar,
  onFinalizarExpediente,
}: Props) {
  const [abrirDialogoFinalizar, setAbrirDialogoFinalizar] = useState(false);

  const fechaCreacionHumana = useMemo(
    () => format(new Date(fechaInicio), "EEE dd/MM/yyyy", { locale: es }),
    [fechaInicio]
  );

  const minutosDesdeCreacion = useMemo(
    () => differenceInMinutes(new Date(), new Date(fechaInicio)),
    [fechaInicio]
  );

  const minutosDesdeUltimaActividad = useMemo(() => {
    if (!ultimaActividad) return null;
    return differenceInMinutes(new Date(), new Date(ultimaActividad));
  }, [ultimaActividad]);

  const totalNotasRelevantes = useMemo(
    () => notas.filter((n) => n.estado === EstadoNotaClinica.FINALIZADA).length,
    [notas]
  );

  const bordeColor = useMemo(() => {
    if (minutosDesdeUltimaActividad === null) return "green.300";
    if (minutosDesdeUltimaActividad < 2160) return "green.300";
    if (minutosDesdeUltimaActividad < 4320) return "yellow.300";
    return "red.300";
  }, [minutosDesdeUltimaActividad]);

  const fondoColor = useMemo(() => {
    if (minutosDesdeUltimaActividad === null) return "green.50";
    if (minutosDesdeUltimaActividad < 2160) return "green.50";
    if (minutosDesdeUltimaActividad < 4320) return "yellow.50";
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
        <Box>
          <Text color="tema.suave" fontWeight="bold" fontSize="lg">
            Expediente activo
          </Text>
          <Text color="tema.suave" fontWeight="medium" fontSize="md">
            {fraseUltimaActividad}
          </Text>
          <Text color="tema.intenso" fontWeight="bold" fontSize="md">
            {nombre}
          </Text>
        </Box>

        <Text color="tema.intenso" fontWeight="medium" fontSize="sm">
          Creado {fechaCreacionHumana} · Hace {tiempoHumano(minutosDesdeCreacion)} ·{" "}
          {totalNotasRelevantes} nota{totalNotasRelevantes === 1 ? "" : "s"} clínica
        </Text>

        {/* Menú de acciones */}
        <Menu.Root>
          <Menu.Trigger asChild>
            <IconButton
              aria-label="Acciones expediente"
              size="xs"
              variant="ghost"
            >
              <MoreVertical size={16} />
            </IconButton>
          </Menu.Trigger>
          <Portal>
            <Menu.Positioner>
              <Menu.Content>
                {puedeFinalizar && (
                  <Menu.Item value="finalizar" onSelect={() => setAbrirDialogoFinalizar(true)}>
                    Dar de alta expediente
                  </Menu.Item>
                )}
              </Menu.Content>
            </Menu.Positioner>
          </Portal>
        </Menu.Root>
      </HStack>

      {/* Dialogo de confirmación */}
      <Dialog.Root
        open={abrirDialogoFinalizar}
        onOpenChange={({ open }) => setAbrirDialogoFinalizar(open)}
        role="alertdialog"
      >
        <Portal>
          <Dialog.Backdrop />
          <Dialog.Positioner>
            <Dialog.Content>
              <Dialog.Header>
                <Dialog.Title>¿Finalizar este expediente?</Dialog.Title>
              </Dialog.Header>
              <Dialog.Body>
                <Text>
                  Esta acción marcará el expediente como finalizado. Asegúrate de que todas las notas estén firmadas antes de continuar.
                </Text>
              </Dialog.Body>
              <Dialog.Footer>
                <Dialog.ActionTrigger asChild>
                  <Button variant="outline">Cancelar</Button>
                </Dialog.ActionTrigger>
                <Button
                  colorPalette="green"
                  onClick={() => {
                    setAbrirDialogoFinalizar(false);
                    onFinalizarExpediente();
                  }}
                >
                  Confirmar alta
                </Button>
              </Dialog.Footer>
              <Dialog.CloseTrigger asChild>
                <CloseButton size="sm" />
              </Dialog.CloseTrigger>
            </Dialog.Content>
          </Dialog.Positioner>
        </Portal>
      </Dialog.Root>
    </Box>
  );
}