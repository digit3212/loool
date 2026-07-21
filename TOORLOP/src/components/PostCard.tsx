import React, { useState, useRef, useEffect, useMemo } from 'react';
import { createPortal } from 'react-dom';
import { 
  ThumbsUp, 
  MessageCircle, 
  Share2, 
  MoreHorizontal, 
  Globe, 
  Trash2, 
  Pin, 
  Bookmark, 
  Bell, 
  BellOff, 
  Users, 
  UserPlus, 
  Lock, 
  ChevronLeft, 
  ArrowRight, 
  AtSign, 
  BookmarkMinus, 
  Link as LinkIcon, 
  Copy, 
  Check, 
  Play, 
  X, 
  Facebook, 
  Twitter, 
  Phone, 
  Download, 
  UserCircle, 
  Heart, 
  Send, 
  Smile, 
  Flag, 
  AlertCircle, 
  AlertTriangle, 
  Loader2, 
  Mic, 
  PinOff,
  Cat,
  Coffee,
  Gamepad2,
  Plane,
  Lightbulb,
  Clock,
  Search
} from 'lucide-react';
import { Post, Comment, User } from '../types';
import { useLanguage } from '../context/LanguageContext';

interface PostCardProps {
  post: Post;
  currentUser: User;
  onTogglePin?: (postId: string) => void;
  onDelete?: (postId: string) => void;
  onToggleSave?: (post: Post) => void;
  onMediaClick?: (url: string, type: 'image' | 'video', postId: string) => void;
  onCopyLink?: (link: string) => void;
  onLike?: (postId: string, reactionType?: string) => void;
  onComment?: (postId: string, text: string) => void;
  onDeleteComment?: (postId: string, commentId: string) => void;
  onLikeComment?: (postId: string, commentId: string) => void;
  onSetProfilePicture?: (url: string) => void;
  onShowNotification?: (message: string, type?: 'success' | 'info' | 'error') => void;
  isSaved?: boolean;
}

type MenuView = 'main' | 'audience' | 'comments';
type AudienceType = 'public' | 'friends' | 'friends_of_friends' | 'only_me';
type CommentAudienceType = 'public' | 'friends' | 'mentions';

// Constant data for reactions (excluding labels which are now dynamic)
const REACTION_DATA = [
    { name: 'like', emoji: '👍', color: 'text-blue-600', animation: 'animate-bounce' },
    { name: 'love', emoji: '❤️', color: 'text-red-600', animation: 'animate-pulse' },
    { name: 'care', emoji: '🥰', color: 'text-yellow-500', animation: 'animate-bounce' },
    { name: 'haha', emoji: '😆', color: 'text-yellow-500', animation: 'animate-bounce' },
    { name: 'wow', emoji: '😮', color: 'text-yellow-500', animation: 'animate-pulse' },
    { name: 'sad', emoji: '😢', color: 'text-yellow-500', animation: 'animate-bounce' },
    { name: 'angry', emoji: '😡', color: 'text-orange-600', animation: 'animate-bounce' },
];

const EMOJI_CATEGORIES = {
  smileys: {
    icon: Smile,
    label: "smileys",
    emojis: ["😀","😃","😄","😁","😆","😅","🤣","😂","🙂","🙃","😉","😊","😇","🥰","🤩","😘","😗","😚","😙","😋","😛","😜","🤪","😝","🤑","🤗","🤭","🤫","🤔","🤐","🤨","😐","😑","😶","😏","😒","🙄","😬","🤥","😌","😔","😪","🤤","😴","😷","🤒","🤕","🤢","🤮","🤧","🥵","🥶","🥴","😵","🤯","🤠","🥳","😎","🤓","🧐","😕","😟","🙁","😮","😯","😲","😳","🥺","😦","😧","😨","😰","😥","😢","😭","😱","😖","😣","😞","😓","😩","😫","🥱","😤","😡","😠","🤬","😈","👿","💀","☠","💩","🤡","👹","👺","👻","👽","👾","🤖"]
  },
  animals: {
    icon: Cat,
    label: "animals",
    emojis: ["🐶","🐱","🐭","🐹","🐰","🦊","🐻","🐼","🐨","🐯","🦁","🐮","🐷","🐽","🐸","🐵","🙈","🙉","🙊","🐒","🐔","🐧","🐦","🐤","🐣","🐥","🦆","🦅","🦉","🦇","🐺","🐗","🐴","🦄","🐝","🐛","🦋","🐌","🐞","🐜","🦟","🦗","🕷","🕷","🕸","🦂","🐢","🐍","🦎","🦖","🦕","🐙","🦑","🦐","🦞","🦀","🐡","🐠","🐟","🐬","🐳","🐋","🦈","🐊","🐅","🐆","🦓","🦍","🦧","🐘","🦛","🦏","🐪","🐫","🦒","🦘","🐃","🐂","🐄","🐎","🐖","🐏","🐑","🦙","🐐","🦌","🐕","🐩","🦮","🐕‍🦺","🐈","🐈‍⬛","🐓","🦃","🦚","🦜","🦢","🦩","🕊","🐇","🦝","🦨","🦡","🦦","🦥","🐁","🐀","🐿","🦔","🐾","🐉","🐲"]
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
    emojis: ["⌚","📱","📲","💻","⌨","🖥","🖨","🖱","🖲","🕹","🗜","💽","💾","💿","📀","📼","📷","📸","📹","🎥","📽","🎞","📞","☎","📠","📺","📻","🎙","🎚","🎛","🧭","⏱","⏲","⏰","🕰","⌛","⏳","📡","🔋","🔌","💡","🔦","🕯","🪔","🧯","🛢","💸","💵","💴","💶","💷","🪙","💰","💳","💎","⚖","🧰","🔧","🔨","⚒","🛠","⛏","🪓","🧱","⚙","🪜","🩹","🩺","💈","🧲","🔫","💣","🧨","🔪","🗡","⚔","🛡","🚬","⚰","⚱","🏺","🔮","📿","🧿","💊","💉","🩸","🧬","🦠","🧫","🧪","🌡","🧹","🧺","🧻","🚽","🚰","🚿","🛁","🛀","🧼","🪥","🪒","🧽","🪣","🧴","🛎","🔑","🗝","🚪","🪑","🛋","🛏","🛌","🧸","🪆","🖼","🪞"]
  },
  flags: {
    icon: Flag,
    label: "flags",
    emojis: ["🏁","🚩","🎌","🏴","🏳","🏳️‍🌈","🏳️‍⚧️","🏴‍☠️","🇦🇨","🇦🇩","🇦🇪","🇦🇫","🇦🇬","🇦🇮","🇦🇱","🇦🇲","🇦🇴","🇦🇶","🇦🇷","🇦🇸","🇦🇹","🇦🇺","🇦🇼","🇦🇽","🇦🇿","🇧🇦","🇧🇧","🇧🇩","🇧🇪","🇧🇫","🇧🇬","🇧Ｈ","🇧🇮","🇧🇯","🇧🇱","🇧🇲","🇧🇳","🇧🇴","🇧🇶","🇧🇷","🇧🇸","🇧🇹","🇧🇻","🇧🇼","🇧🇾","🇧🇿","🇨🇦","🇨🇨","🇨🇩","🇨🇫","🇨🇬","🇨🇭","🇨🇮","🇨🇰","🇨🇱","🇨🇲","🇨🇳","🇨🇴","🇨🇵","🇨🇷","🇨🇺","🇨🇻","🇨🇼","🇨🇽","🇨🇾","🇨🇿","🇩🇪","🇩🇬","🇩🇯","🇩🇰","🇩🇲","🇩🇴","🇩🇿","🇪🇦","🇪🇨","🇪🇪","🇪🇬","🇪Ｈ","🇪🇷","🇪🇸","🇪🇹","🇪🇺","🇫🇮","🇫🇯","🇫🇰","🇫🇲","🇫🇴","🇫🇷","🇬🇦","🇬🇧","🇬🇩","🇬🇪","🇬🇫","🇬🇬","🇬Ｈ","🇬🇮","🇬🇱","🇬🇲","🇬🇳","🇬🇵","🇬🇶","🇬🇷","🇬🇸","🇬🇹","🇬🇺","🇬🇼","🇬🇾","🇭🇰","🇭🇲","🇭🇳","🇭🇷","🇭🇹","🇭🇺","🇮🇨","🇮🇩","🇮🇱","🇮🇲","🇮🇳","🇮🇴","🇮🇶","🇮🇷","🇮🇸","🇮🇹","🇯🇪","🇯🇲","🇯🇴","🇯🇵","🇰🇪","🇰🇬","🇰🇭","🇰🇮","🇰🇲","🇰🇳","🇰🇵","🇰🇷","🇰🇼","🇰🇾","🇰🇿","🇱🇦","🇱🇧","🇱🇨","🇱🇮","🇱🇰","🇱🇷","🇱🇸","🇱🇹","🇱🇺","🇱🇻","🇱🇾","🇲🇦","🇲🇨","🇲🇩","🇲🇪","🇲🇫","🇲🇬","🇲Ｈ","🇲🇰","🇲🇱","🇲🇲","🇲🇳","🇲🇴","🇲🇵","🇲🇶","🇲🇷","🇲🇸","🇲🇹","🇲🇺","🇲🇻","🇲🇼","🇲🇽","🇲🇾","🇲🇿","🇳🇦","🇳🇨","🇳🇪","🇳🇫","🇳🇬","🇳🇮","🇳🇱","🇳🇴","🇳🇵","🇳🇷","🇳🇺","🇳🇿","🇴🇲","🇵🇦","🇵🇪","🇵🇫","🇵🇬","🇵🇭","🇵🇰","🇵🇱","🇵🇲","🇵🇳","🇵🇷","🇵🇸","🇵🇹","🇵🇼","🇵🇾","🇶🇦","🇷🇪","🇷🇴","🇷🇸","🇷🇺","🇷🇼","🇸🇦","🇸🇧","🇸🇨","🇸🇩","🇸🇪","🇸🇬","🇸Ｈ","🇸🇮","🇸🇯","🇸🇰","🇸🇱","🇸🇲","🇸🇳","🇸🇴","🇸🇷","🇸🇸","🇸🇹","🇸🇻","🇸🇽","🇸🇾","🇸🇿","🇹🇦","🇹🇨","🇹🇩","🇹🇫","🇹🇬","🇹Ｈ","🇹🇯","🇹🇰","🇹🇱","🇹🇲","🇹🇳","🇹🇴","🇹🇷","🇹🇹","🇹🇻","🇹🇼","🇹🇿","🇺🇦","🇺🇬","🇺🇲","🇺🇳","🇺🇸","🇺🇾","🇺🇿","🇻🇦","🇻🇨","🇻🇪","🇻🇬","🇻🇮","🇻🇳","🇻🇺","🇼🇫","🇼🇸","🇽🇰","🇾🇪","🇾🇹","🇿🇦","🇿🇲","🇿🇼"] 
  }
};

