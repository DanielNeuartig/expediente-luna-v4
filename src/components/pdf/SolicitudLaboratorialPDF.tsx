"use client";

import {
  Document,
  Page,
  Text,
  View,
  StyleSheet,
  Image,
} from "@react-pdf/renderer";

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

export type DatosMascota = {
  nombre: string;
  especie: string;
  raza?: string;
  fechaNacimiento?: string;
  sexo: string;
  esterilizado: string;
};

export type SolicitudLaboratorial = {
  estudio: string;
  proveedor: string;
  observacionesClinica?: string;
  fechaSolicitud: string;
  tokenAcceso: string;
};

export default function SolicitudLaboratorialPDF({
  datosMascota,
  solicitud,
  baseUrl,
  qrDataUrl,
}: {
  datosMascota: DatosMascota;
  solicitud: SolicitudLaboratorial;
  baseUrl: string;
  qrDataUrl: string | null;
}) {
  const url = `${baseUrl}/estudios/${solicitud.tokenAcceso}`;

  return (
    <Document>
      <Page style={styles.page}>
        {/* 🔹 Encabezado con logo y datos */}
        <View style={styles.headerContainer}>
          <Image
            src="/imagenes/LogoELDOCsm.png" // ✅ Reemplaza con tu ruta real o URL absoluta
            style={styles.logo}
          />
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
              Edad al momento de la solicitud:{" "}
              {calcularEdad(datosMascota.fechaNacimiento, solicitud.fechaSolicitud)}
            </Text>
          </>
        )}
        <Text>Sexo: {datosMascota.sexo}</Text>
        <Text>Esterilizado: {datosMascota.esterilizado}</Text>

        <View style={styles.linea} />

        <Text style={styles.title}>Solicitud de estudio</Text>
        <Text>Estudio: {solicitud.estudio}</Text>
        <Text>Proveedor: {solicitud.proveedor}</Text>
        <Text>
          Fecha de solicitud:{" "}
          {new Date(solicitud.fechaSolicitud).toLocaleDateString("es-MX")}
        </Text>
        {solicitud.observacionesClinica && (
          <Text>Observaciones clínicas: {solicitud.observacionesClinica}</Text>
        )}

        <View style={styles.linea} />

        <Text style={styles.title}>Acceso a carga de archivos</Text>
        <Text>
          Estimado colaborador: por favor, ingrese a la siguiente liga ó use el QR y suba hasta 5 archivos. ¡Gracias!
        </Text>
        <Text style={styles.url}>{url}</Text>

        {qrDataUrl && (
          <View style={styles.qr}>
            <Image src={qrDataUrl} style={{ width: 100, height: 100 }} />
          </View>
        )}
                <Text>
         De parte del equipo de ELDOC, gradecemos inmensamente su atención.
        </Text>
      </Page>
    </Document>
  );
}

const styles = StyleSheet.create({
  page: {
    padding: 24,
    fontSize: 12,
    fontFamily: "Helvetica",
  },
  headerContainer: {
    flexDirection: "row",
   alignItems: "center", // ✅ Centra verticalmente el contenido
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
  url: {
    fontSize: 10,
    color: "blue",
  },
  qr: {
    marginTop: 12,
    alignItems: "center",
    justifyContent: "center",
  },
});