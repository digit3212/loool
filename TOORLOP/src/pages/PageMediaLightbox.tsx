import React, { useState, useRef, useEffect, useMemo } from 'react';
import { createPortal } from 'react-dom';
import { 
  X, ChevronRight, ChevronLeft, ThumbsUp, MessageCircle, Share2, Globe, Send, Smile, 
  Download, Trash2, Check, ArrowRight, Facebook, Twitter, Phone, Link as LinkIcon, 
  Clock, Search, Bookmark, BookmarkMinus, Bell, BellOff, Flag, Edit3, UserCircle, 
  Users, UserPlus, Lock, AtSign, Cat, Coffee, Gamepad2, Plane, Lightbulb, Pin, PinOff, AlertCircle, Copy, MoreHorizontal, AlertTriangle, Loader2 
} from 'lucide-react';
import { Page, User, Comment, Post } from '../types';
import { useLanguage } from '../context/LanguageContext';

interface PageMediaLightboxProps {
  viewingPage: Page;
  activeMediaIndex: number;
  lightboxType: 'photos' | 'videos';
  mediaList: any[];
  currentUser: User;
  // Live data props
  viewingPost?: Post | null;
  mediaLikes: number;
  isMediaLiked: boolean;
  mediaReaction?: string;
  mediaComments: Comment[];
  isSaved?: boolean;
  isPinned?: boolean;
  // Interaction State
  mediaCommentInput: string;
  setMediaCommentInput: (val: string) => void;
  // Handlers
  onClose: () => void;
  onNext: (e: React.MouseEvent, list: any[]) => void;
  onPrev: (e: React.MouseEvent, list: any[]) => void;
  onToggleLike: (reactionType?: string) => void;
  onPostComment: (text: string) => void;
  onShare: () => void;
  commentsEndRef: React.RefObject<HTMLDivElement>;
  onDeleteComment?: (commentId: string) => void;
  onLikeComment?: (commentId: string) => void;
  onDeletePost?: () => void;
  onToggleSave?: () => void;
  onTogglePin?: () => void;
  onUpdateAvatar?: (url: string) => void;
}

type MenuView = 'main' | 'audience' | 'comments';
type AudienceType = 'public' | 'friends' | 'friends_of_friends' | 'only_me';
type CommentAudienceType = 'public' | 'friends' | 'mentions';