const PostCard: React.FC<PostCardProps> = ({ 
  post, 
  currentUser, 
  onTogglePin, 
  onDelete, 
  onToggleSave, 
  onMediaClick, 
  onCopyLink, 
  onLike, 
  onComment, 
  onDeleteComment, 
  onLikeComment, 
  onSetProfilePicture, 
  onShowNotification,
  isSaved: initialIsSaved = false 
}) => {
  const { t, dir, language } = useLanguage();

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

  const [isLiked, setIsLiked] = useState(post.isLiked);
  const [likesCount, setLikesCount] = useState(post.likes);
  const [showComments, setShowComments] = useState(false);
  const [comments, setComments] = useState<Comment[]>(post.comments);
  const [newComment, setNewComment] = useState('');
  
  const [replyingToId, setReplyingToId] = useState<string | null>(null);
  const [replyText, setReplyText] = useState('');
  const [commentToDeleteId, setCommentToDeleteId] = useState<string | null>(null);
  
  const [showMenu, setShowMenu] = useState(false);
  const [menuView, setMenuView] = useState<MenuView>('main');
  const menuRef = useRef<HTMLDivElement>(null);
  const [notificationsOn, setNotificationsOn] = useState(true);
  
  const [audience, setAudience] = useState<AudienceType>('public');
  const [commentAudience, setCommentAudience] = useState<CommentAudienceType>('public');
  
  const [isSaved, setIsSaved] = useState(initialIsSaved);
  const [copyFeedback, setCopyFeedback] = useState(false);
  const [reportFeedback, setReportFeedback] = useState(false);
  const [showShareModal, setShowShareModal] = useState(false);

  // Report Modal State
  const [showReportModal, setShowReportModal] = useState(false);
  const [reportReason, setReportReason] = useState('');
  const [isReportSubmitting, setIsReportSubmitting] = useState(false);

  const commentInputRef = useRef<HTMLInputElement>(null);

  const [showReactions, setShowReactions] = useState(false);
  const [currentReaction, setCurrentReaction] = useState<{ name: string; label: string; emoji: string; color: string; animation?: string } | null>(post.isLiked ? (reactions.find(r => r.name === post.reaction) || reactions[0]) : null);
  const [animateLike, setAnimateLike] = useState(false);
  const reactionTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Emoji Picker State
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [activeEmojiTab, setActiveEmojiTab] = useState<'recent' | keyof typeof EMOJI_CATEGORIES>('recent');
  const [emojiSearch, setEmojiSearch] = useState('');
  const [recentEmojis, setRecentEmojis] = useState<string[]>([]);
  const emojiPickerRef = useRef<HTMLDivElement>(null);

  // Voice Comment State
  const [isRecording, setIsRecording] = useState(false);
  const [recordingDuration, setRecordingDuration] = useState(0);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const recordingIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const isOwner = post.author.id === currentUser.id;

  useEffect(() => {
    setIsLiked(post.isLiked);
    setLikesCount(post.likes);
    setComments(post.comments);
    if (post.isLiked) {
        setCurrentReaction(reactions.find(r => r.name === post.reaction) || reactions[0]);
    } else {
        setCurrentReaction(null);
    }
  }, [post.isLiked, post.likes, post.comments, post.reaction, reactions]);

  useEffect(() => {
    if (currentReaction) {
      const updated = reactions.find(r => r.name === currentReaction.name);
      if (updated) setCurrentReaction(updated);
    }
  }, [language, reactions]);

  useEffect(() => {
    setIsSaved(initialIsSaved);
  }, [initialIsSaved]);

  useEffect(() => {
      const savedRecents = localStorage.getItem('chat_recent_emojis');
      if (savedRecents) {
          setRecentEmojis(JSON.parse(savedRecents));
      }
  }, []);

  useEffect(() => {
    let interval: any;
    if (isRecording) {
      setRecordingDuration(0);
      interval = setInterval(() => {
        setRecordingDuration(prev => prev + 1);
      }, 1000);
      recordingIntervalRef.current = interval;
    } else {
      if (recordingIntervalRef.current) clearInterval(recordingIntervalRef.current);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isRecording]);

  const handleSocialShare = (platform: string) => {
    const url = encodeURIComponent(`${window.location.origin}/post/${post.id}`);
    const text = encodeURIComponent(post.content || t.post_share_text || (language === 'ar' ? 'شاهد هذا المنشور على Tourloop' : 'Check out this post on Tourloop'));
    let shareUrl = '';
    if (platform === 'facebook') shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${url}`;
    if (platform === 'twitter') shareUrl = `https://twitter.com/intent/tweet?url=${url}&text=${text}`;
    if (platform === 'whatsapp') shareUrl = `https://api.whatsapp.com/send?text=${text}%20${url}`;
    if (shareUrl) window.open(shareUrl, '_blank', 'width=600,height=400');
    setShowShareModal(false);
  };

  const handleLike = () => {
    setAnimateLike(true);
    setTimeout(() => setAnimateLike(false), 300);
    const newIsLiked = !isLiked;
    if (onLike) {
        const reactionToSend = newIsLiked ? 'like' : (currentReaction?.name || 'like');
        onLike(post.id, reactionToSend);
    }
  };

  const handleReactionSelect = (reaction: typeof reactions[0]) => {
    setCurrentReaction(reaction);
    setIsLiked(true);
    setShowReactions(false);
    setAnimateLike(true);
    setTimeout(() => setAnimateLike(false), 300);
    if (onLike) onLike(post.id, reaction.name);
  };

  const handleCommentSubmit = (e: React.FormEvent) => {
    e?.preventDefault();
    if (!newComment.trim() && !isRecording) return;

    if (onComment) {
        onComment(post.id, newComment.trim());
    } else {
        const commentId = crypto.randomUUID ? crypto.randomUUID() : Math.random().toString(36).substring(2, 9);
        const commentObj: Comment = {
          id: commentId,
          author: currentUser,
          content: newComment.trim(),
          timestamp: t.date_now || (language === 'ar' ? 'الآن' : 'Just now'),
          likes: 0,
          isLiked: false
        };
        setComments(prev => [...prev, commentObj]);
    }
    setNewComment('');
    setShowEmojiPicker(false);
  };

  const startRecording = async () => {
    if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
      alert(t.errors_unsupported_file || (language === 'ar' ? 'ميزة التسجيل الصوتي غير مدعومة في هذا المتصفح.' : 'Voice recording is not supported.'));
      return;
    }

    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      audioChunksRef.current = [];
      
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };

      mediaRecorder.onstop = () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/webm' });
        const audioUrl = URL.createObjectURL(audioBlob);
        
        const commentId = crypto.randomUUID ? crypto.randomUUID() : Math.random().toString(36).substring(2, 9);
        const commentObj: any = {
          id: commentId,
          author: currentUser,
          content: '',
          mediaUrl: audioUrl,
          type: 'audio',
          timestamp: t.date_now || (language === 'ar' ? 'الآن' : 'Just now'),
          likes: 0,
          isLiked: false
        };
        
        setComments(prev => [...prev, commentObj]);
        if (onComment) onComment(post.id, '[Voice Message]');
        
        stream.getTracks().forEach(track => track.stop());
      };

      mediaRecorder.start();
      setIsRecording(true);

    } catch (err: any) {
      console.error('Error recording audio:', err);
      let errorMessage = t.errors_generic || (language === 'ar' ? 'حدث خطأ.' : 'Error.');
      
      if (err.name === 'NotFoundError' || err.name === 'DevicesNotFoundError') {
        errorMessage = language === 'ar' ? 'لم يتم العثور على ميكروفون.' : 'No microphone found.';
      } else if (err.name === 'NotAllowedError' || err.name === 'PermissionDeniedError') {
        errorMessage = language === 'ar' ? 'يرجى السماح بالوصول إلى الميكروفون.' : 'Please allow microphone access.';
      }
      
      alert(errorMessage);
      setIsRecording(false);
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
    }
  };

  const cancelRecording = () => {
      if (mediaRecorderRef.current && isRecording) {
          mediaRecorderRef.current.onstop = null;
          mediaRecorderRef.current.stream.getTracks().forEach(track => track.stop());
          mediaRecorderRef.current = null;
          setIsRecording(false);
      }
  };

  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  const handleInlineReplySubmit = (e: React.FormEvent) => {
      e.preventDefault();
      if (!replyText.trim()) return;
      if (onComment) {
          onComment(post.id, replyText);
      } else {
          const commentId = crypto.randomUUID ? crypto.randomUUID() : Math.random().toString(36).substring(2, 9);
          const commentObj: Comment = {
            id: commentId,
            author: currentUser,
            content: replyText,
            timestamp: t.date_now || (language === 'ar' ? 'الآن' : 'Just now'),
            likes: 0,
            isLiked: false
          };
          setComments(prev => [...prev, commentObj]);
      }
      setReplyingToId(null);
      setReplyText('');
  };

  const handleDeleteComment = (commentId: string) => {
      if (onDeleteComment) {
          onDeleteComment(post.id, commentId);
      } else {
          setComments(prev => prev.filter(c => c.id !== commentId));
      }
      // No global notification here to prevent duplication if parent handles it
      setCommentToDeleteId(null);
  };
  
  const handleLikeComment = (commentId: string) => {
      if (onLikeComment) {
          onLikeComment(post.id, commentId);
      } else {
          setComments(prev => prev.map(c => c.id === commentId ? { ...c, isLiked: !c.isLiked, likes: c.isLiked ? c.likes - 1 : c.likes + 1 } : c));
      }
  };

  const handleReport = () => {
    setShowReportModal(true);
    setShowMenu(false);
  };

  const handleSubmitReport = () => {
    if (!reportReason) return;
    setIsReportSubmitting(true);
    setTimeout(() => {
        setIsReportSubmitting(false);
        setShowReportModal(false);
        setReportReason('');
        setReportFeedback(true);
        // Keep this notification as it's purely local logic unless connected to backend
        if (onShowNotification) {
            onShowNotification(language === 'ar' ? 'تم إرسال البلاغ بنجاح' : 'Report sent successfully', 'success');
        }
        setTimeout(() => setReportFeedback(false), 3000);
    }, 1500);
  };

  const isVideo = (url: string) => {
      return url.startsWith('data:video/') || url.includes('.mp4') || url.includes('.webm') || url.includes('.ogg');
  };

  const handleMediaClick = () => {
      if (post.image && onMediaClick) {
          const type = isVideo(post.image) ? 'video' : 'image';
          onMediaClick(post.image, type, post.id);
      }
  };

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

  const handleEmojiClick = (emoji: string) => {
      setNewComment(prev => prev + emoji);
      
      // Add to recents
      const newRecents = [...new Set([emoji, ...recentEmojis])].slice(0, 24);
      setRecentEmojis(newRecents);
      localStorage.setItem('chat_recent_emojis', JSON.stringify(newRecents));

      if(commentInputRef.current) {
          commentInputRef.current.focus();
      }
      setShowEmojiPicker(false);
  };

  const getAudienceIcon = (type: AudienceType, small: boolean = true) => {
      const className = small ? "w-3 h-3" : "w-5 h-5";
      switch(type) {
          case 'public': return <Globe className={className} />;
          case 'friends': return <Users className={className} />;
          case 'friends_of_friends': return <UserPlus className={className} />;
          case 'only_me': return <Lock className={className} />;
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

  const getCommentAudienceIcon = (type: CommentAudienceType) => {
    switch(type) {
        case 'public': return <Globe className="w-5 h-5" />;
        case 'friends': return <Users className="w-5 h-5" />;
        case 'mentions': return <AtSign className="w-5 h-5" />;
    }
  };

  const handlePinAction = (e: React.MouseEvent) => {
      e.stopPropagation();
      if (onTogglePin) onTogglePin(post.id);
      // Notification handled by parent/hook to prevent duplication
      setShowMenu(false);
  };

  const handleToggleNotifications = (e: React.MouseEvent) => {
      e.stopPropagation();
      setNotificationsOn(!notificationsOn);
      // Keep local notification here as it doesn't seem to trigger a global parent event
      if (onShowNotification) {
          const msg = !notificationsOn 
              ? (language === 'ar' ? 'تم تفعيل الإشعارات' : 'Notifications Turned On') 
              : (language === 'ar' ? 'تم إيقاف الإشعارات' : 'Notifications Turned Off');
          onShowNotification(msg, 'info');
      }
      setShowMenu(false);
  };

  const handleSavePost = (e: React.MouseEvent) => {
      e.stopPropagation();
      if (onToggleSave) onToggleSave(post);
      setIsSaved(!isSaved); 
      // Notification handled by parent (useMedia/usePosts) to prevent duplication
      setShowMenu(false);
  };

  const onShareClick = (e: React.MouseEvent) => {
      e.stopPropagation();
      setShowShareModal(true);
      setShowMenu(false);
  };

  const handleCopyLink = () => {
      const link = `${window.location.origin}/post/${post.id}`;
      navigator.clipboard.writeText(link).then(() => {
          setCopyFeedback(true);
          setTimeout(() => setCopyFeedback(false), 2000);
          setShowShareModal(false);
          // Notification removed here. We rely on the local 'Copied' overlay.
      });
  };

  const handleDownload = () => {
      if (post.image) {
          const link = document.createElement('a');
          link.href = post.image;
          link.download = `download_${post.id}`;
          document.body.appendChild(link);
          link.click();
          document.body.removeChild(link);
          // Keep this notification as it's the only feedback for download start
          if (onShowNotification) {
              onShowNotification(language === 'ar' ? 'جاري تنزيل الملف...' : 'Downloading file...', 'success');
          }
      }
      setShowMenu(false);
  };

  const handleSetProfilePic = () => {
      if (onSetProfilePicture && post.image) {
          onSetProfilePicture(post.image);
          setShowMenu(false);
          // Notification handled by parent (ProfileHeader/useMedia)
      }
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm mb-4 relative transition-colors duration-300 border border-gray-100 dark:border-gray-700 w-full">
      {copyFeedback && (
          <div className="absolute top-14 left-1/2 transform -translate-x-1/2 z-30 bg-emerald-700 text-white px-4 py-2 rounded-md shadow-lg text-sm flex items-center gap-2 animate-fadeIn">
              <Check className="w-4 h-4" />
              {t.common_copied || (language === 'ar' ? 'تم النسخ' : 'Copied')}
          </div>
      )}

      {reportFeedback && (
          <div className="absolute top-14 left-1/2 transform -translate-x-1/2 z-30 bg-emerald-700 text-white px-4 py-2 rounded-md shadow-lg text-sm flex items-center gap-2 animate-fadeIn">
              <Check className="w-4 h-4" />
              {t.common_success || (language === 'ar' ? 'نجاح' : 'Success')}
          </div>
      )}

      {post.isPinned && (
          <div className="px-4 pt-3 text-xs font-semibold text-gray-500 dark:text-gray-400 flex items-center gap-1">
              <Pin className="w-3 h-3 fill-current text-emerald-600 dark:text-emerald-500" />
              <span>{language === 'ar' ? 'منشور مثبت' : 'Pinned Post'}</span>
          </div>
      )}

      <div className={`p-3 md:p-4 flex items-center justify-between ${post.isPinned ? 'pt-2' : ''}`}>
        <div className="flex items-center gap-3">
          <div className="relative">
             <img src={post.author.avatar} alt={post.author.name} className="h-10 w-10 rounded-full border border-gray-200 cursor-pointer object-cover" />
             {post.author.online && <div className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-emerald-500 border-2 border-white rounded-full"></div>}
          </div>
          <div className="flex flex-col">
            <h4 className="font-semibold text-[15px] hover:underline cursor-pointer text-gray-900 dark:text-white">{post.author.name}</h4>
            <div className="flex items-center gap-1 text-xs text-gray-500 dark:text-gray-400">
              <span>{post.timestamp}</span>
              <span>·</span>
              {getAudienceIcon(audience, true)}
            </div>
          </div>
        </div>
        
        <div className="relative" ref={menuRef}>
            <div 
                onClick={() => { setShowMenu(!showMenu); setMenuView('main'); }}
                className="p-2 hover:bg-emerald-50 dark:hover:bg-gray-700 rounded-full cursor-pointer transition text-gray-600 dark:text-gray-300"
            >
                <MoreHorizontal className="h-5 w-5" />
            </div>

            {showMenu && (
                <div className={`absolute top-full mt-1 w-72 md:w-80 bg-white dark:bg-gray-800 rounded-lg shadow-xl border border-gray-100 dark:border-gray-700 z-20 overflow-hidden animate-fadeIn ${dir === 'rtl' ? 'left-0 origin-top-left' : 'right-0 origin-top-right'}`}>
                    {menuView === 'main' && (
                        <>
                            {(isOwner || !!onTogglePin) && (
                                <button onClick={handlePinAction} className="w-full text-start px-4 py-3 hover:bg-emerald-50 dark:hover:bg-gray-700 flex items-center gap-3 text-sm text-gray-700 dark:text-gray-200 transition font-medium">
                                    {post.isPinned ? <PinOff className="w-5 h-5 text-emerald-700" /> : <Pin className="w-5 h-5" />}
                                    {post.isPinned 
                                      ? (language === 'ar' ? 'إلغاء تثبيت المنشور' : 'Unpin Post') 
                                      : (language === 'ar' ? 'تثبيت المنشور' : 'Pin Post')
                                    }
                                </button>
                            )}
                            
                            <button onClick={handleSavePost} className="w-full text-start px-4 py-3 hover:bg-emerald-50 dark:hover:bg-gray-700 flex items-center gap-3 text-sm text-gray-700 dark:text-gray-200 transition font-medium">
                                {isSaved ? <BookmarkMinus className="w-5 h-5 text-fb-blue" /> : <Bookmark className="w-5 h-5" />}
                                {isSaved 
                                  ? (language === 'ar' ? 'إلغاء الحفظ' : 'Unsave Post')
                                  : (language === 'ar' ? 'حفظ المنشور' : 'Save Post')
                                }
                            </button>

                            <div className="border-t border-gray-100 dark:border-gray-700 my-1"></div>
                            
                            <button onClick={() => setMenuView('audience')} className="w-full text-start px-4 py-3 hover:bg-emerald-50 dark:hover:bg-gray-700 flex items-center justify-between text-sm text-gray-700 dark:text-gray-200 transition group font-medium">
                                <div className="flex items-center gap-3">
                                    {getAudienceIcon(audience)}
                                    <span>{t.post_audience || (language === 'ar' ? 'تعديل الجمهور' : 'Edit Audience')}</span>
                                </div>
                                {dir === 'rtl' ? <ChevronLeft className="w-4 h-4 text-gray-400 group-hover:text-gray-600" /> : <ChevronLeft className="w-4 h-4 text-gray-400 group-hover:text-gray-600 rotate-180" />}
                            </button>

                            <button onClick={() => setMenuView('comments')} className="w-full text-start px-4 py-3 hover:bg-emerald-50 dark:hover:bg-gray-700 flex items-center justify-between text-sm text-gray-700 dark:text-gray-200 transition group font-medium">
                                <div className="flex items-center gap-3">
                                    {getCommentAudienceIcon(commentAudience)}
                                    <span>{t.post_who_can_comment || (language === 'ar' ? 'من الذي يمكنه التعليق؟' : 'Who can comment?')}</span>
                                </div>
                                {dir === 'rtl' ? <ChevronLeft className="w-4 h-4 text-gray-400 group-hover:text-gray-600" /> : <ChevronLeft className="w-4 h-4 text-gray-400 group-hover:text-gray-600 rotate-180" />}
                            </button>
                            
                            <button onClick={handleToggleNotifications} className="w-full text-start px-4 py-3 hover:bg-emerald-50 dark:hover:bg-gray-700 flex items-center gap-3 text-sm text-gray-700 dark:text-gray-200 transition font-medium">
                                {notificationsOn ? <BellOff className="w-5 h-5" /> : <Bell className="w-5 h-5" />}
                                {notificationsOn 
                                  ? (language === 'ar' ? 'إيقاف الإشعارات' : 'Turn off notifications') 
                                  : (language === 'ar' ? 'تشغيل الإشعارات' : 'Turn on notifications')
                                }
                            </button>

                            <div className="border-t border-gray-100 dark:border-gray-700 my-1"></div>

                            <button onClick={onShareClick} className="w-full text-start px-4 py-3 hover:bg-emerald-50 dark:hover:bg-gray-700 flex items-center gap-3 text-sm text-gray-700 dark:text-gray-200 transition font-medium">
                                <Share2 className="w-5 h-5" /> {t.common_share || (language === 'ar' ? 'مشاركة' : 'Share')}
                            </button>

                            <button onClick={handleCopyLink} className="w-full text-start px-4 py-3 hover:bg-emerald-50 dark:hover:bg-gray-700 flex items-center gap-3 text-sm text-gray-700 dark:text-gray-200 transition font-medium">
                                <LinkIcon className="w-5 h-5" /> {t.post_copy_link || (language === 'ar' ? 'نسخ الرابط' : 'Copy link')}
                            </button>
                            
                            {post.image && (
                                <button onClick={handleDownload} className="w-full text-start px-4 py-3 hover:bg-emerald-50 dark:hover:bg-gray-700 flex items-center gap-3 text-sm text-gray-700 dark:text-gray-200 transition font-medium">
                                    <Download className="w-5 h-5" /> {t.common_download || (language === 'ar' ? 'تنزيل' : 'Download')}
                                </button>
                            )}

                            {(isOwner || !!onDelete) && (
                                <>
                                    <div className="border-t border-gray-100 dark:border-gray-700 my-1"></div>
                                    
                                    {isOwner && post.image && !post.image.startsWith('data:video') && !post.image.endsWith('.mp4') && onSetProfilePicture && (
                                        <button onClick={handleSetProfilePic} className="w-full text-start px-4 py-3 hover:bg-emerald-50 dark:hover:bg-gray-700 flex items-center gap-3 text-sm text-gray-700 dark:text-gray-200 transition font-medium">
                                            <UserCircle className="w-5 h-5" /> {language === 'ar' ? 'تعيين كصورة ملف شخصي' : 'Set as Profile Picture'}
                                        </button>
                                    )}

                                    <button 
                                        onClick={(e) => { 
                                            e.stopPropagation(); 
                                            setShowMenu(false); 
                                            if (onDelete) onDelete(post.id); 
                                            // Notification handled by parent
                                        }} 
                                        className="w-full text-start px-4 py-3 hover:bg-red-50 dark:hover:bg-red-900/10 flex items-center gap-3 text-sm text-red-600 font-bold transition"
                                    >
                                        <Trash2 className="w-5 h-5" /> {t.post_delete || (language === 'ar' ? 'حذف المنشور' : 'Delete Post')}
                                    </button>
                                </>
                            )}
                            
                            {!isOwner && (
                                <button onClick={handleReport} className="w-full text-start px-4 py-3 hover:bg-emerald-50 dark:hover:bg-gray-700 flex items-center gap-3 text-sm text-gray-700 dark:text-gray-200 transition font-medium">
                                    <Flag className="w-5 h-5" /> {t.post_report || (language === 'ar' ? 'إبلاغ عن المنشور' : 'Report Post')}
                                </button>
                            )}
                        </>
                    )}

                    {menuView === 'audience' && (
                        <div className="animate-slideLeft">
                            <div className="flex items-center gap-2 px-2 py-3 border-b border-gray-100 dark:border-gray-700">
                                <button onClick={() => setMenuView('main')} className="p-1 hover:bg-gray-200 dark:hover:bg-gray-600 rounded-full transition"><ArrowRight className={`w-5 h-5 text-gray-600 dark:text-gray-300 ${dir === 'ltr' ? 'rotate-180' : ''}`} /></button>
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
                                            <div className="flex flex-col items-start">
                                                <span className="font-bold">{getAudienceLabel(type)}</span>
                                                <span className="text-xs text-gray-500 dark:text-gray-400">{getAudienceDescription(type)}</span>
                                            </div>
                                        </div>
                                        {audience === type && <div className="w-2.5 h-2.5 bg-fb-blue rounded-full"></div>}
                                    </button>
                                ))}
                            </div>
                        </div>
                    )}

                    {menuView === 'comments' && (
                        <div className="animate-slideLeft">
                                <div className="flex items-center gap-2 px-2 py-3 border-b border-gray-100 dark:border-gray-700">
                                <button onClick={() => setMenuView('main')} className="p-1 hover:bg-gray-200 dark:hover:bg-gray-600 rounded-full transition"><ArrowRight className={`w-5 h-5 text-gray-600 dark:text-gray-300 ${dir === 'ltr' ? 'rotate-180' : ''}`} /></button>
                                <span className="font-bold text-sm text-gray-800 dark:text-white">{t.post_who_can_comment || (language === 'ar' ? 'من الذي يمكنه التعليق؟' : 'Who can comment?')}</span>
                            </div>
                            <div className="py-2">
                                <div className="px-4 text-xs text-gray-500 dark:text-gray-400 mb-2 font-bold uppercase text-start">{t.common_filter || (language === 'ar' ? 'تصفية' : 'Filter')}</div>
                                <button onClick={() => { setCommentAudience('public'); setShowMenu(false); }} className="w-full text-start px-4 py-3 hover:bg-gray-100 dark:hover:bg-gray-700 flex items-center justify-between text-sm text-gray-700 dark:text-gray-200 transition">
                                        <div className="flex items-center gap-3">
                                            <div className="bg-gray-100 dark:bg-gray-600 p-2 rounded-full"><Globe className="w-4 h-4" /></div>
                                            <span className="font-bold">{t.privacy_public || (language === 'ar' ? 'العامة' : 'Public')}</span>
                                        </div>
                                        {commentAudience === 'public' && <div className="w-2.5 h-2.5 bg-fb-blue rounded-full"></div>}
                                </button>
                                <button onClick={() => { setCommentAudience('friends'); setShowMenu(false); }} className="w-full text-start px-4 py-3 hover:bg-gray-100 dark:hover:bg-gray-700 flex items-center justify-between text-sm text-gray-700 dark:text-gray-200 transition">
                                        <div className="flex items-center gap-3">
                                            <div className="bg-gray-100 dark:bg-gray-600 p-2 rounded-full"><Users className="w-4 h-4" /></div>
                                            <span className="font-bold">{t.privacy_friends || (language === 'ar' ? 'الأصدقاء' : 'Friends')}</span>
                                        </div>
                                        {commentAudience === 'friends' && <div className="w-2.5 h-2.5 bg-fb-blue rounded-full"></div>}
                                </button>
                                <button onClick={() => { setCommentAudience('mentions'); setShowMenu(false); }} className="w-full text-start px-4 py-3 hover:bg-gray-100 dark:hover:bg-gray-700 flex items-center justify-between text-sm text-gray-700 dark:text-gray-200 transition">
                                        <div className="flex items-center gap-3">
                                            <div className="bg-gray-100 dark:bg-gray-600 p-2 rounded-full"><AtSign className="w-4 h-4" /></div>
                                            <div className="flex flex-col items-start">
                                                <span className="font-bold">{language === 'ar' ? 'الإشارات فقط' : 'Mentions Only'}</span>
                                            </div>
                                        </div>
                                        {commentAudience === 'mentions' && <div className="w-2.5 h-2.5 bg-fb-blue rounded-full"></div>}
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            )}
        </div>
      </div>

      <div className="px-4 py-2">
        <p className="text-[15px] text-gray-900 dark:text-gray-200 whitespace-pre-line leading-relaxed text-start">{post.content}</p>
      </div>

      {post.image && (
        <div 
            className="mt-2 w-full bg-gray-100 dark:bg-gray-900 flex justify-center cursor-pointer overflow-hidden border-t border-b border-gray-100 dark:border-gray-700"
            onClick={handleMediaClick}
        >
          {post.image.startsWith('data:video') || post.image.includes('.mp4') || post.image.includes('.webm') || post.image.includes('.ogg') ? (
              <div className="relative w-full group">
                  <video 
                    src={post.image} 
                    className="w-full h-auto max-h-[600px] object-contain"
                    preload="metadata" 
                  />
                  <div className="absolute inset-0 flex items-center justify-center">
                      <div className="bg-black/30 p-4 rounded-full backdrop-blur-sm hover:bg-black/50 transition">
                          <Play className="w-8 h-8 text-white fill-current" />
                      </div>
                  </div>
              </div>
          ) : (
              <img 
                src={post.image} 
                alt="Post content" 
                className="w-full h-auto max-h-[600px] object-cover hover:brightness-95 transition" 
              />
          )}
        </div>
      )}

      <div className="px-4 py-3 flex items-center justify-between border-b border-gray-100 dark:border-gray-700 mx-2">
        <div className="flex items-center gap-1.5 cursor-pointer hover:underline">
          <div className="bg-emerald-700 rounded-full p-1 flex items-center justify-center h-4 w-4">
            <ThumbsUp className="h-2.5 w-2.5 text-white fill-white" />
          </div>
          <span className="text-[13px] text-gray-500 dark:text-gray-400">{likesCount > 0 ? likesCount : ''}</span>
        </div>
        <div className="flex gap-4 text-[13px] text-gray-500 dark:text-gray-400">
          <span className="cursor-pointer hover:underline" onClick={() => setShowComments(!showComments)}>{comments.length} {t.post_comments_count || (language === 'ar' ? 'تعليق' : 'Comments')}</span>
          <span className="cursor-pointer hover:underline">{post.shares} {t.post_shares_count || (language === 'ar' ? 'مشاركة' : 'Shares')}</span>
        </div>
      </div>

      <div className="px-2 py-1 relative">
        {/* Enhanced Mobile-Responsive Reactions Bar */}
        {showReactions && (
            <div 
                className={`absolute bottom-full mb-2 bg-white dark:bg-gray-700 shadow-2xl rounded-full p-2 flex gap-2 animate-bounce-in z-50 border border-gray-200 dark:border-gray-600 left-0 right-0 mx-auto w-fit max-w-[90vw] overflow-x-auto no-scrollbar`}
                onMouseLeave={() => setShowReactions(false)}
            >
                {reactions.map(r => (
                    <button 
                        key={r.name}
                        onClick={() => handleReactionSelect(r)}
                        className="hover:scale-150 transition-transform duration-200 p-1.5 rounded-full hover:bg-gray-100 dark:hover:bg-gray-600 relative group flex-shrink-0"
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

        <div className="flex items-center justify-between font-medium text-gray-500 dark:text-gray-400">
          <button 
            onClick={handleLike}
            onMouseEnter={() => { reactionTimerRef.current = setTimeout(() => setShowReactions(true), 500); }}
            onMouseLeave={() => { if (reactionTimerRef.current) clearTimeout(reactionTimerRef.current); }}
            className={`flex-1 flex items-center justify-center gap-2 py-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-all ${animateLike ? 'animate-pop' : ''} ${currentReaction ? currentReaction.color : 'text-gray-600 dark:text-gray-300'}`}
          >
             {currentReaction ? <span className="text-xl animate-bounce-in">{currentReaction.emoji}</span> : <ThumbsUp className={`w-5 h-5 ${isLiked ? 'text-emerald-700 fill-current' : ''}`} />}
             <span className={`text-[15px] font-extrabold ${isLiked && !currentReaction ? 'text-emerald-700' : ''}`}>{currentReaction ? currentReaction.label : (t.btn_like || (language === 'ar' ? 'أعجبني' : 'Like'))}</span>
          </button>
          <button 
            onClick={() => { setShowComments(prev => !prev); if(!showComments) setTimeout(() => commentInputRef.current?.focus(), 100); }}
            className="flex-1 flex items-center justify-center gap-2 py-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition font-extrabold text-gray-600 dark:text-gray-300 text-[14px]"
          >
            <MessageCircle className="h-5 w-5" />
            <span className="text-[15px]">{t.btn_comment || (language === 'ar' ? 'تعليق' : 'Comment')}</span>
          </button>
          <button 
            onClick={onShareClick}
            className="flex-1 flex items-center justify-center gap-2 py-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition font-extrabold text-gray-600 dark:text-gray-300 text-[14px]"
          >
            <Share2 className="w-5 h-5" />
            <span className="text-[15px]">{t.btn_share || (language === 'ar' ? 'مشاركة' : 'Share')}</span>
          </button>
        </div>
      </div>

      {showComments && (
        <div className="px-4 py-3 border-t border-gray-100 dark:border-gray-700 bg-gray-50 dark:bg-gray-900/30">
          <div className="space-y-4 mb-4 max-h-60 overflow-y-auto pr-1 no-scrollbar">
            {comments.map((comment) => (
              <div key={comment.id} className="flex gap-2 group flex-col animate-fadeIn">
                 <div className="flex gap-2 items-start">
                    <img src={comment.author.avatar} alt={comment.author.name} className="h-9 w-9 rounded-full border border-white dark:border-gray-700 shadow-sm object-cover" />
                    <div className="flex flex-col flex-1">
                        <div className="bg-white dark:bg-gray-800 px-3 py-2 rounded-2xl rounded-tr-none relative group/comment w-fit shadow-sm border border-gray-100 dark:border-gray-700">
                            <span className="font-extrabold block text-gray-900 dark:text-white mb-0.5 text-xs hover:underline cursor-pointer text-start">{comment.author.name}</span>
                            {(comment as any).type === 'audio' && (comment as any).mediaUrl ? (
                                <div className="flex items-center gap-2 min-w-[180px] my-1">
                                   <audio controls src={(comment as any).mediaUrl} className="h-8 w-48" />
                                </div>
                            ) : (
                                <span className="text-[14px] text-gray-800 dark:text-gray-200 leading-relaxed text-start block">{comment.content}</span>
                            )}
                        </div>
                        <div className="flex gap-4 text-[11px] text-gray-500 dark:text-gray-400 px-2 mt-1 items-center font-bold">
                            <span 
                                className={`cursor-pointer hover:underline transition ${comment.isLiked ? 'text-fb-blue' : ''}`}
                                onClick={() => onLikeComment && onLikeComment(post.id, comment.id)}
                            >
                                {comment.isLiked ? (t.post_like || (language === 'ar' ? 'أعجبني' : 'Like')) : (t.post_like || (language === 'ar' ? 'أعجبني' : 'Like'))}
                            </span>
                            <span 
                                className="font-extrabold cursor-pointer hover:underline transition"
                                onClick={() => {
                                    if (replyingToId === comment.id) {
                                        setReplyingToId(null);
                                    } else {
                                        setReplyingToId(comment.id);
                                        setReplyText(`@${comment.author.name} `);
                                    }
                                }}
                            >
                                {t.post_reply || (language === 'ar' ? 'رد' : 'Reply')}
                            </span>
                            <span className="font-normal opacity-60">{comment.timestamp}</span>
                            {(comment.author.id === currentUser.id || isOwner) && (
                                <span 
                                    className="font-extrabold cursor-pointer hover:underline text-red-500 transition"
                                    onClick={() => setCommentToDeleteId(comment.id)}
                                >
                                    {t.common_delete || (language === 'ar' ? 'حذف' : 'Delete')}
                                </span>
                            )}
                        </div>
                    </div>
                 </div>
                 
                 {replyingToId === comment.id && (
                    <div className="mr-12 flex gap-2 animate-fadeIn mt-1">
                        <img src={currentUser.avatar} className="w-7 h-7 rounded-full shadow-sm object-cover border border-gray-100" alt="me" />
                        <form className="flex-1" onSubmit={handleInlineReplySubmit}>
                            <input 
                                type="text" 
                                className="w-full bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-full px-3 py-1.5 text-[11px] focus:ring-2 focus:ring-fb-blue/20 transition dark:text-white outline-none shadow-sm" 
                                placeholder={`${t.post_reply || (language === 'ar' ? 'رد على' : 'Reply to')} ${comment.author.name}...`}
                                value={replyText}
                                onChange={(e) => setReplyText(e.target.value)}
                                autoFocus
                            />
                        </form>
                    </div>
                 )}
              </div>
            ))}
          </div>

          <div className="flex gap-2 items-start">
             <img src={currentUser.avatar} alt="Me" className="h-10 w-10 rounded-full border border-gray-200 dark:border-gray-700 shadow-sm object-cover" />
             <div className="flex-1 relative group">
                {isRecording ? (
                    <div className="flex-1 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-2xl flex items-center px-4 py-2.5 animate-pulse justify-between">
                       <div className="flex items-center gap-2">
                          <div className="w-2.5 h-2.5 bg-red-600 rounded-full animate-ping"></div>
                          <span className="text-sm font-bold text-red-600 font-mono">{formatDuration(recordingDuration)}</span>
                       </div>
                       <div className="flex items-center gap-3">
                          <button onClick={cancelRecording} className="text-xs font-bold text-gray-500 hover:text-gray-700 dark:text-gray-400">{t.common_cancel || (language === 'ar' ? 'إلغاء' : 'Cancel')}</button>
                          <button 
                             onClick={stopRecording} 
                             className="text-fb-blue hover:scale-110 transition-all transform active:scale-95 p-1"
                          >
                             <Send className={`w-6 h-6 ${dir === 'rtl' ? 'rotate-180' : ''}`} />
                          </button>
                       </div>
                    </div>
                ) : (
                    <form onSubmit={handleCommentSubmit} className="flex-1 bg-gray-100 dark:bg-gray-700 border border-transparent rounded-2xl flex items-center px-4 py-2.5 focus-within:ring-2 focus-within:ring-fb-blue/10 dark:focus-within:ring-fb-blue/20 transition-all shadow-inner relative">
                        <input
                            ref={commentInputRef}
                            type="text"
                            placeholder={t.write_comment || (language === 'ar' ? 'اكتب تعليقاً...' : 'Write a comment...')}
                            className={`bg-transparent w-full outline-none text-[14px] placeholder-gray-500 dark:placeholder-gray-400 text-gray-900 dark:text-white ${dir === 'rtl' ? 'pl-2' : 'pr-2'}`}
                            value={newComment}
                            onChange={(e) => setNewComment(e.target.value)}
                        />
                        
                        <div className="relative flex items-center gap-2">
                            <Mic 
                                className="w-5 h-5 text-gray-400 cursor-pointer hover:text-red-500 transition-colors"
                                onClick={startRecording}
                            />
                            <Smile 
                                className="w-5 h-5 text-gray-400 cursor-pointer hover:text-yellow-500 transition-colors" 
                                onClick={(e) => {
                                    e.stopPropagation();
                                    setShowEmojiPicker(!showEmojiPicker);
                                }}
                            />
                            
                            {/* Emoji Picker Popup */}
                            {showEmojiPicker && (
                                <div 
                                    ref={emojiPickerRef}
                                    className={`absolute bottom-10 ${dir === 'rtl' ? 'left-0 origin-bottom-left' : 'right-0 origin-bottom-right'} bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 shadow-2xl rounded-2xl w-80 z-[100] animate-scaleIn flex flex-col overflow-hidden`}
                                    onClick={(e) => e.stopPropagation()}
                                >
                                     {/* Header */}
                                     <div className="flex items-center p-2 border-b dark:border-gray-700 bg-gray-50 dark:bg-gray-900 gap-2 flex-shrink-0">
                                        <div className={`relative w-full`}>
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

                                    {/* Content */}
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
                            )}
                        </div>

                        <button 
                            type="submit" 
                            disabled={!newComment.trim()} 
                            className={`text-fb-blue hover:scale-110 disabled:opacity-30 transition-all transform active:scale-95 p-1 ${dir === 'rtl' ? 'mr-2' : 'ml-2'}`}
                        >
                            <Send className={`w-6 h-6 ${dir === 'rtl' ? 'rotate-180' : ''}`} />
                        </button>
                    </form>
                )}
             </div>
          </div>
        </div>
      )}

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
                          <button onClick={handleCopyLink} className="flex flex-col items-center gap-2 group"><div className="w-14 h-14 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-200 rounded-full flex items-center justify-center shadow-md transition transform group-hover:scale-110 active:scale-95 border border-white dark:border-gray-600">{copyFeedback ? <Check className="w-7 h-7 text-green-600" /> : <Copy className="w-7 h-7" />}</div><span className="text-[10px] font-bold text-gray-600 dark:text-gray-400 uppercase tracking-widest">{t.common_copy || (language === 'ar' ? 'نسخ' : 'Copy')}</span></button>
                      </div>
                      <div className="space-y-3">
                          <label className="text-[10px] font-extrabold text-gray-400 dark:text-gray-500 uppercase tracking-[0.2em] px-1 block text-start">{t.post_copy_link || (language === 'ar' ? 'رابط المنشور' : 'Post Link')}</label>
                          <div className="flex items-center gap-2 bg-gray-100 dark:bg-gray-900 p-2.5 rounded-xl border border-gray-200 dark:border-gray-700 shadow-inner">
                              <LinkIcon className="w-4 h-4 text-gray-400 ml-1" />
                              <input readOnly value={`${window.location.origin}/post/${post.id}`} className="bg-transparent border-none outline-none text-[11px] text-gray-500 flex-1 truncate font-mono" />
                              <button onClick={handleCopyLink} className="bg-fb-blue text-white px-5 py-2 rounded-lg text-xs font-bold hover:bg-blue-700 transition active:scale-95 shadow-sm">{copyFeedback ? (t.common_done || (language === 'ar' ? 'تم' : 'Done')) : (t.common_copy || (language === 'ar' ? 'نسخ' : 'Copy'))}</button>
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

      {commentToDeleteId && (
          <div className="fixed inset-0 z-[100002] flex items-center justify-center bg-black/75 p-4 animate-fadeIn backdrop-blur-sm" onClick={() => setCommentToDeleteId(null)}>
              <div className="bg-white dark:bg-gray-800 rounded-2xl p-7 shadow-2xl w-full max-w-sm border border-gray-200 dark:border-gray-700 animate-scaleIn" onClick={e => e.stopPropagation()}>
                  <h3 className="font-extrabold text-xl mb-3 text-gray-900 dark:text-white">{t.post_delete_confirm_title || (language === 'ar' ? 'حذف التعليق؟' : 'Delete Comment?')}</h3>
                  <p className="text-gray-600 dark:text-gray-300 text-sm mb-8 leading-relaxed font-medium">{t.post_delete_confirm_desc || (language === 'ar' ? 'هل أنت متأكد؟' : 'Are you sure?')}</p>
                  <div className="flex justify-end gap-3">
                      <button onClick={() => setCommentToDeleteId(null)} className="px-6 py-2.5 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-xl text-sm font-bold transition active:scale-95">{t.common_cancel || (language === 'ar' ? 'إلغاء' : 'Cancel')}</button>
                      <button 
                          onClick={() => { 
                              if (onDeleteComment && commentToDeleteId) {
                                  onDeleteComment(post.id, commentToDeleteId);
                                  setCommentToDeleteId(null);
                              }
                          }} 
                          className="px-8 py-2.5 bg-red-600 text-white rounded-xl text-sm font-bold hover:bg-red-700 transition shadow-lg shadow-red-500/20 active:scale-95"
                      >
                          {t.common_delete || (language === 'ar' ? 'حذف' : 'Delete')}
                      </button>
                  </div>
              </div>
          </div>
      )}

      {showReportModal && typeof document !== 'undefined' && createPortal(
          <div className="fixed inset-0 z-[100003] bg-black/60 flex items-center justify-center p-4 animate-fadeIn backdrop-blur-sm" onClick={() => setShowReportModal(false)}>
              <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl w-full max-w-sm overflow-hidden animate-scaleIn border border-white/20 dark:border-gray-700" onClick={e => e.stopPropagation()}>
                  <div className="p-4 border-b border-gray-100 dark:border-gray-700 flex justify-between items-center bg-gray-50 dark:bg-gray-700/50">
                      <h3 className="font-bold text-lg text-gray-900 dark:text-white flex items-center gap-2">
                          <AlertTriangle className="w-5 h-5 text-red-500" />
                          {t.post_report || (language === 'ar' ? 'إبلاغ عن المنشور' : 'Report Post')}
                      </h3>
                      <button onClick={() => setShowReportModal(false)} className="text-gray-500 hover:bg-gray-200 dark:hover:bg-gray-600 rounded-full p-1 transition">
                          <X className="w-5 h-5" />
                      </button>
                  </div>
                  <div className="p-6 space-y-3">
                      <p className="text-sm text-gray-600 dark:text-gray-300 mb-2">
                         {language === 'ar' ? 'يرجى تحديد سبب الإبلاغ:' : 'Please select a reason for reporting:'}
                      </p>
                      {[
                        { id: 'inappropriate', label: language === 'ar' ? 'محتوى غير لائق' : 'Inappropriate content' },
                        { id: 'violence', label: language === 'ar' ? 'عنف أو مشاهد دموية' : 'Violence or gore' },
                        { id: 'hate', label: language === 'ar' ? 'خطاب كراهية' : 'Hate speech' },
                        { id: 'misinformation', label: language === 'ar' ? 'معلومات مضللة' : 'Misleading information' },
                        { id: 'spam', label: language === 'ar' ? 'سبام أو احتيال' : 'Spam or fraud' }
                      ].map((option) => (
                          <label key={option.id} className="flex items-center justify-between p-3 border border-gray-200 dark:border-gray-700 rounded-lg cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700 transition">
                              <span className="text-gray-700 dark:text-gray-200 text-sm font-medium">{option.label}</span>
                              <input 
                                  type="radio" 
                                  name="reportReason" 
                                  value={option.label} 
                                  checked={reportReason === option.label}
                                  onChange={(e) => setReportReason(e.target.value)}
                                  className="text-fb-blue focus:ring-fb-blue h-4 w-4"
                              />
                          </label>
                      ))}
                  </div>
                  <div className="p-4 border-t border-gray-100 dark:border-gray-700 bg-gray-50 dark:bg-gray-700/50 flex justify-end gap-2">
                      <button onClick={() => setShowReportModal(false)} className="px-6 py-2.5 text-gray-600 dark:text-gray-300 font-bold hover:bg-gray-100 dark:hover:bg-gray-700 rounded-xl transition text-sm">{t.common_cancel || (language === 'ar' ? 'إلغاء' : 'Cancel')}</button>
                      <button 
                        onClick={handleSubmitReport} 
                        disabled={!reportReason || isReportSubmitting}
                        className="px-8 py-2.5 bg-red-400 text-white font-bold rounded-xl transition shadow-lg disabled:opacity-50 flex items-center gap-2 text-sm"
                      >
                          {isReportSubmitting && <Loader2 className="w-4 h-4 animate-spin" />}
                          {t.common_send || (language === 'ar' ? 'إرسال' : 'Send')}
                      </button>
                  </div>
              </div>
          </div>,
          document.body
      )}

    </div>
  );
};

export default PostCard;