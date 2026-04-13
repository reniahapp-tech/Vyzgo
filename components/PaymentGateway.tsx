import React, { useState } from 'react';
import { Lock, ShieldCheck, X, ArrowRight } from 'lucide-react';
import { useConfig } from '../contexts/ConfigContext';

interface PaymentGatewayProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  planName: string;
  price: string;
}

const PaymentGateway: React.FC<PaymentGatewayProps> = ({ isOpen, onClose, onSuccess, planName, price }) => {
  const { addToast, storeId } = useConfig();
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState<'form' | 'processing'>('form');

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    cpfCnpj: '',
    mobilePhone: '',
  });

  if (!isOpen) return null;

  const handleAsaasSubscribe = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.cpfCnpj || !formData.mobilePhone) {
      addToast('Preencha todos os campos obrigatórios.', 'error');
      return;
    }

    setLoading(true);
    setStep('processing');

    try {
      const response = await fetch('/api/asaas/subscribe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          storeId,
          ...formData,
          amount: parseFloat(price.replace('R$', '').replace(',', '.').trim()) || 39.90,
          cycle: 'MONTHLY'
        })
      });

      const result = await response.json();

      if (response.ok && result.invoiceUrl) {
        addToast('Assinatura gerada! Redirecionando para o pagamento...', 'success');
        // Redireciona para o checkout do Asaas
        window.location.href = result.invoiceUrl;
      } else {
        throw new Error(result.error || 'Erro ao gerar assinatura no Asaas.');
      }
    } catch (e: any) {
      setLoading(false);
      addToast(e.message || 'Erro de conexão. Tente novamente.', 'error');
      setStep('form');
    }
  };

  return (
    <div className="fixed inset-0 z-[120] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" onClick={loading ? undefined : onClose}></div>

      <div className="relative w-full max-w-md bg-white rounded-[2.5rem] overflow-hidden shadow-2xl animate-in slide-in-from-bottom-10 duration-300">
        {/* Header */}
        <div className="bg-indigo-600 p-8 text-white relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-10 -mt-10 blur-xl"></div>
          <div className="relative z-10 flex justify-between items-start">
            <div>
              <p className="text-[10px] uppercase font-black text-indigo-200 mb-1 tracking-widest">Assinando o Plano</p>
              <h2 className="text-3xl font-black italic uppercase tracking-tighter">{planName}</h2>
              <p className="text-4xl font-black mt-2 text-white">{price}<span className="text-sm font-normal text-white/60">/mês</span></p>
            </div>
            <ShieldCheck size={40} className="text-white/20" />
          </div>
          {!loading && (
            <button onClick={onClose} className="absolute top-6 right-6 text-white/50 hover:text-white transition-colors"><X size={24} /></button>
          )}
        </div>

        {/* Content */}
        <div className="p-8">
          {step === 'form' && (
            <form onSubmit={handleAsaasSubscribe} className="space-y-4">
              <div className="bg-indigo-50 border border-indigo-100 p-4 rounded-2xl flex items-center gap-3 mb-2">
                <Lock size={18} className="text-indigo-500" />
                <p className="text-[10px] text-indigo-700 font-black uppercase tracking-wider">Checkout Seguro via Asaas</p>
              </div>

              <div className="space-y-4">
                <div className="space-y-1">
                  <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Nome Completo</label>
                  <input
                    type="text"
                    placeholder="João da Silva"
                    required
                    value={formData.name}
                    onChange={e => setFormData({ ...formData, name: e.target.value })}
                    className="w-full px-5 py-4 bg-gray-50 border-2 border-transparent focus:border-indigo-500 focus:bg-white rounded-2xl outline-none transition-all font-bold text-gray-900"
                  />
                </div>

                <div className="space-y-1">
                  <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">E-mail para Nota Fiscal</label>
                  <input
                    type="email"
                    placeholder="seu@email.com"
                    required
                    value={formData.email}
                    onChange={e => setFormData({ ...formData, email: e.target.value })}
                    className="w-full px-5 py-4 bg-gray-50 border-2 border-transparent focus:border-indigo-500 focus:bg-white rounded-2xl outline-none transition-all font-bold text-gray-900"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">CPF ou CNPJ</label>
                    <input
                      type="text"
                      placeholder="000.000.000-00"
                      required
                      value={formData.cpfCnpj}
                      onChange={e => setFormData({ ...formData, cpfCnpj: e.target.value.replace(/\D/g, '') })}
                      className="w-full px-5 py-4 bg-gray-50 border-2 border-transparent focus:border-indigo-500 focus:bg-white rounded-2xl outline-none transition-all font-bold text-gray-900"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">WhatsApp</label>
                    <input
                      type="tel"
                      placeholder="(00) 00000-0000"
                      required
                      value={formData.mobilePhone}
                      onChange={e => setFormData({ ...formData, mobilePhone: e.target.value })}
                      className="w-full px-5 py-4 bg-gray-50 border-2 border-transparent focus:border-indigo-500 focus:bg-white rounded-2xl outline-none transition-all font-bold text-gray-900"
                    />
                  </div>
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-black py-5 rounded-2xl shadow-xl shadow-indigo-100 transition-all active:scale-[0.98] mt-6 flex items-center justify-center gap-3 uppercase tracking-widest text-sm"
              >
                Gerar Pagamento (Pix/Cartão)
                <ArrowRight size={20} />
              </button>
              
              <p className="text-[9px] text-gray-400 text-center font-medium leading-relaxed px-4">
                Ao clicar em gerar pagamento, você será redirecionado para o ambiente seguro do Asaas para finalizar via Pix, Boleto ou Cartão.
              </p>
            </form>
          )}

          {step === 'processing' && (
            <div className="py-20 flex flex-col items-center justify-center text-center">
              <div className="w-20 h-20 border-4 border-indigo-100 border-t-indigo-600 rounded-full animate-spin mb-8"></div>
              <h3 className="font-black text-2xl text-gray-900 italic uppercase">Criando sua Assinatura...</h3>
              <p className="text-sm text-gray-500 mt-2">Comunicando com o sistema do Asaas.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default PaymentGateway;