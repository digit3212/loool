
import React from 'react';
import Sidebar from './Sidebar';
import Rightbar from './Rightbar';
import Feed from './Feed';
import Watch from './Watch';
import SavedItems from './SavedItems';
import ProfileGroups from './ProfileGroups';
import ProfilePages from './ProfilePages';
import ProfileEvents from './ProfileEvents';
import Marketplace from './Marketplace';
import Gaming from './Gaming';
import Profile from './Profile';
import Memories from './Memorise';
import { User, View, Post, Photo, VideoItem, Page, Album } from '../types';
import { useLanguage } from '../context/LanguageContext';

interface AppBodyProps {
  currentView: View;
  setView: (view: View) => void;
  currentUser: User;
  posts: Post[];
  setPosts: React.Dispatch<React.SetStateAction<Post[]>>;
  stories: any[];
  media: any; // From useMedia hook
  pages: Page[];
  setPages: React.Dispatch<React.SetStateAction<Page[]>>;
  pagePosts: Record<string, Post[]>;
  setPagePosts: React.Dispatch<React.SetStateAction<Record<string, Post[]>>>;
  pageAlbums: Record<string, Album[]>;
  setPageAlbums: React.Dispatch<React.SetStateAction<Record<string, Album[]>>>;
  groupPostsStore?: Record<string, Post[]>; // Lifted state from App.tsx
  setGroupPostsStore?: React.Dispatch<React.SetStateAction<Record<string, Post[]>>>;
  viewingProfile: User;
  onlineUsers: User[];
  
  // Handlers
  handleProfileClick: () => void;
  handleFriendClick: (user: User) => void;
  handleOpenChat: (user: User) => void;
  handleCreatePost: (content: string, image?: string) => void;
  handleTogglePinPost: (id: string) => void;
  handleDeletePost: (id: string) => void;
  syncToggleSave: (item: any) => void;
  syncLike: (id: string) => void;
  syncComment: (id: string, text: string) => void;
  syncDeleteComment: (id: string, commentId: string) => void;
  syncLikeComment: (id: string, commentId: string) => void;
  handleUpdateName: (name: string) => void;
  handleAddStory: (url: string) => void;
  handleViewUserStory: (id: string) => void;
  handleFriendAction: (action: 'unfriend' | 'block', user: User) => void;
  handleUpdateAvatar: (url: string) => void;
  handleUpdateCover: (url: string) => void;
  isGlobalLoading?: boolean;
  handleProfileUpdate: () => void;
  onToggleLockProfile: () => void;
  onToggleViewAs: () => void;
  isViewAsMode?: boolean;
  showNotification: (message: string, type?: 'success' | 'info' | 'error') => void;
}

