
import { AsaasService } from '../services/asaasService';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.VITE_SUPABASE_URL || '';
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || ''; // Needs to be added to .env

const supabase = createClient(supabaseUrl, supabaseServiceKey);

export default async function handler(req, res) {
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    try {
        const { storeId, name, email, cpfCnpj, mobilePhone, amount, cycle } = req.body;

        if (!storeId || !name || !email || !cpfCnpj || !mobilePhone) {
            return res.status(400).json({ error: 'Faltam dados obrigatórios.' });
        }

        // 1. Create or Find Customer in Asaas
        // (In a real app, we would check if asaas_customer_id already exists in Supabase)
        const customer = await AsaasService.createCustomer({
             name,
             email,
             cpfCnpj,
             mobilePhone
        });

        // 2. Create Subscription
        const subscription = await AsaasService.createSubscription({
            customer: customer.id,
            billingType: 'UNDEFINED', // Let Asaas decide/allow all
            value: amount || 39.90,
            nextDueDate: new Date(Date.now() + 1000 * 60 * 60 * 24 * 7).toISOString().split('T')[0], // 7 days from now
            cycle: cycle || 'MONTHLY',
            description: `Assinatura Vitrine Pro - Loja ${storeId}`
        });

        // 3. Update Store with Asaas IDs
        await supabase
            .from('stores')
            .update({
                asaas_customer_id: customer.id,
                asaas_subscription_id: subscription.id,
                subscription_status: 'pending'
            })
            .eq('id', storeId);

        return res.status(200).json({ 
            success: true, 
            invoiceUrl: subscription.invoiceUrl,
            subscriptionId: subscription.id
        });

    } catch (error: any) {
        console.error('[API Subscribe] Error:', error);
        return res.status(500).json({ error: error.message || 'Erro ao processar assinatura.' });
    }
}
