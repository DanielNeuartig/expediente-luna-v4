// src/app/api/expedientes/[id]/route.ts

import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { z } from "zod";

const patchSchema = z.object({
  nombre: z.string().min(1).max(100),
});

export async function PATCH(req: Request): Promise<Response> {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "No autorizado" }, { status: 401 });
  }

  // Obtener el ID de la URL
  const url = new URL(req.url);
  const pathParts = url.pathname.split("/");
  const expedienteIdStr = pathParts[pathParts.indexOf("expedientes") + 1];
  const expedienteId = Number(expedienteIdStr);

  if (Number.isNaN(expedienteId)) {
    return NextResponse.json({ error: "ID inválido" }, { status: 400 });
  }

  const body = await req.json();
  const parsed = patchSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
  }

  try {
    const expediente = await prisma.expedienteMedico.update({
      where: { id: expedienteId },
      data: { nombre: parsed.data.nombre },
    });

    return NextResponse.json(expediente);
  } catch (e) {
    console.error("💥 Error actualizando expediente:", e);
    return NextResponse.json({ error: "Error al actualizar expediente" }, { status: 500 });
  }
}