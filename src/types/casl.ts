// src/types/casl.ts

import { User } from '@prisma/client'

export type Subjects = 'Dashboard' | 'Perfil' | 'User' | 'all'

export type Actions = 'view' | 'edit' | 'create' | 'delete' | 'manage'

export interface AppUser extends User {
  // puedes extender con más propiedades si deseas
}