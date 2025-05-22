"use client";

import {
  Box,
  Button,
  Field,
  Fieldset,
  HStack,
  Input,
  Stack,
  Textarea,
  SegmentGroup,
} from "@chakra-ui/react";
import {
  Controller,
  useFieldArray,
  useFormContext,
  useWatch,
} from "react-hook-form";
import { useMemo, useEffect } from "react";
import { estilosBotonEspecial } from "../config/estilosBotonEspecial";
import { estilosInputBase } from "../config/estilosInputBase";
import { estilosTituloInput } from "../config/estilosTituloInput";
import { calcularFechas, formatoDatetimeLocal } from "./utils";
import type { NotaClinicaValues } from "@/lib/validadores/notaClinicaSchema";

type Props = {
  fechaBase: string;
};

type Indicacion = NonNullable<NotaClinicaValues["indicaciones"]>[number];

export default function ListaIndicaciones({ fechaBase }: Props) {
  const {
    control,
    setValue,
    register,
    formState: { /*errors */},
  } = useFormContext();

  const { fields, append, remove } = useFieldArray({
    control,
    name: "indicaciones",
  });

  const valores = useWatch({ control, name: "indicaciones" });
  const valoresMemo = useMemo(() => valores ?? [], [valores]);

  useEffect(() => {
    valoresMemo.forEach((item: Indicacion | undefined, index: number) => {
      if (item?.veces === 1 && item?.frecuenciaHoras !== undefined) {
        setValue(`indicaciones.${index}.frecuenciaHoras`, undefined, {
          shouldValidate: true,
          shouldDirty: true,
        });
      }
    });
  }, [valoresMemo, setValue]);

  return (
    <>
      {fields.map((field, index) => {
        const item = valoresMemo[index] as Indicacion | undefined;

        return (
          <Box key={field.id} borderWidth="1px" p="4" rounded="md">
            <Fieldset.Legend {...estilosTituloInput}>
              Indicación #{index + 1}
            </Fieldset.Legend>

            <Field.Root>
              <Field.Label {...estilosTituloInput}>Descripción</Field.Label>
              <Input
                {...estilosInputBase}
                {...register(`indicaciones.${index}.descripcion`)}
              />
            </Field.Root>

            <HStack>
              {(item?.veces !== 1 || item?.tiempoIndefinido === "true") && (
                <Field.Root>
                  <Field.Label {...estilosTituloInput}>
                    Cada cuántas horas
                  </Field.Label>
                  <Input
                    {...estilosInputBase}
                    type="number"
                    {...register(`indicaciones.${index}.frecuenciaHoras`, {
                      setValueAs: (v) => (v === "" ? undefined : Number(v)),
                    })}
                  />
                </Field.Root>
              )}

              {item?.tiempoIndefinido !== "true" && (
                <Field.Root>
                  <Field.Label {...estilosTituloInput}>Veces</Field.Label>
                  <Input
                    {...estilosInputBase}
                    type="number"
                    {...register(`indicaciones.${index}.veces`, {
                      setValueAs: (v) => (v === "" ? undefined : Number(v)),
                    })}
                  />
                </Field.Root>
              )}

              <Field.Root>
                <Field.Label {...estilosTituloInput}>Desde</Field.Label>
                <Input
                  {...estilosInputBase}
                  type="datetime-local"
                  min={formatoDatetimeLocal(
                    new Date(Date.now() - 60 * 60 * 1000)
                  )}
                  {...register(`indicaciones.${index}.desde`)}
                  defaultValue={formatoDatetimeLocal(
                    new Date(item?.desde ?? fechaBase)
                  )}
                />
              </Field.Root>
            </HStack>

            <Field.Root>
              <Field.Label {...estilosTituloInput}>Observaciones</Field.Label>
              <Textarea
                {...estilosInputBase}
                {...register(`indicaciones.${index}.observaciones`)}
                placeholder="Observaciones sobre la indicación"
              />
            </Field.Root>

            {item?.desde &&
              item?.frecuenciaHoras !== undefined &&
              item?.frecuenciaHoras > 0 &&
              item?.veces !== undefined &&
              item?.veces > 1 && (
                <Stack gap={0} mb={2} mt={2}>
                  {calcularFechas(
                    item.desde.toString(),
                    item.frecuenciaHoras.toString(),
                    item.veces.toString()
                  ).map((fecha, i) => (
                    <Box key={i} color="tema.llamativo" fontSize="sm">
                      Aplicación #{i + 1}: {fecha}
                    </Box>
                  ))}
                </Stack>
              )}

            <Field.Root>
              <Field.Label {...estilosTituloInput}>
                 ¿Para casa?
              </Field.Label>
              <Controller
                control={control}
                name={`indicaciones.${index}.paraCasa`}
                rules={{ required: "Selecciona si se incluye en receta" }}
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
                          `indicaciones.${index}.tiempoIndefinido`,
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
                    size="sm"
                    colorPalette="tema.llamativo"
                  >
                    <SegmentGroup.Items
                      items={[
                        { value: "true", label: "Sí" },
                        { value: "false", label: "No" },
                      ]}
                    />
                    <SegmentGroup.Indicator bg="tema.llamativo" />
                  </SegmentGroup.Root>
                )}
              />
            </Field.Root>

            <Field.Root>
              <Field.Label {...estilosTituloInput}>
                ¿Aplicación por tiempo indefinido?
              </Field.Label>
              <Controller
                control={control}
                name={`indicaciones.${index}.tiempoIndefinido`}
                render={({ field }) => (
                  <SegmentGroup.Root
                    name={field.name}
                    value={field.value}
                    onValueChange={({ value }) => {
                      field.onChange(value);

                      if (value === "true") {
                        if (item?.paraCasa === "false") {
                          setValue(
                            `indicaciones.${index}.paraCasa`,
                            "true",
                            {
                              shouldValidate: true,
                              shouldDirty: true,
                            }
                          );
                        }

                        setValue(`indicaciones.${index}.veces`, undefined, {
                          shouldValidate: true,
                          shouldDirty: true,
                        });
                      }
                    }}
                    onBlur={field.onBlur}
                    size="sm"
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

            <Button
              variant="ghost"
              color="red.500"
              size="sm"
              mt={3}
              onClick={() => remove(index)}
            >
              Eliminar indicación
            </Button>
          </Box>
        );
      })}

      <Button
        {...estilosBotonEspecial}
        onClick={() =>
          append({
            descripcion: "",
            paraCasa: "false",
            tiempoIndefinido: "false",
            frecuenciaHoras: undefined,
            veces: undefined,
            desde: formatoDatetimeLocal(new Date()),
          } as unknown as Indicacion)
        }
        type="button"
        mb={2}
      >
        Añadir indicación
      </Button>
    </>
  );
}