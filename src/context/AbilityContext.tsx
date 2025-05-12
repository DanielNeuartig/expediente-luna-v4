// src/context/AbilityContext.tsx
'use client'

import { createContext } from 'react'
import { AbilityBuilder, createMongoAbility } from '@casl/ability'
import type { AppAbility, Actions, Subjects } from '@/types/casl'

export const AbilityContext = createContext<AppAbility>(
  createMongoAbility([]) as AppAbility
)

export function definirHabilidadesPorRol(rol: Actions): AppAbility {
  const { can, rules } = new AbilityBuilder<AppAbility>(createMongoAbility)

  switch (rol) {
    case 'CEO':
    case 'ADMIN':
      can('manage', 'all')
      break
    case 'MEDICO':
      can('view', 'Dashboard')
      can('view', 'Perfil')
      break
    case 'AUXILIAR':
      can('view', 'Dashboard')
      can('view', 'Perfil')
      break
    case 'PROPIETARIO':
      can('view', 'Perfil')
      break
    default:
      break
  }

  return createMongoAbility(rules) as AppAbility
}