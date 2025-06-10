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
  Box,
} from "@chakra-ui/react";
import BoxMascota from "../BoxMascota";
import { useForm, FormProvider, useFieldArray } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useState } from "react";
import { estilosInputBase } from "../config/estilosInputBase";
import { estilosBotonEspecial } from "../config/estilosBotonEspecial";
import {
  ArrowUpIcon,
  ArrowDownIcon,
  CheckIcon,
  HelpCircleIcon,
} from "lucide-react";

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
  estudio?: string;
};

export default function DrawerResultadosGPT({
  resultados,
  isOpen,
  onClose,
  mascota,
  solicitudId,
  tipoEstudioId,
  fechaToma,
  estudio,
}: Props) {
  const [referencias, setReferencias] = useState<Record<
    string,
    { minimo: number | null; maximo: number | null; unidad: string | null }
  > | null>(null);
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
    watch,
    formState: { errors, isValid },
  } = methods;

  const { fields } = useFieldArray({
    control,
    name: "resultados",
  });

  // Cargar resultados GPT en campos
  useEffect(() => {
    if (Array.isArray(resultados?.datos)) {
      const analitosCompletos: ResultadoGPT[] = analitosEsperados.map(
        (nombre) => {
          const encontrado = resultados.datos.find((r) => r.nombre === nombre);
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

  // Cargar referencias desde la API
  useEffect(() => {
    console.log("🎯 Ejecutando useEffect de referencias...");
    console.log("🔍 Estudio:", estudio);
    console.log("🔍 Especie:", mascota?.especie);

    if (!isOpen || !estudio || !mascota?.especie) return;

    const fetchReferencias = async () => {
      try {
        const res = await fetch(
          `/api/analitos/valores-referencia?estudio=${encodeURIComponent(
            estudio
          )}&especie=${mascota.especie}`
        );
        const data = await res.json();
        type ReferenciaApi = {
          nombre: string;
          minimo: number | null;
          maximo: number | null;
          unidad: string | null;
        };
        const referenciasIndexadas = Object.fromEntries(
          (data as ReferenciaApi[]).map((item) => [
            item.nombre,
            {
              minimo: item.minimo ?? null,
              maximo: item.maximo ?? null,
              unidad: item.unidad ?? null,
            },
          ])
        );
        setReferencias(referenciasIndexadas);
        console.log("📊 Referencias cargadas:", referenciasIndexadas);
      } catch (error) {
        console.error("❌ Error al cargar referencias:", error);
      }
    };

    fetchReferencias();
  }, [isOpen, estudio, mascota?.especie]);

  const onSubmit = async (data: FormValues) => {
    setIsSubmitting(true);
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
      setIsSubmitting(false);
    }
  };

  const renderColumna = (columna: string[]) =>
    columna.map((nombre) => {
      const index = fields.findIndex((f) => f.nombre === nombre);
      if (index === -1) {
        return (
          <HStack key={nombre} gap={2}>
            <HelpCircleIcon size={16} color="gray" />
            <Text fontSize="sm" color="gray.400">
              {nombre} no encontrado
            </Text>
          </HStack>
        );
      }

      const valor = watch(`resultados.${index}.valor`);
      const ref = referencias?.[nombre];

      let icono;
      if (!ref || valor === null || valor === "" || valor === undefined) {
        icono = <HelpCircleIcon size={16} color="gray" />;
      } else if (ref.maximo !== null && Number(valor) > ref.maximo) {
        icono = <ArrowUpIcon size={16} color="red" />;
      } else if (ref.minimo !== null && Number(valor) < ref.minimo) {
        icono = <ArrowDownIcon size={16} color="blue" />;
      } else {
        icono = <CheckIcon size={16} color="green" />;
      }

      return (
        <Field.Root key={nombre} invalid={!!errors.resultados?.[index]?.valor}>
          <HStack gap="1" align="center">
            <Box
              minW="6"
              display="flex"
              alignItems="center"
              justifyContent="center"
              pr="1"
            >
              {icono}
            </Box>
            <Field.Label
              minW="70px"
              mb="0"
              color={
                !ref || valor === null || valor === "" || valor === undefined
                  ? "gray.400"
                  : ref.maximo !== null && Number(valor) > ref.maximo
                  ? "red.300"
                  : ref.minimo !== null && Number(valor) < ref.minimo
                  ? "blue.300"
                  : "green.300"
              }
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
    });

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
                    <Grid templateColumns="repeat(2, 1fr)" gap={2}>
                      <VStack gap={1} align="stretch">
                        {renderColumna(analitosEsperadosColumna1)}
                      </VStack>
                      <VStack gap={1} align="stretch">
                        {renderColumna(analitosEsperadosColumna2)}
                      </VStack>
                    </Grid>
                  </Fieldset.Root>
                  <HStack mt={4}>
                    <Button
                      variant="outline"
                      bg="tema.rojo"
                      color="tema.claro"
                      onClick={() => {
                        reset();
                        onClose();
                      }}
                      disabled={isSubmitting}
                    >
                      Cancelar
                    </Button>
                    <Button
                      {...estilosBotonEspecial}
                      type="submit"
                      colorScheme="teal"
                      disabled={!isValid || isSubmitting}
                      loading={isSubmitting}
                    >
                      Guardar
                    </Button>
                  </HStack>
                </DrawerBody>
                <DrawerFooter />
              </form>
            </FormProvider>
            <DrawerCloseTrigger />
          </DrawerContent>
        </DrawerPositioner>
      </Portal>
    </Drawer.Root>
  );
}
