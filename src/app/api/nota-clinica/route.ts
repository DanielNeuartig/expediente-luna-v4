import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { notaClinicaSchema } from "@/lib/validadores/notaClinicaSchema";
import { calcularFechasAplicacion } from "@/lib/utils/clinica/fechas";

export async function POST(req: Request) {
  const session = await auth();
  if (!session?.user?.perfil) {
    return NextResponse.json(
      { error: "Sesión inválida o perfil no vinculado" },
      { status: 401 }
    );
  }

  const body = await req.json();
  const data = notaClinicaSchema.parse(body);
  const expedienteId = body.expedienteId as number;

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
    const nota = await prisma.notaClinica.create({
      data: {
        expediente: { connect: { id: expedienteId } },
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
        autor: { connect: { id: perfilId } },
      },
    });

    // Medicamentos
    await Promise.all(
      (data.medicamentos ?? []).map(async (med) => {
        const medDb = await prisma.medicamento.create({
          data: {
            notaClinicaId: nota.id,
            nombre: med.nombre,
            dosis: med.dosis,
            via: med.via,
            frecuenciaHoras: med.frecuenciaHoras ?? null,
            veces: med.veces ?? null,
            desde: med.desde,
            observaciones: med.observaciones || null,
            paraCasa: med.paraCasa === "true",
            tiempoIndefinido: med.tiempoIndefinido === "true",
          },
        });

        const frecuencia = Number(med.frecuenciaHoras);
        const veces = Number(med.veces);
        const desde = new Date(med.desde);

        if (med.paraCasa === "false" && veces >= 1) {
          let fechas: Date[] = [];
          if (veces === 1) {
            fechas = [desde];
          } else if (!isNaN(frecuencia) && frecuencia > 0) {
            fechas = calcularFechasAplicacion(desde, frecuencia, veces);
          }

          fechas = fechas.filter((f) => !isNaN(f.getTime()));

          if (fechas.length > 0) {
            await prisma.aplicacionMedicamento.createMany({
              data: fechas.map((fecha) => ({
                notaClinicaId: nota.id,
                medicamentoId: medDb.id,
                fechaProgramada: fecha,
                via: med.via,
                creadorId: perfilId,
                ejecutorId: perfilId,
              })),
            });
          }
        }

        // 👇 Nueva condición: paraCasa=true, indefinido=false, veces=1
        if (
          med.paraCasa === "true" &&
          med.tiempoIndefinido === "false" &&
          veces === 1
        ) {
          await prisma.aplicacionMedicamento.create({
            data: {
              notaClinicaId: nota.id,
              medicamentoId: medDb.id,
              fechaProgramada: desde,
              via: med.via,
              creadorId: perfilId,
              ejecutorId: perfilId,
              observaciones: "🏠 VERIFICACION de administración única en casa 🏠",
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

          await prisma.aplicacionMedicamento.create({
            data: {
              notaClinicaId: nota.id,
              medicamentoId: medDb.id,
              fechaProgramada: fechaFinal,
              via: med.via,
              creadorId: perfilId,
              ejecutorId: perfilId,
              observaciones:
                "🏠 VERIFICACION de cumplimiento del tratamiento en casa 🏠",
            },
          });
        }

        if (med.paraCasa === "true" && med.tiempoIndefinido === "true") {
          const fecha = new Date(desde);
          fecha.setMonth(fecha.getMonth() + 6);

          await prisma.aplicacionMedicamento.create({
            data: {
              notaClinicaId: nota.id,
              medicamentoId: medDb.id,
              fechaProgramada: fecha,
              via: med.via,
              creadorId: perfilId,
              ejecutorId: perfilId,
              observaciones: "🏠 SEGUIMIENTO SEMESTRAL de medicamento para casa 🏠",
            },
          });
        }
      })
    );

    // Indicaciones
    await Promise.all(
      (data.indicaciones ?? []).map(async (ind) => {
        const indDb = await prisma.indicacion.create({
          data: {
            notaClinicaId: nota.id,
            descripcion: ind.descripcion,
            frecuenciaHoras: ind.frecuenciaHoras ?? null,
            veces: ind.veces ?? null,
            desde: ind.desde,
            observaciones: ind.observaciones || null,
            paraCasa: ind.paraCasa === "true",
          },
        });

        const frecuencia = Number(ind.frecuenciaHoras);
        const veces = Number(ind.veces);
        const desde = new Date(ind.desde);

        if (
          ind.paraCasa === "false" &&
          !isNaN(veces) &&
          veces >= 1 &&
          (veces === 1 || (!isNaN(frecuencia) && frecuencia >= 1))
        ) {
          const fechas = calcularFechasAplicacion(desde, frecuencia, veces);
          await prisma.aplicacionIndicacion.createMany({
            data: fechas.map((fecha) => ({
              notaClinicaId: nota.id,
              indicacionId: indDb.id,
              fechaProgramada: fecha,
              creadorId: perfilId,
              ejecutorId: perfilId,
            })),
          });
        }

        // 👇 Nueva condición: paraCasa=true, indefinido=false, veces=1
        if (
          ind.paraCasa === "true" &&
          ind.tiempoIndefinido === "false" &&
          veces === 1
        ) {
          await prisma.aplicacionIndicacion.create({
            data: {
              notaClinicaId: nota.id,
              indicacionId: indDb.id,
              fechaProgramada: desde,
              creadorId: perfilId,
              ejecutorId: perfilId,
              observaciones: "Verificación de indicación única en casa",
            },
          });
        }

        if (
          ind.paraCasa === "true" &&
          ind.tiempoIndefinido === "false" &&
          veces > 1 &&
          !isNaN(frecuencia)
        ) {
          const fechaFinal = new Date(desde);
          fechaFinal.setHours(fechaFinal.getHours() + frecuencia * (veces - 1));

          await prisma.aplicacionIndicacion.create({
            data: {
              notaClinicaId: nota.id,
              indicacionId: indDb.id,
              fechaProgramada: fechaFinal,
              creadorId: perfilId,
              ejecutorId: perfilId,
              observaciones: "VERIFICACION DE CUMPLIMIENTO",
            },
          });
        }

        if (ind.paraCasa === "true" && ind.tiempoIndefinido === "true") {
          const fecha = new Date(desde);
          fecha.setMonth(fecha.getMonth() + 6);

          await prisma.aplicacionIndicacion.create({
            data: {
              notaClinicaId: nota.id,
              indicacionId: indDb.id,
              fechaProgramada: fecha,
              creadorId: perfilId,
              ejecutorId: perfilId,
              observaciones: "SEGUIMIENTO SEMESTRE",
            },
          });
        }
      })
    );

    return NextResponse.json({ notaClinica: nota });
  } catch (error) {
    console.error("❌ Error al crear nota clínica:", error);
    return NextResponse.json(
      { error: "Error interno al guardar la nota clínica" },
      { status: 500 }
    );
  }
}
