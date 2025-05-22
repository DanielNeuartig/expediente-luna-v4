"use client";

import {
  Timeline,
  Icon,
  Avatar,
  Card,
  Text,
  Box,
  Span,
  Button,
  HStack,
} from "@chakra-ui/react";
import {
  LuFileText,
  LuStethoscope,
  LuSyringe,
  LuScrollText,
} from "react-icons/lu";
import PopOverReceta from "@/components/ui/PopOverReceta";
import type { AplicacionIndicacion } from "@prisma/client";
import type { Aplicacion } from "@/components/ui/aplicaciones/aplicaciones";

export type NotaClinicaExtendida = {
  id: number;
  historiaClinica?: string | null;
  exploracionFisica?: string | null;
  temperatura?: number | null;
  peso?: number | null;
  frecuenciaCardiaca?: number | null;
  frecuenciaRespiratoria?: number | null;
  diagnosticoPresuntivo?: string | null;
  pronostico?: string | null;
  laboratoriales?: string | null;
  extras?: string | null;
  fechaCreacion: string;
  autor?: {
    id: number;
    nombre: string;
    usuario?: {
      image?: string | null;
    };
  };
  medicamentos?: {
    id: number;
    nombre: string;
    dosis: string;
    via: string;
    frecuenciaHoras?: number | null;
    veces?: number | null;
    desde: string;
    observaciones?: string | null;
    paraCasa: boolean;
    tiempoIndefinido: boolean;
    ejecutor?: { id: number; nombre: string } | null;
  }[];
  indicaciones?: {
    id: number;
    descripcion: string;
    frecuenciaHoras?: number | null;
    veces?: number | null;
    desde: string;
    observaciones?: string | null;
    paraCasa: boolean;
    ejecutor?: { id: number; nombre: string } | null;
  }[];
};

export type ExpedienteConNotas = {
  id: number;
  tipo: string;
  fechaCreacion: string;
  contenidoAdaptado?: string | null;
  notasGenerales?: string | null;
  visibleParaTutor: boolean;
  borrado: boolean;
  autor?: {
    id: number;
    nombre: string;
    usuario?: {
      image?: string | null;
    };
  };
  notasClinicas: NotaClinicaExtendida[];
};

type Props = {
  expedientes: ExpedienteConNotas[];
  imagenUsuario: string;
  expedienteSeleccionado: ExpedienteConNotas | null;
  setExpedienteSeleccionado: (exp: ExpedienteConNotas) => void;
  mascota: {
    nombre: string;
    especie: string;
    raza?: { nombre: string } | null;
    fechaNacimiento?: string;
    sexo: string;
    esterilizado: string;
  };
};

