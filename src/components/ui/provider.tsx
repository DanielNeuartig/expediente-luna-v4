'use client'

import { ChakraProvider } from "@chakra-ui/react"
import {
  ColorModeProvider,
  type ColorModeProviderProps,
} from "./color-mode"
import { SessionProvider, useSession } from 'next-auth/react'
import { system } from "@/theme"
import { AbilityContext, definirHabilidadesPorRol } from '@/context/AbilityContext'
import { useMemo } from "react"
import { Toaster } from '@/components/ui/toaster'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'

const queryClient = new QueryClient()

export function Provider({ children, ...props }: ColorModeProviderProps & { children: React.ReactNode }) {
  return (
    <SessionProvider>
      <AbilityWrapper>
        <ChakraProvider value={system}>
          <ColorModeProvider {...props} />
              <QueryClientProvider client={queryClient}>
                {children} 
    </QueryClientProvider>
          <Toaster /> 
        </ChakraProvider>
      </AbilityWrapper>
    </SessionProvider>
  )
}

function AbilityWrapper({ children }: { children: React.ReactNode }) {
  const { data: session } = useSession()

  const ability = useMemo(() => {
    //const rol = session?.user?.rol || 'PROPIETARIO'
    //return definirHabilidadesPorRol(rol)
  }, [session])

  return (
    <AbilityContext.Provider value={ability}>
      {children}
    </AbilityContext.Provider>
  )
}