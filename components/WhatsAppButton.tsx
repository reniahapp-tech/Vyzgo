import React from 'react';
import { MessageCircle } from 'lucide-react';
import { useConfig } from '../contexts/ConfigContext';

const WhatsAppButton: React.FC = () => {
  const { config, cart, setIsCartOpen } = useConfig();
  const { whatsapp, theme, header, enableWhatsapp } = config;

  // Global toggle check
  if (!enableWhatsapp) return null;
  
  const handlePress = (e: React.MouseEvent) => {
    if (cart.length > 0) {
      e.preventDefault();
      setIsCartOpen(true);
    }
    // Else let default anchor tag work
  };

  const encodedMessage = encodeURIComponent(
    `Olá! Estou na loja *${header.title}* e gostaria de tirar algumas dúvidas.`
  );
  
  const whatsappUrl = `https://wa.me/${whatsapp.phoneNumber}?text=${encodedMessage}`;

  return (
    <a 
      href={cart.length > 0 ? '#' : whatsappUrl}
      onClick={handlePress}
      target={cart.length > 0 ? undefined : "_blank"}
      rel={cart.length > 0 ? undefined : "noopener noreferrer"}
      className="block w-full"
    >
      <button 
        className="w-full text-white font-bold py-4 px-6 rounded-xl2 shadow-sm flex items-center justify-center gap-2.5 transition-all active:scale-[0.98] hover:shadow-md group hover:brightness-105"
        style={{ backgroundColor: theme.accentColor }}
        aria-label={whatsapp.label}
      >
        <span className="text-lg tracking-wide">
          {cart.length > 0 ? `Ver Sacola (${cart.length})` : whatsapp.label}
        </span>
        <MessageCircle size={26} className="fill-white text-white group-hover:rotate-12 transition-transform duration-300" />
      </button>
    </a>
  );
};

export default WhatsAppButton;