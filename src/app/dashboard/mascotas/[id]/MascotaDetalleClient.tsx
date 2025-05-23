"use client";

import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import {
  Box,
  Tabs,
  Spinner,
  Text,
  Table,
  Avatar,
  HStack,
} from "@chakra-ui/react";
import TarjetaBase from "@/components/ui/TarjetaBase";
import BoxMascota from "@/components/ui/BoxMascota";
import BotoneraExpediente from "@/components/ui/BotonesCrearExpediente";
import ListaExpedientesMascota, {
  ExpedienteConNotas,
} from "@/components/ui/ListaExpedientesMascota";
import FormularioNotaClinica from "@/components/ui/notaClinica/FormularioNotaClinica";
import { Sexo, Esterilizacion, Especie } from "@prisma/client";
import ListaAplicacionesMedicamento from "@/components/ui/aplicaciones/ListaAplicacionesMedicamento";
import type { Aplicacion } from "@/components/ui/aplicaciones/aplicaciones";
import { LuFileText, LuCircleCheck, LuHistory } from "react-icons/lu";

function formatearFecha(fecha: string) {
  return new Date(fecha).toLocaleString("es-MX", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  });
}

type Mascota = {
  id: number;
  nombre: string;
  especie: Especie;
  fechaNacimiento?: string;
  sexo: Sexo;
  esterilizado: Esterilizacion;
  microchip?: string | null;
  activo: boolean;
  raza?: { nombre: string } | null;
  perfil?: { id: number; nombre: string } | null;
};

type AplicacionIndicacion = {
  id: number;
  descripcionManual?: string | null;
  descripcion?: string | null;
  fechaProgramada: string;
  estado: string;
  indicacionId?: number;
};

