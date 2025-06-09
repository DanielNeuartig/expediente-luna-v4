// src/data/combosMedicamentos.ts
import type { NotaClinicaValues } from "@/lib/validadores/notaClinicaSchema";

function sumarHoras(base: Date, horas: number): Date {
  const nueva = new Date(base);
  nueva.setHours(nueva.getHours() + horas);
  return nueva;
}

export function generarKitDermatitis(): NotaClinicaValues["medicamentos"] {
  const inicio = new Date();

  const prednisona1 = {
    nombre: "Prednisona",
    dosis: "",
    via: "ORAL" as const,
    frecuenciaHoras: 12,
    duracionDias: 5,
    desde: inicio,
    tiempoIndefinido: "false" as const,
    paraCasa: "true" as const,
  };

  const prednisona2 = {
    ...prednisona1,
    frecuenciaHoras: 24,
    duracionDias: 5,
    desde: sumarHoras(prednisona1.desde, prednisona1.duracionDias * prednisona1.frecuenciaHoras),
  };

  const prednisona3 = {
    ...prednisona1,
    frecuenciaHoras: 48,
    duracionDias: 10,
    desde: sumarHoras(prednisona2.desde, prednisona2.duracionDias * prednisona2.frecuenciaHoras),
  };

  return [prednisona1, prednisona2, prednisona3];
}