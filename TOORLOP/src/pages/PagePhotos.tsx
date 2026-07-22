
import React, { useState, useRef, useEffect, useMemo } from 'react';
import { createPortal } from 'react-dom';
import { Plus, Image as ImageIcon, Pen, ArrowRight, ArrowLeft, Check, Camera, Video, Play, X, MoreHorizontal } from 'lucide-react';
import { User, Photo, Album, Page } from '../types';
import PrivacySelect, { PrivacyLevel } from '../components/PrivacySelect';
import CreateAlbumModal from '../components/CreateAlbumModal';
import { useLanguage } from '../context/LanguageContext';
import PageMediaLightbox from '../pages/PageMediaLightbox';

interface PagePhotosProps {
  currentUser: User;
  isPageAdmin: boolean;
  photos: Photo[];
  albums: Album[];
  onAddPhoto?: (photo: Photo) => void;
  onCreateAlbum?: (album: Album) => void;
  onAddPhotoToAlbum?: (albumId: string, photo: Photo) => void;
  onViewMedia: (url: string, type: 'image' | 'video', postId?: string) => void;
  onLike?: (id: string, reactionType?: string) => void;
  onComment?: (id: string, text: string) => void;
  onDeleteComment?: (id: string, commentId: string) => void;
  onLikeComment?: (id: string, commentId: string) => void;
  onDeletePost?: (id: string) => void;
  onToggleSave?: (item: any) => void;
  onTogglePin?: (id: string) => void;
  onUpdateAvatar?: (url: string) => void;
  viewingPage: Page;
}

type PhotoTab = 'page_photos' | 'tagged_photos' | 'albums';

