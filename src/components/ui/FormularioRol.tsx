'use client'

import {
  RadioCard,
  Icon,
  //VStack,
  Button,
  HStack,
} from '@chakra-ui/react'
import { useRef, useState } from 'react'
import { PawPrint } from 'lucide-react'
import TarjetaBase from './TarjetaBase'

const items = [
  {
    icon: <PawPrint />,
    value: 'PROPIETARIO',
    title: 'PROPIETARIO',
    description: 'de mascotas',
  },
  {
    icon: <PawPrint />,
    value: 'ADMINISTRADOR',
    title: 'ADMINISTRADOR',
    description: 'de una clínica veterinaria',
  },
  {
    icon: <PawPrint />,
    value: 'MEDICO',
    title: 'MEDICO',
    description: 'de una clínica veterinaria ó independiente',
  },
  {
    icon: <PawPrint />,
    value: 'AUXILIAR',
    title: 'AUXILIAR',
    description: 'de una clínica veterinaria ó independiente',
  },
]

export default function FormularioRol() {
  const ref = useRef<HTMLFormElement>(null)
  const [mensaje, setMensaje] = useState<string | null>(null)

  const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const form = new FormData(ref.current!)
    const rol = form.get('rol')
    if (!rol) {
      setMensaje('Debes seleccionar un rol')
    } else {
      setMensaje(`Rol seleccionado: ${rol}`)
    }
  }

  return (
    <TarjetaBase>
      <form onSubmit={onSubmit} ref={ref}>
        <RadioCard.Root name="rol" defaultValue="">
          <HStack align="stretch" wrap="wrap">
            {items.map((item) => (
              <RadioCard.Item key={item.value} value={item.value}>
                <RadioCard.ItemHiddenInput />
                <RadioCard.ItemControl>
                  <RadioCard.ItemContent>
                    <Icon fontSize="2xl" mb="2">
                      {item.icon}
                    </Icon>
                    <RadioCard.ItemText>{item.title}</RadioCard.ItemText>
                    <RadioCard.ItemDescription>
                      {item.description}
                    </RadioCard.ItemDescription>
                  </RadioCard.ItemContent>
                  <RadioCard.ItemIndicator />
                </RadioCard.ItemControl>
              </RadioCard.Item>
            ))}
          </HStack>
        </RadioCard.Root>

        <Button type="submit" mt="6" w="full" colorScheme="teal">
          Confirmar rol
        </Button>

        {mensaje && (
          <p style={{ marginTop: '1rem', fontWeight: 'bold' }}>
            {mensaje}
          </p>
        )}
      </form>
    </TarjetaBase>
  )
}