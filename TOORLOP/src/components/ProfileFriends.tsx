import React, { useState, useEffect, useRef, useMemo } from 'react';
import { createPortal } from 'react-dom';
import { 
  Search, 
  MoreHorizontal, 
  UserMinus, 
  Ban, 
  Flag, 
  Globe, 
  Users, 
  Lock, 
  Check, 
  Info, 
  X, 
  UserPlus, 
  Filter, 
  Briefcase, 
  GraduationCap, 
  MapPin, 
  MessageCircle, 
  ChevronRight, 
  ChevronLeft,
  Loader2,
  AlertTriangle
} from 'lucide-react';
import { User } from '../types';
import { useLanguage } from '../context/LanguageContext';

// Types
interface Friend {
  id: string;
  name: string;
  avatar: string;
  mutualFriends: number;
  category: 'work' | 'university' | 'city' | 'general';
  subtitle?: string; // e.g. "Work", "University"
  online?: boolean;
}

type PrivacyLevel = 'public' | 'friends' | 'friends_of_friends' | 'only_me';
type ActionType = 'unfriend' | 'block' | null;
type TabType = 'all' | 'mutual' | 'work' | 'university' | 'city' | 'suggestions';

interface ProfileFriendsProps {
    onFriendClick?: (user: User) => void;
    onMessageClick?: (user: User) => void;
    initialTab?: TabType;
}

// Mock Data with Categories for Advanced Filtering
const INITIAL_FRIENDS: Friend[] = [
  { id: '1', name: 'محمد أحمد', avatar: 'https://picsum.photos/200/200?random=101', mutualFriends: 12, category: 'work', subtitle: 'زميل عمل', online: true },
  { id: '2', name: 'سارة علي', avatar: 'https://picsum.photos/200/200?random=102', mutualFriends: 45, category: 'general', online: false },
  { id: '3', name: 'يوسف محمود', avatar: 'https://picsum.photos/200/200?random=103', mutualFriends: 3, category: 'city', subtitle: 'يقيم في القاهرة', online: true },
  { id: '4', name: 'منى زكي', avatar: 'https://picsum.photos/200/200?random=104', mutualFriends: 89, category: 'university', subtitle: 'جامعة القاهرة', online: false },
  { id: '5', name: 'كريم عبد العزيز', avatar: 'https://picsum.photos/200/200?random=105', mutualFriends: 150, category: 'general', online: true },
  { id: '6', name: 'أحمد حلمي', avatar: 'https://picsum.photos/200/200?random=106', mutualFriends: 230, category: 'work', subtitle: 'زميل سابق', online: false },
  { id: '7', name: 'نور الشريف', avatar: 'https://picsum.photos/200/200?random=107', mutualFriends: 5, category: 'general', online: false },
  { id: '8', name: 'عمر الشريف', avatar: 'https://picsum.photos/200/200?random=108', mutualFriends: 0, category: 'city', subtitle: 'يقيم في الإسكندرية', online: false },
  { id: '9', name: 'ليلى علوي', avatar: 'https://picsum.photos/200/200?random=109', mutualFriends: 67, category: 'university', subtitle: 'كلية الفنون', online: true },
  { id: '10', name: 'هند صبري', avatar: 'https://picsum.photos/200/200?random=110', mutualFriends: 34, category: 'general', online: true },
  { id: '11', name: 'خالد النبوي', avatar: 'https://picsum.photos/200/200?random=111', mutualFriends: 12, category: 'work', subtitle: 'زميل عمل', online: false },
  { id: '12', name: 'عمرو دياب', avatar: 'https://picsum.photos/200/200?random=112', mutualFriends: 999, category: 'general', online: true },
];

