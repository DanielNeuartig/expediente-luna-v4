'use client'

import { ChakraProvider } from "@chakra-ui/react"
import {
  ColorModeProvider,
  type ColorModeProviderProps,
} from "./color-mode"
import { SessionProvider } from 'next-auth/react'
import { system } from "@/theme"
import { Toaster } from '@/components/ui/toaster'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'

const queryClient = new QueryClient()

export function Provider({ children, ...props }: ColorModeProviderProps & { children: React.ReactNode }) {
  return (
    <SessionProvider>
        <ChakraProvider value={system}>
          <ColorModeProvider {...props} />
              <QueryClientProvider client={queryClient}>
                {children} 
    </QueryClientProvider>
          <Toaster /> 
        </ChakraProvider>
    </SessionProvider>
  )
}
