import React, { useState, useEffect, useMemo } from 'react';
import { 
  Users, 
  Bookmark, 
  Calendar, 
  Clock, 
  ChevronDown, 
  ChevronUp, 
  MonitorPlay, 
  Store, 
  LayoutGrid, 
  Gamepad2, 
  History, 
  Flag, 
  X, 
  Plus, 
  Search, 
  Check, 
  Edit, 
  Link as LinkIcon, 
  UserPlus, 
  PlayCircle, 
  MapPin, 
  Tag, 
  Heart, 
  ShieldAlert, 
  CreditCard, 
  BarChart, 
  Megaphone, 
  Gift, 
  MessageCircle, 
  ShoppingBag, 
  Activity,
  Leaf
} from 'lucide-react';
import { User, View } from '../types';
import { useLanguage } from '../context/LanguageContext';
import { INITIAL_GROUPS } from '../data/groupsData';
import { MOCK_GAMES } from '../data/gamingData';
import { INITIAL_PAGES } from '../data/initialData';
import { safeSetItem, safeGetItem } from '../utils/safeStorage';

interface SidebarProps {
  currentUser: User;
  onProfileClick: () => void;
  onNavigate: (view: View) => void;
}

// Unified interface for shortcuts
// 'image' will store URL for user content, or IconKey string for system actions
interface ShortcutItem {
  id: string;
  name: string;
  image: string;
  type: 'group' | 'game' | 'page' | 'friend' | 'action';
  view: View;
  isSystemIcon?: boolean;
}

// Icon Registry to avoid storing React Nodes in state/localStorage (Fixes Error #31)
const ICON_MAP: Record<string, React.ElementType> = {
  Users, Bookmark, Calendar, History, Flag, MapPin, UserPlus, PlayCircle, Tag, Heart, ShieldAlert,
  Store, MonitorPlay, Gamepad2, LayoutGrid, CreditCard, BarChart, Megaphone, Gift, MessageCircle, ShoppingBag, Activity, Leaf
};

const DynamicIcon = ({ iconName, className }: { iconName: string, className?: string }) => {
  const IconComponent = ICON_MAP[iconName] || StarIcon;
  return <IconComponent className={className} />;
};

// Fallback Icon
const StarIcon = ({ className }: { className?: string }) => (
  <svg className={className} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>
);

