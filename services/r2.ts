
import { S3Client, PutObjectCommand, ListObjectsV2Command } from "@aws-sdk/client-s3";

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

export const saveConfigToR2 = async (storeId: string, config: any): Promise<void> => {
    if (!R2_ACCOUNT_ID || !R2_ACCESS_KEY_ID || !R2_SECRET_ACCESS_KEY || !R2_BUCKET_NAME) {
        throw new Error("Credenciais R2 incompletas.");
    }

    const fileName = `config-${storeId}.json`;

    try {
        const command = new PutObjectCommand({
            Bucket: R2_BUCKET_NAME,
            Key: fileName,
            Body: JSON.stringify(config),
            ContentType: "application/json",
            // ACL: "public-read" // R2 doesn't support ACLs in the same way, bucket policy controls this usually, or public buckets
        });

        await r2Client.send(command);
        console.log(`Configuração salva para ${storeId}`);
    } catch (error) {
        console.error("Erro ao salvar config no R2:", error);
        throw error;
    }
};

export const loadConfigFromR2 = async (storeId: string): Promise<any | null> => {
    // If we have a public domain, use it. Ideally we should.
    // If not, we might fail unless the R2 bucket public URL is standard.
    // We try to construct a public URL. 

    let baseUrl = R2_PUBLIC_DOMAIN;
    if (!baseUrl) {
        // Fallback or warning. Without a public domain, reading might require signing (presigned url) which is complex for public SaaS read.
        // We assume the user has set up a public domain or the r2.dev subdomain.
        console.warn("R2_PUBLIC_DOMAIN not set. Trying to guess or failing.");
        return null;
    }

    // Remove trailing slash if present
    if (baseUrl.endsWith('/')) baseUrl = baseUrl.slice(0, -1);

    const url = `${baseUrl}/config-${storeId}.json?t=${Date.now()}`; // Cache busting with t param

    try {
        const response = await fetch(url);
        if (!response.ok) {
            if (response.status === 404) return null; // Config not found (new store)
            throw new Error(`Failed to fetch config: ${response.statusText}`);
        }
        return await response.json();
    } catch (error) {
        console.error("Erro ao carregar config do R2:", error);
        return null;
    }
};

export const listAllStores = async (): Promise<string[]> => {
    if (!R2_ACCOUNT_ID || !R2_ACCESS_KEY_ID || !R2_SECRET_ACCESS_KEY || !R2_BUCKET_NAME) {
        throw new Error("Credenciais R2 incompletas.");
    }

    try {
        const command = new ListObjectsV2Command({
            Bucket: R2_BUCKET_NAME,
            Prefix: 'config-',
        });

        const response = await r2Client.send(command);

        if (!response.Contents) return [];

        return response.Contents
            .map(item => item.Key)
            .filter((key): key is string => !!key)
            .map(key => key.replace('config-', '').replace('.json', ''));
    } catch (error) {
        console.error("Erro ao listar lojas:", error);
        return [];
    }
};
