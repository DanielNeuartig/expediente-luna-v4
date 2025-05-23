import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toaster } from "@/components/ui/toaster";
import { z } from "zod";
import { notaClinicaBaseSchema } from "@/lib/validadores/notaClinicaSchema";
import type { NotaClinica } from "@prisma/client";

// Schema extendido con IDs
export const notaClinicaConIdsSchema = notaClinicaBaseSchema.extend({
  expedienteId: z.number(),
  mascotaId: z.number(),
}).refine(
  (data) =>
    !!data.historiaClinica?.trim() ||
    !!data.exploracionFisica?.trim() ||
    data.temperatura !== undefined ||
    data.peso !== undefined ||
    data.frecuenciaCardiaca !== undefined ||
    data.frecuenciaRespiratoria !== undefined ||
    !!data.diagnosticoPresuntivo?.trim() ||
    !!data.pronostico?.trim() ||
    !!data.laboratoriales?.trim() ||
    !!data.extras?.trim() ||
    (data.medicamentos && data.medicamentos.length > 0) ||
    (data.indicaciones && data.indicaciones.length > 0),
  {
    path: ["historiaClinica"],
    message:
      "Debes llenar al menos un dato clínico o añadir un medicamento o indicación válida",
  }
);

export type ValoresNotaClinicaExtendida = z.infer<typeof notaClinicaConIdsSchema>;

type ExpedienteConNotas = {
  id: number;
  tipo: string;
  fechaCreacion: string;
  autor?: {
    id: number;
    nombre: string;
    usuario?: { image?: string | null } | null;
  } | null;
  notasClinicas: NotaClinica[];
};

type CacheExpedientes = {
  expedientes: ExpedienteConNotas[];
  aplicacionesMedicamentos: unknown[]; // Puedes tipar si tienes el tipo `AplicacionMedicamento`
  aplicacionesIndicaciones: unknown[]; // Igual con `AplicacionIndicacion`
};

export function useCrearNotaClinica() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (datos: ValoresNotaClinicaExtendida) => {
      const res = await fetch("/api/nota-clinica", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(datos),
      });

      const json = await res.json();

      if (!res.ok) {
        throw new Error(json.error || "Error al guardar nota clínica");
      }

      return json.notaClinica as NotaClinica;
    },
    onSuccess: (nuevaNota, datos) => {
      queryClient.setQueryData<CacheExpedientes>(
        ["expedientes", datos.mascotaId],
        (prev) => {
          if (!prev) return prev;

          return {
            ...prev,
            expedientes: prev.expedientes.map((exp) => {
              if (exp.id === datos.expedienteId) {
                return {
                  ...exp,
                  notasClinicas: [...exp.notasClinicas, nuevaNota],
                };
              }
              return exp;
            }),
          };
        }
      );

      toaster.create({
        type: "success",
        description: "Nota clínica guardada correctamente",
      });
    },
    onError: (error: unknown) => {
      const msg = error instanceof Error ? error.message : "Error desconocido";
      toaster.create({ type: "error", description: msg });
    },
  });
}