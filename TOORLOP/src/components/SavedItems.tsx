import React, { useState, useRef, useEffect, useMemo } from 'react';
import { createPortal } from 'react-dom';
import {
  Bookmark,
  Trash2,
  Play,
  X,
  ChevronRight,
  ChevronLeft,
  MoreHorizontal,
  MessageCircle,
  ThumbsUp,
  Share2,
  Send,
  Smile, Cat, Coffee, Gamepad2,
  Globe,
  BookmarkMinus,
  Search,
  Filter,
  Image as ImageIcon,
  Video,
  Download,
  Link as LinkIcon,
  Check,
  FileText,
  Bell,
  BellOff,
  Facebook,
  Twitter,
  Phone,
  Copy,
  AlertCircle,
  Users,
  UserPlus,
  Lock,
  ArrowRight,
  Eye,
  AtSign,
  Flag, Plane, Lightbulb,
  Clock,
  Loader2,
  AlertTriangle
} from 'lucide-react';
import { Photo, VideoItem, User, Post, Comment } from '../types';
import PostCard from './PostCard';
import { useLanguage } from '../context/LanguageContext';
import VideoLightbox from './VideoLightbox';

interface SavedItemsProps {
  currentUser: User;
  savedPhotos: Photo[];
  savedVideos?: VideoItem[];
  savedPosts?: Post[];
  onUnsave: (item: Photo | VideoItem | Post) => void;
  // Generic/Photo Handlers
  onLike?: (itemId: string, reactionType?: string) => void;
  onComment?: (itemId: string, text: string) => void;
  onDeleteComment?: (itemId: string, commentId: string) => void;
  onLikeComment?: (itemId: string, commentId: string) => void;
  // Video Specific Handlers (Synced with Watch)
  onLikeVideo?: (videoId: string, reactionType?: string) => void;
  onCommentVideo?: (videoId: string, text: string) => void;
  onDeleteVideoComment?: (videoId: string, commentId: string) => void;
  onLikeVideoComment?: (videoId: string, commentId: string) => void;
}

type TabType = 'all' | 'posts' | 'photos' | 'videos';
type AudienceType = 'public' | 'friends' | 'friends_of_friends' | 'only_me';
type MenuView = 'main' | 'audience' | 'comments';
type CommentAudienceType = 'public' | 'friends' | 'mentions';

