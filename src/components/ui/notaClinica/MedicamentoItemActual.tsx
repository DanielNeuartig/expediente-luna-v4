"use client";

import {
  Box,
  Button,
  Field,
  Fieldset,
  HStack,
  Input,
  NativeSelect,
  Textarea,
  SegmentGroup,
  Wrap,
  WrapItem,
} from "@chakra-ui/react";
import {
  Controller,
  UseFormRegister,
  Control,
  UseFormSetValue,
} from "react-hook-form";
import { estilosInputBase } from "../config/estilosInputBase";
import { estilosTituloInput } from "../config/estilosTituloInput";
import { calcularFechas, formatoDatetimeLocal } from "./utils";
import type { NotaClinicaValues } from "@/lib/validadores/notaClinicaSchema";

interface Props {
  index: number;
  item?: NonNullable<NotaClinicaValues["medicamentos"]>[number];
  control: Control<NotaClinicaValues>;
  register: UseFormRegister<NotaClinicaValues>;
  setValue: UseFormSetValue<NotaClinicaValues>;
  remove: (index: number) => void;
  fechaBase: string;
}

export default function MedicamentoItemActual({
  index,
  item,
  control,
  register,
  setValue,
  remove,
}: Props) {
  return (
    <Box
      borderWidth="2px"
      p="4"
      rounded="md"
      borderColor="tema.llamativo"
      bg="blue.50"
    >
      <Fieldset.Legend {...estilosTituloInput} />

      {/* Nombre */}
      <Field.Root>
        <HStack align="start">
          <Field.Label minW="100px" fontSize="2xs" {...estilosTituloInput}>
            Nombre
          </Field.Label>
          <Input
            size="2xs"
            {...estilosInputBase}
            {...register(`medicamentos.${index}.nombre`)}
          />
        </HStack>
      </Field.Root>

      {/* Dosis */}
      <Field.Root>
        <HStack>
          <Field.Label minW="100px" fontSize="2xs" {...estilosTituloInput}>
            Dosis
          </Field.Label>
          <Input
            size="2xs"
            {...estilosInputBase}
            {...register(`medicamentos.${index}.dosis`)}
          />
        </HStack>
      </Field.Root>

      {/* Vía */}
      <Field.Root>
        <HStack>
          <Field.Label minW="100px" fontSize="2xs" {...estilosTituloInput}>
            Vía
          </Field.Label>
          <NativeSelect.Root size="xs">
            <NativeSelect.Field
              {...estilosInputBase}
              {...register(`medicamentos.${index}.via`)}
            >
              <option value="">Selecciona una vía</option>
              <option value="ORAL">Oral</option>
              <option value="SC">SC</option>
              <option value="IM">IM</option>
              <option value="IV">IV</option>
              <option value="OTICA">Ótica</option>
              <option value="OFTALMICA">Oftálmica</option>
              <option value="TOPICA">Tópica</option>
            </NativeSelect.Field>
            <NativeSelect.Indicator />
          </NativeSelect.Root>
        </HStack>
      </Field.Root>

      {/* Frecuencia */}
      {(item?.veces !== 1 || item?.tiempoIndefinido === "true") && (
        <Field.Root>
          <HStack>
            <Field.Label minW="100px" fontSize="2xs" {...estilosTituloInput}>
              Cada cuántas horas
            </Field.Label>
            <Input
              size="2xs"
              type="number"
              {...estilosInputBase}
              {...register(`medicamentos.${index}.frecuenciaHoras`, {
                setValueAs: (v) => (v === "" ? undefined : Number(v)),
              })}
            />
          </HStack>
        </Field.Root>
      )}

      {/* Veces */}
      {item?.tiempoIndefinido !== "true" && (
        <Field.Root>
          <HStack>
            <Field.Label minW="100px" fontSize="2xs" {...estilosTituloInput}>
              Veces
            </Field.Label>
            <Input
              size="2xs"
              type="number"
              {...estilosInputBase}
              {...register(`medicamentos.${index}.veces`, {
                setValueAs: (v) => (v === "" ? undefined : Number(v)),
              })}
            />
          </HStack>
        </Field.Root>
      )}

      {/* Tiempo indefinido */}
      <Field.Root>
        <Field.Label minW="100px" {...estilosTituloInput}>
          ¿Aplicación indefinida?
        </Field.Label>
        <Controller
          control={control}
          name={`medicamentos.${index}.tiempoIndefinido`}
          render={({ field }) => (
            <SegmentGroup.Root
              name={field.name}
              value={field.value}
              onValueChange={({ value }) => {
                field.onChange(value);
                if (value === "true") {
                  if (item?.paraCasa === "false") {
                    setValue(`medicamentos.${index}.paraCasa`, "true", {
                      shouldValidate: true,
                      shouldDirty: true,
                    });
                  }
                  setValue(`medicamentos.${index}.veces`, undefined, {
                    shouldValidate: true,
                    shouldDirty: true,
                  });
                }
              }}
              onBlur={field.onBlur}
              size="xs"
              colorPalette="tema.llamativo"
            >
              <SegmentGroup.Items
                items={[
                  { value: "false", label: "Tiempo definido" },
                  { value: "true", label: "Indefinido" },
                ]}
              />
              <SegmentGroup.Indicator bg="tema.llamativo" />
            </SegmentGroup.Root>
          )}
        />
      </Field.Root>

      {/* Desde */}
      <Field.Root>
        <HStack align="start">
          <Field.Label minW="100px" fontSize="2xs" {...estilosTituloInput}>
            Desde
          </Field.Label>
          <Controller
            control={control}
            name={`medicamentos.${index}.desde`}
            render={({ field }) => (
              <>
                <Input
                  size="2xs"
                  type="datetime-local"
                  min={formatoDatetimeLocal(new Date(Date.now() - 86400000))}
                  {...estilosInputBase}
                  value={formatoDatetimeLocal(
                    field.value instanceof Date
                      ? field.value
                      : new Date(field.value)
                  )}
                  onChange={(e) => {
                    const valor = new Date(e.target.value);
                    field.onChange(valor);
                  }}
                />
                <Button
                  bg="tema.suave"
                  size="2xs"
                  variant="outline"
                  onClick={() => {
                    const manana10 = new Date();
                    manana10.setDate(manana10.getDate() + 1);
                    manana10.setHours(10, 0, 0, 0);
                    field.onChange(manana10);
                  }}
                >
                  Mañana 10 AM?
                </Button>
              </>
            )}
          />
        </HStack>
      </Field.Root>

      {/* Observaciones */}
      <Field.Root>
        <Textarea
          size="xs"
          placeholder="Observaciones"
          {...estilosInputBase}
          {...register(`medicamentos.${index}.observaciones`)}
        />
      </Field.Root>

      {/* Fechas tentativas */}
      {item?.desde &&
        item?.frecuenciaHoras &&
        item?.veces &&
        item.veces > 1 && (
          <Wrap gap="2" mt="0" mb="0">
            {calcularFechas(
              item.desde.toString(),
              item.frecuenciaHoras.toString(),
              item.veces.toString()
            ).map((fecha, i) => (
              <WrapItem key={i}>
                <Box color="tema.llamativo" fontSize="xs">
                  Aplicación #{i + 1}: {fecha}
                </Box>
              </WrapItem>
            ))}
          </Wrap>
        )}

      {/* ¿Para casa? + eliminar */}
      <HStack>
        <Field.Root>
          <HStack>
            <Field.Label minW="100px" fontSize="2xs" {...estilosTituloInput}>
              APLICACIÓN EN:
            </Field.Label>
            <Controller
              control={control}
              name={`medicamentos.${index}.paraCasa`}
              render={({ field }) => (
                <SegmentGroup.Root
                  name={field.name}
                  value={field.value}
                  onValueChange={({ value }) => {
                    if (
                      item?.tiempoIndefinido === "true" &&
                      value === "false"
                    ) {
                      setValue(
                        `medicamentos.${index}.tiempoIndefinido`,
                        "false",
                        {
                          shouldDirty: true,
                          shouldValidate: true,
                        }
                      );
                    }
                    field.onChange(value);
                  }}
                  onBlur={field.onBlur}
                  size="xs"
                  colorPalette="tema.llamativo"
                >
                  <SegmentGroup.Items
                    items={[
                      { value: "true", label: "CASA" },
                      { value: "false", label: "CLÍNICA" },
                    ]}
                  />
                  <SegmentGroup.Indicator bg="tema.llamativo" />
                </SegmentGroup.Root>
              )}
            />
          </HStack>
        </Field.Root>

        <Button
          variant="ghost"
          color="red.500"
          size="sm"
          mt={3}
          onClick={() => remove(index)}
        >
          Eliminar medicamento
        </Button>
      </HStack>
    </Box>
  );
}
