import { createSystem, defaultConfig } from '@chakra-ui/react'

export const system = createSystem(defaultConfig, {
  theme: {
    tokens: {
      colors: {
        brand: {
          50: { value: '#e0f7f9' },
          100: { value: '#b2ebf2' },
          200: { value: '#80deea' },
          300: { value: '#4dd0e1' },
          400: { value: '#26c6da' },
          500: { value: '#00adb5' },
          600: { value: '#0097a7' },
          700: { value: '#00838f' },
          800: { value: '#006064' },
          900: { value: '#004d40' },
        },
        fondo: {
          base: { value: '#f7f8fa' },
          caja: { value: '#ffffff' },
          oscuro: { value: '#222831' },
          claro: { value: '#EEEEEE' },
        },
        texto: {
          primario: { value: '#222831' },
          secundario: { value: '#393E46' },
          claro: { value: '#EEEEEE' },
        },
      },
      fonts: {
        heading: { value: `'Poppins', sans-serif` },
        body: { value: `'Open Sans', sans-serif` },
      },
      radii: {
        xl: { value: '1rem' },
        '2xl': { value: '1.5rem' },
      },
    },
  },
})