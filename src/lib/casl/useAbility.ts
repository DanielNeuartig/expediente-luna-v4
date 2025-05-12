// src/lib/casl/useAbility.ts
'use client'

import { useContext } from 'react'
import { AbilityContext } from '@/context/AbilityContext'

export function useAbility() {
  const ability = useContext(AbilityContext)
  if (!ability) {
    throw new Error('useAbility debe usarse dentro de un AbilityContext.Provider')
  }
  return ability
}