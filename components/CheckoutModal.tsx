import React, { useState } from 'react';
import { X, User, Phone, MapPin, Package, MessageCircle, Check, Truck, Store, Tag, CheckCircle2, XCircle } from 'lucide-react';
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

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6 space-y-5">
          {step === 'form' && (
            <>
              {/* Name */}
              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase mb-1.5 tracking-wide">
                  <User size={11} className="inline mr-1" />Seu nome
                </label>
                <input
                  type="text" placeholder="Maria Silva" value={data.customerName}
                  onChange={e => setData({ ...data, customerName: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl border-2 border-gray-100 focus:border-green-400 outline-none transition-colors text-sm"
                  style={{ backgroundColor: 'white', color: theme.textColor }} autoFocus
                />
              </div>

              {/* Phone */}
              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase mb-1.5 tracking-wide">
                  <Phone size={11} className="inline mr-1" />Telefone/WhatsApp
                </label>
                <input
                  type="tel" placeholder="(11) 99999-9999" value={data.customerPhone}
                  onChange={e => setData({ ...data, customerPhone: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl border-2 border-gray-100 focus:border-green-400 outline-none transition-colors text-sm"
                  style={{ backgroundColor: 'white', color: theme.textColor }}
                />
              </div>

              {/* Delivery */}
              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase mb-2 tracking-wide">
                  <Package size={11} className="inline mr-1" />Como deseja receber?
                </label>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    onClick={() => setData({ ...data, deliveryType: 'delivery' })}
                    className={`p-3 rounded-xl border-2 flex flex-col items-center gap-2 transition-all ${data.deliveryType === 'delivery' ? 'border-green-500 bg-green-50' : 'border-gray-100 bg-white'}`}
                  >
                    <Truck size={22} className={data.deliveryType === 'delivery' ? 'text-green-600' : 'text-gray-400'} />
                    <span className={`text-xs font-bold ${data.deliveryType === 'delivery' ? 'text-green-700' : 'text-gray-500'}`}>Entrega</span>
                  </button>
                  <button
                    onClick={() => setData({ ...data, deliveryType: 'pickup' })}
                    className={`p-3 rounded-xl border-2 flex flex-col items-center gap-2 transition-all ${data.deliveryType === 'pickup' ? 'border-green-500 bg-green-50' : 'border-gray-100 bg-white'}`}
                  >
                    <Store size={22} className={data.deliveryType === 'pickup' ? 'text-green-600' : 'text-gray-400'} />
                    <span className={`text-xs font-bold ${data.deliveryType === 'pickup' ? 'text-green-700' : 'text-gray-500'}`}>Retirar</span>
                  </button>
                </div>
              </div>

              {/* Address */}
              {data.deliveryType === 'delivery' && (
                <div>
                  <label className="block text-xs font-bold text-gray-500 uppercase mb-1.5 tracking-wide">
                    <MapPin size={11} className="inline mr-1" />Endereço de entrega
                  </label>
                  <textarea
                    placeholder="Rua, número, bairro, cidade..."
                    value={data.address || ''} rows={2}
                    onChange={e => setData({ ...data, address: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl border-2 border-gray-100 focus:border-green-400 outline-none transition-colors text-sm resize-none"
                    style={{ backgroundColor: 'white', color: theme.textColor }}
                  />
                </div>
              )}

              {/* Coupon */}
              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase mb-1.5 tracking-wide">
                  <Tag size={11} className="inline mr-1" />Cupom de desconto (opcional)
                </label>
                {appliedCoupon ? (
                  <div className="flex items-center justify-between px-4 py-3 bg-green-50 border-2 border-green-400 rounded-xl">
                    <div className="flex items-center gap-2">
                      <CheckCircle2 size={16} className="text-green-600" />
                      <span className="text-sm font-bold text-green-700">{appliedCoupon.code}</span>
                      <span className="text-xs text-green-600">
                        {appliedCoupon.type === 'percent' ? `-${appliedCoupon.value}%` : `-R$ ${appliedCoupon.value.toFixed(2).replace('.', ',')}`}
                      </span>
                    </div>
                    <button onClick={() => { removeCoupon(); setCouponStatus('idle'); setCouponInput(''); }} className="text-green-500 hover:text-red-500 transition-colors">
                      <XCircle size={16} />
                    </button>
                  </div>
                ) : (
                  <div className="flex gap-2">
                    <input
                      type="text" placeholder="Ex: PROMO10" value={couponInput}
                      onChange={e => { setCouponInput(e.target.value.toUpperCase()); setCouponStatus('idle'); }}
                      onKeyDown={e => e.key === 'Enter' && handleCouponApply()}
                      className={`flex-1 px-4 py-3 rounded-xl border-2 outline-none transition-colors text-sm font-mono ${
                        couponStatus === 'invalid' ? 'border-red-300 bg-red-50' : 'border-gray-100 focus:border-yellow-400'
                      }`}
                      style={{ backgroundColor: 'white', color: theme.textColor }}
                    />
                    <button
                      onClick={handleCouponApply}
                      className="px-4 py-3 rounded-xl font-bold text-sm text-white transition-colors"
                      style={{ backgroundColor: theme.primaryColor }}
                    >
                      Aplicar
                    </button>
                  </div>
                )}
                {couponStatus === 'invalid' && (
                  <p className="text-[10px] text-red-500 mt-1">Cupom inválido, expirado ou pedido mínimo não atingido.</p>
                )}
              </div>
            </>
          )}

          {step === 'confirm' && (
            <div className="space-y-4">
              <div className="bg-gray-50 rounded-2xl p-4">
                <h3 className="text-xs font-bold text-gray-500 uppercase mb-3">Resumo do Pedido</h3>
                {cart.map(item => (
                  <div key={item.id} className="flex justify-between text-sm mb-2">
                    <span className="text-gray-700">{item.quantity}x {item.title}</span>
                    <span className="font-bold" style={{ color: theme.primaryColor }}>{item.price}</span>
                  </div>
                ))}
                {appliedCoupon && (
                  <div className="flex justify-between text-sm mb-2 text-green-600">
                    <span>Desconto ({appliedCoupon.code})</span>
                    <span className="font-bold">- R$ {discount.toFixed(2).replace('.', ',')}</span>
                  </div>
                )}
                <div className="border-t border-gray-200 pt-3 mt-2 flex justify-between">
                  <span className="font-bold text-gray-700">Total</span>
                  <span className="text-xl font-bold" style={{ color: theme.primaryColor }}>
                    R$ {total.toFixed(2).replace('.', ',')}
                  </span>
                </div>
              </div>

              <div className="bg-green-50 rounded-2xl p-4 border border-green-100">
                <h3 className="text-xs font-bold text-green-700 uppercase mb-3 flex items-center gap-1">
                  <Check size={12} /> Seus dados
                </h3>
                <p className="text-sm text-gray-700 mb-1"><strong>Nome:</strong> {data.customerName}</p>
                <p className="text-sm text-gray-700 mb-1"><strong>Tel:</strong> {data.customerPhone}</p>
                <p className="text-sm text-gray-700">
                  <strong>{data.deliveryType === 'delivery' ? 'Entrega:' : 'Retirada na loja'}</strong>
                  {data.deliveryType === 'delivery' && ` ${data.address}`}
                </p>
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
      </div>
    </div>
  );
};

export default CheckoutModal;
