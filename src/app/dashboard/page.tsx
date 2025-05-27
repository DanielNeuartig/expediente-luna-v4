// ✅ src/app/dashboard/page.tsx (Server Component)
import TarjetaBase from "@/components/ui/TarjetaBase";
import ExpedientesRecientesAsync from "./ExpedientesRecientesAsync";
import { Text, VStack, Center } from "@chakra-ui/react";

export default function DashboardPage() {
  return (
    <Center>
      <TarjetaBase>
        <VStack>
          <Text fontSize="2xl" color="tema.suave" fontWeight={"bold"}>
            Últimos expediente con actividad
          </Text>
          <ExpedientesRecientesAsync />
        </VStack>
      </TarjetaBase>
    </Center>
  );
}