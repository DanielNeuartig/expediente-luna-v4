"use client";

import {
  Drawer,
  Portal,
  Field,
  Fieldset,
  Input,
  VStack,
  Button,
  DrawerCloseTrigger,
  DrawerBackdrop,
  DrawerPositioner,
  DrawerContent,
  DrawerHeader,
  Badge,
  DrawerBody,
  DrawerFooter,
  DrawerTrigger,
  HStack,
  Grid,
  Text,
} from "@chakra-ui/react";
import BoxMascota from "../BoxMascota";
import { useForm, FormProvider, useFieldArray } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect } from "react";
import { estilosInputBase } from "../config/estilosInputBase";
import { estilosBotonEspecial } from "../config/estilosBotonEspecial";
import { useState } from "react"; // ya lo tienes implícito

export type ResultadoMascota = {
  id: number;
  nombre: string;
  tipo: "mascota";
  especie?: string;
  fechaNacimiento?: string;
  raza?: string;
  sexo?: "MACHO" | "HEMBRA" | "DESCONOCIDO";
  esterilizado?: "ESTERILIZADO" | "NO_ESTERILIZADO" | "DESCONOCIDO";
  microchip?: string | null;
  activo?: boolean;
  perfilId?: number;
  nombrePerfil?: string | null;
};

// Analitos por columna
const analitosEsperadosColumna1 = [
  "WBC",
  "Neu#",
  "Lym#",
  "Mon#",
  "Eos#",
  "Neu%",
  "Lym%",
  "Mon%",
  "Eos%",
];

const analitosEsperadosColumna2 = [
  "RBC",
  "HGB",
  "HCT",
  "MCV",
  "MCH",
  "MCHC",
  "RDW-CV",
  "RDW-SD",
  "PLT",
  "MPV",
  "PDW",
  "PCT",
  "P-LCC",
  "P-LCR",
];

const analitosEsperados = [
  ...analitosEsperadosColumna1,
  ...analitosEsperadosColumna2,
];

const ResultadoEntradaSchema = z.object({
  nombre: z.string(),
  valor: z.union([z.string(), z.number(), z.null()]),
});

const ResultadoSchema = ResultadoEntradaSchema.transform((item) => ({
  nombre: item.nombre,
  valor:
    item.valor === null || item.valor === ""
      ? null
      : isNaN(Number(item.valor))
      ? null
      : Number(item.valor),
}));

const FormSchema = z.object({
  resultados: z.array(ResultadoSchema),
});

type FormValues = z.input<typeof FormSchema>;

type ResultadoGPT = {
  nombre: string;
  valor: number | null;
};

type Props = {
  isOpen: boolean;
  onClose: () => void;
  resultados: { datos: ResultadoGPT[] } | null;
  mascota: ResultadoMascota;
  tipoEstudioId?: string;
  solicitudId?: number;
  fechaToma?: string;
};

