import MascotaDetalleClient from "./MascotaDetalleClient";
import { notFound } from "next/navigation";

export default async function MascotaAsync({ id }: { id: number }) {
  const { prisma } = await import("@/lib/prisma");

  const mascota = await prisma.mascota.findUnique({
    where: { id },
    include: {
      raza: true,
      perfil: true,
    },
  });

  if (!mascota) return notFound();

  return (
    <MascotaDetalleClient
      mascota={{
        ...mascota,
        fechaNacimiento: mascota.fechaNacimiento?.toISOString(),
        // esterilizado se mantiene como enum string: "ESTERILIZADO" | ...
      }}
    />
  );
}