import {
  EstadoAplicacion,
  EstadoNotaClinica,
  EstadoExpediente,
  TipoExpediente,
  ViaMedicamento,
} from "@prisma/client";

// Usuario relacionado (solo imagen)
export type UsuarioMini = {
  image: string;
};

// Perfil simplificado
export type PerfilMini = {
  id: number;
  nombre: string;
  prefijo: string;
  usuario?: UsuarioMini | null;
};

// Aplicación de medicamento o indicación
export type Aplicacion = {
  id: number;
  fechaProgramada: string;
  fechaReal: string | null;
  estado: EstadoAplicacion;
  observaciones?: string | null;

  nombreMedicamentoManual?: string | null;
  dosis?: string | null;
  via?: ViaMedicamento | null;

  ejecutor?: PerfilMini | null;

  medicamento?: {
    nombre: string;
    dosis: string;
    via: ViaMedicamento;
  } | null;
};

// Medicamento dentro de una nota clínica
export type Medicamento = {
  id: number;
  nombre: string;
  dosis: string;
  via: ViaMedicamento;
  frecuenciaHoras?: number | null;
  veces?: number | null;
  desde?: string | null;
  observaciones?: string | null;
  paraCasa: boolean;
  tiempoIndefinido: boolean;
  aplicaciones: Aplicacion[];
};

// Indicaciones dentro de una nota clínica
export type Indicacion = {
  id: number;
  descripcion: string;
  frecuenciaHoras?: number | null;
  veces?: number | null;
  desde?: string | null;
  observaciones?: string | null;
  paraCasa: boolean;
  aplicaciones: Aplicacion[];
};

// Archivo laboratorial
export type ArchivoLaboratorial = {
  id: number;
  url: string;
  nombre: string;
  tipo: string;
  fechaSubida: string;
};

// Solicitud laboratorial (ACTUALIZADO)
export type SolicitudLaboratorial = {
  id: number;
  estudio?: string | null; // antes "tipo"
  proveedor: string;
  observacionesClinica?: string | null;
  observacionesLaboratorio?: string | null;
  fechaTomaDeMuestra: string;
  fechaSolicitud: string;
  fechaSubida?: string | null;
  fechaCierre?: string | null;
  estado: "EN_REVISION" | "FIRMADA" | "FINALIZADA" | "ANULADA";
  tokenAcceso: string;
  archivos: ArchivoLaboratorial[];
  token: string; // ✅ añade esto

  notaClinica: {
    expediente: {
      mascota: {
        nombre: string;
        especie: string;
        sexo: string;
        microchip: string;
        esterilizado: string;
        fechaNacimiento: string;
        perfil?: { nombre: string };
        raza?: { nombre: string };
      };
    };
  };
};
// Nota clínica
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
  archivos?: string | null;

  autor: PerfilMini;
  medicamentos: Medicamento[];
  indicaciones: Indicacion[];

  aplicacionesMed?: Aplicacion[];
  aplicacionesInd?: Aplicacion[];

  estado: EstadoNotaClinica;
  fechaCancelacion?: string | null;
  canceladaPorId?: number | null;
  anuladaPor?: PerfilMini | null;

  solicitudesLaboratoriales: SolicitudLaboratorial[];
};

// Expediente con lista de notas
export type ExpedienteConNotas = {
  id: number;
  tipo: TipoExpediente;
  nombre?: string | null;
  estado: EstadoExpediente;
  fechaCreacion: string;
  fechaAlta?: string | null;
  ultimaActividad?: string | null;
  visibleParaTutor: boolean;
  borrado: boolean;
  autor: PerfilMini;
  notasClinicas: NotaClinica[];
  mascotaId: number;
};