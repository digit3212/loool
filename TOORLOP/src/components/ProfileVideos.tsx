import React, { useState, useRef, useEffect, useMemo } from 'react';
import { createPortal } from 'react-dom';
import { Video, Film, Plus, Play, Clock, Eye, Check, X, Copy, Facebook, Twitter, Phone, Share2, Globe, Link as LinkIcon } from 'lucide-react';
import { User, VideoItem } from '../types';
import { useLanguage } from '../context/LanguageContext';
import PrivacySelect, { PrivacyLevel } from './PrivacySelect';
import VideoLightbox from './VideoLightbox';

interface ProfileVideosProps {
  currentUser: User;
  isOwnProfile: boolean;
  savedVideos?: VideoItem[];
  onToggleSaveVideo?: (video: VideoItem) => void;
  userVideos?: VideoItem[];
  onAddVideo?: (video: VideoItem) => void;
  onDeleteVideo?: (videoId: string) => void;
  onLikeVideo?: (videoId: string, reactionType?: string) => void;
  onCommentVideo?: (videoId: string, text: string) => void;
  onDeleteVideoComment?: (videoId: string, commentId: string) => void;
  onLikeVideoComment?: (videoId: string, commentId: string) => void;
}

const ProfileVideos: React.FC<ProfileVideosProps> = ({ 
    currentUser, 
    isOwnProfile,
    savedVideos = [],
    onToggleSaveVideo,
    userVideos = [], 
    onAddVideo,
    onDeleteVideo,
    onLikeVideo,
    onCommentVideo,
    onDeleteVideoComment,
    onLikeVideoComment
}) => {
  const [activeTab, setActiveTab] = useState<'videos' | 'reels'>('videos');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const videos = useMemo(() => userVideos.filter(v => v.type === 'video'), [userVideos]);
  const reels = useMemo(() => userVideos.filter(v => v.type === 'reel'), [userVideos]);

  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [activeVideoIndex, setActiveVideoIndex] = useState(0);
  const [activePlaylist, setActivePlaylist] = useState<VideoItem[]>([]);

  const [uploadPrivacy, setUploadPrivacy] = useState<PrivacyLevel>('public');

  const [showShareModal, setShowShareModal] = useState(false);
  const [copyFeedback, setCopyFeedback] = useState(false);

  // Sync active playlist on external updates if open
  useEffect(() => {
      if (lightboxOpen) {
          if (activeTab === 'videos') setActivePlaylist(videos);
          else setActivePlaylist(reels);
      }
  }, [videos, reels, activeTab, lightboxOpen]);

  const getVideoMetadata = (url: string): Promise<{ duration: number, width: number, height: number }> => {
    return new Promise((resolve) => {
        const video = document.createElement('video');
        video.preload = 'metadata';
        video.onloadedmetadata = () => {
            window.URL.revokeObjectURL(video.src);
            resolve({ 
                duration: video.duration, 
                width: video.videoWidth, 
                height: video.videoHeight 
            });
        };
        video.src = url;
    });
  };

  const formatDuration = (seconds: number) => {
      const min = Math.floor(seconds / 60);
      const sec = Math.floor(seconds % 60);
      return `${min}:${sec < 10 ? '0' : ''}${sec}`;
  };

  const handleFileClick = () => {
      fileInputRef.current?.click();
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (file && onAddVideo) {
          const reader = new FileReader();
          reader.onloadend = async () => {
              const base64 = reader.result as string;
              try {
                  const meta = await getVideoMetadata(base64);
                  const isReel = meta.height > meta.width;
                  const detectedType = isReel ? 'reel' : 'video';

                  const newItem: VideoItem = {
                      id: `vid_direct_${Date.now()}`,
                      url: base64,
                      title: isReel ? 'ريلز جديد' : 'فيديو جديد',
                      views: 0,
                      timestamp: 'الآن',
                      duration: formatDuration(meta.duration),
                      type: detectedType,
                      likes: 0,
                      comments: [],
                      isLiked: false
                  };

                  onAddVideo(newItem);
                  
                  if (detectedType === 'video') {
                      setActiveTab('videos');
                  } else {
                      setActiveTab('reels');
                  }
              } catch (err) {
                  console.error("Failed to load video metadata", err);
              }
          };
          reader.readAsDataURL(file);
      }
      e.target.value = '';
  };

  const handleDelete = (id: string) => {
     if (lightboxOpen) setLightboxOpen(false);
     setTimeout(() => {
         if (onDeleteVideo) {
             onDeleteVideo(id);
         }
     }, 100);
  };

  const openLightbox = (index: number, playlist: VideoItem[]) => {
      setActivePlaylist(playlist);
      setActiveVideoIndex(index);
      setLightboxOpen(true);
  };

  const closeLightbox = () => {
      setLightboxOpen(false);
      setActivePlaylist([]);
  };

  const nextVideo = (e?: React.MouseEvent) => {
      e?.stopPropagation();
      const newIndex = (activeVideoIndex + 1) % activePlaylist.length;
      setActiveVideoIndex(newIndex);
  };

  const prevVideo = (e?: React.MouseEvent) => {
      e?.stopPropagation();
      const newIndex = (activeVideoIndex - 1 + activePlaylist.length) % activePlaylist.length;
      setActiveVideoIndex(newIndex);
  };

  const handleSaveVideo = () => {
      if (onToggleSaveVideo && activePlaylist[activeVideoIndex]) {
          onToggleSaveVideo(activePlaylist[activeVideoIndex]);
      }
  };

  const onShareClick = () => {
      setShowShareModal(true);
  };

  const handleCopyLink = () => {
      const link = activePlaylist[activeVideoIndex]?.url || '';
      if(link) {
        navigator.clipboard.writeText(link).then(() => {
            setCopyFeedback(true);
            setTimeout(() => setCopyFeedback(false), 2000);
            setShowShareModal(false);
        });
      }
  };

  const currentVideo = activePlaylist[activeVideoIndex];
  const isCurrentVideoSaved = currentVideo ? savedVideos.some(v => v.id === currentVideo.id) : false;

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm min-h-[500px] animate-fadeIn p-4 relative">
       <input 
          type="file" 
          ref={fileInputRef} 
          className="hidden" 
          accept="video/*" 
          onChange={handleFileChange} 
       />

       {/* Copy Feedback Toast */}
       {copyFeedback && (
          <div className="fixed top-14 left-1/2 transform -translate-x-1/2 z-[120000] bg-emerald-700 text-white px-4 py-2 rounded-md shadow-lg text-sm flex items-center gap-2 animate-fadeIn">
              <Check className="w-4 h-4" />
              تم نسخ الرابط
          </div>
       )}

       <div className="flex items-center justify-between mb-2">
           <h2 className="text-xl font-bold text-gray-900 dark:text-white">مقاطع الفيديو/ريلز</h2>
           {isOwnProfile && (
                <div className="flex gap-3 items-center">
                    <PrivacySelect value={uploadPrivacy} onChange={setUploadPrivacy} small />

                    <button 
                    onClick={handleFileClick}
                    className="flex items-center gap-2 bg-fb-blue text-white px-3 py-1.5 rounded-md font-semibold text-sm hover:bg-blue-700 transition"
                    >
                        <Plus className="w-4 h-4" />
                        <span>إضافة فيديو</span>
                    </button>
                </div>
           )}
       </div>

       <div className="flex items-center gap-1 md:gap-4 overflow-x-auto no-scrollbar mb-4 border-b border-gray-200 dark:border-gray-700 pb-2">
            <button 
                onClick={() => setActiveTab('videos')}
                className={`px-4 py-2 font-semibold rounded-md transition whitespace-nowrap flex items-center gap-2 ${activeTab === 'videos' ? 'text-fb-blue bg-blue-50 dark:bg-blue-900/20' : 'text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'}`}
            >
                <Video className="w-4 h-4" />
                <span>مقاطع الفيديو</span>
            </button>
            <button 
                onClick={() => setActiveTab('reels')}
                className={`px-4 py-2 font-semibold rounded-md transition whitespace-nowrap flex items-center gap-2 ${activeTab === 'reels' ? 'text-fb-blue bg-blue-50 dark:bg-blue-900/20' : 'text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'}`}
            >
                <Film className="w-4 h-4" />
                <span>ريلز (Reels)</span>
            </button>
       </div>

       <div className="mt-4">
           {activeTab === 'videos' && (
               videos.length > 0 ? (
                   <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                       {videos.map((video, idx) => (
                           <div 
                                key={video.id} 
                                className="group relative bg-gray-50 dark:bg-gray-900 rounded-lg overflow-hidden border border-gray-200 dark:border-gray-700 cursor-pointer"
                                onClick={() => openLightbox(idx, videos)}
                            >
                               <div className="aspect-video bg-black relative">
                                   <video src={video.url} className="w-full h-full object-contain pointer-events-none" />
                                   <div className="absolute inset-0 bg-black/20 group-hover:bg-transparent transition flex items-center justify-center">
                                       <div className="bg-black/50 p-3 rounded-full backdrop-blur-sm group-hover:scale-110 transition">
                                            <Play className="w-8 h-8 text-white fill-white" />
                                       </div>
                                   </div>
                                   <div className="absolute bottom-2 right-2 bg-black/70 text-white text-xs px-2 py-0.5 rounded">
                                       {video.duration}
                                   </div>
                               </div>
                               <div className="p-3">
                                   <h3 className="font-bold text-gray-900 dark:text-white text-sm mb-1">{video.title}</h3>
                                   <div className="flex items-center text-xs text-gray-500 dark:text-gray-400 gap-3">
                                       <span className="flex items-center gap-1"><Eye className="w-3 h-3" /> {video.views} مشاهدة</span>
                                       <span className="flex items-center gap-1"><Clock className="w-3 h-3" /> {video.timestamp}</span>
                                   </div>
                               </div>
                           </div>
                       ))}
                   </div>
               ) : (
                   <div className="text-center py-20 bg-gray-50 dark:bg-gray-900 rounded-lg border-2 border-dashed border-gray-200 dark:border-gray-700">
                       <Video className="w-16 h-16 mx-auto text-gray-300 dark:text-gray-600 mb-3" />
                       <h3 className="text-lg font-bold text-gray-600 dark:text-gray-300">لا توجد مقاطع فيديو</h3>
                   </div>
               )
           )}

           {activeTab === 'reels' && (
               reels.length > 0 ? (
                   <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                       {reels.map((reel, idx) => (
                           <div 
                                key={reel.id} 
                                className="group relative bg-black rounded-lg overflow-hidden aspect-[9/16] shadow-md cursor-pointer"
                                onClick={() => openLightbox(idx, reels)}
                           >
                               <video src={reel.url} className="w-full h-full object-cover opacity-90 group-hover:opacity-100 transition pointer-events-none" />
                               <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-white/20 p-3 rounded-full backdrop-blur-sm opacity-0 group-hover:opacity-100 transition">
                                   <Play className="w-6 h-6 text-white fill-current" />
                               </div>
                           </div>
                       ))}
                   </div>
               ) : (
                   <div className="text-center py-20 bg-gray-50 dark:bg-gray-900 rounded-lg border-2 border-dashed border-gray-200 dark:border-gray-700">
                       <Film className="w-16 h-16 mx-auto text-gray-300 dark:text-gray-600 mb-3" />
                       <h3 className="text-lg font-bold text-gray-600 dark:text-gray-300">لا توجد مقاطع ريلز</h3>
                   </div>
               )
           )}
       </div>

       {/* Video Lightbox via Portal */}
       {lightboxOpen && currentVideo && typeof document !== 'undefined' && createPortal(
          <VideoLightbox 
             video={currentVideo}
             onClose={closeLightbox}
             onNext={nextVideo}
             onPrev={prevVideo}
             hasNext={activePlaylist.length > 1}
             hasPrev={activePlaylist.length > 1}
             currentUser={currentUser}
             isOwnProfile={isOwnProfile}
             isSaved={isCurrentVideoSaved}
             onToggleSave={handleSaveVideo}
             onLike={(reactionType) => onLikeVideo && onLikeVideo(currentVideo.id, reactionType)}
             onComment={(text) => onCommentVideo && onCommentVideo(currentVideo.id, text)}
             onDeleteComment={(commentId) => onDeleteVideoComment && onDeleteVideoComment(currentVideo.id, commentId)}
             onLikeComment={(commentId) => onLikeVideoComment && onLikeVideoComment(currentVideo.id, commentId)}
             onDeleteVideo={() => handleDelete(currentVideo.id)}
             onShare={onShareClick}
             onCopyLink={handleCopyLink}
          />,
          document.body
       )}

      {/* SHARE MODAL - Fixed Order matching screenshot */}
      {showShareModal && typeof document !== 'undefined' && createPortal(
          <div className="fixed inset-0 z-[110000] bg-black/60 flex items-center justify-center p-4 animate-fadeIn backdrop-blur-sm" onClick={() => setShowShareModal(false)}>
              <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl w-full max-w-md overflow-hidden animate-scaleIn border border-gray-100 dark:border-gray-700" onClick={e => e.stopPropagation()}>
                  
                  {/* Header - SWAPPED: Title Right, X Left */}
                  <div className="p-4 border-b border-gray-50 dark:border-gray-700 flex justify-between items-center bg-gray-50/50 dark:bg-gray-700/50">
                      {/* Title Group - First in DOM (Right side in RTL) */}
                      <h3 className="font-bold text-lg text-[#050505] dark:text-white flex items-center gap-2">
                          <Share2 className="w-5 h-5 text-emerald-700 dark:text-emerald-500" />
                          مشاركة هذا الفيديو
                      </h3>
                      {/* X Button - Second in DOM (Left side in RTL) */}
                      <button onClick={() => setShowShareModal(false)} className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 transition">
                          <X className="w-5 h-5" />
                      </button>
                  </div>

                  <div className="p-8">
                      {/* Social Icons Row */}
                      <div className="flex justify-between items-center mb-10">
                          {/* Copy */}
                          <button onClick={handleCopyLink} className="flex flex-col items-center gap-2 group">
                              <div className="w-14 h-14 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center text-gray-700 dark:text-gray-200 shadow-md transition transform group-hover:scale-110 group-active:scale-95 border border-white dark:border-gray-600">
                                  <LinkIcon className="w-6 h-6" />
                              </div>
                              <span className="text-xs font-bold text-gray-500 dark:text-gray-400">نسخ</span>
                          </button>

                          {/* X (Twitter) */}
                          <button className="flex flex-col items-center gap-2 group" onClick={() => window.open(`https://twitter.com/intent/tweet?url=${encodeURIComponent(currentVideo?.url || '')}`, '_blank')}>
                              <div className="w-14 h-14 bg-black rounded-full flex items-center justify-center text-white shadow-lg transition transform group-hover:scale-110 group-active:scale-95">
                                  <Twitter className="w-6 h-6" />
                              </div>
                              <span className="text-xs font-bold text-gray-500 dark:text-gray-400">X (Twitter)</span>
                          </button>

                          {/* WhatsApp */}
                          <button className="flex flex-col items-center gap-2 group" onClick={() => window.open(`https://api.whatsapp.com/send?text=${encodeURIComponent(currentVideo?.url || '')}`, '_blank')}>
                              <div className="w-14 h-14 bg-[#25D366] rounded-full flex items-center justify-center text-white shadow-lg transition transform group-hover:scale-110 group-active:scale-95">
                                  <Phone className="w-7 h-7 fill-current" />
                              </div>
                              <span className="text-xs font-bold text-gray-500 dark:text-gray-400">واتساب</span>
                          </button>

                          {/* Facebook */}
                          <button className="flex flex-col items-center gap-2 group" onClick={() => window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(currentVideo?.url || '')}`, '_blank')}>
                              <div className="w-14 h-14 bg-[#1877F2] rounded-full flex items-center justify-center text-white shadow-lg transition transform group-hover:scale-110 group-active:scale-95">
                                  <Facebook className="w-7 h-7 fill-current" />
                              </div>
                              <span className="text-xs font-bold text-gray-500 dark:text-gray-400">فيسبوك</span>
                          </button>
                      </div>

                      {/* Link Input Section */}
                      <div className="space-y-2">
                          <label className="text-xs font-bold text-gray-400 uppercase tracking-wider px-1 text-right block">رابط الفيديو</label>
                          <div className="flex items-center gap-2 bg-[#f0f2f5] dark:bg-gray-900 p-2 rounded-xl border border-gray-100 dark:border-gray-700 shadow-inner">
                              <button onClick={handleCopyLink} className="bg-[#064e3b] text-white px-5 py-2 rounded-lg text-sm font-bold hover:bg-emerald-800 transition active:scale-95">نسخ</button>
                              <input 
                                 type="text" 
                                 readOnly 
                                 value={currentVideo?.url || ''} 
                                 className="bg-transparent border-none outline-none text-xs text-gray-500 dark:text-gray-400 flex-1 truncate text-left dir-ltr" 
                              />
                              <LinkIcon className="w-4 h-4 text-gray-400 ml-1" />
                          </div>
                      </div>
                  </div>

                  {/* Footer */}
                  <div className="p-4 bg-gray-50 dark:bg-gray-800/80 border-t border-gray-100 dark:border-gray-700 flex items-center justify-center gap-2 text-gray-400">
                      <span className="text-[11px] font-bold text-gray-500">سيتم فتح الروابط في نافذة جديدة</span>
                      <Globe className="w-4 h-4" />
                  </div>
              </div>
          </div>,
          document.body
      )}

    </div>
  );
};

export default ProfileVideos;