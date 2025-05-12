import { createSystem, defaultConfig } from "@chakra-ui/react"
import '@fontsource-variable/geologica';

export const system = createSystem(defaultConfig, {
  theme: {
    tokens: {
      fonts: {
        heading: { value: `'Geologica Variable', sans-serif` },
        body: { value: `'Geologica Variable', sans-serif` },
      },
    },
  },
})