export type SolicitudLaboratorial = {
  id: number;
  estudio: string;
  proveedor: string;
  observacionesClinica: string | null;
  fechaTomaDeMuestra: string;
  estado: string;
  archivos: {
    id: number;
    url: string;
    nombre: string;
    tipo: "PDF" | "PNG" | "JPG" | "JPEG";
  }[];
  notaClinica: {
    expediente: {
      mascota: {
        nombre: string;
        especie: string;
        sexo: string;
        microchip: string;
        esterilizado: string;
        fechaNacimiento: string;
        perfil?: {
          nombre: string;
        };
        raza?: {
          nombre: string;
        };
      };
    };
  };
};