import React, { useState, useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import Navbar from './components/Navbar';
import LoginPage from './components/LoginPage';
import AppBody from './components/AppBody';
import AppOverlays from './components/AppOverlays';
import { User, Post, Comment, Album } from './types';
import { useLanguage, LanguageProvider } from './context/LanguageContext';
import { useTheme, ThemeProvider } from './context/ThemeContext';
import { NotificationProvider } from './context/NotificationContext'; 
import { Trash2, AlertTriangle, Loader2 } from 'lucide-react';
import { safeSetItem, safeGetItem } from './utils/safeStorage';
import { playAudio, preloadSounds } from './utils/audio';

// Import Custom Hooks
import { useAuth } from './hooks/useAuth';
import { useUI } from './hooks/useUI';
import { usePosts } from './hooks/usePosts';
import { useMedia } from './hooks/useMedia';
import { useStories } from './hooks/useStories';
import { useChat } from './hooks/useChat';

import {
  initialUser,
  INITIAL_PAGES,
  onlineUsers,
  generateId
} from './data/initialData';

const AppContent: React.FC = () => {
  const { dir, t, language } = useLanguage();
  
  // 1. Auth Logic
  const { isAuthenticated, currentUser, setCurrentUser, handleAuthLogin, handleLogout } = useAuth();
  
  // 2. UI & Navigation Logic
  const { 
    currentView, setView, 
    viewingProfile, setViewingProfile, 
    appNotification, setAppNotification, 
    showNotification: rawShowNotification,
    isGlobalLoading 
  } = useUI(initialUser);

  // Audio Integration Wrapper
  useEffect(() => {
    preloadSounds();
  }, []);

  const showNotification = (msg: string, type: 'success' | 'info' | 'error' = 'info') => {
    if (type === 'success') {
        playAudio('post_success');
    } else {
        playAudio('notification');
    }
    rawShowNotification(msg, type);
  };

  // 3. States for lifted post sources
  const [pages, setPages] = useState(INITIAL_PAGES);
  const [pagePosts, setPagePosts] = useState<Record<string, Post[]>>(() => {
      return safeGetItem('tourloop_page_posts', {});
  });
  
  const [groupPostsStore, setGroupPostsStore] = useState<Record<string, Post[]>>(() => {
      return safeGetItem('tourloop_group_posts', {});
  });

  // Lifted Page Albums State for Synchronization
  const [pageAlbums, setPageAlbums] = useState<Record<string, Album[]>>(() => {
      return safeGetItem('tourloop_page_albums', {});
  });

  // --- View As Mode Logic (Global State) ---
  // Managed here to persist across tab navigation within Profile
  const [isViewAsMode, setIsViewAsMode] = useState(false);

  const handleToggleViewAs = () => {
    if (viewingProfile?.id === currentUser.id) {
        setIsViewAsMode(prev => {
            const newState = !prev;
            if (newState) {
                showNotification(language === 'ar' ? 'عرض كما يظهر للآخرين مفعل' : 'View As Public Enabled', 'info');
            } else {
                showNotification(language === 'ar' ? 'تم الخروج من وضع العرض' : 'Exited View As Mode', 'info');
            }
            return newState;
        });
        if (typeof window !== 'undefined') {
            window.scrollTo({ top: 0, behavior: 'smooth' });
        }
    }
  };

  // Reset View As Mode when navigating away from own profile
  useEffect(() => {
     if (currentView !== 'profile' || viewingProfile?.id !== currentUser.id) {
         setIsViewAsMode(false);
     }
  }, [currentView, viewingProfile?.id, currentUser.id]);

  // 4. Persistence effects with Strict Pruning
  useEffect(() => {
      const prunedPagePosts: Record<string, Post[]> = {};
      Object.keys(pagePosts).forEach(key => {
          prunedPagePosts[key] = (pagePosts[key] || []).slice(0, 5);
      });
      safeSetItem('tourloop_page_posts', JSON.stringify(prunedPagePosts));
  }, [pagePosts]);

  useEffect(() => {
      const prunedGroupPosts: Record<string, Post[]> = {};
      Object.keys(groupPostsStore).forEach(key => {
          prunedGroupPosts[key] = (groupPostsStore[key] || []).slice(0, 5);
      });
      safeSetItem('tourloop_group_posts', JSON.stringify(prunedGroupPosts));
  }, [groupPostsStore]);

  // Persist Page Albums
  useEffect(() => {
      safeSetItem('tourloop_page_albums', JSON.stringify(pageAlbums));
  }, [pageAlbums]);

  // 5. Stories Logic
  const { 
    stories, viewingStoryIndex, setViewingStoryIndex,
    storyProgress, isStoryPaused, setIsStoryPaused,
    handleAddStory, handleViewUserStory, handleNextStory, handlePrevStory
  } = useStories(currentUser, showNotification);

  // 6. Chat Logic
  const { activeChats, handleOpenChat, handleCloseChat } = useChat();

  // 7. Media & Posts Bridge
  // Use Ref to break circular dependency between usePosts (needs media callbacks) and useMedia (needs handleCreatePost)
  const mediaRef = useRef<any>(null);

  const { 
    posts, setPosts, handleCreatePost, handleTogglePinPost, handleDeletePost, 
    handlePostLike, handlePostComment, handleDeletePostComment, handleLikePostComment
  } = usePosts(
    currentUser, 
    showNotification, 
    (img, id, isFromPost) => mediaRef.current?.handleAddGenericPhoto({ id: id, url: img, likes: 0, comments: [], isLiked: false }, isFromPost),
    (vid, isFromPost) => mediaRef.current?.handleAddVideoDirectly(vid, isFromPost)
  );

  const media = useMedia(currentUser, showNotification, handleCreatePost);
  
  // Keep ref in sync
  useEffect(() => {
      mediaRef.current = media;
  }, [media]);

  // 4.5 Extra Pruning for Main Posts to stay under quota
  useEffect(() => {
      if (posts.length > 10) {
          const pinned = posts.filter(p => p.isPinned);
          const remainingSlots = Math.max(0, 10 - pinned.length);
          const unpinned = posts.filter(p => !p.isPinned).slice(0, remainingSlots);
          const pruned = [...pinned, ...unpinned];
          if (pruned.length !== posts.length) {
            setPosts(pruned);
          }
      }
  }, [posts, setPosts]);

  // --- Handlers for Global State Sync --- //

  const handleProfileUpdate = () => {
      const updatedUser = { ...currentUser };
      setCurrentUser(updatedUser);
      
      if (viewingProfile && viewingProfile.id === currentUser.id) {
          setViewingProfile({ ...updatedUser });
      }
  };

  const handleUpdateAvatar = (url: string) => {
      media.handleUpdateProfilePhoto(url);
      const updatedUser = { ...currentUser, avatar: url };
      setCurrentUser(updatedUser);
      if (viewingProfile.id === currentUser.id) {
          setViewingProfile(updatedUser);
      }
  };

  const handleUpdateCover = (url: string) => {
      media.handleUpdateCoverPhoto(url);
      const updatedUser = { ...currentUser, coverPhoto: url };
      setCurrentUser(updatedUser);
      if (viewingProfile.id === currentUser.id) {
          setViewingProfile(updatedUser);
      }
  };

  const handleUpdateName = (newName: string) => {
    const updatedUser = { ...currentUser, name: newName };
    setCurrentUser(updatedUser); // Update Auth Context
    safeSetItem('tourloop_user', JSON.stringify(updatedUser)); // Persist Name Change
    if (viewingProfile.id === currentUser.id) {
        setViewingProfile(updatedUser);
    }
    showNotification(language === 'ar' ? 'تم تغيير الاسم بنجاح' : 'Name updated successfully');
  };

  // --- Strict Lock Profile Feature ---
  const handleToggleLockProfile = () => {
      const currentLockStatus = (currentUser as any).isLocked === true;
      const newLockStatus = !currentLockStatus;
      
      const updatedUser = { 
          ...currentUser, 
          isLocked: newLockStatus 
      };

      setCurrentUser(updatedUser);
      safeSetItem('tourloop_user', JSON.stringify(updatedUser));

      if (viewingProfile && viewingProfile.id === currentUser.id) {
          setViewingProfile(updatedUser);
      }

      const msg = newLockStatus 
          ? (language === 'ar' ? 'تم قفل الملف الشخصي بنجاح' : 'Profile Locked Successfully')
          : (language === 'ar' ? 'تم إلغاء قفل الملف الشخصي' : 'Profile Unlocked');
      
      showNotification(msg, 'success');
  };

  // --- Delete Confirmation State ---
  const [deleteModal, setDeleteModal] = useState<{ 
    isOpen: boolean, 
    postId: string | null,
    type: 'post' | 'photo' | 'video' 
  }>({
    isOpen: false,
    postId: null,
    type: 'post'
  });

  const triggerDeleteConfirm = (id: string, type: 'post' | 'photo' | 'video' = 'post') => {
    let finalType = type;

    const allPosts = [
        ...posts, 
        ...Object.values(pagePosts).flat(), 
        ...Object.values(groupPostsStore).flat()
    ];
    const targetPost = allPosts.find(p => p.id === id);

    if (targetPost) {
        const isVideoMedia = targetPost.image && (targetPost.image.startsWith('data:video') || targetPost.image.endsWith('.mp4'));
        const isPhotoMedia = targetPost.image && !isVideoMedia;
        const hasText = targetPost.content && targetPost.content.trim().length > 0;

        if (isVideoMedia && !hasText) finalType = 'video';
        else if (isPhotoMedia && !hasText) finalType = 'photo';
        else finalType = 'post';
    } else {
        if (media.userVideos.some((v: any) => v.id === id)) finalType = 'video';
        else if (media.yourPhotos.some((p: any) => p.id === id)) finalType = 'photo';
    }

    setDeleteModal({ isOpen: true, postId: id, type: finalType });
  };

  const handleConfirmDelete = () => {
    if (deleteModal.postId) {
      const id = deleteModal.postId;
      const type = deleteModal.type;

      let deletedMediaUrl: string | undefined;

      const postToDelete = posts.find(p => p.id === id);
      if (postToDelete && postToDelete.image) {
          deletedMediaUrl = postToDelete.image;
      }

      if (!deletedMediaUrl) {
          const photoToDelete = media.yourPhotos.find((p: any) => p.id === id);
          if (photoToDelete) {
              deletedMediaUrl = photoToDelete.url;
          }
      }

      if (deletedMediaUrl && currentUser.avatar === deletedMediaUrl) {
          const defaultAvatar = `https://ui-avatars.com/api/?name=${encodeURIComponent(currentUser.name)}&background=065F46&color=fff`;
          const updatedUser = { ...currentUser, avatar: defaultAvatar };
          
          setCurrentUser(updatedUser);
          safeSetItem('tourloop_user', JSON.stringify(updatedUser));
          
          if (viewingProfile.id === currentUser.id) {
              setViewingProfile(updatedUser);
          }
      }

      handleDeletePost(id);
      media.handleDeletePhoto(id);
      media.handleDeleteVideo(id);

      if (media.setSavedPosts) {
          media.setSavedPosts((prev: Post[]) => prev.filter(p => p.id !== id));
      }

      setPagePosts(prev => {
          const next = { ...prev };
          Object.keys(next).forEach(key => { next[key] = next[key].filter(p => p.id !== id); });
          return next;
      });
      setGroupPostsStore(prev => {
          const next = { ...prev };
          Object.keys(next).forEach(key => { next[key] = next[key].filter(p => p.id !== id); });
          return next;
      });

      setPageAlbums(prev => {
          const next = { ...prev };
          Object.keys(next).forEach(pageId => {
              next[pageId] = next[pageId].map(album => ({
                  ...album,
                  photos: album.photos.filter(p => p.id !== id)
              }));
          });
          return next;
      });

      let successMsg = '';
      if (type === 'photo') successMsg = language === 'ar' ? 'تم حذف الصورة بنجاح' : 'Photo deleted successfully';
      else if (type === 'video') successMsg = language === 'ar' ? 'تم حذف الفيديو بنجاح' : 'Video deleted successfully';
      else successMsg = language === 'ar' ? 'تم حذف المنشور بنجاح' : 'Post deleted successfully';
      
      showNotification(successMsg, 'success');
    }
    setDeleteModal({ isOpen: false, postId: null, type: 'post' });
  };

  // --- Global Sync Logic ---
  const syncLike = (id: string, reactionType?: string) => {
      if (reactionType) playAudio('react');
      else playAudio('like');
      
      handlePostLike(id, reactionType);
      
      const reactionUpdater = (postsArr: Post[]) => postsArr.map(p => {
          if (p.id === id) {
              const isRemoving = p.isLiked && (!reactionType || reactionType === p.reaction);
              let newLikes = p.likes;
              if (isRemoving) {
                  newLikes = Math.max(0, p.likes - 1);
              } else if (!p.isLiked) {
                  newLikes = p.likes + 1;
              }

              return { 
                  ...p, 
                  isLiked: !isRemoving,
                  reaction: isRemoving ? undefined : (reactionType || 'like'),
                  likes: newLikes
              };
          }
          return p;
      });

      setPagePosts(prev => {
          const next = { ...prev };
          Object.keys(next).forEach(pageId => {
              next[pageId] = reactionUpdater(next[pageId]);
          });
          return next;
      });

      setGroupPostsStore(prev => {
          const next = { ...prev };
          Object.keys(next).forEach(groupId => {
              next[groupId] = reactionUpdater(next[groupId]);
          });
          return next;
      });

      setPageAlbums(prev => {
          const next = { ...prev };
          const photoUpdater = (p: any) => {
              if (p.id !== id) return p;
              const isRemoving = p.isLiked && (!reactionType || reactionType === p.reaction);
              return { 
                  ...p, 
                  isLiked: !isRemoving,
                  reaction: isRemoving ? undefined : (reactionType || 'like'),
                  likes: isRemoving ? Math.max(0, p.likes - 1) : (p.isLiked ? p.likes : p.likes + 1)
              };
          };
          Object.keys(next).forEach(pageId => {
              next[pageId] = next[pageId].map(album => ({
                  ...album,
                  photos: album.photos.map(photoUpdater)
              }));
          });
          return next;
          });

      const isPhoto = media.yourPhotos.some((p: any) => p.id === id) || media.savedPhotos.some((p: any) => p.id === id);
      const isVideo = media.userVideos.some((v: any) => v.id === id) || media.savedVideos.some((v: any) => v.id === id);
      
      if (isPhoto) media.handlePhotoLike(id, reactionType);
      else if (isVideo) media.handleVideoLike(id, reactionType);
      
      media.setSavedPosts((prev: Post[]) => reactionUpdater(prev));
  };

  /* CRITICAL FIX: Modified syncComment to accept an optional existingCommentId 
     This ensures the Watch component and the Global State use the SAME ID for the same comment, 
     preventing duplication upon sync. */
  const syncComment = (id: string, text: string, existingCommentId?: string) => {
      playAudio('comment');
      const commentId = existingCommentId || generateId();
      const newComment: Comment = { id: commentId, author: { ...currentUser }, content: text, timestamp: 'الآن', likes: 0 };

      handlePostComment(id, text, commentId);

      setPagePosts(prev => {
          const next = { ...prev };
          Object.keys(next).forEach(pageId => {
              next[pageId] = next[pageId].map(p => p.id === id ? { ...p, comments: [...p.comments, newComment] } : p);
          });
          return next;
      });

      setGroupPostsStore(prev => {
          const next = { ...prev };
          Object.keys(next).forEach(groupId => {
              next[groupId] = next[groupId].map(p => p.id === id ? { ...p, comments: [...p.comments, newComment] } : p);
          });
          return next;
      });

      setPageAlbums(prev => {
          const next = { ...prev };
          const photoUpdater = (p: any) => p.id === id ? { ...p, comments: [...(p.comments || []), newComment] } : p;
          Object.keys(next).forEach(pageId => {
              next[pageId] = next[pageId].map(album => ({
                  ...album,
                  photos: album.photos.map(photoUpdater)
              }));
          });
          return next;
      });

      const isPhoto = media.yourPhotos.some((p: any) => p.id === id) || media.savedPhotos.some((p: any) => p.id === id);
      const isVideo = media.userVideos.some((v: any) => v.id === id) || media.savedVideos.some((v: any) => v.id === id);
      if (isPhoto) media.handlePhotoComment(id, text, commentId);
      else if (isVideo) media.handleVideoComment(id, text, commentId);

      media.setSavedPosts((prev: Post[]) => prev.map(p => p.id === id ? { ...p, comments: [...p.comments, newComment] } : p));
  };

  const syncDeleteComment = (id: string, commentId: string) => {
      handleDeletePostComment(id, commentId);

      setPagePosts(prev => {
          const next = { ...prev };
          Object.keys(next).forEach(pageId => {
              next[pageId] = next[pageId].map(p => p.id === id ? { ...p, comments: p.comments.filter(c => c.id !== commentId) } : p);
          });
          return next;
      });

      setGroupPostsStore(prev => {
          const next = { ...prev };
          Object.keys(next).forEach(groupId => {
              next[groupId] = next[groupId].map(p => p.id === id ? { ...p, comments: p.comments.filter(c => c.id !== commentId) } : p);
          });
          return next;
      });

      setPageAlbums(prev => {
          const next = { ...prev };
          const photoUpdater = (p: any) => p.id === id ? { ...p, comments: p.comments.filter((c: any) => c.id !== commentId) } : p;
          Object.keys(next).forEach(pageId => {
              next[pageId] = next[pageId].map(album => ({
                  ...album,
                  photos: album.photos.map(photoUpdater)
              }));
          });
          return next;
      });

      const isPhoto = media.yourPhotos.some((p: any) => p.id === id) || media.savedPhotos.some((p: any) => p.id === id);
      const isVideo = media.userVideos.some((v: any) => v.id === id) || media.savedVideos.some((v: any) => v.id === id);
      if (isPhoto) media.handleDeletePhotoComment(id, commentId);
      else if (isVideo) media.handleDeleteVideoComment(id, commentId);

      media.setSavedPosts((prev: Post[]) => prev.map(p => p.id === id ? { ...p, comments: p.comments.filter(c => c.id !== commentId) } : p));
  };

  const syncLikeComment = (id: string, commentId: string) => {
      handleLikePostComment(id, commentId); 

      const updateComments = (postsArr: Post[]) => postsArr.map(p => {
          if (p.id === id) {
              return { ...p, comments: p.comments.map(c => c.id === commentId ? { ...c, isLiked: !c.isLiked, likes: (c.likes || 0) + (c.isLiked ? -1 : 1) } : c) };
          }
          return p;
      });

      setPagePosts(prev => {
          const next = { ...prev };
          Object.keys(next).forEach(pageId => { next[pageId] = updateComments(next[pageId]); });
          return next;
      });

      setGroupPostsStore(prev => {
          const next = { ...prev };
          Object.keys(next).forEach(groupId => { next[groupId] = updateComments(next[groupId]); });
          return next;
      });

      setPageAlbums(prev => {
          const next = { ...prev };
          const photoUpdater = (p: any) => {
              if (p.id !== id) return p;
              return {
                  ...p,
                  comments: p.comments.map((c: any) => c.id === commentId ? { ...c, isLiked: !c.isLiked, likes: (c.likes || 0) + (c.isLiked ? -1 : 1) } : c)
              };
          };
          Object.keys(next).forEach(pageId => {
              next[pageId] = next[pageId].map(album => ({
                  ...album,
                  photos: album.photos.map(photoUpdater)
              }));
          });
          return next;
      });

      const isPhoto = media.yourPhotos.some((p: any) => p.id === id) || media.savedPhotos.some((p: any) => p.id === id);
      const isVideo = media.userVideos.some((v: any) => v.id === id) || media.savedVideos.some((v: any) => v.id === id);
      if (isPhoto) media.handleLikePhotoComment(id, commentId);
      else if (isVideo) media.handleLikeVideoComment(id, commentId);

      media.setSavedPosts((prev: Post[]) => updateComments(prev));
  };

  const syncTogglePin = (id: string) => {
      handleTogglePinPost(id);
      
      const pinUpdater = (postsArr: Post[]) => {
          return postsArr.map(p => p.id === id ? { ...p, isPinned: !p.isPinned } : p)
                 .sort((a, b) => (b.isPinned ? 1 : 0) - (a.isPinned ? 1 : 0));
      };

      setPagePosts(prev => {
          const next = { ...prev };
          Object.keys(next).forEach(pageId => {
              next[pageId] = pinUpdater(next[pageId] || []);
          });
          return next;
      });

      setGroupPostsStore(prev => {
          const next = { ...prev };
          Object.keys(next).forEach(groupId => {
              next[groupId] = pinUpdater(next[groupId] || []);
          });
          return next;
      });
  };

  const syncToggleSave = (item: any) => {
      const id = item.id;
      const allSourcePosts = [
          ...posts,
          ...Object.values(pagePosts).flat(),
          ...Object.values(groupPostsStore).flat(),
          ...media.savedPosts,
          ...media.savedPhotos.map(p => ({ ...p, author: initialUser, content: p.description || '' } as unknown as Post))
      ];
      
      const latestItem = allSourcePosts.find(p => p.id === id) || item;

      setPosts(prev => prev.map(p => p.id === id ? { ...p, isSaved: !p.isSaved } : p));

      setPagePosts(prev => {
          const next = { ...prev };
          Object.keys(next).forEach(pageId => { next[pageId] = next[pageId].map(p => p.id === id ? { ...p, isSaved: !p.isSaved } : p); });
          return next;
      });

      setGroupPostsStore(prev => {
          const next = { ...prev };
          Object.keys(next).forEach(groupId => { next[groupId] = next[groupId].map(p => p.id === id ? { ...p, isSaved: !p.isSaved } : p); });
          return next;
      });

      media.handleToggleSave(latestItem);
  };

  const handleProfileClick = () => {
    setViewingProfile(currentUser);
    setView('profile');
  };

  const handleFriendClick = (friend: User) => {
    setViewingProfile(friend);
    setView('profile');
  };

  const handleFriendAction = (action: 'unfriend' | 'block', user: User) => {
      if (action === 'unfriend') {
          showNotification(language === 'ar' ? `تم إلغاء الصداقة مع ${user.name}.` : `Unfriended ${user.name}.`, 'success');
      } else if (action === 'block') {
          showNotification(language === 'ar' ? `تم حظر ${user.name} بنجاح.` : `Blocked ${user.name} successfully.`, 'info');
          setView('home'); 
      }
  };

  if (!isAuthenticated) {
    return <LoginPage onLogin={handleAuthLogin} />;
  }

  const getDeleteModalTitle = () => {
      if (deleteModal.type === 'photo') return language === 'ar' ? 'حذف الصورة؟' : 'Delete Photo?';
      if (deleteModal.type === 'video') return language === 'ar' ? 'حذف الفيديو؟' : 'Delete Video?';
      return t.post_delete_confirm_title || (language === 'ar' ? 'حذف المنشور؟' : 'Delete Post?');
  };

  const getDeleteModalDesc = () => {
      if (deleteModal.type === 'photo') return language === 'ar' ? 'هل أنت متأكد من حذف هذه الصورة نهائياً؟ سيتم إزالتها من قسم الصور واليوميات.' : 'Are you sure you want to delete this photo? It will be removed from your photos and timeline.';
      if (deleteModal.type === 'video') return language === 'ar' ? 'هل أنت متأكد من حذف هذا الفيديو نهائياً؟ سيتم إزالته من قسم الفيديو واليوميات.' : 'Are you sure you want to delete this video? It will be removed from your videos and timeline.';
      return t.post_delete_confirm_desc || (language === 'ar' ? 'هل أنت متأكد من حذف هذا المنشور نهائياً؟ لا يمكن التراجع عن هذا الإجراء وسيتم إزالته من يومياتك.' : 'Are you sure you want to delete this post? This action cannot be undone and it will be removed from your timeline.');
  };

  return (
    <div className="min-h-screen bg-transparent text-[#050505] dark:text-white transition-colors duration-300" dir={dir}>
      <Navbar 
        currentView={currentView} 
        setView={setView} 
        onProfileClick={handleProfileClick} 
        currentUser={currentUser} 
        onOpenChat={handleOpenChat}
        onLogout={() => handleLogout(() => setView('home'))}
      />
      
      <AppBody 
        currentView={currentView}
        setView={setView}
        currentUser={currentUser}
        posts={posts}
        setPosts={setPosts}
        stories={stories}
        media={media}
        pages={pages}
        setPages={setPages}
        pagePosts={pagePosts}
        setPagePosts={setPagePosts}
        pageAlbums={pageAlbums}
        setPageAlbums={setPageAlbums}
        groupPostsStore={groupPostsStore}
        setGroupPostsStore={setGroupPostsStore}
        viewingProfile={viewingProfile}
        onlineUsers={onlineUsers}
        handleProfileClick={handleProfileClick}
        handleFriendClick={handleFriendClick}
        handleOpenChat={handleOpenChat}
        handleCreatePost={handleCreatePost}
        handleTogglePinPost={syncTogglePin}
        handleDeletePost={triggerDeleteConfirm}
        syncToggleSave={syncToggleSave}
        syncLike={syncLike}
        syncComment={syncComment}
        syncDeleteComment={syncDeleteComment}
        syncLikeComment={syncLikeComment}
        handleUpdateName={handleUpdateName}
        handleProfileUpdate={handleProfileUpdate} 
        handleAddStory={handleAddStory}
        handleViewUserStory={handleViewUserStory}
        handleFriendAction={handleFriendAction}
        handleUpdateAvatar={handleUpdateAvatar}
        handleUpdateCover={handleUpdateCover}
        onToggleLockProfile={handleToggleLockProfile}
        isGlobalLoading={isGlobalLoading} 
        showNotification={showNotification}
        isViewAsMode={isViewAsMode}
        onToggleViewAs={handleToggleViewAs}
      />

      <AppOverlays 
        activeChats={activeChats}
        currentUser={currentUser}
        handleCloseChat={handleCloseChat}
        appNotification={appNotification}
        setAppNotification={setAppNotification}
        viewingStoryIndex={viewingStoryIndex}
        setViewingStoryIndex={setViewingStoryIndex}
        stories={stories}
        storyProgress={storyProgress}
        isStoryPaused={isStoryPaused}
        setIsStoryPaused={setIsStoryPaused}
        handlePrevStory={handlePrevStory}
        handleNextStory={handleNextStory}
      />

      {deleteModal.isOpen && typeof document !== 'undefined' && createPortal(
          <div className="fixed inset-0 z-[500000] flex items-center justify-center bg-black/60 p-4 animate-fadeIn backdrop-blur-sm">
              <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-2xl w-full max-w-sm border border-gray-200 dark:border-gray-700 animate-scaleIn">
                  <h3 className="font-bold text-lg mb-2 text-gray-900 dark:text-white flex items-center gap-2">
                    <Trash2 className="w-5 h-5 text-red-500" />
                    {getDeleteModalTitle()}
                  </h3>
                  <p className="text-gray-600 dark:text-gray-300 text-sm mb-6 leading-relaxed text-start">
                    {getDeleteModalDesc()}
                  </p>
                  <div className="flex justify-end gap-3">
                      <button onClick={() => setDeleteModal({ isOpen: false, postId: null, type: 'post' })} className="px-5 py-2 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg text-sm font-bold transition">{t.common_cancel || (language === 'ar' ? 'إلغاء' : 'Cancel')}</button>
                      <button 
                          onClick={handleConfirmDelete} 
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

  const App: React.FC = () => {
    return (
      <ThemeProvider>
        <LanguageProvider>
          <NotificationProvider>
            <AppContent />
          </NotificationProvider>
        </LanguageProvider>
      </ThemeProvider>
    );
  };

export default App;