const EMOJI_CATEGORIES = {
  smileys: {
    icon: Smile,
    label: "smileys",
    emojis: ["😀","😃","😄","😁","😆","😅","🤣","😂","🙂","🙃","😉","😊","😇","🥰","🤩","😘","😗","😚","😙","😋","😛","😜","🤪","😝","🤑","🤗","🤭","🤫","🤔","🤐","🤨","😐","😑","😶","😏","😒","🙄","😬","🤥","😌","😔","😪","🤤","😴","😷","🤒","🤕","🤢","🤮","🤧","🥵","🥶","🥴","😵","🤯","🤠","🥳","😎","🤓","🧐","😕","😟","🙁","😮","😯","😲","😳","🥺","😦","😧","😨","😰","😥","😢","😭","😱","😖","😣","😞","😓","😩","😫","🥱","😤","😡","😠","🤬",
             "💋","💌","💘","💝","💖","💗","💓","💞","💕","💟","❣","💔","❤","🧡","💛","💚","💙","💜","🤎","🖤","🤍","💯","💢","💥","💫","💦","💨","🕳","💣","💬","👁️‍🗨️","🗨","🗯","💭","💤","😈","👿","💀","☠","💩","🤡","👹","👺","👻","👽","👾","🤖"]                                
  },
  animals: {
    icon: Cat,
    label: "animals",
    emojis: ["😺","😸","😹","😻","😼","😽","🙀","😿","😾","🐶","🐱","🐭","🐹","🐰","🦊","🐻","🐼","🐨","🐯","🦁","🐮","🐷","🐽","🐸","🐵","🙉","🙊","🐒","🐔","🐧","🐦","🐤","🐣","🐥","🦆","🦅","🦉","🦇","🐺","🐗","🐴","🦄","🐝","🐛","🦋","🐌","🐞","🐜","🦟","🦗","🕷","🕷","🕸","🦂","🐢","🐍","🦎","🦖","🦕","🐙","🦑","🦐","🦞","🦀","🐡","🐠","🐟","🐬","🐳","🐋","🦈","🐊","🐅","🐆","🦓","🦍","🦧","🐘","🦛","🦏","🐪","🐫","🦒","🦘","🐃","🐂","🐄","🐎","🐖","🐏","🐑","🦙","🐐","🦌","🐕","🐩","🦮","🐕‍🦺","🐈","🐈‍⬛","🐓","🦃","🦚","🦜","🦢","🦩","🕊","🐇","🦝","🦨","🦡","🦦","🦥","🐁","🐀","🐿","🦔","🐾","🐉","🐲"]
  },
  food: {
    icon: Coffee,
    label: "food",
    emojis: ["🍏","🍎","🍐","🍊","🍋","🍌","🍉","🍇","🍓","🍈","🍒","🍑","🥭","🍍","🥥","🥝","🍅","🍆","🥑","🥦","🥬","🥒","🌶","🌽","🥕","🧄","🧅","🥔","🍠","🥐","🥯","🍞","🥖","🥨","🧀","🥚","🍳","🧈","🥞","🧇","🥓","🥩","🍗","🍖","🦴","🌭","🍔","🍟","🍕","🥪","🥙","🧆","🌮","🌯","🥗","🥘","🥫","🍝","🍜","🍲","🍛","🍣","🍱","🥟","🦪","🍤","🍙","🍚","🍘","🍥","🥠","🥮","🍢","🍡","🍧","🍨","🍦","🥧","🧁","🍰","🎂","🍮","🍭","🍬","🍫","🍿","🍩","🍪","🌰","🥜","🍯","🥛","🍼","☕","🍵","🧃","🥤","🍶","🍺","🍻","🥂","🍷","🥃","🍸","🍹","🧉","🍾","🧊","🥄","🍴","🍽","🥣","🥡","🥢","🧂"]
  },
  activities: {
    icon: Gamepad2,
    label: "activities",
    emojis: ["⚽","🏀","🏈","⚾","🥎","🎾","🏐","🏉","🥏","🎱","🪀","🏓","🏸","🏒","🏑","🥍","🏏","🥅","⛳","🪁","🏹","🎣","🤿","🥊","🥋","🎽","🛹","🛼","🛷","⛸","🥌","🎿","⛷","🏂","🪂","🏋️","🤼","🤸","⛹️","🤺","🤾","🏌️","🏇","🧘","🏄","🏊","🤽","🚣","🧗","🚵","🚴","🏆","🥇","🥈","🥉","🏅","🎖","🏵","🎗","🎫","🎟","🎪","🤹","🎭","🩰","🎨","🎬","🎤","🎧","🎼","🎹","🥁","🎷","🎺","🎸","🪕","🎻","🎲","♟","🎯","🎳","🎮","🎰","🧩"]
  },
  travel: {
    icon: Plane,
    label: "travel",
    emojis: ["🚗","🚕","🚙","🚌","🚎","🏎","🚓","🚑","🚒","🚐","🚚","🚛","🚜","🏍","🛵","🚲","🦼","🦽","🛴","🚨","🚔","🚍","🚘","🚖","🚡","🚠","🚟","🚃","🚋","🚞","🚝","🚄","🚅","🚈","🚂","🚆","🚇","🚊","🚉","✈","🛫","🛬","🛩","💺","🛰","🚀","🛸","🚁","🛶","⛵","🚤","🛥","🛳","⛴","🚢","⚓","⛽","🚧","🚦","🚥","🚏","🗺","🗿","🗽","🗼","🏰","🏯","🏟","🎡","🎢","🎠","⛲","⛱","🏖","🏝","🏜","🌋","⛰","🏔","🗻","🏕","⛺","🏠","🏡","🏘","🏚","🏗","🏭","🏢","🏬","🏣","🏤","🏥","🏦","🏨","🏪","🏫","🏩","💒","🏛","⛪","🕌","🕍","🛕","🕋","⛩","🛤","🛣","🗾","🎑","🏞","🌅","🌄","🌠","🎇","🎆","🌇","🌆","🏙","🌃","🌌","🌉","🌁"]
  },
  objects: {
    icon: Lightbulb,
    label: "objects",
    emojis: ["⌚","📱","📲","💻","⌨","🖥","🖨","🖱","🖲","🕹","🗜","💽","💾","💿","📀","📼","📷","📸","📹","🎥","📽","🎞","📞","☎","📟","📠","📺","📻","🎙","🎚","🎛","🧭","⏱","⏲","⏰","🕰","⌛","⏳","📡","🔋","🔌","💡","🔦","🕯","🪔","🧯","🛢","💸","💵","💴","💶","💷","🪙","💰","💳","💎","⚖","🧰","🔧","🔨","⚒","🛠","⛏","🪓","🧱","⚙","🪜","🩹","🩺","💈","🧲","🔫","💣","🧨","🔪","🗡","⚔","🛡","🚬","⚰","⚱","🏺","🔮","📿","🧿","💊","💉","🩸","🧬","🦠","🧫","🧪","🌡","🧹","🧺","🧻","🚽","🚰","🚿","🛁","🛀","🧼","🪥","🪒","🧽","🪣","🧴","🛎","🔑","🗝","🚪","🪑","🛋","🛏","🛌","🧸","🪆","🖼","🪞"]
  },
  flags: {
    icon: Flag,
    label: "flags",
    emojis: ["🏁","🚩","🎌","🏴","🏳","🏳️‍🌈","🏳️‍⚧️","🏴‍☠️","🇦🇨","🇦🇩","🇦🇪","🇦🇫","🇦🇬","🇦🇮","🇦🇱","🇦🇲","🇦🇴","🇦🇶","🇦🇷","🇦🇸","🇦🇹","🇦🇺","🇦🇼","🇦🇽","🇦🇿","🇧🇦","🇧🇧","🇧🇩","🇧🇪","🇧🇫","🇧🇬","🇧Ｈ","🇧🇮","🇧🇯","🇧🇱","🇧🇲","🇧🇳","🇧🇴","🇧🇶","🇧🇷","🇧🇸","🇧🇹","🇧🇻","🇧🇼","🇧🇾","🇧🇿","🇨🇦","🇨🇨","🇨🇩","🇨🇫","🇨🇬","🇨🇭","🇨🇮","🇨🇰","🇨🇱","🇨🇲","🇨🇳","🇨🇴","🇨🇵","🇨🇷","🇨🇺","🇨🇻","🇨🇼","🇨🇽","🇨🇾","🇨🇿","🇩🇪","🇩🇬","🇩🇯","🇩🇰","🇩🇲","🇩🇴","🇩🇿","🇪🇦","🇪🇨","🇪🇪","🇪🇬","🇪Ｈ","🇪🇷","🇪🇸","🇪🇹","🇪🇺","🇫🇮","🇫🇯","🇫🇰","🇫🇲","🇫🇴","🇫🇷","🇬🇦","🇬🇧","🇬🇩","🇬🇪","🇬🇫","🇬🇬","🇬Ｈ","🇬🇮","🇬🇱","🇬🇲","🇬🇳","🇬🇵","🇬🇶","🇬🇷","🇬🇸","🇬🇹","🇬🇺","🇬🇼","🇬🇾","🇭🇰","🇭🇲","🇭🇳","🇭🇷","🇭🇹","🇭🇺","🇮🇨","🇮🇩","🇮🇱","🇮🇲","🇮🇳","🇮🇴","🇮🇶","🇮🇷","🇮🇸","🇮🇹","🇯🇪","🇯🇲","🇯🇴","🇯🇵","🇰🇪","🇰🇬","🇰🇭","🇰🇮","🇰🇲","🇰🇳","🇰🇵","🇰🇷","🇰🇼","🇰🇾","🇰🇿","🇱🇦","🇱🇧","🇱🇨","🇱🇮","🇱🇰","🇱🇷","🇱🇸","🇱🇹","🇱🇺","🇱🇻","🇱🇾","🇲🇦","🇲🇨","🇲🇩","🇲🇪","🇲🇫","🇲🇬","🇲Ｈ","🇲🇰","🇲🇱","🇲🇲","🇲🇳","🇲🇴","🇲🇵","🇲🇶","🇲🇷","🇲🇸","🇲🇹","🇲🇺","🇲🇻","🇲🇼","🇲🇽","🇲🇾","🇲🇿","🇳🇦","🇳🇨","🇳🇪","🇳🇫","🇳🇬","🇳🇮","🇳🇱","🇳🇴","🇳🇵","🇳🇷","🇳🇺","🇳🇿","🇴🇲","🇵🇦","🇵🇪","🇵🇫","🇵🇬","🇵🇭","🇵🇰","🇵🇱","🇵🇲","🇵🇳","🇵🇷","🇵🇸","🇵🇹","🇵🇼","🇵🇾","🇶🇦","🇷🇪","🇷🇴","🇷🇸","🇷🇺","🇷🇼","🇸🇦","🇸🇧","🇸🇨","🇸🇩","🇸🇪","🇸🇬","🇸Ｈ","🇸🇮","🇸🇯","🇸🇰","🇸🇱","🇸🇲","🇸🇳","🇸🇴","🇸🇷","🇸🇸","🇸🇹","🇸🇻","🇸🇽","🇸🇾","🇸🇿","🇹🇦","🇹🇨","🇹🇩","🇹🇫","🇹🇬","🇹Ｈ","🇹🇯","🇹🇰","🇹🇱","🇹🇲","🇹🇳","🇹🇴","🇹🇷","🇹🇹","🇹🇻","🇹🇼","🇹🇿","🇺🇦","🇺🇬","🇺🇲","🇺🇳","🇺🇸","🇺🇾","🇺🇿","🇻🇦","🇻🇨","🇻🇪","🇻🇬","🇻🇮","🇻🇳","🇻🇺","🇼🇫","🇼🇸","🇽🇰","🇾🇪","🇾🇹","🇿🇦","🇿🇲","🇿🇼"]
  }
};

