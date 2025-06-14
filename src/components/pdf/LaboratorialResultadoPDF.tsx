"use client";
import { stylesPDF as styles } from "./stylesPDF";
import type { LaboratorialConResultados } from "@/types/laboratorial";
import { Document, Page, Text, View } from "@react-pdf/renderer";
import EncabezadoClinicaPDF from "./EncabezadoClinicaPDF";
import BloqueMascotaPDF from "./BloqueMascotaPDF";
import type { Mascota } from "@/types/mascota";
import { formatearFechaConDiaV2 } from "../ui/notaClinica/utils";
const aliasAnalitos: Record<string, string> = {
  WBC: "Leucocitos totales",
  "Neu#": "Neutrófilos",
  "Lym#": "Linfocitos",
  "Mon#": "Monocitos",
  "Eos#": "Eosinófilos",
  "Neu%": "Neutrófilos (proporción)",
  "Lym%": "Linfocitos (proporción)",
  "Mon%": "Monocitos (proporción)",
  "Eos%": "Eosinófilos (proporción)",
  RBC: "Eritrocitos",
  HGB: "Hemoglobina",
  HCT: "Hematocrito",
  MCV: "VCM",
  MCH: "HCM",
  MCHC: "CHCM",
  "RDW-CV#": "RDW-CV",
  "RDW-SD": "RDW-SD",
  PLT: "Plaquetas",
  MPV: "VPM",
  PDW: "Ancho de distribución plaquetario",
  PCT: "PCT",
  "P-LCC": "P-LCC",
  "P-LCR": "P-LCR",
};

const traduccionesTipoEstudio: Record<string, string> = {
  "biometria hematica": "Biometría Hemática",
};
export default function LaboratorialResultadosPDF({
  mascota,
  laboratorial,
}: {
  mascota: Mascota;
  laboratorial: LaboratorialConResultados;
}) {
  function traducirTipo(tipo: string): string {
    const clave = tipo.toLowerCase().trim();
    return traduccionesTipoEstudio[clave] ?? tipo;
  }
  return (
    <Document>
      <Page style={styles.page}>
        <EncabezadoClinicaPDF />
        <BloqueMascotaPDF
          datosMascota={mascota}
          fechaReferencia={laboratorial.fechaToma ?? laboratorial.fechaCreacion}
        />

        <View style={styles.centered}>
          <View style={styles.card}>
            <Text style={styles.sectionTitle}>
              {traducirTipo(laboratorial.tipoEstudio.nombre)}
            </Text>

            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>Fecha de reporte:</Text>
              <Text style={styles.detailValue}>
                {" "}
                {formatearFechaConDiaV2(new Date(laboratorial.fechaCreacion))}
              </Text>
            </View>
            {/*}
            {solicitud.observacionesClinica && (
              <View style={styles.detailRow}>
                <Text style={styles.detailLabel}>Observaciones clínicas</Text>
                <Text style={styles.detailValue}>
                  {solicitud.observacionesClinica}
                </Text>
              </View>
            )}*/}
          </View>
        </View>



        <View style={styles.tablaResultados}>
          <View style={styles.filaEncabezado}>
            <Text style={styles.columnaNombre}>Nombre</Text>
            <Text style={styles.columnaValor}>Valor</Text>
            <Text style={styles.columnaValorRef}>Mín</Text>
            <Text style={styles.columnaValorRef}>Máx</Text>
            <Text style={styles.columnaUnidad}>Unidad</Text>
          </View>

          {laboratorial.resultados.map((res, i) => {
            let nombre =
              res.analito?.nombre ?? res.nombreManual ?? "(sin nombre)";
            if (nombre in aliasAnalitos) {
              nombre = aliasAnalitos[nombre];
            }
            const unidad = res.analito?.unidad ?? "-";
            const valorRef = res.analito?.valoresReferencia?.find(
              (vr) => vr.especie === mascota.especie
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
                const porcentaje = (
                  ((valorNum - maxVal) / maxVal) *
                  100
                ).toFixed(1);
                alteracionTexto = `(AUMENTADO ${porcentaje}%)`;
              } else if (minVal !== null && valorNum < minVal) {
                const porcentaje = (
                  ((minVal - valorNum) / minVal) *
                  100
                ).toFixed(1);
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
                    ...(alteracionTexto.startsWith("(AUMENTADO")
                      ? styles.valorAlto
                      : {}),
                    ...(alteracionTexto.startsWith("(DISMINUIDO")
                      ? styles.valorBajo
                      : {}),
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
          Interpretación clínica sujeta a revisión por el médico veterinario
          tratante.
        </Text>
      </Page>
    </Document>
  );
}