// Categorized Emoji List for Advanced Picker
const EMOJI_CATEGORIES = {
 smileys: {
    icon: Smile,
    label: "ابتسامات",
    emojis: ["😀","😃","😄","😁","😆","😅","🤣","😂","🙂","🙃","😉","😊","😇","🥰","🤩","😘","😗","😚","😙","😋","😛","😜","🤪","😝","🤑","🤗","🤭","🤫","🤔","🤐","🤨","😐","😑","😶","😏","😒","🙄","😬","🤥","😌","😔","😪","🤤","😴","😷","🤒","🤕","🤢","🤮","🤧","🥵","🥶","🥴","😵","🤯","🤠","🥳","😎","🤓","🧐","😕","😟","🙁","😮","😯","😲","😳","🥺","😦","😧","😨","😰","😥","😢","😭","😱","😖","😣","😞","😓","😩","😫","🥱","😤","😡","😠","🤬",
             "💋","💌","💘","💝","💖","💗","💓","💞","💕","💟","❣","💔","❤","🧡","💛","💚","💙","💜","🤎","🖤","🤍","💯","💢","💥","💫","💦","💨","🕳","💣","💬","👁️‍🗨️","🗨","🗯","💭","💤","😈","👿","💀","☠","💩","🤡","👹","👺","👻","👽","👾","🤖"]                                
  },
  animals: {
    icon: Cat,
    label: "حيوانات",
    emojis: ["🐶","🐱","🐭","🐹","🐰","🦊","🐻","🐼","🐨","🐯","🦁","🐮","🐷","🐽","🐸","🐵","🙈","🙉","🙊","🐒","🐔","🐧","🐦","🐤","🐣","🐥","🦆","🦅","🦉","🦇","姿勢","🐗","🐴","🦄","🐝","🐛","🦋","🐌","🐞","🐜","موت"," scorpion","🐢","🐍","🦎","🦖","🦕","🐙","🦑","🦐","🦞","🦀","🐡","🐠","🐟","🐬","🐳","🐋","🦈","🐊","🐅","🐆","🦓","🦍","🦧","🐘","🦛","🦏","🐪","🐫","🦒","🦘","🐃","🐂","🐄","🐎","🐖","🐏","🐑","🦙","🐐","🦌","🐕","🐩","🦮","🐕‍Clash","🐈","🐈‍⬛","🐓","🦃","🦚","🦜","🦢","🦩","🕊","🐇","🦝","🦨","🦡","🦦","🦥","🐁","🐀","🐿","🦔","🐾","🐉","🐲"]
  },
  food: {
    icon: Coffee,
    label: "طعام",
    emojis: ["🍏","🍎","🍐","🍊","🍋","🍌","🍉","🍇","🍓","🍈","🍒","🍑","🥭","🍍","🥥","🥝","🍅","🍆","🥑","🥦","🥬","🥒","🌶","🌽","🥕","🧄","🧅","🥔","🍠","🥐","🥯","🍞","🥖","🥨","🧀","🥚","🍳","🧈","🥞"," waffle","🥓","🥩","🍗","🍖","🦴","🌭","🍔","🍟","🍕","🥪","🥙","🧆","التماسك","🌯","🥗","🥘","التماسك","🍝","🍜","🍲","🍛","🍣","🍱","🥟","🦪","🍤","🍙","🍚","الساعة","🍥","🥠","🥮","🍢","🍡","🍧","🍨","🍦","🥧","🧁","🍰","🎂","🍮","🍭","🍬","🍫","🍿","🍩","🍪","🌰","🥜","🍯","🥛","🍼","☕","🍵","🧃","🥤","🍶","🍺","🍻","🥂","🍷","🥃","🍸","🍹","🧉","محلول","🧊","🥄","🍴","🍽","🥣","🥡","🥢","🧂"]
  },
  activities: {
    icon: Gamepad2,
    label: "أنشطة",
    emojis: ["⚽","🏀","🏈","⚾","🥎","🎾","🏐","🏉","🥏","🎱","🪀","🏓","🏸","🏒","🏑","🥍","🏏","🥅","⛳","🪁","🏹","🎣","🤿","🥊","🥋","🎽","سكيت","🛼","🛷","⛸","🥌","🎿","يرى","🏂","🪂","🏋️","🤼","🤸","⛹️","🤺","🤾","🏌️","🏇","🧘","🏄","🏊","🤽","🚣","🧗","🚵","🚴","🏆","🥇","🥈","🥉","🏅","🎖","🏵","🎗","🎫","🎟","🎪","🤹","🎭","🩰","🎨","🎬","🎤","🎧","🎼","🎹","🥁","🎷","🎺","🎸","🪕","الكمان","🎲","♟","🎯","🎳","🎮","🎰","🧩"]
  },
  travel: {
    icon: Plane,
    label: "سفر",
    emojis: ["🚗","🚕","🚙","🚌","🚎","🏎","🚓"," ambulance","🚒","🚐","🚚","🚛","🚜"," motorcycle","🛵","🚲","🦼","🦽","الخط","🚨","🚔","🚍","🚘","🚖","🚡","🚠","🚟","🚃","🚋","🚞","🚝","🚄","🚅","🚈","🚂","🚆","🚇","🚊","🚉","✈","أهلاً","🛬","🛩","💺","🛰","🚀","🛸","🚁","🛶","⛵","🚤","🛥","🛳","⛴","🚢","⚓","⛽","🚧","🚦","🚥","🚏","🗺","🗿","🗽","🗼","🏰","🏯","🏟","🎡","🎢","🎠"," fountains","⛱","🏖","🏝","🏜","🌋","⛰","🏔","🗻","🏕","⛺","🏠","🏡","🏘","🏚","🏗","🏭","🏢","🏬","","🏤","🏥","🏦","🏨","🏪","🏫","🏩","💒","🏛","⛪","🕌","🕍","🛕","🕋","⛩","🛤","الطر","🗾","🎑","🏞","🌅","🌄","🌠","🎇","🎆","🌇","🌆","🏙","🌃","🌌","BRIDGE","🌁"]
  },
  objects: {
    icon: Lightbulb,
    label: "أشياء",
    emojis: ["⌚","📱","📲","💻","⌨","🖥","🖨","鼠标","🖲","🕹","🗜","💽","💾","💿","📀","📼","📷","📸","📹","🎥","📽","🎞","📞","☎","📟","📠","📺","📻","🎙","🎚","🎛","🧭","⏱","⏲","⏰","🕰","⌛","⏳","📡","🔋","🔌","💡","flashlight","🕯","🪔","🧯","🛢","💸","💵","💴","💶","💷","🪙","💰","💳","💎","⚖","🧰","🔧","🔨","⚒","🛠","⛏","🪓","🧱","⚙","🪜","🩹","🩺","💈","🧲","🔫","💣","🧨","🔪","🗡","⚔","🛡","🚬","⚰","⚱","🏺","🔮","📿","🧿","💊","💉","🩸","🧬","🦠","🧫","🧪","🌡","🧹","🧺","🧻","🚽","🚰","🚿","🛁","🛀","🧼","🪥","🪒","🧽","🪣","🧴","🛎","🔑","🗝","🚪","🪑","🛋","🛏","🛌","🧸","🪆","🖼","🪞"]
  },
  flags: {
    icon: Flag,
    label: "أعلام",
    emojis: ["🏁","🚩","🎌","🏴","🏳","🏳️‍🌈","🏳️‍⚧️","🏴‍☠️","🇦🇩","🇦🇪","🇦🇫","🇦🇬","🇦🇮","🇦🇱","🇦🇲","🇦🇴","🇦🇶","🇦🇷","🇦🇸","🇦🇹","🇦🇺","🇦🇼","🇦🇽","🇦🇿","🇧🇦","🇧🇧","🇧🇩","🇧🇪","🇧🇫","🇧🇬","🇧Ｈ","🇧🇮","🇧🇯","🇧🇱","🇧🇲","🇧🇳","🇧🇴","🇧🇶","🇧🇷","🇧🇸","🇧🇹","🇧🇻","🇧🇼","🇧🇾","🇧🇿","🇨🇦","🇨🇨","🇨🇩","🇨🇫","🇨🇬","🇨🇭","🇨🇮","🇨🇰","🇨🇱","🇨🇲","🇨🇳","🇨🇴","🇨🇷","🇨🇺","🇨🇻","🇨🇼","🇨🇽","🇨🇾","🇨🇿","🇩🇪","🇩🇬","🇩🇯","🇩🇰","🇩🇲","🇩🇴","🇩🇿","🇪🇦","🇪🇨","🇪🇪","🇪🇬","🇪Ｈ","🇪🇷","🇪🇸","🇪🇹","🇪🇺","🇫🇮","🇫🇯","🇫🇰","🇫🇲","🇫🇴","🇫🇷","🇬🇦","🇬🇧","🇬🇩","🇬🇪","🇬🇫","🇬🇬","🇬Ｈ","🇬🇮","🇬🇱","🇬🇲","🇬🇳","🇬🇵","🇬🇶","🇬🇷","🇬🇸","🇬🇹","🇬🇺","🇬🇼","🇬🇾","🇭🇰","🇭🇲","🇭🇳","🇭🇷","🇭🇹","🇭🇺","🇮🇨","🇮🇩","🇮🇱","🇮🇲","🇮🇳","🇮🇴","🇮🇶","🇮🇷","🇮🇸","🇮🇹","🇯🇪","🇯🇲","🇯🇴","🇯🇵","🇰🇪","🇰🇬","🇰🇭","🇰🇮","🇰🇲","🇰🇳","🇰🇵","🇰🇷",
              "🇰🇼","🇰🇾","🇰🇿","🇱🇦","🇱🇧","🇱🇨","🇱🇮","🇱🇰","🇱🇷","🇱🇸","🇱ت","🇱🇺","🇱🇻","🇱🇾","🇲🇦","🇲🇨","🇲🇩","🇲🇪","🇲🇫","🇲🇬","🇲Ｈ","🇲🇰","🇲🇱","🇲🇲","🇲🇳","🇲🇴","🇲🇵","🇲🇶","🇲🇷","🇲🇸","🇲🇹","🇲🇺","🇲🇻","🇲🇼","🇲🇽","🇲🇾","🇲🇿","🇳🇦","🇳🇨","🇳🇪","🇳🇫","🇳🇬","🇳🇮","🇳🇱","🇳🇴","🇳🇵","🇳🇷","🇳🇺","🇳🇿","🇴🇲","🇵🇦","🇵🇪","🇵🇫","🇵🇬","🇵Ｈ","🇵🇰","🇵🇱","🇵🇲","🇵🇳","🇵🇷","🇵🇸","🇵🇹","🇵🇼","🇵🇾","🇶🇦","🇷🇪","🇷🇴","🇷🇸","🇷🇺","🇷🇼","🇸🇦","🇸🇧","🇸🇨","🇸🇩","🇸🇪","🇸🇬","🇸Ｈ","🇸🇮","🇸🇯","🇸🇰","🇸🇱","🇸🇲","🇸🇳","🇸🇴","🇸🇷","🇸🇸","🇸🇹","🇸🇻","🇸🇽","🇸🇾","🇸🇿","🇹🇦","🇹🇨","🇹🇩","🇹🇫","🇹🇬","🇹Ｈ","🇹🇯","🇹🇰","🇹🇱","🇹🇲","🇹🇳","🇹🇴","🇹🇷","🇹🇹","🇹🇻","🇹🇼","🇹🇿","🇺🇦","🇺🇬","🇺🇲","🇺🇳","🇺🇸","🇺🇾","🇺🇿","🇻🇦","🇻🇨","🇻🇪","🇻🇬","🇻🇮","🇻🇳","🇻🇺","🇼🇫","🇼🇸","🇽🇰","🇾🇪","🇾🇹","🇿🇦","🇿🇲","🇿🇼"] 
  }
};

