
import React, { useRef, useCallback } from 'react';
import { User, Post, TabType, Photo, Album, VideoItem, Page } from '../types';
import ProfilePosts from './ProfilePosts';
import ProfileAbout from './ProfileAbout';
import ProfileFriends from './ProfileFriends';
import ProfilePhotos from './ProfilePhotos';
import ProfileVideos from './ProfileVideos';
import ProfileGroups from './ProfileGroups';
import ProfilePages from './ProfilePages';
import ProfileEvents from './ProfileEvents';
import { useNotify } from '../context/NotificationContext';

/* Fix: Added missing pageAlbums and setPageAlbums to ProfileTabsContentProps and adjusted setProfileUser type to (val: any) => void to match Profile.tsx */
interface ProfileTabsContentProps {
  activeTab: TabType;
  currentUser: User;
  profileUser: User;
  setProfileUser?: (val: any) => void;
  isOwnProfile: boolean;
  userPosts: Post[];
  photos: Photo[];
  savedPhotos: Photo[];
  albums: Album[];
  userVideos: VideoItem[];
  savedVideos: VideoItem[];
  pages: Page[];
  setPages?: React.Dispatch<React.SetStateAction<Page[]>>;
  pagePosts: Record<string, Post[]>;
  setPagePosts?: React.Dispatch<React.SetStateAction<Record<string, Post[]>>>;
  pageAlbums?: Record<string, Album[]>;
  setPageAlbums?: React.Dispatch<React.SetStateAction<Record<string, Album[]>>>;
  groupPostsStore: Record<string, Post[]>;
  setGroupPostsStore: React.Dispatch<React.SetStateAction<Record<string, Post[]>>>;
  initialFriendsTab?: 'all' | 'mutual' | 'work' | 'university' | 'city' | 'suggestions';
  
  // Handlers
  onPostCreate: (content: string, image?: string) => void;
  onTogglePin?: (postId: string) => void;
  onDeletePost?: (postId: string) => void;
  onLike?: (postId: string, reactionType?: string) => void;
  onComment?: (postId: string, text: string) => void;
  onDeleteComment?: (postId: string, commentId: string) => void;
  onLikeComment?: (postId: string, commentId: string) => void;
  onViewMedia: (url: string, type: 'image' | 'video', postId?: string) => void;
  onUpdateAvatar?: (url: string) => void;
  onToggleSave?: (item: Photo | Post) => void;
  onTabChange: (tab: TabType) => void;
  onFriendClick?: (user: User) => void;
  onMessageClick?: (user: User) => void;
  onAddPhoto?: (photo: Photo) => void;
  onCreateAlbum?: (album: Album) => void;
  onAddPhotoToAlbum?: (albumId: string, photo: Photo) => void;
  onDeletePhoto?: (photoId: string) => void;
  onAddVideo?: (video: VideoItem) => void;
  onDeleteVideo?: (videoId: string) => void;
  onToggleSaveVideo?: (video: VideoItem) => void;
  onLikePhoto?: (photoId: string, reactionType?: string) => void;
  onCommentPhoto?: (photoId: string, text: string) => void;
  onDeletePhotoComment?: (photoId: string, commentId: string) => void;
  onLikePhotoComment?: (photoId: string, commentId: string) => void;
  onLikeVideo?: (videoId: string, reactionType?: string) => void;
  onCommentVideo?: (videoId: string, text: string) => void;
  onDeleteVideoComment?: (videoId: string, commentId: string) => void;
  onLikeVideoComment?: (videoId: string, commentId: string) => void;
}