// Generate pool of all possible shortcuts from real data
const getAllPossibleShortcuts = (t: Record<string, string>, language: string): ShortcutItem[] => {
  const groupItems: ShortcutItem[] = INITIAL_GROUPS.map(g => ({
    id: `group_${g.id}`,
    name: g.name,
    image: g.coverUrl,
    type: 'group',
    view: 'groups'
  }));

  const gameItems: ShortcutItem[] = MOCK_GAMES.map(g => ({
    id: `game_${g.id}`,
    name: g.title,
    image: g.image,
    type: 'game',
    view: 'gaming'
  }));

  const pageItems: ShortcutItem[] = INITIAL_PAGES.map(p => ({
    id: `page_${p.id}`,
    name: p.name,
    image: p.avatar,
    type: 'page',
    view: 'pages'
  }));

  // System Actions Shortcuts (Real Facebook-like shortcuts)
  // Using string keys for icons to be serializable
  const actionItems: ShortcutItem[] = [
    {
      id: 'action_create_group',
      name: language === 'ar' ? 'إنشاء مجموعة' : 'Create Group',
      image: 'UserPlus',
      type: 'action',
      view: 'groups',
      isSystemIcon: true
    },
    {
      id: 'action_create_page',
      name: language === 'ar' ? 'إنشاء صفحة' : 'Create Page',
      image: 'Flag',
      type: 'action',
      view: 'pages',
      isSystemIcon: true
    },
    {
      id: 'action_saved',
      name: t.menu_saved || (language === 'ar' ? 'العناصر المحفوظة' : 'Saved'),
      image: 'Bookmark',
      type: 'action',
      view: 'saved',
      isSystemIcon: true
    },
    {
      id: 'action_memories',
      name: t.menu_memories || (language === 'ar' ? 'الذكريات' : 'Memories'),
      image: 'History',
      type: 'action',
      view: 'memories',
      isSystemIcon: true
    },
    {
      id: 'action_events',
      name: t.menu_events || (language === 'ar' ? 'المناسبات' : 'Events'),
      image: 'Calendar',
      type: 'action',
      view: 'events',
      isSystemIcon: true
    },
    // --- Expanded Real Shortcuts --- 
    {
      id: 'action_nearby',
      name: language === 'ar' ? 'أصدقاء بالجوار' : 'Nearby Friends',
      image: 'MapPin',
      type: 'action',
      view: 'nearby' as View,
      isSystemIcon: true
    },
    {
      id: 'action_suggestions',
      name: language === 'ar' ? 'اقتراحات الصداقة' : 'Friend Suggestions',
      image: 'UserPlus',
      type: 'action',
      view: 'suggestions' as View,
      isSystemIcon: true
    },
    {
      id: 'action_live',
      name: language === 'ar' ? 'فيديو مباشر' : 'Live Videos',
      image: 'PlayCircle',
      type: 'action',
      view: 'watch',
      isSystemIcon: true
    },
    {
      id: 'action_offers',
      name: language === 'ar' ? 'العروض' : 'Offers',
      image: 'Tag',
      type: 'action',
      view: 'marketplace',
      isSystemIcon: true
    },
    {
      id: 'action_blood',
      name: language === 'ar' ? 'التبرع بالدم' : 'Blood Donations',
      image: 'Heart',
      type: 'action',
      view: 'home', 
      isSystemIcon: true
    },
    {
      id: 'action_crisis',
      name: language === 'ar' ? 'الاستجابة للأزمات' : 'Crisis Response',
      image: 'ShieldAlert',
      type: 'action',
      view: 'home', 
      isSystemIcon: true
    },
    {
      id: 'action_feeds',
      name: language === 'ar' ? 'آخر الأخبار' : 'Feeds',
      image: 'LayoutGrid',
      type: 'action',
      view: 'home', 
      isSystemIcon: true
    },
    {
      id: 'action_ads',
      name: language === 'ar' ? 'مدير الإعلانات' : 'Ads Manager',
      image: 'BarChart',
      type: 'action',
      view: 'home', 
      isSystemIcon: true
    },
    {
      id: 'action_climate',
      name: language === 'ar' ? 'علم المناخ' : 'Climate Science',
      image: 'Leaf',
      type: 'action',
      view: 'home', 
      isSystemIcon: true
    },
    {
      id: 'action_fundraisers',
      name: language === 'ar' ? 'حملات التبرع' : 'Fundraisers',
      image: 'Gift',
      type: 'action',
      view: 'home', 
      isSystemIcon: true
    },
    {
      id: 'action_messenger',
      name: language === 'ar' ? 'ماسنجر' : 'Messenger',
      image: 'MessageCircle',
      type: 'action',
      view: 'home', 
      isSystemIcon: true
    },
    {
      id: 'action_orders',
      name: language === 'ar' ? 'الطلبات والمدفوعات' : 'Orders & Payments',
      image: 'CreditCard',
      type: 'action',
      view: 'marketplace', 
      isSystemIcon: true
    },
    {
      id: 'action_activity',
      name: language === 'ar' ? 'نشاط الإعلانات الحديث' : 'Recent Ad Activity',
      image: 'Activity',
      type: 'action',
      view: 'home', 
      isSystemIcon: true
    }
  ];

  return [...actionItems, ...groupItems, ...pageItems, ...gameItems];
};

