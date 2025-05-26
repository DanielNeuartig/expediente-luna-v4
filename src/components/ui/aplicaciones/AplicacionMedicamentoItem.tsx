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
  VStack,
  NativeSelect,
} from "@chakra-ui/react";
import { Controller, useFormContext, useWatch } from "react-hook-form";
import { EstadoAplicacion, ViaMedicamento } from "@prisma/client";
import { estilosInputBase } from "../config/estilosInputBase";
import { actualizarAplicacionMedicamento } from "@/lib/api/aplicaciones";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toaster } from "@/components/ui/toaster";
import type { DefaultsAplicacion } from "@/types/aplicacion";

function calcularDiferenciaTiempo(fechaProgramada: string, fechaReal: string) {
  const programada = new Date(fechaProgramada);
  const real = new Date(fechaReal);

  const msDiff = real.getTime() - programada.getTime();
  const enRetraso = msDiff > 0;
  const minutos = Math.abs(msDiff) / 60000;

  const horas = Math.floor(minutos / 60);
  const mins = Math.floor(minutos % 60);

  const partes = [];
  if (horas > 0) partes.push(`${horas}h`);
  if (mins > 0) partes.push(`${mins}min`);
  const texto = partes.join(" ");

  return enRetraso ? `⏱ Retraso: ${texto}` : `⏱ Adelantado: ${texto}`;
}
function calcularTiempoRestante(fechaProgramada: string) {
  const ahora = new Date();
  const fecha = new Date(fechaProgramada);
  const msDiff = fecha.getTime() - ahora.getTime();

  const minutosTotales = Math.abs(msDiff) / 60000;
  const dias = Math.floor(minutosTotales / 1440); // 1440 = minutos en un día
  const horas = Math.floor((minutosTotales % 1440) / 60);
  const minutos = Math.floor(minutosTotales % 60);

  let texto = "";

  if (dias >= 31) {
    const meses = Math.floor(dias / 30);
    const diasRestantes = dias % 30;
    texto = `${meses} mes${meses > 1 ? "es" : ""}`;
    if (diasRestantes > 0) {
      texto += ` y ${diasRestantes} día${diasRestantes > 1 ? "s" : ""}`;
    }
  } else if (dias >= 1) {
    texto = `${dias} día${dias > 1 ? "s" : ""}`;
    if (horas > 0) {
      texto += ` y ${horas} hora${horas > 1 ? "s" : ""}`;
    }
  } else {
    if (horas > 0) texto += `${horas} hora${horas > 1 ? "s" : ""}`;
    if (minutos > 0) {
      if (texto) texto += " ";
      texto += `${minutos} minuto${minutos > 1 ? "s" : ""}`;
    }
  }

  return msDiff < 0 ? `⚠️⚠️⚠️ Atrasada por ${texto}` : `⏳ Faltan ${texto}`;
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
  if (diffMin <= 720) return "tema.amarillo";
  return "tema.gris";
}


interface Props {
  index: number;
  aplicacionId: number;
  estado: EstadoAplicacion;
  ejecutor?: {
    id: number;
    nombre: string;
    prefijo?: string;
    usuario?: {
      image?: string;
    } | null;
  } | null;
  defaults?: DefaultsAplicacion;
  fechaProgramada: string;
  fechaReal?: string | null;
  nombreMedicamentoManual?: string | null;
  dosis?: string | null;
  via?: string | null;
}

