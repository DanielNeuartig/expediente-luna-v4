// src/types/nota.ts

import { NotaClinica, EstadoNotaClinica } from "@prisma/client";

// Incluye los campos necesarios para reemplazar una nota
export type NotaAReemplazar = Pick<
  NotaClinica,
  | "id"
  | "expedienteId"
  | "historiaClinica"
  | "exploracionFisica"
  | "temperatura"
  | "peso"
  | "frecuenciaCardiaca"
  | "frecuenciaRespiratoria"
  | "diagnosticoPresuntivo"
  | "pronostico"
  | "laboratoriales"
  | "extras"
  | "fechaCancelacion"
  | "anuladaPorId"
  | "autorId"
  | "archivos"
  | "estado" // ✅ nuevo campo requerido
>;