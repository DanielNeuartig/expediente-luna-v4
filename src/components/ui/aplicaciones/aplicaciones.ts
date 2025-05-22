// src/components/ui/aplicaciones/aplicaciones.ts
import { EstadoAplicacion } from "@prisma/client";
export type Aplicacion = {
  id: number;
  fechaProgramada: string;
  fechaReal?: string | null;
  estado: EstadoAplicacion;
  medicamento?: {
    nombre: string;
    dosis: string;
    via: string;
  } | null;
  medicamentoId?: number | null; // ✅ añade esto
  nombreMedicamentoManual?: string | null;
  via?: string;
  dosis?: string;
  observaciones?: string;
  ejecutor?: {
    id: number;
    nombre: string;
  } | null;
};
