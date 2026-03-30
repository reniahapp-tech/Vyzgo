import React from 'react';
import { MapPin, Navigation } from 'lucide-react';
import { useConfig } from '../contexts/ConfigContext';

const StoreMap: React.FC = () => {
  const { config } = useConfig();
  const { location } = config;

  if (!location.enabled || !location.address) return null;

  // Generate embed URL if not manually provided, or use provided one
  const embedUrl = location.mapUrl || `https://www.google.com/maps?q=${encodeURIComponent(location.address)}&output=embed`;

  return (
    <div className="mt-8 mb-4">
      <div className="flex items-center gap-2 mb-4">
        <div className="p-2 bg-indigo-600 text-white rounded-xl">
          <MapPin size={20} />
        </div>
        <div>
          <h3 className="font-black text-lg uppercase tracking-tight leading-none">Nosso Endereço</h3>
          <p className="text-xs text-gray-500 font-medium">{location.address}</p>
        </div>
      </div>

      <div className="relative w-full h-64 md:h-80 rounded-3xl overflow-hidden border-4 border-white shadow-xl">
        <iframe
          src={embedUrl}
          width="100%"
          height="100%"
          style={{ border: 0 }}
          allowFullScreen={true}
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
          title="Localização da Loja"
          className="grayscale-[0.2] contrast-[1.1]"
        ></iframe>
        
        <a 
          href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(location.address)}`}
          target="_blank"
          rel="noopener noreferrer"
          className="absolute bottom-4 right-4 bg-white px-4 py-2 rounded-full shadow-lg flex items-center gap-2 text-xs font-bold hover:bg-gray-50 transition-all text-indigo-600"
        >
          <Navigation size={14} />
          ABRIR NO MAPS
        </a>
      </div>
    </div>
  );
};

export default StoreMap;
