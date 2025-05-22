"use client";

import { VStack, Text } from "@chakra-ui/react";
import { useForm, FormProvider } from "react-hook-form";
import AplicacionMedicamentoItem from "./AplicacionMedicamentoItem";
import type { Aplicacion } from "./aplicaciones";

type Props = {
  aplicaciones: Aplicacion[];
};

export default function ListaAplicacionesMedicamento({ aplicaciones }: Props) {
  const aplicacionesSeguras = aplicaciones ?? [];

  const aplicacionesOrdenadas = [...aplicacionesSeguras]
    .filter((a) => a && a.id)
    .sort((a, b) => {
      const fechaA = new Date(a.fechaReal ?? a.fechaProgramada).getTime();
      const fechaB = new Date(b.fechaReal ?? b.fechaProgramada).getTime();
      return fechaB - fechaA;
    });

  const methods = useForm({
    defaultValues: {
      aplicaciones: aplicacionesOrdenadas.map((app) => ({
        nombreMedicamentoManual:
          app.nombreMedicamentoManual ?? app.medicamento?.nombre ?? "",
        dosis: app.dosis ?? app.medicamento?.dosis ?? "",
        via: app.via ?? app.medicamento?.via ?? "",
        estado: app.estado,
        observaciones: app.observaciones ?? "",
      })),
    },
  });

  return (
    <FormProvider {...methods}>
      <form>
        <VStack gap="4" align="stretch">
          {aplicacionesOrdenadas.length === 0 ? (
            <Text fontSize="sm" color="tema.suave">
              No hay aplicaciones clínicas registradas.
            </Text>
          ) : (
            aplicacionesOrdenadas.map((app, index) => (
              <AplicacionMedicamentoItem
                key={app.id}
                index={index}
                aplicacionId={app.id}
                estado={app.estado}
                ejecutor={app.ejecutor}
                defaults={{
                  nombreMedicamentoManual:
                    app.nombreMedicamentoManual ?? app.medicamento?.nombre ?? "",
                  dosis: app.dosis ?? app.medicamento?.dosis ?? "",
                  via: app.via ?? app.medicamento?.via ?? "",
                }}
                fechaProgramada={app.fechaProgramada}
                fechaReal={app.fechaReal}
              />
            ))
          )}
        </VStack>
      </form>
    </FormProvider>
  );
}