const PagePhotos: React.FC<PagePhotosProps> = ({ 
  currentUser, 
  isPageAdmin, 
  photos, 
  albums, 
  onAddPhoto,
  onCreateAlbum,
  onAddPhotoToAlbum,
  onViewMedia,
  onLike,
  onComment,
  onDeleteComment,
  onLikeComment,
  onDeletePost,
  onToggleSave,
  onTogglePin,
  onUpdateAvatar,
  viewingPage
}) => {
  const { t, language, dir } = useLanguage();
  const [activeTab, setActiveTab] = useState<PhotoTab>('page_photos');
  const [viewingAlbum, setViewingAlbum] = useState<Album | null>(null);
  const [showCreateAlbumModal, setShowCreateAlbumModal] = useState(false);
  const [uploadPrivacy, setUploadPrivacy] = useState<PrivacyLevel>('public');

  // Local Lightbox State
  const [isLightboxOpen, setIsLightboxOpen] = useState(false);
  const [activeMediaIndex, setActiveMediaIndex] = useState(0);
  const [currentLightboxList, setCurrentLightboxList] = useState<any[]>([]);
  
  // Comment input state for Lightbox
  const [mediaCommentInput, setMediaCommentInput] = useState('');

  const mainInputRef = useRef<HTMLInputElement>(null);
  const addToAlbumInputRef = useRef<HTMLInputElement>(null);
  const mediaCommentsEndRef = useRef<HTMLDivElement>(null);

  // Group albums by type for categorized display (order preservation)
  const profileAlbums = useMemo(() => albums.filter(a => a.type === 'profile'), [albums]);
  const coverAlbums = useMemo(() => albums.filter(a => a.type === 'cover'), [albums]);
  const otherAlbums = useMemo(() => albums.filter(a => a.type !== 'profile' && a.type !== 'cover'), [albums]);

  useEffect(() => {
    if (viewingAlbum) {
      const updatedAlbum = albums.find(a => a.id === viewingAlbum.id);
      if (updatedAlbum) {
        setViewingAlbum(updatedAlbum);
      }
    }
  }, [albums, viewingAlbum?.id]);

  const readFileAsBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = error => reject(error);
    });
  };

  const handleMainUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0 && onAddPhoto) {
      for (let i = 0; i < e.target.files.length; i++) {
        const base64 = await readFileAsBase64(e.target.files[i]);
        const newPhoto: Photo = {
          id: `page_photo_${Date.now()}_${i}`,
          url: base64,
          likes: 0,
          comments: [],
          isLiked: false
        };
        onAddPhoto(newPhoto);
      }
      setActiveTab('page_photos');
    }
    e.target.value = '';
  };

  const handleAddToAlbumFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
      if (e.target.files && e.target.files.length > 0 && viewingAlbum && onAddPhotoToAlbum) {
          for (let i = 0; i < e.target.files.length; i++) {
              const base64 = await readFileAsBase64(e.target.files[i]);
              const newPhoto: Photo = {
                  id: `page_album_add_${Date.now()}_${i}`,
                  url: base64,
                  likes: 0,
                  comments: [],
                  isLiked: false
              };
              onAddPhotoToAlbum(viewingAlbum.id, newPhoto);
          }
      }
      e.target.value = ''; 
  };

  const handleCreateAlbum = (newAlbum: Album) => {
    if (onCreateAlbum) {
        onCreateAlbum(newAlbum);
    }
    setShowCreateAlbumModal(false);
  };

  const getAlbumTitle = (album: Album) => {
    if (album.type === 'profile') {
        return language === 'ar' ? 'صور الصفحة الشخصية' : 'Profile Albums';
    }
    if (album.type === 'cover') {
        return language === 'ar' ? 'صور الغلاف' : 'Cover Albums';
    }
    return album.title;
  };

  // Local Lightbox Handlers
  const handlePhotoClick = (index: number, photosList: Photo[]) => {
      const formattedList = photosList.map(p => ({
          url: p.url,
          type: 'image',
          post: {
              id: p.id,
              // Use viewingPage to ensure correct Author info in lightbox
              author: { 
                id: viewingPage.id, 
                name: viewingPage.name, 
                avatar: viewingPage.avatar, 
                online: true 
              },
              content: p.description || '',
              image: p.url,
              timestamp: p.timestamp || 'Now',
              likes: p.likes,
              comments: p.comments,
              shares: 0,
              isPinned: false,
              isLiked: p.isLiked,
              reaction: p.reaction,
              isSaved: false
          }
      }));

      setCurrentLightboxList(formattedList);
      setActiveMediaIndex(index);
      setIsLightboxOpen(true);
      setMediaCommentInput(''); // Reset input when opening new photo
  };

  const handleNextMedia = (e: React.MouseEvent) => {
      e.stopPropagation();
      setActiveMediaIndex((prev) => (prev + 1) % currentLightboxList.length);
  };

  const handlePrevMedia = (e: React.MouseEvent) => {
      e.stopPropagation();
      setActiveMediaIndex((prev) => (prev - 1 + currentLightboxList.length) % currentLightboxList.length);
  };

  const activeLightboxItem = currentLightboxList[activeMediaIndex];

  // Look up fresh data to ensure likes/comments are synced with main state
  const getFreshPostData = () => {
      if (!activeLightboxItem) return null;
      const id = activeLightboxItem.post.id;
      
      // 1. Try finding in the main photos prop (for 'page_photos' tab - usually feed posts)
      let freshPhoto = photos.find(p => p.id === id);
      
      // 2. If not found, try finding in the currently viewing album
      if (!freshPhoto && viewingAlbum) {
          freshPhoto = viewingAlbum.photos.find(p => p.id === id);
      }

      // 3. IMPORTANT: If still not found, search ALL albums to ensure sync across all views (Profile/Cover/Custom)
      if (!freshPhoto) {
          for (const album of albums) {
             const found = album.photos.find(p => p.id === id);
             if (found) {
                 freshPhoto = found;
                 break;
             }
          }
      }

      if (freshPhoto) {
          return {
              ...activeLightboxItem.post,
              likes: freshPhoto.likes,
              isLiked: freshPhoto.isLiked,
              comments: freshPhoto.comments,
              reaction: freshPhoto.reaction
          };
      }
      
      return activeLightboxItem.post;
  };

  const syncedPost = getFreshPostData();

  // Handlers for Lightbox interactions
  const handleMediaLike = (reactionType?: string) => {
      if (onLike && syncedPost) {
          onLike(syncedPost.id, reactionType);
      }
  };

  const handleMediaComment = (text: string) => {
      if (onComment && syncedPost) {
          onComment(syncedPost.id, text);
          setMediaCommentInput('');
      }
  };

  const handleMediaDeleteComment = (commentId: string) => {
      if (onDeleteComment && syncedPost) {
          onDeleteComment(syncedPost.id, commentId);
      }
  };

  const handleMediaLikeComment = (commentId: string) => {
      if (onLikeComment && syncedPost) {
          onLikeComment(syncedPost.id, commentId);
      }
  };

  const handleMediaDeletePost = () => {
      if (onDeletePost && syncedPost) {
          onDeletePost(syncedPost.id);
          setIsLightboxOpen(false);
      }
  };

  const handleMediaToggleSave = () => {
      if (onToggleSave && syncedPost) {
          onToggleSave(syncedPost);
      }
  };

  const handleMediaTogglePin = () => {
      if (onTogglePin && syncedPost) {
          onTogglePin(syncedPost.id);
      }
  };

  const handleMediaUpdateAvatar = (url: string) => {
      if (onUpdateAvatar) {
          onUpdateAvatar(url);
          setIsLightboxOpen(false);
      }
  };

  const renderPhotoGrid = (photosToRender: Photo[], emptyMessage: string) => {
    if (photosToRender.length === 0) {
      return (
        <div className="text-center py-20 bg-gray-50/50 dark:bg-gray-800/50 rounded-2xl border-2 border-dashed border-gray-200 dark:border-gray-700 animate-fadeIn">
          <ImageIcon className="w-16 h-16 mx-auto text-gray-300 dark:text-gray-600 mb-2" />
          <h3 className="text-xl font-bold text-gray-400 dark:text-gray-500">{emptyMessage}</h3>
        </div>
      );
    }

    return (
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 animate-fadeIn">
        {photosToRender.map((photo, idx) => (
          <div 
            key={photo.id} 
            onClick={() => handlePhotoClick(idx, photosToRender)}
            className="relative group aspect-square bg-gray-100 dark:bg-gray-700 rounded-xl overflow-hidden cursor-pointer border border-gray-200 dark:border-gray-700 shadow-sm hover:shadow-md transition-all duration-300"
          >
            {photo.url ? (
                <img src={photo.url} alt="Page content" className="w-full h-full object-cover transition duration-500 group-hover:scale-110" />
            ) : (
                <div className="w-full h-full flex items-center justify-center text-gray-400 bg-gray-200 dark:bg-gray-600">
                    <ImageIcon className="w-8 h-8 opacity-50" />
                </div>
            )}
            <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition duration-300 flex items-start justify-end p-2">
              <div className="p-1.5 bg-white/90 dark:bg-gray-800/90 rounded-full text-fb-blue shadow-sm">
                 <ImageIcon className="w-4 h-4" />
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  };

  const renderAlbumCard = (album: Album) => {
    const coverImage = album.coverUrl || (album.photos.length > 0 ? album.photos[0].url : null);

    return (
      <div key={album.id} className="cursor-pointer group flex flex-col" onClick={() => setViewingAlbum(album)}>
        <div className="aspect-square relative rounded-2xl overflow-hidden border border-gray-200 dark:border-gray-700 mb-3 bg-gray-100 dark:bg-gray-700 shadow-sm">
          {coverImage ? (
            <img src={coverImage} alt={album.title} className="w-full h-full object-cover transition duration-700 group-hover:scale-110" />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-gray-400">
              <ImageIcon className="w-12 h-12 opacity-30" />
            </div>
          )}
          <div className="absolute inset-0 bg-black/10 opacity-0 group-hover:opacity-100 transition-all duration-300"></div>
          <div className="absolute bottom-3 right-3 bg-black/60 text-white text-[10px] font-bold px-2 py-1 rounded-lg backdrop-blur-md border border-white/10">
            {album.photos.length} {t.common_items || (language === 'ar' ? 'عنصر' : 'items')}
          </div>
        </div>
        <div className="px-1 text-start">
          <h4 className="font-bold text-gray-900 dark:text-white group-hover:text-fb-blue transition truncate">{getAlbumTitle(album)}</h4>
          <p className="text-[11px] text-gray-500 font-medium">
            {album.type === 'profile' ? (language === 'ar' ? 'صور الصفحة' : 'Page Photos') 
              : album.type === 'cover' ? (language === 'ar' ? 'صور الغلاف' : 'Cover Photos')
              : (language === 'ar' ? 'ألبوم مخصص' : 'Custom Album')}
          </p>
        </div>
      </div>
    );
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm p-4 md:p-6 transition-colors duration-300">
      <input type="file" multiple accept="image/*" className="hidden" ref={mainInputRef} onChange={handleMainUpload} />
      <input type="file" multiple accept="image/*" className="hidden" ref={addToAlbumInputRef} onChange={handleAddToAlbumFileSelect} />

      {!viewingAlbum ? (
        <>
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-6 gap-4">
             <h2 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
                <ImageIcon className="w-6 h-6 text-fb-blue" />
                {language === 'ar' ? 'صور الصفحة' : 'Page Photos'}
             </h2>
             {isPageAdmin && activeTab === 'page_photos' && (
                <div className="flex gap-2 items-center w-full sm:w-auto">
                   <PrivacySelect value={uploadPrivacy} onChange={setUploadPrivacy} small />
                   <button 
                    onClick={() => mainInputRef.current?.click()}
                    className="flex-1 sm:flex-none flex items-center justify-center gap-2 bg-fb-blue text-white px-4 py-2 rounded-lg font-bold text-sm hover:bg-blue-700 transition shadow-md active:scale-95"
                   >
                      <Plus className="w-4 h-4" />
                      {t.profile_photos_add_photo}
                   </button>
                </div>
             )}
          </div>

          <div className="flex items-center gap-2 mb-6 border-b border-gray-100 dark:border-gray-700 pb-2 overflow-x-auto no-scrollbar">
            <button
              onClick={() => setActiveTab('page_photos')}
              className={`px-5 py-2.5 font-bold rounded-lg transition whitespace-nowrap text-sm ${
                activeTab === 'page_photos' ? 'text-fb-blue bg-blue-50 dark:bg-emerald-900/10' : 'text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-700'
              }`}
            >
              {language === 'ar' ? 'كل الصور' : 'All Photos'}
            </button>
            <button
              onClick={() => setActiveTab('tagged_photos')}
              className={`px-10 py-2.5 font-bold rounded-lg transition whitespace-nowrap text-sm ${
                activeTab === 'tagged_photos' ? 'text-fb-blue bg-blue-50 dark:bg-emerald-900/10' : 'text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-700'
              }`}
            >
              {language === 'ar' ? 'تمت الإشارة فيها' : 'Tagged Photos'}
            </button>
            <button
              onClick={() => setActiveTab('albums')}
              className={`px-10 py-2.5 font-bold rounded-lg transition whitespace-nowrap text-sm ${
                activeTab === 'albums' ? 'text-fb-blue bg-blue-50 dark:bg-emerald-900/10' : 'text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-700'
              }`}
            >
              {t.profile_photos_albums}
            </button>
          </div>

          <div className="mt-4">
            {activeTab === 'page_photos' && renderPhotoGrid(photos, language === 'ar' ? 'لا توجد صور في هذه الصفحة بعد.' : 'No photos in this page yet.')}
            {activeTab === 'tagged_photos' && renderPhotoGrid([], language === 'ar' ? 'لا توجد صور تمت الإشارة فيها للصفحة.' : 'No tagged photos found.')}
            {activeTab === 'albums' && (
               <div className="grid grid-cols-2 md:grid-cols-4 gap-12 animate-fadeIn">
                 {isPageAdmin && (
                    <div 
                      onClick={() => setShowCreateAlbumModal(true)}
                      className="aspect-square bg-gray-50 dark:bg-gray-700/30 rounded-2xl border-2 border-dashed border-gray-300 dark:border-gray-600 flex flex-col items-center justify-center cursor-pointer hover:border-fb-blue transition group hover:bg-white dark:hover:bg-gray-700"
                    >
                      <div className="w-12 h-12 bg-white dark:bg-gray-600 rounded-full shadow-sm flex items-center justify-center mb-3 group-hover:scale-110 transition duration-300">
                        <Plus className="w-6 h-6 text-fb-blue" />
                      </div>
                      <span className="font-bold text-fb-blue text-sm">{t.profile_photos_create_album}</span>
                    </div>
                 )}

                 {/* All Albums in One Grid (Profile, Cover, and Other) */}
                 {profileAlbums.map(renderAlbumCard)}
                 {coverAlbums.map(renderAlbumCard)}
                 {otherAlbums.map(renderAlbumCard)}
               </div>
            )}
          </div>
        </>
      ) : (
        <div className="animate-fadeIn">
          <div className="flex items-center gap-4 mb-8 pb-4 border-b border-gray-100 dark:border-gray-700">
             <button onClick={() => setViewingAlbum(null)} className="p-2.5 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 rounded-full transition text-gray-700 dark:text-gray-200 shadow-sm">
                {dir === 'rtl' ? <ArrowRight className="w-5 h-5" /> : <ArrowLeft className="w-5 h-5" />}
             </button>
             <div className="flex-1 min-w-0">
               <h3 className="font-bold text-xl text-gray-900 dark:text-white truncate">{getAlbumTitle(viewingAlbum)}</h3>
               <span className="text-sm text-gray-500 font-medium">{viewingAlbum.photos.length} {language === 'ar' ? 'صورة' : 'photos'}</span>
             </div>
             {isPageAdmin && (
                <button 
                  onClick={() => addToAlbumInputRef.current?.click()} 
                  className="bg-fb-blue text-white px-4 py-2 rounded-lg font-bold text-sm hover:bg-blue-700 transition flex items-center gap-2 shadow-md active:scale-95"
                >
                   <Plus className="w-4 h-4" />
                   {language === 'ar' ? 'إضافة للصور' : 'Add Photos'}
                </button>
             )}
          </div>
          {renderPhotoGrid(viewingAlbum.photos, language === 'ar' ? 'هذا الألبوم لا يحتوي على صور بعد.' : 'This album is empty.')}
        </div>
      )}

      {showCreateAlbumModal && (
        <CreateAlbumModal 
            onClose={() => setShowCreateAlbumModal(false)}
            onCreate={handleCreateAlbum}
        />
      )}

      {/* Local Lightbox for Scoped Navigation */}
      {isLightboxOpen && syncedPost && typeof document !== 'undefined' && createPortal(
        <PageMediaLightbox 
            viewingPage={viewingPage} 
            activeMediaIndex={activeMediaIndex}
            lightboxType="photos"
            mediaList={currentLightboxList}
            currentUser={currentUser}
            mediaLikes={syncedPost.likes || 0} 
            isMediaLiked={syncedPost.isLiked || false} 
            mediaReaction={syncedPost.reaction}
            mediaComments={syncedPost.comments || []}
            mediaCommentInput={mediaCommentInput}
            setMediaCommentInput={setMediaCommentInput}
            onClose={() => setIsLightboxOpen(false)} 
            onNext={(e) => handleNextMedia(e)} 
            onPrev={(e) => handlePrevMedia(e)}
            onToggleLike={handleMediaLike}
            onPostComment={handleMediaComment}
            onDeleteComment={handleMediaDeleteComment}
            onLikeComment={handleMediaLikeComment}
            onDeletePost={handleMediaDeletePost}
            onToggleSave={handleMediaToggleSave}
            onTogglePin={handleMediaTogglePin}
            onUpdateAvatar={handleMediaUpdateAvatar}
            viewingPost={syncedPost}
            onShare={() => {}}
            commentsEndRef={mediaCommentsEndRef}
        />,
        document.body
      )}
    </div>
  );
};

export default PagePhotos;
