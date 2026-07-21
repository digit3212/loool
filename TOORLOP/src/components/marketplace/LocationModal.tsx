import React, { useState } from 'react';
import { X, Check, MapPin, Globe } from 'lucide-react';
import { getCountriesConfig } from '../../data/marketplaceData';
import { useLanguage } from '../../context/LanguageContext';
import { playAudio } from '../../utils/audio';

interface LocationModalProps {
  onClose: () => void;
  onLocationChange: (location: string) => void;
  userLocation: string;
}

const LocationModal: React.FC<LocationModalProps> = ({ onClose, onLocationChange, userLocation }) => {
  const { t, dir } = useLanguage();
  
  // Get translated countries and cities
  const countriesConfig = getCountriesConfig(t as any);
  const countryKeys = Object.keys(countriesConfig);
  
  const [selectedCountryForFilter, setSelectedCountryForFilter] = useState(countryKeys[0] || '');

  const handleClose = () => {
    playAudio('pop');
    onClose();
  };

  const handleCountryChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    playAudio('pop');
    setSelectedCountryForFilter(e.target.value);
  };

  const handleCitySelect = (city: string) => {
    playAudio('pop');
    onLocationChange(city);
  };

  return (
      <div className="fixed inset-0 z-[100] bg-black/60 flex items-center justify-center p-4 animate-fadeIn backdrop-blur-sm" dir={dir} onClick={handleClose}>
          <div 
            className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl w-full max-w-sm animate-scaleIn max-h-[85vh] flex flex-col overflow-hidden border border-white/20 dark:border-gray-700 transition-colors duration-300"
            onClick={(e) => e.stopPropagation()}
          >
              {/* Header */}
              <div className="p-4 md:p-5 border-b border-gray-100 dark:border-gray-700 flex justify-between items-center bg-white dark:bg-gray-800 sticky top-0 z-10">
                  <h3 className="font-bold text-lg text-gray-900 dark:text-white flex items-center gap-2">
                    <MapPin className="w-5 h-5 text-fb-blue" />
                    {t.market.change_location}
                  </h3>
                  <button 
                    onClick={handleClose} 
                    className="text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-700 p-2 rounded-full transition active:scale-95"
                  >
                      <X className="w-5 h-5 dark:text-gray-300" />
                  </button>
              </div>
              
              {/* Country Selector */}
              <div className="p-4 md:p-5 border-b border-gray-100 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50">
                  <label className="block text-xs font-bold text-gray-500 dark:text-gray-400 mb-2 uppercase tracking-wider flex items-center gap-1">
                    <Globe className="w-3.5 h-3.5" />
                    {t.market.country}
                  </label>
                  <div className="relative">
                    <select 
                        className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-xl text-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-fb-blue outline-none transition appearance-none shadow-sm cursor-pointer"
                        value={selectedCountryForFilter}
                        onChange={handleCountryChange}
                    >
                        {countryKeys.map(country => (
                            <option key={country} value={country}>{country}</option>
                        ))}
                    </select>
                    <div className={`absolute top-1/2 -translate-y-1/2 pointer-events-none text-gray-500 dark:text-gray-400 ${dir === 'rtl' ? 'left-3' : 'right-3'}`}>
                        <svg className="w-4 h-4 fill-current" viewBox="0 0 20 20"><path d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"/></svg>
                    </div>
                  </div>
              </div>

              {/* Cities List */}
              <div className="p-2 md:p-3 overflow-y-auto flex-1 custom-scrollbar bg-white dark:bg-gray-800">
                  <p className="text-xs font-bold text-gray-500 dark:text-gray-400 mb-2 px-2 pt-2">
                      {t.placeholders.select_option} {t.market.city}:
                  </p>
                  <div className="space-y-1">
                      {countriesConfig[selectedCountryForFilter]?.cities.map(city => (
                          <button 
                            key={city} 
                            onClick={() => handleCitySelect(city)}
                            className={`w-full px-4 py-3 rounded-xl text-sm font-bold transition flex justify-between items-center active:scale-[0.98] border border-transparent ${
                                userLocation === city 
                                ? 'bg-blue-50 dark:bg-blue-900/20 text-fb-blue border-blue-100 dark:border-blue-900/30 shadow-sm' 
                                : 'hover:bg-gray-50 dark:hover:bg-gray-700/50 text-gray-700 dark:text-gray-200'
                            }`}
                          >
                              <span className="flex items-center gap-2">
                                  <MapPin className={`w-4 h-4 ${userLocation === city ? 'fill-current' : 'opacity-50'}`} />
                                  {city}
                              </span>
                              {userLocation === city && <Check className="w-5 h-5 text-fb-blue" />}
                          </button>
                      ))}
                  </div>
              </div>
          </div>
      </div>
  );
};

export default LocationModal;