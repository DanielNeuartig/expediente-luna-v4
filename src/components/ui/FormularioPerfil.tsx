'use client'

import {
  Fieldset,
  Field,
  Input,
  Button,
  Stack,
  HStack,
  FieldErrorText,
} from '@chakra-ui/react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { perfilSchema, PerfilFormData } from '@/lib/validadores/perfilSchema'
import { toaster } from '@/components/ui/toaster'
import { useRouter } from 'next/navigation'
import { useMutation } from '@tanstack/react-query'
import { crearPerfil } from '@/lib/api/crearPerfil'

export default function FormularioPerfilVisual() {
  const router = useRouter()

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors, isValid },
  } = useForm<PerfilFormData>({
    resolver: zodResolver(perfilSchema),
    mode: 'onChange',
    defaultValues: {
      clave: '+52',
    },
  })

  const clave = watch('clave')
  const telefonoPrincipal = watch('telefonoPrincipal')

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

  const formatearNombre = (valor: string) => {
    const formateado = valor
      .split(' ')
      .map((p) => p.charAt(0).toUpperCase() + p.slice(1).toLowerCase())
      .join(' ')
    setValue('nombre', formateado, { shouldValidate: true })
  }

  const formatearTelefono = (valor: string, campo: keyof PerfilFormData) => {
    const limpio = valor.replace(/\D/g, '').slice(0, 10)
    const formateado = limpio.replace(/(\d{2})(?=\d)/g, '$1 ').trim()
    setValue(campo, formateado, { shouldValidate: true })
  }

  const formatearCodigo = (valor: string) => {
    setValue('codigoVerificacion', valor.replace(/\D/g, '').slice(0, 4), {
      shouldValidate: true,
    })
  }

  const onSubmit = async (data: PerfilFormData) => {
    await mutateAsync(data)
  }

  const enviarCodigo = async () => {
    if (!clave || !telefonoPrincipal) {
      console.warn('⛔️ Clave o teléfono vacío:', { clave, telefonoPrincipal })
      return
    }

    const telefonoSinEspacios = telefonoPrincipal.replace(/\D/g, '')

    try {
      const res = await fetch('/api/enviar/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          clave,
          telefono: telefonoSinEspacios,
        }),
      })

      const json = await res.json()

      if (!res.ok) {
        toaster.create({
          description: json.error || 'Error al enviar el código',
          type: 'error',
        })
        return
      }

      toaster.create({
        description: 'Código enviado con éxito',
        type: 'info',
      })
    } catch (error: unknown) {
      const mensaje = error instanceof Error ? error.message : 'Error desconocido'
      console.error('❌ Error de red:', mensaje)
      toaster.create({
        description: mensaje,
        type: 'error',
      })
    }
  }

  return (
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
            <Field.Root required invalid={!!errors.nombre}>
              <Field.Label>Nombre completo</Field.Label>
              <Input
                {...register('nombre')}
                placeholder="Ej. Daniel López"
                onChange={(e) => formatearNombre(e.target.value)}
              />
              {errors.nombre && <FieldErrorText>{errors.nombre.message}</FieldErrorText>}
            </Field.Root>

            <HStack align="start" gap={2}>
              <Field.Root required flex="1" invalid={!!errors.clave}>
                <Field.Label>Clave telefónica</Field.Label>
                <Input
                  {...register('clave')}
                  placeholder="Ej. +52"
                  autoComplete="off"
                />
                {errors.clave && <FieldErrorText>{errors.clave.message}</FieldErrorText>}
              </Field.Root>

              <Field.Root required flex="3" invalid={!!errors.telefonoPrincipal}>
                <Field.Label>Teléfono principal</Field.Label>
                <Input
                  {...register('telefonoPrincipal')}
                  placeholder="Ej. 33 12 34 56 78"
                  inputMode="numeric"
                  autoComplete="off"
                  onChange={(e) =>
                    formatearTelefono(e.target.value, 'telefonoPrincipal')
                  }
                />
                {errors.telefonoPrincipal && (
                  <FieldErrorText>{errors.telefonoPrincipal.message}</FieldErrorText>
                )}
              </Field.Root>
            </HStack>

            <HStack align="end" gap={2}>
              <Field.Root required flex="2" invalid={!!errors.codigoVerificacion}>
                <Field.Label>Código de verificación</Field.Label>
                <Input
                  {...register('codigoVerificacion')}
                  placeholder="1234"
                  inputMode="numeric"
                  autoComplete="off"
                  onChange={(e) => formatearCodigo(e.target.value)}
                />
                {errors.codigoVerificacion && (
                  <FieldErrorText>{errors.codigoVerificacion.message}</FieldErrorText>
                )}
              </Field.Root>
              <Button
                mt="6"
                disabled={
                  !/^\+\d{1,3}$/.test(clave) ||
                  !/^\d{2}(?: \d{2}){4}$/.test(telefonoPrincipal)
                }
                onClick={enviarCodigo}
              >
                Enviar código
              </Button>
            </HStack>

            <Field.Root flex="1" invalid={!!errors.telefonoSecundario1}>
              <Field.Label>Teléfono secundario 1</Field.Label>
              <Input
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
              <Field.Label>Teléfono secundario 2</Field.Label>
              <Input
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
  )
}