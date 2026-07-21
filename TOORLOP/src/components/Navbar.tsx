import React, { useState, useRef, useEffect } from 'react';
import { 
  Search, Home, Users, MonitorPlay, Store, Bell, MessageCircle, 
  UserCircle, Infinity, Gamepad2, Settings, LogOut, Moon, Sun, 
  Globe, ChevronRight, ChevronLeft, Check, Menu, X, ShoppingBag, 
  Gamepad, TrendingUp, History, Trash2, Plus, CheckCircle, Mail,
  MoreHorizontal, Loader2, Edit3, UserPlus, MapPin, UserCheck,
  Bookmark, LayoutGrid, Calendar, Flag
} from 'lucide-react';
import { View, User } from '../types';
import { useLanguage } from '../context/LanguageContext';
import { useTheme } from '../context/ThemeContext';

interface NavbarProps {
  currentView: View;
  setView: (view: View) => void;
  onProfileClick: () => void; // Added to fix the profile navigation bug
  currentUser?: User;
  onOpenChat?: (user: User) => void;
  onLogout: () => void;
}

// Initial Mock Data moved to state for interactivity
const INITIAL_RECENT_SEARCHES = ['تطوير ويب', 'تصميم جرافيك', 'وظائف برمجة', 'أخبار التقنية', 'React JS', 'Tailwind CSS'];

const INITIAL_NOTIFICATIONS = [
  { id: 1, text: 'قام محمد بالتعليق على منشورك: "رائع جداً يا صديقي!"', time: 'منذ 5 دقائق', read: false, type: 'comment' },
  { id: 2, text: 'لديك طلب صداقة جديد من سارة أحمد', time: 'منذ 1 ساعة', read: false, type: 'friend_request' },
  { id: 3, text: 'تم قبول انضمامك لمجموعة "عشاق البرمجة"', time: 'منذ 3 ساعات', read: true, type: 'group' },
  { id: 4, text: 'ذكرك كريم في تعليق: "@أحمد انظر لهذا"', time: 'منذ 5 ساعات', read: true, type: 'mention' },
];

const PREVIOUS_NOTIFICATIONS = [
    { id: 5, text: 'قام خالد بالإعجاب بصورتك', time: 'منذ يوم', read: true, type: 'like' },
    { id: 6, text: 'عيد ميلاد سعيد لـ منى زكي!', time: 'منذ يومين', read: true, type: 'birthday' },
    { id: 7, text: 'تم نشر تحديث جديد في المجموعة', time: 'منذ 3 أيام', read: true, type: 'group' },
];

const INITIAL_MESSAGES = [
  { id: 1, sender: 'كريم محمود', text: 'هل أنت متفرغ اليوم للعمل على المشروع؟', time: '10:30 ص', unread: true, avatar: 'https://picsum.photos/40/40?random=101' },
  { id: 2, sender: 'منى زكي', text: 'شكراً لك على المساعدة، الكود يعمل الآن!', time: 'أمس', unread: false, avatar: 'https://picsum.photos/40/40?random=102' },
  { id: 3, sender: 'خالد عمر', text: 'أرسلت لك الملفات عبر الإيميل.', time: 'منذ يومين', unread: false, avatar: 'https://picsum.photos/40/40?random=103' },
];

const PREVIOUS_MESSAGES = [
    { id: 4, sender: 'سارة علي', text: 'أين أنت؟', time: 'السبت', unread: false, avatar: 'https://picsum.photos/40/40?random=104' },
    { id: 5, sender: 'يوسف أحمد', text: 'تمام، نلتقي لاحقاً', time: 'الجمعة', unread: false, avatar: 'https://picsum.photos/40/40?random=105' },
];

const INITIAL_FRIEND_REQUESTS = [
    { id: 'fr1', name: 'ياسمين صبري', avatar: 'https://picsum.photos/40/40?random=201', mutual: 12 },
    { id: 'fr2', name: 'عمر الشريف', avatar: 'https://picsum.photos/40/40?random=202', mutual: 5 }
];

const INITIAL_SUGGESTED_FRIENDS = [
    { id: 'sf1', name: 'أحمد حلمي', avatar: 'https://picsum.photos/40/40?random=203', mutual: 30 },
    { id: 'sf2', name: 'عادل إمام', avatar: 'https://picsum.photos/40/40?random=204', mutual: 15 }
];

