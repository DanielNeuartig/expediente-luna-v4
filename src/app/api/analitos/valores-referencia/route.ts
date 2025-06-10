// File: src/app/api/analitos/valores-referencia/route.ts
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { Especie } from "@prisma/client";

export async function GET(req: NextRequest) {
  const url = new URL(req.url);
  const especie = url.searchParams.get("especie") as Especie;
  const nombreEstudio = url.searchParams.get("estudio");

  console.log("🧪 [API] Obteniendo valores de referencia...");
  console.log("🔍 Especie:", especie);
  console.log("🔍 Nombre del estudio:", nombreEstudio);

  if (!especie || !nombreEstudio) {
    console.warn("⚠️ Parámetros faltantes en query");
    return NextResponse.json(
      { error: "Parámetros 'especie' y 'estudio' son requeridos" },
      { status: 400 }
    );
  }

  try {
    const estudio = await prisma.tipoEstudioLaboratorial.findUnique({
      where: { nombre: nombreEstudio },
      include: {
        analitos: {
          include: {
            valoresReferencia: {
              where: { especie },
            },
          },
        },
      },
    });

    if (!estudio) {
      console.warn(`⚠️ Estudio no encontrado: '${nombreEstudio}'`);
      return NextResponse.json(
        { error: `Estudio '${nombreEstudio}' no encontrado` },
        { status: 404 }
      );
    }

    console.log(`✅ Estudio encontrado: ${estudio.nombre} (${estudio.id})`);
    console.log(`📊 Analitos encontrados: ${estudio.analitos.length}`);

    const analitos = estudio.analitos.map((a) => {
      const ref = a.valoresReferencia[0];
      console.log(
        `➡️ Analito: ${a.nombre}, Unidad: ${a.unidad}, Min: ${ref?.minimo}, Max: ${ref?.maximo}`
      );
      return {
        nombre: a.nombre,
        unidad: a.unidad,
        minimo: ref?.minimo ?? null,
        maximo: ref?.maximo ?? null,
      };
    });

    console.log(analitos);
    return NextResponse.json(analitos);
  } catch (error) {
    console.error("❌ Error en API de valores de referencia:", error);
    return NextResponse.json({ error: "Error interno del servidor" }, { status: 500 });
  }
}