import React from 'react';
import { MessageCircle } from 'lucide-react';

const FloatingButton: React.FC = () => {
  return (
    <div className="fixed bottom-6 left-0 right-0 flex justify-center z-50 pointer-events-none">
      <button 
        className="pointer-events-auto bg-[#25D366] hover:bg-[#20bd5a] text-white font-bold py-4 px-8 rounded-full shadow-lg shadow-green-900/20 flex items-center gap-3 transition-transform hover:scale-105 active:scale-95"
      >
        <MessageCircle size={24} fill="white" className="text-white" />
        <span>Comprar pelo WhatsApp</span>
      </button>
    </div>
  );
};

export default FloatingButton;