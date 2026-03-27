
import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";

// Initialize S3 Client (R2)
// Note: In Vercel Functions, process.env is used.
// We use the VITE_ prefixed vars because that's what we added to Vercel Env.
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
    // Enable CORS for the API itself if needed (though same-origin is default)
    res.setHeader('Access-Control-Allow-Credentials', true);
    res.setHeader('Access-Control-Allow-Origin', '*');

    if (req.method === 'OPTIONS') {
        res.status(200).end();
        return;
    }

    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    try {
        const { storeId, config } = req.body;

        if (!storeId || !config) {
            return res.status(400).json({ error: 'Missing storeId or config' });
        }

        const fileName = `config-${storeId}.json`;

        console.log(`[API] Uploading config for ${storeId} to bucket ${R2_BUCKET_NAME}...`);

        const command = new PutObjectCommand({
            Bucket: R2_BUCKET_NAME,
            Key: fileName,
            Body: JSON.stringify(config),
            ContentType: "application/json",
        });

        await r2Client.send(command);

        console.log(`[API] Success: ${fileName}`);

        return res.status(200).json({ success: true, storeId });
    } catch (error) {
        console.error('[API] Error creating store:', error);
        return res.status(500).json({ error: error.message || 'Internal Server Error' });
    }
}
