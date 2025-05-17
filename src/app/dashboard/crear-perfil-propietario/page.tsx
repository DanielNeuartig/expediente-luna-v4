'use client'

import FormularioPerfil from '@/components/ui/FormularioPerfil'
import { GridItem } from '@chakra-ui/react'

export default function CrearPerfilClinicaPage() {
  return (
    <>
      <GridItem colStart={1} rowStart={1} display="flex" justifyContent="center" alignItems="start">
        <FormularioPerfil mostrarVerificacionSMS={false} />
      </GridItem>



    </>
  )
}