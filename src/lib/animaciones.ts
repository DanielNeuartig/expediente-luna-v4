// src/lib/animaciones.ts
import { Variants } from 'framer-motion'

export const animacionAparecer: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.4, ease: 'easeOut' } },
}

export const animacionLlamativo: Variants = {
  initial: { scale: 1 },
  animate: {
    scale: [1, 1.5, 1],
    transition: { duration: 0.6, ease: 'easeInOut', repeat: Infinity, repeatDelay: 1.8 },
  },
}

export const animacionNegar: Variants = {
  initial: { x: 0 },
  animate: {
    x: [-10, 10, -8, 8, -5, 5, 0],
    transition: { duration: 0.5, ease: 'easeInOut' },
  },
}