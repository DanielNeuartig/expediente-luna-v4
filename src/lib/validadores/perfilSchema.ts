// src/lib/validadores/perfilSchema.ts
import { z } from 'zod'

const nombreSchema = z
  .string()
  .min(1, { message: 'El nombre es obligatorio' })
  .transform((val) =>
    val
      .trim()
      .split(/\s+/)
      .map((p) => p.charAt(0).toUpperCase() + p.slice(1).toLowerCase())
      .join(' ')
  )
  .refine(
    (value) => {
      const palabras = value.split(' ')
      return (
        palabras.length >= 2 &&
        palabras.every((p) => /^[A-Z][a-z]{2,}$/.test(p))
      )
    },
    {
      message:
        'Debes escribir al menos 2 palabras, cada una con mayúscula inicial y mínimo 3 letras',
    }
  )

const claveSchema = z
  .string()
  .regex(/^\+\d{1,3}$/, {
    message: 'La clave debe comenzar con "+" y tener de 1 a 3 dígitos',
  })

const telefonoSchema = z
  .string()
  .transform((val) => val.replace(/\D/g, '')) // Elimina espacios y guiones
  .refine((val) => /^\d{10}$/.test(val), {
    message: 'Debe contener exactamente 10 dígitos',
  })

const codigoVerificacionSchema = z
  .string()
  .refine((val) => /^\d{4}$/.test(val), {
    message: 'El código debe contener exactamente 4 dígitos',
  })

export const perfilSchema = z.object({
  nombre: nombreSchema,
  clave: claveSchema,
  prefijo: z.string().min(1, { message: 'El prefijo es obligatorio' }), // ✅ AÑADIDO
  documentoId: z.string().optional(), // ✅ AÑADIDO
  telefonoPrincipal: telefonoSchema,
  codigoVerificacion: codigoVerificacionSchema
    .optional()
    .or(z.literal('').transform(() => undefined)),
  telefonoSecundario1: telefonoSchema
    .optional()
    .or(z.literal('').transform(() => undefined)),
  telefonoSecundario2: telefonoSchema
    .optional()
    .or(z.literal('').transform(() => undefined)),
})

export type PerfilFormData = z.infer<typeof perfilSchema>