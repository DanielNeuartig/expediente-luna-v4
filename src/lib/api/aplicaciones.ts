// src/lib/api/aplicaciones.ts
export async function actualizarAplicacionMedicamento({
  id,
  datos,
}: {
  id: number;
  datos: {
    nombreMedicamentoManual?: string;
    dosis?: string;
    via?: string;
    observaciones?: string;
    estado?: "PENDIENTE" | "REALIZADA" | "OMITIDA" | "CANCELADA";
  };
}) {
  const res = await fetch(`/api/aplicacionesMedicamento/${id}`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(datos),
  });

  if (!res.ok) {
    const error = await res.json();
    throw new Error(error?.error || "Error al actualizar la aplicación");
  }

  return res.json();
}