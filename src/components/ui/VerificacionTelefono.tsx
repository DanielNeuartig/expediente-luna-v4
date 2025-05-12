'use client'

import { useEffect, useState } from 'react'
import {
  Input,
  Stack,
  Text,
  Button,
  Spinner,
  InputGroup,
} from '@chakra-ui/react'
import { useFormContext } from 'react-hook-form'
import { verificarTelefono } from '@/lib/validadores/telefono'
import { toaster } from '@/components/ui/toaster'
import { MENSAJES } from '@/lib/mensajes'

export default function VerificacionTelefono() {
  const { watch, setValue, register, formState } = useFormContext()
  const clave = watch('clave') ?? ''
  const telefono = watch('telefono') ?? ''
  const codigo = watch('codigo') ?? ''
  const { errors } = formState

  const [enviando, setEnviando] = useState(false)
  const [codigoVerificado, setCodigoVerificado] = useState(false)

  const { claveFormateada, numeroFormateado, valido: telefonoValido } =
    verificarTelefono(clave, telefono)

  const manejarRespuesta = async (
    url: string,
    datos: any,
    onOk: () => void,
    mensajeOk: string
  ) => {
    try {
      const res = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(datos),
      })
      const json = await res.json()
      if (res.ok) {
        onOk()
        toaster.create({ description: mensajeOk, type: 'success' })
      } else {
        toaster.create({ description: json.error || MENSAJES.errorServidor, type: 'error' })
      }
    } catch {
      toaster.create({ description: MENSAJES.errorRed, type: 'error' })
    }
  }

  const enviarCodigo = () => {
    if (!telefonoValido) {
      toaster.create({ description: MENSAJES.telefonoInvalido, type: 'error' })
      return
    }
    setEnviando(true)
    manejarRespuesta(
      '/api/sms',
      { clave: claveFormateada, telefono: numeroFormateado },
      () => {},
      MENSAJES.codigoEnviado
    ).finally(() => setEnviando(false))
  }

  const confirmarCodigo = () => {
    if (telefonoValido && codigo.length === 4) {
      manejarRespuesta(
        '/api/sms/verificar',
        { clave: claveFormateada, telefono: numeroFormateado, codigo },
        () => setCodigoVerificado(true),
        MENSAJES.telefonoVerificado
      )
    }
  }

  useEffect(() => {
    if (!telefonoValido) {
      setValue('codigo', '')
    }
  }, [clave, telefono, setValue, telefonoValido])

  return (
    <Stack gap={3}>
      <Stack direction="row">
        <InputGroup startElement={<Text ml={2} fontWeight="bold" color="gray.500">+</Text>}>
          <Input
            placeholder="Clave"
            maxLength={3}
            inputMode="numeric"
            {...register('clave')}
            value={clave}
            onChange={(e) =>
              setValue('clave', e.target.value.replace(/\D/g, '').slice(0, 3))
            }
          />
        </InputGroup>
        <Input
          placeholder="Teléfono principal"
          maxLength={14}
          inputMode="numeric"
          {...register('telefono')}
          value={telefono.replace(/\D/g, '').replace(/(..)(?=.)/g, '$1 ')}
          onChange={(e) => {
            const limpio = e.target.value.replace(/\D/g, '')
            if (limpio.length <= 10) setValue('telefono', limpio)
          }}
        />
      </Stack>

      <Button
        onClick={enviarCodigo}
        colorScheme="green"
        disabled={!telefonoValido || codigoVerificado || enviando}
        w="full"
      >
        {enviando ? <Spinner size="sm" mr={2} /> : null}
        {MENSAJES.verificarNumero}
      </Button>

      <Input
        placeholder="Código de verificación"
        {...register('codigo')}
        value={codigo}
        maxLength={4}
        inputMode="numeric"
        onChange={(e) =>
          setValue('codigo', e.target.value.replace(/\D/g, '').slice(0, 4))
        }
      />

      <Button
        onClick={confirmarCodigo}
        colorScheme="blue"
        w="full"
        disabled={codigo.length !== 4 || codigoVerificado}
      >
        {MENSAJES.confirmarCodigo}
      </Button>

      {errors.telefono && (
        <Text color="red.500" fontSize="sm">
          {(errors.telefono as any)?.message}
        </Text>
      )}
    </Stack>
  )
}