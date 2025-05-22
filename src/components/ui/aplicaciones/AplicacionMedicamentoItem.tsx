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

function calcularTiempoRestante(fechaProgramada: string) {
  const ahora = new Date();
  const objetivo = new Date(fechaProgramada);
  const enRetraso = objetivo.getTime() < ahora.getTime();

  const [mayor, menor] = enRetraso ? [ahora, objetivo] : [objetivo, ahora];

  const diff = {
    years: mayor.getFullYear() - menor.getFullYear(),
    months: mayor.getMonth() - menor.getMonth(),
    days: mayor.getDate() - menor.getDate(),
    hours: mayor.getHours() - menor.getHours(),
    minutes: mayor.getMinutes() - menor.getMinutes(),
  };

  if (diff.minutes < 0) {
    diff.minutes += 60;
    diff.hours -= 1;
  }
  if (diff.hours < 0) {
    diff.hours += 24;
    diff.days -= 1;
  }
  if (diff.days < 0) {
    diff.months -= 1;
    diff.days += 30;
  }
  if (diff.months < 0) {
    diff.months += 12;
    diff.years -= 1;
  }

  const partes = [];
  if (diff.years > 0)
    partes.push(`${diff.years} año${diff.years !== 1 ? "s" : ""}`);
  if (diff.months > 0)
    partes.push(`${diff.months} mes${diff.months !== 1 ? "es" : ""}`);
  if (diff.days > 0)
    partes.push(`${diff.days} día${diff.days !== 1 ? "s" : ""}`);
  if (diff.hours > 0) partes.push(`${diff.hours} h`);
  if (diff.minutes > 0 || partes.length === 0)
    partes.push(`${diff.minutes} min`);

  const texto = partes.slice(0, 2).join(", ");
  return enRetraso ? `🕒 Retraso: ${texto}⚠️⚠️⚠️` : `🕒 Faltan: ${texto}⏳`;
}

function getBgColor(estado: EstadoAplicacion, fechaProgramada: string) {
  if (estado === "REALIZADA") return "tema.verde";
  if (estado !== "PENDIENTE") return "tema.suave";
  const ahora = Date.now();
  const fecha = new Date(fechaProgramada).getTime();
  const diffMin = (fecha - ahora) / 60000;
  if (diffMin < -15) return "tema.rojo";
  if (diffMin <= 60) return "tema.rojo";
  if (diffMin <= 180) return "tema.naranja";
  if (diffMin <= 720) return "yellow.500";
  return "tema.gris";
}

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
  const { control, register, getValues } = useFormContext();

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

  // Valores a mostrar como texto (si no es editable)
  const valorNombre =
    getValues?.(`aplicaciones.${index}.nombreMedicamentoManual`) ||
    defaults?.nombreMedicamentoManual ||
    "-";
  const valorDosis =
    getValues?.(`aplicaciones.${index}.dosis`) || defaults?.dosis || "-";
  const valorVia =
    getValues?.(`aplicaciones.${index}.via`) || defaults?.via || "-";
  const valorObs = getValues?.(`aplicaciones.${index}.observaciones`) || "-";

  return (
    <Box
      border="2px"
      borderColor="tema.llamativo"
      p="1"
      borderRadius="lg"
      bg={getBgColor(estado, fechaProgramada)}
    >
      <HStack gap="2" fontSize="xs" mb="0">
        {estado !== "PENDIENTE" && fechaReal && (
          <Text fontWeight="bold" color="tema.claro">
            ✏️{" "}
            {new Date(fechaReal).toLocaleString("es-MX", {
              weekday: "short",
              year: "numeric",
              month: "2-digit",
              day: "2-digit",
              hour: "2-digit",
              minute: "2-digit",
              hour12: false,
            })}
          </Text>
        )}
        <Text fontWeight="light">
          📅
          {new Date(fechaProgramada).toLocaleString("es-MX", {
            weekday: "short",
            year: "numeric",
            month: "2-digit",
            day: "2-digit",
            hour: "2-digit",
            minute: "2-digit",
            hour12: false,
          })}
          {"  "}{" "}
          {estado === "PENDIENTE" &&
            ` · ${calcularTiempoRestante(fechaProgramada)}`}
        </Text>
      </HStack>

      <HStack>
        <Field.Root>
          {isEditable ? (
            <Input
              fontSize="xs"
              size="xs"
              {...estilosInputBase}
              {...register(`aplicaciones.${index}.nombreMedicamentoManual`)}
              defaultValue={defaults?.nombreMedicamentoManual || ""}
              disabled={!isEditable}
              borderRadius="lg"
            />
          ) : (
            <Text fontSize="xs" fontWeight="semibold" color="tema.fuerte">
              {valorNombre}
            </Text>
          )}
        </Field.Root>
        <Field.Root>
          {isEditable ? (
            <Input
              borderRadius="lg"
              fontSize="xs"
              size="xs"
              {...estilosInputBase}
              {...register(`aplicaciones.${index}.dosis`)}
              defaultValue={defaults?.dosis || ""}
              disabled={!isEditable}
            />
          ) : (
            <Text fontSize="xs" color="tema.fuerte">
              {valorDosis}
            </Text>
          )}
        </Field.Root>
        <Field.Root>
          {isEditable ? (
            <Input
              borderRadius="lg"
              fontSize="xs"
              size="xs"
              {...estilosInputBase}
              {...register(`aplicaciones.${index}.via`)}
              defaultValue={defaults?.via || ""}
              disabled={!isEditable}
            />
          ) : (
            <Text fontSize="xs" color="tema.fuerte">
              {valorVia}
            </Text>
          )}
        </Field.Root>
      </HStack>

      <Field.Root>
        {isEditable ? (
          <Textarea
            borderRadius="lg"
            size="xs"
            {...estilosInputBase}
            {...register(`aplicaciones.${index}.observaciones`)}
            disabled={!isEditable}
          />
        ) : (
          valorObs.trim && (
            <Text fontSize="xs" color="tema.suave">
              {valorObs.trim}
            </Text>
          )
        )}
      </Field.Root>

      <HStack>
        {/* SegmentGroup solo en pendiente */}
        {isEditable && (
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
                    { value: "CANCELADA", label: "Cancelada" },
                  ]}
                />
                <SegmentGroup.Indicator
                  bg={
                    field.value === "REALIZADA"
                      ? "green.400"
                      : field.value === "OMITIDA"
                      ? "orange.400"
                      : field.value === "CANCELADA"
                      ? "red.400"
                      : "gray.400"
                  }
                />
              </SegmentGroup.Root>
            )}
          />
        )}

        {isEditable ? (
          <Button
            size="xs"
            mt="1"
            borderRadius="lg"
            colorScheme="green"
            onClick={() => mutation.mutate()}
            loading={mutation.isPending}
            disabled={!guardarHabilitado}
          >
            FIRMAR
          </Button>
        ) : (
          <Text mt="0" fontSize="xs" color="tema.claro">
            {ejecutor?.nombre || "-"}
          </Text>
        )}
      </HStack>
    </Box>
  );
}
