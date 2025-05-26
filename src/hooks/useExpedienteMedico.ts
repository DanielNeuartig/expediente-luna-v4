"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toaster } from "@/components/ui/toaster";
import type { ExpedienteConNotas } from "@/types/expediente";

type Input = {
  mascotaId: number;
  tipo?: "CONSULTA" | "CIRUGIA" | "HOSPITALIZACION" | "LABORATORIO" | "OTRO";
};

export function useCrearExpedienteMedico(
  onSuccess?: (e: ExpedienteConNotas) => void
) {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: async ({
      mascotaId,
      tipo = "CONSULTA",
    }: Input): Promise<ExpedienteConNotas> => {
      const res = await fetch("/api/expedientes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ mascotaId, tipo }),
      });

      if (!res.ok) {
        const error = await res.json();
        throw new Error(error?.error || "Error al crear expediente");
      }

      return res.json();
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({
        queryKey: ["expedientes", data.mascotaId],
      });
      toaster.create({
        description: "Expediente creado correctamente.",
        type: "success",
      });
      onSuccess?.(data);
    },
    onError: (error: unknown) => {
      const mensaje =
        error instanceof Error ? error.message : "Error al crear expediente.";
      toaster.create({
        description: mensaje,
        type: "error",
      });
    },
  });

  return mutation;
}
