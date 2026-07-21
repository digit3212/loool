
import React, { useState, useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import { Plus, X, Pause, Play, Heart, Send, Smile, ChevronLeft, ChevronRight, Check } from 'lucide-react';
import { User, Story } from '../types';

interface ProfileStoryOverlayProps {
  userStories: Story[];
  currentUser: User;
  onClose: () => void;
  onAddStory: (mediaUrl: string) => void;
}

interface FloatingEmoji {
    id: number;
    char: string;
    left: number; 
}

const REACTION_EMOJIS = ["👍", "❤️", "😂", "😮", "😢", "😡", "🔥", "👏", "🎉", "😍", "🤔", "🙌", "💯", "✨"];
const MAX_FILE_SIZE = 1024 * 1024 * 1024; // 1GB
const ALLOWED_FILE_TYPES = ['image/jpeg', 'image/png', 'image/gif', 'image/webp', 'video/mp4', 'video/webm', 'video/quicktime'];

const ProfileStoryOverlay: React.FC<ProfileStoryOverlayProps> = ({ userStories, currentUser, onClose, onAddStory }) => {
  const [currentStoryIndex, setCurrentStoryIndex] = useState(0);
  const [storyProgress, setStoryProgress] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [isStoryLiked, setIsStoryLiked] = useState(false);
  const [commentText, setCommentText] = useState('');
  const [floatingEmojis, setFloatingEmojis] = useState<FloatingEmoji[]>([]);
  const [showSentNotification, setShowSentNotification] = useState(false);
  
  const videoRef = useRef<HTMLVideoElement>(null);
  const storyInputRef = useRef<HTMLInputElement>(null);

  const currentStory = userStories[currentStoryIndex];

  // Helper to detect video content
  const isVideo = (url: string) => {
      return url.startsWith('data:video') || url.endsWith('.mp4') || url.endsWith('.webm') || url.endsWith('.ogg');
  };

  // Video Playback Control
  useEffect(() => {
      if (videoRef.current) {
          if (isPaused) {
              videoRef.current.pause();
          } else {
              videoRef.current.play().catch(() => {});
          }
      }
  }, [isPaused, currentStory]);

  // Timer Logic
  useEffect(() => {
      let interval: any;
      const isCurrentVideo = currentStory ? isVideo(currentStory.mediaUrl) : false;

      if (!isPaused && currentStory) {
          const tickRate = isCurrentVideo ? 0 : 1.5; 

          interval = setInterval(() => {
              setStoryProgress(prev => {
                  if (prev >= 100) {
                      navigateStory('next');
                      return 0;
                  }
                  if (isCurrentVideo && videoRef.current && !videoRef.current.paused && videoRef.current.duration) {
                      return (videoRef.current.currentTime / videoRef.current.duration) * 100;
                  }
                  return prev + tickRate;
              });
          }, 50); 
      }
      return () => clearInterval(interval);
  }, [currentStoryIndex, isPaused, currentStory]);

  // Reset state on story switch
  useEffect(() => {
      setStoryProgress(0);
      setIsStoryLiked(false);
      setCommentText('');
      setFloatingEmojis([]);
  }, [currentStoryIndex]);

  const navigateStory = (direction: 'next' | 'prev') => {
      if (direction === 'next') {
          if (currentStoryIndex < userStories.length - 1) {
              setCurrentStoryIndex(prev => prev + 1);
              setStoryProgress(0);
          } else {
              onClose();
          }
      } else {
          if (currentStoryIndex > 0) {
              setCurrentStoryIndex(prev => prev - 1);
              setStoryProgress(0);
          } else {
              setStoryProgress(0);
          }
      }
  };

  const triggerEmoji = (char: string) => {
      const newEmoji: FloatingEmoji = {
          id: Date.now(),
          char,
          left: Math.random() * 60 + 20 
      };
      setFloatingEmojis(prev => [...prev, newEmoji]);
      
      setTimeout(() => {
          setFloatingEmojis(prev => prev.filter(e => e.id !== newEmoji.id));
      }, 2000);
      
      if (char === "❤️" && !isStoryLiked) {
          setIsStoryLiked(true);
      }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (file) {
          if (!ALLOWED_FILE_TYPES.includes(file.type)) {
              alert('نوع الملف غير مدعوم');
              return;
          }
          if (file.size > MAX_FILE_SIZE) {
              alert('حجم الملف كبير جداً. الحد الأقصى هو 1 جيجابايت.');
              return;
          }
          const reader = new FileReader();
          reader.onloadend = () => {
              if (typeof reader.result === 'string') {
                  onAddStory(reader.result);
                  onClose(); 
              }
          };
          reader.readAsDataURL(file);
      }
  };

  if (!currentStory) return null;

  return createPortal(
    <div className="fixed inset-0 z-[10000] bg-black/95 text-white flex flex-col animate-fadeIn overflow-hidden select-none">
        <input 
            type="file" 
            ref={storyInputRef} 
            className="hidden" 
            accept="image/*,video/mp4,video/webm" 
            onChange={handleFileChange} 
        />

        <div className="absolute inset-0 pointer-events-none z-30 overflow-hidden">
            {floatingEmojis.map(emoji => (
                <div key={emoji.id} className="absolute bottom-24 text-4xl animate-float" style={{ left: `${emoji.left}%` }}>{emoji.char}</div>
            ))}
            {/* Floating Confirmation Icon */}
            {showSentNotification && (
                <div className="absolute bottom-36 left-1/2 -translate-x-1/2 z-[100] pointer-events-none animate-float flex flex-col items-center">
                    <div className="bg-emerald-500 p-3 rounded-full shadow-2xl border-2 border-white/20 mb-2">
                        <Check className="w-8 h-8 text-white" />
                    </div>
                    <span className="text-white text-xs font-bold bg-black/60 px-3 py-1 rounded-full backdrop-blur-sm">تم إرسال الرد</span>
                </div>
            )}
        </div>

        {/* Top Controls */}
        <div className="absolute top-0 left-0 w-full p-4 bg-gradient-to-b from-black/80 to-transparent z-40">
            <div className="flex gap-1 mb-3 px-2">
                {userStories.map((_, idx) => (
                    <div key={idx} className="h-1 flex-1 bg-white/20 rounded-full overflow-hidden">
                        <div 
                          className={`h-full bg-white transition-all duration-100 ease-linear ${idx === currentStoryIndex ? '' : idx < currentStoryIndex ? 'w-full' : 'w-0'}`}
                          style={{ width: idx === currentStoryIndex ? `${storyProgress}%` : undefined }}
                        ></div>
                    </div>
                ))}
            </div>

            <div className="flex justify-between items-center px-2">
                <div className="flex items-center gap-3">
                    <img src={currentStory.userAvatar} className="w-10 h-10 rounded-full border border-white/40 shadow-lg object-cover" alt="avatar" />
                    <div className="flex flex-col">
                         <span className="font-bold text-sm drop-shadow-md">{currentStory.userName}</span>
                         <span className="text-xs text-white/70 drop-shadow-md">{currentStory.timestamp}</span>
                    </div>
                </div>
                <div className="flex items-center gap-5">
                    {currentUser.id === currentStory.userId && (
                        <button onClick={() => storyInputRef.current?.click()} className="p-2 bg-white/10 hover:bg-white/20 rounded-full transition border border-white/5 shadow-sm" title="إضافة قصة جديدة">
                            <Plus className="w-5 h-5 text-white" />
                        </button>
                    )}
                    <button onClick={() => setIsPaused(!isPaused)} className="hover:scale-110 transition">{isPaused ? <Play className="w-7 h-7 fill-current" /> : <Pause className="w-7 h-7 fill-current" />}</button>
                    <button onClick={onClose} className="hover:scale-110 transition hover:rotate-90"><X className="w-9 h-9" /></button>
                </div>
            </div>
        </div>

        {/* Main Content Area */}
        <div className="flex-1 flex items-center justify-center relative bg-black overflow-hidden">
            <div className="w-full max-w-5xl h-full flex items-center justify-center">
                {isVideo(currentStory.mediaUrl) ? (
                    <video 
                      ref={videoRef} 
                      src={currentStory.mediaUrl} 
                      className="max-w-full max-h-full object-contain shadow-2xl" 
                      autoPlay 
                      playsInline 
                      onEnded={() => navigateStory('next')}
                    />
                ) : (
                    <img src={currentStory.mediaUrl} alt="Story" className="max-w-full max-h-full object-contain shadow-2xl" draggable={false}/>
                )}
            </div>
            
            {/* Click Zones */}
            <div className="absolute inset-0 flex z-30">
                <div className="w-1/4 h-full cursor-pointer" onClick={() => navigateStory('prev')}></div>
                <div className="w-2/4 h-full cursor-pointer" onClick={() => setIsPaused(!isPaused)}></div>
                <div className="w-1/4 h-full cursor-pointer" onClick={() => navigateStory('next')}></div>
            </div>

            {/* Navigation Arrows (Desktop) */}
            <button className="hidden md:flex absolute left-10 top-1/2 -translate-y-1/2 p-4 bg-white/10 hover:bg-white/20 backdrop-blur-md rounded-full z-50 text-white transition-all shadow-xl hover:scale-110" onClick={() => navigateStory('prev')}>
                <ChevronLeft className="w-8 h-8" />
            </button>
            <button className="hidden md:flex absolute right-10 top-1/2 -translate-y-1/2 p-4 bg-white/10 hover:bg-white/20 backdrop-blur-md rounded-full z-50 text-white transition-all shadow-xl hover:scale-110" onClick={() => navigateStory('next')}>
                <ChevronRight className="w-8 h-8" />
            </button>
        </div>

        {/* Immersive Footer */}
        <div className="w-full bg-gradient-to-t from-black via-black/80 to-transparent pt-20 pb-8 px-4 z-40 flex flex-col gap-5">
            <div className="flex justify-center gap-4 mb-2 overflow-x-auto no-scrollbar pb-2 px-6">
                {REACTION_EMOJIS.map(emoji => (
                    <button key={emoji} onClick={() => triggerEmoji(emoji)} className="text-3xl hover:scale-125 transition active:scale-90 cursor-pointer bg-white/10 backdrop-blur-lg rounded-full w-12 h-12 flex-shrink-0 flex items-center justify-center border border-white/10 hover:bg-white/20 shadow-lg">{emoji}</button>
                ))}
            </div>
            <div className="flex items-center gap-3 max-w-xl mx-auto w-full">
                <div className="flex-1 relative group">
                    <input 
                      type="text" 
                      placeholder="رد على القصة..." 
                      className="w-full bg-white/10 backdrop-blur-md border border-white/20 rounded-full py-4 pr-12 pl-14 text-white placeholder-white/60 focus:border-white/40 focus:bg-white/15 outline-none transition-all shadow-inner"
                      value={commentText} 
                      onChange={(e) => setCommentText(e.target.value)} 
                      onFocus={() => setIsPaused(true)} 
                      onBlur={() => !commentText && setIsPaused(false)}
                    />
                    <Smile className="absolute right-4 top-1/2 -translate-y-1/2 w-6 h-6 text-white/50 cursor-pointer group-hover:text-white transition" />
                </div>
                {commentText ? (
                    <button onClick={() => { 
                        setCommentText(''); 
                        setIsPaused(false); 
                        setShowSentNotification(true);
                        setTimeout(() => setShowSentNotification(false), 2500);
                    }} className="bg-emerald-600 text-white p-3.5 rounded-full transition transform hover:scale-110 shadow-xl active:scale-95"><Send className="w-6 h-6 rotate-180" /></button>
                ) : (
                    <button onClick={() => { setIsStoryLiked(!isStoryLiked); if (!isStoryLiked) triggerEmoji("💚"); }} className={`p-3.5 rounded-full transition-all duration-300 transform hover:scale-110 shadow-xl border border-white/10 active:scale-95 ${isStoryLiked ? 'bg-green-700 text-white' : 'bg-white/10 backdrop-blur-md text-white hover:bg-white/20'}`}>
                        <Heart className={`w-7 h-7 ${isStoryLiked ? 'fill-current' : ''}`} />
                    </button>
                )}
            </div>
        </div>
    </div>,
    document.body
  );
};

export default ProfileStoryOverlay;
