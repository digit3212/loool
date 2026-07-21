import React, { useState, useRef } from 'react';
import { createPortal } from 'react-dom';
import { X, Upload } from 'lucide-react';
import { Album, Photo } from '../types';
import { useLanguage } from '../context/LanguageContext';

interface CreateAlbumModalProps {
  onClose: () => void;
  onCreate: (album: Album) => void;
}

const CreateAlbumModal: React.FC<CreateAlbumModalProps> = ({ onClose, onCreate }) => {
  const { t, language, dir } = useLanguage();
  const [newAlbumTitle, setNewAlbumTitle] = useState('');
  const [newAlbumFiles, setNewAlbumFiles] = useState<string[]>([]);
  const albumInputRef = useRef<HTMLInputElement>(null);

  const readFileAsBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = error => reject(error);
    });
  };

  const handleAlbumFilesSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const promises = Array.from(e.target.files).map((file) => readFileAsBase64(file as File));
      const results = await Promise.all(promises);
      setNewAlbumFiles(prev => [...prev, ...results]);
    }
  };

  const handleCreateAlbum = () => {
    if (!newAlbumTitle.trim()) return;

    const albumPhotos: Photo[] = newAlbumFiles.map((url, i) => ({
      id: `album_new_${Date.now()}_${i}`,
      url: url,
      likes: 0,
      comments: [],
      isLiked: false
    }));

    const newAlbum: Album = {
      id: Date.now().toString(),
      title: newAlbumTitle,
      coverUrl: albumPhotos.length > 0 ? albumPhotos[0].url : '', 
      type: 'user',
      photos: albumPhotos
    };

    onCreate(newAlbum);
  };

  // Helper for dynamic button text translation
  const getCreateButtonText = () => {
    if (newAlbumFiles.length > 0) {
        return language === 'ar' 
            ? `إنشاء ورفع ${newAlbumFiles.length} صورة` 
            : `Create & Upload ${newAlbumFiles.length} Photos`;
    }
    return language === 'ar' ? 'إنشاء ألبوم فارغ' : 'Create Empty Album';
  };

  if (typeof document === 'undefined') return null;

  return createPortal(
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[200000] flex items-center justify-center p-4 animate-fadeIn" dir={dir}>
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-2xl w-full max-w-lg overflow-hidden animate-scaleIn border border-gray-100 dark:border-gray-700 flex flex-col max-h-[90vh]">
         {/* Header */}
         <div className="p-4 border-b border-gray-100 dark:border-gray-700 flex justify-between items-center bg-gray-50 dark:bg-gray-700/50">
            <h3 className="font-bold text-lg text-gray-900 dark:text-white">
                {t.profile_photos_create_album || (language === 'ar' ? 'إنشاء ألبوم' : 'Create Album')}
            </h3>
            <button 
                onClick={onClose} 
                className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 bg-gray-200 hover:bg-gray-300 dark:bg-gray-700 dark:hover:bg-gray-600 rounded-full p-1.5 transition duration-200"
            >
                <X className="w-5 h-5" />
            </button>
         </div>
         
         {/* Content */}
         <div className="p-6 space-y-5 overflow-y-auto custom-scrollbar flex-1">
            <div>
               <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                   {t.profile_photos_album_name || (language === 'ar' ? 'اسم الألبوم' : 'Album Name')}
               </label>
               <input 
                 type="text" 
                 placeholder={language === 'ar' ? "أدخل اسم الألبوم..." : "Enter album name..."} 
                 className="w-full border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white p-3 rounded-lg focus:ring-2 focus:ring-fb-blue focus:border-transparent outline-none transition duration-200" 
                 value={newAlbumTitle} 
                 onChange={(e) => setNewAlbumTitle(e.target.value)} 
                 autoFocus
                />
            </div>
            
            <div>
                <input type="file" multiple accept="image/*" className="hidden" ref={albumInputRef} onChange={handleAlbumFilesSelect} />
                <div 
                    onClick={() => albumInputRef.current?.click()} 
                    className="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-xl p-8 flex flex-col items-center justify-center cursor-pointer hover:bg-blue-50 dark:hover:bg-blue-900/10 hover:border-fb-blue dark:hover:border-fb-blue transition duration-300 group"
                >
                     <div className="bg-gray-100 dark:bg-gray-700 p-3 rounded-full mb-3 group-hover:scale-110 transition-transform duration-300">
                        <Upload className="w-8 h-8 text-gray-500 dark:text-gray-400 group-hover:text-fb-blue" />
                     </div>
                     <span className="text-sm font-medium text-gray-700 dark:text-gray-300 group-hover:text-fb-blue transition-colors">
                         {t.profile_photos_upload_hint || (language === 'ar' ? 'اضغط لإضافة صور من جهازك' : 'Click to add photos')}
                     </span>
                     <span className="text-xs text-gray-400 dark:text-gray-500 mt-1">
                         {language === 'ar' ? 'يمكنك اختيار صور متعددة' : 'You can select multiple photos'}
                     </span>
                </div>
            </div>

            {newAlbumFiles.length > 0 && (
               <div>
                   <div className="text-xs font-bold text-gray-500 dark:text-gray-400 mb-2 px-1">
                       {language === 'ar' ? `تم اختيار ${newAlbumFiles.length} صور` : `${newAlbumFiles.length} photos selected`}
                   </div>
                   <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
                      {newAlbumFiles.map((url, i) => (
                         <div key={i} className="aspect-square relative rounded-lg overflow-hidden group border border-gray-200 dark:border-gray-700">
                            <img src={url} className="w-full h-full object-cover" alt="preview" />
                            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex items-center justify-center">
                                <button 
                                    onClick={() => setNewAlbumFiles(prev => prev.filter((_, idx) => idx !== i))} 
                                    className="bg-red-500 text-white rounded-full p-1.5 hover:bg-red-600 transition shadow-sm transform hover:scale-110"
                                >
                                    <X className="w-4 h-4" />
                                </button>
                            </div>
                         </div>
                      ))}
                   </div>
               </div>
            )}
         </div>

         {/* Footer */}
         <div className="p-4 border-t border-gray-100 dark:border-gray-700 flex justify-end gap-3 bg-gray-50 dark:bg-gray-700/50">
            <button 
                onClick={onClose} 
                className="px-5 py-2.5 text-gray-700 dark:text-gray-300 font-bold hover:bg-gray-200 dark:hover:bg-gray-600 rounded-lg transition duration-200 text-sm"
            >
                {t.common_cancel || (language === 'ar' ? 'إلغاء' : 'Cancel')}
            </button>
            <button 
                onClick={handleCreateAlbum} 
                disabled={!newAlbumTitle.trim()} 
                className="px-6 py-2.5 bg-fb-blue text-white font-bold rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition duration-200 shadow-sm text-sm"
            >
               {getCreateButtonText()}
            </button>
         </div>
      </div>
    </div>,
    document.body
  );
};

export default CreateAlbumModal;