
export interface AsaasCustomer {
    name: string;
    email: string;
    cpfCnpj: string;
    mobilePhone: string;
}

export interface AsaasSubscription {
    customer: string;
    billingType: 'PIX' | 'BOLETO' | 'CREDIT_CARD' | 'UNDEFINED';
    value: number;
    nextDueDate: string;
    cycle: 'WEEKLY' | 'BIWEEKLY' | 'MONTHLY' | 'QUARTERLY' | 'SEMIANNUALLY' | 'YEARLY';
    description: string;
}

const ASAAS_API_KEY = process.env.ASAAS_API_KEY;
const ASAAS_API_URL = process.env.ASAAS_API_URL || 'https://sandbox.asaas.com/api/v3';

export const AsaasService = {
    async createCustomer(data: AsaasCustomer) {
        try {
            const response = await fetch(`${ASAAS_API_URL}/customers`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'access_token': ASAAS_API_KEY || ''
                },
                body: JSON.stringify(data)
            });

            const result = await response.json();
            if (result.errors) {
                throw new Error(result.errors[0].description);
            }
            return result;
        } catch (error: any) {
            console.error('Error creating Asaas customer:', error);
            throw error;
        }
    },

    async createSubscription(data: AsaasSubscription) {
        try {
            const response = await fetch(`${ASAAS_API_URL}/subscriptions`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'access_token': ASAAS_API_KEY || ''
                },
                body: JSON.stringify(data)
            });

            const result = await response.json();
            if (result.errors) {
                throw new Error(result.errors[0].description);
            }
            return result;
        } catch (error: any) {
            console.error('Error creating Asaas subscription:', error);
            throw error;
        }
    },

    async getSubscription(id: string) {
        try {
            const response = await fetch(`${ASAAS_API_URL}/subscriptions/${id}`, {
                headers: {
                    'access_token': ASAAS_API_KEY || ''
                }
            });
            return await response.json();
        } catch (error: any) {
            console.error('Error getting Asaas subscription:', error);
            throw error;
        }
    }
};
