import React, { useState, useRef, useEffect } from 'react';
import {
  X, ChevronLeft, ChevronRight, MoreHorizontal, Bookmark, BookmarkMinus,
  MessageCircle, Globe, Users, AtSign, Bell, BellOff, Share2, Download,
  UserCircle, Trash2, ThumbsUp, Send, Smile, ArrowRight, Check, UserPlus, Lock,
  Facebook, Twitter, Phone, Link as LinkIcon, Copy, Flag, AlertTriangle, Loader2,
  AlertCircle, Pin, PinOff, Search, Clock, Cat, Coffee, Gamepad2, Plane, Lightbulb
} from 'lucide-react';
import { Photo, User, Post } from '../types';
import { useLanguage } from '../context/LanguageContext';

const REACTIONS = [
    { name: 'like', label: 'إعجاب', emoji: '👍', color: 'text-blue-500' },
    { name: 'love', label: 'حب', emoji: '❤️', color: 'text-red-500' },
    { name: 'care', label: 'أدعمك', emoji: '🥰', color: 'text-yellow-500' },
    { name: 'haha', label: 'هاها', emoji: '😂', color: 'text-yellow-500' },
    { name: 'wow', label: 'واو', emoji: '😮', color: 'text-yellow-500' },
    { name: 'sad', label: 'حزين', emoji: '😢', color: 'text-yellow-500' },
    { name: 'angry', label: 'غاضب', emoji: '😡', color: 'text-orange-600' },
];

