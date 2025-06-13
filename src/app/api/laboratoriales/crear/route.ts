// src/app/api/laboratoriales/crear/route.ts
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { crearLaboratorialSchema } from "@/hooks/useCrearLaboratorial";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    console.log("📥 Body recibido en API:", body);
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
      return NextResponse.json(
        { error: `Solicitud con ID ${datos.solicitudId} no encontrada.` },
        { status: 404 }
      );
    }

    if (!solicitud.estudio) {
      return NextResponse.json(
        {
          error:
            "La solicitud no tiene un tipo de estudio asignado. Verifica el campo 'estudio'.",
        },
        { status: 400 }
      );
    }

    const aliasEstudios: Record<string, string> = {
      BH: "Biometría Hemática",
    };

    const estudioSolicitado = solicitud.estudio.trim().toUpperCase();
    const nombreEstudio =
      aliasEstudios[estudioSolicitado] ?? solicitud.estudio.trim();

    const tipoEstudio = await prisma.tipoEstudioLaboratorial.findFirst({
      where: {
        nombre: {
          equals: nombreEstudio,
          mode: "insensitive",
        },
      },
    });

    if (!tipoEstudio) {
      return NextResponse.json(
        {
          error: `No se encontró el tipo de estudio '${solicitud.estudio}'. Verifica que coincida con un estudio válido.`,
        },
        { status: 400 }
      );
    }

    const mascotaId = solicitud.notaClinica?.expediente?.mascotaId;
    if (!mascotaId) {
      return NextResponse.json(
        {
          error:
            "No se encontró una mascota asociada al expediente de la nota clínica.",
        },
        { status: 400 }
      );
    }

    if (!solicitud.notaClinica?.autorId) {
      return NextResponse.json(
        {
          error:
            "No se encontró el autor de la nota clínica asociada a la solicitud.",
        },
        { status: 400 }
      );
    }

    const analitos = await prisma.analito.findMany({
      where: {
        tipoEstudioId: tipoEstudio.id,
      },
    });

    const analitosNoEncontrados: string[] = [];

    const laboratorial = await prisma.laboratorialPaciente.create({
      data: {
        fechaToma: new Date(datos.fechaToma),
        tipoEstudio: { connect: { id: tipoEstudio.id } },
        solicitudLaboratorial: { connect: { id: solicitud.id } },
        mascota: { connect: { id: mascotaId } },
        notaClinica: { connect: { id: solicitud.notaClinica.id } },
        creadoPor: { connect: { id: solicitud.notaClinica.autorId } },
        analisis: datos.analisis ?? null,
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
                analitosNoEncontrados.push(r.nombre);
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

    return NextResponse.json({
      ok: true,
      mensaje: "Resultado laboratorial creado correctamente",
      id: laboratorial.id,
      laboratorial,
      analitosNoEncontrados,
    });
  } catch (error) {
    console.error("Error al crear resultado laboratorial:", error);
    return NextResponse.json(
      { error: "Error al crear resultado laboratorial" },
      { status: 500 }
    );
  }
}