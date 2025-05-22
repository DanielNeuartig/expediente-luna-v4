import { NextResponse } from "next/server";
import { notaClinicaSchema } from "@/lib/validadores/notaClinicaSchema";

export async function POST(req: Request) {
  try {
    const body = await req.json();

    // Validamos con Zod
    const data = notaClinicaSchema.parse(body);

    console.log("✅ Nota clínica válida recibida:");
    console.dir(data, { depth: null });

    return NextResponse.json({ mensaje: "Nota recibida y válida", data });
  } catch (error) {
    console.error("❌ Error en nota clínica:", error);
    return NextResponse.json(
      { error: "Datos inválidos", detalles: error },
      { status: 400 }
    );
  }
}