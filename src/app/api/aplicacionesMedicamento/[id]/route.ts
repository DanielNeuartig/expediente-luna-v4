// src/app/api/aplicacionesMedicamento/[id]/route.ts

import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { EstadoAplicacion, ViaMedicamento } from "@prisma/client";

// Usar la firma de params como PROMESA (100% compatible App Router)
export async function PATCH(
  req: Request,
  context: { params: Promise<{ id: string }> }
) {
  const { id } = await context.params;

  const session = await auth();
  if (!session?.user?.perfil?.telefonoPrincipal) {
    return NextResponse.json(
      { error: "No autorizado o sin perfil válido" },
      { status: 401 }
    );
  }

  const appId = Number(id);
  if (Number.isNaN(appId)) {
    return NextResponse.json(
      { error: "ID de aplicación inválido" },
      { status: 400 }
    );
  }

  const body = await req.json();

  const datosActualizados: {
    nombreMedicamentoManual?: string;
    dosis?: string;
    via?: ViaMedicamento;
    observaciones?: string;
    estado?: EstadoAplicacion;
    ejecutorId?: number;
    fechaReal?: Date;
  } = {};

  if (typeof body.nombreMedicamentoManual === "string") {
    datosActualizados.nombreMedicamentoManual = body.nombreMedicamentoManual.trim();
  }

  if (typeof body.dosis === "string") {
    datosActualizados.dosis = body.dosis.trim();
  }

  if (
    typeof body.via === "string" &&
    Object.values(ViaMedicamento).includes(body.via as ViaMedicamento)
  ) {
    datosActualizados.via = body.via as ViaMedicamento;
  }

  if (typeof body.observaciones === "string") {
    datosActualizados.observaciones = body.observaciones.trim();
  }

  const estadoNuevo = body.estado as EstadoAplicacion | undefined;
  if (
    estadoNuevo &&
    ["PENDIENTE", "REALIZADA", "OMITIDA", "CANCELADA"].includes(estadoNuevo)
  ) {
    datosActualizados.estado = estadoNuevo;
  }

  const actual = await prisma.aplicacionMedicamento.findUnique({
    where: { id: appId },
    select: { estado: true },
  });

  if (!actual) {
    return NextResponse.json(
      { error: "Aplicación no encontrada" },
      { status: 404 }
    );
  }

  if (actual.estado !== "PENDIENTE") {
    return NextResponse.json(
      { error: "Solo se pueden modificar aplicaciones en estado PENDIENTE" },
      { status: 403 }
    );
  }

  if (
    datosActualizados.estado &&
    ["REALIZADA", "OMITIDA", "CANCELADA"].includes(datosActualizados.estado)
  ) {
    const perfil = await prisma.perfil.findUnique({
      where: {
        telefonoPrincipal: session.user.perfil.telefonoPrincipal,
      },
      select: { id: true },
    });

    if (!perfil) {
      return NextResponse.json(
        { error: "Perfil del ejecutor no encontrado" },
        { status: 404 }
      );
    }

    datosActualizados.ejecutorId = perfil.id;
    datosActualizados.fechaReal = new Date();
  }

  try {
    const actualizada = await prisma.aplicacionMedicamento.update({
      where: { id: appId },
      data: datosActualizados,
    });

    return NextResponse.json({ actualizada });
  } catch (error) {
    console.error("❌ Error al actualizar aplicación:", error);
    return NextResponse.json(
      { error: "Error interno al actualizar aplicación" },
      { status: 500 }
    );
  }
}