// src/hooks/useCrearNotaClinica.ts
import { useMutation } from "@tanstack/react-query";
import { toaster } from "@/components/ui/toaster";
import { z } from "zod";
import { notaClinicaBaseSchema } from "@/lib/validadores/notaClinicaSchema";
// Puedes crear un esquema extendido si quieres validar también IDs
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

// Usa infer del schema extendido si validas antes de enviar
export type ValoresNotaClinicaExtendida = z.infer<typeof notaClinicaConIdsSchema>;

export function useCrearNotaClinica() {
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

      return json.notaClinica;
    },
    onSuccess: () => {
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