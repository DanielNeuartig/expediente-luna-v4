// src/app/api/razas/route.ts
import { prisma } from '@/lib/prisma'
import { NextResponse } from 'next/server'
import { Especie } from '@prisma/client'

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url)
    const especieParam = searchParams.get('especie')?.toUpperCase()

    // Validar especie contra enum Especie
    const especie = Object.values(Especie).includes(especieParam as Especie)
      ? (especieParam as Especie)
      : undefined

    const razas = await prisma.raza.findMany({
      where: especie ? { especie } : undefined,
      orderBy: [
        { especie: 'asc' },
        { nombre: 'asc' },
      ],
    })

    return NextResponse.json(razas)
  } catch (error) {
    console.error('❌ Error al obtener razas:', error)
    return NextResponse.json(
      { error: 'Error al obtener razas' },
      { status: 500 }
    )
  }
}