import React, { useState } from 'react';
import { 
  X, 
  MessageCircle, 
  Heart, 
  Share2, 
  Shield, 
  ChevronLeft, 
  ChevronRight, 
  Send, 
  MapPin, 
  Calendar, 
  Tag, 
  Trash2, 
  AlertCircle 
} from 'lucide-react';
import { User, Product, ProductComment } from '../../types';
import { useLanguage } from '../../context/LanguageContext';
import { playAudio } from '../../utils/audio';

interface ProductDetailModalProps {
  product: Product;
  currentUser: User;
  onClose: () => void;
  onMessageSeller: () => void;
  onToggleSave: (id: string, e: React.MouseEvent) => void;
  onShare: () => void;
  onReport: () => void;
  onComment: (comment: ProductComment) => void;
  onDelete?: (productId: string) => void;
}

export const ProductDetailModal: React.FC<ProductDetailModalProps> = ({ 
  product, 
  onClose, 
  currentUser, 
  onMessageSeller, 
  onToggleSave, 
  onShare, 
  onReport, 
  onComment, 
  onDelete 
}) => {
  const { t, dir, language } = useLanguage();
  
  // State Management
  const [newComment, setNewComment] = useState('');
  const [currentImgIndex, setCurrentImgIndex] = useState(0);
  const [showConfirmDelete, setShowConfirmDelete] = useState(false);

  // Computed Values
  const images = product.images && product.images.length > 0 ? product.images : [product.image];
  const isOwner = product.seller.id === currentUser.id;
  
  // Translations Helpers
  const categoryName = t.market.cats[product.category as keyof typeof t.market.cats] || product.category;
  
  const getConditionLabel = (cond: string) => {
      if (cond === 'new') return t.market.new;
      if (cond === 'used_good') return t.market.used_good;
      if (cond === 'used_fair') return t.market.used_fair;
      return cond;
  };
  const conditionLabel = getConditionLabel(product.condition);

  // --- Handlers ---

  const handlePostComment = (e: React.FormEvent) => {
      e.preventDefault();
      if (!newComment.trim()) return;
      
      playAudio('comment');
      
      const commentObj: ProductComment = {
          id: `c_${Date.now()}`,
          user: currentUser,
          text: newComment,
          timestamp: t.date_now || 'Now'
      };
      
      onComment(commentObj);
      setNewComment('');
  };

  const nextImage = (e?: React.MouseEvent) => {
    e?.stopPropagation();
    playAudio('pop');
    setCurrentImgIndex((prev) => (prev + 1) % images.length);
  };

  const prevImage = (e?: React.MouseEvent) => {
    e?.stopPropagation();
    playAudio('pop');
    setCurrentImgIndex((prev) => (prev - 1 + images.length) % images.length);
  };

  const handleDeleteClick = () => {
    playAudio('notification');
    if (onDelete) onDelete(product.id);
    setShowConfirmDelete(false);
  };

  const handleClose = () => {
    playAudio('pop');
    onClose();
  };

  return (
      <div className="fixed inset-0 z-[100] bg-black/90 flex items-center justify-center p-0 md:p-4 animate-fadeIn backdrop-blur-sm" dir={dir}>
          
          <div className="bg-white dark:bg-gray-800 md:rounded-xl shadow-2xl w-full max-w-5xl h-full md:h-[90vh] flex flex-col md:flex-row overflow-hidden animate-scaleIn relative border border-white/10 dark:border-gray-700">
              
              {/* Close Button */}
              <button 
                onClick={handleClose} 
                className={`absolute top-4 ${dir === 'rtl' ? 'left-4 md:right-auto md:left-4' : 'right-4 md:left-auto md:right-4'} z-30 bg-black/40 hover:bg-black/60 text-white p-2 rounded-full transition backdrop-blur-md border border-white/10 active:scale-95`}
              >
                  <X className="w-6 h-6" />
              </button>

              {/* LEFT SIDE: Image Gallery */}
              <div className="w-full md:w-2/3 h-[40vh] md:h-full bg-black flex items-center justify-center relative group overflow-hidden bg-pattern">
                  <img 
                    src={images[currentImgIndex]} 
                    alt={product.title} 
                    className="w-full h-full object-contain transition-transform duration-300" 
                  />
                  
                  {/* Carousel Controls */}
                  {images.length > 1 && (
                    <>
                      <button 
                        onClick={prevImage} 
                        className={`absolute ${dir === 'rtl' ? 'right-4' : 'left-4'} top-1/2 -translate-y-1/2 p-2 md:p-3 bg-black/30 hover:bg-black/50 text-white rounded-full transition md:opacity-0 md:group-hover:opacity-100 backdrop-blur-sm active:scale-95`}
                      >
                        <ChevronLeft className={`w-6 h-6 md:w-8 md:h-8 ${dir === 'rtl' ? 'rotate-180' : ''}`} />
                      </button>
                      
                      <button 
                        onClick={nextImage} 
                        className={`absolute ${dir === 'rtl' ? 'left-4' : 'right-4'} top-1/2 -translate-y-1/2 p-2 md:p-3 bg-black/30 hover:bg-black/50 text-white rounded-full transition md:opacity-0 md:group-hover:opacity-100 backdrop-blur-sm active:scale-95`}
                      >
                        <ChevronRight className={`w-6 h-6 md:w-8 md:h-8 ${dir === 'rtl' ? 'rotate-180' : ''}`} />
                      </button>
                      
                      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-black/50 text-white text-xs px-3 py-1.5 rounded-full backdrop-blur-sm border border-white/10">
                        {currentImgIndex + 1} / {images.length}
                      </div>
                    </>
                  )}
              </div>

              {/* RIGHT SIDE: Product Info */}
              <div className="w-full md:w-1/3 flex flex-col bg-white dark:bg-gray-800 border-t md:border-t-0 md:border-l dark:border-gray-700 h-[60vh] md:h-full">
                  
                  <div className="flex-1 overflow-y-auto p-4 md:p-6 custom-scrollbar">
                      {/* Header Info */}
                      <div className="mb-6">
                          <h2 className="text-xl md:text-2xl font-bold text-gray-900 dark:text-white mb-2 leading-tight">{product.title}</h2>
                          <div className="text-2xl font-bold text-fb-blue mb-1">{product.price.toLocaleString()} {product.currency}</div>
                          <div className="text-xs text-gray-500 dark:text-gray-400 flex items-center gap-2 mt-2">
                              <span className="flex items-center gap-1 bg-gray-100 dark:bg-gray-700/50 px-2 py-1 rounded-md">
                                <MapPin className="w-3 h-3" /> {t.cities[product.location] || product.location}
                              </span>
                              <span className="hidden md:inline">•</span>
                              <span className="flex items-center gap-1 bg-gray-100 dark:bg-gray-700/50 px-2 py-1 rounded-md">
                                <Calendar className="w-3 h-3" /> {product.date}
                              </span>
                          </div>
                      </div>

                      {/* Action Buttons */}
                      <div className="flex flex-col gap-3 mb-6">
                          {!isOwner && (
                            <button 
                              onClick={() => { playAudio('pop'); onMessageSeller(); }} 
                              className="w-full bg-blue-50 dark:bg-blue-900/20 text-fb-blue py-3 rounded-xl font-bold hover:bg-blue-100 dark:hover:bg-blue-900/40 transition flex items-center justify-center gap-2 border border-blue-200 dark:border-blue-800 active:scale-95"
                            >
                              <MessageCircle className="w-5 h-5" /> {t.market.message_seller}
                            </button>
                          )}
                          
                          <div className="flex gap-3">
                              <button 
                                onClick={(e) => { e.stopPropagation(); onToggleSave(product.id, e); }} 
                                className={`flex-1 py-2.5 rounded-xl font-semibold flex items-center justify-center gap-2 transition border active:scale-95 ${product.isSaved ? 'bg-fb-blue text-white border-fb-blue shadow-md' : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-200 border-transparent hover:bg-gray-200 dark:hover:bg-gray-600'}`}
                              >
                                <Heart className={`w-5 h-5 ${product.isSaved ? 'fill-white' : ''}`} /> 
                                {product.isSaved ? t.post.unsave : t.common.save}
                              </button>
                              
                              <button 
                                onClick={() => { playAudio('pop'); onShare(); }} 
                                className="p-2.5 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-200 rounded-xl hover:bg-gray-200 dark:hover:bg-gray-600 transition active:scale-95"
                              >
                                <Share2 className="w-5 h-5" />
                              </button>
                              
                              {isOwner ? (
                                <button 
                                  onClick={() => { playAudio('pop'); setShowConfirmDelete(true); }} 
                                  className="p-2.5 bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 rounded-xl hover:bg-red-100 dark:hover:bg-red-900/40 transition active:scale-95 border border-red-100 dark:border-red-900/30"
                                >
                                  <Trash2 className="w-5 h-5" />
                                </button>
                              ) : (
                                <button 
                                  onClick={() => { playAudio('pop'); onReport(); }} 
                                  className="p-2.5 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-200 rounded-xl hover:bg-gray-200 dark:hover:bg-gray-600 transition active:scale-95"
                                >
                                  <Shield className="w-5 h-5" />
                                </button>
                              )}
                          </div>
                      </div>

                      <div className="space-y-6">
                          {/* Details Grid */}
                          <div className="border-t border-gray-100 dark:border-gray-700 pt-4">
                              <h3 className="font-bold text-gray-900 dark:text-white mb-3 text-lg">{t.groups.about}</h3>
                              <div className="grid grid-cols-2 gap-4 text-sm">
                                  <div className="bg-gray-50 dark:bg-gray-700/30 p-3 rounded-xl border border-gray-100 dark:border-gray-700">
                                    <span className="text-gray-500 dark:text-gray-400 block mb-1 text-xs">{t.market.condition}</span>
                                    <span className="font-bold text-gray-900 dark:text-white">{conditionLabel}</span>
                                  </div>
                                  <div className="bg-gray-50 dark:bg-gray-700/30 p-3 rounded-xl border border-gray-100 dark:border-gray-700">
                                    <span className="text-gray-500 dark:text-gray-400 block mb-1 text-xs">{t.market.categories}</span>
                                    <span className="font-bold text-gray-900 dark:text-white flex items-center gap-1">
                                      <Tag className="w-3 h-3 text-fb-blue" /> {categoryName}
                                    </span>
                                  </div>
                              </div>
                          </div>

                          {/* Description */}
                          <div className="border-t border-gray-100 dark:border-gray-700 pt-4">
                            <h3 className="font-bold text-gray-900 dark:text-white mb-2 text-lg">{t.market.description}</h3>
                            <p className="text-gray-700 dark:text-gray-300 text-sm leading-relaxed whitespace-pre-wrap">{product.description}</p>
                          </div>

                          {/* Seller Info */}
                          <div className="border-t border-gray-100 dark:border-gray-700 pt-4 mb-4">
                            <h3 className="font-bold text-gray-900 dark:text-white mb-3 text-lg">{t.market.seller_info}</h3>
                            <div className="flex items-center gap-3 p-3 rounded-xl bg-gray-50 dark:bg-gray-700/30 border border-gray-100 dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-700/50 transition cursor-pointer group active:scale-98">
                                <div className="relative">
                                  <img src={product.seller.avatar} alt="Seller" className="w-14 h-14 rounded-full object-cover border-2 border-white dark:border-gray-600 shadow-sm" />
                                  <div className="absolute bottom-0 right-0 w-3.5 h-3.5 bg-green-500 border-2 border-white dark:border-gray-800 rounded-full"></div>
                                </div>
                                <div>
                                  <h4 className="font-bold text-gray-900 dark:text-white group-hover:underline">{product.seller.name}</h4>
                                  <div className="text-xs text-gray-500 dark:text-gray-400 flex items-center gap-1 mt-0.5">
                                    <Shield className="w-3 h-3 text-green-600" /> {t.market.verified_phone}
                                  </div>
                                  <span className="text-xs text-gray-400 mt-0.5 block">{t.market.joined_since} 2021</span>
                                </div>
                                <ChevronLeft className={`mr-auto w-5 h-5 text-gray-400 group-hover:text-gray-600 dark:group-hover:text-gray-300 ${dir === 'rtl' ? 'rotate-0' : 'rotate-180'}`} />
                            </div>
                          </div>

                          {/* Comments Section */}
                          <div className="border-t border-gray-100 dark:border-gray-700 pt-4">
                            <h3 className="font-bold text-gray-900 dark:text-white mb-3 text-lg">{t.common.comments}</h3>
                            
                            <div className="space-y-3 mb-4 max-h-48 overflow-y-auto custom-scrollbar">
                              {product.comments && product.comments.length > 0 ? (
                                product.comments.map(comment => (
                                  <div key={comment.id} className="flex gap-2 animate-slideUp">
                                    <img src={comment.user.avatar} alt={comment.user.name} className="w-8 h-8 rounded-full object-cover border border-gray-200 dark:border-gray-600" />
                                    <div className="flex flex-col">
                                      <div className="bg-gray-100 dark:bg-gray-700 px-3 py-2 rounded-2xl rounded-tr-none">
                                        <span className="font-bold text-xs block text-gray-900 dark:text-white">{comment.user.name}</span>
                                        <span className="text-sm text-gray-800 dark:text-gray-200">{comment.text}</span>
                                      </div>
                                      <span className="text-[10px] text-gray-500 mt-1 px-1">{comment.timestamp}</span>
                                    </div>
                                  </div>
                                ))
                              ) : (
                                <p className="text-sm text-gray-500 dark:text-gray-400 italic text-center py-4">{t.groups.be_first}</p>
                              )}
                            </div>

                            <form onSubmit={handlePostComment} className="flex items-center gap-2 pb-6">
                                <img src={currentUser.avatar} className="w-8 h-8 rounded-full border border-gray-200 dark:border-gray-600" alt="Me" />
                                <div className="flex-1 relative">
                                  <input 
                                    type="text" 
                                    className="w-full bg-gray-100 dark:bg-gray-700 border border-transparent dark:border-gray-600 rounded-full py-2 px-3 pl-10 text-sm outline-none focus:ring-2 focus:ring-fb-blue focus:bg-white dark:focus:bg-gray-800 transition dark:text-white dark:placeholder-gray-400" 
                                    placeholder={t.market.ask_seller} 
                                    value={newComment} 
                                    onChange={(e) => setNewComment(e.target.value)} 
                                  />
                                  <button 
                                    type="submit" 
                                    disabled={!newComment.trim()} 
                                    className={`absolute ${dir === 'rtl' ? 'left-2' : 'right-2'} top-1/2 -translate-y-1/2 text-fb-blue disabled:opacity-50 hover:bg-blue-50 dark:hover:bg-blue-900/20 p-1.5 rounded-full transition active:scale-90`}
                                  >
                                    <Send className={`w-4 h-4 ${dir === 'rtl' ? 'rotate-180' : ''}`} />
                                  </button>
                                </div>
                            </form>
                          </div>

                          {/* Safety Tips */}
                          <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-xl border border-blue-100 dark:border-blue-800/30 mt-4 mb-6">
                            <h4 className="font-bold text-fb-blue dark:text-blue-400 text-sm mb-2 flex items-center gap-2">
                              <Shield className="w-4 h-4" /> {t.market.safety_tips}
                            </h4>
                            <ul className="text-xs text-gray-600 dark:text-gray-300 space-y-1.5 list-disc pr-4 opacity-90">
                              <li>{t.market.tips_1}</li>
                              <li>{t.market.tips_2}</li>
                              <li>{t.market.tips_3}</li>
                            </ul>
                          </div>
                      </div>
                  </div>
              </div>

              {/* Confirmation Modal for Delete */}
              {showConfirmDelete && (
                <div className="fixed inset-0 z-[200] bg-black/60 flex items-center justify-center p-4 animate-fadeIn backdrop-blur-sm">
                    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-2xl w-full max-w-sm overflow-hidden animate-scaleIn border border-white/20 dark:border-gray-700">
                        <div className="p-4 border-b border-gray-100 dark:border-gray-700 flex justify-between items-center bg-gray-50 dark:bg-gray-700/50">
                          <h3 className="font-bold text-lg text-gray-900 dark:text-white flex items-center gap-2">
                            <Trash2 className="w-5 h-5 text-red-500" /> {t.market.delete_product}
                          </h3>
                          <button 
                            onClick={() => { playAudio('pop'); setShowConfirmDelete(false); }} 
                            className="text-gray-400 hover:text-gray-600 dark:hover:text-white p-1 rounded-full transition"
                          >
                            <X className="w-5 h-5" />
                          </button>
                        </div>
                        
                        <div className="p-6 text-center">
                          <div className="w-16 h-16 bg-red-100 dark:bg-red-900/20 rounded-full flex items-center justify-center mx-auto mb-4">
                            <AlertCircle className="w-8 h-8 text-red-600" />
                          </div>
                          <p className="text-gray-700 dark:text-gray-300 font-bold mb-2">{t.market.delete_confirm_title}</p>
                          <p className="text-sm text-gray-500 dark:text-gray-400">{t.market.delete_confirm_desc}</p>
                        </div>
                        
                        <div className="p-4 bg-gray-50 dark:bg-gray-700/50 flex justify-end gap-3 border-t border-gray-100 dark:border-gray-700">
                          <button 
                            onClick={() => { playAudio('pop'); setShowConfirmDelete(false); }} 
                            className="px-5 py-2.5 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg text-sm font-semibold text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-600 transition shadow-sm active:scale-95"
                          >
                            {t.common.cancel}
                          </button>
                          <button 
                            onClick={handleDeleteClick} 
                            className="px-5 py-2.5 bg-red-600 text-white rounded-lg text-sm font-semibold hover:bg-red-700 transition shadow-sm flex items-center gap-2 active:scale-95"
                          >
                            {t.common.confirm}
                          </button>
                        </div>
                    </div>
                </div>
              )}
          </div>
      </div>
  );
};