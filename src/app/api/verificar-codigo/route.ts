import { NextResponse } from "next/server";
import { z } from "zod";

// 🧠 Mapa en memoria: IP → { intentos, bloqueadoHasta }
const intentosPorIp = new Map<string, { intentos: number; bloqueadoHasta: number }>();

const schema = z.object({
  codigo: z.string().min(1),
});

export async function POST(req: Request) {
  const ip = req.headers.get("x-forwarded-for") || req.headers.get("host") || "desconocida";
  const ahora = Date.now();
  const body = await req.json();
  const parsed = schema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json({ success: false, error: "Formato inválido" }, { status: 400 });
  }

  const { codigo } = parsed.data;

  // 🚫 Verifica si la IP está bloqueada actualmente
  const registro = intentosPorIp.get(ip);
  if (registro && registro.bloqueadoHasta > ahora) {
    const segundosRestantes = Math.ceil((registro.bloqueadoHasta - ahora) / 1000);
    console.log(`[⛔️] IP ${ip} bloqueada aún por ${segundosRestantes}s`);

    return NextResponse.json(
      {
        success: false,
        error: "Demasiados intentos. Intenta más tarde.",
        tiempoRestante: segundosRestantes,
      },
      { status: 429 }
    );
  }

  // ❌ Código incorrecto
  if (!codigo || codigo !== process.env.CODIGO_LAB) {
    console.log(`[❌] Código incorrecto desde IP ${ip}`);

    const intentosPrevios = registro?.intentos ?? 0;
    const nuevosIntentos = intentosPrevios + 1;
    const bloqueadoHasta = nuevosIntentos >= 5 ? ahora + 1000 * 60 * 5 : 0; // ⏱ 5 min

    intentosPorIp.set(ip, { intentos: nuevosIntentos, bloqueadoHasta });

    return NextResponse.json(
      {
        success: false,
        error: "Código incorrecto",
        intentosRestantes: Math.max(0, 5 - nuevosIntentos),
        bloqueado: nuevosIntentos >= 5,
      },
      { status: 401 }
    );
  }

  // ✅ Código correcto → limpia el registro
  intentosPorIp.delete(ip);
  console.log(`[✅] Código correcto desde IP ${ip}`);

  const response = NextResponse.json({ success: true });
  response.cookies.set("acceso_lab", "ok", {
    httpOnly: true,
    path: "/",
    maxAge: 15 * 60, // 15 min
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
  });

  return response;
}