const Sidebar: React.FC<SidebarProps> = ({ currentUser, onProfileClick, onNavigate }) => {
  const { t, language, dir } = useLanguage();
  const [isExpanded, setIsExpanded] = useState(false);
  
  // State for Shortcuts Management with Persistence
  const [shortcuts, setShortcuts] = useState<ShortcutItem[]>(() => {
    const saved = safeGetItem('tourloop_sidebar_shortcuts');
    if (saved && Array.isArray(saved)) {
        // Sanitize loaded data to prevent Error #31
        // Filter out any items where 'image' is an object (corrupt data from previous bugs)
        return saved.filter(item => typeof item.image === 'string');
    }
    return [];
  });

  const [isEditingShortcuts, setIsEditingShortcuts] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  // Save shortcuts whenever they change
  useEffect(() => {
    safeSetItem('tourloop_sidebar_shortcuts', JSON.stringify(shortcuts));
  }, [shortcuts]);

  // Effect to update shortcut names when language changes
  useEffect(() => {
    const allShortcuts = getAllPossibleShortcuts(t, language);
    setShortcuts(prev => prev.map(savedItem => {
        // Find matching item in master list to get updated name
        const freshItem = allShortcuts.find(item => item.id === savedItem.id);
        if (freshItem) {
            return { ...savedItem, name: freshItem.name };
        }
        return savedItem;
    }));
  }, [language, t]);

  // Dynamic Menu Items with Translation Keys
  const allMenuItems = [
    { 
      id: 'friends',
      icon: <Users className="h-8 w-8 text-emerald-700 hover:text-blue-700 dark:text-emerald-400 dark:hover:text-blue-700" />, 
      label: t.nav_friends || (language === 'ar' ? 'الأصدقاء' : 'Friends'), 
      view: 'friends' as View 
    },
    { 
      id: 'market',
      icon: <Store className="h-8 w-8 text-emerald-700 hover:text-blue-700 dark:text-emerald-400 dark:hover:text-blue-700" />, 
      label: t.nav_market || (language === 'ar' ? 'المتجر' : 'Marketplace'), 
      view: 'marketplace' as View 
    },
    { 
      id: 'watch',
      icon: <MonitorPlay className="h-8 w-8 text-emerald-700 hover:text-blue-700 dark:text-emerald-400 dark:hover:text-blue-700" />, 
      label: t.nav_watch || (language === 'ar' ? 'فيديو' : 'Watch'), 
      view: 'watch' as View 
    },
    { 
      id: 'memories',
      icon: <History className="h-8 w-8 text-emerald-700 hover:text-blue-700 dark:text-emerald-400 dark:hover:text-blue-700" />, 
      label: t.menu_memories || (language === 'ar' ? 'الذكريات' : 'Memories'), 
      view: 'memories' as View 
    },
    { 
      id: 'saved',
      icon: <Bookmark className="h-8 w-8 text-emerald-700 hover:text-blue-700 dark:text-emerald-400 dark:hover:text-blue-700" />, 
      label: t.menu_saved || (language === 'ar' ? 'العناصر المحفوظة' : 'Saved'), 
      view: 'saved' as View 
    },
    { 
      id: 'gaming',
      icon: <Gamepad2 className="h-8 w-8 text-emerald-700 hover:text-blue-700 dark:text-emerald-400 dark:hover:text-blue-700" />, 
      label: t.nav_gaming || (language === 'ar' ? 'ألعاب' : 'Gaming'), 
      view: 'gaming' as View 
    },
    { 
      id: 'groups',
      icon: <LayoutGrid className="h-8 w-8 text-emerald-700 hover:text-blue-700 dark:text-emerald-400 dark:hover:text-blue-700" />, 
      label: t.menu_groups || (language === 'ar' ? 'المجموعات' : 'Groups'), 
      view: 'groups' as View 
    },
    { 
      id: 'events',
      icon: <Calendar className="h-8 w-8 text-emerald-700 hover:text-blue-700 dark:text-emerald-400 dark:hover:text-blue-700" />, 
      label: t.menu_events || (language === 'ar' ? 'المناسبات' : 'Events'), 
      view: 'events' as View 
    },
    { 
      id: 'pages',
      icon: <Flag className="h-8 w-8 text-emerald-700 hover:text-blue-700 dark:text-emerald-400 dark:hover:text-blue-700" />, 
      label: t.profile_pages || (language === 'ar' ? 'الصفحات' : 'Pages'), 
      view: 'pages' as View 
    }
  ];

  // Logic to show limited items or all items
  const visibleItems = isExpanded ? allMenuItems : allMenuItems.slice(0, 6);

  const handleItemClick = (view: View) => {
    onNavigate(view);
  };

  const handleRemoveShortcut = (id: string, e: React.MouseEvent) => {
      e.stopPropagation();
      setShortcuts(prev => prev.filter(s => s.id !== id));
  };

  const handleAddShortcut = (shortcut: ShortcutItem) => {
      if (shortcuts.some(s => s.id === shortcut.id)) return;
      setShortcuts(prev => [...prev, shortcut]);
  };

  // Generate suggestions based on real data and search term
  const suggestions = useMemo(() => {
      const all = getAllPossibleShortcuts(t, language);
      return all.filter(s => 
          !shortcuts.some(existing => existing.id === s.id) &&
          s.name.toLowerCase().includes(searchTerm.toLowerCase())
      );
  }, [shortcuts, searchTerm, t, language]);

  return (
    <div className="hidden lg:block w-[300px] h-[calc(100vh-56px)] overflow-y-auto sticky top-14 p-4 hover:overflow-y-scroll no-scrollbar bg-white/70 dark:bg-gray-900/70 backdrop-md transition-colors duration-300 rounded-bl-xl z-20 shadow-sm border-r dark:border-gray-800" dir={dir}>
      <ul className="space-y-1">
        {/* Profile Link */}
        <li 
          className="flex items-center gap-3 p-2 hover:bg-gray-200 dark:hover:bg-gray-700/60 rounded-lg cursor-pointer transition-all duration-200 group active:scale-95"
          onClick={onProfileClick}
          role="button"
          tabIndex={0}
          onKeyDown={(e) => e.key === 'Enter' && onProfileClick()}
        >
          <img 
            src={currentUser.avatar || 'https://via.placeholder.com/40'} 
            alt={currentUser.name} 
            className="h-9 w-9 rounded-full border border-gray-200 dark:border-gray-600 object-cover shadow-sm group-hover:shadow-md transition-shadow" 
            onError={(e) => {
                const target = e.target as HTMLImageElement;
                target.src = 'https://via.placeholder.com/40';
            }}
          />
          <span className="font-semibold text-[15px] text-gray-900 dark:text-gray-100 group-hover:text-black dark:group-hover:text-white transition-colors truncate">{currentUser.name}</span>
        </li>
        
        {/* Dynamic Menu Items */}
        {visibleItems.map((item) => (
          <li 
            key={item.id} 
            className="flex items-center gap-3 p-2 hover:bg-gray-200 dark:hover:bg-gray-700/60 rounded-lg cursor-pointer transition-all duration-200 group active:scale-95"
            onClick={() => handleItemClick(item.view)}
            role="button"
            tabIndex={0}
          >
            <div className="flex items-center justify-center w-9 h-9 transition-transform duration-200 group-hover:scale-110 drop-shadow-sm">
                {item.icon}
            </div>
            <span className="font-medium text-[15px] text-gray-900 dark:text-gray-200 group-hover:text-black dark:group-hover:text-white transition-colors">
                {item.label}
            </span>
          </li>
        ))}
        
        {/* Expand/Collapse Button */}
        <li 
            className="flex items-center gap-3 p-2 hover:bg-gray-200 dark:hover:bg-gray-700/60 rounded-lg cursor-pointer transition-all duration-200 active:scale-95"
            onClick={() => setIsExpanded(!isExpanded)}
            role="button"
            tabIndex={0}
        >
          <div className="w-9 h-9 bg-gray-300 dark:bg-gray-700 rounded-full flex items-center justify-center transition-colors shadow-sm">
            {isExpanded ? (
                <ChevronUp className="h-6 w-6 text-emerald-700 hover:text-blue-700 dark:text-emerald-400 dark:hover:text-blue-700"/>
            ) : (
                <ChevronDown className="h-6 w-6 text-emerald-700 hover:text-blue-700 dark:text-emerald-400 dark:hover:text-blue-700"/>
            )}
          </div>
          <span className="font-medium text-[15px] text-gray-900 dark:text-gray-200">
              {isExpanded ? (t.menu_less || (language === 'ar' ? 'عرض أقل' : 'See less')) : (t.menu_more || (language === 'ar' ? 'عرض المزيد' : 'See more'))}
          </span>
        </li>
      </ul>

      <div className="border-t border-gray-300 dark:border-gray-700 my-4 mx-2"></div>

      {/* Shortcuts Section */}
      <div className="px-2">
        <h3 className="text-gray-500 dark:text-gray-400 font-semibold text-[17px] mb-2 flex items-center justify-between group cursor-default">
            {t.sidebar_shortcuts || (language === 'ar' ? 'اختصاراتك' : 'Your Shortcuts')}
            {/* Interactive Edit Button for Shortcuts */}
            <button 
                onClick={() => {
                    setIsEditingShortcuts(!isEditingShortcuts);
                    if (isEditingShortcuts) setShowAddModal(false);
                }}
                className={`text-xs font-bold transition-all px-3 py-1.5 rounded-lg shadow-sm ${isEditingShortcuts 
                  ? 'bg-emerald-700 text-white hover:bg-blue-700' 
                  : 'text-emerald-700 hover:text-blue-700 dark:text-emerald-400 dark:hover:text-blue-700'}`}
            >
                {isEditingShortcuts ? (t.common_done || (language === 'ar' ? 'تم' : 'Done')) : (t.btn_edit || (language === 'ar' ? 'تعديل' : 'Edit'))}
            </button>
        </h3>
        <ul className="space-y-1">
          {shortcuts.map((shortcut) => (
            <li 
                key={shortcut.id} 
                className={`flex items-center gap-3 p-2 hover:bg-gray-200 dark:hover:bg-gray-700/60 rounded-lg transition-colors duration-200 animate-fadeIn ${isEditingShortcuts ? 'cursor-default' : 'cursor-pointer active:scale-95'}`}
                onClick={() => !isEditingShortcuts && onNavigate(shortcut.view)}
            >
              {shortcut.isSystemIcon ? (
                 <div className="h-9 w-9 rounded-lg flex items-center justify-center bg-fb-blue shadow-sm">
                     {/* Render dynamic icon component by name string to avoid React Error #31 */}
                     <DynamicIcon iconName={shortcut.image} className="w-5 h-5 text-white" />
                 </div>
              ) : (
                <img 
                  src={shortcut.image} 
                  className="h-9 w-9 rounded-lg object-cover border border-gray-200 dark:border-gray-600 shadow-sm" 
                  alt={shortcut.name} 
                />
              )}
              <span className="font-medium text-[15px] text-gray-900 dark:text-gray-200 truncate flex-1">
                  {shortcut.name}
              </span>
              
              {/* Delete Icon showing when editing */}
              {isEditingShortcuts && (
                  <button 
                      onClick={(e) => handleRemoveShortcut(shortcut.id, e)}
                      className="text-gray-500 hover:text-red-500 hover:bg-gray-300 dark:hover:bg-gray-600 p-1.5 rounded-full transition shadow-sm"
                      title={t.common_remove || (language === 'ar' ? 'إزالة' : 'Remove')}
                  >
                      <X className="w-4 h-4" />
                  </button>
              )}
            </li>
          ))}
          
          {/* Add Shortcut Button (Visible Only When Editing) */}
          {isEditingShortcuts && (
              <li 
                  className="flex items-center gap-3 p-2 hover:bg-gray-200 dark:hover:bg-gray-700/60 rounded-lg cursor-pointer transition-colors duration-200 text-fb-blue active:scale-95"
                  onClick={() => { setSearchTerm(''); setShowAddModal(true); }}
              >
                  <div className="flex items-center justify-center w-9 h-9 bg-blue-50 dark:bg-blue-900/20 rounded-lg text-emerald-700 hover:text-blue-700 dark:text-emerald-400 dark:hover:text-blue-700 shadow-sm">
                      <Plus className="w-5 h-5" />
                  </div>
                  <span className="font-medium text-emerald-700 hover:text-blue-700 dark:text-emerald-400 dark:hover:text-blue-700 [15px]">{t.sidebar_add_shortcut || (language === 'ar' ? 'إضافة اختصار' : 'Add Shortcut')}</span>
              </li>
          )}

          {shortcuts.length === 0 && !isEditingShortcuts && (
              <li className="text-center py-4 text-emerald-700 hover:text-blue-700 dark:text-emerald-400 dark:hover:text-blue-700">
                  {t.sidebar_no_shortcuts || (language === 'ar' ? 'لا توجد اختصارات' : 'No shortcuts')}
              </li>
          )}
        </ul>
      </div>
      
      {/* Footer */}
      <div className="mt-auto p-4 text-xs text-gray-500 dark:text-gray-400 leading-normal hover:text-gray-700 dark:hover:text-gray-300 transition-colors cursor-default">
        {t.privacy_footer || 'Privacy · Terms · Advertising · Meta © 2024'}
      </div>

      {/* Add Shortcut Modal */}
      {showAddModal && (
          <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fadeIn">
              <div className="bg-white dark:bg-gray-800 rounded-xl shadow-2xl w-full max-w-sm overflow-hidden animate-scaleIn border border-gray-200 dark:border-gray-700">
                  <div className="p-4 border-b border-gray-100 dark:border-gray-700 flex justify-between items-center bg-gray-50 dark:bg-gray-800/50">
                      <h3 className="font-bold text-lg text-gray-900 dark:text-white flex items-center gap-2">
                          <Plus className="w-5 h-5 text-fb-blue" /> {t.sidebar_add_shortcut || (language === 'ar' ? 'إضافة اختصار' : 'Add Shortcut')}
                      </h3>
                      <button onClick={() => setShowAddModal(false)} className="text-gray-500 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-full p-1.5 transition">
                          <X className="w-5 h-5" />
                      </button>
                  </div>
                  
                  <div className="p-4">
                      {/* Search Input */}
                      <div className="relative mb-4 group">
                          <Search className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 dark:text-gray-500 group-focus-within:text-fb-blue transition-colors" />
                          <input 
                              type="text" 
                              placeholder={t.search_placeholder || (language === 'ar' ? 'بحث...' : 'Search...')}
                              className="w-full bg-gray-100 dark:bg-gray-700 rounded-full py-2.5 pr-10 pl-4 text-sm outline-none focus:ring-2 focus:ring-fb-blue transition text-gray-900 dark:text-white dark:placeholder-gray-400 shadow-inner"
                              value={searchTerm}
                              onChange={(e) => setSearchTerm(e.target.value)}
                              autoFocus
                          />
                      </div>

                      {/* Suggestions List */}
                      <div className="max-h-60 overflow-y-auto space-y-1 custom-scrollbar pr-1">
                          {suggestions.length > 0 ? (
                              suggestions.map(item => (
                                  <div 
                                      key={item.id} 
                                      className="flex items-center gap-3 p-2 hover:bg-gray-50 dark:hover:bg-gray-700/50 rounded-lg cursor-pointer transition group"
                                      onClick={() => handleAddShortcut(item)}
                                  >
                                      {item.isSystemIcon ? (
                                         <div className="h-10 w-10 rounded-lg flex items-center justify-center bg-fb-blue shadow-sm">
                                             <DynamicIcon iconName={item.image} className="w-5 h-5 text-white" />
                                         </div>
                                      ) : (
                                         <img src={item.image as string} className="h-10 w-10 rounded-lg object-cover border border-gray-100 dark:border-gray-600 shadow-sm" alt={item.name} />
                                      )}
                                      <div className="flex-1 min-w-0">
                                          <div className="font-medium text-sm text-gray-900 dark:text-white truncate">{item.name}</div>
                                          <div className="text-xs text-gray-500 dark:text-gray-400 capitalize">{item.type === 'action' ? (language === 'ar' ? 'إجراء' : 'Action') : item.type}</div>
                                      </div>
                                      <div className="p-1.5 bg-gray-100 dark:bg-gray-700 rounded-full group-hover:bg-blue-100 dark:group-hover:bg-blue-900/30 transition text-gray-400 dark:text-gray-500 group-hover:text-fb-blue">
                                          <Plus className="w-4 h-4" />
                                      </div>
                                  </div>
                              ))
                          ) : (
                              <div className="text-center py-6 text-gray-500 dark:text-gray-400 text-sm">
                                  {t.common_no_results || (language === 'ar' ? 'لا توجد نتائج' : 'No results found')}
                              </div>
                          )}
                      </div>
                  </div>
                  
                  <div className="p-4 border-t border-gray-100 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50 flex justify-end">
                      <button 
                          onClick={() => setShowAddModal(false)}
                          className="px-6 py-2 bg-emerald-700 text-white rounded-lg text-sm font-bold hover:bg-blue-700 transition shadow-md hover:shadow-lg transform active:scale-95"
                      >
                          {t.common_done || (language === 'ar' ? 'تم' : 'Done')}
                      </button>
                  </div>
              </div>
          </div>
      )}
    </div>
  );
};

export default Sidebar;