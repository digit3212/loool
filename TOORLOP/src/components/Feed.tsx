import React, { useState, useMemo, useCallback } from 'react';
import { createPortal } from 'react-dom';
import { Post, User, Story, Photo } from '../types';
import CreatePost from './CreatePost';
import PostCard from './PostCard';
import StoryReel, { UserStoryGroup } from './StoryReel';
import StoryViewer from './StoryViewer';
import ProfileMediaLightbox from './ProfileMediaLightbox';
import { Image as ImageIcon } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

interface FeedProps {
  currentUser: User;
  stories: Story[];
  posts: Post[];
  savedPhotos: Photo[];
  onAddStory: (mediaUrl: string) => void;
  onPostCreate: (content: string, image?: string) => void;
  onTogglePin?: (postId: string) => void;
  onDeletePost?: (postId: string) => void;
  onToggleSave?: (post: Post) => void;
  onLike?: (postId: string, reactionType?: string) => void;
  onComment?: (postId: string, text: string) => void;
  onDeleteComment?: (postId: string, commentId: string) => void;
  onLikeComment?: (postId: string, commentId: string) => void;
  onUpdateAvatar?: (url: string) => void;
  isLoading?: boolean;
}

// Helper to parse relative Arabic time or standard dates for accurate sorting
const parseDate = (dateStr: string): number => {
    if (!dateStr) return 0;
    if (dateStr === 'الآن' || dateStr === 'Now') return Date.now();
    
    const stdDate = new Date(dateStr).getTime();
    if (!isNaN(stdDate)) return stdDate;

    const now = Date.now();
    const minute = 60 * 1000;
    const hour = 60 * minute;
    const day = 24 * hour;

    // Arabic parsing
    if (dateStr.includes('دقيقتين')) return now - (2 * minute);
    if (dateStr.includes('ساعتين')) return now - (2 * hour);
    if (dateStr.includes('يومين')) return now - (2 * day);

    const numMatch = dateStr.match(/\d+/);
    const num = numMatch ? parseInt(numMatch[0]) : 1;

    if (dateStr.includes('دقيقة') || dateStr.includes('دقائق')) return now - (num * minute);
    if (dateStr.includes('ساعة') || dateStr.includes('ساعات')) return now - (num * hour);
    if (dateStr.includes('يوم') || dateStr.includes('أيام') || dateStr.includes('أمس')) return now - (num * day);
    
    // English parsing (basic support for compatibility)
    if (dateStr.includes('min') || dateStr.includes('mins')) return now - (num * minute);
    if (dateStr.includes('hour') || dateStr.includes('hrs')) return now - (num * hour);
    if (dateStr.includes('day') || dateStr.includes('days') || dateStr.includes('Yesterday')) return now - (num * day);

    return 0;
};

const SkeletonPost = () => (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-4 mb-4 border border-gray-100 dark:border-gray-700 animate-pulse">
        <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-full bg-gray-200 dark:bg-gray-700"></div>
            <div className="flex-1">
                <div className="w-24 h-3 bg-gray-200 dark:bg-gray-700 mb-2 rounded"></div>
                <div className="w-16 h-2 bg-gray-200 dark:bg-gray-700 rounded"></div>
            </div>
        </div>
        <div className="w-full h-4 bg-gray-200 dark:bg-gray-700 mb-2 rounded"></div>
        <div className="w-3/4 h-4 bg-gray-200 dark:bg-gray-700 mb-4 rounded"></div>
        <div className="w-full h-64 bg-gray-200 dark:bg-gray-700 rounded-lg"></div>
    </div>
);

