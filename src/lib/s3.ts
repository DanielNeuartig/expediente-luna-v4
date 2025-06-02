// src/lib/s3.ts
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
  const expiresIn = parseInt(process.env.AWS_SIGNED_URL_EXPIRES ?? "300", 10);

  const command =
    operation === "putObject"
      ? new PutObjectCommand({ Bucket, Key: key, ContentType: fileType })
      : new GetObjectCommand({ Bucket, Key: key });

  return getAwsSignedUrl(s3, command, { expiresIn });
}