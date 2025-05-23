// src/app/api/nota-clinica/route.ts
import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { notaClinicaConIdsSchema } from "@/lib/validadores/notaClinicaSchema";
import { calcularFechasAplicacion } from "@/lib/utils/clinica/fechas";
import { z } from "zod";
import type { Prisma } from "@prisma/client";

export async function POST(req: Request) {
  const session = await auth();
  if (!session?.user?.perfil) {
    return NextResponse.json(
      { error: "Sesión inválida o perfil no vinculado" },
      { status: 401 }
    );
  }

  const body = await req.json();

  let data;
  try {
    data = notaClinicaConIdsSchema.parse(body);
  } catch (err) {
    if (err instanceof z.ZodError) {
      return NextResponse.json({ error: err.errors }, { status: 400 });
    }
    return NextResponse.json({ error: "Datos inválidos" }, { status: 400 });
  }

  const perfilDb = await prisma.perfil.findUnique({
    where: { telefonoPrincipal: session.user.perfil.telefonoPrincipal },
    select: { id: true },
  });

  if (!perfilDb) {
    return NextResponse.json(
      { error: "Perfil no encontrado en base de datos" },
      { status: 404 }
    );
  }

  const perfilId = perfilDb.id;

  try {
    const resultado = await prisma.$transaction(async (tx) => {
      if (data.firmarNotaId) {
        return firmarNotaYCrearAplicaciones(tx, data, perfilId);
      }
      if (data.anularNotaId) {
        return anularNotaYCancelarAplicaciones(tx, data, perfilId);
      }
      return crearNotaClinica(tx, data, perfilId);
    });

    return NextResponse.json(resultado);
  } catch (error) {
    console.error("❌ Error al procesar nota clínica:", error);
    return NextResponse.json(
      { error: "Error interno al guardar, firmar o anular la nota clínica" },
      { status: 500 }
    );
  }
}

export async function PATCH(req: Request) {
  const session = await auth();
  if (!session?.user?.perfil) {
    return NextResponse.json(
      { error: "Sesión inválida o perfil no vinculado" },
      { status: 401 }
    );
  }

  const perfilDb = await prisma.perfil.findUnique({
    where: { telefonoPrincipal: session.user.perfil.telefonoPrincipal },
    select: { id: true },
  });

  if (!perfilDb) {
    return NextResponse.json(
      { error: "Perfil no encontrado en base de datos" },
      { status: 404 }
    );
  }

  const perfilId = perfilDb.id;
  const body = await req.json();
  const { notaId, medicamentos, indicaciones, ...datos } = body;

  if (!notaId) {
    return NextResponse.json(
      { error: "Falta el ID de la nota a modificar" },
      { status: 400 }
    );
  }

  try {
    const notaExistente = await prisma.notaClinica.findUnique({
      where: { id: notaId },
      include: { autor: true },
    });

    if (!notaExistente) {
      return NextResponse.json(
        { error: "Nota no encontrada" },
        { status: 404 }
      );
    }

    if (notaExistente.autorId !== perfilId) {
      return NextResponse.json(
        { error: "No puedes modificar una nota ajena" },
        { status: 403 }
      );
    }

    if (notaExistente.estado !== "EN_REVISION") {
      return NextResponse.json(
        { error: "Solo puedes editar notas en revisión" },
        { status: 400 }
      );
    }

    await prisma.$transaction(async (tx) => {
      await tx.notaClinica.update({
        where: { id: notaId },
        data: {
          historiaClinica: datos.historiaClinica ?? null,
          exploracionFisica: datos.exploracionFisica ?? null,
          temperatura: datos.temperatura ?? null,
          peso: datos.peso ?? null,
          frecuenciaCardiaca: datos.frecuenciaCardiaca ?? null,
          frecuenciaRespiratoria: datos.frecuenciaRespiratoria ?? null,
          diagnosticoPresuntivo: datos.diagnosticoPresuntivo ?? null,
          pronostico: datos.pronostico ?? null,
          laboratoriales: datos.laboratoriales ?? null,
          extras: datos.extras ?? null,
        },
      });

      await tx.medicamento.deleteMany({ where: { notaClinicaId: notaId } });
      for (const med of medicamentos ?? []) {
        await tx.medicamento.create({
          data: {
            notaClinicaId: notaId,
            nombre: med.nombre,
            dosis: med.dosis,
            via: med.via,
            frecuenciaHoras: med.frecuenciaHoras ?? null,
            veces: med.veces ?? null,
            desde: med.desde ?? null,
            observaciones: med.observaciones ?? null,
            paraCasa: med.paraCasa === "true",
            tiempoIndefinido: med.tiempoIndefinido === "true",
          },
        });
      }

      await tx.indicacion.deleteMany({ where: { notaClinicaId: notaId } });
      for (const ind of indicaciones ?? []) {
        await tx.indicacion.create({
          data: {
            notaClinicaId: notaId,
            descripcion: ind.descripcion,
            frecuenciaHoras: ind.frecuenciaHoras ?? null,
            veces: ind.veces ?? null,
            desde: ind.desde ?? null,
            observaciones: ind.observaciones ?? null,
            paraCasa: ind.paraCasa === "true",
          },
        });
      }
    });

    return NextResponse.json({ actualizado: true });
  } catch (error) {
    console.error("❌ Error al modificar nota clínica:", error);
    return NextResponse.json(
      { error: "Error al actualizar nota clínica" },
      { status: 500 }
    );
  }
}

