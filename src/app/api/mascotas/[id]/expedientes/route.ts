// src/app/api/mascotas/[id]/expedientes/route.ts
import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { auth } from '@/lib/auth'

export async function GET(req: Request) {
  const session = await auth()

  if (!session?.user?.id) {
    return NextResponse.json({ error: 'No autorizado' }, { status: 401 })
  }

  // ✅ Extraer el ID de mascota de forma segura usando regex
  const url = new URL(req.url)
  const match = url.pathname.match(/\/mascotas\/(\d+)\/expedientes/)
  const mascotaId = match ? Number(match[1]) : NaN

  if (isNaN(mascotaId)) {
    return NextResponse.json({ error: 'ID inválido' }, { status: 400 })
  }

  try {
    const expedientes = await prisma.expedienteMedico.findMany({
      where: { mascotaId },
      include: {
        autor: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
        notasClinicas: {
          select: {
            id: true,
            fechaCreacion: true,
          },
          orderBy: { fechaCreacion: 'asc' },
        },
      },
      orderBy: { fechaCreacion: 'desc' },
    })

    return NextResponse.json(expedientes)
  } catch (error) {
    console.error('❌ Error al obtener expedientes:', error)
    return NextResponse.json({ error: 'Error interno del servidor' }, { status: 500 })
  }
}