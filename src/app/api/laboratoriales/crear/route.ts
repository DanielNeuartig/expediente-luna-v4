// src/app/api/laboratoriales/crear/route.ts
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { crearLaboratorialSchema } from "@/hooks/useCrearLaboratorial";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const datos = crearLaboratorialSchema.parse(body);

    const solicitud = await prisma.solicitudLaboratorial.findUnique({
      where: { id: datos.solicitudId },
      include: {
        notaClinica: {
          include: {
            expediente: true,
          },
        },
      },
    });

    if (!solicitud) {
      return NextResponse.json({ error: "Solicitud no encontrada" }, { status: 404 });
    }

    if (!solicitud.estudio) {
      return NextResponse.json({ error: "La solicitud no tiene tipo de estudio" }, { status: 400 });
    }

    const tipoEstudio = await prisma.tipoEstudioLaboratorial.findFirst({
      where: { nombre: solicitud.estudio },
    });

    if (!tipoEstudio) {
      return NextResponse.json({ error: `Tipo de estudio '${solicitud.estudio}' no encontrado` }, { status: 400 });
    }

    const mascotaId = solicitud.notaClinica?.expediente?.mascotaId;
    if (!mascotaId) {
      return NextResponse.json({ error: "No se puede determinar la mascota asociada" }, { status: 400 });
    }

    if (!solicitud.notaClinica?.autorId) {
      return NextResponse.json({ error: "No se puede determinar el autor de la nota clínica" }, { status: 400 });
    }

    // Obtener todos los analitos válidos para este tipo de estudio
    const analitos = await prisma.analito.findMany({
      where: {
        tipoEstudioId: tipoEstudio.id,
      },
    });

    const laboratorial = await prisma.laboratorialPaciente.create({
      data: {
        fechaToma: new Date(datos.fechaToma),
        tipoEstudio: { connect: { id: tipoEstudio.id } },
        solicitudLaboratorial: { connect: { id: solicitud.id } },
        mascota: { connect: { id: mascotaId } },
        notaClinica: { connect: { id: solicitud.notaClinica.id } },
        creadoPor: { connect: { id: solicitud.notaClinica.autorId } },
        resultados: {
          createMany: {
            data: datos.resultados.map((r) => {
              const analito = analitos.find(
                (a) => a.nombre.trim() === r.nombre.trim()
              );

              if (!analito) {
                console.warn(
                  `⚠️ No se encontró analito con nombre '${r.nombre}' en estudio '${tipoEstudio.nombre}'`
                );
              }

              return {
                nombreManual: r.nombre,
                valorNumerico: r.valor,
                analitoId: analito?.id ?? null,
              };
            }),
          },
        },
      },
    });

    return NextResponse.json({ ok: true, laboratorial });
  } catch (error) {
    console.error("Error al crear resultado laboratorial:", error);
    return NextResponse.json({ error: "Error al crear resultado laboratorial" }, { status: 500 });
  }
}