// src/app/dashboard/perfiles/[id]/page.tsx
import { Suspense } from "react";
import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import { Text, Spinner, Box, List, HStack } from "@chakra-ui/react";
import {
  Phone,
  PhoneForwarded,
  CheckCircle,
  CircleUserRound,
  UserPlus,
  CalendarDays,
  User,
  Album,
} from "lucide-react";
import TarjetaBase from "@/components/ui/TarjetaBase";
import FormularioMascotaVisual from "@/components/ui/FormularioMascotaVisual";
import BoxMascota from "@/components/ui/BoxMascota";

export default async function Page({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  return (
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
  );
}

async function AsyncPerfilComponent({
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
          perfil: true,
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

  const formatearTelefono = (telefono: string) =>
    telefono
      .replace(/\D/g, "")
      .replace(/(\d{2})(?=\d)/g, "$1 ")
      .trim();

  return (
    <>
      <Box gridColumn="1" gridRow="1">
        <TarjetaBase>
          <Box bg="tema.suave" borderRadius="2xl" px="3" py="4" mb="1">
            <HStack gap="2">
              <CircleUserRound size={30} color="white" />
              <Text fontWeight="bold" color="tema.claro" textAlign="center">
                {perfil.nombre}
              </Text>
            </HStack>
          </Box>
          <Box
            bg="tema.llamativo"
            borderRadius="full"
            px="4"
            py="1"
            display="inline-flex"
            mb="2"
            boxShadow="sm"
          >
            <HStack gap="2">
              <Album size={20} color="white" />
              <Text fontWeight="bold" color="tema.claro" fontSize={"sm"}>
                {perfil.prefijo}
              </Text>
            </HStack>
          </Box>

          <List.Root gap="3" variant="plain">
            <List.Item>
              <List.Indicator
                asChild
                color={perfil.documentoId ? "cyan.500" : "red.500"}
              >
                <User />
              </List.Indicator>
              <HStack>
                <Text color="tema.suave" fontWeight="medium">
                  Documento ID:
                </Text>
                <Text color="tema.suave" fontWeight="light">
                  {perfil.documentoId ?? "—"}
                </Text>
              </HStack>
            </List.Item>

            <List.Item>
              <List.Indicator asChild color="blue.500">
                <Phone />
              </List.Indicator>
              <HStack>
                <Text color="tema.suave" fontWeight="medium">
                  Teléfono principal:
                </Text>
                <Text color="tema.suave" fontWeight="light">
                  {perfil.clave +
                    " " +
                    formatearTelefono(perfil.telefonoPrincipal)}
                </Text>
              </HStack>
            </List.Item>

            {perfil.telefonoSecundario1 && (
              <List.Item>
                <List.Indicator asChild color="teal.500">
                  <PhoneForwarded />
                </List.Indicator>
                <HStack>
                  <Text color="tema.suave" fontWeight="medium">
                    Tel. secundario 1:
                  </Text>
                  <Text color="tema.suave" fontWeight="light">
                    {formatearTelefono(perfil.telefonoSecundario1)}
                  </Text>
                </HStack>
              </List.Item>
            )}

            {perfil.telefonoSecundario2 && (
              <List.Item>
                <List.Indicator asChild color="teal.500">
                  <PhoneForwarded />
                </List.Indicator>
                <HStack>
                  <Text color="tema.suave" fontWeight="medium">
                    Tel. secundario 2:
                  </Text>
                  <Text color="tema.suave" fontWeight="light">
                    {formatearTelefono(perfil.telefonoSecundario2)}
                  </Text>
                </HStack>
              </List.Item>
            )}

            <List.Item>
              <List.Indicator
                asChild
                color={perfil.telefonoVerificado ? "green.500" : "red.500"}
              >
                <CheckCircle />
              </List.Indicator>
              <HStack>
                <Text color="tema.suave" fontWeight="medium">
                  Teléfono verificado:
                </Text>
                <Text color="tema.suave" fontWeight="light">
                  {perfil.telefonoVerificado ? "Sí" : "No"}
                </Text>
              </HStack>
            </List.Item>

            <List.Item>
              <List.Indicator asChild color="gray.600">
                <User />
              </List.Indicator>
              <HStack>
                <Text color="tema.suave" fontWeight="medium">
                  Tiene usuario:
                </Text>
                <Text color="tema.suave" fontWeight="light">
                  {perfil.usuario ? "Sí" : "No"}
                </Text>
              </HStack>
            </List.Item>

            <List.Item>
              <List.Indicator asChild color="purple.500">
                <UserPlus />
              </List.Indicator>
              <HStack>
                <Text color="tema.suave" fontWeight="medium">
                  Creado por:
                </Text>
                <Text color="tema.suave" fontWeight="light">
                  {perfil.autor?.perfil?.nombre ?? "—"}
                </Text>
              </HStack>
            </List.Item>

            <List.Item>
              <List.Indicator asChild color="orange.500">
                <CalendarDays />
              </List.Indicator>
              <HStack>
                <Text color="tema.suave" fontWeight="medium">
                  Creado en:
                </Text>
                <Text color="tema.suave" fontWeight="light">
                  {perfil.fechaCreacion.toLocaleString()}
                </Text>
              </HStack>
            </List.Item>
          </List.Root>
          <Box
          bg="gray.100"
          p="4"
            borderRadius="xl">
            <Text color="tema.suave">Registrar una mascota nueva:</Text>
            <FormularioMascotaVisual />
          </Box>
        </TarjetaBase>
      </Box>

      <Box gridColumn="2" gridRow="1">
        <TarjetaBase>
          <Text color="tema.suave" fontWeight={"bold"} fontSize={"2xl"}>
            Mascotas
          </Text>

          {perfil.mascotas.length === 0 ? (
            <Text color="tema.suave" fontWeight="light">
              No se han registrado mascotas.
            </Text>
          ) : (
            <List.Root gap="3" variant="plain">
              {perfil.mascotas.map((m) => (
                <List.Item key={m.id}>
                  <BoxMascota
                    mascota={{
                      id: m.id,
                      nombre: m.nombre,
                      tipo: "mascota",
                      especie: m.especie,
                      fechaNacimiento: m.fechaNacimiento?.toISOString(),
                      sexo: m.sexo,
                      esterilizado: m.esterilizado,
                      microchip: m.microchip ?? undefined,
                      activo: m.activo,
                      raza: m.raza?.nombre ?? undefined,
                      perfilId: perfil.id,
                      nombrePerfil: perfil.nombre,
                    }}
                  />
                </List.Item>
              ))}
            </List.Root>
          )}
        </TarjetaBase>
      </Box>
    </>
  );
}