// Funciones auxiliares

async function firmarNotaYCrearAplicaciones(
  tx: Prisma.TransactionClient,
  data: any,
  perfilId: number
) {
  const nota = await tx.notaClinica.findUnique({
    where: { id: data.firmarNotaId },
    include: {
      autor: true,
      expediente: { select: { mascotaId: true } },
      medicamentos: true,
      indicaciones: true,
    },
  });

  if (!nota) throw new Error("Nota no encontrada");
  if (nota.autorId !== perfilId)
    throw new Error("No puedes firmar una nota de otro usuario");
  if (nota.estado !== "EN_REVISION")
    throw new Error("Solo puedes firmar notas en revisión");
  if (nota.expediente.mascotaId !== data.mascotaId)
    throw new Error("La nota no pertenece a la mascota indicada");

  const aplicacionesMed = [];
  for (const med of nota.medicamentos) {
    const desde = med.desde ? new Date(med.desde) : null;
    const frecuencia = med.frecuenciaHoras ?? 0;
    const veces = med.veces ?? 0;
    if (!desde) continue;

    if (!med.paraCasa && veces >= 1) {
      const fechas =
        veces === 1
          ? [desde]
          : calcularFechasAplicacion(desde, frecuencia, veces);
      fechas.forEach((fecha) => {
        aplicacionesMed.push({
          notaClinicaId: nota.id,
          medicamentoId: med.id,
          fechaProgramada: fecha,
          via: med.via,
          creadorId: perfilId,
          //ejecutorId: perfilId,
          observaciones: med.observaciones ?? null, // ✅ Añadido aquí
        });
      });
    } else {
      const fecha = new Date(desde);
      let observaciones = "";
      if (veces === 1) {
        observaciones = [
          med.observaciones ?? "",
          "🏠 VERIFICACION de administración única en casa 🏠",
        ]
          .filter(Boolean)
          .join(" | ");
      } else if (frecuencia && veces > 1) {
        observaciones = [
          med.observaciones ?? "",
          "🏠 VERIFICACION de cumplimiento del tratamiento en casa 🏠",
        ]
          .filter(Boolean)
          .join(" | ");
      } else {
        observaciones = [
          med.observaciones ?? "",
          "🏠 SEGUIMIENTO SEMESTRAL de medicamento para casa 🏠",
        ]
          .filter(Boolean)
          .join(" | ");
      }
      aplicacionesMed.push({
        notaClinicaId: nota.id,
        medicamentoId: med.id,
        fechaProgramada: fecha,
        via: med.via,
        creadorId: perfilId,
        //ejecutorId: perfilId,
        observaciones,
      });
    }
  }

  if (aplicacionesMed.length > 0) {
    await tx.aplicacionMedicamento.createMany({ data: aplicacionesMed });
  }

  const aplicacionesInd = [];
  for (const ind of nota.indicaciones) {
    const desde = ind.desde ? new Date(ind.desde) : null;
    const frecuencia = ind.frecuenciaHoras ?? 0;
    const veces = ind.veces ?? 0;
    if (!desde) continue;

    if (!ind.paraCasa && veces >= 1) {
      const fechas =
        veces === 1
          ? [desde]
          : calcularFechasAplicacion(desde, frecuencia, veces);
      fechas.forEach((fecha) => {
        aplicacionesInd.push({
          notaClinicaId: nota.id,
          indicacionId: ind.id,
          fechaProgramada: fecha,
          creadorId: perfilId,
          //ejecutorId: perfilId,
        });
      });
    } else {
      const fecha = new Date(desde);
      let observaciones = "";
      if (veces === 1) {
        observaciones = [
          ind.observaciones ?? "",
          "Verificación de indicación única en casa",
        ]
          .filter(Boolean)
          .join(" | ");
      } else if (frecuencia && veces > 1) {
        observaciones = [
          ind.observaciones ?? "",
          "VERIFICACION DE CUMPLIMIENTO",
        ]
          .filter(Boolean)
          .join(" | ");
      } else {
        observaciones = [
          ind.observaciones ?? "",
          "SEGUIMIENTO CLÍNICO PROLONGADO",
        ]
          .filter(Boolean)
          .join(" | ");
      }
      aplicacionesInd.push({
        notaClinicaId: nota.id,
        indicacionId: ind.id,
        fechaProgramada: fecha,
        creadorId: perfilId,
        //ejecutorId: perfilId,
        observaciones,
      });
    }
  }

  if (aplicacionesInd.length > 0) {
    await tx.aplicacionIndicacion.createMany({ data: aplicacionesInd });
  }

  await tx.notaClinica.update({
    where: { id: data.firmarNotaId },
    data: { estado: "FINALIZADA" },
  });

  return { firmada: true };
}

