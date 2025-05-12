import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET() {
  const usuario = await prisma.user.findUnique({
    where: { email: 'danielneuartig@gmail.com' },
    select: {
      id: true,
      email: true,
      tipoUsuario: true,
      activo: true,
    },
  })

  if (!usuario) {
    return NextResponse.json({ error: 'Usuario no encontrado' }, { status: 404 })
  }

  return NextResponse.json({ mensaje: 'Usuario obtenido', usuario })
}