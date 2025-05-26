"use client";

import {
  Box,
  Text,
  Progress,
  Input,
} from "@chakra-ui/react";
import { EstadoNotaClinica } from "@prisma/client";
import { useState, useEffect } from "react";
import type { NotaClinica } from "@/types/expediente";
import { useQueryClient } from "@tanstack/react-query";
import { estilosInputBase } from "../config/estilosInputBase";

type Props = {
  notas: NotaClinica[];
  expedienteId: number;
  nombre: string;
};

export default function ProgresoExpediente({ notas, expedienteId, nombre }: Props) {
  // 🔴 Mueve el useState aquí, DENTRO del componente
  const [nombreExpediente, setNombreExpediente] = useState(nombre);
  const [guardando, setGuardando] = useState(false);
  const queryClient = useQueryClient();

  // ✅ Y el useEffect aquí también, después del useState
  useEffect(() => {
    setNombreExpediente(nombre);
  }, [nombre]);

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

  const actualizarNombre = async () => {
    const nuevoNombre = nombreExpediente.trim();
    if (!nuevoNombre || nuevoNombre === nombre) return;

    setGuardando(true);
    try {
      await fetch(`/api/expedientes/${expedienteId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ nombre: nuevoNombre }),
      });
    } catch (e) {
      console.error("❌ Error actualizando nombre:", e);
    } finally {
      queryClient.invalidateQueries({
        queryKey: ["expedientes"],
      });
      setGuardando(false);
    }
  };

  return (
    <Box mb="4" textAlign="center" maxW="md" mx="auto">
      <Input
        {...estilosInputBase}
        value={nombreExpediente}
        onChange={(e) => setNombreExpediente(e.target.value)}
        onBlur={actualizarNombre}
        fontSize="lg"
        color="tema.suave"
        fontWeight="bold"
        textAlign="center"
        mb="1"
        disabled={guardando}
      />

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