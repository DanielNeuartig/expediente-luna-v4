// src/components/ui/notaClinica/FormularioNotaClinica.tsx
"use client";

import { Box, Button, Fieldset, Stack } from "@chakra-ui/react";
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

type Expediente = {
  id: number;
  tipo: string;
  fechaCreacion: string;
};

type Props = {
  expedienteSeleccionado: Expediente | null;
  mascotaId: number;
  onClose?: () => void;
};

export default function FormularioNotaClinica({
  expedienteSeleccionado,
  mascotaId,
  onClose,
}: Props) {
  // El genérico aquí es el INPUT (raw values)
  const methods = useForm<NotaClinicaInput>({
    resolver: zodResolver(notaClinicaSchema),
    defaultValues: {
      medicamentos: [],
      indicaciones: [],
    },
    mode: "onChange",
  });

  const { handleSubmit, reset } = methods;
  const crearNota = useCrearNotaClinica();

  if (!expedienteSeleccionado) {
    return (
      <Box color="gray.400" fontSize="md">
        Selecciona un expediente para añadir una nota clínica.
      </Box>
    );
  }

  // Usamos NotaClinicaInput como tipo, y antes de mutar, parseamos con el schema
  const onSubmit = (data: NotaClinicaInput) => {
    const valoresParseados: NotaClinicaValues = notaClinicaSchema.parse(data);
    crearNota.mutate(
      {
        ...valoresParseados,
        expedienteId: expedienteSeleccionado.id,
        mascotaId,
      },
      {
        onSuccess: () => {
          reset();
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
            <Fieldset.Legend color="tema.intenso">Nota clínica</Fieldset.Legend>
            <Fieldset.HelperText>
              Registrando en expediente #{expedienteSeleccionado.id} ·{" "}
              {expedienteSeleccionado.tipo}
            </Fieldset.HelperText>
          </Stack>
          <Fieldset.Content>
            <CamposClinicos />
            <ListaMedicamentos fechaBase={formatoDatetimeLocal(new Date())} />
            <ListaIndicaciones fechaBase={formatoDatetimeLocal(new Date())} />
          </Fieldset.Content>
          <Button {...estilosBotonEspecial} type="submit">
            Guardar nota clínica
          </Button>
        </Fieldset.Root>
      </form>
    </FormProvider>
  );
}