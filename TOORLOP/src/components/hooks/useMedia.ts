import { useState } from 'react';
import { User, Photo, Album, VideoItem, Post, Comment } from '../types';
import { initialYourPhotos, initialAlbums, generateId } from '../data/initialData';
import { playAudio } from '../utils/audio';

/* Fix: Implemented useMedia hook to centralize media state management and shared interactions */
export const useMedia = (
  currentUser: User,
  showNotification: (msg: string, type?: 'success' | 'info' | 'error') => void,
  handleCreatePost: (content: string, image?: string, skipPhotoAdd?: boolean, forcedId?: string) => void
) => {
  const [yourPhotos, setYourPhotos] = useState<Photo[]>(initialYourPhotos);
  const [albums, setAlbums] = useState<Album[]>(initialAlbums);
  const [savedPhotos, setSavedPhotos] = useState<Photo[]>([]);
  const [savedVideos, setSavedVideos] = useState<VideoItem[]>([]);
  const [userVideos, setUserVideos] = useState<VideoItem[]>([]);
  const [savedPosts, setSavedPosts] = useState<Post[]>([]);

  const handleUpdateProfilePhoto = (newUrl: string) => {
    const photoId = `profile_${generateId()}`;
    const newPhoto: Photo = {
        id: photoId,
        url: newUrl,
        likes: 0,
        comments: [],
        isLiked: false,
        description: 'تحديث صورة الملف الشخصي'
    };
    setYourPhotos(prev => [newPhoto, ...prev]);
    setAlbums(prevAlbums => prevAlbums.map(album => {
        if (album.type === 'profile') {
            return { ...album, coverUrl: newUrl, photos: [newPhoto, ...album.photos] };
        }
        return album;
    }));
    handleCreatePost(`قام ${currentUser.name} بتحديث صورة الملف الشخصي.`, newUrl, true, photoId);
    showNotification('تم تحديث صورة الملف الشخصي بنجاح');
  };

  const handleUpdateCoverPhoto = (newUrl: string) => {
    const photoId = `cover_${generateId()}`;
    const newPhoto: Photo = {
        id: photoId,
        url: newUrl,
        likes: 0,
        comments: [],
        isLiked: false,
        description: 'تحديث صورة الغلاف'
    };
    setYourPhotos(prev => [newPhoto, ...prev]);
    setAlbums(prevAlbums => prevAlbums.map(album => {
        if (album.type === 'cover') {
            return { ...album, coverUrl: newUrl, photos: [newPhoto, ...album.photos] };
        }
        return album;
    }));
    handleCreatePost(`قام ${currentUser.name} بتحديث صورة الغلاف.`, newUrl, true, photoId);
    showNotification('تم تحديث صورة الغلاف بنجاح');
  };

  const handleAddGenericPhoto = (photo: Photo, isFromPost: boolean = false) => {
      setYourPhotos(prev => [photo, ...prev]);
      if (!isFromPost) {
          handleCreatePost('', photo.url, true, photo.id);
      }
      showNotification('تم إضافة الصورة بنجاح');
  };

  const handleCreateAlbum = (newAlbum: Album) => {
      setAlbums(prev => [newAlbum, ...prev]);
      setYourPhotos(prev => [...newAlbum.photos, ...prev]);
      handleCreatePost(`قام ${currentUser.name} بإنشاء ألبوم جديد: ${newAlbum.title}`, newAlbum.coverUrl, true, newAlbum.id);
      showNotification('تم إنشاء الألبوم بنجاح');
  };

  const handleAddPhotoToSpecificAlbum = (albumId: string, photo: Photo, isFromPost: boolean = false) => {
      setAlbums(prev => prev.map(album => {
          if (album.id === albumId) {
              return { ...album, photos: [photo, ...album.photos], coverUrl: photo.url };
          }
          return album;
      }));
      setYourPhotos(prev => [photo, ...prev]);
      if (!isFromPost) {
          handleCreatePost('', photo.url, true, photo.id);
      }
      showNotification('تم إضافة الصورة إلى الألبوم');
  };

  const handleDeletePhoto = (photoId: string) => {
      setYourPhotos(prev => prev.filter(p => p.id !== photoId));
      setAlbums(prev => prev.map(album => ({
          ...album,
          photos: album.photos.filter(p => p.id !== photoId)
      })));
      setSavedPhotos(prev => prev.filter(p => p.id !== photoId));
      // Fixed: Notification removed to allow App.tsx to handle it centrally
  };

  const handleToggleSaveVideo = (video: VideoItem) => {
      const exists = savedVideos.find(v => v.id === video.id);
      if (exists) {
          setSavedVideos(prev => prev.filter(v => v.id !== video.id));
          showNotification('تمت إزالة الفيديو من العناصر المحفوظة', 'info');
      } else {
          setSavedVideos(prev => [video, ...prev]);
          showNotification('تم حفظ الفيديو في العناصر المحفوظة');
      }
  };

  const handleToggleSave = (item: any) => {
      if (!item) return;
      
      if (item && 'duration' in item && 'url' in item && !('author' in item)) {
          handleToggleSaveVideo(item as VideoItem);
          return;
      }

      if (item && 'author' in item) {
          const post = item as Post;
          const isSaved = savedPosts.some(p => p.id === post.id) || 
                          savedPhotos.some(p => p.id === post.id) || 
                          savedVideos.some(v => v.id === post.id);

          if (isSaved) {
              setSavedPosts(prev => prev.filter(p => p.id !== post.id));
              setSavedPhotos(prev => prev.filter(p => p.id !== post.id));
              setSavedVideos(prev => prev.filter(v => v.id !== post.id));
              showNotification('تمت إزالة العنصر من المحفوظات', 'info');
          } else {
              if (post.image) {
                  const isVideo = post.image.startsWith('data:video') || post.image.endsWith('.mp4') || post.image.endsWith('.webm');
                  if (isVideo) {
                      const videoItem: VideoItem = {
                          id: post.id,
                          url: post.image,
                          title: post.content ? post.content.substring(0, 50) : 'فيديو محفوظ',
                          views: 0,
                          timestamp: post.timestamp,
                          duration: '0:00',
                          type: 'video',
                          likes: post.likes,
                          comments: post.comments,
                          isLiked: post.isLiked,
                          reaction: post.reaction, 
                          isSaved: true
                      };
                      setSavedVideos(prev => [videoItem, ...prev]);
                  } else {
                      const photo: Photo = {
                          id: post.id,
                          url: post.image,
                          likes: post.likes,
                          comments: post.comments,
                          description: post.content,
                          isLiked: post.isLiked,
                          reaction: post.reaction, 
                          isSaved: true
                      };
                      setSavedPhotos(prev => [photo, ...prev]);
                  }
              } else {
                  setSavedPosts(prev => [post, ...prev]);
              }
              showNotification('تم حفظ العنصر في المحفوظات');
          }
          return;
      }

      if (item && 'url' in item) {
          const photo = item as Photo;
          const exists = savedPhotos.find(p => p.id === photo.id);
          if (exists) {
              setSavedPhotos(prev => prev.filter(p => p.id !== photo.id));
              showNotification('تمت إزالة الصورة من المحفوظات', 'info');
          } else {
              setSavedPhotos(prev => [photo, ...prev]);
              showNotification('تم حفظ الصورة في المحفوظات');
          }
      }
  };

  const handleAddVideoDirectly = (video: VideoItem, isFromPost: boolean = false) => {
    setUserVideos(prev => [video, ...prev]);
    if (!isFromPost) {
        handleCreatePost('', video.url, true, video.id);
    }
    showNotification('تم إضافة الفيديو بنجاح');
  };

  const handleDeleteVideo = (videoId: string) => {
      setUserVideos(prev => prev.filter(v => v.id !== videoId));
      setSavedVideos(prev => prev.filter(v => v.id !== videoId));
      // Fixed: Notification removed to allow App.tsx to handle it centrally
  };

  const handlePhotoLike = (photoId: string, reactionType?: string) => {
    // Added: Trigger audio feedback
    if (reactionType) {
        playAudio('react');
    } else {
        playAudio('like');
    }

    const updater = (p: Photo) => {
        if (p.id !== photoId) return p;
        const isRemoving = p.isLiked && (!reactionType || reactionType === p.reaction);
        return { 
            ...p, 
            isLiked: !isRemoving,
            reaction: isRemoving ? undefined : (reactionType || 'like'),
            likes: isRemoving ? Math.max(0, p.likes - 1) : (p.isLiked ? p.likes : p.likes + 1)
        };
    };
    setYourPhotos(prev => prev.map(updater));
    setSavedPhotos(prev => prev.map(updater));
    setAlbums(prev => prev.map(album => ({
        ...album,
        photos: album.photos.map(updater)
    })));
  };

  const handlePhotoComment = (photoId: string, text: string, commentId?: string) => {
    // Added: Trigger audio feedback
    playAudio('comment');

    const newComment = {
        id: commentId || generateId(),
        author: currentUser,
        content: text,
        timestamp: 'الآن',
        likes: 0,
        isLiked: false
    };
    const updater = (p: Photo) => p.id === photoId ? { ...p, comments: [...p.comments, newComment] } : p;
    setYourPhotos(prev => prev.map(updater));
    setSavedPhotos(prev => prev.map(updater));
    setAlbums(prev => prev.map(album => ({
        ...album,
        photos: album.photos.map(updater)
    })));
  };

  const handleDeletePhotoComment = (photoId: string, commentId: string) => {
    const updater = (p: Photo) => p.id === photoId ? { ...p, comments: p.comments.filter(c => c.id !== commentId) } : p;
    setYourPhotos(prev => prev.map(updater));
    setSavedPhotos(prev => prev.map(updater));
    setAlbums(prev => prev.map(album => ({
        ...album,
        photos: album.photos.map(updater)
    })));
  };

  const handleLikePhotoComment = (photoId: string, commentId: string) => {
    // Added: Trigger audio feedback
    playAudio('like');

    const updater = (p: Photo) => {
        if (p.id !== photoId) return p;
        return {
            ...p,
            comments: p.comments.map(c => c.id === commentId ? { ...c, isLiked: !c.isLiked, likes: (c.likes || 0) + (c.isLiked ? -1 : 1) } : c)
        };
    };
    setYourPhotos(prev => prev.map(updater));
    setSavedPhotos(prev => prev.map(updater));
    setAlbums(prev => prev.map(album => ({ ...album, photos: album.photos.map(updater) })));
  };

  const handleVideoLike = (videoId: string, reactionType?: string) => {
    // Added: Trigger audio feedback
    if (reactionType) {
        playAudio('react');
    } else {
        playAudio('like');
    }

    const updater = (v: VideoItem) => {
        if (v.id !== videoId) return v;
        const isRemoving = v.isLiked && (!reactionType || reactionType === v.reaction);
        return { 
            ...v, 
            isLiked: !isRemoving,
            reaction: isRemoving ? undefined : (reactionType || 'like'),
            likes: isRemoving ? Math.max(0, v.likes - 1) : (v.isLiked ? v.likes : v.likes + 1)
        };
    };
    setUserVideos(prev => prev.map(updater));
    setSavedVideos(prev => prev.map(updater));
  };

  const handleVideoComment = (videoId: string, text: string, commentId?: string) => {
    // Added: Trigger audio feedback
    playAudio('comment');

    const newComment = {
        id: commentId || generateId(),
        author: currentUser,
        content: text,
        timestamp: 'الآن',
        likes: 0,
        isLiked: false
    };
    const updater = (v: VideoItem) => v.id === videoId ? { ...v, comments: [...v.comments, newComment] } : v;
    setUserVideos(prev => prev.map(updater));
    setSavedVideos(prev => prev.map(updater));
  };

  const handleDeleteVideoComment = (videoId: string, commentId: string) => {
    const updater = (v: VideoItem) => v.id === videoId ? { ...v, comments: v.comments.filter(c => c.id !== commentId) } : v;
    setUserVideos(prev => prev.map(updater));
    setSavedVideos(prev => prev.map(updater));
  };

  const handleLikeVideoComment = (videoId: string, commentId: string) => {
    // Added: Trigger audio feedback
    playAudio('like');
    
    const updater = (v: VideoItem) => {
        if (v.id !== videoId) return v;
        return {
            ...v,
            comments: v.comments.map(c => c.id === commentId ? { ...c, isLiked: !c.isLiked, likes: (c.likes || 0) + (c.isLiked ? -1 : 1) } : c)
        };
    };
    setUserVideos(prev => prev.map(updater));
    setSavedVideos(prev => prev.map(updater));
  };

  return {
    yourPhotos, setYourPhotos,
    albums, setAlbums,
    savedPhotos, setSavedPhotos,
    savedVideos, setSavedVideos,
    userVideos, setUserVideos,
    savedPosts, setSavedPosts,
    handleUpdateProfilePhoto,
    handleUpdateCoverPhoto,
    handleAddGenericPhoto,
    handleCreateAlbum,
    handleAddPhotoToSpecificAlbum,
    handleDeletePhoto,
    handleToggleSaveVideo,
    handleToggleSave,
    handleAddVideoDirectly,
    handleDeleteVideo,
    handlePhotoLike,
    handlePhotoComment,
    handleDeletePhotoComment,
    handleLikePhotoComment,
    handleVideoLike,
    handleVideoComment,
    handleDeleteVideoComment,
    handleLikeVideoComment
  };
};