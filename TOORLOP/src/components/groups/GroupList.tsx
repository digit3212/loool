
import React, { useMemo, useRef, useState, useEffect } from 'react';
import { 
  Search, Plus, Globe, Lock, Users, ExternalLink, MoreHorizontal, Pin, 
  PinOff, Bell, BellOff, Trash2, LogOut, Flag, Edit3, Link as LinkIcon
} from 'lucide-react';
import { Group } from '../../data/groupsData';
import { useLanguage } from '../../context/LanguageContext';

type TabType = 'all' | 'admin' | 'member' | 'discover';

interface GroupListProps {
  groups: Group[];
  searchTerm: string;
  setSearchTerm: (val: string) => void;
  activeTab: TabType;
  setActiveTab: (val: TabType) => void;
  onJoinGroup: (id: string, e: React.MouseEvent) => void;
  onVisitGroup: (group: Group) => void;
  onMenuAction: (action: any, id: string) => void;
  onCreateGroupClick: () => void;
}

const GroupList: React.FC<GroupListProps> = ({
  groups, searchTerm, setSearchTerm, activeTab, setActiveTab, 
  onJoinGroup, onVisitGroup, onMenuAction, onCreateGroupClick
}) => {
  const { dir } = useLanguage();
  const [activeMenuId, setActiveMenuId] = useState<string | null>(null);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setActiveMenuId(null);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const filteredGroups = useMemo(() => {
      let result = groups.filter(g => g.name.toLowerCase().includes(searchTerm.toLowerCase()));
      
      if (activeTab === 'admin') {
          result = result.filter(g => g.role === 'admin');
      } else if (activeTab === 'member') {
          result = result.filter(g => g.role === 'member' || g.role === 'admin');
      } else if (activeTab === 'discover') {
          result = result.filter(g => !g.isJoined);
      } else {
          result = result.filter(g => g.isJoined);
      }
      
      return result.sort((a, b) => (b.isPinned ? 1 : 0) - (a.isPinned ? 1 : 0));
  }, [groups, searchTerm, activeTab]);

  return (
    <>
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4 animate-fadeIn">
        <div>
            <h2 className="text-2xl font-extrabold text-gray-900 dark:text-white">المجموعات</h2>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">اكتشف مجتمعات تناسب اهتماماتك وتواصل مع الآخرين</p>
        </div>
        
        <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
            <div className="relative flex-1 sm:w-64 w-full">
               <Search className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500 dark:text-gray-400" />
               <input 
                 type="text" 
                 placeholder="بحث في المجموعات..." 
                 className="w-full bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 focus:bg-white dark:focus:bg-gray-900 border border-transparent focus:border-fb-blue rounded-full py-2.5 pr-10 pl-4 text-sm transition outline-none text-gray-900 dark:text-white shadow-sm"
                 value={searchTerm}
                 onChange={(e) => setSearchTerm(e.target.value)}
               />
            </div>
            <button 
                onClick={onCreateGroupClick}
                className="bg-fb-blue text-white px-5 py-2.5 rounded-full font-bold text-sm hover:bg-blue-700 transition flex items-center justify-center gap-2 shadow-md hover:shadow-lg transform hover:-translate-y-0.5"
            >
                <Plus className="w-5 h-5" />
                إنشاء مجموعة
            </button>
        </div>
      </div>

      <div className="flex items-center gap-2 mb-8 border-b border-gray-200 dark:border-gray-700 pb-2 overflow-x-auto no-scrollbar">
          {[ 
             { id: 'all', label: 'الكل' },
             { id: 'admin', label: 'مجموعات تديرها' },
             { id: 'member', label: 'مجموعات انضممت إليها' },
             { id: 'discover', label: 'اكتشف' }
          ].map((tab) => (
              <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as TabType)}
                  className={`px-5 py-2.5 rounded-lg text-sm font-bold whitespace-nowrap transition relative ${
                      activeTab === tab.id 
                      ? 'text-fb-blue bg-blue-50 dark:bg-blue-900/20' 
                      : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 hover:text-gray-900 dark:hover:text-white'
                  }`}
              >
                  {tab.label}
                  {activeTab === tab.id && <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-fb-blue rounded-full mx-3"></div>}
              </button>
          ))}
      </div>

      {filteredGroups.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6 pb-10">
           {filteredGroups.map(group => (
             <div key={group.id} className="border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 rounded-2xl overflow-hidden flex flex-col group hover:shadow-xl transition-all duration-300 relative transform hover:-translate-y-1">
                {group.isPinned && (
                    <div className="absolute top-3 right-3 z-10 bg-white/90 dark:bg-gray-800/90 p-1.5 rounded-full shadow-md text-fb-blue backdrop-blur-sm" title="مجموعة مثبتة">
                        <Pin className="w-3.5 h-3.5 fill-current" />
                    </div>
                )}

                <div className="h-32 overflow-hidden relative bg-gray-100 dark:bg-gray-700 cursor-pointer" onClick={() => onVisitGroup(group)}>
                   <img src={group.coverUrl} alt={group.name} className="w-full h-full object-cover group-hover:scale-105 transition duration-700" />
                   <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-60"></div>
                   <div className="absolute bottom-3 right-3 text-white flex items-center gap-2">
                       <div className="flex items-center gap-1 text-xs font-bold bg-black/30 px-2 py-1 rounded-md backdrop-blur-md">
                           {group.privacy === 'public' ? <Globe className="w-3 h-3" /> : <Lock className="w-3 h-3" />}
                           <span>{group.privacy === 'public' ? 'عامة' : 'خاصة'}</span>
                       </div>
                   </div>
                </div>
                
                <div className="p-5 flex flex-col flex-1">
                   <div className="flex justify-between items-start mb-3">
                      <div>
                          <h3 
                            className="font-bold text-gray-900 dark:text-white text-lg hover:text-fb-blue cursor-pointer transition line-clamp-1" 
                            onClick={() => onVisitGroup(group)}
                          >
                              {group.name}
                          </h3>
                          <span className="text-xs font-medium text-gray-500 dark:text-gray-400 block mt-1">
                              {!group.isJoined ? 'غير منضم' : group.role === 'admin' ? 'أنت مسؤول' : 'أنت عضو'}
                          </span>
                      </div>
                   </div>
                   
                   <div className="flex items-center gap-4 text-xs font-medium text-gray-500 dark:text-gray-400 mb-5">
                       <span className="flex items-center gap-1.5 bg-gray-50 dark:bg-gray-700/50 px-2 py-1 rounded-md"><Users className="w-3.5 h-3.5" /> {group.membersCount} عضو</span>
                       <span className="flex items-center gap-1.5"><div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div> نشط {group.lastActive}</span>
                   </div>
                   
                   <div className="mt-auto pt-4 border-t border-gray-100 dark:border-gray-700 flex items-center gap-3">
                      {!group.isJoined ? (
                          <button 
                            onClick={(e) => onJoinGroup(group.id, e)} 
                            className="flex-1 bg-blue-50 dark:bg-blue-900/20 hover:bg-blue-100 dark:hover:bg-blue-900/30 text-fb-blue font-bold py-2.5 rounded-lg text-sm transition flex items-center justify-center gap-2"
                          >
                            <Plus className="w-4 h-4" />
                            انضمام
                          </button>
                      ) : (
                          <button 
                            onClick={() => onVisitGroup(group)}
                            className="flex-1 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-800 dark:text-gray-200 font-bold py-2.5 rounded-lg text-sm transition flex items-center justify-center gap-2"
                          >
                            <ExternalLink className="w-4 h-4" />
                            زيارة
                          </button>
                      )}
                      
                      {group.isJoined && (
                          <div className="relative" ref={activeMenuId === group.id ? menuRef : null}>
                              <button 
                                onClick={() => setActiveMenuId(activeMenuId === group.id ? null : group.id)}
                                className={`p-2.5 rounded-lg transition ${activeMenuId === group.id ? 'bg-blue-50 dark:bg-blue-900/30 text-fb-blue' : 'bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-600 dark:text-gray-300'}`}
                              >
                                <MoreHorizontal className="w-5 h-5" />
                              </button>

                              {activeMenuId === group.id && (
                                  <div className={`absolute bottom-full mb-2 w-52 bg-white dark:bg-gray-800 rounded-xl shadow-xl border border-gray-100 dark:border-gray-700 z-50 overflow-hidden animate-fadeIn origin-bottom-left ${dir === 'rtl' ? 'left-0' : 'right-0'}`}>
                                      <button onClick={() => { onMenuAction('pin', group.id); setActiveMenuId(null); }} className="w-full flex items-center gap-3 px-4 py-3 hover:bg-gray-50 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-200 text-sm font-medium transition">
                                          {group.isPinned ? <PinOff className="w-4 h-4" /> : <Pin className="w-4 h-4" />}
                                          {group.isPinned ? 'إلغاء التثبيت' : 'تثبيت المجموعة'}
                                      </button>
                                      
                                      <button onClick={() => { onMenuAction('notification', group.id); setActiveMenuId(null); }} className="w-full flex items-center gap-3 px-4 py-3 hover:bg-gray-50 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-200 text-sm font-medium transition">
                                          {group.notifications ? <BellOff className="w-4 h-4" /> : <Bell className="w-4 h-4" />}
                                          {group.notifications ? 'إيقاف الإشعارات' : 'تفعيل الإشعارات'}
                                      </button>

                                      <div className="border-t border-gray-100 dark:border-gray-700 my-1"></div>

                                      {group.role === 'admin' ? (
                                          <button onClick={() => { onMenuAction('delete', group.id); setActiveMenuId(null); }} className="w-full flex items-center gap-3 px-4 py-3 hover:bg-red-50 dark:hover:bg-red-900/20 text-red-600 dark:text-red-400 text-sm font-medium transition">
                                              <Trash2 className="w-4 h-4" /> حذف المجموعة
                                          </button>
                                      ) : (
                                          <>
                                              <button onClick={() => { onMenuAction('leave', group.id); setActiveMenuId(null); }} className="w-full flex items-center gap-3 px-4 py-3 hover:bg-orange-50 dark:hover:bg-orange-900/20 text-orange-600 dark:text-orange-400 text-sm font-medium transition">
                                                  <LogOut className="w-4 h-4" /> مغادرة المجموعة
                                              </button>
                                              <button onClick={() => { onMenuAction('report', group.id); setActiveMenuId(null); }} className="w-full flex items-center gap-3 px-4 py-3 hover:bg-gray-50 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-200 text-sm font-medium transition">
                                                  <Flag className="w-4 h-4" /> إبلاغ
                                              </button>
                                          </>
                                      )}
                                  </div>
                              )}
                          </div>
                      )}
                   </div>
                </div>
             </div>
           ))}
        </div>
      ) : (
        <div className="text-center py-20 text-gray-500 dark:text-gray-400 flex flex-col items-center animate-fadeIn bg-white dark:bg-gray-800 rounded-xl border border-gray-100 dark:border-gray-700">
           <div className="bg-gray-100 dark:bg-gray-700 p-6 rounded-full mb-4">
               <Users className="w-16 h-16 text-gray-300 dark:text-gray-500" />
           </div>
           <h3 className="text-xl font-bold text-gray-800 dark:text-gray-200 mb-2">لا توجد مجموعات</h3>
           <p className="text-sm max-w-xs mx-auto mb-6">لم يتم العثور على مجموعات تطابق بحثك. جرب كلمات مفتاحية مختلفة أو استكشف مجموعات جديدة.</p>
           {activeTab !== 'all' && (
               <button onClick={() => setActiveTab('all')} className="bg-fb-blue text-white px-6 py-2.5 rounded-full font-bold shadow-md hover:bg-blue-700 transition">
                   عرض كل المجموعات
               </button>
           )}
        </div>
      )}
    </>
  );
};

export default GroupList;