export default function DrawerResultadosGPT({
  resultados,
  isOpen,
  onClose,
  mascota,
  solicitudId,
  tipoEstudioId,
  fechaToma,
}: Props) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const methods = useForm<FormValues>({
    resolver: zodResolver(FormSchema),
    defaultValues: { resultados: [] },
    mode: "onChange",
  });

  const {
    control,
    register,
    handleSubmit,
    reset,
    formState: { errors, isValid },
  } = methods;

  const { fields } = useFieldArray({
    control,
    name: "resultados",
  });

  useEffect(() => {
    if (Array.isArray(resultados?.datos)) {
      const analitosCompletos: ResultadoGPT[] = analitosEsperados.map(
        (nombre) => {
          const encontrado = resultados.datos.find(
            (r: { nombre: string; valor: number | null }) => r.nombre === nombre
          );
          return {
            nombre,
            valor:
              typeof encontrado?.valor === "number" && !isNaN(encontrado.valor)
                ? encontrado.valor
                : null,
          };
        }
      );
      reset({ resultados: analitosCompletos });
    }
  }, [resultados, reset]);

  const onSubmit = async (data: FormValues) => {
    setIsSubmitting(true); // 👈 deshabilita botones

    try {
      const payload = {
        solicitudId,
        tipoEstudioId,
        fechaToma,
        resultados: data.resultados,
      };

      const res = await fetch("/api/laboratoriales/crear", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const json = await res.json();

      if (!res.ok) {
        console.error("Error al guardar:", json.error);
        return;
      }

      console.log("✅ Laboratorial creado:", json.laboratorial);
      onClose();
    } catch (error) {
      console.error("Error en la solicitud:", error);
    } finally {
      setIsSubmitting(false); // ✅ reactiva si quieres permitir reintento
    }
  };

  return (
    <Drawer.Root open={isOpen} onOpenChange={onClose}>
      <DrawerTrigger asChild>
        <span style={{ display: "none" }} />
      </DrawerTrigger>

      <Portal>
        <DrawerBackdrop />
        <DrawerPositioner>
          <DrawerContent maxW="2xl" bg="tema.intenso" maxH="100dvh">
            <DrawerHeader>
              <BoxMascota mascota={mascota} />
              <Badge
                bg="tema.llamativo"
                p="3"
                borderRadius="xl"
                mb="3"
                animation="floatGlow"
              >
                <Text fontSize="xl" fontWeight="bold" color="tema.claro">
                  Análisis por IA
                </Text>
              </Badge>
            </DrawerHeader>

            <FormProvider {...methods}>
              <form onSubmit={handleSubmit(onSubmit)}>
                <DrawerBody overflowY="auto" maxH="calc(100dvh - 12rem)" px={6}>
                  <Fieldset.Root>
                    <Grid
                      templateColumns={{ base: "1fr", md: "repeat(2, 1fr)" }}
                      gap={2}
                    >
                      {/* Columna 1 */}
                      <VStack gap={1} align="stretch">
                        {analitosEsperadosColumna1.map((nombre) => {
                          const index = fields.findIndex(
                            (f) => f.nombre === nombre
                          );
                          if (index === -1) return null;
                          return (
                            <Field.Root
                              key={`col1-${nombre}`}
                              invalid={!!errors.resultados?.[index]?.valor}
                            >
                              <HStack gap="1" align="center">
                                <Field.Label
                                  color="tema.claro"
                                  minW="70px"
                                  mb="0"
                                >
                                  {nombre}
                                </Field.Label>
                                <Input
                                  type="number"
                                  step="any"
                                  size="sm"
                                  w="100%"
                                  {...estilosInputBase}
                                  {...register(`resultados.${index}.valor`)}
                                />
                              </HStack>
                              <Field.ErrorText>
                                {errors.resultados?.[index]?.valor?.message}
                              </Field.ErrorText>
                            </Field.Root>
                          );
                        })}
                      </VStack>

                      {/* Columna 2 */}
                      <VStack gap={1} align="stretch">
                        {analitosEsperadosColumna2.map((nombre) => {
                          const index = fields.findIndex(
                            (f) => f.nombre === nombre
                          );
                          if (index === -1) return null;
                          return (
                            <Field.Root
                              key={`col2-${nombre}`}
                              invalid={!!errors.resultados?.[index]?.valor}
                            >
                              <HStack gap="1" align="center">
                                <Field.Label
                                  color="tema.claro"
                                  minW="70px"
                                  mb="0"
                                >
                                  {nombre}
                                </Field.Label>
                                <Input
                                  type="number"
                                  step="any"
                                  size="sm"
                                  w="100%"
                                  {...estilosInputBase}
                                  {...register(`resultados.${index}.valor`)}
                                />
                              </HStack>
                              <Field.ErrorText>
                                {errors.resultados?.[index]?.valor?.message}
                              </Field.ErrorText>
                            </Field.Root>
                          );
                        })}
                      </VStack>
                    </Grid>
                  </Fieldset.Root>
                  <Button
                    variant="outline"
                    bg="tema.rojo"
                    color="tema.claro"
                    onClick={() => {
                      reset();
                      onClose();
                    }}
                    disabled={isSubmitting} // 👈 aquí
                  >
                    Cancelar
                  </Button>
                  <Button
                    {...estilosBotonEspecial}
                    type="submit"
                    colorScheme="teal"
                    ml={1}
                    disabled={!isValid || isSubmitting} // 👈 aquí
                    loading={isSubmitting} // 👈 muestra spinner opcional
                  >
                    Guardar
                  </Button>
                </DrawerBody>

                <DrawerFooter></DrawerFooter>
              </form>
            </FormProvider>

            <DrawerCloseTrigger />
          </DrawerContent>
        </DrawerPositioner>
      </Portal>
    </Drawer.Root>
  );
}
