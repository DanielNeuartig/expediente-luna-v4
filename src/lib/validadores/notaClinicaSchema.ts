// src/lib/validadores/notaClinicaSchema.ts
import { z } from "zod";
import { ViaMedicamento } from "@prisma/client";

// Utilidad para evitar NaN con campos numéricos opcionales
const safeNumber = () =>
  z.preprocess((val) => {
    if (typeof val === "string" && val.trim() === "") return undefined;
    const num = Number(val);
    return isNaN(num) ? undefined : num;
  }, z.number().min(0.01).optional());

const safeInt = () =>
  z.preprocess((val) => {
    if (typeof val === "string" && val.trim() === "") return undefined;
    const num = Number(val);
    return isNaN(num) ? undefined : num;
  }, z.number().int().min(1).optional());

// Transformación de texto para observaciones
const formatObservaciones = (val: unknown) => {
  if (typeof val !== "string") return undefined;
  const trimmed = val.trim();
  if (!trimmed) return undefined;
  const capitalized = trimmed.charAt(0).toUpperCase() + trimmed.slice(1);
  return capitalized.endsWith(".") ? capitalized : capitalized + ".";
};

// ------------------------------
// MEDICAMENTO
// ------------------------------
const medicamentoObligatorioSchema = z
  .object({
    nombre: z
      .string()
      .min(1)
      .transform((val) =>
        val
          .trim()
          .split(/\s+/)
          .map((w) => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase())
          .join(" ")
      ),
    dosis: z
      .string()
      .min(1)
      .transform((val) => val.trim().toUpperCase()),
    via: z.nativeEnum(ViaMedicamento),
    frecuenciaHoras: safeInt(),
    veces: safeInt(),
    tiempoIndefinido: z.enum(["true", "false"]),
    desde: z.preprocess(
      (val) => (val === "" ? undefined : new Date(val as string)),
      z.date()
    ),
    observaciones: z.preprocess(formatObservaciones, z.string().optional()),
    paraCasa: z.enum(["true", "false"]),
  })
  .refine(
    (data) => {
      if (data.tiempoIndefinido === "true") {
        return data.frecuenciaHoras !== undefined && data.frecuenciaHoras > 0;
      }
      if (data.veces !== 1) {
        return data.frecuenciaHoras !== undefined && data.frecuenciaHoras > 0;
      }
      return true;
    },
    {
      path: ["frecuenciaHoras"],
      message:
        "Debes indicar cada cuántas horas se aplica y debe ser mayor a 0",
    }
  )
  .refine(
    (data) => data.tiempoIndefinido === "true" || data.veces !== undefined,
    {
      path: ["veces"],
      message:
        "Debes indicar el número de veces o marcar como tiempo indefinido",
    }
  )
  .refine(
    (data) => data.tiempoIndefinido === "false" || data.paraCasa === "true",
    {
      path: ["paraCasa"],
      message:
        "Los medicamentos por tiempo indefinido deben ser para casa (incluidos en receta)",
    }
  )
  .refine(
    (data) =>
      !(
        data.tiempoIndefinido === "false" &&
        data.veces === 1 &&
        data.frecuenciaHoras !== undefined
      ),
    {
      path: ["frecuenciaHoras"],
      message: "No debes indicar frecuencia si es una sola vez",
    }
  );

// ------------------------------
// INDICACIÓN
// ------------------------------
const indicacionObligatoriaSchema = z
  .object({
    descripcion: z.string().min(1),
    frecuenciaHoras: safeInt(),
    veces: safeInt(),
    tiempoIndefinido: z.enum(["true", "false"]),
    desde: z.preprocess(
      (val) => (val === "" ? undefined : new Date(val as string)),
      z.date()
    ),
    observaciones: z.preprocess(formatObservaciones, z.string().optional()),
    paraCasa: z.enum(["true", "false"]),
  })
  .refine(
    (data) => {
      if (data.tiempoIndefinido === "true") {
        return data.frecuenciaHoras !== undefined && data.frecuenciaHoras > 0;
      }
      if (data.veces !== 1) {
        return data.frecuenciaHoras !== undefined && data.frecuenciaHoras > 0;
      }
      return true;
    },
    {
      path: ["frecuenciaHoras"],
      message:
        "Debes indicar cada cuántas horas se aplica y debe ser mayor a 0",
    }
  )
  .refine(
    (data) => data.tiempoIndefinido === "true" || data.veces !== undefined,
    {
      path: ["veces"],
      message:
        "Debes indicar el número de veces o marcar como tiempo indefinido",
    }
  )
  .refine(
    (data) => data.tiempoIndefinido === "false" || data.paraCasa === "true",
    {
      path: ["paraCasa"],
      message:
        "Las indicaciones por tiempo indefinido deben ser para casa (incluidas en receta)",
    }
  )
  .refine(
    (data) =>
      !(
        data.tiempoIndefinido === "false" &&
        data.veces === 1 &&
        data.frecuenciaHoras !== undefined
      ),
    {
      path: ["frecuenciaHoras"],
      message: "No debes indicar frecuencia si es una sola vez",
    }
  );

// ------------------------------
// BASE DEL SCHEMA
// ------------------------------
export const notaClinicaBaseSchema = z.object({
  historiaClinica: z.string().optional(),
  exploracionFisica: z.string().optional(),
  temperatura: safeNumber(),
  peso: safeNumber(),
  frecuenciaCardiaca: safeInt(),
  frecuenciaRespiratoria: safeInt(),
  diagnosticoPresuntivo: z.string().optional(),
  pronostico: z.string().optional(),
  laboratoriales: z.string().optional(),
  extras: z.string().optional(),
  medicamentos: z.array(medicamentoObligatorioSchema).optional(),
  indicaciones: z.array(indicacionObligatoriaSchema).optional(),
});

export type NotaClinicaInput = z.input<typeof notaClinicaBaseSchema>;
export type NotaClinicaValues = z.infer<typeof notaClinicaBaseSchema>;

export const notaClinicaSchema = notaClinicaBaseSchema.refine(
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