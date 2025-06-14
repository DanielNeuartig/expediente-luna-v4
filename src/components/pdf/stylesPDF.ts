import { StyleSheet } from "@react-pdf/renderer";

export const stylesPDF = StyleSheet.create({
  page: {
    padding: 24,
    fontSize: 8,
    fontFamily: "Helvetica",
  },
  title: {
    fontSize: 14,
    fontWeight: "bold",
    textAlign: "center",
    marginTop: 5,
    marginBottom: 5,
    color: "#1A365D",
    textTransform: "uppercase",
    letterSpacing: 1,
  },
  subtitulo: {
    fontSize: 11,
    textAlign: "center",
    marginBottom: 12,
    color: "#555",
    fontStyle: "italic",
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: "bold",
    color: "#2C5282",
    marginBottom: 6,
    marginTop: 10,
  },
  label: {
    fontWeight: "bold",
    color: "#333",
  },
  item: {
    marginBottom: 4,
    lineHeight: 1.4,
  },
  card: {
    width: "80%",
    padding: 6,
    border: "1pt solid #CBD5E0",
    borderRadius: 6,
    backgroundColor: "#f7fafc",
    marginBottom: 3,
  },
  linea: {
    borderBottom: "1pt solid #888",
    marginVertical: 12,
  },
  body: {
    marginBottom: 5,
    color: "#222",
  },
  url: {
    fontSize: 10,
    color: "blue",
    wordBreak: "break-all",
  },
  qr: {
    marginTop: 10,
    alignItems: "center",
    justifyContent: "center",
  },
  detailRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 5,
    borderBottom: "0.5pt solid #e2e8f0",
    paddingBottom: 4,
  },
  detailLabel: {
    fontWeight: "bold",
    fontSize: 9,
    color: "#2D3748",
    width: "40%",
  },
  detailValue: {
    fontSize: 9,
    color: "#1A202C",
    width: "58%",
    textAlign: "left",
  },
  centered: {
    alignItems: "center",
    marginVertical: 10,
  },
  footer: {
    marginTop: 20,
    fontSize: 9,
    textAlign: "center",
    fontStyle: "italic",
    color: "#444",
  },
  indicacionTexto: {
    fontSize: 9,
    marginBottom: 4,
  },

  logoContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 5,
  },
  logoPrincipal: {
    width: 80,
    height: 80,
  },
  logoSecundario: {
    width: 60,
    height: 60,
  },
  indicaciones: {
    marginTop: 14,
  },
  header: {
    fontSize: 14,
    fontWeight: "bold",
  },
  subheader: {
    fontSize: 10,
  },
  datosClinicos: {
    marginBottom: 5,
  },
  medicamento: {
    marginBottom: 5,
  },
  medicamentoTitulo: {
    fontSize: 12,
    fontWeight: "bold",
  },
  medicamentoTexto: {
    fontSize: 9,
  },
  observaciones: {
    fontSize: 9,
    fontStyle: "italic",
    marginTop: 2,
  },
  aplicaciones: {
    marginTop: 4,
    paddingLeft: 10,
  },
  aplicacion: {
    fontSize: 9,
    color: "#333",
  },
  marcaAgua: {
    position: "absolute",
    top: "30%",
    left: "1%",
    fontSize: 92,
    color: "#cccccc",
    opacity: 0.5,
    transform: "rotate(-30deg)",
    fontWeight: "bold",
  },
  fecha: {
    fontSize: 9,
    marginBottom: 10,
  },
  headerContainer: {
    flexDirection: "row",
    gap: 3,
    alignItems: "center", // ✅ Centra verticalmente el contenido
    marginBottom: 3,
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


  nombreMascota: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#2B6CB0",
    textAlign: "left",
    marginBottom: 6,
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },

  row: {
    flexDirection: "row",
    marginBottom: 4,
  },

  value: {
    color: "#444",
  },
});
