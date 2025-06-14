import { View, Text, StyleSheet } from "@react-pdf/renderer";
import type { Mascota } from "@/types/mascota";

function calcularEdad(fechaNacimiento: string, fechaReferencia: string): string {
  const nacimiento = new Date(fechaNacimiento);
  const ref = new Date(fechaReferencia);
  let años = ref.getFullYear() - nacimiento.getFullYear();
  let meses = ref.getMonth() - nacimiento.getMonth();
  let días = ref.getDate() - nacimiento.getDate();

  if (días < 0) {
    meses--;
    días += new Date(ref.getFullYear(), ref.getMonth(), 0).getDate();
  }
  if (meses < 0) {
    años--;
    meses += 12;
  }

  return [
    años && `${años} año${años > 1 ? "s" : ""}`,
    meses && `${meses} mes${meses > 1 ? "es" : ""}`,
    días && `${días} día${días > 1 ? "s" : ""}`,
  ]
    .filter(Boolean)
    .join(", ");
}

export default function BloqueMascotaPDF({
  datosMascota,
  fechaReferencia,
}: {
  datosMascota: Mascota;
  fechaReferencia: string;
}) {
  return (
    <View style={styles.card}>
      <Text style={styles.nombreMascota}>{datosMascota.nombre}</Text>
      <View style={styles.columns}>
        <View style={styles.col}>
          <View style={styles.row}>
            <Text style={styles.label}>Especie:</Text>
            <Text style={styles.value}>{datosMascota.especie}</Text>
          </View>
          {datosMascota.raza?.nombre && (
            <View style={styles.row}>
              <Text style={styles.label}>Raza:</Text>
              <Text style={styles.value}>{datosMascota.raza.nombre}</Text>
            </View>
          )}
          <View style={styles.row}>
            <Text style={styles.label}>Sexo:</Text>
            <Text style={styles.value}>{datosMascota.sexo}</Text>
          </View>
        </View>
        <View style={styles.col}>
          {datosMascota.fechaNacimiento && (
            <View style={styles.row}>
              <Text style={styles.label}>F. de nacimiento:</Text>
              <Text style={styles.value}>
                {new Date(datosMascota.fechaNacimiento).toLocaleDateString("es-MX")}
              </Text>
            </View>
          )}
          {datosMascota.fechaNacimiento && (
            <View style={styles.row}>
              <Text style={styles.label}>Edad:</Text>
              <Text style={styles.value}>
                {calcularEdad(datosMascota.fechaNacimiento, fechaReferencia)}
              </Text>
            </View>
          )}
          <View style={styles.row}>
            <Text style={styles.label}>Esterilizado:</Text>
            <Text style={styles.value}>
              {{
                ESTERILIZADO: "Sí",
                NO_ESTERILIZADO: "No",
                DESCONOCIDO: "Desconocido",
              }[datosMascota.esterilizado]}
            </Text>
          </View>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    padding: 8,
    border: "1pt solid #888",
    borderRadius: 6,
    backgroundColor: "#f9f9f9",
    marginBottom: 10,
  },
  nombreMascota: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#2B6CB0",
    textAlign: "left",
    marginBottom: 6,
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
  columns: {
    flexDirection: "row",
    justifyContent: "space-between",
    gap: 10,
  },
  col: {
    width: "48%",
  },
  row: {
    flexDirection: "row",
    marginBottom: 2,
  },
  label: {
    width: 60,
    fontWeight: "bold",
    color: "#333",
    fontSize: 9,
  },
  value: {
    color: "#444",
    fontSize: 9,
    flexShrink: 1,
  },
});