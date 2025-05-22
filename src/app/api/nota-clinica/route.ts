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
   //const mascotaId = body.mascotaId as number;
 

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

    /*const medicamentos = */await Promise.all(
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
            incluirEnReceta: med.incluirEnReceta === "true",
            tiempoIndefinido: med.tiempoIndefinido === "true",
          },
        });

        if (
          med.incluirEnReceta === "false" &&
          med.frecuenciaHoras &&
          med.veces &&
          med.veces > 0
        ) {
          const fechas = calcularFechasAplicacion(
            med.desde,
            med.frecuenciaHoras,
            med.veces
          );

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
      })
    );


    /*const indicaciones = */await Promise.all(
      (data.indicaciones ?? []).map(async (ind) => {
        const indDb = await prisma.indicacion.create({
          data: {
            notaClinicaId: nota.id,
            descripcion: ind.descripcion,
            frecuenciaHoras: ind.frecuenciaHoras ?? null,
            veces: ind.veces ?? null,
            desde: ind.desde,
            observaciones: ind.observaciones || null,
            incluirEnReceta: ind.incluirEnReceta === "true",
          },
        });

        if (
          ind.incluirEnReceta === "false" &&
          ind.frecuenciaHoras &&
          ind.veces &&
          ind.veces > 0
        ) {
          const fechas = calcularFechasAplicacion(
            ind.desde,
            ind.frecuenciaHoras,
            ind.veces
          );

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