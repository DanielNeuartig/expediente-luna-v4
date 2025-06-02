// src/app/api/estudios/[token]/route.ts
import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET(
  _req: Request,
  context: { params: Promise<{ token: string }> }
) {
  const { token } = await context.params;

  try {
    const solicitud = await prisma.solicitudLaboratorial.findUnique({
      where: { tokenAcceso: token },
      include: {
        archivos: {
          select: {
            id: true,
            url: true,
            nombre: true,
            tipo: true,
            fechaSubida: true,
          },
          orderBy: { fechaSubida: "desc" },
        },
        notaClinica: {
          select: {
            id: true,
            expediente: {
              select: {
                mascota: {
                  select: {
                    nombre: true,
                    especie: true,
                    fechaNacimiento: true,
                    sexo: true,
                    esterilizado: true,
                    microchip: true,
                    raza: { select: { nombre: true } },
                    perfil: { select: { nombre: true } },
                  },
                },
              },
            },
          },
        },
      },
    });

    if (!solicitud) {
      return NextResponse.json(
        { error: "Solicitud no encontrada" },
        { status: 404 }
      );
    }

    if (solicitud.estado !== "FIRMADA") {
      return NextResponse.json(
        { error: "Solicitud aún no disponible" },
        { status: 403 }
      );
    }

    const mascota = solicitud.notaClinica.expediente.mascota;

    return NextResponse.json({
      solicitud: {
        id: solicitud.id,
        estudio: solicitud.estudio,
        proveedor: solicitud.proveedor,
        observacionesClinica: solicitud.observacionesClinica,
        fechaTomaDeMuestra: solicitud.fechaTomaDeMuestra,
        archivos: solicitud.archivos,
      },
      mascota,
    });
  } catch (error) {
    console.error("Error al obtener solicitud laboratorial:", error);
    return NextResponse.json(
      { error: "Error interno del servidor" },
      { status: 500 }
    );
  }
}