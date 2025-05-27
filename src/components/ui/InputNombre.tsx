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
  const limpio = valor
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")     // elimina tildes
    .replace(/ñ/gi, "n")                 // ñ → n
    .replace(/ç/gi, "c")                 // ç → c
    .replace(/[^a-zA-Z\s-]/g, "")        // elimina todo lo que no sea letra, espacio o guion

  const formateado = limpio
    .trim()
    .split(/\s+/)
    .map((p) => p.charAt(0).toUpperCase() + p.slice(1).toLowerCase())
    .join(" ");

  setValue("nombre", formateado, { shouldValidate: true });
};

  return (
    <Field.Root required invalid={!!errors.nombre}>
      <Field.Label {...estilosTituloInput}>Nombre completo</Field.Label>
      <Input
        {...estilosInputBase}
        autoFocus
        {...register("nombre")}
        placeholder="Ej. Esmeralda Martinez"
        onBlur={(e) => formatearNombre(e.target.value)} // solo al salir del input
      />
      {errors.nombre && (
        <FieldErrorText>{errors.nombre.message}</FieldErrorText>
      )}
    </Field.Root>
  );
}