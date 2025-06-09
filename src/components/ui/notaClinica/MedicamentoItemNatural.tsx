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
import { useEffect } from "react";
import { useWatch } from "react-hook-form";
import { X } from "lucide-react";

const botonesFrecuencia = [6, 8, 12, 24, 48, 72];
const botonesDuracion = [1, 2, 3, 5, 7, 10, 15, 30];

interface Props {
  index: number;
  item?: NonNullable<NotaClinicaValues["medicamentos"]>[number];
  control: Control<NotaClinicaValues>;
  register: UseFormRegister<NotaClinicaValues>;
  setValue: UseFormSetValue<NotaClinicaValues>;
  remove: (index: number) => void;
  fechaBase: string;
}

export default function MedicamentoItemNatural({
  index,
  item,
  control,
  register,
  setValue,
  remove,
}: Props) {
  const cada = useWatch({
    name: `medicamentos.${index}.frecuenciaHoras`,
    control,
  });
  const durante = useWatch({
    name: `medicamentos.${index}.duracionDias`,
    control,
  });
  const tiempoIndefinido = useWatch({
    name: `medicamentos.${index}.tiempoIndefinido`,
    control,
  });
  useEffect(() => {
    const indefinido = tiempoIndefinido === "true";

    const cadaEsValido = typeof cada === "number" && cada > 0;
    const duranteEsValido = typeof durante === "number" && durante > 0;

    if (indefinido) {
      setValue(`medicamentos.${index}.duracionDias`, undefined, {
        shouldDirty: true,
        shouldValidate: true,
      });
      setValue(`medicamentos.${index}.veces`, undefined, {
        shouldDirty: true,
        shouldValidate: true,
      });
      return;
    }

    // 👇 Calcula veces siempre que no sea indefinido
    if (cadaEsValido && duranteEsValido) {
      const veces = (24 / cada) * durante;

      if (Number.isInteger(veces) && veces > 0) {
        setValue(`medicamentos.${index}.veces`, veces, {
          shouldDirty: true,
          shouldValidate: true,
        });
      } else {
        setValue(`medicamentos.${index}.veces`, undefined, {
          shouldDirty: true,
          shouldValidate: true,
        });
      }
    } else {
      setValue(`medicamentos.${index}.veces`, undefined, {
        shouldDirty: true,
        shouldValidate: true,
      });
    }
  }, [cada, durante, tiempoIndefinido]);
  return (
    <Box
    position="relative" // 🟡 Añade esto
      borderWidth="2px"
      p="1"
      rounded="md"
      borderColor="tema.llamativo"
      bg="blue.50"
    >
      <Fieldset.Legend {...estilosTituloInput} />

      {/* Nombre */}
      <Field.Root>
        <HStack align="start">
          <Field.Label minW="100px" fontSize="sm" {...estilosTituloInput}>
            Nombre
          </Field.Label>
          <Input
            size="sm"
            {...estilosInputBase}
            {...register(`medicamentos.${index}.nombre`)}
            
          />
        </HStack>
      </Field.Root>

      {/* Dosis */}
      <Field.Root>
        <HStack>
          <Field.Label minW="100px" fontSize="sm" {...estilosTituloInput}>
            Dosis
          </Field.Label>
          <Input
            size="sm"
            {...estilosInputBase}
            {...register(`medicamentos.${index}.dosis`)}
          />
        </HStack>
      </Field.Root>

      {/* Vía */}
      <Field.Root>
        <HStack>
          <Field.Label minW="100px" fontSize="sm" {...estilosTituloInput}>
            Vía
          </Field.Label>
          <NativeSelect.Root size="sm">
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

      {/* seccion de CADA */}
      <Field.Root>
        <HStack align="center" gap="2">
          <Field.Label minW="100px" fontSize="sm" {...estilosTituloInput}>
            CADA (horas)
          </Field.Label>
          <Input
            size="sm"
            type="number"
            min={1}
            {...estilosInputBase}
            {...register(`medicamentos.${index}.frecuenciaHoras`, {
              valueAsNumber: true,
              validate: (v) =>
                !v ||
                24 % v === 0 ||
                "Debe ser divisor exacto de 24 (1, 2, 3, 4, 6, 8, 12, 24)",
            })}
          />

          <HStack gap="1">
            {botonesFrecuencia.map((valor) => (
              <Button
                key={valor}
                size="sm"
                color="tema.claro"
                bg={cada === valor ? "tema.llamativo" : "tema.suave"}
                colorScheme="teal"
                onClick={() =>
                  setValue(`medicamentos.${index}.frecuenciaHoras`, valor, {
                    shouldDirty: true,
                    shouldValidate: true,
                  })
                }
              >
                {valor}h
              </Button>
            ))}
          </HStack>
        </HStack>
      </Field.Root>

      {tiempoIndefinido !== "true" && (
        <Field.Root>
          <HStack align="center" gap="2">
            <Field.Label minW="100px" fontSize="sm" {...estilosTituloInput}>
              DURANTE (días)
            </Field.Label>
            <Input
              size="sm"
              type="number"
              min={1}
              {...estilosInputBase}
              {...register(`medicamentos.${index}.duracionDias`, {
                valueAsNumber: true,
              })}
            />
            <HStack gap="1">
              {botonesDuracion.map((valor) => (
                <Button
                  key={valor}
                  size="sm"
                  color="tema.claro"
                  bg={durante === valor ? "tema.llamativo" : "tema.suave"}
                  colorScheme="teal"
                  onClick={() =>
                    setValue(`medicamentos.${index}.duracionDias`, valor, {
                      shouldDirty: true,
                      shouldValidate: true,
                    })
                  }
                >
                  {valor}d
                </Button>
              ))}
            </HStack>
          </HStack>
        </Field.Root>
      )}
      {/* Desde */}
      {/* Desde */}
      <Field.Root>
        <HStack align="center" gap="2">
          <Field.Label minW="100px" fontSize="sm" {...estilosTituloInput}>
            A PARTIR DE
          </Field.Label>
          <Controller
            control={control}
            name={`medicamentos.${index}.desde`}
            render={({ field }) => {
              const valorActual =
                field.value instanceof Date
                  ? field.value
                  : new Date(field.value);

              const botonesFecha = [
                {
                  label: "Ahora",
                  valor: formatoDatetimeLocal(new Date()),
                },
                {
                  label: "Hoy 12pm",
                  valor: (() => {
                    const d = new Date();
                    d.setHours(12, 0, 0, 0);
                    return formatoDatetimeLocal(d);
                  })(),
                },
                {
                  label: "Hoy 4pm",
                  valor: (() => {
                    const d = new Date();
                    d.setHours(16, 0, 0, 0);
                    return formatoDatetimeLocal(d);
                  })(),
                },
                {
                  label: "Hoy 8pm",
                  valor: (() => {
                    const d = new Date();
                    d.setHours(20, 0, 0, 0);
                    return formatoDatetimeLocal(d);
                  })(),
                },
                {
                  label: "Mañana 8am",
                  valor: (() => {
                    const d = new Date();
                    d.setDate(d.getDate() + 1);
                    d.setHours(8, 0, 0, 0);
                    return formatoDatetimeLocal(d);
                  })(),
                },
              ];

              const valorActualISO = formatoDatetimeLocal(valorActual);

              return (
                <>
                  <Input
                    size="sm"
                    type="datetime-local"
                    min={formatoDatetimeLocal(new Date(Date.now() - 86400000))}
                    {...estilosInputBase}
                    value={valorActualISO}
                    onChange={(e) => {
                      const nueva = new Date(e.target.value);
                      field.onChange(nueva);
                    }}
                  />
                  <HStack gap="1">
                    {botonesFecha.map(({ label, valor }) => (
                      <Button
                        key={label}
                        size="sm"
                        variant="solid"
                        bg={
                          Math.abs(
                            new Date(valor).getTime() -
                              new Date(valorActualISO).getTime()
                          ) <=
                          10 * 60 * 1000 // 10 minutos
                            ? "tema.llamativo"
                            : "tema.suave"
                        }
                        color="tema.claro"
                        onClick={() => field.onChange(new Date(valor))}
                      >
                        {label}
                      </Button>
                    ))}
                  </HStack>
                </>
              );
            }}
          />
        </HStack>
      </Field.Root>

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
                if (value === "true") {
                  setValue(`medicamentos.${index}.duracionDias`, undefined, {
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

      {/* Observaciones */}
      <Field.Root>
        <Textarea
          size="sm"
          placeholder="Observaciones"
          {...estilosInputBase}
          {...register(`medicamentos.${index}.observaciones`)}
        />
      </Field.Root>

      {/* Fechas tentativas */}
      {item?.desde &&
        item?.frecuenciaHoras &&
        item?.veces &&
        (() => {
          const fechas = calcularFechas(
            item.desde.toString(),
            item.frecuenciaHoras.toString(),
            item.veces.toString()
          );

          return item.veces === 1 ? (
            <Box
              fontSize="sm"
              px="2"
              py="1"
              borderRadius="lg"
              color="tema.rojo"
              bg="tema.intenso"
            >
              <strong>Aplicación única:</strong> {fechas[0]}
            </Box>
          ) : (
            <Box mt="2">
              <Box
                mb="1"
                fontWeight="semibold"
                fontSize="sm"
                color="tema.suave"
              >
                Fechas tentativas:
              </Box>
              <Wrap gap="2">
                {fechas.map((fecha, i) => (
                  <WrapItem key={i}>
                    <Box
                      fontSize="sm"
                      px="2"
                      py="1"
                      borderRadius="lg"
                      color="tema.claro"
                      bg="tema.suave"
                    >
                      <strong>#{i + 1}</strong>: {fecha}
                    </Box>
                  </WrapItem>
                ))}
              </Wrap>
            </Box>
          );
        })()}

      {/* ¿Para casa? + eliminar */}
      <HStack>
        <Field.Root>
          <HStack>
            <Field.Label minW="100px" fontSize="sm" {...estilosTituloInput}>
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
                  size="sm"
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
          position="absolute" // 🟡 Posicionamiento absoluto
          top="2" // 🟡 Separación desde arriba
          right="2" // 🟡 Separación desde la derecha
          variant="ghost"
          color="tema.rojo"
          size="xs"
          onClick={() => remove(index)}
        >
          <X />
        </Button>
      </HStack>
    </Box>
  );
}
