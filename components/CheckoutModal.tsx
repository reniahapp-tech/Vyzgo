import React, { useState } from 'react';
import { X, User, Phone, MapPin, Package, MessageCircle, Check, Truck, Store } from 'lucide-react';
import { useConfig } from '../contexts/ConfigContext';
import { CheckoutData, Order } from '../types';

const CheckoutModal: React.FC = () => {
  const {
    config, cart, getCartTotal, isCheckoutOpen, setIsCheckoutOpen,
    setIsCartOpen, addOrder, clearCart, addToast, storeId
  } = useConfig();
  const { theme, whatsapp } = config;

  const [step, setStep] = useState<'form' | 'confirm'>('form');
  const [data, setData] = useState<CheckoutData>({
    customerName: '',
    customerPhone: '',
    deliveryType: 'delivery',
    address: '',
  });

  if (!isCheckoutOpen) return null;

  const total = getCartTotal();

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

  const handleConfirm = () => {
    // Build WhatsApp message
    let message = `Olá! Gostaria de fazer um pedido na *${config.header.title}*:\n\n`;
    cart.forEach(item => {
      message += `▪️ ${item.quantity}x ${item.title} — ${item.price}\n`;
    });
    message += `\n*Total: R$ ${total.toFixed(2).replace('.', ',')}*`;
    message += `\n\n*Cliente:* ${data.customerName}`;
    message += `\n*Telefone:* ${data.customerPhone}`;
    message += data.deliveryType === 'delivery'
      ? `\n*Entrega no endereço:* ${data.address}`
      : `\n*Retirada na loja*`;

    // Save order
    const order: Order = {
      id: `ORD-${Date.now()}`,
      storeId,
      items: [...cart],
      total,
      customer: data,
      status: 'pending',
      createdAt: new Date().toISOString(),
    };
    addOrder(order);
    clearCart();

    // Open WhatsApp
    const url = `https://wa.me/${whatsapp.phoneNumber}?text=${encodeURIComponent(message)}`;
    window.open(url, '_blank');

    addToast('Pedido enviado! Acompanhe pelo WhatsApp. 🎉', 'success');
    handleClose();
  };

  return (
    <div className="fixed inset-0 z-[70] flex items-end justify-center sm:items-center">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={handleClose} />

      {/* Modal */}
      <div
        className="relative w-full max-w-md bg-white rounded-t-3xl sm:rounded-3xl shadow-2xl animate-slide-up-panel flex flex-col max-h-[90vh]"
        style={{ backgroundColor: config.theme.backgroundColor }}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-6 pb-4 border-b border-black/5">
          <div className="flex items-center gap-3">
            <button onClick={handleBack} className="p-1.5 rounded-full bg-black/5 hover:bg-black/10 transition-colors" style={{ color: theme.textColor }}>
              <X size={18} />
            </button>
            <div>
              <h2 className="font-bold text-base" style={{ color: theme.textColor }}>Finalizar Pedido</h2>
              <p className="text-xs opacity-50" style={{ color: theme.textColor }}>
                {step === 'form' ? 'Preencha seus dados' : 'Confirme o pedido'}
              </p>
            </div>
          </div>
          {/* Progress */}
          <div className="flex gap-1.5">
            <div className={`w-2 h-2 rounded-full transition-colors ${step === 'form' ? 'bg-green-500' : 'bg-gray-200'}`} />
            <div className={`w-2 h-2 rounded-full transition-colors ${step === 'confirm' ? 'bg-green-500' : 'bg-gray-200'}`} />
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6 space-y-5">

          {step === 'form' && (
            <>
              {/* Customer Name */}
              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase mb-1.5 tracking-wide">
                  <User size={11} className="inline mr-1" />Seu nome
                </label>
                <input
                  type="text"
                  placeholder="Maria Silva"
                  value={data.customerName}
                  onChange={e => setData({ ...data, customerName: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl border-2 border-gray-100 focus:border-green-400 outline-none transition-colors text-sm"
                  style={{ backgroundColor: 'white', color: theme.textColor }}
                  autoFocus
                />
              </div>

              {/* Customer Phone */}
              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase mb-1.5 tracking-wide">
                  <Phone size={11} className="inline mr-1" />Seu telefone/WhatsApp
                </label>
                <input
                  type="tel"
                  placeholder="(11) 99999-9999"
                  value={data.customerPhone}
                  onChange={e => setData({ ...data, customerPhone: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl border-2 border-gray-100 focus:border-green-400 outline-none transition-colors text-sm"
                  style={{ backgroundColor: 'white', color: theme.textColor }}
                />
              </div>

              {/* Delivery Type */}
              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase mb-2 tracking-wide">
                  <Package size={11} className="inline mr-1" />Como deseja receber?
                </label>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    onClick={() => setData({ ...data, deliveryType: 'delivery' })}
                    className={`p-3 rounded-xl border-2 flex flex-col items-center gap-2 transition-all text-center ${data.deliveryType === 'delivery'
                      ? 'border-green-500 bg-green-50'
                      : 'border-gray-100 hover:border-gray-200 bg-white'}`}
                  >
                    <Truck size={22} className={data.deliveryType === 'delivery' ? 'text-green-600' : 'text-gray-400'} />
                    <span className={`text-xs font-bold ${data.deliveryType === 'delivery' ? 'text-green-700' : 'text-gray-500'}`}>Entrega</span>
                  </button>
                  <button
                    onClick={() => setData({ ...data, deliveryType: 'pickup' })}
                    className={`p-3 rounded-xl border-2 flex flex-col items-center gap-2 transition-all text-center ${data.deliveryType === 'pickup'
                      ? 'border-green-500 bg-green-50'
                      : 'border-gray-100 hover:border-gray-200 bg-white'}`}
                  >
                    <Store size={22} className={data.deliveryType === 'pickup' ? 'text-green-600' : 'text-gray-400'} />
                    <span className={`text-xs font-bold ${data.deliveryType === 'pickup' ? 'text-green-700' : 'text-gray-500'}`}>Retirar</span>
                  </button>
                </div>
              </div>

              {/* Address (only for delivery) */}
              {data.deliveryType === 'delivery' && (
                <div className="animate-in fade-in slide-in-from-top-2 duration-200">
                  <label className="block text-xs font-bold text-gray-500 uppercase mb-1.5 tracking-wide">
                    <MapPin size={11} className="inline mr-1" />Endereço de entrega
                  </label>
                  <textarea
                    placeholder="Rua, número, bairro, cidade..."
                    value={data.address || ''}
                    onChange={e => setData({ ...data, address: e.target.value })}
                    rows={2}
                    className="w-full px-4 py-3 rounded-xl border-2 border-gray-100 focus:border-green-400 outline-none transition-colors text-sm resize-none"
                    style={{ backgroundColor: 'white', color: theme.textColor }}
                  />
                </div>
              )}
            </>
          )}

          {step === 'confirm' && (
            <div className="space-y-4">
              {/* Order Summary */}
              <div className="bg-gray-50 rounded-2xl p-4">
                <h3 className="text-xs font-bold text-gray-500 uppercase mb-3">Resumo do Pedido</h3>
                {cart.map(item => (
                  <div key={item.id} className="flex justify-between text-sm mb-2">
                    <span className="text-gray-700">{item.quantity}x {item.title}</span>
                    <span className="font-bold" style={{ color: theme.primaryColor }}>{item.price}</span>
                  </div>
                ))}
                <div className="border-t border-gray-200 pt-3 mt-2 flex justify-between">
                  <span className="font-bold text-gray-700">Total</span>
                  <span className="text-xl font-bold" style={{ color: theme.primaryColor }}>
                    R$ {total.toFixed(2).replace('.', ',')}
                  </span>
                </div>
              </div>

              {/* Customer Info */}
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

        {/* Footer CTA */}
        <div className="p-6 pt-4 border-t border-black/5">
          {step === 'form' ? (
            <button
              onClick={() => setStep('confirm')}
              disabled={!isFormValid()}
              className="w-full py-4 rounded-2xl font-bold text-white flex items-center justify-center gap-2 shadow-lg transition-all active:scale-[0.98] disabled:opacity-40 disabled:cursor-not-allowed"
              style={{ backgroundColor: theme.primaryColor }}
            >
              Revisar Pedido →
            </button>
          ) : (
            <div className="space-y-3">
              <button
                onClick={handleConfirm}
                className="w-full py-4 rounded-2xl font-bold text-white flex items-center justify-center gap-2 shadow-lg transition-all active:scale-[0.98] hover:-translate-y-0.5"
                style={{ backgroundColor: theme.accentColor }}
              >
                <MessageCircle size={20} className="fill-white" />
                Confirmar e Enviar no WhatsApp
              </button>
              <button onClick={() => setStep('form')} className="w-full text-sm text-gray-400 hover:text-gray-600 font-medium">
                ← Editar dados
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CheckoutModal;
