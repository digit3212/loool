import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { createPortal } from 'react-dom';
import { User, Post, TabType, Photo, Album, VideoItem, Story, Page } from '../types';
import ProfileHeader from './ProfileHeader';
import ProfileMediaLightbox from './ProfileMediaLightbox';
import ProfileStoryOverlay from './ProfileStoryOverlay';
import ProfileTabsContent from './ProfileTabsContent';
import { useLanguage } from '../context/LanguageContext';
import { Shield, Eye, X } from 'lucide-react';
import { playAudio } from '../utils/audio';

interface ProfileProps {
  currentUser: User;
  viewingUser?: User; 
  onFriendClick?: (user: User) => void;
  onMessageClick?: (user: User) => void;
  onFriendAction?: (action: 'unfriend' | 'block', user: User) => void;
  defaultTab?: TabType;
  
  initialFriendsTab?: 'all' | 'mutual' | 'work' | 'university' | 'city' | 'suggestions';

  posts: Post[];
  stories?: Story[];
  onPostCreate: (content: string, image?: string) => void;
  onTogglePin?: (postId: string) => void;
  onDeletePost?: (postId: string) => void;
  onLike?: (postId: string, reactionType?: string) => void;
  onComment?: (postId: string, text: string) => void;
  onDeleteComment?: (postId: string, commentId: string) => void;
  onLikeComment?: (postId: string, commentId: string) => void;

  onUpdateAvatar?: (url: string) => void;
  onUpdateCover?: (url: string) => void;
  onUpdateName?: (newName: string) => void;
  onAddStory?: (url: string) => void;
  onViewStory?: (userId: string) => void;

  photos?: Photo[];
  albums?: Album[];
  onAddPhoto?: (photo: Photo) => void;
  onCreateAlbum?: (album: Album) => void;
  onAddPhotoToAlbum?: (albumId: string, photo: Photo) => void;
  onDeletePhoto?: (photoId: string) => void;

  userVideos?: VideoItem[];
  onAddVideo?: (video: VideoItem) => void;
  onDeleteVideo?: (videoId: string) => void;

  savedPhotos?: Photo[];
  onToggleSave?: (item: Photo | Post) => void;
  savedVideos?: VideoItem[];
  onToggleSaveVideo?: (video: VideoItem) => void;

  pages?: Page[];
  setPages?: React.Dispatch<React.SetStateAction<Page[]>>;
  pagePosts?: Record<string, Post[]>;
  setPagePosts?: React.Dispatch<React.SetStateAction<Record<string, Post[]>>>;
  pageAlbums?: Record<string, Album[]>;
  setPageAlbums?: React.Dispatch<React.SetStateAction<Record<string, Album[]>>>;

  groupPostsStore?: Record<string, Post[]>;
  setGroupPostsStore?: React.Dispatch<React.SetStateAction<Record<string, Post[]>>>;

  onLikePhoto?: (photoId: string, reactionType?: string) => void;
  onCommentPhoto?: (photoId: string, text: string) => void;
  onDeletePhotoComment?: (photoId: string, commentId: string) => void;
  onLikePhotoComment?: (photoId: string, commentId: string) => void;
  onLikeVideo?: (videoId: string, reactionType?: string) => void;
  onCommentVideo?: (videoId: string, text: string) => void;
  onDeleteVideoComment?: (videoId: string, commentId: string) => void;
  onLikeVideoComment?: (videoId: string, commentId: string) => void;
  setProfileUser?: (val: any) => void;
  
  isViewAsMode?: boolean;
  onToggleViewAs?: () => void;
  onToggleLockProfile?: () => void;
}

