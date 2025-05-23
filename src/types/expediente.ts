import { EstadoAplicacion } from "@prisma/client";

export type UsuarioMini = {
  image: string; // ✅ obligatorio
};

export type PerfilMini = {
  id: number;
  nombre: string;
  prefijo: string;
  usuario?: UsuarioMini | null;
};

export type Aplicacion = {
  id: number;
  fechaProgramada: string;
  fechaReal: string | null;
  estado: EstadoAplicacion;
  observaciones?: string | null;

  nombreMedicamentoManual?: string | null; // ✅ nombre real
  dosis?: string | null;                   // ✅ dosis real
  via?: string | null;                     // ✅ vía real

  ejecutor?: {
    id: number;
    nombre: string;
    prefijo?: string;
    usuario?: {
      image: string; // ✅ obligatorio
    } | null;
  } | null;

  medicamento?: {
    nombre: string;
    dosis: string;
    via: string;
  } | null;
};

export type Medicamento = {
  id: number;
  nombre: string;
  dosis: string;
  via: string;
  frecuenciaHoras?: number | null;
  veces?: number | null;
  desde?: string | null;
  observaciones?: string | null;
  paraCasa: boolean;
  tiempoIndefinido: boolean;
  aplicaciones: Aplicacion[]; // ✅ actualizamos para usar el tipo completo
};

export type NotaClinica = {
  id: number;
  fechaCreacion: string;
  historiaClinica?: string | null;
  exploracionFisica?: string | null;
  temperatura?: number | null;
  peso?: number | null;
  frecuenciaCardiaca?: number | null;
  frecuenciaRespiratoria?: number | null;
  diagnosticoPresuntivo?: string | null;
  pronostico?: string | null;
  laboratoriales?: string | null;
  extras?: string | null;
  autor: PerfilMini;
  medicamentos: Medicamento[];

  activa: boolean;
  canceladaPorId?: number | null;
  fechaCancelacion?: string | null;
  anuladaPor?: PerfilMini | null;
};

export type ExpedienteConNotas = {
  id: number;
  tipo: string;
  fechaCreacion: string;
  visibleParaTutor: boolean;
  borrado: boolean;
  autor: PerfilMini;
  notasClinicas: NotaClinica[];
};
