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

// Validación completa para el campo 'desde'
const desdeField = z
  .preprocess(
    (val) => (val === "" ? undefined : new Date(val as string)),
    z.date()
  )
  .refine((fecha) => !isNaN(fecha.getTime()), {
    message: "La fecha es inválida",
  })
  .refine(
    (fecha) => {
      const hoy = new Date();
      hoy.setHours(0, 0, 0, 0);
      return fecha >= hoy;
    },
    {
      message: "La fecha no puede ser anterior a hoy",
    }
  )
  .refine(
    (fecha) => {
      const limite = new Date();
      limite.setFullYear(limite.getFullYear() + 1);
      return fecha <= limite;
    },
    {
      message: "La fecha no puede ser demasiado en el futuro",
    }
  );

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
    desde: desdeField,
    observaciones: z.preprocess(formatObservaciones, z.string().optional()),
    paraCasa: z.enum(["true", "false"]),
    duracionDias: z.number().min(1).optional(),
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
  )/*
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
  );*/

// ------------------------------
// INDICACIÓN (TEXTO LIBRE)
// ------------------------------
const indicacionObligatoriaSchema = z.object({
  descripcion: z
    .string()
    .min(3, "La indicación debe tener al menos 3 caracteres")
    .max(1000, "La indicación es demasiado larga"),
});

// ------------------------------
// SOLICITUD LABORATORIAL
// ------------------------------
const fechaTomaDeMuestraField = z
  .preprocess(
    (val) => (val === "" ? undefined : new Date(val as string)),
    z.date({ required_error: "Debes indicar la fecha de toma de muestra" })
  )
  .refine((fecha) => !isNaN(fecha.getTime()), {
    message: "La fecha de toma de muestra es inválida",
  })
  .refine(
    (fecha) => {
      const ahora = new Date();
      const haceDosAnios = new Date();
      haceDosAnios.setFullYear(ahora.getFullYear() - 2);
      return fecha >= haceDosAnios;
    },
    {
      message: "La fecha de toma de muestra no puede ser demasiado antigua",
    }
  )
  .refine(
    (fecha) => {
      const ahora = new Date();
      const dentroDeUnAnio = new Date();
      dentroDeUnAnio.setFullYear(ahora.getFullYear() + 1);
      return fecha <= dentroDeUnAnio;
    },
    {
      message: "La fecha de toma de muestra no puede ser demasiado futura",
    }
  );

const solicitudLaboratorialSchema = z.object({
  estudio: z.string().min(1, "El estudio es obligatorio"),
  proveedor: z.string().min(1, "El proveedor es obligatorio"),
  observacionesClinica: z.string().optional(),
  fechaTomaDeMuestra: fechaTomaDeMuestraField,
});

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
  solicitudesLaboratoriales: z.array(solicitudLaboratorialSchema).optional(),
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
    (data.indicaciones && data.indicaciones.length > 0) ||
    (data.solicitudesLaboratoriales &&
      data.solicitudesLaboratoriales.length > 0),
  {
    path: ["historiaClinica"],
    message:
      "Debes llenar al menos un dato clínico o añadir un medicamento, indicación o solicitud",
  }
);

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
      (data.solicitudesLaboratoriales &&
        data.solicitudesLaboratoriales.length > 0) ||
      data.anularNotaId !== undefined ||
      data.firmarNotaId !== undefined,
    {
      path: ["historiaClinica"],
      message:
        "Debes llenar al menos un dato clínico, anular una nota o firmar una existente",
    }
  );