export default function ListaExpedientesMascota({
  expedientes,
  imagenUsuario,
  expedienteSeleccionado,
  setExpedienteSeleccionado,
  mascota, // ✅ aquí está la clave
}: Props) {
  return (
    <Timeline.Root size="lg" variant="solid">
      {expedientes.map((exp) => {
        const esSeleccionado = expedienteSeleccionado?.id === exp.id;

        return (
          <Timeline.Item key={`exp-${exp.id}`}>
            <Timeline.Connector>
              <Timeline.Separator />
              <Timeline.Indicator
                borderColor="tema.intenso"
                bg={esSeleccionado ? "tema.llamativo" : "tema.suave"}
                color="tema.claro"
              >
                <Icon as={LuFileText} fontSize="xs" />
              </Timeline.Indicator>
            </Timeline.Connector>

            <Timeline.Content
              //bg={esSeleccionado ? "tema.llamativo" : undefined}
              borderRadius="xl"
              px="2"
              pt="2"
              pb="1"
            >
              <Timeline.Title fontWeight="bold" color="tema.suave">
                <HStack justify="space-between" align="center">
                  <Box>
                    #{exp.id} · {exp.tipo}
                    <Span color="tema.suave" ml="2">
                      {new Date(exp.fechaCreacion).toLocaleString("es-MX", {
                        weekday: "short",
                        year: "numeric",
                        month: "2-digit",
                        day: "2-digit",
                        hour: "2-digit",
                        minute: "2-digit",
                        hour12: false,
                      })}
                    </Span>
                    <Avatar.Root size="2xs" ml="3">
                      <Avatar.Image src={exp.autor?.usuario?.image ?? ""} />
                      <Avatar.Fallback />
                    </Avatar.Root>
                    <Span ml="2">{exp.autor?.nombre ?? "—"}</Span>
                  </Box>

                  <Button
                    size="xs"
                    bg={esSeleccionado ? "tema.llamativo" : "tema.suave"}
                    color="white"
                    onClick={() => setExpedienteSeleccionado(exp)}
                  >
                    {esSeleccionado ? "Seleccionado" : "Seleccionar"}
                  </Button>
                </HStack>
              </Timeline.Title>

              {exp.notasClinicas.map((nota) => (
                <Timeline.Item key={`nota-${nota.id}`} ml="6">
                  <Timeline.Connector>
                    <Timeline.Separator />
                    <Timeline.Indicator bg="tema.llamativo" color="tema.claro">
                      <Icon as={LuStethoscope} fontSize="xs" />
                    </Timeline.Indicator>
                  </Timeline.Connector>
                  <Timeline.Content gap="3">
                    <Timeline.Title color="tema.suave">
                      <Avatar.Root size="2xs">
                        <Avatar.Image src={nota.autor?.usuario?.image ?? ""} />
                        <Avatar.Fallback />
                      </Avatar.Root>
                      {nota.autor?.nombre ?? "Sin autor"}
                      <Span color="tema.suave" ml="2">
                        {new Date(nota.fechaCreacion).toLocaleString("es-MX", {
                          weekday: "short",
                          year: "numeric",
                          month: "2-digit",
                          day: "2-digit",
                          hour: "2-digit",
                          minute: "2-digit",
                          hour12: false,
                        })}
                      </Span>
                    </Timeline.Title>
                    <PopOverReceta
                      medicamentos={nota.medicamentos ?? []}
                      datosClinicos={{
                        historiaClinica: nota.historiaClinica ?? undefined,
                        exploracionFisica: nota.exploracionFisica ?? undefined,
                        temperatura: nota.temperatura ?? undefined,
                        peso: nota.peso ?? undefined,
                        frecuenciaCardiaca:
                          nota.frecuenciaCardiaca ?? undefined,
                        frecuenciaRespiratoria:
                          nota.frecuenciaRespiratoria ?? undefined,
                        diagnosticoPresuntivo:
                          nota.diagnosticoPresuntivo ?? undefined,
                        pronostico: nota.pronostico ?? undefined,
                        laboratoriales: nota.laboratoriales ?? undefined,
                        extras: nota.extras ?? undefined,
                      }}
                      fechaNota={nota.fechaCreacion}
                      datosMascota={{
                        nombre: mascota.nombre,
                        especie: mascota.especie,
                        raza: mascota.raza?.nombre,
                        fechaNacimiento: mascota.fechaNacimiento,
                        sexo: mascota.sexo,
                        esterilizado: mascota.esterilizado,
                      }}
                    />
                    <Card.Root bg="white" color="tema.suave">
                      <Card.Body textStyle="sm">
                        {nota.historiaClinica && (
                          <Text>Historia clínica: {nota.historiaClinica}</Text>
                        )}
                        {nota.exploracionFisica && (
                          <Text>
                            Exploración física: {nota.exploracionFisica}
                          </Text>
                        )}
                        {nota.temperatura != null && (
                          <Text>Temperatura: {nota.temperatura} °C</Text>
                        )}
                        {nota.peso != null && <Text>Peso: {nota.peso} kg</Text>}
                        {nota.frecuenciaCardiaca != null && (
                          <Text>FC: {nota.frecuenciaCardiaca} lpm</Text>
                        )}
                        {nota.frecuenciaRespiratoria != null && (
                          <Text>FR: {nota.frecuenciaRespiratoria} rpm</Text>
                        )}
                        {nota.diagnosticoPresuntivo && (
                          <Text>Diagnóstico: {nota.diagnosticoPresuntivo}</Text>
                        )}
                        {nota.pronostico && (
                          <Text>Pronóstico: {nota.pronostico}</Text>
                        )}
                        {nota.laboratoriales && (
                          <Text>Laboratoriales: {nota.laboratoriales}</Text>
                        )}
                        {nota.extras && <Text>Extras: {nota.extras}</Text>}
                      </Card.Body>
                    </Card.Root>

                    {(nota.medicamentos ?? []).map((m) => (
                      <Timeline.Item key={`med-${m.id}`} ml="0">
                        <Timeline.Connector>
                          <Timeline.Separator />
                          <Timeline.Indicator
                            borderColor="tema.intenso"
                            bg="tema.llamativo"
                            color="white"
                          >
                            <Icon as={LuSyringe} fontSize="xs" />
                          </Timeline.Indicator>
                        </Timeline.Connector>
                        <Timeline.Content>
                          <Card.Root bg="white" size="sm" color="tema.suave">
                            <Card.Body textStyle="sm">
                              <Text>
                                {m.nombre} ({m.dosis}) · {m.via}
                              </Text>
                              {m.frecuenciaHoras != null && (
                                <Text>Cada {m.frecuenciaHoras}h</Text>
                              )}
                              {m.veces != null && <Text>{m.veces} veces</Text>}
                              {m.observaciones && (
                                <Text>Observaciones: {m.observaciones}</Text>
                              )}
                              <Text>
                                Para casa?: {m.paraCasa ? "Sí" : "No"}
                              </Text>
                              <Text>
                                Indefinido: {m.tiempoIndefinido ? "Sí" : "No"}
                              </Text>
                            </Card.Body>
                          </Card.Root>
                        </Timeline.Content>
                      </Timeline.Item>
                    ))}

                    {(nota.indicaciones ?? []).map((i) => (
                      <Timeline.Item key={`ind-${i.id}`} ml="12">
                        <Timeline.Connector>
                          <Timeline.Separator />
                          <Timeline.Indicator bg="green.700" color="white">
                            <Icon as={LuScrollText} fontSize="xs" />
                          </Timeline.Indicator>
                        </Timeline.Connector>
                        <Timeline.Content>
                          <Timeline.Title color="tema.suave">
                            {i.ejecutor?.nombre ?? "—"}
                            <Span color="tema.suave" ml="2">
                              {new Date(i.desde).toLocaleString("es-MX")}
                            </Span>
                          </Timeline.Title>
                          <Card.Root size="sm" color="tema.suave">
                            <Card.Body textStyle="sm">
                              <Text>{i.descripcion}</Text>
                              {i.frecuenciaHoras != null && (
                                <Text>Cada {i.frecuenciaHoras}h</Text>
                              )}
                              {i.veces != null && <Text>{i.veces} veces</Text>}
                              {i.observaciones && (
                                <Text>Observaciones: {i.observaciones}</Text>
                              )}
                              <Text>
                                Para casa?: {i.paraCasa ? "Sí" : "No"}
                              </Text>
                            </Card.Body>
                          </Card.Root>
                        </Timeline.Content>
                      </Timeline.Item>
                    ))}
                  </Timeline.Content>
                </Timeline.Item>
              ))}
            </Timeline.Content>
          </Timeline.Item>
        );
      })}
    </Timeline.Root>
  );
}
