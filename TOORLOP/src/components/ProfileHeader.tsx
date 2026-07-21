import React, { useState, useRef, useEffect } from 'react';
import { 
  Camera, Pen, Plus, MessageCircle, UserCheck, ChevronDown, UserMinus, Ban, 
  UserPlus, Clock, Grid, Info, Users, Image as ImageIcon, Video, Flag, Calendar, 
  Edit3, PlayCircle, Shield, X, Lock, AlertCircle, MoreHorizontal, Check, ShieldCheck, Eye
} from 'lucide-react';
import { User, TabType } from '../types';
import { useLanguage } from '../context/LanguageContext';
import { playAudio } from '../utils/audio';

interface ProfileHeaderProps {
  currentUser: User;
  profileUser: User;
  isOwnProfile: boolean;
  activeTab: TabType;
  onTabChange: (tab: TabType) => void;
  onUpdateAvatar?: (url: string) => void;
  onUpdateCover?: (url: string) => void;
  onUpdateName?: (newName: string) => void;
  onAddStory?: (url: string) => void;
  onMessageClick?: (user: User) => void;
  onFriendAction?: (action: 'unfriend' | 'block', user: User) => void;
  onViewAvatar: (e: React.MouseEvent) => void;
  onViewCover: (e: React.MouseEvent) => void;
  onViewStory: (e: React.MouseEvent) => void;
  hasActiveStory: boolean;
  onViewAs?: () => void;
  onToggleLockProfile?: () => void;
  canViewContent?: boolean;
}

type FriendshipStatus = 'friends' | 'not_friends' | 'request_sent';

