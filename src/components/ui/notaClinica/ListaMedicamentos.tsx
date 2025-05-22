"use client";

import {
  Box,
  Button,
  Field,
  Fieldset,
  HStack,
  Input,
  NativeSelect,
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
import { estilosBotonEspecial } from "../config/estilosBotonEspecial";
import { estilosInputBase } from "../config/estilosInputBase";
import { estilosTituloInput } from "../config/estilosTituloInput";
import { calcularFechas, formatoDatetimeLocal } from "./utils";
import type { NotaClinicaValues } from "@/lib/validadores/notaClinicaSchema";
import { useEffect } from "react";

type Props = {
  fechaBase: string;
};

type Medicamento = NonNullable<NotaClinicaValues["medicamentos"]>[number];

export default function ListaMedicamentos({ fechaBase }: Props) {
  const {
    control,
    setValue,
    register,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    formState: { errors },
  } = useFormContext();

  const { fields, append, remove } = useFieldArray({
    control,
    name: "medicamentos",
  });

  // USO CORRECTO: useWatch directamente, sin useMemo, sin JSON.stringify
  const valores = useWatch({ control, name: "medicamentos" }) || [];

  useEffect(() => {
    valores.forEach((item: Medicamento | undefined, index: number) => {
      if (item?.veces === 1 && item?.frecuenciaHoras !== undefined) {
        setValue(`medicamentos.${index}.frecuenciaHoras`, undefined, {
          shouldValidate: true,
          shouldDirty: true,
        });
      }
    });
  }, [valores, setValue]);

  return (
    <>
      {fields.map((field, index) => {
        const item = valores[index] as Medicamento | undefined;

        return (
          <Box key={field.id} borderWidth="1px" p="4" rounded="md">
            <Fieldset.Legend {...estilosTituloInput}>
              Medicamento #{index + 1}
            </Fieldset.Legend>

            <HStack>
              <Field.Root>
                <Field.Label {...estilosTituloInput}>Nombre</Field.Label>
                <Input
                  {...estilosInputBase}
                  {...register(`medicamentos.${index}.nombre`)}
                />
              </Field.Root>

              <Field.Root>
                <Field.Label {...estilosTituloInput}>Dosis</Field.Label>
                <Input
                  {...estilosInputBase}
                  {...register(`medicamentos.${index}.dosis`)}
                />
              </Field.Root>

              <Field.Root>
                <Field.Label {...estilosTituloInput}>Vía</Field.Label>
                <NativeSelect.Root>
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
                    <option value="OTRO">Otro</option>
                  </NativeSelect.Field>
                  <NativeSelect.Indicator />
                </NativeSelect.Root>
              </Field.Root>
            </HStack>

            <HStack>
              {(item?.veces !== 1 || item?.tiempoIndefinido === "true") && (
                <Field.Root>
                  <Field.Label {...estilosTituloInput}>
                    Cada cuántas horas
                  </Field.Label>
                  <Input
                    {...estilosInputBase}
                    type="number"
                    {...register(`medicamentos.${index}.frecuenciaHoras`, {
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
                    {...register(`medicamentos.${index}.veces`, {
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
                  {...register(`medicamentos.${index}.desde`)}
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
                {...register(`medicamentos.${index}.observaciones`)}
                placeholder="Observaciones sobre el medicamento"
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
                ¿Incluir en receta?
              </Field.Label>
              <Controller
                control={control}
                name={`medicamentos.${index}.incluirEnReceta`}
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
                name={`medicamentos.${index}.tiempoIndefinido`}
                render={({ field }) => (
                  <SegmentGroup.Root
                    name={field.name}
                    value={field.value}
                    onValueChange={({ value }) => {
                      field.onChange(value);

                      if (value === "true") {
                        if (item?.incluirEnReceta === "false") {
                          setValue(
                            `medicamentos.${index}.incluirEnReceta`,
                            "true",
                            {
                              shouldValidate: true,
                              shouldDirty: true,
                            }
                          );
                        }

                        setValue(`medicamentos.${index}.veces`, undefined, {
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
              Eliminar medicamento
            </Button>
          </Box>
        );
      })}

      <Button
        {...estilosBotonEspecial}
        onClick={() =>
          append({
            nombre: "",
            dosis: "",
            via: "ORAL",
            incluirEnReceta: "false",
            tiempoIndefinido: "false",
            frecuenciaHoras: undefined,
            veces: undefined,
            desde: formatoDatetimeLocal(new Date()),
          } as unknown as Medicamento)
        }
        type="button"
        mb={2}
      >
        Añadir medicamento
      </Button>
    </>
  );
}