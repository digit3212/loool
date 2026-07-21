import React, { useState, useMemo, useRef } from 'react';
import { createPortal } from 'react-dom';
import { 
  ArrowRight, ArrowLeft, Camera, Check, ThumbsUp, MessageCircle, Edit, Settings, Trash2, 
  CheckCircle, Grid, Info, Users, Image as ImageIcon, Video, Globe, Mail, Phone, 
  Calendar, Briefcase, FileText, Edit3, BarChart3, Shield, UserCog, Play, Flag, 
  Plus, Search, Clock, MoreHorizontal, Upload, ChevronLeft, ChevronRight, Pin, 
  PinOff, Bell, BellOff, Share2, Download, UserCircle, Bookmark, BookmarkMinus, 
  Link as LinkIcon 
} from 'lucide-react';
import { Page, Post, User, Album, Photo } from '../../types';
import CreatePost from '../CreatePost';
import PostCard from '../PostCard';
import { useLanguage } from '../../context/LanguageContext';
import PageMediaLightbox from './PageMediaLightbox';
import PagePhotos from './PagePhotos';

interface PageDetailProps {
  viewingPage: Page;
  activePageTab: string;
  setActivePageTab: (tab: any) => void;
  currentUser: User;
  pagePosts: Record<string, Post[]>;
  pageAlbums?: Album[];
  isPageAdmin: (page: Page) => boolean;
  isPageModerator: (page: Page) => boolean;
  onBack: () => void;
  onAvatarClick: (e: React.MouseEvent) => void;
  onCoverClick: (e: React.MouseEvent) => void;
  onLikeToggle: (id: string, e?: React.MouseEvent) => void;
  onMessage: (page: Page, e?: React.MouseEvent) => void;
  onOpenEdit: () => void;
  onOpenRoles: () => void;
  onDeletePage: (id: string, name: string) => void;
  onCreatePost: (content: string, image?: string) => void;
  onPostTogglePin: (id: string) => void;
  onPostDelete: (id: string) => void;
  onPostLike: (id: string, reactionType?: string) => void;
  onPostMediaClick: (post: Post, type: 'image' | 'video') => void;
  pagePhotos: any[];
  pageVideos: any[];
  dir: 'rtl' | 'ltr';
  onPhotoUpload?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onVideoUpload?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onPostSave?: (item: any) => void;
  onPostComment?: (postId: string, text: string) => void;
  onDeletePostComment?: (postId: string, commentId: string) => void;
  onLikePostComment?: (postId: string, commentId: string) => void;
  onUpdateAvatar?: (url: string) => void;
  setPages?: React.Dispatch<React.SetStateAction<Page[]>>;
  onShowNotification?: (message: string, type?: 'success' | 'info' | 'error') => void;
  onCreatePageAlbum?: (album: Album) => void;
  onAddPhotoToPageAlbum?: (albumId: string, photo: Photo) => void;
}

// Local interface to handle missing 'rules' property in main Page type
interface PageWithRules extends Page {
  rules?: string[];
}

const PAGE_CATEGORIES = [
  { id: 'personal_blog', ar: 'مدونة شخصية', en: 'Personal Blog' },
  { id: 'business', ar: 'نشاط تجاري', en: 'Business' },
  { id: 'entertainment', ar: 'ترفيه', en: 'Entertainment' },
  { id: 'tech', ar: 'تكنولوجيا', en: 'Technology' },
  { id: 'food', ar: 'طعام وشراب', en: 'Food & Drink' },
  { id: 'sports', ar: 'رياضة', en: 'Sports' },
  { id: 'health', ar: 'صحة وجمال', en: 'Health & Beauty' },
  { id: 'education', ar: 'تعليم', en: 'Education' },
  { id: 'art', ar: 'فنون', en: 'Arts' },
  { id: 'gaming', ar: 'ألعاب فيديو', en: 'Gaming' },
  { id: 'community', ar: 'مجتمع', en: 'Community' },
  { id: 'news', ar: 'أخبار وإعلام', en: 'News & Media' },
  { id: 'science_nature', ar: 'علوم وطبيعة', en: 'Science & Nature' },
  { id: 'sports_team', ar: 'فريق رياضي', en: 'Sports Team' }
];

