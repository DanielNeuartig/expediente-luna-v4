"use client";
import type { LaboratorialConResultados } from "@/types/laboratorial";
import {
  Document,
  Page,
  Text,
  View,
  StyleSheet,
  Image,
} from "@react-pdf/renderer";




export type DatosMascota = {
  nombre: string;
  especie: string;
  raza?: string;
  fechaNacimiento?: string;
  sexo: string;
  esterilizado: string;
};

function calcularEdad(fechaNacimiento: string, fechaReferencia: string): string {
  const nacimiento = new Date(fechaNacimiento);
  const ref = new Date(fechaReferencia);

  let años = ref.getFullYear() - nacimiento.getFullYear();
  let meses = ref.getMonth() - nacimiento.getMonth();
  let días = ref.getDate() - nacimiento.getDate();

  if (días < 0) {
    meses--;
    const mesAnterior = new Date(ref.getFullYear(), ref.getMonth(), 0);
    días += mesAnterior.getDate();
  }

  if (meses < 0) {
    años--;
    meses += 12;
  }

  const partes = [];
  if (años > 0) partes.push(`${años} año${años > 1 ? "s" : ""}`);
  if (meses > 0) partes.push(`${meses} mes${meses > 1 ? "es" : ""}`);
  if (días > 0) partes.push(`${días} día${días > 1 ? "s" : ""}`);

  return partes.join(", ");
}

export default function LaboratorialResultadosPDF({
  datosMascota,
  laboratorial,
}: {
  datosMascota: DatosMascota;
  laboratorial: LaboratorialConResultados;
}) {
  return (
    <Document>
      <Page style={styles.page}>
        {/* Encabezado */}
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
            <Text style={styles.subheader}>www.eldoc.vet · contacto@eldoc.vet</Text>
          </View>
        </View>

        <View style={styles.linea} />

        <Text style={styles.title}>Datos de la mascota</Text>
        <Text>Nombre: {datosMascota.nombre}</Text>
        <Text>Especie: {datosMascota.especie}</Text>
        {datosMascota.raza && <Text>Raza: {datosMascota.raza}</Text>}
        {datosMascota.fechaNacimiento && (
          <>
            <Text>
              Fecha de nacimiento:{" "}
              {new Date(datosMascota.fechaNacimiento).toLocaleDateString("es-MX")}
            </Text>
            <Text>
              Edad al momento del estudio:{" "}
              {calcularEdad(
                datosMascota.fechaNacimiento,
                laboratorial.fechaToma ?? laboratorial.fechaCreacion
              )}
            </Text>
          </>
        )}
        <Text>Sexo: {datosMascota.sexo}</Text>
        <Text>Esterilizado: {datosMascota.esterilizado}</Text>

        <View style={styles.linea} />

        <Text style={styles.title}>Resultados laboratoriales</Text>
        <Text>
          Estudio: {laboratorial.tipoEstudio.nombre}
        </Text>
        <Text>
          Fecha de toma:{" "}
          {new Date(
            laboratorial.fechaToma ?? laboratorial.fechaCreacion
          ).toLocaleDateString("es-MX")}
        </Text>

        <View style={styles.tablaResultados}>
          <View style={styles.filaEncabezado}>
            <Text style={styles.columnaNombre}>Nombre</Text>
            <Text style={styles.columnaValor}>Valor</Text>
            <Text style={styles.columnaValorRef}>Mín</Text>
            <Text style={styles.columnaValorRef}>Máx</Text>
          </View>

          {laboratorial.resultados.map((res, i) => {
            const nombre =
              res.analito?.nombre ?? res.nombreManual ?? "(sin nombre)";
            const unidad = res.analito?.unidad ?? "";
            const valor =
              res.valorNumerico !== null
                ? `${res.valorNumerico} ${unidad}`
                : res.valorTexto ?? "(no disponible)";
            const min =
              res.analito?.valoresReferencia?.[0]?.minimo?.toString() ?? "-";
            const max =
              res.analito?.valoresReferencia?.[0]?.maximo?.toString() ?? "-";

            return (
              <View key={i} style={styles.fila}>
                <Text style={styles.columnaNombre}>{nombre}</Text>
                <Text style={styles.columnaValor}>{valor}</Text>
                <Text style={styles.columnaValorRef}>{min}</Text>
                <Text style={styles.columnaValorRef}>{max}</Text>
              </View>
            );
          })}
        </View>

        <Text style={{ marginTop: 12 }}>
          Interpretación clínica sujeta a revisión por el médico veterinario tratante.
        </Text>
      </Page>
    </Document>
  );
}

const styles = StyleSheet.create({
  page: {
    padding: 24,
    fontSize: 8,
    fontFamily: "Helvetica",
  },
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
  linea: {
    borderBottom: "1pt solid #888",
    marginVertical: 10,
  },
  title: {
    fontSize: 14,
    marginBottom: 10,
    marginTop: 10,
    fontWeight: "bold",
  },
  tablaResultados: {
    marginTop: 6,
    borderWidth: 1,
    borderColor: "#999",
    borderStyle: "solid",
  },
  filaEncabezado: {
    flexDirection: "row",
    backgroundColor: "#eee",
    borderBottomWidth: 1,
    borderColor: "#999",
    borderStyle: "solid",
    paddingVertical: 2,
    fontSize:10
  },
  fila: {
    flexDirection: "row",
    borderBottomWidth: 1,
    borderColor: "#ddd",
    borderStyle: "solid",
    paddingVertical: 4,
  },
  columnaNombre: {
    width: "35%",
    paddingHorizontal: 4,
  },
  columnaValor: {
    width: "25%",
    paddingHorizontal: 4,
  },
  columnaValorRef: {
    width: "20%",
    paddingHorizontal: 4,
    textAlign: "right",
  },
});