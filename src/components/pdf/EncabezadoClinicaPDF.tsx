// components/pdf/EncabezadoClinicaPDF.tsx
"use client";
import { View, Text, Image, StyleSheet } from "@react-pdf/renderer";

export default function EncabezadoClinicaPDF() {
  return (
    <View style={styles.headerContainer}>
      <Image src="/imagenes/LogoELDOCsm.png" style={styles.logo} />
      <View style={styles.clinicaInfo}>
        <Text style={styles.header}>ELDOC | Centro Veterinario</Text>
        <Text style={styles.subheader}>
          Dirección: Av. Fidel Velazquez 288-4, San Elías, 44240 Guadalajara, Jal.
        </Text>
        <Text style={styles.subheader}>Teléfono: 33 1485 8130</Text>
        <Text style={styles.subheader}>
          Horario: lunes a viernes de 10 a 2 y de 4 a 7 · Sábados de 10 a 3 · domingos de 11 a 1
        </Text>
        <Text style={styles.subheader}>
          www.eldoc.vet · contacto@eldoc.vet
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  headerContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    marginBottom: 10,
  },
  logo: {
    width: 80,
    height: 80,
    marginRight: 8,
  },
  clinicaInfo: {
    flexDirection: "column",
    flexGrow: 1,
  },
  header: {
    fontSize: 16,
    fontWeight: "bold",
  },
  subheader: {
    fontSize: 10,
  },
});