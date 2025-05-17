import { prisma } from '@/lib/prisma'
import { NextResponse } from 'next/server'

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url)
  const q = searchParams.get('q')?.trim()

  if (!q || q.length < 2) {
    return NextResponse.json([])
  }

  const resultados = await prisma.perfil.findMany({
    where: isNaN(Number(q))
      ? {
          nombre: {
            contains: q,
            mode: 'insensitive',
          },
        }
      : {
          telefonoPrincipal: {
            contains: q.replace(/\D/g, ''),
          },
        },
    orderBy: { nombre: 'asc' },
    take: 10,
    select: {
      id: true,
      nombre: true,
      telefonoPrincipal: true,
    },
  })

  return NextResponse.json(resultados)
}