import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";
import { deleteFromS3 } from "@/lib/deleteFromS3";

export async function DELETE(
  _req: Request,
  context: { params: Promise<{ token: string; id: string }> }
) {
  const { token, id } = await context.params;
  const archivoId = Number(id);

  if (!token || Number.isNaN(archivoId)) {
    return NextResponse.json(
      { error: "Parámetros inválidos" },
      { status: 400 }
    );
  }

  try {
    const archivo = await prisma.archivoLaboratorial.findUnique({
      where: { id: archivoId },
      include: { solicitud: true },
    });

    if (!archivo || archivo.solicitud.tokenAcceso !== token) {
      return NextResponse.json(
        { error: "Archivo no encontrado o token inválido" },
        { status: 404 }
      );
    }

    await deleteFromS3(archivo.url); // Aquí `url` es la key, ej: estudios/solicitud-1/xyz.pdf

    await prisma.archivoLaboratorial.delete({
      where: { id: archivo.id },
    });

    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error("Error al eliminar archivo:", error);
    return NextResponse.json(
      { error: "Error interno al eliminar archivo" },
      { status: 500 }
    );
  }
}