import React from 'react';
import { createPortal } from 'react-dom';
import ChatWindow from './ChatWindow';
import { User, Story } from '../types';
import { Check, Info, X, Play, Pause, ChevronRight, ChevronLeft, Heart, Send, Smile, AlertCircle } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

interface AppOverlaysProps {
  activeChats: User[];
  currentUser: User;
  handleCloseChat: (id: string) => void;
  appNotification: {message: string, type: 'success' | 'info' | 'error'} | null;
  setAppNotification: (val: {message: string, type: 'success' | 'info' | 'error'} | null) => void;
  viewingStoryIndex: number | null;
  setViewingStoryIndex: (val: number | null) => void;
  stories: Story[];
  storyProgress: number;
  isStoryPaused: boolean;
  setIsStoryPaused: (val: boolean) => void;
  handlePrevStory: () => void;
  handleNextStory: () => void;
}

const AppOverlays: React.FC<AppOverlaysProps> = ({
  activeChats,
  currentUser,
  handleCloseChat,
  // appNotification and setAppNotification are kept in props for compatibility but not rendered to prevent duplication
  appNotification,
  setAppNotification,
  viewingStoryIndex,
  setViewingStoryIndex,
  stories,
  storyProgress,
  isStoryPaused,
  setIsStoryPaused,
  handlePrevStory,
  handleNextStory
}) => {
  const { t, dir, language } = useLanguage();

  return (
    <>
      {/* Chat Windows Layer */}
      {activeChats.map((user, index) => (
        <ChatWindow 
          key={user.id}
          user={user} 
          currentUser={currentUser}
          index={index} 
          onClose={() => handleCloseChat(user.id)} 
        />
      ))}

      {/* 
        Notification Rendering Logic:
        The legacy 'appNotification' portal has been removed from here to solve the duplication issue.
        Notifications are now handled globally by the NotificationProvider (Toast System) in NotificationContext.tsx.
        This ensures only one notification instance appears at a time.
      */}

      {/* Full Screen Story Viewer Overlay */}
      {viewingStoryIndex !== null && stories[viewingStoryIndex] && (
          <div className="fixed inset-0 z-[200000] bg-black text-white flex flex-col animate-fadeIn overflow-hidden touch-none">
              {/* Header / Progress Bar */}
              <div className="absolute top-0 left-0 w-full p-4 bg-gradient-to-b from-black/80 to-transparent z-20">
                  <div className="flex gap-1 mb-3">
                       <div className="h-1 w-full bg-white/30 rounded-full overflow-hidden">
                           <div 
                              className="h-full bg-white transition-all duration-100 ease-linear shadow-[0_0_10px_rgba(255,255,255,0.5)]" 
                              style={{ width: `${storyProgress}%` }}
                           ></div>
                       </div>
                  </div>
                  <div className="flex justify-between items-center px-1" dir={dir}>
                      <div className="flex items-center gap-3">
                          <img 
                            src={stories[viewingStoryIndex].userAvatar} 
                            className="w-10 h-10 rounded-full border border-white/50 shadow-md object-cover"
                            alt="avatar" 
                          />
                          <div className="flex flex-col drop-shadow-md">
                               <span className="font-bold text-sm">{stories[viewingStoryIndex].userName}</span>
                               <span className="text-xs text-white/80">{stories[viewingStoryIndex].timestamp}</span>
                          </div>
                      </div>
                      <div className="flex items-center gap-4">
                          <button 
                            onClick={() => setIsStoryPaused(!isStoryPaused)} 
                            className="p-1 hover:bg-white/10 rounded-full transition"
                          >
                            {isStoryPaused ? <Play className="w-6 h-6 fill-current" /> : <Pause className="w-6 h-6 fill-current" />}
                          </button>
                          <button 
                            onClick={() => setViewingStoryIndex(null)} 
                            className="p-1 hover:bg-white/10 rounded-full transition"
                          >
                            <X className="w-8 h-8" />
                          </button>
                      </div>
                  </div>
              </div>

              {/* Main Story Content */}
              <div className="flex-1 flex items-center justify-center relative bg-gray-900 overflow-hidden">
                  {/* Media Content */}
                  {stories[viewingStoryIndex].mediaUrl.startsWith('data:video') || stories[viewingStoryIndex].mediaUrl.endsWith('.mp4') || stories[viewingStoryIndex].mediaUrl.endsWith('.webm') ? (
                     <video 
                        src={stories[viewingStoryIndex].mediaUrl} 
                        className="w-full h-full object-contain select-none pointer-events-none"
                        autoPlay
                        muted={false}
                        playsInline
                        onEnded={handleNextStory}
                     />
                  ) : (
                     <img 
                        src={stories[viewingStoryIndex].mediaUrl} 
                        alt="Story" 
                        className="w-full h-full object-contain select-none pointer-events-none"
                      />
                  )}
                  
                  {/* Navigation Touch Zones */}
                  <div className="absolute inset-0 flex z-10">
                      <div 
                        className="w-1/3 h-full cursor-pointer active:bg-white/5 transition-colors duration-100" 
                        onClick={handlePrevStory}
                      ></div>
                      <div 
                        className="w-1/3 h-full cursor-pointer"
                        onClick={() => setIsStoryPaused(!isStoryPaused)}
                      ></div>
                      <div 
                        className="w-1/3 h-full cursor-pointer active:bg-white/5 transition-colors duration-100" 
                        onClick={handleNextStory}
                      ></div>
                  </div>

                  {/* Desktop Navigation Arrows */}
                  <div className="hidden md:block">
                    {viewingStoryIndex > 0 && (
                        <button 
                            onClick={(e) => { e.stopPropagation(); handlePrevStory(); }} 
                            className="absolute left-4 top-1/2 -translate-y-1/2 p-3 bg-white/10 hover:bg-white/20 backdrop-blur-md rounded-full z-20 transition transform hover:scale-110"
                        >
                            <ChevronLeft className="w-8 h-8" />
                        </button>
                    )}
                    <button 
                        onClick={(e) => { e.stopPropagation(); handleNextStory(); }} 
                        className="absolute right-4 top-1/2 -translate-y-1/2 p-3 bg-white/10 hover:bg-white/20 backdrop-blur-md rounded-full z-20 transition transform hover:scale-110"
                    >
                        <ChevronRight className="w-8 h-8" />
                    </button>
                  </div>
              </div>

              {/* Footer / Reply Section */}
              <div className="w-full bg-gradient-to-t from-black via-black/80 to-transparent pt-12 pb-6 px-4 z-40 flex flex-col gap-3" dir={dir}>
                   <div className="flex items-center gap-3 max-w-2xl mx-auto w-full">
                      <div className="flex-1 relative group">
                          <input 
                            type="text" 
                            placeholder={t.story_reply_placeholder || (language === 'ar' ? 'رد على القصة...' : 'Reply to story...')}
                            className="w-full bg-white/10 border border-white/20 rounded-full py-3 px-5 ltr:pr-12 rtl:pl-12 text-white placeholder-white/60 focus:border-white/50 focus:bg-white/20 outline-none transition-all shadow-lg backdrop-blur-sm"
                            onFocus={() => setIsStoryPaused(true)}
                            onBlur={() => setIsStoryPaused(false)}
                          />
                          <Smile className={`absolute top-1/2 -translate-y-1/2 w-6 h-6 text-white/70 cursor-pointer hover:text-white transition ${dir === 'rtl' ? 'left-4' : 'right-4'}`} />
                      </div>
                      <button className="p-3 rounded-full text-white hover:bg-white/10 bg-white/5 backdrop-blur-md transition active:scale-95 border border-white/10">
                        <Heart className="w-6 h-6" />
                      </button>
                      <button className="p-3 rounded-full text-white hover:bg-white/10 bg-white/5 backdrop-blur-md transition active:scale-95 border border-white/10">
                        <Send className={`w-6 h-6 ${dir === 'rtl' ? 'rotate-180' : ''}`} />
                      </button>
                   </div>
              </div>
          </div>
      )}
    </>
  );
};

export default AppOverlays;