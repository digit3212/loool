import React, { useState, useMemo } from 'react';
import { createPortal } from 'react-dom';
import {
  History,
  Calendar,
  Settings,
  Bell,
  Share2,
  ArrowRight,
  ArrowLeft,
  ChevronLeft,
  Info,
  CheckCircle,
  X,
  Plus,
  UserX,
  CalendarX,
  Trash2,
  Search,
  UserPlus,
  UserCheck,
  User as UserIcon
} from 'lucide-react';

import { User, Post } from '../types';
import { useLanguage } from '../context/LanguageContext';
import PostCard from './PostCard';
import { MOCK_FRIENDS_LIST } from '../data/profileData';

interface MemoriesProps {
  currentUser: User;
  posts: Post[];
  onBack: () => void;
  onPostCreate: (content: string, image?: string) => void;
  onLike: (id: string) => void;
  onComment: (id: string, text: string) => void;
  onDeleteComment: (postId: string, commentId: string) => void;
  onLikeComment: (postId: string, commentId: string) => void;
  onDeletePost: (id: string) => void;
  onShare: (post: Post) => void;
}

const Memories: React.FC<MemoriesProps> = ({
  currentUser,
  posts,
  onBack,
  onPostCreate,
  onLike,
  onComment,
  onDeleteComment,
  onLikeComment,
  onDeletePost,
  onShare
}) => {
  const { dir, language } = useLanguage();

  /* ================= Constants ================= */
  const DAYS = Array.from({ length: 31 }, (_, i) => (i + 1).toString());
  const MONTHS = [
    "يناير", "فبراير", "مارس", "أبريل", "مايو", "يونيو", 
    "يوليو", "أغسطس", "سبتمبر", "أكتوبر", "نوفمبر", "ديسمبر"
  ];
  // Year range up to 2035
  const maxYear = 2035;
  const YEARS = Array.from({ length: maxYear - 1900 + 1 }, (_, i) => (maxYear - i).toString());

   /* ================= State ================= */
  const [activeTab, setActiveTab] = useState<'today' | 'recent' | 'settings'>('today');
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  
  // Hidden items state
  const [hiddenPeople, setHiddenPeople] = useState<string[]>([]);
  const [hiddenDates, setHiddenDates] = useState<string[]>([]);
  
  // Modals state
  const [showHiddenPeopleModal, setShowHiddenPeopleModal] = useState(false);
  const [showHiddenDatesModal, setShowHiddenDatesModal] = useState(false);
  const [personSearch, setPersonSearch] = useState('');
  
  // Advanced Date State
  const [selectedDay, setSelectedDay] = useState('1');
  const [selectedMonth, setSelectedMonth] = useState(MONTHS[0]);
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear().toString());

  const [notification, setNotification] = useState<{
    message: string;
    type: 'success' | 'info';
  } | null>(null);

  /* ================= Helpers ================= */
  const showNotification = (
    message: string,
    type: 'success' | 'info' = 'success'
  ) => {
    setNotification({ message, type });
    setTimeout(() => setNotification(null), 3000);
  };

  const handleAddHiddenPerson = (name: string) => {
    if (!name.trim() || hiddenPeople.includes(name)) return;
    setHiddenPeople([...hiddenPeople, name]);
    setPersonSearch('');
  };

  const handleRemoveHiddenPerson = (name: string) => {
    setHiddenPeople(hiddenPeople.filter(p => p !== name));
  };

  const handleAddHiddenDate = () => {
    const fullDate = `${selectedDay} ${selectedMonth} ${selectedYear}`;
    if (hiddenDates.includes(fullDate)) return;
    setHiddenDates([...hiddenDates, fullDate]);
  };

  const handleRemoveHiddenDate = (date: string) => {
    setHiddenDates(hiddenDates.filter(d => d !== date));
  };

  /* ================= Memories Logic ================= */
  const memoryPosts = useMemo(() => {
    return posts.filter(
      p => p.timestamp.includes('عام') && p.author.id === currentUser.id
    );
  }, [posts, currentUser.id]);

  const groupedMemories = useMemo(() => {
    const groups: Record<string, Post[]> = {};
    memoryPosts.forEach(post => {
      const label = post.timestamp.includes('عامين')
        ? 'منذ عامين'
        : 'منذ عام واحد';

      if (!groups[label]) groups[label] = [];
      groups[label].push(post);
    });
    return groups;
  }, [memoryPosts]);

  /* ================= Render ================= */
  return (
    <div className="w-full max-w-2xl mx-auto py-6 animate-fadeIn" dir={dir}>
      {/* ================= Header ================= */}
      <div className="bg-white/80 backdrop-blur-md border border-white/20 rounded-2xl shadow-xl overflow-hidden mb-6">
        <div className="h-32 bg-emerald-700/80 relative flex items-center justify-center">
          <button
            onClick={onBack}
            className="absolute top-4 right-4 p-2 bg-black/20 hover:bg-black/40 text-white rounded-full transition"
          >
            {dir === 'rtl' ? (
              <ArrowRight className="w-5 h-5" />
            ) : (
              <ArrowLeft className="w-5 h-5" />
            )}
          </button>

          <div className="p-4 bg-white/20 backdrop-blur-lg rounded-3xl border border-white/30 shadow-2xl">
            <History className="w-10 h-10 text-white" />
          </div>
        </div>

        <div className="p-6 text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-1">
            ذكرياتك على Tourloop
          </h2>
          <p className="text-gray-500 text-sm">
            نأمل أن تستمتع بالنظر إلى الوراء في لحظاتك ومشاركتها مع الآخرين.
          </p>
        </div>

        {/* ================= Tabs ================= */}
        <div className="flex border-t border-white/20">
          {[
            { id: 'today', label: 'في مثل هذا اليوم', icon: Calendar },
            { id: 'recent', label: 'ذكريات حديثة', icon: History },
            { id: 'settings', label: 'الإعدادات', icon: Settings }
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex-1 py-4 text-sm font-bold flex items-center justify-center gap-2 transition ${
                activeTab === tab.id
                  ? 'text-fb-blue bg-white/30 border-b-2 border-fb-blue'
                  : 'text-gray-500 hover:bg-white/20'
              }`}
            >
              <tab.icon className="w-4 h-4" />
              <span className="hidden sm:inline">{tab.label}</span>
            </button>
          ))}
        </div>
      </div>

       {/* ================= Content ================= */}
      <div className="space-y-6">
        {activeTab === 'today' && (
          Object.keys(groupedMemories).length > 0 ? (
            Object.entries(groupedMemories).map(([label, items]) => (
              <div key={label} className="animate-slideUp">
                <div className="flex items-center gap-3 px-2 mb-4">
                  <div className="h-px flex-1 bg-gray-300" />
                  <span className="text-xs font-black text-emerald-800 bg-emerald-100 px-3 py-1 rounded-full">
                    {label}
                  </span>
                  <div className="h-px flex-1 bg-gray-300" />
                </div>

                <div className="space-y-4">
                  {items.map(post => (
                    <div key={post.id} className="relative group">
                      <PostCard
                        post={post}
                        currentUser={currentUser}
                        onLike={onLike}
                        onComment={onComment}
                        onDeleteComment={onDeleteComment}
                        onLikeComment={onLikeComment}
                        onDelete={onDeletePost}
                      />

                      <div className="absolute top-4 left-14 opacity-0 group-hover:opacity-100 transition">
                        <button
                          onClick={() => onShare(post)}
                          className="bg-fb-blue text-white px-4 py-1.5 rounded-full text-xs font-bold shadow-lg flex items-center gap-2"
                        >
                          <Share2 className="w-3.5 h-3.5" />
                          مشاركة الذكرى
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))
          ) : (
             <div className="bg-white/80 backdrop-blur-md border border-white/20 rounded-2xl p-16 text-center shadow-lg">
              <Calendar className="w-10 h-10 text-blue-700 mx-auto mb-4" />
              <h3 className="text-xl font-bold text-gray-900">
                لا توجد ذكريات لعرضها اليوم
              </h3>
              <p className="text-red-500 text-sm">
                سنقوم بإشعارك عند توفر ذكريات من سنوات سابقة.
              </p>
            </div>
          )
        )}

        {activeTab === 'recent' && (
          <div className="bg-white/80 backdrop-blur-md border border-white/20 rounded-2xl p-10 text-center shadow-lg">
            <Info className="w-12 h-12 text-blue-700 mx-auto mb-4 opacity-50" />
            <h3 className="font-bold text-lg">الذكريات الحديثة</h3>
            <p className="text-sm text-red-500">
              هنا سيتم عرض الذكريات التي تفاعلت معها مؤخراً.
            </p>
          </div>
        )}

        {activeTab === 'settings' && (
          <div className="bg-white/80 backdrop-blur-md border border-white/20 rounded-2xl overflow-hidden shadow-lg">
            <div className="p-6 border-b border-white/20">
              <h3 className="font-bold text-lg">إعدادات الذكريات</h3>
              <p className="text-sm text-gray-500">
                تحكم في كيفية وتوقيت ظهور الذكريات لك.
              </p>
            </div>

            {/* Notifications */}
            <div className="p-6 flex items-center justify-between">
              <div className="flex items-center gap-2 font-bold">
                <Bell className="w-4 h-4 text-emerald-700 " />
                الإشعارات
              </div>

              <button
                onClick={() => setNotificationsEnabled(!notificationsEnabled)}
                className={`w-12 h-6 rounded-full relative transition ${
                  notificationsEnabled ? 'bg-fb-blue' : 'bg-gray-300 dark:bg-gray-600'
                }`}
              >
                <div
                  className={`absolute top-1 w-4 h-4 bg-white rounded-full transition ${
                    dir === 'rtl'
                      ? notificationsEnabled
                        ? 'right-7'
                        : 'right-1'
                      : notificationsEnabled
                      ? 'left-7'
                      : 'left-1'
                  }`}
                />
              </button>
            </div>

            {/* Hidden People & Dates */}
            <div className="px-6 pb-6 border-t border-white/10">
              <h4 className="font-bold text-sm text-gray-800 mb-4 mt-6">
                أشخاص وتواريخ مخفية
              </h4>

              <div className="space-y-2">
                <button 
                  onClick={() => setShowHiddenPeopleModal(true)}
                  className="w-full flex justify-between items-center p-3 hover:bg-white/30 rounded-xl transition border border-white/5 bg-white/10 group"
                >
                  <span className="text-sm font-medium flex items-center gap-2">
                    أشخاص لا أريد رؤيتهم
                    {hiddenPeople.length > 0 && <span className="bg-red-100 text-red-600 px-2 py-0.5 rounded-full text-[10px] font-bold">{hiddenPeople.length}</span>}
                  </span>
                  <ChevronLeft className={`w-4 h-4 text-gray-400 group-hover:text-fb-blue ${dir === 'ltr' ? 'rotate-180' : ''}`} />
                </button>

                <button 
                  onClick={() => setShowHiddenDatesModal(true)}
                  className="w-full flex justify-between items-center p-3 hover:bg-white/30 rounded-xl transition border border-white/5 bg-white/10 group"
                >
                  <span className="text-sm font-medium flex items-center gap-2">
                    تواريخ لا أريد رؤيتها
                    {hiddenDates.length > 0 && <span className="bg-red-100 text-red-600 px-2 py-0.5 rounded-full text-[10px] font-bold">{hiddenDates.length}</span>}
                  </span>
                  <ChevronLeft className={`w-4 h-4 text-gray-400 group-hover:text-fb-blue ${dir === 'ltr' ? 'rotate-180' : ''}`} />
                </button>
              </div>
            </div>

             {/* Save Button - Moved to the other side: ltr:justify-start rtl:justify-end */}
            <div className="p-4 border-t border-white/20 flex ltr:justify-start rtl:justify-end">
              <button
                onClick={() => {
                  showNotification('تم حفظ الإعدادات بنجاح');
                  setActiveTab('today');
                }}
                className="bg-fb-blue text-white px-8 py-2.5 rounded-lg font-bold shadow-md hover:bg-blue-700 transition transform active:scale-95"
              >
                حفظ التغييرات
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Hidden People Modal - Vertical List View Reverted */}
      {showHiddenPeopleModal && createPortal(
        <div className="fixed inset-0 z-[100000] bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 animate-fadeIn">
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl w-full max-w-md overflow-hidden animate-scaleIn border border-white/10">
            <div className="p-4 border-b border-gray-100 dark:border-gray-700 flex justify-between items-center bg-gray-50 dark:bg-gray-800/50">
              <h3 className="font-bold text-lg flex items-center gap-2"><UserX className="w-5 h-5 text-red-500" /> أشخاص مخفيون</h3>
              <button onClick={() => setShowHiddenPeopleModal(false)} className="p-1 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-full transition"><X className="w-5 h-5" /></button>
            </div>
            <div className="p-6">
              {/* Search */}
              <div className="relative mb-6">
                <Search className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input 
                  type="text" 
                  placeholder="ابحث عن شخص لإخفائه..."
                  className="w-full bg-gray-100 dark:bg-gray-700 border-none rounded-xl py-2.5 pr-10 pl-12 text-sm focus:ring-2 focus:ring-fb-blue outline-none transition shadow-inner"
                  value={personSearch}
                  onChange={(e) => setPersonSearch(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleAddHiddenPerson(personSearch)}
                />
                <button 
                  onClick={() => handleAddHiddenPerson(personSearch)}
                  className="absolute left-2 top-1/2 -translate-y-1/2 p-1.5 bg-fb-blue text-white rounded-lg hover:bg-blue-700 transition"
                >
                  <UserPlus className="w-4 h-4" />
                </button>
              </div>

              {/* Selection List from Friends */}
              <div className="mb-4">
                <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-3 pr-1">اختر من قائمة الأصدقاء</label>
                <div className="max-h-60 overflow-y-auto space-y-2 no-scrollbar">
                   {MOCK_FRIENDS_LIST.filter(f => f.toLowerCase().includes(personSearch.toLowerCase())).map(friend => (
                     <div 
                        key={friend}
                        className={`flex items-center justify-between p-3 rounded-xl border transition ${hiddenPeople.includes(friend) ? 'bg-gray-50 dark:bg-gray-700 border-gray-100 opacity-60' : 'bg-white dark:bg-gray-800 border-gray-100 hover:border-fb-blue shadow-sm'}`}
                     >
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center overflow-hidden border border-gray-100 dark:border-gray-600">
                                <img src={`https://ui-avatars.com/api/?name=${encodeURIComponent(friend)}&background=random`} alt={friend} className="w-full h-full object-cover" />
                            </div>
                            <span className="font-bold text-sm text-gray-900 dark:text-white">{friend}</span>
                        </div>
                        {hiddenPeople.includes(friend) ? (
                            <button onClick={() => handleRemoveHiddenPerson(friend)} className="text-fb-blue text-xs font-bold px-3 py-1.5 hover:bg-blue-50 rounded-lg transition">إلغاء الإخفاء</button>
                        ) : (
                            <button onClick={() => handleAddHiddenPerson(friend)} className="bg-fb-blue text-white p-1.5 rounded-lg hover:bg-blue-700 transition"><Plus className="w-4 h-4" /></button>
                        )}
                     </div>
                   ))}
                </div>
              </div>
              
              {hiddenPeople.length > 0 && (
                <>
                  <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-3 pr-1 border-t dark:border-gray-700 pt-4">المخفيون حالياً</label>
                  <div className="flex flex-wrap gap-2">
                    {hiddenPeople.map(person => (
                      <span key={person} className="flex items-center gap-1.5 bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 px-3 py-1 rounded-full text-xs font-bold border border-red-100 dark:border-red-900/30 animate-scaleIn">
                        {person}
                        <X className="w-3 h-3 cursor-pointer hover:scale-110" onClick={() => handleRemoveHiddenPerson(person)} />
                      </span>
                    ))}
                  </div>
                </>
              )}
            </div>
            <div className="p-4 bg-gray-50 dark:bg-gray-800/50 border-t dark:border-gray-700 flex justify-end">
              <button onClick={() => setShowHiddenPeopleModal(false)} className="bg-fb-blue text-white px-8 py-2.5 rounded-lg font-bold shadow-md hover:bg-blue-700 transition">تم</button>
            </div>
          </div>
        </div>,
        document.body
      )}

      {/* Hidden Dates Modal - Keeping 2035 Range */}
      {showHiddenDatesModal && createPortal(
        <div className="fixed inset-0 z-[100000] bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 animate-fadeIn">
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl w-full max-w-md overflow-hidden animate-scaleIn border border-gray-200 dark:border-gray-700">
            <div className="p-4 border-b border-gray-100 dark:border-gray-700 flex justify-between items-center bg-gray-50 dark:bg-gray-800/50">
              <h3 className="font-bold text-lg text-gray-900 dark:text-white flex items-center gap-2"><CalendarX className="w-5 h-5 text-orange-500" /> تواريخ مخفية</h3>
              <button onClick={() => setShowHiddenDatesModal(false)} className="p-1 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-full transition"><X className="w-5 h-5" /></button>
            </div>
            <div className="p-6">
              <div className="bg-gray-50 dark:bg-gray-700/30 p-4 rounded-2xl border border-gray-100 dark:border-gray-700 mb-6">
                <label className="block text-xs font-bold text-gray-500 dark:text-gray-400 mb-3 uppercase tracking-wider text-right">تحديد تاريخ جديد</label>
                <div className="flex gap-2 mb-4" dir="rtl">
                  <select 
                    className="flex-1 bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-xl p-2.5 text-sm focus:ring-2 focus:ring-fb-blue outline-none transition dark:text-white"
                    value={selectedDay}
                    onChange={(e) => setSelectedDay(e.target.value)}
                  >
                    {DAYS.map(d => <option key={d} value={d}>{d}</option>)}
                  </select>
                  <select 
                    className="flex-[2] bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-xl p-2.5 text-sm focus:ring-2 focus:ring-fb-blue outline-none transition dark:text-white"
                    value={selectedMonth}
                    onChange={(e) => setSelectedMonth(e.target.value)}
                  >
                    {MONTHS.map(m => <option key={m} value={m}>{m}</option>)}
                  </select>
                  <select 
                    className="flex-[1.5] bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-xl p-2.5 text-sm focus:ring-2 focus:ring-fb-blue outline-none transition dark:text-white"
                    value={selectedYear}
                    onChange={(e) => setSelectedYear(e.target.value)}
                  >
                    {YEARS.map(y => <option key={y} value={y}>{y}</option>)}
                  </select>
                </div>
                <button 
                  onClick={handleAddHiddenDate}
                  className="w-full bg-fb-blue text-white rounded-xl py-2.5 font-bold hover:bg-blue-700 transition flex items-center justify-center gap-2 shadow-sm active:scale-95"
                >
                  <Plus className="w-4 h-4" /> إضافة التاريخ المختار
                </button>
              </div>

              <label className="block text-xs font-bold text-gray-500 dark:text-gray-400 mb-2 uppercase tracking-wider text-right">التواريخ المخفية حالياً</label>
              <div className="max-h-60 overflow-y-auto space-y-2 no-scrollbar">
                {hiddenDates.length > 0 ? hiddenDates.map(date => (
                  <div key={date} className="flex justify-between items-center p-3 bg-gray-50 dark:bg-gray-700/50 rounded-xl border border-gray-100 dark:border-gray-700 animate-slideUp">
                    <span className="font-medium text-sm text-gray-800 dark:text-gray-200">{date}</span>
                    <button onClick={() => handleRemoveHiddenDate(date)} className="text-red-500 hover:bg-red-50 p-1.5 rounded-lg transition"><Trash2 className="w-4 h-4" /></button>
                  </div>
                )) : (
                  <div className="text-center py-8 text-gray-400 text-sm italic">لم يتم إخفاء أي تواريخ بعد</div>
                )}
              </div>
            </div>
            <div className="p-4 bg-gray-50 dark:bg-gray-800/50 border-t dark:border-gray-700 flex justify-end">
              <button onClick={() => setShowHiddenDatesModal(false)} className="bg-fb-blue text-white px-8 py-2.5 rounded-lg font-bold shadow-md hover:bg-blue-700 transition">تم</button>
            </div>
          </div>
        </div>,
        document.body
      )}

      {/* ================= Toast Notification with Portal for high z-index layering ================= */}
      {notification && createPortal(
        <div className="fixed bottom-6 right-6 z-[200000] animate-bounce-in">
          <div className={`flex items-center gap-3 px-5 py-3.5 rounded-xl shadow-2xl border border-white/20 backdrop-blur-md text-white ${notification.type === 'success' ? 'bg-emerald-600/90' : 'bg-fb-blue/90'}`}>
            <CheckCircle className="w-5 h-5" />
            <span className="font-bold text-sm">{notification.message}</span>
            <button onClick={() => setNotification(null)} className="hover:bg-white/20 p-1 rounded-full transition ml-2">
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>,
        document.body
      )}
    </div>
  );
};

export default Memories;