'use client'

import { useState } from 'react'
import { Button, Box } from '@chakra-ui/react'
import { pdf } from '@react-pdf/renderer'
import { PerfilPDF } from './PerfilPDF'

export default function VerPerfilIntegrado({ perfil }: { perfil: any }) {
  const [pdfUrl, setPdfUrl] = useState<string | null>(null)

  const handleGenerarPDF = async () => {
    const blob = await pdf(<PerfilPDF perfil={perfil} />).toBlob()
    const url = URL.createObjectURL(blob)
    setPdfUrl(url)
  }

  return (
    <Box mt="4">
      <Button onClick={handleGenerarPDF} variant="outline" colorScheme="teal" size="sm">
        Mostrar PDF en la página
      </Button>

      {pdfUrl && (
        <Box mt="4" border="1px solid #ccc" borderRadius="md" overflow="hidden">
          <iframe
            src={pdfUrl}
            width="100%"
            height="600px"
            style={{ border: 'none' }}
          />
        </Box>
      )}
    </Box>
  )
}