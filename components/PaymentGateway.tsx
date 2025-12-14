import React, { useState } from 'react';
import { CreditCard, Lock, Check, ShieldCheck, X, QrCode, Copy } from 'lucide-react';
import { useConfig } from '../contexts/ConfigContext';

interface PaymentGatewayProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  planName: string;
  price: string;
}

const PaymentGateway: React.FC<PaymentGatewayProps> = ({ isOpen, onClose, onSuccess, planName, price }) => {
  const { addToast } = useConfig();
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState<'method' | 'form' | 'pix' | 'processing' | 'success'>('method');

  const [formData, setFormData] = useState({
    number: '',
    name: '',
    expiry: '',
    cvc: ''
  });

  if (!isOpen) return null;

  const handlePay = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.number || !formData.name || !formData.cvc) {
      addToast('Preencha todos os campos do cartão.', 'error');
      return;
    }

    setLoading(true);
    setStep('processing');

    // Simulate API Latency
    setTimeout(() => {
      setLoading(false);
      setStep('success');
      setTimeout(() => {
        onSuccess(); // Close and trigger callback
      }, 2000);
    }, 2500);
  };

  const handlePixCopy = () => {
    navigator.clipboard.writeText("00020126580014BR.GOV.BCB.PIX0136123e4567-e89b-12d3-a456-426614174000520400005303986540529.905802BR5913NaturaVida App6008Brasilia62070503***6304");
    addToast('Código PIX copiado!');
    
    // Simulate detecting payment after copy
    setTimeout(() => {
       setLoading(true);
       setStep('processing');
       setTimeout(() => {
         setLoading(false);
         setStep('success');
         setTimeout(() => {
           onSuccess(); 
         }, 2000);
       }, 2000);
    }, 5000);
  };

  // Format Card Number
  const handleNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let val = e.target.value.replace(/\D/g, '');
    val = val.replace(/(\d{4})/g, '$1 ').trim();
    setFormData({ ...formData, number: val.substring(0, 19) });
  };

  if (step === 'success') {
    return (
      <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-green-500">
        <div className="text-center text-white animate-in zoom-in duration-500">
          <div className="w-24 h-24 bg-white rounded-full flex items-center justify-center mx-auto mb-6 shadow-xl">
             <Check size={48} className="text-green-500" strokeWidth={4} />
          </div>
          <h2 className="text-3xl font-bold mb-2">Pagamento Aprovado!</h2>
          <p className="text-lg opacity-90">Bem-vindo ao plano {planName}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-[90] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" onClick={loading ? undefined : onClose}></div>
      
      <div className="relative w-full max-w-md bg-white rounded-3xl overflow-hidden shadow-2xl animate-in slide-in-from-bottom-10 duration-300">
        {/* Header */}
        <div className="bg-gray-900 p-6 text-white relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-10 -mt-10 blur-xl"></div>
          <div className="relative z-10 flex justify-between items-start">
             <div>
               <p className="text-xs uppercase font-bold text-gray-400 mb-1">Assinando</p>
               <h2 className="text-2xl font-bold">{planName}</h2>
               <p className="text-3xl font-bold mt-2 text-green-400">{price}<span className="text-sm font-normal text-white/60">/mês</span></p>
             </div>
             <ShieldCheck size={32} className="text-green-400" />
          </div>
          {!loading && (
            <button onClick={onClose} className="absolute top-4 right-4 text-white/50 hover:text-white"><X size={20}/></button>
          )}
        </div>

        {/* Method Selection */}
        {step === 'method' && (
           <div className="p-6">
              <h3 className="text-sm font-bold text-gray-800 mb-4 uppercase">Escolha como pagar</h3>
              
              <button 
                onClick={() => setStep('form')}
                className="w-full flex items-center gap-4 p-4 rounded-xl border border-gray-200 hover:border-gray-900 hover:bg-gray-50 transition-all mb-3 group"
              >
                 <div className="w-10 h-10 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center group-hover:scale-110 transition-transform">
                   <CreditCard size={20} />
                 </div>
                 <div className="text-left">
                   <p className="font-bold text-sm text-gray-900">Cartão de Crédito</p>
                   <p className="text-xs text-gray-500">Liberação imediata</p>
                 </div>
              </button>

              <button 
                onClick={() => setStep('pix')}
                className="w-full flex items-center gap-4 p-4 rounded-xl border border-gray-200 hover:border-green-600 hover:bg-green-50 transition-all group"
              >
                 <div className="w-10 h-10 rounded-full bg-green-100 text-green-600 flex items-center justify-center group-hover:scale-110 transition-transform">
                   <QrCode size={20} />
                 </div>
                 <div className="text-left">
                   <p className="font-bold text-sm text-gray-900">Pix</p>
                   <p className="text-xs text-gray-500">Aprovação em segundos</p>
                 </div>
              </button>
           </div>
        )}

        {/* PIX Flow */}
        {step === 'pix' && (
          <div className="p-6 text-center">
             <h3 className="text-sm font-bold text-gray-800 mb-2">Escaneie o QR Code</h3>
             <p className="text-xs text-gray-500 mb-6">Abra o app do seu banco e pague instantaneamente.</p>
             
             <div className="w-48 h-48 bg-gray-100 mx-auto rounded-xl flex items-center justify-center mb-6 border-2 border-dashed border-gray-300">
               <QrCode size={96} className="opacity-80" />
               {/* In a real app, render the actual QR Code Image here */}
             </div>

             <div className="bg-gray-50 p-3 rounded-lg flex items-center gap-2 mb-4">
               <input 
                 value="00020126580014BR.GOV.BCB.PIX..." 
                 readOnly 
                 className="bg-transparent text-xs text-gray-500 flex-1 outline-none" 
               />
               <button onClick={handlePixCopy} className="text-green-600 font-bold text-xs flex items-center gap-1 hover:text-green-700">
                 <Copy size={12}/> Copiar
               </button>
             </div>

             <button onClick={() => setStep('method')} className="text-xs text-gray-400 underline">Voltar</button>
          </div>
        )}

        {/* Credit Card Form */}
        {step === 'form' && (
          <form onSubmit={handlePay} className="p-6 space-y-4">
            <div className="flex items-center gap-2 mb-2">
               <button type="button" onClick={() => setStep('method')} className="text-xs text-gray-400 hover:text-gray-900 font-bold">Voltar</button>
            </div>
            
            <div className="bg-blue-50 border border-blue-100 p-3 rounded-lg flex items-center gap-2 mb-2">
              <Lock size={14} className="text-blue-500" />
              <p className="text-xs text-blue-700 font-medium">Ambiente seguro e criptografado.</p>
            </div>

            <div className="space-y-3">
              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Número do Cartão</label>
                <div className="relative">
                  <CreditCard size={18} className="absolute left-3 top-3 text-gray-400" />
                  <input 
                    type="text" 
                    placeholder="0000 0000 0000 0000"
                    value={formData.number}
                    onChange={handleNumberChange}
                    className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-gray-900 outline-none transition-all font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Nome no Cartão</label>
                <input 
                  type="text" 
                  placeholder="JOAO A SILVA"
                  value={formData.name}
                  onChange={e => setFormData({...formData, name: e.target.value.toUpperCase()})}
                  className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-gray-900 outline-none transition-all"
                />
              </div>

              <div className="flex gap-4">
                <div className="flex-1">
                  <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Validade</label>
                  <input 
                    type="text" 
                    placeholder="MM/AA"
                    maxLength={5}
                    value={formData.expiry}
                    onChange={e => setFormData({...formData, expiry: e.target.value})}
                    className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-gray-900 outline-none transition-all text-center"
                  />
                </div>
                <div className="w-1/3">
                  <label className="block text-xs font-bold text-gray-500 uppercase mb-1">CVC</label>
                  <input 
                    type="text" 
                    placeholder="123"
                    maxLength={4}
                    value={formData.cvc}
                    onChange={e => setFormData({...formData, cvc: e.target.value})}
                    className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-gray-900 outline-none transition-all text-center"
                  />
                </div>
              </div>
            </div>

            <button 
              type="submit"
              className="w-full bg-gray-900 text-white font-bold py-4 rounded-xl shadow-lg hover:bg-black transition-transform active:scale-[0.98] mt-4 flex items-center justify-center gap-2"
            >
              Confirmar Pagamento
            </button>
          </form>
        )}

        {step === 'processing' && (
          <div className="p-12 flex flex-col items-center justify-center text-center">
            <div className="w-16 h-16 border-4 border-gray-100 border-t-green-500 rounded-full animate-spin mb-6"></div>
            <h3 className="font-bold text-lg text-gray-800">Processando...</h3>
            <p className="text-sm text-gray-500">Validando pagamento.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default PaymentGateway;