const PageDetail: React.FC<PageDetailProps> = ({
  viewingPage,
  activePageTab,
  setActivePageTab,
  currentUser,
  pagePosts,
  pageAlbums = [],
  isPageAdmin,
  isPageModerator,
  onBack,
  onAvatarClick,
  onCoverClick,
  onLikeToggle,
  onMessage,
  onOpenEdit,
  onOpenRoles,
  onDeletePage,
  onCreatePost,
  onPostTogglePin,
  onPostDelete,
  onPostLike,
  onPostMediaClick,
  pagePhotos,
  pageVideos,
  dir,
  onPhotoUpload,
  onVideoUpload,
  onPostSave,
  onPostComment,
  onDeletePostComment,
  onLikePostComment,
  onUpdateAvatar,
  setPages,
  onShowNotification,
  onCreatePageAlbum,
  onAddPhotoToPageAlbum
}) => {
  const { t, language } = useLanguage();
  const photoInputRef = useRef<HTMLInputElement>(null);
  const videoInputRef = useRef<HTMLInputElement>(null);
  const [memberSearch, setMemberSearch] = useState('');
  
  // State for viewing avatar/cover in lightbox
  const [viewingImage, setViewingImage] = useState<string | null>(null);
  const [mediaCommentInput, setMediaCommentInput] = useState('');
  const mediaCommentsEndRef = useRef<HTMLDivElement>(null);

  // Use extended type for local logic
  const pageData = viewingPage as PageWithRules;

  const filteredMembers = useMemo(() => {
    const list = pageData.membersList || [];
    return list.filter(m => m.name.toLowerCase().includes(memberSearch.toLowerCase()));
  }, [pageData.membersList, memberSearch]);

  const adminsAndMods = useMemo(() => filteredMembers.filter(m => m.role === 'admin' || m.role === 'moderator'), [filteredMembers]);
  const regularMembers = useMemo(() => filteredMembers.filter(m => m.role === 'member'), [filteredMembers]);

  // Dynamic Rules based on Language
  const getDefaultRules = () => {
    if (language === 'ar') {
      return [
        "احترم جميع المتابعين ولا تستخدم ألفاظاً نابية.",
        "يمنع نشر المحتوى الإعلاني أو السبام.",
        "احرص أن تكون المنشورات ذات صلة بموضوع الصفحة.",
        "يمنع نشر المعلومات الشخصية للآخرين."
      ];
    } else {
      return [
        "Respect all followers and do not use profanity.",
        "No advertising or spam content allowed.",
        "Ensure posts are relevant to the page topic.",
        "Do not publish personal information of others."
      ];
    }
  };

  const displayRules = pageData.rules && pageData.rules.length > 0 ? pageData.rules : getDefaultRules();

  const getCategoryLabel = (cat: string) => {
    const found = PAGE_CATEGORIES.find(c => c.id === cat || c.ar === cat || c.en === cat);
    if (found) {
        return language === 'ar' ? found.ar : found.en;
    }
    return cat;
  };

  const pageUserAsAdmin: User = {
    id: viewingPage.id,
    name: viewingPage.name,
    avatar: viewingPage.avatar,
    online: true
  };

  const handleAvatarUpdate = (url: string) => {
      if (setPages) {
          setPages(prev => prev.map(p => p.id === viewingPage.id ? { ...p, avatar: url } : p));
      }
      if (onUpdateAvatar) onUpdateAvatar(url);
  };

  const handleViewImage = (url: string) => {
      setViewingImage(url);
      setMediaCommentInput(''); // Reset comment input when opening new image
  };

  // Find the post associated with the viewing image (Avatar or Cover)
  const viewingImagePost = useMemo(() => {
    if (!viewingImage) return null;
    
    const posts = pagePosts[viewingPage.id] || [];
    
    // 1. Try finding by URL (Priority for dynamic/updated content)
    const pByUrl = posts.find(post => post.image === viewingImage);
    if (pByUrl) return pByUrl;

    // 2. Fallback: Try finding by Fixed ID (Legacy seeding)
    const avatarPostId = `avatar_${viewingPage.id}`;
    const coverPostId = `cover_${viewingPage.id}`;
    
    if (viewingImage === viewingPage.avatar) {
        const p = posts.find(post => post.id === avatarPostId);
        if (p) return p;
    }
    if (viewingImage === viewingPage.coverUrl) {
        const p = posts.find(post => post.id === coverPostId);
        if (p) return p;
    }

    // 3. Fallback: Return dummy post (Read-only view)
    return {
        id: 'view_only_' + Date.now(),
        author: { 
            id: viewingPage.id, 
            name: viewingPage.name, 
            avatar: viewingPage.avatar, 
            online: true 
        },
        content: viewingImage === viewingPage.avatar 
            ? (language === 'ar' ? 'صورة الملف الشخصي' : 'Profile Picture')
            : (language === 'ar' ? 'صورة الغلاف' : 'Cover Photo'),
        image: viewingImage,
        timestamp: t.common_time || 'Just now',
        likes: 0,
        comments: [],
        shares: 0,
        isPinned: false,
        isLiked: false,
        isSaved: false
    } as Post;
  }, [viewingImage, pagePosts, viewingPage, language, t]);

  const lightboxMediaList = useMemo(() => {
    if (!viewingImage || !viewingImagePost) return [];
    return [{
        url: viewingImage,
        type: 'image',
        post: viewingImagePost
    }];
  }, [viewingImage, viewingImagePost]);

  // Derive photos from posts list (Legacy and Current support)
  const currentTabPhotos: Photo[] = useMemo(() => {
      return pagePhotos.map(m => ({
          id: m.post.id,
          url: m.url,
          likes: m.post.likes || 0,
          comments: m.post.comments || [],
          isLiked: m.post.isLiked || false,
          reaction: m.post.reaction,
          description: m.post.content
      }));
  }, [pagePhotos]);

  // Helper Function: Handle clicking on a photo in the Photos Tab
  const handlePhotosViewMedia = (url: string, type: 'image' | 'video', postId?: string) => {
    if (postId) {
        // Find the post associated with this ID to open the full lightbox
        const posts = pagePosts[viewingPage.id] || [];
        const post = posts.find(p => p.id === postId);
        if (post) {
            onPostMediaClick(post, type);
        }
    }
  };

  return (
    <div className="animate-fadeIn w-full">
      <input type="file" ref={photoInputRef} className="hidden" accept="image/*" onChange={onPhotoUpload} />
      <input type="file" ref={videoInputRef} className="hidden" accept="video/*" onChange={onVideoUpload} />

      <div className="mb-4">
        <button
          onClick={onBack}
          className="flex items-center gap-2 text-black hover:text-blue-700 dark:text-green-500 hover:text-blue-700 dark:hover:text-blue-700 hover:bg-gray-100 dark:hover:bg-gray-700 px-3 py-2 rounded-lg transition font-bold text-sm"
        >
          {dir === 'rtl' ? <ArrowRight className="w-5 h-5" /> : <ArrowLeft className="w-5 h-5" />}
          {language === 'ar' ? 'عودة إلى الصفحات' : 'Back to Pages'}
        </button>
      </div>

      {/* Cinematic Cover Image */}
      <div 
        className="h-48 sm:h-64 md:h-[400px] bg-gray-200 dark:bg-gray-700 relative group rounded-xl overflow-hidden shadow-sm cursor-pointer"
        onClick={(e) => {
             e.stopPropagation();
             if (viewingPage.coverUrl) handleViewImage(viewingPage.coverUrl);
        }}
      >
        {viewingPage.coverUrl ? (
          <img src={viewingPage.coverUrl} alt="Cover" className="w-full h-full object-cover transition duration-500 group-hover:scale-105" />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-gray-300 dark:bg-gray-600">
            <ImageIcon className="w-12 h-12 text-gray-400" />
          </div>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-60"></div>

        {isPageAdmin(viewingPage) && (
          <button
            onClick={(e) => {
                e.stopPropagation();
                onCoverClick(e);
            }}
            className="absolute bottom-20 md:bottom-14 ltr:right-4 rtl:left-4 bg-white/90 dark:bg-gray-800/90 hover:bg-white dark:hover:bg-gray-700 text-gray-800 dark:text-gray-200 px-3 md:px-4 py-2 rounded-lg text-sm font-bold flex items-center gap-2 transition shadow-md z-10 backdrop-blur-sm"
          >
            <Camera className="w-4 h-4" /> 
            <span className="hidden md:inline">{t.profile_edit_cover || (language === 'ar' ? 'تعديل الغلاف' : 'Edit Cover')}</span>
          </button>
        )}
      </div>

      <div className="px-4 md:px-6 pb-4 border-b border-gray-100 dark:border-gray-700 relative bg-white dark:bg-gray-800 rounded-b-xl">
        <div className="flex flex-col md:flex-row items-start md:items-end gap-5 -mt-16 md:-mt-12">
          <div className="relative group flex-shrink-0">
            <div 
                className={`w-32 h-32 md:w-40 md:h-40 rounded-full border-4 border-white dark:border-gray-800 shadow-md overflow-hidden bg-white dark:bg-gray-700 cursor-pointer`}
                onClick={(e) => {
                    e.stopPropagation();
                    if (viewingPage.avatar) handleViewImage(viewingPage.avatar);
                }}
            >
              <img src={viewingPage.avatar} alt={viewingPage.name} className="w-full h-full object-cover group-hover:brightness-95 transition" />
            </div>

            {isPageAdmin(viewingPage) && (
              <button
                onClick={(e) => {
                    e.stopPropagation();
                    onAvatarClick(e);
                }}
                className="absolute bottom-0 rtl:left-0 ltr:right-0 bg-gray-100 dark:bg-gray-700 p-2.5 rounded-full text-gray-700 dark:text-gray-200 shadow-lg border-2 border-white dark:border-gray-800 hover:bg-gray-200 dark:hover:bg-gray-600 transition z-20"
                title={t.profile_edit_profile || (language === 'ar' ? 'تعديل الصورة' : 'Edit Picture')}
              >
                <Camera className="w-5 h-5" />
              </button>
            )}
          </div>

          <div className="flex-1 mb-2 md:mb-1 pt-2 md:pt-0 text-start w-full">
            <h1 className="text-2xl md:text-3xl font-extrabold text-gray-900 dark:text-white flex items-center justify-start gap-2">
              {viewingPage.name}
              <CheckCircle className="w-6 h-6 text-green-700 fill-current text-white dark:text-green-500" />
            </h1>
            <p className="text-gray-600 dark:text-gray-300 font-bold mt-1 text-sm md:text-base">
              {getCategoryLabel(viewingPage.category)} • {viewingPage.likesCount} {t.pages_likes_count || (language === 'ar' ? 'إعجاب' : 'Likes')}
            </p>
          </div>

          <div className="flex flex-wrap items-center justify-start md:justify-end gap-2 mb-2 w-full md:w-auto">
            <button
              onClick={(e) => onLikeToggle(viewingPage.id, e)}
              className={`flex-1 md:flex-none h-10 px-6 rounded-lg font-bold transition flex items-center justify-center gap-2 ${
                viewingPage.isLiked
                  ? 'bg-green-700 text-white shadow-sm hover:bg-blue-700'
                  : 'bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 hover:bg-gray-300 dark:hover:bg-gray-600'
              }`}
            >
              <ThumbsUp className={`w-5 h-5 ${viewingPage.isLiked ? 'fill-current' : ''}`} />
              <span>{viewingPage.isLiked ? (t.pages_liked || (language === 'ar' ? 'أعجبني' : 'Liked')) : (t.pages_like || (language === 'ar' ? 'إعجاب' : 'Like'))}</span>
            </button>

            <button
              onClick={(e) => onMessage(viewingPage, e)}
              className="flex-1 md:flex-none h-10 px-4 bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 rounded-lg font-bold hover:bg-gray-300 dark:hover:bg-gray-600 transition flex items-center justify-center gap-2"
            >
              <MessageCircle className="w-5 h-5" />
              <span>{t.pages_message || (language === 'ar' ? 'مراسلة' : 'Message')}</span>
            </button>

            {isPageAdmin(viewingPage) && (
              <div className="flex gap-2 w-full md:w-auto justify-start md:justify-center">
                <button
                  onClick={onOpenEdit}
                  className="h-10 px-4 bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 rounded-lg font-bold hover:bg-gray-300 dark:hover:bg-gray-600 transition flex items-center justify-center gap-2"
                  title={t.common_edit || (language === 'ar' ? 'تعديل' : 'Edit')}
                >
                  <Edit3 className="w-5 h-5" />
                  <span className="hidden lg:inline">{t.common_edit || (language === 'ar' ? 'تعديل' : 'Edit')}</span>
                </button>

                <button
                  onClick={onOpenRoles}
                  className="h-10 px-4 bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-500 rounded-lg font-bold hover:bg-green-100 dark:hover:bg-green-900/30 hover:text-blue-700 dark:hover:text-blue-700 transition flex items-center justify-center gap-2"
                  title={t.pages_manage_roles || (language === 'ar' ? 'إدارة الأعضاء' : 'Manage Roles')}
                >
                  <Settings className="w-5 h-5" />
                </button>

                <button
                  onClick={() => onDeletePage(viewingPage.id, viewingPage.name)}
                  className="h-10 px-4 bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 rounded-lg hover:bg-red-100 dark:hover:bg-red-900/30 transition flex items-center justify-center"
                  title={t.pages_delete_page || (language === 'ar' ? 'حذف الصفحة' : 'Delete Page')}
                >
                  <Trash2 className="w-5 h-5" />
                </button>
              </div>
            )}
          </div>
        </div>

        <div className="flex items-center gap-2 md:gap-4 mt-6 overflow-x-auto no-scrollbar border-t border-gray-100 dark:border-gray-700 pt-2">
          {[
            { id: 'posts', label: t.pages_posts || (language === 'ar' ? 'المنشورات' : 'Posts'), icon: Grid },
            { id: 'about', label: t.pages_about || (language === 'ar' ? 'حول' : 'About'), icon: Info },
            { id: 'members', label: t.common_followers || (language === 'ar' ? 'المتابعون' : 'Followers'), icon: Users },
            { id: 'photos', label: t.pages_photos || (language === 'ar' ? 'الصور' : 'Photos'), icon: ImageIcon },
            { id: 'videos', label: t.pages_videos || (language === 'ar' ? 'الفيديو' : 'Videos'), icon: Video },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActivePageTab(tab.id)}
              className={`flex items-center gap-2 px-4 py-3 font-bold text-sm border-b-[3px] transition whitespace-nowrap ${
                activePageTab === tab.id
                  ? 'border-green-700 dark:border-green-500 text-green-700 dark:text-green-500 hover:text-blue-700 dark:hover:text-blue-700 hover:border-blue-700 dark:hover:border-blue-700 bg-green-50/50 dark:bg-green-900/10'
                  : 'border-transparent text-gray-500 hover:bg-gray-50 dark:text-gray-400 dark:hover:bg-gray-800 rounded-t-lg hover:text-blue-700 dark:hover:text-blue-700'
              }`}
            >
              <tab.icon className="w-4 h-4" />
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      <div className="p-4 md:p-6 bg-gray-50 dark:bg-gray-900 min-h-[400px] rounded-b-xl">
        {activePageTab === 'posts' && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="space-y-4">
              <div className="bg-white dark:bg-gray-800 p-5 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700">
                <h3 className="font-bold text-lg mb-3 text-gray-900 dark:text-white">{t.pages_about || (language === 'ar' ? 'حول' : 'About')}</h3>
                <p className="text-sm text-gray-600 dark:text-gray-300 leading-relaxed mb-4">
                  {viewingPage.description || (language === 'ar' ? 'لا يوجد وصف متاح لهذه الصفحة.' : 'No description available.')}
                </p>
                <div className="space-y-3 text-sm">
                  <div className="flex items-center gap-2 text-gray-500 dark:text-gray-400">
                    <Info className="w-4 h-4" />
                    <span className="font-medium">{getCategoryLabel(viewingPage.category)}</span>
                  </div>
                  {viewingPage.website && (
                    <div className="flex items-center gap-2 text-gray-500 dark:text-gray-400">
                      <Globe className="w-4 h-4" />
                      <a href={`http://${viewingPage.website}`} target="_blank" rel="noreferrer" className="text-green-700 dark:text-green-500 hover:text-blue-700 dark:hover:text-blue-700 hover:underline truncate font-medium">{viewingPage.website}</a>
                    </div>
                  )}
                  {viewingPage.email && (
                    <div className="flex items-center gap-2 text-gray-500 dark:text-gray-400">
                      <Mail className="w-4 h-4" />
                      <a href={`mailto:${viewingPage.email}`} className="text-gray-700 dark:text-gray-200 hover:text-blue-700 dark:hover:text-blue-700 hover:underline truncate font-medium">{viewingPage.email}</a>
                    </div>
                  )}
                  {viewingPage.phone && (
                    <div className="flex items-center gap-2 text-gray-500 dark:text-gray-400">
                      <Phone className="w-4 h-4" />
                      <span className="text-gray-700 dark:text-gray-200 font-medium">{viewingPage.phone}</span>
                    </div>
                  )}
                </div>
              </div>
            </div>

            <div className="md:col-span-2 space-y-4">
              {isPageModerator(viewingPage) && (
                <CreatePost
                  currentUser={pageUserAsAdmin}
                  onPostCreate={onCreatePost}
                />
              )}

              {(pagePosts[viewingPage.id] && pagePosts[viewingPage.id].length > 0) ? (
                pagePosts[viewingPage.id].map(post => {
                  const isPagePost = post.author.id === viewingPage.id;
                  const isAdmin = isPageModerator(viewingPage);
                  const cardUser = (isPagePost && isAdmin) ? pageUserAsAdmin : currentUser;

                  return (
                    <PostCard
                      key={post.id} 
                      post={post} 
                      currentUser={cardUser}
                      onTogglePin={() => isPageModerator(viewingPage) && onPostTogglePin(post.id)}
                      onDelete={() => isPageModerator(viewingPage) && onPostDelete(post.id)}
                      onMediaClick={(url, type) => onPostMediaClick(post, type)}
                      onLike={onPostLike}
                      onToggleSave={onPostSave}
                      onComment={onPostComment}
                      onDeleteComment={onDeletePostComment}
                      onLikeComment={onLikePostComment}
                      onSetProfilePicture={(url) => isPageAdmin(viewingPage) && handleAvatarUpdate(url)}
                      isSaved={post.isSaved}
                    />
                  );
                })
              ) : (
                <div className="bg-white dark:bg-gray-800 p-12 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 text-center">
                  <div className="w-20 h-20 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Flag className="w-10 h-10 text-gray-400" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-700 dark:text-gray-300 mb-1">{t.pages_posts || (language === 'ar' ? 'المنشورات' : 'Posts')}</h3>
                  <p className="text-gray-500 dark:text-gray-400 text-sm">{language === 'ar' ? 'لم تقم هذه الصفحة بنشر أي شيء مؤخراً.' : 'This page has not posted anything recently.'}</p>
                </div>
              )}
            </div>
          </div>
        )}

        {activePageTab === 'about' && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 animate-fadeIn">
            <div className="lg:col-span-2 space-y-6">
              <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl border border-gray-200 dark:border-gray-700 shadow-sm">
                <div className="flex justify-between items-start mb-4 pb-3 border-b border-gray-100 dark:border-gray-700">
                  <h4 className="font-bold text-xl text-gray-900 dark:text-white flex items-center gap-2">
                    <FileText className="w-6 h-6 text-green-700 dark:text-green-500" />
                    {t.pages_about || (language === 'ar' ? 'الوصف' : 'Description')}
                  </h4>
                  {isPageAdmin(viewingPage) && (
                    <button
                      onClick={onOpenEdit}
                      className="text-green-700 dark:text-green-500 text-sm hover:underline font-bold flex items-center gap-1 hover:text-blue-700 dark:hover:text-blue-700"
                    >
                      <Edit3 className="w-4 h-4" /> {t.common_edit || (language === 'ar' ? 'تعديل' : 'Edit')}
                    </button>
                  )}
                </div>
                <p className="text-gray-700 dark:text-gray-200 leading-relaxed whitespace-pre-wrap text-base mb-8">
                  {viewingPage.description || (language === 'ar' ? 'لا يوجد وصف متاح.' : 'No description available.')}
                </p>

                <div className="pt-6 border-t border-gray-100 dark:border-gray-700">
                  <div className="space-y-6">
                    {/* General Info */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <h4 className="text-sm font-bold text-gray-500 uppercase mb-3">{t.common_general || (language === 'ar' ? 'عام' : 'General')}</h4>
                        <div className="space-y-4">
                          <div>
                            <label className="text-sm font-semibold text-gray-700 dark:text-gray-300 block mb-1">{t.pages_page_name || (language === 'ar' ? 'اسم الصفحة' : 'Page Name')}</label>
                            <p className="text-gray-900 dark:text-white text-lg">{viewingPage.name}</p>
                          </div>
                          <div>
                            <label className="text-sm font-semibold text-gray-700 dark:text-gray-300 block mb-1">{t.common_category || (language === 'ar' ? 'الفئة' : 'Category')}</label>
                            <div className="flex items-center gap-2 text-gray-900 dark:text-white">
                              <Briefcase className="w-4 h-4 text-gray-500" />
                              {getCategoryLabel(viewingPage.category)}
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Contact Info */}
                      <div>
                        <h4 className="text-sm font-bold text-gray-500 uppercase mb-3">{t.pages_contact || (language === 'ar' ? 'معلومات الاتصال' : 'Contact Info')}</h4>
                        <div className="space-y-4">
                          <div>
                            <label className="text-sm font-semibold text-gray-700 dark:text-gray-300 block mb-1">{t.pages_website || (language === 'ar' ? 'موقع الويب' : 'Website')}</label>
                            {viewingPage.website ? (
                              <a href={`http://${viewingPage.website}`} target="_blank" rel="noreferrer" className="text-green-700 dark:text-green-500 hover:text-blue-700 dark:hover:text-blue-700 hover:underline flex items-center gap-2">
                                <Globe className="w-4 h-4" /> {viewingPage.website}
                              </a>
                            ) : (
                              <span className="text-gray-400 italic text-sm">{language === 'ar' ? 'لا يوجد موقع ويب' : 'No website'}</span>
                            )}
                          </div>

                          <div>
                            <label className="text-sm font-semibold text-gray-700 dark:text-gray-300 block mb-1">{t.pages_email || (language === 'ar' ? 'البريد الإلكتروني' : 'Email')}</label>
                            {viewingPage.email ? (
                              <a href={`mailto:${viewingPage.email}`} className="text-gray-900 dark:text-white hover:text-blue-700 dark:hover:text-blue-700 hover:underline flex items-center gap-2">
                                <Mail className="w-4 h-4" /> {viewingPage.email}
                              </a>
                            ) : (
                              <span className="text-gray-400 italic text-sm">{language === 'ar' ? 'لا يوجد بريد إلكتروني' : 'No email'}</span>
                            )}
                          </div>

                          <div>
                            <label className="text-sm font-semibold text-gray-700 dark:text-gray-300 block mb-1">{t.pages_phone || (language === 'ar' ? 'الهاتف' : 'Phone')}</label>
                            {viewingPage.phone ? (
                              <div className="text-gray-900 dark:text-white flex items-center gap-2">
                                <Phone className="w-4 h-4" /> {viewingPage.phone}
                              </div>
                            ) : (
                              <span className="text-gray-400 italic text-sm">{language === 'ar' ? 'لا يوجد رقم هاتف' : 'No phone'}</span>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl border border-gray-200 dark:border-gray-700 shadow-sm">
                <h4 className="font-bold text-xl text-gray-900 dark:text-white mb-5 flex items-center gap-2">
                  <Shield className="w-6 h-6 text-green-700 dark:text-green-500" />
                  {t.common_rules || (language === 'ar' ? 'قواعد الصفحة' : 'Page Rules')}
                </h4>
                <ul className="space-y-4">
                  {displayRules.map((rule, i) => (
                    <li key={i} className="flex gap-4 text-[15px] text-gray-700 dark:text-gray-300 bg-gray-50 dark:bg-gray-700/30 p-4 rounded-xl">
                      <span className="font-bold text-green-700 dark:text-green-500 bg-green-100 dark:bg-green-900/20 w-7 h-7 flex items-center justify-center rounded-full text-sm flex-shrink-0">{i + 1}</span>
                      <span>{rule}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            <div className="space-y-6">
              <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl border border-gray-200 dark:border-gray-700 shadow-sm">
                <h4 className="font-bold text-lg text-gray-900 dark:text-white mb-5 flex items-center gap-2">
                  <BarChart3 className="w-5 h-5 text-green-700 dark:text-green-500" />
                  {language === 'ar' ? 'نشاط الصفحة' : 'Page Activity'}
                </h4>
                <div className="space-y-5">
                  <div className="flex items-center gap-4">
                    <div className="bg-green-50 dark:bg-green-900/20 p-2.5 rounded-full text-green-700 dark:text-green-500"><Grid className="w-5 h-5" /></div>
                    <div className="flex flex-col">
                      <span className="font-bold text-gray-900 dark:text-white text-lg">{pagePosts[viewingPage.id]?.length || 0}</span>
                      <span className="text-xs font-medium text-gray-500 dark:text-gray-400">{language === 'ar' ? 'إجمالي المنشورات' : 'Total Posts'}</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="bg-purple-50 dark:bg-purple-900/20 p-2.5 rounded-full text-purple-600 dark:text-purple-400"><Users className="w-5 h-5" /></div>
                    <div className="flex flex-col">
                      <span className="font-bold text-gray-900 dark:text-white text-lg">{viewingPage.followersCount}</span>
                      <span className="text-xs font-medium text-gray-500 dark:text-gray-400">{t.pages_followers || (language === 'ar' ? 'متابع' : 'Followers')}</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl border border-gray-200 dark:border-gray-700 shadow-sm">
                <div className="flex justify-between items-center mb-4">
                  <h4 className="font-bold text-lg text-gray-900 dark:text-white flex items-center gap-2">
                    <UserCog className="w-5 h-5 text-green-700 dark:text-green-500" />
                    {language === 'ar' ? 'المسؤولون' : 'Admins'}
                  </h4>
                  <button onClick={() => setActivePageTab('members')} className="text-xs text-green-700 dark:text-green-500 hover:text-blue-700 dark:hover:text-blue-700 hover:underline font-bold">{t.common_view_all || 'View All'}</button>
                </div>
                <div className="flex flex-wrap gap-2">
                  {adminsAndMods.slice(0, 5).map(admin => (
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

        {activePageTab === 'members' && (
          <div className="space-y-6 animate-fadeIn">
            <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 flex flex-col md:flex-row justify-between items-center gap-4">
              <div>
                <h3 className="text-2xl font-extrabold text-gray-900 dark:text-white flex items-center gap-2">
                  <Users className="w-7 h-7 text-green-700 dark:text-green-500" />
                  {t.common_followers || (language === 'ar' ? 'المتابعون' : 'Followers')} ({viewingPage.membersList?.length || 0})
                </h3>
                <p className="text-gray-500 dark:text-gray-400 text-sm mt-1 font-medium">{language === 'ar' ? `قائمة بمن يديرون ويتابعون صفحة ${viewingPage.name}` : `List of people who manage and follow ${viewingPage.name}`}</p>
              </div>
              <div className="flex gap-2 w-full md:w-auto">
                <div className="relative flex-1 md:w-64">
                  <Search className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input
                    type="text"
                    placeholder={t.common_search || (language === 'ar' ? 'بحث...' : 'Search...')}
                    className="w-full bg-gray-100 dark:bg-gray-700 rounded-full py-2.5 pr-10 pl-4 text-sm outline-none focus:ring-2 focus:ring-green-700 dark:text-white transition"
                    value={memberSearch}
                    onChange={(e) => setMemberSearch(e.target.value)}
                  />
                </div>
                {isPageAdmin(viewingPage) && (
                  <button onClick={onOpenRoles} className="bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-500 px-5 py-2.5 rounded-full hover:bg-green-100 transition shadow-sm font-bold flex items-center gap-2">
                    <UserCog className="w-5 h-5" /> {t.pages_manage_roles || (language === 'ar' ? 'إدارة الأعضاء' : 'Manage Roles')}
                  </button>
                )}
              </div>
            </div>

            {adminsAndMods.length > 0 && (
              <div className="space-y-4">
                <h4 className="font-bold text-gray-900 dark:text-white text-lg flex items-center gap-2 px-2">
                  <Shield className="w-5 h-5 text-red-500" /> {t.pages_admin_roles || (language === 'ar' ? 'المسؤولون والمشرفون' : 'Admins & Moderators')}
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {adminsAndMods.map(member => (
                    <div key={member.userId} className="bg-white dark:bg-gray-800 p-4 rounded-xl border border-gray-100 dark:border-gray-700 hover:shadow-md transition group flex items-center justify-between shadow-sm">
                      <div className="flex items-center gap-4">
                        <div className="relative">
                          <img src={member.avatar} alt={member.name} className="w-14 h-14 rounded-full object-cover border-2 border-green-700/20 dark:border-green-500/20" />
                          <div className="absolute -bottom-1 -right-1 bg-green-700 dark:bg-green-500 text-white p-1 rounded-full border-2 border-white dark:border-gray-800 shadow-sm"><Shield className="w-3 h-3" /></div>
                        </div>
                        <div>
                          <div className="font-bold text-base text-gray-900 dark:text-white group-hover:text-blue-700 dark:group-hover:text-blue-700 transition">{member.name}</div>
                          <div className="text-[11px] text-gray-400 mt-1 flex items-center gap-1 font-bold">
                            {member.role === 'admin' ? (t.common_admin || 'Admin') : (t.common_moderator || 'Moderator')} • <Clock className="w-3 h-3" /> {language === 'ar' ? 'انضم' : 'Joined'} {member.joinedAt}
                          </div>
                        </div>
                      </div>
                      <button className="text-gray-400 hover:text-blue-700 dark:hover:text-blue-700 p-2 rounded-full hover:bg-green-50 dark:hover:bg-green-900/20 transition"><MessageCircle className="w-5 h-5" /></button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div className="space-y-4">
              <h4 className="font-bold text-gray-900 dark:text-white text-lg flex items-center gap-2 px-2">
                <Users className="w-5 h-5 text-gray-400" /> {t.common_followers || (language === 'ar' ? 'المتابعون' : 'Followers')}
              </h4>
              {regularMembers.length > 0 ? (
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                  {regularMembers.map(member => (
                    <div key={member.userId} className="bg-white dark:bg-gray-800 p-4 rounded-xl border border-gray-100 dark:border-gray-700 hover:shadow-md transition group flex flex-col items-center text-center shadow-sm">
                      <img src={member.avatar} alt={member.name} className="w-20 h-20 rounded-full object-cover mb-3 grayscale group-hover:grayscale-0 transition duration-500 shadow-sm border border-gray-100" />
                      <div className="font-bold text-sm text-gray-900 dark:text-white truncate w-full mb-1">{member.name}</div>
                      <div className="text-[10px] text-gray-400 font-bold">{language === 'ar' ? 'منذ' : 'Since'} {member.joinedAt}</div>
                      <button className="mt-3 w-full bg-gray-50 dark:bg-gray-700 py-1.5 rounded-lg text-xs font-bold text-gray-600 dark:text-gray-300 hover:bg-green-700 dark:hover:bg-green-500 hover:text-white transition">{t.pages_follow || (language === 'ar' ? 'متابعة' : 'Follow')}</button>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-20 bg-white dark:bg-gray-800 rounded-2xl border-2 border-dashed border-gray-200 dark:border-gray-700 text-gray-400 font-bold">
                  <Users className="w-12 h-12 mx-auto mb-3 opacity-20" />
                  {t.common_no_results || (language === 'ar' ? 'لم يتم العثور على نتائج' : 'No results found')}
                </div>
              )}
            </div>
          </div>
        )}

        {activePageTab === 'photos' && (
          <PagePhotos 
            currentUser={currentUser}
            isPageAdmin={isPageAdmin(viewingPage)}
            photos={currentTabPhotos}
            albums={pageAlbums}
            onAddPhoto={(photo) => {
                const caption = language === 'ar' ? 'تم إضافة صورة جديدة' : 'New photo added';
                onCreatePost(caption, photo.url);
            }}
            onCreateAlbum={onCreatePageAlbum}
            onAddPhotoToAlbum={onAddPhotoToPageAlbum}
            onViewMedia={handlePhotosViewMedia}
            onLike={onPostLike}
            onComment={onPostComment}
            onDeleteComment={onDeletePostComment}
            onLikeComment={onLikePostComment}
            onDeletePost={onPostDelete}
            onToggleSave={onPostSave}
            onTogglePin={onPostTogglePin}
            onUpdateAvatar={handleAvatarUpdate}
            // @ts-ignore - viewingPage passed to fix "Current Page" issue in PagePhotos lightbox
            viewingPage={viewingPage}
          />
        )}

        {activePageTab === 'videos' && (
          <div className="animate-fadeIn">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
                <Video className="w-5 h-5 text-green-700 dark:text-green-500" /> {t.pages_videos || (language === 'ar' ? 'الفيديوهات' : 'Videos')}
              </h3>
              {isPageModerator(viewingPage) && (
                <button
                  onClick={() => videoInputRef.current?.click()}
                  className="bg-green-700 text-white px-5 py-2 rounded-lg font-bold text-sm hover:bg-blue-700 transition flex items-center gap-2 shadow-sm"
                >
                  <Upload className="w-4 h-4" /> {t.profile_videos_add_video || (language === 'ar' ? 'إضافة فيديو' : 'Add Video')}
                </button>
              )}
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {pageVideos.length > 0 ? pageVideos.map((video, idx) => (
                <div key={video.post.id} className="aspect-video bg-black rounded-2xl overflow-hidden cursor-pointer hover:opacity-90 transition relative group shadow-md" onClick={() => onPostMediaClick(video.post, 'video')}>
                  <video src={video.url} className="w-full h-full object-cover pointer-events-none" />
                  <div className="absolute inset-0 flex items-center justify-center bg-black/30 group-hover:bg-transparent transition">
                    <div className="bg-white/20 p-3 rounded-full backdrop-blur-sm group-hover:scale-110 transition border border-white/30">
                      <Play className="w-8 h-8 text-white fill-current" />
                    </div>
                  </div>
                </div>
              )) : <div className="col-span-full text-center py-20 text-gray-500 bg-white dark:bg-gray-800 rounded-xl border border-dashed border-gray-300 dark:border-gray-600"><Video className="w-12 h-12 mx-auto mb-2 opacity-30" /><p>{t.profile_no_videos || (language === 'ar' ? 'لا توجد مقاطع فيديو لعرضها.' : 'No videos to show.')}</p></div>}
            </div>
          </div>
        )}
      </div>

      {/* --- Lightbox Modal for Standalone Media (Avatar/Cover) --- */}
      {viewingImage && typeof document !== 'undefined' && createPortal(
        <PageMediaLightbox 
            viewingPage={viewingPage} 
            activeMediaIndex={0} 
            lightboxType="photos"
            mediaList={lightboxMediaList} 
            currentUser={currentUser}
            mediaLikes={viewingImagePost?.likes || 0} 
            isMediaLiked={viewingImagePost?.isLiked || false} 
            mediaReaction={viewingImagePost?.reaction}
            mediaComments={viewingImagePost?.comments || []}
            mediaCommentInput={mediaCommentInput}
            setMediaCommentInput={setMediaCommentInput}
            onClose={() => setViewingImage(null)}
            onNext={() => {}}
            onPrev={() => {}}
            onToggleLike={(reaction) => viewingImagePost && onPostLike(viewingImagePost.id, reaction)}
            onPostComment={(text) => viewingImagePost && onPostComment && onPostComment(viewingImagePost.id, text)}
            onShare={() => {}}
            commentsEndRef={mediaCommentsEndRef}
            onDeleteComment={(commentId) => viewingImagePost && onDeletePostComment && onDeletePostComment(viewingImagePost.id, commentId)}
            onLikeComment={(commentId) => viewingImagePost && onLikePostComment && onLikePostComment(viewingImagePost.id, commentId)}
            onDeletePost={() => { 
                 if(viewingImagePost && onPostDelete) { 
                     onPostDelete(viewingImagePost.id); 
                     setViewingImage(null); 
                 } 
            }}
            onToggleSave={() => viewingImagePost && onPostSave && onPostSave(viewingImagePost)}
            onTogglePin={() => viewingImagePost && onPostTogglePin(viewingImagePost.id)}
            onUpdateAvatar={onUpdateAvatar || (() => {})}
            viewingPost={viewingImagePost}
        />,
        document.body
      )}

    </div>
  );
};

export default PageDetail;