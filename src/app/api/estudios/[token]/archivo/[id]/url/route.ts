// src/app/api/estudios/[token]/archivo/[id]/url/route.ts

import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSignedUrl } from "@/lib/s3";

export async function GET(
  _req: Request,
  context: { params: Promise<{ token: string; id: string }> } // 👈 importante: Promise aquí
) {
  const { token, id } = await context.params; // 👈 y el await aquí
  const archivoId = Number(id);

  if (!token || isNaN(archivoId)) {
    return NextResponse.json(
      { error: "Token o ID inválido" },
      { status: 400 }
    );
  }

  const archivo = await prisma.archivoLaboratorial.findUnique({
    where: { id: archivoId },
    include: {
      solicitud: {
        select: { tokenAcceso: true },
      },
    },
  });

  if (!archivo || archivo.solicitud?.tokenAcceso !== token) {
    return NextResponse.json(
      { error: "Archivo no encontrado o token inválido" },
      { status: 404 }
    );
  }

  try {
    const url = await getSignedUrl(archivo.url, archivo.tipo, "getObject");
    return NextResponse.json({ url });
  } catch (error) {
    console.error("Error generando URL firmada:", error);
    return NextResponse.json(
      { error: "Error al generar URL de descarga" },
      { status: 500 }
    );
  }
}