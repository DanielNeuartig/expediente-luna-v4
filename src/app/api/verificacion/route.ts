// src/app/api/verificacion/route.ts
import { NextResponse } from 'next/server'
import twilio from 'twilio'

const client = twilio(
  process.env.TWILIO_ACCOUNT_SID!,
  process.env.TWILIO_AUTH_TOKEN!
)

export async function POST(req: Request) {
  const { clave, telefono } = await req.json()

  if (!clave || !telefono) {
    return NextResponse.json({ error: 'Datos incompletos' }, { status: 400 })
  }

  const numeroCompleto = `${clave}${telefono.replace(/\D/g, '')}`

  try {
    const resultado = await client.verify.v2
      .services(process.env.TWILIO_SERVICE_SID!)
      .verifications.create({
        to: numeroCompleto,
        channel: 'sms',
      })

    return NextResponse.json({ mensaje: 'Código enviado', status: resultado.status })
  } catch (error) {
    console.error('Error al enviar código:', error)
    return NextResponse.json({ error: 'Error al enviar el código' }, { status: 500 })
  }
}