const SUGGESTED_PEOPLE: Friend[] = [
    { id: 's1', name: 'ياسمين صبري', avatar: 'https://picsum.photos/200/200?random=201', mutualFriends: 20, category: 'general', subtitle: 'صديق مشترك مع محمد أحمد', online: false },
    { id: 's2', name: 'تامر حسني', avatar: 'https://picsum.photos/200/200?random=202', mutualFriends: 55, category: 'general', subtitle: 'مغني', online: true },
    { id: 's3', name: 'نانسي عجرم', avatar: 'https://picsum.photos/200/200?random=203', mutualFriends: 10, category: 'general', subtitle: 'فنانة', online: false },
    { id: 's4', name: 'أحمد السقا', avatar: 'https://picsum.photos/200/200?random=204', mutualFriends: 3, category: 'general', subtitle: 'ممثل', online: true },
    { id: 's5', name: 'منة شلبي', avatar: 'https://picsum.photos/200/200?random=205', mutualFriends: 8, category: 'general', subtitle: 'ممثلة', online: false },
];

const ProfileFriends: React.FC<ProfileFriendsProps> = ({ onFriendClick, onMessageClick, initialTab = 'all' }) => {
  const { t, dir, language } = useLanguage();
  
  // Initialize friends from Local Storage or default to initial list
  const [friends, setFriends] = useState<Friend[]>(() => {
      try {
          const saved = localStorage.getItem('pf_friends');
          const parsed = saved ? JSON.parse(saved) : null;
          return Array.isArray(parsed) ? parsed : INITIAL_FRIENDS;
      } catch (e) {
          return INITIAL_FRIENDS;
      }
  });

  const [searchTerm, setSearchTerm] = useState('');
  const [privacyLevel, setPrivacyLevel] = useState<PrivacyLevel>('public');
  const [showPrivacyMenu, setShowPrivacyMenu] = useState(false);
  const [activeMenuId, setActiveMenuId] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<TabType>(initialTab);
  const [notification, setNotification] = useState<{message: string, type: 'success' | 'info'} | null>(null);

  const menuRef = useRef<HTMLDivElement>(null);
  const privacyRef = useRef<HTMLDivElement>(null);

  // Modal State
  const [modalConfig, setModalConfig] = useState<{ isOpen: boolean; type: ActionType; friend: Friend | null }>(
      { isOpen: false, type: null, friend: null }
  );

  // Report Modal State
  const [reportConfig, setReportConfig] = useState<{ isOpen: boolean; friend: Friend | null }>({ isOpen: false, friend: null });
  const [reportReason, setReportReason] = useState('');
  const [isReportSubmitting, setIsReportSubmitting] = useState(false);

  // Persist friends list changes to Local Storage
  useEffect(() => {
      localStorage.setItem('pf_friends', JSON.stringify(friends));
  }, [friends]);

  // Update activeTab if initialTab prop changes
  useEffect(() => {
      setActiveTab(initialTab);
  }, [initialTab]);

  // --- Filtering Logic ---
  const filteredFriends = useMemo(() => {
      const sourceList = activeTab === 'suggestions' ? SUGGESTED_PEOPLE : (friends || []);
      return sourceList.filter(f => {
          const matchesSearch = f.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                              (f.subtitle && f.subtitle.toLowerCase().includes(searchTerm.toLowerCase()));
          
          if (!matchesSearch) return false;

          switch (activeTab) {
              case 'work': return f.category === 'work';
              case 'university': return f.category === 'university';
              case 'city': return f.category === 'city';
              case 'mutual': return f.mutualFriends > 0;
              case 'suggestions': return true;
              case 'all': default: return true;
          }
      });
  }, [friends, searchTerm, activeTab]);

  // --- Effects ---
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (privacyRef.current && !privacyRef.current.contains(event.target as Node)) {
        setShowPrivacyMenu(false);
      } 
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setActiveMenuId(null);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // --- Helpers ---
  const showNotification = (message: string, type: 'success' | 'info' = 'success') => {
      setNotification({ message, type });
      setTimeout(() => setNotification(null), 4000);
  };

  const handleMenuAction = (action: 'unfriend' | 'block' | 'report', friend: Friend) => {
    setActiveMenuId(null);
    if (action === 'report') {
        setReportConfig({ isOpen: true, friend });
    } else {
        setModalConfig({ isOpen: true, type: action, friend: friend });
    }
  };

  const handleSubmitReport = () => {
    if (!reportReason) return;
    setIsReportSubmitting(true);
    setTimeout(() => {
        setIsReportSubmitting(false);
        showNotification(language === 'ar' ? 'تم إرسال البلاغ بنجاح' : 'Report sent successfully', 'success');
        setReportConfig({ isOpen: false, friend: null });
        setReportReason('');
    }, 1500);
  };

  const confirmModalAction = () => {
      const { type, friend } = modalConfig;
      if (!friend || !type) return;

      if (type === 'unfriend') {
          setFriends(prev => prev.filter(f => f.id !== friend.id));
          showNotification(`${t.common_success} ${friend.name}.`, 'info');
      } else if (type === 'block') {
          setFriends(prev => prev.filter(f => f.id !== friend.id));
          showNotification(`${t.profile_block} ${friend.name} ${t.common_success}.`, 'success');
      }
      closeModal();
  };

  const handleAddFriend = (friend: Friend) => {
      // In a real app, this would send a request. Here we simulate success.
      showNotification(`${t.profile_request_sent} ${friend.name}`, 'success');
  };

  const closeModal = () => {
      setModalConfig({ isOpen: false, type: null, friend: null });
  };

  const getPrivacyIcon = (level: PrivacyLevel) => {
    switch (level) {
      case 'public': return <Globe className="w-4 h-4" />;
      case 'friends': return <Users className="w-4 h-4" />;
      case 'friends_of_friends': return <UserPlus className="w-4 h-4" />;
      case 'only_me': return <Lock className="w-4 h-4" />;
    }
  };

  const getPrivacyLabel = (level: PrivacyLevel) => {
    switch (level) {
      case 'public': return t.privacy_public;
      case 'friends': return t.privacy_friends;
      case 'friends_of_friends': return t.privacy_friends_except;
      case 'only_me': return t.privacy_only_me;
    }
  };

  const handleCardClick = (friend: Friend) => {
      if (onFriendClick) {
          const userObj: User = {
              id: friend.id,
              name: friend.name,
              avatar: friend.avatar,
              online: friend.online
          };
          onFriendClick(userObj);
      }
  };

  // --- Render Helpers ---
  const renderTabs = () => (
      <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pb-2 mb-4">
          {[ 
             { id: 'all', label: t.profile_friends_tab_all, icon: null },
             { id: 'suggestions', label: t.profile_friends_tab_suggestions, icon: <UserPlus className="w-4 h-4 text-red-600 dark:text-red-500" /> },
             { id: 'mutual', label: t.profile_friends_tab_mutual, icon: <Users className="w-4 h-4 text-red-600 dark:text-red-500" /> },
             { id: 'work', label: t.profile_friends_tab_work, icon: <Briefcase className="w-4 h-4 text-red-600 dark:text-red-500" /> },
             { id: 'university', label: t.profile_friends_tab_university, icon: <GraduationCap className="w-4 h-4 text-red-600 dark:text-red-500" /> },
             { id: 'city', label: t.profile_friends_tab_city, icon: <MapPin className="w-4 h-4 text-red-600 dark:text-red-500" /> }
          ].map((tab) => (
              <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as TabType)}
                  className={`px-4 py-2 rounded-full text-sm font-semibold whitespace-nowrap transition flex items-center gap-2 ${activeTab === tab.id 
                      ? 'bg-emerald-600 text-white hover:bg-blue-600' 
                      : 'bg-white/20 dark:bg-gray-700/30 text-black dark:text-emerald-400 shadow-md border border-emerald-400 dark:border-emerald-400 hover:bg-white/40 dark:hover:bg-gray-700/50'}`}
              >
                  {tab.icon}
                  <span>{tab.label}</span>
              </button>
          ))}
      </div>
  );

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm min-h-[500px] animate-fadeIn p-4 md:p-6 relative transition-colors duration-300">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
        <div>
           <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-1 flex items-center gap-2">
               {activeTab === 'suggestions' ? t.profile_friends_people_you_may_know : activeTab === 'city' ? t.profile_friends_tab_city : t.profile_friends}
               <span className="text-sm font-normal text-gray-500 dark:text-gray-400 bg-gray-100 dark:bg-gray-700 px-2 py-0.5 rounded-full">
                   {filteredFriends.length}
               </span>
           </h2>
           <p className="text-gray-500 dark:text-gray-400 text-sm">
               {activeTab === 'suggestions' ? t.profile_friends_people_you_may_know : activeTab === 'city' ? t.profile_friends_tab_city : t.profile_friends_privacy_desc}
           </p>
        </div>

        <div className="flex flex-col sm:flex-row items-center gap-3 w-full md:w-auto">
           {/* Search */}
           <div className="relative flex-1 sm:w-60 w-full group">
              <Search className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500 dark:text-gray-400 group-focus-within:text-fb-blue transition-colors" />
              <input 
                type="text" 
                placeholder={t.profile_friends_search_placeholder}
                className="w-full bg-gray-100 dark:bg-gray-700 focus:bg-white dark:focus:bg-gray-900 border border-transparent focus:border-fb-blue dark:focus:border-fb-blue rounded-full py-2 pr-10 pl-4 text-sm transition outline-none text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
           </div>

           {/* Privacy Toggle (Hide on suggestions tab as it's public browsing mostly) */}
           {activeTab !== 'suggestions' && (
               <div className="relative w-full sm:w-auto" ref={privacyRef}>
                  <button 
                    onClick={() => setShowPrivacyMenu(!showPrivacyMenu)}
                    className="w-full sm:w-auto flex items-center justify-center gap-2 bg-emerald-700 text-white hover:bg-blue-700 px-4 py-2 rounded-md font-medium text-sm transition shadow-sm"
                  >
                      {getPrivacyIcon(privacyLevel)}
                      <span>{t.common_edit}</span>
                  </button>

                  {showPrivacyMenu && (
                     <div className={`absolute left-0 top-full mt-2 w-72 bg-white dark:bg-gray-800 rounded-lg shadow-xl border border-gray-100 dark:border-gray-700 z-50 overflow-hidden animate-fadeIn origin-top-left`}>
                         <div className="p-3 border-b border-gray-100 dark:border-gray-700">
                             <h4 className="font-bold text-sm text-gray-900 dark:text-white">{t.profile_friends_privacy_title}</h4>
                             <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">{t.profile_friends_privacy_desc}</p>
                         </div>
                         <div className="p-1">
                            {(['public', 'friends', 'friends_of_friends', 'only_me'] as PrivacyLevel[]).map((level) => (
                               <button
                                 key={level}
                                 onClick={() => { setPrivacyLevel(level); setShowPrivacyMenu(false); }}
                                 className={`w-full flex items-center justify-between p-2.5 rounded-md transition text-right group ${privacyLevel === level ? 'bg-blue-50 dark:bg-blue-900/30' : 'hover:bg-gray-100 dark:hover:bg-gray-700'}`}
                               >
                                  <div className="flex items-center gap-3">
                                     <div className={`p-2 rounded-full transition ${privacyLevel === level ? 'bg-white dark:bg-gray-800 text-fb-blue' : 'bg-gray-100 dark:bg-gray-600 text-gray-600 dark:text-gray-300'}`}>
                                         {getPrivacyIcon(level)}
                                     </div>
                                     <div className="flex flex-col">
                                         <span className="text-sm font-semibold text-gray-900 dark:text-white">{getPrivacyLabel(level)}</span>
                                     </div>
                                  </div>
                                  {privacyLevel === level && <Check className="w-5 h-5 text-emerald-700 hover:text-blue-700 dark:text-emerald-400 dark:hover:text-blue-600" />}
                               </button>
                            ))}
                         </div>
                     </div>
                  )}
               </div>
           )}
        </div>
      </div>

      {/* Tabs */}
      {renderTabs()}

      {/* Friends Grid */}
      {filteredFriends.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pb-10">
            {filteredFriends.map((friend) => (
                <div 
                  key={friend.id} 
                  onClick={() => handleCardClick(friend)}
                  className={`border rounded-xl p-3 flex items-center gap-4 relative group transition cursor-pointer ${
                      activeMenuId === friend.id 
                        ? 'z-20 border-gray-300 dark:border-gray-500 shadow-md bg-gray-50 dark:bg-gray-700' 
                        : 'z-0 border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 hover:shadow-md hover:border-blue-200 dark:hover:border-gray-600'
                  }`}
                >
                    <div className="relative">
                        <img src={friend.avatar} alt={friend.name} className="w-20 h-20 rounded-lg object-cover border border-gray-100 dark:border-gray-600" />
                        {friend.online && <div className="absolute bottom-0 right-0 w-3.5 h-3.5 bg-green-500 border-2 border-white dark:border-gray-800 rounded-full shadow-sm"></div>}
                    </div>
                    
                    <div className="flex-1 min-w-0">
                        <h3 className="font-bold text-base text-gray-900 dark:text-white leading-tight mb-1 hover:text-fb-blue truncate">
                            {friend.name}
                        </h3>
                        
                        {friend.subtitle && (
                            <div className="text-xs text-gray-500 dark:text-gray-400 mb-1 flex items-center gap-1">
                                {friend.category === 'city' ? <MapPin className="w-3 h-3" /> : friend.category === 'work' ? <Briefcase className="w-3 h-3" /> : <Info className="w-3 h-3" />}
                                {friend.subtitle}
                            </div>
                        )}
                        
                        <p className="text-xs text-gray-500 dark:text-gray-400 font-medium">
                            {friend.mutualFriends > 0 ? `${friend.mutualFriends} ${t.profile_mutual_friends}` : t.profile_friends_no_suggestions}
                        </p>
                    </div>

                    {/* Actions Area */}
                    <div className="flex flex-col gap-2 items-end" onClick={(e) => e.stopPropagation()}>
                        {/* Different Actions based on Tab */}
                        {activeTab === 'suggestions' ? (
                            <button 
                                onClick={(e) => { e.stopPropagation(); handleAddFriend(friend); }}
                                className="p-2 bg-blue-100 dark:bg-blue-900/20 text-emerald-700 hover:text-blue-700 dark:text-emerald-400 dark:hover:text-blue-600 rounded-full transition shadow-sm active:scale-95"
                                title={t.profile_add_friend}
                            >
                                <UserPlus className="w-4 h-4" />
                            </button>
                        ) : (
                            <button 
                                onClick={(e) => {
                                    e.stopPropagation();
                                    if (onMessageClick) {
                                        onMessageClick({
                                            id: friend.id,
                                            name: friend.name,
                                            avatar: friend.avatar,
                                            online: friend.online
                                        });
                                    }
                                }}
                                className="p-2 bg-emerald-600 dark:bg-emerald-500 hover:bg-blue-700 dark:hover:bg-blue-600 text-white dark:text-white rounded-full transition shadow-sm active:scale-95"
                                title={t.profile_message}
                            >
                                <MessageCircle className="w-4 h-4" />
                            </button>
                        )}

                        {/* 3 Dots Menu Button (Only for existing friends) */}
                        {activeTab !== 'suggestions' && (
                            <div className="relative" ref={activeMenuId === friend.id ? menuRef : null}>
                                <button 
                                  onClick={() => setActiveMenuId(activeMenuId === friend.id ? null : friend.id)}
                                  className={`p-2 rounded-full transition shadow-sm ${activeMenuId === friend.id ? 'bg-blue-100 dark:bg-blue-900/30 text-emerald-700 hover:text-blue-700 dark:text-emerald-400 dark:hover:text-blue-600' : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'}`}
                                >
                                    <MoreHorizontal className="w-4 h-4" />
                                </button>

                                {/* Popup Menu */}
                                {activeMenuId === friend.id && (
                                    <div className={`absolute top-full mt-1 w-64 bg-white dark:bg-gray-800 rounded-xl shadow-xl border border-gray-100 dark:border-gray-700 z-50 overflow-hidden animate-fadeIn ${dir === 'rtl' ? 'left-0 origin-top-left' : 'right-0 origin-top-right'}`}>
                                        
                                        {/* Header Section */}
                                        <div 
                                            className="p-3 border-b border-gray-100 dark:border-gray-700 bg-gray-50 dark:bg-gray-700/50 cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-400 transition group"
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                handleCardClick(friend);
                                                setActiveMenuId(null);
                                            }}
                                        >
                                            <div className="flex items-center gap-3">
                                                <img src={friend.avatar} className="w-10 h-10 rounded-full object-cover border border-gray-200 dark:border-gray-600" alt="mini" />
                                                <div className="flex flex-col">
                                                    <span className="font-bold text-sm text-gray-900 dark:text-white leading-tight group-hover:text-emerald-700 transition">{friend.name}</span>
                                                    <span className="text-[11px] text-gray-500 dark:text-gray-400 flex items-center gap-1 group-hover:text-red-500 transition">
                                                        {t.profile_friends_visit_profile} {dir === 'rtl' ? <ChevronLeft className="w-3 h-3" /> : <ChevronRight className="w-3 h-3" />}
                                                    </span>
                                                </div>
                                            </div>
                                        </div>
                                        
                                        {/* Menu Items */}
                                        <div className="p-1">
                                            <button 
                                                onClick={() => handleMenuAction('unfriend', friend)}
                                                className="w-full flex items-center gap-3 px-3 py-2.5 hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-200 transition text-sm font-medium rounded-lg group"
                                            >
                                                <div className="w-8 h-8 rounded-full bg-orange-100 dark:bg-orange-900/20 flex items-center justify-center text-orange-500 group-hover:bg-orange-100 dark:group-hover:bg-orange-900/40 transition">
                                                    <UserMinus className="w-4 h-4" />
                                                </div>
                                                {t.profile_unfriend}
                                            </button>
                                            
                                            <button 
                                                onClick={() => handleMenuAction('block', friend)}
                                                className="w-full flex items-center gap-3 px-3 py-2.5 hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-200 transition text-sm font-medium rounded-lg group"
                                            >
                                                <div className="w-8 h-8 rounded-full bg-red-100 dark:bg-red-900/20 flex items-center justify-center text-red-500 group-hover:bg-red-100 dark:group-hover:bg-red-900/40 transition">
                                                    <Ban className="w-4 h-4" />
                                                </div>
                                                {t.profile_block}
                                            </button>
                                            
                                            <button 
                                                onClick={() => handleMenuAction('report', friend)}
                                                className="w-full flex items-center gap-3 px-3 py-2.5 hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-200 transition text-sm font-medium rounded-lg group"
                                            >
                                                <div className="w-8 h-8 rounded-full bg-blue-100 dark:bg-blue-900/20 flex items-center justify-center text-blue-500 group-hover:bg-blue-100 dark:group-hover:bg-blue-900/40 transition">
                                                    <Flag className="w-4 h-4" />
                                                </div>
                                                {t.common_report}
                                            </button>
                                        </div>
                                    </div>
                                )}
                            </div>
                        )}
                    </div>
                </div>
            ))}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center py-20 text-center">
            <div className="bg-gray-100 dark:bg-gray-700 p-4 rounded-full mb-4">
                <Filter className="w-10 h-10 text-gray-400 dark:text-gray-500" />
            </div>
            <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-1">{t.profile_friends_no_results}</h3>
            <p className="text-gray-500 dark:text-gray-400 max-w-xs mx-auto">
                {activeTab === 'suggestions' ? t.profile_friends_no_suggestions : t.common_no_results}
            </p>
            <button 
                onClick={() => { setSearchTerm(''); setActiveTab('all'); }}
                className="mt-4 text-emerald-700 hover:text-blue-700 dark:text-emerald-400 dark:hover:text-blue-600 hover:underline font-medium text-sm"
            >
                {t.common_reset}
            </button>
        </div>
      )}

      {/* Confirmation Modal - PORTALED to Body */}
      {modalConfig.isOpen && modalConfig.friend && typeof document !== 'undefined' && createPortal(
          <div className="fixed inset-0 bg-black/60 z-[10000] flex items-center justify-center p-4 animate-fadeIn backdrop-blur-sm" onClick={closeModal}>
              <div 
                  className="bg-white dark:bg-gray-800 rounded-xl shadow-2xl w-full max-w-sm overflow-hidden animate-scaleIn"
                  onClick={(e) => e.stopPropagation()}
              >
                  <div className="p-4 border-b border-gray-100 dark:border-gray-700 flex justify-between items-center bg-gray-50 dark:bg-gray-700/50">
                      <h3 className="font-bold text-lg text-gray-900 dark:text-white flex items-center gap-2">
                          {modalConfig.type === 'unfriend' ? <UserMinus className="w-5 h-5 text-orange-500" /> : <Ban className="w-5 h-5 text-red-500" />}
                          {modalConfig.type === 'unfriend' ? t.profile_unfriend : t.profile_block}
                      </h3>
                      <button onClick={closeModal} className="text-gray-400 hover:text-gray-600 dark:hover:text-white p-1 rounded-full hover:bg-gray-200 dark:hover:bg-gray-600 transition">
                          <X className="w-5 h-5" />
                      </button>
                  </div>
                  
                  <div className="p-6 text-center">
                      {modalConfig.type === 'unfriend' ? (
                          <>
                              <div className="relative w-20 h-20 mx-auto mb-4">
                                  <img src={modalConfig.friend.avatar} alt="Avatar" className="w-full h-full rounded-full border-4 border-white dark:border-gray-700 shadow-md object-cover" />
                                  <div className="absolute bottom-0 right-0 bg-orange-100 p-1.5 rounded-full border-2 border-white dark:border-gray-700">
                                      <UserMinus className="w-4 h-4 text-orange-500" />
                                  </div>
                              </div>
                              <p className="text-gray-700 dark:text-gray-300 mb-2 font-medium text-lg">
                                  {t.profile_friends_unfriend_confirm} <span className="font-bold text-gray-900 dark:text-white">{modalConfig.friend.name}</span>؟
                              </p>
                              <p className="text-xs text-gray-500 dark:text-gray-400 bg-gray-50 dark:bg-gray-700/50 p-3 rounded-lg">
                                  <Info className="w-3 h-3 inline me-1" />
                                  {t.profile_friends_privacy_desc}
                              </p>
                          </>
                      ) : (
                          <>
                              <div className="w-20 h-20 bg-red-50 dark:bg-red-900/20 rounded-full flex items-center justify-center mx-auto mb-4 border-4 border-white dark:border-gray-700 shadow-sm">
                                  <Ban className="w-10 h-10 text-red-500" />
                              </div>
                              <p className="text-gray-700 dark:text-gray-300 mb-3 font-medium text-lg">
                                  {t.profile_friends_block_confirm} <span className="font-bold text-gray-900 dark:text-white">{modalConfig.friend.name}</span>؟
                              </p>
                              <div className="text-xs text-gray-500 dark:text-gray-400 text-right bg-red-50 dark:bg-red-900/10 p-4 rounded-lg border border-red-100 dark:border-red-900/20">
                                  <ul className="list-disc pr-4 space-y-1.5">
                                      <li>لن يتمكن من رؤية منشوراتك أو التعليق عليها.</li>
                                      <li>لن يتمكن من إرسال رسائل لك أو البحث عنك.</li>
                                      <li>سيتم إلغاء الصداقة تلقائياً.</li>
                                  </ul>
                              </div>
                          </>
                      )}
                  </div>

                  <div className="p-4 bg-gray-50 dark:bg-gray-700/50 flex justify-end gap-3 border-t border-gray-100 dark:border-gray-700">
                      <button 
                          onClick={closeModal}
                          className="px-5 py-2.5 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg text-sm font-semibold text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-600 transition shadow-sm"
                      >
                          {t.common_cancel}
                      </button>
                      <button 
                          onClick={confirmModalAction}
                          className={`px-5 py-2.5 rounded-lg text-sm font-semibold text-white transition shadow-sm flex items-center gap-2 ${
                              modalConfig.type === 'unfriend' ? 'bg-orange-500 hover:bg-orange-600' : 'bg-red-600 hover:bg-red-700'
                          }`}
                      >
                          {t.common_confirm}
                      </button>
                  </div>
              </div>
          </div>,
          document.body
      )}

      {/* Report Modal - PORTALED to Body */}
      {reportConfig.isOpen && typeof document !== 'undefined' && createPortal(
        <div className="fixed inset-0 z-[10000] bg-black/60 flex items-center justify-center p-4 animate-fadeIn backdrop-blur-sm" onClick={() => setReportConfig({ isOpen: false, friend: null })}>
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl w-full max-w-sm overflow-hidden animate-scaleIn border border-white/20 dark:border-gray-700" onClick={e => e.stopPropagation()}>
                {/* Header */}
                <div className="p-4 border-b border-gray-100 dark:border-gray-700 flex justify-between items-center bg-gray-50 dark:bg-gray-700/50">
                    <h3 className="font-bold text-lg text-gray-900 dark:text-white flex items-center gap-2">
                         <Flag className="w-5 h-5 text-blue-500" />
                        {t.common_report || (language === 'ar' ? 'إبلاغ' : 'Report')}
                    </h3>
                    <button onClick={() => setReportConfig({ isOpen: false, friend: null })} className="text-gray-500 hover:bg-gray-200 dark:hover:bg-gray-600 rounded-full p-1 transition">
                        <X className="w-5 h-5" />
                    </button>
                </div>
                {/* Body */}
                <div className="p-6 space-y-3">
                    <p className="text-sm text-gray-600 dark:text-gray-300 mb-2">
                        {language === 'ar' ? 'يرجى تحديد سبب الإبلاغ:' : 'Please select a reason for reporting:'}
                    </p>
                    {[
                    { id: 'inappropriate', label: language === 'ar' ? 'محتوى غير لائق' : 'Inappropriate content' },
                    { id: 'fake', label: language === 'ar' ? 'حساب زائف' : 'Fake account' },
                    { id: 'harassment', label: language === 'ar' ? 'مضايقة أو تنمر' : 'Harassment or bullying' },
                    { id: 'hate', label: language === 'ar' ? 'خطاب كراهية' : 'Hate speech' },
                    { id: 'spam', label: language === 'ar' ? 'سبام أو احتيال' : 'Spam or fraud' }
                    ].map((option) => (
                        <label key={option.id} className="flex items-center justify-between p-3 border border-gray-200 dark:border-gray-700 rounded-lg cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700 transition">
                            <span className="text-gray-700 dark:text-gray-200 text-sm font-medium">{option.label}</span>
                            <input 
                                type="radio" 
                                name="reportReason" 
                                value={option.label} 
                                checked={reportReason === option.label}
                                onChange={(e) => setReportReason(e.target.value)}
                                className="text-fb-blue focus:ring-fb-blue h-4 w-4"
                            />
                        </label>
                    ))}
                </div>
                {/* Footer */}
                <div className="p-4 border-t border-gray-100 dark:border-gray-700 bg-gray-50 dark:bg-gray-700/50 flex justify-end gap-2">
                    <button onClick={() => setReportConfig({ isOpen: false, friend: null })} className="px-6 py-2.5 text-gray-600 dark:text-gray-300 font-bold hover:bg-gray-100 dark:hover:bg-gray-700 rounded-xl transition text-sm">
                        {t.common_cancel}
                    </button>
                    <button 
                        onClick={handleSubmitReport} 
                        disabled={!reportReason || isReportSubmitting}
                        className="px-8 py-2.5 bg-blue-500 text-white font-bold rounded-xl transition shadow-lg disabled:opacity-50 flex items-center gap-2 text-sm hover:bg-blue-600"
                    >
                        {isReportSubmitting && <Loader2 className="w-4 h-4 animate-spin" />}
                        {t.common_send || (language === 'ar' ? 'إرسال' : 'Send')}
                    </button>
                </div>
            </div>
        </div>,
        document.body
      )}

      {/* Notification Toast */}
      {notification && (
        <div className="fixed bottom-6 right-6 md:right-10 z-[1100] animate-bounce-in">
            <div className={`flex items-center gap-3 px-5 py-3.5 rounded-xl shadow-lg text-white backdrop-blur-md border border-white/10 ${notification.type === 'success' ? 'bg-gray-900/90' : 'bg-blue-900/90'}`}>
                {notification.type === 'success' ? <Check className="w-5 h-5 text-green-400" /> : <Info className="w-5 h-5 text-blue-400" />}
                <span className="font-medium text-sm">{notification.message}</span>
                <button onClick={() => setNotification(null)} className="mr-2 text-white/60 hover:text-white transition">
                    <X className="w-4 h-4" />
                </button>
            </div>
        </div>
      )}
    </div>
  );
};

export default ProfileFriends;