const Feed: React.FC<FeedProps> = ({ 
    currentUser, 
    stories, 
    posts, 
    savedPhotos,
    onAddStory, 
    onPostCreate, 
    onTogglePin, 
    onDeletePost, 
    onToggleSave, 
    onLike, 
    onComment, 
    onDeleteComment,
    onLikeComment,
    onUpdateAvatar,
    isLoading = false
}) => {
  const { t, dir } = useLanguage();
  
  // Lightbox State
  const [viewingMedia, setViewingMedia] = useState<{ url: string, type: 'image' | 'video', postId?: string } | null>(null);

  // Group stories logic
  const { myStoryGroup, otherStoryGroups } = useMemo(() => {
      const groups: Record<string, UserStoryGroup> = {};
      
      if (Array.isArray(stories)) {
          stories.forEach(story => {
              const timestamp = parseDate(story.timestamp);
              
              if (!groups[story.userId]) {
                  groups[story.userId] = {
                      userId: story.userId,
                      userName: story.userName,
                      userAvatar: story.userAvatar,
                      stories: [],
                      latestTimestamp: 0
                  };
              }
              groups[story.userId].stories.push({ ...story, _parsedDate: timestamp } as any);
              
              if (timestamp > groups[story.userId].latestTimestamp) {
                  groups[story.userId].latestTimestamp = timestamp;
              }
          });
      }

      Object.values(groups).forEach(group => {
          // Sort stories by date descending (Newest first)
          group.stories.sort((a: any, b: any) => b._parsedDate - a._parsedDate);
      });

      const myGroup = groups[currentUser.id] || null;
      if (myGroup) delete groups[currentUser.id];
      
      const others = Object.values(groups).sort((a, b) => b.latestTimestamp - a.latestTimestamp);
      
      return { myStoryGroup: myGroup, otherStoryGroups: others };
  }, [stories, currentUser.id]);

  const displayGroups = useMemo(() => {
      return myStoryGroup ? [myStoryGroup, ...otherStoryGroups] : otherStoryGroups;
  }, [myStoryGroup, otherStoryGroups]);

  // Media List for Navigation in Lightbox
  const feedMediaList = useMemo(() => {
      return posts.filter(p => p.image).map(p => p.image!);
  }, [posts]);

  const viewingPost = useMemo(() => {
      if (!viewingMedia?.postId) return null;
      return posts.find(p => p.id === viewingMedia.postId) || null;
  }, [posts, viewingMedia]);

  const isViewingPostSaved = useMemo(() => {
      if (!viewingPost) return false;
      return savedPhotos.some(p => p.id === viewingPost.id);
  }, [viewingPost, savedPhotos]);

  const handleViewMedia = (url: string, type: 'image' | 'video', postId: string) => {
      setViewingMedia({ url, type, postId });
  };

  const handleNextMedia = useCallback((e: React.MouseEvent) => {
      e.stopPropagation();
      if (!viewingMedia || feedMediaList.length <= 1) return;
      const currentIdx = feedMediaList.indexOf(viewingMedia.url);
      const nextIdx = (currentIdx + 1) % feedMediaList.length;
      const nextUrl = feedMediaList[nextIdx];
      const nextPost = posts.find(p => p.image === nextUrl);
      if (nextPost) {
          setViewingMedia({ 
              url: nextUrl, 
              type: (nextUrl.startsWith('data:video') || nextUrl.endsWith('.mp4')) ? 'video' : 'image', 
              postId: nextPost.id 
          });
      }
  }, [feedMediaList, viewingMedia, posts]);

  const handlePrevMedia = useCallback((e: React.MouseEvent) => {
      e.stopPropagation();
      if (!viewingMedia || feedMediaList.length <= 1) return;
      const currentIdx = feedMediaList.indexOf(viewingMedia.url);
      const prevIdx = (currentIdx - 1 + feedMediaList.length) % feedMediaList.length;
      const prevUrl = feedMediaList[prevIdx];
      const prevPost = posts.find(p => p.image === prevUrl);
      if (prevPost) {
          setViewingMedia({ 
              url: prevUrl, 
              type: (prevUrl.startsWith('data:video') || prevUrl.endsWith('.mp4')) ? 'video' : 'image', 
              postId: prevPost.id 
          });
      }
  }, [feedMediaList, viewingMedia, posts]);

  // Viewer State
  const [viewingStoryGroupIndex, setViewingStoryGroupIndex] = useState<number | null>(null);

  const safePosts = Array.isArray(posts) ? posts : [];

  return (
    <div 
        className="flex-1 max-w-[740px] mx-auto py-4 md:py-6 px-4 md:px-8 min-h-screen animate-fadeIn bg-white/40 dark:bg-gray-800/40 backdrop-md border-x border-white/20 dark:border-gray-700/50 shadow-sm transition-all duration-300"
        dir={dir}
    >
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

      {/* Story Reel Component */}
      <StoryReel 
        currentUser={currentUser} 
        groups={displayGroups} 
        onAddStory={onAddStory} 
        onViewStory={setViewingStoryGroupIndex}
      />

      {/* Create Post Component */}
      <CreatePost currentUser={currentUser} onPostCreate={onPostCreate} />
      
      {/* Post Feed */}
      <div className="space-y-4">
          {isLoading ? (
              <>
                <SkeletonPost />
                <SkeletonPost />
                <SkeletonPost />
              </>
          ) : safePosts.length > 0 ? (
              safePosts.map(post => (
                <PostCard 
                    key={post.id} 
                    post={post} 
                    currentUser={currentUser} 
                    onTogglePin={onTogglePin}
                    onDelete={onDeletePost}
                    onToggleSave={onToggleSave}
                    onLike={onLike}
                    onComment={onComment}
                    onDeleteComment={onDeleteComment}
                    onLikeComment={onLikeComment}
                    onMediaClick={handleViewMedia}
                    isSaved={savedPhotos.some(p => p.id === post.id)}
                    onSetProfilePicture={onUpdateAvatar}
                />
              ))
          ) : (
              <div className="bg-white/60 dark:bg-gray-800/60 backdrop-blur-sm rounded-lg shadow-sm p-8 text-center border border-white/20 dark:border-gray-700/50 flex flex-col items-center">
                  <div className="bg-gray-100/50 dark:bg-gray-700/50 w-20 h-20 rounded-full flex items-center justify-center mb-4">
                      <ImageIcon className="w-10 h-10 text-gray-400 dark:text-gray-500" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-700 dark:text-gray-200 mb-2">
                      {t.profile_no_posts || 'لا توجد منشورات حتى الآن'}
                  </h3>
                  <p className="text-gray-500 dark:text-gray-400 text-sm">
                      {t.groups_be_first || 'كن أول من يشارك لحظاته مع الأصدقاء!'}
                  </p>
              </div>
          )}
      </div>
      
      {/* Loading State / End of Feed (Additional Bottom Loader) */}
      {!isLoading && safePosts.length > 2 && (
          <div className="flex justify-center py-8">
              <div className="flex gap-1">
                  <div className="h-2.5 w-2.5 bg-emerald-600/50 rounded-full animate-bounce"></div>
                  <div className="h-2.5 w-2.5 bg-emerald-600/50 rounded-full animate-bounce delay-75"></div>
                  <div className="h-2.5 w-2.5 bg-emerald-600/50 rounded-full animate-bounce delay-150"></div>
              </div>
          </div>
      )}

      {/* Fullscreen Story Viewer */}
      {viewingStoryGroupIndex !== null && (
          <StoryViewer 
            initialGroupIndex={viewingStoryGroupIndex}
            groups={displayGroups}
            currentUser={currentUser}
            onClose={() => setViewingStoryGroupIndex(null)}
            onAddStory={onAddStory}
          />
      )}

      {/* Fullscreen Media Lightbox (Portal) */}
      {viewingMedia && typeof document !== 'undefined' && createPortal(
        <ProfileMediaLightbox 
            viewingMedia={viewingMedia}
            viewingPost={viewingPost}
            profileImagesList={feedMediaList}
            currentUser={currentUser}
            isOwnProfile={viewingPost?.author.id === currentUser.id}
            isSaved={isViewingPostSaved}
            onClose={() => setViewingMedia(null)}
            onNext={handleNextMedia}
            onPrev={handlePrevMedia}
            onLike={(reaction) => onLike && viewingPost && onLike(viewingPost.id, reaction)}
            onComment={(text) => onComment && viewingPost && onComment(viewingPost.id, text)}
            onDeleteComment={(commentId) => onDeleteComment && viewingPost && onDeleteComment(viewingPost.id, commentId)}
            onLikeComment={(commentId) => onLikeComment && viewingPost && onLikeComment(viewingPost.id, commentId)}
            onDeletePost={() => { if(onDeletePost && viewingPost) onDeletePost(viewingPost.id); setViewingMedia(null); }}
            onToggleSave={() => { if(onToggleSave && viewingPost) onToggleSave(viewingPost); }}
            onTogglePin={() => { if(onTogglePin && viewingPost) onTogglePin(viewingPost.id); }}
            onUpdateAvatar={onUpdateAvatar || (() => {})}
        />,
        document.body
      )}
    </div>
  );
};

export default Feed;