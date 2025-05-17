// src/lib/validadores/mascotaSchema.ts
import { z } from 'zod'

export const mascotaSchema = z.object({
  nombre: z
    .string()
    .min(1, { message: "Nombre requerido" })
    .max(30, { message: "Máximo 30 caracteres" })
    .transform((val) =>
      val
        .trim()
        .replace(/\s+/g, " ")
        .split(" ")
        .map((p) => p.charAt(0).toUpperCase() + p.slice(1).toLowerCase())
        .join(" ")
    )
    .refine((val) => /^[A-Za-zÁÉÍÓÚÑáéíóúñ\s]+$/.test(val), {
      message: "Solo se permiten letras y espacios",
    })
    .refine((val) => val.split(" ").every((w) => w.length >= 2), {
      message: "Cada palabra debe tener al menos 2 letras",
    })
    .refine((val) => val.split(" ").length >= 2, {
      message: "Debe contener al menos dos palabras",
    }),

  especie: z.enum(["CANINO", "FELINO", "AVE", "REPTIL", "ROEDOR", "OTRO"], {
    errorMap: () => ({ message: "Selecciona una especie válida" }),
  }),

  sexo: z.enum(["MACHO", "HEMBRA", "DESCONOCIDO"], {
    errorMap: () => ({ message: "Selecciona un sexo válido" }),
  }),

  esterilizado: z.enum(["ESTERILIZADO", "NO_ESTERILIZADO", "DESCONOCIDO"], {
    errorMap: () => ({ message: "Selecciona una opción válida" }),
  }),

  color: z
    .string()
    .trim()
    .max(30, { message: "Máximo 30 caracteres" })
    .refine((str) => /^[A-Za-zÁÉÍÓÚáéíóúÑñ0-9\s]*$/.test(str), {
      message: "Solo se permiten letras, números y espacios",
    })
    .transform((str) =>
      str
        .replace(/\s{2,}/g, " ")
        .replace(/^(\w)(\w*)/, (_, p, r) => p.toUpperCase() + r.toLowerCase())
    )
    .optional(),

fechaNacimiento: z
  .string()
  .refine(val => !isNaN(new Date(val).getTime()), { message: "Fecha inválida" })
  .refine(val => new Date(val) <= new Date(), { message: "La fecha no puede ser futura" })
  .refine(val => new Date(val).getFullYear() >= 2000, { message: "La fecha no puede ser anterior al año 2000" }),

  alergias: z
    .string()
    .trim()
    .max(100, { message: "Máximo 100 caracteres" })
    .refine((str) => /^[A-Za-zÁÉÍÓÚáéíóúÑñ0-9\s]*$/.test(str), {
      message: "Solo se permiten letras, números y espacios",
    })
    .transform((str) =>
      str
        .replace(/\s{2,}/g, " ")
        .replace(/^(\w)(.*)/, (_, p, r) => p.toUpperCase() + r.toLowerCase())
    )
    .optional(),

  señas: z
    .string()
    .trim()
    .max(100, { message: "Máximo 100 caracteres" })
    .refine((str) => /^[A-Za-zÁÉÍÓÚáéíóúÑñ0-9\s]*$/.test(str), {
      message: "Solo se permiten letras, números y espacios",
    })
    .transform((str) =>
      str
        .replace(/\s{2,}/g, " ")
        .replace(/^(\w)(.*)/, (_, p, r) => p.toUpperCase() + r.toLowerCase())
    )
    .optional(),

  microchip: z
    .string()
    .trim()
    .max(30, { message: "Máximo 30 caracteres" })
    .refine((str) => /^[A-Z0-9\-]*$/i.test(str), {
      message: "Solo se permiten letras, números o guiones",
    })
    .transform((str) =>
      str
        .replace(/\s+/g, "")
        .toUpperCase()
    )
    .optional(),

  razaId: z.number().optional(),
perfilId: z.number({
  required_error: "El ID del perfil es obligatorio",
  invalid_type_error: "El ID del perfil debe ser un número",
}),
  imagen: z.string().optional()
})