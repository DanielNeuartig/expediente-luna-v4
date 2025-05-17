// src/app/api/busqueda/route.ts
import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const q = searchParams.get("q")?.trim();

  if (!q || q.length < 2) {
    return NextResponse.json([]);
  }

  const esNumero = !isNaN(Number(q));

  const [perfiles, mascotas] = await Promise.all([
    prisma.perfil.findMany({
      where: esNumero
        ? {
            telefonoPrincipal: {
              contains: q.replace(/\D/g, ""),
            },
          }
        : {
            nombre: {
              contains: q,
              mode: "insensitive",
            },
          },
      orderBy: { nombre: "asc" },
      take: 5,
      select: {
        id: true,
        nombre: true,
        telefonoPrincipal: true,
      },
    }),

    prisma.mascota.findMany({
      where: {
        nombre: {
          contains: q,
          mode: "insensitive",
        },
      },
      orderBy: { nombre: "asc" },
      take: 5,
      include: {
        raza: {
          select: {
            nombre: true,
          },
        },
      },
    }),
  ]);

  const resultados = [
    ...perfiles.map((p) => ({
      id: p.id,
      nombre: p.nombre,
      telefonoPrincipal: p.telefonoPrincipal,
      tipo: "perfil" as const,
    })),
    ...mascotas.map((m) => ({
      id: m.id,
      nombre: m.nombre,
      especie: m.especie,
      fechaNacimiento: m.fechaNacimiento?.toISOString(),
      raza: m.raza?.nombre ?? null,
      tipo: "mascota" as const,
    })),
  ];

  console.log("📦 Resultados de búsqueda:", resultados);
  return NextResponse.json(resultados);
}