const ProfileTabsContent: React.FC<ProfileTabsContentProps> = ({
  activeTab, currentUser, profileUser, setProfileUser, isOwnProfile, userPosts, photos, savedPhotos, albums,
  userVideos, savedVideos, pages, setPages, pagePosts, setPagePosts, pageAlbums, setPageAlbums,
  groupPostsStore, setGroupPostsStore,
  initialFriendsTab,
  onPostCreate, onTogglePin, onDeletePost, onLike, onComment, onDeleteComment, onLikeComment,
  onViewMedia, onUpdateAvatar, onToggleSave, onTabChange, onFriendClick, onMessageClick,
  onAddPhoto, onCreateAlbum, onAddPhotoToAlbum, onDeletePhoto, onAddVideo, onDeleteVideo,
  onToggleSaveVideo, onLikePhoto, onCommentPhoto, onDeletePhotoComment, onLikePhotoComment,
  onLikeVideo, onCommentVideo, onDeleteVideoComment, onLikeVideoComment
}) => {
  const notify = useNotify();
  const lastNotificationRef = useRef<{ message: string; timestamp: number } | null>(null);

  // Unified Show Notification Handler with Debounce Logic & Filtering
  const handleShowNotification = useCallback((message: string, type: 'success' | 'info' | 'error' = 'success') => {
    const now = Date.now();
    
    // 1. Debounce Check: Prevent exact duplicates within 1 second (Local check)
    if (
      lastNotificationRef.current &&
      lastNotificationRef.current.message === message &&
      (now - lastNotificationRef.current.timestamp < 1000)
    ) {
      return;
    }

    // 2. Global Logic Filter: Suppress messages that are likely already handled by global handlers (App.tsx)
    // This prevents double toasts when both App logic and Component logic trigger notifications.
    // We allow others (like specific Page actions) to pass through.
    const lowerMsg = message.toLowerCase();
    const isGlobalAction = 
        lowerMsg.includes('saved') || lowerMsg.includes('حفظ') || 
        lowerMsg.includes('liked') || lowerMsg.includes('إعجاب') ||
        lowerMsg.includes('deleted') || lowerMsg.includes('حذف');

    if (isGlobalAction) {
        // We assume App.tsx handled it. But we update ref to be safe.
        lastNotificationRef.current = { message, timestamp: now };
        return;
    }

    // Update ref and notify
    lastNotificationRef.current = { message, timestamp: now };
    notify(message, type);
  }, [notify]);

  return (
    <>
      <div className={activeTab === 'posts' ? 'block' : 'hidden'}>
        <ProfilePosts 
            currentUser={currentUser}
            profileUser={profileUser}
            isOwnProfile={isOwnProfile}
            posts={userPosts}
            photos={photos}
            savedPhotos={savedPhotos}
            onPostCreate={onPostCreate}
            onTogglePin={onTogglePin}
            onDeletePost={onDeletePost}
            onLike={onLike}
            onComment={onComment}
            onDeleteComment={onDeleteComment}
            onLikeComment={onLikeComment}
            onMediaClick={onViewMedia}
            onUpdateAvatar={onUpdateAvatar}
            onToggleSave={onToggleSave}
            onTabChange={onTabChange}
        />
      </div>

      <div className={activeTab === 'about' ? 'block' : 'hidden'}>
        <div className="px-4 md:px-0 animate-fadeIn">
          <ProfileAbout 
              currentUser={profileUser} 
              readonly={!isOwnProfile} 
              setProfileUser={setProfileUser}
          />
        </div>
      </div>

      {activeTab === 'friends' && (
        <div className="px-4 md:px-0">
          <ProfileFriends 
            onFriendClick={onFriendClick} 
            onMessageClick={onMessageClick} 
            initialTab={initialFriendsTab as any} 
          />
        </div>
      )}

      {activeTab === 'photos' && (
         <div className="px-4 md:px-0">
             <ProfilePhotos 
                currentUser={profileUser} 
                isOwnProfile={isOwnProfile} 
                photos={photos} 
                albums={albums}
                onAddPhoto={onAddPhoto}
                onCreateAlbum={onCreateAlbum}
                onAddPhotoToAlbum={onAddPhotoToAlbum}
                onUpdateAvatar={onUpdateAvatar}
                onDeletePhoto={onDeletePhoto}
                savedPhotos={savedPhotos}
                onToggleSave={onToggleSave}
                onLikePhoto={onLikePhoto}
                onCommentPhoto={onCommentPhoto}
                onDeletePhotoComment={onDeletePhotoComment}
                onLikePhotoComment={onLikePhotoComment}
             />
         </div>
      )}

      {activeTab === 'videos' && (
           <div className="px-4 md:px-0">
               <ProfileVideos 
                    currentUser={profileUser} 
                    isOwnProfile={isOwnProfile} 
                    userVideos={userVideos}
                    onAddVideo={onAddVideo}
                    onDeleteVideo={onDeleteVideo}
                    savedVideos={savedVideos}
                    onToggleSaveVideo={onToggleSaveVideo}
                    onLikeVideo={onLikeVideo}
                    onCommentVideo={onCommentVideo}
                    onDeleteVideoComment={onDeleteVideoComment}
                    onLikeVideoComment={onLikeVideoComment}
               />
           </div>
      )}
      
      {activeTab === 'groups' && (
          <div className="px-4 md:px-0 animate-fadeIn">
              {/* @ts-ignore - passing optional showNotification to support future updates or if component supports it */}
              <ProfileGroups 
                currentUser={currentUser}
                onToggleSave={onToggleSave}
                onLike={onLike}
                onComment={onComment}
                onDeleteComment={onDeleteComment}
                onLikeComment={onLikeComment}
                onDeletePostExternal={onDeletePost}
                groupPostsStore={groupPostsStore}
                setGroupPostsStore={setGroupPostsStore}
                showNotification={handleShowNotification}
              />
          </div>
      )}

      {activeTab === 'pages' && (
          <div className="px-4 md:px-0 animate-fadeIn">
              <ProfilePages 
                  currentUser={currentUser}
                  pages={pages}
                  setPages={setPages || (() => {})}
                  pagePosts={pagePosts}
                  setPagePosts={setPagePosts || (() => {})}
                  pageAlbums={pageAlbums}
                  setPageAlbums={setPageAlbums || (() => {})}
                  onLike={onLike}
                  onComment={onComment}
                  onDeleteComment={onDeleteComment}
                  onLikeComment={onLikeComment}
                  onToggleSave={onToggleSave}
                  onDeletePost={onDeletePost}
                  onTogglePin={onTogglePin}
                  showNotification={handleShowNotification}
              />
          </div>
      )}

      {activeTab === 'events' && (
          <div className="px-4 md:px-0 animate-fadeIn">
              <ProfileEvents />
          </div>
      )}
    </>
  );
};

export default ProfileTabsContent;
