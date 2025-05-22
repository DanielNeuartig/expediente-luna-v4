import { notFound } from "next/navigation";
import { Suspense } from "react";
import { Spinner, Box } from "@chakra-ui/react";
import { prisma } from "@/lib/prisma";
import PerfilDetalleClient from "./PerfilDetalleClient";

export default async function PerfilAsync({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const idNum = Number(id);
  if (isNaN(idNum)) return notFound();

  const perfil = await prisma.perfil.findUnique({
    where: { id: idNum },
    include: {
      usuario: true,
      autor: {
        include: {
          perfil: {
            select: {
              nombre: true,
            },
          },
        },
      },
      mascotas: {
        include: {
          raza: true,
        },
      },
    },
  });

  if (!perfil) return notFound();

  return (
    <Suspense
      fallback={
        <Box p="4">
          <Spinner size="xl" color="tema.llamativo" />
        </Box>
      }
    >
      <PerfilDetalleClient
        perfil={{
          ...perfil,
          prefijo: perfil.prefijo ?? "—", // ✅ aseguramos string
          autor: {
            ...perfil.autor,
            perfil:
              perfil.autor?.perfil !== null
                ? perfil.autor?.perfil
                : undefined, // ✅ evitamos pasar `null`
          },
        }}
      />
    </Suspense>
  );
}