"use client";

import { Document, Page, Text, View, Image } from "@react-pdf/renderer";
import BloqueMascotaPDF from "./BloqueMascotaPDF";
import type { Mascota } from "@/types/mascota";
import EncabezadoClinicaPDF from "./EncabezadoClinicaPDF";
import { formatearFechaConDiaV2 } from "../ui/notaClinica/utils";
import { stylesPDF as styles } from "./stylesPDF";

const traduccionesTipoEstudio: Record<string, string> = {
  "Biometria Hematica": "Biometría Hemática",

};

export type SolicitudLaboratorial = {
  estudio: string;
  proveedor: string;
  observacionesClinica?: string;
  fechaSolicitud: string;
  tokenAcceso: string;
};

export default function SolicitudLaboratorialPDF({
  mascota,
  solicitud,
  baseUrl,
  qrDataUrl,
}: {
  mascota: Mascota;
  solicitud: SolicitudLaboratorial;
  baseUrl: string;
  qrDataUrl: string | null;
}) {
  const url = `${baseUrl}/estudios/${solicitud.tokenAcceso}`;

  function traducirTipo(tipo: string): string {
    const clave = tipo.toLowerCase().trim();
    return traduccionesTipoEstudio[clave] ?? tipo;
  }

  return (
    <Document>
      <Page style={styles.page}>
        <EncabezadoClinicaPDF />

        {/* Marca de agua si proveedor es ELDOC */}
        {solicitud.proveedor === "ELDOC" && (
          <View
            style={{
              border: "1pt solid #2B6CB0",
              backgroundColor: "#ebf8ff",
              padding: 4,
              borderRadius: 4,
              alignSelf: "flex-end",
              marginBottom: 8,
            }}
          >
            <Text
              style={{
                fontSize: 20,
                fontWeight: "bold",
                color: "#2B6CB0",
              }}
            >
              Procesado por ELDOC
            </Text>
          </View>
        )}

        {/* Datos de la mascota */}
        <BloqueMascotaPDF
          datosMascota={mascota}
          fechaReferencia={solicitud.fechaSolicitud}
        />

        {/* Solicitud */}
        <View style={styles.centered}>
          <View style={styles.card}>
            <Text style={styles.sectionTitle}>Solicitud de estudio</Text>

            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>Estudio</Text>
              <Text style={styles.detailValue}>
                {traducirTipo(solicitud.estudio ?? "Sin especificar")}
              </Text>
            </View>

            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>Proveedor</Text>
              <Text style={styles.detailValue}>{solicitud.proveedor}</Text>
            </View>

            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>Fecha de la solicitud:</Text>
              <Text style={styles.detailValue}>
                {formatearFechaConDiaV2(new Date(solicitud.fechaSolicitud))}
              </Text>
            </View>

            {solicitud.observacionesClinica && (
              <View style={styles.detailRow}>
                <Text style={styles.detailLabel}>Observaciones clínicas</Text>
                <Text style={styles.detailValue}>
                  {solicitud.observacionesClinica}
                </Text>
              </View>
            )}
          </View>
        </View>

        <View style={styles.linea} />

        {/* Acceso a carga */}
        <Text style={styles.sectionTitle}>Acceso a carga de archivos</Text>
        <Text style={styles.body}>
          Estimado colaborador: por favor, ingrese a la siguiente liga o escanee
          el código QR para subir hasta 5 archivos.
        </Text>
        <Text style={styles.url}>{url}</Text>

        {qrDataUrl && (
          <View style={styles.qr}>
            <Image src={qrDataUrl} style={{ width: 100, height: 100 }} />
          </View>
        )}

        <Text style={styles.footer}>
          De parte del equipo de ELDOC, agradecemos inmensamente su atención.
        </Text>
      </Page>
    </Document>
  );
}
