// src/components/pdf/RecetaPDF.tsx
"use client";

import { Document, Page, Text, View, StyleSheet } from "@react-pdf/renderer";

export type Medicamento = {
  nombre: string;
  dosis: string;
  via: string;
  frecuenciaHoras?: number | null;
  veces?: number | null;
  desde?: string;
  observaciones?: string | null;
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

function calcularEdad(fechaNacimiento: string, fechaReferencia: string): string {
  const nacimiento = new Date(fechaNacimiento);
  const ref = new Date(fechaReferencia);
  let edad = ref.getFullYear() - nacimiento.getFullYear();
  const mes = ref.getMonth() - nacimiento.getMonth();
  if (mes < 0 || (mes === 0 && ref.getDate() < nacimiento.getDate())) {
    edad--;
  }
  return `${edad} años`;
}

export default function RecetaPDF({
  medicamentos,
  datosClinicos,
  fechaNota,
  datosMascota,
}: {
  medicamentos: Medicamento[];
  datosClinicos?: DatosClinicos;
  fechaNota: string;
  datosMascota?: DatosMascota;
}) {
  return (
    <Document>
      <Page style={styles.page}>
        <Text style={styles.header}>ELDOC | Centro Veterinario</Text>
        <Text style={styles.subheader}>
          Dirección: Av. Fidel Velazquez 288-4, San Elías, 44240 Guadalajara, Jal.
        </Text>
        <Text style={styles.subheader}>Teléfono: 33 1485 8130</Text>
        <Text style={styles.subheader}>
          Horario: lunes a viernes de 10 a 2 y de 4 a 7 · Sábados de 10 a 3 · domingos de 11 a 1
        </Text>
        <Text style={styles.subheader}>www.eldoc.vet · contacto@eldoc.vet</Text>

        <View style={styles.linea} />
        <Text style={styles.fecha}>
          Fecha: {new Date(fechaNota).toLocaleString("es-MX", {
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
                  Fecha de nacimiento: {new Date(datosMascota.fechaNacimiento).toLocaleDateString("es-MX")}
                </Text>
                <Text>
                  Edad al momento de la nota: {calcularEdad(datosMascota.fechaNacimiento, fechaNota)}
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
            {datosClinicos.laboratoriales && (
              <Text>Laboratoriales: {datosClinicos.laboratoriales}</Text>
            )}
            {datosClinicos.extras && <Text>Extras: {datosClinicos.extras}</Text>}
            <View style={styles.linea} />
          </View>
        )}

        {medicamentos.map((m, i) => (
          <View key={i} style={styles.medicamento}>
            <Text style={styles.medicamentoTitulo}>{m.nombre}:</Text>
            <Text style={styles.medicamentoTexto}>
              Administrar {m.dosis} vía {m.via.toLowerCase()}
              {m.frecuenciaHoras && m.veces
                ? ` cada ${m.frecuenciaHoras} horas durante ${m.veces} aplicaciones.`
                : "."}
            </Text>
            {m.observaciones && (
              <Text style={styles.observaciones}>
                Observaciones: {m.observaciones}
              </Text>
            )}
            {m.desde && m.frecuenciaHoras && m.veces && (
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
  fecha: {
    fontSize: 10,
    marginBottom: 10,
  },
});