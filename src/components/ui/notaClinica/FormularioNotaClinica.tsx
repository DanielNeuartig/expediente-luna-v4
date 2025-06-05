"use client";

import {
  Box,
  Button,
  Fieldset,
  Stack,
  Drawer,
  Portal,
  CloseButton,
} from "@chakra-ui/react";
import { FormProvider, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  notaClinicaSchema,
  NotaClinicaInput,
  NotaClinicaValues,
} from "@/lib/validadores/notaClinicaSchema";
import { estilosBotonEspecial } from "../config/estilosBotonEspecial";
import { formatoDatetimeLocal } from "./utils";
import CamposClinicos from "./CamposClinicos";
import ListaMedicamentos from "./ListaMedicamentos";
import ListaIndicaciones from "./ListaIndicaciones";
import { useCrearNotaClinica } from "@/hooks/useCrearNotaClinica";
import { useQueryClient } from "@tanstack/react-query";
import RecetaPDF from "@/components/pdf/RecetaPDF";
import { PDFViewer } from "@react-pdf/renderer";
import { useState } from "react";
import ListaSolicitudesLaboratoriales from "./ListaSolicitudesLaboratoriales";

interface Expediente {
  id: number;
  tipo: string;
  fechaCreacion: string;
}

interface Props {
  expedienteSeleccionado: Expediente | null;
  mascotaId: number;
  onClose?: () => void;
  datosMascota: {
    nombre: string;
    especie: string;
    raza?: string;
    fechaNacimiento?: string;
    sexo: string;
    esterilizado: string;
  };
}

// 🔹 Utilidad para asegurar booleans consistentes
function aBoolean(valor: unknown): boolean {
  return valor === true || valor === "true";
}

export default function FormularioNotaClinica({
  expedienteSeleccionado,
  mascotaId,
  onClose,
  datosMascota, // ✅ AÑADE ESTO AQUÍ
}: Props) {
  const methods = useForm<NotaClinicaInput>({
    resolver: zodResolver(notaClinicaSchema),
    defaultValues: {
      medicamentos: [],
      indicaciones: [],
      solicitudesLaboratoriales: [], // ✅ Añadir esto
    },
    mode: "onChange",
  });

  const { handleSubmit, reset } = methods;
  const crearNota = useCrearNotaClinica();
  const queryClient = useQueryClient();
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [valoresFinales, setValoresFinales] =
    useState<NotaClinicaValues | null>(null);

  if (!expedienteSeleccionado) {
    return (
      <Box color="gray.400" fontSize="md">
        Selecciona un expediente para añadir una nota clínica.
      </Box>
    );
  }

  const onSubmit = (data: NotaClinicaInput) => {
    const valoresParseados = notaClinicaSchema.parse(data);
    setValoresFinales(valoresParseados);
    setDrawerOpen(true);
  };

  const confirmarEnvio = () => {
    if (!valoresFinales) return;
    crearNota.mutate(
      {
        ...valoresFinales,
        expedienteId: expedienteSeleccionado.id,
        mascotaId,
      },
      {
        onSuccess: () => {
          queryClient.invalidateQueries({
            queryKey: ["expedientes", mascotaId],
          });
          reset();
          setDrawerOpen(false);
          onClose?.();
        },
      }
    );
  };

  return (
    <FormProvider {...methods}>
      <form onSubmit={handleSubmit(onSubmit)}>
        <Fieldset.Root size="lg" width="full">
          <Stack>
            <Fieldset.HelperText>
              Registrando en expediente #{expedienteSeleccionado.id} ·{" "}
              {expedienteSeleccionado.tipo}
            </Fieldset.HelperText>
          </Stack>
          <Fieldset.Content>
            <CamposClinicos />
            <ListaMedicamentos fechaBase={formatoDatetimeLocal(new Date())} />
            <ListaIndicaciones />
            <ListaSolicitudesLaboratoriales/>
          </Fieldset.Content>
          <Button
            {...estilosBotonEspecial}
            type="submit"
            disabled={crearNota.isPending}
            loading={crearNota.isPending}
            fontSize={"lg"}
          >
            Guardar nota clínica
          </Button>
        </Fieldset.Root>
      </form>

      <Drawer.Root open={drawerOpen} onOpenChange={() => setDrawerOpen(false)}>
        <Portal>
          <Drawer.Backdrop />
          <Drawer.Positioner>
            <Drawer.Content maxW="5xl">
              <Drawer.Header>
                <Drawer.Title>Vista previa de la receta</Drawer.Title>
                <Drawer.CloseTrigger asChild>
                  <CloseButton size="sm" />
                </Drawer.CloseTrigger>
              </Drawer.Header>
              <Drawer.Body>
                {valoresFinales && (
                  <PDFViewer width="100%" height={800}>
                    <RecetaPDF
                      medicamentos={(valoresFinales.medicamentos ?? []).map(
                        (m) => ({
                          ...m,
                          paraCasa: aBoolean(m.paraCasa),
                          tiempoIndefinido: aBoolean(m.tiempoIndefinido),
                          desde:
                            m.desde instanceof Date
                              ? m.desde.toISOString()
                              : typeof m.desde === "string"
                              ? m.desde
                              : undefined,
                        })
                      )}
                      datosClinicos={{
                        historiaClinica: valoresFinales.historiaClinica,
                        exploracionFisica: valoresFinales.exploracionFisica,
                        temperatura: valoresFinales.temperatura ?? undefined,
                        peso: valoresFinales.peso ?? undefined,
                        frecuenciaCardiaca:
                          valoresFinales.frecuenciaCardiaca ?? undefined,
                        frecuenciaRespiratoria:
                          valoresFinales.frecuenciaRespiratoria ?? undefined,
                        diagnosticoPresuntivo:
                          valoresFinales.diagnosticoPresuntivo,
                        pronostico: valoresFinales.pronostico,
                        laboratoriales: valoresFinales.laboratoriales,
                        extras: valoresFinales.extras,
                      }}
                      fechaNota={new Date().toISOString()}
                      estadoNota="EN_REVISION"
                      datosMascota={datosMascota}
                      indicaciones={valoresFinales.indicaciones} // ✅ AQU
                    />
                  </PDFViewer>
                )}
              </Drawer.Body>
              <Drawer.Footer gap="4">
                <Button variant="ghost" onClick={() => setDrawerOpen(false)}>
                  Cancelar
                </Button>
                <Button
                  {...estilosBotonEspecial}
                  onClick={confirmarEnvio}
                  disabled={crearNota.isPending}
                  loading={crearNota.isPending}
                >
                  Confirmar y guardar
                </Button>
              </Drawer.Footer>
            </Drawer.Content>
          </Drawer.Positioner>
        </Portal>
      </Drawer.Root>
    </FormProvider>
  );
}