// src/app/dashboard/page.tsx
import { VStack, Text } from "@chakra-ui/react";
import TarjetaBase from "@/components/ui/TarjetaBase";
import ExpedientesRecientesAsync from "./ExpedientesRecientesAsync";

export default function DashboardPage() {
  return (
    <>
      <TarjetaBase>
        <VStack align="start" gap={4}>
          <Text fontSize="2xl" color="tema.suave" fontWeight="bold">
            Últimos expedientes con actividad
          </Text>
          <ExpedientesRecientesAsync />
        </VStack>
      </TarjetaBase>
    </>
  );
}