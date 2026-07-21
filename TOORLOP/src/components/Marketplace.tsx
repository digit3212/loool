import React, { useState, useMemo } from 'react';
import { createPortal } from 'react-dom';
import { User, Product, ProductComment } from '../types';
import { useLanguage } from '../context/LanguageContext';
import { INITIAL_PRODUCTS, getLocalizedProducts } from '../data/marketplaceData';
import MarketplaceSidebar from './marketplace/MarketplaceSidebar';
import ProductGrid from './marketplace/ProductGrid';
import SellModal from './marketplace/SellModal';
import LocationModal from './marketplace/LocationModal';
import { ProductDetailModal } from './marketplace/ProductDetailModal';
import MarketplaceShareModal from './marketplace/MarketplaceShareModal';
import { Check, AlertCircle, Store, X } from 'lucide-react';
import { playAudio } from '../utils/audio';

interface MarketplaceProps {
  currentUser: User;
  onMessageClick?: (user: User) => void;
  onBack?: () => void;
}

const Marketplace: React.FC<MarketplaceProps> = ({ currentUser, onMessageClick, onBack }) => {
  const { t, dir, language } = useLanguage();
  
  // Use localized products based on current language
  const [products, setProducts] = useState<Product[]>(() => getLocalizedProducts(t as any));
  
  // Update products when language changes to ensure fresh translations
  useMemo(() => {
    setProducts(prev => {
      const localized = getLocalizedProducts(t as any);
      // Preserve any newly added products by the user (IDs not in initial set)
      const initialIds = new Set(INITIAL_PRODUCTS.map(p => p.id));
      const userAdded = prev.filter(p => !initialIds.has(p.id));
      return [...localized, ...userAdded];
    });
  }, [language, t]);

  const [activeCategory, setActiveCategory] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [showSellModal, setShowSellModal] = useState(false);
  const [viewingProduct, setViewingProduct] = useState<Product | null>(null);
  
  const [showShareModal, setShowShareModal] = useState(false);
  const [productToShare, setProductToShare] = useState<Product | null>(null);
  const [showSavedOnly, setShowSavedOnly] = useState(false);

  // Location Logic
  const [userLocation, setUserLocation] = useState(language === 'ar' ? 'الرياض' : 'Riyadh');
  const [showLocationModal, setShowLocationModal] = useState(false);
  
  // Advanced Filters
  const [minPrice, setMinPrice] = useState('');
  const [maxPrice, setMaxPrice] = useState('');
  const [sortBy, setSortBy] = useState('newest');
  const [showFilters, setShowFilters] = useState(false);

  // UI States
  const [notification, setNotification] = useState<{message: string, type: 'success' | 'info' | 'error'} | null>(null);

  const showNotification = (message: string, type: 'success' | 'info' | 'error' = 'success') => {
    if (type === 'success') playAudio('post_success');
    else if (type === 'error') playAudio('notification');
    else playAudio('pop');

    setNotification({ message, type });
    setTimeout(() => setNotification(null), 3000);
  };

  const handleProductCreated = (newProduct: Product) => {
    setProducts([newProduct, ...products]);
    showNotification(t.market.ad_published_success, 'success');
  };

  const handleToggleSave = (productId: string, e?: React.MouseEvent) => {
    e?.stopPropagation();
    
    setProducts(prev => prev.map(p => {
      if (p.id === productId) {
        const newState = !p.isSaved;
        if (newState) playAudio('like');
        else playAudio('pop');

        showNotification(newState ? t.market.product_saved : t.market.product_removed, 'info');
        return { ...p, isSaved: newState };
      }
      return p;
    }));

    if (viewingProduct && viewingProduct.id === productId) {
        setViewingProduct(prev => prev ? { ...prev, isSaved: !prev.isSaved } : null);
    }
  };

  const handleMessageSeller = () => {
      playAudio('pop');
      if (viewingProduct && onMessageClick) {
          onMessageClick(viewingProduct.seller);
          showNotification(`${t.market.conversation_opened_with} ${viewingProduct.seller.name}`, 'success');
      }
  };

  const handleShareProduct = (product?: Product) => {
      playAudio('pop');
      const target = product || viewingProduct;
      if (target) {
          setProductToShare(target);
          setShowShareModal(true);
      }
  };

  const handleReportProduct = () => {
      playAudio('pop');
      showNotification(t.market.report_submitted, 'info');
  };

  const handleChangeLocation = (newLoc: string) => {
      playAudio('pop');
      setUserLocation(newLoc);
      setShowLocationModal(false);
      showNotification(`${t.market.location_changed_to} ${newLoc}`, 'success');
  };

  const handleDeleteProduct = (productId: string) => {
    playAudio('notification');
    setProducts(prev => prev.filter(p => p.id !== productId));
    setViewingProduct(null);
    showNotification(t.market.product_deleted_success, 'info');
  };

  const handleProductComment = (commentObj: ProductComment) => {
      if (!viewingProduct) return;
      playAudio('comment');

      const updatedProduct = {
          ...viewingProduct,
          comments: [...(viewingProduct.comments || []), commentObj]
      };
      setViewingProduct(updatedProduct);
      setProducts(prev => prev.map(p => p.id === viewingProduct.id ? updatedProduct : p));
  };

  const processedProducts = useMemo(() => {
    let result = products.filter(p => {
      const matchesCategory = activeCategory === 'all' || p.category === activeCategory;
      const matchesSearch = p.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
                            p.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
                            p.description.toLowerCase().includes(searchTerm.toLowerCase());
      
      const price = p.price;
      const min = minPrice ? parseFloat(minPrice) : 0;
      const max = maxPrice ? parseFloat(maxPrice) : Infinity;
      const matchesPrice = price >= min && price <= max;

      const matchesSaved = showSavedOnly ? p.isSaved : true;

      return matchesCategory && matchesSearch && matchesPrice && matchesSaved;
    });

    result.sort((a, b) => {
      if (sortBy === 'newest') return b.timestamp - a.timestamp;
      if (sortBy === 'price_low') return a.price - b.price;
      if (sortBy === 'price_high') return b.price - a.price;
      return 0;
    });

    return result;
  }, [products, activeCategory, searchTerm, minPrice, maxPrice, sortBy, userLocation, showSavedOnly]);

  const handleClearFilters = () => {
      playAudio('pop');
      setSearchTerm('');
      setActiveCategory('all');
      setMinPrice('');
      setMaxPrice('');
      setShowSavedOnly(false);
  };

  return (
    <div className="bg-white/40 dark:bg-gray-900/40 backdrop-blur-md min-h-[calc(100vh-64px)] flex flex-col md:flex-row animate-fadeIn w-full transition-colors duration-300" dir={dir}>
      
      <MarketplaceSidebar 
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        setShowSellModal={(val) => { playAudio('pop'); setShowSellModal(val); }}
        showSavedOnly={showSavedOnly}
        setShowSavedOnly={(val) => { playAudio('pop'); setShowSavedOnly(val); }}
        userLocation={userLocation}
        setShowLocationModal={(val) => { playAudio('pop'); setShowLocationModal(val); }}
        showFilters={showFilters}
        setShowFilters={(val) => { playAudio('pop'); setShowFilters(val); }}
        sortBy={sortBy}
        setSortBy={setSortBy}
        minPrice={minPrice}
        setMinPrice={setMinPrice}
        maxPrice={maxPrice}
        setMaxPrice={setMaxPrice}
        activeCategory={activeCategory}
        setActiveCategory={(val) => { playAudio('pop'); setActiveCategory(val); }}
        onBack={onBack}
      />

      <ProductGrid 
        products={processedProducts}
        onProductClick={(p) => { playAudio('pop'); setViewingProduct(p); }}
        onToggleSave={handleToggleSave}
        userLocation={userLocation}
        showSavedOnly={showSavedOnly}
        onLocationClick={() => { playAudio('pop'); setShowLocationModal(true); }}
        onClearFilters={handleClearFilters}
        onShareProduct={handleShareProduct}
      />

      {showSellModal && (
        <SellModal 
          onClose={() => { playAudio('pop'); setShowSellModal(false); }}
          currentUser={currentUser}
          onProductCreated={handleProductCreated}
          showNotification={showNotification}
        />
      )}

      {showLocationModal && (
          <LocationModal 
             onClose={() => { playAudio('pop'); setShowLocationModal(false); }}
             onLocationChange={handleChangeLocation}
             userLocation={userLocation}
          />
      )}

      {viewingProduct && (
          <ProductDetailModal 
              product={viewingProduct}
              onClose={() => { playAudio('pop'); setViewingProduct(null); }}
              currentUser={currentUser}
              onMessageSeller={handleMessageSeller}
              onToggleSave={(id) => handleToggleSave(id)}
              onShare={() => handleShareProduct()}
              onReport={handleReportProduct}
              onComment={handleProductComment}
              onDelete={handleDeleteProduct}
          />
      )}

      {showShareModal && productToShare && createPortal(
          <MarketplaceShareModal 
            product={productToShare} 
            onClose={() => { playAudio('pop'); setShowShareModal(false); }} 
          />,
          document.body
      )}

      {notification && typeof document !== 'undefined' && createPortal(
        <div className={`fixed bottom-6 ${dir === 'rtl' ? 'left-4 right-4 md:right-6 md:left-auto' : 'left-4 right-4 md:left-6 md:right-auto'} z-[99999] animate-bounce-in flex justify-center md:block`}>
            <div className={`flex items-center gap-3 px-5 py-3.5 rounded-xl shadow-lg text-white backdrop-blur-md border border-white/10 w-full md:w-auto ${notification.type === 'success' ? 'bg-emerald-600/90' : notification.type === 'error' ? 'bg-red-600/90' : 'bg-blue-600/90'}`}>
                {notification.type === 'success' ? <Check className="w-5 h-5 flex-shrink-0" /> : notification.type === 'error' ? <AlertCircle className="w-5 h-5 flex-shrink-0" /> : <Store className="w-5 h-5 flex-shrink-0" />}
                <span className="font-medium text-sm flex-1 md:flex-none">{notification.message}</span>
                <button onClick={() => setNotification(null)} className="text-white/80 hover:text-white transition p-1">
                    <X className="w-4 h-4" />
                </button>
            </div>
        </div>,
        document.body
      )}
    </div>
  );
};

export default Marketplace;