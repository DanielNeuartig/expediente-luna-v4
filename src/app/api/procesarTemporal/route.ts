import { prisma } from "@/lib/prisma";
import { getSignedUrl } from "@/lib/s3";
import { NextRequest, NextResponse } from "next/server";
import OpenAI from "openai";
import { PROMPT_BIOMETRIA_ELDOC } from "@/lib/prompts";

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

export async function POST(req: NextRequest) {
  const { token, id } = await req.json();
  const archivoId = Number(id);

  if (!token || Number.isNaN(archivoId)) {
    return NextResponse.json(
      { error: "Parámetros inválidos" },
      { status: 400 }
    );
  }

  // 1. Buscar archivo y validar token
  const archivo = await prisma.archivoLaboratorial.findUnique({
    where: { id: archivoId },
    include: {
      solicitud: { select: { tokenAcceso: true } },
    },
  });

  if (!archivo || archivo.solicitud?.tokenAcceso !== token) {
    return NextResponse.json(
      { error: "Archivo no autorizado" },
      { status: 403 }
    );
  }
  try {
    // 2. Obtener URL firmada de descarga
    const signedUrl = await getSignedUrl(
      archivo.url,
      archivo.tipo,
      "getObject"
    );

    // 3. Preparar mensaje con imagen para GPT-4
    const messages: OpenAI.Chat.Completions.ChatCompletionMessageParam[] = [
      {
        role: "system",
        content: PROMPT_BIOMETRIA_ELDOC,
      },
      {
        role: "user",
        content: [
          {
            type: "image_url",
            image_url: {
              url: signedUrl,
            },
          },
        ],
      },
    ];

    console.log("📝 Enviando a ChatGPT:", JSON.stringify(messages, null, 2));
    // 4. Llamar a OpenAI
    const response = await openai.chat.completions.create({
      model: "gpt-4o",
      messages,
      max_tokens: 2000,
    });

    const resultadoRaw =
      response.choices?.[0]?.message?.content ?? "Sin respuesta";
    console.log("🧠 Resultado del análisis GPT-4:", resultadoRaw);

    // 🔍 Limpiar ``` si existen
    const jsonMatch = resultadoRaw.match(/```(?:json)?\s*([\s\S]*?)\s*```/i);
    const resultadoLimpio = jsonMatch ? jsonMatch[1] : resultadoRaw;

    let datos;
    try {
      datos = JSON.parse(resultadoLimpio);
    } catch (err) {
      console.error("❌ Error al parsear JSON:", err);
      return NextResponse.json(
        {
          error: "La respuesta de GPT no es un JSON válido",
          resultadoBruto: resultadoRaw,
        },
        { status: 422 }
      );
    }

    // ✅ Respondemos con los datos parseados
    return NextResponse.json({ datos });
  } catch (error) {
    console.error("❌ Error al procesar con IA:", error);
    return NextResponse.json(
      { error: "Error interno al procesar imagen" },
      { status: 500 }
    );
  }
}
