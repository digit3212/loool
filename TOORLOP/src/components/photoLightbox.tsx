import React, { useState, useRef, useEffect, useMemo } from 'react';
import { createPortal } from 'react-dom';
import { 
  X, ChevronLeft, ChevronRight, MoreHorizontal, Bookmark, BookmarkMinus, 
  MessageCircle, Globe, Users, AtSign, Bell, BellOff, Share2, Download, 
  UserCircle, Trash2, ThumbsUp, Send, Smile, Cat, Coffee, Gamepad2, Plane, Lightbulb, Flag,
  ArrowRight, Check, UserPlus, Lock, Facebook, Twitter, Phone, Copy, Link as LinkIcon, 
  Play, Clock, Search, Pin, PinOff
} from 'lucide-react';
import { Photo, User, Post } from '../types';
import { useLanguage } from '../context/LanguageContext';

interface PhotoLightboxProps {
  photos: Photo[];
  initialIndex: number;
  onClose: () => void;
  currentUser: User;
  isOwnProfile: boolean;
  savedPhotos: Photo[];
  onToggleSave?: (photo: Photo) => void;
  onLike?: (id: string, reactionType?: string) => void;
  onComment?: (id: string, text: string) => void;
  onDeleteComment?: (photoId: string, commentId: string) => void;
  onLikeComment?: (photoId: string, commentId: string) => void;
  onDeletePhoto?: (id: string, type?: 'photo') => void;
  onUpdateAvatar?: (url: string) => void;
  viewingPost?: Post | null;
  onTogglePin?: () => void;
  viewingMedia: { url: string; type: 'image' | 'video'; postId?: string };
  profileImagesList?: string[];
  onNext?: (e: React.MouseEvent) => void;
  onPrev?: (e: React.MouseEvent) => void;
  onDeletePost?: () => void;
}

type MenuView = 'main' | 'audience' | 'comments';
type AudienceType = 'public' | 'friends' | 'friends_of_friends' | 'only_me';
type CommentAudienceType = 'public' | 'friends' | 'mentions';

// Base Reaction Data
const REACTION_DATA = [
    { name: 'like', emoji: '👍', color: 'text-blue-600', animation: 'animate-bounce' },
    { name: 'love', emoji: '❤️', color: 'text-red-600', animation: 'animate-pulse' },
    { name: 'care', emoji: '🥰', color: 'text-yellow-500', animation: 'animate-bounce' },
    { name: 'haha', emoji: '😆', color: 'text-yellow-500', animation: 'animate-bounce' },
    { name: 'wow', emoji: '😮', color: 'text-yellow-500', animation: 'animate-pulse' },
    { name: 'sad', emoji: '😢', color: 'text-yellow-500', animation: 'animate-bounce' },
    { name: 'angry', emoji: '😡', color: 'text-orange-600', animation: 'animate-bounce' },
];