const SavedItems: React.FC<SavedItemsProps> = ({ 
  currentUser, 
  savedPhotos, 
  savedVideos = [], 
  savedPosts = [], 
  onUnsave,
  onLike,
  onComment,
  onDeleteComment,
  onLikeComment,
  // Destructure Video Specific Handlers
  onLikeVideo,
  onCommentVideo,
  onDeleteVideoComment,
  onLikeVideoComment
}) => {
  const { t, dir, language } = useLanguage();
  const [activeTab, setActiveTab] = useState<TabType>('all');
  const [searchTerm, setSearchTerm] = useState('');

  // Lightbox State
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [activeItemIndex, setActiveItemIndex] = useState(0);
  const [activeListType, setActiveListType] = useState<'photos' | 'videos'>('photos');

  const [commentInput, setCommentInput] = useState('');
  const [notification, setNotification] = useState<{ message: string, type: 'success' | 'info' | 'error' } | null>(null);

  const [replyingToId, setReplyingToId] = useState<string | null>(null);
  const [replyText, setReplyText] = useState('');
  const [deleteCommentId, setDeleteCommentId] = useState<string | null>(null);

  const [showMenu, setShowMenu] = useState(false);
  const [menuView, setMenuView] = useState<MenuView>('main');
  const [notificationsOn, setNotificationsOn] = useState(true);
  const [audience, setAudience] = useState<AudienceType>('public');
  const [commentAudience, setCommentAudience] = useState<CommentAudienceType>('public');

  // Reactions State
  const [showReactions, setShowReactions] = useState(false);
  const [animateLike, setAnimateLike] = useState(false);
  const reactionTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Emoji Picker State
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [activeEmojiTab, setActiveEmojiTab] = useState<'recent' | keyof typeof EMOJI_CATEGORIES>('recent');
  const [emojiSearch, setEmojiSearch] = useState('');
  const [recentEmojis, setRecentEmojis] = useState<string[]>([]);

  // Modals
  const [showShareModal, setShowShareModal] = useState(false);
  const [itemToShare, setItemToShare] = useState<string | null>(null);
  const [copyFeedback, setCopyFeedback] = useState(false);
  const [showReportModal, setShowReportModal] = useState(false);
  const [reportReason, setReportReason] = useState('');
  const [isReportSubmitting, setIsReportSubmitting] = useState(false);
  const [reportFeedback, setReportFeedback] = useState(false);

  const commentsEndRef = useRef<HTMLDivElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const commentInputRef = useRef<HTMLInputElement>(null);
  const emojiPickerRef = useRef<HTMLDivElement>(null);

  const REACTIONS = useMemo(() => [
      { name: 'like', label: t.post_like || (language === 'ar' ? 'إعجاب' : 'Like'), emoji: '👍', color: 'text-blue-600', animation: 'animate-bounce' },
      { name: 'love', label: language === 'ar' ? 'أحببته' : 'Love', emoji: '❤️', color: 'text-red-600', animation: 'animate-pulse' },
      { name: 'care', label: language === 'ar' ? 'أدعمك' : 'Care', emoji: '🥰', color: 'text-yellow-500', animation: 'animate-bounce' },
      { name: 'haha', label: language === 'ar' ? 'هاها' : 'Haha', emoji: '😆', color: 'text-yellow-500', animation: 'animate-bounce' },
      { name: 'wow', label: language === 'ar' ? 'واو' : 'Wow', emoji: '😮', color: 'text-yellow-500', animation: 'animate-pulse' },
      { name: 'sad', label: language === 'ar' ? 'أحزنني' : 'Sad', emoji: '😢', color: 'text-yellow-500', animation: 'animate-bounce' },
      { name: 'angry', label: language === 'ar' ? 'أغضبني' : 'Angry', emoji: '😡', color: 'text-orange-600', animation: 'animate-bounce' },
  ], [t, language]);

  const normalizeText = (text: string) => {
    if (!text) return '';
    return text.toLowerCase().replace(/[أإآ]/g, 'ا').replace(/ة/g, 'ه').replace(/ى/g, 'ي');
  };

  const filteredPhotos = useMemo(() => {
    const normalizedSearch = normalizeText(searchTerm);
    return savedPhotos.filter(p => !searchTerm || (p.description && normalizeText(p.description).includes(normalizedSearch)));
  }, [savedPhotos, searchTerm]);

  const filteredVideos = useMemo(() => {
    const normalizedSearch = normalizeText(searchTerm);
    return savedVideos.filter(v => !searchTerm || normalizeText(v.title).includes(normalizedSearch));
  }, [savedVideos, searchTerm]);

  const filteredPosts = useMemo(() => {
    const normalizedSearch = normalizeText(searchTerm);
    return savedPosts.filter(p => !p.image && (!searchTerm || normalizeText(p.content).includes(normalizedSearch)));
  }, [savedPosts, searchTerm]);

  const hasItems = filteredPhotos.length > 0 || filteredVideos.length > 0 || filteredPosts.length > 0;

  const currentItem = useMemo(() => {
      if (!lightboxOpen) return null;
      if (activeListType === 'photos') return filteredPhotos[activeItemIndex];
      if (activeListType === 'videos') return filteredVideos[activeItemIndex];
      return null;
  }, [lightboxOpen, activeListType, activeItemIndex, filteredPhotos, filteredVideos]);

  const activeReaction = currentItem?.isLiked ? (REACTIONS.find(r => r.name === currentItem.reaction) || REACTIONS[0]) : null;

  useEffect(() => {
    if (lightboxOpen && currentItem) {
        commentsEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [currentItem?.comments, lightboxOpen, activeItemIndex]);

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
    if (showMenu || showEmojiPicker) document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [showMenu, showEmojiPicker]);

  useEffect(() => {
      const savedRecents = localStorage.getItem('chat_recent_emojis');
      if (savedRecents) {
          setRecentEmojis(JSON.parse(savedRecents));
      }
  }, []);

  const showNotification = (message: string, type: 'success' | 'info' | 'error' = 'success') => {
    setNotification({ message, type });
    setTimeout(() => setNotification(null), 3000);
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
          case 'only_me': return t.privacy_only_me || (language === 'ar' ? 'أنت فقط' : 'Only me');
      }
  };

  const getAudienceDescription = (type: AudienceType) => {
      switch(type) {
          case 'public': return language === 'ar' ? 'أي شخص على فيسبوك أو خارجه' : 'Anyone on or off Facebook';
          case 'friends': return language === 'ar' ? 'أصدقاؤك على فيسبوك' : 'Your friends on Facebook';
          case 'friends_of_friends': return language === 'ar' ? 'أصدقاء أصدقائك' : 'Friends of friends';
          case 'only_me': return language === 'ar' ? 'أنت فقط' : 'Only me';
      }
  };

  const openLightbox = (index: number, type: 'photos' | 'videos') => {
    setActiveItemIndex(index);
    setActiveListType(type);
    setLightboxOpen(true);
    setCommentInput('');
    setShowMenu(false);
    setReplyingToId(null);
    setShowReactions(false);
    setShowEmojiPicker(false);
  };

  const closeLightbox = () => {
    setLightboxOpen(false);
    if (videoRef.current) videoRef.current.pause();
  };

  const nextItem = (e?: React.MouseEvent) => {
    e?.stopPropagation();
    const list = activeListType === 'photos' ? filteredPhotos : filteredVideos;
    if (list.length === 0) return;
    setActiveItemIndex((activeItemIndex + 1) % list.length);
    setReplyingToId(null);
    setReplyText('');
    setShowReactions(false);
    setShowEmojiPicker(false);
  };

  const prevItem = (e?: React.MouseEvent) => {
    e?.stopPropagation();
    const list = activeListType === 'photos' ? filteredPhotos : filteredVideos;
    if (list.length === 0) return;
    setActiveItemIndex((activeItemIndex - 1 + list.length) % list.length);
    setReplyingToId(null);
    setReplyText('');
    setShowReactions(false);
    setShowEmojiPicker(false);
  };

  const handleSendComment = (e?: React.FormEvent) => {
    e?.preventDefault();
    if (!commentInput.trim() || !currentItem) return;
    
    // Synced Handler Logic
    if (activeListType === 'videos' && onCommentVideo) {
        onCommentVideo(currentItem.id, commentInput);
    } else if (onComment) {
        onComment(currentItem.id, commentInput);
    }
    
    setCommentInput('');
    setShowEmojiPicker(false);
  };

  const handleInlineReplySubmit = (e: React.FormEvent) => {
      e.preventDefault();
      if (!replyText.trim() || !currentItem) return;
      
      // Synced Handler Logic
      if (activeListType === 'videos' && onCommentVideo) {
          onCommentVideo(currentItem.id, replyText);
      } else if (onComment) {
          onComment(currentItem.id, replyText);
      }
      
      setReplyingToId(null);
      setReplyText('');
  };

  const handleLike = () => {
    if (!currentItem) return;
    setAnimateLike(true);
    setTimeout(() => setAnimateLike(false), 300);

    const newIsLiked = !currentItem.isLiked;
    const reactionToSend = newIsLiked ? 'like' : (activeReaction?.name || 'like');
    
    if (onLike) onLike(currentItem.id, reactionToSend);
    setShowReactions(false);
  };

  const handleReactionSelect = (reaction: typeof REACTIONS[0]) => {
      if (!currentItem) return;
      setAnimateLike(true);
      setTimeout(() => setAnimateLike(false), 300);
      
      // Synced Handler Logic
      if (activeListType === 'videos' && onLikeVideo) {
          onLikeVideo(currentItem.id, reaction.name);
      } else if (onLike) {
          onLike(currentItem.id, reaction.name);
      }
      
      setShowReactions(false);
  };

  const handleEmojiClick = (emoji: string) => {
      setCommentInput(prev => prev + emoji);
      const newRecents = [...new Set([emoji, ...recentEmojis])].slice(0, 24);
      setRecentEmojis(newRecents);
      localStorage.setItem('chat_recent_emojis', JSON.stringify(newRecents));

      if(commentInputRef.current) {
          commentInputRef.current.focus();
      }
      // Auto-close emoji picker after selection
      setShowEmojiPicker(false);
  };

  const handleDeleteCommentConfirm = () => {
      if (deleteCommentId && currentItem) {
          if (activeListType === 'videos' && onDeleteVideoComment) {
              onDeleteVideoComment(currentItem.id, deleteCommentId);
          } else if (onDeleteComment) {
              onDeleteComment(currentItem.id, deleteCommentId);
          }
          setDeleteCommentId(null);
          showNotification(t.common_delete + ' ' + (language === 'ar' ? 'تم' : 'Done'), 'info');
      }
  };

  const handleLikeCommentLocal = (commentId: string) => {
      if (!currentItem) return;
      if (activeListType === 'videos' && onLikeVideoComment) {
          onLikeVideoComment(currentItem.id, commentId);
      } else if (onLikeComment) {
          onLikeComment(currentItem.id, commentId);
      }
  };

  const handleUnsaveCurrent = () => {
    if (currentItem) {
      onUnsave(currentItem);
      const list = activeListType === 'photos' ? filteredPhotos : filteredVideos;
      if (list.length <= 1) closeLightbox();
      else nextItem();
      showNotification(language === 'ar' ? 'تمت إزالة العنصر من المحفوظات' : 'Item removed from saved', 'info');
    }
  };

  const handleDownload = () => {
    if (currentItem) {
      const link = document.createElement('a');
      link.href = currentItem.url;
      link.download = `saved_${activeListType}_${Date.now()}`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      showNotification(t.common_download + ' ' + (language === 'ar' ? 'جاري...' : 'Starting...'), 'success');
      setShowMenu(false);
    }
  };

  const currentMediaUrl = () => {
      if (!currentItem) return '';
      return (currentItem as any).url || (currentItem as any).image || '';
  };

  const handleShareClick = (e: React.MouseEvent, url: string) => {
      e.stopPropagation();
      setItemToShare(url);
      setShowShareModal(true);
  };
  
  const handleSocialShare = (platform: string) => {
      const urlToShare = itemToShare || currentMediaUrl();
      if (!urlToShare) return;
      const encodedUrl = encodeURIComponent(urlToShare);
      let shareUrl = '';
      switch (platform) {
          case 'facebook': shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`; break;
          case 'twitter': shareUrl = `https://twitter.com/intent/tweet?url=${encodedUrl}`; break;
          case 'whatsapp': shareUrl = `https://api.whatsapp.com/send?text=${encodedUrl}`; break;
      }
      if (shareUrl) window.open(shareUrl, '_blank', 'width=600,height=400');
      setShowShareModal(false);
      showNotification(language === 'ar' ? `تمت المشاركة عبر ${platform}` : `Shared via ${platform}`, 'success');
  };

  const handleCopyLink = () => {
      const urlToCopy = itemToShare || currentMediaUrl();
      if (urlToCopy) {
          navigator.clipboard.writeText(urlToCopy).then(() => {
            setCopyFeedback(true);
            setTimeout(() => {
                setCopyFeedback(false);
                setShowShareModal(false);
                showNotification(t.common_copied || 'Copied', 'success');
            }, 1500);
          }).catch(() => {
              showNotification(t.errors_generic || 'Error copying link', 'error');
          });
      }
  };

  const handleDirectCopyLink = () => {
      if (currentItem) {
        // Generate a simulated permalink for robustness
        const baseUrl = window.location.origin;
        const typePath = activeListType === 'videos' ? 'video' : 'photo';
        const link = `${baseUrl}/${typePath}/${currentItem.id}`;

        navigator.clipboard.writeText(link).then(() => {
            showNotification(t.common_copied || 'Copied', 'success');
            setShowMenu(false);
        }).catch(() => {
             // Fallback for secure context issues
             try {
                 const textArea = document.createElement("textarea");
                 textArea.value = link;
                 document.body.appendChild(textArea);
                 textArea.focus();
                 textArea.select();
                 document.execCommand('copy');
                 document.body.removeChild(textArea);
                 showNotification(t.common_copied || 'Copied', 'success');
                 setShowMenu(false);
             } catch (err) {
                 showNotification(t.errors_generic || 'Error copying link', 'error');
             }
        });
      }
  };

  const handleReport = () => {
     setShowMenu(false);
     setShowReportModal(true);
  };

  const handleSubmitReport = () => {
      if(!reportReason) return;
      setIsReportSubmitting(true);
      setTimeout(() => {
          setIsReportSubmitting(false);
          setShowReportModal(false);
          setReportReason('');
          setReportFeedback(true);
          setTimeout(() => setReportFeedback(false), 3000);
          showNotification(language === 'ar' ? 'تم إرسال البلاغ' : 'Report sent', 'success');
      }, 1500);
  };

  // Render Emoji Picker UI (Reused from other components)
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
    <div className="max-w-[1095px] mx-auto py-6 px-4 animate-fadeIn" dir={dir}>
      <div className="bg-white/90 dark:bg-gray-900/95 backdrop-blur-md rounded-2xl shadow-xl border border-gray-200/50 dark:border-gray-700/50 p-6 md:p-8 transition-colors duration-300">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
          <div>
             <h2 className="text-3xl font-extrabold text-gray-900 dark:text-white flex items-center gap-3">
                <div className="p-3 bg-fb-blue text-white rounded-xl shadow-lg shadow-emerald-900/20">
                  <Bookmark className="w-8 h-8 fill-current" />
                </div>
                <div>
                   <span className="block">{t.nav_saved || 'Saved Items'}</span>
                   <span className="text-sm font-medium text-gray-500 dark:text-gray-400 mt-1">
                      {hasItems 
                        ? (language === 'ar' ? `لديك ${filteredPosts.length + filteredPhotos.length + filteredVideos.length} عنصر محفوظ` : `You have ${filteredPosts.length + filteredPhotos.length + filteredVideos.length} saved items`) 
                        : (t.common_no_results || 'No saved items')
                      }
                   </span>
                </div>
             </h2>
          </div>
          <div className="relative w-full md:w-auto">
             <Search className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 dark:text-gray-500 transition-colors" />
             <input 
               type="text" 
               placeholder={t.placeholders_search || 'Search...'}
               className="w-full md:w-80 bg-gray-100 dark:bg-gray-800 border border-transparent focus:border-fb-blue rounded-xl py-3 pr-11 pl-4 text-sm outline-none transition-all shadow-inner text-gray-900 dark:text-white placeholder-gray-500"
               value={searchTerm}
               onChange={(e) => setSearchTerm(e.target.value)}
             />
          </div>
        </div>

        <div className="flex items-center gap-2 mb-8 overflow-x-auto no-scrollbar pb-2">
           {[ 
              { id: 'all', label: t.common_all || 'All', icon: Filter },
              { id: 'posts', label: t.profile_posts || 'Posts', icon: FileText },
              { id: 'photos', label: t.profile_photos || 'Photos', icon: ImageIcon },
              { id: 'videos', label: t.profile_videos || 'Videos', icon: Video }
           ].map((tab) => (
               <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as TabType)}
                  className={`flex items-center gap-2 px-6 py-3 rounded-xl text-sm font-bold whitespace-nowrap transition-all duration-200 ${
                      activeTab === tab.id 
                      ? 'bg-fb-blue text-white shadow-md transform scale-105' 
                      : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700'
                  }`}
               >
                  {tab.icon && React.createElement(tab.icon, { className: "w-4 h-4" })}
                  <span>{tab.label}</span>
               </button>
           ))}
        </div>

        {hasItems ? (
          <div className="space-y-12">
              {/* Posts Section */}
              {(activeTab === 'all' || activeTab === 'posts') && filteredPosts.length > 0 && (
                <div className="animate-fadeIn">
                    <div className="flex items-center gap-3 mb-6 pb-2 border-b border-gray-200 dark:border-gray-700">
                        <div className="p-2 bg-purple-100 dark:bg-purple-900/30 rounded-lg text-purple-600"><FileText className="w-5 h-5" /></div>
                        <h3 className="text-xl font-bold text-gray-800 dark:text-white">
                            {language === 'ar' ? 'المنشورات المحفوظة' : 'Saved Posts'}
                        </h3>
                    </div>

                    <div className="grid grid-cols-1 gap-6 max-w-2xl mx-auto">
                    {filteredPosts.map(post => (
                        <div key={post.id} className="relative">
                        <PostCard 
                            post={post} 
                            currentUser={currentUser} 
                            onToggleSave={() => onUnsave(post)} 
                            onLike={(id, reaction) => onLike?.(id, reaction)} 
                            onComment={(postId, text) => onComment?.(postId, text)} 
                            onDeleteComment={(postId, commentId) => onDeleteComment?.(postId, commentId)}
                            onLikeComment={(postId, commentId) => onLikeComment?.(postId, commentId)}
                            isSaved={true} 
                        />

                        <button
                            onClick={(e) => { e.stopPropagation(); onUnsave(post); }}
                            className="absolute top-4 left-12 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 p-2 rounded-full transition"
                        >
                            <Trash2 className="w-4 h-4" />
                        </button>
                        </div>
                    ))}
                    </div>
                </div>
              )}

              {/* Photos Section */}
              {(activeTab === 'all' || activeTab === 'photos') && filteredPhotos.length > 0 && (
                  <div className="animate-fadeIn">
                      <div className="flex items-center gap-3 mb-6 pb-2 border-b border-gray-200 dark:border-gray-700">
                          <div className="p-2 bg-pink-100 dark:bg-pink-900/30 rounded-lg text-pink-600">
                             <ImageIcon className="w-5 h-5" />
                          </div>
                          <h3 className="text-xl font-bold text-gray-800 dark:text-white">{language === 'ar' ? 'الصور المحفوظة' : 'Saved Photos'}</h3>
                      </div>
                      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                          {filteredPhotos.map((photo, idx) => {
                              const reaction = photo.isLiked ? (REACTIONS.find(r => r.name === photo.reaction) || REACTIONS[0]) : null;
                              return (
                                <div key={photo.id} className="aspect-square bg-gray-100 dark:bg-gray-800 rounded-xl overflow-hidden cursor-pointer relative group border border-gray-200 dark:border-gray-700 shadow-sm hover:shadow-xl transition-all duration-300" onClick={() => openLightbox(idx, 'photos')}>
                                    <img src={photo.url} alt="saved" className="w-full h-full object-cover transition duration-500 group-hover:scale-110" />
                                    <div className="absolute top-2 right-2 bg-white/90 dark:bg-gray-900/90 p-1.5 rounded-full shadow-lg text-emerald-600">
                                        {reaction ? <span className="text-sm">{reaction.emoji}</span> : <Bookmark className="w-3.5 h-3.5 fill-current" />}
                                    </div>
                                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition flex items-center justify-center">
                                        <button onClick={(e) => { e.stopPropagation(); onUnsave(photo); showNotification(language === 'ar' ? 'تمت إزالة الصورة من المحفوظات' : 'Photo unsaved', 'info'); }} className="bg-red-600 text-white p-2 rounded-full hover:bg-red-700 transition">
                                            <Trash2 className="w-5 h-5" />
                                        </button>
                                    </div>
                                </div>
                              );
                          })}
                      </div>
                  </div>
              )}

              {/* Videos Section */}
              {(activeTab === 'all' || activeTab === 'videos') && filteredVideos.length > 0 && (
                  <div className="animate-fadeIn">
                      <div className="flex items-center gap-3 mb-6 pb-2 border-b border-gray-200 dark:border-gray-700">
                          <div className="p-2 bg-orange-100 dark:bg-orange-900/30 rounded-lg text-orange-600">
                             <Video className="w-5 h-5" />
                          </div>
                          <h3 className="text-xl font-bold text-gray-800 dark:text-white">{language === 'ar' ? 'الفيديوهات المحفوظة' : 'Saved Videos'}</h3>
                      </div>
                      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                          {filteredVideos.map((video, idx) => {
                              const reaction = video.isLiked ? (REACTIONS.find(r => r.name === video.reaction) || REACTIONS[0]) : null;
                              return (
                                <div key={video.id} className="bg-white dark:bg-gray-800 rounded-2xl overflow-hidden border border-gray-200 dark:border-gray-700 cursor-pointer group shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col hover:-translate-y-1" onClick={() => openLightbox(idx, 'videos')}>
                                    <div className="aspect-video bg-black relative">
                                        <video src={video.url} className="w-full h-full object-cover opacity-90 group-hover:opacity-100 transition duration-500 pointer-events-none" />
                                        <div className="absolute inset-0 flex items-center justify-center bg-black/20">
                                            <Play className="w-8 h-8 text-white fill-white" />
                                        </div>
                                        <div className="absolute top-2 right-2 bg-white/90 dark:bg-gray-900/90 p-1.5 rounded-full shadow-lg text-emerald-600">
                                            {reaction ? <span className="text-sm">{reaction.emoji}</span> : <Bookmark className="w-3.5 h-3.5 fill-current" />}
                                        </div>
                                    </div>
                                    <div className="p-4 flex-1 flex flex-col">
                                        <h4 className="font-bold text-base text-gray-900 dark:text-white truncate mb-1">{video.title}</h4>
                                        <div className="flex justify-between items-center mt-auto">
                                            <span className="text-xs text-gray-500 dark:text-gray-400 font-medium">{video.timestamp}</span>
                                            <button onClick={(e) => { e.stopPropagation(); onUnsave(video); }} className="text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 p-2 rounded-full transition"><Trash2 className="w-4 h-4" /></button>
                                        </div>
                                    </div>
                                </div>
                              );
                          })}
                      </div>
                  </div>
              )}
          </div>
        ) : (
            <div className="text-center py-24 flex flex-col items-center justify-center animate-fadeIn">
                <div className="bg-white dark:bg-gray-800 p-8 rounded-full shadow-xl relative mb-6 border border-gray-100 dark:border-gray-700">
                    <BookmarkMinus className="w-16 h-16 text-gray-300 dark:text-gray-600" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-3">{t.no_saved_items || 'محفظتك فارغة حالياً'}</h3>
                <p className="text-gray-500 dark:text-gray-400 max-w-sm mx-auto text-lg">{language === 'ar' ? 'عندما تقوم بحفظ العناصر، ستظهر جميعها هنا منظمة حسب نوعها.' : 'Items you save will appear here.'}</p>
            </div>
        )}
      </div>

      {/* --- Lightbox Modal for Standalone Media --- */}
      {lightboxOpen && currentItem && typeof document !== 'undefined' && createPortal(
        <div className="fixed inset-0 z-[1000] bg-black bg-opacity-95 flex items-center justify-center animate-fadeIn">
           <div className="w-full h-full flex flex-col md:flex-row overflow-hidden">
               {/* Media Section (Left/Center) */}
               <div className="flex-1 bg-black flex items-center justify-center relative group" onClick={(e) => e.stopPropagation()}>
                    <button className="absolute top-4 left-4 p-2 bg-black/50 hover:bg-white/20 rounded-full text-white z-[102]" onClick={closeLightbox}><X className="w-6 h-6" /></button>
                    <button className="absolute right-4 top-1/2 -translate-y-1/2 p-3 bg-black/50 hover:bg-white/20 rounded-full text-white z-10 transition hover:scale-110" onClick={prevItem}><ChevronRight className="w-8 h-8" /></button>
                    <button className="absolute left-4 top-1/2 -translate-y-1/2 p-3 bg-black/50 hover:bg-white/20 rounded-full text-white z-10 transition hover:scale-110" onClick={nextItem}><ChevronLeft className="w-8 h-8" /></button>

                    {activeListType === 'videos' ? (
                         <video ref={videoRef} src={currentItem.url} className="max-w-full max-h-full object-contain" controls autoPlay />
                    ) : (
                         <img src={currentItem.url} className="max-w-full max-h-full object-contain" alt="Full screen" />
                    )}
               </div>

               {/* Info/Comments Sidebar (Right) */}
               <div className="w-full md:w-[450px] flex-shrink-0 bg-white dark:bg-gray-800 flex flex-col h-[40vh] md:h-full border-l border-gray-200 dark:border-gray-700 shadow-xl" onClick={(e) => e.stopPropagation()}>
                    <div className="p-4 border-b border-gray-200 dark:border-gray-700 flex items-center gap-3">
                        <img src={currentUser.avatar} alt="User" className="w-10 h-10 rounded-full border border-gray-100" />
                        <div className="flex-1">
                            <h4 className="font-bold text-sm text-gray-900 dark:text-white">{currentUser.name}</h4>
                            <div className="text-xs text-gray-500 dark:text-gray-400">{language === 'ar' ? 'محفوظ' : 'Saved'} · {getAudienceIcon(audience)}</div>
                        </div>
                        <div className="relative" ref={menuRef}>
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
                                            <button onClick={() => { handleUnsaveCurrent(); setShowMenu(false); }} className="w-full text-start px-4 py-3 hover:bg-gray-100 dark:hover:bg-gray-700 flex items-center gap-3 text-sm text-gray-700 dark:text-gray-200 transition font-medium">
                                                <BookmarkMinus className="w-5 h-5 text-fb-blue" />
                                                {t.post_unsave || 'إلغاء الحفظ'}
                                            </button>
                                            
                                            <div className="border-t border-gray-100 dark:border-gray-700 my-1"></div>
                                            
                                            <button onClick={() => { setNotificationsOn(!notificationsOn); setShowMenu(false); }} className="w-full text-start px-4 py-3 hover:bg-gray-100 dark:hover:bg-gray-700 flex items-center gap-3 text-sm text-gray-700 dark:text-gray-200 transition font-medium">
                                                {notificationsOn ? <BellOff className="w-5 h-5" /> : <Bell className="w-5 h-5" />}
                                                {notificationsOn 
                                                    ? (language === 'ar' ? 'إيقاف الإشعارات' : 'Turn off notifications') 
                                                    : (language === 'ar' ? 'تشغيل الإشعارات' : 'Turn on notifications')
                                                }
                                            </button>

                                            <div className="border-t border-gray-100 dark:border-gray-700 my-1"></div>
                                            
                                            <button onClick={() => { setItemToShare(currentItem.url); setShowShareModal(true); setShowMenu(false); }} className="w-full text-start px-4 py-3 hover:bg-gray-100 dark:hover:bg-gray-700 flex items-center gap-3 text-sm text-gray-700 dark:text-gray-200 transition font-medium">
                                                <Share2 className="w-5 h-5" /> {t.common_share || 'مشاركة'}
                                            </button>
                                            
                                            <button onClick={handleDownload} className="w-full text-start px-4 py-3 hover:bg-gray-100 dark:hover:bg-gray-700 flex items-center gap-3 text-sm text-gray-700 dark:text-gray-200 transition font-medium">
                                                <Download className="w-5 h-5" /> {t.common_download || 'تنزيل'}
                                            </button>

                                            <button 
                                                onClick={handleDirectCopyLink} 
                                                className="w-full text-start px-4 py-3 hover:bg-gray-100 dark:hover:bg-gray-700 flex items-center gap-3 text-sm text-gray-700 dark:text-gray-200 transition font-medium"
                                            >
                                                <Globe className="w-5 h-5" /> {t.post_copy_link || 'نسخ الرابط'}
                                            </button>

                                            <button 
                                                onClick={handleReport} 
                                                className="w-full text-start px-4 py-3 hover:bg-gray-100 dark:hover:bg-gray-700 flex items-center gap-3 text-sm text-gray-700 dark:text-gray-200 transition font-medium"
                                            >
                                                <Flag className="w-5 h-5" /> {t.common_report || (language === 'ar' ? 'إبلاغ' : 'Report')}
                                            </button>
                                        </>
                                    )}
                                </div>
                            )}
                        </div>
                    </div>
                    <div className="px-4 py-3 flex justify-between items-center text-sm text-gray-500 dark:text-gray-400 border-b border-gray-100 dark:border-gray-700">
                        <div className="flex items-center gap-1">
                            <div className="bg-fb-blue p-1 rounded-full shadow-sm"><ThumbsUp className="w-3 h-3 text-white fill-current" /></div>
                            <span className="font-medium">{currentItem.likes > 0 ? currentItem.likes : ''}</span>
                        </div>
                        <div className="flex gap-3">
                            <span className="font-medium">{currentItem.comments.length} {t.post_comment}</span>
                        </div>
                    </div>
                    <div className="px-2 py-1 flex items-center justify-between border-b border-gray-200 dark:border-gray-700 relative">
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
                         
                         <button 
                            onClick={handleLike} 
                            onMouseEnter={() => { reactionTimerRef.current = setTimeout(() => setShowReactions(true), 500); }} 
                            onMouseLeave={() => { if (reactionTimerRef.current) clearTimeout(reactionTimerRef.current); }}
                            className={`flex-1 flex items-center justify-center gap-2 py-2.5 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-all ${animateLike ? 'animate-pop' : ''} ${activeReaction ? activeReaction.color : 'text-gray-600 dark:text-gray-300'}`}
                         >
                            {activeReaction ? <span className="text-xl animate-bounce-in">{activeReaction.emoji}</span> : <ThumbsUp className={`w-5 h-5 ${currentItem.isLiked ? 'text-emerald-700 fill-current' : ''}`} />} <span className={`text-[15px] font-bold ${currentItem.isLiked && !activeReaction ? 'text-emerald-700' : ''}`}>{activeReaction ? activeReaction.label : t.post_like}</span>
                         </button>

                         <button onClick={() => commentInputRef.current?.focus()} className="flex-1 flex items-center justify-center gap-2 py-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition font-bold text-gray-600 dark:text-gray-300 text-sm">
                            <MessageCircle className="w-5 h-5" /> {t.post_comment}
                         </button>
                         <button onClick={() => { setItemToShare(currentItem.url); setShowShareModal(true); }} className="flex-1 flex items-center justify-center gap-2 py-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition font-bold text-gray-600 dark:text-gray-300 text-sm">
                            <Share2 className="w-5 h-5" /> {t.common_share}
                         </button>
                    </div>
                    <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50 dark:bg-gray-900/30">
                        {currentItem.comments.length === 0 ? (
                            <div className="text-center text-gray-400 dark:text-gray-500 py-10 text-sm italic">{t.profile_no_posts || 'No comments yet.'}</div>
                        ) : (
                            currentItem.comments.map(comment => (
                                <div key={comment.id} className="flex gap-2 group flex-col">
                                    <div className="flex gap-2 items-start">
                                        <img src={comment.author.avatar} className="w-8 h-8 rounded-full border border-gray-100 shadow-sm" alt="commenter" />
                                        <div className="flex flex-col flex-1">
                                            <div className="bg-gray-200 dark:bg-gray-700 px-3 py-2 rounded-2xl rounded-tr-none relative group/comment w-fit shadow-sm">
                                                <span className="font-bold text-xs block text-gray-900 dark:text-white">{comment.author.name}</span>
                                                <span className="text-sm text-gray-800 dark:text-gray-200">{comment.content}</span>
                                            </div>
                                            <div className="flex gap-3 text-[11px] text-gray-500 dark:text-gray-400 pr-2 mt-1 items-center font-bold">
                                                <span 
                                                    className={`cursor-pointer hover:underline transition ${comment.isLiked ? 'text-fb-blue' : ''}`}
                                                    onClick={() => onLikeComment && onLikeComment(currentItem.id, comment.id)}
                                                >
                                                    {t.post_like}
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
                                                    {t.post_reply}
                                                </span>
                                                <span className="font-normal">{comment.timestamp}</span>
                                                {comment.author.id === currentUser.id && (
                                                    <span 
                                                        className="cursor-pointer hover:underline text-red-500 transition"
                                                        onClick={() => setDeleteCommentId(comment.id)}
                                                    >
                                                        {t.common_delete}
                                                    </span>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                    {replyingToId === comment.id && (
                                        <div className="mr-10 flex gap-2 animate-fadeIn mt-1">
                                            <img src={currentUser.avatar} className="w-6 h-6 rounded-full border border-gray-100" alt="me" />
                                            <form className="flex-1" onSubmit={handleInlineReplySubmit}>
                                                <input 
                                                    type="text" 
                                                    className="w-full bg-gray-100 dark:bg-gray-700 border-none rounded-full px-3 py-1.5 text-xs focus:ring-1 focus:ring-fb-blue transition dark:text-white outline-none shadow-inner" 
                                                    placeholder={`${t.post_reply} ${comment.author.name}...`}
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
                                        className="bg-transparent w-full outline-none text-[14px] placeholder-gray-500 dark:placeholder-gray-400 text-gray-900 dark:text-white" 
                                        placeholder={t.post_write_comment} 
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
                                        {showEmojiPicker && renderEmojiPicker()}
                                     </div>

                                     <button type="submit" disabled={!commentInput.trim()} className="text-emerald-700 hover:bg-emerald-50 p-1.5 rounded-full transition disabled:opacity-50 disabled:hover:bg-transparent">
                                        {dir === 'rtl' ? <Send className="w-5 h-5 rotate-180" /> : <Send className="w-5 h-5" />}
                                     </button>
                                </form>
                             </div>
                        </div>
                    </div>
               </div>

               {/* --- Sub-modals inside Portal to guarantee Stacking Order --- */}
               {deleteCommentId && (
                  <div className="fixed inset-0 z-[350] flex items-center justify-center bg-black/60 p-4 animate-fadeIn backdrop-blur-sm" onClick={() => setDeleteCommentId(null)}>
                      <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-2xl w-full max-w-sm border border-gray-200 dark:border-gray-700 animate-scaleIn" onClick={e => e.stopPropagation()}>
                          <h3 className="font-bold text-lg mb-2 text-gray-900 dark:text-white">{t.post_delete_confirm_title || 'Delete Comment?'}</h3>
                          <p className="text-gray-600 dark:text-gray-300 text-sm mb-6">{t.post_delete_confirm_desc || 'Are you sure?'}</p>
                          <div className="flex justify-end gap-3">
                              <button onClick={() => setDeleteCommentId(null)} className="px-5 py-2 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg text-sm font-bold transition">{t.common_cancel}</button>
                              <button 
                                  onClick={handleDeleteCommentConfirm} 
                                  className="px-6 py-2 bg-red-600 text-white rounded-lg text-sm font-bold hover:bg-red-700 transition shadow-lg"
                              >
                                  {t.common_delete}
                              </button>
                          </div>
                      </div>
                  </div>
               )}

                {/* --- Share Modal - Match Professional Design --- */}
               {showShareModal && (
                  <div className="fixed inset-0 z-[100005] bg-black/75 p-4 animate-fadeIn backdrop-blur-sm flex items-center justify-center" onClick={() => setShowShareModal(false)}>
                      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl w-full max-w-md overflow-hidden animate-scaleIn border border-white/10 dark:border-gray-700" onClick={e => e.stopPropagation()}>
                          <div className="p-4 border-b border-gray-100 dark:border-gray-700 flex justify-between items-center bg-gray-50 dark:bg-gray-900/50">
                              <h3 className="font-extrabold text-lg text-gray-900 dark:text-white flex items-center gap-2">
                                  <Share2 className="w-5 h-5 text-emerald-700 dark:text-emerald-500" />
                                  {t.common_share || (language === 'ar' ? 'مشاركة' : 'Share')}
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
                                  <button onClick={handleCopyLink} className="flex flex-col items-center gap-2 group"><div className="w-14 h-14 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-200 rounded-full flex items-center justify-center shadow-md transition transform group-hover:scale-110 active:scale-95 border border-white dark:border-gray-600">{copyFeedback ? <Check className="w-7 h-7 text-green-600" /> : <Copy className="w-7 h-7" />}</div><span className="text-[10px] font-bold text-gray-600 dark:text-gray-400 uppercase tracking-widest">{t.common_copy}</span></button>
                              </div>
                              <div className="space-y-3">
                                  <label className="text-[10px] font-extrabold text-gray-400 dark:text-gray-500 uppercase tracking-[0.2em] px-1 block text-start">{t.post_copy_link}</label>
                                  <div className="flex items-center gap-2 bg-gray-100 dark:bg-gray-900 p-2.5 rounded-xl border border-gray-200 dark:border-gray-700 shadow-inner">
                                      <LinkIcon className="w-4 h-4 text-gray-400 ml-1" />
                                      <input readOnly value={itemToShare || ''} className="bg-transparent border-none outline-none text-[11px] text-gray-500 flex-1 truncate font-mono" />
                                      <button onClick={handleCopyLink} className="bg-fb-blue text-white px-5 py-2 rounded-lg text-xs font-bold hover:bg-blue-700 transition active:scale-95 shadow-sm">{copyFeedback ? t.common_done : t.common_copy}</button>
                                  </div>
                              </div>
                          </div>
                      </div>
                  </div>
               )}
               {/* Report Modal */}
               {showReportModal && (
                    <div className="fixed inset-0 z-[300] bg-black/60 flex items-center justify-center p-4 animate-fadeIn backdrop-blur-sm" onClick={() => setShowReportModal(false)}>
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
        </div>, 
        document.body
      )}

      {notification && typeof document !== 'undefined' && createPortal(
        <div className="fixed bottom-6 right-6 z-[100000] animate-bounce-in">
            <div className={`flex items-center gap-3 px-5 py-3.5 rounded-xl shadow-lg text-white border border-white/10 backdrop-blur-md ${notification.type === 'success' ? 'bg-emerald-600/90' : 'bg-blue-600/90'}`}>
                {notification.type === 'success' ? <Check className="w-5 h-5" /> : <AlertCircle className="w-5 h-5" />}
                <span className="font-medium text-sm">{notification.message}</span>
                <button onClick={() => setNotification(null)} className="mr-2 text-white/80 hover:text-white transition"><X className="w-4 h-4" /></button>
            </div>
        </div>,
        document.body
      )}
    </div>
  );
};

export default SavedItems;