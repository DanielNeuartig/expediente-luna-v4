// src/components/pdf/RecetaPDF.tsx
"use client";
import BloqueMascotaPDF from "./BloqueMascotaPDF";
import { stylesPDF as styles } from "./stylesPDF";
import type { Mascota } from "@/types/mascota";
import { formatearFechaConDiaV2 } from "../ui/notaClinica/utils";
function esModoNatural(m: Medicamento): boolean {
  return (
    m.frecuenciaHoras !== null &&
    m.frecuenciaHoras !== undefined &&
    m.dosis !== undefined &&
    m.via !== undefined &&
    m.desde !== undefined &&
    m.veces !== null &&
    m.veces !== undefined &&
    m.tiempoIndefinido === false
  );
}
import { Document, Page, Text, View } from "@react-pdf/renderer";
import EncabezadoClinicaPDF from "./EncabezadoClinicaPDF";
export type Medicamento = {
  nombre: string;
  dosis: string;
  via: string;
  frecuenciaHoras?: number | null;
  veces?: number | null;
  desde?: string;
  observaciones?: string | null;
  paraCasa?: boolean; // ✅ añadido aquí
  tiempoIndefinido?: boolean; // ← Añade esto si aún no está
};

export type DatosClinicos = {
  historiaClinica?: string;
  exploracionFisica?: string;
  temperatura?: number;
  peso?: number;
  frecuenciaCardiaca?: number;
  frecuenciaRespiratoria?: number;
  diagnosticoPresuntivo?: string;
  pronostico?: string;
  laboratoriales?: string;
  extras?: string;
};

function calcularFechas(
  desde: string,
  frecuenciaHoras: number,
  veces: number
): string[] {
  const inicio = new Date(desde);
  const fechas: string[] = [];

  for (let i = 0; i < veces; i++) {
    const fecha = new Date(
      inicio.getTime() + i * frecuenciaHoras * 60 * 60 * 1000
    );
    fechas.push(
      fecha.toLocaleString("es-MX", {
        weekday: "short",
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
        hour: "2-digit",
        minute: "2-digit",
        hour12: false,
      })
    );
  }

  return fechas;
}
function hayContenidoClinico(dc?: DatosClinicos): boolean {
  if (!dc) return false;
  return Boolean(
    dc.historiaClinica?.trim() ||
      dc.exploracionFisica?.trim() ||
      dc.temperatura !== undefined ||
      dc.peso !== undefined ||
      dc.frecuenciaCardiaca !== undefined ||
      dc.frecuenciaRespiratoria !== undefined ||
      dc.diagnosticoPresuntivo?.trim() ||
      dc.pronostico?.trim() ||
      dc.extras?.trim()
  );
}

