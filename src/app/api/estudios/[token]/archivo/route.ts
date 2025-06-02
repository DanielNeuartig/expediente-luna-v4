import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSignedUrl } from "@/lib/s3";
import { generarKeySeguro } from "@/lib/generarKeySeguro";

// Tipos MIME permitidos
const MIME_TO_ENUM = {
  "application/pdf": "PDF",
  "image/png": "PNG",
  "image/jpg": "JPG",
  "image/jpeg": "JPEG",
} as const;

export async function POST(
  req: NextRequest,
  context: { params: Promise<{ token: string }> }
) {
  const { token } = await context.params;

  let body: { fileType?: string; fileName?: string };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Cuerpo de solicitud inválido" }, { status: 400 });
  }

  const fileType = body.fileType?.toLowerCase();
  const fileName = body.fileName;

  if (!fileType || typeof fileType !== "string" || !fileType.includes("/")) {
    return NextResponse.json({ error: "Formato de archivo inválido" }, { status: 400 });
  }

  const tipoEnum = MIME_TO_ENUM[fileType as keyof typeof MIME_TO_ENUM];
  if (!tipoEnum) {
    return NextResponse.json(
      {
        error: "Formato de archivo no permitido. Solo PDF, PNG, JPG o JPEG.",
      },
      { status: 400 }
    );
  }

  if (!fileName || typeof fileName !== "string" || !fileName.includes(".")) {
    return NextResponse.json({ error: "Nombre de archivo inválido" }, { status: 400 });
  }

  const solicitud = await prisma.solicitudLaboratorial.findUnique({
    where: { tokenAcceso: token },
    select: { id: true, estado: true },
  });

  if (!solicitud) {
    return NextResponse.json({ error: "Token inválido" }, { status: 404 });
  }

  if (solicitud.estado !== "FIRMADA") {
    return NextResponse.json(
      { error: "Solo se pueden subir archivos cuando la solicitud está firmada" },
      { status: 403 }
    );
  }

  const archivosActuales = await prisma.archivoLaboratorial.count({
    where: { solicitudId: solicitud.id },
  });

  if (archivosActuales >= 5) {
    return NextResponse.json(
      { error: "Solo se permiten hasta 5 archivos por solicitud" },
      { status: 403 }
    );
  }

  const key = generarKeySeguro(fileName, solicitud.id);

  try {
    const url = await getSignedUrl(key, fileType, "putObject");

    await prisma.archivoLaboratorial.create({
      data: {
        solicitudId: solicitud.id,
        nombre: fileName,
        tipo: tipoEnum,
        url: key,
      },
    });

return NextResponse.json({ url, key });
  } catch (error) {
    console.error("Error al generar URL firmada:", error);
    return NextResponse.json(
      { error: "Error al generar URL de subida" },
      { status: 500 }
    );
  }
}