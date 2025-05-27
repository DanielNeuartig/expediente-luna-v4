"use client";

import { VStack, Text, Tabs, Badge, HStack, Box } from "@chakra-ui/react";
import { useForm, FormProvider } from "react-hook-form";
import AplicacionMedicamentoItem from "./AplicacionMedicamentoItem";
import { useEffect, useMemo } from "react";
import { LuClock, LuCircleCheck, LuArchive } from "react-icons/lu";

import type { Aplicacion } from "@/types/expediente";
import { EstadoAplicacion } from "@prisma/client";

type Props = {
  aplicaciones: Aplicacion[];
};

export default function ListaAplicacionesMedicamento({ aplicaciones }: Props) {
  const aplicacionesOrdenadas = useMemo(
    () => [...(aplicaciones ?? [])].filter((a) => a && a.id),
    [aplicaciones]
  );

  const defaultAplicaciones = useMemo(
    () =>
      aplicacionesOrdenadas.map((app) => ({
        medicamento: {
          nombre: app.medicamento?.nombre ?? "",
          dosis: app.medicamento?.dosis ?? "",
          via: app.medicamento?.via ?? "",
        },
        estado: app.estado,
        observaciones: app.observaciones ?? "",
      })),
    [aplicacionesOrdenadas]
  );

  const methods = useForm({
    defaultValues: {
      aplicaciones: defaultAplicaciones,
    },
  });

  const { reset } = methods;

  useEffect(() => {
    reset({ aplicaciones: defaultAplicaciones });
  }, [defaultAplicaciones, reset]);

  const pendientes = aplicacionesOrdenadas
    .map((a, i) => ({ ...a, index: i }))
    .filter((a) => a.estado === EstadoAplicacion.PENDIENTE)
    .sort(
      (a, b) =>
        new Date(a.fechaProgramada).getTime() -
        new Date(b.fechaProgramada).getTime()
    );

  const realizadas = aplicacionesOrdenadas
    .map((a, i) => ({ ...a, index: i }))
    .filter((a) => a.estado === EstadoAplicacion.REALIZADA)
    .sort((a, b) => {
      const fechaA = a.fechaReal
        ? new Date(a.fechaReal).getTime()
        : new Date(a.fechaProgramada).getTime();
      const fechaB = b.fechaReal
        ? new Date(b.fechaReal).getTime()
        : new Date(b.fechaProgramada).getTime();
      return fechaB - fechaA;
    });

  const archivadas = aplicacionesOrdenadas
    .map((a, i) => ({ ...a, index: i }))
    .filter(
      (a) =>
        a.estado === EstadoAplicacion.CANCELADA ||
        a.estado === EstadoAplicacion.OMITIDA
    )
    .sort((a, b) => {
      const fechaA = a.fechaReal
        ? new Date(a.fechaReal).getTime()
        : new Date(a.fechaProgramada).getTime();
      const fechaB = b.fechaReal
        ? new Date(b.fechaReal).getTime()
        : new Date(b.fechaProgramada).getTime();
      return fechaB - fechaA;
    });

  const renderAplicaciones = (lista: typeof pendientes) => (
    <VStack gap="4" align="stretch">
      {lista.length === 0 ? (
        <Text fontSize="sm" color="tema.suave">
          No hay aplicaciones en esta categoría.
        </Text>
      ) : (
        lista.map((app) => (
          <AplicacionMedicamentoItem
            key={app.id}
            index={app.index}
            aplicacionId={app.id}
            estado={app.estado}
            ejecutor={app.ejecutor}
            defaults={{
              medicamento: {
                nombre: app.medicamento?.nombre ?? "",
                dosis: app.medicamento?.dosis ?? "",
                via: app.medicamento?.via ?? "",
              },
            }}
            fechaProgramada={app.fechaProgramada}
            fechaReal={app.fechaReal}
            // ✅ Agrega estas 3 líneas que faltan:
            nombreMedicamentoManual={app.nombreMedicamentoManual}
            dosis={app.dosis}
            via={app.via}
          />
        ))
      )}
    </VStack>
  );

  return (
    <>
      <Box mb="2" textAlign="center">
        <HStack wrap="wrap" gap={1}>
          <Badge
            variant="solid"
            bg="tema.morado"
            color="tema.claro"
            px="3"
            py="1"
            borderRadius="md"
          >
            ATRASADO POR 1 DÍA O MÁS
          </Badge>
          <Badge
            variant="solid"
            bg="tema.rojo"
            color="tema.claro"
            px="3"
            py="1"
            borderRadius="md"
          >
            FALTAN 60 MINUTOS Ó ATRASADO
          </Badge>
          <Badge
            variant="solid"
            bg="tema.verde"
            color="tema.claro"
            px="3"
            py="1"
            borderRadius="md"
          >
            FALTAN 8 HORAS O MENOS
          </Badge>
          <Badge
            variant="solid"
            bg="tema.naranja"
            color="tema.claro"
            px="3"
            py="1"
            borderRadius="md"
          >
            FALTAN 24 HORAS O MENOS
          </Badge>
          <Badge
            variant="solid"
            bg="tema.suave"
            color="tema.claro"
            px="3"
            py="1"
            borderRadius="md"
          >
            FALTA 1 DÍA O MÁS
          </Badge>
        </HStack>
      </Box>
      <Box width="90%" >
        <FormProvider {...methods}>
          <form>
            <Tabs.Root defaultValue="pendientes" variant="outline">
              <Tabs.List>
                <Tabs.Trigger
                  value="pendientes"
                  color="tema.suave"
                  fontWeight="bold"
                >
                  <LuClock style={{ marginRight: 6 }} />
                  Pendientes ({pendientes.length})
                </Tabs.Trigger>
                <Tabs.Trigger
                  value="realizadas"
                  color="tema.suave"
                  fontWeight="bold"
                >
                  <LuCircleCheck style={{ marginRight: 6 }} />
                  Realizadas ({realizadas.length})
                </Tabs.Trigger>
                <Tabs.Trigger
                  value="archivadas"
                  color="tema.suave"
                  fontWeight="bold"
                >
                  <LuArchive style={{ marginRight: 6 }} />
                  Archivadas ({archivadas.length})
                </Tabs.Trigger>
              </Tabs.List>

              <Tabs.Content value="pendientes">
                {renderAplicaciones(pendientes)}
              </Tabs.Content>

              <Tabs.Content value="realizadas">
                {renderAplicaciones(realizadas)}
              </Tabs.Content>

              <Tabs.Content value="archivadas">
                {renderAplicaciones(archivadas)}
              </Tabs.Content>
            </Tabs.Root>
          </form>
        </FormProvider>
      </Box>
    </>
  );
}
