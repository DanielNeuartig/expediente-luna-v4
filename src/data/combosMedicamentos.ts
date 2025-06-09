// src/data/combosMedicamentos.ts
import type { NotaClinicaValues } from "@/lib/validadores/notaClinicaSchema";

function sumarDias(base: Date, dias: number): Date {
  const nueva = new Date(base);
  nueva.setDate(nueva.getDate() + dias);
  return nueva;
}

export function generarKitDermatitis(): NotaClinicaValues["medicamentos"] {
  const inicio = new Date();

  return [
    {
      nombre: "Prednisona",
      dosis: "",
      via: "ORAL",
      frecuenciaHoras: 12,
      duracionDias: 5,
      desde: inicio,
      tiempoIndefinido: "false",
      paraCasa: "true",
     //  modo: "natural",
    },
    {
      nombre: "Prednisona",
      dosis: "",
      via: "ORAL",
      frecuenciaHoras: 24,
      duracionDias: 5,
      desde: sumarDias(inicio, 6),
      tiempoIndefinido: "false",
      paraCasa: "true",
      // modo: "natural",
    },
    {
      nombre: "Prednisona",
      dosis: "",
      via: "ORAL",
      frecuenciaHoras: 48,
      duracionDias: 6,
      desde: sumarDias(inicio, 12),
      tiempoIndefinido: "false",
      paraCasa: "true",
     //  modo: "natural",
    },
  ];
}