const Navbar: React.FC<NavbarProps> = ({ currentView, setView, onProfileClick, currentUser, onOpenChat, onLogout }) => {
  const [activeTab, setActiveTab] = useState<View>(currentView);
  const { language, setLanguage, t, dir } = useLanguage();
  const { theme, toggleTheme } = useTheme();
  
  // --- Feature States ---
  // Search
  const [searchText, setSearchText] = useState('');
  const [recentSearches, setRecentSearches] = useState(INITIAL_RECENT_SEARCHES);
  const [showSearchHistory, setShowSearchHistory] = useState(false);
  const [isSearching, setIsSearching] = useState(false);

  // Notifications
  const [notifications, setNotifications] = useState(INITIAL_NOTIFICATIONS);
  const [showNotifications, setShowNotifications] = useState(false);
  const [unreadNotificationsCount, setUnreadNotificationsCount] = useState(2);

  // Messages
  const [messages, setMessages] = useState(INITIAL_MESSAGES);
  const [showMessages, setShowMessages] = useState(false);
  const [unreadMessagesCount, setUnreadMessagesCount] = useState(1);

  // Friends Request Menu
  const [friendRequests, setFriendRequests] = useState(INITIAL_FRIEND_REQUESTS);
  const [suggestedFriends, setSuggestedFriends] = useState(INITIAL_SUGGESTED_FRIENDS);
  const [showFriendsMenu, setShowFriendsMenu] = useState(false);
  const [unreadFriendsCount, setUnreadFriendsCount] = useState(2);

  // Settings & Menu
  const [showSettings, setShowSettings] = useState(false);
  const [settingsView, setSettingsView] = useState<'main' | 'language'>('main');
  const [showMobileMenu, setShowMobileMenu] = useState(false);

  // Refs for click outside handling
  const settingsRef = useRef<HTMLDivElement>(null);
  const notificationsRef = useRef<HTMLDivElement>(null);
  const messagesRef = useRef<HTMLDivElement>(null);
  const searchRef = useRef<HTMLDivElement>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);
  const friendsMenuRef = useRef<HTMLDivElement>(null);

  // Sync local active tab with prop
  useEffect(() => {
    setActiveTab(currentView);
  }, [currentView]);

  // Close dropdowns on click outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Node;
      if (settingsRef.current && !settingsRef.current.contains(target)) {
        setShowSettings(false);
        setSettingsView('main');
      } // Don't close notifications if settings is clicked (though they are separate)
      if (notificationsRef.current && !notificationsRef.current.contains(target)) {
        setShowNotifications(false);
      }
      if (messagesRef.current && !messagesRef.current.contains(target)) {
        setShowMessages(false);
      }
      if (searchRef.current && !searchRef.current.contains(target)) {
        setShowSearchHistory(false);
      }
      if (friendsMenuRef.current && !friendsMenuRef.current.contains(target)) {
          setShowFriendsMenu(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleTabClick = (view: View) => {
    setActiveTab(view);
    setView(view);
    setShowMobileMenu(false);
  };

  // --- Search Handlers ---
  const handleSearchFocus = () => {
    setShowSearchHistory(true);
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchText(e.target.value);
    if (!showSearchHistory) setShowSearchHistory(true);
  };

  const handleClearSearch = () => {
    setSearchText('');
    searchInputRef.current?.focus();
  };

  const handleSearchSubmit = (e?: React.KeyboardEvent) => {
    if (e && e.key !== 'Enter') return;
    if (!searchText.trim()) return;

    setIsSearching(true);
    // Simulate API search delay
    setTimeout(() => {
        setIsSearching(false);
        setShowSearchHistory(false);
        // Add to history if unique
        if (!recentSearches.includes(searchText)) {
            setRecentSearches(prev => [searchText, ...prev].slice(0, 8));
        }
        // Navigate to a search results view (mock)
        console.log(`Searching for: ${searchText}`);
    }, 800);
  };

  const handleHistoryClick = (term: string) => {
      setSearchText(term);
      // Trigger search logic
      setIsSearching(true);
      setTimeout(() => {
          setIsSearching(false);
          setShowSearchHistory(false);
      }, 500);
  };

  const handleRemoveHistoryItem = (term: string, e: React.MouseEvent) => {
      e.stopPropagation();
      setRecentSearches(prev => prev.filter(item => item !== term));
  };

  const handleClearAllHistory = () => {
      setRecentSearches([]);
  };

  // --- Notification Handlers ---
  const handleToggleNotifications = () => {
      setShowNotifications(!showNotifications);
      if (!showNotifications) {
          setUnreadNotificationsCount(0); // Clear badge on open
      }
  };

  const handleMarkAllRead = () => {
      setNotifications(prev => prev.map(n => ({ ...n, read: true })));
  };

  const handleViewAllNotifications = () => {
      // Simulate loading previous notifications
      setNotifications(prev => {
          const newIds = new Set(prev.map(n => n.id));
          const toAdd = PREVIOUS_NOTIFICATIONS.filter(n => !newIds.has(n.id));
          return [...prev, ...toAdd];
      });
  };

  const handleNotificationClick = (id: number) => {
      setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n));
      // Logic to navigate to post/profile would go here
  };

  const handleRemoveNotification = (id: number, e: React.MouseEvent) => {
      e.stopPropagation();
      setNotifications(prev => prev.filter(n => n.id !== id));
  };

  // --- Message Handlers ---
  const handleToggleMessages = () => {
      setShowMessages(!showMessages);
      if (!showMessages) {
          setUnreadMessagesCount(0); // Clear badge on open
      }
  };

  const handleMarkAllMessagesRead = () => {
      setMessages(prev => prev.map(m => ({ ...m, unread: false })));
  };

  const handleMessageClick = (msg: typeof INITIAL_MESSAGES[0]) => {
      setMessages(prev => prev.map(m => m.id === msg.id ? { ...m, unread: false } : m));
      // Open Chat Window
      if (onOpenChat) {
          onOpenChat({
              id: `user_${msg.id}`, // Mock user ID mapping
              name: msg.sender,
              avatar: msg.avatar,
              online: true
          });
      }
      setShowMessages(false);
  };

  const handleViewAllMessages = () => {
      // Simulate loading previous messages
      setMessages(prev => {
          const newIds = new Set(prev.map(n => n.id));
          const toAdd = PREVIOUS_MESSAGES.filter(n => !newIds.has(n.id));
          return [...prev, ...toAdd];
      });
  };

  const handleNewMessage = () => {
      // Logic for new message modal
      console.log("Open New Message Modal");
      setShowMessages(false);
  };

  // --- Friends Menu Handlers ---
  const handleToggleFriendsMenu = () => {
      setShowFriendsMenu(!showFriendsMenu);
      if (!showFriendsMenu) {
          setUnreadFriendsCount(0); // Clear badge on open
      }
  };

  const handleAcceptRequest = (id: string) => {
      setFriendRequests(prev => prev.filter(req => req.id !== id));
      // Logic to add to friends list
  };

  const handleDeleteRequest = (id: string) => {
      setFriendRequests(prev => prev.filter(req => req.id !== id));
  };

  const handleAddFriend = (id: string) => {
      setSuggestedFriends(prev => prev.filter(f => f.id !== id));
      // Logic to send request
  };

  // Explicitly casting new view types that might not be in the strict View union yet,
  // allowing the App to handle them (or fallback gracefully) rather than forcing 'home'.
  const allMenuItems = [
    { 
      id: 'friends',
      icon: <Users className="h-8 w-8 text-fb-blue" />, 
      label: t.nav_friends, 
      view: 'friends' as View 
    },
    { 
      id: 'market',
      icon: <Store className="h-8 w-8 text-fb-blue" />, 
      label: t.nav_market, 
      view: 'marketplace' as View 
    },
    { 
      id: 'watch',
      icon: <MonitorPlay className="h-8 w-8 text-fb-blue" />, 
      label: t.nav_watch, 
      view: 'watch' as View 
    },
    { 
      id: 'memories',
      icon: <History className="h-8 w-8 text-fb-blue" />, 
      label: t.nav_memories || 'الذكريات', // Fallback if key missing in translation update
      view: 'memories' as View 
    },
    { 
      id: 'saved',
      icon: <Bookmark className="h-8 w-8 text-fb-blue" />, 
      label: t.nav_saved || 'العناصر المحفوظة', // Fallback
      view: 'saved' as View 
    },
    { 
      id: 'gaming',
      icon: <Gamepad2 className="h-8 w-8 text-fb-blue" />, 
      label: t.nav_gaming, 
      view: 'gaming' as View 
    },
    { 
      id: 'groups',
      icon: <LayoutGrid className="h-8 w-8 text-fb-blue" />, 
      label: t.nav_groups || 'المجموعات', // Fallback
      view: 'groups' as View 
    },
    { 
      id: 'events',
      icon: <Calendar className="h-8 w-8 text-fb-blue" />, 
      label: t.nav_events || 'المناسبات', // Fallback
      view: 'events' as View
    },
    { 
      id: 'pages',
      icon: <Flag className="h-8 w-8 text-fb-blue" />, 
      label: t.nav_pages || 'الصفحات', // Fallback
      view: 'pages' as View 
    }
  ];

  // Theme-aware and color-consistent navigation class
  const navClass = (view: View) => 
    `relative flex-1 flex items-center justify-center h-full px-2 cursor-pointer border-b-4 transition-all duration-200 group ${
      activeTab === view 
        ? 'border-emerald-700 text-emerald-700 dark:text-emerald-500 dark:border-emerald-500' 
        : 'border-transparent text-gray-500 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-800 rounded-lg'
    }`;

  return (
    <div className="sticky top-0 z-50 bg-white dark:bg-gray-900 shadow-md h-16 flex items-center justify-between px-4 transition-colors duration-300 font-sans" dir={dir}>
      
      {/* Left Section: Logo & Search */}
      <div className="flex items-center gap-3">
        {/* Mobile Menu Toggle */}
        <div className="md:hidden">
            <button 
                onClick={() => setShowMobileMenu(!showMobileMenu)} 
                className="p-2 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full transition"
            >
                {showMobileMenu ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
        </div>

        <div className="flex items-center gap-2 cursor-pointer transition transform hover:scale-105" onClick={() => handleTabClick('home')}>
           <div className="bg-gradient-to-br from-emerald-700 to-emerald-900 text-white p-1.5 rounded-lg shadow-sm">
              <Infinity className="h-7 w-7" />
           </div>
           {/* Darkened Logo Text as requested */}
           <span className="text-2xl font-extrabold text-emerald-700 dark:text-emerald-500 tracking-tight hidden lg:block" style={{ fontFamily: 'Cairo, sans-serif' }}>Tourloop</span>
        </div>
        
        <div className="relative hidden md:block" ref={searchRef}>
            <div className={`flex items-center bg-gray-100 dark:bg-gray-800 rounded-full px-4 py-2.5 w-64 lg:w-72 transition-all duration-300 focus-within:w-80 focus-within:shadow-md focus-within:ring-2 focus-within:ring-emerald-500/20 ${isSearching ? 'opacity-70' : ''}`}>
                {isSearching ? (
                    <Loader2 className="h-5 w-5 text-emerald-600 animate-spin flex-shrink-0" />
                ) : (
                    <Search className="h-5 w-5 text-gray-500 dark:text-gray-400 flex-shrink-0" />
                )}
                
                <input 
                    ref={searchInputRef}
                    type="text" 
                    placeholder={t.search_placeholder} 
                    className={`bg-transparent border-none outline-none text-sm w-full placeholder-gray-500 dark:placeholder-gray-400 text-gray-900 dark:text-white ${dir === 'rtl' ? 'pr-3' : 'pl-3'}`}
                    value={searchText}
                    onChange={handleSearchChange}
                    onFocus={handleSearchFocus}
                    onKeyDown={handleSearchSubmit}
                />
                
                {searchText && (
                    <button 
                        onClick={handleClearSearch}
                        className="bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 rounded-full p-0.5 text-gray-600 dark:text-gray-300 transition"
                    >
                        <X className="h-4 w-4" />
                    </button>
                )}
            </div>

            {/* Advanced Search Dropdown */}
            {showSearchHistory && (
                <div className="absolute top-full mt-2 w-80 bg-white dark:bg-gray-800 rounded-lg shadow-xl border border-gray-100 dark:border-gray-700 overflow-hidden animate-fadeIn z-50">
                    <div className="p-3 border-b border-gray-100 dark:border-gray-700 flex justify-between items-center bg-gray-50 dark:bg-gray-800/50">
                        <span className="text-xs font-bold text-gray-500 uppercase">
                            {recentSearches.length > 0 ? 'عمليات البحث الأخيرة' : 'لا توجد عمليات بحث حديثة'}
                        </span>
                        {recentSearches.length > 0 && (
                            <button 
                                onClick={handleClearAllHistory}
                                className="text-xs text-blue-500 hover:underline font-medium"
                            >
                                تعديل
                            </button>
                        )}
                    </div>
                    <ul>
                        {recentSearches.map((term, index) => (
                            <li 
                                key={index} 
                                onClick={() => handleHistoryClick(term)}
                                className="flex items-center justify-between p-3 hover:bg-gray-50 dark:hover:bg-gray-700 cursor-pointer transition text-sm text-gray-700 dark:text-gray-200 group"
                            >
                                <div className="flex items-center gap-3">
                                    <div className="bg-gray-100 dark:bg-gray-700 p-2 rounded-full text-gray-500 dark:text-gray-400">
                                        <History className="w-4 h-4" />
                                    </div>
                                    <span>{term}</span>
                                </div>
                                <button 
                                    onClick={(e) => handleRemoveHistoryItem(term, e)}
                                    className="text-gray-400 hover:text-red-500 opacity-0 group-hover:opacity-100 transition p-1 hover:bg-gray-100 dark:hover:bg-gray-600 rounded-full"
                                >
                                    <X className="w-4 h-4" />
                                </button>
                            </li>
                        ))}
                    </ul>
                </div>
            )}
        </div>

        <div className="md:hidden bg-gray-100 dark:bg-gray-800 p-2.5 rounded-full cursor-pointer hover:bg-gray-200 dark:hover:bg-gray-700 transition">
            <Search className="h-5 w-5 text-gray-600 dark:text-gray-300" />
        </div>
      </div>

      {/* Middle Section: Advanced Navigation System */}
      <div className="hidden md:flex h-full flex-1 justify-center max-w-2xl mx-auto">
        <div className={navClass('home')} onClick={() => handleTabClick('home')} title={t.nav_home}>
          <Home className={`h-7 w-7 ${activeTab === 'home' ? 'fill-current' : ''}`} />
          <span className="absolute -bottom-8 bg-gray-800 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition duration-300 pointer-events-none whitespace-nowrap z-50">
            {t.nav_home}
          </span>
        </div>

        {/* Improved Friend Requests Dropdown in Navbar */}
        <div className="relative h-full flex items-center flex-1 justify-center" ref={friendsMenuRef}>
            <div 
                className={`w-full h-full flex items-center justify-center cursor-pointer border-b-4 transition-all duration-200 group ${showFriendsMenu ? 'border-emerald-700 text-emerald-700' : 'border-transparent text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg'}`}
                onClick={handleToggleFriendsMenu}
                title={t.nav_friends}
            >
                <div className="relative">
                    <Users className={`h-7 w-7 ${showFriendsMenu ? 'fill-current' : ''}`} />
                    {unreadFriendsCount > 0 && (
                        <span className="absolute -top-2 -right-2 bg-red-600 text-white text-[10px] font-bold px-1.5 rounded-full border-2 border-white dark:border-gray-900 animate-pulse">
                            {unreadFriendsCount}
                        </span>
                    )}
                </div>
            </div>

            {showFriendsMenu && (
                <div className="absolute top-full left-1/2 -translate-x-1/2 mt-2 w-80 sm:w-96 bg-white dark:bg-gray-800 rounded-xl shadow-2xl border border-gray-100 dark:border-gray-700 z-50 overflow-hidden animate-fadeIn">
                    <div className="p-4 border-b border-gray-100 dark:border-gray-700 flex justify-between items-center bg-gray-50 dark:bg-gray-800/50">
                        <h3 className="font-bold text-lg text-gray-900 dark:text-white">طلبات الصداقة</h3>
                        <button onClick={() => { setView('friends'); setShowFriendsMenu(false); }} className="text-emerald-600 dark:text-emerald-400 text-xs font-semibold hover:underline">
                            عرض الكل
                        </button>
                    </div>
                    <div className="max-h-[400px] overflow-y-auto p-2">
                        {/* Friend Requests */}
                        {friendRequests.length > 0 ? (
                            friendRequests.map(req => (
                                <div key={req.id} className="flex items-center gap-3 p-2 hover:bg-gray-50 dark:hover:bg-gray-700 rounded-lg transition mb-1">
                                    <img src={req.avatar} alt={req.name} className="w-12 h-12 rounded-full object-cover" />
                                    <div className="flex-1">
                                        <div className="flex justify-between items-start">
                                            <span className="font-bold text-sm text-gray-900 dark:text-white">{req.name}</span>
                                            <span className="text-[10px] text-gray-500">{req.mutual} صديق مشترك</span>
                                        </div>
                                        <div className="flex gap-2 mt-2">
                                            <button onClick={() => handleAcceptRequest(req.id)} className="flex-1 bg-fb-blue text-white text-xs font-bold py-1.5 rounded-md hover:bg-blue-700 transition">تأكيد</button>
                                            <button onClick={() => handleDeleteRequest(req.id)} className="flex-1 bg-gray-200 text-gray-700 text-xs font-bold py-1.5 rounded-md hover:bg-gray-300 transition">حذف</button>
                                        </div>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <div className="text-center py-4 text-gray-500 text-sm">لا توجد طلبات صداقة جديدة</div>
                        )}

                        <div className="border-t border-gray-100 dark:border-gray-700 my-2"></div>
                        <h4 className="px-2 text-xs font-bold text-gray-500 uppercase mb-2">أشخاص قد تعرفهم</h4>
                        
                        {/* Suggested Friends */}
                        {suggestedFriends.map(friend => (
                            <div key={friend.id} className="flex items-center gap-3 p-2 hover:bg-gray-50 dark:hover:bg-gray-700 rounded-lg transition mb-1">
                                <img src={friend.avatar} alt={friend.name} className="w-10 h-10 rounded-full object-cover" />
                                <div className="flex-1 flex justify-between items-center">
                                    <div>
                                        <span className="font-bold text-sm text-gray-900 dark:text-white block">{friend.name}</span>
                                        <span className="text-[10px] text-gray-500">{friend.mutual} صديق مشترك</span>
                                    </div>
                                    <button onClick={() => handleAddFriend(friend.id)} className="bg-emerald-50 text-emerald-700 p-1.5 rounded-full hover:bg-emerald-100 transition">
                                        <UserPlus className="w-5 h-5" />
                                    </button>
                                </div>
                            </div>
                        ))}

                        <div className="border-t border-gray-100 dark:border-gray-700 my-2"></div>
                        <button 
                            onClick={() => { setView('suggestions'); setShowFriendsMenu(false); }}
                            className="w-full text-center text-sm text-emerald-700 font-medium hover:underline py-1 flex items-center justify-center gap-1"
                        >
                            <UserPlus className="w-4 h-4" /> استكشاف أشخاص قد تعرفهم
                        </button>
                    </div>
                </div>
            )}
        </div>

        <div className={navClass('watch')} onClick={() => handleTabClick('watch')} title={t.nav_watch}>
          <MonitorPlay className={`h-7 w-7 ${activeTab === 'watch' ? 'fill-current' : ''}`} />
          <span className="absolute -bottom-8 bg-gray-800 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition duration-300 pointer-events-none whitespace-nowrap z-50">
            {t.nav_watch}
          </span>
        </div>

        {/* Enhanced Store Button */}
        <div className={navClass('marketplace')} onClick={() => handleTabClick('marketplace')} title={t.nav_market}>
          <Store className={`h-7 w-7 ${activeTab === 'marketplace' ? 'fill-current' : ''}`} />
          {activeTab === 'marketplace' && (
              <span className="absolute top-1 right-1/2 translate-x-1/2 -mt-1 w-1.5 h-1.5 bg-emerald-500 rounded-full"></span>
          )}
          <span className="absolute -bottom-8 bg-gray-800 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition duration-300 pointer-events-none whitespace-nowrap z-50">
            {t.nav_market}
          </span>
        </div>

        {/* Enhanced Gaming Button */}
        <div className={navClass('gaming')} onClick={() => handleTabClick('gaming')} title={t.nav_gaming}>
          <Gamepad2 className={`h-7 w-7 ${activeTab === 'gaming' ? 'fill-current' : ''}`} />
          <span className="absolute -bottom-8 bg-gray-800 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition duration-300 pointer-events-none whitespace-nowrap z-50">
            {t.nav_gaming}
          </span>
        </div>
      </div>

      {/* Right Section: Notifications, Messages, Settings, Profile */}
      <div className="flex items-center gap-2 md:gap-3 lg:gap-4"> 
        
        {/* Mobile Profile Icon (Visible only on small screens) */}
        <div className="bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 p-2.5 rounded-full cursor-pointer transition md:hidden" onClick={onProfileClick}>
          <UserCircle className="h-6 w-6 text-gray-700 dark:text-gray-200" />
        </div>

        {/* 1. Notifications Dropdown */}
        <div className="relative" ref={notificationsRef}>
            <div 
                onClick={handleToggleNotifications} 
                className={`bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 p-2.5 rounded-full cursor-pointer transition duration-300 relative ${showNotifications ? 'bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-500' : 'text-black dark:text-white'}`}
            >
                <Bell className={`h-6 w-6 ${unreadNotificationsCount > 0 ? 'animate-swing' : ''}`} />
                {unreadNotificationsCount > 0 && (
                    <span className="absolute -top-1 -right-1 bg-red-600 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full border-2 border-white dark:border-gray-900 animate-pulse">
                        {unreadNotificationsCount}
                    </span>
                )}
            </div>
            {showNotifications && (
                <div className="absolute top-full mt-3 w-80 sm:w-96 bg-white dark:bg-gray-800 rounded-xl shadow-2xl border border-gray-100 dark:border-gray-700 z-50 overflow-hidden animate-fadeIn origin-top-right ltr:right-0 rtl:left-0">
                    <div className="p-4 border-b border-gray-100 dark:border-gray-700 flex justify-between items-center bg-gray-50 dark:bg-gray-800/50">
                        <h3 className="font-bold text-lg text-gray-900 dark:text-white">الإشعارات</h3>
                        {unreadNotificationsCount > 0 && (
                            <button onClick={handleMarkAllRead} className="text-emerald-600 dark:text-emerald-400 text-xs font-semibold hover:underline flex items-center gap-1">
                                <CheckCircle className="w-3 h-3" /> تحديد الكل كمقروء
                            </button>
                        )}
                    </div>
                    <div className="max-h-[400px] overflow-y-auto">
                        {notifications.length === 0 ? (
                            <div className="p-8 text-center text-gray-500">
                                <Bell className="w-12 h-12 mx-auto mb-2 opacity-50" />
                                <p>لا توجد إشعارات جديدة</p>
                            </div>
                        ) : (
                            notifications.map(notification => (
                                <div 
                                    key={notification.id} 
                                    onClick={() => handleNotificationClick(notification.id)}
                                    className={`p-3 flex items-start gap-3 hover:bg-gray-50 dark:hover:bg-gray-700 cursor-pointer transition relative group ${!notification.read ? 'bg-emerald-50/50 dark:bg-emerald-900/10' : ''}`}
                                >
                                    <div className={`p-2.5 rounded-full flex-shrink-0 ${!notification.read ? 'bg-emerald-100 dark:bg-emerald-900 text-emerald-600' : 'bg-gray-100 dark:bg-gray-700 text-gray-500'}`}>
                                        <Bell className="w-5 h-5" />
                                    </div>
                                    <div className="flex-1 pr-6">
                                        <p className={`text-sm leading-tight mb-1 ${!notification.read ? 'font-bold text-gray-900 dark:text-white' : 'text-gray-700 dark:text-gray-300'}`}>
                                            {notification.text}
                                        </p>
                                        <span className="text-xs text-emerald-600 dark:text-emerald-400 font-medium">{notification.time}</span>
                                    </div>
                                    {!notification.read && <div className="w-2.5 h-2.5 bg-red-500 rounded-full mt-2 flex-shrink-0"></div>}
                                    
                                    {/* Delete Notification Button */}
                                    <button 
                                        onClick={(e) => handleRemoveNotification(notification.id, e)}
                                        className="absolute top-1/2 -translate-y-1/2 left-2 p-1.5 text-gray-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-full opacity-0 group-hover:opacity-100 transition"
                                        title="إزالة الإشعار"
                                    >
                                        <Trash2 className="w-4 h-4" />
                                    </button>
                                </div>
                            ))
                        )}
                    </div>
                    <div className="p-2 border-t border-gray-100 dark:border-gray-700 text-center bg-gray-50 dark:bg-gray-800/50">
                        <button onClick={handleViewAllNotifications} className="text-sm font-semibold text-emerald-600 hover:underline">عرض كل الإشعارات السابقة</button>
                    </div>
                </div>
            )}
        </div>

        {/* 2. Messages Dropdown */}
        <div className="relative" ref={messagesRef}>
            <div 
                onClick={handleToggleMessages}
                className={`bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 p-2.5 rounded-full cursor-pointer transition duration-300 ${showMessages ? 'bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-500' : 'text-black dark:text-white'}`}
            >
                <MessageCircle className="h-6 w-6" />
                {unreadMessagesCount > 0 && (
                    <span className="absolute -top-1 -right-1 bg-red-600 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full border-2 border-white dark:border-gray-900 animate-pulse">
                        {unreadMessagesCount}
                    </span>
                )}
            </div>
            {showMessages && (
                <div className="absolute top-full mt-3 w-80 sm:w-96 bg-white dark:bg-gray-800 rounded-xl shadow-2xl border border-gray-100 dark:border-gray-700 z-50 overflow-hidden animate-fadeIn origin-top-right ltr:right-0 rtl:left-0">
                    <div className="p-4 border-b border-gray-100 dark:border-gray-700 flex justify-between items-center bg-gray-50 dark:bg-gray-800/50">
                        <h3 className="font-bold text-lg text-gray-900 dark:text-white">الرسائل</h3>
                        <div className="flex gap-2">
                            {unreadMessagesCount > 0 && (
                                <button onClick={handleMarkAllMessagesRead} className="text-gray-500 hover:text-emerald-600 text-xs font-semibold hover:underline">
                                    تحديد كمقروء
                                </button>
                            )}
                            <button onClick={handleNewMessage} className="text-emerald-600 text-xs font-semibold hover:underline flex items-center gap-1">
                                <Plus className="w-3 h-3" /> رسالة جديدة
                            </button>
                        </div>
                    </div>
                    <div className="max-h-[400px] overflow-y-auto">
                        {messages.map(msg => (
                            <div 
                                key={msg.id} 
                                className={`p-3 flex items-center gap-3 hover:bg-gray-50 dark:hover:bg-gray-700 cursor-pointer transition ${msg.unread ? 'bg-blue-50/50 dark:bg-blue-900/10' : ''}`}
                                onClick={() => handleMessageClick(msg)}
                            >
                                <div className="relative">
                                    <img src={msg.avatar} alt={msg.sender} className="w-12 h-12 rounded-full object-cover border border-gray-200 dark:border-gray-700" />
                                    <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-white dark:border-gray-800 rounded-full"></div>
                                </div>
                                <div className="flex-1 min-w-0">
                                    <div className="flex justify-between items-center mb-0.5">
                                        <span className={`text-sm ${msg.unread ? 'font-bold text-gray-900 dark:text-white' : 'font-medium text-gray-700 dark:text-gray-300'}`}>
                                            {msg.sender}
                                        </span>
                                        <span className={`text-xs ${msg.unread ? 'text-emerald-600 font-bold' : 'text-gray-400'}`}>{msg.time}</span>
                                    </div>
                                    <div className="flex justify-between items-center">
                                        <p className={`text-sm truncate max-w-[200px] ${msg.unread ? 'font-semibold text-gray-800 dark:text-gray-100' : 'text-gray-500 dark:text-gray-400'}`}>
                                            {msg.unread ? <span className="inline-block w-2 h-2 bg-blue-500 rounded-full mr-1"></span> : null}
                                            {msg.text}
                                        </p>
                                    </div>
                                </div>
                                <div className="opacity-0 group-hover:opacity-100 transition">
                                    <MoreHorizontal className="w-4 h-4 text-gray-400" />
                                </div>
                            </div>
                        ))}
                    </div>
                    <div className="p-2 border-t border-gray-100 dark:border-gray-700 text-center bg-gray-50 dark:bg-gray-800/50">
                        <button onClick={handleViewAllMessages} className="text-sm font-semibold text-emerald-600 hover:underline">عرض كل الرسائل في الماسنجر</button>
                    </div>
                </div>
            )}
        </div>

        {/* 3. Settings Dropdown */}
        <div className="relative" ref={settingsRef}>
            <div 
                onClick={() => setShowSettings(!showSettings)}
                className={`hidden md:block bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 p-2.5 rounded-full cursor-pointer transition duration-300 ${showSettings ? 'bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-500 ring-2 ring-emerald-500/20' : 'text-black dark:text-white'}`}
                title="الإعدادات"
            >
                <Settings className="h-6 w-6" />
            </div>

            {showSettings && (
                <div className="absolute top-full mt-3 w-80 bg-white dark:bg-gray-800 rounded-xl shadow-2xl border border-gray-100 dark:border-gray-700 z-50 overflow-hidden animate-fadeIn origin-top-right ltr:right-0 rtl:left-0">
                    {/* MAIN SETTINGS VIEW */}
                    {settingsView === 'main' && (
                      <>
                        <div className="p-4 border-b border-gray-100 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50">
                            <h3 className="font-bold text-lg text-gray-900 dark:text-white">الإعدادات والخصوصية</h3>
                        </div>
                        
                        <div className="p-2 space-y-1">
                            <button 
                                onClick={() => setSettingsView('language')}
                                className="w-full flex items-center justify-between p-3 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition group"
                            >
                                <div className="flex items-center gap-3">
                                    <div className="bg-gray-200 dark:bg-gray-700 p-2 rounded-full group-hover:bg-white dark:group-hover:bg-gray-600 transition">
                                        <Globe className="w-5 h-5 text-gray-700 dark:text-gray-200" />
                                    </div>
                                    <span className="font-medium text-gray-800 dark:text-gray-200">اللغة / Language</span>
                                </div>
                                {dir === 'rtl' ? <ChevronLeft className="w-5 h-5 text-gray-400" /> : <ChevronRight className="w-5 h-5 text-gray-400" />}
                            </button>

                            <button 
                                onClick={() => {
                                    toggleTheme();
                                    setShowSettings(false);
                                }}
                                className="w-full flex items-center justify-between p-3 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition group"
                            >
                                <div className="flex items-center gap-3">
                                    <div className="bg-gray-200 dark:bg-gray-700 p-2 rounded-full group-hover:bg-white dark:group-hover:bg-gray-600 transition relative overflow-hidden">
                                        {theme === 'dark' ? 
                                            <Sun className="w-5 h-5 text-amber-500 animate-spin-slow" /> : 
                                            <Moon className="w-5 h-5 text-gray-700" />
                                        }
                                    </div>
                                    <div className="flex flex-col items-start">
                                        <span className="font-medium text-gray-800 dark:text-gray-200">
                                            {theme === 'dark' ? 'الوضع الفاتح' : 'الوضع الليلي'}
                                        </span>
                                        <span className="text-xs text-gray-500">تعديل مظهر التطبيق</span>
                                    </div>
                                </div>
                                {/* Toggle Switch Visual */}
                                <div className={`w-10 h-6 rounded-full p-1 transition-colors duration-300 ${theme === 'dark' ? 'bg-emerald-600' : 'bg-gray-300'}`}>
                                    <div className={`bg-white w-4 h-4 rounded-full shadow-md transform transition-transform duration-300 ${theme === 'dark' ? 'translate-x-0' : dir === 'rtl' ? '-translate-x-4' : 'translate-x-4'}`}></div>
                                </div>
                            </button>

                            <div className="border-t border-gray-100 dark:border-gray-700 my-1"></div>

                            <button 
                                onClick={onLogout}
                                className="w-full flex items-center justify-between p-3 hover:bg-red-50 dark:hover:bg-red-900/10 rounded-lg transition group text-red-600 dark:text-red-400"
                            >
                                <div className="flex items-center gap-3">
                                    <div className="bg-red-50 dark:bg-red-900/20 p-2 rounded-full group-hover:bg-white dark:group-hover:bg-gray-800 transition">
                                        <LogOut className="w-5 h-5" />
                                    </div>
                                    <span className="font-medium">تسجيل الخروج</span>
                                </div>
                            </button>
                        </div>
                      </>
                    )}

                    {/* LANGUAGE SUB-MENU */}
                    {settingsView === 'language' && (
                       <div className="animate-slideLeft">
                          <div className="p-3 border-b border-gray-100 dark:border-gray-700 flex items-center gap-2 bg-gray-50 dark:bg-gray-800/50">
                              <button 
                                onClick={() => setSettingsView('main')}
                                className="p-1.5 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-full text-gray-600 dark:text-gray-300 transition"
                              >
                                 {dir === 'rtl' ? <ChevronRight className="w-5 h-5" /> : <ChevronLeft className="w-5 h-5" />}
                              </button>
                              <h3 className="font-bold text-lg text-gray-900 dark:text-white">اللغة</h3>
                          </div>
                          <div className="p-2 space-y-1">
                             <button 
                                onClick={() => { setLanguage('ar'); setShowSettings(false); }}
                                className={`w-full flex items-center justify-between p-3 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition ${language === 'ar' ? 'bg-emerald-50 dark:bg-emerald-900/20 text-emerald-700 dark:text-emerald-400' : 'text-gray-700 dark:text-gray-200'}`}
                             >
                                <div className="flex flex-col items-start">
                                   <span className="font-medium">العربية</span>
                                   <span className="text-xs opacity-70">Arabic</span>
                                </div>
                                {language === 'ar' && <Check className="w-4 h-4" />}
                             </button>

                             <button 
                                onClick={() => { setLanguage('en'); setShowSettings(false); }}
                                className={`w-full flex items-center justify-between p-3 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition ${language === 'en' ? 'bg-emerald-50 dark:bg-emerald-900/20 text-emerald-700 dark:text-emerald-400' : 'text-gray-700 dark:text-gray-200'}`}
                             >
                                <div className="flex flex-col items-start">
                                   <span className="font-medium">English</span>
                                   <span className="text-xs opacity-70">الإنجليزية</span>
                                </div>
                                {language === 'en' && <Check className="w-4 h-4" />}
                             </button>
                          </div>
                       </div>
                    )}
                </div>
            )}
        </div>

        {/* 4. User Profile Link (Visible only on md screens and up) */}
        <div 
          className="hidden md:flex items-center gap-2 hover:bg-gray-100 dark:hover:bg-gray-800 p-1 pl-3 pr-1 rounded-full cursor-pointer transition duration-200 border border-transparent hover:border-gray-200 dark:hover:border-gray-700" 
          onClick={onProfileClick}
        >
          <img 
            src={currentUser?.avatar || "https://via.placeholder.com/40"} 
            alt="Profile" 
            className="h-9 w-9 rounded-full border border-gray-200 object-cover shadow-sm" 
          />
          {/* Darkened name color as requested (text-emerald-700) and Bold Font */}
          <span className="font-bold text-sm mx-2 text-emerald-700 dark:text-emerald-500 hidden lg:block">{currentUser?.name || "المستخدم"}</span>
        </div>
      </div>

      {/* Mobile Navigation Drawer Overlay */}
      {showMobileMenu && (
          <div className="absolute top-16 left-0 w-full bg-white dark:bg-gray-900 shadow-xl border-t dark:border-gray-700 p-4 md:hidden animate-slideDown z-40">
              <div className="grid grid-cols-2 gap-4">
                  <div className="p-3 bg-gray-50 dark:bg-gray-800 rounded-lg flex flex-col items-center gap-2 cursor-pointer active:scale-95 transition" onClick={() => handleTabClick('home')}>
                      <Home className="w-6 h-6 text-emerald-600" />
                      <span className="text-sm font-medium dark:text-gray-200">{t.nav_home}</span>
                  </div>
                  <div className="p-3 bg-gray-50 dark:bg-gray-800 rounded-lg flex flex-col items-center gap-2 cursor-pointer active:scale-95 transition" onClick={() => handleTabClick('friends')}>
                      <Users className="w-6 h-6 text-blue-600" />
                      <span className="text-sm font-medium dark:text-gray-200">{t.nav_friends}</span>
                  </div>
                  <div className="p-3 bg-gray-50 dark:bg-gray-800 rounded-lg flex flex-col items-center gap-2 cursor-pointer active:scale-95 transition" onClick={() => handleTabClick('watch')}>
                      <MonitorPlay className="w-6 h-6 text-red-600" />
                      <span className="text-sm font-medium dark:text-gray-200">{t.nav_watch}</span>
                  </div>
                  <div className="p-3 bg-gray-50 dark:bg-gray-800 rounded-lg flex flex-col items-center gap-2 cursor-pointer active:scale-95 transition" onClick={() => handleTabClick('marketplace')}>
                      <Store className="w-6 h-6 text-purple-600" />
                      <span className="text-sm font-medium dark:text-gray-200">{t.nav_market}</span>
                  </div>
                  <div className="p-3 bg-gray-50 dark:bg-gray-800 rounded-lg flex flex-col items-center gap-2 cursor-pointer active:scale-95 transition" onClick={() => handleTabClick('gaming')}>
                      <Gamepad2 className="w-6 h-6 text-orange-600" />
                      <span className="text-sm font-medium dark:text-gray-200">{t.nav_gaming}</span>
                  </div>
                  <div className="p-3 bg-gray-50 dark:bg-gray-800 rounded-lg flex flex-col items-center gap-2 cursor-pointer active:scale-95 transition" onClick={(e) => { e.stopPropagation(); setShowSettings(!showSettings); }}>
                      <Settings className="w-6 h-6 text-gray-600" />
                      <span className="text-sm font-medium dark:text-gray-200">الإعدادات</span>
                  </div>
              </div>
          </div>
      )}
    </div>
  );
};

export default Navbar;