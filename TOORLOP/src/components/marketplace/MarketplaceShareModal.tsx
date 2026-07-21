import React, { useState } from 'react';
import { X, Copy, Check, Facebook, Twitter, Phone, Share2, Globe, Link as LinkIcon } from 'lucide-react';
import { Product } from '../../types';
import { useLanguage } from '../../context/LanguageContext';
import { playAudio } from '../../utils/audio';

interface MarketplaceShareModalProps {
  product: Product;
  onClose: () => void;
}

const MarketplaceShareModal: React.FC<MarketplaceShareModalProps> = ({ product, onClose }) => {
  const { t, dir, language } = useLanguage();
  const [copied, setCopied] = useState(false);

  // Simulated product URL
  const productUrl = `${typeof window !== 'undefined' ? window.location.origin : ''}/marketplace/item/${product.id}`;

  const handleCopy = () => {
    playAudio('pop');
    navigator.clipboard.writeText(productUrl).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  const handleClose = (e?: React.MouseEvent) => {
    e?.stopPropagation();
    playAudio('pop');
    onClose();
  };

  const shareLinks = [
    { 
      name: 'Facebook', 
      icon: <Facebook className="w-6 h-6" />, 
      color: 'bg-[#1877F2]', 
      url: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(productUrl)}` 
    },
    { 
      name: 'WhatsApp', 
      icon: <Phone className="w-6 h-6" />, 
      color: 'bg-[#25D366]', 
      url: `https://api.whatsapp.com/send?text=${encodeURIComponent(product.title + ' ' + productUrl)}` 
    },
    { 
      name: 'X (Twitter)', 
      icon: <Twitter className="w-5 h-5" />, 
      color: 'bg-black', 
      url: `https://twitter.com/intent/tweet?url=${encodeURIComponent(productUrl)}&text=${encodeURIComponent(product.title)}` 
    },
  ];

  return (
    <div className="fixed inset-0 z-[110] bg-black/70 backdrop-blur-sm flex items-center justify-center p-4 animate-fadeIn" onClick={handleClose} dir={dir}>
      <div 
        className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl w-full max-w-md overflow-hidden animate-scaleIn border border-white/20 dark:border-gray-700"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-4 border-b border-gray-100 dark:border-gray-700 flex justify-between items-center bg-gray-50 dark:bg-gray-800/50">
          <h3 className="font-bold text-lg text-gray-900 dark:text-white flex items-center gap-2">
            <Share2 className="w-5 h-5 text-fb-blue" />
            {t.common.share}
          </h3>
          <button 
            onClick={handleClose} 
            className="text-gray-500 hover:bg-gray-200 dark:hover:bg-gray-700 p-1.5 rounded-full transition active:scale-95"
          >
            <X className="w-5 h-5 dark:text-gray-300" />
          </button>
        </div>

        <div className="p-6">
          {/* Product Quick View Card */}
          <div className="flex items-center gap-4 mb-8 bg-gray-50 dark:bg-gray-900/50 p-3 rounded-xl border border-gray-100 dark:border-gray-700 shadow-sm">
            <img src={product.image} alt={product.title} className="w-16 h-16 rounded-lg object-cover shadow-sm border border-gray-200 dark:border-gray-600 flex-shrink-0" />
            <div className="flex-1 min-w-0">
               <h4 className="font-bold text-gray-900 dark:text-white text-sm truncate">{product.title}</h4>
               <p className="text-fb-blue font-bold text-sm">{product.price.toLocaleString()} {product.currency}</p>
            </div>
          </div>

          {/* Social Icons Grid */}
          <div className="grid grid-cols-4 gap-4 mb-8">
            <button onClick={handleCopy} className="flex flex-col items-center gap-2 group">
              <div className={`w-12 h-12 rounded-full flex items-center justify-center shadow-md transition transform group-hover:scale-110 group-active:scale-95 border border-transparent group-hover:border-fb-blue ${copied ? 'bg-green-100 dark:bg-green-900/30' : 'bg-gray-100 dark:bg-gray-700'}`}>
                {copied ? <Check className="w-6 h-6 text-green-500" /> : <Copy className="w-6 h-6 text-gray-700 dark:text-gray-200" />}
              </div>
              <span className="text-[10px] font-bold text-gray-600 dark:text-gray-400">{copied ? t.common.done : t.common.copy}</span>
            </button>

            {shareLinks.map((link) => (
              <a
                key={link.name}
                href={link.url}
                target="_blank"
                rel="noreferrer"
                className="flex flex-col items-center gap-2 group"
                onClick={() => playAudio('pop')}
              >
                <div className={`${link.color} text-white w-12 h-12 rounded-full flex items-center justify-center shadow-md transition transform group-hover:scale-110 group-active:scale-95`}>
                  {link.icon}
                </div>
                <span className="text-[10px] font-bold text-gray-600 dark:text-gray-400">{link.name}</span>
              </a>
            ))}
          </div>

          {/* Copy Link Box */}
          <div className="space-y-2">
            <label className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider px-1">
                {t.market.product_link || (language === 'ar' ? 'رابط المنتج' : 'Product Link')}
            </label>
            <div className="flex items-center gap-2 bg-gray-100 dark:bg-gray-900 p-2 rounded-xl border border-gray-200 dark:border-gray-700 focus-within:ring-2 focus-within:ring-fb-blue transition-all">
               <LinkIcon className="w-4 h-4 text-gray-400 ml-1 shrink-0" />
               <input 
                 type="text" 
                 readOnly 
                 value={productUrl} 
                 className="bg-transparent border-none outline-none text-xs text-gray-600 dark:text-gray-300 flex-1 truncate"
                 style={{ direction: 'ltr', textAlign: dir === 'rtl' ? 'right' : 'left' }}
               />
               <button 
                 onClick={handleCopy}
                 className={`text-xs font-bold px-3 py-1.5 rounded-lg transition-all duration-300 shrink-0 ${copied ? 'bg-[#065F46] text-white' : 'bg-fb-blue text-white hover:bg-blue-700'}`}
               >
                 {copied ? t.common.done : t.common.copy}
               </button>
            </div>
          </div>
        </div>

        {/* Footer info */}
        <div className="p-4 bg-gray-50 dark:bg-gray-800/80 border-t border-gray-100 dark:border-gray-700 flex items-center gap-2 text-gray-400">
            <Globe className="w-3.5 h-3.5" />
            <span className="text-[10px] font-medium">
                {language === 'ar' ? 'سيتم فتح الروابط في نافذة جديدة' : 'Links will open in a new window'}
            </span>
        </div>
      </div>
    </div>
  );
};

export default MarketplaceShareModal;