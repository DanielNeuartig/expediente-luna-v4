import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";

export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
): Promise<Response> {
  const { id } = await params;
  const expedienteId = Number(id);

  const session = await auth();
  if (!session?.user?.perfilid) {
    return NextResponse.json({ error: "No autorizado" }, { status: 401 });
  }
  if (Number.isNaN(expedienteId)) {
    return NextResponse.json(
      { error: "ID de expediente inválido" },
      { status: 400 }
    );
  }

  try {
    const expediente = await prisma.expedienteMedico.findUnique({
      where: { id: expedienteId },
      select: { id: true, estado: true, autorId: true },
    });

    if (!expediente) {
      return NextResponse.json(
        { error: "Expediente no encontrado" },
        { status: 404 }
      );
    }

    if (expediente.estado !== "ACTIVO") {
      return NextResponse.json(
        { error: "Solo los expedientes activos pueden finalizarse" },
        { status: 400 }
      );
    }

    const notasSinFirmar = await prisma.notaClinica.count({
      where: {
        expedienteId: expediente.id,
        estado: "EN_REVISION",
      },
    });

    if (notasSinFirmar > 0) {
      return NextResponse.json(
        {
          error:
            "No puedes finalizar un expediente con notas clínicas sin firmar",
        },
        { status: 400 }
      );
    }

    const notasFirmadas = await prisma.notaClinica.count({
      where: {
        expedienteId: expediente.id,
        estado: "FINALIZADA",
      },
    });

    if (notasFirmadas === 0) {
      return NextResponse.json(
        {
          error:
            "No puedes finalizar un expediente sin al menos una nota firmada",
        },
        { status: 400 }
      );
    }

    await prisma.expedienteMedico.update({
      where: { id: expedienteId },
      data: {
        estado: "FINALIZADO_MANUAL",
        fechaAlta: new Date(),
      },
    });

    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error("[FINALIZAR_EXPEDIENTE]", error);
    const mensaje = error instanceof Error ? error.message : "Error al finalizar expediente";
    return NextResponse.json({ error: mensaje }, { status: 500 });
  }
}