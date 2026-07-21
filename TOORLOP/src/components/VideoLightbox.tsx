import React, { useState, useRef, useEffect } from 'react';
import { 
  X, ChevronRight, ChevronLeft, PictureInPicture, MoreHorizontal, Bookmark, 
  BookmarkMinus, MessageCircle, Globe, Users, UserPlus, Lock, Bell, BellOff, 
  Share2, Download, Trash2, ThumbsUp, Send, Smile, AtSign, ArrowRight 
} from 'lucide-react';
import { User, VideoItem } from '../types';
import { useLanguage } from '../context/LanguageContext';

type MenuView = 'main' | 'audience' | 'comments';
type AudienceType = 'public' | 'friends' | 'friends_of_friends' | 'only_me';
type CommentAudienceType = 'public' | 'friends' | 'mentions';

// Enhanced Reactions List with Animation Classes
const REACTIONS = [
    { name: 'like', label: 'إعجاب', emoji: '👍', color: 'text-blue-600', animation: 'animate-bounce' },
    { name: 'love', label: 'أحببته', emoji: '❤️', color: 'text-red-600', animation: 'animate-pulse' },
    { name: 'care', label: 'أدعمك', emoji: '🥰', color: 'text-yellow-500', animation: 'animate-bounce' },
    { name: 'haha', label: 'هاها', emoji: '😆', color: 'text-yellow-500', animation: 'animate-bounce' },
    { name: 'wow', label: 'واو', emoji: '😮', color: 'text-yellow-500', animation: 'animate-pulse' },
    { name: 'sad', label: 'أحزنني', emoji: '😢', color: 'text-yellow-500', animation: 'animate-bounce' },
    { name: 'angry', label: 'أغضبني', emoji: '😡', color: 'text-orange-600', animation: 'animate-bounce' },
];

// Extensive Emoji List for Picker
const EMOJI_LIST = [
  "😀","😃","😄","😁","😆","😅","🤣","😂","🙂","🙃","😉","😊","😇","🥰","😍","🤩","😘","😗","☺","😚","😙","🥲","😋","😛","😜","🤪","😝","🤑","🤗","🤭","🤫","🤔","🤐","🤨","😐","😑","😶","😏","😒","🙄","😬","🤥","😌","😔","😪","🤤","😴","😷","🤒","🤕","🤢","🤮","🤧","🥵","🥶","🥴","😵","🤯","🤠","🥳","😎","🤓","🧐","😕","😟","🙁","☹","😮","😯","😲","😳","🥺","😦","😧","😨","😰","😥","😢","😭","😱","😖","😣","😞","😓","😩","😫","🥱","😤","😡","😠","🤬","😈","👿","💀","☠","💩","🤡","👹","👺","👻","👽","👾","🤖","😺","😸","😹","😻","😼","😽","🙀","😿","😾","🙈","🙉","🙊","💋","💌","💘","💝","💖","💗","💓","💞","💕","💟","❣","💔","❤","🧡","💛","💚","💙","💜","🤎","🖤","🤍","💯","💢","💥","💫","💦","💨","🕳","💣","💬","👁️‍🗨️","🗨","🗯","💭","💤"
];

interface VideoLightboxProps {
  video: VideoItem;
  onClose: () => void;
  onNext?: (e: React.MouseEvent) => void;
  onPrev?: (e: React.MouseEvent) => void;
  hasNext: boolean;
  hasPrev: boolean;
  currentUser: User;
  isOwnProfile: boolean;
  isSaved: boolean;
  onToggleSave: () => void;
  onLike: (reactionType?: string) => void;
  onComment: (text: string) => void;
  onDeleteComment: (commentId: string) => void;
  onLikeComment?: (commentId: string) => void;
  onDeleteVideo: () => void;
  onShare: () => void;
  onCopyLink: () => void;
}

