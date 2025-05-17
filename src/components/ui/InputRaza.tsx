// src/components/ui/InputRaza.tsx
'use client'

import {
  Field,
  FieldErrorText,
  NativeSelect,
} from '@chakra-ui/react'
import { useFormContext } from 'react-hook-form'
import { MascotaFormData } from '@/lib/validadores/mascotaSchema'
import { useRazas } from '@/hooks/useRazas'
import { estilosInputBase } from './config/estilosInputBase'
import { estilosTituloInput } from './config/estilosTituloInput'
import { useEffect } from 'react'

export default function InputRaza() {
  const {
    register,
    watch,
    setValue,
    formState: { errors },
  } = useFormContext<MascotaFormData>()

  const especie = watch('especie') // ✅ Observa el valor de especie
  const { data: razas = [], isLoading } = useRazas(especie)

  // ✅ Limpia razaId cuando cambia la especie
  useEffect(() => {
    setValue('razaId', undefined)
  }, [especie, setValue])

  return (
    <Field.Root invalid={!!errors.razaId} flex="1">
      <Field.Label {...estilosTituloInput}>Raza</Field.Label>
      <NativeSelect.Root size="md">
        <NativeSelect.Field
          placeholder="Selecciona una raza"
          disabled={isLoading}
          {...register('razaId', { valueAsNumber: true })}
          {...estilosInputBase}
        >
          {razas.map((raza) => (
            <option key={raza.id} value={raza.id}>
              {raza.nombre}
            </option>
          ))}
        </NativeSelect.Field>
        <NativeSelect.Indicator />
      </NativeSelect.Root>
      {errors.razaId && (
        <FieldErrorText>{errors.razaId.message}</FieldErrorText>
      )}
    </Field.Root>
  )
}