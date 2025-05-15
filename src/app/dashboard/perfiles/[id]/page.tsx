// src/app/dashboard/perfiles/[id]/page.tsx

import { Suspense } from "react";
import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import { Heading, Text, Spinner, Box, List, Center } from "@chakra-ui/react";
import {
  Phone,
  PhoneForwarded,
  CheckCircle,
  User,
  UserPlus,
  CalendarDays,
} from "lucide-react";
import TarjetaBase from "@/components/ui/TarjetaBase";

export default async function Page({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  return (
    <>
      {/* Contenido inmediato */}
      {/*<Box p="4">
        <Text fontSize="lg" color="tema.suave">Bienvenido a la página del perfil</Text>
        <Text fontSize="sm" color="tema.suave">
          Esta parte se renderiza sin esperar los parámetros.
        </Text>
      </Box>*/}

      {/* Contenido suspendido */}
      <Center>
        <Suspense
          fallback={
            <Box p="4">
              <Spinner
                animationDuration=".7s"
                borderWidth="2px"
                size="xl"
                color="tema.llamativo"
              />
            </Box>
          }
        >
          <AsyncPerfilComponent params={params} />
        </Suspense>
      </Center>
    </>
  );
}

async function AsyncPerfilComponent({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  // Simular retardo
  await new Promise((r) => setTimeout(r, 2000));

  const idNum = Number(id);
  if (isNaN(idNum)) return notFound();

  const perfil = await prisma.perfil.findUnique({
    where: { id: idNum },
    include: {
      usuario: true,
      creadoPor: {
        include: {
          perfil: true,
        },
      },
    },
  });

  if (!perfil) return notFound();

  const formatearTelefono = (telefono: string) =>
    telefono
      .replace(/\D/g, "")
      .replace(/(\d{2})(?=\d)/g, "$1 ")
      .trim();

  return (
    <TarjetaBase>
      <Heading fontWeight= "light"  size="md" mb="4" color="tema.intenso">
        {perfil.nombre}
      </Heading>

      <List.Root gap="3" variant="plain">
        {/* Teléfono principal */}
        <List.Item>
          <List.Indicator asChild color="blue.500">
            <Phone />
          </List.Indicator>
          <Text color="tema.suave" fontWeight= "light" >
            Teléfono principal:{" "}
            {perfil.clave + " " + formatearTelefono(perfil.telefonoPrincipal)}
          </Text>
        </List.Item>

        {/* Teléfonos secundarios */}
        {perfil.telefonoSecundario1 && (
          <List.Item>
            <List.Indicator asChild color="teal.500">
              <PhoneForwarded />
            </List.Indicator>
            <Text color="tema.suave">
              Tel. secundario 1: {formatearTelefono(perfil.telefonoSecundario1)}
            </Text>
          </List.Item>
        )}

        {perfil.telefonoSecundario2 && (
          <List.Item>
            <List.Indicator asChild color="teal.500">
              <PhoneForwarded />
            </List.Indicator>
            <Text color="tema.suave">
              Tel. secundario 2: {formatearTelefono(perfil.telefonoSecundario2)}
            </Text>
          </List.Item>
        )}

        {/* Verificación */}
        <List.Item>
          <List.Indicator
            asChild
            color={perfil.telefonoVerificado ? "green.500" : "red.500"}
          >
            <CheckCircle />
          </List.Indicator>
          <Text color="tema.suave">
            Teléfono verificado: {perfil.telefonoVerificado ? "Sí" : "No"}
          </Text>
        </List.Item>

        {/* Usuario vinculado */}
        <List.Item>
          <List.Indicator asChild color="gray.600">
            <User />
          </List.Indicator>
          <Text color="tema.suave">Tiene usuario: {perfil.usuario ? "Sí" : "No"}</Text>
        </List.Item>

        {/* Creado por */}
        <List.Item>
          <List.Indicator asChild color="purple.500">
            <UserPlus />
          </List.Indicator>
          <Text color="tema.suave">Creado por: {perfil.creadoPor?.perfil?.nombre ?? "—"}</Text>
        </List.Item>

        {/* Fecha de creación */}
        <List.Item>
          <List.Indicator asChild color="orange.500">
            <CalendarDays />
          </List.Indicator>
          <Text color="tema.suave">Creado en: {perfil.creadoEn.toLocaleString()}</Text>
        </List.Item>
      </List.Root>
    </TarjetaBase>
  );
}
