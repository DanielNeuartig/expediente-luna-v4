// src/components/formulario/VerificacionSMS.tsx
'use client'

import {
  HStack,
  Field,
  Input,
  FieldErrorText,
  Button,
} from '@chakra-ui/react'
import { useFormContext } from 'react-hook-form'
import { PerfilFormData } from '@/lib/validadores/perfilSchema'
import { useState } from 'react'
import { toaster } from '@/components/ui/toaster'
import { estilosTituloInput } from './config/estilosTituloInput'
import { estilosBotonEspecial } from './config/estilosBotonEspecial'
import { estilosInputBase } from './config/estilosInputBase'

export default function VerificacionSMS() {
  const {
    register,
    watch,
    setValue,
    formState: { errors },
  } = useFormContext<PerfilFormData>()

  const clave = watch('clave')
  const telefonoPrincipal = watch('telefonoPrincipal')
  const [enviando, setEnviando] = useState(false)

  const enviarCodigo = async () => {
    if (!clave || !telefonoPrincipal) {
      console.warn('⛔️ Clave o teléfono vacío:', { clave, telefonoPrincipal })
      return
    }

    const telefonoSinEspacios = telefonoPrincipal.replace(/\D/g, '')

    setEnviando(true)
    try {
      const res = await fetch('/api/enviar/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ clave, telefono: telefonoSinEspacios }),
      })

      const json = await res.json()

      if (!res.ok) {
        toaster.create({ description: json.error || 'Error al enviar el código', type: 'error' })
        return
      }

      toaster.create({ description: 'Código enviado con éxito', type: 'info' })
    } catch (error: unknown) {
      const mensaje = error instanceof Error ? error.message : 'Error desconocido'
      console.error('❌ Error de red:', mensaje)
      toaster.create({ description: mensaje, type: 'error' })
    } finally {
      setEnviando(false)
    }
  }

  return (
    <HStack gap={2} align="end" mt={2}>
            <Button
        {...estilosBotonEspecial}
        disabled={
          enviando ||
          !/^\+\d{1,3}$/.test(clave) ||
          !/^\d{2}(?: \d{2}){4}$/.test(telefonoPrincipal)
        }
        onClick={enviarCodigo}
      >
        Enviar código
      </Button>
      <Field.Root required maxW="xs" invalid={!!errors.codigoVerificacion}>
        <Field.Label {...estilosTituloInput}>Código de verificación</Field.Label>
        <Input
          {...register('codigoVerificacion')}
          {...estilosInputBase}
          placeholder="1234"
          inputMode="numeric"
          autoComplete="off"
          maxLength={4}
          onChange={(e) =>
            setValue('codigoVerificacion', e.target.value.replace(/\D/g, ''), {
              shouldValidate: true,
            })
          }
        />
        {errors.codigoVerificacion && (
          <FieldErrorText>{errors.codigoVerificacion.message}</FieldErrorText>
        )}
      </Field.Root>


    </HStack>
  )
}