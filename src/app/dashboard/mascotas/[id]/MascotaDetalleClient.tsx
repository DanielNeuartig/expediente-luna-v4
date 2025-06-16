"use client";
import { useQueryClient } from "@tanstack/react-query";
import { useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import HistoricoExpedientes from "@/components/ui/HistoricoExpedientes";
import {
  Box,
  Tabs,
  Spinner,
  Text,
  Button,
  Badge,
  HStack,
  VStack,
} from "@chakra-ui/react";
import TarjetaBase from "@/components/ui/TarjetaBase";
import BoxMascota from "@/components/ui/BoxMascota";
import ListaAplicacionesMedicamento from "@/components/ui/aplicaciones/ListaAplicacionesMedicamento";
import FormularioNotaClinica from "@/components/ui/notaClinica/FormularioNotaClinica";
import {
  LuFileText,
  LuCircleCheck,
  LuMicroscope,
  LuDroplet,
} from "react-icons/lu";
import ResumenExpedienteActivo from "@/components/ui/expediente/ResumenExpedienteActivo";
import type { Mascota } from "@/types/mascota";
import type { ExpedienteConNotas } from "@/types/expediente";
import BotonIniciarAtencion from "@/components/ui/expediente/BotonIniciarAtencion";
import { EstadoExpediente } from "@prisma/client";
import ProgresoExpediente from "@/components/ui/expediente/ProgresoExpediente";
import { useSession } from "next-auth/react";
import { pdf } from "@react-pdf/renderer";
import LaboratorialResultadosPDF from "@/components/pdf/LaboratorialResultadoPDF";
import { LaboratorialConResultados } from "@/types/laboratorial";
import { formatearFechaConDia } from "@/components/ui/notaClinica/utils";
export default function MascotaDetalleClient({
  mascota,
}: {
  mascota: Mascota;
}) {
  const { data, isLoading, isError } = useQuery<{
    expedientes: ExpedienteConNotas[];
    perfil: {
      id: number;
      nombre: string;
      prefijo: string;
      clave: string;
      telefonoPrincipal: string;
    } | null;
  }>({
    queryKey: ["expedientes", mascota.id],
    queryFn: async () => {
      const res = await fetch(`/api/mascotas/${mascota.id}/expedientes`);
      if (!res.ok) throw new Error("Error al cargar expedientes");
      return res.json();
    },
    refetchInterval: 10000,
  });

  const expedientes = useMemo(() => data?.expedientes ?? [], [data]);

  const expedienteSeleccionado = useMemo(() => {
    const activo = expedientes.find(
      (e) => e.estado === EstadoExpediente.ACTIVO
    );
    if (activo) return activo;

    const ultimoFinalizado = expedientes
      .filter((e) => e.estado !== EstadoExpediente.ACTIVO)
      .sort(
        (a, b) =>
          new Date(b.fechaCreacion).getTime() -
          new Date(a.fechaCreacion).getTime()
      )[0];

    return ultimoFinalizado ?? null;
  }, [expedientes]);

  const mostrarFormularioNota =
    expedienteSeleccionado?.estado === EstadoExpediente.ACTIVO;

  const aplicacionesMedicamentos = expedientes.flatMap((exp) =>
    exp.notasClinicas.flatMap((nota) =>
      nota.medicamentos.flatMap((med) =>
        med.aplicaciones.map((app) => ({
          id: app.id,
          fechaProgramada: app.fechaProgramada,
          fechaReal: app.fechaReal ?? null,
          estado: app.estado,
          observaciones: app.observaciones ?? null,
          ejecutor: app.ejecutor
            ? {
                id: app.ejecutor.id,
                nombre: app.ejecutor.nombre,
                prefijo: app.ejecutor.prefijo,
                usuario: {
                  image: app.ejecutor.usuario?.image ?? "",
                },
              }
            : null,
          nombreMedicamentoManual: app.nombreMedicamentoManual ?? null,
          dosis: app.dosis ?? null,
          via: app.via ?? null,
          medicamento: {
            nombre: med.nombre,
            dosis: med.dosis,
            via: med.via,
          },
        }))
      )
    )
  );

  const { data: session } = useSession();
  const queryClient = useQueryClient();
  const perfilActualId = session?.user?.perfilid ?? null;

  const finalizarExpediente = async () => {
    if (!expedienteSeleccionado) return;
    try {
      const res = await fetch(
        `/api/expedientes/${expedienteSeleccionado.id}/finalizar`,
        { method: "PATCH" }
      );

      const json = await res.json();

      if (!res.ok) {
        throw new Error(json?.error || "Error al finalizar expediente");
      }

      await queryClient.invalidateQueries({
        queryKey: ["expedientes", mascota.id],
      });
    } catch (error) {
      console.error("Error al finalizar expediente:", error);
      alert((error as Error).message);
    }
  };

  const resumenExpediente = useMemo(() => {
    if (expedienteSeleccionado?.estado === EstadoExpediente.ACTIVO) {
      return {
        fechaInicio: expedienteSeleccionado.fechaCreacion,
        totalNotas: expedienteSeleccionado.notasClinicas.length,
        ultimaActividad: expedienteSeleccionado.ultimaActividad,
      };
    }
    return null;
  }, [expedienteSeleccionado]);

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

  if (!perfilActualId) {
    return (
      <Box gridColumn="1 / span 2" gridRow="1">
        <TarjetaBase>
          <Text color="red.500">
            Este usuario no tiene un perfil creado. Si crees que es un error,
            refresca la pantalla o espera unos minutos.
          </Text>
        </TarjetaBase>
      </Box>
    );
  }

  const labs = expedienteSeleccionado?.notasClinicas?.flatMap((nota) =>
    Array.isArray(nota.laboratoriales) ? nota.laboratoriales : []
  );

  // 🧪 Log para depurar
  console.log("📊 Estudios laboratoriales encontrados:", labs);
  labs?.forEach((lab, i) => {
    console.log(`🔍 Lab ${i}:`, lab);
    if (!lab) console.warn(`❌ Lab ${i} está vacío o null`);
    if (!lab.tipoEstudio) console.warn(`⚠️ Lab ${i} no tiene tipoEstudio`);
    if (!lab.resultados?.length)
      console.warn(`⚠️ Lab ${i} no tiene resultados`);
  });

  const laboratorialesTotales: LaboratorialConResultados[] =
    expedientes?.flatMap((exp) =>
      exp.notasClinicas.flatMap((nota) =>
        Array.isArray(nota.laboratoriales) ? nota.laboratoriales : []
      )
    ) ?? [];

  return (
    <>
      <Box gridColumn="1" gridRow="1" display="flex" justifyContent="center">
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
          {expedienteSeleccionado?.estado !== EstadoExpediente.ACTIVO && (
            <BotonIniciarAtencion
              mascotaId={mascota.id}
              onExpedienteCreado={() =>
                queryClient.invalidateQueries({
                  queryKey: ["expedientes", mascota.id],
                })
              }
            />
          )}
          {resumenExpediente && (
            <>
              <ResumenExpedienteActivo
                fechaInicio={expedienteSeleccionado?.fechaCreacion ?? ""}
                ultimaActividad={expedienteSeleccionado?.ultimaActividad ?? ""}
                notas={expedienteSeleccionado?.notasClinicas ?? []}
                nombre={expedienteSeleccionado?.nombre ?? "Sin título"}
                puedeFinalizar={
                  expedienteSeleccionado?.estado === EstadoExpediente.ACTIVO
                }
                onFinalizarExpediente={finalizarExpediente}
              />
              <ProgresoExpediente
                notas={expedienteSeleccionado?.notasClinicas ?? []}
                expedienteId={expedienteSeleccionado?.id ?? 0}
                nombre={
                  expedienteSeleccionado?.nombre ?? "¡Nombra tu expediente!"
                }
              />
            </>
          )}
          <HistoricoExpedientes
            mascotaId={mascota.id}
            expedientes={expedientes}
            expedienteSeleccionado={expedienteSeleccionado}
            setExpedienteSeleccionado={() => {}}
            perfilActualId={perfilActualId}
            datosMascota={mascota}
            tutor={data?.perfil ?? null}
          />
        </TarjetaBase>
      </Box>

      <Box gridColumn="2" gridRow="1">
        <TarjetaBase>
          <Tabs.Root defaultValue="aplicaciones" variant="enclosed">
            <Tabs.List bg="tema.intenso">
              <Tabs.Trigger
                color="tema.claro"
                fontSize={"md"}
                fontWeight="bold"
                value="aplicaciones"
              >
                <LuCircleCheck style={{ marginRight: 6 }} /> Aplicaciones
                clínicas
              </Tabs.Trigger>
              <Tabs.Trigger
                value="nota"
                fontWeight="bold"
                color="tema.llamativo"
                fontSize={"md"}
                disabled={!expedienteSeleccionado}
              >
                <LuFileText style={{ marginRight: 6 }} /> Nueva nota clínica
              </Tabs.Trigger>
              <Tabs.Trigger
                color="tema.claro"
                fontSize={"md"}
                value="historico"
                fontWeight="bold"
              >
                <LuMicroscope color="tema.claro" /> Laboratoriales
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
                  datosMascota={mascota} // ✅ Nombre correcto de la prop
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
              {laboratorialesTotales?.length === 0 ? (
                <Box py={1} color="tema.suave">
                  No hay estudios laboratoriales registrados.
                </Box>
              ) : (
                <Box display="flex" flexDirection="column" gap={1} py={1}>
                  {laboratorialesTotales.map(
                    (lab: LaboratorialConResultados) => (
                      <Box key={lab.id}>
                        <Button
                          borderRadius="xl"
                          bg="tema.intenso"
                          color="tema.claro"
                          fontWeight="bold"
                          px={1}
                          py={2}
                          textAlign="left"
                          width="100%"
                          whiteSpace="normal"
                          height="auto" // ⬅️ permite crecer verticalmente
                          alignItems="start" // ⬅️ alinea texto arriba
                          display="flex" // ⬅️ asegúrate de que no colapse contenido
                          _hover={{
                            bg: "tema.llamativo",
                            //color: "tema.suave",
                            //boxShadow: "md",
                            transition: "background 0.2s, color 0.2s",
                          }}
                          onClick={async () => {
                            const blob = await pdf(
                              <LaboratorialResultadosPDF
                                laboratorial={{
                                  id: lab.id,
                                  fechaToma: lab.fechaToma,
                                  fechaCreacion: lab.fechaCreacion,
                                  tipoEstudio: lab.tipoEstudio,
                                  resultados: lab.resultados,
                                }}
                                mascota={mascota}
                              />
                            ).toBlob();

                            const url = URL.createObjectURL(blob);
                            window.open(url, "_blank");
                          }}
                        >
                          <Box w="100%" textAlign="left">
                            <VStack align="start" gap={1}>
                              <HStack gap={2} wrap="wrap">
                                <Badge
                                  p="1"
                                  px="2"
                                  borderRadius="lg"
                                  bg={"tema.suave"}
                                  color="tema.claro"
                                  fontSize="sm"
                                >
                                  #{lab.id}
                                </Badge>

                                <Badge
                                  p="1"
                                  px="2"
                                  borderRadius="lg"
                                  bg={
                                    lab.tipoEstudio?.nombre ===
                                    "Biometria Hematica"
                                      ? "tema.rojo"
                                      : "tema.intenso"
                                  }
                                  color="tema.claro"
                                  fontSize="lg"
                                >
                                  <LuDroplet />
                                  {lab.tipoEstudio?.nombre ?? "Sin nombre"}
                                </Badge>

                                {lab.solicitudLaboratorial?.estado && (
                                  <Badge
                                    borderRadius="lg"
                                    px={2}
                                    py={1}
                                    fontSize="xs"
                                    variant="subtle"
                                    bg="whiteAlpha.300"
                                  >
                                    {lab.solicitudLaboratorial.estado}
                                  </Badge>
                                )}
                              </HStack>

                              <Text fontWeight="light" fontSize="sm">
                                📄 Reporte generado:{" "}
                                {lab.fechaCreacion
                                  ? formatearFechaConDia(
                                      new Date(lab.fechaCreacion)
                                    )
                                  : "Sin fecha"}
                              </Text>

                              {lab.solicitudLaboratorial && (
                                <>
                                  <Text fontWeight="light" fontSize="sm">
                                    📆 Solicitado:{" "}
                                    {formatearFechaConDia(
                                      lab.solicitudLaboratorial.fechaSolicitud
                                        ? new Date(
                                            lab.solicitudLaboratorial.fechaSolicitud
                                          )
                                        : new Date()
                                    )}
                                  </Text>
                                  {lab.analisis && (
                                    <Badge
                                      color="tema.claro"
                                      bg="tema.llamativo"
                                      animation="floatGlow"
                                      fontWeight="light"
                                      fontSize="md"
                                    >
                                      {/*Análisis IA: {lab.analisis}*/}
                                    </Badge>
                                  )}

                                  {/*lab.solicitudLaboratorial.proveedor && (
                                    <Text fontSize="sm">
                                      🏥 Proveedor:{" "}
                                      {lab.solicitudLaboratorial.proveedor}
                                    </Text>
                                  )*/}
                                </>
                              )}
                            </VStack>
                          </Box>
                        </Button>
                      </Box>
                    )
                  )}
                </Box>
              )}
            </Tabs.Content>
          </Tabs.Root>
        </TarjetaBase>
      </Box>
    </>
  );
}
