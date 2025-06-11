import { S3Client, PutObjectCommand, GetObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl as getAwsSignedUrl } from "@aws-sdk/s3-request-presigner";

export const s3 = new S3Client({
  region: process.env.AWS_REGION!,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
  },
});

export async function getSignedUrl(
  key: string,
  fileType: string,
  operation: "putObject" | "getObject"
) {
  const Bucket = process.env.AWS_BUCKET!;
  const expiresIn = parseInt(process.env.NEXT_PUBLIC_AWS_SIGNED_URL_EXPIRES ?? "300", 10);

  const command =
    operation === "putObject"
      ? new PutObjectCommand({ Bucket, Key: key, ContentType: fileType })
      : new GetObjectCommand({ Bucket, Key: key });

  return getAwsSignedUrl(s3, command, { expiresIn });
}

export async function subirArchivoAS3(token: string, archivo: File) {
  const res = await fetch(`/api/estudios/${token}/archivo`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ fileType: archivo.type, fileName: archivo.name }),
  });

  if (!res.ok) throw new Error("No se pudo obtener URL firmada");

  const { url, key } = await res.json();

  const upload = await fetch(url, {
    method: "PUT",
    headers: { "Content-Type": archivo.type },
    body: archivo,
  });

  if (!upload.ok) throw new Error("Error al subir archivo a S3");

  return { key };
}