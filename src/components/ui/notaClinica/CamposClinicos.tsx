"use client";

import { Field, HStack, Input, Stack, Textarea } from "@chakra-ui/react";
import { estilosInputBase } from "../config/estilosInputBase";
import { estilosTituloInput } from "../config/estilosTituloInput";
import { useFormContext } from "react-hook-form";

export default function CamposClinicos() {
  const { register } = useFormContext();

  return (
    <Stack gap="4">
      <HStack>
        <Field.Root>
          <Field.Label {...estilosTituloInput}>Historia clínica</Field.Label>
          <Textarea {...estilosInputBase} {...register("historiaClinica")} />
        </Field.Root>
        <Field.Root>
          <Field.Label {...estilosTituloInput}>Exploración física</Field.Label>
          <Textarea {...estilosInputBase} {...register("exploracionFisica")} />
        </Field.Root>
      </HStack>

      <HStack>
        <Field.Root>
          <Field.Label {...estilosTituloInput}>Temperatura (°C)</Field.Label>
          <Input
            {...estilosInputBase}
            type="number"
            step="0.1"
            min="0"
            {...register("temperatura")}
          />
        </Field.Root>
        <Field.Root>
          <Field.Label {...estilosTituloInput}>Peso (kg)</Field.Label>
          <Input
            {...estilosInputBase}
            type="number"
            step="0.1"
            min="0"
            {...register("peso")}
          />
        </Field.Root>
        <Field.Root>
          <Field.Label {...estilosTituloInput}>FC</Field.Label>
          <Input
            {...estilosInputBase}
            type="number"
            step="1"
            min="0"
            {...register("frecuenciaCardiaca")}
          />
        </Field.Root>
        <Field.Root>
          <Field.Label {...estilosTituloInput}>FR</Field.Label>
          <Input
            {...estilosInputBase}
            type="number"
            step="1"
            min="0"
            {...register("frecuenciaRespiratoria")}
          />
        </Field.Root>
      </HStack>

      <HStack>
        <Field.Root>
          <Field.Label {...estilosTituloInput}>
            Diagnóstico presuntivo
          </Field.Label>
          <Textarea
            {...estilosInputBase}
            {...register("diagnosticoPresuntivo")}
          />
        </Field.Root>
        <Field.Root>
          <Field.Label {...estilosTituloInput}>Pronóstico</Field.Label>
          <Textarea {...estilosInputBase} {...register("pronostico")} />
        </Field.Root>
      </HStack>

      <HStack>
        <Field.Root>
          <Field.Label {...estilosTituloInput}>Laboratoriales</Field.Label>
         {/* <Textarea {...estilosInputBase} {...register("laboratoriales")} />*/}
        </Field.Root>
        <Field.Root>
          <Field.Label {...estilosTituloInput}>Extras</Field.Label>
          <Textarea {...estilosInputBase} {...register("extras")} />
        </Field.Root>
      </HStack>
    </Stack>
  );
}