import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toaster } from "@/components/ui/toaster";
import { z } from "zod";

// ✅ Schema de validación para los resultados analíticos
export const crearLaboratorialSchema = z.object({
  solicitudId: z.number(),
  fechaToma: z.string(),
  resultados: z.array(
    z.object({
      nombre: z.string(),
      valor: z.number().nullable(),
    })
  ),
});

export type DatosLaboratorial = z.infer<typeof crearLaboratorialSchema>;

export function useCrearLaboratorial() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (datos: DatosLaboratorial) => {
      const res = await fetch("/api/laboratoriales/crear", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(datos),
      });

      const json = await res.json();

      if (!res.ok) {
        throw new Error(json.error || "Error al guardar resultados");
      }

      return json;
    },

    onSuccess: async (_, datos) => {
      toaster.create({
        type: "success",
        description: "Resultados guardados correctamente",
      });

      await queryClient.invalidateQueries({
        queryKey: ["solicitud", datos.solicitudId],
      });
    },

    onError: (error: unknown) => {
      const msg = error instanceof Error ? error.message : "Error desconocido";
      toaster.create({ type: "error", description: msg });
    },
  });
}