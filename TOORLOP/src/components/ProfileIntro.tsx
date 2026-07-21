import React, { useState, useRef, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { 
  Globe, Heart, Search, X, Check, Camera, Briefcase, 
  Upload, Plus, Loader2, AlertCircle, Info, MapPin, 
  GraduationCap, Home, Clock, Pen
} from 'lucide-react';
import { User, Photo } from '../types';
import { useLanguage } from '../context/LanguageContext';
import { 
  MAX_BIO_LENGTH, 
  MAX_FEATURED_PHOTOS, 
  ALLOWED_FILE_TYPES, 
  MAX_FILE_SIZE, 
  HOBBIES_LIST 
} from '../data/profileIntroData';

interface ProfileIntroProps {
  currentUser: User;
  isOwnProfile: boolean;
  photos: Photo[];
  onTabChange: (tab: any) => void;
}

// --- Interfaces for Data stored by ProfileAbout (LocalStorage) ---
interface StoredWork { id: string; role: string; company: string; privacy: string; }
interface StoredUni { id: string; name: string; degree: string; major: string; year: string; privacy: string; }
interface StoredPlace { id: string; type: 'current' | 'hometown'; country: string; city: string; privacy: string; }
interface StoredRel { status: string; partner?: string; privacy: string; }
interface StoredBio { text: string; privacy: string; }

interface IntroDetails {
  work: string;
  education: string;
  city: string;
  hometown: string;
  relationship: string;
}

const ProfileIntro: React.FC<ProfileIntroProps> = ({ currentUser, isOwnProfile, photos, onTabChange }) => {
  const { t, dir, language } = useLanguage();
  
  // Helper to safely extract user data for fallback
  const getUserData = (user: User) => user as any;

  // --- Bio State (Synced with About) ---
  const [bio, setBio] = useState('');

  // --- Intro Details State (Synced with About) ---
  const [introDetails, setIntroDetails] = useState<IntroDetails>({
    work: '',
    education: '',
    city: '',
    hometown: '',
    relationship: ''
  });

  // --- Hobbies State (Local) ---
  const [hobbies, setHobbies] = useState<string[]>(getUserData(currentUser).hobbies || []);
  const [isHobbiesModalOpen, setIsHobbiesModalOpen] = useState(false);
  const [searchHobby, setSearchHobby] = useState('');
  const [selectedHobbiesTemp, setSelectedHobbiesTemp] = useState<string[]>([]);

  // --- Featured Photos State (Local) ---
  const [featuredPhotos, setFeaturedPhotos] = useState<string[]>(getUserData(currentUser).featuredPhotos || []);
  const [isFeaturedModalOpen, setIsFeaturedModalOpen] = useState(false);
  const [tempFeaturedPhotos, setTempFeaturedPhotos] = useState<string[]>([]);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const featuredInputRef = useRef<HTMLInputElement>(null);

  // Helper function to translate hobby names
  const translateHobby = (hobbyName: string) => {
    if (language === 'ar') return hobbyName;
    // Assuming translations.ts maps 'hobbies_ArabicName' -> 'EnglishName'
    return t[`hobbies_${hobbyName}`] || hobbyName;
  };

  // --- Effect: Sync State with LocalStorage (About Section Source) ---
  useEffect(() => {
    const loadData = () => {
      // 1. Load Bio
      try {
        // Only load from localStorage if it's the user's own profile to prevent drafts leaking to other profiles
        const savedBio = isOwnProfile ? localStorage.getItem('pa_bio') : null;
        if (savedBio) {
          const parsed: StoredBio = JSON.parse(savedBio);
          setBio(parsed.text || '');
        } else {
          setBio(getUserData(currentUser).bio || '');
        }
      } catch (e) { console.error("Error parsing bio", e); }

      // 2. Load Details
      const newDetails: IntroDetails = { work: '', education: '', city: '', hometown: '', relationship: '' };

      try {
        // Work (Take the first one if multiple)
        const savedWork = isOwnProfile ? localStorage.getItem('pa_works') : null;
        if (savedWork) {
          const parsedWork: StoredWork[] = JSON.parse(savedWork);
          if (parsedWork.length > 0) {
            const w = parsedWork[0];
            newDetails.work = `${w.role} ${t.profile_about_at || (dir === 'rtl' ? 'في' : 'at')} ${w.company}`;
          }
        } else if (getUserData(currentUser).work) {
          newDetails.work = getUserData(currentUser).work;
        }

        // Education (Take the first one)
        const savedUni = isOwnProfile ? localStorage.getItem('pa_unis') : null;
        const savedSchool = isOwnProfile ? localStorage.getItem('pa_schools') : null;
        
        if (savedUni) {
          const parsedUni: StoredUni[] = JSON.parse(savedUni);
          if (parsedUni.length > 0) {
            const u = parsedUni[0];
            newDetails.education = `${t.profile_about_studied || (dir === 'rtl' ? 'درس' : 'Studied')} ${u.major} ${t.profile_about_at || (dir === 'rtl' ? 'في' : 'at')} ${u.name}`;
          }
        }
        // Fallback to school if no uni
        if (!newDetails.education && savedSchool) {
          const parsedSchool: any[] = JSON.parse(savedSchool);
          if (parsedSchool.length > 0) {
            const s = parsedSchool[0];
            newDetails.education = `${t.profile_about_went_to || (dir === 'rtl' ? 'درس في' : 'Went to')} ${s.name}`;
          }
        }
        if (!newDetails.education && getUserData(currentUser).education) {
          newDetails.education = getUserData(currentUser).education;
        }

        // Places
        const savedPlaces = isOwnProfile ? localStorage.getItem('pa_places') : null;
        if (savedPlaces) {
          const parsedPlaces: StoredPlace[] = JSON.parse(savedPlaces);
          const current = parsedPlaces.find(p => p.type === 'current');
          const hometown = parsedPlaces.find(p => p.type === 'hometown');
          
          if (current) newDetails.city = `${current.city}, ${current.country}`;
          if (hometown) newDetails.hometown = `${hometown.city}, ${hometown.country}`;
        } else {
          newDetails.city = getUserData(currentUser).location || getUserData(currentUser).city || '';
          newDetails.hometown = getUserData(currentUser).hometown || '';
        }

        // Relationship
        const savedRel = isOwnProfile ? localStorage.getItem('pa_rel') : null;
        if (savedRel) {
          const parsedRel: StoredRel = JSON.parse(savedRel);
          if (parsedRel.status) {
             let relString = parsedRel.status;
             if (parsedRel.partner) relString += ` ${language === 'ar' ? 'مع' : 'with'} ${parsedRel.partner}`;
             newDetails.relationship = relString;
          }
        } else {
          newDetails.relationship = getUserData(currentUser).relationship || '';
        }

      } catch (e) { 
          console.error("Error parsing details", e); 
      }

      setIntroDetails(newDetails);
      
      // Hobbies & Featured remain local to Intro logic or props if available
      if (getUserData(currentUser).hobbies) setHobbies(getUserData(currentUser).hobbies);
      if (getUserData(currentUser).featuredPhotos) setFeaturedPhotos(getUserData(currentUser).featuredPhotos);
    };

    // Run initially
    loadData();

    // Listen for custom event from ProfileAbout or other editors to sync instantly within the same tab
    window.addEventListener('profile_updated', loadData);
    // Listen for cross-tab storage changes
    window.addEventListener('storage', loadData);

    return () => {
      window.removeEventListener('profile_updated', loadData);
      window.removeEventListener('storage', loadData);
    };

  }, [currentUser, dir, isOwnProfile, t.profile_about_at, t.profile_about_studied, t.profile_about_went_to, language]);

  // --- Helper: Secure File Reading ---
  const readFileAsBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = error => reject(error);
    });
  };

  const validateFile = (file: File): string | null => {
    if (!ALLOWED_FILE_TYPES.includes(file.type)) {
      return t.errors_unsupported_file || 'نوع الملف غير مدعوم.';
    }
    if (file.size > MAX_FILE_SIZE) {
      return t.errors_file_too_large || 'حجم الملف كبير جداً.';
    }
    return null;
  };

  // --- Navigation Handlers (Link to About) ---
  const handleEditBio = () => onTabChange('about');
  const handleEditDetails = () => onTabChange('about');

  // --- Hobbies Handlers ---
  const openHobbiesModal = () => {
    setSelectedHobbiesTemp([...hobbies]);
    setSearchHobby('');
    setIsHobbiesModalOpen(true);
  };

  const toggleHobbySelection = (hobbyId: string) => {
    if (selectedHobbiesTemp.includes(hobbyId)) {
      setSelectedHobbiesTemp(prev => prev.filter(id => id !== hobbyId));
    } else {
      if (selectedHobbiesTemp.length >= 8) return;
      setSelectedHobbiesTemp(prev => [...prev, hobbyId]);
    }
  };

  const handleSaveHobbies = () => {
    setHobbies(selectedHobbiesTemp);
    setIsHobbiesModalOpen(false);
    // API sync would go here
  };

  // --- Featured Photos Handlers ---
  const openFeaturedModal = () => {
      setTempFeaturedPhotos([...featuredPhotos]);
      setUploadError(null);
      setIsFeaturedModalOpen(true);
  };

  const handleFeaturedFilesSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
      if (e.target.files && e.target.files.length > 0) {
          setUploadError(null);
          const remainingSlots = MAX_FEATURED_PHOTOS - tempFeaturedPhotos.length;
          
          if (e.target.files.length > remainingSlots) {
              setUploadError(language === 'ar' ? `يمكنك إضافة ${remainingSlots} صور فقط.` : `You can only add ${remainingSlots} more photos.`);
              e.target.value = '';
              return;
          }

          setIsUploading(true);
          const newFiles: string[] = [];
          let errorMsg = null;

          try {
              const promises = Array.from(e.target.files).map(async (file: File) => {
                  const validationError = validateFile(file);
                  if (validationError) {
                      throw new Error(validationError);
                  }
                  return await readFileAsBase64(file);
              });

              const results = await Promise.all(promises);
              newFiles.push(...results);
          } catch (err: any) {
              errorMsg = err.message || (t.profile_intro_upload_error || 'حدث خطأ أثناء رفع الصور');
          } 

          if (errorMsg) {
              setUploadError(errorMsg);
          }
          // Check new length after adding
          const potentialLength = tempFeaturedPhotos.length + newFiles.length;
          if (potentialLength <= MAX_FEATURED_PHOTOS) {
             setTempFeaturedPhotos(prev => [...prev, ...newFiles]);
          }
          
          setIsUploading(false);
      }
      if (featuredInputRef.current) {
          featuredInputRef.current.value = '';
      }
  };

  const removeTempFeaturedPhoto = (index: number) => {
      setTempFeaturedPhotos(prev => prev.filter((_, i) => i !== index));
  };

  const handleSaveFeatured = () => {
      setFeaturedPhotos(tempFeaturedPhotos);
      setIsFeaturedModalOpen(false);
      // API sync would go here
  };

  const filteredHobbies = HOBBIES_LIST.filter(h => {
    const translatedName = translateHobby(h.name);
    return translatedName.toLowerCase().includes(searchHobby.toLowerCase()) || h.name.toLowerCase().includes(searchHobby.toLowerCase());
  });

  // --- Dynamic Join Date ---
  const getJoinDate = () => {
    const userData = getUserData(currentUser);
    const dateVal = userData.joinedAt || userData.createdAt;
    if (dateVal) {
      return `${t.profile_intro_joined_in || (language === 'ar' ? 'انضم في' : 'Joined in')} ${new Date(dateVal).toLocaleDateString(language === 'ar' ? 'ar-EG' : 'en-US', { month: 'long', year: 'numeric' })}`;
    }
    return t.profile_intro_joined_recent || (language === 'ar' ? 'انضم حديثاً' : 'Joined recently');
  };

  const friendsCount = getUserData(currentUser).friendsCount || 1204;

  return (
    <>
      <div className="w-full space-y-4 h-fit sticky top-20">
        
        {/* --- Intro / Bio Section --- */}
        <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-sm animate-fadeIn border border-gray-100 dark:border-gray-700 transition-colors duration-300">
          <h3 className="font-bold text-xl mb-4 text-gray-900 dark:text-white">{t.profile_about || t.about_overview}</h3>
          
          {/* Bio Text */}
          <div className="space-y-3">
            <div className="text-center text-[15px] mb-4 text-gray-800 dark:text-gray-200 leading-relaxed whitespace-pre-line">
              {bio || (isOwnProfile ? <span className="text-gray-400 italic">{t.ph_desc_self}</span> : <span className="text-gray-400 italic">{t.no_details}</span>)}
            </div>
            {isOwnProfile && (
              <button 
                onClick={handleEditBio}
                className="w-full bg-emerald-700 text-white py-2.5 rounded-md font-semibold text-sm hover:bg-blue-700 text-white rounded transition flex items-center justify-center gap-2 shadow-sm"
              >
                {bio ? (language === 'ar' ? 'تعديل النبذة المختصرة' : 'Edit Bio') : t.empty_bio}
              </button>
            )}
          </div>

          <div className="border-t border-gray-100 dark:border-gray-700 my-4"></div>

          {/* Intro Details List */}
          <div className="space-y-4 mb-4">
              {introDetails.work && (
                  <div className="flex items-start gap-3 text-sm text-gray-700 dark:text-gray-300">
                      <Briefcase className="w-5 h-5 text-gray-400 mt-0.5" />
                      <span>{introDetails.work}</span>
                  </div>
              )}
              {introDetails.education && (
                  <div className="flex items-start gap-3 text-sm text-gray-700 dark:text-gray-300">
                      <GraduationCap className="w-5 h-5 text-gray-400 mt-0.5" />
                      <span>{introDetails.education}</span>
                  </div>
              )}
              {introDetails.city && (
                  <div className="flex items-start gap-3 text-sm text-gray-700 dark:text-gray-300">
                      <MapPin className="w-5 h-5 text-gray-400 mt-0.5" />
                      <span>{introDetails.city}</span>
                  </div>
              )}
              {introDetails.hometown && (
                  <div className="flex items-start gap-3 text-sm text-gray-700 dark:text-gray-300">
                      <Home className="w-5 h-5 text-gray-400 mt-0.5" />
                      <span>{introDetails.hometown}</span>
                  </div>
              )}
              {introDetails.relationship && (
                  <div className="flex items-start gap-3 text-sm text-gray-700 dark:text-gray-300">
                      <Heart className="w-5 h-5 text-gray-400 mt-0.5" />
                      <span>{introDetails.relationship}</span>
                  </div>
              )}
              <div className="flex items-start gap-3 text-sm text-gray-700 dark:text-gray-300">
                  <Clock className="w-5 h-5 text-gray-400 mt-0.5" />
                  <span>{getJoinDate()}</span>
              </div>

              {isOwnProfile && (
                  <button 
                    onClick={handleEditDetails}
                    className="w-full bg-emerald-700 text-white py-2.5 rounded-md font-semibold text-sm hover:bg-blue-700 text-white rounded transition shadow-sm"
                  >
                      {t.profile_edit_details}
                  </button>
              )}
          </div>

          <div className="border-t border-gray-100 dark:border-gray-700 my-4"></div>

          {/* Hobbies Display */}
          <div>
             {hobbies.length > 0 ? (
               <div className="flex flex-wrap gap-2 mb-4 justify-start">
                  {hobbies.map(hobbyId => {
                    const h = HOBBIES_LIST.find(item => item.id === hobbyId);
                    if (!h) return null;
                    return (
                      <div key={hobbyId} className="flex items-center gap-1.5 px-3 py-1.5 border border-gray-200 dark:border-gray-600 rounded-full text-sm hover:bg-gray-50 dark:hover:bg-gray-700 cursor-default transition bg-white dark:bg-gray-800">
                         <span>{h.emoji}</span>
                         <span className="font-medium text-gray-700 dark:text-gray-200">{translateHobby(h.name)}</span>
                      </div>
                    );
                  })}
               </div>
             ) : (
                !isOwnProfile && <div className="text-gray-400 text-sm italic text-center mb-4">{t.profile_intro_no_hobbies}</div>
             )}

             {isOwnProfile && (
                <button 
                  onClick={openHobbiesModal}
                  className="w-full bg-emerald-700 text-white py-2.5 rounded-md font-semibold text-sm hover:bg-blue-700 text-white rounded transition shadow-sm"
                >
                   {hobbies.length > 0 ? t.profile_edit_hobbies : t.profile_add_hobbies}
                </button>
             )}
          </div>

          <div className="border-t border-gray-100 dark:border-gray-700 my-4"></div>

          {/* Featured Photos Display */}
          <div>
              {featuredPhotos.length > 0 ? (
                  <div className="grid grid-cols-3 gap-2 mb-4">
                      {featuredPhotos.map((photo, idx) => (
                          <div key={idx} className="aspect-[3/4] rounded-lg overflow-hidden bg-gray-100 dark:bg-gray-700 border border-gray-200 dark:border-gray-600">
                              <img src={photo} alt={`Featured ${idx}`} className="w-full h-full object-cover hover:scale-105 transition duration-300" />
                          </div>
                      ))}
                  </div>
              ) : (
                  !isOwnProfile && <div className="text-gray-400 text-sm italic text-center mb-4">{t.profile_intro_no_featured}</div>
              )}

              {isOwnProfile && (
                 <button 
                   onClick={openFeaturedModal}
                   className="w-full bg-emerald-700 text-white py-2.5 rounded-md font-semibold text-sm hover:bg-blue-700 text-white rounded transition shadow-sm"
                 >
                    {featuredPhotos.length > 0 ? t.profile_edit_featured : t.profile_add_featured}
                 </button>
              )}
          </div>
        </div>

        {/* --- Photos Preview Section --- */}
        <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-sm animate-fadeIn delay-75 border border-gray-100 dark:border-gray-700">
          <div className="flex justify-between items-center mb-3">
            <h3 className="font-bold text-lg text-gray-900 dark:text-white">{t.profile_photos}</h3>
            <button 
              className="text-emerald-700 hover:text-blue-700 dark:text-emerald-400 dark:hover:text-blue-700 text-sm cursor-pointer hover:bg-emerald-100 dark:hover:bg-emerald-900/20 px-2 py-1 rounded transition font-medium"
              onClick={() => onTabChange('photos')}
            >
              {t.btn_view_all}
            </button>
          </div>
          {photos.length > 0 ? (
            <div className="grid grid-cols-3 gap-1 rounded-lg overflow-hidden">
              {photos.slice(0, 9).map(p => (
                <div key={p.id} className="aspect-square bg-gray-100 dark:bg-gray-700 overflow-hidden">
                    <img 
                      src={p.url} 
                      className="w-full h-full object-cover cursor-pointer hover:opacity-90 transition hover:scale-105 duration-300" 
                      alt="photo" 
                      onClick={() => onTabChange('photos')} 
                    />
                </div>
              ))}
            </div>
          ) : (
            <div className="text-gray-500 dark:text-gray-400 text-center py-8 text-sm bg-gray-50 dark:bg-gray-700/50 rounded-lg flex flex-col items-center gap-2">
               <Camera className="w-8 h-8 opacity-50" />
               {t.no_photos || (language === 'ar' ? 'لا توجد صور بعد.' : 'No photos yet.')}
            </div>
          )}
        </div>

        {/* --- Friends Preview Section --- */}
        <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-sm animate-fadeIn delay-100 border border-gray-100 dark:border-gray-700">
          <div className="flex justify-between items-center mb-1">
            <h3 className="font-bold text-lg text-gray-900 dark:text-white">{t.profile_friends}</h3>
            <button 
              className="text-emerald-700 hover:text-blue-700 dark:text-emerald-400 dark:hover:text-blue-700 text-sm cursor-pointer hover:bg-emerald-100 dark:hover:bg-emerald-900/20 px-2 py-1 rounded transition font-medium"
              onClick={() => onTabChange('friends')}
            >
               {t.btn_view_all}
            </button>
          </div>
          <div className="text-gray-500 dark:text-gray-400 text-sm mb-4">{friendsCount} {t.friend_count}</div>
          <div className="grid grid-cols-3 gap-3">
            {[1, 2, 3, 4, 5, 6, 7, 8, 9].map(i => (
              <div key={i} className="cursor-pointer group">
                <div className="aspect-square rounded-lg overflow-hidden bg-gray-100 dark:bg-gray-700 mb-1.5">
                    <img src={`https://picsum.photos/300/300?random=${i + 400}`} className="w-full h-full object-cover group-hover:scale-105 transition duration-300" alt="friend" />
                </div>
                <span className="text-xs font-semibold leading-tight block text-emerald-800 dark:text-emerald-400 truncate group-hover:text-blue-700 transition">{language === 'ar' ? `صديق ${i}` : `Friend ${i}`}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* --- Hobbies Modal (Local - Using Portal for Z-Index Fix) --- */}
      {isHobbiesModalOpen && typeof document !== 'undefined' && createPortal(
        <div className="fixed inset-0 bg-black/60 z-[100] flex items-center justify-center p-4 animate-fadeIn backdrop-blur-sm">
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-2xl w-full max-w-lg overflow-hidden animate-scaleIn flex flex-col max-h-[85vh]">
            
            <div className="p-4 border-b border-gray-100 dark:border-gray-700 flex justify-between items-center bg-gray-50 dark:bg-gray-700/50">
               <h3 className="font-bold text-lg text-center flex-1 text-gray-900 dark:text-white">{t.hobbies_modal_title}</h3>
               <button 
                 onClick={() => setIsHobbiesModalOpen(false)}
                 className="absolute left-4 text-gray-500 hover:bg-gray-200 dark:hover:bg-gray-600 rounded-full p-1.5 transition"
               >
                 <X className="w-5 h-5" />
               </button>
            </div>

            <div className="p-4 bg-white dark:bg-gray-800">
                <div className="relative group">
                   <Search className={`absolute ${dir === 'rtl' ? 'right-3' : 'left-3'} top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 group-focus-within:text-emerald-700 transition-colors`} />
                   <input 
                     type="text"
                     placeholder={t.hobbies_search}
                     className={`w-full bg-gray-100 dark:bg-gray-700 border-transparent focus:border-emerald-700 border rounded-full py-2.5 ${dir === 'rtl' ? 'pr-10 pl-4' : 'pl-10 pr-4'} outline-none text-sm transition text-gray-900 dark:text-white`}
                     value={searchHobby}
                     onChange={(e) => setSearchHobby(e.target.value)}
                   />
                </div>
            </div>

            <div className="flex-1 overflow-y-auto p-4 bg-white dark:bg-gray-800 custom-scrollbar">
               <h4 className="text-sm font-bold text-gray-500 dark:text-gray-400 mb-3">{t.hobbies_suggested}</h4>
               <div className="flex flex-wrap gap-2">
                  {filteredHobbies.map(hobby => {
                    const isSelected = selectedHobbiesTemp.includes(hobby.id);
                    return (
                      <button
                        key={hobby.id}
                        onClick={() => toggleHobbySelection(hobby.id)}
                        className={`flex items-center gap-2 px-4 py-2 rounded-full border transition text-sm font-medium ${
                          isSelected 
                            ? 'border-emerald-700 bg-emerald-100 dark:bg-emerald-900/30 text-emerald-800 dark:text-emerald-200'
                            : 'border-gray-300 dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-200'
                        }`}
                      >
                         <span>{hobby.emoji}</span>
                         <span>{translateHobby(hobby.name)}</span>
                         {isSelected && <Check className="w-3.5 h-3.5" />}
                      </button>
                    )
                  })}
                  {filteredHobbies.length === 0 && (
                     <div className="w-full text-center py-10 text-gray-400 dark:text-gray-500">
                        {t.common_no_results}
                     </div>
                  )}
               </div>
            </div>

            <div className="p-4 border-t border-gray-100 dark:border-gray-700 bg-gray-50 dark:bg-gray-700/50 flex justify-end gap-3">
               <button 
                  onClick={() => setIsHobbiesModalOpen(false)} 
                  className="px-5 py-2 text-gray-600 dark:text-gray-300 font-semibold hover:bg-gray-200 dark:hover:bg-gray-600 rounded-md transition text-sm"
               >
                 {t.btn_cancel}
               </button>
               <button 
                  onClick={handleSaveHobbies}
                  className="px-6 py-2 bg-emerald-700 text-white font-semibold rounded-md hover:bg-blue-700 text-white rounded transition shadow-sm text-sm"
               >
                 {t.btn_save}
               </button>
            </div>

          </div>
        </div>,
        document.body
      )}

      {/* --- Featured Photos Modal (Local - Using Portal for Z-Index Fix) --- */}
      {isFeaturedModalOpen && typeof document !== 'undefined' && createPortal(
          <div className="fixed inset-0 bg-black/60 z-[100] flex items-center justify-center p-4 animate-fadeIn backdrop-blur-sm">
              <div className="bg-white dark:bg-gray-800 rounded-xl shadow-2xl w-full max-w-lg overflow-hidden animate-scaleIn flex flex-col max-h-[85vh]">
                  
                  <div className="p-4 border-b border-gray-100 dark:border-gray-700 flex justify-between items-center bg-gray-50 dark:bg-gray-700/50">
                      <h3 className="font-bold text-lg text-center flex-1 text-gray-900 dark:text-white">{t.profile_intro_edit_featured}</h3>
                      <button 
                          onClick={() => setIsFeaturedModalOpen(false)}
                          className="absolute left-4 text-gray-500 hover:bg-gray-200 dark:hover:bg-gray-600 rounded-full p-1.5 transition"
                      >
                          <X className="w-5 h-5" />
                      </button>
                  </div>

                  <div className="flex-1 overflow-y-auto p-4 bg-white dark:bg-gray-800 custom-scrollbar">
                      <div className="bg-blue-100 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300 p-3 rounded-lg text-sm mb-4 flex items-center gap-2">
                          <Info className="w-4 h-4 flex-shrink-0" />
                          <span>{t.featured_info}</span>
                      </div>

                      {uploadError && (
                          <div className="bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 p-3 rounded-lg text-sm mb-4 flex items-center gap-2">
                              <AlertCircle className="w-4 h-4 flex-shrink-0" />
                              <span>{uploadError}</span>
                          </div>
                      )}
                      
                      <div className="grid grid-cols-3 gap-3">
                          {tempFeaturedPhotos.map((photo, index) => (
                              <div key={index} className="aspect-[3/4] relative rounded-lg overflow-hidden border border-gray-200 dark:border-gray-600 group bg-gray-100 dark:bg-gray-700">
                                  <img src={photo} alt="Featured" className="w-full h-full object-cover" />
                                  <button 
                                      onClick={() => removeTempFeaturedPhoto(index)}
                                      className="absolute top-1 right-1 bg-white dark:bg-gray-800 rounded-full p-1 shadow-md hover:bg-red-50 dark:hover:bg-red-900/30 transition opacity-0 group-hover:opacity-100"
                                      title={t.common_remove}
                                  >
                                      <X className="w-3.5 h-3.5 text-gray-700 dark:text-gray-300 hover:text-red-600 dark:hover:text-red-400" />
                                  </button>
                              </div>
                          ))}

                          {tempFeaturedPhotos.length < MAX_FEATURED_PHOTOS && (
                              <div 
                                  onClick={() => !isUploading && featuredInputRef.current?.click()}
                                  className={`aspect-[3/4] border-2 border-dashed border-gray-300 dark:border-gray-600 hover:border-emerald-700 dark:hover:border-emerald-500 rounded-lg flex flex-col items-center justify-center cursor-pointer hover:bg-blue-100 dark:hover:bg-blue-900/20 transition group
                                   ${isUploading ? 'opacity-50 cursor-not-allowed' : ''}`}
                              >
                                  <input 
                                      type="file" 
                                      multiple 
                                      accept="image/jpeg,image/png,image/webp,image/gif" 
                                      className="hidden" 
                                      ref={featuredInputRef} 
                                      onChange={handleFeaturedFilesSelect}
                                      disabled={isUploading}
                                  />
                                  {isUploading ? (
                                      <Loader2 className="w-6 h-6 text-emerald-700 hover:text-blue-700 dark:text-emerald-400 dark:hover:text-blue-700 animate-spin" />
                                  ) : (
                                      <>
                                          <div className="bg-gray-100 dark:bg-gray-700 p-3 rounded-full group-hover:bg-white dark:group-hover:bg-gray-500 transition mb-2 shadow-sm">
                                              <Plus className="w-6 h-6 text-emerald-700 hover:text-blue-700 dark:text-emerald-400 dark:hover:text-blue-700" />
                                          </div>
                                          <span className="text-sm font-semibold text-emerald-700 hover:text-blue-700 dark:text-emerald-400 dark:hover:text-blue-700">{t.common_add}</span>
                                      </>
                                  )}
                              </div>
                          )}
                      </div>
                  </div>

                  <div className="p-4 border-t border-gray-100 dark:border-gray-700 bg-gray-50 dark:bg-gray-700/50 flex justify-end gap-3">
                      <button 
                          onClick={() => setIsFeaturedModalOpen(false)} 
                          className="px-5 py-2 text-gray-600 dark:text-gray-300 font-semibold hover:bg-gray-200 dark:hover:bg-gray-600 rounded-md transition text-sm"
                      >
                          {t.btn_cancel}
                      </button>
                      <button 
                          onClick={handleSaveFeatured}
                          className="px-6 py-2 bg-emerald-700 text-white font-semibold rounded-md hover:bg-blue-700 text-white rounded transition shadow-sm text-sm"
                      >
                          {t.btn_save}
                      </button>
                  </div>
              </div>
          </div>,
          document.body
      )}
    </>
  );
};

export default ProfileIntro;