const PageMediaLightbox: React.FC<PageMediaLightboxProps> = ({
  viewingPage,
  activeMediaIndex,
  lightboxType,
  mediaList,
  currentUser,
  viewingPost,
  mediaLikes,
  isMediaLiked,
  mediaReaction,
  mediaComments,
  isSaved,
  isPinned,
  mediaCommentInput,
  setMediaCommentInput,
  onClose,
  onNext,
  onPrev,
  onToggleLike,
  onPostComment,
  onShare,
  commentsEndRef,
  onDeleteComment,
  onLikeComment,
  onDeletePost,
  onToggleSave,
  onTogglePin,
  onUpdateAvatar
}) => {
  const { dir, language, t } = useLanguage();
  const currentMedia = mediaList[activeMediaIndex];
  const currentPost = currentMedia?.post;
  
  // Interaction States
  const [replyingToId, setReplyingToId] = useState<string | null>(null);
  const [replyText, setReplyText] = useState('');
  const [deleteCommentId, setDeleteCommentId] = useState<string | null>(null);
  const [copyFeedback, setCopyFeedback] = useState(false);
  const [isShareModalOpen, setIsShareModalOpen] = useState(false);
  // FIXED: Removed internal delete modal state to prevent double modal issue
  // since onDeletePost triggers a global modal in App.tsx

  // UI State
  const [showMenu, setShowMenu] = useState(false);
  const [menuView, setMenuView] = useState<MenuView>('main');
  const [notificationsOn, setNotificationsOn] = useState(true);
  const [audience, setAudience] = useState<AudienceType>('public');
  const [commentAudience, setCommentAudience] = useState<CommentAudienceType>('public');

  // Reaction State
  const [showReactions, setShowReactions] = useState(false);
  const [animateLike, setAnimateLike] = useState(false);
  const reactionTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Emoji Picker State
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [activeEmojiTab, setActiveEmojiTab] = useState<'recent' | keyof typeof EMOJI_CATEGORIES>('recent');
  const [emojiSearch, setEmojiSearch] = useState('');
  const [recentEmojis, setRecentEmojis] = useState<string[]>([]);

  // Report Modal State
  const [showReportModal, setShowReportModal] = useState(false);
  const [reportReason, setReportReason] = useState('');
  const [isReportSubmitting, setIsReportSubmitting] = useState(false);
  const [reportFeedback, setReportFeedback] = useState(false);

  const menuRef = useRef<HTMLDivElement>(null);
  const commentInputRef = useRef<HTMLInputElement>(null);
  const emojiPickerRef = useRef<HTMLDivElement>(null);

  // Check if current user is admin/owner to allow admin actions
  const isPageAdmin = viewingPage.ownerId === currentUser.id || viewingPage.admins.includes(currentUser.id);

  // Use passed props (viewingPost) or fallback to internal currentPost for fallback
  // Prioritize props which are likely maintained by parent with live state
  const activeIsSaved = isSaved !== undefined ? isSaved : (currentPost?.isSaved || false);
  const activeIsPinned = isPinned !== undefined ? isPinned : (currentPost?.isPinned || false);

  // Memoize reactions to handle translations
  const REACTIONS = useMemo(() => {
    const labels: Record<string, { ar: string, en: string }> = {
      like: { ar: 'إعجاب', en: 'Like' },
      love: { ar: 'أحببته', en: 'Love' },
      care: { ar: 'أدعمك', en: 'Care' },
      haha: { ar: 'هاها', en: 'Haha' },
      wow: { ar: 'واو', en: 'Wow' },
      sad: { ar: 'أحزنني', en: 'Sad' },
      angry: { ar: 'أغضبني', en: 'Angry' },
    };
    return [
      { name: 'like', emoji: '👍', color: 'text-blue-600', animation: 'animate-bounce' },
      { name: 'love', emoji: '❤️', color: 'text-red-600', animation: 'animate-pulse' },
      { name: 'care', emoji: '🥰', color: 'text-yellow-500', animation: 'animate-bounce' },
      { name: 'haha', emoji: '😆', color: 'text-yellow-500', animation: 'animate-bounce' },
      { name: 'wow', emoji: '😮', color: 'text-yellow-500', animation: 'animate-pulse' },
      { name: 'sad', emoji: '😢', color: 'text-yellow-500', animation: 'animate-bounce' },
      { name: 'angry', emoji: '😡', color: 'text-orange-600', animation: 'animate-bounce' },
    ].map(r => ({
      ...r,
      label: language === 'ar' ? labels[r.name].ar : labels[r.name].en
    }));
  }, [language]);

  const activeReaction = isMediaLiked ? (REACTIONS.find(r => r.name === mediaReaction) || REACTIONS[0]) : null;

  // Keyboard Navigation Support
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowRight') {
        if (dir === 'rtl') onPrev(e as any, mediaList);
        else onNext(e as any, mediaList);
      } else if (e.key === 'ArrowLeft') {
        if (dir === 'rtl') onNext(e as any, mediaList);
        else onPrev(e as any, mediaList);
      } else if (e.key === 'Escape') {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onNext, onPrev, onClose, mediaList, dir]);

  useEffect(() => {
    if (commentsEndRef.current) {
        commentsEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [mediaComments, activeMediaIndex, commentsEndRef]);

  useEffect(() => {
      const savedRecents = localStorage.getItem('chat_recent_emojis');
      if (savedRecents) {
          setRecentEmojis(JSON.parse(savedRecents));
      }
  }, []);

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

  if (!currentMedia) return null;

  const handleSendComment = (e?: React.FormEvent) => {
    e?.preventDefault();
    if (!mediaCommentInput.trim()) return;
    onPostComment(mediaCommentInput);
    setMediaCommentInput('');
    setShowEmojiPicker(false);
  };

  const handleInlineReplySubmit = (e: React.FormEvent) => {
      e?.preventDefault();
      if (!replyText.trim()) return;
      onPostComment(replyText);
      setReplyingToId(null);
      setReplyText('');
  };

  const handleCopyLink = () => {
      navigator.clipboard.writeText(window.location.href).then(() => {
          setCopyFeedback(true);
          setTimeout(() => setCopyFeedback(false), 2000);
          setShowMenu(false);
      });
  };

  const handleMediaToggleSave = () => {
      if (onToggleSave) {
          onToggleSave();
          setShowMenu(false);
      }
  };

  const handleMediaTogglePin = () => {
      if (onTogglePin) {
          onTogglePin();
          setShowMenu(false);
      }
  };

  const handleSocialShare = (platform: string) => {
      const url = encodeURIComponent(window.location.href);
      const text = encodeURIComponent(language === 'ar' ? `شاهد هذا المحتوى الرائع من صفحة ${viewingPage.name}` : `Check out this awesome content from ${viewingPage.name}`);
      let shareUrl = '';
      if (platform === 'facebook') shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${url}`;
      if (platform === 'twitter') shareUrl = `https://twitter.com/intent/tweet?url=${url}&text=${text}`;
      if (platform === 'whatsapp') shareUrl = `https://api.whatsapp.com/send?text=${text}%20${url}`;
      if (shareUrl) window.open(shareUrl, '_blank', 'width=600,height=400');
  };

  const handleLikeClick = () => {
    setAnimateLike(true);
    setTimeout(() => setAnimateLike(false), 300);
    onToggleLike();
    setShowReactions(false);
  };

  const handleReactionSelect = (reaction: typeof REACTIONS[0]) => {
      setAnimateLike(true);
      setTimeout(() => setAnimateLike(false), 300);
      onToggleLike(reaction.name);
      setShowReactions(false);
  };

  const handleEmojiClick = (emoji: string) => {
      setMediaCommentInput(mediaCommentInput + emoji);
      const newRecents = [...new Set([emoji, ...recentEmojis])].slice(0, 24);
      setRecentEmojis(newRecents);
      localStorage.setItem('chat_recent_emojis', JSON.stringify(newRecents));

      if(commentInputRef.current) {
          commentInputRef.current.focus();
      }
      setShowEmojiPicker(false);
  };

  const handleDownload = () => {
      const link = document.createElement('a');
      link.href = currentMedia.url;
      link.download = `media_${Date.now()}`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      setShowMenu(false);
  };

  const handleSetProfilePicture = () => {
      if (onUpdateAvatar) {
          onUpdateAvatar(currentMedia.url);
          setShowMenu(false);
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
          case 'public': return t.privacy_public || (language === 'ar' ? 'العامة' : 'Public');
          case 'friends': return t.privacy_friends || (language === 'ar' ? 'الأصدقاء' : 'Friends');
          case 'friends_of_friends': return t.privacy_friends_except || (language === 'ar' ? 'أصدقاء أصدقاء' : 'Friends of friends');
          case 'only_me': return t.privacy_only_me || (language === 'ar' ? 'أنت فقط' : 'Only Me');
      }
  };

  const getAudienceDescription = (type: AudienceType) => {
      switch(type) {
          case 'public': return language === 'ar' ? 'أي شخص على فيسبوك أو خارجه' : 'Anyone on or off Facebook';
          case 'friends': return language === 'ar' ? 'أصدقاؤك على فيسبوك' : 'Your friends on Facebook';
          case 'friends_of_friends': return language === 'ar' ? 'أصدقاء أصدقائك' : 'Friends of friends';
          case 'only_me': return language === 'ar' ? 'أنت فقط' : 'Only you';
      }
  };

  const handleReport = () => {
     setShowMenu(false);
     setShowReportModal(true);
  };

  const handleSubmitReport = () => {
      if (!reportReason) return;
      setIsReportSubmitting(true);
      setTimeout(() => {
          setIsReportSubmitting(false);
          setShowReportModal(false);
          setReportReason('');
          setReportFeedback(true);
          setTimeout(() => setReportFeedback(false), 3000);
      }, 1500);
  };

  const handleDeleteCommentConfirm = () => {
      if (onDeleteComment && deleteCommentId) onDeleteComment(deleteCommentId);
      setDeleteCommentId(null);
  };

  // Render Emoji Picker UI
  const renderEmojiPicker = () => (
        <div 
            ref={emojiPickerRef}
            className={`absolute bottom-10 ${dir === 'rtl' ? 'left-0 origin-bottom-left' : 'right-0 origin-bottom-right'} bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 shadow-2xl rounded-lg w-80 p-0 z-[100] animate-scaleIn overflow-hidden flex flex-col`}
            onClick={(e) => e.stopPropagation()}
        >
                <div className="flex items-center p-2 border-b dark:border-gray-700 bg-gray-50 dark:bg-gray-900 gap-2 flex-shrink-0">
                <div className="relative w-full">
                    <Search className="w-3 h-3 absolute left-2 top-2 text-gray-400" />
                    <input 
                        type="text" 
                        className="w-full pl-6 pr-2 py-1 text-xs bg-gray-200 dark:bg-gray-700 rounded-full outline-none text-gray-900 dark:text-white"
                        placeholder={t.common_search || 'Search'}
                        value={emojiSearch}
                        onChange={(e) => setEmojiSearch(e.target.value)}
                    />
                </div>
                </div>

            <div className="h-48 overflow-y-auto custom-scrollbar p-2 bg-white dark:bg-gray-800">
                {(emojiSearch ? ['search_results'] : (activeEmojiTab === 'recent' ? ['recent'] : [activeEmojiTab])).map(categoryKey => {
                    const emojis = emojiSearch 
                    ? Object.values(EMOJI_CATEGORIES).flatMap(c => c.emojis).filter(e => true).slice(0, 50)
                    : categoryKey === 'recent' 
                        ? recentEmojis 
                        : EMOJI_CATEGORIES[categoryKey as keyof typeof EMOJI_CATEGORIES].emojis;
                    
                    if (emojis.length === 0 && categoryKey === 'recent') {
                        return (
                        <div key="empty-recent" className="flex flex-col items-center justify-center h-40 text-gray-400">
                            <Clock className="w-8 h-8 mb-2 opacity-50" />
                            <span className="text-xs">{language === 'ar' ? 'لا يوجد رموز حديثة' : 'No recent emojis'}</span>
                        </div>
                        );
                    }

                    return (
                        <div key={categoryKey} className="animate-fadeIn">
                            <div className="grid grid-cols-8 gap-1">
                                {emojis.map((emoji, idx) => (
                                    <button 
                                        key={`${categoryKey}-${idx}`} 
                                        type="button"
                                        onClick={() => handleEmojiClick(emoji)} 
                                        className="p-1.5 hover:bg-gray-100 dark:hover:bg-gray-700 rounded text-xl transition hover:scale-125"
                                    >
                                        {emoji}
                                    </button>
                                ))}
                            </div>
                        </div>
                    );
                })}
            </div>
            
            <div className="flex items-center justify-between px-2 py-1.5 border-t dark:border-gray-700 bg-gray-50 dark:bg-gray-900 overflow-x-auto no-scrollbar flex-shrink-0">
                <button 
                    type="button"
                    onClick={() => { setActiveEmojiTab('recent'); setEmojiSearch(''); }}
                    className={`p-2 rounded-lg transition ${activeEmojiTab === 'recent' ? 'text-fb-blue bg-blue-100 dark:bg-blue-900/30' : 'text-gray-400 hover:text-gray-600'}`}
                    title={language === 'ar' ? 'الأخيرة' : 'Recent'}
                >
                    <Clock className="w-4 h-4" />
                </button>
                {Object.entries(EMOJI_CATEGORIES).map(([key, data]) => {
                    const Icon = data.icon;
                    const label = language === 'ar' ? data.label : key;
                    return (
                        <button 
                            key={key} 
                            type="button"
                            onClick={() => { setActiveEmojiTab(key as any); setEmojiSearch(''); }}
                            className={`p-2 rounded-lg transition ${activeEmojiTab === key ? 'text-fb-blue bg-blue-100 dark:bg-blue-900/30' : 'text-gray-400 hover:text-gray-600'}`}
                            title={label}
                        >
                            <Icon className="w-4 h-4" />
                        </button>
                    );
                })}
            </div>
        </div>
  );

  return (
    <div className="fixed inset-0 z-[100000] bg-black bg-opacity-95 flex items-center justify-center animate-fadeIn" dir={dir}>
       
       {/* Copy Feedback Toast */}
       {copyFeedback && (
          <div className="absolute top-10 left-1/2 transform -translate-x-1/2 z-[100010] bg-emerald-700 text-white px-4 py-2 rounded-md shadow-lg text-sm flex items-center gap-2 animate-fadeIn">
              <Check className="w-4 h-4" />
              {t.common_copied || (language === 'ar' ? 'تم النسخ' : 'Copied')}
          </div>
       )}

       <div className="w-full h-full flex flex-col md:flex-row overflow-hidden">
           {/* Media Section */}
           <div className="flex-1 bg-black flex items-center justify-center relative group" onClick={(e) => e.stopPropagation()}>
                <button className="absolute top-4 left-4 p-2 bg-black/50 hover:bg-white/20 rounded-full text-white z-[102]" onClick={onClose}><X className="w-6 h-6" /></button>
                
                {mediaList.length > 1 && (
                  <>
                    <button className="absolute right-4 top-1/2 -translate-y-1/2 p-3 bg-black/50 hover:bg-white/20 rounded-full text-white z-10 transition hover:scale-110" onClick={(e) => onNext(e, mediaList)}>
                        {dir === 'rtl' ? <ChevronLeft className="w-8 h-8" /> : <ChevronRight className="w-8 h-8" />}
                    </button>
                    <button className="absolute left-4 top-1/2 -translate-y-1/2 p-3 bg-black/50 hover:bg-white/20 rounded-full text-white z-10 transition hover:scale-110" onClick={(e) => onPrev(e, mediaList)}>
                        {dir === 'rtl' ? <ChevronRight className="w-8 h-8" /> : <ChevronLeft className="w-8 h-8" />}
                    </button>
                  </>
                )}
                
                {lightboxType === 'videos' ? <video src={currentMedia.url} className="max-w-full max-h-[100vh] w-full h-full object-contain" controls autoPlay /> : <img src={currentMedia.url} className="max-w-full max-h-[85vh] object-contain shadow-2xl" alt="Full screen" />}
                <a href={currentMedia.url} download={`media_${Date.now()}`} className="absolute bottom-4 right-4 p-3 bg-white/10 hover:bg-white/20 rounded-full text-white transition"><Download className="w-6 h-6" /></a>
           </div>

           {/* Sidebar */}
           <div className="w-full md:w-[450px] bg-white dark:bg-gray-800 flex flex-col h-[45vh] md:h-full border-l border-gray-200 dark:border-gray-700 shadow-xl" onClick={(e) => e.stopPropagation()}>
                <div className="p-4 border-b border-gray-200 dark:border-gray-700 flex items-center gap-3 relative bg-gray-50/50 dark:bg-gray-900/10">
                    <img src={viewingPage.avatar} alt="Page" className="w-11 h-11 rounded-full border border-gray-200 dark:border-gray-700 shadow-sm" />
                    <div className="flex-1 min-w-0">
                        <h4 className="font-bold text-sm text-gray-900 dark:text-white truncate">{viewingPage.name}</h4>
                        <div className="flex items-center gap-1 text-[10px] text-gray-500 dark:text-gray-400 font-bold uppercase tracking-wider"><span>{language === 'ar' ? 'بواسطة الصفحة' : 'Posted by Page'}</span><span>·</span><Globe className="w-2.5 h-2.5" /></div>
                    </div>

                    <div className="ms-auto relative" ref={menuRef}>
                        <button 
                            onClick={() => { setShowMenu(!showMenu); setMenuView('main'); }}
                            className={`p-2 rounded-full transition ${showMenu ? 'bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-white' : 'text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-700'}`}
                        >
                            <MoreHorizontal className="w-5 h-5" />
                        </button>
                        
                        {showMenu && (
                            <div className={`absolute top-full mt-1 w-80 bg-white dark:bg-gray-800 shadow-xl rounded-lg border border-gray-100 dark:border-gray-700 z-[200] overflow-hidden animate-fadeIn ${dir === 'rtl' ? 'left-0 origin-top-left' : 'right-0 origin-top-right'}`}>
                                {menuView === 'main' && (
                                    <>
                                        {isPageAdmin && (
                                            <button 
                                                onClick={() => { if(onTogglePin) onTogglePin(); setShowMenu(false); }}
                                                className="w-full text-start px-4 py-3 hover:bg-gray-100 dark:hover:bg-gray-700 flex items-center gap-3 text-sm text-gray-700 dark:text-gray-200 transition"
                                            >
                                                {activeIsPinned ? <PinOff className="w-5 h-5 text-fb-blue" /> : <Pin className="w-5 h-5" />}
                                                {activeIsPinned ? (language === 'ar' ? 'إلغاء التثبيت' : 'Unpin Post') : (language === 'ar' ? 'تثبيت المنشور' : 'Pin Post')}
                                            </button>
                                        )}

                                        <button 
                                            onClick={() => { if(onToggleSave) onToggleSave(); setShowMenu(false); }} 
                                            className="w-full text-start px-4 py-3 hover:bg-gray-100 dark:hover:bg-gray-700 flex items-center gap-3 text-sm text-gray-700 dark:text-gray-200 transition"
                                        >
                                            {activeIsSaved ? <BookmarkMinus className="w-5 h-5 text-fb-blue" /> : <Bookmark className="w-5 h-5" />} 
                                            {activeIsSaved ? (language === 'ar' ? 'إلغاء الحفظ' : 'Unsave') : (language === 'ar' ? 'حفظ المنشور' : 'Save Post')}
                                        </button>

                                        <div className="border-t border-gray-100 dark:border-gray-700 my-1"></div>
                                        
                                        <button onClick={() => setMenuView('audience')} className="w-full text-start px-4 py-3 hover:bg-gray-100 dark:hover:bg-gray-700 flex items-center justify-between text-sm text-gray-700 dark:text-gray-200 transition group">
                                            <div className="flex items-center gap-3">{getAudienceIcon(audience)} <span>{t.post_audience || (language === 'ar' ? 'تعديل الجمهور' : 'Edit Audience')}</span></div>
                                            {dir === 'rtl' ? <ChevronLeft className="w-4 h-4 text-gray-400 group-hover:text-gray-600" /> : <ChevronRight className="w-4 h-4 text-gray-400 group-hover:text-gray-600" />}
                                        </button>

                                        <button onClick={() => setMenuView('comments')} className="w-full text-start px-4 py-3 hover:bg-gray-100 dark:hover:bg-gray-700 flex items-center justify-between text-sm text-gray-700 dark:text-gray-200 transition group">
                                            <div className="flex items-center gap-3"><MessageCircle className="w-5 h-5" /> {t.post_who_can_comment || (language === 'ar' ? 'من الذي يمكنه التعليق؟' : 'Who can comment?')}</div>
                                            {dir === 'rtl' ? <ChevronLeft className="w-4 h-4 text-gray-400 group-hover:text-gray-600" /> : <ChevronRight className="w-4 h-4 text-gray-400 group-hover:text-gray-600" />}
                                        </button>
                                        
                                        <button onClick={() => { setNotificationsOn(!notificationsOn); setShowMenu(false); }} className="w-full text-start px-4 py-3 hover:bg-gray-100 dark:hover:bg-gray-700 flex items-center gap-3 text-sm text-gray-700 dark:text-gray-200 transition">
                                            {notificationsOn 
                                                ? (language === 'ar' ? 'إيقاف الإشعارات' : 'Turn off notifications') 
                                                : (language === 'ar' ? 'تشغيل الإشعارات' : 'Turn on notifications')
                                            }
                                        </button>

                                        <div className="border-t border-gray-100 dark:border-gray-700 my-1"></div>
                                        
                                        <button 
                                            onClick={() => { setIsShareModalOpen(true); setShowMenu(false); }}
                                            className="w-full text-start px-4 py-3 hover:bg-gray-100 dark:hover:bg-gray-700 flex items-center gap-3 text-sm text-gray-700 dark:text-gray-200 transition"
                                        >
                                            <Share2 className="w-5 h-5" /> {t.common_share || (language === 'ar' ? 'مشاركة' : 'Share')}
                                        </button>
                                        
                                        <button 
                                            onClick={handleDownload}
                                            className="w-full text-start px-4 py-3 hover:bg-gray-100 dark:hover:bg-gray-700 flex items-center gap-3 text-sm text-gray-700 dark:text-gray-200 transition"
                                        >
                                            <Download className="w-5 h-5" /> {t.common_download || (language === 'ar' ? 'تنزيل' : 'Download')}
                                        </button>

                                        <button 
                                            onClick={handleCopyLink} 
                                            className="w-full text-start px-4 py-3 hover:bg-gray-100 dark:hover:bg-gray-700 flex items-center gap-3 text-sm text-gray-700 dark:text-gray-200 transition"
                                        >
                                            <LinkIcon className="w-5 h-5" /> {t.post_copy_link || (language === 'ar' ? 'نسخ الرابط' : 'Copy Link')}
                                        </button>
                                        
                                        {isPageAdmin && (
                                            <>
                                                <div className="border-t border-gray-100 dark:border-gray-700 my-1"></div>

                                                {lightboxType === 'photos' && (
                                                    <button 
                                                        onClick={handleSetProfilePicture}
                                                        className="w-full text-start px-4 py-3 hover:bg-gray-100 dark:hover:bg-gray-700 flex items-center gap-3 text-sm text-gray-700 dark:text-gray-200 transition"
                                                    >
                                                        <UserCircle className="w-5 h-5" /> {language === 'ar' ? 'تعيين كصورة ملف شخصي' : 'Set as Profile Picture'}
                                                    </button>
                                                )}

                                                {onDeletePost && (
                                                    <button 
                                                        onClick={() => { 
                                                            setShowMenu(false); 
                                                            // Direct call to parent delete handler to avoid double modals
                                                            if (onDeletePost) onDeletePost(); 
                                                        }} 
                                                        className="w-full text-start px-4 py-3 hover:bg-gray-100 dark:hover:bg-gray-700 flex items-center gap-3 text-sm text-red-600 font-medium transition"
                                                    >
                                                        <Trash2 className="w-5 h-5" /> {language === 'ar' ? 'حذف المنشور' : 'Delete Post'}
                                                    </button>
                                                )}
                                            </>
                                        )}

                                        {!isPageAdmin && (
                                            <button 
                                                onClick={handleReport} 
                                                className="w-full text-start px-4 py-3 hover:bg-gray-100 dark:hover:bg-gray-700 flex items-center gap-3 text-sm text-gray-700 dark:text-gray-200 transition"
                                            >
                                                <Flag className="w-5 h-5" /> {t.common_report || (language === 'ar' ? 'إبلاغ' : 'Report')}
                                            </button>
                                        )}
                                    </>
                                    )}
                                {menuView === 'audience' && (
                                    <div className="animate-slideLeft">
                                        <div className="flex items-center gap-2 px-2 py-3 border-b border-gray-100 dark:border-gray-700">
                                            <button onClick={() => setMenuView('main')} className="p-1 hover:bg-gray-200 dark:hover:bg-gray-600 rounded-full transition">
                                                 {dir === 'rtl' ? <ArrowRight className="w-5 h-5 text-gray-600 dark:text-gray-300" /> : <ArrowRight className="w-5 h-5 text-gray-600 dark:text-gray-300 rotate-180" />}
                                            </button>
                                            <span className="font-bold text-sm text-gray-800 dark:text-white">{t.post_audience || (language === 'ar' ? 'تعديل الجمهور' : 'Edit Audience')}</span>
                                        </div>
                                        <div className="py-2">
                                            {(['public', 'friends', 'friends_of_friends', 'only_me'] as AudienceType[]).map((type) => (
                                                <button 
                                                    key={type}
                                                    onClick={() => { setAudience(type); setShowMenu(false); }}
                                                    className="w-full text-start px-4 py-3 hover:bg-gray-100 dark:hover:bg-gray-700 flex items-center justify-between text-sm text-gray-700 dark:text-gray-200 transition"
                                                >
                                                    <div className="flex items-center gap-3">
                                                        <div className="bg-gray-100 dark:bg-gray-600 p-2 rounded-full">{getAudienceIcon(type)}</div>
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
                                            <button onClick={() => setMenuView('main')} className="p-1 hover:bg-gray-200 dark:hover:bg-gray-600 rounded-full transition">
                                                {dir === 'rtl' ? <ArrowRight className="w-5 h-5 text-gray-600 dark:text-gray-300" /> : <ArrowRight className="w-5 h-5 text-gray-600 dark:text-gray-300 rotate-180" />}
                                            </button>
                                            <span className="font-bold text-sm text-gray-800 dark:text-white">{t.post_who_can_comment || (language === 'ar' ? 'من الذي يمكنه التعليق؟' : 'Who can comment?')}</span>
                                        </div>
                                        <div className="py-2">
                                            <div className="px-4 text-xs text-gray-500 dark:text-gray-400 mb-2">{language === 'ar' ? 'اختر من يُسمح له بالتعليق على منشورك.' : 'Choose who is allowed to comment on your post.'}</div>
                                            <button onClick={() => { setCommentAudience('public'); setShowMenu(false); }} className="w-full text-start px-4 py-3 hover:bg-gray-100 dark:hover:bg-gray-700 flex items-center justify-between text-sm text-gray-700 dark:text-gray-200 transition">
                                                 <div className="flex items-center gap-3">
                                                     <div className="bg-gray-100 dark:bg-gray-700 p-2 rounded-full"><Globe className="w-4 h-4" /></div>
                                                     <span className="font-semibold">{t.privacy_public || (language === 'ar' ? 'العامة' : 'Public')}</span>
                                                 </div>
                                                 {commentAudience === 'public' && <div className="w-2 h-2 bg-fb-blue rounded-full"></div>}
                                            </button>
                                            <button onClick={() => { setCommentAudience('friends'); setShowMenu(false); }} className="w-full text-start px-4 py-3 hover:bg-gray-100 dark:hover:bg-gray-700 flex items-center justify-between text-sm text-gray-700 dark:text-gray-200 transition">
                                                 <div className="flex items-center gap-3">
                                                     <div className="bg-gray-100 dark:bg-gray-700 p-2 rounded-full"><Users className="w-4 h-4" /></div>
                                                     <span className="font-semibold">{t.privacy_friends || (language === 'ar' ? 'الأصدقاء' : 'Friends')}</span>
                                                 </div>
                                                 {commentAudience === 'friends' && <div className="w-2 h-2 bg-fb-blue rounded-full"></div>}
                                            </button>
                                            <button onClick={() => { setCommentAudience('mentions'); setShowMenu(false); }} className="w-full text-start px-4 py-3 hover:bg-gray-100 dark:hover:bg-gray-700 flex items-center justify-between text-sm text-gray-700 dark:text-gray-200 transition">
                                                 <div className="flex items-center gap-3">
                                                     <div className="bg-gray-100 dark:bg-gray-700 p-2 rounded-full"><AtSign className="w-4 h-4" /></div>
                                                     <div className="flex flex-col">
                                                         <span className="font-semibold">{language === 'ar' ? 'الإشارات فقط' : 'Mentions'}</span>
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
                     <div className="flex items-center gap-1.5">
                        <div className="bg-fb-blue p-1 rounded-full shadow-sm"><ThumbsUp className="w-3 h-3 text-white fill-current" /></div>
                        <span className="font-bold text-gray-700 dark:text-gray-200">{mediaLikes > 0 ? mediaLikes : ''}</span>
                    </div>
                    <div className="flex gap-3 text-xs font-bold hover:underline cursor-pointer">
                        <span>{mediaComments.length} {t.post_comments_count || (language === 'ar' ? 'تعليق' : 'Comments')}</span>
                    </div>
                </div>
                
                <div className="px-2 py-1 flex items-center justify-between border-b border-gray-200 dark:border-gray-700 relative">
                     {/* Added Feature: Floating Reactions Bar */}
                     {showReactions && (
                        <div 
                            className={`absolute bottom-full mb-2 right-4 bg-white dark:bg-gray-700 shadow-2xl rounded-full p-2 flex gap-2 animate-bounce-in z-50 border border-gray-200 dark:border-gray-600 ${dir === 'rtl' ? 'right-4' : 'left-4'}`}
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
                                    <span className="absolute -top-8 left-1/2 -translate-x-1/2 bg-black/75 text-white text-[10px] px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition whitespace-nowrap pointer-events-none font-bold">
                                        {r.label}
                                    </span>
                                </button>
                            ))}
                        </div>
                     )}

                     <button 
                        onClick={handleLikeClick}
                        onMouseEnter={() => { reactionTimerRef.current = setTimeout(() => setShowReactions(true), 500); }} 
                        onMouseLeave={() => { if (reactionTimerRef.current) clearTimeout(reactionTimerRef.current); }}
                        className={`flex-1 flex items-center justify-center gap-2 py-2.5 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-all ${animateLike ? 'animate-pop' : ''} ${activeReaction ? activeReaction.color : 'text-gray-600 dark:text-gray-300'}`}
                     >
                        {activeReaction ? <span className="text-xl animate-bounce-in">{activeReaction.emoji}</span> : <ThumbsUp className={`w-5 h-5 ${isMediaLiked ? 'text-fb-blue fill-current' : ''}`} />} 
                        <span className={`text-[15px] font-bold ${isMediaLiked && !activeReaction ? 'text-fb-blue' : ''}`}>{activeReaction ? activeReaction.label : (t.post_like || (language === 'ar' ? 'أعجبني' : 'Like'))}</span>
                     </button>
                     <button onClick={() => commentInputRef.current?.focus()} className="flex-1 flex items-center justify-center gap-2 py-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-md transition font-medium text-gray-600 dark:text-gray-300 text-sm">
                        <MessageCircle className="w-5 h-5" /> {t.post_comment || (language === 'ar' ? 'تعليق' : 'Comment')}
                     </button>
                     <button onClick={() => setIsShareModalOpen(true)} className="flex-1 flex items-center justify-center gap-2 py-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-md transition font-medium text-gray-600 dark:text-gray-300 text-sm">
                        <Share2 className="w-5 h-5" /> {t.common_share || (language === 'ar' ? 'مشاركة' : 'Share')}
                     </button>
                </div>

                <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50 dark:bg-gray-900/30 custom-scrollbar">
                    {mediaComments.length === 0 ? (
                        <div className="text-center text-gray-400 dark:text-gray-500 py-16 text-sm italic font-medium flex flex-col items-center gap-3">
                            <MessageCircle className="w-12 h-12 opacity-10" />
                            {language === 'ar' ? 'كن أول من يعلق.' : 'Be the first to comment.'}
                        </div>
                    ) : (
                        mediaComments.map((comment) => (
                            <div key={comment.id} className="flex gap-2 group flex-col animate-fadeIn">
                                <div className="flex gap-2">
                                    <img src={comment.author.avatar} className="w-9 h-9 rounded-full border border-white dark:border-gray-800 shadow-sm" alt="commenter" />
                                    <div className="flex flex-col flex-1">
                                        <div className="bg-white dark:bg-gray-800 px-3 py-2 rounded-2xl rounded-tr-none text-sm shadow-sm inline-block w-fit border border-gray-100 dark:border-gray-700">
                                            <span className="font-extrabold block text-gray-900 dark:text-white mb-0.5 text-xs">{comment.author.name}</span>
                                            <span className="text-gray-800 dark:text-gray-200 leading-relaxed">{comment.content}</span>
                                        </div>
                                        <div className="flex gap-3 text-[11px] text-gray-500 dark:text-gray-400 mt-1 mr-1 items-center font-bold">
                                            <span 
                                                className={`cursor-pointer hover:underline transition ${comment.isLiked ? 'text-fb-blue' : ''}`}
                                                onClick={() => onLikeComment && onLikeComment(comment.id)}
                                            >
                                                {t.post_like || (language === 'ar' ? 'أعجبني' : 'Like')}
                                            </span>
                                            <span 
                                                className="cursor-pointer hover:underline transition"
                                                onClick={() => {
                                                    if (replyingToId === comment.id) setReplyingToId(null);
                                                    else {
                                                        setReplyingToId(comment.id);
                                                        setReplyText(`@${comment.author.name} `);
                                                    }
                                                }}
                                            >
                                                {t.post_reply || (language === 'ar' ? 'رد' : 'Reply')}
                                            </span>
                                            <span className="font-normal opacity-70">{comment.timestamp}</span>
                                            {(comment.author.id === currentUser.id || viewingPage.ownerId === currentUser.id || viewingPage.admins.includes(currentUser.id)) && (
                                                <span 
                                                    className="cursor-pointer hover:underline text-red-500 transition font-bold"
                                                    onClick={() => setDeleteCommentId(comment.id)}
                                                >
                                                    {t.common_delete || (language === 'ar' ? 'حذف' : 'Delete')}
                                                </span>
                                            )}
                                        </div>
                                    </div>
                                </div>
                                {replyingToId === comment.id && (
                                    <div className="mr-10 flex gap-2 animate-fadeIn mt-1">
                                        <img src={currentUser.avatar} className="w-7 h-7 rounded-full shadow-sm" alt="me" />
                                        <form className="flex-1" onSubmit={handleInlineReplySubmit}>
                                            <input 
                                                type="text" 
                                                className="w-full bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-full px-3 py-1.5 text-[11px] focus:ring-2 focus:ring-fb-blue/20 transition dark:text-white outline-none shadow-inner" 
                                                placeholder={`${language === 'ar' ? 'رد على' : 'Reply to'} ${comment.author.name}...`}
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

                <div className="p-3 border-t border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 shadow-inner">
                    <div className="flex items-center gap-2 relative">
                         <img src={currentUser.avatar} className="w-8 h-8 rounded-full border border-gray-100 shadow-sm" alt="me" />
                         <div className="flex-1 relative">
                            <form onSubmit={handleSendComment} className="flex-1 bg-gray-100 dark:bg-gray-700 border border-gray-200 dark:border-transparent rounded-2xl flex items-center px-3 py-2 focus-within:ring-2 focus-within:ring-emerald-500/20 relative">
                                 <input 
                                    ref={commentInputRef} 
                                    type="text" 
                                    className="bg-transparent w-full outline-none text-[14px] placeholder-gray-500 dark:placeholder-gray-400 text-gray-900 dark:text-white" 
                                    placeholder={t.post_write_comment || (language === 'ar' ? 'اكتب تعليقاً...' : 'Write a comment...')} 
                                    value={mediaCommentInput} 
                                    onChange={(e) => setMediaCommentInput(e.target.value)} 
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
                                    {showEmojiPicker && renderEmojiPicker()}
                                 </div>

                                 <button type="submit" disabled={!mediaCommentInput.trim()} className="text-emerald-700 hover:bg-emerald-50 p-1.5 rounded-full transition disabled:opacity-50 disabled:hover:bg-transparent">
                                    {dir === 'rtl' ? <Send className="w-5 h-5 rotate-180" /> : <Send className="w-5 h-5" />}
                                 </button>
                            </form>
                         </div>
                    </div>
                </div>
           </div>
       </div>

       {/* Delete Confirmation Modal for Photo Comments */}
       {deleteCommentId && (
          <div className="fixed inset-0 z-[100004] flex items-center justify-center bg-black/60 p-4 animate-fadeIn backdrop-blur-sm" onClick={() => setDeleteCommentId(null)}>
              <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-2xl w-full max-w-sm border border-gray-200 dark:border-gray-700 animate-scaleIn" onClick={e => e.stopPropagation()}>
                  <h3 className="font-bold text-lg mb-2 text-gray-900 dark:text-white">{t.post_delete_confirm_title || (language === 'ar' ? 'حذف التعليق؟' : 'Delete Comment?')}
                  </h3>
                  <p className="text-gray-600 dark:text-gray-300 text-sm mb-6">{language === 'ar' ? 'هل أنت متأكد من أنك تريد حذف هذا التعليق نهائياً؟' : 'Are you sure you want to delete this comment permanently?'}</p>
                  <div className="flex justify-end gap-3">
                      <button onClick={() => setDeleteCommentId(null)} className="px-5 py-2 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg text-sm font-bold transition">{t.common_cancel || (language === 'ar' ? 'إلغاء' : 'Cancel')}</button>
                      <button 
                          onClick={handleDeleteCommentConfirm} 
                          className="px-6 py-2 bg-red-600 text-white rounded-lg text-sm font-bold hover:bg-red-700 transition shadow-lg"
                      >
                          {t.common_delete || (language === 'ar' ? 'حذف' : 'Delete')}
                      </button>
                  </div>
              </div>
          </div>
       )}

       {/* Share Modal - Advanced Version */}
       {isShareModalOpen && (
          <div className="fixed inset-0 z-[100005] bg-black/60 flex items-center justify-center p-4 animate-fadeIn backdrop-blur-sm" onClick={() => setIsShareModalOpen(false)}>
              <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl w-full max-w-md overflow-hidden animate-scaleIn border border-white/10 dark:border-gray-700" onClick={e => e.stopPropagation()}>
                  <div className="p-4 border-b border-gray-100 dark:border-gray-700 flex justify-between items-center bg-gray-50 dark:bg-gray-900/50">
                      <h3 className="font-extrabold text-lg text-gray-900 dark:text-white flex items-center gap-2">
                          <Share2 className="w-5 h-5 text-emerald-700 dark:text-emerald-500" />
                          {t.common_share || (language === 'ar' ? 'مشاركة' : 'Share')}
                      </h3>
                      <button onClick={() => setIsShareModalOpen(false)} className="text-gray-500 hover:bg-gray-200 dark:hover:bg-gray-600 rounded-full p-1.5 transition">
                          <X className="w-5 h-5" />
                      </button>
                  </div>
                  <div className="p-8">
                      <div className="grid grid-cols-4 gap-6 mb-10">
                          <button onClick={() => handleSocialShare('facebook')} className="flex flex-col items-center gap-2 group"><div className="w-14 h-14 bg-[#1877F2] rounded-full flex items-center justify-center text-white shadow-lg transition transform group-hover:scale-110 active:scale-95"><Facebook className="w-7 h-7 fill-current" /></div><span className="text-[10px] font-bold text-gray-500 dark:text-gray-400 uppercase tracking-widest">Facebook</span></button>
                          <button onClick={() => handleSocialShare('twitter')} className="flex flex-col items-center gap-2 group"><div className="w-14 h-14 bg-black rounded-full flex items-center justify-center text-white shadow-lg transition transform group-hover:scale-110 active:scale-95"><Twitter className="w-6 h-6 fill-current" /></div><span className="text-[10px] font-bold text-gray-500 dark:text-gray-400 uppercase tracking-widest">Twitter</span></button>
                          <button onClick={() => handleSocialShare('whatsapp')} className="flex flex-col items-center gap-2 group"><div className="w-14 h-14 bg-[#25D366] rounded-full flex items-center justify-center text-white shadow-lg transition transform group-hover:scale-110 active:scale-95"><Phone className="w-7 h-7 fill-current" /></div><span className="text-[10px] font-bold text-gray-500 dark:text-gray-400 uppercase tracking-widest">WhatsApp</span></button>
                          <button onClick={handleCopyLink} className="flex flex-col items-center gap-2 group"><div className="w-14 h-14 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-200 rounded-full flex items-center justify-center shadow-md transition transform group-hover:scale-110 active:scale-95 border border-white dark:border-gray-600">{copyFeedback ? <Check className="w-7 h-7 text-green-600" /> : <Copy className="w-7 h-7" />}</div><span className="text-[10px] font-bold text-gray-600 dark:text-gray-400 uppercase tracking-widest">{t.common_copy || (language === 'ar' ? 'نسخ' : 'Copy')}</span></button>
                      </div>
                      <div className="space-y-3">
                          <label className="text-[10px] font-extrabold text-gray-400 dark:text-gray-500 uppercase tracking-[0.2em] px-1 block text-start">{t.post_copy_link || (language === 'ar' ? 'رابط المشاركة' : 'Share Link')}</label>
                          <div className="flex items-center gap-2 bg-gray-100 dark:bg-gray-900 p-2.5 rounded-xl border border-gray-200 dark:border-gray-700 shadow-inner">
                              <LinkIcon className="w-4 h-4 text-gray-400 ml-1" />
                              <input 
                                 type="text" 
                                 readOnly 
                                 value={window.location.href} 
                                 className="bg-transparent border-none outline-none text-xs text-gray-600 dark:text-gray-400 flex-1 truncate font-mono text-left" 
                                 dir="ltr"
                              />
                              <button onClick={handleCopyLink} className="bg-fb-blue text-white px-4 py-1.5 rounded-lg text-xs font-bold hover:bg-blue-700 transition active:scale-95 shadow-sm">{copyFeedback ? (t.common_done || 'تم!') : (t.common_copy || 'نسخ')}</button>
                          </div>
                      </div>
                  </div>
                  <div className="p-4 bg-gray-50 dark:bg-gray-800/80 border-t border-gray-100 dark:border-gray-700 flex items-center gap-2 text-gray-400">
                      <Globe className="w-3.5 h-3.5" />
                      <span className="text-[10px] font-medium">{language === 'ar' ? 'سيتم فتح الروابط في نافذة جديدة' : 'Links will open in a new window'}</span>
                  </div>
              </div>
          </div>
       )}

       {/* Report Modal */}
       {showReportModal && (
            <div className="fixed inset-0 z-[100005] bg-black/60 flex items-center justify-center p-4 animate-fadeIn backdrop-blur-sm" onClick={() => setShowReportModal(false)}>
                <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl w-full max-w-sm overflow-hidden animate-scaleIn border border-white/20 dark:border-gray-700" onClick={e => e.stopPropagation()}>
                    <div className="p-4 border-b border-gray-100 dark:border-gray-700 flex justify-between items-center bg-gray-50 dark:bg-gray-700/50 shadow-sm">
                        <h3 className="font-bold text-lg text-gray-900 dark:text-white flex items-center gap-2">
                            <AlertTriangle className="w-5 h-5 text-red-500" />
                            {language === 'ar' ? 'إبلاغ' : 'Report'}
                        </h3>
                        <button onClick={() => setShowReportModal(false)} className="text-gray-500 hover:bg-gray-200 dark:hover:bg-gray-600 rounded-full p-1.5 transition">
                            <X className="w-5 h-5" />
                        </button>
                    </div>
                    <div className="p-6 space-y-3">
                        <p className="text-sm text-gray-600 dark:text-gray-300 mb-2">{language === 'ar' ? 'يرجى تحديد سبب الإبلاغ:' : 'Please select a reason:'}</p>
                        {[
                            { id: 'inappropriate', label: language === 'ar' ? 'محتوى غير لائق' : 'Inappropriate content' },
                            { id: 'spam', label: language === 'ar' ? 'سبام أو احتيال' : 'Spam or fraud' },
                            { id: 'hate', label: language === 'ar' ? 'خطاب كراهية' : 'Hate speech' },
                            { id: 'violence', label: language === 'ar' ? 'عنف' : 'Violence' },
                            { id: 'other', label: language === 'ar' ? 'غير ذلك' : 'Other' }
                        ].map((option) => (
                            <label key={option.id} className="flex items-center gap-3 p-3 border border-gray-200 dark:border-gray-700 rounded-lg cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700 transition">
                                <input 
                                    type="radio" 
                                    name="reportReason" 
                                    value={option.id} 
                                    checked={reportReason === option.id}
                                    onChange={(e) => setReportReason(e.target.value)} 
                                    className="text-fb-blue focus:ring-fb-blue h-4 w-4"
                                />
                                <span className="text-gray-700 dark:text-gray-200 text-sm font-medium">{option.label}</span>
                            </label>
                        ))}
                    </div>
                    {reportFeedback && (
                        <div className="p-3 bg-green-50 dark:bg-green-900/20 text-center text-green-700 dark:text-green-400 text-xs font-bold border-t border-green-100 dark:border-green-800/30 shadow-inner">
                            {language === 'ar' ? 'تم إرسال البلاغ بنجاح' : 'Report sent successfully'}
                        </div>
                    )}
                    <div className="p-4 bg-gray-50 dark:bg-gray-800/80 border-t border-gray-100 dark:border-gray-700 flex justify-end gap-3">
                        <button onClick={() => setShowReportModal(false)} className="px-4 py-2 text-gray-600 dark:text-gray-300 font-bold hover:bg-gray-200 dark:hover:bg-gray-600 rounded-lg transition text-sm">
                            {t.common_cancel}
                        </button>
                        <button 
                            onClick={handleSubmitReport} 
                            disabled={!reportReason || isReportSubmitting}
                            className="px-6 py-2 bg-red-500 text-white font-bold rounded-lg hover:bg-red-600 transition shadow-sm disabled:opacity-50 flex items-center gap-2 text-sm"
                        >
                            {isReportSubmitting && <Loader2 className="w-4 h-4 animate-spin" />}
                            {t.common_send}
                        </button>
                    </div>
                </div>
            </div>
       )}

    </div>
  );
};

export default PageMediaLightbox;