const Profile: React.FC<ProfileProps> = ({ 
    currentUser, 
    viewingUser, 
    onFriendClick, 
    onMessageClick, 
    onFriendAction, 
    defaultTab,
    initialFriendsTab,
    posts,
    stories = [],
    onPostCreate,
    onTogglePin,
    onDeletePost,
    onLike,
    onComment,
    onDeleteComment,
    onLikeComment,
    onUpdateAvatar,
    onUpdateCover,
    onUpdateName,
    onAddStory,
    onViewStory,
    photos = [],
    albums = [],
    onAddPhoto,
    onCreateAlbum,
    onAddPhotoToAlbum,
    onDeletePhoto,
    userVideos = [], 
    onAddVideo,
    onDeleteVideo,
    savedPhotos = [],
    onToggleSave,
    savedVideos = [],
    onToggleSaveVideo,
    pages = [],
    setPages,
    pagePosts = {},
    setPagePosts,
    pageAlbums = {},
    setPageAlbums,
    groupPostsStore = {},
    setGroupPostsStore,
    onLikePhoto,
    onCommentPhoto,
    onDeletePhotoComment,
    onLikePhotoComment,
    onLikeVideo,
    onCommentVideo,
    onDeleteVideoComment,
    onLikeVideoComment,
    setProfileUser,
    isViewAsMode,
    onToggleViewAs,
    onToggleLockProfile
}) => {
  const { t, language } = useLanguage();
  const [activeTab, setActiveTab] = useState<TabType>(defaultTab || 'posts');
  
  const [viewingMedia, setViewingMedia] = useState<{ url: string, type: 'image' | 'video', postId?: string } | null>(null);
  const [profileImagesList, setProfileImagesList] = useState<string[]>([]); 

  const [isViewingStory, setIsViewingStory] = useState(false);
  const [localViewAsMode, setLocalViewAsMode] = useState(false);

  // --- Strict Logic for Identity & Permissions (Identity Logic Conflict Fix) ---

  // 1. Determine active View As mode (Global or Local)
  const isViewAsActive = isViewAsMode !== undefined ? isViewAsMode : localViewAsMode;

  // 2. Define Target User (The profile being viewed)
  const profileUser = viewingUser || currentUser;

  // 3. Real Identity Check (Are you actually the owner?)
  const realIsOwnProfile = String(profileUser.id) === String(currentUser.id);

  // 4. Effective Owner Permission
  // CRITICAL FIX: If View As is active, strip owner privileges completely.
  // This prevents the component from showing hidden data because it thinks "it's the owner".
  const isOwnProfile = isViewAsActive ? false : realIsOwnProfile;

  // 5. Lock Status Check
  const isProfileLocked = useMemo(() => {
    // Check the lock status of the actual profile being viewed.
    // Note: If realIsOwnProfile is true, we might look at currentUser, but profileUser is synced.
    return (profileUser as any).isLocked === true;
  }, [profileUser]);

  // 6. Strict Friendship Logic
  const isFriend = useMemo(() => {
      // STRICT: In 'View As' mode (simulation), you are a STRANGER (not a friend).
      if (isViewAsActive) return false;
      
      // If you are the owner (and not in View As), you are effectively a friend to yourself.
      if (realIsOwnProfile) return true;
      
      // Check actual friendship data
      if ((profileUser as any).isFriend === true) return true;
      if (Array.isArray((currentUser as any).friends)) {
          return (currentUser as any).friends.some((f: User) => String(f.id) === String(profileUser.id));
      }
      return false;
  }, [realIsOwnProfile, isViewAsActive, profileUser, currentUser]);

  // 7. Final Content Visibility Gate
  // Show content ONLY if: 
  // a) Effective Owner (False in View As)
  // b) Profile is Public (Not Locked)
  // c) User is a Friend (False in View As)
  const canViewContent = isOwnProfile || !isProfileLocked || isFriend;
  
  // --------------------------------------------------------------------------

  const userPosts = useMemo(() => {
      // Security Filter: Even if posts are passed, ensure we don't return them if content is restricted
      if (!canViewContent) return [];
      return posts.filter(post => post.author.id === profileUser.id);
  }, [posts, profileUser.id, canViewContent]);

  const userStories = useMemo(() => {
      if (!canViewContent) return [];
      return stories.filter(s => s.userId === profileUser.id);
  }, [stories, profileUser.id, canViewContent]);

  const hasActiveStory = canViewContent && userStories.length > 0;

  const viewingPost = useMemo(() => {
      if (!viewingMedia || !viewingMedia.postId) return null;
      return posts.find(p => p.id === viewingMedia.postId);
  }, [viewingMedia, posts]);

  const isViewingPostSaved = useMemo(() => {
      if (!viewingPost) return false;
      return savedPhotos.some(p => p.id === viewingPost.id);
  }, [viewingPost, savedPhotos]);

  useEffect(() => {
      if (defaultTab) {
          setActiveTab(defaultTab);
      } else {
          setActiveTab('posts');
      }
  }, [profileUser.id, defaultTab]);

  useEffect(() => {
      if (!canViewContent) {
          setViewingMedia(null);
          setIsViewingStory(false);
      }
  }, [canViewContent]);

  const handleViewMedia = (url: string, type: 'image' | 'video' = 'image', postId?: string) => {
      if (!canViewContent) return;
      playAudio('pop');
      setViewingMedia({ url, type, postId });
  };

  const handleViewAvatar = (e: React.MouseEvent) => {
      e.stopPropagation();
      if (!canViewContent) return;
      
      if (!profileUser.avatar) return;

      const profileAlbum = albums.find(a => a.type === 'profile');
      let images: string[] = [];
      
      if (profileAlbum && profileAlbum.photos.length > 0) {
          images = profileAlbum.photos.map(p => p.url);
          if (!images.includes(profileUser.avatar)) {
              images.unshift(profileUser.avatar);
          }
      } else {
          images = [profileUser.avatar];
      }

      setProfileImagesList(images);
      handleViewMedia(profileUser.avatar, 'image');
  };

  const handleViewStoryAction = (e: React.MouseEvent) => {
      e.stopPropagation();
      if (!canViewContent) return;
      playAudio('pop');
      setIsViewingStory(true);
  };

  const handleViewCover = (e: React.MouseEvent) => {
      e.stopPropagation();
      if (!canViewContent) return;

      if (!profileUser.coverPhoto) return;

      const coverAlbum = albums.find(a => a.type === 'cover');
      let images: string[] = [];

      if (coverAlbum && coverAlbum.photos.length > 0) {
          images = coverAlbum.photos.map(p => p.url);
          if (!images.includes(profileUser.coverPhoto)) {
              images.unshift(profileUser.coverPhoto);
          }
      } else {
          images = [profileUser.coverPhoto];
      }

      setProfileImagesList(images);
      handleViewMedia(profileUser.coverPhoto, 'image');
  };

  const handleNextImage = useCallback((e: React.MouseEvent) => {
      e.stopPropagation();
      if (!viewingMedia || profileImagesList.length <= 1) return;
      
      playAudio('pop');
      const currentIndex = profileImagesList.indexOf(viewingMedia.url);
      const startIdx = currentIndex === -1 ? 0 : currentIndex;
      const nextIndex = (startIdx + 1) % profileImagesList.length;
      setViewingMedia({ url: profileImagesList[nextIndex], type: 'image' });
  }, [profileImagesList, viewingMedia]);

  const handlePrevImage = useCallback((e: React.MouseEvent) => {
      e.stopPropagation();
      if (!viewingMedia || profileImagesList.length <= 1) return;

      playAudio('pop');
      const currentIndex = profileImagesList.indexOf(viewingMedia.url);
      const startIdx = currentIndex === -1 ? 0 : currentIndex;
      const prevIndex = (startIdx - 1 + profileImagesList.length) % profileImagesList.length;
      setViewingMedia({ url: profileImagesList[prevIndex], type: 'image' });
  }, [profileImagesList, viewingMedia]);

  const handleLikeLocal = (id: string, reactionType?: string) => {
      if (onLike) {
          onLike(id, reactionType);
      }
  };

  const handleCommentLocal = (text: string) => {
      if (viewingPost && onComment) {
          onComment(viewingPost.id, text);
      }
  };

  const handleDeleteCommentLocal = (commentId: string) => {
      if (viewingPost && onDeleteComment) {
          onDeleteComment(viewingPost.id, commentId);
      }
  };

  const handleDeletePostConfirm = () => {
       if (viewingPost && onDeletePost) {
          playAudio('pop');
          onDeletePost(viewingPost.id);
          setViewingMedia(null);
      } else if (onDeletePhoto && viewingMedia && viewingMedia.postId) {
          playAudio('pop');
          onDeletePhoto(viewingMedia.postId);
          setViewingMedia(null);
      }
  };

  const handleToggleSavePost = () => {
      if (viewingPost && onToggleSave) {
          onToggleSave(viewingPost);
      }
  };

  const handleTogglePinPost = () => {
      if (viewingPost && onTogglePin) {
          onTogglePin(viewingPost.id);
      }
  };

  const handleViewAs = () => {
    playAudio('pop');
    if (onToggleViewAs) {
        if (!isViewAsMode) onToggleViewAs(); 
    } else {
        setLocalViewAsMode(true);
    }
    setActiveTab('posts');
    if (typeof window !== 'undefined') {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handleExitViewAs = () => {
    playAudio('pop');
    if (onToggleViewAs) {
        if (isViewAsMode) onToggleViewAs();
    } else {
        setLocalViewAsMode(false);
    }
  };

  return (
    <div className="w-full max-w-[1250px] mx-auto pb-10 relative">
      <style>{`
        @keyframes floatUp {
            0% { transform: translateY(0) scale(0.5); opacity: 0; }
            10% { opacity: 1; transform: translateY(-20px) scale(1.2); }
            100% { transform: translateY(-300px) scale(1); opacity: 0; }
        }
        .animate-float {
            animation: floatUp 2s ease-out forwards;
        }
      `}</style>
      
      {isViewAsActive && (
           <div className="sticky top-[4.5rem] z-[45] bg-gray-900 text-white px-4 py-3 rounded-xl mb-4 shadow-xl flex items-center justify-between animate-fadeIn mx-4 border border-gray-700 backdrop-blur-md bg-opacity-95">
               <div className="flex items-center gap-3">
                   <div className="bg-white/10 p-2 rounded-full">
                        <Eye className="w-5 h-5 text-fb-blue" />
                   </div>
                   <div>
                       <p className="font-bold text-sm">{language === 'ar' ? 'عرض كما يظهر للآخرين' : 'Viewing as Public'}</p>
                       <p className="text-xs text-gray-300">{language === 'ar' ? 'هكذا يبدو ملفك الشخصي للعامة' : 'This is what your profile looks like to the public'}</p>
                   </div>
               </div>
               <button 
                   onClick={handleExitViewAs}
                   className="bg-white/10 hover:bg-white/20 px-4 py-2 rounded-lg text-sm font-bold transition flex items-center gap-2 border border-white/10"
               >
                   <X className="w-4 h-4" />
                   {language === 'ar' ? 'خروج' : 'Exit View'}
               </button>
           </div>
      )}

      <ProfileHeader
        currentUser={currentUser}
        profileUser={profileUser}
        isOwnProfile={isOwnProfile}
        activeTab={activeTab}
        onTabChange={setActiveTab}
        onUpdateAvatar={onUpdateAvatar}
        onUpdateCover={onUpdateCover}
        onUpdateName={onUpdateName}
        onAddStory={onAddStory}
        onMessageClick={onMessageClick}
        onFriendAction={onFriendAction}
        onViewAvatar={handleViewAvatar}
        onViewCover={handleViewCover}
        onViewStory={handleViewStoryAction}
        hasActiveStory={hasActiveStory} 
        onViewAs={handleViewAs}
        onToggleLockProfile={onToggleLockProfile}
        canViewContent={canViewContent}
      />

      {canViewContent ? (
        <ProfileTabsContent 
            activeTab={activeTab}
            currentUser={currentUser}
            profileUser={profileUser}
            isOwnProfile={isOwnProfile}
            userPosts={userPosts}
            photos={photos}
            savedPhotos={savedPhotos}
            albums={albums}
            userVideos={userVideos}
            savedVideos={savedVideos}
            pages={pages}
            setPages={setPages}
            pagePosts={pagePosts}
            setPagePosts={setPagePosts}
            pageAlbums={pageAlbums}
            setPageAlbums={setPageAlbums}
            groupPostsStore={groupPostsStore}
            setGroupPostsStore={setGroupPostsStore || (() => {})}
            setProfileUser={setProfileUser}
            initialFriendsTab={initialFriendsTab}
            onPostCreate={onPostCreate}
            onTogglePin={onTogglePin}
            onDeletePost={onDeletePost}
            onLike={onLike}
            onComment={onComment}
            onDeleteComment={onDeleteComment}
            onLikeComment={onLikeComment}
            onViewMedia={handleViewMedia}
            onUpdateAvatar={onUpdateAvatar}
            onToggleSave={onToggleSave}
            onTabChange={setActiveTab}
            onFriendClick={onFriendClick}
            onMessageClick={onMessageClick}
            onAddPhoto={onAddPhoto}
            onCreateAlbum={album => onCreateAlbum && onCreateAlbum(album)}
            onAddPhotoToAlbum={(albumId, photo) => onAddPhotoToAlbum && onAddPhotoToAlbum(albumId, photo)}
            onDeletePhoto={onDeletePhoto}
            onAddVideo={onAddVideo}
            onDeleteVideo={onDeleteVideo}
            onToggleSaveVideo={onToggleSaveVideo}
            onLikePhoto={onLikePhoto}
            onCommentPhoto={onCommentPhoto}
            onDeletePhotoComment={onDeletePhotoComment}
            onLikePhotoComment={onLikePhotoComment}
            onLikeVideo={onLikeVideo}
            onCommentVideo={onCommentVideo}
            onDeleteVideoComment={onDeleteVideoComment}
            onLikeVideoComment={onLikeVideoComment}
        />
      ) : (
        <div className="flex flex-col items-center justify-center py-16 bg-white dark:bg-gray-800 rounded-xl shadow-sm mt-4 text-center p-6 border border-gray-200 dark:border-gray-700 animate-fadeIn mx-4">
            <div className="bg-gray-100 dark:bg-gray-700 p-6 rounded-full mb-6">
                <Shield className="w-16 h-16 text-gray-500 dark:text-gray-400" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-3">
                {language === 'ar' ? 'هذا الملف الشخصي مقفل' : 'This profile is locked'}
            </h2>
            <p className="text-gray-500 dark:text-gray-400 max-w-md text-lg leading-relaxed">
                {language === 'ar' 
                    ? `قام ${profileUser.name} بقفل ملفه الشخصي. فقط أصدقاؤه يمكنهم رؤية ما يشاركه.`
                    : `${profileUser.name} locked their profile. Only friends can see what they share.`}
            </p>
        </div>
      )}

      {viewingMedia && canViewContent && typeof document !== 'undefined' && createPortal(
        <ProfileMediaLightbox 
            viewingMedia={viewingMedia}
            viewingPost={viewingPost || null}
            profileImagesList={profileImagesList}
            currentUser={currentUser}
            isOwnProfile={isOwnProfile}
            isSaved={isViewingPostSaved}
            onClose={() => setViewingMedia(null)}
            onNext={handleNextImage}
            onPrev={handlePrevImage}
            onLike={handleLikeLocal}
            onComment={handleCommentLocal}
            onDeleteComment={handleDeleteCommentLocal}
            onLikeComment={(commentId) => onLikeComment && viewingPost && onLikeComment(viewingPost.id, commentId)}
            onDeletePost={handleDeletePostConfirm}
            onToggleSave={handleToggleSavePost}
            onTogglePin={handleTogglePinPost}
            onUpdateAvatar={onUpdateAvatar ? onUpdateAvatar : () => {}}
        />,
        document.body
      )}

      {isViewingStory && hasActiveStory && canViewContent && typeof document !== 'undefined' && createPortal(
          <ProfileStoryOverlay 
              userStories={userStories}
              currentUser={currentUser}
              onClose={() => setIsViewingStory(false)}
              onAddStory={onAddStory || (() => {})}
          />,
          document.body
      )}
    </div>
  );
};

export default Profile;