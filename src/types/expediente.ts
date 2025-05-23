import { EstadoAplicacion, EstadoNotaClinica } from "@prisma/client";

export type UsuarioMini = {
  image: string;
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

  nombreMedicamentoManual?: string | null;
  dosis?: string | null;
  via?: string | null;

  ejecutor?: PerfilMini | null;

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
  aplicaciones: Aplicacion[];
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

  estado: EstadoNotaClinica;
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