const EMOJI_CATEGORIES = {
  smileys: {
    icon: Smile,
    label: "smileys",
    emojis: ["😀","😃","😄","😁","😆","😅","🤣","😂","🙂","🙃","😉","😊","😇","🥰","🤩","😘","😗","😚","😙","😋","😛","😜","🤪","😝","🤑","🤗","🤭","🤫","🤔","🤐","🤨","😐","😑","😶","😏","😒","🙄","😬","🤥","😌","😔","😪","🤤","😴","😷","🤒","🤕","🤢","🤮","🤧","🥵","🥶","🥴","😵","🤯","🤠","🥳","😎","🤓","🧐","😕","😟","🙁","😮","😯","😲","😳","🥺","😦","😧","😨","😰","😥","😢","😭","😱","😖","😣","😞","😓","😩","😫","🥱","😤","😡","😠","🤬","💋","💌","💘","💝","💖","💗","💓","💞","💕","💟","❣","💔","❤","🧡","💛","💚","💙","💜","🤎","🖤","🤍","💯","💢","💥","💫","💦","💨","🕳","💣","💬","👁️‍🗨️","🗨","🗯","💭","💤","😈","👿","💀","☠","💩","🤡","👹","👺","👻","👽","👾","🤖"]
  },
  animals: {
    icon: Cat,
    label: "animals",
    emojis: ["😺","😸","😹","😻","😼","😽","🙀","😿","😾","🐶","🐱","🐭","🐹","🐰","🦊","🐻","🐼","🐨","🐯","🦁","🐮","🐷","🐽","🐸","🐵","🙉","🙊","🐒","🐔","🐧","🐦","🐤","🐣","🐥","🦆","🦅","🦉","🦇","🐺","🐗","🐴","🦄","🐝","🐛","🦋","🐌","🐞","🐜","🦟","🦗","🕷","🕸","🦂","🐢","🐍","🦎","🦖","🦕","🐙","🦑","🦐","🦞","🦀","🐡","🐠","🐟","🐬","🐳","🐋","🦈","🐊","🐅","🐆","🦓","🦍","🦧","🐘","🦛","🦏","🐪","🐫","🦒","🦘","🐃","🐂","🐄","🐎","🐖","🐏","🐑","🦙","🐐","🦌","🐕","🐩","🦮","🐕‍🦺","🐈","🐈‍⬛","🐓","🦃","🦚","🦜","🦢","🦩","🕊","🐇","🦝","🦨","🦡","🦦","🦥","🐁","🐀","🐿","🦔","🐾","🐉","🐲"]
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

type MenuView = 'main' | 'audience' | 'comments';
type AudienceType = 'public' | 'friends' | 'friends_of_friends' | 'only_me';
type CommentAudienceType = 'public' | 'friends' | 'mentions';

interface ProfileMediaLightboxProps {
  viewingMedia: { url: string; type: 'image' | 'video'; postId?: string };
  viewingPost: Post | null;
  profileImagesList: string[];
  currentUser: User;
  isOwnProfile: boolean;
  isSaved: boolean;
  onClose: () => void;
  onNext: (e: React.MouseEvent) => void;
  onPrev: (e: React.MouseEvent) => void;
  onLike: (reactionType?: string) => void;
  onComment: (text: string) => void;
  onDeleteComment: (commentId: string) => void;
  onLikeComment?: (commentId: string) => void; 
  onDeletePost: () => void;
  onToggleSave: () => void;
  onTogglePin: () => void;
  onUpdateAvatar: (url: string) => void;
}

const ProfileMediaLightbox: React.FC<ProfileMediaLightboxProps> = ({
  viewingMedia,
  viewingPost,
  profileImagesList,
  currentUser,
  isOwnProfile,
  isSaved,
  onClose,
  onNext,
  onPrev,
  onLike,
  onComment,
  onDeleteComment,
  onLikeComment,
  onDeletePost,
  onToggleSave,
  onTogglePin,
  onUpdateAvatar
}) => {
  const { t, language, dir } = useLanguage();

  // Internal State
  const [showMenu, setShowMenu] = useState(false);
  const [menuView, setMenuView] = useState<MenuView>('main');
  const [notificationsOn, setNotificationsOn] = useState(true);
  const [audience, setAudience] = useState<AudienceType>('public');
  const [commentAudience, setCommentAudience] = useState<CommentAudienceType>('public');
  
  // Reaction State
  const [showReactions, setShowReactions] = useState(false);
  const reactionTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const [commentInput, setCommentInput] = useState('');
  const [replyingToId, setReplyingToId] = useState<string | null>(null);
  const [replyText, setReplyText] = useState('');
  
  const [deleteCommentId, setDeleteCommentId] = useState<string | null>(null);
  const [showDeletePostModal, setShowDeletePostModal] = useState(false);
  
  const [copyFeedback, setCopyFeedback] = useState(false);
  const [showShareModal, setShowShareModal] = useState(false);

  // Report Modal State
  const [showReportModal, setShowReportModal] = useState(false);
  const [reportReason, setReportReason] = useState('');
  const [isReportSubmitting, setIsReportSubmitting] = useState(false);
  const [reportFeedback, setReportFeedback] = useState(false);

  // Emoji Picker State
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [activeEmojiTab, setActiveEmojiTab] = useState<'recent' | keyof typeof EMOJI_CATEGORIES>('recent');
  const [emojiSearch, setEmojiSearch] = useState('');
  const [recentEmojis, setRecentEmojis] = useState<string[]>([]);

  // Refs
  const menuRef = useRef<HTMLDivElement>(null);
  const commentsEndRef = useRef<HTMLDivElement>(null);
  const commentInputRef = useRef<HTMLInputElement>(null);
  const emojiPickerRef = useRef<HTMLDivElement>(null);

  const currentReaction = viewingPost?.isLiked ? (REACTIONS.find(r => r.name === viewingPost.reaction) || REACTIONS[0]) : null;

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
      if (commentsEndRef.current && viewingPost) {
          commentsEndRef.current.scrollIntoView({ behavior: 'smooth' });
      }
  }, [viewingPost?.comments]);

  useEffect(() => {
      const savedRecents = localStorage.getItem('chat_recent_emojis');
      if (savedRecents) {
          setRecentEmojis(JSON.parse(savedRecents));
      }
  }, []);

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

  const handleReactionSelect = (reaction: typeof REACTIONS[0]) => {
      onLike(reaction.name);
      setShowReactions(false);
  };

  const handleSendComment = (e?: React.FormEvent) => {
      e?.preventDefault();
      if (!commentInput.trim()) return;
      onComment(commentInput);
      setCommentInput('');
      setShowEmojiPicker(false);
  };

  const handleInlineReplySubmit = (e: React.FormEvent) => {
      e?.preventDefault();
      if (!replyText.trim()) return;
      onComment(replyText);
      setReplyingToId(null);
      setReplyText('');
  };

  const handleDeleteCommentConfirm = (commentId: string) => {
      onDeleteComment(commentId);
      setDeleteCommentId(null);
  };

  const handleDownload = () => {
      const link = document.createElement('a');
      link.href = viewingMedia.url;
      link.download = `media_${Date.now()}`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      setShowMenu(false);
  };

  const handleCopyLink = () => {
      const link = viewingPost 
        ? `${window.location.origin}/post/${viewingPost.id}`
        : viewingMedia.url;
        
      navigator.clipboard.writeText(link).then(() => {
          setCopyFeedback(true);
          setTimeout(() => setCopyFeedback(false), 2000);
          setShowShareModal(false);
          setShowMenu(false);
      });
  };

  const handleSetProfilePicture = () => {
      onUpdateAvatar(viewingMedia.url);
      setShowMenu(false);
  };

  const handleSocialShare = (platform: string) => {
      const url = encodeURIComponent(viewingPost ? `${window.location.origin}/post/${viewingPost.id}` : viewingMedia.url);
      const text = encodeURIComponent(viewingPost?.content || 'Check out this post on Tourloop');
      let shareUrl = '';
      if (platform === 'facebook') shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${url}`;
      if (platform === 'twitter') shareUrl = `https://twitter.com/intent/tweet?url=${url}&text=${text}`;
      if (platform === 'whatsapp') shareUrl = `https://api.whatsapp.com/send?text=${text}%20${url}`;
      if (shareUrl) window.open(shareUrl, '_blank', 'width=600,height=400');
      setShowShareModal(false);
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

  const handleEmojiClick = (emoji: string) => {
      setCommentInput(prev => prev + emoji);
      const newRecents = [...new Set([emoji, ...recentEmojis])].slice(0, 24);
      setRecentEmojis(newRecents);
      localStorage.setItem('chat_recent_emojis', JSON.stringify(newRecents));

      if(commentInputRef.current) {
          commentInputRef.current.focus();
      }
      setShowEmojiPicker(false);
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
    <div className="fixed inset-0 z-[100000] bg-black flex items-center justify-center animate-fadeIn">
       
       {/* Copy Feedback Toast */}
       {copyFeedback && (
          <div className="absolute top-10 left-1/2 transform -translate-x-1/2 z-[100010] bg-emerald-700 text-white px-4 py-2 rounded-md shadow-lg text-sm flex items-center gap-2 animate-fadeIn">
              <Check className="w-4 h-4" />
              {t.common_copied || (language === 'ar' ? 'تم النسخ' : 'Copied')}
          </div>
       )}

       <div className="w-full h-full flex flex-col md:flex-row overflow-hidden">
           
           {/* Media Display */}
           <div className="flex-1 bg-black flex items-center justify-center relative group" onClick={(e) => e.stopPropagation()}>
                
                <button className="absolute top-4 left-4 p-2 bg-black/50 hover:bg-white/20 rounded-full text-white z-[102]" onClick={onClose}>
                    <X className="w-6 h-6" />
                </button>

                {profileImagesList.length > 1 && viewingMedia.type === 'image' && (
                    <button className="absolute right-4 top-1/2 -translate-y-1/2 p-3 bg-black/50 hover:bg-white/20 rounded-full text-white z-10 transition hover:scale-110" onClick={onPrev}>
                        <ChevronRight className="w-8 h-8" />
                    </button>
                )}

                {viewingMedia.type === 'video' ? (
                   <video 
                      src={viewingMedia.url} 
                      className="w-full h-full object-contain" 
                      controls 
                      autoPlay 
                   />
                ) : (
                   <img 
                      src={viewingMedia.url} 
                      className="w-full h-full object-contain" 
                      alt="Full screen" 
                   />
                )}

                {profileImagesList.length > 1 && viewingMedia.type === 'image' && (
                    <button className="absolute left-4 top-1/2 -translate-y-1/2 p-3 bg-black/50 hover:bg-white/20 rounded-full text-white z-10 transition hover:scale-110" onClick={onNext}>
                        <ChevronLeft className="w-8 h-8" />
                    </button>
                )}
           </div>

           {/* Sidebar */}
           <div className="w-full md:w-[360px] bg-white dark:bg-gray-800 flex flex-col h-[45vh] md:h-full border-l border-gray-200 dark:border-gray-700 shadow-xl" onClick={(e) => e.stopPropagation()}>
                <div className="p-4 border-b border-gray-200 dark:border-gray-700 flex items-center gap-3 relative">
                    <img src={viewingPost?.author.avatar || currentUser.avatar} alt="User" className="w-10 h-10 rounded-full border border-gray-200 dark:border-gray-600 shadow-sm" />
                    <div>
                        <h4 className="font-bold text-sm text-gray-900 dark:text-white">{viewingPost?.author.name || currentUser.name}</h4>
                        <div className="flex items-center gap-1 text-xs text-gray-500 dark:text-gray-400">
                            <span>{viewingPost?.timestamp || 'الآن'}</span>
                            <span>·</span>
                            {getAudienceIcon(audience)}
                        </div>
                    </div>
                    
                    <div className="mr-auto relative" ref={menuRef}>
                        <button 
                            onClick={() => { setShowMenu(!showMenu); setMenuView('main'); }}
                            className={`p-2 rounded-full transition ${showMenu ? 'bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-white' : 'text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-700'}`}
                        >
                            <MoreHorizontal className="w-5 h-5" />
                        </button>
                        
                        {showMenu && (
                            <div className={`absolute top-full mt-1 w-80 bg-white dark:bg-gray-800 shadow-xl rounded-lg border border-gray-100 dark:border-gray-700 z-50 overflow-hidden animate-fadeIn ${dir === 'rtl' ? 'left-0 origin-top-left' : 'right-0 origin-top-right'}`}>
                                {menuView === 'main' && (
                                    <>
                                        {isOwnProfile && (
                                            <button 
                                                onClick={() => { onTogglePin(); setShowMenu(false); }}
                                                className="w-full text-start px-4 py-3 hover:bg-gray-100 dark:hover:bg-gray-700 flex items-center gap-3 text-sm text-gray-700 dark:text-gray-200 transition"
                                            >
                                                {viewingPost?.isPinned ? <PinOff className="w-5 h-5 text-fb-blue" /> : <Pin className="w-5 h-5" />}
                                                {viewingPost?.isPinned ? (language === 'ar' ? 'إلغاء التثبيت' : 'Unpin Post') : (language === 'ar' ? 'تثبيت المنشور' : 'Pin Post')}
                                            </button>
                                        )}

                                        {viewingPost && (
                                            <button 
                                                onClick={() => { onToggleSave(); setShowMenu(false); }} 
                                                className="w-full text-start px-4 py-3 hover:bg-gray-100 dark:hover:bg-gray-700 flex items-center gap-3 text-sm text-gray-700 dark:text-gray-200 transition"
                                            >
                                                {isSaved ? <BookmarkMinus className="w-5 h-5 text-fb-blue" /> : <Bookmark className="w-5 h-5" />} 
                                                {isSaved ? 'إلغاء الحفظ' : 'حفظ المنشور'}
                                            </button>
                                        )}

                                        <div className="border-t border-gray-100 dark:border-gray-700 my-1"></div>
                                        
                                        <button onClick={() => setMenuView('audience')} className="w-full text-start px-4 py-3 hover:bg-gray-100 dark:hover:bg-gray-700 flex items-center justify-between text-sm text-gray-700 dark:text-gray-200 transition group">
                                            <div className="flex items-center gap-3">{getAudienceIcon(audience)} <span>تعديل الجمهور</span></div>
                                            <ChevronLeft className="w-4 h-4 text-gray-400 group-hover:text-gray-600" />
                                        </button>

                                        <button onClick={() => setMenuView('comments')} className="w-full text-start px-4 py-3 hover:bg-gray-100 dark:hover:bg-gray-700 flex items-center justify-between text-sm text-gray-700 dark:text-gray-200 transition group">
                                            <div className="flex items-center gap-3"><MessageCircle className="w-5 h-5" /> من الذي يمكنه التعليق؟</div>
                                            <ChevronLeft className="w-4 h-4 text-gray-400 group-hover:text-gray-600" />
                                        </button>
                                        
                                        <button onClick={() => { setNotificationsOn(!notificationsOn); setShowMenu(false); }} className="w-full text-start px-4 py-3 hover:bg-gray-100 dark:hover:bg-gray-700 flex items-center gap-3 text-sm text-gray-700 dark:text-gray-200 transition">
                                            {notificationsOn ? <BellOff className="w-5 h-5" /> : <Bell className="w-5 h-5" />}
                                            {notificationsOn 
                                                ? (language === 'ar' ? 'إيقاف الإشعارات' : 'Turn off notifications') 
                                                : (language === 'ar' ? 'تشغيل الإشعارات' : 'Turn on notifications')
                                            }
                                        </button>

                                        <div className="border-t border-gray-100 dark:border-gray-700 my-1"></div>

                                        <button 
                                            onClick={() => { setShowShareModal(true); setShowMenu(false); }}
                                            className="w-full text-start px-4 py-3 hover:bg-gray-100 dark:hover:bg-gray-700 flex items-center gap-3 text-sm text-gray-700 dark:text-gray-200 transition"
                                        >
                                            <Share2 className="w-5 h-5" /> مشاركة
                                        </button>
                                        
                                        <button 
                                            onClick={handleDownload}
                                            className="w-full text-start px-4 py-3 hover:bg-gray-100 dark:hover:bg-gray-700 flex items-center gap-3 text-sm text-gray-700 dark:text-gray-200 transition"
                                        >
                                            <Download className="w-5 h-5" /> تنزيل
                                        </button>

                                        <button 
                                            onClick={handleCopyLink} 
                                            className="w-full text-start px-4 py-3 hover:bg-gray-100 dark:hover:bg-gray-700 flex items-center gap-3 text-sm text-gray-700 dark:text-gray-200 transition"
                                        >
                                            <LinkIcon className="w-5 h-5" /> {t.post_copy_link || (language === 'ar' ? 'نسخ الرابط' : 'Copy link')}
                                        </button>
                                        
                                        {isOwnProfile && (
                                            <>
                                                <div className="border-t border-gray-100 dark:border-gray-700 my-1"></div>

                                                {viewingMedia?.type === 'image' && (
                                                    <button 
                                                        onClick={handleSetProfilePicture}
                                                        className="w-full text-start px-4 py-3 hover:bg-gray-100 dark:hover:bg-gray-700 flex items-center gap-3 text-sm text-gray-700 dark:text-gray-200 transition"
                                                    >
                                                        <UserCircle className="w-5 h-5" /> تعيين كصورة ملف شخصي
                                                    </button>
                                                )}

                                                {(viewingPost || viewingMedia?.postId) && (
                                                    <button 
                                                        onClick={() => { setShowMenu(false); setShowDeletePostModal(true); }}
                                                        className="w-full text-start px-4 py-3 hover:bg-gray-100 dark:hover:bg-gray-700 flex items-center gap-3 text-sm text-red-600 font-medium transition"
                                                    >
                                                        <Trash2 className="w-5 h-5" /> حذف المنشور
                                                    </button>
                                                )}
                                            </>
                                        )}

                                        {!isOwnProfile && (
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
                                            <span className="font-bold text-sm text-gray-800 dark:text-white">تعديل الجمهور</span>
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
                                            <span className="font-bold text-sm text-gray-800 dark:text-white">من الذي يمكنه التعليق؟</span>
                                        </div>
                                        <div className="py-2">
                                            <div className="px-4 text-xs text-gray-500 dark:text-gray-400 mb-2">اختر من يُسمح له بالتعليق على منشورك.</div>
                                            <button onClick={() => { setCommentAudience('public'); setShowMenu(false); }} className="w-full text-start px-4 py-3 hover:bg-gray-100 dark:hover:bg-gray-700 flex items-center justify-between text-sm text-gray-700 dark:text-gray-200 transition">
                                                 <div className="flex items-center gap-3">
                                                     <div className="bg-gray-100 dark:bg-gray-700 p-2 rounded-full"><Globe className="w-4 h-4" /></div>
                                                     <span className="font-semibold">العامة</span>
                                                 </div>
                                                 {commentAudience === 'public' && <div className="w-2 h-2 bg-fb-blue rounded-full"></div>}
                                            </button>
                                            <button onClick={() => { setCommentAudience('friends'); setShowMenu(false); }} className="w-full text-start px-4 py-3 hover:bg-gray-100 dark:hover:bg-gray-700 flex items-center justify-between text-sm text-gray-700 dark:text-gray-200 transition">
                                                 <div className="flex items-center gap-3">
                                                     <div className="bg-gray-100 dark:bg-gray-700 p-2 rounded-full"><Users className="w-4 h-4" /></div>
                                                     <span className="font-semibold">الأصدقاء</span>
                                                 </div>
                                                 {commentAudience === 'friends' && <div className="w-2 h-2 bg-fb-blue rounded-full"></div>}
                                            </button>
                                            <button onClick={() => { setCommentAudience('mentions'); setShowMenu(false); }} className="w-full text-start px-4 py-3 hover:bg-gray-100 dark:hover:bg-gray-700 flex items-center justify-between text-sm text-gray-700 dark:text-gray-200 transition">
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
                        <div className="bg-fb-blue p-1 rounded-full shadow-sm"><ThumbsUp className="w-3 h-3 text-white fill-current" /></div>
                        <span>{(viewingPost?.likes || 0) > 0 ? viewingPost?.likes : ''}</span>
                    </div>
                    <div className="flex gap-3">
                        <span>{viewingPost?.comments.length || 0} تعليق</span>
                    </div>
                </div>
                <div className="px-2 py-1 flex items-center justify-between border-b border-gray-200 dark:border-gray-700 relative">
                     {/* Added Feature: Floating Reactions Bar */}
                     {showReactions && (
                        <div 
                            className={`absolute bottom-full mb-2 right-4 bg-white dark:bg-gray-700 shadow-2xl rounded-full p-2 flex gap-2 animate-bounce-in z-50 border border-gray-200 dark:border-gray-600`}
                            onMouseLeave={() => setShowReactions(false)}
                        >
                            {REACTIONS.map(r => (
                                <button 
                                    key={r.name} 
                                    onClick={() => handleReactionSelect(r)} 
                                    className="hover:scale-150 transition-transform duration-200 p-1 rounded-full hover:bg-gray-100 dark:hover:bg-gray-600 relative group"
                                    title={r.label}
                                >
                                    <span className="text-2xl">{r.emoji}</span>
                                </button>
                            ))}
                        </div>
                     )}

                     <button 
                        onClick={() => onLike(currentReaction?.name)}
                        onMouseEnter={() => { reactionTimerRef.current = setTimeout(() => setShowReactions(true), 500); }}
                        onMouseLeave={() => { if (reactionTimerRef.current) clearTimeout(reactionTimerRef.current); }}
                        className={`flex-1 flex items-center justify-center gap-2 py-2.5 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-all ${currentReaction ? currentReaction.color : 'text-gray-600 dark:text-gray-300'}`}
                     >
                        {currentReaction ? <span className="text-xl">{currentReaction.emoji}</span> : <ThumbsUp className={`w-5 h-5 ${viewingPost?.isLiked ? 'fill-current' : ''}`} />} {currentReaction ? currentReaction.label : 'أعجبني'}
                     </button>
                     <button onClick={() => commentInputRef.current?.focus()} className="flex-1 flex items-center justify-center gap-2 py-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-md transition font-medium text-gray-600 dark:text-gray-300 text-sm">
                        <MessageCircle className="w-5 h-5" /> تعليق
                     </button>
                     <button onClick={() => setShowShareModal(true)} className="flex-1 flex items-center justify-center gap-2 py-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-md transition font-medium text-gray-600 dark:text-gray-300 text-sm">
                        <Share2 className="w-5 h-5" /> مشاركة
                     </button>
                </div>

                <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50 dark:bg-gray-900/30">
                    {(!viewingPost || viewingPost.comments.length === 0) ? (
                        <div className="text-center text-gray-400 dark:text-gray-500 py-10 text-sm">كن أول من يعلق على هذا المنشور.</div>
                    ) : (
                        viewingPost.comments.map(comment => (
                            <div key={comment.id} className="flex gap-2 group flex-col">
                                <div className="flex gap-2 items-start">
                                    <img src={comment.author.avatar} className="w-8 h-8 rounded-full shadow-sm" alt="commenter" />
                                    <div className="flex flex-col flex-1">
                                        <div className="bg-gray-200 dark:bg-gray-700 px-3 py-2 rounded-2xl rounded-tr-none relative group/comment w-fit shadow-sm">
                                            <span className="font-bold text-xs block text-gray-900 dark:text-white">{comment.author.name}</span>
                                            <span className="text-sm text-gray-800 dark:text-gray-200">{comment.content}</span>
                                        </div>
                                        <div className="flex gap-3 text-[11px] text-gray-500 dark:text-gray-400 pr-2 mt-1 items-center font-bold">
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
                                            <span className="font-normal">{comment.timestamp}</span>
                                            {(comment.author.id === currentUser.id || isOwnProfile) && (
                                                <span 
                                                    className="cursor-pointer hover:underline text-red-500 transition"
                                                    onClick={() => setDeleteCommentId(comment.id)}
                                                >
                                                    حذف
                                                </span>
                                            )}
                                        </div>
                                    </div>
                                </div>
                                
                                {replyingToId === comment.id && (
                                    <div className="mr-12 flex gap-2 animate-fadeIn mt-1">
                                        <img src={currentUser.avatar} className="w-6 h-6 rounded-full border border-white dark:border-gray-700 shadow-sm" alt="me" />
                                        <form className="flex-1" onSubmit={handleInlineReplySubmit}>
                                            <input 
                                                type="text" 
                                                className="w-full bg-gray-100 dark:bg-gray-700 border-none rounded-full px-3 py-1.5 text-xs focus:ring-1 focus:ring-fb-blue transition dark:text-white outline-none shadow-inner" 
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

                <div className="p-3 border-t border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 shadow-inner">
                    <form onSubmit={handleSendComment} className="flex items-center gap-2 relative">
                         <img src={currentUser.avatar} className="w-8 h-8 rounded-full border border-gray-200 dark:border-gray-700 shadow-sm" alt="me" />
                         <div className="flex-1 relative">
                             <input 
                                ref={commentInputRef} 
                                type="text" 
                                className="w-full bg-gray-100 dark:bg-gray-700 border-none rounded-full py-2 px-3 pr-10 text-sm outline-none focus:ring-1 focus:ring-gray-300 transition dark:text-white shadow-inner" 
                                placeholder="اكتب تعليقاً..." 
                                value={commentInput} 
                                onChange={(e) => setCommentInput(e.target.value)} 
                             />
                             <Smile 
                                className={`absolute ${dir === 'rtl' ? 'left-3' : 'right-3'} top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 cursor-pointer hover:text-gray-600 transition`} 
                                onClick={() => setShowEmojiPicker(!showEmojiPicker)} 
                             />
                             
                             {showEmojiPicker && renderEmojiPicker()}
                         </div>
                         <button type="submit" disabled={!commentInput.trim()} className="text-fb-blue disabled:opacity-50 hover:bg-blue-50 dark:hover:bg-blue-900/20 p-2 rounded-full transition transform active:scale-95"><Send className="w-5 h-5 rotate-180" /></button>
                    </form>
                </div>
           </div>
       </div>

       {/* Delete Post Modal */}
       {showDeletePostModal && (
          <div className="fixed inset-0 z-[100003] flex items-center justify-center bg-black/60 p-4 animate-fadeIn backdrop-blur-sm" onClick={() => setShowDeletePostModal(false)}>
              <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-2xl w-full max-w-sm border border-gray-200 dark:border-gray-700 animate-scaleIn" onClick={e => e.stopPropagation()}>
                  <h3 className="font-bold text-lg mb-2 text-gray-900 dark:text-white flex items-center gap-2">
                    <Trash2 className="w-5 h-5 text-red-500" />
                    حذف المنشور؟
                  </h3>
                  <p className="text-gray-600 dark:text-gray-300 text-sm mb-6 leading-relaxed">
                    هل أنت متأكد من حذف هذا المنشور؟ لا يمكن التراجع عن هذا الإجراء وسيتم إزالته من يومياتك.
                  </p>
                  <div className="flex justify-end gap-3">
                      <button onClick={() => setShowDeletePostModal(false)} className="px-5 py-2 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg text-sm font-bold transition">إلغاء</button>
                      <button 
                          onClick={() => { onDeletePost(); setShowDeletePostModal(false); }} 
                          className="px-6 py-2 bg-red-600 text-white rounded-lg text-sm font-bold hover:bg-red-700 transition shadow-lg"
                      >
                          تأكيد الحذف
                      </button>
                  </div>
              </div>
          </div>
       )}

       {/* Delete Confirmation Modal for Photo Comments */}
       {deleteCommentId && (
          <div className="fixed inset-0 z-[100004] flex items-center justify-center bg-black/60 p-4 animate-fadeIn backdrop-blur-sm" onClick={() => setDeleteCommentId(null)}>
              <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-2xl w-full max-w-sm border border-gray-200 dark:border-gray-700 animate-scaleIn" onClick={e => e.stopPropagation()}>
                  <h3 className="font-bold text-lg mb-2 text-gray-900 dark:text-white">حذف التعليق؟</h3>
                  <p className="text-gray-600 dark:text-gray-300 text-sm mb-6">هل أنت متأكد من أنك تريد حذف هذا التعليق نهائياً؟</p>
                  <div className="flex justify-end gap-3">
                      <button onClick={() => setDeleteCommentId(null)} className="px-5 py-2 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg text-sm font-bold transition">إلغاء</button>
                      <button 
                          onClick={() => handleDeleteCommentConfirm(deleteCommentId)} 
                          className="px-6 py-2 bg-red-600 text-white rounded-lg text-sm font-bold hover:bg-red-700 transition shadow-lg"
                      >
                          حذف
                      </button>
                  </div>
              </div>
          </div>
       )}

       {/* Share Modal - Advanced Version */}
       {showShareModal && (
          <div className="fixed inset-0 z-[100005] bg-black/60 flex items-center justify-center p-4 animate-fadeIn backdrop-blur-sm" onClick={() => setShowShareModal(false)}>
              <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl w-full max-w-md overflow-hidden animate-scaleIn border border-white/10 dark:border-gray-700" onClick={e => e.stopPropagation()}>
                  <div className="p-4 border-b border-gray-100 dark:border-gray-700 flex justify-between items-center bg-gray-50 dark:bg-gray-900/50">
                      <h3 className="font-extrabold text-lg text-gray-900 dark:text-white flex items-center gap-2">
                          <Share2 className="w-5 h-5 text-emerald-700 dark:text-emerald-500" />
                          مشاركة
                      </h3>
                      <button onClick={() => setShowShareModal(false)} className="text-gray-500 hover:bg-gray-200 dark:hover:bg-gray-600 rounded-full p-1.5 transition">
                          <X className="w-5 h-5" />
                      </button>
                  </div>
                  <div className="p-8">
                      <div className="grid grid-cols-4 gap-6 mb-10">
                          <button onClick={() => handleSocialShare('facebook')} className="flex flex-col items-center gap-2 group"><div className="w-14 h-14 bg-[#1877F2] rounded-full flex items-center justify-center text-white shadow-lg transition transform group-hover:scale-110 active:scale-95"><Facebook className="w-7 h-7 fill-current" /></div><span className="text-[10px] font-bold text-gray-500 dark:text-gray-400 uppercase tracking-widest">Facebook</span></button>
                          <button onClick={() => handleSocialShare('twitter')} className="flex flex-col items-center gap-2 group"><div className="w-14 h-14 bg-black rounded-full flex items-center justify-center text-white shadow-lg transition transform group-hover:scale-110 active:scale-95"><Twitter className="w-6 h-6 fill-current" /></div><span className="text-[10px] font-bold text-gray-500 dark:text-gray-400 uppercase tracking-widest">Twitter</span></button>
                          <button onClick={() => handleSocialShare('whatsapp')} className="flex flex-col items-center gap-2 group"><div className="w-14 h-14 bg-[#25D366] rounded-full flex items-center justify-center text-white shadow-lg transition transform group-hover:scale-110 active:scale-95"><Phone className="w-7 h-7 fill-current" /></div><span className="text-[10px] font-bold text-gray-500 dark:text-gray-400 uppercase tracking-widest">WhatsApp</span></button>
                          <button onClick={handleCopyLink} className="flex flex-col items-center gap-2 group"><div className="w-14 h-14 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-200 rounded-full flex items-center justify-center shadow-md transition transform group-hover:scale-110 active:scale-95 border border-white dark:border-gray-600">{copyFeedback ? <Check className="w-7 h-7 text-green-600" /> : <Copy className="w-7 h-7" />}</div><span className="text-[10px] font-bold text-gray-600 dark:text-gray-400 uppercase tracking-widest">نسخ</span></button>
                      </div>
                      <div className="space-y-3">
                          <label className="text-[10px] font-extrabold text-gray-400 dark:text-gray-500 uppercase tracking-[0.2em] px-1 block text-start">رابط المنشور</label>
                          <div className="flex items-center gap-2 bg-gray-100 dark:bg-gray-900 p-2.5 rounded-xl border border-gray-200 dark:border-gray-700 shadow-inner">
                              <LinkIcon className="w-4 h-4 text-gray-400 ml-1" />
                              <input readOnly value={viewingPost ? `${window.location.origin}/post/${viewingPost.id}` : viewingMedia.url} className="bg-transparent border-none outline-none text-[11px] text-gray-500 flex-1 truncate font-mono" />
                              <button onClick={handleCopyLink} className="bg-fb-blue text-white px-5 py-2 rounded-lg text-xs font-bold hover:bg-blue-700 transition active:scale-95 shadow-sm">{copyFeedback ? 'تم!' : 'نسخ'}</button>
                          </div>
                      </div>
                  </div>
                  <div className="p-4 bg-gray-50 dark:bg-gray-800/80 border-t border-gray-100 dark:border-gray-700 flex items-center gap-2 text-gray-400">
                      <Globe className="w-3.5 h-3.5" />
                      <span className="text-[10px] font-medium">سيتم فتح الروابط في نافذة جديدة</span>
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
                            إبلاغ
                        </h3>
                        <button onClick={() => setShowReportModal(false)} className="text-gray-500 hover:bg-gray-200 dark:hover:bg-gray-600 rounded-full p-1.5 transition">
                            <X className="w-5 h-5" />
                        </button>
                    </div>
                    <div className="p-6 space-y-3">
                        <p className="text-sm text-gray-600 dark:text-gray-300 mb-2">يرجى تحديد سبب الإبلاغ:</p>
                        {[
                            { id: 'inappropriate', label: 'محتوى غير لائق' },
                            { id: 'spam', label: 'سبام أو احتيال' },
                            { id: 'hate', label: 'خطاب كراهية' },
                            { id: 'violence', label: 'عنف' },
                            { id: 'other', label: 'غير ذلك' }
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
                            تم إرسال البلاغ بنجاح
                        </div>
                    )}
                    <div className="p-4 bg-gray-50 dark:bg-gray-800/80 border-t border-gray-100 dark:border-gray-700 flex justify-end gap-3">
                        <button onClick={() => setShowReportModal(false)} className="px-4 py-2 text-gray-600 dark:text-gray-300 font-bold hover:bg-gray-200 dark:hover:bg-gray-600 rounded-lg transition text-sm">
                            إلغاء
                        </button>
                        <button 
                            onClick={handleSubmitReport} 
                            disabled={!reportReason || isReportSubmitting}
                            className="px-6 py-2 bg-red-500 text-white font-bold rounded-lg hover:bg-red-600 transition shadow-sm disabled:opacity-50 flex items-center gap-2 text-sm"
                        >
                            {isReportSubmitting && <Loader2 className="w-4 h-4 animate-spin" />}
                            إرسال
                        </button>
                    </div>
                </div>
            </div>
       )}

    </div>
  );
};

export default ProfileMediaLightbox;