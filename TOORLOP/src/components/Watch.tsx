
import React, { useState, useRef, useEffect, useMemo } from 'react';
import { createPortal } from 'react-dom';
import {
  Play,
  Clock,
  Eye,
  MoreHorizontal,
  ThumbsUp,
  MessageCircle,
  Share2,
  X,
  Bookmark,
  BookmarkMinus,
  Flag,
  Send,
  Smile,
  Cat,
  Coffee,
  Gamepad2,
  Plane,
  Lightbulb,
  Check,
  Mic,
  Search,
  Link as LinkIcon,
  Facebook,
  Twitter,
  Phone,
  Copy,
  Download,
  AlertTriangle,
  Loader2,
} from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { useNotify } from '../context/NotificationContext';
import { VideoItem, Comment as GlobalComment, User } from '../types';
import { playAudio } from '../utils/audio';

// --- Constants & Types ---

interface WatchVideo {
  id: string;
  title: string;
  channelName: string;
  channelAvatar: string;
  views: string;
  time: string;
  duration: string;
  thumb: string;
  videoUrl: string;
  likes: number;
  commentsCount: number;
  isLiked: boolean;
  reaction?: string;
  isSaved: boolean;
}

interface Comment {
  id: string;
  user: string;
  userId: string;
  avatar: string;
  text: string;
  timestamp: string;
  likes: number;
  isLiked: boolean;
  mediaUrl?: string;
  type?: 'text' | 'audio';
}

interface WatchProps {
  onSaveVideo?: (video: VideoItem) => void;
  savedVideos?: VideoItem[];
  onLikeVideo?: (videoId: string, reactionType?: string) => void;
  onCommentVideo?: (videoId: string, text: string, commentId?: string) => void;
  onDeleteVideoComment?: (videoId: string, commentId: string) => void;
  onLikeVideoComment?: (videoId: string, commentId: string) => void;
  currentUser?: User;
}

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
    emojis: ["🍏","🍎","🍐","🍊","🍋","🍌","🍉","🍇","🍓","🍈","🍒","🍑","🥭","🍍","🥥","🥝","🍅","🍆","🥑","🥦","🥬","🥒","🌶","🌽","🥕","🧄","🧅","🥔","🍠","🥐","🥯","🍞","🥖","🥨","🧀","🥚","🍳","🧈","🥞"," waffle","🥓","🥩","🍗","🍖","🦴","🌭","🍔","🍟","🍕","🥪","🥙","🧆","التماسك","🌯","🥗","🥘","التماسك","🍝","🍜","🍲","🍛","🍣","🍱","🥟","🦪","🍤","🍙","🍚","الساعة","🍥","🥠","🥮","🍢","🍡","🍧","🍨","🍦","🥧","🧁","🍰","🎂","🍮","🍭","🍬","🍫","🍿","🍩","🍪","🌰","🥜","🍯","🥛","🍼","☕","🍵","🧃","🥤","🍶","🍺","🍻","🥂","🍷","🥃","۩","🍹","🧉","محلول","🧊","🥄","🍴","🍽","🥣","🥡","🥢","🧂"]
  },
  activities: {
    icon: Gamepad2,
    label: "أنشطة",
    emojis: ["⚽","🏀","🏈","⚾","🥎","🎾","🏐","🏉","🥏","🎱","🪀","🏓","🏸","🏒","🏑","🥍","🏏","🥅","⛳","🪁","🏹","فيديو","🤿","🥊","🥋","🎽","سكيت","🛼","🛷","⛸","🥌","🎿","يرى","🏂","🪂","🏋️","🤼","🤸","⛹️","🤺","🤾","🏌️","🏇","🧘","🏄","🏊","🤽","🚣","🧗","🚵","🚴","🏆","🥇","🥈","🥉","🏅","🎖","🏵","🎗","🎫","🎟","🎪","🤹","🎭","🩰","🎨","🎬","🎤","🎧","🎼","🎹","🥁","🎷","🎺","🎸","🪕","الكمان","🎲","♟","🎯","🎳","🎮","🎰","🧩"]
  },
  travel: {
    icon: Plane,
    label: "سفر",
    emojis: ["🚗","🚕","🚙","🚌","🚎","🏎","🚓"," ambulance","🚒","🚐","🚚","🚛","🚜"," motorcycle","🛵","🚲","🦼","🦽","الخط","🚨","🚔","🚍","🚘","叙","🚡","🚠","🚟","🚃","🚋","🚞","🚝","🚄","🚅","🚈","🚂","🚆","🚇","🚊","🚉","✈","أهلاً","🛬","🛩","💺","🛰","🚀","🛸","🚁","🛶","⛵","🚤","🛥","🛳","⛴","🚢","⚓","⛽","🚧","🚦","🚥","🚏","🗺","🗿","التم","🗼","🏰","🏯","🏟","🎡","🎢","🎠"," fountains","⛱","🏖","🏝","🏜","🌋","⛰","🏔","🗻","🏕","⛺","🏠","🏡","🏘","🏚","🏗","🏭","🏢","🏬","","🏤","🏥","🏦","🏨","🏪","🏫","🏩","💒","🏛","⛪","🕌","🕍","🛕","🕋","⛩","🛤","الطر","🗾","🎑","🏞","🌅","🌄","🌠","🎇","🎆","🌇","🌆","🏙","🌃","🌌","BRIDGE","🌁"]
  },
  objects: {
    icon: Lightbulb,
    label: "أشياء",
    emojis: ["⌚","📱","📲","💻","⌨","🖥","🖨","鼠标","🖲","🕹","🗜","💽","💾","💿","📀","📼","📷","📸","📹","🎥","📽","🎞","📞","☎","📟","📠","📺","📻","🎙","🎚","🎛","🧭","⏱","⏲","⏰","🕰","⌛","⏳","📡","🔋","🔌","💡","flashlight","🕯","🪔","🧯","🛢","💸","💵","💴","💶","💷","🪙","💰","💳","💎","⚖","🧰","🔧","🔨","⚒","🛠","⛏","🪓","🧱","⚙","🪜","🩹","🩺","💈","🧲","🔫","💣","🧨","🔪","🗡","⚔","🛡","🚬","⚰","⚱","🏺","🔮","📿","🧿","💊","💉","🩸","🧬","🦠","🧫","🧪","🌡","🧹","🧺","🧻","🚽","🚰","🚿","🛁","🛀","🧼","🪥","🪒","🧽","🪣","🧴","🛎","🔑","🗝","🚪","🪑","🛋","🛏","🛌","🧸","🪆","🖼","🪞"]
  },
  flags: {
    icon: Flag,
    label: "أعلام",
    emojis: ["🏁","🚩","🎌","🏴","🏳","🏳️‍🌈","🏳️‍⚧️","🏴‍☠️","🇦🇩","🇦🇪","🇦🇫","🇦🇬","🇦🇮","🇦🇱","🇦🇲","🇦🇴","🇦🇶","🇦🇷","🇦🇸","🇦🇹","🇦🇺","🇦🇼","🇦🇽","🇦🇿","🇧🇦","🇧🇧","🇧🇩","🇧🇪","🇧🇫","🇧🇬","🇧Ｈ","🇧🇮","🇧🇯","🇧🇱","🇧🇲","🇧🇳","🇧🇴","🇧🇶","🇧🇷","🇧🇸","🇧🇹","🇧🇻","🇧🇼","🇧🇾","🇧🇿","🇨🇦","🇨🇨","🇨🇩","🇨🇫","🇨🇬","🇨🇭","🇨🇮","🇨🇰","🇨🇱","🇨🇲","🇨🇳","🇨🇴","🇨🇷","🇨🇺","🇨🇻","🇨🇼","🇨🇽","🇨🇾","🇨🇿","🇩🇪","🇩🇬","🇩🇯","🇩🇰","🇩🇲","🇩🇴","🇩🇿","🇪🇦","🇪🇨","🇪🇪","🇪🇬","🇪Ｈ","🇪🇷","🇪🇸","🇪🇹","🇪🇺","🇫🇮","🇫🇯","🇫🇰","🇫🇲","🇫🇴","🇫🇷","🇬🇦","🇬🇧","🇬🇩","🇬🇪","🇬🇫","🇬🇬","🇬Ｈ","🇬🇮","🇬🇱","🇬🇲","🇬🇳","🇬🇵","🇬🇶","🇬🇷","🇬🇸","🇬🇹","🇬🇺","🇬🇼","🇬🇾","🇭🇰","🇭🇲","🇭🇳","🇭🇷","🇭🇹","🇭🇺","🇮🇨","🇮🇩","🇮🇱","🇮🇲","🇮🇳","🇮🇴","🇮🇶","🇮🇷","🇮🇸","🇮ت","🇯🇪","🇯🇲","🇯🇴","🇯🇵","🇰🇪","🇰🇬","🇰🇭","🇰🇮","🇰🇲","🇰🇳","🇰🇵","🇰🇷",
              "🇰🇼","🇰🇾","🇰🇿","🇱🇦","🇱🇧","🇱🇨","🇱🇮","🇱🇰","🇱🇷","🇱🇸","🇱ت","🇱🇺","🇱🇻","🇱🇾","🇲🇦","🇲🇨","🇲🇩","🇲🇪","🇲🇫","🇲🇬","🇲Ｈ","🇲🇰","🇲🇱","🇲🇲","🇲🇳","🇲🇴","🇲🇵","🇲🇶","🇲🇷","🇲🇸","🇲🇹","🇲🇺","🇲🇻","🇲🇼","🇲🇽","🇲🇾","🇲🇿","🇳🇦","🇳🇨","🇳🇪","🇳🇫","🇳🇬","🇳🇮","🇳🇱","🇳🇴","🇳🇵","🇳🇷","🇳🇺","🇳🇿","🇴🇲","🇵🇦","🇵🇪","🇵🇫","🇵🇬","🇵Ｈ","🇵🇰","🇵🇱","🇵🇲","🇵🇳","🇵🇷","🇵🇸","🇵🇹","🇵🇼","🇵🇾","🇶🇦","🇷🇪","🇷🇴","🇷🇸","🇷🇺","🇷🇼","🇸🇦","🇸🇧","🇸🇨","🇸🇩","🇸🇪","🇸🇬","🇸Ｈ","🇸🇮","🇸🇯","🇸🇰","🇸🇱","🇸🇲","🇸🇳","🇸🇴","🇸🇷","🇸🇸","🇸🇹","🇸🇻","🇸🇽","🇸🇾","🇸🇿","🇹🇦","🇹🇨","🇹🇩","🇹🇫","🇹🇬","🇹Ｈ","🇹🇯","🇹🇰","🇹🇱","🇹🇲","🇹🇳","🇹🇴","🇹🇷","🇹TT","🇹🇻","🇹🇼","🇹🇿","🇺🇦","🇺🇬","🇺🇲","🇺🇳","🇺🇸","🇺🇾","🇺🇿","🇻🇦","🇻🇨","🇻🇪","🇻🇬","🇻🇮","🇻🇳","🇻🇺","🇼🇫","🇼🇸","🇽🇰","🇾🇪","🇾🇹","🇿🇦","🇿🇲","🇿🇼"] 
  }
};