const VideoLightbox: React.FC<VideoLightboxProps> = ({
  video,
  onClose,
  onNext,
  onPrev,
  hasNext,
  hasPrev,
  currentUser,
  isOwnProfile,
  isSaved,
  onToggleSave,
  onLike,
  onComment,
  onDeleteComment,
  onLikeComment,
  onDeleteVideo,
  onShare,
  onCopyLink
}) => {
  const { t, dir } = useLanguage();
  
  // UI State
  const [showMenu, setShowMenu] = useState(false); 
  const [menuView, setMenuView] = useState<MenuView>('main');
  const [notificationsOn, setNotificationsOn] = useState(true);
  const [audience, setAudience] = useState<AudienceType>('public');
  const [commentAudience, setCommentAudience] = useState<CommentAudienceType>('public');

  // Interaction State
  const [commentInput, setCommentInput] = useState('');
  const [replyingToId, setReplyingToId] = useState<string | null>(null);
  const [replyText, setReplyText] = useState('');
  const [deleteCommentId, setDeleteCommentId] = useState<string | null>(null);

  // Reactions State
  const [isLiked, setIsLiked] = useState(video.isLiked);
  const [likesCount, setLikesCount] = useState(video.likes);
  const [showReactions, setShowReactions] = useState(false);
  const [currentReaction, setCurrentReaction] = useState<{ name: string; label: string; emoji: string; color: string; animation?: string } | null>(video.isLiked ? (REACTIONS.find(r => r.name === video.reaction) || REACTIONS[0]) : null);
  const [animateLike, setAnimateLike] = useState(false);

  // Emoji Picker State
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);

  // Refs
  const videoPlayerRef = useRef<HTMLVideoElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);
  const commentsEndRef = useRef<HTMLDivElement>(null);
  const commentInputRef = useRef<HTMLInputElement>(null);
  const reactionTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const emojiPickerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Sync local state with prop changes
    setIsLiked(video.isLiked);
    setLikesCount(video.likes);
    if (video.isLiked && (!currentReaction || currentReaction.name !== video.reaction)) {
        setCurrentReaction(REACTIONS.find(r => r.name === video.reaction) || REACTIONS[0]);
    } else if (!video.isLiked) {
        setCurrentReaction(null);
    }
  }, [video.isLiked, video.likes, video.reaction]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
        if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
            setShowMenu(false);
            setMenuView('main');
        }
        if (emojiPickerRef.current && !emojiPickerRef.current.contains(event.target as Node)) {
            setShowEmojiPicker(false);
        }
    };
    if (showMenu || showEmojiPicker) {
        document.addEventListener('mousedown', handleClickOutside);
    }
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [showMenu, showEmojiPicker]);

  useEffect(() => {
      commentsEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [video.comments]);

  const handleLike = () => {
    setAnimateLike(true);
    setTimeout(() => setAnimateLike(false), 300);

    const newIsLiked = !isLiked;
    
    if (newIsLiked) {
        setCurrentReaction(REACTIONS[0]);
        setLikesCount(prev => prev + 1);
    } else {
        setCurrentReaction(null);
        setLikesCount(prev => prev - 1);
    }
    
    setIsLiked(newIsLiked);
    
    const reactionToSend = newIsLiked ? 'like' : (currentReaction?.name || 'like');
    onLike(reactionToSend);
  };

  const handleReactionSelect = (reaction: typeof REACTIONS[0]) => {
    if (!currentReaction) {
        setLikesCount(prev => prev + 1);
    }
    
    setCurrentReaction(reaction);
    setIsLiked(true);
    setShowReactions(false);
    
    setAnimateLike(true);
    setTimeout(() => setAnimateLike(false), 300);

    onLike(reaction.name);
  };

  const handleTogglePiP = async (e: React.MouseEvent) => {
      e.stopPropagation();
      if (videoPlayerRef.current) {
          try {
              if (document.pictureInPictureElement) {
                  await document.exitPictureInPicture();
              } else {
                  await videoPlayerRef.current.requestPictureInPicture();
              }
/* Fix: Removed accidental non-ASCII characters 'ধন' after the closing brace */
          } catch (error) {
              console.error("PiP failed", error);
          }
      }
  };

  const handleDownload = () => {
      const link = document.createElement('a');
      link.href = video.url;
      link.download = `video_${Date.now()}.mp4`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      setShowMenu(false);
  };

  const handleSendComment = (e?: React.FormEvent) => {
    e?.preventDefault();
    if (!commentInput.trim()) return;
    onComment(commentInput);
    setCommentInput('');
    setShowEmojiPicker(false);
  };

  const handleEmojiClick = (emoji: string) => {
      setCommentInput(prev => prev + emoji);
      if(commentInputRef.current) {
          commentInputRef.current.focus();
      }
  };

  const handleInlineReplySubmit = (e: React.FormEvent) => {
      e.preventDefault();
      if (!replyText.trim()) return;
      onComment(replyText);
      setReplyingToId(null);
      setReplyText('');
  };

  const confirmDeleteComment = () => {
    if (deleteCommentId) {
        onDeleteComment(deleteCommentId);
        setDeleteCommentId(null);
    }
  };

  const getAudienceIcon = (type: AudienceType) => {
      switch(type) {
          case 'public': return <Globe className="w-3 h-3" />;
          case 'friends': return <Users className="w-3 h-3" />;
          case 'friends_of_friends': return <UserPlus className="w-3 h-3" />;
          case 'only_me': return <Lock className="w-3 h-3" />;
      }
  };

  const getAudienceLabel = (type: AudienceType) => {
    switch(type) {
        case 'public': return 'العامة';
        case 'friends': return 'الأصدقاء';
        case 'friends_of_friends': return 'أصدقاء أصدقاء';
        case 'only_me': return 'أنت فقط';
    }
  };

  const getAudienceDescription = (type: AudienceType) => {
    switch(type) {
        case 'public': return 'أي شخص على فيسبوك أو خارجه';
        case 'friends': return 'أصدقاؤك على فيسبوك';
        case 'friends_of_friends': return 'أصدقاء أصدقائك';
        case 'only_me': return 'أنت فقط';
    }
  };

  return (
    <div className="fixed inset-0 z-[100000] bg-black bg-opacity-95 flex items-center justify-center animate-fadeIn" dir={dir}>
       <div className="w-full h-full flex flex-col md:flex-row overflow-hidden">
           
           {/* Video Player Section */}
           <div className="flex-1 bg-black flex items-center justify-center relative group" onClick={(e) => e.stopPropagation()}>
                
                <button className="absolute top-4 left-4 p-2 bg-black/50 hover:bg-white/20 rounded-full text-white z-[102]" onClick={onClose}>
                    <X className="w-6 h-6" />
                </button>

                <button 
                    onClick={handleTogglePiP}
                    className="absolute top-4 left-16 p-2 bg-black/50 hover:bg-white/20 rounded-full text-white z-[102]"
                    title="تشغيل في نافذة عائمة"
                >
                    <PictureInPicture className="w-6 h-6" />
                </button>
                
                {hasPrev && (
                    <button className="absolute right-4 top-1/2 -translate-y-1/2 p-3 bg-black/50 hover:bg-white/20 rounded-full text-white z-10" onClick={onPrev}>
                        <ChevronRight className="w-8 h-8" />
                    </button>
                )}

                <video 
                    ref={videoPlayerRef}
                    src={video.url} 
                    className="max-w-full max-h-[100vh] w-full h-full object-contain" 
                    controls
                    autoPlay
                />

                {hasNext && (
                    <button className="absolute left-4 top-1/2 -translate-y-1/2 p-3 bg-black/50 hover:bg-white/20 rounded-full text-white z-10" onClick={onNext}>
                        <ChevronLeft className="w-8 h-8" />
                    </button>
                )}
           </div>

           {/* Sidebar Section */}
           <div className="w-full md:w-[450px] bg-white dark:bg-gray-800 flex flex-col h-[40vh] md:h-full border-l border-gray-200 dark:border-gray-700 shadow-xl" onClick={(e) => e.stopPropagation()}>
                <div className="p-4 border-b border-gray-200 dark:border-gray-700 flex items-center gap-3 relative">
                    <img src={currentUser.avatar} alt="User" className="w-10 h-10 rounded-full border border-gray-200 dark:border-gray-600" />
                    <div>
                        <h4 className="font-bold text-sm text-gray-900 dark:text-white">{currentUser.name}</h4>
                        <div className="flex items-center gap-1 text-xs text-gray-500 dark:text-gray-400">
                            <span>{video.timestamp}</span>
                            <span>·</span>
                            {getAudienceIcon(audience)}
                        </div>
                    </div>
                    
                    <div className="mr-auto relative" ref={menuRef}>
                        <button onClick={() => { setShowMenu(!showMenu); setMenuView('main'); }} className="p-2 text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full transition">
                            <MoreHorizontal className="w-5 h-5" />
                        </button>
                        
                        {showMenu && (
                            <div className={`absolute left-0 top-full mt-1 w-80 bg-white dark:bg-gray-800 shadow-xl rounded-lg border border-gray-100 dark:border-gray-700 z-50 overflow-hidden animate-fadeIn ${dir === 'rtl' ? 'origin-top-left' : 'origin-top-right'}`}>
                                
                                {menuView === 'main' && (
                                    <>
                                        <button onClick={() => { onToggleSave(); setShowMenu(false); }} className="w-full text-right px-4 py-3 hover:bg-gray-100 dark:hover:bg-gray-700 flex items-center gap-3 text-sm text-gray-700 dark:text-gray-200">
                                            {isSaved ? <BookmarkMinus className="w-5 h-5 text-fb-blue" /> : <Bookmark className="w-5 h-5" />} 
                                            {isSaved ? 'إلغاء حفظ الفيديو' : 'حفظ الفيديو في العناصر المحفوظة'}
                                        </button>
                                        <div className="border-t border-gray-100 dark:border-gray-700 my-1"></div>
                                        
                                        <button onClick={() => setMenuView('comments')} className="w-full text-right px-4 py-3 hover:bg-gray-100 dark:hover:bg-gray-700 flex items-center justify-between text-sm text-gray-700 dark:text-gray-200 group">
                                            <div className="flex items-center gap-3"><MessageCircle className="w-5 h-5" /> من الذي يمكنه التعليق؟</div>
                                            <ChevronLeft className="w-4 h-4 text-gray-400 group-hover:text-gray-600" />
                                        </button>
                                        
                                        <button onClick={() => setMenuView('audience')} className="w-full text-right px-4 py-3 hover:bg-gray-100 dark:hover:bg-gray-700 flex items-center justify-between text-sm text-gray-700 dark:text-gray-200 group">
                                            <div className="flex items-center gap-3"><Globe className="w-5 h-5" /> تعديل الجمهور</div>
                                            <ChevronLeft className="w-4 h-4 text-gray-400 group-hover:text-gray-600" />
                                        </button>
                                        
                                        <button onClick={() => { setNotificationsOn(!notificationsOn); setShowMenu(false); }} className="w-full text-right px-4 py-3 hover:bg-gray-100 dark:hover:bg-gray-700 flex items-center gap-3 text-sm text-gray-700 dark:text-gray-200">
                                            {notificationsOn ? <BellOff className="w-5 h-5" /> : <Bell className="w-5 h-5" />}
                                            {notificationsOn ? 'إيقاف تشغيل الإشعارات لهذا الفيديو' : 'تشغيل الإشعارات لهذا الفيديو'}
                                        </button>
                                        <div className="border-t border-gray-100 dark:border-gray-700 my-1"></div>
                                        
                                        <button onClick={() => { onShare(); setShowMenu(false); }} className="w-full text-right px-4 py-3 hover:bg-gray-100 dark:hover:bg-gray-700 flex items-center gap-3 text-sm text-gray-700 dark:text-gray-200">
                                            <Share2 className="w-5 h-5" /> مشاركة
                                        </button>
                                        
                                        <button onClick={handleDownload} className="w-full text-right px-4 py-3 hover:bg-gray-100 dark:hover:bg-gray-700 flex items-center gap-3 text-sm text-gray-700 dark:text-gray-200">
                                            <Download className="w-5 h-5" /> تنزيل
                                        </button>
                                        
                                        {isOwnProfile && (
                                            <button onClick={() => { onDeleteVideo(); setShowMenu(false); }} className="w-full text-right px-4 py-3 hover:bg-gray-100 dark:hover:bg-gray-700 flex items-center gap-3 text-sm text-red-600 font-medium transition">
                                                <Trash2 className="w-5 h-5" /> حذف الفيديو
                                            </button>
                                        )}
                                    </>
                                )}
                                {menuView === 'audience' && (
                                    <div className="animate-slideLeft">
                                        <div className="flex items-center gap-2 px-2 py-3 border-b border-gray-100 dark:border-gray-700">
                                            <button onClick={() => setMenuView('main')} className="p-1 hover:bg-gray-200 dark:hover:bg-gray-600 rounded-full transition"><ArrowRight className="w-5 h-5 text-gray-600 dark:text-gray-300" /></button>
                                            <span className="font-bold text-sm text-gray-800 dark:text-white">تعديل الجمهور</span>
                                        </div>
                                        <div className="py-2">
                                            {(['public', 'friends', 'friends_of_friends', 'only_me'] as AudienceType[]).map((type) => (
                                                <button 
                                                    key={type}
                                                    onClick={() => { setAudience(type); setShowMenu(false); }}
                                                    className="w-full text-right px-4 py-3 hover:bg-gray-100 flex items-center justify-between text-sm text-gray-700 dark:text-gray-200 transition"
                                                >
                                                    <div className="flex items-center gap-3">
                                                        <div className="bg-gray-100 dark:bg-gray-700 p-2 rounded-full">{getAudienceIcon(type)}</div>
                                                        <div className="flex flex-col">
                                                            <span className="font-semibold">{getAudienceLabel(type)}</span>
                                                            <span className="text-xs text-gray-500 dark:text-gray-400">{getAudienceDescription(type)}</span>
                                                        </div>
                                                    </div>
                                                    {audience === type && <div className="w-2 h-2 bg-fb-blue rounded-full"></div>}
                                                </button>
                                            ))}
                                        </div>
                                    </div>
                                )}

                                {menuView === 'comments' && (
                                    <div className="animate-slideLeft">
                                         <div className="flex items-center gap-2 px-2 py-3 border-b border-gray-100 dark:border-gray-700">
                                            <button onClick={() => setMenuView('main')} className="p-1 hover:bg-gray-200 dark:hover:bg-gray-600 rounded-full transition"><ArrowRight className="w-5 h-5 text-gray-600 dark:text-gray-300" /></button>
                                            <span className="font-bold text-sm text-gray-800 dark:text-white">من الذي يمكنه التعليق؟</span>
                                        </div>
                                        <div className="py-2">
                                            <div className="px-4 text-xs text-gray-500 dark:text-gray-400 mb-2">اختر من يُسمح له بالتعليق على منشورك.</div>
                                            <button onClick={() => { setCommentAudience('public'); setShowMenu(false); }} className="w-full text-right px-4 py-3 hover:bg-gray-100 dark:hover:bg-gray-700 flex items-center justify-between text-sm text-gray-700 dark:text-gray-200 transition">
                                                 <div className="flex items-center gap-3">
                                                     <div className="bg-gray-100 dark:bg-gray-700 p-2 rounded-full"><Globe className="w-4 h-4" /></div>
                                                     <span className="font-semibold">العامة</span>
                                                 </div>
                                                 {commentAudience === 'public' && <div className="w-2 h-2 bg-fb-blue rounded-full"></div>}
                                            </button>
                                            <button onClick={() => { setCommentAudience('friends'); setShowMenu(false); }} className="w-full text-right px-4 py-3 hover:bg-gray-100 dark:hover:bg-gray-700 flex items-center justify-between text-sm text-gray-700 dark:text-gray-200 transition">
                                                 <div className="flex items-center gap-3">
                                                     <div className="bg-gray-100 dark:bg-gray-700 p-2 rounded-full"><Users className="w-4 h-4" /></div>
                                                     <span className="font-semibold">الأصدقاء</span>
                                                 </div>
                                                 {commentAudience === 'friends' && <div className="w-2 h-2 bg-fb-blue rounded-full"></div>}
                                            </button>
                                            <button onClick={() => { setCommentAudience('mentions'); setShowMenu(false); }} className="w-full text-right px-4 py-3 hover:bg-gray-100 dark:hover:bg-gray-700 flex items-center justify-between text-sm text-gray-700 dark:text-gray-200 transition">
                                                 <div className="flex items-center gap-3">
                                                     <div className="bg-gray-100 dark:bg-gray-700 p-2 rounded-full"><AtSign className="w-4 h-4" /></div>
                                                     <div className="flex flex-col">
                                                         <span className="font-semibold">المنشن فقط</span>
                                                     </div>
                                                 </div>
                                                 {commentAudience === 'mentions' && <div className="w-2 h-2 bg-fb-blue rounded-full"></div>}
                                            </button>
                                        </div>
                                    </div>
                                )}
                            </div>
                        )}
                    </div>
                </div>

                <div className="px-4 py-3 flex justify-between items-center text-sm text-gray-500 dark:text-gray-400 border-b border-gray-100 dark:border-gray-700">
                    <div className="flex items-center gap-1">
                        <div className="bg-fb-blue p-1 rounded-full"><ThumbsUp className="w-3 h-3 text-white fill-current" /></div>
                        <span>{likesCount > 0 ? likesCount : ''}</span>
                    </div>
                    <div className="flex gap-3">
                        <span>{video.comments.length} تعليق</span>
                    </div>
                </div>
                <div className="px-2 py-1 flex items-center justify-between border-b border-gray-200 dark:border-gray-700 relative">
                     {/* Floating Reactions Bar */}
                     {showReactions && (
                        <div 
                            className="absolute bottom-full mb-2 right-4 bg-white dark:bg-gray-700 shadow-2xl rounded-full p-2 flex gap-2 animate-bounce-in z-50 border border-gray-200 dark:border-gray-600"
                            onMouseLeave={() => setShowReactions(false)}
                        >
                            {REACTIONS.map(r => (
                                <button 
                                    key={r.name} 
                                    onClick={() => handleReactionSelect(r)}
                                    className="hover:scale-150 transition-transform duration-200 p-1.5 rounded-full hover:bg-gray-100 dark:hover:bg-gray-600 relative group"
                                    title={r.label}
                                >
                                    <span className={`text-3xl inline-block ${r.animation || ''}`}>{r.emoji}</span>
                                    <span className="absolute -top-8 left-1/2 -translate-x-1/2 bg-black/75 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition whitespace-nowrap pointer-events-none">
                                        {r.label}
                                    </span>
                                </button>
                            ))}
                        </div>
                     )}

                     {/* Enhanced Like Button */}
                     <button 
                        onClick={handleLike}
                        onMouseEnter={() => { reactionTimerRef.current = setTimeout(() => setShowReactions(true), 500); }}
                        onMouseLeave={() => { if (reactionTimerRef.current) clearTimeout(reactionTimerRef.current); }}
                        className={`flex-1 flex items-center justify-center gap-2 py-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-all ${animateLike ? 'animate-pop' : ''} ${currentReaction ? currentReaction.color : ''}`}
                     >
                        {currentReaction ? <span className="text-xl animate-bounce-in">{currentReaction.emoji}</span> : <ThumbsUp className={`w-5 h-5 ${isLiked ? 'text-emerald-700 fill-current' : 'text-gray-600 dark:text-gray-300'}`} />}
                        <span className={`text-[15px] ${isLiked && !currentReaction ? 'text-emerald-700 font-bold' : 'text-gray-600 dark:text-gray-300'}`}>{currentReaction ? currentReaction.label : t.btn_like}</span>
                     </button>

                     <button onClick={() => commentInputRef.current?.focus()} className="flex-1 flex items-center justify-center gap-2 py-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-md transition font-medium text-gray-600 dark:text-gray-300 text-sm">
                        <MessageCircle className="w-5 h-5" /> {t.btn_comment}
                     </button>
                     <button onClick={onShare} className="flex-1 flex items-center justify-center gap-2 py-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-md transition font-medium text-gray-600 dark:text-gray-300 text-sm">
                        <Share2 className="w-5 h-5" /> {t.btn_share}
                     </button>
                </div>

                {/* Comments List */}
                <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50 dark:bg-gray-900/30">
                    {video.comments.length === 0 ? (
                        <div className="text-center text-gray-400 dark:text-gray-500 py-10 text-sm">كن أول من يعلق.</div>
                    ) : (
                        video.comments.map(comment => (
                            <div key={comment.id} className="flex gap-2 items-start flex-col">
                                <div className="flex gap-2">
                                    <img src={comment.author.avatar} className="w-8 h-8 rounded-full shadow-sm" alt="commenter" />
                                    <div className="flex flex-col flex-1">
                                        <div className="bg-gray-200 dark:bg-gray-700 px-3 py-2 rounded-2xl rounded-tr-none relative group/comment w-fit shadow-sm">
                                            <span className="font-bold text-xs block text-gray-900 dark:text-white">{comment.author.name}</span>
                                            <span className="text-sm text-gray-800 dark:text-gray-200">{comment.content}</span>
                                        </div>
                                        <div className="flex gap-3 text-[11px] text-gray-500 dark:text-gray-400 pr-2 mt-1 items-center">
                                            <span 
                                                className={`cursor-pointer hover:underline transition ${comment.isLiked ? 'text-fb-blue' : ''}`}
                                                onClick={() => onLikeComment && onLikeComment(comment.id)}
                                            >
                                                {comment.isLiked ? 'أعجبني' : 'أعجبني'}
                                            </span>
                                            <span 
                                                className="font-semibold cursor-pointer hover:underline"
                                                onClick={() => {
                                                    if (replyingToId === comment.id) {
                                                        setReplyingToId(null);
                                                    } else {
                                                        setReplyingToId(comment.id);
                                                        setReplyText(`@${comment.author.name} `);
                                                    }
                                                }}
                                            >
                                                رد
                                            </span>
                                            <span>{comment.timestamp}</span>
                                            {(comment.author.id === currentUser.id || isOwnProfile) && (
                                                <span 
                                                    className="font-semibold cursor-pointer hover:underline text-red-500 transition"
                                                    onClick={() => setDeleteCommentId(comment.id)}
                                                >
                                                    حذف
                                                </span>
                                            )}
                                        </div>
                                    </div>
                                </div>
                                
                                {/* Inline Reply Input */}
                                {replyingToId === comment.id && (
                                    <div className="mr-12 flex gap-2 animate-fadeIn mt-1">
                                        <img src={currentUser.avatar} className="w-6 h-6 rounded-full shadow-sm" alt="me" />
                                        <form className="flex-1" onSubmit={handleInlineReplySubmit}>
                                            <input 
                                                type="text" 
                                                className="w-full bg-gray-100 dark:bg-gray-700 border-none rounded-full px-3 py-1.5 text-xs focus:ring-1 focus:ring-fb-blue transition dark:text-white" 
                                                placeholder={`رد على ${comment.author.name}...`}
                                                value={replyText}
                                                onChange={(e) => setReplyText(e.target.value)}
                                                autoFocus
                                            />
                                        </form>
                                    </div>
                                )}
                            </div>
                        ))
                    )}
                    <div ref={commentsEndRef} />
                </div>

                {/* Input Area - Enhanced to match PostCard */}
                <div className="p-3 border-t border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 shadow-inner">
                    <div className="flex items-center gap-2 relative">
                        <img src={currentUser.avatar} className="w-8 h-8 rounded-full shadow-sm" alt="me" />
                        <div className="flex-1 relative">
                            <form onSubmit={handleSendComment} className="flex-1 bg-white dark:bg-gray-700 border border-gray-200 dark:border-transparent rounded-2xl flex items-center px-3 py-2 focus-within:ring-2 focus-within:ring-emerald-500/20 relative">
                                <input
                                    ref={commentInputRef}
                                    type="text"
                                    placeholder="اكتب تعليقاً..."
                                    className="bg-transparent w-full outline-none text-[14px] placeholder-gray-500 dark:placeholder-gray-400 text-gray-900 dark:text-white"
                                    value={commentInput}
                                    onChange={(e) => setCommentInput(e.target.value)}
                                />
                                
                                <div className="relative">
                                    <Smile 
                                        className="w-5 h-5 text-gray-400 cursor-pointer ml-2 hover:text-emerald-600 transition" 
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            setShowEmojiPicker(!showEmojiPicker);
                                        }}
                                    />
                                    
                                    {/* Emoji Picker Popup */}
                                    {showEmojiPicker && (
                                        <div 
                                            ref={emojiPickerRef}
                                            className="absolute bottom-10 left-0 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 shadow-2xl rounded-lg w-64 p-2 z-[100] animate-scaleIn"
                                            onClick={(e) => e.stopPropagation()}
                                        >
                                            <div className="h-48 overflow-y-auto grid grid-cols-6 gap-1 no-scrollbar">
                                                {EMOJI_LIST.map((emoji, idx) => (
                                                    <button 
                                                        key={idx} 
                                                        type="button"
                                                        onClick={() => handleEmojiClick(emoji)}
                                                        className="text-xl hover:bg-gray-100 dark:hover:bg-gray-700 rounded p-1 transition"
                                                    >
                                                        {emoji}
                                                    </button>
                                                ))}
                                            </div>
                                        </div>
                                    )}
                                </div>

                                <button 
                                    type="submit" 
                                    disabled={!commentInput.trim()} 
                                    className="text-emerald-700 hover:bg-emerald-50 p-1.5 rounded-full transition disabled:opacity-50 disabled:hover:bg-transparent"
                                >
                                    {dir === 'rtl' ? <Send className="w-5 h-5 rotate-180" /> : <Send className="w-5 h-5" />}
                                </button>
                            </form>
                        </div>
                    </div>
                </div>
           </div>
       </div>

       {/* Delete Confirmation Modal for Video Comments */}
       {deleteCommentId && (
          <div className="fixed inset-0 z-[250] flex items-center justify-center bg-black/60 p-4 animate-fadeIn" onClick={() => setDeleteCommentId(null)}>
              <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-xl w-full max-w-sm border border-gray-200 dark:border-gray-700" onClick={e => e.stopPropagation()}>
                  <h3 className="font-bold text-lg mb-2 text-gray-900 dark:text-white">حذف التعليق؟</h3>
                  <p className="text-gray-600 dark:text-gray-300 text-sm mb-6">هل أنت متأكد من أنك تريد حذف هذا التعليق نهائياً؟</p>
                  <div className="flex justify-end gap-3">
                      <button onClick={() => setDeleteCommentId(null)} className="px-4 py-2 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-md text-sm font-medium transition">إلغاء</button>
                      <button 
                          onClick={confirmDeleteComment} 
                          className="px-4 py-2 bg-red-600 text-white rounded-md text-sm font-medium hover:bg-red-700 transition shadow-sm"
                      >
                          حذف
                      </button>
                  </div>
              </div>
          </div>
       )}
    </div>
  );
};

export default VideoLightbox;