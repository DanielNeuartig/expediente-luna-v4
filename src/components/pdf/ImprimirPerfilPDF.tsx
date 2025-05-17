'use client'

import { Button } from '@chakra-ui/react'
import { pdf } from '@react-pdf/renderer'
import { PerfilPDF } from './PerfilPDF'

export default function ImprimirPerfilPDF({ perfil }: { perfil: any }) {
  const handleImprimir = async () => {
    const blob = await pdf(<PerfilPDF perfil={perfil} />).toBlob()
    const url = URL.createObjectURL(blob)
    const printWindow = window.open(url)

    if (printWindow) {
      printWindow.onload = () => {
        printWindow.focus()
        printWindow.print()
      }
    }
  }

  return (
    <Button
      onClick={handleImprimir}
      size="sm"
      variant="outline"
      mt="4"
      colorScheme="teal"
    >
      Imprimir perfil
    </Button>
  )
}