const INITIAL_WATCH_VIDEOS: WatchVideo[] = [
  {
    id: 'w1',
    title: 'جولة في الطبيعة الخلابة - 4K',
    channelName: 'NatGeo Arabia',
    channelAvatar: 'https://picsum.photos/40/40?random=50',
    views: '1.2M',
    time: 'منذ ساعتين',
    duration: '5:30',
    thumb: 'https://picsum.photos/800/450?random=50',
    videoUrl: 'https://www.w3schools.com/html/mov_bbb.mp4',
    likes: 12500,
    commentsCount: 450,
    isLiked: false,
    isSaved: false
  },
  {
    id: 'w2',
    title: 'أفضل لحظات كرة القدم 2024',
    channelName: 'Koora Sport',
    channelAvatar: 'https://picsum.photos/40/40?random=51',
    views: '500K',
    time: 'منذ 5 ساعات',
    duration: '10:15',
    thumb: 'https://picsum.photos/800/450?random=51',
    videoUrl: 'https://www.w3schools.com/html/movie.mp4',
    likes: 8300,
    commentsCount: 1200,
    isLiked: true,
    reaction: 'love',
    isSaved: true
  },
  {
    id: 'w3',
    title: 'طريقة تحضير القهوة المختصة V60',
    channelName: 'Coffee Lovers',
    channelAvatar: 'https://picsum.photos/40/40?random=52',
    views: '200K',
    time: 'منذ يوم',
    duration: '3:45',
    thumb: 'https://picsum.photos/800/450?random=52',
    videoUrl: 'https://www.w3schools.com/html/mov_bbb.mp4',
    likes: 5400,
    commentsCount: 320,
    isLiked: false,
    isSaved: false
  },
  {
    id: 'w4',
    title: 'مراجعة أحدث الهواتف الذكية 2025',
    channelName: 'Tech Reviewer',
    channelAvatar: 'https://picsum.photos/40/40?random=53',
    views: '800K',
    time: 'منذ يومين',
    duration: '12:20',
    thumb: 'https://picsum.photos/800/450?random=53',
    videoUrl: 'https://www.w3schools.com/html/movie.mp4',
    likes: 15000,
    commentsCount: 2100,
    isLiked: false,
    isSaved: false
  },
];

