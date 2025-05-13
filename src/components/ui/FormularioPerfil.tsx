// src/components/formulario/FormularioPerfil.tsx
'use client'

import {
  Fieldset,
  Button,
  Stack,
} from '@chakra-ui/react'
import { FormProvider, useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { perfilSchema, PerfilFormData } from '@/lib/validadores/perfilSchema'
import { useRouter } from 'next/navigation'
import { useMutation } from '@tanstack/react-query'
import { crearPerfil } from '@/lib/api/crearPerfil'
import { toaster } from '@/components/ui/toaster'
import InputNombre from './InputNombre'
import InputTelefonoConClave from './InputTelefonoConClave'
import VerificacionSMS from './VerificacionSMS'
import InputTelefonosAdicionales from './InputTelefonosAdicionales'
import TarjetaBase from './TarjetaBase'

interface FormularioPerfilProps {
  mostrarVerificacionSMS?: boolean
}

export default function FormularioPerfil({ mostrarVerificacionSMS = true }: FormularioPerfilProps) {
  const router = useRouter()

  const methods = useForm<PerfilFormData>({
    resolver: zodResolver(perfilSchema),
    mode: 'onChange',
    defaultValues: {
      clave: '+52',
    },
  })

  const { handleSubmit, formState: { isValid } } = methods

  const { mutateAsync, isPending } = useMutation({
    mutationFn: crearPerfil,
    onSuccess: () => {
      toaster.create({
        description: 'Perfil creado exitosamente',
        type: 'success',
      })
      router.push('/dashboard')
    },
    onError: (error: unknown) => {
      const mensaje = error instanceof Error ? error.message : 'Error desconocido'
      toaster.create({
        description: mensaje,
        type: 'error',
      })
    },
  })

  const onSubmit = async (data: PerfilFormData) => {
    const datosAEnviar = { ...data }

    if (!mostrarVerificacionSMS) {
      delete datosAEnviar.codigoVerificacion
    }

    await mutateAsync(datosAEnviar)
  }

  return (
    <TarjetaBase>
      <FormProvider {...methods}>
        <form onSubmit={handleSubmit(onSubmit)}>
          <Fieldset.Root size="lg" maxW="md">
            <Stack gap={4}>
              <Stack>
                <Fieldset.Legend>Crear perfil</Fieldset.Legend>
                <Fieldset.HelperText>
                  Completa los campos obligatorios para continuar.
                </Fieldset.HelperText>
              </Stack>

              <Fieldset.Content>
                <InputNombre />
                <InputTelefonoConClave />
                {mostrarVerificacionSMS && <VerificacionSMS />}
                <InputTelefonosAdicionales />
              </Fieldset.Content>

              <Button
                type="submit"
                alignSelf="flex-start"
                colorScheme="blue"
                loading={isPending}
                disabled={!isValid}
              >
                Guardar perfil
              </Button>
            </Stack>
          </Fieldset.Root>
        </form>
      </FormProvider>
    </TarjetaBase>
  )
}