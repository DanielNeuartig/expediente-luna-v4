"use client";
import { useQueryClient } from "@tanstack/react-query";
import { useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import HistoricoExpedientes from "@/components/ui/HistoricoExpedientes";
import { Box, Tabs, Spinner, Text } from "@chakra-ui/react";
import TarjetaBase from "@/components/ui/TarjetaBase";
import BoxMascota from "@/components/ui/BoxMascota";
import ListaAplicacionesMedicamento from "@/components/ui/aplicaciones/ListaAplicacionesMedicamento";
import FormularioNotaClinica from "@/components/ui/notaClinica/FormularioNotaClinica";
import { LuFileText, LuCircleCheck, LuHistory } from "react-icons/lu";
import ResumenExpedienteActivo from "@/components/ui/expediente/ResumenExpedienteActivo";
import type { Mascota } from "@/types/mascota";
import type { ExpedienteConNotas } from "@/types/expediente";
import BotonIniciarAtencion from "@/components/ui/expediente/BotonIniciarAtencion";
import { EstadoExpediente } from "@prisma/client";
import ProgresoExpediente from "@/components/ui/expediente/ProgresoExpediente";
import { useSession } from "next-auth/react";



export default function MascotaDetalleClient({
  mascota,
}: {
  mascota: Mascota;
}) {
  const { data, isLoading, isError } = useQuery<{
    expedientes: ExpedienteConNotas[];
  }>({
    queryKey: ["expedientes", mascota.id],
    queryFn: async () => {
      const res = await fetch(`/api/mascotas/${mascota.id}/expedientes`);
      if (!res.ok) throw new Error("Error al cargar expedientes");
      return res.json();
    },
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
          <Text color="red.500">Mascota no vinculada a un perfil válido.</Text>
        </TarjetaBase>
      </Box>
    );
  }

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
                  datosMascota={{
                    nombre: mascota.nombre,
                    especie: mascota.especie,
                    raza: mascota.raza?.nombre,
                    fechaNacimiento: mascota.fechaNacimiento,
                    sexo: mascota.sexo,
                    esterilizado: mascota.esterilizado,
                  }}
                />
              ) : (
                <Box py={4} color="tema.suave">
                  {expedienteSeleccionado
                    ? "Nota clínica cerrada."
                    : "Selecciona un expediente para registrar una nota clínica."}
                </Box>
              )}
            </Tabs.Content>

            <Tabs.Content value="historico"></Tabs.Content>
          </Tabs.Root>
        </TarjetaBase>
      </Box>
    </>
  );
}
