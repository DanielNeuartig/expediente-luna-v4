// src/app/mascotas/[id]/page.tsx
import { Suspense } from "react";
import { notFound } from "next/navigation";
import { Metadata } from "next";
import { Spinner, Box } from "@chakra-ui/react";
import TarjetaBase from "@/components/ui/TarjetaBase";
import BoxMascota from "@/components/ui/BoxMascota";
import BotoneraExpediente from "@/components/ui/BotonesCrearExpediente";
import ListaExpedientesMascota from "@/components/ui/ListaExpedientesMascota";
import FormularioNotaClinicaTemporal from "@/components/ui/FormularioNotaClinicaTemporal";
export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const { id } = await params;
  return { title: `Mascota #${id} · Expediente Luna` };
}

export default function MascotaDetallePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  return (
    <Suspense
      fallback={
        <Box p="4">
          <Spinner size="xl" color="tema.llamativo" />
        </Box>
      }
    >
      <AsyncMascotaComponent params={params} />
    </Suspense>
  );
}

async function AsyncMascotaComponent({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const idNum = Number(id);
  if (isNaN(idNum)) return notFound();

  const { prisma } = await import("@/lib/prisma");
  const mascota = await prisma.mascota.findUnique({
    where: { id: idNum },
    include: {
      raza: true,
      perfil: true,
    },
  });

  if (!mascota) return notFound();

  return (
    <>
      <Box gridColumn="1" gridRow="1">
        <TarjetaBase>
          <BoxMascota
            redirigirPerfil
            mascota={{
              id: mascota.id,
              nombre: mascota.nombre,
              tipo: "mascota",
              especie: mascota.especie,
              fechaNacimiento: mascota.fechaNacimiento?.toISOString(),
              sexo: mascota.sexo,
              esterilizado: mascota.esterilizado,
              microchip: mascota.microchip ?? undefined,
              activo: mascota.activo,
              raza: mascota.raza?.nombre ?? undefined,
              perfilId: mascota.perfil?.id,
              nombrePerfil: mascota.perfil?.nombre,
            }}
          />
          <BotoneraExpediente mascotaId={mascota.id} />
        </TarjetaBase>
      </Box>
      <Box gridColumn="1" gridRow="2">
        <TarjetaBase>
          <ListaExpedientesMascota mascotaId={mascota.id} />
        </TarjetaBase>
      </Box>
      <Box gridColumn="2" gridRow="1">
        <TarjetaBase>
          <FormularioNotaClinicaTemporal/>
        </TarjetaBase>
      </Box>
    </>
  );
}
