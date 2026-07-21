
import { useState, useEffect } from 'react';
import { Post, User, Comment, VideoItem } from '../types';
import { initialPosts, generateId } from '../data/initialData';
import { formatDuration } from '../utils/formatters';
import { safeSetItem } from '../utils/safeStorage';

/* Fix: Implemented usePosts hook to manage feed state, persistence, and post interactions */
export const usePosts = (
  currentUser: User, 
  showNotification: (msg: string, type?: 'success' | 'info') => void,
  onPhotoAdd: (image: string, id: string, isFromPost: boolean) => void,
  onVideoAdd: (video: VideoItem, isFromPost: boolean) => void
) => {
  const [posts, setPosts] = useState<Post[]>(() => {
    const saved = localStorage.getItem('tourloop_main_posts');
    return saved ? JSON.parse(saved) : initialPosts;
  });

  /* Fix: Prune posts list to keep LocalStorage usage under quotas while persisting state */
  useEffect(() => {
    const prunedPosts = posts.slice(0, 15);
    safeSetItem('tourloop_main_posts', JSON.stringify(prunedPosts));
  }, [posts]);

  const handleCreatePost = (content: string, image?: string, skipPhotoAdd: boolean = false, forcedId?: string) => {
    const postId = forcedId || generateId();
    const newPost: Post = {
      id: postId,
      author: currentUser,
      content,
      image,
      timestamp: 'الآن',
      likes: 0,
      comments: [],
      shares: 0,
      isPinned: false
    };

    setPosts(prev => {
        const pinned = prev.filter(p => p.isPinned);
        const unpinned = prev.filter(p => !p.isPinned);
        return [...pinned, newPost, ...unpinned];
    });

    if (image && image.startsWith('data:video')) {
        const videoElement = document.createElement('video');
        videoElement.src = image;
        videoElement.preload = 'metadata';
        videoElement.onloadedmetadata = () => {
            const isReel = videoElement.videoHeight > videoElement.videoWidth;
            const newItem: VideoItem = {
                id: postId, 
                url: image,
                title: content ? content.substring(0, 50) : (isReel ? 'ريلز جديد' : 'فيديو جديد'),
                views: 0,
                timestamp: 'الآن',
                duration: formatDuration(videoElement.duration),
                type: isReel ? 'reel' : 'video',
                likes: 0,
                comments: [],
                isLiked: false
            };
            if (!skipPhotoAdd) onVideoAdd(newItem, true);
            videoElement.remove();
        };
        videoElement.onerror = () => {
            console.error('Failed to load video metadata for post');
            videoElement.remove();
        };
    } 
    else if (image && !skipPhotoAdd) {
        onPhotoAdd(image, postId, true); 
    }
    showNotification('تم نشر المنشور بنجاح');
  };

  const handleTogglePinPost = (postId: string) => {
    let statusText = '';
    setPosts(prev => {
        const updated = prev.map(post => {
            if (post.id === postId) {
                const newState = !post.isPinned;
                statusText = newState ? 'تم تثبيت المنشور في الأعلى 📌' : 'تم إلغاء تثبيت المنشور';
                return { ...post, isPinned: newState };
            }
            return post;
        });
        const pinned = updated.filter(p => p.isPinned);
        const unpinned = updated.filter(p => !p.isPinned);
        return [...pinned, ...unpinned];
    });
    if (statusText) showNotification(statusText);
  };

  const handleDeletePost = (postId: string) => {
    setPosts(prev => prev.filter(p => p.id !== postId));
    showNotification('تم حذف المنشور بنجاح', 'info');
  };

  const handlePostLike = (postId: string, reactionType?: string) => {
    setPosts(prev => prev.map(p => {
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
    }));
  };

  const handlePostComment = (postId: string, text: string, commentId?: string) => {
    const newComment: Comment = {
        id: commentId || generateId(),
        author: currentUser,
        content: text,
        timestamp: 'الآن',
        likes: 0
    };
    setPosts(prev => prev.map(p => 
        p.id === postId 
            ? { ...p, comments: [...p.comments, newComment] } 
            : p
    ));
  };

  const handleDeletePostComment = (postId: string, commentId: string) => {
    setPosts(prev => prev.map(p => 
        p.id === postId 
            ? { ...p, comments: p.comments.filter(c => c.id !== commentId) } 
            : p
    ));
    showNotification('تم حذف التعليق', 'info');
  };

  const handleLikePostComment = (postId: string, commentId: string) => {
    setPosts(prev => prev.map(p => {
        if (p.id === postId) {
            return {
                ...p,
                comments: p.comments.map(c => 
                    c.id === commentId 
                        ? { ...c, isLiked: !c.isLiked, likes: (c.likes || 0) + (c.isLiked ? -1 : 1) } 
                        : c
                )
            };
        }
        return p;
    }));
  };

  return {
    posts,
    setPosts,
    handleCreatePost,
    handleTogglePinPost,
    handleDeletePost,
    handlePostLike,
    handlePostComment,
    handleDeletePostComment,
    handleLikePostComment
  };
};