// Extensive Emoji List for Picker
const EMOJI_LIST = {
   smileys: {
    icon: Smile,
    label: "ابتسامات",
    emojis: ["😀","😃","😄","😁","😆","😅","🤣","😂","🙂","🙃","😉","😊","😇","🥰","🤩","😘","😗","😚","😙","😋","😛","😜","🤪","😝","🤑","🤗","🤭","🤫","🤔","🤐","🤨","😐","😑","😶","😏","😒","🙄","😬","🤥","😌","😔","😪","🤤","😴","😷","🤒","🤕","🤢","🤮","🤧","🥵","🥶","🥴","😵","🤯","🤠","🥳","😎","🤓","🧐","😕","😟","🙁","😮","😯","😲","😳","🥺","😦","😧","😨","😰","😥","😢","😭","😱","😖","😣","😞","😓","😩","😫","🥱","😤","😡","😠","🤬",
             "💋","💌","💘","💝","💖","💗","💓","💞","💕","💟","❣","💔","❤","🧡","💛","💚","💙","💜","🤎","🖤","🤍","💯","💢","💥","💫","💦","💨","🕳","💣","💬","👁️‍🗨️","🗨","🗯","💭","💤","😈","👿","💀","☠","💩","🤡","👹","👺","👻","👽","👾","🤖"]                                
  },
  animals: {
    icon: Cat,
    label: "حيوانات",
    emojis: ["😺","😸","😹","😻","😼","😽","🙀","😿","😾","🐶","🐱","🐭","🐹","🐰","🦊","🐻","🐼","🐨","🐯","🦁","🐮","🐷","🐽","🐸","🐵","🙈","🙉","🙊","🐒","🐔","🐧","🐦","🐤","🐣","🐥","🦆","🦅","🦉","🦇","🐺","🐗","🐴","🦄","🐝","🐛","🦋","🐌","🐞","🐜","🦟","🦗","🕷","🕸","🦂","🐢","🐍","🦎","🦖","🦕","🐙","🦑","🦐","🦞","🦀","🐡","🐠","🐟","🐬","🐳","🐋","🦈","🐊","🐅","🐆","🦓","🦍","🦧","🐘","🦛","🦏","🐪","🐫","🦒","🦘","🐃","🐂","🐄","🐎","🐖","🐏","🐑","🦙","🐐","🦌","🐕","🐩","🦮","🐕‍🦺","🐈","🐈‍⬛","🐓","🦃","🦚","🦜","🦢","🦩","🕊","🐇","🦝","🦨","🦡","🦦","🦥","🐁","🐀","🐿","🦔","🐾","🐉","🐲"]
  },
  food: {
    icon: Coffee,
    label: "طعام",
    emojis: ["🍏","🍎","🍐","🍊","🍋","🍌","🍉","🍇","🍓","🍈","🍒","🍑","🥭","🍍","🥥","🥝","🍅","🍆","🥑","🥦","🥬","🥒","🌶","🌽","🥕","🧄","🧅","🥔","🍠","🥐","🥯","🍞","🥖","🥨","🧀","🥚","🍳","🧈","🥞","🧇","🥓","🥩","🍗","🍖","🦴","🌭","🍔","🍟","🍕","🥪","🥙","🧆","🌮","🌯","🥗","🥘","🥫","🍝","🍜","🍲","🍛","🍣","🍱","🥟","🦪","🍤","🍙","🍚","🍘","🍥","🥠","🥮","🍢","🍡","🍧","🍨","🍦","🥧","🧁","🍰","🎂","🍮","🍭","🍬","🍫","🍿","🍩","🍪","🌰","🥜","🍯","🥛","🍼","☕","🍵","🧃","🥤","🍶","🍺","🍻","🥂","🍷","🥃","🍸","🍹","🧉","🍾","🧊","🥄","🍴","🍽","🥣","🥡","🥢","🧂"]
  },
  activities: {
    icon: Gamepad2,
    label: "أنشطة",
    emojis: ["⚽","🏀","🏈","⚾","🥎","🎾","🏐","🏉","🥏","🎱","🪀","🏓","🏸","🏒","🏑","🥍","🏏","🥅","⛳","🪁","🏹","🎣","🤿","🥊","🥋","🎽","🛹","🛼","🛷","⛸","🥌","🎿","⛷","🏂","🪂","🏋️","🤼","🤸","⛹️","🤺","🤾","🏌️","🏇","🧘","🏄","🏊","🤽","🚣","🧗","🚵","🚴","🏆","🥇","🥈","🥉","🏅","🎖","🏵","🎗","🎫","🎟","🎪","🤹","🎭","🩰","🎨","🎬","🎤","🎧","🎼","🎹","🥁","🎷","🎺","🎸","🪕","🎻","🎲","♟","🎯","🎳","🎮","🎰","🧩"]
  },
  travel: {
    icon: Plane,
    label: "سفر",
    emojis: ["🚗","🚕","🚙","🚌","🚎","🏎","🚓","🚑","🚒","🚐","🚚","🚛","🚜","🏍","🛵","🚲","🦼","🦽","🛴","🚨","🚔","🚍","🚘","🚖","🚡","🚠","🚟","🚃","🚋","🚞","🚝","🚄","🚅","🚈","🚂","🚆","🚇","🚊","🚉","✈","🛫","🛬","🛩","💺","🛰","🚀","🛸","🚁","🛶","⛵","🚤","🛥","🛳","⛴","🚢","⚓","⛽","🚧","🚦","🚥","🚏","🗺","🗿","🗽","🗼","🏰","🏯","🏟","🎡","🎢","🎠","⛲","⛱","🏖","🏝","🏜","🌋","⛰","🏔","🗻","🏕","⛺","🏠","🏡","🏘","🏚","🏗","🏭","🏢","🏬","🏣","🏤","🏥","🏦","🏨","🏪","🏫","🏩","💒","🏛","⛪","🕌","🕍","🛕","🕋","⛩","🛤","🛣","🗾","🎑","🏞","🌅","🌄","🌠","🎇","🎆","🌇","🌆","🏙","🌃","🌌","🌉","🌁"]
  },
  objects: {
    icon: Lightbulb,
    label: "أشياء",
    emojis: ["⌚","📱","📲","💻","⌨","🖥","🖨","🖱","🖲","🕹","🗜","💽","💾","💿","📀","📼","📷","📸","📹","🎥","📽","🎞","📞","☎","📟","📠","📺","📻","🎙","🎚","🎛","🧭","⏱","⏲","⏰","🕰","⌛","⏳","📡","🔋","🔌","💡","🔦","🕯","🪔","🧯","🛢","💸","💵","💴","💶","💷","🪙","💰","💳","💎","⚖","🧰","🔧","🔨","⚒","🛠","⛏","🪓","🧱","⚙","🪜","🩹","🩺","💈","🧲","🔫","💣","🧨","🔪","🗡","⚔","🛡","🚬","⚰","⚱","🏺","🔮","📿","🧿","💊","💉","🩸","🧬","🦠","🧫","🧪","🌡","🧹","🧺","🧻","🚽","🚰","🚿","🛁","🛀","🧼","🪥","🪒","🧽","🪣","🧴","🛎","🔑","🗝","🚪","🪑","🛋","🛏","🛌","🧸","🪆","🖼","🪞"]
  },
  flags: {
    icon: Flag,
    label: "أعلام",
    emojis: ["🏁","🚩","🎌","🏴","🏳","🏳️‍🌈","🏳️‍⚧️","🏴‍☠️","🇦🇨","🇦🇩","🇦🇪","🇦🇫","🇦🇬","🇦🇮","🇦🇱","🇦🇲","🇦🇴","🇦🇶","🇦🇷","🇦🇸","🇦🇹","🇦🇺","🇦🇼","🇦🇽","🇦🇿","🇧🇦","🇧🇧","🇧🇩","🇧🇪","🇧🇫","🇧🇬","🇧🇭","🇧🇮","🇧🇯","🇧🇱","🇧🇲","🇧🇳","🇧🇴","🇧🇶","🇧🇷","🇧🇸","🇧🇹","🇧🇻","🇧🇼","🇧🇾","🇧🇿","🇨🇦","🇨🇨","🇨🇩","🇨🇫","🇨🇬","🇨🇭","🇨🇮","🇨🇰","🇨🇱","🇨🇲","🇨🇳","🇨🇴","🇨🇵","🇨🇷","🇨🇺","🇨🇻","🇨🇼","🇨🇽","🇨🇾","🇨🇿","🇩🇪","🇩🇬","🇩🇯","🇩🇰","🇩🇲","🇩🇴","🇩🇿","🇪🇦","🇪🇨","🇪🇪","🇪🇬","🇪Ｈ","🇪🇷","🇪🇸","🇪🇹","🇪🇺","🇫🇮","🇫🇯","🇫🇰","🇫🇲","🇫🇴","🇫🇷","🇬🇦","🇬🇧","🇬🇩","🇬🇪","🇬🇫","🇬🇬","🇬Ｈ","🇬🇮","🇬🇱","🇬🇲","🇬🇳","🇬🇵","🇬🇶","🇬🇷","🇬🇸","🇬🇹","🇬🇺","🇬🇼","🇬🇾","🇭🇰","🇭🇲","🇭🇳","🇭🇷","🇭🇹","🇭🇺","🇮🇨","🇮🇩","🇮🇱","🇮🇲","🇮🇳","🇮🇴","🇮🇶","🇮🇷","🇮🇸","🇮🇹","🇯🇪","🇯🇲","🇯🇴","🇯🇵","🇰🇪","🇰🇬","🇰🇭","🇰🇮","🇰🇲","🇰🇳","🇰🇵","🇰🇷","🇰🇼","🇰🇾","🇰🇿","🇱🇦","🇱🇧","🇱🇨","🇱🇮","🇱🇰","🇱🇷","🇱🇸","🇱🇹","🇱🇺","🇱🇻","🇱🇾","🇲🇦","🇲🇨","🇲🇩","🇲🇪","🇲🇫","🇲🇬","🇲Ｈ","🇲🇰","🇲🇱","🇲🇲","🇲🇳","🇲🇴","🇲🇵","🇲🇶","🇲🇷","🇲🇸","🇲🇹","🇲🇺","🇲🇻","🇲🇼","🇲🇽","🇲🇾","🇲🇿","🇳🇦","🇳🇨","🇳🇪","🇳🇫","🇳🇬","🇳🇮","🇳🇱","🇳🇴","🇳🇵","🇳🇷","🇳🇺","🇳🇿","🇴🇲","🇵🇦","🇵🇪","🇵🇫","🇵🇬","🇵🇭","🇵🇰","🇵🇱","🇵🇲","🇵🇳","🇵🇷","🇵🇸","🇵🇹","🇵🇼","🇵🇾","🇶🇦","🇷🇪","🇷🇴","🇷🇸","🇷🇺","🇷🇼","🇸🇦","🇸🇧","🇸🇨","🇸🇩","🇸🇪","🇸🇬","🇸Ｈ","🇸🇮","🇸🇯","🇸🇰","🇸🇱","🇸🇲","🇸🇳","🇸🇴","🇸🇷","🇸🇸","🇸🇹","🇸🇻","🇸🇽","🇸🇾","🇸🇿","🇹🇦","🇹🇨","🇹🇩","🇹🇫","🇹🇬","🇹Ｈ","🇹🇯","🇹🇰","🇹🇱","🇹🇲","🇹🇳","🇹🇴","🇹🇷","🇹🇹","🇹🇻","🇹🇼","🇹🇿","🇺🇦","🇺🇬","🇺🇲","🇺🇳","🇺🇸","🇺🇾","🇺🇿","🇻🇦","🇻🇨","🇻🇪","🇻🇬","🇻🇮","🇻🇳","🇻🇺","🇼🇫","🇼🇸","🇽🇰","🇾🇪","🇾🇹","🇿🇦","🇿🇲","🇿🇼"] 
  }
};

