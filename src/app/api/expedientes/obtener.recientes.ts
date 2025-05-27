import { prisma } from "@/lib/prisma";

export async function obtenerExpedientesRecientes() {
  const crudos = await prisma.expedienteMedico.findMany({
    orderBy: { ultimaActividad: "desc" },
    take: 20,
    select: {
      id: true,
      nombre: true,
      tipo: true,
      estado: true,
      ultimaActividad: true,
      mascota: {
        select: {
          id: true,
          nombre: true,
          especie: true,
          fechaNacimiento: true,
          sexo: true,
          esterilizado: true,
          microchip: true,
          activo: true,
          raza: { select: { nombre: true } },
          perfil: { select: { id: true, nombre: true } },
        },
      },
      autor: {
        select: {
          nombre: true,
          prefijo: true,
        },
      },
    },
  });

  return crudos.map((exp) => ({
    id: exp.id,
    nombre: exp.nombre,
    tipo: exp.tipo,
    estado: exp.estado,
    ultimaActividad: exp.ultimaActividad.toISOString(),
    autor: {
      nombre: exp.autor.nombre,
      prefijo: exp.autor.prefijo ?? "",
    },
    mascota: {
      id: exp.mascota.id,
      nombre: exp.mascota.nombre,
      especie: exp.mascota.especie,
      fechaNacimiento: exp.mascota.fechaNacimiento ?? undefined,
      sexo: exp.mascota.sexo,
      esterilizado: exp.mascota.esterilizado,
      microchip: exp.mascota.microchip ?? undefined,
      activo: exp.mascota.activo,
      raza: exp.mascota.raza ?? undefined,
      perfil: exp.mascota.perfil ?? undefined,
    },
  }));
}