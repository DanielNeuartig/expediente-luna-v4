"use client";

import { useState } from "react";
import {
  Text,
  Box,
  HStack,
  Tabs,
  Table,
  Badge,
  List,
} from "@chakra-ui/react";
import {
  Phone,
  PhoneForwarded,
  CheckCircle,
  CircleUserRound,
  UserPlus,
  CalendarDays,
  User,
  Album,
  PawPrint,
  Plus,
} from "lucide-react";
import TarjetaBase from "@/components/ui/TarjetaBase";
import FormularioMascotaVisual from "@/components/ui/FormularioMascotaVisual";
import BoxMascota from "@/components/ui/BoxMascota";

type Mascota = {
  id: number;
  nombre: string;
  especie: string;
  fechaNacimiento?: Date | null;
  sexo: "MACHO" | "HEMBRA" | "DESCONOCIDO";
  esterilizado: "ESTERILIZADO" | "NO_ESTERILIZADO" | "DESCONOCIDO";
  microchip?: string | null;
  activo: boolean;
  raza?: { nombre: string } | null;
};

type Perfil = {
  id: number;
  nombre: string;
  documentoId?: string | null;
  prefijo: string;
  clave: string;
  telefonoPrincipal: string;
  telefonoSecundario1?: string | null;
  telefonoSecundario2?: string | null;
  telefonoVerificado: boolean;
  fechaCreacion: Date;
  usuario?: any;
  autor?: {
    perfil?: {
      nombre: string;
    };
  } | null;
  mascotas: Mascota[];
};

export default function PerfilDetalleClient({ perfil }: { perfil: Perfil }) {
  const [tab, setTab] = useState<"mascotas" | "nueva">("mascotas");

  const formatearTelefono = (telefono: string) =>
    telefono
      .replace(/\D/g, "")
      .replace(/(\d{2})(?=\d)/g, "$1 ")
      .trim();

  return (
    <>
      <Box gridColumn="1" gridRow="1">
        <TarjetaBase>
          <Box bg="tema.suave" borderRadius="2xl" px="3" py="4" mb="4">
            <HStack gap="2">
              <CircleUserRound size={30} color="white" />
              <Text fontWeight="bold" color="tema.claro">
                {perfil.nombre}
              </Text>
            </HStack>
          </Box>

          <Table.Root  size="sm">
            <Table.Body>
              <Table.Row bg="tema.intenso">
                <Table.Cell bg="tem"fontWeight="bold">Documento ID</Table.Cell>
                <Table.Cell>{perfil.documentoId ?? "—"}</Table.Cell>
              </Table.Row>
              <Table.Row bg="tema.suave">
                <Table.Cell fontWeight="bold">Prefijo</Table.Cell>
                <Table.Cell>{perfil.prefijo}</Table.Cell>
              </Table.Row>
              <Table.Row bg="tema.intenso">
                <Table.Cell fontWeight="bold">Teléfono principal</Table.Cell>
                <Table.Cell>
                  {perfil.clave + " " + formatearTelefono(perfil.telefonoPrincipal)}
                </Table.Cell>
              </Table.Row >
              {perfil.telefonoSecundario1 && (
                <Table.Row bg="tema.suave">
                  <Table.Cell fontWeight="bold">Tel. secundario 1</Table.Cell>
                  <Table.Cell>{formatearTelefono(perfil.telefonoSecundario1)}</Table.Cell>
                </Table.Row>
              )}
              {perfil.telefonoSecundario2 && (
                <Table.Row bg="tema.intenso">
                  <Table.Cell fontWeight="bold">Tel. secundario 2</Table.Cell>
                  <Table.Cell>{formatearTelefono(perfil.telefonoSecundario2)}</Table.Cell>
                </Table.Row>
              )}
              <Table.Row bg="tema.suave">
                <Table.Cell fontWeight="bold">Teléfono verificado</Table.Cell>
                <Table.Cell>{perfil.telefonoVerificado ? "Sí" : "No"}</Table.Cell>
              </Table.Row>
              <Table.Row bg="tema.intenso">
                <Table.Cell fontWeight="bold">Tiene usuario</Table.Cell>
                <Table.Cell>{perfil.usuario ? "Sí" : "No"}</Table.Cell>
              </Table.Row>
              <Table.Row bg="tema.suave">
                <Table.Cell fontWeight="bold">Creado por</Table.Cell>
                <Table.Cell>{perfil.autor?.perfil?.nombre ?? "—"}</Table.Cell>
              </Table.Row>
              <Table.Row bg="tema.intenso">
                <Table.Cell fontWeight="bold">Creado en</Table.Cell>
                <Table.Cell>{perfil.fechaCreacion.toLocaleString()}</Table.Cell>
              </Table.Row>
            </Table.Body>
          </Table.Root>
        </TarjetaBase>
      </Box>

      <Box gridColumn="2" gridRow="1">
        <TarjetaBase>
          <Tabs.Root
            variant="outline"
            value={tab}
            onValueChange={(details) => setTab(details.value as "mascotas" | "nueva")}
          >
            <Tabs.List>
              <Tabs.Trigger color="tema.suave" value="mascotas" fontWeight="bold">
                <PawPrint style={{ marginRight: 6 }} /> Mascotas
              </Tabs.Trigger>
              <Tabs.Trigger color="tema.llamativo" value="nueva" fontWeight="bold">
                <Plus style={{ marginRight: 6 }} /> Añadir mascota
              </Tabs.Trigger>
            </Tabs.List>
            <Tabs.Content value="mascotas">
              {perfil.mascotas.length === 0 ? (
                <Text color="tema.suave" fontWeight="light">
                  No se han registrado mascotas.
                </Text>
              ) : (
                <List.Root gap="3" variant="plain" mt="4">
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
            </Tabs.Content>
            <Tabs.Content value="nueva">
              <Box mt="4">
                <FormularioMascotaVisual />
              </Box>
            </Tabs.Content>
          </Tabs.Root>
        </TarjetaBase>
      </Box>
    </>
  );
}