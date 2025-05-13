// src/lib/api/crearPerfil.ts
import { PerfilFormData } from '@/lib/validadores/perfilSchema'

export async function crearPerfil(data: PerfilFormData) {
  const res = await fetch('/api/perfil', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  })

  const json = await res.json()

  if (!res.ok) {
      console.error('❌ Error backend:', json) //
    throw new Error(json.error || 'Error al crear el perfil')
  }

  return json
}