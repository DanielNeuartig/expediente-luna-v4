'use client'

import { Button } from '@chakra-ui/react'
import { pdf } from '@react-pdf/renderer'
import { PerfilPDF } from './PerfilPDF'

export default function VerPerfilPDF({ perfil }: { perfil: any }) {
  const handleVerPDF = async () => {
    const blob = await pdf(<PerfilPDF perfil={perfil} />).toBlob()
    const url = URL.createObjectURL(blob)
    window.open(url, '_blank') // solo abre, sin imprimir ni descargar
  }

  return (
    <Button
      onClick={handleVerPDF}
      size="sm"
      variant="outline"
      mt="4"
      colorScheme="teal"
    >
      Ver perfil en PDF
    </Button>
  )
}