const Watch: React.FC<WatchProps> = ({
    onSaveVideo,
    savedVideos = [],
    onLikeVideo,
    onCommentVideo,
    onDeleteVideoComment,
    onLikeVideoComment,
    currentUser
}) => {
  const { t, dir, language } = useLanguage();
  const notify = useNotify();

  // Initialize local videos from localStorage if available to persist likes/saves across sessions
  const [videos, setVideos] = useState<WatchVideo[]>(() => {
      if (typeof window !== 'undefined') {
          const saved = localStorage.getItem('tourloop_watch_videos');
          if (saved) {
              try {
                  const parsed = JSON.parse(saved);
                  // Merge saved state with INITIAL to get latest static data but preserved user interactions
                  return INITIAL_WATCH_VIDEOS.map(initVid => {
                      const savedVid = parsed.find((p: WatchVideo) => p.id === initVid.id);
                      return savedVid ? { ...initVid, isLiked: savedVid.isLiked, likes: savedVid.likes, reaction: savedVid.reaction, isSaved: savedVid.isSaved } : initVid;
                  });
              } catch (e) { return INITIAL_WATCH_VIDEOS; }
          }
      }
      return INITIAL_WATCH_VIDEOS;
  });

  const [activeVideoId, setActiveVideoId] = useState<string | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [activeMenuId, setActiveMenuId] = useState<string | null>(null);

  // Comment Section State (Persisted)
  const [expandedCommentsId, setExpandedCommentsId] = useState<string | null>(null);
  const [commentInput, setCommentInput] = useState('');
  
  // Load comments from localStorage
  const [comments, setComments] = useState<Record<string, Comment[]>>(() => {
      if (typeof window !== 'undefined') {
          const saved = localStorage.getItem('tourloop_watch_comments');
          if (saved) return JSON.parse(saved);
      }
      return {};
  });

  // Persist comments change
  useEffect(() => {
      if (typeof window !== 'undefined') {
          localStorage.setItem('tourloop_watch_comments', JSON.stringify(comments));
      }
  }, [comments]);

  // Persist videos change (likes/saves)
  useEffect(() => {
      if (typeof window !== 'undefined') {
          localStorage.setItem('tourloop_watch_videos', JSON.stringify(videos));
      }
  }, [videos]);

  // Reply & Delete State
  const [replyingToId, setReplyingToId] = useState<string | null>(null);
  const [replyText, setReplyText] = useState('');
  const [commentToDeleteId, setCommentToDeleteId] = useState<string | null>(null);

  // Share Modal State
  const [showShareModal, setShowShareModal] = useState(false);
  const [shareData, setShareData] = useState<{ title: string; url: string } | null>(null);
  const [copyFeedback, setCopyFeedback] = useState(false);

  // Report Modal State
  const [showReportModal, setShowReportModal] = useState(false);
  const [reportReason, setReportReason] = useState('');
  const [isReportSubmitting, setIsReportSubmitting] = useState(false);
  const [reportFeedback, setReportFeedback] = useState(false);

  // Theater Mode Refs
  const videoRef = useRef<HTMLVideoElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);
  const theaterCommentsEndRef = useRef<HTMLDivElement>(null);
  const lastScrollTime = useRef(0);

  // Theater Mode Comment State
  const [theaterCommentInput, setTheaterCommentInput] = useState('');
  const [showTheaterComments, setShowTheaterComments] = useState(false);

  // Enhanced Features (Reactions & Audio)
  const [showReactionsFor, setShowReactionsFor] = useState<string | null>(null);
  const reactionTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Voice Comment State
  const [isRecording, setIsRecording] = useState(false);
  const [recordingDuration, setRecordingDuration] = useState(0);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const recordingIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  // Emoji Picker State
  const [showEmojiPickerId, setShowEmojiPickerId] = useState<string | null>(null);
  const [emojiSearch, setEmojiSearch] = useState('');
  const [activeEmojiTab, setActiveEmojiTab] = useState<'recent' | keyof typeof EMOJI_CATEGORIES>('recent');
  const [recentEmojis, setRecentEmojis] = useState<string[]>([]);
  const emojiPickerRef = useRef<HTMLDivElement>(null);

  // Localized Reactions using useMemo
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

  // --- Effects ---
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setActiveMenuId(null);
      }
      if (emojiPickerRef.current && !emojiPickerRef.current.contains(event.target as Node)) {
        setShowEmojiPickerId(null);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    const savedRecents = localStorage.getItem('chat_recent_emojis');
    if (savedRecents) {
      setRecentEmojis(JSON.parse(savedRecents));
    }
  }, []);

  // Sync comments from saved items safely
  useEffect(() => {
      if (savedVideos) {
          setVideos(prev => prev.map(v => {
              const saved = savedVideos.find(s => s.id === v.id);
              if (saved) {
                  return {
                      ...v,
                      isSaved: true,
                      isLiked: !!saved.isLiked,
                      reaction: saved.reaction,
                      likes: saved.likes,
                      commentsCount: saved.comments ? saved.comments.length : v.commentsCount
                  };
              }
              return { ...v, isSaved: false };
          }));

          setComments(prev => {
              const next = { ...prev };
              savedVideos.forEach(sv => {
                  // CRITICAL FIX: If a video is in saved list, we now strictly overwrite local version 
                  // to handle deletions correctly. Audio comments are preserved by only replacing text items.
                  const currentLocal = next[sv.id] || [];
                  const audioComments = currentLocal.filter(c => c.type === 'audio');
                  
                  const savedCommentsMapped = sv.comments.map(c => ({
                      id: c.id,
                      user: c.author.name,
                      userId: c.author.id, 
                      avatar: c.author.avatar,
                      text: c.content,
                      timestamp: c.timestamp,
                      likes: c.likes || 0,
                      isLiked: !!c.isLiked,
                      mediaUrl: (c as any).mediaUrl,
                      type: (c as any).type || 'text'
                  }));

                  next[sv.id] = [...savedCommentsMapped, ...audioComments];
              });
              return next;
          });
      }
  }, [savedVideos]);

  // Recording Timer
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

  // Scroll to bottom of comments in theater mode
  useEffect(() => {
    if (showTheaterComments && activeVideoId && theaterCommentsEndRef.current) {
      theaterCommentsEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [comments, activeVideoId, showTheaterComments]);

  // --- Helper Functions ---
  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  const getReactionObj = (name: string) => {
    return reactions.find(r => r.name === name) || reactions[0];
  };

  // --- Handlers ---
  const handleLike = (e: React.MouseEvent, id: string, reactionType: string = 'like') => {
    e.stopPropagation(); 
    
    // Update local state first for instant feedback
    setVideos(prev => prev.map(v => {
      if (v.id === id) {
        const isRemoving = v.isLiked && (v.reaction === reactionType || !v.reaction);
        if (isRemoving) {
          playAudio('pop');
          return { ...v, isLiked: false, reaction: undefined, likes: Math.max(0, v.likes - 1) };
        } 
        const newCount = v.isLiked ? v.likes : v.likes + 1;
        if (reactionType !== 'like') playAudio('react');
        else playAudio('like');

        return { ...v, isLiked: true, reaction: reactionType, likes: newCount };
      }
      return v;
    }));
    
    // Propagate like to global state
    if (onLikeVideo) {
        onLikeVideo(id, reactionType);
    }
    setShowReactionsFor(null);
  };

  const handleSave = (videoId: string) => {
    const videoObj = videos.find(v => v.id === videoId);
    playAudio('pop');
    if (videoObj && onSaveVideo) {
      // Retrieve local comments to persist them into the global Saved state
      const localComments = comments[videoId] || [];
      
      const globalComments: GlobalComment[] = localComments.map(c => ({
          id: c.id,
          author: { id: c.userId || currentUser?.id || 'me', name: c.user, avatar: c.avatar } as User, 
          content: c.text,
          timestamp: c.timestamp,
          likes: c.likes,
          isLiked: c.isLiked,
      }));

      const videoItem: VideoItem = {
          id: videoObj.id,
          url: videoObj.videoUrl,
          title: videoObj.title,
          views: 0, 
          timestamp: videoObj.time,
          duration: videoObj.duration,
          type: 'video',
          likes: videoObj.likes,
          comments: globalComments,
          isLiked: videoObj.isLiked,
          reaction: videoObj.reaction,
          isSaved: true
      };

      onSaveVideo(videoItem);
    }
    setActiveMenuId(null);
  };

  const handleShare = (videoTitle: string) => {
    playAudio('pop');
    setShareData({
      title: videoTitle,
      url: typeof window !== 'undefined' ? window.location.href : ''
    });
    setShowShareModal(true);
    setActiveMenuId(null);
  };

  const handleSocialShare = (platform: string) => {
    const url = encodeURIComponent(shareData?.url || '');
    const text = encodeURIComponent(shareData?.title || '');
    let shareUrl = '';
    if (platform === 'facebook') shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${url}`;
    if (platform === 'twitter') shareUrl = `https://twitter.com/intent/tweet?url=${url}&text=${text}`;
    if (platform === 'whatsapp') shareUrl = `https://api.whatsapp.com/send?text=${text}%20${url}`;
    if (shareUrl) window.open(shareUrl, '_blank', 'width=600,height=400');
    setShowShareModal(false);
  };

  const handleReport = () => {
    playAudio('pop');
    setShowReportModal(true);
    setActiveMenuId(null);
  };

  const handleSubmitReport = () => {
    if (!reportReason) return;
    setIsReportSubmitting(true);
    setTimeout(() => {
      setIsReportSubmitting(false);
      setShowReportModal(false);
      setReportReason('');
      setReportFeedback(true);
      notify(language === 'ar' ? 'تم إرسال البلاغ بنجاح' : 'Report submitted successfully', 'success');
      setTimeout(() => setReportFeedback(false), 3000);
    }, 1500);
  };

  const handleDownload = (videoUrl: string) => {
      const link = document.createElement('a');
      link.href = videoUrl;
      link.download = `video_download_${Date.now()}.mp4`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      playAudio('pop');
      setActiveMenuId(null);
  };

  const submitComment = (videoId: string, text: string, type: 'text' | 'audio' = 'text', mediaUrl?: string) => {
    const isSaved = savedVideos.some(v => v.id === videoId);
    
    // Create Local Comment Object with correct IDs
    const commentId = Date.now().toString();
    const newComment: Comment = {
        id: commentId,
        user: currentUser?.name || (language === 'ar' ? 'أنت' : 'You'),
        userId: currentUser?.id || 'me',
        avatar: currentUser?.avatar || 'https://picsum.photos/200/200?random=1',
        text: text,
        timestamp: language === 'ar' ? 'الآن' : 'Just now',
        likes: 0,
        isLiked: false,
        type: type,
        mediaUrl: mediaUrl
    };

    // Update Local State
    setComments(prev => ({
        ...prev,
        [videoId]: [newComment, ...(prev[videoId] || [])]
    }));

    setVideos(prev => prev.map(v => v.id === videoId ? { ...v, commentsCount: v.commentsCount + 1 } : v));
    
    // CRITICAL FIX: Pass the locally generated ID to syncComment to prevent duplication
    if (onCommentVideo) {
        onCommentVideo(videoId, text, commentId);
    }
    
    playAudio('comment');
  };

  const handleCommentSubmit = (e: React.FormEvent, videoId: string, isTheater: boolean = false) => {
    e.preventDefault();
    const inputVal = isTheater ? theaterCommentInput : commentInput;
    if (!inputVal.trim()) return;

    submitComment(videoId, inputVal);

    if (isTheater) setTheaterCommentInput('');
    else setCommentInput('');

    setShowEmojiPickerId(null);
  };

  const handleInlineReplySubmit = (e: React.FormEvent, videoId: string) => {
    e.preventDefault();
    if (!replyText.trim()) return;
    submitComment(videoId, replyText);
    setReplyingToId(null);
    setReplyText('');
  };

  const handleDeleteComment = (videoId: string, commentId: string) => {
    setComments(prev => ({
      ...prev,
      [videoId]: (prev[videoId] || []).filter(c => c.id !== commentId)
    }));
    setVideos(prev => prev.map(v => v.id === videoId ? { ...v, commentsCount: Math.max(0, v.commentsCount - 1) } : v));
    setCommentToDeleteId(null);
    playAudio('pop');
    
    if (onDeleteVideoComment) {
        onDeleteVideoComment(videoId, commentId);
    }
  };

  const handleLikeComment = (videoId: string, commentId: string) => {
    playAudio('like');
    setComments(prev => ({
        ...prev,
        [videoId]: (prev[videoId] || []).map(c => 
            c.id === commentId ? { ...c, isLiked: !c.isLiked, likes: c.isLiked ? Math.max(0, c.likes - 1) : c.likes + 1 } : c
        )
    }));
    
    if (onLikeVideoComment) {
        onLikeVideoComment(videoId, commentId);
    }
  };

  const startRecording = async () => {
    if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
      alert(language === 'ar' ? 'ميزة التسجيل الصوتي غير مدعومة في هذا المتصفح.' : 'Voice recording not supported.');
      return;
    }
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      audioChunksRef.current = [];
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;
      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) audioChunksRef.current.push(event.data);
      };
      mediaRecorder.onstop = () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/webm' });
        const audioUrl = URL.createObjectURL(audioBlob);
        const targetId = activeVideoId || expandedCommentsId;
        if (targetId) {
          submitComment(targetId, '', 'audio', audioUrl);
        }
        stream.getTracks().forEach(track => track.stop());
      };
      mediaRecorder.start();
      setIsRecording(true);
    } catch (err) {
      console.error(err);
      alert(language === 'ar' ? 'حدث خطأ في الوصول للميكروفون.' : 'Error accessing microphone.');
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

  const handleEmojiClick = (emoji: string, isTheater: boolean) => {
    if (isTheater) setTheaterCommentInput(prev => prev + emoji);
    else setCommentInput(prev => prev + emoji);

    const newRecents = [...new Set([emoji, ...recentEmojis])].slice(0, 24);
    setRecentEmojis(newRecents);
    localStorage.setItem('chat_recent_emojis', JSON.stringify(newRecents));
    setShowEmojiPickerId(null);
  };

  const openTheaterMode = (id: string) => {
    playAudio('pop');
    setActiveVideoId(id);
    setIsPlaying(true);
    setShowTheaterComments(false);
  };

  const closeTheaterMode = () => {
    playAudio('pop');
    setActiveVideoId(null);
    setIsPlaying(false);
  };
  
  const handleTheaterScroll = (e: React.WheelEvent) => {
      const now = Date.now();
      if (now - lastScrollTime.current < 500) return;
      
      if (e.deltaY > 50) {
          const idx = videos.findIndex(v => v.id === activeVideoId);
          if (idx !== -1 && idx < videos.length - 1) {
              openTheaterMode(videos[idx + 1].id);
              lastScrollTime.current = now;
          }
      } else if (e.deltaY < -50) {
          const idx = videos.findIndex(v => v.id === activeVideoId);
          if (idx > 0) {
              openTheaterMode(videos[idx - 1].id);
              lastScrollTime.current = now;
          }
      }
  };

  const handleCopyLink = () => {
    if (shareData) {
      navigator.clipboard.writeText(shareData.url);
      playAudio('pop');
      setCopyFeedback(true);
      notify(language === 'ar' ? 'تم نسخ الرابط' : 'Link copied', 'success');
      setTimeout(() => setCopyFeedback(false), 2000);
    }
  };

  const toggleComments = (id: string) => {
    playAudio('pop');
    setExpandedCommentsId(expandedCommentsId === id ? null : id);
  };

  const activeVideo = videos.find(v => v.id === activeVideoId);

  const renderCommentForm = (videoId: string, isTheater: boolean = false) => {
    const inputValue = isTheater ? theaterCommentInput : commentInput;
    const setInputValue = isTheater ? setTheaterCommentInput : setCommentInput;
    const pickerId = isTheater ? `theater_${videoId}` : `main_${videoId}`;

    if (isRecording && (activeVideoId === videoId || expandedCommentsId === videoId)) {
      return (
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
      );
    }

    return (
      <form onSubmit={(e) => handleCommentSubmit(e, videoId, isTheater)} className="flex-1 relative flex items-center gap-2">
        <div className="relative flex-1">
          <input
            type="text"
            className="w-full bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-full py-2 px-4 text-sm outline-none focus:ring-2 focus:ring-fb-blue dark:text-white placeholder-gray-500 dark:placeholder-gray-400 transition ltr:pr-20 rtl:pl-20"
            placeholder={language === 'ar' ? 'اكتب تعليقاً...' : 'Write a comment...'}
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
          />
          <div className="absolute top-1/2 -translate-y-1/2 flex items-center gap-2 ltr:right-3 rtl:left-3">
            <Mic
              className="w-5 h-5 text-gray-400 cursor-pointer hover:text-red-500 transition-colors"
              onClick={startRecording}
            />
            <Smile
              className="w-5 h-5 text-gray-400 cursor-pointer hover:text-yellow-500 transition-colors"
              onClick={(e) => {
                e.stopPropagation();
                setShowEmojiPickerId(showEmojiPickerId === pickerId ? null : pickerId);
              }}
            />
          </div>

          {showEmojiPickerId === pickerId && (
            <div
              ref={emojiPickerRef}
              className={`absolute bottom-full mb-2 ${dir === 'rtl' ? 'left-0 origin-bottom-left' : 'right-0 origin-bottom-right'} bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 shadow-2xl rounded-2xl w-80 z-[50] animate-scaleIn flex flex-col overflow-hidden`}
              onClick={(e) => e.stopPropagation()}
            >
               <div className="flex items-center p-2 border-b dark:border-gray-700 bg-gray-50 dark:bg-gray-900 gap-2 flex-shrink-0">
                  <div className={`relative w-full`}>
                      <Search className="w-3 h-3 absolute left-2 top-2 text-gray-400" />
                      <input 
                          type="text" 
                          className="w-full pl-6 pr-2 py-1 text-xs bg-gray-200 dark:bg-gray-700 rounded-full outline-none text-gray-900 dark:text-white"
                          placeholder={language === 'ar' ? 'بحث' : 'Search'}
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
                      return <div key="empty" className="text-center text-xs text-gray-400 py-4">{language === 'ar' ? 'لا توجد رموز حديثة' : 'No recent emojis'}</div>;
                  }
                  return (
                    <div key={categoryKey} className="animate-fadeIn">
                        <div className="grid grid-cols-8 gap-1">
                            {emojis.map((emoji, idx) => (
                                <button 
                                    key={`${categoryKey}-${idx}`} 
                                    type="button"
                                    onClick={() => handleEmojiClick(emoji, isTheater)} 
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
          disabled={!inputValue.trim()}
          className="text-fb-blue hover:bg-blue-50 dark:hover:bg-blue-900/20 p-2 rounded-full transition disabled:opacity-50"
        >
          <Send className="w-5 h-5 rtl:rotate-180" />
        </button>
      </form>
    );
  };

  /* Fix: Added explicit typing to comment parameter and aligned it with the Comment interface */
  const renderCommentItem = (comment: Comment, videoId: string) => {
    // Robust Owner Check logic
    const isOwner = (currentUser && comment.userId === currentUser.id) || 
                    comment.user === 'You' || 
                    comment.user === 'أنت' ||
                    (currentUser && comment.user === currentUser.name);

    return (
        <div key={comment.id} className="flex gap-2 group flex-col animate-fadeIn">
        <div className="flex gap-2 items-start">
            <div className="w-8 h-8 rounded-full bg-gray-300 dark:bg-gray-600 overflow-hidden flex-shrink-0">
            <img src={comment.avatar} alt="avatar" className="w-full h-full object-cover" />
            </div>
            <div className="flex flex-col flex-1">
            <div className="bg-gray-100 dark:bg-gray-700 px-3 py-2 rounded-2xl rounded-tr-none w-fit shadow-sm">
                <span className="font-bold text-xs block text-gray-900 dark:text-white mb-0.5 text-start">{comment.user}</span>
                {comment.type === 'audio' && comment.mediaUrl ? (
                <div className="flex items-center gap-2 min-w-[150px] my-1">
                    <audio controls src={comment.mediaUrl} className="h-8 w-40" />
                </div>
                ) : (
                <span className="text-sm text-gray-800 dark:text-gray-200 break-words block text-start">{comment.text}</span>
                )}
            </div>
            <div className="flex gap-3 text-[11px] text-gray-500 dark:text-gray-400 mt-1 mr-2 px-1 font-bold">
                <span>{comment.timestamp}</span>
                <button 
                className={`hover:text-fb-blue transition ${comment.isLiked ? 'text-fb-blue' : ''}`} 
                onClick={() => handleLikeComment(videoId, comment.id)}
                >
                    {comment.isLiked ? (language === 'ar' ? 'أعجبني' : 'Liked') : (language === 'ar' ? 'إعجاب' : 'Like')}
                </button>
                <button
                className="hover:text-fb-blue transition"
                onClick={() => {
                    if (replyingToId === comment.id) {
                    setReplyingToId(null);
                    } else {
                    setReplyingToId(comment.id);
                    setReplyText(`@${comment.user} `);
                    }
                }}
                >
                {language === 'ar' ? 'رد' : 'Reply'}
                </button>
                {isOwner && (
                <button
                    className="hover:text-red-500 transition"
                    onClick={() => setCommentToDeleteId(comment.id)}
                >
                    {language === 'ar' ? 'حذف' : 'Delete'}
                </button>
                )}
            </div>
            </div>
        </div>

        {replyingToId === comment.id && (
            <div className="mr-12 flex gap-2 animate-fadeIn mt-1">
            <img src={currentUser?.avatar || "https://picsum.photos/200/200?random=1"} className="w-7 h-7 rounded-full shadow-sm object-cover border border-gray-100" alt="me" />
            <form className="flex-1" onSubmit={(e) => handleInlineReplySubmit(e, videoId)}>
                <input
                type="text"
                className="w-full bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-full px-3 py-1.5 text-[11px] focus:ring-2 focus:ring-fb-blue/20 transition dark:text-white outline-none shadow-sm"
                placeholder={`${language === 'ar' ? 'الرد على' : 'Reply to'} ${comment.user}...`}
                value={replyText}
                onChange={(e) => setReplyText(e.target.value)}
                autoFocus
                />
            </form>
            </div>
        )}
        </div>
    );
  };

  return (
    <div className="max-w-[740px] mx-auto py-6 px-4 animate-fadeIn" dir={dir}>
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">{t.watch_title || (language === 'ar' ? 'مشاهدة' : 'Watch')}</h2>
        <div className="bg-fb-blue/10 dark:bg-fb-blue/20 p-2 rounded-full">
          <Play className="w-6 h-6 text-fb-blue fill-current" />
        </div>
      </div>

      <div className="space-y-6">
        {videos.map((video) => {
          const isSavedGlobally = savedVideos.some(v => v.id === video.id);
          const currentReaction = video.isLiked ? getReactionObj(video.reaction || 'like') : null;

          return (
            <div key={video.id} className="bg-white dark:bg-gray-800 rounded-xl shadow-sm overflow-hidden border border-gray-200 dark:border-gray-700 transition-colors duration-300">
              <div className="p-3 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <img src={video.channelAvatar} className="w-10 h-10 rounded-full border border-gray-100 dark:border-gray-600" alt={video.channelName} />
                  <div>
                    <h4 className="font-bold text-sm text-gray-900 dark:text-white hover:underline cursor-pointer">{video.channelName}</h4>
                    <span className="text-xs text-gray-500 dark:text-gray-400 flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      {video.time}
                    </span>
                  </div>
                </div>

                <div className="relative" ref={activeMenuId === video.id ? menuRef : null}>
                  <button
                    onClick={() => { playAudio('pop'); setActiveMenuId(activeMenuId === video.id ? null : video.id); }}
                    className="text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 p-2 rounded-full transition"
                  >
                    <MoreHorizontal className="w-5 h-5" />
                  </button>

                  {activeMenuId === video.id && (
                    <div className={`absolute top-full mt-1 w-72 md:w-80 bg-white dark:bg-gray-800 rounded-lg shadow-xl border border-gray-100 dark:border-gray-700 z-10 overflow-hidden animate-fadeIn ${dir === 'rtl' ? 'left-0 origin-top-left' : 'right-0 origin-top-right'}`}>
                      <button onClick={() => handleSave(video.id)} className="w-full text-start px-4 py-3 hover:bg-emerald-50 dark:hover:bg-gray-700 flex items-center gap-3 text-sm text-gray-700 dark:text-gray-200 transition font-medium">
                        {isSavedGlobally ? <BookmarkMinus className="w-5 h-5 text-fb-blue" /> : <Bookmark className="w-5 h-5" />}
                        {isSavedGlobally ? (language === 'ar' ? 'إلغاء الحفظ' : 'Unsave Video') : (language === 'ar' ? 'حفظ الفيديو' : 'Save Video')}
                      </button>
                      <div className="border-t border-gray-100 dark:border-gray-700 my-1"></div>
                      <button onClick={() => handleShare(video.title)} className="w-full text-start px-4 py-3 hover:bg-emerald-50 dark:hover:bg-gray-700 flex items-center gap-3 text-sm text-gray-700 dark:text-gray-200 transition font-medium">
                        <Share2 className="w-5 h-5" /> {t.common_share}
                      </button>
                      <button onClick={handleCopyLink} className="w-full text-start px-4 py-3 hover:bg-emerald-50 dark:hover:bg-gray-700 flex items-center gap-3 text-sm text-gray-700 dark:text-gray-200 transition font-medium">
                        <LinkIcon className="w-5 h-5" /> {t.post_copy_link}
                      </button>
                      <button onClick={() => handleDownload(video.videoUrl)} className="w-full text-start px-4 py-3 hover:bg-emerald-50 dark:hover:bg-gray-700 flex items-center gap-3 text-sm text-gray-700 dark:text-gray-200 transition font-medium">
                        <Download className="w-5 h-5" /> {t.common_download}
                      </button>
                      <div className="border-t border-gray-100 dark:border-gray-700 my-1"></div>
                      <button onClick={handleReport} className="w-full text-start px-4 py-3 hover:bg-emerald-50 dark:hover:bg-gray-700 flex items-center gap-3 text-sm text-gray-700 dark:text-gray-200 transition font-medium">
                        <Flag className="w-5 h-5" /> {t.post_report}
                      </button>
                    </div>
                  )}
                </div>
              </div>

              <div
                className="relative aspect-video bg-black group cursor-pointer overflow-hidden"
                onClick={() => openTheaterMode(video.id)}
              >
                <img src={video.thumb} className="w-full h-full object-cover opacity-90 group-hover:opacity-75 transition duration-300" alt={video.title} />
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="bg-black/50 p-4 rounded-full backdrop-blur-sm border border-white/20">
                    <Play className="w-8 h-8 text-white fill-current ml-1" />
                  </div>
                </div>
                <div className="absolute bottom-2 right-2 bg-black/80 text-white text-xs px-2 py-0.5 rounded backdrop-blur-sm font-medium">
                  {video.duration}
                </div>
              </div>

              <div className="p-3">
                <h3
                  className="font-bold text-lg mb-2 text-gray-900 dark:text-white cursor-pointer hover:text-fb-blue transition text-start"
                  onClick={() => openTheaterMode(video.id)}
                >
                  {video.title}
                </h3>
                <div className="flex items-center text-sm text-gray-500 dark:text-gray-400 mb-4 gap-4 font-bold">
                  <span className="flex items-center gap-1"><Eye className="w-4 h-4" /> {video.views} {t.common_views || (language === 'ar' ? 'مشاهدة' : 'views')}</span>
                  <span className="w-1 h-1 bg-gray-300 dark:bg-gray-600 rounded-full"></span>
                  <span className="flex items-center gap-1"><ThumbsUp className="w-3 h-3" /> {video.likes}</span>
                </div>

                <div className="flex flex-wrap items-center gap-2 border-t border-gray-100 dark:border-gray-700 pt-2 relative">
                  {showReactionsFor === video.id && (
                    <div
                      className={`absolute bottom-full mb-2 bg-white dark:bg-gray-700 shadow-2xl rounded-full p-2 flex gap-2 animate-bounce-in z-20 border border-gray-200 dark:border-gray-600 left-0 right-0 mx-auto w-fit max-w-[90vw] overflow-x-auto no-scrollbar`}
                      onMouseLeave={() => setShowReactionsFor(null)}
                    >
                      {reactions.map(r => (
                        <button
                          key={r.name}
                          onClick={(e) => handleLike(e, video.id, r.name)}
                          className="hover:scale-150 transition-transform duration-200 p-1.5 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 relative group flex-shrink-0"
                          title={r.label}
                        >
                          <span className={`text-3xl inline-block ${r.animation || ''}`}>{r.emoji}</span>
                        </button>
                      ))}
                    </div>
                  )}

                  <button
                    onClick={(e) => handleLike(e, video.id)}
                    onMouseEnter={() => { reactionTimerRef.current = setTimeout(() => setShowReactionsFor(video.id), 500); }}
                    onMouseLeave={() => { if (reactionTimerRef.current) clearTimeout(reactionTimerRef.current); }}
                    className={`flex-1 min-w-[80px] flex items-center justify-center gap-2 py-2 hover:bg-gray-50 dark:hover:bg-gray-700 rounded-lg transition font-medium text-sm whitespace-nowrap overflow-hidden ${currentReaction ? currentReaction.color : 'text-gray-600 dark:text-gray-300'}`}
                  >
                    {currentReaction ? <span className="text-xl animate-bounce-in">{currentReaction.emoji}</span> : <ThumbsUp className={`w-5 h-5`} />}
                    <span className={`text-[15px] font-extrabold`}>{currentReaction ? currentReaction.label : (t.common_like || 'Like')}</span>
                  </button>

                  <button
                    onClick={() => toggleComments(video.id)}
                    className="flex-1 min-w-[80px] flex items-center justify-center gap-2 py-2 hover:bg-gray-50 dark:hover:bg-gray-700 rounded-lg text-gray-600 dark:text-gray-300 font-bold text-sm transition whitespace-nowrap overflow-hidden"
                  >
                    <MessageCircle className="w-5 h-5" /> {t.common_comment || (language === 'ar' ? 'تعليق' : 'Comment')}
                  </button>
                  <button
                    onClick={() => handleShare(video.title)}
                    className="flex-1 min-w-[80px] flex items-center justify-center gap-2 py-2 hover:bg-gray-50 dark:hover:bg-gray-700 rounded-lg text-gray-600 dark:text-gray-300 font-bold text-sm transition whitespace-nowrap overflow-hidden"
                  >
                    <Share2 className="w-5 h-5" /> {t.common_share || (language === 'ar' ? 'مشاركة' : 'Share')}
                  </button>
                </div>
              </div>

              {expandedCommentsId === video.id && (
                <div className="px-4 py-3 bg-gray-50 dark:bg-gray-900/50 border-t border-gray-100 dark:border-gray-700 animate-slideUp">
                  <div className="space-y-4 mb-4">
                    {comments[video.id]?.map(comment => renderCommentItem(comment, video.id))}
                    {(!comments[video.id] || comments[video.id].length === 0) && (
                      <p className="text-center text-gray-500 dark:text-gray-400 text-sm py-2">{language === 'ar' ? 'كن أول من يعلق على هذا الفيديو!' : 'Be the first to comment on this video!'}</p>
                    )}
                  </div>
                  <div className="flex gap-2 items-center">
                    <img src={currentUser?.avatar || "https://picsum.photos/200/200?random=1"} alt="Me" className="h-8 w-8 rounded-full border border-gray-200 dark:border-gray-700 shadow-sm object-cover" />
                    {renderCommentForm(video.id, false)}
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Theater Mode */}
      {activeVideo && typeof document !== 'undefined' && createPortal(
        <div className="fixed inset-0 z-[5000] bg-black/95 flex flex-col animate-fadeIn overflow-hidden">
          <div className="flex justify-between items-center p-4 text-white bg-gradient-to-b from-black/80 to-transparent flex-shrink-0">
            <div className="flex items-center gap-3">
              <button onClick={closeTheaterMode} className="p-2 hover:bg-white/10 rounded-full transition">
                <X className="w-6 h-6" />
              </button>
              <h3 className="font-bold text-lg line-clamp-1">{activeVideo.title}</h3>
            </div>
            <div className="flex gap-4">
              <button
                onClick={() => { playAudio('pop'); setShowTheaterComments(!showTheaterComments); }}
                className={`p-2 rounded-full transition ${showTheaterComments ? 'bg-fb-blue text-white' : 'hover:bg-white/10 text-white'}`}
                title={language === 'ar' ? 'إظهار/إخفاء التعليقات' : 'Show/Hide Comments'}
              >
                <MessageCircle className="w-6 h-6" />
              </button>
            </div>
          </div>

          <div className="flex-1 flex flex-col md:flex-row overflow-hidden">
            <div 
                className="flex-1 flex items-center justify-center relative bg-black"
                onWheel={handleTheaterScroll}
            >
              <video
                ref={videoRef}
                src={activeVideo.videoUrl}
                className="w-full h-full max-h-[85vh] object-contain"
                controls
                autoPlay
              />
            </div>

            {showTheaterComments && (
              <div className="w-full md:w-[350px] h-[40%] md:h-full bg-white dark:bg-gray-900 border-t md:border-t-0 md:border-l border-gray-200 dark:border-gray-800 flex flex-col transition-all duration-300 animate-slideUp md:animate-slideLeft">
                <div className="p-4 border-b border-gray-100 dark:border-gray-700 flex items-center justify-between">
                  <h4 className="font-bold text-gray-900 dark:text-white">{t.common_comments || (language === 'ar' ? 'التعليقات' : 'Comments')}</h4>
                  <span className="text-xs text-gray-500 dark:text-gray-400 font-bold">{comments[activeVideo.id]?.length || 0} {t.common_comment || (language === 'ar' ? 'تعليق' : 'comment')}</span>
                </div>

                <div className="flex-1 overflow-y-auto p-4 space-y-4">
                  {(!comments[activeVideo.id] || comments[activeVideo.id].length === 0) ? (
                    <div className="text-center text-gray-500 dark:text-gray-400 py-10">
                      <MessageCircle className="w-12 h-12 mx-auto mb-2 opacity-50" />
                      <p>{language === 'ar' ? 'لا توجد تعليقات بعد.' : 'No comments yet.'}<br />{language === 'ar' ? 'كن أول من يعلق!' : 'Be the first to comment!'}</p>
                    </div>
                  ) : (
                    comments[activeVideo.id].map(comment => renderCommentItem(comment, activeVideo.id))
                  )}
                  <div ref={theaterCommentsEndRef} />
                </div>

                <div className="p-4 border-t border-gray-100 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 flex gap-2 items-center">
                  <img src={currentUser?.avatar || "https://picsum.photos/200/200?random=1"} alt="Me" className="h-8 w-8 rounded-full border border-gray-200 dark:border-gray-700 shadow-sm object-cover" />
                  {renderCommentForm(activeVideo.id, true)}
                </div>
              </div>
            )}
          </div>

          <div className="p-4 text-white bg-gray-900 flex-shrink-0 border-t border-t-gray-800">
            <div className="flex flex-col sm:flex-row justify-between items-center max-w-[1200px] mx-auto gap-4">
              <div className="flex items-center gap-4 w-full sm:w-auto overflow-x-auto no-scrollbar pb-1 sm:pb-0">
                <button onClick={(e) => handleLike(e, activeVideo.id)} className={`flex items-center gap-2 px-4 py-2 rounded-full transition flex-shrink-0 ${activeVideo.isLiked ? 'bg-fb-blue' : 'bg-white/10 hover:bg-white/20'}`}>
                  <ThumbsUp className={`w-5 h-5 ${activeVideo.isLiked ? 'fill-current' : ''}`} />
                  <span>{activeVideo.likes}</span>
                </button>
                <button
                  onClick={() => handleSave(activeVideo.id)}
                  className={`flex items-center gap-2 px-4 py-2 rounded-full transition flex-shrink-0 ${savedVideos.some(v => v.id === activeVideo.id) ? 'bg-emerald-700' : 'bg-white/10 hover:bg-white/20'}`}
                >
                  {savedVideos.some(v => v.id === activeVideo.id) ? <BookmarkMinus className="w-5 h-5 fill-current" /> : <Bookmark className="w-5 h-5" />}
                  <span>{savedVideos.some(v => v.id === activeVideo.id) ? (language === 'ar' ? 'تم الحفظ' : 'Saved') : (language === 'ar' ? 'حفظ الفيديو' : 'Save Video')}</span>
                </button>
                <button onClick={() => handleShare(activeVideo.title)} className="flex items-center gap-2 px-4 py-2 bg-white/10 hover:bg-white/20 rounded-full transition flex-shrink-0">
                  <Share2 className="w-5 h-5" />
                  <span className="hidden sm:inline">{t.common_share || (language === 'ar' ? 'مشاركة' : 'Share')}</span>
                </button>
              </div>
              <div className="flex items-center gap-3 w-full sm:w-auto justify-end">
                <img src={activeVideo.channelAvatar} className="w-10 h-10 rounded-full border border-white/20" alt={activeVideo.channelName} />
                <div className="hidden sm:block text-start">
                  <div className="font-bold text-sm">{activeVideo.channelName}</div>
                  <div className="text-xs text-gray-400">{activeVideo.views} {t.common_views || (language === 'ar' ? 'مشاهدة' : 'views')}</div>
                </div>
              </div>
            </div>
          </div>
        </div>,
        document.body
      )}

      {/* Share Modal */}
      {showShareModal && shareData && typeof document !== 'undefined' && createPortal(
        <div className="fixed inset-0 z-[6000] bg-black/60 flex items-center justify-center p-4 animate-fadeIn backdrop-blur-sm" onClick={() => setShowShareModal(false)}>
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-2xl w-full max-w-md overflow-hidden animate-scaleIn" onClick={(e) => e.stopPropagation()}>
            <div className="p-4 border-b border-gray-100 dark:border-gray-700 flex justify-between items-center">
              <h3 className="font-bold text-lg text-gray-900 dark:text-white">{language === 'ar' ? 'مشاركة الفيديو' : 'Share Video'}</h3>
              <button onClick={() => setShowShareModal(false)} className="text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full p-1 transition">
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-6">
              <div className="grid grid-cols-4 gap-6 mb-6">
                <button onClick={() => handleSocialShare('facebook')} className="flex flex-col items-center gap-2 group">
                  <div className="w-12 h-12 bg-[#1877F2] rounded-full flex items-center justify-center text-white shadow-md group-hover:scale-110 transition">
                    <Facebook className="w-6 h-6 fill-current" />
                  </div>
                  <span className="text-[10px] font-bold text-gray-500 dark:text-gray-400 uppercase tracking-widest">Facebook</span>
                </button>
                <button onClick={() => handleSocialShare('twitter')} className="flex flex-col items-center gap-2 group">
                  <div className="w-12 h-12 bg-black dark:bg-gray-700 rounded-full flex items-center justify-center text-white shadow-md group-hover:scale-110 transition">
                    <Twitter className="w-5 h-5 fill-current" />
                  </div>
                  <span className="text-[10px] font-bold text-gray-500 dark:text-gray-400 uppercase tracking-widest">X</span>
                </button>
                <button onClick={() => handleSocialShare('whatsapp')} className="flex flex-col items-center gap-2 group">
                  <div className="w-12 h-12 bg-[#25D366] rounded-full flex items-center justify-center text-white shadow-md group-hover:scale-110 transition">
                    <Phone className="w-6 h-6 fill-current" />
                  </div>
                  <span className="text-[10px] font-bold text-gray-500 dark:text-gray-400 uppercase tracking-widest">WhatsApp</span>
                </button>
                <button onClick={handleCopyLink} className="flex flex-col items-center gap-2 group">
                  <div className="w-12 h-12 bg-gray-200 dark:bg-gray-700 rounded-full flex items-center justify-center text-gray-700 dark:text-gray-200 shadow-md group-hover:scale-110 transition border border-white dark:border-gray-600">
                    {copyFeedback ? <Check className="w-6 h-6 text-green-600" /> : <Copy className="w-6 h-6" />}
                  </div>
                  <span className="text-[10px] font-bold text-gray-600 dark:text-gray-300 uppercase tracking-widest">{t.common_copy || 'Copy'}</span>
                </button>
              </div>
              <div className="bg-gray-100 dark:bg-gray-700 p-3 rounded-lg flex items-center gap-2">
                <LinkIcon className="w-4 h-4 text-gray-500 dark:text-gray-400" />
                <input
                  type="text"
                  readOnly
                  value={shareData.url}
                  className="bg-transparent border-none outline-none text-sm text-gray-600 dark:text-gray-300 flex-1 truncate"
                />
                <button onClick={handleCopyLink} className="text-fb-blue text-sm font-bold hover:underline">{language === 'ar' ? 'نسخ' : 'Copy'}</button>
              </div>
            </div>
          </div>
        </div>,
        document.body
      )}

      {/* Report Modal */}
      {showReportModal && typeof document !== 'undefined' && createPortal(
        <div className="fixed inset-0 z-[6000] bg-black/60 flex items-center justify-center p-4 animate-fadeIn backdrop-blur-sm" onClick={() => setShowReportModal(false)}>
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl w-full max-w-sm overflow-hidden animate-scaleIn border border-white/20 dark:border-gray-700" onClick={e => e.stopPropagation()}>
            <div className="p-4 border-b border-gray-100 dark:border-gray-700 flex justify-between items-center bg-gray-50 dark:bg-gray-700/50">
              <h3 className="font-bold text-lg text-gray-900 dark:text-white flex items-center gap-2">
                <AlertTriangle className="w-5 h-5 text-red-500" />
                {t.post_report}
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
              <button onClick={() => setShowReportModal(false)} className="px-6 py-2 text-gray-600 dark:text-gray-300 font-bold hover:bg-gray-100 dark:hover:bg-gray-700 rounded-xl transition text-sm">{t.common_cancel}</button>
              <button
                onClick={handleSubmitReport}
                disabled={!reportReason || isReportSubmitting}
                className="px-8 py-2.5 bg-red-400 text-white font-bold rounded-xl transition shadow-lg disabled:opacity-50 flex items-center gap-2 text-sm"
              >
                {isReportSubmitting && <Loader2 className="w-4 h-4 animate-spin" />}
                {t.common_send}
              </button>
            </div>
          </div>
        </div>,
        document.body
      )}

      {/* Delete Confirmation Modal */}
      {commentToDeleteId && typeof document !== 'undefined' && createPortal(
        <div className="fixed inset-0 z-[6000] bg-black/75 p-4 animate-fadeIn backdrop-blur-sm flex items-center justify-center" onClick={() => setCommentToDeleteId(null)}>
          <div className="bg-white dark:bg-gray-800 rounded-2xl p-7 shadow-2xl w-full max-w-sm border border-gray-200 dark:border-gray-700 animate-scaleIn" onClick={e => e.stopPropagation()}>
            <h3 className="font-extrabold text-xl mb-3 text-gray-900 dark:text-white">{language === 'ar' ? 'حذف التعليق؟' : 'Delete Comment?'}</h3>
            <p className="text-gray-600 dark:text-gray-300 text-sm mb-8 leading-relaxed font-medium text-start">{language === 'ar' ? 'هل أنت متأكد من حذف هذا التعليق نهائياً؟' : 'Are you sure you want to delete this comment permanently?'}</p>
            <div className="flex justify-end gap-3">
              <button onClick={() => setCommentToDeleteId(null)} className="px-6 py-2 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-xl text-sm font-bold transition active:scale-95">{t.common_cancel || 'Cancel'}</button>
              <button
                onClick={() => { handleDeleteComment(activeVideoId || expandedCommentsId || '', commentToDeleteId); }}
                className="px-8 py-2.5 bg-red-600 text-white rounded-xl text-sm font-bold hover:bg-red-700 transition shadow-lg shadow-red-500/20 active:scale-95"
              >
                {language === 'ar' ? 'حذف' : 'Delete'}
              </button>
            </div>
          </div>
        </div>,
        document.body
      )}
    </div>
  );
};

export default Watch;

