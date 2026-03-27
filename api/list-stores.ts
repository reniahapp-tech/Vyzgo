
import { S3Client, ListObjectsV2Command } from "@aws-sdk/client-s3";

const R2_ACCOUNT_ID = process.env.VITE_R2_ACCOUNT_ID;
const R2_ACCESS_KEY_ID = process.env.VITE_R2_ACCESS_KEY_ID;
const R2_SECRET_ACCESS_KEY = process.env.VITE_R2_SECRET_ACCESS_KEY;
const R2_BUCKET_NAME = process.env.VITE_R2_BUCKET_NAME;

const r2Client = new S3Client({
    region: "auto",
    endpoint: `https://${R2_ACCOUNT_ID}.r2.cloudflarestorage.com`,
    credentials: {
        accessKeyId: R2_ACCESS_KEY_ID || "",
        secretAccessKey: R2_SECRET_ACCESS_KEY || "",
    },
});

export default async function handler(req, res) {
    res.setHeader('Access-Control-Allow-Credentials', true);
    res.setHeader('Access-Control-Allow-Origin', '*');

    if (req.method === 'OPTIONS') {
        res.status(200).end();
        return;
    }

    if (req.method !== 'GET') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    try {
        console.log(`[API] Listing stores from bucket ${R2_BUCKET_NAME}...`);

        const command = new ListObjectsV2Command({
            Bucket: R2_BUCKET_NAME,
            Prefix: 'config-',
        });

        const response = await r2Client.send(command);

        const stores = (response.Contents || [])
            .map(item => item.Key)
            .filter(key => !!key)
            .map(key => key.replace('config-', '').replace('.json', ''));

        console.log(`[API] Found ${stores.length} stores.`);

        return res.status(200).json({ stores });
    } catch (error) {
        console.error('[API] Error listing stores:', error);
        return res.status(500).json({ error: error.message || 'Internal Server Error' });
    }
}
