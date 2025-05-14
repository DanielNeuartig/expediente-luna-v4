'use client'

import { Box } from '@chakra-ui/react'
import { motion } from 'framer-motion'
import { animacionAparecer } from '@/lib/animaciones'

const MotionBox = motion(Box)

export default function TarjetaBase({ children }: { children: React.ReactNode }) {
  return (
    <MotionBox
      variants={animacionAparecer}
      initial="hidden"
      animate="visible"
      maxW="sm"
      w="100%"
      mx="auto"
      mt={10}
      p={6}
      borderWidth={1}
      borderRadius="xl"
      boxShadow="sm"
      bg="tema.llamativo"
    >
      {children}
    </MotionBox>
  )
}