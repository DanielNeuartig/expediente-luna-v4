"use client";

import {
  Box,
  Button,
  Field,
  Fieldset,
  Input,
} from "@chakra-ui/react";
import {
  useFieldArray,
  useFormContext,
} from "react-hook-form";
import { estilosBotonEspecial } from "../config/estilosBotonEspecial";
import { estilosInputBase } from "../config/estilosInputBase";
import { estilosTituloInput } from "../config/estilosTituloInput";
import type { NotaClinicaValues } from "@/lib/validadores/notaClinicaSchema";

type Indicacion = NonNullable<NotaClinicaValues["indicaciones"]>[number];

export default function ListaIndicaciones() {
  const {
    control,
    register,
  } = useFormContext();

  const { fields, append, remove } = useFieldArray({
    control,
    name: "indicaciones",
  });

  return (
    <>
      {fields.map((field, index) => (
        <Box key={field.id} borderWidth="2px" p="4" rounded="md" borderColor="green.600" bg="green.50">
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
      ))}

      <Button
        {...estilosBotonEspecial}
        onClick={() =>
          append({
            descripcion: "",
          } as Indicacion)
        }
        type="button"
        mb={2}
      >
        Añadir indicación
      </Button>
    </>
  );
}