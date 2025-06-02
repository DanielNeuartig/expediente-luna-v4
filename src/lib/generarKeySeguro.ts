import { v4 as uuidv4 } from "uuid";

export function generarKeySeguro(nombreOriginal: string, solicitudId: number): string {
  const extension = nombreOriginal.split(".").pop() ?? "bin";
  const base = nombreOriginal
    .replace(/\.[^/.]+$/, "")
    .replace(/[^a-zA-Z0-9-_]/g, "_")
    .slice(0, 40);

  const uuid = uuidv4();
  return `estudios/solicitud-${solicitudId}/${base}_${uuid}.${extension}`;
}