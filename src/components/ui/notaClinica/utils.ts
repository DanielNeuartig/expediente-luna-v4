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


export const calcularFechasV2 = (
  desde: string,
  frecuenciaHoras: string,
  veces: string
): Date[] => {
  const fechas: Date[] = [];
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
      fechas.push(fecha); // devuelve objetos Date
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

export const formatearFechaConDia = (fecha: Date): string => {
  const ahora = new Date();
  const hoy = new Date(ahora.getFullYear(), ahora.getMonth(), ahora.getDate());
  const manana = new Date(hoy);
  manana.setDate(hoy.getDate() + 1);

  const fechaSinHora = new Date(
    fecha.getFullYear(),
    fecha.getMonth(),
    fecha.getDate()
  );

  const horaTexto = fecha.toLocaleTimeString("es-MX", {
    hour: "2-digit",
    minute: "2-digit",
  });

  if (fechaSinHora.getTime() === hoy.getTime()) {
    return `hoy · ${horaTexto}`;
  }

  if (fechaSinHora.getTime() === manana.getTime()) {
    return `mañana · ${horaTexto}`;
  }

  const diaSemana = fecha.toLocaleDateString("es-MX", { weekday: "short" });
  const fechaCorta = fecha.toLocaleDateString("es-MX");

  return `${diaSemana} · ${fechaCorta} · ${horaTexto}`;
};

export const formatearFechaConDiaV2 = (fecha: Date): string => {
  const ahora = new Date();
  const hoy = new Date(ahora.getFullYear(), ahora.getMonth(), ahora.getDate());
  const manana = new Date(hoy);
  manana.setDate(hoy.getDate() + 1);


  const horaTexto = fecha.toLocaleTimeString("es-MX", {
    hour: "2-digit",
    minute: "2-digit",
  });

  const diaSemana = fecha.toLocaleDateString("es-MX", {
    weekday: "long",
  });

  const fechaCompleta = fecha.toLocaleDateString("es-MX", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  });

  // Capitalizamos la primera letra del día y del mes (por si aparecen en minúsculas)
  const capitalizar = (s: string) => s.charAt(0).toUpperCase() + s.slice(1);

  return `${capitalizar(diaSemana)} ${capitalizar(fechaCompleta)} ${horaTexto}`;
};