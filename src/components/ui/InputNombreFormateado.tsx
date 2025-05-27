// src/components/ui/InputNombreFormateado.tsx
"use client";

import { Field, Input, FieldErrorText } from "@chakra-ui/react";
import { useFormContext } from "react-hook-form";
import { estilosInputBase } from "@/components/ui/config/estilosInputBase";
import { estilosTituloInput } from "./config/estilosTituloInput";

type Props = {
  name: string;
  label: string;
  placeholder?: string;
  autoFocus?: boolean;
};

export default function InputNombreFormateado({
  name,
  label,
  placeholder = "Ej. Pedro Gomez",
  autoFocus = false,
}: Props) {
  const {
    register,
    setValue,
    formState: { errors },
  } = useFormContext();

  const formatearNombre = (valor: string) => {
    const limpio = valor
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/ñ/gi, "n")
      .replace(/ç/gi, "c")
      .replace(/[^a-zA-Z\s-]/g, "");

    const formateado = limpio
      .trim()
      .split(/\s+/)
      .map((p) => p.charAt(0).toUpperCase() + p.slice(1).toLowerCase())
      .join(" ");

    setValue(name, formateado, { shouldValidate: true });
  };

  const error = errors?.[name as keyof typeof errors];

  return (
    <Field.Root required invalid={!!error}>
      <Field.Label {...estilosTituloInput}>{label}</Field.Label>
      <Input
        {...estilosInputBase}
        autoFocus={autoFocus}
        {...register(name)}
        placeholder={placeholder}
        onBlur={(e) => formatearNombre(e.target.value)}
      />
      {error && (
        <FieldErrorText>
          {typeof error?.message === "string" ? error.message : null}
        </FieldErrorText>
      )}
    </Field.Root>
  );
}