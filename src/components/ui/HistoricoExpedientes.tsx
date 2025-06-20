"use client";

import {
  Box,
  Table,
  Text,
  Avatar,
  HStack,
  SegmentGroup,
  Button,
  Badge,
} from "@chakra-ui/react";
import { toaster } from "@/components/ui/toaster";
import { useState, Fragment } from "react";
import { ExpedienteConNotas } from "@/types/expediente";
import PopOverReceta from "@/components/ui/PopOverReceta";
import SolicitudLaboratorialPDF from "../pdf/SolicitudLaboratorialPDF";
import MenuAccionesNota from "./MenuAccionesNota";
import { useCrearNotaClinica } from "@/hooks/useCrearNotaClinica";
import { EstadoNotaClinica } from "@prisma/client";
import { pdf } from "@react-pdf/renderer";
import ArchivoPreview from "./archivoPreview";
import QRCode from "qrcode";
import type { Mascota } from "@/types/mascota";
import { formatearFechaConDia } from "./notaClinica/utils";

type Props = {
  mascotaId: number;
  expedientes: ExpedienteConNotas[];
  expedienteSeleccionado: ExpedienteConNotas | null;
  setExpedienteSeleccionado: (exp: ExpedienteConNotas) => void;
  datosMascota: Mascota;
  perfilActualId: number; // ✅ Nuevo prop requerido
  tutor: {
    id: number;
    nombre: string;
    prefijo: string;
    clave: string;
    telefonoPrincipal: string;
  } | null;
};
function obtenerEstilosAplicacion(estado: string) {
  switch (estado) {
    case "PENDIENTE":
      return { bg: "tema.suave", border: "tema.base" };
    case "REALIZADA":
      return { bg: "green.800", border: "tema.verde" };
    case "OMITIDA":
    case "CANCELADA":
      return { bg: "red.800", border: "tema.rojo" };
    default:
      return { bg: "gray.800", border: "gray.300" }; // fallback opcional
  }
}
export default function HistoricoExpedientes({
  mascotaId,
  expedientes,
  expedienteSeleccionado,
  datosMascota,
  perfilActualId, // ✅ recibido aquí
  tutor,
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
                  <Table.Cell>
                    {formatearFechaConDia(new Date(exp.fechaCreacion))}
                  </Table.Cell>
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

                <Table.Row bg="tema.suave" color="white">
                  <Table.Cell colSpan={4}>
                    <Text fontWeight="bold" fontSize="sm">
                      📁 {exp.nombre || "Sin nombre asignado"}
                    </Text>
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
                    animation={
                      nota.estado === "FINALIZADA"
                        ? ""
                        : nota.estado === "ANULADA"
                        ? ""
                        : "pulseCloud"
                    }
                    color="tema.claro"
                  >
                    <Table.Cell
                      colSpan={4}
                      //borderRadius="xl"
                      borderColor="gray.200"
                      // bg="tema.intenso"
                      shadow="sm"
                    >
                      <HStack justify="space-between" mb="2">
                        <Badge
                          p="1"
                          fontSize="lg"
                          fontWeight="md"
                          bg="tema.suave"
                          color="tema.claro"
                        >
                          Nota #{nota.id} -{" "}
                          <Badge
                            fontSize="lg"
                            fontWeight="bold"
                            p="1"
                            bg="tema.llamativo"
                            color="tema.claro"
                          >
                            📅{" "}
                            {formatearFechaConDia(new Date(nota.fechaCreacion))}
                          </Badge>
                        </Badge>
                        <PopOverReceta
                          medicamentos={nota.medicamentos}
                          indicaciones={nota.indicaciones} // ✅ Añade esta línea
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
                                {formatearFechaConDia(
                                  new Date(nota.fechaCancelacion)
                                )}
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
                                          {formatearFechaConDia(
                                            new Date(a.fechaProgramada)
                                          )}
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
                      {nota.indicaciones && nota.indicaciones.length > 0 && (
                        <Box mt="2" pl="4">
                          <Text fontWeight="medium">📝 Indicaciones:</Text>
                          {nota.indicaciones.map((ind) => (
                            <Text key={`ind-${ind.id}`} fontSize="sm" ml="2">
                              • {ind.descripcion}
                            </Text>
                          ))}
                        </Box>
                      )}
                      {nota.solicitudesLaboratoriales?.length > 0 && (
                        <Box
                          mt="4"
                          pl="4"
                          // borderWidth="3px"
                          borderRadius="2xl"
                          borderColor="tema.morado"
                          //bg="tema.suave"
                        >
                          <Box textAlign="center">
                            <Badge
                              color="tema.claro"
                              fontWeight="medium"
                              mb="1"
                              bg="tema.morado"
                              p="2"
                              borderRadius={"xl"}
                            >
                              🔬 Solicitudes laboratoriales
                            </Badge>
                          </Box>

                          {nota.solicitudesLaboratoriales.map((sol) => (
                            <Box
                              key={`solicitud-${sol.id}`}
                              mt="3"
                              p="3"
                              borderWidth="3px"
                              borderRadius="2xl"
                              borderColor="tema.morado"
                              bg="tema.suave"
                            >
                              <Button
                                bg="tema.claro"
                                size="sm"
                                color="tema.suave"
                                mb="2"
                                borderRadius={"lg"}
                                onClick={async () => {
                                  const url = `${window.location.origin}/estudios/${sol.tokenAcceso}`;
                                  const qrDataUrl = await QRCode.toDataURL(
                                    url,
                                    { width: 200 }
                                  );

                                  const blob = await pdf(
                                    <SolicitudLaboratorialPDF
                                      mascota={{
                                        id: datosMascota.id,
                                        activo: datosMascota.activo,
                                        nombre: datosMascota.nombre ?? "",
                                        especie: datosMascota.especie ?? "",
                                        raza:
                                          typeof datosMascota.raza === "string"
                                            ? { nombre: datosMascota.raza }
                                            : datosMascota.raza ?? null,
                                        fechaNacimiento:
                                          datosMascota.fechaNacimiento ?? "",
                                        sexo: datosMascota.sexo ?? "",
                                        esterilizado:
                                          datosMascota.esterilizado ?? "",
                                      }}
                                      solicitud={{
                                        estudio: sol.estudio ?? "",
                                        proveedor: sol.proveedor ?? "",
                                        observacionesClinica:
                                          sol.observacionesClinica ?? "",
                                        fechaSolicitud:
                                          sol.fechaSolicitud ??
                                          new Date().toISOString(),
                                        tokenAcceso: sol.tokenAcceso ?? "",
                                      }}
                                      baseUrl={window.location.origin}
                                      qrDataUrl={qrDataUrl ?? ""}
                                    />
                                  ).toBlob();

                                  const blobUrl = URL.createObjectURL(blob);
                                  window.open(blobUrl, "_blank");
                                }}
                              >
                                📄 Ver PDF de solicitud
                              </Button>
                              <Text fontWeight="semibold" color="tema.claro">
                                🧪 Estudio: {sol.estudio || "Sin especificar"}
                              </Text>
                              <Text color="gray.200">
                                Proveedor: <strong>{sol.proveedor}</strong>
                              </Text>
                              <Text color="gray.200">
                                Fecha toma de muestra:{" "}
                                {formatearFechaConDia(
                                  new Date(sol.fechaTomaDeMuestra)
                                )}
                              </Text>
                              <Text color="gray.200">
                                Estado actual:{" "}
                                <strong>
                                  {
                                    {
                                      EN_REVISION: "🟡 En revisión",
                                      FIRMADA: "✅ Firmada",
                                      FINALIZADA: "📁 Finalizada",
                                      ANULADA: "🚫 Anulada",
                                    }[sol.estado]
                                  }
                                </strong>
                              </Text>
                              {sol.tokenAcceso && (
                                <Badge
                                  bg="tema.llamativo"
                                  borderRadius="xl"
                                  color="tema.claro"
                                  mt="2"
                                  px="2"
                                >
                                  <a
                                    href={`/estudios/${sol.tokenAcceso}`}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                  >
                                    Ver página de carga de archivos
                                  </a>
                                </Badge>
                              )}
                              {sol.observacionesClinica && (
                                <Text color="gray.300">
                                  📝 Observaciones clínicas:{" "}
                                  {sol.observacionesClinica}
                                </Text>
                              )}
                              {sol.observacionesLaboratorio && (
                                <Text color="gray.300">
                                  🧾 Observaciones del laboratorio:{" "}
                                  {sol.observacionesLaboratorio}
                                </Text>
                              )}

                              {sol.fechaSubida && (
                                <Text color="gray.200">
                                  📤 Archivos subidos el:{" "}
                                  {formatearFechaConDia(
                                    new Date(sol.fechaSubida)
                                  )}
                                </Text>
                              )}
                              {sol.fechaCierre && (
                                <Text color="gray.200">
                                  ✅ Cerrado el:{" "}
                                  {formatearFechaConDia(
                                    new Date(sol.fechaCierre)
                                  )}
                                </Text>
                              )}

                              {sol.archivos.map((a) => (
                                <Box key={`archivo-${a.id}`} ml="2" mb={6}>
                                  {/* Vista previa del archivo */}
                                  <Box
                                    // border="1px solid"
                                    borderColor="gray.200"
                                    p={2}
                                    rounded="md"
                                    mb={2}
                                  >
                                    <ArchivoPreview
                                      token={sol.tokenAcceso}
                                      archivoId={a.id}
                                    />
                                  </Box>

                                  {/* Información del archivo */}
                                  <Text fontSize="sm" mb={1}>
                                    <strong>📎 {a.nombre}</strong> ({a.tipo}) ·
                                    Subido el:{" "}
                                    {formatearFechaConDia(
                                      new Date(a.fechaSubida)
                                    )}
                                  </Text>

                                  {/* Enviar por WhatsApp */}
                                  {tutor && (
                                    <Box
                                      mt={2}
                                      display="flex"
                                      justifyContent="flex-end"
                                    >
                                      <Button
                                        size="sm"
                                        colorScheme="green"
                                        bg="tema.verde"
                                        color="tema.claro"
                                        onClick={async () => {
                                          console.log(
                                            "Tipo de archivo:",
                                            a.tipo
                                          );
                                          if (
                                            !a.tipo
                                              .toLowerCase()
                                              .includes("pdf")
                                          ) {
                                            toaster.create({
                                              description: (
                                                <Text
                                                  fontWeight="bold"
                                                  color="tema.claro"
                                                >
                                                  ⚠️ Sólo es posible enviar PDFs
                                                  por WhatsApp
                                                </Text>
                                              ),
                                              type: "warning",
                                            });
                                            return;
                                          }

                                          const numero = `${tutor.clave}${tutor.telefonoPrincipal}`;
                                          try {
                                            const res = await fetch(
                                              `/api/estudios/${sol.tokenAcceso}/archivo/${a.id}/url`
                                            );
                                            if (!res.ok) {
                                              const error = await res.json();
                                              throw new Error(
                                                error?.error ??
                                                  "No se pudo obtener la URL firmada"
                                              );
                                            }

                                            const { url } = await res.json();
                                            const segundosExpira = Number(
                                              process.env
                                                .NEXT_PUBLIC_AWS_SIGNED_URL_EXPIRES ??
                                                "3600"
                                            );
                                            const horasExpira = Math.floor(
                                              segundosExpira / 3600
                                            );

                                            const texto = `¡Hola!

Te enviamos los resultados de *_${datosMascota.nombre}_* del estudio *_${
                                              sol.estudio ?? "laboratorial"
                                            }_* con fecha de solicitud *_${
                                              sol.fechaTomaDeMuestra
                                                ? new Date(
                                                    sol.fechaTomaDeMuestra
                                                  ).toLocaleDateString("es-MX")
                                                : "desconocida"
                                            }_*.

*_Esta liga sólo estará disponible durante ${horasExpira} horas._*  
Te recomendamos descargar el archivo para conservarlo.

${url}

_Gracias por confiar en nosotros_. -Equipo ELDOC | Centro Veterinario`;
                                            const waUrl = `https://wa.me/${numero}?text=${encodeURIComponent(
                                              texto
                                            )}`;
                                            window.open(waUrl, "_blank");
                                          } catch (e) {
                                            console.error(
                                              "Error al generar link de WhatsApp:",
                                              e
                                            );
                                            toaster.create({
                                              description:
                                                "No se pudo generar el mensaje de WhatsApp",
                                              type: "error",
                                            });
                                          }
                                        }}
                                      >
                                        Enviar por WhatsApp
                                      </Button>
                                    </Box>
                                  )}
                                </Box>
                              ))}
                            </Box>
                          ))}
                        </Box>
                      )}
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
