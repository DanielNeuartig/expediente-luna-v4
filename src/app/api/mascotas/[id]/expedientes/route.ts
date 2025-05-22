// src/app/api/mascotas/[id]/expedientes/route.ts
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import type { AplicacionMedicamento } from "@prisma/client";

type AplicacionMedicamentoExtendida = AplicacionMedicamento & {
  medicamento: {
    nombre: string;
    dosis: string;
    via: string;
  } | null;
  ejecutor: {
    id: number;
    nombre: string;
    usuario: {
      image: string | null;
    } | null;
  } | null;
};

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
            usuario: {
              select: {
                image: true,
              },
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
                usuario: {
                  select: {
                    image: true,
                  },
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

    const [aplicacionesMedicamentos, aplicacionesIndicaciones] =
      await Promise.all([
        prisma.aplicacionMedicamento.findMany({
          where: { notaClinica: { expediente: { mascotaId } } },
          include: {
            medicamento: true,
            ejecutor: {
              select: {
                id: true,
                nombre: true,
                usuario: {
                  select: {
                    image: true,
                  },
                },
              },
            },
          },
          orderBy: { fechaProgramada: "desc" },
        }) as Promise<AplicacionMedicamentoExtendida[]>,
        prisma.aplicacionIndicacion.findMany({
          where: { notaClinica: { expediente: { mascotaId } } },
          include: {
            indicacion: true,
            ejecutor: {
              select: {
                id: true,
                nombre: true,
                usuario: {
                  select: {
                    image: true,
                  },
                },
              },
            },
          },
          orderBy: { fechaProgramada: "desc" },
        }),
      ]);

    return NextResponse.json({
      expedientes,
      aplicacionesMedicamentos,
      aplicacionesIndicaciones,
    });
  } catch (error) {
    console.error("💥 Error al obtener expedientes:", error);
    return NextResponse.json(
      { error: "Error interno del servidor" },
      { status: 500 }
    );
  }
}