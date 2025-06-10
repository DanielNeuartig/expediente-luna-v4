// src/components/pdf/RecetaPDF.tsx
"use client";
import { Image } from "@react-pdf/renderer";
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
import { Document, Page, Text, View, StyleSheet } from "@react-pdf/renderer";
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

export type DatosMascota = {
  nombre: string;
  especie: string;
  raza?: string;
  fechaNacimiento?: string;
  sexo: string;
  esterilizado: string;
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
  datosMascota?: DatosMascota;
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
        <View style={styles.headerContainer}>
          <Image src="/imagenes/LogoELDOCsm.png" style={styles.logo} />
          <View style={styles.clinicaInfo}>
            <Text style={styles.header}>ELDOC | Centro Veterinario</Text>
            <Text style={styles.subheader}>
              Dirección: Av. Fidel Velazquez 288-4, San Elías, 44240
              Guadalajara, Jal.
            </Text>
            <Text style={styles.subheader}>Teléfono: 33 1485 8130</Text>
            <Text style={styles.subheader}>
              Horario: lunes a viernes de 10 a 2 y de 4 a 7 · Sábados de 10 a 3
              · domingos de 11 a 1
            </Text>
            <Text style={styles.subheader}>
              www.eldoc.vet · contacto@eldoc.vet
            </Text>
          </View>
        </View>

        <View style={styles.linea} />
        <Text style={styles.fecha}>
          Fecha de la nota:{" "}
          {new Date(fechaNota).toLocaleString("es-MX", {
            weekday: "short",
            year: "numeric",
            month: "2-digit",
            day: "2-digit",
            hour: "2-digit",
            minute: "2-digit",
            hour12: false,
          })}
        </Text>

        {datosMascota && (
          <View style={styles.datosClinicos}>
            <Text style={styles.title}>Datos de la mascota</Text>
            <Text>Nombre: {datosMascota.nombre}</Text>
            <Text>Especie: {datosMascota.especie}</Text>
            {datosMascota.raza && <Text>Raza: {datosMascota.raza}</Text>}
            {datosMascota.fechaNacimiento && (
              <>
                <Text>
                  Fecha de nacimiento:{" "}
                  {new Date(datosMascota.fechaNacimiento).toLocaleDateString(
                    "es-MX"
                  )}
                </Text>
                <Text>
                  Edad al momento de la nota:{" "}
                  {calcularEdad(datosMascota.fechaNacimiento, fechaNota)}
                </Text>
              </>
            )}
            <Text>Sexo: {datosMascota.sexo}</Text>
            <Text>Esterilizado: {datosMascota.esterilizado}</Text>
            <View style={styles.linea} />
          </View>
        )}

        <Text style={styles.title}>Receta médica</Text>

        {datosClinicos && (
          <View style={styles.datosClinicos}>
            {datosClinicos.historiaClinica && (
              <Text>Historia clínica: {datosClinicos.historiaClinica}</Text>
            )}
            {datosClinicos.exploracionFisica && (
              <Text>Exploración física: {datosClinicos.exploracionFisica}</Text>
            )}
            {datosClinicos.temperatura !== undefined && (
              <Text>Temperatura: {datosClinicos.temperatura} °C</Text>
            )}
            {datosClinicos.peso !== undefined && (
              <Text>Peso: {datosClinicos.peso} kg</Text>
            )}
            {datosClinicos.frecuenciaCardiaca !== undefined && (
              <Text>FC: {datosClinicos.frecuenciaCardiaca} lpm</Text>
            )}
            {datosClinicos.frecuenciaRespiratoria !== undefined && (
              <Text>FR: {datosClinicos.frecuenciaRespiratoria} rpm</Text>
            )}
            {datosClinicos.diagnosticoPresuntivo && (
              <Text>Diagnóstico: {datosClinicos.diagnosticoPresuntivo}</Text>
            )}
            {datosClinicos.pronostico && (
              <Text>Pronóstico: {datosClinicos.pronostico}</Text>
            )}
            {/*datosClinicos.laboratoriales?.trim() && (
              <Text>Laboratoriales: {datosClinicos.laboratoriales}</Text>
            )*/}
            {datosClinicos.extras && (
              <Text>Extras: {datosClinicos.extras}</Text>
            )}
            <View style={styles.linea} />
          </View>
        )}

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
            <Text style={styles.title}>Indicaciones adicionales</Text>
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

const styles = StyleSheet.create({
  logoContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 10,
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
  indicacionTexto: {
    fontSize: 11,
    marginBottom: 4,
  },
  page: {
    padding: 24,
    fontSize: 12,
    fontFamily: "Helvetica",
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
  datosClinicos: {
    marginBottom: 14,
  },
  medicamento: {
    marginBottom: 14,
  },
  medicamentoTitulo: {
    fontSize: 12,
    fontWeight: "bold",
  },
  medicamentoTexto: {
    fontSize: 11,
  },
  observaciones: {
    fontSize: 11,
    fontStyle: "italic",
    marginTop: 2,
  },
  aplicaciones: {
    marginTop: 4,
    paddingLeft: 10,
  },
  aplicacion: {
    fontSize: 10,
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
    fontSize: 10,
    marginBottom: 10,
  },
  headerContainer: {
    flexDirection: "row",
    gap: 12,
    alignItems: "center", // ✅ Centra verticalmente el contenido
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
});
