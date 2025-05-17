'use client'

import { Button } from '@chakra-ui/react'
import { saveAs } from 'file-saver'
import { pdf } from '@react-pdf/renderer'
import { PerfilPDF } from './PerfilPDF'

export default function DescargarPerfilPDF({ perfil }: { perfil: any }) {
  const handleDescargarPDF = async () => {
    const blob = await pdf(<PerfilPDF perfil={perfil} />).toBlob()
    saveAs(blob, `perfil_${perfil.nombre}.pdf`)
  }

  return (
    <Button
      onClick={handleDescargarPDF}
      size="sm"
      variant="outline"
      mt="4"
      colorScheme="teal"
    >
      Descargar perfil en PDF
    </Button>
  )
}