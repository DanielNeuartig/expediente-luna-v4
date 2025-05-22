// src/components/ui/notaClinica/utils.ts

export const formatoDatetimeLocal = (date: Date): string => {
  const pad = (n: number) => n.toString().padStart(2, "0");
  return (
    date.getFullYear() +
    "-" +
    pad(date.getMonth() + 1) +
    "-" +
    pad(date.getDate()) +
    "T" +
    pad(date.getHours()) +
    ":" +
    pad(date.getMinutes())
  );
};

export const calcularFechas = (
  desde: string,
  frecuenciaHoras: string,
  veces: string
): string[] => {
  const fechas: string[] = [];
  if (
    desde &&
    frecuenciaHoras &&
    veces &&
    !isNaN(Number(frecuenciaHoras)) &&
    !isNaN(Number(veces))
  ) {
    const base = new Date(desde);
    for (let i = 0; i < Number(veces); i++) {
      const fecha = new Date(base);
      fecha.setHours(fecha.getHours() + i * Number(frecuenciaHoras));
      fechas.push(
        fecha.toLocaleString("es-MX", {
          day: "2-digit",
          month: "2-digit",
          year: "2-digit",
          hour: "2-digit",
          minute: "2-digit",
        })
      );
    }
  }
  return fechas;
};

// Tipos estrictos para la función de parseo
type ParsedFormArray = Record<string, string>;
type ParsedFormData = Record<string, string | ParsedFormArray[]>;

export const parseNestedFormData = (
  data: Record<string, FormDataEntryValue>
): ParsedFormData => {
  const result: ParsedFormData = {};

  for (const [key, value] of Object.entries(data)) {
    const match = key.match(/^([a-zA-Z]+)\[(\d+)\]\.(\w+)$/);
    if (match) {
      const [, arrayName, indexStr, propName] = match;
      const index = Number(indexStr);

      if (!Array.isArray(result[arrayName])) {
        result[arrayName] = [];
      }

      const array = result[arrayName] as ParsedFormArray[];

      if (!array[index]) {
        array[index] = {};
      }

      array[index][propName] = value.toString();
    } else {
      result[key] = value.toString();
    }
  }

  return result;
};