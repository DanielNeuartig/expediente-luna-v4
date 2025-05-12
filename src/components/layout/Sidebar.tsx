'use client'

import { Box, VStack, Text } from '@chakra-ui/react'

export default function Sidebar() {
  const menu = ['Inicio', 'Pacientes', 'Consultas', 'Configuración']

  return (
    <Box
      as="aside"
      w="64"
      p="4"
      borderRight="1px solid"
      minH="100vh"
    >
      <VStack align="start">
        {menu.map((item) => (
          <Text key={item} fontWeight="medium" >
            {item}
          </Text>
        ))}
      </VStack>
    </Box>
  )
}