async function anularNotaYCancelarAplicaciones(
  tx: Prisma.TransactionClient,
  data: any,
  perfilId: number
) {
  await tx.notaClinica.update({
    where: { id: data.anularNotaId },
    data: {
      estado: "ANULADA",
      fechaCancelacion: new Date(),
      anuladaPorId: perfilId,
    },
  });

  await tx.aplicacionMedicamento.updateMany({
    where: { notaClinicaId: data.anularNotaId, estado: "PENDIENTE" },
    data: {
      estado: "CANCELADA",
      observaciones: "⚠️ Aplicación cancelada por anulación de la nota.",
    },
  });

  await tx.aplicacionIndicacion.updateMany({
    where: { notaClinicaId: data.anularNotaId, estado: "PENDIENTE" },
    data: {
      estado: "CANCELADA",
      observaciones: "⚠️ Aplicación cancelada por anulación de la nota.",
    },
  });

  return { anulado: true };
}

async function crearNotaClinica(
  tx: Prisma.TransactionClient,
  data: any,
  perfilId: number
) {
  const nota = await tx.notaClinica.create({
    data: {
      expedienteId: data.expedienteId,
      historiaClinica: data.historiaClinica || null,
      exploracionFisica: data.exploracionFisica || null,
      temperatura: data.temperatura ?? null,
      peso: data.peso ?? null,
      frecuenciaCardiaca: data.frecuenciaCardiaca ?? null,
      frecuenciaRespiratoria: data.frecuenciaRespiratoria ?? null,
      diagnosticoPresuntivo: data.diagnosticoPresuntivo || null,
      pronostico: data.pronostico || null,
      laboratoriales: data.laboratoriales || null,
      extras: data.extras || null,
      autorId: perfilId,
      estado: "EN_REVISION",
    },
  });

  for (const med of data.medicamentos ?? []) {
    await tx.medicamento.create({
      data: {
        notaClinicaId: nota.id,
        nombre: med.nombre,
        dosis: med.dosis,
        via: med.via,
        frecuenciaHoras: med.frecuenciaHoras ?? null,
        veces: med.veces ?? null,
        desde: med.desde ?? null,
        observaciones: med.observaciones || null,
        paraCasa: med.paraCasa === "true",
        tiempoIndefinido: med.tiempoIndefinido === "true",
      },
    });
  }

  for (const ind of data.indicaciones ?? []) {
    await tx.indicacion.create({
      data: {
        notaClinicaId: nota.id,
        descripcion: ind.descripcion,
        frecuenciaHoras: ind.frecuenciaHoras ?? null,
        veces: ind.veces ?? null,
        desde: ind.desde ?? null,
        observaciones: ind.observaciones || null,
        paraCasa: ind.paraCasa === "true",
      },
    });
  }

  return { notaClinica: nota };
}
