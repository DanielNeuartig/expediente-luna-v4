// src/app/dashboard/perfiles/[id]/page.tsx
import { Suspense } from "react";
import { Box, Spinner } from "@chakra-ui/react";
import TarjetaBase from "@/components/ui/TarjetaBase";
import PerfilAsync from "./PerfilAsync";

export default function Page({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  return (
    <Suspense
      fallback={
        <Box p="4">
          <TarjetaBase>
            <Spinner
              animationDuration="0.7s"
              borderWidth="2px"
              size="xl"
              color="tema.llamativo"
            />
          </TarjetaBase>
        </Box>
      }
    >
      <PerfilAsync params={params} />
    </Suspense>
  );
}