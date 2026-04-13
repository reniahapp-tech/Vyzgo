
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.VITE_SUPABASE_URL || '';
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || ''; 

const supabase = createClient(supabaseUrl, supabaseServiceKey);

export default async function handler(req, res) {
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    try {
        const event = req.body;
        console.log('[Asaas Webhook] Received event:', event.event);

        // We are interested in payment confirmation or subscription activation
        if (event.event === 'PAYMENT_CONFIRMED' || event.event === 'PAYMENT_RECEIVED' || event.event === 'SUBSCRIPTION_CREATED') {
            const asaasCustomerId = event.payment?.customer || event.subscription?.customer;
            const subscriptionId = event.payment?.subscription || event.subscription?.id;

            if (asaasCustomerId) {
                console.log(`[Asaas Webhook] Updating store for customer: ${asaasCustomerId}`);
                
                const { data, error } = await supabase
                    .from('stores')
                    .update({ 
                        is_pro: true, 
                        subscription_status: 'active',
                        plan_type: 'pro'
                    })
                    .eq('asaas_customer_id', asaasCustomerId);

                if (error) {
                    console.error('[Webook] Supabase Error:', error);
                    return res.status(500).json({ error: 'Erro ao atualizar banco de dados.' });
                }
            }
        }

        // Always return 200 to Asaas
        return res.status(200).json({ received: true });

    } catch (error: any) {
        console.error('[Asaas Webhook] Error:', error);
        return res.status(500).json({ error: error.message || 'Internal Server Error' });
    }
}
