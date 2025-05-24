import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { z } from "zod";

const crearExpedienteSchema = z.object({
  mascotaId: z.number().int(),
  tipo: z.enum(["CONSULTA", "CIRUGIA", "HOSPITALIZACION", "LABORATORIO", "OTRO"]).default("CONSULTA"),
});

export async function POST(req: Request) {
  const session = await auth();

  if (!session?.user?.id || !session.user.perfilid) {
    return NextResponse.json({ error: "No autorizado o sin perfil" }, { status: 401 });
  }

  const json = await req.json();
  const parsed = crearExpedienteSchema.safeParse(json);
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
  }

  const { mascotaId, tipo } = parsed.data;

  // Evitar duplicación de expediente activo
  const existente = await prisma.expedienteMedico.findFirst({
    where: { mascotaId, estado: "ACTIVO" },
  });

  if (existente) {
    return NextResponse.json(
      { error: "Ya existe un expediente activo para esta mascota" },
      { status: 409 }
    );
  }

  try {
    const expediente = await prisma.expedienteMedico.create({
      data: {
        mascotaId,
        tipo,
        estado: "ACTIVO",
        autorId: session.user.perfilid,
      },
      include: {
        notasClinicas: true,
        autor: {
          select: {
            id: true,
            nombre: true,
            prefijo: true,
            usuario: {
              select: { image: true },
            },
          },
        },
      },
    });

    return NextResponse.json(expediente);
  } catch (error) {
    console.error("💥 Error al crear expediente:", error);
    return NextResponse.json({ error: "Error interno del servidor" }, { status: 500 });
  }
}