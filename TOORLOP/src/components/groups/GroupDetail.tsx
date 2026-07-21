
import React, { useRef, useState, useEffect, useMemo } from 'react';
import { 
  ArrowRight, ArrowLeft, Camera, Globe, Lock, Plus, Check, ChevronDown, 
  LogOut, UserPlus, MoreHorizontal, PinOff, Pin, BellOff, Bell, Link as LinkIcon, 
  Edit3, Trash2, Flag, Grid, Info, Users, Image as ImageIcon, Video, FileText, 
  Shield, BarChart3, Calendar, UserCog, MessageCircle, Play, Upload, Clock,
  Search, Download, CheckCircle, X, ThumbsUp, Share2, Send, Smile, MapPin
} from 'lucide-react';
import { Group, GroupFile, GroupEvent } from '../../data/groupsData';
import { Post, User, GroupPageTab } from '../../types';
import CreatePost from '../CreatePost';
import PostCard from '../PostCard';
import { useLanguage } from '../../context/LanguageContext';
import GroupAdminDashboard from './GroupAdminDashboard';
import { CreateGroupEventModal } from './GroupModals';

interface GroupDetailProps {
  viewingGroup: Group;
  currentUser: User;
  groupPosts: Post[];
  activeGroupTab: GroupPageTab;
  setActiveGroupTab: (tab: GroupPageTab) => void;
  onBack: () => void;
  onJoin: (id: string, e?: React.MouseEvent) => void;
  onLeave: (id: string) => void;
  onMenuAction: (action: any, id: string) => void;
  onCoverChangeMain: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onCreatePost: (content: string, image?: string) => void;
  onPostTogglePin: (postId: string) => void;
  onPostDelete: (postId: string) => void;
  onPostLike: (postId: string) => void;
  onPostSave: (post: Post) => void;
  onPostCopyLink: (link: string) => void;
  onMediaClick: (url: string, type: 'image' | 'video', postId?: string) => void;
  onMediaUpload: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onEditGroup: () => void;
  onInviteClick: () => void;
  onManageMembers: () => void;
  onRemoveMember: (id: string) => void;
  onPostComment?: (postId: string, text: string) => void;
  onDeletePostComment?: (postId: string, commentId: string) => void;
  onLikePostComment?: (postId: string, commentId: string) => void;
}

