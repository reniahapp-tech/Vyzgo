import React from 'react';
import { Instagram, Facebook, Twitter, Smartphone } from 'lucide-react';
import { useConfig } from '../contexts/ConfigContext';

const SocialFooter: React.FC = () => {
  const { config } = useConfig();
  const { social, theme } = config;

  const hasSocials = social.instagram || social.facebook || social.tiktok;

  if (!hasSocials) return null;

  const SocialLink = ({ href, icon: Icon }: { href: string, icon: any }) => {
    if (!href) return null;
    // Simple logic to determine if it's a full URL or a handle
    const url = href.startsWith('http') ? href : `https://${href}`;
    
    return (
      <a 
        href={url}
        target="_blank" 
        rel="noopener noreferrer"
        className="p-2.5 rounded-full bg-black/5 hover:bg-black/10 transition-colors text-gray-600 hover:scale-110 duration-200"
      >
        <Icon size={18} />
      </a>
    );
  };

  return (
    <div className="flex justify-center gap-4 py-6 mt-4 border-t border-black/5 mx-6">
       {social.instagram && <SocialLink href={social.instagram.includes('instagram.com') ? social.instagram : `instagram.com/${social.instagram}`} icon={Instagram} />}
       {social.facebook && <SocialLink href={social.facebook} icon={Facebook} />}
       {social.tiktok && <SocialLink href={social.tiktok} icon={Smartphone} />}
    </div>
  );
};

export default SocialFooter;