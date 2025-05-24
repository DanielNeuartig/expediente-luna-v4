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
import { useCrearNotaClinica } from "@/hooks/useCrearNotaClinica";
import { EstadoNotaClinica } from "@prisma/client";

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
  mascotaId: number;
  expedientes: ExpedienteConNotas[];
  expedienteSeleccionado: ExpedienteConNotas | null;
  setExpedienteSeleccionado: (exp: ExpedienteConNotas) => void;
  setMostrarFormularioNota: (mostrar: boolean) => void;
  datosMascota: {
    nombre: string;
    especie: string;
    raza?: string;
    fechaNacimiento?: string;
    sexo: string;
    esterilizado: string;
  };
  perfilActualId: number; // ✅ Nuevo prop requerido
};
function obtenerEstilosAplicacion(estado: string) {
  switch (estado) {
    case "PENDIENTE":
      return { bg: "tema.suave", border: "tema.base" };
    case "REALIZADA":
      return { bg: "green.700", border: "tema.verde" };
    case "OMITIDA":
    case "CANCELADA":
      return { bg: "red.700", border: "tema.rojo" };
    default:
      return { bg: "gray.600", border: "gray.300" }; // fallback opcional
  }
}
export default function HistoricoExpedientes({
  mascotaId,
  expedientes,
  expedienteSeleccionado,
  setExpedienteSeleccionado,
  setMostrarFormularioNota,
  datosMascota,
  perfilActualId, // ✅ recibido aquí
}: Props) {
  const crearNotaClinica = useCrearNotaClinica();
  const [filtro, setFiltro] = useState<"todas" | "activas" | "anuladas">(
    "activas"
  );

  return (
    <Box>
      <Text color="tema.intenso" fontWeight="bold" mb="2">
        Historial médico completo
      </Text>

      <SegmentGroup.Root
        defaultValue="activas"
        onValueChange={({ value }) =>
          setFiltro(value as "todas" | "activas" | "anuladas")
        }
      >
        <SegmentGroup.Items
          items={[
            { value: "activas", label: "Activas" }, // ✅ EN_REVISION + FINALIZADA
            { value: "anuladas", label: "Anuladas" }, // ❌ Solo ANULADA
            { value: "todas", label: "Todas" }, // 🟡 Todas sin filtro
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
              if (filtro === "activas")
                return (
                  nota.estado === EstadoNotaClinica.EN_REVISION ||
                  nota.estado === EstadoNotaClinica.FINALIZADA
                );
              if (filtro === "anuladas")
                return nota.estado === EstadoNotaClinica.ANULADA;
              return true; // todas
            });

            return (
              <Fragment key={`expediente-${exp.id}`}>
                <Table.Row
                  bg={
                    expedienteSeleccionado?.id === exp.id
                      ? "tema.llamativo" // color para seleccionado
                      : "tema.llamativo" // color por defecto
                  }
                  color="tema.claro"
                >
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

                {/*<Table.Row bg="tema.llamativo">
                  <Table.Cell colSpan={4}>
                    <Button
                      {...estilosBotonEspecial}
                      size="xs"
                      colorScheme="blue"
                      mt="2"
                      onClick={() => {
                        setExpedienteSeleccionado(exp);
                        setMostrarFormularioNota(true);
                      }}
                    >
                      Añadir nueva nota clínica
                    </Button>
                  </Table.Cell>
                </Table.Row>*/}

                {notasFiltradas.map((nota) => (
                  <Table.Row
                    key={`nota-${nota.id}`}
                    bg={
                      nota.estado === "FINALIZADA"
                        ? "tema.intenso"
                        : nota.estado === "ANULADA"
                        ? "tema.rojo"
                        : "gray.400"
                    }
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
                          estadoNota={nota.estado}
                        />
                        <MenuAccionesNota
                          nota={nota}
                          perfilActualId={perfilActualId}
                          onAnular={() =>
                            crearNotaClinica.mutate({
                              mascotaId,
                              expedienteId: exp.id,
                              anularNotaId: nota.id,
                            })
                          }
                          onFirmar={() =>
                            crearNotaClinica.mutate({
                              mascotaId,
                              expedienteId: exp.id,
                              firmarNotaId: nota.id,
                            })
                          }
                        />
                      </HStack>

                      <HStack align="center" mb="2">
                        <Avatar.Root size="2xs">
                          <Avatar.Image src={nota.autor.usuario?.image ?? ""} />
                          <Avatar.Fallback />
                        </Avatar.Root>
                        <Text ml="2">{nota.autor.nombre}</Text>
                        {nota.estado === "ANULADA" && (
                          <Box
                            mt="1"
                            mb="2"
                            px="2"
                            py="1"
                            bg="red.900"
                            color="red.200"
                            borderRadius="md"
                          >
                            <Text fontWeight="bold">🛑 Nota anulada</Text>
                            {nota.fechaCancelacion && (
                              <Text fontSize="sm">
                                Cancelada el{" "}
                                {formatearFecha(nota.fechaCancelacion)}
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
                          <Text fontWeight="medium">
                            💊{m.paraCasa ? "🏠" : "🏥"} ·{m.nombre} ({m.dosis})
                            · {m.via} ·{" "}
                            {m.frecuenciaHoras
                              ? `Cada ${m.frecuenciaHoras}h`
                              : ""}{" "}
                            {m.veces ? `· ${m.veces} veces` : ""} ·{" "}
                            {m.tiempoIndefinido
                              ? "Indefinido"
                              : "Duración fija"}
                          </Text>

                          {m.observaciones && (
                            <Text fontSize="sm" fontStyle="italic" ml="2">
                              Obs: {m.observaciones}
                            </Text>
                          )}

                          {m.aplicaciones && m.aplicaciones.length > 0 && (
                            <Box mt="2" pl="4">
                              {m.aplicaciones.map((a, idx) => {
                                const aplicadaNombre =
                                  a.nombreMedicamentoManual || "-";
                                const aplicadaDosis = a.dosis || "-";
                                const aplicadaVia = a.via || "-";

                                const coincideNombre =
                                  aplicadaNombre === m.nombre;
                                const coincideDosis = aplicadaDosis === m.dosis;
                                const coincideVia = aplicadaVia === m.via;

                                const diferencias = [
                                  !coincideNombre && "Nombre",
                                  !coincideDosis && "Dosis",
                                  !coincideVia && "Vía",
                                ].filter(Boolean);

                                const mostrarDiferencia =
                                  diferencias.length > 0
                                    ? `⚠️ Diferencia en: ${diferencias.join(
                                        ", "
                                      )}`
                                    : "✅ Coincide con lo recetado";

                                const fechaReal = a.fechaReal
                                  ? new Date(a.fechaReal)
                                  : null;
                                const fechaProgramada = new Date(
                                  a.fechaProgramada
                                );
                                const msDiff = fechaReal
                                  ? fechaReal.getTime() -
                                    fechaProgramada.getTime()
                                  : 0;
                                const minutos = Math.abs(msDiff) / 60000;
                                const horas = Math.floor(minutos / 60);
                                const mins = Math.floor(minutos % 60);
                                const tiempo = `${horas}h ${mins}min`;
                                const diferenciaTiempo =
                                  fechaReal &&
                                  (msDiff > 0
                                    ? `⏱ Retraso de ${tiempo}`
                                    : `⏱ Adelanto de ${tiempo}`);
                                const estilos = obtenerEstilosAplicacion(
                                  a.estado
                                );
                                return (
                                  <Box
                                    key={a.id}
                                    mt="2"
                                    pl="2"
                                    borderLeft="2px solid gray"
                                    ml="2"
                                  >
                                    <Box
                                      bg={estilos.bg}
                                      border="1px solid"
                                      borderColor={estilos.border}
                                      borderRadius="md"
                                      p="3"
                                      mb="4"
                                      mt="1"
                                    >
                                      <HStack>
                                        <Text
                                          fontSize="sm"
                                          fontWeight="semibold"
                                        >
                                          • Aplicación #{idx + 1} — 📅{" "}
                                          {formatearFecha(a.fechaProgramada)}
                                        </Text>
                                        {a.estado === "PENDIENTE" && (
                                          <Text
                                            fontSize="sm"
                                            color="tema.claro"
                                            fontStyle="italic"
                                            fontWeight={"bold"}
                                          >
                                            {(() => {
                                              const ahora = new Date();
                                              const fechaProgramada = new Date(
                                                a.fechaProgramada
                                              );
                                              const msDiff =
                                                fechaProgramada.getTime() -
                                                ahora.getTime();
                                              const minutos =
                                                Math.abs(msDiff) / 60000;
                                              const horas = Math.floor(
                                                minutos / 60
                                              );
                                              const mins = Math.floor(
                                                minutos % 60
                                              );
                                              const tiempo = `${horas}h ${mins}min`;

                                              if (msDiff > 0) {
                                                return `⏳ Faltan ${tiempo}`;
                                              } else {
                                                return `⚠️ Retraso de ${tiempo}`;
                                              }
                                            })()}
                                          </Text>
                                        )}

                                        {a.estado === "REALIZADA" &&
                                          fechaReal && (
                                            <Text fontSize="sm">
                                              {diferenciaTiempo}
                                            </Text>
                                          )}
                                      </HStack>
                                      <Text fontSize="sm">
                                        💊 Recetado: {m.nombre} · {m.dosis} ·{" "}
                                        {m.via}
                                      </Text>
                                      {a.estado === "REALIZADA" && (
                                        <Text fontSize="sm">
                                          💉 Aplicado: {aplicadaNombre} ·{" "}
                                          {aplicadaDosis} · {aplicadaVia}
                                        </Text>
                                      )}

                                      {a.estado === "REALIZADA" && (
                                        <Text fontSize="sm">
                                          {mostrarDiferencia}
                                        </Text>
                                      )}

                                      {a.ejecutor && (
                                        <Text fontSize="sm">
                                          👤 Firmado por: {a.ejecutor.prefijo}{" "}
                                          {a.ejecutor.nombre}
                                        </Text>
                                      )}

                                      {a.observaciones && (
                                        <Text
                                          fontSize="sm"
                                          fontStyle="italic"
                                          color="gray.200"
                                        >
                                          📝 {a.observaciones}
                                        </Text>
                                      )}
                                    </Box>
                                  </Box>
                                );
                              })}
                            </Box>
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