const GroupDetail: React.FC<GroupDetailProps> = ({
  viewingGroup, currentUser, groupPosts, activeGroupTab, setActiveGroupTab,
  onBack, onJoin, onLeave, onMenuAction, onCoverChangeMain,
  onCreatePost, onPostTogglePin, onPostDelete, onPostLike, onPostSave, onPostCopyLink,
  onMediaClick, onMediaUpload, onEditGroup, onInviteClick, onManageMembers, onRemoveMember,
  onPostComment, onDeletePostComment, onLikePostComment
}) => {
  const { dir } = useLanguage();
  const [showHeaderMenu, setShowHeaderMenu] = useState(false);
  const [showJoinedMenu, setShowJoinedMenu] = useState(false);
  const [groupSearchTerm, setGroupSearchTerm] = useState('');
  
  // --- Admin Dashboard State ---
  const [adminRequests, setAdminRequests] = useState([
      { id: 'req1', name: 'سارة خالد', avatar: 'https://picsum.photos/50/50?random=101', time: 'منذ ساعتين' },
      { id: 'req2', name: 'كريم محمود', avatar: 'https://picsum.photos/50/50?random=102', time: 'منذ 5 ساعات' },
      { id: 'req3', name: 'مستخدم جديد', avatar: 'https://picsum.photos/50/50?random=103', time: 'منذ يوم' }
  ]);

  const [adminReports, setAdminReports] = useState([
      { id: 'rep1', type: 'spam', content: 'منشور مخالف للقواعد', reporter: 'أحمد علي', status: 'pending' },
      { id: 'rep2', type: 'abuse', content: 'تعليق غير لائق', reporter: 'منى زكي', status: 'pending' }
  ]);

  const [adminLogs, setAdminLogs] = useState([
      { id: 'log1', action: 'تغيير صورة الغلاف', admin: 'أنت', time: 'منذ ساعة' },
      { id: 'log2', action: 'إزالة عضو', admin: 'أنت', time: 'منذ يومين' }
  ]);

  // Files & Events State
  const [localFiles, setLocalFiles] = useState<GroupFile[]>(viewingGroup.files || []);
  // Initialize events with an extra 'isInterested' property
  const [localEvents, setLocalEvents] = useState<(GroupEvent & { isInterested?: boolean })[]>(
    (viewingGroup.events || []).map(ev => ({ ...ev, isInterested: false }))
  );
  const [showEventModal, setShowEventModal] = useState(false);
  const [isCreatingEvent, setIsCreatingEvent] = useState(false);

  // Admin Settings State
  const [requirePostApproval, setRequirePostApproval] = useState(false);
  const [adminNotifications, setAdminNotifications] = useState(true);

  // Notification for local actions
  const [localNotification, setLocalNotification] = useState<{msg: string, type: 'success' | 'info'} | null>(null);

  const headerMenuRef = useRef<HTMLDivElement>(null);
  const joinedMenuRef = useRef<HTMLDivElement>(null);
  const groupCoverInputMainRef = useRef<HTMLInputElement>(null);
  const mediaUploadInputRef = useRef<HTMLInputElement>(null);
  const fileUploadInputRef = useRef<HTMLInputElement>(null);

  // Derived Media for Group Tabs
  const groupPhotos = useMemo(() => groupPosts.filter(p => p.image && !p.image.startsWith('data:video') && !p.image.endsWith('.mp4')), [groupPosts]);
  const groupVideos = useMemo(() => groupPosts.filter(p => p.image && (p.image.startsWith('data:video') || p.image.endsWith('.mp4'))), [groupPosts]);

  // Filter posts based on in-group search
  const filteredPosts = useMemo(() => {
      if (!groupSearchTerm.trim()) return groupPosts;
      return groupPosts.filter(p => p.content.toLowerCase().includes(groupSearchTerm.toLowerCase()));
  }, [groupPosts, groupSearchTerm]);

  useEffect(() => {
    setLocalFiles(viewingGroup.files || []);
    // Reset events when group changes
    setLocalEvents((viewingGroup.events || []).map(ev => ({ ...ev, isInterested: false })));
  }, [viewingGroup]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (headerMenuRef.current && !headerMenuRef.current.contains(event.target as Node)) {
        setShowHeaderMenu(false);
      }
      if (joinedMenuRef.current && !joinedMenuRef.current.contains(event.target as Node)) {
        setShowJoinedMenu(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const showLocalNotification = (msg: string, type: 'success' | 'info' = 'success') => {
      setLocalNotification({ msg, type });
      setTimeout(() => setLocalNotification(null), 3000);
  };

  // --- Admin Actions ---
  const handleApproveRequest = (reqId: string, name: string) => {
      setAdminRequests(prev => prev.filter(r => r.id !== reqId));
      setAdminLogs(prev => [{ id: `log_${Date.now()}`, action: `الموافقة على انضمام ${name}`, admin: 'أنت', time: 'الآن' }, ...prev]);
      showLocalNotification(`تمت الموافقة على ${name}`, 'success');
  };

  const handleRejectRequest = (reqId: string, name: string) => {
      setAdminRequests(prev => prev.filter(r => r.id !== reqId));
      setAdminLogs(prev => [{ id: `log_${Date.now()}`, action: `رفض انضمام ${name}`, admin: 'أنت', time: 'الآن' }, ...prev]);
      showLocalNotification(`تم رفض طلب ${name}`, 'info');
  };

  const handleResolveReport = (repId: string, action: 'keep' | 'delete') => {
      setAdminReports(prev => prev.filter(r => r.id !== repId));
      const actionText = action === 'keep' ? 'تجاهل البلاغ' : 'حذف المحتوى المخالف';
      setAdminLogs(prev => [{ id: `log_${Date.now()}`, action: actionText, admin: 'أنت', time: 'الآن' }, ...prev]);
      showLocalNotification(action === 'keep' ? 'تم تجاهل البلاغ' : 'تم حذف المحتوى بنجاح', 'success');
  };

  const handleLogAction = (action: string) => {
      setAdminLogs(prev => [{ id: `log_${Date.now()}`, action, admin: 'أنت', time: 'الآن' }, ...prev]);
  };

  const getBadgeColor = (badge: string) => {
      switch(badge) {
          case 'Admin': return 'bg-red-100 text-red-600 dark:bg-red-900/30 dark:text-red-400';
          case 'Moderator': return 'bg-green-100 text-green-600 dark:bg-green-900/30 dark:text-green-400';
          case 'Top Contributor': return 'bg-yellow-100 text-yellow-600 dark:bg-yellow-900/30 dark:text-yellow-400';
          default: return 'bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-300';
      }
  };

  const getActiveTabClass = () => {
      if (viewingGroup.themeColor === 'purple') return 'border-purple-600 text-purple-600';
      if (viewingGroup.themeColor === 'blue') return 'border-blue-600 text-blue-600';
      return 'border-emerald-700 text-emerald-700'; // Default
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (!file) return;

      const newFile: GroupFile = {
          id: `file_${Date.now()}`,
          name: file.name,
          type: file.name.split('.').pop() as any || 'doc',
          size: (file.size / 1024 / 1024).toFixed(2) + ' MB',
          uploadedBy: currentUser.name,
          date: new Date().toISOString().split('T')[0],
          url: URL.createObjectURL(file)
      };

      setLocalFiles(prev => [newFile, ...prev]);
      showLocalNotification('تم رفع الملف بنجاح');
      e.target.value = '';
  };

  const handleFileDownload = (file: GroupFile) => {
      const link = document.createElement('a');
      link.href = file.url;
      link.download = file.name;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      showLocalNotification(`جاري تحميل ${file.name}...`);
  };

  const handleCreateEvent = (eventData: any) => {
      setIsCreatingEvent(true);
      setTimeout(() => {
          const newEvent: GroupEvent & { isInterested: boolean } = {
              id: `ge_${Date.now()}`,
              title: eventData.title,
              date: eventData.date,
              location: eventData.location,
              description: eventData.description,
              attendees: 1,
              isInterested: true
          };
          setLocalEvents(prev => [newEvent, ...prev]);
          showLocalNotification('تم إنشاء المناسبة بنجاح');
          setIsCreatingEvent(false);
          setShowEventModal(false);
      }, 1000);
  };

  const toggleEventInterest = (eventId: string) => {
      setLocalEvents(prev => prev.map(ev => {
          if(ev.id === eventId) {
             const newInterest = !ev.isInterested;
             if (newInterest) showLocalNotification('تم تسجيل اهتمامك بالمناسبة', 'success');
             else showLocalNotification('تم إلغاء الاهتمام', 'info');
             return { ...ev, isInterested: newInterest, attendees: ev.attendees + (newInterest ? 1 : -1) };
          }
          return ev;
      }));
  }

  return (
    <div className="animate-fadeIn relative">
        {localNotification && (
             <div className="fixed bottom-10 right-10 z-[200] bg-gray-900 text-white px-4 py-2 rounded-lg shadow-lg animate-bounce-in flex items-center gap-2">
                 <CheckCircle className="w-5 h-5 text-green-400" />
                 {localNotification.msg}
             </div>
        )}

        <input 
          type="file" 
          ref={mediaUploadInputRef} 
          className="hidden" 
          accept="image/*,video/*"
          onChange={onMediaUpload} 
        />

        {/* Back Button */}
        <div className="mb-4">
            <button 
              onClick={onBack} 
              className="flex items-center gap-2 text-gray-500 hover:text-fb-blue hover:bg-gray-100 dark:hover:bg-gray-700 px-3 py-2 rounded-lg transition font-bold text-sm"
            >
                {dir === 'rtl' ? <ArrowRight className="w-5 h-5" /> : <ArrowLeft className="w-5 h-5" />}
                العودة للمجموعات
            </button>
        </div>

        {/* Cover Image */}
        <div className="w-full h-56 md:h-96 bg-gray-200 dark:bg-gray-700 rounded-2xl overflow-hidden relative group shadow-sm">
            <img 
              key={viewingGroup.coverUrl}
              src={viewingGroup.coverUrl} 
              alt={viewingGroup.name} 
              className="w-full h-full object-cover" 
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"></div>
            
            {/* Direct Cover Edit Button */}
            {viewingGroup.role === 'admin' && (
                <>
                  <button 
                      onClick={() => groupCoverInputMainRef.current?.click()}
                      className="absolute bottom-4 left-4 bg-white/90 hover:bg-white text-gray-800 px-4 py-2 rounded-lg shadow-lg font-bold text-sm flex items-center gap-2 transition z-10 backdrop-blur-sm"
                  >
                      <Camera className="w-4 h-4" />
                      تغيير الغلاف
                  </button>
                  <input type="file" ref={groupCoverInputMainRef} className="hidden" accept="image/*" onChange={onCoverChangeMain} />
                </>
            )}
        </div>

        {/* Group Info Header */}
        <div className="mt-6 mb-4 px-2">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
                <div>
                    <h1 className="text-4xl font-extrabold text-gray-900 dark:text-white mb-2 tracking-tight">{viewingGroup.name}</h1>
                    <div className="flex items-center gap-3 text-gray-500 dark:text-gray-400 text-sm font-medium">
                        <div className="flex items-center gap-1">
                            {viewingGroup.privacy === 'public' ? <Globe className="w-4 h-4" /> : <Lock className="w-4 h-4" />}
                            <span>{viewingGroup.privacy === 'public' ? 'مجموعة عامة' : 'مجموعة خاصة'}</span>
                        </div>
                        <span className="w-1 h-1 bg-gray-300 dark:bg-gray-600 rounded-full"></span>
                        <span className="font-bold text-gray-900 dark:text-white">{viewingGroup.membersCount}</span> عضو
                    </div>
                </div>

                <div className="flex gap-3 w-full md:w-auto mb-4 md:mb-0">
                    {!viewingGroup.isJoined ? (
                        <button 
                          onClick={(e) => onJoin(viewingGroup.id, e)} 
                          className="flex-1 md:flex-none bg-fb-blue text-white px-8 py-3 rounded-lg font-bold hover:bg-blue-700 transition shadow-md flex items-center justify-center gap-2"
                        >
                            <Plus className="w-5 h-5" /> انضمام للمجموعة
                        </button>
                    ) : (
                        <div className="flex gap-3 w-full">
                            {/* "Joined" Button with Dropdown for Leave */}
                            <div className="relative" ref={joinedMenuRef}>
                                <button 
                                  onClick={() => setShowJoinedMenu(!showJoinedMenu)}
                                  className="flex-1 md:flex-none bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-white px-6 py-3 rounded-lg font-bold hover:bg-gray-200 dark:hover:bg-gray-600 transition flex items-center justify-center gap-2"
                                >
                                    <Check className="w-5 h-5" /> 
                                    <span>تم الانضمام</span>
                                    <ChevronDown className="w-4 h-4" />
                                </button>
                                {showJoinedMenu && (
                                    <div className={`absolute top-full mt-2 w-52 bg-white dark:bg-gray-800 rounded-lg shadow-xl border border-gray-100 dark:border-gray-700 z-50 overflow-hidden animate-fadeIn origin-top-left ${dir === 'rtl' ? 'right-0' : 'left-0'}`}>
                                        <button 
                                            onClick={() => { onLeave(viewingGroup.id); setShowJoinedMenu(false); }}
                                            className="w-full flex items-center gap-3 px-4 py-3 hover:bg-red-50 dark:hover:bg-red-900/20 text-red-600 dark:text-red-400 text-sm font-medium transition"
                                        >
                                            <LogOut className="w-4 h-4" /> مغادرة المجموعة
                                        </button>
                                    </div>
                                )}
                            </div>

                            <button 
                              onClick={onInviteClick}
                              className="flex-1 md:flex-none bg-fb-blue text-white px-6 py-3 rounded-lg font-bold hover:bg-blue-700 transition flex items-center justify-center gap-2 shadow-sm"
                            >
                                <UserPlus className="w-5 h-5" /> دعوة
                            </button>
                        </div>
                    )}
                    
                    {/* Header Menu */}
                    <div className="relative" ref={headerMenuRef}>
                        <button 
                          onClick={() => setShowHeaderMenu(!showHeaderMenu)}
                          className={`bg-gray-100 dark:bg-gray-700 p-3 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300 transition ${showHeaderMenu ? 'bg-gray-200 dark:bg-gray-600' : ''}`}
                        >
                            <MoreHorizontal className="w-5 h-5" />
                        </button>
                        
                        {showHeaderMenu && (
                            <div className={`absolute top-full mt-2 w-60 bg-white dark:bg-gray-800 rounded-lg shadow-xl border border-gray-100 dark:border-gray-700 z-50 overflow-hidden animate-fadeIn origin-top-left ${dir === 'rtl' ? 'left-0' : 'right-0'}`}>
                                <button onClick={() => { onMenuAction('pin', viewingGroup.id); setShowHeaderMenu(false); }} className="w-full flex items-center gap-3 px-4 py-3 hover:bg-gray-50 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-200 text-sm font-medium transition">
                                    {viewingGroup.isPinned ? <PinOff className="w-4 h-4" /> : <Pin className="w-4 h-4" />}
                                    {viewingGroup.isPinned ? 'إلغاء التثبيت' : 'تثبيت المجموعة'}
                                </button>
                                
                                <button onClick={() => { onMenuAction('notification', viewingGroup.id); setShowHeaderMenu(false); }} className="w-full flex items-center gap-3 px-4 py-3 hover:bg-gray-50 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-200 text-sm font-medium transition">
                                    {viewingGroup.notifications ? <BellOff className="w-4 h-4" /> : <Bell className="w-4 h-4" />}
                                    {viewingGroup.notifications ? 'إيقاف الإشعارات' : 'تفعيل الإشعارات'}
                                </button>

                                <button onClick={() => { onMenuAction('copy', viewingGroup.id); setShowHeaderMenu(false); }} className="w-full flex items-center gap-3 px-4 py-3 hover:bg-gray-50 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-200 text-sm font-medium transition">
                                    <LinkIcon className="w-4 h-4" /> نسخ الرابط
                                </button>

                                {viewingGroup.role === 'admin' && (
                                    <button onClick={() => { onEditGroup(); setShowHeaderMenu(false); }} className="w-full flex items-center gap-3 px-4 py-3 hover:bg-gray-50 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-200 text-sm font-medium transition">
                                        <Edit3 className="w-4 h-4" /> تعديل المجموعة
                                    </button>
                                )}

                                <div className="border-t border-gray-100 dark:border-gray-700 my-1"></div>

                                {viewingGroup.role === 'admin' ? (
                                    <button onClick={() => { onMenuAction('delete', viewingGroup.id); setShowHeaderMenu(false); }} className="w-full flex items-center gap-3 px-4 py-3 hover:bg-red-50 dark:hover:bg-red-900/20 text-red-600 dark:text-red-400 text-sm font-medium transition">
                                        <Trash2 className="w-4 h-4" /> حذف المجموعة
                                    </button>
                                ) : (
                                    <>
                                        <button onClick={() => { onMenuAction('leave', viewingGroup.id); setShowHeaderMenu(false); }} className="w-full flex items-center gap-3 px-4 py-3 hover:bg-orange-50 dark:hover:bg-orange-900/20 text-orange-600 dark:text-orange-400 text-sm font-medium transition">
                                            <LogOut className="w-4 h-4" /> مغادرة المجموعة
                                        </button>
                                        <button onClick={() => { onMenuAction('report', viewingGroup.id); setShowHeaderMenu(false); }} className="w-full flex items-center gap-3 px-4 py-3 hover:bg-gray-50 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-200 text-sm font-medium transition">
                                            <Flag className="w-4 h-4" /> إبلاغ
                                        </button>
                                    </>
                                )}
                            </div>
                        )}
                    </div>
                </div>
            </div>
            
            {/* Internal Navigation Tabs */}
            <div className="flex items-center gap-4 mt-6 px-2 border-b border-gray-200 dark:border-gray-700 overflow-x-auto no-scrollbar">
               {[
                 { id: 'posts', label: 'المنشورات', icon: Grid },
                 { id: 'about', label: 'حول', icon: Info },
                 { id: 'members', label: 'الأعضاء', icon: Users },
                 { id: 'files', label: 'الملفات', icon: FileText },
                 { id: 'events', label: 'المناسبات', icon: Calendar },
                 { id: 'photos', label: 'الوسائط', icon: ImageIcon },
                 { id: 'videos', label: 'مقاطع الفيديو', icon: Video },
                 ...(viewingGroup.role === 'admin' ? [{ id: 'admin', label: 'إدارة المجموعة', icon: Shield }] : [])
               ].map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveGroupTab(tab.id as GroupPageTab)}
                    className={`flex items-center gap-2 px-6 py-4 font-bold text-sm border-b-[3px] transition whitespace-nowrap ${
                      activeGroupTab === tab.id
                        ? getActiveTabClass()
                        : 'border-transparent text-gray-500 hover:bg-gray-50 dark:text-gray-400 dark:hover:bg-gray-800 rounded-t-lg'
                    }`}
                  >
                    <tab.icon className="w-4 h-4" />
                    {tab.label}
                  </button>
               ))}
            </div>
        </div>

        {/* Content Tabs */}
        <div className="mt-6">
            {/* POSTS TAB */}
            {activeGroupTab === 'posts' && (
                <div className="flex flex-col md:flex-row gap-6">
                    {/* Left Sidebar Info */}
                    <div className="w-full md:w-1/3 space-y-4">
                        <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-2xl p-5 shadow-sm">
                            <h3 className="font-bold text-lg mb-4 text-gray-900 dark:text-white">حول المجموعة</h3>
                            <p className="text-gray-600 dark:text-gray-300 text-sm leading-relaxed mb-5">
                                {viewingGroup.description || 'لا يوجد وصف لهذه المجموعة.'}
                            </p>
                            <div className="space-y-4">
                                <div className="flex items-center gap-3 text-gray-700 dark:text-gray-300">
                                    <Globe className="w-5 h-5 text-gray-400" />
                                    <div>
                                        <div className="font-bold text-gray-900 dark:text-white">{viewingGroup.privacy === 'public' ? 'عامة' : 'خاصة'}</div>
                                        <div className="text-xs text-gray-500">{viewingGroup.privacy === 'public' ? 'يمكن لأي شخص رؤية أعضاء المجموعة وما ينشرونه.' : 'يمكن للأعضاء فقط رؤية المنشورات.'}</div>
                                    </div>
                                </div>
                                <div className="flex items-center gap-3 text-gray-700 dark:text-gray-300">
                                    <Clock className="w-5 h-5 text-gray-400" />
                                    <div>
                                        <div className="font-bold text-gray-900 dark:text-white">التاريخ</div>
                                        <div className="text-xs text-gray-500">تم إنشاء المجموعة اليوم</div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Rules Widget */}
                        {viewingGroup.rules && viewingGroup.rules.length > 0 && (
                            <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-2xl p-5 shadow-sm">
                                <h3 className="font-bold text-lg mb-4 text-gray-900 dark:text-white flex items-center gap-2">
                                    <Shield className="w-5 h-5 text-fb-blue" />
                                    قواعد المجموعة
                                </h3>
                                <ul className="space-y-3">
                                    {viewingGroup.rules.slice(0, 3).map((rule, idx) => (
                                        <li key={idx} className="text-sm text-gray-600 dark:text-gray-300 border-b border-gray-100 dark:border-gray-700 last:border-0 pb-2">
                                            <span className="font-bold text-fb-blue ml-2">{idx + 1}.</span>
                                            {rule}
                                        </li>
                                    ))}
                                </ul>
                                <button onClick={() => setActiveGroupTab('about')} className="text-xs text-fb-blue font-bold mt-2 hover:underline w-full text-center">عرض الكل</button>
                            </div>
                        )}
                        
                        {/* Related Groups Widget */}
                        <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-2xl p-5 shadow-sm">
                             <h3 className="font-bold text-lg mb-4 text-gray-900 dark:text-white">مجموعات مقترحة</h3>
                             <div className="space-y-4">
                                 {[1,2].map(i => (
                                     <div key={i} className="flex items-center gap-3">
                                         <img src={`https://picsum.photos/60/60?random=${i+900}`} className="w-12 h-12 rounded-lg object-cover" alt="Group" />
                                         <div>
                                             <div className="font-bold text-sm text-gray-900 dark:text-white truncate w-32">مجموعة تقنية {i}</div>
                                             <div className="text-xs text-gray-500">12K عضو</div>
                                             <button className="text-xs bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 text-gray-800 dark:text-white px-2 py-1 rounded mt-1 transition">انضمام</button>
                                         </div>
                                     </div>
                                 ))}
                             </div>
                        </div>
                    </div>

                    {/* Right Feed */}
                    <div className="w-full md:w-2/3">
                        <CreatePost currentUser={currentUser} onPostCreate={onCreatePost} />

                        {/* In-Group Search */}
                        <div className="bg-white dark:bg-gray-800 p-3 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 mb-4 flex items-center gap-2">
                            <Search className="w-5 h-5 text-gray-400" />
                            <input 
                                type="text" 
                                placeholder="بحث في منشورات المجموعة..." 
                                className="bg-transparent flex-1 outline-none text-sm text-gray-800 dark:text-white placeholder-gray-500"
                                value={groupSearchTerm}
                                onChange={(e) => setGroupSearchTerm(e.target.value)}
                            />
                        </div>

                        <div className="space-y-4 mt-4">
                            {filteredPosts.length > 0 ? (
                                filteredPosts.map(post => (
                                    <PostCard 
                                      key={post.id} 
                                      post={post} 
                                      currentUser={currentUser} 
                                      onTogglePin={onPostTogglePin}
                                      onDelete={onPostDelete}
                                      onToggleSave={onPostSave}
                                      onMediaClick={(url, type) => onMediaClick(url, type, post.id)}
                                      onCopyLink={onPostCopyLink}
                                      onLike={onPostLike}
                                      onComment={onPostComment}
                                      onDeleteComment={onDeletePostComment}
                                      onLikeComment={onLikePostComment}
                                    />
                                ))
                            ) : (
                                <div className="text-center py-12 text-gray-500 dark:text-gray-400 bg-white dark:bg-gray-800 rounded-xl border border-gray-100 dark:border-gray-700">
                                    <div className="bg-gray-100 dark:bg-gray-700 p-4 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-3">
                                        <Grid className="w-8 h-8 text-gray-400" />
                                    </div>
                                    <h3 className="font-bold text-lg text-gray-800 dark:text-gray-200 mb-1">لا توجد منشورات</h3>
                                    <p className="text-sm">ابدأ النقاش وكن أول من ينشر!</p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            )}

            {/* ADMIN TAB */}
            {activeGroupTab === 'admin' && (
                <GroupAdminDashboard 
                  viewingGroup={viewingGroup}
                  currentUser={currentUser}
                  groupPosts={groupPosts}
                  adminRequests={adminRequests}
                  adminReports={adminReports}
                  adminLogs={adminLogs}
                  requirePostApproval={requirePostApproval}
                  setRequirePostApproval={setRequirePostApproval}
                  adminNotifications={adminNotifications}
                  setAdminNotifications={setAdminNotifications}
                  onApproveRequest={handleApproveRequest}
                  onRejectRequest={handleRejectRequest}
                  onResolveReport={handleResolveReport}
                  onEditGroup={onEditGroup}
                  showLocalNotification={showLocalNotification}
                  logAction={handleLogAction}
                />
            )}

            {/* FILES TAB */}
            {activeGroupTab === 'files' && (
                <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700 animate-fadeIn">
                    <div className="flex justify-between items-center mb-6">
                        <h3 className="text-xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
                            <FileText className="w-6 h-6 text-fb-blue" />
                            ملفات المجموعة
                        </h3>
                        <div>
                             <input 
                                type="file" 
                                ref={fileUploadInputRef} 
                                className="hidden" 
                                onChange={handleFileUpload} 
                             />
                             <button 
                                onClick={() => fileUploadInputRef.current?.click()}
                                className="px-4 py-2 bg-fb-blue text-white rounded-lg font-bold text-sm hover:bg-blue-700 flex items-center gap-2 shadow-sm"
                             >
                                <Upload className="w-4 h-4" /> رفع ملف
                             </button>
                        </div>
                    </div>
                    {localFiles && localFiles.length > 0 ? (
                        <div className="space-y-2">
                            {localFiles.map(file => (
                                <div key={file.id} className="flex items-center justify-between p-4 border border-gray-100 dark:border-gray-700 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-700/50 transition group">
                                    <div className="flex items-center gap-4">
                                        <div className="bg-gray-100 dark:bg-gray-700 p-3 rounded-lg text-gray-500">
                                            <FileText className="w-6 h-6" />
                                        </div>
                                        <div>
                                            <div className="font-bold text-gray-900 dark:text-white text-base group-hover:text-fb-blue transition">{file.name}</div>
                                            <div className="text-xs text-gray-500 flex items-center gap-2">
                                                <span className="uppercase">{file.type}</span>
                                                <span>•</span>
                                                <span>{file.size}</span>
                                                <span>•</span>
                                                <span>{file.date}</span>
                                                <span>•</span>
                                                <span>بواسطة {file.uploadedBy}</span>
                                            </div>
                                        </div>
                                    </div>
                                    <button 
                                        onClick={() => handleFileDownload(file)}
                                        className="p-2 text-gray-400 hover:text-fb-blue hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-full transition"
                                        title="تحميل الملف"
                                    >
                                        <Download className="w-5 h-5" />
                                    </button>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="text-center py-10 text-gray-500">
                            <FileText className="w-12 h-12 mx-auto mb-2 opacity-30" />
                            <p>لا توجد ملفات تمت مشاركتها بعد.</p>
                        </div>
                    )}
                </div>
            )}

            {/* EVENTS TAB */}
            {activeGroupTab === 'events' && (
                <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700 animate-fadeIn">
                    <div className="flex justify-between items-center mb-6">
                        <h3 className="text-xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
                            <Calendar className="w-6 h-6 text-fb-blue" />
                            المناسبات
                        </h3>
                        <button 
                            onClick={() => setShowEventModal(true)}
                            className="px-4 py-2 bg-fb-blue text-white rounded-lg font-bold text-sm hover:bg-blue-700 flex items-center gap-2"
                        >
                            <Plus className="w-4 h-4" /> إنشاء مناسبة
                        </button>
                    </div>
                    {localEvents && localEvents.length > 0 ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {localEvents.map(event => (
                                <div key={event.id} className="border border-gray-200 dark:border-gray-700 rounded-xl overflow-hidden hover:shadow-md transition bg-white dark:bg-gray-800">
                                    <div className="h-32 bg-gradient-to-r from-blue-500 to-purple-600 relative">
                                        <div className="absolute bottom-3 left-3 bg-white dark:bg-gray-800 px-3 py-1 rounded-lg text-center shadow-sm">
                                            <span className="block text-xs text-red-500 font-bold uppercase">EVENT</span>
                                            <span className="block text-lg font-bold text-gray-900 dark:text-white">{event.date.split('-')[2] || '20'}</span>
                                        </div>
                                    </div>
                                    <div className="p-4">
                                        <h4 className="font-bold text-lg text-gray-900 dark:text-white mb-1 truncate">{event.title}</h4>
                                        <div className="text-sm text-gray-500 dark:text-gray-400 mb-2 flex items-center gap-1">
                                            <Calendar className="w-3 h-3" /> {event.date} • <MapPin className="w-3 h-3" /> {event.location}
                                        </div>
                                        <p className="text-xs text-gray-500 mb-4 line-clamp-2">{event.description}</p>
                                        <div className="flex items-center justify-between">
                                            <div className="text-xs font-medium text-gray-500">{event.attendees} شخص مهتم</div>
                                            <button 
                                                onClick={() => toggleEventInterest(event.id)}
                                                className={`px-4 py-1.5 rounded-lg font-bold transition text-xs ${event.isInterested ? 'bg-green-700 text-white hover:bg-green-800' : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-200 hover:bg-gray-200 dark:hover:bg-gray-600'}`}
                                            >
                                                {event.isInterested ? 'مهتم' : 'مهتم'}
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="text-center py-10 text-gray-500">
                            <Calendar className="w-12 h-12 mx-auto mb-2 opacity-30" />
                            <p>لا توجد مناسبات قادمة.</p>
                        </div>
                    )}
                </div>
            )}

            {/* ABOUT TAB */}
            {activeGroupTab === 'about' && (
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 animate-fadeIn">
                    <div className="lg:col-span-2 space-y-6">
                        <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl border border-gray-200 dark:border-gray-700 shadow-sm">
                            <div className="flex justify-between items-start mb-4 pb-3 border-b border-gray-100 dark:border-gray-700">
                                <h4 className="font-bold text-xl text-gray-900 dark:text-white flex items-center gap-2">
                                    <FileText className="w-6 h-6 text-fb-blue" />
                                    الوصف
                                </h4>
                                {viewingGroup.role === 'admin' && (
                                    <button 
                                      onClick={onEditGroup}
                                      className="text-fb-blue text-sm hover:underline font-bold flex items-center gap-1"
                                    >
                                        <Edit3 className="w-4 h-4" /> تعديل
                                    </button>
                                )}
                            </div>
                            <p className="text-gray-700 dark:text-gray-300 leading-relaxed whitespace-pre-wrap text-base">
                                {viewingGroup.description || 'لا يوجد وصف متاح.'}
                            </p>
                        </div>
                        
                        <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl border border-gray-200 dark:border-gray-700 shadow-sm">
                            <h4 className="font-bold text-xl text-gray-900 dark:text-white mb-5 flex items-center gap-2">
                                <Shield className="w-6 h-6 text-fb-blue" />
                                قواعد المجموعة
                            </h4>
                            <ul className="space-y-4">
                                {(viewingGroup.rules || [
                                    "احترم جميع الأعضاء ولا تستخدم ألفاظاً نابية.",
                                    "يمنع نشر المحتوى الإعلاني أو السبام.",
                                    "احرص على أن تكون المنشورات ذات صلة بموضوع المجموعة.",
                                    "يمنع نشر المعلومات الشخصية للآخرين."
                                ]).map((rule, i) => (
                                    <li key={i} className="flex gap-4 text-[15px] text-gray-700 dark:text-gray-300 bg-gray-50 dark:bg-gray-700/30 p-4 rounded-xl">
                                        <span className="font-bold text-fb-blue bg-blue-100 dark:bg-blue-900/50 w-7 h-7 flex items-center justify-center rounded-full text-sm flex-shrink-0">{i+1}</span>
                                        <span>{rule}</span>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </div>
                    
                    <div className="space-y-6">
                        <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl border border-gray-200 dark:border-gray-700 shadow-sm">
                            <h4 className="font-bold text-lg text-gray-900 dark:text-white mb-5 flex items-center gap-2">
                                <BarChart3 className="w-5 h-5 text-fb-blue" />
                                نشاط المجموعة
                            </h4>
                            <div className="space-y-5">
                                <div className="flex items-center gap-4">
                                    <div className="bg-blue-50 dark:bg-blue-900/20 p-2.5 rounded-full text-fb-blue"><Grid className="w-5 h-5" /></div>
                                    <div className="flex flex-col">
                                        <span className="font-bold text-gray-900 dark:text-white text-lg">{groupPosts.length}</span>
                                        <span className="text-xs font-medium text-gray-500 dark:text-gray-400">إجمالي المنشورات</span>
                                    </div>
                                </div>
                                <div className="flex items-center gap-4">
                                    <div className="bg-purple-50 dark:bg-purple-900/20 p-2.5 rounded-full text-purple-600"><Users className="w-5 h-5" /></div>
                                    <div className="flex flex-col">
                                        <span className="font-bold text-gray-900 dark:text-white text-lg">{viewingGroup.membersCount}</span>
                                        <span className="text-xs font-medium text-gray-500 dark:text-gray-400">عضو في المجموعة</span>
                                    </div>
                                </div>
                                <div className="flex items-center gap-4">
                                    <div className="bg-orange-50 dark:bg-orange-900/20 p-2.5 rounded-full text-orange-600"><Calendar className="w-5 h-5" /></div>
                                    <div className="flex flex-col">
                                        <span className="font-bold text-gray-900 dark:text-white text-sm">تاريخ الإنشاء</span>
                                        <span className="text-xs font-medium text-gray-500 dark:text-gray-400">2023</span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl border border-gray-200 dark:border-gray-700 shadow-sm">
                            <div className="flex justify-between items-center mb-4">
                                <h4 className="font-bold text-lg text-gray-900 dark:text-white flex items-center gap-2">
                                    <UserCog className="w-5 h-5 text-fb-blue" />
                                    المسؤولون
                                </h4>
                                <button onClick={() => setActiveGroupTab('members')} className="text-xs text-fb-blue hover:underline font-bold">عرض الكل</button>
                            </div>
                            <div className="flex flex-wrap gap-2">
                                {viewingGroup.membersList?.filter(m => m.role === 'admin' || m.role === 'moderator').slice(0, 5).map(admin => (
                                    <div key={admin.userId} className="relative group cursor-pointer" title={admin.name}>
                                        <img src={admin.avatar} alt={admin.name} className="w-12 h-12 rounded-full border-2 border-white dark:border-gray-700 object-cover" />
                                        <div className="absolute -bottom-1 -right-1 bg-green-500 text-white text-[8px] p-0.5 rounded-full border-2 border-white">
                                            <Shield className="w-2.5 h-2.5 fill-current" />
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* MEMBERS TAB */}
            {activeGroupTab === 'members' && (
                <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700">
                    <div className="flex justify-between items-center mb-8">
                        <h3 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
                            <Users className="w-6 h-6 text-fb-blue" />
                            الأعضاء ({viewingGroup.membersCount})
                        </h3>
                        {viewingGroup.role === 'admin' && (
                            <button 
                              onClick={onManageMembers}
                              className="px-5 py-2.5 bg-blue-50 dark:bg-blue-900/20 text-fb-blue rounded-lg font-bold hover:bg-blue-100 dark:hover:bg-blue-900/30 transition flex items-center gap-2"
                            >
                                <UserCog className="w-5 h-5" /> إدارة الأعضاء
                            </button>
                        )}
                    </div>
                    
                    <div className="mb-10">
                        <h4 className="text-sm font-bold text-gray-500 dark:text-gray-400 uppercase mb-4 px-1">المسؤولون والمشرفون</h4>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {viewingGroup.role === 'admin' && (
                                <div className="flex items-center justify-between p-4 border border-gray-200 dark:border-gray-700 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-700/50 transition">
                                    <div className="flex items-center gap-4">
                                        <img src={currentUser.avatar} alt={currentUser.name} className="w-12 h-12 rounded-full object-cover" />
                                        <div>
                                            <div className="font-bold text-base text-gray-900 dark:text-white flex items-center gap-2">
                                                {currentUser.name}
                                                <span className="text-[10px] bg-red-100 text-red-600 px-1.5 py-0.5 rounded border border-red-200">Admin</span>
                                            </div>
                                            <div className="text-xs text-fb-blue font-bold bg-blue-50 dark:bg-blue-900/20 px-2 py-0.5 rounded-full w-fit mt-1">مسؤول (أنت)</div>
                                        </div>
                                    </div>
                                </div>
                            )}
                            
                            {viewingGroup.membersList?.filter(m => m.role === 'admin' || m.role === 'moderator').map(member => (
                                <div key={member.userId} className="flex items-center justify-between p-4 border border-gray-200 dark:border-gray-700 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-700/50 transition">
                                    <div className="flex items-center gap-4">
                                        <img src={member.avatar} alt={member.name} className="w-12 h-12 rounded-full object-cover" />
                                        <div>
                                            <div className="font-bold text-base text-gray-900 dark:text-white flex items-center gap-2">
                                                {member.name}
                                                {member.badges?.map(badge => (
                                                    <span key={badge} className={`text-[10px] px-1.5 py-0.5 rounded border ${getBadgeColor(badge)}`}>{badge}</span>
                                                ))}
                                            </div>
                                            <div className="text-xs text-gray-500 font-medium mt-1">
                                                {member.role === 'admin' ? 'مسؤول' : 'مشرف'}
                                            </div>
                                        </div>
                                    </div>
                                    {viewingGroup.role === 'admin' && (
                                        <button 
                                            onClick={() => onRemoveMember(member.userId)}
                                            className="text-gray-400 hover:text-red-500 p-2 rounded-full hover:bg-red-50 dark:hover:bg-red-900/20 transition"
                                            title="إزالة"
                                        >
                                            <Trash2 className="w-5 h-5" />
                                        </button>
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>

                    <div>
                        <h4 className="text-sm font-bold text-gray-500 dark:text-gray-400 uppercase mb-4 px-1">أعضاء آخرون</h4>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                            {viewingGroup.membersList?.filter(m => m.role === 'member').map(member => (
                                <div key={member.userId} className="flex items-center justify-between p-4 border border-gray-200 dark:border-gray-700 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-700/50 transition">
                                    <div className="flex items-center gap-3">
                                        <img src={member.avatar} alt={member.name} className="w-10 h-10 rounded-full object-cover" />
                                        <div>
                                            <div className="font-bold text-sm text-gray-900 dark:text-white flex items-center gap-1">
                                                {member.name}
                                                {member.badges?.map(badge => (
                                                    <span key={badge} className={`text-[8px] px-1 py-0.5 rounded ${getBadgeColor(badge)}`}>{badge}</span>
                                                ))}
                                            </div>
                                            <div className="text-xs text-gray-500 mt-0.5">منذ {member.joinedAt}</div>
                                        </div>
                                    </div>
                                    <div className="flex gap-1">
                                        <button className="text-gray-400 hover:text-fb-blue p-2 rounded-full hover:bg-blue-50 dark:hover:bg-blue-900/20 transition">
                                            <MessageCircle className="w-4 h-4" />
                                        </button>
                                        {viewingGroup.role === 'admin' && (
                                            <button 
                                                onClick={() => onRemoveMember(member.userId)}
                                                className="text-gray-400 hover:text-red-500 p-2 rounded-full hover:bg-red-50 dark:hover:bg-red-900/20 transition"
                                                title="إزالة"
                                            >
                                                <Trash2 className="w-4 h-4" />
                                            </button>
                                        )}
                                    </div>
                                </div>
                            ))}
                            {(!viewingGroup.membersList || viewingGroup.membersList.filter(m => m.role === 'member').length === 0) && Array.from({ length: 4 }).map((_, i) => (
                                <div key={i} className="flex items-center justify-between p-4 border border-gray-200 dark:border-gray-700 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-700/50 transition">
                                    <div className="flex items-center gap-3">
                                        <img src={`https://picsum.photos/50/50?random=${i + 100}`} alt="Member" className="w-10 h-10 rounded-full" />
                                        <div>
                                            <div className="font-bold text-sm text-gray-900 dark:text-white">عضو {i + 1}</div>
                                            <div className="text-xs text-gray-500 mt-0.5">انضم منذ شهر</div>
                                        </div>
                                    </div>
                                    <button className="text-gray-400 hover:text-fb-blue p-2 rounded-full hover:bg-blue-50 dark:hover:bg-blue-900/20 transition">
                                        <MessageCircle className="w-4 h-4" />
                                    </button>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            )}

            {/* PHOTOS TAB */}
            {activeGroupTab === 'photos' && (
                <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700">
                    <div className="flex justify-between items-center mb-6">
                        <h3 className="text-xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
                            <ImageIcon className="w-5 h-5 text-fb-blue" /> الصور
                        </h3>
                        <button 
                          onClick={() => mediaUploadInputRef.current?.click()}
                          className="px-5 py-2.5 bg-fb-blue text-white rounded-lg font-bold hover:bg-blue-700 transition flex items-center gap-2 shadow-sm"
                        >
                            <Upload className="w-4 h-4" />
                            إضافة صورة
                        </button>
                    </div>
                    {groupPhotos.length > 0 ? (
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                            {groupPhotos.map((post, idx) => (
                                <div 
                                    key={post.id} 
                                    className="aspect-square bg-gray-100 dark:bg-gray-700 rounded-xl overflow-hidden cursor-pointer hover:opacity-90 transition relative group border border-gray-200 dark:border-gray-600"
                                    onClick={() => onMediaClick(post.image!, 'image', post.id)}
                                >
                                    <img src={post.image} alt="group photo" className="w-full h-full object-cover group-hover:scale-105 transition duration-500" />
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="text-center py-12 text-gray-500 dark:text-gray-400 bg-gray-50 dark:bg-gray-900/50 rounded-xl">
                            <ImageIcon className="w-16 h-16 mx-auto mb-3 opacity-30" />
                            <p className="font-medium">لا توجد صور في هذه المجموعة.</p>
                        </div>
                    )}
                </div>
            )}

            {/* VIDEOS TAB */}
            {activeGroupTab === 'videos' && (
                <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700">
                    <div className="flex justify-between items-center mb-6">
                        <h3 className="text-xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
                            <Video className="w-5 h-5 text-fb-blue" /> مقاطع الفيديو
                        </h3>
                        <button 
                          onClick={() => mediaUploadInputRef.current?.click()}
                          className="px-5 py-2.5 bg-fb-blue text-white rounded-lg font-bold hover:bg-blue-700 transition flex items-center gap-2 shadow-sm"
                        >
                            <Upload className="w-4 h-4" />
                            إضافة فيديو
                        </button>
                    </div>
                    {groupVideos.length > 0 ? (
                        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                            {groupVideos.map((post, idx) => (
                                <div 
                                    key={post.id} 
                                    className="aspect-video bg-black rounded-xl overflow-hidden cursor-pointer hover:opacity-90 transition relative group shadow-md"
                                    onClick={() => onMediaClick(post.image!, 'video', post.id)}
                                >
                                    <video src={post.image} className="w-full h-full object-cover pointer-events-none" />
                                    <div className="absolute inset-0 flex items-center justify-center bg-black/30 group-hover:bg-transparent transition">
                                        <div className="bg-white/20 p-3 rounded-full backdrop-blur-sm group-hover:scale-110 transition border border-white/30">
                                            <Play className="w-8 h-8 text-white fill-current" />
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="text-center py-12 text-gray-500 dark:text-gray-400 bg-gray-50 dark:bg-gray-900/50 rounded-xl">
                            <Video className="w-16 h-16 mx-auto mb-3 opacity-30" />
                            <p className="font-medium">لا توجد مقاطع فيديو في هذه المجموعة.</p>
                        </div>
                    )}
                </div>
            )}
        </div>
        
        {/* Modals */}
        {showEventModal && (
            <CreateGroupEventModal
                onClose={() => setShowEventModal(false)}
                onCreate={handleCreateEvent}
                isLoading={isCreatingEvent}
            />
        )}
    </div>
  );
};

export default GroupDetail;
