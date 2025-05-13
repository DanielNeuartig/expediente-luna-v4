// src/types/casl.ts

import { User } from '@prisma/client'

export type Subjects = 'Dashboard' | 'Perfil' | 'User' | 'all'

export type Actions = 'view' | 'edit' | 'create' | 'delete' | 'manage'

export interface AppUser extends User {
    __casl?: true 
  // puedes extender con más propiedades si deseas
}