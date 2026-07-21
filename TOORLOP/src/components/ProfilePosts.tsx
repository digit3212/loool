
import React from 'react';
import { User, Post, Photo, TabType } from '../types';
import CreatePost from './CreatePost';
import PostCard from './PostCard';
import ProfileIntro from './ProfileIntro';

interface ProfilePostsProps {
  currentUser: User;
  profileUser: User;
  isOwnProfile: boolean;
  posts: Post[];
  photos: Photo[];
  savedPhotos: Photo[];
  onPostCreate: (content: string, image?: string) => void;
  onTogglePin?: (postId: string) => void;
  onDeletePost?: (postId: string) => void;
  onLike?: (postId: string) => void;
  onComment?: (postId: string, text: string) => void;
  onDeleteComment?: (postId: string, commentId: string) => void;
  // Fix: Added optional onLikeComment prop to ProfilePostsProps interface
  onLikeComment?: (postId: string, commentId: string) => void;
  onMediaClick: (url: string, type: 'image' | 'video', postId: string) => void;
  onUpdateAvatar?: (url: string) => void;
  onToggleSave?: (post: Post) => void;
  onTabChange: (tab: TabType) => void;
}

const ProfilePosts: React.FC<ProfilePostsProps> = ({
  currentUser,
  profileUser,
  isOwnProfile,
  posts,
  photos,
  savedPhotos,
  onPostCreate,
  onTogglePin,
  onDeletePost,
  onLike,
  onComment,
  onDeleteComment,
  // Fix: Destructure onLikeComment
  onLikeComment,
  onMediaClick,
  onUpdateAvatar,
  onToggleSave,
  onTabChange
}) => {
  return (
    <div className="flex flex-col md:flex-row gap-4 px-4 md:px-0 animate-fadeIn relative z-20">
        <div className="w-full md:w-5/12 space-y-4">
            <ProfileIntro 
                currentUser={profileUser} 
                isOwnProfile={isOwnProfile} 
                photos={photos} 
                onTabChange={onTabChange} 
            />
        </div>

        <div className="w-full md:w-7/12">
            {isOwnProfile && <CreatePost currentUser={currentUser} onPostCreate={onPostCreate} />}
            
            {posts.length > 0 ? (
                <div className="space-y-4">
                    {posts.map(post => (
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
                            // Fix: Pass onLikeComment to PostCard
                            onLikeComment={onLikeComment}
                            onMediaClick={onMediaClick} 
                            onSetProfilePicture={isOwnProfile ? onUpdateAvatar : undefined}
                            isSaved={savedPhotos.some(p => p.id === post.id)}
                        />
                    ))}
                </div>
            ) : (
                <div className="bg-white p-8 rounded-lg shadow-sm text-center text-gray-500 border border-gray-100">
                    <div className="mb-2 text-lg font-semibold">لا توجد منشورات بعد</div>
                    <p>عندما يقوم {profileUser.name} بنشر تحديثات، ستظهر هنا.</p>
                </div>
            )}
        </div>
    </div>
  );
};

export default ProfilePosts;
