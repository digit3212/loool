
import React, { useState, useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import { Plus, X, Pause, Play, Heart, Send, Smile, ChevronLeft, ChevronRight, Check } from 'lucide-react';
import { User, Story } from '../types';
import { UserStoryGroup } from './StoryReel';

interface StoryViewerProps {
  initialGroupIndex: number;
  groups: UserStoryGroup[];
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
const ALLOWED_FILE_TYPES = ['image/jpeg', 'image/png', 'image/gif', 'image/webp', 'video/mp4', 'video/webm', 'video/ogg'];

const StoryViewer: React.FC<StoryViewerProps> = ({ initialGroupIndex, groups, currentUser, onClose, onAddStory }) => {
  const [activeGroupIndex, setActiveGroupIndex] = useState(initialGroupIndex);
  const [currentStoryIndex, setCurrentStoryIndex] = useState(0);
  const [storyProgress, setStoryProgress] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [isStoryLiked, setIsStoryLiked] = useState(false);
  const [commentText, setCommentText] = useState('');
  const [floatingEmojis, setFloatingEmojis] = useState<FloatingEmoji[]>([]);
  const [showSentNotification, setShowSentNotification] = useState(false);
  
  const videoRef = useRef<HTMLVideoElement>(null);
  const storyInputRef = useRef<HTMLInputElement>(null);

  // Helper to detect video content
  const isVideo = (url: string) => {
      return url.startsWith('data:video') || url.endsWith('.mp4') || url.endsWith('.webm') || url.endsWith('.ogg');
  };

  const currentGroup = groups[activeGroupIndex];
  const currentStory = currentGroup ? currentGroup.stories[currentStoryIndex] : null;

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
      const activeStory = currentGroup ? currentGroup.stories[currentStoryIndex] : null;
      const isCurrentVideo = activeStory ? isVideo(activeStory.mediaUrl) : false;

      if (activeGroupIndex !== null && !isPaused && activeStory) {
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
  }, [activeGroupIndex, currentStoryIndex, isPaused, currentGroup]);

  // Reset state on switch
  useEffect(() => {
      setStoryProgress(0);
      setIsStoryLiked(false);
      setCommentText('');
      setFloatingEmojis([]);
  }, [activeGroupIndex, currentStoryIndex]);

  const navigateStory = (direction: 'next' | 'prev') => {
      if (direction === 'next') {
          if (currentStoryIndex < currentGroup.stories.length - 1) {
              setCurrentStoryIndex(prev => prev + 1);
              setStoryProgress(0);
          } else if (activeGroupIndex < groups.length - 1) {
              setActiveGroupIndex(prev => prev + 1);
              setCurrentStoryIndex(0);
              setStoryProgress(0);
          } else {
              onClose();
          }
      } else {
          if (currentStoryIndex > 0) {
              setCurrentStoryIndex(prev => prev - 1);
              setStoryProgress(0);
          } else if (activeGroupIndex > 0) {
              setActiveGroupIndex(prev => prev - 1);
              const prevGroup = groups[activeGroupIndex - 1];
              setCurrentStoryIndex(prevGroup.stories.length - 1);
              setStoryProgress(0);
          } else {
              onClose();
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
    <div className="fixed inset-0 z-[9999] bg-black text-white flex flex-col animate-fadeIn overflow-hidden select-none touch-none">
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
                <div className="absolute bottom-32 left-1/2 -translate-x-1/2 z-[100] pointer-events-none animate-float flex flex-col items-center">
                    <div className="bg-emerald-500 p-3 rounded-full shadow-2xl border-2 border-white/20 mb-2">
                        <Check className="w-8 h-8 text-white" />
                    </div>
                    <span className="text-white text-xs font-bold bg-black/60 px-3 py-1 rounded-full backdrop-blur-sm">تم إرسال الرد</span>
                </div>
            )}
        </div>

        {/* Top Controls */}
        <div className="absolute top-0 left-0 w-full p-4 bg-gradient-to-b from-black/80 to-transparent z-40">
            <div className="flex gap-1 mb-3">
                {currentGroup.stories.map((_, idx) => (
                    <div key={idx} className="h-1 flex-1 bg-white/30 rounded-full overflow-hidden">
                        <div 
                          className={`h-full bg-white transition-all duration-100 ease-linear ${idx === currentStoryIndex ? '' : idx < currentStoryIndex ? 'w-full' : 'w-0'}`}
                          style={{ width: idx === currentStoryIndex ? `${storyProgress}%` : undefined }}
                        ></div>
                    </div>
                ))}
            </div>

            <div className="flex justify-between items-center px-1">
                <div className="flex items-center gap-3">
                    <img src={currentStory.userAvatar} className="w-10 h-10 rounded-full border border-white/50 shadow-lg object-cover" alt="avatar" />
                    <div className="flex flex-col">
                         <span className="font-bold text-sm hover:underline cursor-pointer drop-shadow-md">{currentStory.userName}</span>
                         <span className="text-xs text-white/80 drop-shadow-md">{currentStory.timestamp}</span>
                    </div>
                </div>
                <div className="flex items-center gap-4">
                    {currentUser.id === currentStory.userId && (
                        <button onClick={() => storyInputRef.current?.click()} className="p-2 bg-white/10 hover:bg-white/20 rounded-full transition" title="إضافة قصة جديدة">
                            <Plus className="w-6 h-6 text-white" />
                        </button>
                    )}
                    <button onClick={() => setIsPaused(!isPaused)} className="p-1 hover:scale-110 transition">{isPaused ? <Play className="w-6 h-6 fill-current" /> : <Pause className="w-6 h-6 fill-current" />}</button>
                    <button onClick={onClose} className="p-1 hover:scale-110 transition hover:rotate-90"><X className="w-8 h-8" /></button>
                </div>
            </div>
        </div>

        {/* Main Content */}
        <div className="flex-1 flex items-center justify-center relative bg-gray-950 overflow-hidden">
            <div className="max-w-4xl w-full h-full flex items-center justify-center relative">
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
                    <img src={currentStory.mediaUrl} alt="Story" className="max-w-full max-h-full object-contain shadow-2xl pointer-events-none" draggable={false}/>
                )}
            </div>
            
            {/* Navigation Hotspots */}
            <div className="absolute inset-0 flex z-30">
                <div className="w-1/3 h-full cursor-pointer" onClick={() => navigateStory('prev')}></div>
                <div className="w-1/3 h-full cursor-pointer" onClick={() => setIsPaused(!isPaused)}></div>
                <div className="w-1/3 h-full cursor-pointer" onClick={() => navigateStory('next')}></div>
            </div>

            {/* Visual Nav Arrows (Hidden on Mobile) */}
            <button className="hidden md:flex absolute left-8 top-1/2 -translate-y-1/2 p-4 bg-white/10 hover:bg-white/20 backdrop-blur-md rounded-full z-50 text-white transition hover:scale-110 active:scale-95" onClick={() => navigateStory('prev')}>
                <ChevronLeft className="w-8 h-8" />
            </button>
            <button className="hidden md:flex absolute right-8 top-1/2 -translate-y-1/2 p-4 bg-white/10 hover:bg-white/20 backdrop-blur-md rounded-full z-50 text-white transition hover:scale-110 active:scale-95" onClick={() => navigateStory('next')}>
                <ChevronRight className="w-8 h-8" />
            </button>
        </div>

        {/* Footer */}
        <div className="w-full bg-gradient-to-t from-black via-black/90 to-transparent pt-16 pb-6 px-4 z-40 flex flex-col gap-4">
            <div className="flex justify-center gap-3 mb-1 overflow-x-auto no-scrollbar pb-2 px-4">
                {REACTION_EMOJIS.map(emoji => (
                    <button key={emoji} onClick={() => triggerEmoji(emoji)} className="text-2xl hover:scale-125 transition active:scale-90 cursor-pointer bg-white/10 backdrop-blur-md rounded-full w-11 h-11 flex-shrink-0 flex items-center justify-center hover:bg-white/20 border border-white/5">{emoji}</button>
                ))}
            </div>
            <div className="flex items-center gap-3 max-w-2xl mx-auto w-full">
                <div className="flex-1 relative">
                    <input 
                      type="text" 
                      placeholder="رد على القصة..." 
                      className="w-full bg-white/10 backdrop-blur-md border border-white/20 rounded-full py-3.5 pr-12 pl-12 text-white placeholder-white/60 focus:border-white/40 focus:bg-white/15 outline-none transition"
                      value={commentText} 
                      onChange={(e) => setCommentText(e.target.value)} 
                      onFocus={() => setIsPaused(true)} 
                      onBlur={() => !commentText && setIsPaused(false)}
                    />
                    <Smile className="absolute right-4 top-1/2 -translate-y-1/2 w-6 h-6 text-white/70 cursor-pointer hover:text-white" />
                </div>
                {commentText ? (
                    <button onClick={() => { 
                        setCommentText(''); 
                        setIsPaused(false); 
                        setShowSentNotification(true);
                        setTimeout(() => setShowSentNotification(false), 2500);
                    }} className="bg-emerald-600 text-white p-3 rounded-full transition transform hover:scale-110 shadow-lg"><Send className="w-6 h-6 rotate-180" /></button>
                ) : (
                    <button onClick={() => { setIsStoryLiked(!isStoryLiked); if (!isStoryLiked) triggerEmoji("💚"); }} className={`p-3 rounded-full transition-all duration-300 transform hover:scale-110 shadow-lg ${isStoryLiked ? 'bg-green-700 text-white' : 'bg-white/10 backdrop-blur-md text-white border border-white/10 hover:bg-white/20'}`}>
                        <Heart className={`w-7 h-7 ${isStoryLiked ? 'fill-current' : ''}`} />
                    </button>
                )}
            </div>
        </div>
    </div>,
    document.body
  );
};

export default StoryViewer;
