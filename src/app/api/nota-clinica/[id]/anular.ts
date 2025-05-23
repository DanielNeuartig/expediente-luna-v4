// src/app/api/nota-clinica/anular-o-reemplazar/route.ts
import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { notaClinicaSchema } from "@/lib/validadores/notaClinicaSchema";
import { calcularFechasAplicacion } from "@/lib/utils/clinica/fechas";

export async function POST(req: Request) {
  const session = await auth();
  if (!session?.user?.perfil) {
    return NextResponse.json({ error: "Sesión inválida" }, { status: 401 });
  }

  const body = await req.json();
  const { notaAnteriorId, reemplazar } = body;
  const datos = notaClinicaSchema.parse(body);

  const perfilDb = await prisma.perfil.findUnique({
    where: { telefonoPrincipal: session.user.perfil.telefonoPrincipal },
    select: { id: true },
  });

  if (!perfilDb) {
    return NextResponse.json({ error: "Perfil no encontrado" }, { status: 404 });
  }

  const perfilId = perfilDb.id;

  try {
    const result = await prisma.$transaction(async (tx) => {
      if (!reemplazar) {
        await tx.notaClinica.update({
          where: { id: notaAnteriorId },
          data: {
            activa: false,
            anuladaPorId: perfilId,
            fechaCancelacion: new Date(),
          },
        });
        return { anulada: true };
      }

      const nuevaNota = await tx.notaClinica.create({
        data: {
          expedienteId: datos.expedienteId,
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
          autorId: perfilId,
        },
      });

      await tx.notaClinica.update({
        where: { id: notaAnteriorId },
        data: {
          activa: false,
          canceladaPorId: nuevaNota.id,
          fechaCancelacion: new Date(),
        },
      });

      // Crear medicamentos
      for (const med of datos.medicamentos ?? []) {
        const medDb = await tx.medicamento.create({
          data: {
            notaClinicaId: nuevaNota.id,
            nombre: med.nombre,
            dosis: med.dosis,
            via: med.via,
            frecuenciaHoras: med.frecuenciaHoras ?? null,
            veces: med.veces ?? null,
            desde: med.desde,
            observaciones: med.observaciones ?? null,
            paraCasa: med.paraCasa === "true",
            tiempoIndefinido: med.tiempoIndefinido === "true",
          },
        });

        const veces = Number(med.veces);
        const frecuencia = Number(med.frecuenciaHoras);
        const desde = new Date(med.desde);

        if (med.paraCasa === "false" && veces > 0) {
          const fechas = calcularFechasAplicacion(desde, frecuencia, veces);
          await tx.aplicacionMedicamento.createMany({
            data: fechas.map((fecha) => ({
              notaClinicaId: nuevaNota.id,
              medicamentoId: medDb.id,
              fechaProgramada: fecha,
              via: med.via,
              creadorId: perfilId,
              ejecutorId: perfilId,
            })),
          });
        }

        if (
          med.paraCasa === "true" &&
          med.tiempoIndefinido === "false" &&
          veces === 1
        ) {
          await tx.aplicacionMedicamento.create({
            data: {
              notaClinicaId: nuevaNota.id,
              medicamentoId: medDb.id,
              fechaProgramada: desde,
              via: med.via,
              creadorId: perfilId,
              ejecutorId: perfilId,
              observaciones: "🏠 VERIFICACIÓN de administración única en casa 🏠",
            },
          });
        }

        if (
          med.paraCasa === "true" &&
          med.tiempoIndefinido === "false" &&
          veces > 1 &&
          !isNaN(frecuencia)
        ) {
          const fechaFinal = new Date(desde);
          fechaFinal.setHours(fechaFinal.getHours() + frecuencia * (veces - 1));

          await tx.aplicacionMedicamento.create({
            data: {
              notaClinicaId: nuevaNota.id,
              medicamentoId: medDb.id,
              fechaProgramada: fechaFinal,
              via: med.via,
              creadorId: perfilId,
              ejecutorId: perfilId,
              observaciones:
                "🏠 VERIFICACIÓN de cumplimiento del tratamiento en casa 🏠",
            },
          });
        }

        if (med.paraCasa === "true" && med.tiempoIndefinido === "true") {
          const fecha = new Date(desde);
          fecha.setMonth(fecha.getMonth() + 6);

          await tx.aplicacionMedicamento.create({
            data: {
              notaClinicaId: nuevaNota.id,
              medicamentoId: medDb.id,
              fechaProgramada: fecha,
              via: med.via,
              creadorId: perfilId,
              ejecutorId: perfilId,
              observaciones:
                "🏠 SEGUIMIENTO SEMESTRAL de medicamento para casa 🏠",
            },
          });
        }
      }

      return { notaClinica: nuevaNota };
    });

    return NextResponse.json(result);
  } catch (error) {
    console.error("❌ Error en nota clínica:", error);
    return NextResponse.json(
      { error: "Error al anular o reemplazar nota" },
      { status: 500 }
    );
  }
}