export default function AplicacionMedicamentoItem({
  index,
  aplicacionId,
  estado,
  ejecutor,
  defaults,
  fechaProgramada,
  fechaReal,
  nombreMedicamentoManual,
  dosis,
  via,
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
      if (values.medicamento?.nombre?.trim()) {
        datos.nombreMedicamentoManual = values.medicamento.nombre.trim();
      }
      if (values.medicamento?.dosis?.trim()) {
        datos.dosis = values.medicamento.dosis.trim();
      }
      if (
        values.medicamento?.via &&
        values.medicamento.via.trim() !== "" &&
        Object.values(ViaMedicamento).includes(values.medicamento.via.trim())
      ) {
        datos.via = values.medicamento.via.trim();
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

  const realNombre = nombreMedicamentoManual || "-";
  const realDosis = dosis || "-";
  const realVia = via || "-";
  const opcionesVia = Object.values(ViaMedicamento).map((v) => ({
    value: v,
    label: v.charAt(0).toUpperCase() + v.slice(1).toLowerCase(), // opcional: mejor presentación
  }));
  return (
    <Box

      p="3"
      borderRadius="lg"
      bg={getBgColor(estado, fechaProgramada)}
    >
      <VStack gap="1" align="start" fontSize="xs" mb="1">
        <HStack>
          {fechaReal && (
            <Text fontWeight="bold" color="tema.claro">
              💉 Firmado por:{" "}
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
          <HStack>
            <Text fontWeight="light" fontSize="md">
              📅 Programado para:{" "}
              {new Date(fechaProgramada).toLocaleString("es-MX", {
                weekday: "short",
                year: "numeric",
                month: "2-digit",
                day: "2-digit",
                hour: "2-digit",
                minute: "2-digit",
                hour12: false,
              })}
            </Text>
            {estado === "PENDIENTE" && (
              <Text fontSize="md" fontWeight="bold" color="tema.claro">
                {calcularTiempoRestante(fechaProgramada)}
              </Text>
            )}
          </HStack>
          {estado === "REALIZADA" && fechaReal && (
            <Text>{calcularDiferenciaTiempo(fechaProgramada, fechaReal)}</Text>
          )}
        </HStack>

        {!isEditable && (
          <>
            <Text>
              💊 Recetado:{" "}
              {`${defaults?.medicamento.nombre ?? "-"} · ${
                defaults?.medicamento.dosis ?? "-"
              } · ${defaults?.medicamento.via ?? "-"}`}
            </Text>
            {estado !== "OMITIDA" && estado !== "CANCELADA" && (
              <Text>
                💉 Aplicado: {`${realNombre} · ${realDosis} · ${realVia}`}
              </Text>
            )}
          </>
        )}
      </VStack>

      {isEditable ? (
        <>
          <HStack mb="2">
            <Field.Root>
              <Input
                fontSize="xs"
                size="xs"
                {...estilosInputBase}
                {...register(`aplicaciones.${index}.medicamento.nombre`)}
                defaultValue={defaults?.medicamento.nombre || ""}
                disabled={!isEditable}
                borderRadius="lg"
              />
            </Field.Root>
            <Field.Root>
              <Input
                borderRadius="lg"
                fontSize="xs"
                size="xs"
                {...estilosInputBase}
                {...register(`aplicaciones.${index}.medicamento.dosis`)}
                defaultValue={defaults?.medicamento.dosis || ""}
                disabled={!isEditable}
              />
            </Field.Root>
            <Field.Root>
              <NativeSelect.Root size="sm" width="100%" disabled={!isEditable}>
                <NativeSelect.Field
                  {...estilosInputBase}
                  placeholder="Selecciona vía"
                  {...register(`aplicaciones.${index}.medicamento.via`)}
                >
                  {opcionesVia.map((op) => (
                    <option key={op.value} value={op.value}>
                      {op.label}
                    </option>
                  ))}
                </NativeSelect.Field>
                <NativeSelect.Indicator />
              </NativeSelect.Root>
            </Field.Root>
          </HStack>

          <Field.Root>
            <Textarea
              borderRadius="lg"
              size="xs"
              {...estilosInputBase}
              {...register(`aplicaciones.${index}.observaciones`)}
              disabled={!isEditable}
            />
          </Field.Root>

          <HStack mt="2">
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
          </HStack>
        </>
      ) : (
        <Text mt="1" fontSize="xs" color="tema.claro">
          👤 {ejecutor?.nombre || "-"}
        </Text>
      )}
    </Box>
  );
}
