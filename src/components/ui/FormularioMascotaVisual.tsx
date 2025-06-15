"use client";

import {
  Box,
  Button,
  Field,
  Input,
  NativeSelect,
  Stack,
  Textarea,
} from "@chakra-ui/react";
import { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { useForm, FormProvider } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { estilosInputBase } from "@/components/ui/config/estilosInputBase";
import { estilosTituloInput } from "@/components/ui/config/estilosTituloInput";
import { estilosBotonEspecial } from "@/components/ui/config/estilosBotonEspecial";
import { mascotaSchema } from "@/lib/validadores/mascotaSchema";
import { toaster } from "@/components/ui/toaster";
import InputRaza from "@/components/ui/InputRaza";
import {
  differenceInYears,
  differenceInMonths,
  differenceInDays,
  parseISO,
} from "date-fns";
import InputNombreFormateado from "./InputNombreFormateado";
import { useRegistrarMascota } from "@/hooks/useRegistrarMascota";

type FormValues = z.infer<typeof mascotaSchema>;

export default function FormularioMascotaVisual() {
  const [botonDeshabilitado, setBotonDeshabilitado] = useState(false);
  const params = useParams();
  const router = useRouter();
  const perfilId = Number(params?.id);
  const registrarMascota = useRegistrarMascota();

  const methods = useForm<FormValues>({
    resolver: zodResolver(mascotaSchema),
    defaultValues: {
      especie: "CANINO",
      alergias: "Negadas",
      señas: "Ninguna",
    },
    mode: "onTouched",
    reValidateMode: "onChange",
  });

  const {
    register,
    handleSubmit,
    getValues,
    watch,
    formState: { errors },
  } = methods;
  const onSubmit = async (data: FormValues) => {
    if (!perfilId || isNaN(perfilId)) {
      toaster.create({
        type: "error",
        description: "ID de perfil no disponible",
      });
      return;
    }

    const datos = { ...data, perfilId };
    setBotonDeshabilitado(true); // ⛔️ Desactiva el botón

    await toaster.promise(
      new Promise<void>((resolve, reject) => {
        registrarMascota.mutate(datos, {
          onSuccess: (mascota) => {
            resolve(); // 🟢 no se reactiva, ya que redirige
            router.push(`/dashboard/mascotas/${mascota.id}`);
          },
          onError: (error) => {
            setBotonDeshabilitado(false); // 🔁 vuelve a habilitar si hay error
            reject(error);
          },
        });
      }),
      {
        loading: {
          title: "Registrando mascota...",
          description: "Por favor espera un momento",
        },
        success: {
          title: "Mascota registrada",
          description: `Mascota "${data.nombre}" registrada con éxito`,
        },
        error: {
          title: "Error al registrar",
          description: "Revisa los campos e intenta de nuevo",
        },
      }
    );
  };

  const handleVerDatos = () => {
    const datos = getValues();
    console.log("📋 Datos actuales del formulario:", { ...datos, perfilId });
  };

  const fechaNacimiento = watch("fechaNacimiento");

  const calcularEdad = (fecha: string | undefined) => {
    if (!fecha) return null;
    const nacimiento = parseISO(fecha);
    const hoy = new Date();
    const años = differenceInYears(hoy, nacimiento);
    const meses = differenceInMonths(hoy, nacimiento) % 12;
    const días = differenceInDays(hoy, nacimiento) % 30;
    return `${años}A, ${meses}M, ${días}D`;
  };

  return (
    <FormProvider {...methods}>
      <Box
        as="form"
        onSubmit={(e) => {
          e.preventDefault();
          void handleSubmit(onSubmit)(e);
        }}
      >
        <input
          type="hidden"
          value={perfilId}
          {...register("perfilId", { value: perfilId })}
        />
        <Stack gap="4" align="flex-start">
          <InputNombreFormateado name="nombre" label="Nombre" autoFocus />

          <Stack direction="row" gap="4" width="100%">
            <Field.Root invalid={!!errors.especie} flex="1">
              <Field.Label {...estilosTituloInput}>Especie</Field.Label>
              <NativeSelect.Root>
                <NativeSelect.Field
                  placeholder="Selecciona especie"
                  {...register("especie")}
                  {...estilosInputBase}
                >
                  <option value="CANINO">Canino 🐶</option>
                  <option value="FELINO">Felino 🐱</option>
                  <option value="AVE_PSITACIDA">Ave psitácida 🦜</option>
                  <option value="AVE_OTRA">Otra ave 🐦</option>
                  <option value="OFIDIO">Ofidio 🐍</option>
                  <option value="QUELONIO">Quelonio 🐢</option>
                  <option value="LAGARTIJA">Lagartija 🦎</option>
                  <option value="ROEDOR">Roedor 🐹</option>
                  <option value="LAGOMORFO">Lagomorfo 🐰</option>
                  <option value="HURON">Hurón 🦡</option>
                  <option value="PORCINO">Porcino 🐷</option>
                  <option value="OTRO">Otro ❓</option>
                </NativeSelect.Field>
                <NativeSelect.Indicator />
              </NativeSelect.Root>
              <Field.ErrorText>{errors.especie?.message}</Field.ErrorText>
            </Field.Root>

            <InputRaza />

            <Field.Root invalid={!!errors.sexo} flex="1">
              <Field.Label {...estilosTituloInput}>Sexo</Field.Label>
              <NativeSelect.Root>
                <NativeSelect.Field
                  placeholder="Selecciona sexo"
                  {...register("sexo")}
                  {...estilosInputBase}
                >
                  <option value="MACHO">Macho 🔵</option>
                  <option value="HEMBRA">Hembra 🟣</option>
                  <option value="DESCONOCIDO">Desconocido ⚫️</option>
                </NativeSelect.Field>
                <NativeSelect.Indicator />
              </NativeSelect.Root>
              <Field.ErrorText>{errors.sexo?.message}</Field.ErrorText>
            </Field.Root>
          </Stack>

          <Stack direction="row" gap="4" width="100%">
            <Field.Root flex="1" invalid={!!errors.fechaNacimiento}>
              <Field.Label {...estilosTituloInput}>
                F. de nacimiento
              </Field.Label>
              {fechaNacimiento && (
                <Box color="gray.500" fontSize="sm">
                  Edad: {calcularEdad(fechaNacimiento)}
                </Box>
              )}
              <Input
                type="date"
                {...register("fechaNacimiento")}
                {...estilosInputBase}
              />
              <Field.ErrorText>
                {errors.fechaNacimiento?.message}
              </Field.ErrorText>
            </Field.Root>

            <Field.Root invalid={!!errors.esterilizado} flex="1">
              <Field.Label {...estilosTituloInput}>Esterilizado</Field.Label>
              <NativeSelect.Root>
                <NativeSelect.Field
                  placeholder="Selecciona estado"
                  {...register("esterilizado")}
                  {...estilosInputBase}
                >
                  <option value="ESTERILIZADO">SÍ ✅</option>
                  <option value="NO_ESTERILIZADO">NO ❌</option>
                  <option value="DESCONOCIDO">Desconocido ❓</option>
                </NativeSelect.Field>
                <NativeSelect.Indicator />
              </NativeSelect.Root>
              <Field.ErrorText>{errors.esterilizado?.message}</Field.ErrorText>
            </Field.Root>

            <Field.Root flex="1">
              <Field.Label {...estilosTituloInput}>Color</Field.Label>
              <Textarea {...register("color")} {...estilosInputBase} />
            </Field.Root>
          </Stack>

          <Field.Root>
            <Field.Label {...estilosTituloInput}>Alergias</Field.Label>
            <Textarea {...register("alergias")} {...estilosInputBase} />
          </Field.Root>

          <Field.Root>
            <Field.Label {...estilosTituloInput}>Señas</Field.Label>
            <Textarea {...register("señas")} {...estilosInputBase} />
          </Field.Root>

          <Field.Root>
            <Field.Label {...estilosTituloInput}>Microchip</Field.Label>
            <Input {...register("microchip")} {...estilosInputBase} />
          </Field.Root>

          <Stack direction="row" gap="3" pt="2">
            <Button
              type="submit"
              loading={botonDeshabilitado}
              disabled={botonDeshabilitado}
              {...estilosBotonEspecial}
            >
              Registrar mascota
            </Button>
            <Button onClick={handleVerDatos} {...estilosBotonEspecial}>
              Ver datos en consola (debug)
            </Button>
          </Stack>
        </Stack>
      </Box>
    </FormProvider>
  );
}
