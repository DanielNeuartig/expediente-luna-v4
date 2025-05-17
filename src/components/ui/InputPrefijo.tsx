'use client'

import { NativeSelect, Field } from '@chakra-ui/react'
import { useFormContext } from 'react-hook-form'

export function InputPrefijo() {
  const {
    register,
    formState: { errors },
  } = useFormContext()

  const error = errors.prefijo?.message as string | undefined

  return (
    <Field.Root required invalid={!!error}>
      <Field.Label>Prefijo profesional</Field.Label>

      <NativeSelect.Root size="md" width="100%">
        <NativeSelect.Field placeholder="Selecciona un prefijo" {...register('prefijo')}>
          <option value="">Selecciona un prefijo</option>
          <option value="TUTOR">TUTOR</option>
          <option value="MVZ">MVZ</option>
          <option value="MVZ_DIPL_CERT">MVZ DIPLOMADO CERT.</option>
          <option value="MVZ_ESP_DIPL_CERT">MVZ ESP. DIPLOMADO CERT.</option>
          <option value="MVZ_ESP">MVZ ESP.</option>
          <option value="MV">MV</option>
          <option value="MV_DIPL_CERT">MV DIPLOMADO CERT.</option>
          <option value="MV_ESP_DIPL_CERT">MV ESP. DIPLOMADO CERT.</option>
          <option value="MV_ESP">MV ESP.</option>
        </NativeSelect.Field>
        <NativeSelect.Indicator />
      </NativeSelect.Root>

      <Field.ErrorText>{error}</Field.ErrorText>
    </Field.Root>
  )
}