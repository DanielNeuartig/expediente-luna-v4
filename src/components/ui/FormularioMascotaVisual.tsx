// src/components/ui/FormularioMascotaVisual.tsx
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
import { useParams } from "next/navigation";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { estilosInputBase } from "@/components/ui/config/estilosInputBase";
import { estilosTituloInput } from "@/components/ui/config/estilosTituloInput";
import { estilosBotonEspecial } from "@/components/ui/config/estilosBotonEspecial";
import { mascotaSchema } from "@/lib/validadores/mascotaSchema";
import { toaster } from "@/components/ui/toaster";
import {
  differenceInYears,
  differenceInMonths,
  differenceInDays,
  parseISO,
} from "date-fns";

type FormValues = z.infer<typeof mascotaSchema>;

export default function FormularioMascotaVisual() {
  const params = useParams();
  const perfilId = Number(params?.id);

  const {
    register,
    handleSubmit,
    getValues,
    watch,
    formState: { errors },
  } = useForm<FormValues>({
    resolver: zodResolver(mascotaSchema),
    mode: "onTouched",
    reValidateMode: "onChange",
  });

  const onSubmit = handleSubmit(async (data) => {

    if (!perfilId || isNaN(perfilId)) {
      toaster.create({ type: "error", description: "ID de perfil no disponible" });
      return;
    }

    const datosFormateados = {
      ...data,
      perfilId,
    };
console.log("🧪 El submit se ejecutó");
alert("🚀 Enviando al backend"); // ← prueba visual definitiva
    try {
      const res = await fetch("/api/mascota", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(datosFormateados),
      });

      const json = await res.json();

      if (!res.ok) {
        toaster.create({ type: "error", description: json.error || "Error al registrar mascota" });
        return;
      }

      toaster.create({ type: "success", description: "Mascota registrada con éxito" });
    } catch (error) {
      toaster.create({ type: "error", description: "No se pudo conectar al servidor" });
    }
  });

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
    <Box as="form" onSubmit={onSubmit}>
      <input type="hidden" value={perfilId} {...register("perfilId", { value: perfilId })} />
      <Stack gap="4" align="flex-start">
        <Field.Root invalid={!!errors.nombre}>
          <Field.Label {...estilosTituloInput}>Nombre</Field.Label>
          <Input {...register("nombre")} {...estilosInputBase} />
          <Field.ErrorText>{errors.nombre?.message}</Field.ErrorText>
        </Field.Root>

        <Stack direction="row" gap="4" width="100%">
          <Field.Root invalid={!!errors.especie} flex="1">
            <Field.Label {...estilosTituloInput}>Especie</Field.Label>
            <NativeSelect.Root>
              <NativeSelect.Field
                placeholder="Selecciona especie"
                {...register("especie")}
                {...estilosInputBase}
              >
                <option value="CANINO">Canino</option>
                <option value="FELINO">Felino</option>
                <option value="AVE">Ave</option>
                <option value="REPTIL">Reptil</option>
                <option value="ROEDOR">Roedor</option>
                <option value="OTRO">Otro</option>
              </NativeSelect.Field>
              <NativeSelect.Indicator />
            </NativeSelect.Root>
            <Field.ErrorText>{errors.especie?.message}</Field.ErrorText>
          </Field.Root>

          <Field.Root flex="1">
            <Field.Label {...estilosTituloInput}>Raza</Field.Label>
            <Input
              type="number"
              {...register("razaId", { valueAsNumber: true })}
              {...estilosInputBase}
            />
          </Field.Root>

          <Field.Root invalid={!!errors.sexo} flex="1">
            <Field.Label {...estilosTituloInput}>Sexo</Field.Label>
            <NativeSelect.Root>
              <NativeSelect.Field
                placeholder="Selecciona sexo"
                {...register("sexo")}
                {...estilosInputBase}
              >
                <option value="MACHO">Macho</option>
                <option value="HEMBRA">Hembra</option>
                <option value="DESCONOCIDO">Desconocido</option>
              </NativeSelect.Field>
              <NativeSelect.Indicator />
            </NativeSelect.Root>
            <Field.ErrorText>{errors.sexo?.message}</Field.ErrorText>
          </Field.Root>
        </Stack>

        <Stack direction="row" gap="4" width="100%">
          <Field.Root flex="1" invalid={!!errors.fechaNacimiento}>
            <Field.Label {...estilosTituloInput}>F. de nacimiento</Field.Label>
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
                <option value="ESTERILIZADO">Esterilizado</option>
                <option value="NO_ESTERILIZADO">No esterilizado</option>
                <option value="DESCONOCIDO">Desconocido</option>
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
          <Button type="submit" >
            Registrar mascota
          </Button>
          <Button
  onClick={() => {
    const result = getValues();
    console.log("🌐 getValues():", result);
  }}
>
  Mostrar valores
</Button>
          <Button onClick={handleVerDatos} {...estilosBotonEspecial}>
            Ver datos en consola
          </Button>
        </Stack>
      </Stack>
    </Box>
  );
}