const PhotoLightbox: React.FC<PhotoLightboxProps> = ({
  photos,
  initialIndex,
  onClose,
  currentUser,
  isOwnProfile,
  savedPhotos,
  onToggleSave,
  onLike,
  onComment,
  onDeleteComment,
  onLikeComment,
  onDeletePhoto,
  onUpdateAvatar,
  viewingPost,
  onTogglePin,
  viewingMedia,
  onNext,
  onPrev,
  onDeletePost,
}) => {
  const { t, language, dir } = useLanguage();
  const [currentIndex, setCurrentIndex] = useState(initialIndex);
  
  const [showMenu, setShowMenu] = useState(false);
  const [menuView, setMenuView] = useState<MenuView>('main');
  
  const [commentInput, setCommentInput] = useState('');
  const [replyingToId, setReplyingToId] = useState<string | null>(null);
  const [replyText, setReplyText] = useState('');
  const [deleteCommentId, setDeleteCommentId] = useState<string | null>(null);
  
  const [notificationsOn, setNotificationsOn] = useState(true);
  const [audience, setAudience] = useState<AudienceType>('public');
  const [commentAudience, setCommentAudience] = useState<CommentAudienceType>('public');
  
  const [copyFeedback, setCopyFeedback] = useState(false);
  const [showShareModal, setShowShareModal] = useState(false);

  // Reactions State
  const currentPhoto = photos[currentIndex];
  const [showReactions, setShowReactions] = useState(false);

  // Memoize reactions to handle translations
  const reactions = useMemo(() => {
    const labels: Record<string, { ar: string, en: string }> = {
      like: { ar: 'إعجاب', en: 'Like' },
      love: { ar: 'أحببته', en: 'Love' },
      care: { ar: 'أدعمك', en: 'Care' },
      haha: { ar: 'هاها', en: 'Haha' },
      wow: { ar: 'واو', en: 'Wow' },
      sad: { ar: 'أحزنني', en: 'Sad' },
      angry: { ar: 'أغضبني', en: 'Angry' },
    };
    return REACTION_DATA.map(r => ({
      ...r,
      label: language === 'ar' ? labels[r.name].ar : labels[r.name].en
    }));
  }, [language]);

  const [currentReaction, setCurrentReaction] = useState<{ name: string; label: string; emoji: string; color: string; animation?: string } | null>(null);
  const [animateLike, setAnimateLike] = useState(false);
  
  // Emoji Picker State
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [activeEmojiTab, setActiveEmojiTab] = useState<'recent' | keyof typeof EMOJI_LIST>('recent');
  const [emojiSearch, setEmojiSearch] = useState('');
  const [recentEmojis, setRecentEmojis] = useState<string[]>([]);

  const menuRef = useRef<HTMLDivElement>(null);
  const commentsEndRef = useRef<HTMLDivElement>(null);
  const commentInputRef = useRef<HTMLInputElement>(null);
  const reactionTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const emojiPickerRef = useRef<HTMLDivElement>(null);

  const isCurrentPhotoSaved = currentPhoto ? savedPhotos.some(p => p.id === currentPhoto.id) : false;

  useEffect(() => {
      const savedRecents = localStorage.getItem('chat_recent_emojis');
      if (savedRecents) {
          setRecentEmojis(JSON.parse(savedRecents));
      }
  }, []);

  useEffect(() => {
    if (currentPhoto) {
        if (currentPhoto.isLiked) {
            setCurrentReaction(reactions.find(r => r.name === currentPhoto.reaction) || reactions[0]);
        } else {
            setCurrentReaction(null);
        }
    }
  }, [currentPhoto, currentPhoto?.isLiked, currentPhoto?.reaction, reactions]);

  useEffect(() => {
    commentsEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [currentPhoto?.comments, currentIndex]);

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

  if (!currentPhoto) return null;

  const nextPhoto = (e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    if (onNext) onNext(e as React.MouseEvent);
    else setCurrentIndex((prev) => (prev + 1) % photos.length);
    resetInteractionState();
  };

  const prevPhoto = (e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    if (onPrev) onPrev(e as React.MouseEvent);
    else setCurrentIndex((prev) => (prev - 1 + photos.length) % photos.length);
    resetInteractionState();
  };

  const resetInteractionState = () => {
      setShowMenu(false);
      setMenuView('main');
      setCommentInput('');
      setReplyingToId(null);
      setReplyText('');
      setShowReactions(false);
      setShowEmojiPicker(false);
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
          case 'public': return language === 'ar' ? 'أي شخص على فيسبوك أو خارجه' : 'Anyone on or off Tourloop';
          case 'friends': return language === 'ar' ? 'أصدقاؤك على فيسبوك' : 'Your friends on Tourloop';
          case 'friends_of_friends': return language === 'ar' ? 'أصدقاء أصدقائك' : 'Friends of friends';
          case 'only_me': return language === 'ar' ? 'أنت فقط' : 'Only you';
      }
  };

  // Modified Handle Like to support Reactions
  const handleLike = () => {
    setAnimateLike(true);
    setTimeout(() => setAnimateLike(false), 300);

    const newIsLiked = !currentPhoto.isLiked;
    
    if (newIsLiked) {
        // Default to Like if turning on
        setCurrentReaction(reactions[0]);
    } else {
        // Turn off
        setCurrentReaction(null);
    }
    
    if (onLike) {
        const reactionToSend = newIsLiked ? 'like' : (currentReaction?.name || 'like');
        onLike(currentPhoto.id, reactionToSend);
    }
  };

  const handleReactionSelect = (reaction: typeof reactions[0]) => {
    setCurrentReaction(reaction);
    setShowReactions(false);
    
    setAnimateLike(true);
    setTimeout(() => setAnimateLike(false), 300);

    if (onLike) onLike(currentPhoto.id, reaction.name);
  };

  const handleSendComment = (e?: React.FormEvent) => {
      e?.preventDefault();
      if (!commentInput.trim()) return;
      if (onComment) {
          onComment(currentPhoto.id, commentInput);
          setCommentInput('');
      }
      setShowEmojiPicker(false);
  };

  const handleInlineReplySubmit = (e: React.FormEvent) => {
      e.preventDefault();
      if (!replyText.trim()) return;
      if (onComment) {
          onComment(currentPhoto.id, replyText);
      }
      setReplyingToId(null);
      setReplyText('');
  };

  const handleDeleteComment = (commentId: string) => {
      if (onDeleteComment) {
          onDeleteComment(currentPhoto.id, commentId);
      }
      setDeleteCommentId(null);
  };
  
  const handleLikeComment = (commentId: string) => {
      if (onLikeComment) {
          onLikeComment(currentPhoto.id, commentId);
      }
  };

  const handleSavePost = () => {
      if (onToggleSave) onToggleSave(currentPhoto);
      setShowMenu(false);
  };

  const handleDownload = () => {
      const link = document.createElement('a');
      link.href = currentPhoto.url;
      link.download = `photo_${Date.now()}.jpg`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      setShowMenu(false);
  };

  const handleSetProfilePicture = () => {
      if (onUpdateAvatar) {
          // Updated to use currentPhoto.url instead of potentially stale viewingMedia.url
          onUpdateAvatar(currentPhoto.url);
          setShowMenu(false);
          onClose(); 
      }
  };

  const handleDeleteCurrentPhoto = () => {
      if (onDeletePost && viewingPost) {
         onDeletePost();
         onClose();
      } else if (onDeletePhoto) {
        onDeletePhoto(currentPhoto.id, 'photo');
        onClose();
      }
      setShowMenu(false);
  };

  const handleCopyLink = () => {
      const link = currentPhoto.url;
      navigator.clipboard.writeText(link).then(() => {
          setCopyFeedback(true);
          setTimeout(() => setCopyFeedback(false), 2000);
          setShowMenu(false);
      });
  };

  const handleEmojiClick = (emoji: string) => {
      setCommentInput(prev => prev + emoji);
      // Add to recents
      const newRecents = [...new Set([emoji, ...recentEmojis])].slice(0, 24);
      setRecentEmojis(newRecents);
      localStorage.setItem('chat_recent_emojis', JSON.stringify(newRecents));

      if(commentInputRef.current) {
          commentInputRef.current.focus();
      }
      setShowEmojiPicker(false);
  };

  const handleSocialShare = (platform: string) => {
      const url = encodeURIComponent(currentPhoto.url);
      const text = encodeURIComponent(language === 'ar' ? 'شاهد هذه الصورة الرائعة على Tourloop' : 'Check out this awesome photo on Tourloop');
      let shareUrl = '';
      if (platform === 'facebook') shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${url}`;
      if (platform === 'twitter') shareUrl = `https://twitter.com/intent/tweet?url=${url}&text=${text}`;
      if (platform === 'whatsapp') shareUrl = `https://api.whatsapp.com/send?text=${text}%20${url}`;
      if (shareUrl) window.open(shareUrl, '_blank', 'width=600,height=400');
  };

  return (
    <div className="fixed inset-0 z-[100000] bg-black bg-opacity-95 flex items-center justify-center animate-fadeIn">
        
        {copyFeedback && (
            <div className="fixed top-14 left-1/2 transform -translate-x-1/2 z-[100001] bg-emerald-700 text-white px-4 py-2 rounded-md shadow-lg text-sm flex items-center gap-2 animate-fadeIn">
                <Check className="w-4 h-4" />
                {t.common_copied || (language === 'ar' ? 'تم النسخ' : 'Copied')}
            </div>
        )}

        <div className="w-full h-full flex flex-col md:flex-row overflow-hidden">
            
            <div className="flex-1 bg-black flex items-center justify-center relative group" onClick={(e) => e.stopPropagation()}>
                <button className="absolute top-4 left-4 p-2 bg-black/50 hover:bg-white/20 rounded-full text-white z-[102]" onClick={onClose}>
                    <X className="w-6 h-6" />
                </button>
                
                {photos.length > 1 && (
                    <>
                        <button className="absolute right-4 top-1/2 -translate-y-1/2 p-3 bg-black/50 hover:bg-white/20 rounded-full text-white z-10 transition hover:scale-110" onClick={prevPhoto}>
                            <ChevronRight className="w-8 h-8" />
                        </button>
                        <button className="absolute left-4 top-1/2 -translate-y-1/2 p-3 bg-black/50 hover:bg-white/20 rounded-full text-white z-10 transition hover:scale-110" onClick={nextPhoto}>
                            <ChevronLeft className="w-8 h-8" />
                        </button>
                    </>
                )}

                {viewingMedia && viewingMedia.type === 'video' ? (
                   <video 
                      src={viewingMedia.url} 
                      className="max-w-full max-h-[85vh] object-contain" 
                      controls 
                      autoPlay 
                   />
                ) : (
                   <img 
                      src={currentPhoto.url} 
                      className="max-w-full max-h-[85vh] object-contain" 
                      alt="Full screen" 
                   />
                )}
            </div>

            <div className="w-full md:w-[450px] bg-white dark:bg-gray-800 flex flex-col h-[40vh] md:h-full border-l border-gray-800 shadow-xl transition-colors duration-300" onClick={(e) => e.stopPropagation()}>
                <div className="p-4 border-b border-gray-200 dark:border-gray-700 flex items-center gap-3 relative bg-gray-50/50 dark:bg-gray-900/10">
                    <img src={currentUser.avatar} alt="User" className="w-10 h-10 rounded-full border border-gray-200 dark:border-gray-600" />
                    <div>
                        <h4 className="font-bold text-sm text-gray-900 dark:text-white">{currentUser.name}</h4>
                        <div className="flex items-center gap-1 text-xs text-gray-500 dark:text-gray-400">
                            <span>{t.common_online || (language === 'ar' ? 'الآن' : 'Just now')}</span>
                            <span>·</span>
                            {getAudienceIcon(audience)}
                        </div>
                    </div>
                    
                    <div className="ms-auto relative" ref={menuRef}>
                        <button onClick={() => { setShowMenu(!showMenu); setMenuView('main'); }} className="p-2 text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full transition">
                            <MoreHorizontal className="w-5 h-5" />
                        </button>
                        
                        {showMenu && (
                            <div className={`absolute top-full mt-1 w-80 bg-white dark:bg-gray-800 shadow-xl rounded-lg border border-gray-100 dark:border-gray-700 z-50 overflow-hidden animate-fadeIn ${dir === 'rtl' ? 'left-0 origin-top-left' : 'right-0 origin-top-right'}`}>
                                {menuView === 'main' && (
                                    <>
                                        {isOwnProfile && (
                                            <button 
                                                onClick={() => { if(onTogglePin) onTogglePin(); setShowMenu(false); }}
                                                className="w-full text-start px-4 py-3 hover:bg-gray-100 dark:hover:bg-gray-700 flex items-center gap-3 text-sm text-gray-700 dark:text-gray-200 transition"
                                            >
                                                {viewingPost?.isPinned ? <PinOff className="w-5 h-5 text-fb-blue" /> : <Pin className="w-5 h-5" />}
                                                {viewingPost?.isPinned 
                                                    ? (language === 'ar' ? 'إلغاء تثبيت المنشور' : 'Unpin Post') 
                                                    : (language === 'ar' ? 'تثبيت المنشور' : 'Pin Post')
                                                }
                                            </button>
                                        )}

                                        <button onClick={handleSavePost} className="w-full text-start px-4 py-3 hover:bg-gray-100 dark:hover:bg-gray-700 flex items-center gap-3 text-sm text-gray-700 dark:text-gray-200">
                                            {isCurrentPhotoSaved ? <BookmarkMinus className="w-5 h-5 text-fb-blue" /> : <Bookmark className="w-5 h-5" />} 
                                            {isCurrentPhotoSaved 
                                                ? (language === 'ar' ? 'إلغاء الحفظ' : 'Unsave') 
                                                : (language === 'ar' ? 'حفظ المنشور' : 'Save Post')
                                            }
                                        </button>
                                        <div className="border-t border-gray-100 dark:border-gray-700 my-1"></div>
                                        
                                        <button onClick={() => setMenuView('comments')} className="w-full text-start px-4 py-3 hover:bg-gray-100 dark:hover:bg-gray-700 flex items-center justify-between text-sm text-gray-700 dark:text-gray-200 group">
                                            <div className="flex items-center gap-3"><MessageCircle className="w-5 h-5" /> {t.post_who_can_comment || (language === 'ar' ? 'من الذي يمكنه التعليق؟' : 'Who can comment?')}</div>
                                            {dir === 'rtl' ? <ChevronLeft className="w-4 h-4 text-gray-400 group-hover:text-gray-600" /> : <ChevronRight className="w-4 h-4 text-gray-400 group-hover:text-gray-600" />}
                                        </button>
                                        
                                        <button onClick={() => setMenuView('audience')} className="w-full text-start px-4 py-3 hover:bg-gray-100 dark:hover:bg-gray-700 flex items-center justify-between text-sm text-gray-700 dark:text-gray-200 group">
                                            <div className="flex items-center gap-3"><Globe className="w-5 h-5" /> {t.post_audience || (language === 'ar' ? 'تعديل الجمهور' : 'Edit Audience')}</div>
                                            {dir === 'rtl' ? <ChevronLeft className="w-4 h-4 text-gray-400 group-hover:text-gray-600" /> : <ChevronRight className="w-4 h-4 text-gray-400 group-hover:text-gray-600" />}
                                        </button>
                                        
                                        <button onClick={() => { setNotificationsOn(!notificationsOn); setShowMenu(false); }} className="w-full text-start px-4 py-3 hover:bg-gray-100 dark:hover:bg-gray-700 flex items-center gap-3 text-sm text-gray-700 dark:text-gray-200">
                                            {notificationsOn ? <BellOff className="w-5 h-5" /> : <Bell className="w-5 h-5" />}
                                            {notificationsOn 
                                                ? (language === 'ar' ? 'إيقاف الإشعارات' : 'Turn off notifications') 
                                                : (language === 'ar' ? 'تشغيل الإشعارات' : 'Turn on notifications')
                                            }
                                        </button>
                                        <div className="border-t border-gray-100 dark:border-gray-700 my-1"></div>
                                        
                                        <button onClick={() => { setShowShareModal(true); setShowMenu(false); }} className="w-full text-start px-4 py-3 hover:bg-gray-100 dark:hover:bg-gray-700 flex items-center gap-3 text-sm text-gray-700 dark:text-gray-200">
                                            <Share2 className="w-5 h-5" /> {t.common_share || (language === 'ar' ? 'مشاركة' : 'Share')}
                                        </button>
                                        
                                        <button onClick={handleDownload} className="w-full text-start px-4 py-3 hover:bg-gray-100 dark:hover:bg-gray-700 flex items-center gap-3 text-sm text-gray-700 dark:text-gray-200">
                                            <Download className="w-5 h-5" /> {t.common_download || (language === 'ar' ? 'تنزيل' : 'Download')}
                                        </button>

                                        <button 
                                            onClick={handleCopyLink} 
                                            className="w-full text-start px-4 py-3 hover:bg-gray-100 dark:hover:bg-gray-700 flex items-center gap-3 text-sm text-gray-700 dark:text-gray-200 transition"
                                        >
                                            <Globe className="w-5 h-5" /> {t.post_copy_link || (language === 'ar' ? 'نسخ الرابط' : 'Copy link')}
                                        </button>
                                        
                                        {isOwnProfile && (
                                            <>
                                                <div className="border-t border-gray-100 dark:border-gray-700 my-1"></div>

                                                {/* Ensure we only show this for images */}
                                                {(currentPhoto && (!viewingMedia || viewingMedia.type === 'image')) && (
                                                    <button 
                                                        onClick={handleSetProfilePicture}
                                                        className="w-full text-start px-4 py-3 hover:bg-gray-100 dark:hover:bg-gray-700 flex items-center gap-3 text-sm text-gray-700 dark:text-gray-200 transition"
                                                    >
                                                        <UserCircle className="w-5 h-5" /> {language === 'ar' ? 'تعيين كصورة ملف شخصي' : 'Set as Profile Picture'}
                                                    </button>
                                                )}

                                                <button onClick={handleDeleteCurrentPhoto} className="w-full text-start px-4 py-3 hover:bg-gray-100 dark:hover:bg-gray-700 flex items-center gap-3 text-sm text-red-600 font-medium">
                                                    <Trash2 className="w-5 h-5" /> {language === 'ar' ? 'حذف المنشور' : 'Delete Post'}
                                                </button>
                                            </>
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
                                                    className="w-full text-start px-4 py-3 hover:bg-gray-100 dark:hover:bg-gray-700 flex items-center justify-between text-sm text-gray-700 dark:text-gray-200"
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
                    <div className="flex items-center gap-1">
                        <div className="bg-fb-blue p-1 rounded-full"><ThumbsUp className="w-3 h-3 text-white fill-current" /></div>
                        <span>{currentPhoto.likes > 0 ? currentPhoto.likes : ''}</span>
                    </div>
                    <div className="flex gap-3">
                        <span>{currentPhoto.comments.length} {t.post_comments_count || (language === 'ar' ? 'تعليق' : 'Comments')}</span>
                    </div>
                </div>
                
                <div className="px-2 py-1 flex items-center justify-between border-b border-gray-200 dark:border-gray-700 relative">
                        {/* Floating Reactions Bar */}
                        {showReactions && (
                            <div 
                                className="absolute bottom-full mb-2 right-4 bg-white dark:bg-gray-700 shadow-2xl rounded-full p-2 flex gap-2 animate-bounce-in z-50 border border-gray-200 dark:border-gray-600"
                                onMouseLeave={() => setShowReactions(false)}
                            >
                                {reactions.map(r => (
                                    <button 
                                        key={r.name} 
                                        onClick={() => handleReactionSelect(r)}
                                        className="hover:scale-150 transition-transform duration-200 p-1.5 rounded-full hover:bg-gray-100 dark:hover:bg-gray-600 relative group"
                                        title={r.label}
                                    >
                                        <span className={`text-3xl inline-block ${r.animation || ''}`}>{r.emoji}</span>
                                        <span className="absolute -top-8 left-1/2 -translate-x-1/2 bg-black/75 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition whitespace-nowrap pointer-events-none font-bold">
                                            {r.label}
                                        </span>
                                    </button>
                                ))}
                            </div>
                        )}

                        <button 
                            onClick={handleLike}
                            onMouseEnter={() => { reactionTimerRef.current = setTimeout(() => setShowReactions(true), 500); }}
                            onMouseLeave={() => { if (reactionTimerRef.current) clearTimeout(reactionTimerRef.current); }}
                            className={`flex-1 flex items-center justify-center gap-2 py-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-md transition font-medium text-sm ${animateLike ? 'animate-pop' : ''} ${currentReaction ? currentReaction.color : 'text-gray-600 dark:text-gray-300'}`}
                        >
                            {currentReaction ? <span className="text-xl animate-bounce-in">{currentReaction.emoji}</span> : <ThumbsUp className={`w-5 h-5 ${currentPhoto.isLiked ? 'text-emerald-700 fill-current' : ''}`} />} 
                            <span className={`text-[15px] font-bold ${currentPhoto.isLiked && !currentReaction ? 'text-emerald-700' : ''}`}>{currentReaction ? currentReaction.label : (t.btn_like || (language === 'ar' ? 'أعجبني' : 'Like'))}</span>
                        </button>

                        <button onClick={() => commentInputRef.current?.focus()} className="flex-1 flex items-center justify-center gap-2 py-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-md transition font-medium text-gray-600 dark:text-gray-300 text-sm">
                            <MessageCircle className="w-5 h-5" /> {t.btn_comment || (language === 'ar' ? 'تعليق' : 'Comment')}
                        </button>
                        <button onClick={() => setShowShareModal(true)} className="flex-1 flex items-center justify-center gap-2 py-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-md transition font-medium text-gray-600 dark:text-gray-300 text-sm">
                            <Share2 className="w-5 h-5" /> {t.btn_share || (language === 'ar' ? 'مشاركة' : 'Share')}
                        </button>
                </div>

                <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50 dark:bg-gray-900/30 custom-scrollbar">
                    {currentPhoto.comments.length === 0 ? (
                        <div className="text-center text-gray-400 dark:text-gray-500 py-10 text-sm italic">{language === 'ar' ? 'كن أول من يعلق.' : 'Be the first to comment.'}</div>
                    ) : (
                        currentPhoto.comments.map(comment => (
                            <div key={comment.id} className="flex gap-2 group flex-col">
                                <div className="flex gap-2">
                                    <img src={comment.author.avatar} className="w-8 h-8 rounded-full border border-gray-100 shadow-sm" alt="commenter" />
                                    <div className="flex flex-col flex-1">
                                        <div className="bg-gray-200 dark:bg-gray-700 px-3 py-2 rounded-2xl rounded-tr-none relative group/comment w-fit shadow-sm">
                                            <span className="font-bold text-xs block text-gray-900 dark:text-white">{comment.author.name}</span>
                                            <span className="text-sm text-gray-800 dark:text-gray-200">{comment.content}</span>
                                        </div>
                                        <div className="flex gap-3 text-[11px] text-gray-500 dark:text-gray-400 pr-2 mt-1 items-center font-bold">
                                            <span 
                                                className={`cursor-pointer hover:underline transition ${comment.isLiked ? 'text-fb-blue' : ''}`}
                                                onClick={() => onLikeComment && onLikeComment(currentPhoto.id, comment.id)}
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
                                            <span className="font-normal">{comment.timestamp}</span>
                                            {(comment.author.id === currentUser.id || isOwnProfile) && (
                                                <span 
                                                    className="cursor-pointer hover:underline text-red-500 transition"
                                                    onClick={() => setDeleteCommentId(comment.id)}
                                                >
                                                    {t.common_delete || (language === 'ar' ? 'حذف' : 'Delete')}
                                                </span>
                                            )}
                                        </div>
                                    </div>
                                </div>
                                
                                {replyingToId === comment.id && (
                                    <div className="mr-12 flex gap-2 animate-fadeIn mt-1">
                                        <img src={currentUser.avatar} className="w-6 h-6 rounded-full border border-gray-100" alt="me" />
                                        <form className="flex-1" onSubmit={handleInlineReplySubmit}>
                                            <input 
                                                type="text" 
                                                className="w-full bg-gray-100 dark:bg-gray-700 border-none rounded-full px-3 py-1.5 text-xs focus:ring-1 focus:ring-fb-blue transition dark:text-white" 
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
                            <form onSubmit={handleSendComment} className="flex-1 bg-white dark:bg-gray-700 border border-gray-200 dark:border-transparent rounded-2xl flex items-center px-3 py-2 focus-within:ring-2 focus-within:ring-emerald-500/20 relative">
                                <input
                                    ref={commentInputRef}
                                    type="text"
                                    placeholder={t.write_comment || (language === 'ar' ? 'اكتب تعليقاً...' : 'Write a comment...')}
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
                                            className={`absolute bottom-10 ${dir === 'rtl' ? 'left-0 origin-bottom-left' : 'right-0 origin-bottom-right'} bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 shadow-2xl rounded-lg w-80 p-0 z-[100] animate-scaleIn overflow-hidden flex flex-col`}
                                            onClick={(e) => e.stopPropagation()}
                                        >
                                            {/* Picker Header */}
                                            <div className="flex items-center p-2 border-b dark:border-gray-700 bg-gray-50 dark:bg-gray-900 gap-2 flex-shrink-0">
                                                <div className="relative w-full">
                                                    <Search className="w-3 h-3 absolute left-2 top-2 text-gray-400" />
                                                    <input 
                                                        type="text" 
                                                        className="w-full pl-6 pr-2 py-1 text-xs bg-gray-200 dark:bg-gray-700 rounded-full outline-none text-gray-900 dark:text-white"
                                                        placeholder={t.common_search || (language === 'ar' ? 'بحث' : 'Search')}
                                                        value={emojiSearch}
                                                        onChange={(e) => setEmojiSearch(e.target.value)}
                                                    />
                                                </div>
                                            </div>

                                            {/* Picker Content */}
                                            <div className="h-48 overflow-y-auto custom-scrollbar p-2 bg-white dark:bg-gray-800">
                                                 {(emojiSearch ? ['search_results'] : (activeEmojiTab === 'recent' ? ['recent'] : [activeEmojiTab])).map(categoryKey => {
                                                    const emojis = emojiSearch 
                                                    ? Object.values(EMOJI_LIST).flatMap(c => c.emojis).filter(e => true).slice(0, 50)
                                                    : categoryKey === 'recent' 
                                                        ? recentEmojis 
                                                        : EMOJI_LIST[categoryKey as keyof typeof EMOJI_LIST].emojis;
                                                    
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
                                            
                                            {/* Footer Tabs */}
                                            <div className="flex items-center justify-between px-2 py-1.5 border-t dark:border-gray-700 bg-gray-50 dark:bg-gray-900 overflow-x-auto no-scrollbar flex-shrink-0">
                                                <button 
                                                    type="button"
                                                    onClick={() => { setActiveEmojiTab('recent'); setEmojiSearch(''); }}
                                                    className={`p-2 rounded-lg transition ${activeEmojiTab === 'recent' ? 'text-fb-blue bg-blue-100 dark:bg-blue-900/30' : 'text-gray-400 hover:text-gray-600'}`}
                                                    title={language === 'ar' ? 'الأخيرة' : 'Recent'}
                                                >
                                                    <Clock className="w-4 h-4" />
                                                </button>
                                                {Object.entries(EMOJI_LIST).map(([key, data]) => {
                                                    const Icon = data.icon;
                                                    return (
                                                        <button 
                                                            key={key} 
                                                            type="button"
                                                            onClick={() => { setActiveEmojiTab(key as any); setEmojiSearch(''); }}
                                                            className={`p-2 rounded-lg transition ${activeEmojiTab === key ? 'text-fb-blue bg-blue-100 dark:bg-blue-900/30' : 'text-gray-400 hover:text-gray-600'}`}
                                                            title={data.label}
                                                        >
                                                            <Icon className="w-4 h-4" />
                                                        </button>
                                                    );
                                                })}
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

       {/* Delete Confirmation Modal for Photo Comments */}
       {deleteCommentId && (
            <div className="fixed inset-0 z-[250] flex items-center justify-center bg-black/60 p-4 animate-fadeIn" onClick={() => setDeleteCommentId(null)}>
                <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-xl w-full max-w-sm border border-gray-200 dark:border-gray-700" onClick={e => e.stopPropagation()}>
                    <h3 className="font-bold text-lg mb-2 text-gray-900 dark:text-white">{t.post_delete_confirm_title || (language === 'ar' ? 'حذف التعليق؟' : 'Delete Comment?')}</h3>
                    <p className="text-gray-600 dark:text-gray-300 text-sm mb-6">{language === 'ar' ? 'هل أنت متأكد من أنك تريد حذف هذا التعليق نهائياً؟' : 'Are you sure you want to delete this comment permanently?'}</p>
                    <div className="flex justify-end gap-3">
                        <button onClick={() => setDeleteCommentId(null)} className="px-4 py-2 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-md text-sm font-medium transition">{t.common_cancel || (language === 'ar' ? 'إلغاء' : 'Cancel')}</button>
                        <button 
                            onClick={() => handleDeleteComment(deleteCommentId)} 
                            className="px-4 py-2 bg-red-600 text-white rounded-md text-sm font-medium hover:bg-red-700 transition shadow-sm"
                        >
                            {t.common_delete || (language === 'ar' ? 'حذف' : 'Delete')}
                        </button>
                    </div>
                </div>
            </div>
        )}

       {/* Share Modal - Advanced Version */}
       {showShareModal && (
          <div className="fixed inset-0 z-[100005] bg-black/60 flex items-center justify-center p-4 animate-fadeIn backdrop-blur-sm" onClick={() => setShowShareModal(false)}>
              <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl w-full max-w-md overflow-hidden animate-scaleIn border border-white/20 dark:border-gray-700" onClick={e => e.stopPropagation()}>
                  <div className="p-4 border-b border-gray-100 dark:border-gray-700 flex justify-between items-center bg-gray-50 dark:bg-gray-800/50 shadow-sm">
                      <h3 className="font-bold text-lg text-gray-900 dark:text-white flex items-center gap-2">
                          <Share2 className="w-5 h-5 text-fb-blue" />
                          {t.common_share || (language === 'ar' ? 'مشاركة' : 'Share')}
                      </h3>
                      <button onClick={() => setShowShareModal(false)} className="text-gray-500 hover:bg-gray-200 dark:hover:bg-gray-600 rounded-full p-1.5 transition">
                          <X className="w-5 h-5" />
                      </button>
                  </div>
                  <div className="p-6">
                      <div className="flex justify-between gap-4 mb-8">
                          <button onClick={() => handleSocialShare('facebook')} className="flex flex-col items-center gap-2 group">
                              <div className="w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center text-white shadow-lg transition transform group-hover:scale-110 group-active:scale-95">
                                  <Facebook className="w-7 h-7 fill-current" />
                              </div>
                              <span className="text-[10px] font-bold text-gray-500 dark:text-gray-400">Facebook</span>
                          </button>
                          <button onClick={() => handleSocialShare('whatsapp')} className="flex flex-col items-center gap-2 group">
                              <div className="w-12 h-12 bg-green-500 rounded-full flex items-center justify-center text-white shadow-lg transition transform group-hover:scale-110 group-active:scale-95">
                                  <Phone className="w-6 h-6 fill-current" />
                              </div>
                              <span className="text-[10px] font-bold text-gray-500 dark:text-gray-400">WhatsApp</span>
                          </button>
                          <button onClick={() => handleSocialShare('twitter')} className="flex flex-col items-center gap-2 group">
                              <div className="w-12 h-12 bg-black rounded-full flex items-center justify-center text-white shadow-lg transition transform group-hover:scale-110 group-active:scale-95">
                                  <Twitter className="w-5 h-5" />
                              </div>
                              <span className="text-[10px] font-bold text-gray-500 dark:text-gray-400">X (Twitter)</span>
                          </button>
                          <button onClick={handleCopyLink} className="flex flex-col items-center gap-2 group">
                              <div className="w-12 h-12 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-200 rounded-full flex items-center justify-center shadow-md transition transform group-hover:scale-110 group-active:scale-95 border border-gray-200 dark:border-gray-600">
                                {copyFeedback ? <Check className="w-6 h-6 text-green-500" /> : <LinkIcon className="w-6 h-6" />}
                              </div>
                              <span className="text-[10px] font-bold text-gray-600 dark:text-gray-400">{t.common_copy || (language === 'ar' ? 'نسخ' : 'Copy')}</span>
                          </button>
                      </div>
                      <div className="space-y-2">
                          <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest px-1">{t.post_copy_link || (language === 'ar' ? 'رابط الصورة' : 'Photo Link')}</label>
                          <div className="flex items-center gap-2 bg-gray-100 dark:bg-gray-900 p-2 rounded-xl border border-gray-200 dark:border-gray-700">
                              <LinkIcon className="w-4 h-4 text-gray-400 ml-1" />
                              <input readOnly value={currentPhoto.url} className="bg-transparent border-none outline-none text-[11px] text-gray-500 flex-1 truncate font-mono" />
                              <button onClick={handleCopyLink} className="bg-fb-blue text-white px-4 py-1.5 rounded-lg text-xs font-bold hover:bg-blue-700 transition active:scale-95">{copyFeedback ? (language === 'ar' ? 'تم!' : 'Done!') : (language === 'ar' ? 'نسخ' : 'Copy')}</button>
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
    </div>
  );
};

export default PhotoLightbox;