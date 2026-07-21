import React, { useState, useRef, useEffect } from 'react';
import { 
  Video, 
  Image, 
  Smile, 
  Sparkles, 
  X, 
  Camera, 
  Activity, 
  MapPin, 
  UserPlus, 
  Search, 
  Check,
  MoreHorizontal,
  Globe, 
  Lock, 
  Users, 
  ChevronDown, 
  Trash2, 
  Bell, 
  BellOff, 
  AlertTriangle 
} from 'lucide-react';
import { User } from '../types';
import { generatePostContent } from '../services/geminiService';
import { useLanguage } from '../context/LanguageContext';
import { 
  MAX_FILE_SIZE_MB, 
  ALLOWED_IMAGE_TYPES, 
  ALLOWED_VIDEO_TYPES, 
  THEME_CONFIG, 
  FEELINGS_LIST, 
  ACTIVITIES_LIST, 
  MOCK_FRIENDS, 
  MOCK_LOCATIONS 
} from '../data/createPostData';

interface CreatePostProps {
  currentUser: User;
  onPostCreate: (content: string, image?: string) => void;
}

// --- Types ---
type PrivacyLevel = 'public' | 'friends' | 'friends_of_friends' | 'only_me';

// --- Components ---
const PrivacyIcon = ({ type }: { type: PrivacyLevel }) => {
    if (type === 'public') return <Globe className="w-3 h-3" />;
    if (type === 'friends') return <Users className="w-3 h-3" />;
    if (type === 'friends_of_friends') return <UserPlus className="w-3 h-3" />;
    return <Lock className="w-3 h-3" />;
};

