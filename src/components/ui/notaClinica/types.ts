export type Expediente = {
  id: number;
  tipo: string;
  fechaCreacion: string;
};

export type Props = {
  expedienteSeleccionado: Expediente | null;
};

export type MedicamentoHorario = {
  frecuenciaHoras: string;
  veces: string;
  desde: string;
};

export type NestedFormValue = string | number | boolean;
export type NestedFormObject = Record<string, NestedFormValue>;
export type NestedFormData = Record<string, NestedFormValue | NestedFormObject[]>;