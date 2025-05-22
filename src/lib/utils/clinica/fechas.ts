// src/components/ui/notaClinica/utils.ts

export function calcularFechasAplicacion(
  desde: Date,
  frecuenciaHoras: number,
  veces: number
): Date[] {
  const fechas: Date[] = [];

  for (let i = 0; i < veces; i++) {
    const nuevaFecha = new Date(desde);
    nuevaFecha.setHours(nuevaFecha.getHours() + i * frecuenciaHoras);
    fechas.push(nuevaFecha);
  }

  return fechas;
}