const CreatePost: React.FC<CreatePostProps> = ({ currentUser, onPostCreate }) => {
  const { t, language, dir } = useLanguage();
  const [content, setContent] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [mediaType, setMediaType] = useState<'image' | 'video' | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // Features State
  const [showFeelingModal, setShowFeelingModal] = useState(false);
  const [selectedFeeling, setSelectedFeeling] = useState<{label: string, emoji: string} | null>(null);
  const [activityType, setActivityType] = useState<'feeling' | 'activity'>('feeling');

  const [showTagModal, setShowTagModal] = useState(false);
  const [taggedUsers, setTaggedUsers] = useState<string[]>([]);

  const [showLocationModal, setShowLocationModal] = useState(false);
  const [selectedLocation, setSelectedLocation] = useState<string | null>(null);

  // Post Settings State
  const [privacy, setPrivacy] = useState<PrivacyLevel>('public');
  const [showPrivacyMenu, setShowPrivacyMenu] = useState(false);
  const [showOptionsMenu, setShowOptionsMenu] = useState(false);
  const [notificationsOn, setNotificationsOn] = useState(true);

  // Live Video State
  const [showLiveModal, setShowLiveModal] = useState(false);
  const [cameraStream, setCameraStream] = useState<MediaStream | null>(null);
  const [cameraError, setCameraError] = useState<string | null>(null);
  const videoRef = useRef<HTMLVideoElement>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const privacyRef = useRef<HTMLDivElement>(null);
  const optionsRef = useRef<HTMLDivElement>(null);

  // --- Effects ---
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (privacyRef.current && !privacyRef.current.contains(event.target as Node)) {
        setShowPrivacyMenu(false);
      }
      if (optionsRef.current && !optionsRef.current.contains(event.target as Node)) {
        setShowOptionsMenu(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // --- Validation & Security ---
  const validateFile = (file: File): boolean => {
    setErrorMsg(null);
    // Using imported constant for size check
    if (file.size > MAX_FILE_SIZE_MB * 1024 * 1024) {
      setErrorMsg(language === 'ar' 
        ? `حجم الملف كبير جداً. الحد الأقصى هو ${MAX_FILE_SIZE_MB} ميجابايت.`
        : `File too large. Maximum size is ${MAX_FILE_SIZE_MB}MB.`);
      return false;
    }
    const fileType = file.type;
    if (!ALLOWED_IMAGE_TYPES.includes(fileType) && !ALLOWED_VIDEO_TYPES.includes(fileType)) {
      setErrorMsg(t.errors_unsupported_file || (language === 'ar' ? 'نوع الملف غير مدعوم.' : 'Unsupported file type.'));
      return false;
    }
    return true;
  };

  // --- AI Handler ---
  const handleMagicPost = async () => {
    setIsGenerating(true);
    setErrorMsg(null);
    let prompt = content;
    if (!prompt.trim()) {
        const topics = language === 'ar' 
          ? ["يوم جميل", "حكمة اليوم", "تكنولوجيا", "قهوة الصباح", "النجاح", "الأمل"]
          : ["Beautiful day", "Quote of the day", "Technology", "Morning coffee", "Success", "Hope"];
        prompt = topics[Math.floor(Math.random() * topics.length)];
    }
    try {
        const aiContent = await generatePostContent(prompt);
        setContent(aiContent);
    } catch (err) {
        setErrorMsg(t.errors_generic || "Error generating content.");
    }
    setIsGenerating(false);
  };

  // --- Image/Video Handler ---
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setErrorMsg(null);
    const file = e.target.files?.[0];
    if (file) {
      if (!validateFile(file)) return;

      const reader = new FileReader();
      reader.onloadend = () => {
        const result = reader.result as string;
        setSelectedImage(result);
        if (result.startsWith('data:video/') || file.type.startsWith('video/')) {
            setMediaType('video');
        } else {
            setMediaType('image');
        }
      };
      reader.readAsDataURL(file);
    }
    e.target.value = '';
  };

  // --- Live Video Handlers ---
  const startCamera = async () => {
      setCameraError(null);
      try {
          if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
              throw new Error("API_NOT_SUPPORTED");
          }
          const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
          setCameraStream(stream);
          if (videoRef.current) {
              videoRef.current.srcObject = stream;
          }
      } catch (err: any) {
          console.error("Error accessing camera:", err);
          let msg = language === 'ar' ? "حدث خطأ أثناء تشغيل الكاميرا." : "Error accessing camera.";
          if (err.message === "API_NOT_SUPPORTED") msg = language === 'ar' ? "المتصفح لا يدعم تشغيل الكاميرا." : "Browser does not support camera.";
          else if (err.name === 'NotAllowedError') msg = language === 'ar' ? "تم رفض إذن الوصول للكاميرا." : "Camera access denied.";
          else if (err.name === 'NotFoundError') msg = language === 'ar' ? "لم يتم العثور على كاميرا." : "No camera found.";
          setCameraError(msg);
      }
  };

  const stopCamera = () => {
      if (cameraStream) {
          cameraStream.getTracks().forEach(track => track.stop());
          setCameraStream(null);
      }
  };

  useEffect(() => {
      if (showLiveModal) startCamera();
      else stopCamera();
      return () => stopCamera();
  }, [showLiveModal]);

  const handleGoLive = () => {
      if (cameraStream) {
          const liveText = language === 'ar' ? 'بدأ بثاً مباشراً الآن!' : 'is live now!';
          onPostCreate(`🎥 **${t.post_live_video}:** ${currentUser.name} ${liveText}`, undefined);
          setShowLiveModal(false);
      } else {
          setErrorMsg(language === 'ar' ? "لا يمكن بدء البث بدون كاميرا." : "Cannot start stream without camera.");
      }
  };

  const handleClearPost = () => {
      setContent('');
      setSelectedImage(null);
      setMediaType(null);
      setSelectedFeeling(null);
      setTaggedUsers([]);
      setSelectedLocation(null);
      setErrorMsg(null);
      setShowOptionsMenu(false);
  };

  // --- Submit Handler ---
  const handleSubmit = (e?: React.FormEvent) => {
    e?.preventDefault();
    
    // Security: Sanitize input (basic prevention)
    let finalContent = content.replace(/<[^>]*>?/gm, '');
    
    // Append Metadata to content string
    const metaParts = [];
    if (selectedFeeling) {
         const feelingLabel = activityType === 'feeling' ? (t.post_feeling_label || 'Feeling') : '';
         const activityString = `${feelingLabel} ${selectedFeeling.label} ${selectedFeeling.emoji}`;
         metaParts.push(activityString.trim());
    }
    if (taggedUsers.length > 0) {
        const names = MOCK_FRIENDS.filter(f => taggedUsers.includes(f.id)).map(f => f.name).join(language === 'ar' ? '، ' : ', ');
        metaParts.push(`${t.post_with || 'with'} ${names}`);
    }
    if (selectedLocation) {
        metaParts.push(`${t.post_at || 'at'} 📍 ${selectedLocation}`);
    }

    if (metaParts.length > 0) {
        finalContent = `${metaParts.join(' ')}\n\n${finalContent}`;
    }

    if (finalContent.trim() || selectedImage) {
      onPostCreate(finalContent, selectedImage || undefined);
      handleClearPost();
    }
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-4 mb-4 relative z-10 border border-gray-100 dark:border-gray-700 animate-fadeIn transition-colors duration-300">
      
      {/* Error Toast */}
      {errorMsg && (
          <div className="bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 px-4 py-2 rounded-md mb-3 text-sm flex items-center gap-2 animate-fadeIn border border-red-100 dark:border-red-800">
              <AlertTriangle className="w-4 h-4" />
              {errorMsg}
              <button onClick={() => setErrorMsg(null)} className="ml-auto rtl:mr-auto hover:bg-red-100 dark:hover:bg-red-800 rounded-full p-1 transition">
                  <X className="w-3 h-3" />
              </button>
          </div>
      )}

      {/* Header: Avatar, Name, Privacy, Options */}
      <div className="flex items-start justify-between mb-3">
        <div className="flex gap-3">
            <img 
              src={currentUser.avatar} 
              alt={currentUser.name} 
              className="h-10 w-10 rounded-full cursor-pointer hover:opacity-90 object-cover border border-gray-200 dark:border-gray-600"
            />
            <div className="flex flex-col">
                <span className="font-bold text-gray-900 dark:text-white text-sm">{currentUser.name}</span>
                
                {/* Privacy Selector */}
                <div className="relative" ref={privacyRef}>
                    <button 
                        onClick={() => setShowPrivacyMenu(!showPrivacyMenu)}
                        className="flex items-center gap-1 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 rounded-md px-2 py-0.5 text-xs font-medium text-gray-600 dark:text-gray-300 transition mt-0.5"
                    >
                        <PrivacyIcon type={privacy} />
                        <span>
                          {privacy === 'public' ? t.privacy_public : 
                           privacy === 'friends' ? t.privacy_friends : 
                           privacy === 'friends_of_friends' ? t.privacy_friends_of_friends : 
                           t.privacy_only_me}
                        </span>
                        <ChevronDown className="w-3 h-3" />
                    </button>

                    {showPrivacyMenu && (
                        <div className={`absolute top-full mt-1 w-48 bg-white dark:bg-gray-800 shadow-xl rounded-lg border border-gray-100 dark:border-gray-700 z-50 overflow-hidden animate-fadeIn ${dir === 'rtl' ? 'right-0' : 'left-0'}`}>
                            <button onClick={() => { setPrivacy('public'); setShowPrivacyMenu(false); }} className={`w-full flex items-center gap-2 px-3 py-2 text-sm hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-200 ${privacy === 'public' ? 'text-emerald-700 bg-emerald-50 dark:bg-emerald-900/20' : ''}`}><Globe className="w-3.5 h-3.5" /> {t.privacy_public}</button>
                            <button onClick={() => { setPrivacy('friends'); setShowPrivacyMenu(false); }} className={`w-full flex items-center gap-2 px-3 py-2 text-sm hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-200 ${privacy === 'friends' ? 'text-emerald-700 bg-emerald-50 dark:bg-emerald-900/20' : ''}`}><Users className="w-3.5 h-3.5" /> {t.privacy_friends}</button>
                            <button onClick={() => { setPrivacy('friends_of_friends'); setShowPrivacyMenu(false); }} className={`w-full flex items-center gap-2 px-3 py-2 text-sm hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-200 ${privacy === 'friends_of_friends' ? 'text-emerald-700 bg-emerald-50 dark:bg-emerald-900/20' : ''}`}><UserPlus className="w-3.5 h-3.5" /> {t.privacy_friends_of_friends}</button>
                            <button onClick={() => { setPrivacy('only_me'); setShowPrivacyMenu(false); }} className={`w-full flex items-center gap-2 px-3 py-2 text-sm hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-200 ${privacy === 'only_me' ? 'text-emerald-700 bg-emerald-50 dark:bg-emerald-900/20' : ''}`}><Lock className="w-3.5 h-3.5" /> {t.privacy_only_me}</button>
                        </div>
                    )}
                </div>
            </div>
        </div>

        {/* 3-Dot Options Menu */}
        <div className="relative" ref={optionsRef}>
            <button onClick={() => setShowOptionsMenu(!showOptionsMenu)} className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full text-gray-500 dark:text-gray-400 transition">
                <MoreHorizontal className="w-5 h-5" />
            </button>
            {showOptionsMenu && (
                <div className={`absolute top-full mt-1 w-48 bg-white dark:bg-gray-800 shadow-xl rounded-lg border border-gray-100 dark:border-gray-700 z-50 overflow-hidden animate-fadeIn ${dir === 'rtl' ? 'left-0 origin-top-left' : 'right-0 origin-top-right'}`}>
                    <button onClick={() => { setNotificationsOn(!notificationsOn); setShowOptionsMenu(false); }} className="w-full text-start px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700 flex items-center gap-2 text-sm text-gray-700 dark:text-gray-200">
                        {notificationsOn ? <BellOff className="w-4 h-4" /> : <Bell className="w-4 h-4" />}
                        {notificationsOn ? t.post_turn_off_notif : t.post_turn_on_notif}
                    </button>
                    <div className="border-t border-gray-100 dark:border-gray-700 my-1"></div>
                    <button onClick={handleClearPost} className="w-full text-start px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700 flex items-center gap-2 text-sm text-red-600 font-medium">
                        <Trash2 className="w-4 h-4" /> {t.common_remove || (language === 'ar' ? 'مسح المنشور' : 'Clear Post')}
                    </button>
                </div>
            )}
        </div>
      </div>

      {/* Input Area */}
      <div className="mb-3">
            {/* Metadata Preview */}
            {(selectedFeeling || taggedUsers.length > 0 || selectedLocation) && (
                <div className="text-xs text-gray-600 dark:text-gray-300 mb-1.5 flex flex-wrap items-center gap-1 animate-fadeIn bg-emerald-50 dark:bg-emerald-900/20 p-2 rounded-lg border border-emerald-100 dark:border-emerald-800/30">
                    <span className="font-semibold text-black dark:text-white">{currentUser.name}</span>
                    {selectedFeeling && (
                        <span className={`${THEME_CONFIG.COLOR} font-bold`}>
                            {activityType === 'feeling' ? (t.post_feeling_label || (language === 'ar' ? 'يشعر بـ' : 'Feeling')) : ''} {selectedFeeling.label} {selectedFeeling.emoji}
                        </span>
                    )}
                    {taggedUsers.length > 0 && (
                        <span className="text-gray-500 dark:text-gray-400">
                            {t.post_with} {taggedUsers.length} {language === 'ar' ? 'من الأصدقاء' : 'friends'}
                        </span>
                    )}
                    {selectedLocation && (
                        <span className="text-gray-500 dark:text-gray-400 flex items-center gap-0.5">
                            {t.post_at} 📍 {selectedLocation}
                        </span>
                    )}
                    <button 
                        onClick={() => { setSelectedFeeling(null); setTaggedUsers([]); setSelectedLocation(null); }}
                        className="hover:bg-emerald-200 dark:hover:bg-emerald-800 rounded-full p-0.5 ml-auto rtl:mr-auto"
                        title={language === 'ar' ? 'مسح التحديد' : 'Clear selection'}
                    >
                        <X className="w-3 h-3 text-emerald-700 dark:text-emerald-400" />
                    </button>
                </div>
            )}
            
            <div className={`bg-gray-100 dark:bg-gray-700 rounded-xl px-4 py-2 hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors focus-within:bg-white dark:focus-within:bg-gray-800 focus-within:ring-2 ${THEME_CONFIG.RING} dark:focus-within:ring-emerald-600`}>
                <textarea
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    className="bg-transparent w-full outline-none placeholder-gray-500 dark:placeholder-gray-400 text-base resize-none overflow-hidden min-h-[60px] text-gray-900 dark:text-white"
                    placeholder={`${t.post_create_placeholder} ${currentUser.name.split(' ')[0]}؟`}
                    rows={Math.min(content.split('\n').length, 5) || 2}
                    onKeyDown={(e) => {
                        if (e.key === 'Enter' && !e.shiftKey) {
                            e.preventDefault();
                            handleSubmit();
                        }
                    }}
                />
            </div>
      </div>
      
      {/* Media Preview */}
      {selectedImage && (
        <div className="relative mb-3 rounded-lg overflow-hidden bg-gray-100 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 animate-fadeIn">
           {mediaType === 'video' ? (
               <video src={selectedImage} controls className="max-h-80 w-full object-contain" />
           ) : (
               <img src={selectedImage} alt="Selected" className="max-h-80 w-full object-contain" />
           )}
           <button 
             onClick={() => setSelectedImage(null)}
             className="absolute top-2 left-2 bg-white/80 dark:bg-black/60 p-1.5 rounded-full hover:bg-white dark:hover:bg-black shadow-sm z-10 transition hover:scale-110"
           >
             <X className="h-5 w-5 text-gray-700 dark:text-gray-200" />
           </button>
        </div>
      )}

      {/* Action Buttons Bar */}
      <div className="border-t border-gray-200 dark:border-gray-700 pt-3 flex items-center justify-between flex-wrap gap-y-2">
        <div className="flex gap-1 md:gap-2 overflow-x-auto no-scrollbar w-full md:w-auto scroll-smooth pb-1">
          
          <button 
            onClick={() => setShowLiveModal(true)}
            className="flex items-center gap-2 px-3 py-2 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors flex-shrink-0"
            title={t.post_live_video}
          >
            <Video className="h-6 w-6 text-red-500" />
            <span className="text-gray-600 dark:text-gray-300 font-medium text-sm hidden sm:inline">{t.post_live_video}</span>
          </button>
          
          <button 
            onClick={() => fileInputRef.current?.click()}
            className="flex items-center gap-2 px-3 py-2 hover:bg-emerald-50 dark:hover:bg-emerald-900/20 rounded-lg transition-colors flex-shrink-0"
            title={t.post_photo_video}
          >
            <Image className="h-6 w-6 text-emerald-600" />
            <span className="text-gray-600 dark:text-gray-300 font-medium text-sm hidden sm:inline">{t.post_photo_video}</span>
            <input 
              type="file" 
              ref={fileInputRef} 
              className="hidden" 
              accept="image/*,video/*"
              onChange={handleImageChange}
            />
          </button>

          <button 
            onClick={() => setShowFeelingModal(true)}
            className="flex items-center gap-2 px-3 py-2 hover:bg-yellow-50 dark:hover:bg-yellow-900/20 rounded-lg transition-colors flex-shrink-0"
            title={t.post_feeling_activity}
          >
            <Smile className="h-6 w-6 text-yellow-500" />
            <span className="text-gray-600 dark:text-gray-300 font-medium text-sm hidden sm:inline">{t.post_feeling_activity}</span>
          </button>

          <button 
            onClick={() => setShowTagModal(true)}
            className="flex items-center gap-2 px-3 py-2 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg transition-colors flex-shrink-0"
            title={t.post_tag_button}
          >
            <UserPlus className="h-6 w-6 text-blue-500" />
            <span className="text-gray-600 dark:text-gray-300 font-medium text-sm hidden sm:inline">{t.post_tag_button}</span>
          </button>

          <button 
            onClick={() => setShowLocationModal(true)}
            className="flex items-center gap-2 px-3 py-2 hover:bg-orange-50 dark:hover:bg-orange-900/20 rounded-lg transition-colors flex-shrink-0"
            title={t.post_location_button}
          >
            <MapPin className="h-6 w-6 text-orange-500" />
            <span className="text-gray-600 dark:text-gray-300 font-medium text-sm hidden sm:inline">{t.post_location_button}</span>
          </button>

           <button 
            onClick={handleMagicPost}
            disabled={isGenerating}
            className={`flex items-center gap-2 px-3 py-2 rounded-lg transition-colors flex-shrink-0 ${isGenerating ? 'bg-purple-100 dark:bg-purple-900/40' : 'hover:bg-purple-50 dark:hover:bg-purple-900/20'}`}
            title={t.post_magic_ai}
          >
            <Sparkles className={`h-6 w-6 text-purple-600 dark:text-purple-400 ${isGenerating ? 'animate-spin' : ''}`} />
            <span className="text-purple-600 dark:text-purple-400 font-medium text-sm hidden sm:inline">
                {isGenerating ? t.post_ai_thinking : t.post_magic_ai}
            </span>
          </button>
        </div>
      </div>

      {/* Submit Button */}
      {(content || selectedImage || selectedFeeling || taggedUsers.length > 0 || selectedLocation) && (
          <div className="mt-3 flex justify-end animate-fadeIn">
               <button 
                 onClick={() => handleSubmit()}
                 className={`${THEME_CONFIG.BG} text-white px-8 py-2 rounded-md font-bold hover:bg-emerald-800 transition shadow-sm flex items-center gap-2 transform active:scale-95`}
               >
                   {t.post_publish}
               </button>
          </div>
      )}

      {/* --- Live Video Modal --- */}
      {showLiveModal && (
          <div className="fixed inset-0 bg-black/80 z-[100] flex items-center justify-center p-4 animate-fadeIn backdrop-blur-sm">
              <div className="bg-white dark:bg-gray-800 rounded-xl shadow-2xl w-full max-w-2xl overflow-hidden animate-scaleIn border border-gray-200 dark:border-gray-700">
                  <div className="p-4 border-b dark:border-gray-700 flex justify-between items-center bg-white dark:bg-gray-800">
                      <h3 className="font-bold text-lg flex items-center gap-2 dark:text-white">
                          <div className={`w-3 h-3 rounded-full ${cameraStream ? 'bg-red-500 animate-pulse' : 'bg-gray-400'}`}></div>
                          {t.post_live_video}
                      </h3>
                      <button onClick={() => setShowLiveModal(false)} className="bg-gray-100 dark:bg-gray-700 p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-600 transition"><X className="w-5 h-5 dark:text-white" /></button>
                  </div>
                  <div className="aspect-video bg-black relative flex items-center justify-center overflow-hidden">
                      {cameraError ? (
                          <div className="text-white text-center p-6 flex flex-col items-center">
                              <AlertTriangle className="w-16 h-16 text-yellow-500 mb-4" />
                              <p className="text-lg font-semibold mb-2 text-red-400">{language === 'ar' ? 'تعذر الوصول للكاميرا' : 'Cannot access camera'}</p>
                              <p className="text-sm text-gray-300 max-w-xs">{cameraError}</p>
                              <button onClick={startCamera} className="mt-6 bg-gray-700 hover:bg-gray-600 text-white px-4 py-2 rounded-md text-sm transition">
                                  {language === 'ar' ? 'إعادة المحاولة' : 'Retry'}
                              </button>
                          </div>
                      ) : cameraStream ? (
                          <video ref={videoRef} autoPlay muted playsInline className="w-full h-full object-cover transform scale-x-[-1]" />
                      ) : (
                          <div className="text-white text-center flex flex-col items-center animate-pulse">
                              <Camera className="w-12 h-12 mb-2 opacity-50" />
                              <p>{language === 'ar' ? 'جاري تشغيل الكاميرا...' : 'Starting camera...'}</p>
                          </div>
                      )}
                      
                      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-4">
                          <button 
                            onClick={handleGoLive} 
                            disabled={!cameraStream}
                            className="bg-red-600 text-white px-6 py-2 rounded-full font-bold hover:bg-red-700 shadow-lg transform hover:scale-105 transition disabled:opacity-50 disabled:hover:scale-100 disabled:bg-gray-600 flex items-center gap-2"
                          >
                              <Activity className="w-5 h-5" /> {language === 'ar' ? 'بدء البث المباشر' : 'Go Live'}
                          </button>
                      </div>
                  </div>
              </div>
          </div>
      )}

      {/* --- Feeling Modal --- */}
      {showFeelingModal && (
          <div className="fixed inset-0 bg-black/60 z-[100] flex items-center justify-center p-4 animate-fadeIn backdrop-blur-sm">
              <div className="bg-white dark:bg-gray-800 rounded-xl shadow-xl w-full max-w-md overflow-hidden h-[500px] flex flex-col animate-scaleIn">
                  <div className="p-4 border-b dark:border-gray-700 flex justify-between items-center">
                      <h3 className="font-bold text-lg dark:text-white">{t.post_feeling_activity}</h3>
                      <button onClick={() => setShowFeelingModal(false)} className="bg-gray-100 dark:bg-gray-700 p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-600 transition"><X className="w-5 h-5 dark:text-white" /></button>
                  </div>
                  <div className="flex border-b dark:border-gray-700">
                      <button onClick={() => setActivityType('feeling')} className={`flex-1 py-3 font-semibold text-sm transition ${activityType === 'feeling' ? `${THEME_CONFIG.COLOR} border-b-2 ${THEME_CONFIG.BORDER}` : 'text-gray-500 hover:bg-gray-50 dark:hover:bg-gray-700 dark:text-gray-400'}`}>
                          {t.post_feeling_label || (language === 'ar' ? 'مشاعر' : 'Feelings')}
                      </button>
                      <button onClick={() => setActivityType('activity')} className={`flex-1 py-3 font-semibold text-sm transition ${activityType === 'activity' ? `${THEME_CONFIG.COLOR} border-b-2 ${THEME_CONFIG.BORDER}` : 'text-gray-500 hover:bg-gray-50 dark:hover:bg-gray-700 dark:text-gray-400'}`}>
                          {t.post_activity_label || (language === 'ar' ? 'أنشطة' : 'Activities')}
                      </button>
                  </div>
                  <div className="flex-1 overflow-y-auto p-2 bg-white dark:bg-gray-800 custom-scrollbar">
                      <div className="grid grid-cols-2 gap-2">
                          {(activityType === 'feeling' ? FEELINGS_LIST : ACTIVITIES_LIST).map((item, idx) => (
                              <div key={idx} onClick={() => { setSelectedFeeling(item); setShowFeelingModal(false); }} className="flex items-center gap-3 p-3 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg cursor-pointer transition">
                                  <div className="w-9 h-9 bg-gray-200 dark:bg-gray-600 rounded-full flex items-center justify-center text-xl">{item.emoji}</div>
                                  <span className="font-medium text-gray-800 dark:text-gray-200">{item.label}</span>
                              </div>
                          ))}
                      </div>
                  </div>
              </div>
          </div>
      )}

      {/* --- Tag Friends Modal --- */}
      {showTagModal && (
          <div className="fixed inset-0 bg-black/60 z-[100] flex items-center justify-center p-4 animate-fadeIn backdrop-blur-sm">
              <div className="bg-white dark:bg-gray-800 rounded-xl shadow-xl w-full max-w-sm overflow-hidden animate-scaleIn">
                  <div className="p-4 border-b dark:border-gray-700 flex justify-between items-center">
                      <h3 className="font-bold text-lg dark:text-white">{t.post_tag_button}</h3>
                      <button onClick={() => setShowTagModal(false)} className="bg-gray-100 dark:bg-gray-700 p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-600 transition"><X className="w-5 h-5 dark:text-white" /></button>
                  </div>
                  <div className="p-4 max-h-[300px] overflow-y-auto custom-scrollbar">
                      <div className="relative mb-3">
                          <Search className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                          <input 
                              type="text" 
                              placeholder={language === 'ar' ? "بحث عن أصدقاء..." : "Search friends..."} 
                              className="w-full bg-gray-100 dark:bg-gray-700 rounded-full py-2 pr-10 pl-4 text-sm outline-none dark:text-white transition" 
                          />
                      </div>
                      {MOCK_FRIENDS.map(friend => {
                          const isSelected = taggedUsers.includes(friend.id);
                          return (
                              <div 
                                key={friend.id} 
                                onClick={() => {
                                    setTaggedUsers(prev => isSelected ? prev.filter(id => id !== friend.id) : [...prev, friend.id]);
                                }}
                                className="flex items-center justify-between p-2 hover:bg-gray-50 dark:hover:bg-gray-700 rounded-md cursor-pointer transition"
                              >
                                  <span className="font-medium text-gray-800 dark:text-gray-200">{friend.name}</span>
                                  {isSelected && <Check className={`w-5 h-5 ${THEME_CONFIG.COLOR}`} />}
                              </div>
                          )
                      })}
                  </div>
                  <div className="p-3 border-t dark:border-gray-700 flex justify-end">
                      <button onClick={() => setShowTagModal(false)} className={`${THEME_CONFIG.BG} text-white px-6 py-1.5 rounded-md text-sm font-semibold transition hover:opacity-90`}>{t.common_done || 'Done'}</button>
                  </div>
              </div>
          </div>
      )}

      {/* --- Location Modal --- */}
      {showLocationModal && (
          <div className="fixed inset-0 bg-black/60 z-[100] flex items-center justify-center p-4 animate-fadeIn backdrop-blur-sm">
              <div className="bg-white dark:bg-gray-800 rounded-xl shadow-xl w-full max-w-sm overflow-hidden animate-scaleIn">
                  <div className="p-4 border-b dark:border-gray-700 flex justify-between items-center">
                      <h3 className="font-bold text-lg dark:text-white">{t.post_location_button}</h3>
                      <button onClick={() => setShowLocationModal(false)} className="bg-gray-100 dark:bg-gray-700 p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-600 transition"><X className="w-5 h-5 dark:text-white" /></button>
                  </div>
                  <div className="p-4 max-h-[300px] overflow-y-auto custom-scrollbar">
                      <div className="relative mb-3">
                          <Search className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                          <input 
                              type="text" 
                              placeholder={language === 'ar' ? "بحث عن أماكن..." : "Search places..."} 
                              className="w-full bg-gray-100 dark:bg-gray-700 rounded-full py-2 pr-10 pl-4 text-sm outline-none dark:text-white transition" 
                          />
                      </div>
                      {MOCK_LOCATIONS.map(location => (
                          <div 
                            key={location} 
                            onClick={() => {
                                setSelectedLocation(location);
                                setShowLocationModal(false);
                            }}
                            className="flex items-center gap-3 p-2 hover:bg-gray-50 dark:hover:bg-gray-700 rounded-md cursor-pointer transition"
                          >
                              <div className="bg-gray-200 dark:bg-gray-600 p-1.5 rounded-full"><MapPin className="w-4 h-4 text-gray-600 dark:text-gray-300" /></div>
                              <span className="font-medium text-gray-800 dark:text-gray-200 text-sm">{location}</span>
                          </div>
                      ))}
                  </div>
              </div>
          </div>
      )}
    </div>
  );
};

export default CreatePost;