const ProfileHeader: React.FC<ProfileHeaderProps> = ({
  currentUser,
  profileUser,
  isOwnProfile,
  activeTab,
  onTabChange,
  onUpdateAvatar,
  onUpdateCover,
  onUpdateName,
  onAddStory,
  onMessageClick,
  onFriendAction,
  onViewAvatar,
  onViewCover,
  onViewStory,
  hasActiveStory,
  onViewAs,
  onToggleLockProfile,
  canViewContent = true
}) => {
  const { t, dir, language } = useLanguage();
  const [showFriendMenu, setShowFriendMenu] = useState(false);
  const [showMoreMenu, setShowMoreMenu] = useState(false);
  const [showAvatarMenu, setShowAvatarMenu] = useState(false);
  const [friendshipStatus, setFriendshipStatus] = useState<FriendshipStatus>('friends');
  
  // Name Modal State
  const [showNameModal, setShowNameModal] = useState(false);
  const [newName, setNewName] = useState('');
  const [passwordConfirm, setPasswordConfirm] = useState('');
  const [isUpdatingName, setIsUpdatingName] = useState(false);
  const [updateError, setUpdateError] = useState<string | null>(null);

  // Lock Profile State
  const [showSettingsMenu, setShowSettingsMenu] = useState(false);
  const [showLockModal, setShowLockModal] = useState(false);
  const [isProfileLocked, setIsProfileLocked] = useState((profileUser as any).isLocked === true);
  const [isLocking, setIsLocking] = useState(false);

  const friendMenuRef = useRef<HTMLDivElement>(null);
  const moreMenuRef = useRef<HTMLDivElement>(null);
  const avatarMenuRef = useRef<HTMLDivElement>(null);
  const settingsMenuRef = useRef<HTMLDivElement>(null);
  
  const avatarInputRef = useRef<HTMLInputElement>(null);
  const coverInputRef = useRef<HTMLInputElement>(null);
  const storyInputRef = useRef<HTMLInputElement>(null);

  // Sync Lock Status with Parent
  useEffect(() => {
    setIsProfileLocked((profileUser as any).isLocked === true);
  }, [profileUser]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
        if (friendMenuRef.current && !friendMenuRef.current.contains(event.target as Node)) {
            setShowFriendMenu(false);
        }
        if (moreMenuRef.current && !moreMenuRef.current.contains(event.target as Node)) {
            setShowMoreMenu(false);
        }
        if (avatarMenuRef.current && !avatarMenuRef.current.contains(event.target as Node)) {
            setShowAvatarMenu(false);
        }
        if (settingsMenuRef.current && !settingsMenuRef.current.contains(event.target as Node)) {
            setShowSettingsMenu(false);
        }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const validateFile = (file: File): string | null => {
      const validTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/gif', 'video/mp4', 'video/webm', 'video/quicktime'];
      if (!validTypes.includes(file.type)) return language === 'ar' ? 'نوع الملف غير مدعوم (الصور والفيديو فقط)' : 'Unsupported file type (Images and Video only)';
      if (file.size > 15 * 1024 * 1024) return t.errors_file_too_large || 'File is too large';
      return null;
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>, callback?: (url: string) => void) => {
      const file = e.target.files?.[0];
      if (file && callback) {
          const error = validateFile(file);
          if (error) {
              alert(error);
              e.target.value = '';
              return;
          }
          playAudio('upload_start');
          const reader = new FileReader();
          reader.onloadend = () => {
              if (reader.result) {
                  callback(reader.result as string);
              }
          };
          reader.readAsDataURL(file);
      }
      e.target.value = '';
  };

  const handleAvatarClick = (e: React.MouseEvent) => {
      e.stopPropagation();
      if (hasActiveStory) {
          setShowAvatarMenu(!showAvatarMenu);
      } else {
          onViewAvatar(e);
      }
  };

  const handleViewStoryAction = (e: React.MouseEvent) => {
      e.stopPropagation();
      setShowAvatarMenu(false);
      onViewStory(e);
  };

  const handleNameSubmit = () => {
      if (!newName.trim()) {
          setUpdateError(language === 'ar' ? 'الاسم لا يمكن أن يكون فارغاً' : 'Name cannot be empty');
          playAudio('notification');
          return;
      }
      setIsUpdatingName(true);
      setUpdateError(null);
      playAudio('pop');
      
      // Simulate API call
      setTimeout(() => {
          if (onUpdateName) {
              onUpdateName(newName);
          }
          setIsUpdatingName(false);
          setShowNameModal(false);
          setNewName('');
          setPasswordConfirm('');
      }, 1000);
  };

  const handleAction = (action: 'unfriend' | 'block') => {
      setShowFriendMenu(false);
      if (action === 'unfriend') {
          setFriendshipStatus('not_friends');
      }
      if (onFriendAction) {
          onFriendAction(action, profileUser);
      }
  };

  const handleAddFriend = () => {
      playAudio('pop');
      setFriendshipStatus('request_sent');
  };

  const handleCancelRequest = () => {
      playAudio('pop');
      setFriendshipStatus('not_friends');
  };

  const handleLockProfile = () => {
    setIsLocking(true);
    playAudio('upload_start'); // Audio feedback for start
    setTimeout(() => {
      if (onToggleLockProfile) {
          onToggleLockProfile();
      } else {
          setIsProfileLocked(!isProfileLocked);
      }
      setIsLocking(false);
      setShowLockModal(false);
      setShowSettingsMenu(false);
    }, 1000);
  };

  const handleViewAs = () => {
      setShowSettingsMenu(false);
      playAudio('pop');
      if (onViewAs) {
          onViewAs();
      } else {
          alert(language === 'ar' ? 'ميزة العرض كما يظهر للآخرين (قيد التطوير)' : 'View As feature (In Development)');
      }
  };

  const renderFriendButton = () => {
      if (friendshipStatus === 'friends') {
          return (
            <div className="relative" ref={friendMenuRef}>
                <button 
                    onClick={() => setShowFriendMenu(!showFriendMenu)}
                    className="bg-gray-200 dark:bg-gray-700 text-gray-900 dark:text-gray-200 px-4 py-2 rounded-md font-semibold flex items-center gap-2 hover:bg-gray-300 dark:hover:bg-gray-600 transition shadow-sm"
                >
                    <UserCheck className="w-5 h-5" />
                    <span>{t.profile_is_friend}</span>
                    <ChevronDown className="w-4 h-4" />
                </button>
                {showFriendMenu && (
                    <div className={`absolute top-full mt-2 w-48 bg-white dark:bg-gray-800 rounded-lg shadow-xl border border-gray-100 dark:border-gray-700 z-50 overflow-hidden animate-fadeIn ${dir === 'rtl' ? 'left-0 origin-top-left' : 'right-0 origin-top-right'}`}>
                        <div className="p-2 border-b border-gray-100 dark:border-gray-700 text-xs text-gray-500 dark:text-gray-400 font-medium">
                            {language === 'ar' ? 'إدارة الصداقة' : 'Manage Friendship'}
                        </div>
                        <button onClick={() => handleAction('unfriend')} className="w-full flex items-center gap-3 px-4 py-3 hover:bg-gray-50 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-200 transition text-sm font-medium">
                            <UserMinus className="w-5 h-5 text-red-500" /> {t.profile_unfriend}
                        </button>
                        <button onClick={() => handleAction('block')} className="w-full flex items-center gap-3 px-4 py-3 hover:bg-gray-50 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-200 transition text-sm font-medium">
                            <Ban className="w-5 h-5 text-gray-600 dark:text-gray-400" /> {t.profile_block}
                        </button>
                    </div>
                )}
            </div>
          );
      } else if (friendshipStatus === 'request_sent') {
          return (
            <button onClick={handleCancelRequest} className="bg-gray-200 dark:bg-gray-700 text-fb-blue px-4 py-2 rounded-md font-semibold flex items-center gap-2 hover:bg-gray-300 dark:hover:bg-gray-600 transition shadow-sm">
                <Clock className="w-5 h-5" /> <span>{t.profile_friend_request_sent}</span>
            </button>
          );
      } else {
          return (
            <button onClick={handleAddFriend} className="bg-fb-blue text-white px-4 py-2 rounded-md font-semibold flex items-center gap-2 hover:bg-blue-700 transition shadow-sm">
                <UserPlus className="w-5 h-5" /> <span>{t.profile_add_friend}</span>
            </button>
          );
      }
  };

  const getTabClass = (tabName: TabType) => 
    `px-4 py-3 font-semibold cursor-pointer whitespace-nowrap transition rounded-md ${ 
      activeTab === tabName
        ? 'text-fb-blue border-b-[3px] border-fb-blue rounded-none'
        : 'text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 hover:text-gray-900 dark:hover:text-gray-200'
    }`;

  return (
    // Updated z-index to z-40 to ensure dropdowns appear ABOVE the posts section below
    <div className="bg-white dark:bg-gray-800 shadow-sm rounded-b-xl mb-4 pb-0 relative z-40 transition-colors duration-300">
        <input type="file" ref={avatarInputRef} className="hidden" accept="image/*" onChange={(e) => handleFileChange(e, onUpdateAvatar)} />
        <input type="file" ref={coverInputRef} className="hidden" accept="image/*" onChange={(e) => handleFileChange(e, onUpdateCover)} />
        <input type="file" ref={storyInputRef} className="hidden" accept="image/*,video/mp4,video/webm,video/quicktime" onChange={(e) => handleFileChange(e, onAddStory)} />

        <div 
            className="relative h-[200px] md:h-[350px] w-full rounded-b-xl overflow-hidden bg-gray-300 dark:bg-gray-700 group cursor-pointer border-b border-gray-200 dark:border-gray-700"
            onClick={onViewCover}
        >
          {profileUser.coverPhoto ? (
               <img
                src={profileUser.coverPhoto}
                alt="Cover"
                className="w-full h-full object-cover transition duration-300 group-hover:brightness-95"
              />
          ) : (
               <div className="w-full h-full flex items-center justify-center bg-gray-200 dark:bg-gray-700 text-gray-400 dark:text-gray-500">
                   <div className="flex flex-col items-center">
                        <ImageIcon className="w-10 h-10 mb-2 opacity-50" />
                        <span className="text-sm font-medium">{language === 'ar' ? 'لا توجد صورة غلاف' : 'No Cover Photo'}</span>
                   </div>
               </div>
          )}
          
          {isOwnProfile && (
            <button 
                onClick={(e) => { e.stopPropagation(); playAudio('pop'); coverInputRef.current?.click(); }}
                className="absolute bottom-4 ltr:right-4 rtl:left-4 bg-white dark:bg-gray-800 px-3 py-1.5 rounded-md flex items-center gap-2 font-semibold text-sm hover:bg-gray-100 dark:hover:bg-gray-700 transition shadow-md z-10 text-gray-800 dark:text-gray-200 border border-gray-200 dark:border-gray-700"
            >
                <Camera className="w-5 h-5" />
                <span className="hidden md:inline">{t.profile_edit_cover}</span>
            </button>
          )}
        </div>

        <div className="px-4 md:px-8 relative pb-4">
          <div className="flex flex-col md:flex-row items-center md:items-end -mt-16 md:-mt-8 mb-4 gap-4">
             <div className="relative z-10" ref={avatarMenuRef}>
                <div 
                    className={`h-32 w-32 md:h-40 md:w-40 rounded-full border-4 overflow-hidden bg-white dark:bg-gray-800 shadow-md flex items-center justify-center cursor-pointer group ${hasActiveStory ? 'border-emerald-600' : 'border-white dark:border-gray-800'}`}
                    onClick={handleAvatarClick}
                >
                    <img src={profileUser.avatar} alt={profileUser.name} className="w-full h-full object-cover group-hover:brightness-95 transition" />
                </div>
                
                {showAvatarMenu && (
                    <div className={`absolute top-full mt-2 w-56 bg-white dark:bg-gray-800 rounded-lg shadow-xl border border-gray-100 dark:border-gray-700 z-50 overflow-hidden animate-fadeIn origin-top-left ${dir === 'rtl' ? 'right-0' : 'left-0'}`}>
                        <button 
                            onClick={onViewAvatar}
                            className="w-full flex items-center gap-3 px-4 py-3 hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-200 transition text-sm font-medium"
                        >
                            <ImageIcon className="w-5 h-5" />
                           {t.profile_view_avatar}
                        </button>
                        <button 
                            onClick={handleViewStoryAction}
                            className="w-full flex items-center gap-3 px-4 py-3 hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-200 transition text-sm font-medium border-t border-gray-100 dark:border-gray-700"
                        >
                            <PlayCircle className="w-5 h-5" />
                            {t.profile_view_story}
                        </button>
                    </div>
                )}

                {isOwnProfile && (
                    <div 
                        onClick={(e) => { e.stopPropagation(); playAudio('pop'); avatarInputRef.current?.click(); }}
                        className="absolute bottom-2 ltr:right-2 rtl:left-2 bg-gray-200 dark:bg-gray-700 p-2 rounded-full cursor-pointer hover:bg-gray-300 dark:hover:bg-gray-600 border-2 border-white dark:border-gray-800 z-20 transition shadow-sm"
                        title={language === 'ar' ? 'تحديث صورة الملف الشخصي' : 'Update Profile Picture'}
                    >
                        <Camera className="w-5 h-5 text-black dark:text-white" />
                    </div>
                )}
             </div>

             <div className="flex-1 text-center md:text-start mb-2 md:mb-4 mt-2 md:mt-0">
                 <div className={`flex items-center justify-center md:justify-start gap-3 mb-1`}>
                     <h1 className="text-3xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
                         {profileUser.name}
                         {profileUser.online && <div className="w-3 h-3 bg-green-500 rounded-full border-2 border-white dark:border-gray-800 shadow-sm" title={t.common_online}></div>}
                         {isProfileLocked && (
                             <span title={language === 'ar' ? 'لقد قمت بقفل ملفك الشخصي' : 'You locked your profile'} className="flex items-center justify-center">
                                <ShieldCheck className="w-6 h-6 text-fb-blue" />
                             </span>
                         )}
                     </h1>
                     
                     {isOwnProfile && (
                         <button 
                            onClick={() => { playAudio('pop'); setNewName(currentUser.name); setShowNameModal(true); }}
                            className="p-1.5 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full text-gray-500 dark:text-gray-400 transition group relative"
                            title={t.profile_change_name}
                         >
                             <Edit3 className="w-5 h-5" />
                         </button>
                     )}
                 </div>
                 
                 {(friendshipStatus === 'friends' || isOwnProfile) && (
                     <div className={`flex flex-col md:items-start items-center`}>
                        <span className="text-gray-500 dark:text-gray-400 font-semibold text-[15px]">1.2 {language === 'ar' ? 'ألف' : 'k'} {t.friend_count}</span>
                        <div className={`flex justify-center ${dir === 'rtl' ? 'md:justify-start -space-x-2 space-x-reverse' : 'md:justify-start -space-x-2'} mt-2`}>
                            {[1,2,3,4,5,6].map(i => (
                                <img key={i} src={`https://picsum.photos/40/40?random=${i+200}`} className="w-8 h-8 rounded-full border-2 border-white dark:border-gray-800 hover:z-10 transition" alt="friend" />
                            ))}
                        </div>
                     </div>
                 )}
             </div>

             <div className="flex items-center gap-3 mb-4 mt-4 md:mt-0 relative">
                 {isOwnProfile ? (
                     <>
                        <button 
                            onClick={() => { playAudio('pop'); storyInputRef.current?.click(); }}
                            className="bg-fb-blue text-white px-4 py-2 rounded-md font-semibold flex items-center gap-2 hover:bg-blue-700 transition shadow-sm"
                        >
                            <Plus className="w-5 h-5" />
                            <span>{t.profile_add_story}</span>
                        </button>
                        <button 
                            onClick={() => { playAudio('pop'); onTabChange('about'); }}
                            className="bg-gray-200 dark:bg-gray-700 text-black dark:text-white px-4 py-2 rounded-md font-semibold flex items-center gap-2 hover:bg-gray-300 dark:hover:bg-gray-600 transition shadow-sm"
                        >
                            <Pen className="w-4 h-4" />
                            <span>{t.profile_edit_profile}</span>
                        </button>
                        <div className="relative" ref={settingsMenuRef}>
                            <button 
                                onClick={() => { playAudio('pop'); setShowSettingsMenu(!showSettingsMenu); }}
                                className="bg-gray-200 dark:bg-gray-700 text-black dark:text-white px-3 py-2 rounded-md font-semibold flex items-center justify-center hover:bg-gray-300 dark:hover:bg-gray-600 transition shadow-sm"
                            >
                                <MoreHorizontal className="w-5 h-5" />
                            </button>
                            
                            {showSettingsMenu && (
                                <div 
                                    className={`absolute top-full mt-2 min-w-[260px] bg-white dark:bg-gray-800 rounded-lg shadow-xl border border-gray-100 dark:border-gray-700 z-50 overflow-hidden animate-fadeIn ring-1 ring-black ring-opacity-5 ${dir === 'rtl' ? 'left-0 origin-top-left' : 'right-0 origin-top-right'}`}
                                >
                                    {/* View As Feature */}
                                    <button 
                                        onClick={handleViewAs}
                                        className="w-full flex items-center gap-3 px-4 py-4 hover:bg-gray-50 dark:hover:bg-gray-700/50 text-gray-700 dark:text-gray-200 transition text-sm font-medium group border-b border-gray-100 dark:border-gray-700/50"
                                    >
                                        <Eye className="w-6 h-6 text-gray-500 group-hover:text-fb-blue group-hover:scale-110 transition" />
                                        <div className="flex flex-col items-start">
                                            <span className="font-bold text-gray-900 dark:text-white">
                                                {language === 'ar' ? 'عرض كما يظهر للآخرين' : 'View As'}
                                            </span>
                                            <span className="text-[11px] text-gray-500 dark:text-gray-400 mt-0.5 leading-tight">
                                                {language === 'ar' ? 'شاهد كيف يبدو ملفك الشخصي للعامة' : 'See what your profile looks like to others'}
                                            </span>
                                        </div>
                                    </button>

                                    {/* Lock Profile Feature */}
                                    <button 
                                        onClick={() => { playAudio('pop'); setShowLockModal(true); }}
                                        className="w-full flex items-center gap-3 px-4 py-4 hover:bg-gray-50 dark:hover:bg-gray-700/50 text-gray-700 dark:text-gray-200 transition text-sm font-medium group"
                                    >
                                        {isProfileLocked 
                                            ? <ShieldCheck className="w-6 h-6 text-fb-blue group-hover:scale-110 transition" /> 
                                            : <Lock className="w-6 h-6 text-gray-500 group-hover:text-fb-blue group-hover:scale-110 transition" />
                                        }
                                        <div className="flex flex-col items-start">
                                            <span className="font-bold text-gray-900 dark:text-white">
                                                {isProfileLocked ? (language === 'ar' ? 'إلغاء قفل الملف الشخصي' : 'Unlock Profile') : (language === 'ar' ? 'قفل الملف الشخصي' : 'Lock Profile')}
                                            </span>
                                            <span className="text-[11px] text-gray-500 dark:text-gray-400 mt-0.5 leading-tight">
                                                {isProfileLocked 
                                                    ? (language === 'ar' ? 'ملفك الشخصي مقفل حالياً' : 'Your profile is currently locked')
                                                    : (language === 'ar' ? 'اجعل صورك ومنشوراتك خاصة' : 'Make your photos and posts private')}
                                            </span>
                                        </div>
                                    </button>
                                </div>
                            )}
                        </div>
                     </>
                 ) : (
                     <>
                        {renderFriendButton()}
                        <button 
                            onClick={() => { playAudio('pop'); onMessageClick && onMessageClick(profileUser); }}
                            className="bg-gray-200 dark:bg-gray-700 text-black dark:text-white px-4 py-2 rounded-md font-semibold flex items-center gap-2 hover:bg-gray-300 dark:hover:bg-gray-600 transition shadow-sm"
                        >
                            <MessageCircle className="w-5 h-5" />
                            <span>{t.profile_message}</span>
                        </button>
                     </>
                 )}
             </div>
          </div>

          <div className="h-[1px] bg-gray-200 dark:bg-gray-700 w-full mb-1"></div>

          <div className="flex items-center gap-1 md:gap-4 pt-1">
             <div className="flex items-center gap-1 md:gap-4 overflow-x-auto no-scrollbar flex-shrink min-w-0">
                <div onClick={() => { playAudio('pop'); onTabChange('posts'); }} className={getTabClass('posts')}>{t.profile_posts}</div>
                <div onClick={() => { playAudio('pop'); onTabChange('about'); }} className={getTabClass('about')}>{t.profile_about}</div>
                <div onClick={() => { playAudio('pop'); onTabChange('friends'); }} className={getTabClass('friends')}>{t.profile_friends}</div>
                <div onClick={() => { playAudio('pop'); onTabChange('photos'); }} className={getTabClass('photos')}>{t.profile_photos}</div>
                <div onClick={() => { playAudio('pop'); onTabChange('videos'); }} className={getTabClass('videos')}>{t.profile_videos}</div>
             </div>
             
             <div className="relative flex-shrink-0 z-20" ref={moreMenuRef}>
                 <div 
                    onClick={() => setShowMoreMenu(!showMoreMenu)}
                    className={`flex items-center gap-1 px-4 py-3 font-semibold cursor-pointer whitespace-nowrap transition rounded-md ${
                        ['groups', 'pages', 'events'].includes(activeTab)
                        ? 'text-fb-blue border-b-[3px] border-fb-blue rounded-none'
                        : 'text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 hover:text-gray-900 dark:hover:text-white'
                    }`}
                 >
                     <span>{t.profile_more}</span>
                     <ChevronDown className="w-4 h-4" />
                 </div>
                 
                 {showMoreMenu && (
                     <div className={`absolute top-full mt-1 w-48 bg-white dark:bg-gray-800 rounded-lg shadow-xl border border-gray-100 dark:border-gray-700 z-[100] overflow-hidden animate-fadeIn origin-top-left ${dir === 'rtl' ? 'left-0' : 'right-0'}`}>
                         <button 
                            onClick={() => { playAudio('pop'); onTabChange('groups'); setShowMoreMenu(false); }} 
                            className="w-full flex items-center justify-between px-4 py-3 hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-200 transition text-sm font-medium"
                         >
                             {t.profile_groups} <Grid className="w-4 h-4" />
                         </button>
                         <button 
                            onClick={() => { playAudio('pop'); onTabChange('pages'); setShowMoreMenu(false); }} 
                            className="w-full flex items-center justify-between px-4 py-3 hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-200 transition text-sm font-medium"
                         >
                             {t.profile_pages} <Flag className="w-4 h-4" />
                         </button>
                         <button 
                            onClick={() => { playAudio('pop'); onTabChange('events'); setShowMoreMenu(false); }} 
                            className="w-full flex items-center justify-between px-4 py-3 hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-200 transition text-sm font-medium"
                         >
                             {t.profile_events} <Calendar className="w-4 h-4" />
                         </button>
                     </div>
                 )}
             </div>
          </div>
        </div>

        {/* Name Modal */}
        {showNameModal && (
          <div className="fixed inset-0 bg-black/60 z-[100] flex items-center justify-center p-4 animate-fadeIn backdrop-blur-sm">
               <div className="bg-white dark:bg-gray-800 rounded-lg shadow-2xl w-full max-w-md overflow-hidden animate-scaleIn border border-gray-100 dark:border-gray-700">
                  <div className="p-4 border-b border-gray-100 dark:border-gray-700 flex justify-between items-center bg-gray-50 dark:bg-gray-800/50">
                      <h3 className="font-bold text-lg text-gray-900 dark:text-white flex items-center gap-2">
                          <Shield className="w-5 h-5 text-fb-blue" />
                          {t.profile_change_name}
                      </h3>
                      <button onClick={() => setShowNameModal(false)} className="text-gray-500 hover:bg-gray-200 dark:hover:bg-gray-600 p-1.5 rounded-full transition">
                          <X className="w-5 h-5" />
                      </button>
                  </div>
                  
                  <div className="p-6 space-y-5">
                      <div className="bg-yellow-50 dark:bg-yellow-900/10 border border-yellow-200 dark:border-yellow-800/30 rounded-lg p-4 flex gap-3">
                          <AlertCircle className="w-6 h-6 text-yellow-600 dark:text-yellow-500 flex-shrink-0" />
                          <div className="text-sm text-yellow-800 dark:text-yellow-200">
                              <span className="font-bold block mb-1">{language === 'ar' ? 'يرجى الانتباه:' : 'Please Note:'}</span>
                              {language === 'ar' 
                                ? 'في حال قمت بتغيير اسمك على Tourloop، لن تتمكن من تغييره مرة أخرى لمدة 60 يوماً. لا تضف أي أحرف كبيرة أو علامات ترقيم أو أحرف غير عادية.'
                                : 'If you change your name on Tourloop, you can\'t change it again for 60 days. Don\'t add any unusual capitalization, punctuation, characters or random words.'}
                          </div>
                      </div>

                      {updateError && (
                          <div className="bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 px-4 py-2 rounded-md text-sm flex items-center gap-2 animate-fadeIn border border-red-100 dark:border-red-900/30">
                              <AlertCircle className="w-4 h-4" />
                              {updateError}
                          </div>
                      )}

                      <div>
                          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">{t.auth_name_label}</label>
                          <input 
                              type="text" 
                              className="w-full border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-md p-2.5 focus:ring-2 focus:ring-fb-blue focus:border-transparent outline-none transition"
                              placeholder={language === 'ar' ? "الاسم الأول واسم العائلة" : "First and Last Name"}
                              value={newName}
                              onChange={(e) => setNewName(e.target.value)}
                          />
                      </div>

                      <div className="border-t border-gray-100 dark:border-gray-700 my-2"></div>

                      <div>
                          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1 flex items-center gap-2">
                              <Lock className="w-4 h-4 text-fb-blue" />
                              {language === 'ar' ? 'لأمانك، يرجى إدخال كلمة المرور لتأكيد التغيير' : 'For your security, please re-enter your password'}
                          </label>
                          <input 
                              type="password" 
                              className="w-full border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-md p-2.5 focus:ring-2 focus:ring-fb-blue focus:border-transparent outline-none transition"
                              placeholder={t.auth_password_label}
                              value={passwordConfirm}
                              onChange={(e) => setPasswordConfirm(e.target.value)}
                          />
                      </div>
                  </div>

                  <div className="p-4 bg-gray-50 dark:bg-gray-800/50 flex justify-end gap-3 border-t border-gray-100 dark:border-gray-700">
                      <button 
                          onClick={() => setShowNameModal(false)}
                          className="px-4 py-2 text-gray-700 dark:text-gray-300 font-medium hover:bg-gray-200 dark:hover:bg-gray-600 rounded-md transition"
                      >
                          {t.common_cancel}
                      </button>
                      <button 
                          onClick={handleNameSubmit}
                          disabled={isUpdatingName}
                          className="px-6 py-2 bg-fb-blue text-white font-bold rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition flex items-center gap-2 shadow-sm"
                      >
                          {isUpdatingName ? (
                              <>
                                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                                  {language === 'ar' ? 'جاري الحفظ...' : 'Saving...'}
                              </>
                          ) : (
                              language === 'ar' ? 'حفظ التغييرات' : 'Save Changes'
                          )}
                      </button>
                  </div>
              </div>
          </div>
        )}

        {/* Lock Profile Modal */}
        {showLockModal && (
            <div className="fixed inset-0 bg-black/60 z-[100] flex items-center justify-center p-4 animate-fadeIn backdrop-blur-sm">
                <div className="bg-white dark:bg-gray-800 rounded-xl shadow-2xl w-full max-w-sm overflow-hidden animate-scaleIn border border-gray-100 dark:border-gray-700">
                    <div className="p-6 flex flex-col items-center text-center">
                        <div className="w-20 h-20 bg-blue-50 dark:bg-blue-900/20 rounded-full flex items-center justify-center mb-4">
                            {isProfileLocked ? <ShieldCheck className="w-10 h-10 text-fb-blue" /> : <Shield className="w-10 h-10 text-fb-blue" />}
                        </div>
                        <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
                            {isProfileLocked 
                                ? (language === 'ar' ? 'إلغاء قفل ملفك الشخصي؟' : 'Unlock your profile?')
                                : (language === 'ar' ? 'قفل ملفك الشخصي' : 'Lock your profile')
                            }
                        </h3>
                        <p className="text-sm text-gray-500 dark:text-gray-400 mb-6">
                            {isProfileLocked 
                                ? (language === 'ar' ? 'عند إلغاء القفل، سيتمكن الجميع من رؤية صورك ومنشوراتك.' : 'When unlocked, everyone will be able to see your photos and posts.')
                                : (language === 'ar' ? 'اجعل صورك ومنشوراتك أكثر خصوصية في خطوة واحدة.' : 'Make your photos and posts more private in one step.')
                            }
                        </p>
                        
                        {!isProfileLocked && (
                            <div className="w-full space-y-3 mb-6">
                                <div className="flex items-start gap-3 text-start">
                                    <Check className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
                                    <span className="text-sm text-gray-600 dark:text-gray-300">{language === 'ar' ? 'سيتمكن أصدقاؤك فقط من رؤية الصور والمنشورات على يومياتك.' : 'Only friends will see the photos and posts on your timeline.'}</span>
                                </div>
                                <div className="flex items-start gap-3 text-start">
                                    <Check className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
                                    <span className="text-sm text-gray-600 dark:text-gray-300">{language === 'ar' ? 'سيتمكن أصدقاؤك فقط من رؤية صورة ملفك الشخصي وصورة الغلاف بالحجم الكامل.' : 'Only friends will see your full size profile picture and cover photo.'}</span>
                                </div>
                            </div>
                        )}

                        <div className="flex gap-3 w-full">
                            <button 
                                onClick={() => setShowLockModal(false)} 
                                className="flex-1 py-2.5 text-gray-600 dark:text-gray-300 font-semibold hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition"
                            >
                                {t.common_cancel}
                            </button>
                            <button 
                                onClick={handleLockProfile} 
                                disabled={isLocking}
                                className="flex-1 py-2.5 bg-fb-blue text-white font-bold rounded-lg hover:bg-blue-700 transition shadow-lg flex items-center justify-center gap-2"
                            >
                                {isLocking ? (
                                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                                ) : (
                                    isProfileLocked 
                                        ? (language === 'ar' ? 'إلغاء القفل' : 'Unlock')
                                        : (language === 'ar' ? 'قفل الملف الشخصي' : 'Lock Your Profile')
                                )}
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        )}
    </div>
  );
};

export default ProfileHeader;