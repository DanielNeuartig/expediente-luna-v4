'use client'

import {
  HStack,
  Field,
  Input,
  FieldErrorText,
} from '@chakra-ui/react'
import { useFormContext } from 'react-hook-form'
import { PerfilFormData } from '@/lib/validadores/perfilSchema'

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
    <HStack align="start" gap={2} w="full">
      <Field.Root required flex="1" invalid={!!errors.clave}>
        <Field.Label color="tema.claro">Clave telefónica</Field.Label>
        <Input
          {...register('clave')}
          placeholder="Ej. +52"
          autoComplete="off"
          bg="tema.suave"
          color="tema.intenso"
          border="none"
          borderRadius="md"
          _focus={{
            bg: 'whiteAlpha.900',
            boxShadow: 'sm',
            border: 'none',
          }}
        />
        {errors.clave && (
          <FieldErrorText color="tema.llamativo">
            {errors.clave.message}
          </FieldErrorText>
        )}
      </Field.Root>

      <Field.Root required flex="3" invalid={!!errors.telefonoPrincipal}>
        <Field.Label color="tema.claro">Teléfono principal</Field.Label>
        <Input
          {...register('telefonoPrincipal')}
          placeholder="Ej. 33 12 34 56 78"
          inputMode="numeric"
          autoComplete="off"
          onChange={(e) => formatearTelefono(e.target.value)}
          bg="tema.suave"
          color="tema.intenso"
          border="none"
          borderRadius="md"
          _focus={{
            bg: 'whiteAlpha.900',
            boxShadow: 'sm',
            border: 'none',
          }}
        />
        {errors.telefonoPrincipal && (
          <FieldErrorText color="tema.llamativo">
            {errors.telefonoPrincipal.message}
          </FieldErrorText>
        )}
      </Field.Root>
    </HStack>
  )
}