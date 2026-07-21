
import React, { useRef, useState } from 'react';
import { Plus, X, AlertCircle } from 'lucide-react';
import { User, Story } from '../types';

// Constants for Validation
const MAX_FILE_SIZE = 1024 * 1024 * 1024; // 1GB
const ALLOWED_FILE_TYPES = ['image/jpeg', 'image/png', 'image/gif', 'image/webp', 'video/mp4', 'video/webm', 'video/ogg'];

export interface UserStoryGroup {
    userId: string;
    userName: string;
    userAvatar: string;
    stories: Story[];
    latestTimestamp: number;
}

interface StoryReelProps {
  currentUser: User;
  groups: UserStoryGroup[];
  onAddStory: (mediaUrl: string) => void;
  onViewStory: (index: number) => void;
}

const StoryReel: React.FC<StoryReelProps> = ({ currentUser, groups, onAddStory, onViewStory }) => {
  const storyInputRef = useRef<HTMLInputElement>(null);
  const [uploadError, setUploadError] = useState<string | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      setUploadError(null);
      const file = e.target.files?.[0];
      if (file) {
          if (!ALLOWED_FILE_TYPES.includes(file.type)) {
              setUploadError('نوع الملف غير مدعوم. يرجى اختيار صورة أو فيديو صالح.');
              e.target.value = '';
              return;
          }

          if (file.size > MAX_FILE_SIZE) {
              setUploadError('حجم الملف كبير جداً. الحد الأقصى هو 1 جيجابايت.');
              e.target.value = '';
              return;
          }

          const reader = new FileReader();
          reader.onloadend = () => {
              if (typeof reader.result === 'string') {
                  onAddStory(reader.result);
              }
          };
          reader.readAsDataURL(file);
      }
      e.target.value = ''; 
  };

  const isVideo = (url: string) => {
      return url.startsWith('data:video') || url.endsWith('.mp4') || url.endsWith('.webm') || url.endsWith('.ogg');
  };

  const renderSegmentedCircle = (count: number, avatarUrl: string) => {
      const strokeColor = '#047857'; // Emerald-700
      const radius = 22;
      const circumference = 2 * Math.PI * radius;
      const gap = count > 1 ? 5 : 0;
      const totalGap = gap * count;
      const dashLength = (circumference - totalGap) / count;

      return (
          <div className="relative w-10 h-10 flex-shrink-0">
              <svg viewBox="0 0 52 52" className="absolute inset-0 w-full h-full transform -rotate-90">
                  <defs>
                      <linearGradient id="storyGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                          <stop offset="0%" stopColor="#047857" />
                          <stop offset="100%" stopColor="#065F46" />
                      </linearGradient>
                  </defs>
                  {count === 1 ? (
                      <circle cx="26" cy="26" r={radius} fill="none" stroke="url(#storyGradient)" strokeWidth="3" />
                  ) : (
                      Array.from({ length: count }).map((_, i) => (
                          <circle
                              key={i}
                              cx="26" cy="26" r={radius}
                              fill="none"
                              stroke={strokeColor}
                              strokeWidth="3"
                              strokeDasharray={`${Math.max(0, dashLength)} ${gap}`}
                              strokeDashoffset={-((dashLength + gap) * i)}
                              strokeLinecap="round"
                          />
                      ))
                  )}
              </svg>
              <img 
                  src={avatarUrl} 
                  className="absolute inset-[5px] w-[calc(100%-10px)] h-[calc(100%-10px)] rounded-full object-cover border-2 border-white dark:border-gray-800"
                  alt="avatar"
              />
          </div>
      );
  };

  return (
    <>
      <input 
        type="file" 
        ref={storyInputRef} 
        className="hidden" 
        accept="image/*,video/mp4,video/webm" 
        onChange={handleFileChange} 
      />

      {uploadError && (
          <div className="bg-red-50 text-red-700 px-4 py-3 rounded-lg mb-4 flex items-center justify-between border border-red-100 shadow-sm animate-fadeIn">
              <div className="flex items-center gap-2">
                  <AlertCircle className="w-5 h-5" />
                  <span className="text-sm font-medium">{uploadError}</span>
              </div>
              <button onClick={() => setUploadError(null)} className="p-1 hover:bg-red-100 rounded-full">
                  <X className="w-4 h-4" />
              </button>
          </div>
      )}

      <div className="flex gap-2 overflow-x-auto pb-4 no-scrollbar mb-2 px-4 md:px-0 scroll-smooth">
         {/* Add Story Card */}
         <div 
            className="relative h-48 w-28 md:w-32 rounded-xl overflow-hidden cursor-pointer shadow-sm flex-shrink-0 group bg-gray-100 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 hover:opacity-95 transition"
         >
             <div className="h-2/3 w-full relative" onClick={() => storyInputRef.current?.click()}>
                 <img src={currentUser.avatar} className="h-full w-full object-cover transition duration-300 group-hover:scale-105 opacity-80" alt="My Story" />
                 <div className="absolute inset-0 bg-black/10 group-hover:bg-transparent transition"></div>
             </div>
             <div className="h-1/3 bg-white dark:bg-gray-800 relative z-10" onClick={() => storyInputRef.current?.click()}>
                 <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-emerald-700 rounded-full p-1 border-4 border-white dark:border-gray-800">
                     <Plus className="h-4 w-4 text-white" />
                 </div>
                 <div className="absolute bottom-0 w-full flex flex-col items-center justify-end pb-2">
                     <span className="text-xs font-semibold text-gray-900 dark:text-white">إنشاء قصة</span>
                 </div>
             </div>
         </div>

         {/* Render Grouped Stories */}
         {groups.map((group, index) => (
             <div 
                key={group.userId} 
                onClick={() => onViewStory(index)}
                className="relative h-48 w-28 md:w-32 rounded-xl overflow-hidden cursor-pointer shadow-sm flex-shrink-0 group border border-gray-200 dark:border-gray-700"
             >
                {/* Show LATEST story as thumbnail (First element now as sorting is descending) */}
                {group.stories.length > 0 && (
                    isVideo(group.stories[0].mediaUrl) ? (
                        <video 
                            src={group.stories[0].mediaUrl} 
                            className="h-full w-full object-cover transition duration-300 group-hover:scale-105"
                            muted
                        />
                    ) : (
                        <img 
                            src={group.stories[0].mediaUrl} 
                            className="h-full w-full object-cover transition duration-300 group-hover:scale-105" 
                            alt="Story" 
                        />
                    )
                )}
                
                <div className="absolute top-2 left-2 z-20">
                    {renderSegmentedCircle(group.stories.length, group.userAvatar)}
                </div>
                
                <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black/60 group-hover:to-black/70 transition"></div>
                <div className="absolute bottom-2 right-2 text-white font-semibold text-xs drop-shadow-md truncate w-11/12 text-right pr-2">
                    {group.userId === currentUser.id ? 'قصتك' : group.userName}
                </div>
             </div>
         ))}
      </div>
    </>
  );
};

export default StoryReel;
