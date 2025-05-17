// src/components/formulario/InputNombre.tsx
"use client";

import { Field, Input, FieldErrorText } from "@chakra-ui/react";
import { useFormContext } from "react-hook-form";
import { PerfilFormData } from "@/lib/validadores/perfilSchema";
import { estilosInputBase } from "@/components/ui/config/estilosInputBase";
import { estilosTituloInput } from "./config/estilosTituloInput";
export default function InputNombre() {
  const {
    register,
    setValue,
    formState: { errors },
  } = useFormContext<PerfilFormData>();

  const formatearNombre = (valor: string) => {
    const formateado = valor
      .split(" ")
      .map((p) => p.charAt(0).toUpperCase() + p.slice(1).toLowerCase())
      .join(" ");
    setValue("nombre", formateado, { shouldValidate: true });
  };

  return (
    <Field.Root required invalid={!!errors.nombre}>
      <Field.Label {...estilosTituloInput}>
        Nombre completo
      </Field.Label>
      <Input

{...estilosInputBase}
        autoFocus
        {...register("nombre")}
        placeholder="Ej. Daniel López"
        

        onChange={(e) => formatearNombre(e.target.value)}
      />
      {errors.nombre && (
        <FieldErrorText>{errors.nombre.message}</FieldErrorText>
      )}
    </Field.Root>
  );
}
