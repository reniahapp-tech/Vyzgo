import React from 'react';
import { Check, X, Info } from 'lucide-react';
import { useConfig } from '../contexts/ConfigContext';

const ToastContainer: React.FC = () => {
  const { toasts, removeToast } = useConfig();

  if (toasts.length === 0) return null;

  return (
    <div className="fixed top-6 left-0 right-0 z-[70] flex flex-col items-center gap-2 pointer-events-none px-4">
      {toasts.map((toast) => (
        <div
          key={toast.id}
          className="pointer-events-auto bg-white/90 backdrop-blur-md border border-white/50 shadow-lg rounded-2xl px-4 py-3 flex items-center gap-3 animate-slide-up-panel min-w-[280px]"
        >
          <div className={`p-1.5 rounded-full ${
            toast.type === 'success' ? 'bg-green-100 text-green-600' :
            toast.type === 'error' ? 'bg-red-100 text-red-600' :
            'bg-blue-100 text-blue-600'
          }`}>
            {toast.type === 'success' && <Check size={14} strokeWidth={3} />}
            {toast.type === 'error' && <X size={14} strokeWidth={3} />}
            {toast.type === 'info' && <Info size={14} strokeWidth={3} />}
          </div>
          <span className="text-sm font-bold text-gray-800 flex-1">{toast.message}</span>
        </div>
      ))}
    </div>
  );
};

export default ToastContainer;