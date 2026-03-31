import React, { useState } from 'react';
import { X, User, Phone, MapPin, Package, MessageCircle, Check, Truck, Store, Tag, CheckCircle2, XCircle, ArrowRight } from 'lucide-react';
import { useConfig } from '../contexts/ConfigContext';
import { CheckoutData, Order } from '../types';

const CheckoutModal: React.FC = () => {
  const {
    config, cart, getCartTotal, getCartTotalWithDiscount,
    isCheckoutOpen, setIsCheckoutOpen, setIsCartOpen,
    addOrder, clearCart, addToast, storeId,
    appliedCoupon, applyCoupon, removeCoupon
  } = useConfig();
  const { theme, whatsapp } = config;

  const [step, setStep] = useState<'form' | 'confirm'>('form');
  const [data, setData] = useState<CheckoutData>({
    customerName: '',
    customerPhone: '',
    deliveryType: 'delivery',
    address: '',
  });
  const [couponInput, setCouponInput] = useState('');
  const [couponStatus, setCouponStatus] = useState<'idle' | 'valid' | 'invalid'>('idle');

  if (!isCheckoutOpen) return null;

  const subtotal = getCartTotal();
  const total = getCartTotalWithDiscount();
  const discount = subtotal - total;

  const handleClose = () => {
    setIsCheckoutOpen(false);
    setStep('form');
  };

  const handleBack = () => {
    setIsCheckoutOpen(false);
    setIsCartOpen(true);
    setStep('form');
  };

  const isFormValid = () => {
    if (!data.customerName.trim() || !data.customerPhone.trim()) return false;
    if (data.deliveryType === 'delivery' && !data.address?.trim()) return false;
    return true;
  };

  const handleCouponApply = () => {
    if (!couponInput.trim()) return;
    const ok = applyCoupon(couponInput.trim());
    setCouponStatus(ok ? 'valid' : 'invalid');
    if (ok) addToast('Cupom aplicado! 🎉', 'success');
    else addToast('Cupom inválido ou expirado.', 'error');
  };

  const handleConfirm = () => {
    let message = `Olá! Gostaria de fazer um pedido na *${config.header.title}*:\n\n`;
    cart.forEach(item => {
      message += `▪️ ${item.quantity}x ${item.title} — ${item.price}\n`;
    });
    if (appliedCoupon) {
      message += `\n*Desconto (${appliedCoupon.code}):* - R$ ${discount.toFixed(2).replace('.', ',')}`;
    }
    message += `\n*Total: R$ ${total.toFixed(2).replace('.', ',')}*`;
    message += `\n\n*Cliente:* ${data.customerName}`;
    message += `\n*Telefone:* ${data.customerPhone}`;
    message += data.deliveryType === 'delivery'
      ? `\n*Entrega no endereço:* ${data.address}`
      : `\n*Retirada na loja*`;

    const order: Order = {
      id: `ORD-${Date.now()}`,
      storeId,
      items: [...cart],
      total,
      discount: discount > 0 ? discount : undefined,
      couponCode: appliedCoupon?.code,
      customer: data,
      status: 'pending',
      createdAt: new Date().toISOString(),
    };
    addOrder(order);
    clearCart();
    removeCoupon();

    const url = `https://wa.me/${whatsapp.phoneNumber}?text=${encodeURIComponent(message)}`;
    window.open(url, '_blank');

    addToast('Pedido enviado! Acompanhe pelo WhatsApp. 🎉', 'success');
    handleClose();
  };

  return (
    <div className="fixed inset-0 z-[120] flex items-stretch justify-center sm:items-center">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-md transition-opacity animate-in fade-in duration-300" onClick={handleClose} />
      <div
        className="relative w-full max-w-xl bg-white rounded-t-[2.5rem] sm:rounded-[2.5rem] shadow-2xl animate-in slide-in-from-bottom-10 duration-500 flex flex-col max-h-[95vh] overflow-hidden"
      >
        {/* Header */}
        <div className="flex items-center justify-between px-8 py-8 border-b border-gray-50 bg-white sticky top-0 z-10 shrink-0">
          <div className="flex items-center gap-4">
            <button onClick={handleBack} className="w-10 h-10 flex items-center justify-center rounded-full bg-gray-50 hover:bg-gray-100 transition-all active:scale-90 text-gray-400">
               {step === 'form' ? <X size={20} strokeWidth={2.5} /> : <ArrowRight size={20} className="rotate-180" strokeWidth={2.5} />}
            </button>
            <div className="flex flex-col">
              <h2 className="text-2xl font-black text-gray-900 uppercase tracking-tighter">
                {step === 'form' ? 'Seus Dados' : 'Quase Pronto'}
              </h2>
              <p className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 mt-0.5">
                {step === 'form' ? 'Checkout Seguro' : 'Confirme seu pedido'}
              </p>
            </div>
          </div>
          <div className="flex gap-2">
            <div className={`h-1.5 rounded-full transition-all duration-300 ${step === 'form' ? 'w-8 bg-indigo-600' : 'w-2 bg-gray-100'}`} />
            <div className={`h-1.5 rounded-full transition-all duration-300 ${step === 'confirm' ? 'w-8 bg-indigo-600' : 'w-2 bg-gray-100'}`} />
          </div>
        </div>

        {/* Content Area */}
        <div className="flex-1 overflow-y-auto p-6 space-y-5">
          {step === 'form' && (
            <div className="space-y-6">
              {/* Name */}
              <div className="space-y-2">
                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest px-1">
                  Seu Nome Completo
                </label>
                <div className="relative group">
                  <div className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-indigo-600 transition-colors">
                    <User size={18} />
                  </div>
                  <input
                    type="text" placeholder="Ex: Maria Oliveira" value={data.customerName}
                    onChange={e => setData({ ...data, customerName: e.target.value })}
                    className="w-full pl-12 pr-5 py-4 rounded-2xl bg-gray-50 border border-transparent focus:border-indigo-500/30 focus:bg-white focus:ring-4 focus:ring-indigo-500/5 outline-none transition-all text-gray-900 font-bold"
                  />
                </div>
              </div>

              {/* Phone */}
              <div className="space-y-2">
                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest px-1">
                  WhatsApp para Contato
                </label>
                <div className="relative group">
                  <div className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-indigo-600 transition-colors">
                    <Phone size={18} />
                  </div>
                  <input
                    type="tel" placeholder="(11) 99999-9999" value={data.customerPhone}
                    onChange={e => setData({ ...data, customerPhone: e.target.value })}
                    className="w-full pl-12 pr-5 py-4 rounded-2xl bg-gray-50 border border-transparent focus:border-indigo-500/30 focus:bg-white focus:ring-4 focus:ring-indigo-500/5 outline-none transition-all text-gray-900 font-bold"
                  />
                </div>
              </div>

              {/* Delivery Type */}
              <div className="space-y-3">
                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest px-1">
                  Forma de Recebimento
                </label>
                <div className="grid grid-cols-2 gap-4">
                  <button
                    onClick={() => setData({ ...data, deliveryType: 'delivery' })}
                    className={`p-5 rounded-3xl border-2 flex flex-col items-center gap-3 transition-all active:scale-95 ${data.deliveryType === 'delivery' ? 'border-indigo-600 bg-indigo-50/50 shadow-lg shadow-indigo-100' : 'border-gray-50 bg-gray-50/50'}`}
                  >
                    <div className={`w-12 h-12 rounded-2xl flex items-center justify-center ${data.deliveryType === 'delivery' ? 'bg-indigo-600 text-white shadow-xl shadow-indigo-200' : 'bg-white text-gray-400'}`}>
                      <Truck size={24} />
                    </div>
                    <span className={`text-xs font-black uppercase tracking-widest ${data.deliveryType === 'delivery' ? 'text-indigo-900' : 'text-gray-400'}`}>Entrega</span>
                  </button>
                  <button
                    onClick={() => setData({ ...data, deliveryType: 'pickup' })}
                    className={`p-5 rounded-3xl border-2 flex flex-col items-center gap-3 transition-all active:scale-95 ${data.deliveryType === 'pickup' ? 'border-indigo-600 bg-indigo-50/50 shadow-lg shadow-indigo-100' : 'border-gray-50 bg-gray-50/50'}`}
                  >
                    <div className={`w-12 h-12 rounded-2xl flex items-center justify-center ${data.deliveryType === 'pickup' ? 'bg-indigo-600 text-white shadow-xl shadow-indigo-200' : 'bg-white text-gray-400'}`}>
                      <Store size={24} />
                    </div>
                    <span className={`text-xs font-black uppercase tracking-widest ${data.deliveryType === 'pickup' ? 'text-indigo-900' : 'text-gray-400'}`}>Retirada</span>
                  </button>
                </div>
              </div>

              {/* Address */}
              {data.deliveryType === 'delivery' && (
                <div className="space-y-2 animate-in slide-in-from-top-2 duration-300">
                  <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest px-1">
                    Endereço Completo
                  </label>
                  <div className="relative group">
                    <div className="absolute left-5 top-5 text-gray-400 group-focus-within:text-indigo-600 transition-colors">
                      <MapPin size={18} />
                    </div>
                    <textarea
                      placeholder="Rua, número, bairro, cidade..."
                      value={data.address || ''} rows={3}
                      onChange={e => setData({ ...data, address: e.target.value })}
                      className="w-full pl-12 pr-5 py-4 rounded-2xl bg-gray-50 border border-transparent focus:border-indigo-500/30 focus:bg-white focus:ring-4 focus:ring-indigo-500/5 outline-none transition-all text-gray-900 font-bold resize-none"
                    />
                  </div>
                </div>
              )}

              {/* Coupon */}
              <div className="pt-4 border-t border-gray-50">
                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest px-1 mb-2 block">
                  Tem um Cupom?
                </label>
                {appliedCoupon ? (
                  <div className="flex items-center justify-between px-6 py-4 bg-indigo-50 rounded-2xl border border-indigo-100">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-indigo-600 flex items-center justify-center text-white">
                        <Tag size={14} />
                      </div>
                      <div>
                        <span className="text-xs font-black text-indigo-900 uppercase tracking-widest block">{appliedCoupon.code}</span>
                        <span className="text-[10px] font-bold text-indigo-400">Cupom Aplicado</span>
                      </div>
                    </div>
                    <button onClick={() => { removeCoupon(); setCouponStatus('idle'); setCouponInput(''); }} className="text-red-400 hover:text-red-600 transition-colors">
                      <XCircle size={20} />
                    </button>
                  </div>
                ) : (
                  <div className="flex gap-2">
                    <input
                      type="text" placeholder="EX: VYZGO10" value={couponInput}
                      onChange={e => { setCouponInput(e.target.value.toUpperCase()); setCouponStatus('idle'); }}
                      onKeyDown={e => e.key === 'Enter' && handleCouponApply()}
                      className={`flex-1 px-5 py-4 rounded-2xl bg-gray-50 border border-transparent focus:border-indigo-500/30 focus:bg-white outline-none transition-all text-gray-900 font-black uppercase tracking-widest text-sm ${
                        couponStatus === 'invalid' ? 'border-red-500/30 bg-red-50' : ''
                      }`}
                    />
                    <button
                      onClick={handleCouponApply}
                      className="px-6 py-4 rounded-2xl font-black text-xs text-white uppercase tracking-widest transition-all bg-indigo-600 hover:bg-indigo-700 active:scale-95 shadow-lg shadow-indigo-100"
                    >
                      Aplicar
                    </button>
                  </div>
                )}
              </div>
            </div>
          )}

          {step === 'confirm' && (
            <div className="space-y-6 animate-in fade-in duration-500">
              <div className="bg-gray-50 rounded-[2rem] p-8">
                <h3 className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-6">Resumo da Sacola</h3>
                <div className="space-y-4">
                  {cart.map(item => (
                    <div key={item.id} className="flex justify-between items-center bg-white p-4 rounded-2xl shadow-sm">
                      <div className="flex items-center gap-3">
                         <span className="w-6 h-6 rounded-lg bg-gray-100 flex items-center justify-center text-[10px] font-black text-indigo-600">{item.quantity}x</span>
                         <span className="font-bold text-gray-900 text-sm">{item.title}</span>
                      </div>
                      <span className="font-black text-indigo-600 text-sm">{item.price}</span>
                    </div>
                  ))}
                </div>

                <div className="mt-8 pt-6 border-t border-gray-200">
                  {appliedCoupon && (
                    <div className="flex justify-between items-center mb-2 px-1">
                      <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Desconto Cupom</span>
                      <span className="font-black text-green-500">- R$ {discount.toFixed(2).replace('.', ',')}</span>
                    </div>
                  )}
                  <div className="flex justify-between items-end px-1">
                    <div className="flex flex-col">
                       <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Total do Pedido</span>
                       <span className="text-4xl font-black text-gray-900 tracking-tighter">
                         R$ {total.toFixed(2).replace('.', ',')}
                       </span>
                    </div>
                    <div className="bg-indigo-100 px-3 py-1 rounded-full">
                       <span className="text-[9px] font-black text-indigo-600 uppercase tracking-widest">Pronto p/ Zap</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 gap-4">
                <div className="bg-indigo-600 p-6 rounded-[2rem] text-white flex items-center gap-5 shadow-2xl shadow-indigo-200">
                   <div className="w-14 h-14 rounded-2xl bg-white/20 flex items-center justify-center shrink-0">
                      <User size={28} />
                   </div>
                   <div>
                      <p className="text-[10px] font-black uppercase tracking-widest opacity-60">Para entregar para:</p>
                      <h4 className="text-xl font-black uppercase tracking-tight">{data.customerName}</h4>
                      <p className="text-xs font-bold opacity-80">{data.customerPhone}</p>
                   </div>
                </div>

                <div className="bg-gray-900 p-6 rounded-[2rem] text-white flex items-center gap-5">
                   <div className="w-14 h-14 rounded-2xl bg-white/10 flex items-center justify-center shrink-0">
                      {data.deliveryType === 'delivery' ? <MapPin size={28} /> : <Store size={28} />}
                   </div>
                   <div className="min-w-0">
                      <p className="text-[10px] font-black uppercase tracking-widest opacity-60">
                        {data.deliveryType === 'delivery' ? 'Endereço de Entrega:' : 'Local de Retirada:'}
                      </p>
                      <p className="text-sm font-bold truncate leading-relaxed">
                        {data.deliveryType === 'delivery' ? data.address : 'Retirada Direta na Loja'}
                      </p>
                   </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Sticky Footer Actions */}
        <div className="p-8 bg-white border-t border-gray-50 shrink-0 shadow-[0_-20px_40px_rgba(0,0,0,0.02)]">
          {step === 'form' ? (
            <button
              onClick={() => setStep('confirm')}
              disabled={!isFormValid()}
              className="w-full bg-indigo-600 hover:bg-indigo-700 text-white py-5 rounded-[1.5rem] font-black shadow-2xl shadow-indigo-200 transition-all active:scale-[0.98] disabled:opacity-30 disabled:cursor-not-allowed flex items-center justify-center gap-3 uppercase tracking-widest text-sm"
            >
              Revisar Detalhes
              <ArrowRight size={20} strokeWidth={2.5} />
            </button>
          ) : (
            <div className="space-y-4">
              <button
                onClick={handleConfirm}
                className="w-full bg-[#25D366] hover:bg-[#20ba5a] text-white py-5 rounded-[1.5rem] font-black shadow-2xl shadow-green-200 transition-all active:scale-[0.98] flex items-center justify-center gap-3 uppercase tracking-widest text-sm"
              >
                <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center">
                  <MessageCircle size={18} fill="currentColor" />
                </div>
                Enviar para o WhatsApp
              </button>
              <button 
                onClick={() => setStep('form')} 
                className="w-full text-[10px] text-gray-400 hover:text-gray-600 font-black uppercase tracking-widest py-2"
              >
                ← Voltar e Editar Dados
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CheckoutModal;
