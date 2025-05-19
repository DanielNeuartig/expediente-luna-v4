// src/app/dashboard/expedientes/route.ts
import { NextResponse } from 'next/server'
import { z } from 'zod'
import { prisma } from '@/lib/prisma'
import { auth } from '@/lib/auth'

const expedienteSchema = z.object({
  mascotaId: z.number().int(),
  tipo: z.enum(['CONSULTA', 'CIRUGIA', 'HOSPITALIZACION', 'LABORATORIO', 'OTRO']),
  contenidoAdaptado: z.string().optional(),
  notasGenerales: z.string().optional(),
  visibleParaTutor: z.boolean().optional(),
})

export async function POST(req: Request) {
  const session = await auth()
  if (!session?.user?.id) {
        console.warn('🚫 No autorizado, sesión faltante') // 👈
    return NextResponse.json({ error: 'No autorizado' }, { status: 401 })
  }

  const json = await req.json()
    console.log('📩 Datos recibidos en API:', json) // 👈
  const parse = expedienteSchema.safeParse(json)

  if (!parse.success) {
        console.error('❌ Validación Zod fallida:', parse.error.flatten()) // 👈
    return NextResponse.json({ error: parse.error.flatten() }, { status: 400 })
  }

  const datos = parse.data

  try {
    const expediente = await prisma.expedienteMedico.create({
      data: {
        mascotaId: datos.mascotaId,
        autorId: session.user.id,
        tipo: datos.tipo,
        contenidoAdaptado: datos.contenidoAdaptado ?? null,
        notasGenerales: datos.notasGenerales ?? null,
        visibleParaTutor: datos.visibleParaTutor ?? false,
      },
      include: {
        mascota: true,
        autor: true,
        notasClinicas: true,
      },
    })
    console.log('✅ Expediente creado:', expediente) // 👈
    return NextResponse.json(expediente)
  } catch (err) {
        console.error('💥 Error en prisma.create:', err) // 👈
    console.error('❌ Error al crear expediente:', err)
    return NextResponse.json({ error: 'Error interno del servidor' }, { status: 500 })
  }
}