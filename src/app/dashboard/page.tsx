"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { Spinner, Center, Text, VStack} from "@chakra-ui/react";
import TarjetaBase from "@/components/ui/TarjetaBase";


export default function DashboardPage() {
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {}, [status, session, router]);

  if (status === "loading") {
    return (
      <Center minH="100vh">
        <Spinner size="xl" />
      </Center>
    );
  }

  return (
    <Center>
      <TarjetaBase>

      <VStack> <Text fontSize="2xl" color="tema.suave">
        ¡Bienvenido al dashboard de ELDOC - Centro Veterinario!{" "}
      </Text>
      <Text fontSize="lg" color="tema.suave">
        {" "}
        Aquí podrás ver métricas y noticias generales{" "}
      </Text>
      </VStack>
        </TarjetaBase>     


    </Center>
  );
}
