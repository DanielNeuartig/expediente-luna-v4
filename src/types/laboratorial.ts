// src/types/laboratorial.ts

export type ResultadoAnalitoCompleto = {
  id: number;
  nombreManual: string | null;
  valorNumerico: number | null;
  valorTexto: string | null;
  observaciones: string | null;
  analito: {
    nombre: string;
    unidad: string | null;
    valoresReferencia: {
      minimo: number | null;
      maximo: number | null;
      especie: string; // ✅ Añadir esta línea
    }[];
  } | null;
};

export type DatosLaboratorialPDF = {
  tipoEstudio: { nombre: string };
  fechaToma: string | null;
  resultados: ResultadoAnalitoCompleto[];
};
export type LaboratorialConResultados = {
  id: number;
  fechaToma: string | null;
  fechaCreacion: string;
  tipoEstudio: {
    nombre: string;
  };
  resultados: ResultadoAnalitoCompleto[];
};

export type ResultadoGPT = {
  nombre: string;
  valor: number | null;
};