import React from 'react';
import { Search, Store, Plus, Heart, MapPin, Filter, ChevronLeft, ChevronRight, ArrowUpDown, LogOut } from 'lucide-react';
import { getCategories, getSortOptions } from '../../data/marketplaceData';
import { useLanguage } from '../../context/LanguageContext';
import { playAudio } from '../../utils/audio';

interface MarketplaceSidebarProps {
  searchTerm: string;
  setSearchTerm: (value: string) => void;
  setShowSellModal: (show: boolean) => void;
  showSavedOnly: boolean;
  setShowSavedOnly: (show: boolean) => void;
  userLocation: string;
  setShowLocationModal: (show: boolean) => void;
  showFilters: boolean;
  setShowFilters: (show: boolean) => void;
  sortBy: string;
  setSortBy: (value: string) => void;
  minPrice: string;
  setMinPrice: (value: string) => void;
  maxPrice: string;
  setMaxPrice: (value: string) => void;
  activeCategory: string;
  setActiveCategory: (category: string) => void;
  onBack?: () => void;
}

const MarketplaceSidebar: React.FC<MarketplaceSidebarProps> = ({
  searchTerm, setSearchTerm, setShowSellModal, showSavedOnly, setShowSavedOnly,
  userLocation, setShowLocationModal, showFilters, setShowFilters,
  sortBy, setSortBy, minPrice, setMinPrice, maxPrice, setMaxPrice,
  activeCategory, setActiveCategory, onBack
}) => {
  const { t, dir, language } = useLanguage();

  // Dynamically get translated categories and sort options
  const categories = getCategories(t as any);
  const sortOptions = getSortOptions(t as any);

  return (
    <div className="w-full md:w-80 bg-white/40 dark:bg-gray-800/40 backdrop-blur-md border-l rtl:border-l-0 rtl:border-r border-white/10 dark:border-gray-700/50 p-4 overflow-y-auto sticky top-16 h-[calc(100vh-64px)] z-10 transition-all duration-300 flex flex-col custom-scrollbar" dir={dir}>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">{t.market.title}</h2>
        <div className="bg-white/30 dark:bg-gray-700/30 p-2 rounded-full cursor-pointer hover:bg-white/50 dark:hover:bg-gray-600 transition backdrop-blur-sm">
           <Store className="w-5 h-5 text-gray-900 dark:text-gray-100" />
        </div>
      </div>

      {/* Search */}
      <div className="relative mb-4 group">
        <Search className={`absolute ${dir === 'rtl' ? 'left-3' : 'right-3'} top-1/2 -translate-y-1/2 w-4 h-4 text-gray-600 dark:text-gray-300 group-focus-within:text-fb-blue transition-colors`} />
        <input 
          type="text" 
          placeholder={t.market.search_placeholder}
          className={`w-full bg-white/40 dark:bg-gray-700/40 backdrop-blur-sm rounded-full py-2.5 ${dir === 'rtl' ? 'pl-10 pr-4' : 'pr-10 pl-4'} text-sm focus:outline-none focus:ring-2 focus:ring-fb-blue transition dark:text-white dark:placeholder-gray-400 border border-emerald-200 dark:border-gray-600`}
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      {/* Create Listing Button */}
      <button 
        onClick={() => {
          playAudio('pop');
          setShowSellModal(true);
        }}
        className="w-full bg-red-700 dark:bg-red-900 text-white font-bold py-2.5 rounded-lg flex items-center justify-center gap-2 mb-4 hover:bg-blue-700 dark:hover:bg-blue-900 transition shadow-sm backdrop-blur-sm active:scale-95"
      >
        <Plus className="w-5 h-5" />
        {t.market.create_listing}
      </button>

      {/* Saved Items Toggle */}
      <div className="grid grid-cols-2 gap-2 mb-6">
          <button 
              onClick={() => {
                playAudio('pop');
                setShowSavedOnly(false);
              }}
              className={`group flex items-center justify-center gap-2 py-2.5 rounded-lg text-sm font-bold transition-all duration-300 backdrop-blur-sm shadow-sm active:scale-95
                ${!showSavedOnly 
                  ? 'bg-white dark:bg-gray-800 text-fb-blue dark:text-blue-400 shadow-md border border-emerald-200 dark:border-gray-600' 
                  : 'bg-fb-blue text-white hover:bg-[#1D4ED8] border border-emerald-200 dark:border-gray-600'}`}
          >
              <Store className="w-4 h-4" /> 
              {t.market.browse}
          </button>
          <button 
              onClick={() => {
                playAudio('pop');
                setShowSavedOnly(true);
              }}
              className={`group flex items-center justify-center gap-2 py-2.5 rounded-lg text-sm font-bold transition-all duration-300 backdrop-blur-sm shadow-sm active:scale-95
                ${showSavedOnly 
                  ? 'bg-white dark:bg-gray-800 text-fb-blue dark:text-blue-400 shadow-md border border-emerald-200 dark:border-gray-600' 
                  : 'bg-fb-blue text-white hover:bg-[#1D4ED8] border border-emerald-200 dark:border-gray-600'}`}
          >
              <Heart className={`w-4 h-4 ${showSavedOnly ? 'fill-current' : ''}`} /> 
              {t.market.saved}
          </button>
      </div>

      <div className="border-t border-white/20 dark:border-gray-700 my-4"></div>

      {/* Location Filter */}
      <div className="mb-6">
         <h3 className="font-semibold text-gray-900 dark:text-white mb-2 flex items-center justify-between">
           {t.market.location}
           <button 
             onClick={() => {
               playAudio('pop');
               setShowLocationModal(true);
             }}
             className="text-emerald-700 dark:text-emerald-400  hover:text-blue-700 dark:hover:text-blue-700 text-xs font-bold hover:underline"
           >
             {t.market.change_location}
           </button>
         </h3>
         <div className="flex items-center gap-2 text-gray-900 dark:text-gray-200 text-sm bg-white/30 dark:bg-gray-700/30 backdrop-blur-sm p-2 rounded-md border border-white/10 dark:border-gray-600">
            <MapPin className="w-4 h-4 text-red-500" />
            <span>{t.cities[userLocation] || userLocation} · {t.market.location_radius}</span>
         </div>
      </div>

      <div className="border-t border-white/20 dark:border-gray-700 my-4"></div>

      {/* Price & Sort Filters Toggle */}
      <div className="mb-4">
          <button 
              onClick={() => {
                playAudio('pop');
                setShowFilters(!showFilters);
              }}
              className="w-full flex items-center justify-between text-sm font-semibold text-gray-900 dark:text-gray-200 hover:bg-white/20 dark:hover:bg-white/10 p-2 rounded-md transition"
          >
              <span className="flex items-center gap-2"><Filter className="w-4 h-4" /> {t.market.filters}</span>
              {showFilters 
                ? <ChevronLeft className={`w-4 h-4 ${dir === 'rtl' ? 'rotate-90' : '-rotate-90'}`} /> 
                : <ChevronRight className={`w-4 h-4 ${dir === 'rtl' ? 'rotate-90' : '-rotate-90'}`} />
              }
          </button>
          
          {showFilters && (
              <div className="mt-3 space-y-4 p-2 bg-white/10 dark:bg-black/20 rounded-lg animate-fadeIn border border-white/10 dark:border-white/5">
                  <div>
                      <label className="text-xs font-bold text-gray-900 dark:text-gray-300 mb-1 block">{t.market.sort_by}</label>
                      <div className="relative">
                          <select 
                              value={sortBy}
                              onChange={(e) => setSortBy(e.target.value)}
                              className="w-full bg-white/60 dark:bg-gray-800/60 backdrop-blur-sm border border-white/20 dark:border-gray-600 rounded-md p-2 text-sm outline-none focus:border-fb-blue dark:text-white appearance-none cursor-pointer"
                          >
                              {sortOptions.map(opt => (
                                <option key={opt.value} value={opt.value}>
                                  {opt.label}
                                </option>
                              ))}
                          </select>
                          <ArrowUpDown className={`absolute ${dir === 'rtl' ? 'left-2' : 'right-2'} top-1/2 -translate-y-1/2 w-3 h-3 text-gray-600 dark:text-gray-400 pointer-events-none`} />
                      </div>
                  </div>
                  <div>
                      <label className="text-xs font-bold text-gray-900 dark:text-gray-300 mb-1 block">{t.market.price} ({t.market.currency || 'SR'})</label>
                      <div className="flex gap-2">
                          <input 
                              type="number" 
                              placeholder={t.market.min_price}
                              className="w-1/2 bg-white/60 dark:bg-gray-800/60 backdrop-blur-sm border border-white/20 dark:border-gray-600 rounded-md p-2 text-sm outline-none focus:border-fb-blue dark:text-white dark:placeholder-gray-500"
                              value={minPrice}
                              onChange={(e) => setMinPrice(e.target.value)}
                          />
                          <input 
                              type="number" 
                              placeholder={t.market.max_price}
                              className="w-1/2 bg-white/60 dark:bg-gray-800/60 backdrop-blur-sm border border-white/20 dark:border-gray-600 rounded-md p-2 text-sm outline-none focus:border-fb-blue dark:text-white dark:placeholder-gray-500"
                              value={maxPrice}
                              onChange={(e) => setMaxPrice(e.target.value)}
                          />
                      </div>
                  </div>
              </div>
          )}
      </div>

      {/* Back to Homepage Button */}
      {onBack && (
          <div className="mb-6 pt-2 border-t border-white/20 dark:border-gray-700">
              <button 
                  onClick={() => {
                    playAudio('pop');
                    onBack();
                  }}
                  className="w-full flex items-center gap-3 px-3 py-3 rounded-xl font-bold text-red-600 dark:text-red-400 hover:bg-red-100 dark:hover:bg-red-900/20 transition backdrop-blur-sm shadow-sm active:scale-95"
              >
                  <LogOut className={`w-5 h-5 ${dir === 'rtl' ? 'rotate-180' : ''}`} />
                  {language === 'ar' ? 'العودة للصفحة الرئيسية' : 'Back to Home Page'}
              </button>
          </div>
      )}

       {/* Categories */}
      <h3 className="font-bold text-gray-900 dark:text-white mb-2 px-1">{t.market.categories}</h3>
      <ul className="space-y-1 pb-4 flex-1">
        {categories.map(cat => (
          <li key={cat.id}>
            <button 
              onClick={() => {
                playAudio('pop');
                setActiveCategory(cat.id);
              }}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-bold transition-all duration-300 backdrop-blur-sm shadow-sm mb-1 active:scale-95
                ${activeCategory === cat.id 
                  ? 'bg-emerald-700 text-white hover:bg-blue-700' 
                  : 'bg-white/20 dark:bg-gray-700/30 text-black dark:text-emerald-400 shadow-md border border-emerald-200 dark:border-gray-600 hover:bg-white/40 dark:hover:bg-gray-700/50'}`}
            >
              <div className={`p-1.5 rounded-full transition-colors duration-300 ${activeCategory === cat.id ? 'bg-emerald-100 dark:bg-emerald-900/40 text-emerald-700 dark:text-emerald-300 shadow-sm' : 'bg-white/20 dark:bg-gray-600/30 text-red-500'}`}>
                 <cat.icon className="w-4 h-4" />
              </div>
              {cat.name}
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default MarketplaceSidebar;