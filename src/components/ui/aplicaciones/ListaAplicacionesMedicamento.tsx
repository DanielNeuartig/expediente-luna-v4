"use client";

import { VStack, Text, Tabs } from "@chakra-ui/react";
import { useForm, FormProvider } from "react-hook-form";
import AplicacionMedicamentoItem from "./AplicacionMedicamentoItem";
import type { Aplicacion } from "./aplicaciones";
import { LuClock, LuCircleCheck, LuArchive } from "react-icons/lu";
import { useEffect, useMemo } from "react";

type Props = {
  aplicaciones: Aplicacion[];
};

export default function ListaAplicacionesMedicamento({ aplicaciones }: Props) {
  const aplicacionesSeguras = aplicaciones ?? [];

  const aplicacionesOrdenadas = useMemo(
    () => [...aplicacionesSeguras].filter((a) => a && a.id),
    [aplicacionesSeguras]
  );

  const defaultAplicaciones = useMemo(
    () =>
      aplicacionesOrdenadas.map((app) => ({
        nombreMedicamentoManual: app.nombreMedicamentoManual ?? app.medicamento?.nombre ?? "",
        dosis: app.dosis ?? app.medicamento?.dosis ?? "",
        via: app.via ?? app.medicamento?.via ?? "",
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
    .filter((a) => a.estado === "PENDIENTE")
    .sort((a, b) => new Date(a.fechaProgramada).getTime() - new Date(b.fechaProgramada).getTime());

  const realizadas = aplicacionesOrdenadas
    .map((a, i) => ({ ...a, index: i }))
    .filter((a) => a.estado === "REALIZADA")
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
    .filter((a) => a.estado === "CANCELADA" || a.estado === "OMITIDA")
    .sort((a, b) => {
      const fechaA = a.fechaReal
        ? new Date(a.fechaReal).getTime()
        : new Date(a.fechaProgramada).getTime();
      const fechaB = b.fechaReal
        ? new Date(b.fechaReal).getTime()
        : new Date(b.fechaProgramada).getTime();
      return fechaB - fechaA;
    });
  return (
    <FormProvider {...methods}>
      <form>
        <Tabs.Root defaultValue="pendientes" variant="outline">
          <Tabs.List>
            <Tabs.Trigger
              value="pendientes"
              color="tema.suave"
              fontWeight={"bold"}
            >
              <LuClock style={{ marginRight: 6 }} />
              Pendientes ({pendientes.length})
            </Tabs.Trigger>
            <Tabs.Trigger
              value="realizadas"
              color="tema.suave"
              fontWeight={"bold"}
            >
              <LuCircleCheck style={{ marginRight: 6 }} />
              Realizadas ({realizadas.length})
            </Tabs.Trigger>
            <Tabs.Trigger
              value="archivadas"
              color="tema.suave"
              fontWeight={"bold"}
            >
              <LuArchive style={{ marginRight: 6 }} />
              Archivadas ({archivadas.length})
            </Tabs.Trigger>
          </Tabs.List>

          <Tabs.Content
            value="pendientes"
            _open={{
              animationName: "fade-in, scale-in",
              animationDuration: "300ms",
            }}
            _closed={{
              animationName: "fade-out, scale-out",
              animationDuration: "120ms",
            }}
          >
            <VStack gap="1" align="stretch">
              {pendientes.length === 0 ? (
                <Text fontSize="sm" color="tema.suave">
                  No hay aplicaciones pendientes.
                </Text>
              ) : (
                pendientes.map((app) => (
                  <AplicacionMedicamentoItem
                    key={app.id}
                    index={app.index}
                    aplicacionId={app.id}
                    estado={app.estado}
                    ejecutor={app.ejecutor}
                    defaults={{
                      nombreMedicamentoManual:
                        app.nombreMedicamentoManual ??
                        app.medicamento?.nombre ??
                        "",
                      dosis: app.dosis ?? app.medicamento?.dosis ?? "",
                      via: app.via ?? app.medicamento?.via ?? "",
                    }}
                    fechaProgramada={app.fechaProgramada}
                    fechaReal={app.fechaReal}
                  />
                ))
              )}
            </VStack>
          </Tabs.Content>

          <Tabs.Content
            value="realizadas"
            _open={{
              animationName: "fade-in, scale-in",
              animationDuration: "300ms",
            }}
            _closed={{
              animationName: "fade-out, scale-out",
              animationDuration: "120ms",
            }}
          >
            <VStack gap="4" align="stretch">
              {realizadas.length === 0 ? (
                <Text fontSize="sm" color="tema.suave">
                  No hay aplicaciones realizadas.
                </Text>
              ) : (
                realizadas.map((app) => (
                  <AplicacionMedicamentoItem
                    key={app.id}
                    index={app.index}
                    aplicacionId={app.id}
                    estado={app.estado}
                    ejecutor={app.ejecutor}
                    defaults={{
                      nombreMedicamentoManual:
                        app.nombreMedicamentoManual ??
                        app.medicamento?.nombre ??
                        "",
                      dosis: app.dosis ?? app.medicamento?.dosis ?? "",
                      via: app.via ?? app.medicamento?.via ?? "",
                    }}
                    fechaProgramada={app.fechaProgramada}
                    fechaReal={app.fechaReal}
                  />
                ))
              )}
            </VStack>
          </Tabs.Content>

          <Tabs.Content
            value="archivadas"
            _open={{
              animationName: "fade-in, scale-in",
              animationDuration: "300ms",
            }}
            _closed={{
              animationName: "fade-out, scale-out",
              animationDuration: "120ms",
            }}
          >
            <VStack gap="4" align="stretch">
              {archivadas.length === 0 ? (
                <Text fontSize="sm" color="tema.suave">
                  No hay aplicaciones archivadas.
                </Text>
              ) : (
                archivadas.map((app) => (
                  <AplicacionMedicamentoItem
                    key={app.id}
                    index={app.index}
                    aplicacionId={app.id}
                    estado={app.estado}
                    ejecutor={app.ejecutor}
                    defaults={{
                      nombreMedicamentoManual:
                        app.nombreMedicamentoManual ??
                        app.medicamento?.nombre ??
                        "",
                      dosis: app.dosis ?? app.medicamento?.dosis ?? "",
                      via: app.via ?? app.medicamento?.via ?? "",
                    }}
                    fechaProgramada={app.fechaProgramada}
                    fechaReal={app.fechaReal}
                  />
                ))
              )}
            </VStack>
          </Tabs.Content>
        </Tabs.Root>
      </form>
    </FormProvider>
  );
}
