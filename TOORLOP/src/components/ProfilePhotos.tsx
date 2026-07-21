
import React, { useState, useRef, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { Plus, Image as ImageIcon, Pen, ArrowRight, Check } from 'lucide-react';
import { User, Photo, Album } from '../types';
import PrivacySelect, { PrivacyLevel } from './PrivacySelect';
import CreateAlbumModal from './CreateAlbumModal';
import PhotoLightbox from './PhotoLightbox';
import { useLanguage } from '../context/LanguageContext';

interface ProfilePhotosProps {
  currentUser: User;
  isOwnProfile: boolean;
  photos: Photo[];
  albums: Album[];
  onAddPhoto?: (photo: Photo) => void;
  onCreateAlbum?: (album: Album) => void;
  onAddPhotoToAlbum?: (albumId: string, photo: Photo) => void;
  onUpdateAvatar?: (url: string) => void;
  onDeletePhoto?: (photoId: string) => void;
  savedPhotos?: Photo[];
  onToggleSave?: (photo: Photo) => void;
  onLikePhoto?: (photoId: string, reactionType?: string) => void;
  onCommentPhoto?: (photoId: string, text: string) => void;
  onDeletePhotoComment?: (photoId: string, commentId: string) => void;
  onLikePhotoComment?: (photoId: string, commentId: string) => void;
}

type PhotoTab = 'your_photos' | 'tagged_photos' | 'albums';

const ProfilePhotos: React.FC<ProfilePhotosProps> = ({ 
  currentUser, 
  isOwnProfile, 
  photos, 
  albums,
  onAddPhoto,
  onCreateAlbum,
  onAddPhotoToAlbum,
  onUpdateAvatar,
  onDeletePhoto,
  savedPhotos = [],
  onToggleSave,
  onLikePhoto,
  onCommentPhoto,
  onDeletePhotoComment,
  onLikePhotoComment
}) => {
  const { t, language, dir } = useLanguage();
  const [activeTab, setActiveTab] = useState<PhotoTab>('your_photos');
  const [taggedPhotos] = useState<Photo[]>([]);

  const [viewingAlbum, setViewingAlbum] = useState<Album | null>(null);
  
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [lightboxIndex, setLightboxIndex] = useState(0);
  const [currentLightboxSource, setCurrentLightboxSource] = useState<Photo[]>([]);
  
  const [showCreateAlbumModal, setShowCreateAlbumModal] = useState(false);
  const [uploadPrivacy, setUploadPrivacy] = useState<PrivacyLevel>('public');
  const [copyFeedback, setCopyFeedback] = useState(false); 

  const mainInputRef = useRef<HTMLInputElement>(null);
  const addToAlbumInputRef = useRef<HTMLInputElement>(null); 

  useEffect(() => {
    if (viewingAlbum) {
      const updatedAlbum = albums.find(a => a.id === viewingAlbum.id);
      if (updatedAlbum) {
        setViewingAlbum(updatedAlbum);
      }
    }
  }, [albums, viewingAlbum?.id]);

  useEffect(() => {
      if (lightboxOpen) {
          if (activeTab === 'your_photos') {
              setCurrentLightboxSource(photos);
          } else if (viewingAlbum) {
              const album = albums.find(a => a.id === viewingAlbum.id);
              if (album) setCurrentLightboxSource(album.photos);
          }
      }
  }, [photos, albums, lightboxOpen, activeTab, viewingAlbum?.id]);

  // Helper to translate album titles dynamically
  const getAlbumTitle = (album: Album) => {
    if (album.type === 'profile') {
        return language === 'ar' ? 'صور الملف الشخصي' : 'Profile Pictures';
    }
    if (album.type === 'cover') {
        return language === 'ar' ? 'صور الغلاف' : 'Cover Photos';
    }
    return album.title;
  };

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
          id: `new_${Date.now()}_${i}`,
          url: base64,
          likes: 0,
          comments: [],
          isLiked: false
        };
        onAddPhoto(newPhoto);
      }
      setActiveTab('your_photos');
    }
  };

  const handleAddToAlbumFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
      if (e.target.files && e.target.files.length > 0 && viewingAlbum && onAddPhotoToAlbum) {
          for (let i = 0; i < e.target.files.length; i++) {
              const base64 = await readFileAsBase64(e.target.files[i]);
              const newPhoto: Photo = {
                  id: `album_add_${Date.now()}_${i}`,
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

  const openLightbox = (index: number, source: Photo[]) => {
    setCurrentLightboxSource(source);
    setLightboxIndex(index);
    setLightboxOpen(true);
  };

  const handleCreateAlbum = (newAlbum: Album) => {
    if (onCreateAlbum) {
        onCreateAlbum(newAlbum);
    }
    setShowCreateAlbumModal(false);
  };

  const handleAlbumClick = (album: Album) => {
    setViewingAlbum(album);
  };

  const renderPhotoGrid = (photosToRender: Photo[], emptyMessage: string) => {
    if (photosToRender.length === 0) {
      return (
        <div className="text-center py-20 bg-gray-50 dark:bg-gray-800/50 rounded-lg border-2 border-dashed border-gray-200 dark:border-gray-700 transition-colors duration-300">
          <ImageIcon className="w-16 h-16 mx-auto text-gray-300 dark:text-gray-600 mb-2" />
          <h3 className="text-xl font-bold text-gray-700 dark:text-gray-300">{emptyMessage}</h3>
        </div>
      );
    }

    return (
      <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
        {photosToRender.map((photo, idx) => (
          <div 
            key={photo.id} 
            onClick={() => openLightbox(idx, photosToRender)}
            className="relative group aspect-square bg-gray-100 dark:bg-gray-700 rounded-lg overflow-hidden cursor-pointer border border-gray-200 dark:border-gray-700"
          >
            <img src={photo.url} alt="User content" className="w-full h-full object-cover transition duration-300 group-hover:scale-105" />
            <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition duration-200 flex items-start justify-end p-2">
              <button className="p-1.5 bg-white/90 dark:bg-gray-800/90 hover:bg-white dark:hover:bg-gray-800 rounded-full text-gray-700 dark:text-gray-200 shadow-sm" onClick={(e) => e.stopPropagation()}>
                 <Pen className="w-4 h-4" />
              </button>
            </div>
          </div>
        ))}
      </div>
    );
  };

  const renderTabs = () => (
    <div className="flex items-center gap-1 md:gap-4 overflow-x-auto no-scrollbar mb-4 border-b border-gray-200 dark:border-gray-700 pb-2">
      <button
        onClick={() => setActiveTab('your_photos')}
        className={`px-4 py-2 font-semibold rounded-md transition whitespace-nowrap text-sm ${
          activeTab === 'your_photos' ? 'text-fb-blue bg-blue-50 dark:bg-blue-900/20' : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700'
        }`}
      >
        {t.profile_photos_your_photos}
      </button>
      <button
        onClick={() => setActiveTab('tagged_photos')}
        className={`px-4 py-2 font-semibold rounded-md transition whitespace-nowrap text-sm ${
          activeTab === 'tagged_photos' ? 'text-fb-blue bg-blue-50 dark:bg-blue-900/20' : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700'
        }`}
      >
        {t.profile_photos_tagged_photos}
      </button>
      <button
        onClick={() => setActiveTab('albums')}
        className={`px-4 py-2 font-semibold rounded-md transition whitespace-nowrap text-sm ${
          activeTab === 'albums' ? 'text-fb-blue bg-blue-50 dark:bg-blue-900/20' : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700'
        }`}
      >
        {t.profile_photos_albums}
      </button>
    </div>
  );

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-4 min-h-[500px] animate-fadeIn relative transition-colors duration-300" dir={dir}>
      <input type="file" multiple accept="image/*" className="hidden" ref={mainInputRef} onChange={handleMainUpload} />
      <input type="file" multiple accept="image/*" className="hidden" ref={addToAlbumInputRef} onChange={handleAddToAlbumFileSelect} />

      {copyFeedback && (
          <div className="fixed top-14 left-1/2 transform -translate-x-1/2 z-[350] bg-emerald-700 text-white px-4 py-2 rounded-md shadow-lg text-sm flex items-center gap-2 animate-fadeIn">
              <Check className="w-4 h-4" />
              {t.common_copied}
          </div>
      )}

      {!viewingAlbum && (
        <div className="flex items-center justify-between mb-4">
           <h2 className="text-xl font-bold text-gray-900 dark:text-white">{t.profile_photos}</h2>
           {isOwnProfile && (
              <div className="flex gap-3 items-center">
                 <PrivacySelect value={uploadPrivacy} onChange={setUploadPrivacy} small />
                 <button 
                  onClick={() => mainInputRef.current?.click()}
                  className="flex items-center gap-2 bg-fb-blue text-white px-3 py-1.5 rounded-md font-semibold text-sm hover:bg-blue-700 transition shadow-sm"
                 >
                    <Plus className="w-4 h-4" />
                    {t.profile_photos_add_photo}
                 </button>
              </div>
           )}
        </div>
      )}

      {viewingAlbum ? (
        <div className="animate-fadeIn">
          <div className="flex items-center gap-3 mb-4 pb-2 border-b border-gray-200 dark:border-gray-700">
             <button onClick={() => setViewingAlbum(null)} className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full transition text-gray-600 dark:text-gray-400">
                {dir === 'rtl' ? <ArrowRight className="w-6 h-6" /> : <ArrowRight className="w-6 h-6 rotate-180" />}
             </button>
             <div>
               <h3 className="font-bold text-lg text-gray-900 dark:text-white">{getAlbumTitle(viewingAlbum)}</h3>
               <span className="text-sm text-gray-500 dark:text-gray-400">{viewingAlbum.photos.length} {t.common_items || (language === 'ar' ? 'عنصر' : 'items')}</span>
             </div>
             {isOwnProfile && (
                <button 
                  onClick={() => addToAlbumInputRef.current?.click()} 
                  className="ms-auto bg-[#0F6E34] text-white px-4 py-2 rounded-md font-semibold text-sm hover:bg-blue-700 transition flex items-center gap-1 shadow-sm"
                >
                   <Plus className="w-4 h-4" />
                   {language === 'ar' ? 'إضافة إلى الألبوم' : 'Add to Album'}
                </button>
             )}
          </div>
          {renderPhotoGrid(viewingAlbum.photos, t.profile_photos_empty_album)}
        </div>
      ) : (
        <>
          {renderTabs()}
          <div className="mt-4">
            {activeTab === 'your_photos' && renderPhotoGrid(photos, t.profile_no_photos)}
            {activeTab === 'tagged_photos' && renderPhotoGrid(taggedPhotos, language === 'ar' ? 'لا توجد صور تمت الإشارة إليك فيها.' : 'No tagged photos found.')}
            {activeTab === 'albums' && (
               <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                 {isOwnProfile && (
                   <div 
                     onClick={() => setShowCreateAlbumModal(true)}
                     className="aspect-square bg-gray-50 dark:bg-gray-700/50 rounded-lg border-2 border-dashed border-gray-300 dark:border-gray-600 flex flex-col items-center justify-center cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700 transition group"
                   >
                     <div className="w-12 h-12 bg-white dark:bg-gray-600 rounded-full shadow-sm flex items-center justify-center mb-2 group-hover:scale-110 transition">
                       <Plus className="w-6 h-6 text-fb-blue" />
                     </div>
                     <span className="font-semibold text-fb-blue text-sm">{t.profile_photos_create_album}</span>
                   </div>
                 )}
           
                 {albums.map((album) => (
                   <div key={album.id} className="cursor-pointer group" onClick={() => handleAlbumClick(album)}>
                     <div className="aspect-square relative rounded-lg overflow-hidden border border-gray-200 dark:border-gray-700 mb-2 bg-gray-100 dark:bg-gray-700">
                        {album.coverUrl ? (
                             <img src={album.coverUrl} alt={getAlbumTitle(album)} className="w-full h-full object-cover group-hover:opacity-90 transition" />
                        ) : (
                             <div className="w-full h-full flex items-center justify-center text-gray-400">
                                 <ImageIcon className="w-10 h-10" />
                             </div>
                        )}
                        {album.type && album.type !== 'user' && (
                            <div className="absolute bottom-2 right-2 bg-black/60 text-white text-[10px] px-2 py-0.5 rounded-full backdrop-blur-sm">
                               {/* Dynamic Translation for Badge */}
                               {getAlbumTitle(album)}
                            </div>
                        )}
                        <div className="absolute inset-0 bg-black/10 opacity-0 group-hover:opacity-100 transition duration-200"></div>
                     </div>
                     <div className="px-1">
                        <h4 className="font-bold text-[15px] text-gray-900 dark:text-white group-hover:underline truncate">{getAlbumTitle(album)}</h4>
                        <span className="text-gray-500 dark:text-gray-400 text-xs">{album.photos.length} {t.common_items || (language === 'ar' ? 'عنصر' : 'items')}</span>
                     </div>
                   </div>
                 ))}
               </div>
            )}
          </div>
        </>
      )}

      {showCreateAlbumModal && (
        <CreateAlbumModal 
            onClose={() => setShowCreateAlbumModal(false)}
            onCreate={handleCreateAlbum}
        />
      )}

      {lightboxOpen && currentLightboxSource[lightboxIndex] && typeof document !== 'undefined' && createPortal(
        <PhotoLightbox 
            photos={currentLightboxSource}
            initialIndex={lightboxIndex}
            onClose={() => setLightboxOpen(false)}
            currentUser={currentUser}
            isOwnProfile={isOwnProfile}
            savedPhotos={savedPhotos}
            onToggleSave={onToggleSave}
            onLike={onLikePhoto}
            onComment={onCommentPhoto}
            onDeleteComment={onDeletePhotoComment}
            onLikeComment={onLikePhotoComment}
            onDeletePhoto={onDeletePhoto}
            onUpdateAvatar={onUpdateAvatar}
            /* Fix: Added missing viewingMedia prop to satisfy PhotoLightboxProps type requirement */
            viewingMedia={{ 
                url: currentLightboxSource[lightboxIndex].url, 
                type: 'image', 
                postId: currentLightboxSource[lightboxIndex].id 
            }}
        />,
        document.body
      )}

    </div>
  );
};

export default ProfilePhotos;
