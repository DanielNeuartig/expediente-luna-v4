// src/components/ui/aplicaciones/AplicacionMedicamentoItem.tsx
"use client";

import {
  Box,
  Text,
  Input,
  Field,
  SegmentGroup,
  Button,
  Textarea,
  HStack,
} from "@chakra-ui/react";
import { Controller, useFormContext, useWatch } from "react-hook-form";
import { EstadoAplicacion, ViaMedicamento } from "@prisma/client";
import { estilosInputBase } from "../config/estilosInputBase";
import { actualizarAplicacionMedicamento } from "@/lib/api/aplicaciones";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toaster } from "@/components/ui/toaster";

interface Props {
  index: number;
  aplicacionId: number;
  estado: EstadoAplicacion;
  ejecutor?: {
    id: number;
    nombre: string;
  } | null;
  defaults?: {
    nombreMedicamentoManual?: string;
    dosis?: string;
    via?: string;
  };
  fechaProgramada: string;
  fechaReal?: string | null;
}

export default function AplicacionMedicamentoItem({
  index,
  aplicacionId,
  estado,
  ejecutor,
  defaults,
  fechaProgramada,
  fechaReal,
}: Props) {
  const {
    control,
    register,
    getValues,
    formState: { /*errors*/ },
  } = useFormContext();

  const isEditable = estado === "PENDIENTE";
  const queryClient = useQueryClient();
  const mutation = useMutation({
    mutationFn: async () => {
      const values = getValues(`aplicaciones.${index}`);

      const datos: {
        nombreMedicamentoManual?: string;
        dosis?: string;
        via?: string;
        observaciones?: string;
        estado?: EstadoAplicacion;
      } = {};

      if (values.nombreMedicamentoManual?.trim()) {
        datos.nombreMedicamentoManual = values.nombreMedicamentoManual.trim();
      }
      if (values.dosis?.trim()) {
        datos.dosis = values.dosis.trim();
      }
      if (
        values.via &&
        values.via.trim() !== "" &&
        Object.values(ViaMedicamento).includes(values.via.trim())
      ) {
        datos.via = values.via.trim();
      }
      if (values.observaciones?.trim()) {
        datos.observaciones = values.observaciones.trim();
      }

      if (values.estado && values.estado !== "PENDIENTE") {
        datos.estado = values.estado;
      }

      await actualizarAplicacionMedicamento({ id: aplicacionId, datos });
    },
    onSuccess: () => {
      toaster.create({
        description: "Aplicación actualizada correctamente",
        type: "success",
      });
      queryClient.invalidateQueries({ queryKey: ["expedientes"] });
    },
    onError: () => {
      toaster.create({
        description: "Error al actualizar la aplicación",
        type: "error",
      });
    },
  });

  const estadoActual = useWatch({
    control,
    name: `aplicaciones.${index}.estado`,
    defaultValue: estado,
  });

  const guardarHabilitado = isEditable && estadoActual !== "PENDIENTE";
console.log("💉 Aplicación:", {
  aplicacionId,
  estado,
  fechaProgramada,
  fechaReal,
});
  return (
    
    <Box
      border="2px"
      borderColor="tema.llamativo"
      p="1"
      borderRadius="lg"
      bg="tema.suave"
    >
      <HStack gap="2" fontSize="xs" mb="1">
        <Text fontWeight="bold">
          Programado: {new Date(fechaProgramada).toLocaleString()}
        </Text>
        {estado !== "PENDIENTE" && fechaReal && (
          <Text fontWeight="normal" color="tema.claro">
            Realizado: {new Date(fechaReal).toLocaleString()}
          </Text>
        )}
      </HStack>

      <HStack>
        <Field.Root>
          <Field.Label color="tema.claro" fontSize="xs">
            Nombre
          </Field.Label>
          <Input
            {...estilosInputBase}
            {...register(`aplicaciones.${index}.nombreMedicamentoManual`)}
            defaultValue={defaults?.nombreMedicamentoManual || ""}
            disabled={!isEditable}
          />
        </Field.Root>

        <Field.Root>
          <Field.Label color="tema.claro" fontSize="xs">
            Dosis
          </Field.Label>
          <Input
            {...estilosInputBase}
            {...register(`aplicaciones.${index}.dosis`)}
            defaultValue={defaults?.dosis || ""}
            disabled={!isEditable}
          />
        </Field.Root>

        <Field.Root>
          <Field.Label color="tema.claro" fontSize="xs">
            Vía
          </Field.Label>
          <Input
            {...estilosInputBase}
            {...register(`aplicaciones.${index}.via`)}
            defaultValue={defaults?.via || ""}
            disabled={!isEditable}
          />
        </Field.Root>
      </HStack>

      <Field.Root>
        <Field.Label color="tema.claro" fontSize="xs">
          Estado
        </Field.Label>
        <Controller
          control={control}
          name={`aplicaciones.${index}.estado`}
          defaultValue={estado}
          render={({ field }) => (
            <SegmentGroup.Root
              name={field.name}
              value={field.value}
              onValueChange={({ value }) => field.onChange(value)}
              disabled={!isEditable}
              size="sm"
              colorPalette="blue"
            >
              <SegmentGroup.Items
                items={[
                  { value: "PENDIENTE", label: "Pendiente" },
                  { value: "REALIZADA", label: "Realizada" },
                  { value: "OMITIDA", label: "Omitida" },
                  { value: "CANCELADA", label: "Cancelada" },
                ]}
              />
              <SegmentGroup.Indicator bg="tema.llamativo" />
            </SegmentGroup.Root>
          )}
        />
      </Field.Root>

      <Field.Root>
        <Field.Label color="tema.claro" fontSize="xs">
          Observaciones
        </Field.Label>
        <Textarea
          {...estilosInputBase}
          {...register(`aplicaciones.${index}.observaciones`)}
          disabled={!isEditable}
        />
      </Field.Root>

      {isEditable ? (
        <Button
          mt="3"
          colorScheme="green"
          onClick={() => mutation.mutate()}
          loading={mutation.isPending}
          disabled={!guardarHabilitado}
        >
          FIRMAR
        </Button>
      ) : (
        <Text mt="2" fontSize="sm" color="tema.claro">
          Aplicación {estado.toLowerCase()} por: {ejecutor?.nombre || "-"}
        </Text>
      )}
    </Box>
  );
}
