// src/app/api/mascota/route.ts
import { NextResponse } from "next/server";
import { mascotaSchema } from "@/lib/validadores/mascotaSchema";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { Prisma } from "@prisma/client";

export async function POST(req: Request) {
  const session = await auth();

  if (!session?.user?.id) {
    return NextResponse.json({ error: "No autorizado" }, { status: 401 });
  }

  const body = await req.json();
  const parsed = mascotaSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.format() }, { status: 400 });
  }

  const data = parsed.data;

  // 🧼 Transformaciones necesarias (porque Zod no aplica cambios en profundidad como Date o formateo profundo)
  const mascotaData: Prisma.MascotaCreateInput = {
    nombre: data.nombre.trim(),
    especie: data.especie,
    sexo: data.sexo,
    esterilizado: data.esterilizado,
    perfil: { connect: { id: data.perfilId } },
    autor: { connect: { id: session.user.id } },
  };

  if (data.color)
    mascotaData.color = data.color
      .trim()
      .replace(/\s{2,}/g, " ")
      .replace(/^(\w)(\w*)/, (_, p, r) => p.toUpperCase() + r.toLowerCase());

  if (data.fechaNacimiento)
    mascotaData.fechaNacimiento = new Date(data.fechaNacimiento);

  if (data.alergias)
    mascotaData.alergias = data.alergias
      .trim()
      .replace(/\s{2,}/g, " ")
      .replace(/^(\w)(.*)/, (_, p, r) => p.toUpperCase() + r.toLowerCase());

  if (data.señas)
    mascotaData.señas = data.señas
      .trim()
      .replace(/\s{2,}/g, " ")
      .replace(/^(\w)(.*)/, (_, p, r) => p.toUpperCase() + r.toLowerCase());

  if (data.microchip)
    mascotaData.microchip = data.microchip.replace(/\s+/g, "").toUpperCase();

  if (data.razaId !== undefined) {
    mascotaData.raza = { connect: { id: data.razaId } };
  }

  if (data.imagen) mascotaData.imagen = data.imagen;

  try {
    console.log("🧪 MascotaData a guardar:", mascotaData);
    const mascota = await prisma.mascota.create({
      data: mascotaData,
    });

    return NextResponse.json({ mensaje: "Mascota creada", mascota });
  } catch (err) {
    const error = err instanceof Error ? err.message : "Error desconocido";
    console.error("🐞 Error en creación de mascota:", err);
    return NextResponse.json({ error }, { status: 500 });
  }
}