const AppBody: React.FC<AppBodyProps> = ({
  currentView, setView, currentUser, posts, setPosts, stories, media, pages, setPages,
  pagePosts, setPagePosts, pageAlbums, setPageAlbums, groupPostsStore = {}, setGroupPostsStore = () => {}, 
  viewingProfile, onlineUsers, handleProfileClick,
  handleFriendClick, handleOpenChat, handleCreatePost, handleTogglePinPost,
  handleDeletePost, syncToggleSave, syncLike, syncComment, syncDeleteComment,
  syncLikeComment, handleUpdateName, handleAddStory, handleViewUserStory, handleFriendAction,
  handleUpdateAvatar, handleUpdateCover, isGlobalLoading = false,
  handleProfileUpdate, showNotification,
  /* Fix: Added missing props from interface to destructuring */
  onToggleLockProfile, onToggleViewAs, isViewAsMode
}) => {
  const { dir } = useLanguage();

  return (
    <div className="flex justify-between w-full min-h-screen transition-colors duration-300 relative" dir={dir}>
      {/* Sidebar Logic: Hidden on specific full-width views and mobile (via Sidebar internal CSS) */}
      {currentView !== 'marketplace' && 
       currentView !== 'profile' && 
       currentView !== 'friends' && 
       currentView !== 'nearby' && 
       currentView !== 'suggestions' && 
       currentView !== 'profile_videos' && 
       currentView !== 'gaming' && (
        <Sidebar 
            currentUser={currentUser} 
            onProfileClick={handleProfileClick} 
            onNavigate={(view) => setView(view)} 
        />
      )}
      
      <div className="flex-1 flex justify-center w-full min-w-0 transition-all duration-300">
         {currentView === 'home' && (
           // Removed showNotification to prevent double toast (Global Handler + Local PostCard prop)
           <Feed 
              currentUser={currentUser} 
              stories={stories} 
              posts={posts} 
              savedPhotos={media.savedPhotos} 
              onAddStory={handleAddStory} 
              onPostCreate={handleCreatePost}
              onTogglePin={handleTogglePinPost}
              onDeletePost={handleDeletePost}
              onToggleSave={syncToggleSave}
              onLike={syncLike}
              onComment={syncComment}
              onDeleteComment={syncDeleteComment}
              onLikeComment={syncLikeComment}
              onUpdateAvatar={handleUpdateAvatar}
              isLoading={isGlobalLoading}
           />
         )}

         {currentView === 'watch' && (
           <Watch 
              onSaveVideo={media.handleToggleSave} 
              savedVideos={media.savedVideos} 
              onLikeVideo={syncLike}
              onCommentVideo={syncComment}
              onDeleteVideoComment={syncDeleteComment}
              onLikeVideoComment={syncLikeComment}
              currentUser={currentUser}
           />
         )}

         {currentView === 'saved' && (
           <SavedItems 
              currentUser={currentUser} 
              savedPhotos={media.savedPhotos} 
              savedVideos={media.savedVideos}
              savedPosts={media.savedPosts}
              onUnsave={syncToggleSave}
              onLike={syncLike}
              onComment={syncComment}
              onDeleteComment={syncDeleteComment}
              onLikeComment={syncLikeComment}
           />
         )}

         {currentView === 'groups' && (
           <div className="w-full max-w-[1200px] py-6 px-4 animate-fadeIn">
             <ProfileGroups 
                currentUser={currentUser} 
                onToggleSave={syncToggleSave}
                onLike={syncLike}
                onComment={syncComment}
                onDeleteComment={syncDeleteComment}
                onLikeComment={syncLikeComment}
                onDeletePostExternal={handleDeletePost}
                groupPostsStore={groupPostsStore}
                setGroupPostsStore={setGroupPostsStore}
             />
           </div>
         )}

         {currentView === 'pages' && (
           <div className="w-full max-w-[1200px] py-6 px-4 animate-fadeIn">
             {/* ProfilePages relies on showNotification prop for internal actions like 'Liked' */}
             <ProfilePages 
               currentUser={currentUser} 
               pages={pages}
               setPages={setPages}
               pagePosts={pagePosts}
               setPagePosts={setPagePosts}
               pageAlbums={pageAlbums}
               setPageAlbums={setPageAlbums}
               onLike={syncLike}
               onComment={syncComment}
               onDeleteComment={syncDeleteComment}
               onLikeComment={syncLikeComment}
               onToggleSave={syncToggleSave}
               onDeletePost={handleDeletePost}
               onTogglePin={handleTogglePinPost}
               showNotification={showNotification}
             />
           </div>
         )}

         {currentView === 'events' && (
           <div className="w-full max-w-[940px] py-6 px-4 animate-fadeIn">
             <ProfileEvents />
           </div>
         )}

         {currentView === 'marketplace' && (
           <div className="w-full animate-fadeIn">
             <Marketplace 
                currentUser={currentUser} 
                onMessageClick={handleOpenChat} 
                onBack={() => setView('home')} 
             />
           </div>
         )}

         {currentView === 'memories' && (
           <div className="w-full px-4">
              <Memories 
                currentUser={currentUser}
                posts={posts}
                onBack={() => setView('home')}
                onPostCreate={handleCreatePost}
                onLike={syncLike}
                onComment={syncComment}
                onDeleteComment={syncDeleteComment}
                onLikeComment={syncLikeComment}
                onDeletePost={handleDeletePost}
                onShare={(post) => handleCreatePost(`ذكرى من مثل هذا اليوم: \n\n${post.content}`, post.image)}
              />
           </div>
         )}
         
         {currentView === 'gaming' && (
             <div className="w-full animate-fadeIn">
                 <Gaming 
                    currentUser={currentUser} 
                    onBack={() => setView('home')} 
                 />
             </div>
         )}
         
         {(currentView === 'profile' || currentView === 'friends' || currentView === 'nearby' || currentView === 'suggestions' || currentView === 'profile_videos') && (
           // @ts-ignore
           <Profile 
              currentUser={currentUser} 
              viewingUser={currentView === 'friends' || currentView === 'nearby' || currentView === 'suggestions' ? currentUser : viewingProfile}
              onFriendClick={handleFriendClick}
              onMessageClick={handleOpenChat}
              onFriendAction={handleFriendAction}
              defaultTab={currentView === 'friends' || currentView === 'nearby' || currentView === 'suggestions' ? 'friends' : currentView === 'profile_videos' ? 'videos' : undefined}
              initialFriendsTab={currentView === 'nearby' ? 'city' : currentView === 'suggestions' ? 'suggestions' : undefined}
              
              posts={posts}
              stories={stories}
              onPostCreate={handleCreatePost}
              /* Fix: Replaced onTogglePinPost with handleTogglePinPost as expected by prop */
              onTogglePin={handleTogglePinPost}
              onDeletePost={handleDeletePost}
              onLike={syncLike}
              onComment={syncComment}
              onDeleteComment={syncDeleteComment}
              onLikeComment={syncLikeComment}

              onUpdateAvatar={handleUpdateAvatar}
              onUpdateCover={handleUpdateCover}
              onUpdateName={handleUpdateName} 
              onAddStory={handleAddStory}
              onViewStory={handleViewUserStory}
              
              photos={media.yourPhotos}
              albums={media.albums}
              onAddPhoto={media.handleAddGenericPhoto}
              onCreateAlbum={media.handleCreateAlbum}
              onAddPhotoToAlbum={media.handleAddPhotoToSpecificAlbum}
              onDeletePhoto={handleDeletePost} 
              
              userVideos={media.userVideos}
              onAddVideo={media.handleAddVideoDirectly}
              onDeleteVideo={handleDeletePost} 

              savedPhotos={media.savedPhotos}
              onToggleSave={syncToggleSave}
              savedVideos={media.savedVideos}
              onToggleSaveVideo={media.handleToggleSaveVideo}

              pages={pages}
              setPages={setPages}
              pagePosts={pagePosts}
              setPagePosts={setPagePosts}
              pageAlbums={pageAlbums}
              setPageAlbums={setPageAlbums}
              groupPostsStore={groupPostsStore}
              setGroupPostsStore={setGroupPostsStore}

              onLikePhoto={syncLike}
              onCommentPhoto={syncComment}
              onDeletePhotoComment={syncDeleteComment}
              onLikePhotoComment={syncLikeComment}
              onLikeVideo={syncLike}
              onCommentVideo={syncComment}
              onDeleteVideoComment={syncDeleteComment}
              onLikeVideoComment={syncLikeComment}
              setProfileUser={handleProfileUpdate}
              onToggleLockProfile={onToggleLockProfile}
              onToggleViewAs={onToggleViewAs}
              isViewAsMode={isViewAsMode}
           />
         )}
      </div>

      {currentView !== 'profile' && 
       currentView !== 'marketplace' && 
       currentView !== 'friends' && 
       currentView !== 'nearby' && 
       currentView !== 'suggestions' && 
       currentView !== 'saved' && 
       currentView !== 'profile_videos' && 
       currentView !== 'gaming' && (
          <Rightbar onlineUsers={onlineUsers} onChatClick={handleOpenChat} />
      )}
    </div>
  );
};

export default AppBody;
