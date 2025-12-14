import React from 'react';
import { X, MapPin, Navigation } from 'lucide-react';
import { useConfig } from '../contexts/ConfigContext';

const LocationModal: React.FC = () => {
  const { config, isLocationOpen, setIsLocationOpen } = useConfig();
  const { theme, location } = config;

  if (!isLocationOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/50 backdrop-blur-sm transition-opacity"
        onClick={() => setIsLocationOpen(false)}
      ></div>

      {/* Modal */}
      <div 
        className="relative w-full max-w-sm bg-white rounded-3xl p-6 shadow-2xl animate-slide-up-panel overflow-hidden"
        style={{ backgroundColor: theme.backgroundColor }}
      >
        {/* Close Button */}
        <button 
          onClick={() => setIsLocationOpen(false)}
          className="absolute top-4 right-4 p-2 rounded-full hover:bg-black/5 transition-colors z-10 bg-white/50 backdrop-blur-sm"
          style={{ color: theme.textColor }}
        >
          <X size={20} />
        </button>

        <h2 className="text-xl font-bold mb-1 flex items-center gap-2" style={{ color: theme.textColor }}>
           <MapPin className="text-terracotta" size={24} />
           Nossa Loja
        </h2>
        <p className="text-sm text-gray-500 mb-6">Venha nos visitar e conhecer nossos produtos.</p>

        {/* Map Container */}
        <div className="w-full h-48 bg-gray-100 rounded-2xl overflow-hidden mb-4 border border-gray-200 shadow-inner relative">
           {location.mapUrl ? (
             <iframe 
               src={location.mapUrl} 
               width="100%" 
               height="100%" 
               style={{ border: 0 }} 
               allowFullScreen 
               loading="lazy"
               title="Map"
             ></iframe>
           ) : (
             <div className="flex items-center justify-center h-full text-gray-400 text-sm">
                Mapa indisponível
             </div>
           )}
        </div>

        {/* Address Info */}
        <div className="bg-white/50 border border-white rounded-xl p-4 shadow-sm mb-4">
           <h3 className="text-xs font-bold uppercase text-gray-400 mb-1">Endereço</h3>
           <p className="font-medium text-gray-800 leading-snug">
             {location.address || 'Endereço não configurado'}
           </p>
        </div>

        {/* Action Button */}
        <a 
          href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(location.address)}`}
          target="_blank"
          rel="noopener noreferrer"
          className="w-full font-bold py-3.5 rounded-xl flex items-center justify-center gap-2 transition-transform active:scale-95 text-white shadow-lg"
          style={{ backgroundColor: theme.primaryColor }}
        >
          <Navigation size={18} />
          Traçar Rota
        </a>

      </div>
    </div>
  );
};

export default LocationModal;