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

const aliasAnalitos: Record<string, string> = {
  "WBC": "Leucocitos totales",
  "Neu#": "Neutrófilos",
  "Lym#": "Linfocitos",
  "Mon#": "Monocitos",
  "Eos#": "Eosinófilos",
  "Neu%": "Neutrófilos (proporción)",
  "Lym%": "Linfocitos (proporción)",
  "Mon%": "Monocitos (proporción)",
  "Eos%": "Eosinófilos (proporción)",
  "RBC": "Eritrocitos",
  "HGB": "Hemoglobina",
  "HCT": "Hematocrito",
  "MCV": "VCM",
  "MCH": "HCM",
  "MCHC": "CHCM",
  "RDW-CV#": "RDW-CV",
  "RDW-SD": "RDW-SD",
  "PLT": "Plaquetas",
  "MPV": "VPM",
  "PDW": "Ancho de distribución plaquetario",
  "PCT": "PCT",
  "P-LCC": "P-LCC",
  "P-LCR": "P-LCR",
};

export type DatosMascota = {
  nombre: string;
  especie: string;
  raza?: string;
  fechaNacimiento?: string;
  sexo: string;
  esterilizado: string;
};

function calcularEdad(
  fechaNacimiento: string,
  fechaReferencia: string
): string {
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
            <Text style={styles.subheader}>
              www.eldoc.vet · contacto@eldoc.vet
            </Text>
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
        <Text>Estudio: {laboratorial.tipoEstudio.nombre}</Text>
        <Text>
          Fecha de solicitud:{" "}
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
            <Text style={styles.columnaUnidad}>Unidad</Text>
          </View>

          {laboratorial.resultados.map((res, i) => {
            let nombre = res.analito?.nombre ?? res.nombreManual ?? "(sin nombre)";
            if (nombre in aliasAnalitos) {
              nombre = aliasAnalitos[nombre];
            }
            const unidad = res.analito?.unidad ?? "-";
            const valorRef = res.analito?.valoresReferencia?.find(
              (vr) => vr.especie === datosMascota.especie
            );

            const min = valorRef?.minimo?.toString() ?? "-";
            const max = valorRef?.maximo?.toString() ?? "-";

            let alteracionTexto = "";
            let valorMostrado =
              res.valorNumerico !== null
                ? `${res.valorNumerico}`
                : res.valorTexto ?? "(no disponible)";

            if (res.valorNumerico !== null && valorRef) {
              const valorNum = res.valorNumerico;
              const minVal = valorRef.minimo;
              const maxVal = valorRef.maximo;

              if (maxVal !== null && valorNum > maxVal) {
                const porcentaje = (((valorNum - maxVal) / maxVal) * 100).toFixed(1);
                alteracionTexto = `(AUMENTADO ${porcentaje}%)`;
              } else if (minVal !== null && valorNum < minVal) {
                const porcentaje = (((minVal - valorNum) / minVal) * 100).toFixed(1);
                alteracionTexto = `(DISMINUIDO ${porcentaje}%)`;
              }

              if (alteracionTexto) {
                valorMostrado += ` ${alteracionTexto}`;
              }
            }

            return (
              <View key={i} style={styles.fila}>
                <Text style={styles.columnaNombre}>{nombre}</Text>
                <Text
                  style={{
                    ...styles.columnaValor,
                    ...(alteracionTexto.startsWith("(AUMENTADO") ? styles.valorAlto : {}),
                    ...(alteracionTexto.startsWith("(DISMINUIDO") ? styles.valorBajo : {}),
                  }}
                >
                  {valorMostrado}
                </Text>
                <Text style={styles.columnaValorRef}>{min}</Text>
                <Text style={styles.columnaValorRef}>{max}</Text>
                <Text style={styles.columnaUnidad}>{unidad}</Text>
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
    fontSize: 10,
    textAlign: "center",
  },
  fila: {
    flexDirection: "row",
    borderBottomWidth: 1,
    borderColor: "#ddd",
    borderStyle: "solid",
    paddingVertical: 4,
  },
  columnaNombre: {
    width: "30%",
    paddingHorizontal: 4,
    textAlign: "center",
  },
  columnaValor: {
    width: "20%",
    paddingHorizontal: 4,
    textAlign: "center",
    fontWeight: "bold", // ← aquí está el cambio
  },
  columnaValorRef: {
    width: "15%",
    paddingHorizontal: 4,
    textAlign: "center",
  },
  columnaUnidad: {
    width: "20%",
    paddingHorizontal: 4,
    textAlign: "center",
  },
  valorAlto: {
    color: "#b91c1c",
    fontWeight: "bold",
    backgroundColor: "#fee2e2",
    borderRadius: 2,
  },
  valorBajo: {
    color: "#1e40af",
    fontWeight: "bold",
    backgroundColor: "#e0f2fe",
    borderRadius: 2,
  },
});