// src/app/api/enviar/route.ts
import { NextResponse } from 'next/server'
import twilio from 'twilio'

// ✅ Tipado explícito del posible error de Twilio
type TwilioError = Error & {
  response?: {
    data?: {
      message?: string
      code?: number
      more_info?: string
    }
  }
}

const twilioClient = twilio(
  process.env.TWILIO_ACCOUNT_SID!,
  process.env.TWILIO_AUTH_TOKEN!
)

export async function POST(req: Request) {
  try {
    console.log('🚀 Entrando a la API /api/enviar')
    console.log('🌍 ENV:', {
      SID: process.env.TWILIO_ACCOUNT_SID,
      TOKEN: process.env.TWILIO_AUTH_TOKEN,
      SERVICE: process.env.TWILIO_VERIFY_SERVICE_SID,
    })

    const body = await req.json()
    const { clave, telefono } = body

    const numero = `${clave}${telefono}`

    console.log('📥 Datos recibidos en API /api/enviar:', body)
    console.log('📞 Número a verificar:', numero)

    const resultado = await twilioClient.verify.v2
      .services(process.env.TWILIO_VERIFY_SERVICE_SID!)
      .verifications.create({
        to: numero,
        channel: 'sms',
      })

    console.log('✅ Código enviado con estado:', resultado.status)

    return NextResponse.json({ mensaje: 'Código enviado correctamente' })
  } catch (err) {
    const error = err as TwilioError

    // 🧠 Retroalimentación: Twilio lanza errores con estructura útil, aprovecha esa información si está disponible
    console.error(
      '❌ Error al enviar código:',
      error.message,
      error.response?.data
    )

    return NextResponse.json(
      {
        error: 'No se pudo enviar el código',
        detalle: error.message,
        info: error.response?.data?.message ?? null, // adicionalmente puedes mostrar esto al frontend si quieres
      },
      { status: 500 }
    )
  }
}