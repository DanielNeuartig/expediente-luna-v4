// src/app/api/mascotas/[id]/expedientes/route.ts
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(
  _req: Request,
  context: { params: Promise<{ id: string }> }
) {
  const { id } = await context.params;
  const mascotaId = Number(id);

  if (Number.isNaN(mascotaId)) {
    return NextResponse.json(
      { error: "ID de mascota inválido" },
      { status: 400 }
    );
  }

  try {
    const expedientes = await prisma.expedienteMedico.findMany({
      where: { mascotaId },
      orderBy: { fechaCreacion: "desc" },
      select: {
        id: true,
        estado: true,
        tipo: true,
        nombre: true,
        contenidoAdaptado: true,
        notasGenerales: true,
        visibleParaTutor: true,
        fechaAlta: true,
        ultimaActividad: true,
        fechaCreacion: true,
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
        notasClinicas: {
          orderBy: { fechaCreacion: "desc" },
          select: {
            id: true,
            historiaClinica: true,
            exploracionFisica: true,
            temperatura: true,
            peso: true,
            frecuenciaCardiaca: true,
            frecuenciaRespiratoria: true,
            diagnosticoPresuntivo: true,
            pronostico: true,
            laboratoriales: true,
            extras: true,
            archivos: true,
            fechaCreacion: true,
            estado: true,
            fechaCancelacion: true,
            anuladaPor: {
              select: {
                id: true,
                nombre: true,
                prefijo: true,
                usuario: {
                  select: { image: true },
                },
              },
            },
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
            medicamentos: {
              select: {
                id: true,
                nombre: true,
                dosis: true,
                via: true,
                frecuenciaHoras: true,
                veces: true,
                desde: true,
                observaciones: true,
                paraCasa: true,
                tiempoIndefinido: true,
                aplicaciones: {
                  orderBy: { fechaProgramada: "asc" },
                  select: {
                    id: true,
                    fechaProgramada: true,
                    fechaReal: true,
                    nombreMedicamentoManual: true,
                    dosis: true,
                    via: true,
                    estado: true,
                    observaciones: true,
                    ejecutor: {
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
                },
              },
            },
            indicaciones: {
              select: {
                id: true,
                descripcion: true,
                frecuenciaHoras: true,
                veces: true,
                desde: true,
                observaciones: true,
                paraCasa: true,
              },
            },
          },
        },
      },
    });

    return NextResponse.json({ expedientes });
  } catch (error) {
    console.error("💥 Error al obtener expedientes:", error);
    return NextResponse.json(
      { error: "Error interno del servidor" },
      { status: 500 }
    );
  }
}
