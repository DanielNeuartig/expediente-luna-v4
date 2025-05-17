// src/components/formulario/InputTelefonosAdicionales.tsx
'use client'

import {
  Field,
  Input,
  FieldErrorText,
  Stack,
} from '@chakra-ui/react'
import { useFormContext } from 'react-hook-form'
import { PerfilFormData } from '@/lib/validadores/perfilSchema'
import { estilosInputBase } from './config/estilosInputBase'
import { estilosTituloInput } from './config/estilosTituloInput'

export default function InputTelefonosAdicionales() {
  const {
    register,
    setValue,
    formState: { errors },
  } = useFormContext<PerfilFormData>()

  const formatearTelefono = (
    valor: string,
    campo: keyof PerfilFormData
  ) => {
    const limpio = valor.replace(/\D/g, '').slice(0, 10)
    const formateado = limpio.replace(/(\d{2})(?=\d)/g, '$1 ').trim()
    setValue(campo, formateado, { shouldValidate: true })
  }

  return (
    <Stack gap={3}>
      <Field.Root flex="1" invalid={!!errors.telefonoSecundario1}>
        <Field.Label {...estilosTituloInput}>Teléfono secundario 1</Field.Label>
        <Input
                {...estilosInputBase}
          {...register('telefonoSecundario1')}
          placeholder="Opcional"
          inputMode="numeric"
          autoComplete="off"
          onChange={(e) =>
            formatearTelefono(e.target.value, 'telefonoSecundario1')
          }
        />
        {errors.telefonoSecundario1 && (
          <FieldErrorText>{errors.telefonoSecundario1.message}</FieldErrorText>
        )}
      </Field.Root>

      <Field.Root flex="1" invalid={!!errors.telefonoSecundario2}>
        <Field.Label {...estilosTituloInput}>Teléfono secundario 2</Field.Label>
        <Input
        {...estilosInputBase}
          {...register('telefonoSecundario2')}
          placeholder="Opcional"
          inputMode="numeric"
          autoComplete="off"
          onChange={(e) =>
            formatearTelefono(e.target.value, 'telefonoSecundario2')
          }
        />
        {errors.telefonoSecundario2 && (
          <FieldErrorText>{errors.telefonoSecundario2.message}</FieldErrorText>
        )}
      </Field.Root>
    </Stack>
  )
}