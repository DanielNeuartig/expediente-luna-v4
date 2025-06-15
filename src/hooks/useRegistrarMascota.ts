// src/hooks/useRegistrarMascota.ts
import { useMutation } from "@tanstack/react-query";
import { toaster } from "@/components/ui/toaster";
import { z } from "zod";
import { mascotaSchema } from "@/lib/validadores/mascotaSchema";

type NuevaMascota = z.infer<typeof mascotaSchema>;

export function useRegistrarMascota() {
  return useMutation({
    mutationFn: async (datos: NuevaMascota) => {
      const res = await fetch("/api/mascota", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(datos),
      });

      const json = await res.json();

      if (!res.ok) {
        throw new Error(json.error || "Error al registrar mascota");
      }

      return json.mascota;
    },

    onError: (error: unknown) => {
      const msg = error instanceof Error ? error.message : "Error desconocido";
      toaster.create({ type: "error", description: msg });
    },
  });
}