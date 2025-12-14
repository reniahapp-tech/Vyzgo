
import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";

const R2_ACCOUNT_ID = import.meta.env.VITE_R2_ACCOUNT_ID;
const R2_ACCESS_KEY_ID = import.meta.env.VITE_R2_ACCESS_KEY_ID;
const R2_SECRET_ACCESS_KEY = import.meta.env.VITE_R2_SECRET_ACCESS_KEY;
const R2_BUCKET_NAME = import.meta.env.VITE_R2_BUCKET_NAME;
const R2_PUBLIC_DOMAIN = import.meta.env.VITE_R2_PUBLIC_DOMAIN;

const r2Client = new S3Client({
    region: "auto",
    endpoint: `https://${R2_ACCOUNT_ID}.r2.cloudflarestorage.com`,
    credentials: {
        accessKeyId: R2_ACCESS_KEY_ID || "",
        secretAccessKey: R2_SECRET_ACCESS_KEY || "",
    },
});

export const uploadToR2 = async (file: File): Promise<string> => {
    if (!R2_ACCOUNT_ID || !R2_ACCESS_KEY_ID || !R2_SECRET_ACCESS_KEY || !R2_BUCKET_NAME) {
        throw new Error("Credenciais R2 não configuradas. Verifique o .env.local");
    }

    const fileExtension = file.name.split('.').pop();
    const fileName = `${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExtension}`;

    try {
        const command = new PutObjectCommand({
            Bucket: R2_BUCKET_NAME,
            Key: fileName,
            Body: file,
            ContentType: file.type,
        });

        await r2Client.send(command);

        // If a custom public domain is configured (e.g. pub-xxx.r2.dev), use it.
        // Otherwise, we can't really guess the public URL unless it's enabled.
        if (R2_PUBLIC_DOMAIN) {
            return `${R2_PUBLIC_DOMAIN}/${fileName}`;
        }

        return `https://${R2_ACCOUNT_ID}.r2.cloudflarestorage.com/${R2_BUCKET_NAME}/${fileName}`; // This is usually private, but fallback.
    } catch (error) {
        console.error("Erro ao enviar para R2:", error);
        throw error;
    }
};
