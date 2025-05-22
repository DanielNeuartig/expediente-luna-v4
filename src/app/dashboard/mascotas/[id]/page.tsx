import { Suspense } from "react";
import { Metadata } from "next";
import { Box, Spinner } from "@chakra-ui/react";
import MascotaAsync from "./MascotaAsync";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const { id } = await params;
  return { title: `Mascota #${id} · Expediente Luna` };
}

export default async function MascotaDetallePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  return (
    <Suspense fallback={<Box p="4"><Spinner size="xl" color="tema.llamativo" /></Box>}>
      <MascotaAsync id={Number(id)} />
    </Suspense>
  );
}