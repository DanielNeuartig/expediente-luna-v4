"use client";

import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import HistoricoExpedientes from "@/components/ui/HistoricoExpedientes";
import { Box, Tabs, Spinner, Text } from "@chakra-ui/react";
import TarjetaBase from "@/components/ui/TarjetaBase";
import BoxMascota from "@/components/ui/BoxMascota";
import BotoneraExpediente from "@/components/ui/BotonesCrearExpediente";
import ListaExpedientesMascota from "@/components/ui/ListaExpedientesMascota";
import FormularioNotaClinica from "@/components/ui/notaClinica/FormularioNotaClinica";
import ListaAplicacionesMedicamento from "@/components/ui/aplicaciones/ListaAplicacionesMedicamento";
import { LuFileText, LuCircleCheck, LuHistory } from "react-icons/lu";

import type { Mascota } from "@/types/mascota";
import type { ExpedienteConNotas, Aplicacion } from "@/types/expediente";

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
  }>({
    queryKey: ["expedientes", mascota.id],
    queryFn: async () => {
      const res = await fetch(`/api/mascotas/${mascota.id}/expedientes`);
      if (!res.ok) throw new Error("Error al cargar expedientes");
      return res.json();
    },
  });

  const expedientes = data?.expedientes ?? [];

  const aplicacionesMedicamentos: Aplicacion[] = expedientes.flatMap((exp) =>
    exp.notasClinicas.flatMap((nota) =>
      nota.medicamentos.flatMap((med) =>
        med.aplicaciones.map((app) =>
          ({
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
          } satisfies Aplicacion)
        )
      )
    )
  );

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
          <HistoricoExpedientes
            expedientes={expedientes}
            expedienteSeleccionado={expedienteSeleccionado}
            setExpedienteSeleccionado={(exp) => {
              setExpedienteSeleccionado(exp);
              setMostrarFormularioNota(true);
            }}
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
                <LuCircleCheck style={{ marginRight: 6 }} /> Aplicaciones clínicas
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
              <ListaAplicacionesMedicamento aplicaciones={aplicacionesMedicamentos} />
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

            <Tabs.Content value="historico"></Tabs.Content>
          </Tabs.Root>
        </TarjetaBase>
      </Box>
    </>
  );
}
