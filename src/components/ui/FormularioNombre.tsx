'use client'

import { Box, Button, Input, Text, VStack } from "@chakra-ui/react"
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { useState } from 'react'
import { useForm } from 'react-hook-form'

const schema = z.object({
  nombre: z.string().min(5, 'El nombre debe contener al menos 5 caracteres'),
  apellido: z.string().min(5, 'El nombre debe contener al menos 5 caracteres'),
})

type FormData = z.infer<typeof schema>

export default function FormularioNombre() {
  const [resultado, setResultado] = useState<string | null>(null)

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<FormData>({
    resolver: zodResolver(schema),
  })

  const onSubmit = async (data: FormData) => {
    const res = await fetch('/api/concatenar', {
      method: 'POST',
      body: JSON.stringify(data),
      headers: { 'Content-Type': 'application/json' },
    })

    const json = await res.json()
    if (res.ok) {
      setResultado(json.nombreCompleto)
    } else {
      setResultado('Error: ' + json.error)
    }
  }

  return (
    <Box p="4" maxW="400px" mx="auto">
      <form onSubmit={handleSubmit(onSubmit)}>
        <VStack>
          <Box w="full">
            <label>
              <Text mb="1" fontSize="sm" fontWeight="medium">
                Nombre
              </Text>
              <Input {...register('nombre')} />
              {errors.nombre && (
                <Text color="red.500" fontSize="xs">
                  {errors.nombre.message}
                </Text>
              )}
            </label>
          </Box>

          <Box w="full">
            <label>
              <Text mb="1" fontSize="sm" fontWeight="medium">
                Apellido
              </Text>
              <Input {...register('apellido')} />
              {errors.apellido && (
                <Text color="red.500" fontSize="xs">
                  {errors.apellido.message}
                </Text>
              )}
            </label>
          </Box>

          <Button type="submit" loading={isSubmitting} w="full">
            Enviar
          </Button>

          {resultado && (
            <Text fontWeight="bold" mt="2">
              Resultado: {resultado}
            </Text>
          )}
        </VStack>
      </form>
    </Box>
  )
}