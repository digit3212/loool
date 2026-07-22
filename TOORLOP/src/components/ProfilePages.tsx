import React, { useState, useRef, useEffect, useMemo } from 'react';
import { createPortal } from 'react-dom';
import { 
  Check, X, AlertCircle, CheckCircle, Flag, Search, Plus, ThumbsUp, 
  MessageCircle, MoreHorizontal, Share2, Bell, BellOff, Trash2, Globe, 
  Mail, Phone, Calendar, Briefcase, Grid, Shield, UserCog, Play, 
  Upload, Clock, Edit3, UserPlus, MapPin, UserCheck, Bookmark, LayoutGrid, Pin, PinOff, Link as LinkIcon, Download, Image as ImageIcon, Video, UserCircle, LogOut, BookmarkMinus
} from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { User, Post, Page, PageMember, Comment, Album, Photo } from '../types';
import ChatWindow from './ChatWindow';
import PageList from '../pages/PageList';
import PageDetail from '../pages/PageDetail';
import PageModals from '../pages/PageModals';
import PageMediaLightbox from '../pages/PageMediaLightbox';
import { safeSetItem, safeGetItem } from '../utils/safeStorage';

interface ProfilePagesProps {
  currentUser?: User;
  pages?: Page[];
  setPages?: React.Dispatch<React.SetStateAction<Page[]>>;
  pagePosts?: Record<string, Post[]>;
  setPagePosts?: React.Dispatch<React.SetStateAction<Record<string, Post[]>>>;
  pageAlbums?: Record<string, Album[]>;
  setPageAlbums?: React.Dispatch<React.SetStateAction<Record<string, Album[]>>>;
  onLike?: (id: string, reactionType?: string) => void;
  onComment?: (id: string, text: string) => void;
  onDeleteComment?: (id: string, commentId: string) => void;
  onLikeComment?: (id: string, commentId: string) => void;
  onToggleSave?: (item: any) => void;
  onDeletePost?: (id: string) => void;
  onTogglePin?: (id: string) => void;
  showNotification?: (message: string, type?: 'success' | 'info' | 'error') => void;
}

const DEFAULT_USER: User = {
  id: 'me',
  name: 'User',
  avatar: 'https://picsum.photos/200/200',
  online: true
};

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

const PAGE_RULES_DATA = {
  ar: [
    "احترم جميع المتابعين ولا تستخدم ألفاظاً نابية.",
    "يمنع نشر المحتوى الإعلاني أو السبام.",
    "احرص أن تكون المنشورات ذات صلة بموضوع الصفحة.",
    "يمنع نشر المعلومات الشخصية للآخرين."
  ],
  en: [
    "Respect all followers and do not use profanity.",
    "No advertising or spam content allowed.",
    "Ensure posts are relevant to the page topic.",
    "Do not publish personal information of others."
  ]
};

const INITIAL_PAGES_DATA: Page[] = [
  {
    id: 'p1',
    name: 'محبي التقنية',
    avatar: 'https://picsum.photos/200/200?random=501',
    coverUrl: 'https://picsum.photos/800/300?random=502',
    category: 'tech',
    likesCount: '15K',
    followersCount: '16.5K',
    isLiked: true,
    isFollowed: true,
    notifications: true,
    description: 'أحدث أخبار التقنية والمراجعات التقنية في العالم العربي.',
    website: 'www.techlovers.com',
    email: 'contact@techlovers.com',
    ownerId: 'me',
    admins: ['me'],
    moderators: [],
    membersList: [
        { userId: 'me', name: 'أحمد علي', avatar: 'https://picsum.photos/200/200?random=1', role: 'admin', joinedAt: '2023-01-01' },
        { userId: 'u2', name: 'سارة محمد', avatar: 'https://picsum.photos/50/50?random=102', role: 'moderator', joinedAt: '2023-02-15' },
    ]
  },
  {
    id: 'p2',
    name: 'طبخات سريعة',
    avatar: 'https://picsum.photos/200/200?random=503',
    coverUrl: 'https://picsum.photos/800/300?random=504',
    category: 'food',
    likesCount: '50K',
    followersCount: '60K',
    isLiked: false,
    isFollowed: false,
    notifications: false,
    description: 'وصفات سهلة وسريعة لكل يوم.',
    ownerId: 'u2',
    admins: ['u2'],
    moderators: [],
    membersList: []
  }
];

type TabType = 'all' | 'liked' | 'discover' | 'my_pages';
type PageTab = 'posts' | 'about' | 'members' | 'photos' | 'videos';

