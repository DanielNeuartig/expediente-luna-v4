'use client'

import {
  HStack,
  Field,
  Input,
  FieldErrorText,
} from '@chakra-ui/react'
import { useFormContext } from 'react-hook-form'
import { PerfilFormData } from '@/lib/validadores/perfilSchema'
import { estilosInputBase } from './config/estilosInputBase'
import { estilosTituloInput } from './config/estilosTituloInput'

export default function InputTelefonoConClave() {
  const {
    register,
    setValue,
    formState: { errors },
  } = useFormContext<PerfilFormData>()

  const formatearTelefono = (valor: string) => {
    const limpio = valor.replace(/\D/g, '').slice(0, 10)
    const formateado = limpio.replace(/(\d{2})(?=\d)/g, '$1 ').trim()
    setValue('telefonoPrincipal', formateado, { shouldValidate: true })
  }

  return (
    <HStack align="stretch" gap={2} w="full">
      <Field.Root
        required
        flex="1"
        invalid={!!errors.clave}
        display="flex"
        flexDirection="column"
        justifyContent="stretch"
      >
        <Field.Label {...estilosTituloInput}>Clave</Field.Label>
        <Input
          {...estilosInputBase}
          {...register('clave')}
          placeholder="Ej. +52"
          autoComplete="off"
        />
        {errors.clave && (
          <FieldErrorText>{errors.clave.message}</FieldErrorText>
        )}
      </Field.Root>

      <Field.Root
        required
        flex="3"
        invalid={!!errors.telefonoPrincipal}
        display="flex"
        flexDirection="column"
        justifyContent="stretch"
      >
        <Field.Label {...estilosTituloInput}>Teléfono principal</Field.Label>
        <Input
          {...estilosInputBase}
          {...register('telefonoPrincipal')}
          placeholder="Ej. 33 12 34 56 78"
          inputMode="numeric"
          autoComplete="off"
          onChange={(e) => formatearTelefono(e.target.value)}
        />
        {errors.telefonoPrincipal && (
          <FieldErrorText>{errors.telefonoPrincipal.message}</FieldErrorText>
        )}
      </Field.Root>
    </HStack>
  )
}