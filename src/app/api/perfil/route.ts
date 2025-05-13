import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { perfilSchema } from '@/lib/validadores/perfilSchema'
import { auth } from '@/lib/auth'
import twilio from 'twilio'

const twilioClient = twilio(
  process.env.TWILIO_ACCOUNT_SID!,
  process.env.TWILIO_AUTH_TOKEN!
)

export async function POST(req: Request) {
  console.log('🚀 Entrando a la API /api/perfil')
  const session = await auth()
  if (!session || !session.user?.id) {
    return NextResponse.json({ error: 'No autorizado' }, { status: 401 })
  }

  const body = await req.json()
  const validacion = perfilSchema.safeParse(body)

  if (!validacion.success) {
    return NextResponse.json({ error: validacion.error.format() }, { status: 400 })
  }

  const {
    nombre,
    clave,
    telefonoPrincipal,
    telefonoSecundario1,
    telefonoSecundario2,
    codigoVerificacion,
  } = validacion.data

  const numeroCompleto = `${clave}${telefonoPrincipal}`

  let telefonoVerificado = false

  let perfilExistente: { id: number } | null = null

  try {
    perfilExistente = await prisma.perfil.findUnique({
      where: { usuarioId: session.user.id },
      select: { id: true },
    })

    if (!perfilExistente) {
      const verificacion = await twilioClient.verify.v2
        .services(process.env.TWILIO_VERIFY_SERVICE_SID!)
        .verificationChecks.create({
          to: numeroCompleto,
          code: codigoVerificacion,
        })

      if (verificacion.status !== 'approved') {
        return NextResponse.json(
          { error: 'Código de verificación inválido o expirado' },
          { status: 400 }
        )
      }

      telefonoVerificado = true
    }
  } catch (err) {
    console.error('❌ Error al verificar número:', err)
    return NextResponse.json(
      { error: 'Error durante la verificación del número' },
      { status: 500 }
    )
  }

try {
  const data = {
    nombre,
    clave,
    telefonoPrincipal,
    telefonoSecundario1,
    telefonoSecundario2,
    telefonoVerificado,
    creadoPor: {
      connect: { id: session.user.id },
    },
    ...(perfilExistente ? {} : {
      usuario: {
        connect: { id: session.user.id },
      },
    }),
  }

  console.log('📦 Datos que se intentarán guardar en DB:', data)

  const [perfil] = await prisma.$transaction([
    prisma.perfil.create({ data }),
  ])

  return NextResponse.json({ mensaje: 'Perfil creado exitosamente', perfil })
} catch (err) {
  if (err instanceof Error) {
    console.error('❌ Error al crear perfil en la base de datos:')
    console.error('→ Mensaje:', err.message)
    console.error('→ Stack:', err.stack)

    const prismaErr = err as { code?: string; meta?: unknown }

    console.error('→ Código de error (Prisma):', prismaErr.code)
    console.error('→ Detalles (Prisma):', prismaErr.meta)

    return NextResponse.json(
      {
        error: err.message,
        prisma: {
          code: prismaErr.code,
          meta: prismaErr.meta,
        },
      },
      { status: 500 }
    )
  }

  return NextResponse.json(
    { error: 'Error desconocido' },
    { status: 500 }
  )
}
}