const ProfilePages: React.FC<ProfilePagesProps> = ({ 
    currentUser = DEFAULT_USER,
    pages: propPages,
    setPages: propSetPages,
    pagePosts: propPagePosts,
    setPagePosts: propSetPagePosts,
    pageAlbums: propPageAlbums,
    setPageAlbums: propSetPageAlbums,
    onLike,
    onComment,
    onDeleteComment,
    onLikeComment,
    onToggleSave,
    onDeletePost,
    onTogglePin,
    showNotification
}) => {
  const { t, dir, language } = useLanguage();
  
  const currentRules = useMemo(() => {
    return language === 'ar' ? PAGE_RULES_DATA.ar : PAGE_RULES_DATA.en;
  }, [language]);

  const [localPages, setLocalPages] = useState<Page[]>(() => {
      return safeGetItem('tourloop_pages', INITIAL_PAGES_DATA);
  });
  
  const [localPagePosts, setLocalPagePosts] = useState<Record<string, Post[]>>(() => {
      return safeGetItem('tourloop_page_posts', {});
  });

  const [localPageAlbums, setLocalPageAlbums] = useState<Record<string, Album[]>>(() => {
      return safeGetItem('tourloop_page_albums', {});
  });

  const pages = propPages || localPages;
  const setPages = propSetPages || setLocalPages;
  const pagePosts = propPagePosts || localPagePosts;
  const setPagePosts = propSetPagePosts || setLocalPagePosts;
  const pageAlbums = propPageAlbums || localPageAlbums;
  const setPageAlbums = propSetPageAlbums || setLocalPageAlbums;

  const [searchTerm, setSearchTerm] = useState('');
  const [activeTab, setActiveTab] = useState<TabType>('all');
  const [activeMenuId, setActiveMenuId] = useState<string | null>(null);
  const [viewingPage, setViewingPage] = useState<Page | null>(null);
  const [activePageTab, setActivePageTab] = useState<PageTab>('posts');
  const [activeChatPage, setActiveChatPage] = useState<Page | null>(null);
  
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [newPageName, setNewPageName] = useState('');
  const [newPageCategory, setNewPageCategory] = useState(PAGE_CATEGORIES[0].id);
  const [newPageDesc, setNewPageDesc] = useState('');
  const [isCreating, setIsCreating] = useState(false);
  
  const [showEditPageModal, setShowEditPageModal] = useState(false);
  const [editPageName, setEditPageName] = useState('');
  const [editPageCategory, setEditPageCategory] = useState('');
  const [editPageDesc, setEditPageDesc] = useState('');
  const [editPageWebsite, setEditPageWebsite] = useState('');
  const [editPageEmail, setEditPageEmail] = useState('');
  const [editPagePhone, setEditPagePhone] = useState('');
  const [isUpdating, setIsUpdating] = useState(false);
  
  const [showRolesModal, setShowRolesModal] = useState(false);
  const [roleSearchTerm, setRoleSearchTerm] = useState('');
  const [selectedRoleType, setSelectedRoleType] = useState<'admin' | 'moderator'>('moderator');
  
  const [mediaLightboxOpen, setMediaLightboxOpen] = useState(false);
  const [activeMediaIndex, setActiveMediaIndex] = useState(0);
  const [lightboxType, setLightboxType] = useState<'photos' | 'videos'>('photos');
  const [mediaCommentInput, setMediaCommentInput] = useState('');
  const [lightboxPostId, setLightboxPostId] = useState<string | null>(null);
  const [currentLightboxList, setCurrentLightboxList] = useState<any[]>([]);
  
  const [confirmModal, setConfirmModal] = useState<{ isOpen: boolean; pageId: string | null; pageName: string }>({ isOpen: false, pageId: null, pageName: '' });  
  const [isDeleting, setIsDeleting] = useState(false);

  const [deletePostModal, setDeletePostModal] = useState<{ isOpen: boolean, postId: string | null }>({ isOpen: false, postId: null });

  const [notification, setNotification] = useState<{message: string, type: 'success' | 'info' | 'error'} | null>(null);

  const menuRef = useRef<HTMLDivElement>(null);
  const mediaCommentsEndRef = useRef<HTMLDivElement>(null);
  const pageAvatarInputRef = useRef<HTMLInputElement>(null);
  const pageCoverInputRef = useRef<HTMLInputElement>(null);

  const notify = (msg: string, type: 'success' | 'info' | 'error' = 'success') => {
      setNotification({ message: msg, type });
      setTimeout(() => setNotification(null), 3000);
      if (showNotification) {
          showNotification(msg, type);
      }
  };

  const readFileAsBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = (event) => {
        const img = new Image();
        img.src = event.target?.result as string;
        img.onload = () => {
          const canvas = document.createElement('canvas');
          const ctx = canvas.getContext('2d');
          const maxWidth = 800;
          const maxHeight = 800;
          let width = img.width;
          let height = img.height;
          if (width > height) {
            if (width > maxWidth) {
              height *= maxWidth / width;
              width = maxWidth;
            }
          } else {
            if (height > maxHeight) {
              width *= maxHeight / height;
              height = maxHeight;
            }
          }
          canvas.width = width;
          canvas.height = height;
          if (ctx) {
             ctx.drawImage(img, 0, 0, width, height);
             const compressedBase64 = canvas.toDataURL('image/jpeg', 0.7);
             resolve(compressedBase64);
          } else {
             resolve(event.target?.result as string);
          }
        };
      };
      reader.onerror = error => reject(error);
    });
  };

  const isPageAdmin = (page: Page) => page.ownerId === currentUser.id || page.admins.includes(currentUser.id);
  const isPageModerator = (page: Page) => page.moderators.includes(currentUser.id) || isPageAdmin(page);

  const handleLikeToggle = (pageId: string, e?: React.MouseEvent) => {
    e?.stopPropagation();
    setPages(prev => prev.map(p => {
        if (p.id === pageId) {
            const newState = !p.isLiked;
            const msg = newState ? (language === 'ar' ? 'تم الإعجاب بالصفحة' : 'Liked Page') : (language === 'ar' ? 'تم إلغاء الإعجاب' : 'Unliked Page');
            notify(msg, 'success');
            if (viewingPage && viewingPage.id === pageId) setViewingPage({ ...p, isLiked: newState });
            return { ...p, isLiked: newState };
        }
        return p;
    }));
  };

  const handleMessage = (page: Page, e?: React.MouseEvent) => {
      e?.stopPropagation();
      setActiveChatPage(page);
  };

  const handleShare = (pageName: string) => {
      navigator.clipboard.writeText(window.location.href);
      notify(t.common_copied || (language === 'ar' ? 'تم النسخ' : 'Copied'), 'success');
      setActiveMenuId(null);
  };

  const handleToggleNotifications = (pageId: string) => {
      setPages(prev => prev.map(p => {
          if (p.id === pageId) {
              const newState = !p.notifications;
              notify(newState ? t.post_turn_on_notif : t.post_turn_off_notif, 'info');
              if (viewingPage && viewingPage.id === pageId) {
                  setViewingPage({ ...p, notifications: newState });
              }
              return { ...p, notifications: newState };
          }
          return p;
      }));
      setActiveMenuId(null);
  };

  const handleReport = (pageName: string) => {
      notify(language === 'ar' ? 'تم إرسال البلاغ بنجاح' : 'Report sent successfully', 'info');
      setActiveMenuId(null);
  };

  const handleCreatePage = () => {
      if (!newPageName.trim()) { 
        notify(t.errors_required || (language === 'ar' ? 'هذا الحقل مطلوب' : 'Required Field'), 'error'); 
        return; 
      }
      setIsCreating(true);
      setTimeout(() => {
          const newPage: any = {
              id: `new_${Date.now()}`,
              name: newPageName,
              avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(newPageName)}&background=random`,
              coverUrl: `https://picsum.photos/800/300?random=${Date.now()}`,
              category: newPageCategory,
              likesCount: '0',
              followersCount: '0',
              isLiked: true,
              isFollowed: true,
              notifications: true,
              description: newPageDesc || (language === 'ar' ? 'وصف الصفحة الجديدة' : 'New Page Description'),
              ownerId: currentUser.id,
              admins: [currentUser.id],
              moderators: [],
              membersList: [
                  { userId: currentUser.id, name: currentUser.name, avatar: currentUser.avatar, role: 'admin', joinedAt: new Date().toISOString().split('T')[0] }
              ],
              rules: currentRules
          };
          setPages(prev => [newPage, ...prev]);
          setIsCreating(false); setShowCreateModal(false); setNewPageName(''); setNewPageDesc('');
          notify(language === 'ar' ? 'تم إنشاء الصفحة بنجاح' : 'Page created successfully', 'success');
          setViewingPage(newPage); 
          setActivePageTab('posts');
      }, 1000);
  };

  const handleDeletePage = (pageId: string, pageName: string) => {
      setConfirmModal({ isOpen: true, pageId, pageName });
      setActiveMenuId(null);
  };

  const executeDeletePage = () => {
      const { pageId } = confirmModal; if (!pageId) return;
      setIsDeleting(true);
      setTimeout(() => {
          if (viewingPage && viewingPage.id === pageId) setViewingPage(null);
          setPages(prev => prev.filter(p => p.id !== pageId));
          notify(language === 'ar' ? 'تم حذف الصفحة' : 'Page Deleted', 'info');
          setConfirmModal({ isOpen: false, pageId: null, pageName: '' });
          setIsDeleting(false);
      }, 1000);
  };

  const closeConfirmModal = () => { setConfirmModal({ isOpen: false, pageId: null, pageName: '' }); };

  const handleOpenEditModal = () => {
      if (viewingPage) {
          if (!isPageAdmin(viewingPage)) {
              notify(t.errors_generic || 'Error', 'error');
              return;
          }
          setEditPageName(viewingPage.name);
          setEditPageCategory(viewingPage.category);
          setEditPageDesc(viewingPage.description || '');
          setEditPageWebsite(viewingPage.website || '');
          setEditPageEmail(viewingPage.email || '');
          setEditPagePhone(viewingPage.phone || '');
          setShowEditPageModal(true);
      }
  };

  const handleSavePageChanges = () => {
      if (!viewingPage || !editPageName.trim()) { notify(t.errors_required || 'Required', 'error'); return; }
      setIsUpdating(true);
      setTimeout(() => {
          const updatedPage = { 
              ...viewingPage, 
              name: editPageName, 
              category: editPageCategory, 
              description: editPageDesc, 
              website: editPageWebsite, 
              email: editPageEmail, 
              phone: editPagePhone 
          };
          setPages(prev => prev.map(p => p.id === viewingPage.id ? updatedPage : p));
          setViewingPage(updatedPage); 
          setIsUpdating(false); 
          setShowEditPageModal(false);
          notify(language === 'ar' ? 'تم حفظ التغييرات بنجاح' : 'Changes saved successfully', 'success');
      }, 800);
  };

  const handleAddRole = () => {
      if (!viewingPage || !roleSearchTerm) return;
      const newMember: PageMember = { 
          userId: `u_${Date.now()}`, 
          name: roleSearchTerm, 
          avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(roleSearchTerm)}&background=random`, 
          role: selectedRoleType, 
          joinedAt: new Date().toISOString().split('T')[0] 
      };
      const updatedPage = { ...viewingPage, membersList: [...viewingPage.membersList, newMember] };
      if (selectedRoleType === 'admin') updatedPage.admins = [...updatedPage.admins, newMember.userId];
      else if (selectedRoleType === 'moderator') updatedPage.moderators = [...updatedPage.moderators, newMember.userId];
      
      setPages(prev => prev.map(p => p.id === viewingPage.id ? updatedPage : p));
      setViewingPage(updatedPage); 
      setRoleSearchTerm('');
      notify(language === 'ar' ? 'تم إضافة العضو بنجاح' : 'Member added successfully', 'success');
  };

  const handleRemoveRole = (userId: string, role: string) => {
      if (!viewingPage) return;
      if (userId === viewingPage.ownerId) { notify(t.errors_generic || 'Error', 'error'); return; }
      const updatedPage = { 
          ...viewingPage, 
          membersList: viewingPage.membersList.filter(m => m.userId !== userId), 
          admins: viewingPage.admins.filter(id => id !== userId), 
          moderators: viewingPage.moderators.filter(id => id !== userId) 
      };
      setPages(prev => prev.map(p => p.id === viewingPage.id ? updatedPage : p));
      setViewingPage(updatedPage); 
      notify(language === 'ar' ? 'تم إزالة العضو' : 'Member removed', 'info');
  };

  const handleCreatePagePost = (content: string, media?: string, silent: boolean = false, forcedId?: string) => {
      if (!viewingPage) return;

      const newPostId = forcedId || `post_${Date.now()}`;

      const newPost: Post = { 
          id: newPostId, 
          author: { id: viewingPage.id, name: viewingPage.name, avatar: viewingPage.avatar, online: true }, 
          content, 
          image: media, 
          timestamp: t.common_time || 'Just now', 
          likes: 0, 
          comments: [], 
          shares: 0, 
          isPinned: false 
      };

      setPagePosts(prev => {
          const currentPosts = prev[viewingPage.id] || [];
          const filtered = forcedId ? currentPosts.filter(p => p.id !== forcedId) : currentPosts;
          return { ...prev, [viewingPage.id]: [newPost, ...filtered] };
      });

      if (!silent)
          notify(language === 'ar' ? 'تم نشر المنشور بنجاح' : 'Post published successfully', 'success');
  };

  const handleAvatarChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
      if (e.target.files && e.target.files[0] && viewingPage) {
          if (!isPageAdmin(viewingPage)) { notify(t.errors_generic || 'Error', 'error'); return; }

          if (e.target.files[0].size > 5 * 1024 * 1024) {
              notify(t.errors_file_too_large || 'File too large', 'error'); 
              return; 
          }

          const base64 = await readFileAsBase64(e.target.files[0]);
          // Generate a unique ID for this update to keep history
          const postId = `avatar_${viewingPage.id}_${Date.now()}`;

          const updatedPage = { ...viewingPage, avatar: base64 };
          setPages(prev => prev.map(p => p.id === viewingPage.id ? updatedPage : p));
          setViewingPage(updatedPage);

          // Pass unique ID to post creation so it doesn't overwrite previous avatar updates
          handleCreatePagePost(language === 'ar' ? 'تم تحديث صورة الملف الشخصي' : 'Updated Profile Picture', base64, true, postId);

          setPageAlbums(prev => {
              const pageId = viewingPage.id;
              const currentAlbums = prev[pageId] || [];
              let profileAlbum = currentAlbums.find(a => a.type === 'profile');

              const newPhoto: Photo = {
                  id: postId,
                  url: base64,
                  likes: 0,
                  comments: [],
                  isLiked: false,
                  description: 'Profile Picture'
              };

              if (profileAlbum) {
                  profileAlbum = { ...profileAlbum, photos: [newPhoto, ...profileAlbum.photos], coverUrl: base64 };
                  return { ...prev, [pageId]: currentAlbums.map(a => a.type === 'profile' ? profileAlbum : a) };
              } else {
                  profileAlbum = { id: `album_prof_${Date.now()}`, title: language === 'ar' ? 'صور الملف الشخصي' : 'Profile Pictures', type: 'profile', coverUrl: base64, photos: [newPhoto] };
                  return { ...prev, [pageId]: [profileAlbum, ...currentAlbums] };
              }
          });

          notify(language === 'ar' ? 'تم تحديث الصورة' : 'Image updated', 'success');
          e.target.value = '';
      }
  };

  const handleCoverChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
      if (e.target.files && e.target.files[0] && viewingPage) {
          if (!isPageAdmin(viewingPage)) { notify(t.errors_generic || 'Error', 'error'); return; }
          if (e.target.files[0].size > 5 * 1024 * 1024) {
              notify(t.errors_file_too_large || 'File too large', 'error'); 
              return;
          }

          const base64 = await readFileAsBase64(e.target.files[0]);
          // Generate a unique ID for this update to keep history
          const postId = `cover_${viewingPage.id}_${Date.now()}`;

          const updatedPage = { ...viewingPage, coverUrl: base64 };
          setPages(prev => prev.map(p => p.id === viewingPage.id ? updatedPage : p));
          setViewingPage(updatedPage);

          // Pass unique ID to post creation so it doesn't overwrite previous cover updates
          handleCreatePagePost(language === 'ar' ? 'تم تحديث الغلاف' : 'Updated Cover Photo', base64, true, postId);

          setPageAlbums(prev => {
              const pageId = viewingPage.id;
              const currentAlbums = prev[pageId] || [];
              let coverAlbum = currentAlbums.find(a => a.type === 'cover');

              const newPhoto: Photo = {
                  id: postId,
                  url: base64,
                  likes: 0,
                  comments: [], 
                  isLiked: false,
                  description: 'Cover Photo'
              };

              if (coverAlbum) {
                  coverAlbum = { ...coverAlbum, photos: [newPhoto, ...coverAlbum.photos], coverUrl: base64 };
                  return { ...prev, [pageId]: currentAlbums.map(a => a.type === 'cover' ? coverAlbum : a) };
              } else {
                  coverAlbum = { id: `album_cov_${Date.now()}`, title: language === 'ar' ? 'صور الغلاف' : 'Cover Photos', type: 'cover', coverUrl: base64, photos: [newPhoto] };
                  return { ...prev, [pageId]: [coverAlbum, ...currentAlbums] };
              }
          });
          
          notify(language === 'ar' ? 'تم تحديث الغلاف' : 'Cover updated', 'success');
          e.target.value = '';
      }
  };

  const handlePostTogglePin = (postId: string) => {
      if (!viewingPage || !isPageModerator(viewingPage)) return;

      const posts = pagePosts[viewingPage.id] || [];
      const post = posts.find(p => p.id === postId);
      if (post) {
           const isNowPinned = !post.isPinned;
           const msg = isNowPinned 
               ? (language === 'ar' ? 'تم تثبيت المنشور في الأعلى 📌' : 'Post pinned to top') 
               : (language === 'ar' ? 'تم إلغاء تثبيت المنشور' : 'Post unpinned');
           notify(msg, 'success');
      }
      if (onTogglePin)
          onTogglePin(postId);
      else {
          setPagePosts(prev => {
              const posts = prev[viewingPage.id] || [];
              let updated = posts.map(p => p.id === postId ? { ...p, isPinned: !p.isPinned } : p);
              const pinned = updated.filter(p => p.isPinned);
              const unpinned = updated.filter(p => !p.isPinned);
              return { ...prev, [viewingPage.id]: [...pinned, ...unpinned] };
          });
      }
  };

   const handlePostDelete = (postId: string) => {
      if (!viewingPage || !isPageModerator(viewingPage)) return;
      setDeletePostModal({ isOpen: true, postId });
  };

  const confirmPostDelete = () => {
      if (!deletePostModal.postId || !viewingPage) return;
      const postId = deletePostModal.postId;
      
      // 1. Get current posts to identify if it is an avatar/cover update
      const currentPosts = pagePosts[viewingPage.id] || [];
      const postToDelete = currentPosts.find(p => p.id === postId);

      // 2. Remove from Posts
      setPagePosts(prev => ({ ...prev, [viewingPage.id]: (prev[viewingPage.id] || []).filter(p => p.id !== postId) }));

      // 3. Remove from Albums and check for Revert Logic
      if (postToDelete && postToDelete.image) {
          const currentPageAlbums = pageAlbums[viewingPage.id] || [];
          let shouldUpdatePage = false;
          let newAvatar = viewingPage.avatar;
          let newCover = viewingPage.coverUrl;

          const updatedAlbums = currentPageAlbums.map(album => {
              const photoIndex = album.photos.findIndex(p => p.id === postId);
              if (photoIndex !== -1) {
                  // Photo exists in this album. Remove it.
                  const newPhotos = album.photos.filter(p => p.id !== postId);
                  
                  // Logic: If the deleted photo matches current avatar/cover, revert to the previous one in the list.
                  if (album.type === 'profile' && postToDelete.image === viewingPage.avatar) {
                      shouldUpdatePage = true;
                      // newPhotos is already filtered. If index 0 exists, it's the previous one.
                      if (newPhotos.length > 0) {
                          newAvatar = newPhotos[0].url;
                      } else {
                          // Fallback if album becomes empty
                          newAvatar = `https://ui-avatars.com/api/?name=${encodeURIComponent(viewingPage.name)}&background=random`;
                      }
                  }

                  if (album.type === 'cover' && postToDelete.image === viewingPage.coverUrl) {
                      shouldUpdatePage = true;
                      if (newPhotos.length > 0) {
                          newCover = newPhotos[0].url;
                      } else {
                           // Fallback if album becomes empty
                          newCover = `https://picsum.photos/800/300?random=${Date.now()}`;
                      }
                  }

                  return { 
                      ...album, 
                      photos: newPhotos, 
                      coverUrl: newPhotos.length > 0 ? newPhotos[0].url : album.coverUrl // Update album cover thumb
                  };
              }
              return album;
          });

          setPageAlbums(prev => ({ ...prev, [viewingPage.id]: updatedAlbums }));

          if (shouldUpdatePage) {
              const updatedPageData = { ...viewingPage, avatar: newAvatar, coverUrl: newCover };
              setViewingPage(updatedPageData);
              setPages(prev => prev.map(p => p.id === viewingPage.id ? updatedPageData : p));
              notify(language === 'ar' ? 'تم استعادة الصورة السابقة' : 'Reverted to previous photo', 'info');
          }
      }

      setDeletePostModal({ isOpen: false, postId: null });
      setMediaLightboxOpen(false);
      notify(language === 'ar' ? 'تم حذف المنشور بنجاح' : 'Post deleted successfully', 'info');
  };

  const handlePostLike = (postId: string, reactionType?: string) => {
      if (onLike)
          onLike(postId, reactionType);
      else {
        if (!viewingPage) return;
        setPagePosts(prev => ({
            ...prev,
            [viewingPage.id]:
            (prev[viewingPage.id] || []).map(p => {
                if (p.id === postId) {
                    const isRemoving = p.isLiked && (!reactionType || reactionType === p.reaction);
                    return { 
                        ...p, 
                        isLiked: !isRemoving, 
                        reaction: isRemoving ? undefined : (reactionType || 'like'),
                        likes: isRemoving ? Math.max(0, p.likes - 1) : (p.isLiked ? p.likes : p.likes + 1) 
                    };
                }
                return p;
            })
        }));
      }
  };
  
  const handlePostSave = (post: Post) => {
     if (onToggleSave) onToggleSave(post); };

  const handleMediaLike = (reactionType?: string) => {
    if (!viewingPage || !lightboxPostId) return;
    handlePostLike(lightboxPostId, reactionType);
  };

  const handleMediaComment = (text: string) => {
    if (onComment && lightboxPostId)
        onComment(lightboxPostId, text);
    else {
        if (!viewingPage || !lightboxPostId) return;
        const newComment: Comment = {
        id: `c_${Date.now()}`,
        author: currentUser,
        content: text, 
        timestamp: 'Just now',
        likes: 0,
        isLiked: false 
  };

        setPagePosts(prev => ({
            ...prev,
            [viewingPage.id]: (prev[viewingPage.id] || []).map(p =>
                p.id === lightboxPostId ? { ...p, comments: [...p.comments, newComment] } : p
            )
        }));
    }
  };

  const handleMediaDeleteComment = (commentId: string) => {
      if (onDeleteComment && lightboxPostId)
          onDeleteComment(lightboxPostId, commentId);

      if (viewingPage && lightboxPostId) {
         setPagePosts(prev => ({
              ...prev,
              [viewingPage.id]: (prev[viewingPage.id] || []).map(p =>
                  p.id === lightboxPostId ? { ...p, comments: p.comments.filter(c => c.id !== commentId) } : p
              )
          }));
      }
      notify(t.common_delete + ' ' + (language === 'ar' ? 'تم' : 'Done'), 'info');
  };

  const handleMediaLikeComment = (commentId: string) => {
      if (onLikeComment && lightboxPostId)
          onLikeComment(lightboxPostId, commentId);
      else {
          if (!viewingPage || !lightboxPostId) return;
          setPagePosts(prev => ({
              ...prev,
              [viewingPage.id]: (prev[viewingPage.id] || []).map(p => {
                  if (p.id === lightboxPostId) {
                      return {
                          ...p,
                          comments: p.comments.map(c =>
                              c.id === commentId ? { ...c, isLiked: !c.isLiked, likes: (c.likes || 0) + (c.isLiked ? -1 : 1) } : c
                              )
                      };
                  } 
                  return p;
              })
          }));
      }
  };

  const handleMediaTogglePin = () => {
     if (lightboxPostId && viewingPage)
      handlePostTogglePin(lightboxPostId); 
  };

  const filteredPages = useMemo(() => {
      let result = pages.filter(p => p.name.toLowerCase().includes(searchTerm.toLowerCase()));
      if (activeTab === 'liked') result = result.filter(p => p.isLiked);
      else if (activeTab === 'discover') result = result.filter(p => !p.isLiked && p.ownerId !== currentUser.id);
      else if (activeTab === 'my_pages') result = result.filter(p => p.ownerId === currentUser.id || p.admins.includes(currentUser.id) || p.moderators.includes(currentUser.id));
      return result;
  }, [pages, searchTerm, activeTab, currentUser.id]);

  const pageMediaList = useMemo(() => {
      if (!viewingPage || !pagePosts[viewingPage.id]) return [];
      return pagePosts[viewingPage.id].filter(p => p.image).map(p => ({ 
          url: p.image!, 
          type: (p.image?.startsWith('data:video') || p.image?.endsWith('.mp4')) ? 'video' : 'image', 
          post: p 
      }));
  }, [pagePosts, viewingPage]);

  const pagePhotos = useMemo(() => pageMediaList.filter(m => (m as any).type === 'image'), [pageMediaList]);
  const pageVideos = useMemo(() => pageMediaList.filter(m => (m as any).type === 'video'), [pageMediaList]);

  const handlePostMediaClick = (post: Post, type: 'image' | 'video') => {
      const list = type === 'video' ? pageVideos : pagePhotos;
      const index = list.findIndex(item => (item as any).post.id === post.id);
      if (index >= 0) {
          setCurrentLightboxList(list);
          setActiveMediaIndex(index); 
          setLightboxType(type === 'video' ? 'videos' : 'photos');
          setLightboxPostId(post.id);
          setMediaLightboxOpen(true);
      }
  };

  const handleViewPageImage = (url: string) => {
      if (!viewingPage) return;

      const avatarPostId = `avatar_${viewingPage.id}`;
      const coverPostId = `cover_${viewingPage.id}`;

      const targetId = url === viewingPage.avatar ? avatarPostId : coverPostId;

      let currentPosts = pagePosts[viewingPage.id] || [];
      let targetPost = currentPosts.find(p => p.id === targetId);

      if (!targetPost) {
          targetPost = {
              id: targetId,
              author: { id: viewingPage.id, name: viewingPage.name, avatar: viewingPage.avatar },
              content: url === viewingPage.avatar             
                ?  (language === 'ar' ? 'صورة الملف الشخصي' : 'Profile Picture')
                : (language === 'ar' ? 'صورة الغلاف' : 'Cover Photo'),
              image: url,
              timestamp: t.common_time || 'Just now',
              likes: 0,
              comments: [],
              shares: 0,
              isPinned: false,
              isLiked: false
          };
          setPagePosts(prev => ({
               ...prev,
               [viewingPage.id]: [targetPost!, ...(prev[viewingPage.id] || [])]
          }));
      }
      setCurrentLightboxList([{ url: targetPost.image!, type: 'image', post: targetPost }]);
      setActiveMediaIndex(0);
      setLightboxType('photos');
      setLightboxPostId(targetPost.id);
      setMediaLightboxOpen(true);
  };

  const handleNextMedia = (e: React.MouseEvent, list: any[]) => {
      e.stopPropagation();
      const nextIndex = (activeMediaIndex + 1) % list.length; 
      setActiveMediaIndex(nextIndex);
      const nextItem = list[nextIndex];
      setLightboxPostId(nextItem.post.id);
  };

  const handlePrevMedia = (e: React.MouseEvent, list: any[]) => {
      e.stopPropagation(); 
      const prevIndex = (activeMediaIndex - 1 + list.length) % list.length;
      setActiveMediaIndex(prevIndex);
      const prevItem = list[prevIndex];
      setLightboxPostId(prevItem.post.id);
  };

  const handleDirectMediaUpload = async (e: React.ChangeEvent<HTMLInputElement>, type: 'photo' | 'video') => {
      const file = e.target.files?.[0];
      if (file && viewingPage) {
          if (file.size > 15 * 1024 * 1024) { 
              notify(t.errors_file_too_large || 'File too large', 'error');
              e.target.value = '';
              return;
          }

          const base64 = await readFileAsBase64(file);
          handleCreatePagePost(language === 'ar' ? 'تم إضافة وسائط جديدة' : 'New media added', base64);
      }
      e.target.value = '';
  };

  const handleCreatePageAlbum = (newAlbum: Album) => {
    if (!viewingPage) return;
    setPageAlbums(prev => {
        const pageId = viewingPage.id;
        const currentAlbums = prev[pageId] || [];
        return { ...prev, [pageId]: [newAlbum, ...currentAlbums] };
    });
    handleCreatePagePost(`${language === 'ar' ? 'قام بإنشاء ألبوم جديد:' : 'created a new album:'} ${newAlbum.title}`, newAlbum.coverUrl);
    notify(language === 'ar' ? 'تم إنشاء الألبوم بنجاح' : 'Album created successfully', 'success');
  };

  const handleAddPhotoToPageAlbum = (albumId: string, photo: Photo) => {
    if (!viewingPage) return;

    const newPost: Post = {
         id: photo.id,
         author: { id: viewingPage.id, name: viewingPage.name, avatar: viewingPage.avatar, online: true },
         content: '',
         image: photo.url,
         timestamp: t.common_time || 'Just now',
         likes: 0,
         comments: [], 
         shares: 0,
         isPinned: false };

    setPagePosts(prev => ({
        ...prev,
        [viewingPage.id]: [newPost, ...(prev[viewingPage.id] || [])] 
    }));

    setPageAlbums(prev => {
        const pageId = viewingPage.id;
        const currentAlbums = prev[pageId] || [];
        const updatedAlbums = currentAlbums.map(album => album.id === albumId ? { ...album, photos: [photo, ...album.photos], coverUrl: photo.url } : album);

        return { ...prev, [pageId]: updatedAlbums };
    });
    notify(language === 'ar' ? 'تم إضافة الصورة للألبوم' : 'Photo added to album', 'success');
  };

  const activePostInLightbox = useMemo(() => {
      if (!viewingPage || !lightboxPostId || !pagePosts[viewingPage.id]) return null;
      return pagePosts[viewingPage.id].find(p => p.id === lightboxPostId) || null;
  }, [pagePosts, viewingPage, lightboxPostId]);

  const currentLightboxComments = useMemo(() => activePostInLightbox?.comments || [], [activePostInLightbox]);

  const handleMediaDeletePost = () => {
     if (lightboxPostId) {
         handlePostDelete(lightboxPostId);
         setMediaLightboxOpen(false);
     } 
  };

  const handleMediaToggleSave = () => {
     if (activePostInLightbox) {
         handlePostSave(activePostInLightbox); 
     }   
  };

  const handleMediaUpdateAvatar = (url: string) => {
      if (!viewingPage || !isPageAdmin(viewingPage)) return;
      const updatedPage = { ...viewingPage, avatar: url };
      setPages(prev => prev.map(p => p.id === viewingPage.id ? updatedPage : p));
      setViewingPage(updatedPage);
      handleCreatePagePost(language === 'ar' ? 'تم تحديث صورة الملف الشخصي' : 'Updated profile picture', url);
      notify(language === 'ar' ? 'تم تحديث صورة' : 'Image updated', 'success');
      setMediaLightboxOpen(false);
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm min-h-[500px] animate-fadeIn p-4 md:p-6 relative transition-colors duration-300" dir={dir}>

      {/* --- CONTENT AREA --- */}
      {viewingPage ? (
          <PageDetail 
            viewingPage={{ ...viewingPage, rules: currentRules } as any}
            activePageTab={activePageTab}
            setActivePageTab={setActivePageTab}
            currentUser={currentUser}
            pagePosts={pagePosts}
            pageAlbums={pageAlbums[viewingPage.id] || []}
            isPageAdmin={isPageAdmin}
            isPageModerator={isPageModerator}
            onBack={() => setViewingPage(null)} 
            onAvatarClick={() => pageAvatarInputRef.current?.click()} 
            onCoverClick={() => pageCoverInputRef.current?.click()} 
            onLikeToggle={handleLikeToggle}
            onMessage={handleMessage} 
            onOpenEdit={handleOpenEditModal}
            onOpenRoles={() => setShowRolesModal(true)} 
            onDeletePage={handleDeletePage}
            onCreatePost={handleCreatePagePost}
            onPostTogglePin={handlePostTogglePin}
            onPostDelete={handlePostDelete}
            onPostLike={handlePostLike} 
            onPostMediaClick={handlePostMediaClick}
            pagePhotos={pagePhotos}
            pageVideos={pageVideos}
            dir={dir}
            onPhotoUpload={(e) => handleDirectMediaUpload(e, 'photo')}
            onVideoUpload={(e) => handleDirectMediaUpload(e, 'video')}
            onPostSave={handlePostSave}
            onPostComment={onComment} 
            onDeletePostComment={onDeleteComment}
            onLikePostComment={onLikeComment}
            onUpdateAvatar={handleMediaUpdateAvatar}
            setPages={setPages} 
            onShowNotification={notify}
            onCreatePageAlbum={handleCreatePageAlbum}
            onAddPhotoToPageAlbum={handleAddPhotoToPageAlbum}
          />
      ) : (
          <PageList 
            pages={filteredPages} searchTerm={searchTerm} setSearchTerm={setSearchTerm} activeTab={activeTab} setActiveTab={setActiveTab}
            onVisitPage={(p) => { setViewingPage(p); setActivePageTab('posts'); }} onLikeToggle={handleLikeToggle} onMessage={handleMessage}
            onOpenCreate={() => setShowCreateModal(true)} activeMenuId={activeMenuId} setActiveMenuId={setActiveMenuId} onShare={handleShare}
            onToggleNotifications={handleToggleNotifications} onDeletePage={handleDeletePage} onReport={handleReport}
            isPageAdmin={isPageAdmin} dir={dir} menuRef={menuRef}
          />
      )}

      <PageModals 
        showCreateModal={showCreateModal} setShowCreateModal={setShowCreateModal}
        newPageName={newPageName} setNewPageName={setNewPageName}
        newPageCategory={newPageCategory} setNewPageCategory={setNewPageCategory}
        newPageDesc={newPageDesc} setNewPageDesc={setNewPageDesc}
        isCreating={isCreating} handleCreatePage={handleCreatePage}

        showEditPageModal={showEditPageModal} setShowEditPageModal={setShowEditPageModal}
        editPageName={editPageName} setEditPageName={setEditPageName}
        editPageCategory={editPageCategory} setEditPageCategory={setEditPageCategory}
        editPageDesc={editPageDesc} setEditPageDesc={setEditPageDesc}
        editPageWebsite={editPageWebsite} setEditPageWebsite={setEditPageWebsite}
        editPageEmail={editPageEmail} setEditPageEmail={setEditPageEmail} 
        editPagePhone={editPagePhone} setEditPagePhone={setEditPagePhone}
        isUpdating={isUpdating} handleSavePageChanges={handleSavePageChanges}

        showRolesModal={showRolesModal} setShowRolesModal={setShowRolesModal}
        roleSearchTerm={roleSearchTerm} setRoleSearchTerm={setRoleSearchTerm}
        selectedRoleType={selectedRoleType} setSelectedRoleType={setSelectedRoleType}
        handleAddRole={handleAddRole} handleRemoveRole={handleRemoveRole}

        viewingPage={viewingPage} currentUser={currentUser}
        confirmModal={confirmModal} closeConfirmModal={closeConfirmModal}
        executeDeletePage={executeDeletePage} isDeleting={isDeleting}

        categories={PAGE_CATEGORIES.map(c => ({ id: c.id, label: language === 'ar' ? c.ar : c.en }))}
      />

      <input type="file" ref={pageAvatarInputRef} className="hidden" accept="image/*" onChange={handleAvatarChange} />
      <input type="file" ref={pageCoverInputRef} className="hidden" accept="image/*" onChange={handleCoverChange} />

      {activeChatPage && typeof document !== 'undefined' && createPortal(
        <ChatWindow user={{ id: activeChatPage.id, name: activeChatPage.name, avatar: activeChatPage.avatar, online: true }} onClose={() => setActiveChatPage(null)} currentUser={currentUser} index={0} />,
        document.body
      )}

      {mediaLightboxOpen && viewingPage && typeof document !== 'undefined' && createPortal(
        <PageMediaLightbox 
            viewingPage={viewingPage}
            activeMediaIndex={activeMediaIndex} 
            lightboxType={lightboxType}
            mediaList={currentLightboxList} 
            currentUser={currentUser}
            mediaLikes={activePostInLightbox?.likes || 0} 
            isMediaLiked={activePostInLightbox?.isLiked || false} 
            mediaReaction={activePostInLightbox?.reaction}
            mediaComments={currentLightboxComments}
            mediaCommentInput={mediaCommentInput}
            setMediaCommentInput={setMediaCommentInput}
            onClose={() => setMediaLightboxOpen(false)}
            onNext={handleNextMedia}
            onPrev={handlePrevMedia}
            onToggleLike={handleMediaLike}
            onPostComment={handleMediaComment} 
            onShare={() => handleShare(viewingPage.name)} 
            commentsEndRef={mediaCommentsEndRef}
            onDeleteComment={handleMediaDeleteComment}
            onLikeComment={handleMediaLikeComment}
            onDeletePost={handleMediaDeletePost}
            onToggleSave={handleMediaToggleSave}
            onTogglePin={handleMediaTogglePin} 
            onUpdateAvatar={handleMediaUpdateAvatar}
        />, 
        document.body
      )}

      {/* Render local notifications only if global handler is not available, or as a fallback */}
      {notification && !showNotification && typeof document !== 'undefined' && createPortal(
        <div className="fixed bottom-6 right-6 z-[100005] animate-bounce-in">
            <div className={`flex items-center gap-3 px-4 py-3 rounded-lg shadow-lg text-white border border-white/10 ${notification.type === 'success' ? 'bg-emerald-600' : 'bg-blue-600'}`}>
                {notification.type === 'success' ? <CheckCircle className="w-5 h-5" /> : <AlertCircle className="w-5 h-5" />}
                <span className="font-medium text-sm">{notification.message}</span>
                <button onClick={() => setNotification(null)} className="mr-2 text-white/80 hover:text-white transition"><X className="w-4 h-4" /></button>
            </div>
        </div>,
        document.body
      )}

      {/* Delete Post Modal (Local) */}
      {deletePostModal.isOpen && typeof document !== 'undefined' && createPortal(
          <div className="fixed inset-0 z-[500000] flex items-center justify-center bg-black/60 p-4 animate-fadeIn backdrop-blur-sm">
              <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-2xl w-full max-w-sm border border-gray-200 dark:border-gray-700 animate-scaleIn">
                  <h3 className="font-bold text-lg mb-2 text-gray-900 dark:text-white flex items-center gap-2">
                    <Trash2 className="w-5 h-5 text-red-500" />
                   {language === 'ar' ? 'حذف المنشور؟' : 'Delete Post?'}
                 </h3>
                 <p className="text-gray-600 dark:text-gray-300 text-sm mb-6 leading-relaxed">
                   {language === 'ar' ? 'هل أنت متأكد من حذف هذا المنشور نهائياً من الصفحة؟' : 'Are you sure you want to delete this post from the page?'}
                 </p>
                 <div className="flex justify-end gap-3">
                     <button onClick={() => setDeletePostModal({ isOpen: false, postId: null })} className="px-5 py-2 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg text-sm font-bold transition">{t.common_cancel || (language === 'ar' ? 'إلغاء' : 'Cancel')}</button>
                     <button
                         onClick={confirmPostDelete}
                         className="px-6 py-2 bg-red-600 text-white rounded-lg text-sm font-bold hover:bg-red-700 transition shadow-lg"
                    >
                         {t.common_delete || (language === 'ar' ? 'حذف' : 'Delete')}
                      </button>
                  </div>
              </div>
          </div>,
          document.body
      )}
    </div>
  );
};

export default ProfilePages;