export default function MascotaDetalleClient({
  mascota,
}: {
  mascota: Mascota;
}) {
  const [expedienteSeleccionado, setExpedienteSeleccionado] =
    useState<ExpedienteConNotas | null>(null);
  const [mostrarFormularioNota, setMostrarFormularioNota] = useState(true);

  const { data, isLoading, isError } = useQuery<{
    expedientes: ExpedienteConNotas[];
    aplicacionesMedicamentos: Aplicacion[];
    aplicacionesIndicaciones: AplicacionIndicacion[];
  }>({
    queryKey: ["expedientes", mascota.id],
    queryFn: async () => {
      const res = await fetch(`/api/mascotas/${mascota.id}/expedientes`);
      if (!res.ok) throw new Error("Error al cargar expedientes");
      return res.json();
    },
  });

  const expedientes = data?.expedientes ?? [];
  const aplicacionesMedicamentos = data?.aplicacionesMedicamentos ?? [];
 // const aplicacionesIndicaciones = data?.aplicacionesIndicaciones ?? [];

  if (isLoading) {
    return (
      <Box gridColumn="1 / span 2" gridRow="1">
        <TarjetaBase>
          <Spinner size="lg" color="tema.llamativo" />
        </TarjetaBase>
      </Box>
    );
  }
  if (isError) {
    return (
      <Box gridColumn="1 / span 2" gridRow="1">
        <TarjetaBase>
          <Text color="red.500">Error al cargar datos clínicos.</Text>
        </TarjetaBase>
      </Box>
    );
  }

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
              fechaNacimiento: mascota.fechaNacimiento,
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
          <TarjetaBase>
            <ListaExpedientesMascota
              expedientes={expedientes}
              expedienteSeleccionado={expedienteSeleccionado}
              setExpedienteSeleccionado={(expediente) => {
                setExpedienteSeleccionado(expediente);
                setMostrarFormularioNota(true);
              }}
              //aplicacionesMedicamentos={aplicacionesMedicamentos}
              //aplicacionesIndicaciones={aplicacionesIndicaciones}
              datosMascota={{
                nombre: mascota.nombre,
                especie: mascota.especie,
                raza: mascota.raza?.nombre,
                fechaNacimiento: mascota.fechaNacimiento,
                sexo: mascota.sexo,
                esterilizado: mascota.esterilizado,
              }}
            />
          </TarjetaBase>
        </TarjetaBase>
      </Box>

      <Box gridColumn="2" gridRow="1">
        <TarjetaBase>
          <Tabs.Root defaultValue="aplicaciones" variant="enclosed">
            <Tabs.List bg="tema.intenso">
              <Tabs.Trigger
                color="tema.suave"
                value="aplicaciones"
                fontWeight="bold"
              >
                <LuCircleCheck style={{ marginRight: 6 }} /> Aplicaciones
                clínicas
              </Tabs.Trigger>
              <Tabs.Trigger
                value="nota"
                fontWeight="bold"
                disabled={!expedienteSeleccionado}
              >
                <LuFileText style={{ marginRight: 6 }} /> Nueva nota clínica
              </Tabs.Trigger>
              <Tabs.Trigger value="historico" fontWeight="bold">
                <LuHistory style={{ marginRight: 6 }} /> Históricos
              </Tabs.Trigger>
            </Tabs.List>

            <Tabs.Content value="aplicaciones">
              <ListaAplicacionesMedicamento
                aplicaciones={aplicacionesMedicamentos}
              />
            </Tabs.Content>

            <Tabs.Content value="nota">
              {expedienteSeleccionado && mostrarFormularioNota ? (
                <FormularioNotaClinica
                  expedienteSeleccionado={expedienteSeleccionado}
                  mascotaId={mascota.id}
                  onClose={() => setMostrarFormularioNota(false)}
                />
              ) : (
                <Box py={4} color="tema.suave">
                  {expedienteSeleccionado
                    ? "Nota clínica cerrada."
                    : "Selecciona un expediente para registrar una nota clínica."}
                </Box>
              )}
            </Tabs.Content>

            <Tabs.Content value="historico">
              <Box py="4">
                <Text fontWeight="bold" mb="2">
                  Historial de pesos
                </Text>
                <Table.Root size="sm" mb="6" bg="tema.suave" color="tema.claro">
                  <Table.Header>
                    <Table.Row>
                      <Table.ColumnHeader>Fecha</Table.ColumnHeader>
                      <Table.ColumnHeader textAlign="end">
                        Peso (kg)
                      </Table.ColumnHeader>
                    </Table.Row>
                  </Table.Header>
                  <Table.Body>
                    {expedientes
                      .flatMap((exp) => exp.notasClinicas)
                      .filter((n) => n.peso != null)
                      .map((nota) => (
                        <Table.Row key={nota.id}>
                          <Table.Cell>
                            {formatearFecha(nota.fechaCreacion)}
                          </Table.Cell>
                          <Table.Cell textAlign="end">{nota.peso}</Table.Cell>
                        </Table.Row>
                      ))}
                  </Table.Body>
                </Table.Root>

                <Text fontWeight="bold" mb="2">
                  Historial médico completo
                </Text>
                <Table.Root size="sm">
                  <Table.Header>
                    <Table.Row>
                      <Table.ColumnHeader>Expediente</Table.ColumnHeader>
                      <Table.ColumnHeader>Tipo</Table.ColumnHeader>
                      <Table.ColumnHeader>Fecha</Table.ColumnHeader>
                      <Table.ColumnHeader>Autor</Table.ColumnHeader>
                    </Table.Row>
                  </Table.Header>
                  <Table.Body>
                    {expedientes.map((exp) => (
                      <>
                        <Table.Row
                          key={`exp-${exp.id}`}
                          bg="tema.llamativo"
                          color="tema.claro"
                        >
                          <Table.Cell>#{exp.id}</Table.Cell>
                          <Table.Cell>{exp.tipo}</Table.Cell>
                          <Table.Cell>
                            {formatearFecha(exp.fechaCreacion)}
                          </Table.Cell>
                          <Table.Cell>
                            <Avatar.Root size="2xs">
                              <Avatar.Image
                                src={exp.autor?.usuario?.image ?? ""}
                              />
                              <Avatar.Fallback />
                            </Avatar.Root>
                            <Box as="span" ml="2">
                              {exp.autor?.nombre ?? "—"}
                            </Box>
                          </Table.Cell>
                        </Table.Row>

                        {exp.notasClinicas.map((nota) => (
                          <>
                            <Table.Row
                              key={`nota-${nota.id}`}
                              bg="tema.suave"
                              color="tema.claro"
                            >
                              <Table.Cell colSpan={4}>
                                <Text fontWeight="semibold">
                                  Nota #{nota.id} {" - "} 📅
                                  {formatearFecha(nota.fechaCreacion)}
                                </Text>
                                <HStack align="center" mb="2">
                                  <Avatar.Root size="2xs">
                                    <Avatar.Image
                                      src={nota.autor?.usuario?.image ?? ""}
                                    />
                                    <Avatar.Fallback />
                                  </Avatar.Root>
                                  <Text ml="2">
                                    {nota.autor?.nombre ?? "Sin autor"}
                                  </Text>
                                </HStack>
                                {nota.historiaClinica && (
                                  <Text>Historia: {nota.historiaClinica}</Text>
                                )}
                                {nota.diagnosticoPresuntivo && (
                                  <Text>
                                    Diagnóstico: {nota.diagnosticoPresuntivo}
                                  </Text>
                                )}
                                {nota.peso && <Text>Peso: {nota.peso} kg</Text>}
                                {nota.temperatura && (
                                  <Text>
                                    Temperatura: {nota.temperatura} °C
                                  </Text>
                                )}
                                {nota.pronostico && (
                                  <Text>Pronóstico: {nota.pronostico}</Text>
                                )}
                              </Table.Cell>
                            </Table.Row>

                            {nota.medicamentos?.map((m) => (
                              <Table.Row
                                key={`med-${m.id}`}
                                bg="tema.suave"
                                color="tema.claro"
                              >
                                <Table.Cell />
                                <Table.Cell colSpan={3}>
                                  <Text>
                                    💊 {m.nombre} ({m.dosis}) · {m.via} ·{" "}
                                    {m.frecuenciaHoras
                                      ? `Cada ${m.frecuenciaHoras}h`
                                      : ""}{" "}
                                    {m.veces ? `· ${m.veces} veces` : ""} ·{" "}
                                    {m.paraCasa ? "Para casa" : "Solo clínica"}{" "}
                                    ·{" "}
                                    {m.tiempoIndefinido
                                      ? "Indefinido"
                                      : "Duración fija"}
                                  </Text>
                                  {m.observaciones && (
                                    <Text>Obs: {m.observaciones}</Text>
                                  )}
                                </Table.Cell>
                              </Table.Row>
                            ))}
                          </>
                        ))}
                      </>
                    ))}
                  </Table.Body>
                </Table.Root>
              </Box>
            </Tabs.Content>
          </Tabs.Root>
        </TarjetaBase>
      </Box>
    </>
  );
}
