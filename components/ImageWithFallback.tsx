import React, { useState } from 'react';
import { ImageOff } from 'lucide-react';
import { useConfig } from '../contexts/ConfigContext';

interface ImageWithFallbackProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  fallbackText?: string;
}

const ImageWithFallback: React.FC<ImageWithFallbackProps> = ({ 
  src, 
  alt, 
  className, 
  fallbackText,
  ...props 
}) => {
  const [error, setError] = useState(false);
  const { config } = useConfig();

  // If error or no src provided
  if (error || !src) {
    return (
      <div 
        className={`${className} flex flex-col items-center justify-center p-4 text-center transition-colors`}
        style={{ backgroundColor: config.theme.secondaryColor }}
      >
        <ImageOff size={24} className="opacity-30 mb-2" style={{ color: config.theme.textColor }} />
        {fallbackText && (
          <span className="text-[10px] uppercase font-bold opacity-40" style={{ color: config.theme.textColor }}>
            {fallbackText}
          </span>
        )}
      </div>
    );
  }

  return (
    <img
      src={src}
      alt={alt}
      className={className}
      onError={() => setError(true)}
      {...props}
    />
  );
};

export default ImageWithFallback;