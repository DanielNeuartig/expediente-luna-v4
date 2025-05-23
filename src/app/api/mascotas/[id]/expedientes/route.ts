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
      include: {
        autor: {
          select: {
            id: true,
            nombre: true,
            prefijo: true, // ✅ AÑADIR ESTA LÍNEA
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
            fechaCreacion: true,
            autor: {
              select: {
                id: true,
                nombre: true,
                prefijo: true, // ✅ AÑADIR ESTA LÍNEA
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
                    nombreMedicamentoManual: true, // ✅ nombre real
                    dosis: true, // ✅ dosis real
                    via: true,
                    estado: true,
                    observaciones: true,
                    ejecutor: {
                      select: {
                        id: true,
                        nombre: true,
                        prefijo: true, // ✅ AÑADIR ESTA LÍNEA
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
            activa: true,
            canceladaPorId: true,
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
