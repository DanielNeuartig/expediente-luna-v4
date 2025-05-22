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
  Wrap,
  WrapItem,
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
          <Box key={field.id} borderWidth="1px" p="0" rounded="md">
            <Fieldset.Legend {...estilosTituloInput}>
              {
                //Medicamento #{index + 1}
              }
            </Fieldset.Legend>

            <Field.Root>
              <HStack>
                <Field.Label
                  minW="100px"
                  fontSize="2xs"
                  {...estilosTituloInput}
                >
                  Nombre
                </Field.Label>
                <Input
                  size="2xs"
                  {...estilosInputBase}
                  {...register(`medicamentos.${index}.nombre`)}
                />
              </HStack>
            </Field.Root>

            <Field.Root>
              <HStack>
                <Field.Label
                  minW="100px"
                  fontSize={"2xs"}
                  {...estilosTituloInput}
                >
                  Dosis
                </Field.Label>
                <Input
                  size={"2xs"}
                  {...estilosInputBase}
                  {...register(`medicamentos.${index}.dosis`)}
                />
              </HStack>
            </Field.Root>

            <Field.Root>
              <HStack>
                <Field.Label
                  minW="100px"
                  fontSize={"2xs"}
                  {...estilosTituloInput}
                >
                  Vía
                </Field.Label>
                <NativeSelect.Root size={"xs"}>
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
              </HStack>
            </Field.Root>

            {(item?.veces !== 1 || item?.tiempoIndefinido === "true") && (
              <Field.Root>
                <HStack align="center">
                  <Field.Label
                    minW="100px"
                    fontSize={"2xs"}
                    {...estilosTituloInput}
                  >
                    Cada cuántas horas
                  </Field.Label>
                  <Input
                    size="2xs"
                    {...estilosInputBase}
                    type="number"
                    {...register(`medicamentos.${index}.frecuenciaHoras`, {
                      setValueAs: (v) => (v === "" ? undefined : Number(v)),
                    })}
                  />
                </HStack>
              </Field.Root>
            )}
            <HStack>
              {item?.tiempoIndefinido !== "true" && (
                <Field.Root>
                  <HStack>
                    <Field.Label
                      minW="100px"
                      fontSize={"2xs"}
                      {...estilosTituloInput}
                    >
                      Veces
                    </Field.Label>
                    <Input
                      size="2xs"
                      {...estilosInputBase}
                      type="number"
                      {...register(`medicamentos.${index}.veces`, {
                        setValueAs: (v) => (v === "" ? undefined : Number(v)),
                      })}
                    />
                  </HStack>
                </Field.Root>
              )}

              <Field.Root>
                <Field.Label minW="100px" {...estilosTituloInput}>
                  {/*¿Aplicación por tiempo indefinido?*/}
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
            </HStack>

            <Field.Root>
              <HStack>
                <Field.Label
                  minW="100px"
                  fontSize="2xs"
                  {...estilosTituloInput}
                >
                  Desde
                </Field.Label>
                <Input
                  size="2xs"
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
              </HStack>
            </Field.Root>

            <Field.Root>
              <Field.Label
                minW="100px"
                fontSize={"2xs"}
                {...estilosTituloInput}
              >
                {/*Observaciones*/}
              </Field.Label>
              <Textarea
                size="xs"
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
            <HStack>
              <Field.Root>
                <HStack>
                  <Field.Label
                    minW="100px"
                    fontSize="2xs"
                    {...estilosTituloInput}
                  >
                    ¿Para casa?
                  </Field.Label>
                  <Controller
                    control={control}
                    name={`medicamentos.${index}.paraCasa`}
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
                        size="xs"
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
      })}

      <Button
        {...estilosBotonEspecial}
        onClick={() =>
          append({
            nombre: "",
            dosis: "",
            via: "ORAL",
            paraCasa: "undefined",
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
