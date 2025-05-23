"use client";

import {
  Box,
  Table,
  Text,
  Avatar,
  HStack,
  Button,
  SegmentGroup,
} from "@chakra-ui/react";
import { useState, Fragment } from "react";
import { ExpedienteConNotas } from "@/types/expediente";
import PopOverReceta from "@/components/ui/PopOverReceta";
import { estilosBotonEspecial } from "./config/estilosBotonEspecial";
import MenuAccionesNota from "./MenuAccionesNota";

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

type Props = {
  expedientes: ExpedienteConNotas[];
  expedienteSeleccionado: ExpedienteConNotas | null;
  setExpedienteSeleccionado: (exp: ExpedienteConNotas) => void;
  datosMascota: {
    nombre: string;
    especie: string;
    raza?: string;
    fechaNacimiento?: string;
    sexo: string;
    esterilizado: string;
  };
};

export default function HistoricoExpedientes({
  expedientes,
  expedienteSeleccionado,
  setExpedienteSeleccionado,
  datosMascota,
}: Props) {
  const [filtro, setFiltro] = useState<"todas" | "activas" | "eliminadas">(
    "todas"
  );

  return (
    <Box>
      <Text color="tema.intenso" fontWeight="bold" mb="2">
        Historial médico completo
      </Text>

      <SegmentGroup.Root
        defaultValue="todas"
        onValueChange={({ value }) =>
          setFiltro(value as "todas" | "activas" | "eliminadas")
        }
      >
        <SegmentGroup.Items
          items={[
            { value: "todas", label: "Todas" },
            { value: "activas", label: "Activas" },
            { value: "eliminadas", label: "Eliminadas" },
          ]}
        />
        <SegmentGroup.Indicator />
      </SegmentGroup.Root>

      <Table.Root size="sm" mt="4">
        <Table.Header>
          <Table.Row>
            <Table.ColumnHeader>Expediente</Table.ColumnHeader>
            <Table.ColumnHeader>Tipo</Table.ColumnHeader>
            <Table.ColumnHeader>Fecha</Table.ColumnHeader>
            <Table.ColumnHeader>Autor</Table.ColumnHeader>
          </Table.Row>
        </Table.Header>

        <Table.Body>
          {expedientes.map((exp) => {
            const notasFiltradas = exp.notasClinicas.filter((nota) => {
              if (filtro === "activas") return nota.activa;
              if (filtro === "eliminadas") return !nota.activa;
              return true;
            });

            return (
              <Fragment key={`expediente-${exp.id}`}>
                <Table.Row bg="tema.llamativo" color="tema.claro">
                  <Table.Cell>#{exp.id}</Table.Cell>
                  <Table.Cell>{exp.tipo}</Table.Cell>
                  <Table.Cell>{formatearFecha(exp.fechaCreacion)}</Table.Cell>
                  <Table.Cell>
                    <Avatar.Root size="2xs">
                      <Avatar.Image src={exp.autor.usuario?.image ?? ""} />
                      <Avatar.Fallback />
                    </Avatar.Root>
                    <Box as="span" ml="2">
                      {exp.autor.nombre}
                    </Box>
                  </Table.Cell>
                </Table.Row>

                <Table.Row bg="tema.llamativo">
                  <Table.Cell colSpan={4}>
                    <Button
                      {...estilosBotonEspecial}
                      size="xs"
                      colorScheme="blue"
                      mt="2"
                    >
                      Añadir nueva nota clínica
                    </Button>
                  </Table.Cell>
                </Table.Row>

                {notasFiltradas.map((nota) => (
                  <Table.Row
                    key={`nota-${nota.id}`}
                    bg="tema.suave"
                    color="tema.claro"
                  >
                    <Table.Cell colSpan={4}>
                      <HStack justify="space-between" mb="2">
                
                        <Text fontWeight="semibold">
                          Nota #{nota.id} - 📅{" "}
                          {formatearFecha(nota.fechaCreacion)}
                        </Text>
                        <PopOverReceta
                          medicamentos={nota.medicamentos}
                          datosClinicos={{
                            historiaClinica: nota.historiaClinica ?? undefined,
                            exploracionFisica:
                              nota.exploracionFisica ?? undefined,
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
                          datosMascota={datosMascota}
                        />
                        <MenuAccionesNota
                          onAnular={() => {
                            console.log(`Anular nota ${nota.id}`);
                            // Aquí irá lógica real más adelante
                          }}
                          onReemplazar={() => {
                            console.log(`Reemplazar nota ${nota.id}`);
                            // Aquí se puede abrir un formulario con valores precargados
                          }}
                        />
                      </HStack>
                      <HStack align="center" mb="2">
                        <Avatar.Root size="2xs">
                          <Avatar.Image src={nota.autor.usuario?.image ?? ""} />
                          <Avatar.Fallback />
                        </Avatar.Root>

                        <Text ml="2">{nota.autor.nombre}</Text>
                        {!nota.activa && (
                          <Box
                            mt="1"
                            mb="2"
                            px="2"
                            py="1"
                            bg="red.900"
                            color="red.200"
                            borderRadius="md"
                          >
                            <Text fontWeight="bold">🛑 Nota no activa</Text>
                            {nota.fechaCancelacion && (
                              <Text fontSize="sm">
                                Cancelada el{" "}
                                {formatearFecha(nota.fechaCancelacion)}
                              </Text>
                            )}
                            {nota.canceladaPorId && (
                              <Text fontSize="sm">
                                Reemplazada por nota #{nota.canceladaPorId}
                              </Text>
                            )}
                            {nota.anuladaPor && (
                              <Text fontSize="sm">
                                Anulada por: {nota.anuladaPor.prefijo}{" "}
                                {nota.anuladaPor.nombre}
                              </Text>
                            )}
                          </Box>
                        )}
                      </HStack>
                      {nota.historiaClinica && (
                        <Text>Historia: {nota.historiaClinica}</Text>
                      )}
                      {nota.exploracionFisica && (
                        <Text>
                          Exploración física: {nota.exploracionFisica}
                        </Text>
                      )}
                      {nota.temperatura && (
                        <Text>Temperatura: {nota.temperatura} °C</Text>
                      )}
                      {nota.peso && <Text>Peso: {nota.peso} kg</Text>}
                      {nota.frecuenciaCardiaca && (
                        <Text>FC: {nota.frecuenciaCardiaca}</Text>
                      )}
                      {nota.frecuenciaRespiratoria && (
                        <Text>FR: {nota.frecuenciaRespiratoria}</Text>
                      )}
                      {nota.diagnosticoPresuntivo && (
                        <Text>
                          Diagnóstico presuntivo: {nota.diagnosticoPresuntivo}
                        </Text>
                      )}
                      {nota.pronostico && (
                        <Text>Pronóstico: {nota.pronostico}</Text>
                      )}
                      {nota.extras && <Text>Extras: {nota.extras}</Text>}
                      {nota.medicamentos.map((m) => (
                        <Box key={`med-${m.id}`} mt="2" pl="4">
                          <Text>
                            💊 {m.nombre} ({m.dosis}) · {m.via} ·{" "}
                            {m.frecuenciaHoras
                              ? `Cada ${m.frecuenciaHoras}h`
                              : ""}{" "}
                            {m.veces ? `· ${m.veces} veces` : ""} ·{" "}
                            {m.paraCasa ? "Para casa" : "Solo clínica"} ·{" "}
                            {m.tiempoIndefinido
                              ? "Indefinido"
                              : "Duración fija"}
                          </Text>
                          {m.observaciones && (
                            <Text>Obs: {m.observaciones}</Text>
                          )}
                        </Box>
                      ))}
                    </Table.Cell>
                  </Table.Row>
                ))}
              </Fragment>
            );
          })}
        </Table.Body>
      </Table.Root>
    </Box>
  );
}
