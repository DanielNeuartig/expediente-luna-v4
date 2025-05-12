// src/components/ui/IconoAnimado.tsx
'use client'

import { Icon, type IconProps } from '@chakra-ui/react'
import { motion } from 'framer-motion'
import { type Variants } from 'framer-motion'

const MotionIcon = motion(Icon)

type Props = {
  icono: IconProps['as']
  variante: Variants
  size?: number
}

export default function IconoAnimado({ icono, variante, size = 5 }: Props) {
  return (
    <MotionIcon
      as={icono}
      boxSize={size}
      mr={2}
      aria-hidden="true"
      variants={variante}
      initial="initial"
      animate="animate"
    />
  )
}