export default function RecetaPDF({
  medicamentos,
  datosClinicos,
  fechaNota,
  datosMascota,
  estadoNota, // ✅ Aquí lo agr
  indicaciones,
}: {
  medicamentos: Medicamento[];
  datosClinicos?: DatosClinicos;
  fechaNota: string;
  datosMascota?: Mascota;
  estadoNota: "EN_REVISION" | "FINALIZADA" | "ANULADA"; // ✅ esto es lo que te faltaba
  indicaciones?: { descripcion: string }[];
}) {
  return (
    <Document>
      <Page style={styles.page}>
        {estadoNota === "EN_REVISION" && (
          <Text style={styles.marcaAgua}>EN REVISIÓN</Text>
        )}
        {estadoNota === "ANULADA" && (
          <Text style={styles.marcaAgua}>ANULADA</Text>
        )}
        <EncabezadoClinicaPDF />

        {datosMascota && (
          <BloqueMascotaPDF
            datosMascota={datosMascota}
            fechaReferencia={fechaNota}
          />
        )}

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
              fontSize: 8,
              fontWeight: "bold",
              color: "#2B6CB0",
            }}
          >
            {formatearFechaConDiaV2(new Date(fechaNota))}
          </Text>
        </View>

        {hayContenidoClinico(datosClinicos) && (
          <View style={styles.datosClinicos}>
            <Text style={styles.title}>Datos Clínicos</Text>
            {datosClinicos!.historiaClinica && (
              <Text>Historia clínica: {datosClinicos!.historiaClinica}</Text>
            )}
            {datosClinicos!.exploracionFisica && (
              <Text>
                Exploración física: {datosClinicos!.exploracionFisica}
              </Text>
            )}
            {datosClinicos!.temperatura !== undefined && (
              <Text>Temperatura: {datosClinicos!.temperatura} °C</Text>
            )}
            {datosClinicos!.peso !== undefined && (
              <Text>Peso: {datosClinicos!.peso} kg</Text>
            )}
            {datosClinicos!.frecuenciaCardiaca !== undefined && (
              <Text>FC: {datosClinicos!.frecuenciaCardiaca} lpm</Text>
            )}
            {datosClinicos!.frecuenciaRespiratoria !== undefined && (
              <Text>FR: {datosClinicos!.frecuenciaRespiratoria} rpm</Text>
            )}
            {datosClinicos!.diagnosticoPresuntivo && (
              <Text>Diagnóstico: {datosClinicos!.diagnosticoPresuntivo}</Text>
            )}
            {datosClinicos!.pronostico && (
              <Text>Pronóstico: {datosClinicos!.pronostico}</Text>
            )}
            {datosClinicos!.extras && (
              <Text>Extras: {datosClinicos!.extras}</Text>
            )}
          </View>
        )}
        <Text style={styles.title}>Receta médica</Text>
        {medicamentos.map((m, i) => (
          <View key={i} style={styles.medicamento}>
            <Text style={styles.medicamentoTitulo}>{m.nombre}:</Text>
            <Text style={styles.medicamentoTexto}>
              {m.paraCasa === false
                ? "(Administrar en clínica) "
                : m.paraCasa === true
                ? "(Para casa) "
                : ""}
              {esModoNatural(m)
                ? `Administrar ${m.dosis} vía ${m.via.toLowerCase()} cada ${
                    m.frecuenciaHoras
                  } horas durante ${Math.round(
                    ((m.veces || 0) * (m.frecuenciaHoras ?? 0)) / 24
                  )} días a partir del ${new Date(m.desde!).toLocaleString(
                    "es-MX",
                    {
                      weekday: "short",
                      year: "numeric",
                      month: "2-digit",
                      day: "2-digit",
                      hour: "2-digit",
                      minute: "2-digit",
                      hour12: false,
                    }
                  )}.`
                : // 👇 resto de condiciones clásicas
                m.tiempoIndefinido && m.frecuenciaHoras && m.desde
                ? `Administrar ${m.dosis} vía ${m.via.toLowerCase()} cada ${
                    m.frecuenciaHoras
                  } horas durante tiempo indefinido a partir del ${new Date(
                    m.desde
                  ).toLocaleString("es-MX", {
                    weekday: "short",
                    year: "numeric",
                    month: "2-digit",
                    day: "2-digit",
                    hour: "2-digit",
                    minute: "2-digit",
                    hour12: false,
                  })}.`
                : m.veces === 1 && m.desde
                ? `Administrar ${
                    m.dosis
                  } vía ${m.via.toLowerCase()} una sola aplicación el ${new Date(
                    m.desde
                  ).toLocaleString("es-MX", {
                    weekday: "short",
                    year: "numeric",
                    month: "2-digit",
                    day: "2-digit",
                    hour: "2-digit",
                    minute: "2-digit",
                    hour12: false,
                  })}.`
                : m.frecuenciaHoras && (!m.veces || m.veces === 0)
                ? `Administrar ${m.dosis} vía ${m.via.toLowerCase()} cada ${
                    m.frecuenciaHoras
                  } horas durante tiempo indefinido.`
                : m.frecuenciaHoras && m.veces && m.desde
                ? `Administrar ${m.dosis} vía ${m.via.toLowerCase()} cada ${
                    m.frecuenciaHoras
                  } horas durante ${m.veces} ocasiones a partir del ${new Date(
                    m.desde
                  ).toLocaleString("es-MX", {
                    weekday: "short",
                    year: "numeric",
                    month: "2-digit",
                    day: "2-digit",
                    hour: "2-digit",
                    minute: "2-digit",
                    hour12: false,
                  })}.`
                : `Administrar ${m.dosis} vía ${m.via.toLowerCase()}.`}
            </Text>
            {m.observaciones && (
              <Text style={styles.observaciones}>
                Observaciones: {m.observaciones}
              </Text>
            )}
            {m.desde && m.frecuenciaHoras && m.veces && !m.tiempoIndefinido && (
              <View style={styles.aplicaciones}>
                {calcularFechas(m.desde, m.frecuenciaHoras, m.veces).map(
                  (fecha, j) => (
                    <Text key={j} style={styles.aplicacion}>
                      Aplicación #{j + 1}: {fecha}
                    </Text>
                  )
                )}
              </View>
            )}
          </View>
        ))}
        {indicaciones && indicaciones.length > 0 && (
          <View style={styles.indicaciones}>
            <Text style={styles.title}>Indicaciones</Text>
            {indicaciones.map((ind, idx) => (
              <Text key={idx} style={styles.indicacionTexto}>
                • {ind.descripcion}
              </Text>
            ))}
          </View>
        )}
      </Page>
    </Document>
  );
}
