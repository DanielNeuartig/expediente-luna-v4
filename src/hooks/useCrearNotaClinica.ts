// src/hooks/useCrearNotaClinica.ts
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toaster } from "@/components/ui/toaster";
import { z } from "zod";
import { notaClinicaBaseSchema } from "@/lib/validadores/notaClinicaSchema";

// ✅ Schema extendido actualizado
export const notaClinicaConIdsSchema = notaClinicaBaseSchema
  .extend({
    expedienteId: z.number(),
    mascotaId: z.number(),
    anularNotaId: z.number().optional(),
    firmarNotaId: z.number().optional(),
  })
  .refine(
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
      (data.indicaciones && data.indicaciones.length > 0) ||
      data.anularNotaId !== undefined ||
      data.firmarNotaId !== undefined,
    {
      path: ["historiaClinica"],
      message:
        "Debes llenar al menos un dato clínico o realizar una acción (anular o firmar).",
    }
  );

export type ValoresNotaClinicaExtendida = z.infer<
  typeof notaClinicaConIdsSchema
>;

export function useCrearNotaClinica() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (datos: ValoresNotaClinicaExtendida) => {
      const soloAnular =
        datos.anularNotaId !== undefined &&
        datos.firmarNotaId === undefined &&
        !datos.historiaClinica &&
        !datos.exploracionFisica;

      const soloFirmar =
        datos.firmarNotaId !== undefined &&
        datos.anularNotaId === undefined &&
        !datos.historiaClinica &&
        !datos.exploracionFisica;

      const body = soloAnular
        ? {
            mascotaId: datos.mascotaId,
            expedienteId: datos.expedienteId,
            anularNotaId: datos.anularNotaId,
          }
        : soloFirmar
        ? {
            mascotaId: datos.mascotaId,
            expedienteId: datos.expedienteId,
            firmarNotaId: datos.firmarNotaId,
          }
        : datos;

      const res = await fetch("/api/nota-clinica", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });

      const json = await res.json();

      if (!res.ok) {
        throw new Error(json.error || "Error al guardar la nota clínica");
      }

      return json;
    },
    onSuccess: (res, datos) => {
      let mensaje = "Nota clínica guardada correctamente";

      if (res.anulado) {
        mensaje = "Nota clínica anulada correctamente";
      } else if (datos.firmarNotaId !== undefined) {
        mensaje = "Nota clínica firmada exitosamente";
      }

      toaster.create({ type: "success", description: mensaje });

      queryClient.invalidateQueries({
        queryKey: ["expedientes", datos.mascotaId],
      });
    },
    onError: (error: unknown) => {
      const msg = error instanceof Error ? error.message : "Error desconocido";
      toaster.create({ type: "error", description: msg });
    },
  });
}