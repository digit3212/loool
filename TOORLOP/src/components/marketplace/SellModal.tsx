
import React, { useState, useRef } from 'react';
import { Eye, ImageIcon, MapPin, Plus, X, Check, Camera as CameraIcon, DollarSign, Loader2, Trash } from 'lucide-react';
import { User, Product } from '../../types';
import { CATEGORIES, COUNTRIES_CONFIG, CONDITIONS } from '../../data/marketplaceData';

interface SellModalProps {
  onClose: () => void;
  currentUser: User;
  onProductCreated: (product: Product) => void;
  showNotification: (msg: string, type?: 'success' | 'info' | 'error') => void;
}

const SellModal: React.FC<SellModalProps> = ({ onClose, currentUser, onProductCreated, showNotification }) => {
  const [newTitle, setNewTitle] = useState('');
  const [newPrice, setNewPrice] = useState('');
  const [newDescription, setNewDescription] = useState('');
  const [newCategory, setNewCategory] = useState('electronics');
  const [newCondition, setNewCondition] = useState<'new' | 'used_good' | 'used_fair'>('new');
  // Changed state to support an array of up to 8 images
  const [newImages, setNewImages] = useState<string[]>([]);
  const [newCountry, setNewCountry] = useState('السعودية');
  const [newCity, setNewCity] = useState('');
  const [newCurrency, setNewCurrency] = useState('ر.س');
  const [isLoading, setIsLoading] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files) {
      const remainingSlots = 8 - newImages.length;
      const filesToProcess = Array.from(files).slice(0, remainingSlots);

      if (files.length > remainingSlots) {
          showNotification(`يمكنك إضافة 8 صور كحد أقصى. تم اختيار أول ${remainingSlots} صور فقط.`, 'info');
      }

      filesToProcess.forEach(file => {
          if (!file.type.startsWith('image/')) {
            showNotification(`الملف ${file.name} ليس صورة صالحة`, 'error');
            return;
          }
          if (file.size > 5 * 1024 * 1024) {
            showNotification(`حجم الصورة ${file.name} كبير جداً (الأقصى 5 ميجابايت)`, 'error');
            return;
          }

          const reader = new FileReader();
          reader.onloadend = () => {
            setNewImages(prev => [...prev, reader.result as string]);
          };
          reader.readAsDataURL(file);
      });
    }
    e.target.value = '';
  };

  const removeImage = (index: number) => {
      setNewImages(prev => prev.filter((_, i) => i !== index));
  };

  const handleCountryChange = (country: string) => {
      setNewCountry(country);
      setNewCity('');
      if (COUNTRIES_CONFIG[country]) {
          setNewCurrency(COUNTRIES_CONFIG[country].symbol);
      }
  };

  const sanitizeInput = (input: string) => {
    return input.replace(/<[^>]*>?/gm, '').trim();
  };

  const handleCreateListing = (e: React.FormEvent) => {
    e.preventDefault();
    
    const cleanTitle = sanitizeInput(newTitle);
    const cleanDesc = sanitizeInput(newDescription);
    const cleanPrice = parseFloat(newPrice);

    if (!cleanTitle || cleanTitle.length < 3) {
        showNotification('يرجى إدخال عنوان صحيح (3 أحرف على الأقل)', 'error');
        return;
    }
    if (isNaN(cleanPrice) || cleanPrice <= 0) {
        showNotification('يرجى إدخال سعر صحيح', 'error');
        return;
    }
    if (newImages.length === 0) {
        showNotification('يرجى إضافة صورة واحدة على الأقل للمنتج', 'error');
        return;
    }
    if (!newCity) {
        showNotification('يرجى اختيار المدينة', 'error');
        return;
    }

    setIsLoading(true);

    setTimeout(() => {
      const newProduct: Product = {
        id: `p_${Date.now()}`,
        title: cleanTitle,
        price: cleanPrice,
        currency: newCurrency,
        category: newCategory,
        image: newImages[0], // Primary image is the first one
        images: newImages,   // Storing all images in the new field
        location: newCity,
        seller: currentUser,
        description: cleanDesc,
        condition: newCondition,
        date: 'الآن',
        timestamp: Date.now(),
        isSaved: false,
        comments: []
      };

      onProductCreated(newProduct);
      setIsLoading(false);
      onClose();
    }, 1000);
  };

  return (
        <div className="fixed inset-0 z-[100] bg-black/60 flex items-center justify-center p-4 animate-fadeIn backdrop-blur-sm">
           <div className="bg-white dark:bg-gray-800 rounded-xl shadow-2xl w-full max-w-4xl max-h-[96vh] overflow-hidden animate-scaleIn flex flex-col md:flex-row">
              
              {/* Preview Side (Left) */}
              <div className="w-full md:w-1/2 bg-gray-50 dark:bg-gray-900 p-6 flex flex-col items-center justify-center border-l dark:border-gray-700 overflow-y-auto">
                  <h4 className="text-sm font-bold text-gray-50 dark:text-gray-400 mb-4 w-full text-start flex items-center gap-2">
                      <Eye className="w-4 h-4" /> معاينة القائمة
                  </h4>
                  <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md border border-gray-200 dark:border-gray-700 overflow-hidden w-full max-w-xs transition-all">
                      <div className="aspect-square bg-gray-200 dark:bg-gray-700 flex items-center justify-center relative overflow-hidden">
                          {newImages.length > 0 ? (
                             <img src={newImages[0]} alt="Preview" className="w-full h-full object-cover" />
                          ) : (
                             <div className="text-gray-400 flex flex-col items-center">
                                <ImageIcon className="w-16 h-16 mb-2 opacity-50" />
                                <span className="text-xs font-medium">أضف صورة للمعاينة</span>
                             </div>
                          )}
                          {newImages.length > 1 && (
                              <div className="absolute bottom-2 right-2 bg-black/60 text-white text-[10px] px-2 py-1 rounded-md backdrop-blur-sm">
                                  1 / {newImages.length} صور
                              </div>
                          )}
                      </div>
                      <div className="p-4">
                          <div className="font-bold text-xl text-gray-900 dark:text-white mb-1">
                             {newPrice ? `${parseFloat(newPrice).toLocaleString()} ${newCurrency}` : 'السعر'}
                          </div>
                          <h3 className="text-base text-gray-700 dark:text-gray-300 font-medium mb-1 line-clamp-1">
                             {newTitle || 'عنوان المنتج'}
                          </h3>
                          <div className="text-xs text-gray-500 dark:text-gray-400 flex items-center gap-1">
                             <MapPin className="w-3 h-3" />
                             {newCity || 'الموقع'}
                          </div>
                      </div>
                  </div>
                  
                  <div className="mt-6 w-full max-w-xs">
                      <h5 className="text-xs font-bold text-gray-500 mb-2 uppercase tracking-wide">معلومات البائع</h5>
                      <div className="flex items-center gap-3 bg-white dark:bg-gray-800 p-3 rounded-lg border border-gray-200 dark:border-gray-700">
                          <img src={currentUser.avatar} alt="Me" className="w-10 h-10 rounded-full object-cover" />
                          <div>
                              <div className="font-bold text-sm text-gray-900 dark:text-white">{currentUser.name}</div>
                              <div className="text-xs text-gray-500">ملفك الشخصي</div>
                          </div>
                      </div>
                  </div>
              </div>

              {/* Form Side (Right) */}
              <div className="w-full md:w-1/2 flex flex-col h-full">
                  <div className="p-4 md:p-6 border-b border-gray-100 dark:border-gray-700 flex justify-between items-center bg-white dark:bg-gray-800">
                      <h3 className="font-bold text-xl text-gray-900 dark:text-white flex items-center gap-2">
                          <Plus className="w-6 h-6 text-fb-blue" /> قائمة جديدة
                      </h3>
                      <button onClick={onClose} className="bg-gray-100 dark:bg-gray-700 p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-600 transition text-gray-600 dark:text-gray-300">
                          <X className="w-5 h-5" />
                      </button>
                  </div>

                  <div className="flex-1 overflow-y-auto p-6 space-y-5 bg-white dark:bg-gray-800">
                      <div>
                          <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                              الصور ({newImages.length}/8)
                          </label>
                          
                          {/* Selected Images Grid */}
                          {newImages.length > 0 && (
                              <div className="grid grid-cols-4 gap-2 mb-3">
                                  {newImages.map((img, idx) => (
                                      <div key={idx} className="aspect-square relative rounded-lg overflow-hidden border border-gray-200">
                                          <img src={img} className="w-full h-full object-cover" alt="Selected" />
                                          <button 
                                            onClick={() => removeImage(idx)}
                                            className="absolute top-1 right-1 bg-black/50 text-white p-0.5 rounded-full hover:bg-red-500 transition"
                                          >
                                              <X className="w-3 h-3" />
                                          </button>
                                      </div>
                                  ))}
                                  {newImages.length < 8 && (
                                      <div 
                                        onClick={() => fileInputRef.current?.click()}
                                        className="aspect-square border-2 border-dashed border-gray-300 rounded-lg flex items-center justify-center cursor-pointer hover:bg-gray-50 transition"
                                      >
                                          <Plus className="w-6 h-6 text-gray-400" />
                                      </div>
                                  )}
                              </div>
                          )}

                          {newImages.length === 0 && (
                            <div 
                                onClick={() => fileInputRef.current?.click()}
                                className="border-2 border-dashed rounded-xl p-6 flex flex-col items-center justify-center cursor-pointer border-gray-300 dark:border-gray-600 hover:bg-blue-50 dark:hover:bg-blue-900/10 hover:border-fb-blue transition"
                            >
                                <div className="flex flex-col items-center text-gray-500 dark:text-gray-400">
                                    <CameraIcon className="w-10 h-10 text-fb-blue mb-2" />
                                    <span className="text-sm font-medium">إضافة صور من جهازك</span>
                                    <span className="text-xs mt-1 opacity-70">حتى 8 صور (الحد الأقصى لكل صورة 5 ميجابايت)</span>
                                </div>
                            </div>
                          )}
                          <input type="file" multiple ref={fileInputRef} onChange={handleFileChange} className="hidden" accept="image/*" />
                      </div>

                      <div>
                          <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1">العنوان</label>
                          <input type="text" className="w-full border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-lg p-2.5 text-sm focus:ring-2 focus:ring-fb-blue outline-none transition" placeholder="ماذا تبيع؟" required value={newTitle} onChange={(e) => setNewTitle(e.target.value)} />
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                          <div>
                              <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1">الدولة</label>
                              <select 
                                  className="w-full border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-lg p-2.5 text-sm focus:ring-2 focus:ring-fb-blue outline-none transition appearance-none"
                                  value={newCountry}
                                  onChange={(e) => handleCountryChange(e.target.value)}
                              >
                                  {Object.keys(COUNTRIES_CONFIG).map(c => <option key={c} value={c}>{c}</option>)}
                              </select>
                          </div>
                          <div>
                              <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1">المدينة</label>
                              <select 
                                  className="w-full border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-lg p-2.5 text-sm focus:ring-2 focus:ring-fb-blue outline-none transition appearance-none"
                                  value={newCity}
                                  onChange={(e) => setNewCity(e.target.value)}
                                  disabled={!newCountry}
                              >
                                  <option value="">اختر المدينة</option>
                                  {newCountry && COUNTRIES_CONFIG[newCountry]?.cities.map(c => <option key={c} value={c}>{c}</option>)}
                              </select>
                          </div>
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                          <div>
                              <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1">السعر ({newCurrency})</label>
                              <div className="relative">
                                  <input type="number" className="w-full border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-lg p-2.5 pl-8 text-sm focus:ring-2 focus:ring-fb-blue outline-none transition" placeholder="0.00" required value={newPrice} onChange={(e) => setNewPrice(e.target.value)} />
                                  <DollarSign className="absolute left-2.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                              </div>
                          </div>
                          <div>
                              <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1">الحالة</label>
                              <select className="w-full border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-lg p-2.5 text-sm focus:ring-2 focus:ring-fb-blue outline-none transition appearance-none" value={newCondition} onChange={(e) => setNewCondition(e.target.value as any)}>
                                  {CONDITIONS.map(c => <option key={c.value} value={c.value}>{c.label}</option>)}
                              </select>
                          </div>
                      </div>

                      <div>
                          <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1">الفئة</label>
                          <select className="w-full border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-lg p-2.5 text-sm focus:ring-2 focus:ring-fb-blue outline-none transition appearance-none" value={newCategory} onChange={(e) => setNewCategory(e.target.value)}>
                              {CATEGORIES.filter(c => c.id !== 'all').map(cat => (
                                  <option key={cat.id} value={cat.id}>{cat.name}</option>
                              ))}
                          </select>
                      </div>

                      <div>
                          <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1">الوصف</label>
                          <textarea className="w-full border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-lg p-2.5 text-sm focus:ring-2 focus:ring-fb-blue outline-none resize-none h-28 transition" placeholder="وصف حالة المنتج، المميزات، والعيوب..." value={newDescription} onChange={(e) => setNewDescription(e.target.value)} />
                      </div>
                  </div>

                  <div className="p-4 border-t border-gray-100 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 flex justify-end">
                      <button 
                        onClick={handleCreateListing} 
                        disabled={!newTitle || !newPrice || newImages.length === 0 || !newCity || isLoading}
                        className="w-full md:w-auto px-8 py-2.5 bg-fb-blue text-white rounded-lg font-bold hover:bg-blue-700 transition shadow-sm disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                      >
                          {isLoading && <Loader2 className="w-4 h-4 animate-spin" />}
                          نشر القائمة
                      </button>
                  </div>
              </div>
           </div>
        </div>
  );
};

export default SellModal;
