import React from 'react';
import { Flag, Search, Plus, ThumbsUp, MessageCircle, MoreHorizontal, Share2, Bell, BellOff, Trash2 } from 'lucide-react';
import { Page } from '../../types';
import { useLanguage } from '../../context/LanguageContext';

interface PageListProps {
  pages: Page[];
  searchTerm: string;
  setSearchTerm: (val: string) => void;
  activeTab: string;
  setActiveTab: (val: any) => void;
  onVisitPage: (page: Page) => void;
  onLikeToggle: (id: string, e?: React.MouseEvent) => void;
  onMessage: (page: Page, e?: React.MouseEvent) => void;
  onOpenCreate: () => void;
  activeMenuId: string | null;
  setActiveMenuId: (id: string | null) => void;
  onShare: (name: string) => void;
  onToggleNotifications: (id: string) => void;
  onDeletePage: (id: string, name: string) => void;
  onReport: (name: string) => void;
  isPageAdmin: (page: Page) => boolean;
  dir: 'rtl' | 'ltr';
  menuRef: React.RefObject<HTMLDivElement>;
}

const PageList: React.FC<PageListProps> = ({
  pages, searchTerm, setSearchTerm, activeTab, setActiveTab, onVisitPage, onLikeToggle, onMessage,
  onOpenCreate, activeMenuId, setActiveMenuId, onShare, onToggleNotifications, onDeletePage, onReport,
  isPageAdmin, dir, menuRef
}) => {
  const { t, language } = useLanguage();

  return (
    <>
      {/* Header Section with Search and Create Button */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4 animate-fadeIn">
        <div>
          <h2 className="text-xl md:text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-2 transition-colors duration-300">
            <Flag className="w-6 h-6 md:w-7 md:h-7 text-fb-blue fill-current dark:text-emerald-500" /> 
            {t.pages_title || (language === 'ar' ? 'الصفحات' : 'Pages')}
          </h2>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
            {t.pages_discover || (language === 'ar' ? 'اكتشف صفحات جديدة' : 'Discover new pages')}
          </p>
        </div>
        
        <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
          <div className="relative flex-1 sm:w-60 w-full group">
             <Search className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500 dark:text-gray-400 group-focus-within:text-fb-blue transition-colors" />
             <input 
               type="text" 
               placeholder={t.pages_search_placeholder || (language === 'ar' ? 'بحث في الصفحات...' : 'Search Pages...')}
               className="w-full bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 focus:bg-white dark:focus:bg-gray-900 border border-transparent focus:border-fb-blue rounded-full py-2.5 pr-10 pl-4 text-sm transition outline-none text-gray-900 dark:text-white dark:placeholder-gray-400 shadow-sm"
               value={searchTerm}
               onChange={(e) => setSearchTerm(e.target.value)}
             />
          </div>
          <button 
            onClick={onOpenCreate}
            className="bg-fb-blue text-white px-5 py-2.5 rounded-full font-bold text-sm hover:bg-blue-700 transition flex items-center justify-center gap-2 shadow-md hover:shadow-lg transform active:scale-95"
          >
            <Plus className="w-5 h-5" />
            {t.pages_create_page || (language === 'ar' ? 'إنشاء صفحة' : 'Create Page')}
          </button>
        </div>
      </div>

      {/* Tabs Section */}
      <div className="flex items-center gap-2 mb-6 border-b border-gray-100 dark:border-gray-700 pb-2 overflow-x-auto no-scrollbar scroll-smooth">
          {[ 
             { id: 'all', label: t.common_all || (language === 'ar' ? 'الكل' : 'All') },
             { id: 'liked', label: t.pages_liked_pages || (language === 'ar' ? 'صفحات أعجبتني' : 'Liked Pages') },
             { id: 'discover', label: t.pages_discover || (language === 'ar' ? 'اكتشف' : 'Discover') },
             { id: 'my_pages', label: t.pages_my_pages || (language === 'ar' ? 'صفحاتي' : 'My Pages') }
          ].map((tab) => (
              <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`px-5 py-2.5 rounded-lg text-sm font-bold whitespace-nowrap transition relative flex-shrink-0 ${
                      activeTab === tab.id 
                      ? 'text-fb-blue bg-blue-50 dark:bg-emerald-900/10 dark:text-emerald-500' 
                      : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 hover:text-gray-900 dark:hover:text-white'
                  }`}
              >
                  {tab.label}
                  {activeTab === tab.id && <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-fb-blue rounded-full mx-3"></div>}
              </button>
          ))}
      </div>

      {/* Pages Grid */}
      {pages.length > 0 ? (
         <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pb-10">
             {pages.map(page => (
                 <div key={page.id} className="flex flex-col sm:flex-row gap-4 p-4 border border-gray-200 dark:border-gray-700 rounded-2xl hover:shadow-md transition-all duration-300 bg-white dark:bg-gray-800 relative group">
                     <div 
                        className="relative w-full sm:w-24 h-32 sm:h-24 flex-shrink-0 cursor-pointer overflow-hidden rounded-xl bg-gray-100 dark:bg-gray-700"
                        onClick={() => onVisitPage(page)}
                     >
                         <img src={page.avatar} alt={page.name} className="w-full h-full object-cover transition duration-500 group-hover:scale-110" />
                         <div className="absolute inset-0 bg-black/10 group-hover:bg-transparent transition"></div>
                     </div>
                     
                     <div className="flex-1 min-w-0 flex flex-col justify-between">
                         <div className="flex justify-between items-start">
                             <div className="flex-1 min-w-0 pr-2">
                                 <h3 
                                    className="font-bold text-gray-900 dark:text-white text-base hover:text-fb-blue dark:hover:text-emerald-500 cursor-pointer truncate transition"
                                    onClick={() => onVisitPage(page)}
                                 >
                                     {page.name}
                                 </h3>
                                 <span className="text-xs text-gray-500 dark:text-gray-400 block mt-1">{page.category}</span>
                             </div>
                             <div className="relative" ref={activeMenuId === page.id ? menuRef : null}>
                                <button 
                                    onClick={(e) => { e.stopPropagation(); setActiveMenuId(activeMenuId === page.id ? null : page.id); }}
                                    className={`p-2 rounded-full transition ${activeMenuId === page.id ? 'bg-blue-50 dark:bg-emerald-900/10 text-fb-blue dark:text-emerald-500' : 'text-gray-400 hover:text-gray-600 dark:text-gray-500 dark:hover:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'}`}
                                >
                                    <MoreHorizontal className="w-5 h-5" />
                                </button>
                                
                                {activeMenuId === page.id && (
                                    <div className={`absolute top-full mt-1 w-52 bg-white dark:bg-gray-800 rounded-xl shadow-xl border border-gray-100 dark:border-gray-700 z-50 overflow-hidden animate-fadeIn ${dir === 'rtl' ? 'left-0 origin-top-left' : 'right-0 origin-top-right'}`}>
                                        <button onClick={() => onShare(page.name)} className="w-full flex items-center gap-3 px-4 py-3 hover:bg-gray-50 dark:hover:bg-gray-700/50 text-gray-700 dark:text-gray-200 text-sm font-medium transition">
                                            <Share2 className="w-4 h-4" /> {t.common_share || (language === 'ar' ? 'مشاركة' : 'Share')}
                                        </button>
                                        <button onClick={() => onToggleNotifications(page.id)} className="w-full flex items-center gap-3 px-4 py-3 hover:bg-gray-50 dark:hover:bg-gray-700/50 text-gray-700 dark:text-gray-200 text-sm font-medium transition">
                                            {page.notifications ? <BellOff className="w-4 h-4" /> : <Bell className="w-4 h-4" />}
                                            {page.notifications ? (t.post_turn_off_notif || (language === 'ar' ? 'إيقاف الإشعارات' : 'Turn off notifications')) : (t.post_turn_on_notif || (language === 'ar' ? 'تشغيل الإشعارات' : 'Turn on notifications'))}
                                        </button>
                                        {isPageAdmin(page) && (
                                            <button onClick={() => onDeletePage(page.id, page.name)} className="w-full flex items-center gap-3 px-4 py-3 hover:bg-red-50 dark:hover:bg-red-900/20 text-red-600 dark:text-red-400 text-sm font-medium transition border-t border-gray-100 dark:border-gray-700">
                                                <Trash2 className="w-4 h-4" /> {t.pages_delete_page || (language === 'ar' ? 'حذف الصفحة' : 'Delete Page')}
                                            </button>
                                        )}
                                        <button onClick={() => onReport(page.name)} className="w-full flex items-center gap-3 px-4 py-3 hover:bg-gray-50 dark:hover:bg-gray-700/50 text-gray-700 dark:text-gray-200 text-sm font-medium transition">
                                            <Flag className="w-4 h-4" /> {t.common_report || (language === 'ar' ? 'إبلاغ' : 'Report')}
                                        </button>
                                    </div>
                                )}
                             </div>
                         </div>

                         <div className="flex items-center gap-4 text-xs text-gray-500 dark:text-gray-400 mb-4">
                             <span className="flex items-center gap-1 bg-gray-50 dark:bg-gray-700/50 px-2 py-1 rounded-md">
                                 <ThumbsUp className="w-3 h-3 fill-gray-400" /> 
                                 {page.likesCount} {t.pages_likes_count || (language === 'ar' ? 'إعجاب' : 'Likes')}
                             </span>
                             <span>{page.followersCount} {t.pages_followers || (language === 'ar' ? 'متابع' : 'Followers')}</span>
                         </div>
                         
                         <div className="flex gap-2 mt-auto">
                             <button 
                                onClick={(e) => onLikeToggle(page.id, e)}
                                className={`flex-1 px-3 py-2 rounded-lg text-sm font-bold flex items-center justify-center gap-2 transition shadow-sm active:scale-95 ${
                                    page.isLiked 
                                    ? 'bg-fb-blue text-white shadow-sm hover:bg-blue-700' 
                                    : 'bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-200'
                                }`}
                             >
                                 <ThumbsUp className={`w-4 h-4 ${page.isLiked ? 'fill-current' : ''}`} /> 
                                 {page.isLiked ? (t.pages_liked || (language === 'ar' ? 'أعجبني' : 'Liked')) : (t.pages_like || (language === 'ar' ? 'إعجاب' : 'Like'))}
                             </button>
                             <button 
                                onClick={(e) => onMessage(page, e)}
                                className="flex-1 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-200 px-3 py-2 rounded-lg text-sm font-bold flex items-center justify-center gap-2 transition shadow-sm active:scale-95"
                             >
                                 <MessageCircle className="w-4 h-4" /> {t.pages_message || (language === 'ar' ? 'مراسلة' : 'Message')}
                             </button>
                         </div>
                     </div>
                 </div>
             ))}
         </div>
      ) : (
        <div className="col-span-1 md:col-span-2 text-center py-24 text-gray-500 dark:text-gray-400 flex flex-col items-center animate-fadeIn bg-white/50 dark:bg-gray-800/50 rounded-2xl border-2 border-dashed border-gray-200 dark:border-gray-700">
           <div className="bg-gray-100 dark:bg-gray-700 p-6 rounded-full mb-4">
               <Flag className="w-12 h-12 text-gray-400 dark:text-gray-500 opacity-50" />
           </div>
           <h3 className="text-xl font-bold text-gray-800 dark:text-gray-200 mb-2">{t.pages_no_pages || (language === 'ar' ? 'لا توجد صفحات' : 'No pages found')}</h3>
           <p className="text-sm max-w-xs mx-auto mb-6">{t.common_no_results || (language === 'ar' ? 'لم يتم العثور على نتائج مطابقة' : 'No results found matching your search.')}</p>
           <button onClick={() => { setActiveTab('all'); setSearchTerm(''); }} className="text-fb-blue hover:underline font-bold text-sm">
               {t.common_reset || (language === 'ar' ? 'إعادة تعيين' : 'Reset')}
           </button>
        </div>
      )}
    </>
  );
};

export default PageList;