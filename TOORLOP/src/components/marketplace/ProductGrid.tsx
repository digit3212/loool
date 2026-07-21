import React from 'react';
import { MapPin, Heart, Store, Share2 } from 'lucide-react';
import { Product } from '../../types';
import { useLanguage } from '../../context/LanguageContext';

interface ProductGridProps {
  products: Product[];
  onProductClick: (product: Product) => void;
  onToggleSave: (id: string, e: React.MouseEvent) => void;
  userLocation: string;
  showSavedOnly: boolean;
  onLocationClick: () => void;
  onClearFilters: () => void;
  onShareProduct: (product: Product) => void;
}

const ProductGrid: React.FC<ProductGridProps> = ({ 
  products, 
  onProductClick, 
  onToggleSave, 
  userLocation, 
  showSavedOnly,
  onLocationClick,
  onClearFilters,
  onShareProduct
}) => {
  const { t, dir } = useLanguage();

  return (
    <div className="flex-1 p-4 md:p-8 overflow-y-auto h-full min-h-[calc(100vh-64px)] bg-white/40 dark:bg-gray-800/40 backdrop-blur-md border-r border-white/10 dark:border-gray-700/50 transition-all duration-300" dir={dir}>
         <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-bold text-gray-900 dark:text-white">
              {showSavedOnly ? t.market.saved_products : t.market.today_picks}
            </h2>
            <button 
                onClick={onLocationClick}
                className="flex items-center gap-1 text-fb-blue text-sm font-bold hover:bg-white/30 dark:hover:bg-blue-900/20 px-3 py-1.5 rounded-full transition border border-white/20 backdrop-blur-sm shadow-sm"
            >
               <MapPin className="w-4 h-4" /> {t.cities[userLocation] || userLocation}
            </button>
         </div>

         {products.length > 0 ? (
           <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 pb-10">
              {products.map(product => (
                <div 
                  key={product.id} 
                  className="bg-white/40 dark:bg-gray-800/40 backdrop-blur-md rounded-2xl shadow-sm border border-white/30 dark:border-gray-700/50 overflow-hidden cursor-pointer group hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 flex flex-col"
                  onClick={() => onProductClick(product)}
                >
                   <div className="aspect-square bg-gray-100/30 dark:bg-gray-700/30 relative overflow-hidden">
                      <img src={product.image} alt={product.title} className="w-full h-full object-cover group-hover:scale-105 transition duration-500" />
                      
                      <div className={`absolute top-2 ${dir === 'rtl' ? 'right-2' : 'left-2'} flex gap-2 opacity-0 group-hover:opacity-100 transition duration-300`}>
                          <button 
                            onClick={(e) => onToggleSave(product.id, e)}
                            className={`group/heart bg-white dark:bg-gray-800 p-2 rounded-full hover:scale-110 transition shadow-md backdrop-blur-sm`}
                          >
                             <Heart 
                                className={`w-4 h-4 transition-colors ${
                                    product.isSaved 
                                    ? 'fill-[#065F46] text-[#065F46]' 
                                    : 'text-gray-400 dark:text-gray-300 group-hover/heart:text-[#059669]'
                                }`} 
                             />
                          </button>
                      </div>

                      {product.condition === 'new' && (
                          <div className={`absolute bottom-2 ${dir === 'rtl' ? 'left-2' : 'right-2'} bg-green-600/90 text-white text-[10px] font-bold px-2 py-0.5 rounded-full shadow-sm backdrop-blur-sm`}>
                              {t.market.new}
                          </div>
                      )}
                   </div>
                   <div className="p-3 flex-1 flex flex-col">
                      <div className="font-bold text-lg text-gray-900 dark:text-white mb-0.5">
                        {product.price.toLocaleString()} {product.currency}
                      </div>
                      <h3 className="text-sm text-gray-800 dark:text-gray-200 font-bold line-clamp-1 mb-1 group-hover:text-fb-blue transition">{product.title}</h3>
                      <div className="text-xs text-gray-600 dark:text-gray-400 flex items-center gap-1 mb-3">
                         <MapPin className="w-3 h-3" />
                         <span className="truncate max-w-[80px]">{t.cities[product.location] || product.location}</span>
                         <span>·</span>
                         <span>{product.date}</span>
                      </div>
                      
                      <div className="mt-auto pt-2 border-t border-gray-100 dark:border-gray-700 flex justify-end items-center">
                          <button 
                            onClick={(e) => { e.stopPropagation(); onShareProduct(product); }}
                            className="text-gray-400 dark:text-gray-500 hover:text-[#1D4ED8] dark:hover:text-[#3B82F6] transition p-1.5 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700"
                          >
                             <Share2 className="w-4 h-4" />
                          </button>
                      </div>
                   </div>
                </div>
              ))}
           </div>
         ) : (
           <div className="text-center py-20 text-gray-500 dark:text-gray-400 flex flex-col items-center">
              <div className="bg-white/20 dark:bg-gray-700/20 backdrop-blur-md p-4 rounded-full mb-4 border border-white/10">
                  {showSavedOnly ? <Heart className="w-12 h-12 text-gray-400 dark:text-gray-500" /> : <Store className="w-12 h-12 text-gray-400 dark:text-gray-500" />}
              </div>
              <h3 className="text-xl font-bold mb-2 text-gray-700 dark:text-gray-200">
                  {showSavedOnly ? t.market.saved_products : t.market.no_results}
              </h3>
              <p className="max-w-xs text-sm opacity-80">
                  {showSavedOnly ? t.common.no_results : t.market.browse}
              </p>
              <button onClick={onClearFilters} className="mt-4 text-fb-blue hover:underline font-bold">
                  {showSavedOnly ? t.market.browse : t.common.reset}
              </button>
           </div>
         )}
      </div>
  );
};

export default ProductGrid;