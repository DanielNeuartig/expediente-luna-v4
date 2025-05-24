"use client";

import { Box, Text, Progress } from "@chakra-ui/react";
import { EstadoNotaClinica } from "@prisma/client";
import type { NotaClinica } from "@/types/expediente";

type Props = {
  notas: NotaClinica[];
};

export default function ProgresoExpediente({ notas }: Props) {
  const total = notas.length;
  const firmadas = notas.filter(n => n.estado === EstadoNotaClinica.FINALIZADA).length;
  const enRevision = notas.filter(n => n.estado === EstadoNotaClinica.EN_REVISION).length;
  const anuladas = notas.filter(n => n.estado === EstadoNotaClinica.ANULADA).length;

  const { progreso, mensaje, color } = (() => {
    if (total === 0) {
      return {
        progreso: 0,
        mensaje: "Aún no hay notas clínicas. Comienza registrando una.",
        color: "tema.suave",
      };
    }

    if (firmadas > 0 && enRevision > 0) {
      return {
        progreso: 75,
        mensaje: "Tienes notas firmadas, pero aún falta por firmar una.",
        color: "tema.llamativo",
      };
    }

    if (firmadas > 0) {
      return {
        progreso: 100,
        mensaje: "Nota clínica firmada. ¡Buen trabajo!",
        color: "tema.verde",
      };
    }

    if (enRevision > 0) {
      return {
        progreso: 50,
        mensaje: "Tienes notas en revisión. Recuerda firmarlas.",
        color: "tema.llamativo",
      };
    }

    if (anuladas === total) {
      return {
        progreso: 25,
        mensaje: "Las notas han sido anuladas. Agrega una nueva para continuar.",
        color: "tema.rojo",
      };
    }

    return {
      progreso: 33,
      mensaje: "Agrega notas para continuar.",
      color: "tema.suave",
    };
  })();

  return (
    <Box mb="4" textAlign="center" maxW="md" mx="auto">
      <Text fontSize="md" mb="1" color="tema.suave">
        {mensaje}
      </Text>
      <Progress.Root size="xl" borderRadius="md" bg="tema.suave" striped animated>
        <Progress.Track>
          <Progress.Range
            style={{
              width: `${progreso}%`,
              transition: "width 0.3s ease",
              backgroundColor: `var(--chakra-colors-${color.replace(".", "-")})`,
            }}
          />
        </Progress.Track>
      </Progress.Root>
    </Box>
  );
}