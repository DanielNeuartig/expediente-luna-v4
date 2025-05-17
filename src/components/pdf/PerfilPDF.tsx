// src/components/pdf/PerfilPDF.tsx
import { Document, Page, Text, View, StyleSheet } from '@react-pdf/renderer'

const styles = StyleSheet.create({
  page: { padding: 30, fontSize: 12, fontFamily: 'Helvetica' },
  section: { marginBottom: 10 },
  title: { fontSize: 18, marginBottom: 10, textAlign: 'center' },
  label: { fontWeight: 'bold' },
})

export function PerfilPDF({ perfil }: { perfil: any }) {
  const formatearTelefono = (telefono: string) =>
    telefono?.replace(/\D/g, "").replace(/(\d{2})(?=\d)/g, "$1 ").trim()

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        <Text style={styles.title}>Ficha de perfil</Text>

        <View style={styles.section}>
          <Text><Text style={styles.label}>Nombre:</Text> {perfil.nombre}</Text>
          <Text>
            <Text style={styles.label}>Teléfono principal:</Text>{" "}
            {perfil.clave} {formatearTelefono(perfil.telefonoPrincipal)}
          </Text>
          {perfil.telefonoSecundario1 && (
            <Text>
              <Text style={styles.label}>Tel. secundario 1:</Text>{" "}
              {formatearTelefono(perfil.telefonoSecundario1)}
            </Text>
          )}
          {perfil.telefonoSecundario2 && (
            <Text>
              <Text style={styles.label}>Tel. secundario 2:</Text>{" "}
              {formatearTelefono(perfil.telefonoSecundario2)}
            </Text>
          )}
          <Text>
            <Text style={styles.label}>Teléfono verificado:</Text>{" "}
            {perfil.telefonoVerificado ? "Sí" : "No"}
          </Text>
          <Text>
            <Text style={styles.label}>Tiene usuario:</Text>{" "}
            {perfil.usuario ? "Sí" : "No"}
          </Text>
          <Text>
            <Text style={styles.label}>Creado por:</Text>{" "}
            {perfil.creadoPor?.perfil?.nombre ?? "—"}
          </Text>
          <Text>
            <Text style={styles.label}>Creado en:</Text>{" "}
            {new Date(perfil.creadoEn).toLocaleString()}
          </Text>
        </View>
      </Page>
    </Document>
  )
}