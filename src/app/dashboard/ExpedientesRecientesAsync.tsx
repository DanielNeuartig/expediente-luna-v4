// src/app/dashboard/ExpedientesRecientesAsync.tsx
import { obtenerExpedientesRecientes } from "../api/expedientes/obtener.recientes";
import ListaExpedientesRecientes from "@/components/ui/expedientes/ListaExpedientesRecientes";

export default async function ExpedientesRecientesAsync() {
  const expedientes = await obtenerExpedientesRecientes();

  return (
    <ListaExpedientesRecientes expedientes={expedientes} />
  );
}