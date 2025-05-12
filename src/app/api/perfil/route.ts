// src/app/api/perfil/route.ts
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

  try {
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
  } catch (err) {
    console.error('Error al verificar código Twilio:', err)
    return NextResponse.json(
      { error: 'Error al verificar el código' },
      { status: 500 }
    )
  }

  try {
    const perfil = await prisma.perfil.create({
      data: {
        nombre,
        clave,
        telefonoPrincipal,
        telefonoSecundario1,
        telefonoSecundario2,
        usuario: {
          connect: { id: session.user.id },
        },
      },
    })

    return NextResponse.json({ mensaje: 'Perfil creado exitosamente', perfil })
  } catch (err) {
    console.error('Error al crear perfil en la base de datos:', err)
    return NextResponse.json(
      { error: 'Error al crear el perfil' },
      { status: 500 }
    )
  }
}