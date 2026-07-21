import React, { useState, useEffect, useRef, useLayoutEffect } from 'react';
import { createPortal } from 'react-dom';
import { 
  X, Minus, Send, Phone, Video, MoreHorizontal, ThumbsUp, Image, Smile, Mic, Trash2, 
  Check, PhoneOff, AlertCircle, Play, Maximize2, Download, 
  CheckCheck, Reply, ZoomIn, ZoomOut, Clock, Cat, Coffee, Gamepad2, Plane, Lightbulb, Flag, Sticker, Search, Heart, Zap, Ghost, Star,
  UserCircle, Palette, Bell, BellOff, ShieldBan, Archive, Type, Eye, ChevronRight,
  Share2, Globe, Pin, Bookmark, Users, UserPlus, Lock, ChevronLeft, ArrowRight, AtSign, BookmarkMinus, Link as LinkIcon, Copy, Facebook, Twitter, Loader2,
  MessageCircle, ExternalLink, Pause, Move, MoreVertical, CornerUpLeft, CornerUpRight, CheckSquare, Square
} from 'lucide-react';
import { User } from '../types';
import { useLanguage } from '../context/LanguageContext';

// --- Interfaces ---

interface ChatMessage {
  id: string;
  text?: string;
  mediaUrl?: string;
  sender: 'me' | 'them';
  timestamp: string;
  rawTimestamp: number;
  type: 'text' | 'image' | 'video' | 'emoji' | 'sticker' | 'system' | 'audio' | 'voice' | 'link';
  fileName?: string;
  status: 'sending' | 'sent' | 'delivered' | 'seen';
  replyTo?: string;
  reactions: { [emoji: string]: number };
  myReaction?: string;
  linkPreview?: LinkPreviewData;
  emojiSize?: number;
  readReceiptEnabled?: boolean;
}

interface LinkPreviewData {
  url: string;
  title?: string;
  image?: string;
  description?: string;
}

interface PendingMedia {
  file: File;
  url: string;
  type: 'image' | 'video';
}

interface ChatWindowProps {
  user: User;
  onClose: () => void;
  currentUser: User;
  index: number;
}

interface Theme {
  name: string;
  id: string;
  background: string;
  bubble: string;
  sentTextColor?: string;
}

// --- Constants & Data ---
const CHAT_WIDTH = 338;
const CHAT_GAP = 8;

const getThemes = (lang: string) => [
  { name: lang === 'ar' ? 'افتراضي' : 'Default', id: 'default', background: 'bg-white dark:bg-gray-900', bubble: 'bg-blue-600' },
  { name: lang === 'ar' ? 'محيط' : 'Ocean', id: 'ocean', background: 'bg-gradient-to-b from-blue-50 to-blue-100 dark:from-gray-900 dark:to-blue-900/20', bubble: 'bg-cyan-600' },
  { name: lang === 'ar' ? 'حب' : 'Love', id: 'love', background: 'bg-gradient-to-br from-pink-50 via-red-50 to-pink-100 dark:from-pink-900/20 dark:via-red-900/20 dark:to-pink-900/10', bubble: 'bg-pink-500' },
  { name: lang === 'ar' ? 'صداقة' : 'Friendship', id: 'friendship', background: 'bg-gradient-to-tr from-yellow-50 via-orange-50 to-blue-50 dark:from-yellow-900/20 dark:via-orange-900/20 dark:to-blue-900/20', bubble: 'bg-indigo-500' },
  { name: lang === 'ar' ? 'هدوء' : 'Tranquility', id: 'tranquility', background: 'bg-gradient-to-b from-teal-50 to-emerald-50 dark:from-teal-900/20 dark:to-emerald-900/20', bubble: 'bg-teal-600' },
  { name: lang === 'ar' ? 'غروب' : 'Sunset', id: 'sunset', background: 'bg-gradient-to-b from-orange-50 to-pink-50 dark:from-gray-900 dark:to-red-900/20', bubble: 'bg-orange-600' },
  { name: lang === 'ar' ? 'توت' : 'Berry', id: 'berry', background: 'bg-gradient-to-br from-purple-50 to-indigo-50 dark:from-gray-900 dark:to-purple-900/20', bubble: 'bg-purple-600' },
  { name: lang === 'ar' ? 'غابة' : 'Forest', id: 'forest', background: 'bg-gradient-to-b from-green-50 to-emerald-50 dark:from-gray-900 dark:to-green-900/20', bubble: 'bg-emerald-600' },
  { name: lang === 'ar' ? 'ليلي' : 'Midnight', id: 'midnight', background: 'bg-gray-100 dark:bg-gray-800', bubble: 'bg-gray-800 dark:bg-gray-600' },
  { name: lang === 'ar' ? 'مجرة' : 'Galaxy', id: 'galaxy', background: 'bg-gradient-to-br from-indigo-900 via-purple-900 to-black', bubble: 'bg-indigo-500' },
  { name: lang === 'ar' ? 'صبغ' : 'Tie Dye', id: 'tie_dye', background: 'bg-gradient-to-r from-pink-100 via-purple-100 to-indigo-100 dark:from-pink-900/20 dark:via-purple-900/20 dark:to-indigo-900/20', bubble: 'bg-violet-600' },
  { name: lang === 'ar' ? 'أرض' : 'Earth', id: 'earth', background: 'bg-gradient-to-b from-stone-50 to-stone-100 dark:from-stone-900 dark:to-stone-800', bubble: 'bg-stone-600' },
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

const STICKER_CATEGORIES = {
  animals: {
    icon: Cat,
    label: "animals",
    stickers: [
      { id: 'st1', url: 'https://cdn-icons-png.flaticon.com/512/4712/4712109.png', alt: 'Happy Cat' },
      { id: 'st2', url: 'https://cdn-icons-png.flaticon.com/512/4712/4712139.png', alt: 'Love Cat' },
      { id: 'st3', url: 'https://cdn-icons-png.flaticon.com/512/4712/4712093.png', alt: 'Sad Cat' },
      { id: 'st4', url: 'https://cdn-icons-png.flaticon.com/512/4712/4712128.png', alt: 'Angry Cat' },
      { id: 'st5', url: 'https://cdn-icons-png.flaticon.com/512/4712/4712102.png', alt: 'Surprised Cat' },
      { id: 'st6', url: 'https://cdn-icons-png.flaticon.com/512/4712/4712147.png', alt: 'Cool Cat' },
      { id: 'cat7', url: 'https://cdn-icons-png.flaticon.com/512/4712/4712147.png', alt: 'Crying Cat' },
      { id: 'cat8', url: 'https://cdn-icons-png.flaticon.com/512/4712/4712156.png', alt: 'Laughing Cat' },
      { id: 'cat9', url: 'https://cdn-icons-png.flaticon.com/512/4712/4712163.png', alt: 'Sleeping Cat' },
      { id: 'cat10', url: 'https://cdn-icons-png.flaticon.com/512/4712/4712174.png', alt: 'Scared Cat' },
      { id: 'cat11', url: 'https://cdn-icons-png.flaticon.com/512/4712/4712182.png', alt: 'Shy Cat' },
      { id: 'cat12', url: 'https://cdn-icons-png.flaticon.com/512/4712/4712191.png', alt: 'Smart Cat' },
      { id: 'cat13', url: 'https://cdn-icons-png.flaticon.com/512/4712/4712200.png', alt: 'Party Cat' },
      { id: 'cat14', url: 'https://cdn-icons-png.flaticon.com/512/4712/4712210.png', alt: 'Devil Cat' },
      { id: 'cat15', url: 'https://cdn-icons-png.flaticon.com/512/4712/4712220.png', alt: 'Angel Cat' },
      { id: 'cat16', url: 'https://cdn-icons-png.flaticon.com/512/4712/4712230.png', alt: 'Hungry Cat' },
      { id: 'cat17', url: 'https://cdn-icons-png.flaticon.com/512/4712/4712240.png', alt: 'Kiss Cat' },
      { id: 'cat18', url: 'https://cdn-icons-png.flaticon.com/512/4712/4712250.png', alt: 'Broken Heart Cat' },
      { id: 'cat19', url: 'https://cdn-icons-png.flaticon.com/512/4712/4712260.png', alt: 'Tired Cat' },
      { id: 'cat20', url: 'https://cdn-icons-png.flaticon.com/512/4712/4712270.png', alt: 'Excited Cat' },
      { id: 'st7', url: 'https://cdn-icons-png.flaticon.com/512/4712/4712116.png', alt: 'Sleepy Cat' },
      { id: 'st6_dog', url: 'https://cdn-icons-png.flaticon.com/512/10603/10603770.png', alt: 'Cool Dog' },
      { id: 'st7_dog', url: 'https://cdn-icons-png.flaticon.com/512/10603/10603728.png', alt: 'Laughing Dog' },
      { id: 'dog3', url: 'https://cdn-icons-png.flaticon.com/512/10603/10603741.png', alt: 'Happy Dog' },
      { id: 'dog4', url: 'https://cdn-icons-png.flaticon.com/512/10603/10603756.png', alt: 'Love Dog' },
    ]
  },
  reactions: {
    icon: Zap,
    label: "reactions",
    stickers: [
      { id: 'st8', url: 'https://cdn-icons-png.flaticon.com/512/766/766023.png', alt: 'High Five' },
      { id: 'st9', url: 'https://cdn-icons-png.flaticon.com/512/766/766029.png', alt: 'Cheers' },
      { id: 'st10', url: 'https://cdn-icons-png.flaticon.com/512/766/766018.png', alt: 'Celebration' },
      { id: 'st13', url: 'https://cdn-icons-png.flaticon.com/512/1629/1629881.png', alt: 'Star' },
      { id: 'st14', url: 'https://cdn-icons-png.flaticon.com/512/1629/1629852.png', alt: 'Fire' },
      { id: 'st25', url: 'https://cdn-icons-png.flaticon.com/512/833/833601.png', alt: 'Thumbs Up' },
      { id: 'st26', url: 'https://cdn-icons-png.flaticon.com/512/833/833631.png', alt: 'Love' },
      { id: 'st15_party', url: 'https://cdn-icons-png.flaticon.com/512/766/766014.png', alt: 'Party' },
    ]
  },
  love: {
    icon: Heart,
    label: "love",
    stickers: [
        { id: 'st15_heart', url: 'https://cdn-icons-png.flaticon.com/512/2904/2904973.png', alt: 'Heart' },
        { id: 'st16', url: 'https://cdn-icons-png.flaticon.com/512/2904/2904843.png', alt: 'Love Letter' },
        { id: 'st17', url: 'https://cdn-icons-png.flaticon.com/512/742/742750.png', alt: 'Kiss' },
        { id: 'st18', url: 'https://cdn-icons-png.flaticon.com/512/2904/2904857.png', alt: 'Rose' },
        { id: 'st19', url: 'https://cdn-icons-png.flaticon.com/512/2589/2589175.png', alt: 'Heart Eyes' },
        { id: 'st20', url: 'https://cdn-icons-png.flaticon.com/512/2589/2589197.png', alt: 'Laugh Cry' },
        { id: 'st21', url: 'https://cdn-icons-png.flaticon.com/512/2589/2589182.png', alt: 'Cool Emoji' },
        { id: 'st22', url: 'https://cdn-icons-png.flaticon.com/512/2589/2589214.png', alt: 'Angry Emoji' },
        
    ]
  },
  characters: {
    icon: Ghost,
    label: "characters",
    stickers: [
      { id: 'st11', url: 'https://cdn-icons-png.flaticon.com/512/4193/4193239.png', alt: 'Ghost' },
      { id: 'st12', url: 'https://cdn-icons-png.flaticon.com/512/4193/4193278.png', alt: 'Alien' },
      { id: 'st19_robot', url: 'https://cdn-icons-png.flaticon.com/512/4193/4193248.png', alt: 'Robot' },
      { id: 'st20_monster', url: 'https://cdn-icons-png.flaticon.com/512/4193/4193299.png', alt: 'Monster' },
      { id: 'fun4', url: 'https://cdn-icons-png.flaticon.com/512/4193/4193246.png', alt: 'Devil' },
      { id: 'fun5', url: 'https://cdn-icons-png.flaticon.com/512/4193/4193253.png', alt: 'Zombie' },
      { id: 'fun6', url: 'https://cdn-icons-png.flaticon.com/512/4193/4193286.png', alt: 'Vampire' },
      { id: 'fun7', url: 'https://cdn-icons-png.flaticon.com/512/4193/4193294.png', alt: 'Skull' },
      { id: 'fun8', url: 'https://cdn-icons-png.flaticon.com/512/4193/4193301.png', alt: 'Pumpkin' },
      { id: 'fun9', url: 'https://cdn-icons-png.flaticon.com/512/4193/4193310.png', alt: 'Witch Hat' },
      { id: 'fun11', url: 'https://cdn-icons-png.flaticon.com/512/4193/4193331.png', alt: 'Spider' },
      { id: 'fun12', url: 'https://cdn-icons-png.flaticon.com/512/4193/4193340.png', alt: 'UFO' },
      { id: 'fun13', url: 'https://cdn-icons-png.flaticon.com/512/4193/4193352.png', alt: 'Robot Head' },
    ]
  }
};

const FRIENDS_LIST = [
  { id: 'f1', name: 'أحمد محمد', avatar: 'https://i.pravatar.cc/150?u=f1' },
  { id: 'f2', name: 'سارة علي', avatar: 'https://i.pravatar.cc/150?u=f2' },
  { id: 'f3', name: 'خالد عمر', avatar: 'https://i.pravatar.cc/150?u=f3' },
  { id: 'f4', name: 'منى سعيد', avatar: 'https://i.pravatar.cc/150?u=f4' },
  { id: 'f5', name: 'يوسف حسن', avatar: 'https://i.pravatar.cc/150?u=f5' },
];

const REACTIONS_LIST = [
    { name: 'like', label: 'إعجاب', emoji: '👍', color: 'text-blue-600', animation: 'animate-bounce' },
    { name: 'love', label: 'أحببته', emoji: '❤️', color: 'text-red-600', animation: 'animate-pulse' },
    { name: 'care', label: 'أدعمك', emoji: '🥰', color: 'text-yellow-500', animation: 'animate-bounce' },
    { name: 'haha', label: 'هاها', emoji: '😆', color: 'text-yellow-500', animation: 'animate-bounce' },
    { name: 'wow', label: 'واو', emoji: '😮', color: 'text-yellow-500', animation: 'animate-pulse' },
    { name: 'sad', label: 'أحزنني', emoji: '😢', color: 'text-yellow-500', animation: 'animate-bounce' },
    { name: 'angry', label: 'أغضبني', emoji: '😡', color: 'text-orange-600', animation: 'animate-bounce' },
];

// --- Mock WebSocket Service ---
class MockWebSocket {
  private listeners: { [key: string]: Function[] } = {};
  
  connect() {
    console.log('Mock Socket Connected');
  }

  emit(event: string, data: any) {
    setTimeout(() => {
      if (event === 'send_message') {
        this.trigger('message_status_update', { id: data.id, status: 'delivered' });
        setTimeout(() => {
          this.trigger('message_status_update', { id: data.id, status: 'seen' });
        }, 3000);

        this.trigger('partner_typing_start', {});
        setTimeout(() => {
            this.trigger('partner_typing_stop', {});
        }, 2000);
      }
    }, 500);
  }

  on(event: string, callback: Function) {
    if (!this.listeners[event]) this.listeners[event] = [];
    this.listeners[event].push(callback);
  }

  off(event: string, callback: Function) {
    if (!this.listeners[event]) return;
    this.listeners[event] = this.listeners[event].filter(cb => cb !== callback);
  }

  trigger(event: string, data: any) {
    if (this.listeners[event]) {
      this.listeners[event].forEach(cb => cb(data));
    }
  }
}

const socket = new MockWebSocket();

// --- Audio Player Component ---
const AudioPlayer = ({ src, sender }: { src: string, sender: 'me' | 'them' }) => {
  const audioRef = useRef<HTMLAudioElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const onTimeUpdate = () => setCurrentTime(audio.currentTime);
    const onLoadedMetadata = () => setDuration(audio.duration);
    const onEnded = () => setIsPlaying(false);

    audio.addEventListener('timeupdate', onTimeUpdate);
    audio.addEventListener('loadedmetadata', onLoadedMetadata);
    audio.addEventListener('ended', onEnded);
    return () => {
      audio.removeEventListener('timeupdate', onTimeUpdate);
      audio.removeEventListener('loadedmetadata', onLoadedMetadata);
      audio.removeEventListener('ended', onEnded);
    };
  }, []);

  const togglePlay = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!audioRef.current) return;
    if (isPlaying) audioRef.current.pause();
    else audioRef.current.play();
    setIsPlaying(!isPlaying);
  };
  
  const formatTime = (t: number) => {
    if (!t) return "0:00";
    const m = Math.floor(t / 60);
    const s = Math.floor(t % 60);
    return `${m}:${s < 10 ? '0' : ''}${s}`;
  };

  const btnClass = sender === 'me' ? 'bg-white/20 hover:bg-white/30' : 'bg-gray-200 dark:bg-gray-600 hover:bg-gray-300 dark:hover:bg-gray-500';
  const textClass = sender === 'me' ? 'text-white' : 'text-gray-600 dark:text-gray-200';
  const trackClass = sender === 'me' ? 'bg-white/30' : 'bg-gray-300 dark:bg-gray-600';

  return (
    <div className="flex items-center gap-2 min-w-[200px] p-1">
        <audio ref={audioRef} src={src} className="hidden" preload="metadata" />
        <button onClick={togglePlay} className={`p-2 rounded-full transition ${btnClass}`}>
            {isPlaying ? <Pause className={`w-4 h-4 fill-current ${textClass}`} /> : <Play className={`w-4 h-4 fill-current ${textClass}`} />}
        </button>
        <div className="flex-1 flex flex-col justify-center gap-1">
            <input 
              type="range" 
              min="0" 
              max={duration || 100} 
              value={currentTime} 
              onClick={(e) => e.stopPropagation()}
              onChange={(e) => {
                const val = Number(e.target.value);
                if (audioRef.current) audioRef.current.currentTime = val;
                setCurrentTime(val);
              }}
              className={`w-full h-1 rounded-lg appearance-none cursor-pointer ${trackClass}`}
            />
            <div className={`flex justify-between text-[10px] opacity-80 ${textClass}`}>
               <span>{formatTime(currentTime)}</span>
               <span>{formatTime(duration)}</span>
            </div>
        </div>
    </div>
  );
};

const ChatWindow: React.FC<ChatWindowProps> = ({ user, onClose, currentUser, index }) => {
  const { t, dir, language } = useLanguage();
  const THEMES = getThemes(language);
  
  const getStorageKey = () => `chat_${currentUser.id}_${user.id}`;
  const getSettingsKey = () => `chat_settings_${currentUser.id}_${user.id}`;

  // --- Settings State ---
  const [settings, setSettings] = useState(() => {
    const saved = localStorage.getItem(getSettingsKey());
    return saved ? JSON.parse(saved) : {
      theme: THEMES[0], // Store full theme object
      nickname: '',
      quickEmoji: '👍',
      isMuted: false,
      isBlocked: false,
      readReceipts: true,
      readReceiptText: ''
    };
  });

  const [messages, setMessages] = useState<ChatMessage[]>(() => {
    const saved = localStorage.getItem(getStorageKey());
    return saved ? JSON.parse(saved) : [
      { 
        id: '1', 
        text: language === 'ar' ? 'مرحباً! كيف حالك؟' : 'Hello! How are you?', 
        sender: 'them', 
        timestamp: '10:00 ' + (language === 'ar' ? 'م' : 'PM'), 
        rawTimestamp: Date.now(),
        type: 'text', 
        status: 'seen', 
        reactions: {},
        readReceiptEnabled: true
      }
    ];
  });

  const [inputText, setInputText] = useState('');
  const [isMinimized, setIsMinimized] = useState(false);
  
  // Advanced Features State
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [showMoreMenu, setShowMoreMenu] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const [replyingTo, setReplyingTo] = useState<ChatMessage | null>(null);
  const [activeReactionId, setActiveReactionId] = useState<string | null>(null);
  
  // New Emoji Picker States
  const [activeEmojiTab, setActiveEmojiTab] = useState<'recent' | keyof typeof EMOJI_CATEGORIES>('recent');
  const [activeStickerTab, setActiveStickerTab] = useState<keyof typeof STICKER_CATEGORIES>('animals');
  const [pickerMode, setPickerMode] = useState<'emoji' | 'sticker'>('emoji');
  const [recentEmojis, setRecentEmojis] = useState<string[]>([]);
  const [emojiSearch, setEmojiSearch] = useState('');
  const [pendingEmojis, setPendingEmojis] = useState('');
  const tempRecentEmojis = useRef<string[]>([]); 

  // Reaction Mode State
  const [messageReactionTarget, setMessageReactionTarget] = useState<string | null>(null);

  // Modals State
  const [activeModal, setActiveModal] = useState<'report' | 'readReceipts' | 'theme' | 'emoji' | 'nickname' | 'deleteConfirm' | 'deleteMessageConfirm' | 'unsend' | 'forward' | null>(null);
  const [modalInput, setModalInput] = useState('');
  const [reportReason, setReportReason] = useState('');
  const [selectedMessageId, setSelectedMessageId] = useState<string | null>(null);
  const [forwardStatus, setForwardStatus] = useState<{[key: string]: 'idle' | 'sent'}>({});
  const [unsendOption, setUnsendOption] = useState<'everyone' | 'me'>('everyone');

  // Theme Preview State
  const [previewTheme, setPreviewTheme] = useState<Theme>(settings.theme);

  // File Upload State
  const [pendingMedia, setPendingMedia] = useState<PendingMedia | null>(null);

  // Audio Recording State
  const [isRecording, setIsRecording] = useState(false);
  const [recordingDuration, setRecordingDuration] = useState(0);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  
  // Call State
  const [callStatus, setCallStatus] = useState<'idle' | 'calling' | 'connected' | 'ended'>('idle');
  const [callType, setCallType] = useState<'audio' | 'video' | null>(null);
  const [callDuration, setCallDuration] = useState(0);
  const [localStream, setLocalStream] = useState<MediaStream | null>(null);
  const [remoteStream, setRemoteStream] = useState<MediaStream | null>(null);

  // Media Viewer State
  const [viewingMedia, setViewingMedia] = useState<{ message: ChatMessage, type: 'image' | 'video' | 'sticker' } | null>(null);
  const [zoomLevel, setZoomLevel] = useState(1);
  const [pan, setPan] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });

  // Emoji Long Press State
  const [quickEmojiSize, setQuickEmojiSize] = useState(1);
  const [isLongPressing, setIsLongPressing] = useState(false);
  const longPressIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  // Message Actions State
  const [messageMenuOpen, setMessageMenuOpen] = useState<string | null>(null);
  const [confirmReactionRemove, setConfirmReactionRemove] = useState<{ msgId: string, emoji: string } | null>(null);

  // Media Modal State (for Sidebar - now unused in UI but kept for compatibility)
  const [modalCommentText, setModalCommentText] = useState('');
  const [showMediaReactions, setShowMediaReactions] = useState(false);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const replyTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const callTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const durationIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const recordingIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const chatContainerRef = useRef<HTMLDivElement>(null);
  const localVideoRef = useRef<HTMLVideoElement>(null);
  const remoteVideoRef = useRef<HTMLVideoElement>(null);
  const modalCommentInputRef = useRef<HTMLInputElement>(null);

  // Update Position Logic for Tighter Spacing
  const positionStyle = dir === 'rtl' 
    ? { left: `${16 + index * (CHAT_WIDTH + CHAT_GAP)}px` } 
    : { right: `${16 + index * (CHAT_WIDTH + CHAT_GAP)}px` };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  // --- Effects ---

  useEffect(() => {
    localStorage.setItem(getStorageKey(), JSON.stringify(messages));
  }, [messages, currentUser.id, user.id]);

  useEffect(() => {
    localStorage.setItem(getSettingsKey(), JSON.stringify(settings));
  }, [settings, currentUser.id, user.id]);

  useEffect(() => {
      const savedRecents = localStorage.getItem('chat_recent_emojis');
      if (savedRecents) {
          setRecentEmojis(JSON.parse(savedRecents));
      }
  }, []);

  useEffect(() => {
    socket.connect();

    const handleStatusUpdate = ({ id, status }: { id: string, status: 'sent'|'delivered'|'seen' }) => {
      setMessages(prev => prev.map(msg => msg.id === id ? { ...msg, status } : msg));
    };

    const handleTypingStart = () => setIsTyping(true);
    const handleTypingStop = () => setIsTyping(false);

    socket.on('message_status_update', handleStatusUpdate);
    socket.on('partner_typing_start', handleTypingStart);
    socket.on('partner_typing_stop', handleTypingStop);

    return () => {
      socket.off('message_status_update', handleStatusUpdate);
      socket.off('partner_typing_start', handleTypingStart);
      socket.off('partner_typing_stop', handleTypingStop);
    };
  }, []);

  useLayoutEffect(() => {
    scrollToBottom();
  }, [messages, isMinimized, callStatus, isTyping, replyingTo, pendingMedia]);

  useEffect(() => {
    return () => {
      if (replyTimeoutRef.current) clearTimeout(replyTimeoutRef.current);
      if (callTimeoutRef.current) clearTimeout(callTimeoutRef.current);
      if (durationIntervalRef.current) clearInterval(durationIntervalRef.current);
      if (recordingIntervalRef.current) clearInterval(recordingIntervalRef.current);
      if (longPressIntervalRef.current) clearInterval(longPressIntervalRef.current);
      if (localStream) localStream.getTracks().forEach(track => track.stop());
      if (remoteStream) remoteStream.getTracks().forEach(track => track.stop());
      if (pendingMedia) URL.revokeObjectURL(pendingMedia.url);
    };
  }, [localStream, remoteStream]);

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

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      // Global handling for menus inside chat window
      if (messageMenuOpen) {
          const target = event.target as HTMLElement;
          if (!target.closest('.message-menu-container') && !target.closest('.message-menu-trigger')) {
             setMessageMenuOpen(null);
          }
      }
      
      if (chatContainerRef.current && !chatContainerRef.current.contains(event.target as Node)) {
        setShowEmojiPicker(false);
        setShowMoreMenu(false);
        setActiveReactionId(null);
        setMessageReactionTarget(null);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [messageMenuOpen]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setViewingMedia(null);
    };
    if (viewingMedia) window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [viewingMedia]);

  useEffect(() => {
    if (localVideoRef.current && localStream) {
      localVideoRef.current.srcObject = localStream;
    } 
    if (remoteVideoRef.current && remoteStream) {
      remoteVideoRef.current.srcObject = remoteStream;
    }
  }, [localStream, remoteStream, callStatus]);

  useEffect(() => {
    if (!showEmojiPicker) {
      setPendingEmojis('');
      // Reset picker mode when closed if it was in reaction mode
      if (messageReactionTarget) {
          setMessageReactionTarget(null);
          setPickerMode('emoji');
      }
    }
  }, [showEmojiPicker]);

  useEffect(() => {
    setZoomLevel(1);
    setPan({ x: 0, y: 0 });
  }, [viewingMedia]);

  // --- Logic Helpers ---

  const isVideo = (url: string) => {
    return url.startsWith('data:video/') || url.includes('.mp4') || url.includes('.webm') || url.includes('.ogg');
  };

  const fetchLinkPreview = async (text: string): Promise<LinkPreviewData | undefined> => {
    const urlRegex = /(https?:\/\/[^\s]+)/g;
    const match = text.match(urlRegex);
    if (match && match[0]) {
      return new Promise(resolve => {
        setTimeout(() => {
          resolve({
            url: match[0],
            title: 'Mock Page Title for ' + match[0],
            description: 'This is a simulated link preview description that would come from OG tags.',
            image: 'https://via.placeholder.com/300x150?text=Link+Preview'
          });
        }, 500);
      });
    }
    return undefined;
  };

  const createMessage = (content: string, type: ChatMessage['type'] = 'text', mediaUrl?: string, fileName?: string, linkPreview?: LinkPreviewData, emojiSize?: number, replyToId?: string): ChatMessage => ({
    id: crypto.randomUUID ? crypto.randomUUID() : `msg_${Date.now()}_${Math.random()}`,
    text: content,
    mediaUrl,
    fileName,
    sender: 'me',
    type,
    timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    rawTimestamp: Date.now(),
    status: 'sent',
    reactions: {},
    replyTo: replyToId || (replyingTo ? replyingTo.id : undefined),
    linkPreview,
    emojiSize,
    readReceiptEnabled: settings.readReceipts
  });

  const handleSend = async (e?: React.FormEvent, overrideText?: string, overrideReplyTo?: string) => {
    e?.preventDefault();
    
    const textToSend = overrideText !== undefined ? overrideText : inputText;

    if (!textToSend.trim() && !pendingMedia) return;
    if (settings.isBlocked) {
        alert('Cannot send message to blocked user.');
        return;
    }

    let mediaUrl: string | undefined = undefined;
    let msgType: ChatMessage['type'] = 'text';
    let fileName: string | undefined = undefined;

    if (pendingMedia && !overrideText) {
       msgType = pendingMedia.type;
       fileName = pendingMedia.file.name;
       mediaUrl = await new Promise<string>((resolve) => {
          const reader = new FileReader();
          reader.onloadend = () => resolve(reader.result as string);
          reader.readAsDataURL(pendingMedia.file);
       });
    }

    const linkData = (!pendingMedia && textToSend) ? await fetchLinkPreview(textToSend) : undefined;
    if (linkData && msgType === 'text') msgType = 'link';

    const newMessage = createMessage(textToSend, msgType, mediaUrl, fileName, linkData, undefined, overrideReplyTo);
    
    setMessages(prev => [...prev, newMessage]);

    // Process Recents from Temp Buffer on Send
    if (tempRecentEmojis.current.length > 0) {
        const newRecents = [...new Set([...tempRecentEmojis.current, ...recentEmojis])].slice(0, 24);
        setRecentEmojis(newRecents);
        localStorage.setItem('chat_recent_emojis', JSON.stringify(newRecents));
        tempRecentEmojis.current = [];
    }
    
    if (!overrideText) {
        setInputText('');
        setPendingMedia(null);
        setShowEmojiPicker(false);
        setReplyingTo(null);
    }

    socket.emit('send_message', newMessage);
    simulateReply(msgType, newMessage.text);
  };

  // Emoji Long Press Handlers
  const handleQuickEmojiDown = (e: React.MouseEvent | React.TouchEvent) => {
      e.preventDefault();
      if (settings.isBlocked) return;
      setIsLongPressing(true);
      setQuickEmojiSize(1);

      longPressIntervalRef.current = setInterval(() => {
          setQuickEmojiSize(prev => Math.min(prev + 0.1, 3.0));
      }, 100);
  };

  const handleQuickEmojiUp = (e: React.MouseEvent | React.TouchEvent) => {
      e.preventDefault();
      if (settings.isBlocked) return;
      if (!isLongPressing) return;
      
      setIsLongPressing(false);
      if (longPressIntervalRef.current) clearInterval(longPressIntervalRef.current);

      const newMessage = createMessage(settings.quickEmoji, 'emoji', undefined, undefined, undefined, quickEmojiSize);
      setMessages(prev => [...prev, newMessage]);
      socket.emit('send_message', newMessage);
      simulateReply('like');
      
      setTimeout(() => setQuickEmojiSize(1), 200);
  };

  const handleEmojiSelect = (emoji: string) => {
    if (messageReactionTarget) {
        // REACTION MODE: Add reaction immediately, update recents, close picker
        toggleReaction(messageReactionTarget, emoji);
        
        const newRecents = [...new Set([emoji, ...recentEmojis])].slice(0, 24);
        setRecentEmojis(newRecents);
        localStorage.setItem('chat_recent_emojis', JSON.stringify(newRecents));
        
        setShowEmojiPicker(false);
        setMessageReactionTarget(null);
    } else {
        // INPUT MODE: Insert to input, buffer recent
        setInputText(prev => prev + emoji);
        tempRecentEmojis.current.push(emoji);
        setShowEmojiPicker(false);
    }
  };

  const handleStickerSelect = (sticker: { url: string }) => {
      if (settings.isBlocked) return;
      const newMessage = createMessage('', 'sticker', sticker.url);
      setMessages(prev => [...prev, newMessage]);
      socket.emit('send_message', newMessage);
      setShowEmojiPicker(false);
      simulateReply('sticker');
  };

  const startRecording = async () => {
    if (settings.isBlocked) return;
    if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
      alert(language === 'ar' ? 'ميزة التسجيل الصوتي غير مدعومة في هذا المتصفح.' : 'Voice recording is not supported in this browser.');
      return;
    }

    if (pendingMedia) return;

    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      audioChunksRef.current = [];
      
      let mimeType = 'audio/webm';
      if (MediaRecorder.isTypeSupported('audio/webm;codecs=opus')) {
          mimeType = 'audio/webm;codecs=opus';
      } else if (MediaRecorder.isTypeSupported('audio/mp4')) {
          mimeType = 'audio/mp4';
      }

      const mediaRecorder = new MediaRecorder(stream, { mimeType });
      mediaRecorderRef.current = mediaRecorder;

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };

      mediaRecorder.onstop = () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: mimeType });
        const audioUrl = URL.createObjectURL(audioBlob);
        
        const newMessage = createMessage('', 'audio', audioUrl);
        setMessages(prev => [...prev, newMessage]);
        socket.emit('send_message', newMessage);
        simulateReply('audio');
        
        stream.getTracks().forEach(track => track.stop());
      };

      mediaRecorder.start();
      setIsRecording(true); 
    } catch (err: any) {
      console.error('Error recording audio:', err);
      let errorMessage = language === 'ar' ? 'حدث خطأ أثناء محاولة الوصول إلى الميكروفون.' : 'An error occurred while trying to access the microphone.';
      
      if (err.name === 'NotFoundError' || err.name === 'DevicesNotFoundError') {
        errorMessage = language === 'ar' ? 'لم يتم العثور على ميكروفون متصل بجهازك.' : 'No microphone was found connected to your device.';
      } else if (err.name === 'NotAllowedError' || err.name === 'PermissionDeniedError') {
        errorMessage = language === 'ar' ? 'يرجى السماح بالوصول إلى الميكروفون من إعدادات المتصفح.' : 'Please allow microphone access from your browser settings.';
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

  const toggleReaction = (msgId: string, emoji: string) => {
    const msg = messages.find(m => m.id === msgId);
    if (!msg) return;

    if (msg.myReaction === emoji) {
        setConfirmReactionRemove({ msgId, emoji });
    } else {
        setMessages(prev => prev.map(m => {
            if (m.id !== msgId) return m;
            const newReactions = { ...m.reactions };
            
            if (m.myReaction) {
                if (newReactions[m.myReaction] > 0) newReactions[m.myReaction]--;
                if (newReactions[m.myReaction] <= 0) delete newReactions[m.myReaction];
            }
            
            newReactions[emoji] = (newReactions[emoji] || 0) + 1;
            return { ...m, reactions: newReactions, myReaction: emoji };
        }));
    }
    setActiveReactionId(null);
    setShowMediaReactions(false);
  };

  const removeReaction = (msgId: string, emoji: string) => {
      setMessages(prev => prev.map(m => {
          if (m.id !== msgId) return m;
          const newReactions = { ...m.reactions };
          if (newReactions[emoji] > 0) newReactions[emoji]--;
          if (newReactions[emoji] <= 0) delete newReactions[emoji];
          return { ...m, reactions: newReactions, myReaction: undefined };
      }));
      setConfirmReactionRemove(null);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const isImage = file.type.startsWith('image/');
      const isVideo = file.type.startsWith('video/');

      if (!isImage && !isVideo) {
        alert('يرجى اختيار ملف صورة أو فيديو صالح.');
        return;
      }
      
      const maxSize = isVideo ? 50 * 1024 * 1024 : 5 * 1024 * 1024;
      if (file.size > maxSize) {
        alert(`حجم الملف يجب أن لا يتجاوز ${isVideo ? '50' : '5'} ميجابايت.`);
        return;
      }

      const url = URL.createObjectURL(file);
      setPendingMedia({ 
        file,
        url,
        type: isImage ? 'image' : 'video'
      });
    }
    e.target.value = '';
  };

  const removePendingMedia = () => {
      if (pendingMedia) {
          URL.revokeObjectURL(pendingMedia.url);
          setPendingMedia(null);
      }
  };

  const startCall = async (type: 'audio' | 'video') => {
    if (settings.isBlocked) return;
    setCallType(type);
    setCallStatus('calling');
    setCallDuration(0);
    
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: type === 'video',
        audio: true
      });
      setLocalStream(stream);
    } catch (err) {
      console.error("Error accessing media devices:", err);
    }

    callTimeoutRef.current = setTimeout(() => {
      setCallStatus('connected');
      durationIntervalRef.current = setInterval(() => {
        setCallDuration(prev => prev + 1);
      }, 1000);
    }, 2000);
  };

  const endCall = () => {
    if (callTimeoutRef.current) clearTimeout(callTimeoutRef.current);
    if (durationIntervalRef.current) clearInterval(durationIntervalRef.current);
    if (localStream) {
      localStream.getTracks().forEach(track => track.stop());
      setLocalStream(null);
    }
    if (remoteStream) {
       setRemoteStream(null);
    }
    
    const durationText = formatDuration(callDuration);
    const systemMsg: ChatMessage = {
      id: `sys_${Date.now()}`,
      text: `مكالمة ${callType === 'video' ? 'فيديو' : 'صوتية'} انتهت - ${durationText}`,
      sender: 'me',
      type: 'system',
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      rawTimestamp: Date.now(),
      status: 'seen',
      reactions: {}
    };
    
    setMessages(prev => [...prev, systemMsg]);
    setCallStatus('idle');
    setCallType(null);
    setCallDuration(0);
  };

  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  const clearChat = () => {
      setMessages([]);
      localStorage.removeItem(getStorageKey());
      setShowMoreMenu(false);
      setActiveModal(null);
  };

  const simulateReply = (triggerType: string = 'text', content: string = '') => {
    if (replyTimeoutRef.current) clearTimeout(replyTimeoutRef.current);
    if (settings.isBlocked) return;
    
    replyTimeoutRef.current = setTimeout(() => {
      let replyText = 'أنا بخير شكراً لسؤالك! 👍';
      let replyType: ChatMessage['type'] = 'text';
      let mediaUrl: string | undefined = undefined;

      if (triggerType === 'like') {
         replyText = settings.quickEmoji;
         replyType = 'emoji';
      } else if (triggerType === 'sticker') {
         replyText = '';
         replyType = 'sticker';
         mediaUrl = 'https://cdn-icons-png.flaticon.com/512/766/766023.png';
      } else {
          const randomReplies = ['صحيح!', 'اتفق معك تماماً', 'مثير للاهتمام 🤔', 'هلا وضحت أكثر؟'];
          replyText = randomReplies[Math.floor(Math.random() * randomReplies.length)];
      } 
      if (triggerType === 'audio') {
        replyText = '';
        replyType = 'audio';
        mediaUrl = 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3';
      }

      const replyMsg: ChatMessage = {
        id: crypto.randomUUID ? crypto.randomUUID() : `rep_${Date.now()}`,
        text: replyText,
        sender: 'them',
        type: replyType,
        mediaUrl,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        rawTimestamp: Date.now(),
        status: 'seen',
        reactions: {}
      };

      setMessages(prev => [...prev, replyMsg]);
    }, 4000);
  };

  const handleUnsend = () => {
      if (!selectedMessageId) return;
      
      if (unsendOption === 'me') {
          setMessages(prev => prev.filter(m => m.id !== selectedMessageId));
      } else {
          setMessages(prev => prev.filter(m => m.id !== selectedMessageId));
          socket.emit('unsend_message', { id: selectedMessageId });
      }
      setActiveModal(null);
      setSelectedMessageId(null);
  };

  const handleDeleteMessage = () => {
      if (!selectedMessageId) return;
      setMessages(prev => prev.filter(m => m.id !== selectedMessageId));
      setActiveModal(null);
      setSelectedMessageId(null);
  };

  const handleForwardToFriend = (friendId: string) => {
      setForwardStatus(prev => ({ ...prev, [friendId]: 'sent' }));
  };

  // Viewer Drag Handlers
  const handleViewerMouseDown = (e: React.MouseEvent) => {
    e.preventDefault();
    setIsDragging(true);
    setDragStart({ x: e.clientX - pan.x, y: e.clientY - pan.y });
  };

  const handleViewerMouseMove = (e: React.MouseEvent) => {
    if (!isDragging) return;
    e.preventDefault();
    setPan({ x: e.clientX - dragStart.x, y: e.clientY - dragStart.y });
  };

  const handleViewerMouseUp = () => {
    setIsDragging(false);
  };

  // --- Render Helpers ---

  // Reusable Emoji Picker Render Function
  const renderEmojiPickerContent = (onSelect: (val: any) => void, showStickers = true) => {
      return (
         <div className="flex flex-col h-full bg-white dark:bg-gray-800">
             {/* Picker Header */}
             <div className="flex items-center p-2 border-b dark:border-gray-700 bg-gray-50 dark:bg-gray-900 gap-2 flex-shrink-0">
                {showStickers && (
                    <div className="flex bg-gray-200 dark:bg-gray-700 rounded-full p-1 flex-1">
                        <button 
                            onClick={() => setPickerMode('emoji')} 
                            className={`flex-1 text-xs font-bold py-1.5 rounded-full transition ${pickerMode === 'emoji' ? 'bg-white dark:bg-gray-600 shadow-sm text-fb-blue' : 'text-gray-500'}`}
                        >
                            {t.emoji_picker_tab_emoji || (language === 'ar' ? 'رموز' : 'Emojis')}
                        </button>
                        <button 
                            onClick={() => setPickerMode('sticker')} 
                            className={`flex-1 text-xs font-bold py-1.5 rounded-full transition ${pickerMode === 'sticker' ? 'bg-white dark:bg-gray-600 shadow-sm text-fb-blue' : 'text-gray-500'}`}
                        >
                            {t.emoji_picker_tab_stickers || (language === 'ar' ? 'ملصقات' : 'Stickers')}
                        </button>
                    </div>
                )}
                {(!showStickers || pickerMode === 'emoji') && (
                    <div className={`relative ${showStickers ? 'w-1/3' : 'w-full'}`}>
                        <Search className="w-3 h-3 absolute left-2 top-2 text-gray-400" />
                        <input 
                            type="text" 
                            className="w-full pl-6 pr-2 py-1 text-xs bg-gray-200 dark:bg-gray-700 rounded-full outline-none dark:text-white" 
                            placeholder={t.common_search || (language === 'ar' ? 'بحث' : 'Search')}
                            value={emojiSearch}
                            onChange={(e) => setEmojiSearch(e.target.value)}
                        />
                    </div>
                )}
             </div>
             
             {/* Content Area */}
             <div className="flex-1 overflow-y-auto custom-scrollbar">
                {(!showStickers || pickerMode === 'emoji') ? (
                    <div className="p-2">
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
                                                    onClick={() => onSelect(emoji)} 
                                                    className="p-1.5 hover:bg-gray-100 dark:hover:bg-gray-700 rounded text-2xl transition hover:scale-125 hover:animate-pulse"
                                                >
                                                    {emoji}
                                                </button>
                                            ))}
                                        </div>
                                    </div>
                                );
                            })}
                    </div>
                ) : (
                    <div className="p-2">
                            <div className="grid grid-cols-3 gap-2 animate-fadeIn">
                                {STICKER_CATEGORIES[activeStickerTab].stickers.map(sticker => (
                                    <button 
                                    key={sticker.id} 
                                    onClick={() => handleStickerSelect(sticker)}
                                    className="hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg p-2 transition hover:scale-105"
                                    >
                                        <img src={sticker.url} alt={sticker.alt} className="w-full h-auto drop-shadow-sm" />
                                    </button>
                                ))}
                            </div>
                    </div>
                )}
             </div>

             {/* Footer - Category Tabs */}
             <div className="flex items-center justify-between px-2 py-1.5 border-t dark:border-gray-700 bg-gray-50 dark:bg-gray-900 overflow-x-auto no-scrollbar flex-shrink-0">
                {(!showStickers || pickerMode === 'emoji') ? (
                    <>
                        <button 
                            type="button"
                            onClick={() => { setActiveEmojiTab('recent'); setEmojiSearch(''); }}
                            className={`p-2 rounded-lg transition ${activeEmojiTab === 'recent' ? 'text-fb-blue bg-blue-100 dark:bg-blue-900/30' : 'text-gray-400 hover:text-gray-600'}`}
                            title={language === 'ar' ? 'الأخيرة' : 'Recent'}
                        >
                            <Clock className="w-5 h-5" />
                        </button>
                        {Object.entries(EMOJI_CATEGORIES).map(([key, data]) => {
                            const Icon = data.icon;
                            const labelKey = `emoji_category_${data.label}`;
                            const translatedLabel = t[labelKey] || (language === 'ar' ? data.label : key); // Fallback logic
                            return (
                                <button 
                                    key={key} 
                                    type="button"
                                    onClick={() => { setActiveEmojiTab(key as any); setEmojiSearch(''); }}
                                    className={`p-2 rounded-lg transition ${activeEmojiTab === key ? 'text-fb-blue bg-blue-100 dark:bg-blue-900/30' : 'text-gray-400 hover:text-gray-600'}`}
                                    title={translatedLabel}
                                >
                                    <Icon className="w-5 h-5" />
                                </button>
                            );
                        })}
                    </>
                ) : (
                    <>
                        {Object.entries(STICKER_CATEGORIES).map(([key, data]) => {
                            const Icon = data.icon;
                            const labelKey = `sticker_category_${data.label}`;
                            const translatedLabel = t[labelKey] || (language === 'ar' ? data.label : key);
                            return (
                                <button 
                                    key={key}
                                    onClick={() => setActiveStickerTab(key as any)}
                                    className={`p-2 rounded-lg transition ${activeStickerTab === key ? 'text-fb-blue bg-blue-100 dark:bg-blue-900/30' : 'text-gray-400 hover:text-gray-600'}`}
                                    title={translatedLabel}
                                >
                                    <Icon className="w-5 h-5" />
                                </button>
                            );
                        })}
                    </>
                )}
             </div>
         </div>
      );
  };

  // Updated StatusIcon to use per-message ReadReceipt setting
  const StatusIcon = ({ msg }: { msg: ChatMessage }) => {
    const { status, readReceiptEnabled } = msg;

    if (status === 'seen') {
       if (readReceiptEnabled) {
          // Green 900 for Enabled + Seen
          return <CheckCheck className="w-3 h-3 text-emerald-900 dark:text-emerald-400" />;
       }
       return <CheckCheck className="w-3 h-3 text-gray-400" />;
    }

    if (status === 'delivered') return <CheckCheck className="w-3 h-3 text-gray-400" />;
    return <Check className="w-3 h-3 text-gray-400" />;
  };

  const renderModal = () => {
      if (!activeModal && !confirmReactionRemove) return null;

      if (confirmReactionRemove) {
          return createPortal(
              <div className="fixed inset-0 z-[10000] bg-black/50 flex items-center justify-center p-4" onClick={() => setConfirmReactionRemove(null)}>
                  <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-2xl max-w-sm w-full animate-scaleIn flex flex-col items-center" onClick={e => e.stopPropagation()}>
                      <div className="text-4xl mb-4 animate-bounce">{confirmReactionRemove.emoji}</div>
                      <h3 className="font-bold text-lg mb-2 text-gray-900 dark:text-white">{t.chat_remove_reaction_confirm || (language === 'ar' ? 'إزالة التفاعل؟' : 'Remove reaction?')}</h3>
                      <div className="flex justify-center gap-3 w-full mt-4">
                          <button 
                             onClick={() => setConfirmReactionRemove(null)} 
                             className="px-4 py-2 text-gray-600 dark:text-gray-300 font-semibold hover:bg-gray-300 dark:hover:bg-gray-700 rounded-lg transition flex-1"
                          >
                             {t.common_cancel}
                          </button>
                          <button 
                             onClick={() => removeReaction(confirmReactionRemove.msgId, confirmReactionRemove.emoji)} 
                             className="px-4 py-2 bg-green-700 text-white font-semibold rounded-lg hover:bg-blue-700 transition flex-1"
                          >
                             {t.common_remove}
                          </button>
                      </div>
                  </div>
              </div>,
              document.body
          );
      }

      return createPortal(
          <div className="fixed inset-0 z-[10000] bg-black/60 flex items-center justify-center p-4 animate-fadeIn backdrop-blur-sm" onClick={() => setActiveModal(null)}>
              <div className={`bg-white dark:bg-gray-800 rounded-2xl shadow-2xl w-full ${(activeModal === 'theme' || activeModal === 'emoji') ? 'max-w-5xl h-[600px]' : 'max-w-sm'} overflow-hidden animate-scaleIn border border-gray-200 dark:border-gray-700 flex flex-col`} onClick={e => e.stopPropagation()}>
                  <div className="p-4 border-b border-gray-100 dark:border-gray-700 flex justify-between items-center bg-gray-50 dark:bg-gray-700/50 flex-shrink-0">
                      <h3 className="font-bold text-lg text-gray-900 dark:text-white flex items-center gap-2">
                          {activeModal === 'report' && <Flag className="w-5 h-5 text-red-500" />}
                          {activeModal === 'readReceipts' && <Eye className="w-5 h-5 text-blue-500" />}
                          {activeModal === 'theme' && <Palette className="w-5 h-5 text-purple-500" />}
                          {activeModal === 'emoji' && <Smile className="w-5 h-5 text-yellow-500" />}
                          {activeModal === 'nickname' && <Type className="w-5 h-5 text-green-500" />}
                          {activeModal === 'deleteConfirm' && <Trash2 className="w-5 h-5 text-red-600" />}
                          {activeModal === 'deleteMessageConfirm' && <Trash2 className="w-5 h-5 text-red-600" />}
                          {activeModal === 'unsend' && <Trash2 className="w-5 h-5 text-red-600" />}
                          {activeModal === 'forward' && <CornerUpRight className="w-5 h-5 text-blue-600" />}
                          
                          {activeModal === 'report' ? t.common_report : 
                           activeModal === 'readReceipts' ? (language === 'ar' ? 'مؤشرات قراءة الرسائل' : 'Read Receipts') : 
                           activeModal === 'theme' ? (language === 'ar' ? 'تخصيص مظهر الدردشة' : 'Customize Chat Theme') : 
                           activeModal === 'emoji' ? (language === 'ar' ? 'الرمز التعبيري السريع' : 'Quick Emoji') : 
                           activeModal === 'deleteConfirm' ? (language === 'ar' ? 'حذف المحادثة؟' : 'Delete Conversation?') :
                           activeModal === 'deleteMessageConfirm' ? (language === 'ar' ? 'حذف الرسالة' : 'Delete Message') :
                           activeModal === 'unsend' ? (language === 'ar' ? '(إلي من تريد إلغاء إرسال هذه الرسالة؟)' : 'Unsend Message?') :
                           activeModal === 'forward' ? (language === 'ar' ? 'إعادة توجيه الرسالة' : 'Forward Message') :
                           (language === 'ar' ? 'تعديل الكنية' : 'Edit Nickname')}
                      </h3>
                      <button onClick={() => setActiveModal(null)} className="text-gray-500 hover:bg-gray-200 dark:hover:bg-gray-600 rounded-full p-1 transition">
                          <X className="w-5 h-5" />
                      </button>
                  </div>
                  
                  <div className={`p-6 overflow-y-auto ${activeModal === 'theme' ? 'flex-1 p-0 flex' : ''} ${activeModal === 'emoji' ? 'flex-1 p-0' : ''}`}>
                      {activeModal === 'report' && (
                        <div className="space-y-2">
                            {[
                              { ar: 'محتوى غير لائق', en: 'Inappropriate content' },
                              { ar: 'بريد عشوائي (Spam)', en: 'Spam' },
                              { ar: 'مضايقة', en: 'Harassment' },
                              { ar: 'إساءة', en: 'Abuse' },
                              { ar: 'خداع أو احتيال', en: 'Fraud or Scam' },
                              { ar: 'انتحال شخصية شخص آخر', en: 'Impersonation' },
                              { ar: 'غير ذلك', en: 'Other' }
                            ].map((r) => (
                                <label key={r.ar} className="flex items-center gap-3 p-3 border rounded-lg cursor-pointer hover:bg-gray-50 dark:border-gray-600 dark:hover:bg-gray-700">
                                    <input 
                                        type="radio" 
                                        name="reportReason" 
                                        value={language === 'ar' ? r.ar : r.en} 
                                        checked={reportReason === (language === 'ar' ? r.ar : r.en)} 
                                        onChange={(e) => setReportReason(e.target.value)} 
                                        className="w-4 h-4 text-fb-blue"
                                    />
                                    <span className="text-sm text-gray-700 dark:text-gray-200">{language === 'ar' ? r.ar : r.en}</span>
                                </label>
                            ))}
                        </div>
                      )}

                      {activeModal === 'readReceipts' && (
                          <div className="space-y-6">
                              <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700/30 rounded-2xl border border-gray-100 dark:border-gray-700">
                                  <div className="flex flex-col gap-1">
                                      <span className="text-base font-bold text-gray-900 dark:text-white">{language === 'ar' ? 'عرض مؤشرات قراءة الرسائل' : 'Show Read Receipts'}</span>
                                      <span className="text-xs text-gray-500 dark:text-gray-400 leading-relaxed max-w-[240px]">
                                          {language === 'ar' ? `سيتمكن ${user.name} من معرفة أنك قرأت رسالته عندما يتم تفعيل هذا الخيار.` : `${user.name} will know when you've read their messages if enabled.`}
                                      </span>
                                  </div>
                                  <button 
                                      onClick={() => setSettings(prev => ({...prev, readReceipts: !prev.readReceipts}))}
                                      className={`w-14 h-8 rounded-full p-1 transition-all duration-300 ease-in-out shadow-inner relative ${settings.readReceipts ? 'bg-emerald-900' : 'bg-gray-300 dark:bg-gray-600'}`}
                                  >
                                      <div className={`w-6 h-6 bg-white rounded-full shadow-lg transform transition-transform duration-300 absolute top-1 ${settings.readReceipts ? (dir === 'rtl' ? 'left-1' : 'right-1') : (dir === 'rtl' ? 'right-1' : 'left-1')}`}></div>
                                  </button>
                              </div>
                          </div>
                      )}

                      {activeModal === 'theme' && (
                          <div className="flex w-full h-full">
                              <div className="w-1/2 bg-white dark:bg-gray-900 flex flex-col items-center justify-center border-l dark:border-gray-700 relative overflow-hidden">
                                  <div className="absolute inset-0 bg-gray-100 dark:bg-gray-800 pattern-grid opacity-10"></div>
                                  <h4 className="relative z-10 mb-4 font-bold text-gray-500 uppercase tracking-widest text-xs">{language === 'ar' ? 'معاينة المظهر' : 'Theme Preview'}</h4>
                                  <div className={`w-64 h-96 rounded-2xl shadow-2xl border border-gray-200 dark:border-gray-700 overflow-hidden flex flex-col ${previewTheme.background}`}>
                                      <div className="h-12 bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm border-b dark:border-gray-700 flex items-center px-3 gap-2">
                                          <div className="w-8 h-8 rounded-full bg-gray-300"></div>
                                          <div className="flex flex-col">
                                              <div className="w-20 h-2 bg-gray-300 rounded mb-1"></div>
                                              <div className="w-12 h-1.5 bg-gray-200 rounded"></div>
                                          </div>
                                      </div>
                                      <div className="flex-1 p-3 flex flex-col justify-end space-y-3">
                                          <div className="self-start bg-white dark:bg-gray-700 rounded-2xl rounded-bl-none px-3 py-2 max-w-[80%] shadow-sm text-xs text-gray-800 dark:text-gray-200">
                                              {language === 'ar' ? 'مرحباً، كيف حالك؟' : 'Hello, how are you?'}
                                          </div>
                                          <div className={`self-end ${previewTheme.bubble} text-white rounded-2xl rounded-br-none px-3 py-2 max-w-[80%] shadow-sm text-xs`}>
                                              {language === 'ar' ? 'أنا بخير، شكراً لسؤالك! هذا المظهر رائع جداً.' : 'I am fine, thanks! This theme is awesome.'}
                                          </div>
                                      </div>
                                      <div className="h-12 bg-white dark:bg-gray-800 border-t dark:border-gray-700 flex items-center px-2 gap-2">
                                          <div className="w-6 h-6 rounded-full bg-gray-200 dark:bg-gray-600"></div>
                                          <div className="flex-1 h-8 bg-gray-100 dark:bg-gray-700 rounded-full"></div>
                                          <div className={`w-6 h-6 rounded-full ${previewTheme.bubble}`}></div>
                                      </div>
                                  </div>
                                  <p className="mt-4 font-bold text-lg text-gray-800 dark:text-white">{previewTheme.name}</p>
                              </div>

                              <div className="w-1/2 bg-gray-50 dark:bg-gray-800 p-6 overflow-y-auto custom-scrollbar">
                                  <h4 className="font-bold text-gray-900 dark:text-white mb-4">{language === 'ar' ? 'اختر مظهراً' : 'Choose a Theme'}</h4>
                                  <div className="grid grid-cols-3 gap-4">
                                      {THEMES.map(theme => (
                                          <button 
                                            key={theme.id} 
                                            onClick={() => setPreviewTheme(theme)}
                                            className={`aspect-square rounded-xl ${theme.background} shadow-md hover:scale-105 transition flex flex-col items-center justify-center relative overflow-hidden group border-2 ${previewTheme.id === theme.id ? 'border-emerald-500 ring-2 ring-emerald-200' : 'border-gray-200 dark:border-gray-600'}`}
                                          >
                                              <div className={`w-8 h-8 rounded-full ${theme.bubble} mb-2 shadow-sm`}></div>
                                              <span className="bg-white/80 dark:bg-black/60 px-2 py-0.5 rounded text-[10px] font-bold backdrop-blur-sm">{theme.name}</span>
                                              {settings.theme.id === theme.id && (
                                                  <div className="absolute top-2 right-2 bg-emerald-500 text-white rounded-full p-0.5 shadow-sm">
                                                      <Check className="w-3 h-3" />
                                                  </div>
                                              )}
                                          </button>
                                      ))}
                                  </div>
                              </div>
                          </div>
                      )}

                      {activeModal === 'deleteConfirm' && (
                          <div className="text-center">
                              <div className="w-16 h-16 bg-red-100 dark:bg-red-900/20 rounded-full flex items-center justify-center mx-auto mb-4 animate-bounce">
                                  <Trash2 className="w-8 h-8 text-red-600" />
                              </div>
                              <h4 className="font-bold text-gray-900 dark:text-white mb-2">{t.chat_delete_confirm_title || (language === 'ar' ? 'هل تريد حذف المحادثة؟' : 'Delete conversation?') }</h4>
                              <p className="text-sm text-gray-500 dark:text-gray-400 mb-6 leading-relaxed">{t.chat_delete_confirm_desc || (language === 'ar' ? 'سيؤدي هذا إلى حذف نسختك من المحادثة نهائياً. لا يمكن التراجع عن هذا الإجراء.' : 'This will delete your copy of the conversation. This cannot be undone.')}</p>
                          </div>
                      )}

                      {/* New Delete Message Confirmation for 'them' messages */}
                      {activeModal === 'deleteMessageConfirm' && (
                          <div className="text-center">
                              <div className="w-16 h-16 bg-red-100 dark:bg-red-900/20 rounded-full flex items-center justify-center mx-auto mb-4 animate-bounce">
                                  <Trash2 className="w-8 h-8 text-red-600" />
                              </div>
                              <h4 className="font-bold text-gray-900 dark:text-white mb-2">{language === 'ar' ? 'حذف الرسالة' : 'Delete Message'}</h4>
                              <p className="text-sm text-gray-500 dark:text-gray-400 mb-6 leading-relaxed">{language === 'ar' ? '(هل تريد حذف الرسالة؟)' : '(Do you want to delete the message?)'}</p>
                          </div>
                      )}

                      {activeModal === 'unsend' && (
                          <div className="space-y-4">
                              {/* Option 1: Unsend for Everyone */}
                              <button 
                                onClick={() => setUnsendOption('everyone')}
                                className="w-full text-start flex items-start gap-3 p-3 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition"
                              >
                                  <div className={`mt-1 flex-shrink-0 w-6 h-6 rounded border-2 flex items-center justify-center transition-colors ${unsendOption === 'everyone' ? 'bg-emerald-800 border-emerald-800' : 'border-black dark:border-gray-500 bg-transparent'}`}>
                                      {unsendOption === 'everyone' && <Check className="w-4 h-4 text-white" />}
                                  </div>
                                  <div className="flex flex-col">
                                      <span className="font-bold text-gray-900 dark:text-white">{language === 'ar' ? 'إلغاء إلارسال لدي الجميع' : 'Unsend for everyone'}</span>
                                      <span className="text-xs text-gray-500 dark:text-gray-400 mt-1 leading-relaxed">
                                          {language === 'ar' ? 'سيتم إلغاء إرسال هذه الرسالة لجميع المشاركين في المحادثة. قد يكون الآخرون قد شاهدوها أو أعادوا توجيهها.' : 'Message will be unsent for everyone. Others might have seen or forwarded it.'}
                                      </span>
                                  </div>
                              </button>

                              {/* Option 2: Unsend for You */}
                              <button 
                                onClick={() => setUnsendOption('me')}
                                className="w-full text-start flex items-start gap-3 p-3 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition"
                              >
                                  <div className={`mt-1 flex-shrink-0 w-6 h-6 rounded border-2 flex items-center justify-center transition-colors ${unsendOption === 'me' ? 'bg-emerald-800 border-emerald-800' : 'border-black dark:border-gray-500 bg-transparent'}`}>
                                      {unsendOption === 'me' && <Check className="w-4 h-4 text-white" />}
                                  </div>
                                  <div className="flex flex-col">
                                      <span className="font-bold text-gray-900 dark:text-white">{language === 'ar' ? 'إلغاء الإرسال لديك' : 'Unsend for you'}</span>
                                      <span className="text-xs text-gray-500 dark:text-gray-400 mt-1 leading-relaxed">
                                          {language === 'ar' ? 'ستتم إزالة هذه الرسالة من جهازك. وسيظل بإمكان الأشخاص الآخرين في الدردشة رؤيتها.' : 'This message will be removed from your device. Others in chat can still see it.'}
                                      </span>
                                  </div>
                              </button>
                          </div>
                      )}

                      {activeModal === 'forward' && (
                          <div className="space-y-2">
                              {FRIENDS_LIST.map(friend => (
                                  <div key={friend.id} className="flex items-center justify-between p-2 hover:bg-gray-50 dark:hover:bg-gray-700/50 rounded-lg transition">
                                      <div className="flex items-center gap-3">
                                          <img src={friend.avatar} alt={friend.name} className="w-10 h-10 rounded-full border border-gray-200 dark:border-gray-600" />
                                          <span className="font-semibold text-gray-900 dark:text-white">{friend.name}</span>
                                      </div>
                                      <button 
                                          onClick={() => handleForwardToFriend(friend.id)}
                                          disabled={forwardStatus[friend.id] === 'sent'}
                                          className={`px-4 py-1.5 rounded-full text-xs font-bold transition ${forwardStatus[friend.id] === 'sent' 
                                            ? 'bg-gray-100 text-gray-500 dark:bg-gray-700 cursor-default' 
                                            : 'bg-blue-600 text-white hover:bg-blue-700'}`}
                                      >
                                          {forwardStatus[friend.id] === 'sent' ? (language === 'ar' ? 'تم الإرسال' : 'Sent') : (language === 'ar' ? 'إرسال' : 'Send')}
                                      </button>
                                  </div>
                              ))}
                          </div>
                      )}

                      {activeModal === 'emoji' && (
                          <div className="h-full flex flex-col w-[400px] mx-auto">
                             {renderEmojiPickerContent((emoji) => {
                                setSettings(prev => ({...prev, quickEmoji: emoji}));
                                setActiveModal(null);
                             }, false)} 
                          </div>
                      )}

                      {activeModal === 'nickname' && (
                          <div>
                              <label className="text-xs font-bold text-gray-500 dark:text-gray-400 mb-1 block uppercase">{language === 'ar' ? `كنية لـ ${user.name}` : `Nickname for ${user.name}`}</label>
                              <input 
                                type="text" 
                                value={modalInput}
                                onChange={(e) => setModalInput(e.target.value)}
                                placeholder={user.name}
                                className="w-full p-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600 dark:text-white outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 transition"
                              />
                          </div>
                      )}
                  </div>

                  {(activeModal !== 'emoji' && activeModal !== 'theme' && activeModal !== 'forward' && activeModal !== 'unsend') && (
                      <div className="p-4 border-t border-gray-100 dark:border-gray-700 bg-gray-50 dark:bg-gray-700/50 flex justify-end gap-2 flex-shrink-0">
                          <button onClick={() => setActiveModal(null)} className="px-6 py-2.5 text-gray-600 dark:text-gray-300 font-bold hover:bg-gray-200 dark:hover:bg-gray-600 rounded-xl transition text-sm">{t.common_cancel}</button>
                          <button 
                            onClick={() => {
                                if (activeModal === 'report') {
                                    alert(language === 'ar' ? 'تم إرسال البلاغ بنجاح' : 'Report submitted successfully.');
                                } else if (activeModal === 'nickname') {
                                    setSettings(prev => ({...prev, nickname: modalInput}));
                                } else if (activeModal === 'deleteConfirm') {
                                    clearChat();
                                } else if (activeModal === 'deleteMessageConfirm') {
                                    handleDeleteMessage();
                                }
                                setActiveModal(null);
                            }} 
                            className={`px-8 py-2.5 font-bold rounded-xl transition shadow-lg text-sm text-white transform active:scale-95 bg-emerald-700 hover:bg-blue-700`}
                          >
                              {activeModal === 'deleteConfirm' || activeModal === 'deleteMessageConfirm' ? t.common_delete : (activeModal === 'report' ? t.common_send : t.common_save)}
                          </button>
                      </div>
                  )}

                  {/* Unsend Modal Actions */}
                  {activeModal === 'unsend' && (
                       <div className="p-4 border-t border-gray-100 dark:border-gray-700 bg-gray-50 dark:bg-gray-700/50 flex justify-end gap-2 flex-shrink-0">
                           <button onClick={() => setActiveModal(null)} className="px-6 py-2.5 text-gray-600 dark:text-gray-300 font-bold hover:bg-gray-200 dark:hover:bg-gray-600 rounded-xl transition text-sm">{t.common_cancel}</button>
                           <button 
                               onClick={handleUnsend} 
                               className="px-8 py-2.5 bg-emerald-700 hover:bg-blue-700 text-white font-bold rounded-xl transition shadow-lg text-sm transform active:scale-95"
                            >
                               {language === 'ar' ? 'إلغاء الإرسال' : 'Unsend'}
                           </button>
                       </div>
                  )}

                  {activeModal === 'forward' && (
                       <div className="p-4 border-t border-gray-100 dark:border-gray-700 bg-gray-50 dark:bg-gray-700/50 flex justify-end gap-2 flex-shrink-0">
                           <button onClick={() => setActiveModal(null)} className="px-6 py-2.5 text-gray-600 dark:text-gray-300 font-bold hover:bg-gray-200 dark:hover:bg-gray-600 rounded-xl transition text-sm">{t.common_close}</button>
                       </div>
                  )}

                  {activeModal === 'theme' && (
                    <div className="p-4 border-t border-gray-100 dark:border-gray-700 bg-gray-50 dark:bg-gray-700/50 flex justify-end gap-2 flex-shrink-0">
                          <button onClick={() => setActiveModal(null)} className="px-6 py-2.5 text-gray-600 dark:text-gray-300 font-bold hover:bg-gray-200 dark:hover:bg-gray-600 rounded-xl transition text-sm">{t.common_cancel}</button>
                          <button 
                            onClick={() => {
                                setSettings(prev => ({...prev, theme: previewTheme}));
                                setActiveModal(null);
                            }}
                            className="px-8 py-2.5 font-bold rounded-xl transition shadow-lg text-sm text-white bg-emerald-700 hover:bg-blue-700"
                          >
                              {t.common_save}
                          </button>
                    </div>
                  )}
              </div>
          </div>,
          document.body
      );
  };

  if (isMinimized) {
    return (
      <div 
        className={`fixed bottom-0 w-60 bg-emerald-700 hover:bg-blue-700 text-white shadow-lg rounded-t-lg cursor-pointer z-50 flex items-center justify-between p-3 border border-gray-300 dark:border-gray-700 transition-colors duration-300`}
        onClick={() => setIsMinimized(false)}
        style={positionStyle}
      >
        <div className="flex items-center gap-2">
           <div className="relative">
             <img src={user.avatar} alt={user.name} className="w-8 h-8 rounded-full border border-gray-200" />
             {user.online && <div className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-green-500 rounded-full border-2 border-white"></div>}
           </div>
           <span className="font-semibold text-sm truncate text-white">{settings.nickname || user.name}</span>
        </div>
        <button 
          onClick={(e) => { e.stopPropagation(); onClose(); }} 
          className="text-white p-1 rounded-full hover:bg-white/20 transition"
        >
           <X className="w-4 h-4" />
        </button>
      </div>
    );
  }

  return (
    <div 
        ref={chatContainerRef} 
        className="fixed bottom-0 bg-white dark:bg-gray-800 shadow-2xl rounded-t-lg border border-gray-200 dark:border-gray-700 z-[200] flex flex-col animate-slideUp transition-all duration-300"
        style={{ 
            ...positionStyle, 
            width: `${CHAT_WIDTH}px`, 
            height: '455px'
        }}
   > 
      {/* Modals */}
      {renderModal()}

      {/* Header */}
      <div 
        className={`flex items-center justify-between p-2.5 border-b dark:border-gray-700 shadow-sm bg-emerald-700 hover:bg-blue-700 transition-colors duration-300 rounded-t-lg cursor-pointer text-white`}
        onClick={() => setIsMinimized(true)}
      >
        <div className="flex items-center gap-2 hover:bg-white/10 p-1 rounded-md transition">
          <div className="relative">
             <img src={user.avatar} alt={user.name} className="w-9 h-9 rounded-full border border-gray-200" />
             {user.online && <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-white"></div>}
          </div>
          <div className="flex flex-col">
             <span className="font-bold text-sm text-white hover:underline">{settings.nickname || user.name}</span>
             <span className="text-[10px] text-gray-200">{user.online ? t.common_online : t.nav_offline}</span>
          </div>
        </div>
        <div className="flex items-center gap-0.5 text-white" onClick={(e) => e.stopPropagation()}>
           <button onClick={() => startCall('audio')} className="p-1.5 hover:bg-white/20 rounded-full transition" title="مكالمة صوتية"><Phone className="w-5 h-5" /></button>
           <button onClick={() => startCall('video')} className="p-1.5 hover:bg-white/20 rounded-full transition" title="مكالمة فيديو"><Video className="w-5 h-5" /></button>
           <button className="p-1.5 hover:bg-white/20 rounded-full transition" onClick={() => setIsMinimized(true)}><Minus className="w-5 h-5" /></button>
           <button className="p-1.5 hover:bg-white/20 rounded-full transition" onClick={onClose}><X className="w-5 h-5" /></button>
        </div>
      </div>

      {/* Messages Area */}
      <div className={`flex-1 overflow-y-auto p-3 no-scrollbar relative ${settings.theme.background}`}>
        {/* Call Overlay */}
        {callStatus !== 'idle' && (
            <div className="absolute inset-0 bg-gray-900 z-30 flex flex-col items-center justify-center text-white overflow-hidden animate-fadeIn">
                {callType === 'video' && (
                  <div className="absolute inset-0 z-0">
                      <video 
                        ref={remoteVideoRef} 
                        src={callStatus === 'connected' ? "https://www.w3schools.com/html/mov_bbb.mp4" : ""}
                        autoPlay 
                        loop 
                        muted={false} 
                        className="w-full h-full object-cover opacity-80"
                      />
                  </div>
                )}
                
                {callType === 'video' && localStream && (
                  <div className="absolute top-4 right-4 w-24 h-32 bg-black rounded-lg overflow-hidden border-2 border-white/20 shadow-2xl z-10">
                     <video ref={localVideoRef} autoPlay muted playsInline className="w-full h-full object-cover transform scale-x-[-1]" />
                  </div>
                )}

                <div className="relative z-20 flex flex-col items-center">
                    <div className="w-24 h-24 rounded-full overflow-hidden border-4 border-fb-blue mb-4 relative shadow-lg">
                        <img src={user.avatar} alt={user.name} className="w-full h-full object-cover" />
                        {callStatus === 'calling' && (
                            <div className="absolute inset-0 bg-fb-blue/20 animate-pulse"></div>
                        )}
                    </div>
                    <h3 className="text-xl font-bold mb-1 drop-shadow-md">{settings.nickname || user.name}</h3>
                    <p className="text-gray-200 text-sm mb-8 drop-shadow-md">
                        {callStatus === 'calling' ? (language === 'ar' ? 'جار الاتصال...' : 'Calling...') : formatDuration(callDuration)}
                    </p>
                    
                    <div className="flex gap-6">
                        <button 
                            onClick={endCall}
                            className="w-14 h-14 rounded-full bg-red-600 hover:bg-red-700 flex items-center justify-center transition transform hover:scale-110 shadow-lg border-2 border-red-500/50"
                        >
                            <PhoneOff className="w-7 h-7 fill-current" />
                        </button>
                    </div>
                </div>
            </div>
        )}

        {/* Messages List */}
        <div className="flex flex-col items-center mt-4 mb-8 text-center">
            <img src={user.avatar} alt={user.name} className="w-16 h-16 rounded-full mb-2 shadow-sm border-2 border-white" />
            <h3 className="font-bold text-lg text-gray-900 dark:text-white">{settings.nickname || user.name}</h3>
            <p className="text-xs text-gray-500 dark:text-gray-400">{language === 'ar' ? 'أنتما صديقان على Tourloop' : 'You are friends on Tourloop'}</p>
        </div>

        <div className="space-y-4">
          {messages.map((msg) => {
            const repliedMsg = msg.replyTo ? messages.find(m => m.id === msg.replyTo) : null;
            return (
              <div 
                key={msg.id} 
                className={`flex flex-col ${msg.sender === 'me' ? 'items-end' : 'items-start'} relative group mb-2`}
                onContextMenu={(e) => { e.preventDefault(); setActiveReactionId(msg.id); }}
              >
                {msg.type === 'system' ? (
                    <div className="w-full text-center my-2">
                        <span className="text-xs text-gray-500 bg-gray-100 dark:bg-gray-800 px-2 py-1 rounded-full border border-gray-200 dark:border-gray-700">{msg.text}</span>
                    </div>
                ) : (
                    <>
                      {/* Reply Preview Bubble */}
                      {repliedMsg && (
                          <div 
                             className={`text-xs text-gray-500 mb-1 px-2 py-1 bg-gray-50 dark:bg-gray-800 rounded border-l-2 border-fb-blue opacity-80 max-w-[70%] truncate cursor-pointer shadow-sm self-${msg.sender === 'me' ? 'end' : 'start'}`}
                             onClick={() => {
                               const el = document.getElementById(`msg-${repliedMsg.id}`);
                               el?.scrollIntoView({ behavior: 'smooth', block: 'center' });
                             }}
                          >
                             <span className="font-bold">{repliedMsg.sender === 'me' ? (language === 'ar' ? 'أنت' : 'You') : (settings.nickname || user.name)}</span>: {repliedMsg.text || (language === 'ar' ? 'مرفق وسائط' : 'Media Attachment')}
                          </div>
                      )}

                      {/* Flex container to position Menu next to Bubble */}
                      <div className={`flex items-center gap-2 max-w-full ${msg.sender === 'me' ? 'flex-row-reverse' : 'flex-row'}`}>
                          
                          {/* Message Bubble */}
                          <div 
                              id={`msg-${msg.id}`}
                              className={`px-3 py-2 rounded-2xl text-[15px] shadow-sm relative transition-all max-w-[85%] ${ 
                                  msg.type === 'emoji' ? 'bg-transparent shadow-none p-0' : 
                                  msg.type === 'sticker' ? 'bg-transparent shadow-none p-0' : 
                                  msg.sender === 'me' 
                                  ? `${settings.theme.bubble} text-white rounded-br-none`
                                  : 'bg-white dark:bg-gray-700 text-black dark:text-gray-200 rounded-bl-none border border-gray-100 dark:border-gray-600'
                              }`}
                          >
                              {msg.type === 'emoji' && (
                                  <div style={{ fontSize: `${(msg.emojiSize || 1) * 32}px` }} className="leading-none transition-all">
                                      {msg.text}
                                  </div>
                              )}

                              {msg.linkPreview && (
                                  <div className="mb-2 bg-black/5 rounded-lg overflow-hidden border border-black/5">
                                      {msg.linkPreview.image && (
                                      <img src={msg.linkPreview.image} alt="preview" className="w-full h-32 object-cover" />
                                      )}
                                      <div className="p-2 bg-white/50 dark:bg-black/20">
                                      <p className="font-bold text-xs truncate">{msg.linkPreview.title}</p>
                                      <p className="text-[10px] opacity-80 truncate">{msg.linkPreview.description}</p>
                                      </div>
                                  </div>
                              )}

                              {msg.type === 'image' && msg.mediaUrl && (
                                  <div 
                                      className="cursor-pointer overflow-hidden rounded-lg mb-1 border border-black/10"
                                      onClick={() => { setViewingMedia({ message: msg, type: 'image' }); setZoomLevel(1); }}
                                  >
                                      <img src={msg.mediaUrl} alt="sent" className="w-full h-auto max-h-40 object-cover" />
                                  </div>
                              )}

                              {msg.type === 'sticker' && msg.mediaUrl && (
                                  <div 
                                      className="cursor-pointer overflow-hidden rounded-lg mb-1 hover:scale-105 transition duration-200"
                                      onClick={() => { setViewingMedia({ message: msg, type: 'sticker' }); setZoomLevel(1); }}
                                  >
                                      <img src={msg.mediaUrl} alt="sticker" className="w-32 h-32 object-contain drop-shadow-md" />
                                  </div>
                              )}
                              
                              {msg.type === 'video' && msg.mediaUrl && (
                                  <div 
                                      className="cursor-pointer overflow-hidden rounded-lg mb-1 border border-black/10 relative group-hover:brightness-90 transition"
                                      onClick={() => { setViewingMedia({ message: msg, type: 'video' }); setZoomLevel(1); }}
                                  >
                                      <video src={msg.mediaUrl} className="w-full h-auto max-h-40 object-cover" />
                                      <div className="absolute inset-0 flex items-center justify-center">
                                          <div className="bg-black/30 p-2 rounded-full">
                                          <Play className="w-6 h-6 text-white fill-current" />
                                          </div>
                                      </div>
                                  </div>
                              )}

                              {msg.type === 'audio' && msg.mediaUrl && (
                                  <AudioPlayer src={msg.mediaUrl} sender={msg.sender} />
                              )}
                              
                              {msg.type !== 'emoji' && msg.text && <div className="whitespace-pre-wrap break-words text-start leading-relaxed">{msg.text}</div>}
                              
                              <div className={`flex items-center justify-end gap-1 mt-1 opacity-70`}>
                                  <span className="text-[9px]">{msg.timestamp}</span>
                                  {msg.sender === 'me' && msg.type !== 'emoji' && msg.type !== 'sticker' && (
                                      <StatusIcon msg={msg} />
                                  )}
                              </div>

                              {Object.keys(msg.reactions).length > 0 && (
                                  <button 
                                      onClick={() => toggleReaction(msg.id, Object.keys(msg.reactions)[0])}
                                      className="absolute -bottom-2 right-0 bg-white dark:bg-gray-800 shadow-sm border dark:border-gray-600 rounded-full px-1.5 py-0.5 flex gap-0.5 items-center transform translate-y-1/2 scale-75 hover:scale-105 transition"
                                  >
                                      {Object.keys(msg.reactions).map(r => <span key={r}>{r}</span>)}
                                      <span className="text-[10px] text-gray-500">{Object.values(msg.reactions).reduce((a,b) => a+b, 0)}</span>
                                  </button>
                              )}
                          </div>

                          {/* Action Menu (Visible on Hover) */}
                          <div className={`flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity duration-200 ${msg.sender === 'me' ? 'flex-row-reverse' : 'flex-row'}`}>
                              {/* Emoji Button */}
                              <button 
                                  onClick={(e) => { 
                                      e.stopPropagation();
                                      setMessageMenuOpen(null);
                                      setMessageReactionTarget(msg.id);
                                      setPickerMode('emoji');
                                      setShowEmojiPicker(true);
                                  }} 
                                  className="p-1.5 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-md transition text-gray-400 hover:text-yellow-500 message-emoji-trigger bg-white/50 dark:bg-black/20 backdrop-blur-sm"
                                  title={language === 'ar' ? 'تفاعل' : 'React'}
                              >
                                  <Smile className="w-4 h-4" />
                              </button>
                              
                              <button 
                                  onClick={(e) => { e.stopPropagation(); setReplyingTo(msg); }}
                                  className="p-1.5 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-md transition text-gray-400 hover:text-blue-500 bg-white/50 dark:bg-black/20 backdrop-blur-sm"
                                  title={language === 'ar' ? 'رد' : 'Reply'}
                              >
                                  <CornerUpLeft className="w-4 h-4" />
                              </button>

                              <button 
                                  onClick={(e) => { 
                                      e.stopPropagation(); 
                                      setMessageMenuOpen(msg.id);
                                  }}
                                  className="p-1.5 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-md transition text-gray-400 message-menu-trigger bg-white/50 dark:bg-black/20 backdrop-blur-sm"
                                  title={t.common_more || (language === 'ar' ? 'المزيد' : 'More')}
                              >
                                  <MoreVertical className="w-4 h-4" />
                              </button>
                          </div>
                      </div>

                        {/* Specific Message Menu Dropdown */}
                        {messageMenuOpen === msg.id && (
                            <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 z-50 w-40 bg-white dark:bg-gray-800 rounded-lg shadow-xl border dark:border-gray-700 overflow-hidden py-1 message-menu-container" onClick={e => e.stopPropagation()}>
                                {msg.sender === 'me' ? (
                                    <button 
                                        onClick={() => { 
                                            setSelectedMessageId(msg.id);
                                            setActiveModal('unsend');
                                            setMessageMenuOpen(null); 
                                        }} 
                                        className="w-full text-start px-3 py-2 text-xs hover:bg-red-50 dark:hover:bg-red-900/20 text-red-600 flex items-center gap-2"
                                    >
                                        <Trash2 className="w-3 h-3" /> {language === 'ar' ? 'إلغاء الإرسال' : 'Unsend'}
                                    </button>
                                ) : (
                                    <button 
                                        onClick={() => { 
                                            setSelectedMessageId(msg.id);
                                            setActiveModal('deleteMessageConfirm');
                                            setMessageMenuOpen(null); 
                                        }} 
                                        className="w-full text-start px-3 py-2 text-xs hover:bg-red-50 dark:hover:bg-red-900/20 text-red-600 flex items-center gap-2"
                                    >
                                        <Trash2 className="w-3 h-3" /> {t.common_delete || (language === 'ar' ? 'حذف' : 'Delete')}
                                    </button>
                                )}

                                <button 
                                    onClick={() => { 
                                        setForwardStatus({});
                                        setActiveModal('forward');
                                        setMessageMenuOpen(null); 
                                    }} 
                                    className="w-full text-start px-3 py-2 text-xs hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-200 flex items-center gap-2"
                                >
                                    <CornerUpRight className="w-3 h-3" /> {language === 'ar' ? 'إعادة توجيه' : 'Forward'}
                                </button>
                                <button 
                                    onClick={() => { 
                                        setReportReason('');
                                        setActiveModal('report');
                                        setMessageMenuOpen(null);
                                    }} 
                                    className="w-full text-start px-3 py-2 text-xs hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-200 flex items-center gap-2"
                                >
                                    <Flag className="w-3 h-3" /> {t.common_report || (language === 'ar' ? 'إبلاغ' : 'Report')}
                                </button>
                            </div>
                        )}
                    </>
                )}
              </div>
            );
          })}

          {isTyping && (
             <div className="flex justify-start animate-fadeIn">
                 <div className="bg-gray-200 dark:bg-gray-700 px-4 py-3 rounded-2xl rounded-bl-none flex gap-1">
                     <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                     <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce delay-75"></div>
                     <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce delay-150"></div>
                 </div>
             </div>
          )}
          <div ref={messagesEndRef} />
        </div>
      </div>

      {/* Footer Controls */}
      <div className="p-2 border-t dark:border-gray-700 bg-white dark:bg-gray-800 relative">
         {/* Reply Preview Banner */}
         {replyingTo && (
            <div className="flex items-center justify-between bg-gray-100 dark:bg-gray-900 p-2 rounded-t-lg border-b dark:border-gray-700 mb-1">
               <div className="flex flex-col text-xs border-l-2 border-fb-blue pl-2">
                  <span className="font-bold text-fb-blue">{language === 'ar' ? 'الرد على' : 'Replying to'} {replyingTo.sender === 'me' ? (language === 'ar' ? 'نفسك' : 'Yourself') : (settings.nickname || user.name)}</span>
                  <span className="truncate text-gray-500 max-w-[200px]">{replyingTo.text || (language === 'ar' ? 'مرفق وسائط' : 'Media Attachment')}</span>
               </div>
               <button onClick={() => setReplyingTo(null)} className="p-1 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-full">
                  <X className="w-3 h-3" />
               </button>
            </div>
         )}

         {/* File Upload Preview Banner */}
         {pendingMedia && (
            <div className="flex flex-col bg-gray-50 dark:bg-gray-900 p-2 rounded-lg border dark:border-gray-700 mb-2 relative animate-fadeIn">
                <button 
                    onClick={removePendingMedia} 
                    className="absolute top-1 right-1 p-1 bg-gray-200 dark:bg-gray-700 rounded-full hover:bg-red-100 dark:hover:bg-red-900 transition text-gray-500 hover:text-red-500 z-10"
                >
                    <X className="w-4 h-4" />
                </button>
                <div className="flex gap-3 items-start">
                    <div className="relative w-24 h-24 rounded-lg overflow-hidden border border-gray-200 dark:border-gray-700 bg-black flex-shrink-0">
                        {pendingMedia.type === 'image' ? (
                            <img src={pendingMedia.url} alt="preview" className="w-full h-full object-cover" />
                        ) : (
                            <video src={pendingMedia.url} className="w-full h-full object-cover" />
                        )}
                    </div>
                    <div className="flex-1 pt-2">
                        <span className="text-xs font-semibold text-gray-500 uppercase">{pendingMedia.type} {language === 'ar' ? 'محدد' : 'Selected'}</span>
                        <p className="text-sm truncate font-medium">{pendingMedia.file.name}</p>
                        <p className="text-xs text-gray-400 mt-1">{language === 'ar' ? 'أضف شرحاً أدناه...' : 'Add a caption below...'}</p>
                    </div>
                </div>
            </div>
         )}

         {/* Enhanced Emoji/Sticker Picker (Main Input) - Also used for reactions now */}
         {showEmojiPicker && (
             <div className="absolute bottom-full left-0 mb-2 ml-2 bg-white dark:bg-gray-800 shadow-2xl rounded-lg border border-gray-200 dark:border-gray-700 w-80 z-50 overflow-hidden flex flex-col h-96 animate-slideUp">
                 {/* If reaction mode, hide stickers. Otherwise show stickers (true). */}
                 {renderEmojiPickerContent(handleEmojiSelect, !messageReactionTarget)}
             </div>
         )}

         {/* Enhanced More Menu */}
         {showMoreMenu && (
             <div className={`absolute bottom-full mb-2 w-64 bg-white dark:bg-gray-800 shadow-xl rounded-lg border border-gray-100 dark:border-gray-700 z-[60] overflow-hidden animate-fadeIn pb-1 ${dir === 'rtl' ? 'right-0 mr-2 origin-bottom-right' : 'left-0 ml-2 origin-bottom-left'}`}>
                 <div className="p-2 flex items-center gap-3 border-b border-gray-100 dark:border-gray-700 mb-1">
                    <img src={user.avatar} className="w-10 h-10 rounded-full" alt="" />
                    <div className="flex flex-col">
                        <span className="font-bold text-sm text-gray-800 dark:text-white">{settings.nickname || user.name}</span>
                        <span className="text-xs text-gray-500">{language === 'ar' ? 'تخصيص الدردشة' : 'Customize Chat'}</span>
                    </div>
                 </div>

                 {[ 
                    { id: 'profile', icon: UserCircle, label: t.profile_view_profile || (language === 'ar' ? 'عرض الملف الشخصي' : 'View Profile'), action: () => alert(`Navigating to profile: ${user.id}`) },
                    { id: 'theme', icon: Palette, label: language === 'ar' ? 'تغيير السمة' : 'Change Theme', action: () => { setPreviewTheme(settings.theme); setActiveModal('theme'); } },
                    { id: 'emoji', icon: Smile, label: language === 'ar' ? 'الرمز التعبيري' : 'Quick Emoji', action: () => { setModalInput(settings.quickEmoji); setActiveModal('emoji'); } },
                    { id: 'nicknames', icon: Type, label: language === 'ar' ? 'الكنيات' : 'Nicknames', action: () => { setModalInput(settings.nickname || user.name); setActiveModal('nickname'); } },
                    { id: 'mute', icon: settings.isMuted ? BellOff : Bell, label: settings.isMuted ? (t.common_unmute || (language === 'ar' ? 'تفعيل الإشعارات' : 'Unmute')) : (t.common_mute || (language === 'ar' ? 'كتم الإشعارات' : 'Mute')), action: () => setSettings(p => ({...p, isMuted: !p.isMuted})) },
                    { id: 'block', icon: ShieldBan, label: settings.isBlocked ? (language === 'ar' ? 'إلغاء الحظر' : 'Unblock') : (t.profile_block || (language === 'ar' ? 'حظر' : 'Block')), action: () => setSettings(p => ({...p, isBlocked: !p.isBlocked})) },
                    { id: 'read_receipts', icon: CheckCheck, label: language === 'ar' ? 'مؤشرات القراءة' : 'Read Receipts', action: () => setActiveModal('readReceipts') },
                    { id: 'archive', icon: Archive, label: language === 'ar' ? 'أرشفة المحادثة' : 'Archive Chat', action: () => { alert('Chat archived'); onClose(); } },
                    { id: 'delete', icon: Trash2, label: language === 'ar' ? 'حذف المحادثة' : 'Delete Chat', action: () => setActiveModal('deleteConfirm'), color: 'text-red-600' },
                    { id: 'report', icon: Flag, label: t.common_report || (language === 'ar' ? 'إبلاغ' : 'Report'), action: () => setActiveModal('report'), color: 'text-red-600' },
                 ].map((item) => (
                     <button 
                        key={item.id} 
                        onClick={() => { setShowMoreMenu(false); item.action(); }}
                        className={`w-full text-start px-4 py-2.5 hover:bg-gray-100 dark:hover:bg-gray-700 flex items-center gap-3 text-sm transition ${item.color || 'text-gray-700 dark:text-gray-200'}`}
                     >
                         <item.icon className="w-4 h-4" /> {item.label}
                     </button>
                 ))}
             </div>
         )}

         <div className="flex items-center gap-1.5">
             <div className="flex items-center gap-0.5">
                 <button 
                    onClick={() => setShowMoreMenu(!showMoreMenu)} 
                    className={`text-fb-blue hover:bg-gray-100 dark:hover:bg-gray-700 p-1.5 rounded-full transition ${showMoreMenu ? 'bg-gray-100 dark:bg-gray-700' : ''}`}
                 >
                     <MoreHorizontal className="w-6 h-6" />
                 </button>
                 
                 <div className="relative">
                     <input 
                        type="file" 
                        ref={fileInputRef} 
                        className="hidden" 
                        accept="image/*,video/*" 
                        onChange={handleFileUpload} 
                     />
                     <button 
                        onClick={() => fileInputRef.current?.click()} 
                        className={`text-fb-blue hover:bg-gray-100 dark:hover:bg-gray-700 p-1.5 rounded-full transition ${pendingMedia ? 'bg-blue-100 dark:bg-blue-900/30' : ''}`}
                        title={language === 'ar' ? 'إرسال صورة/فيديو' : 'Send Photo/Video'}
                     >
                         <Image className="w-6 h-6" />
                     </button>
                 </div>
                 
                 <button 
                    onClick={() => { setShowEmojiPicker(!showEmojiPicker); setMessageMenuOpen(null); }}
                    className={`text-fb-blue hover:bg-gray-100 dark:hover:bg-gray-700 p-1.5 rounded-full transition ${showEmojiPicker ? 'bg-gray-100 dark:bg-gray-700' : ''}`}
                 >
                     <Smile className="w-6 h-6" />
                 </button>
             </div>

             {/* Input Area or Recorder */}
             {isRecording ? (
                <div className="flex-1 flex items-center justify-between bg-red-50 dark:bg-red-900/20 rounded-full px-4 py-2 animate-pulse">
                   <div className="flex items-center gap-2 text-red-500">
                      <div className="w-2.5 h-2.5 bg-red-500 rounded-full animate-ping"></div>
                      <span className="text-sm font-mono">{formatDuration(recordingDuration)}</span>
                   </div>
                   <button onClick={stopRecording} className="text-red-600 font-bold text-xs hover:underline">
                      {language === 'ar' ? 'اضغط للإرسال' : 'Tap to send'}
                   </button>
                </div>
             ) : (
                <form onSubmit={(e) => handleSend(e)} className="flex-1 flex items-center">
                   <input 
                     type="text" 
                     className="w-full bg-gray-100 dark:bg-gray-700 dark:text-white rounded-full px-4 py-2 text-sm outline-none focus:bg-gray-50 dark:focus:bg-gray-600 transition border border-transparent focus:border-fb-blue"
                     placeholder={pendingMedia ? (language === 'ar' ? "أضف شرحاً..." : "Add caption...") : (replyingTo ? (language === 'ar' ? "الرد على رسالة..." : "Reply to message...") : (t.placeholders_type_message || (language === 'ar' ? "اكتب رسالة..." : "Type a message...")))}
                     value={inputText}
                     onChange={(e) => setInputText(e.target.value)}
                     onFocus={() => { setShowEmojiPicker(false); setShowMoreMenu(false); setMessageMenuOpen(null); }}
                     disabled={settings.isBlocked}
                   />
                </form>
             )}

             {/* Send or Record Button */}
             {inputText || pendingMedia ? (
                 <button 
                    className="text-fb-blue hover:bg-gray-100 dark:hover:bg-gray-700 p-2 rounded-full transition transform hover:scale-110" 
                    onClick={(e) => handleSend(e)}
                 >
                     <Send className="w-5 h-5 rtl:rotate-180" />
                 </button>
             ) : (
                 isRecording ? (
                    <button 
                      className="text-red-500 hover:bg-red-50 dark:hover:bg-red-900/30 p-2 rounded-full transition transform hover:scale-110" 
                      onClick={() => {
                        if (mediaRecorderRef.current) mediaRecorderRef.current.stop();
                      }}
                    >
                        <Send className="w-5 h-5 rtl:rotate-180" />
                    </button>
                 ) : (
                    <div className="flex items-center">
                       <button 
                          className="text-fb-blue hover:bg-gray-100 dark:hover:bg-gray-700 p-2 rounded-full transition transform hover:scale-110" 
                          onClick={startRecording}
                          title={language === 'ar' ? "تسجيل صوتي" : "Voice Record"}
                       >
                           <Mic className="w-5 h-5" />
                       </button>
                       <button 
                          className="p-2 rounded-full transition transform hover:scale-110 active:scale-90 text-blue-600"
                          onMouseDown={handleQuickEmojiDown}
                          onMouseUp={handleQuickEmojiUp}
                          onMouseLeave={(e) => { if(isLongPressing) handleQuickEmojiUp(e); }}
                          onTouchStart={handleQuickEmojiDown}
                          onTouchEnd={handleQuickEmojiUp}
                       >
                           {/* Render the Quick Emoji with Scaling Animation */}
                           <span 
                               className="text-xl leading-none inline-block transition-transform duration-75 ease-out"
                               style={{ transform: `scale(${isLongPressing ? quickEmojiSize : 1})` }}
                           >
                               {settings.quickEmoji}
                           </span>
                       </button>
                    </div>
                 )
             )}
         </div>
      </div>

      {/* Media Viewer Lightbox */}
      {viewingMedia && typeof document !== 'undefined' && createPortal(
        <div 
          className="fixed inset-0 z-[10000] bg-black/95 flex items-center justify-center animate-fadeIn"
          onMouseDown={handleViewerMouseDown}
          onMouseMove={handleViewerMouseMove}
          onMouseUp={handleViewerMouseUp}
          onMouseLeave={handleViewerMouseUp}
        >
           {/* TOP LEFT CONTROLS (Fixed Order) */}
           {/* In LTR mode, apply reverse to make visual order: Close, Download, Forward */}
           <div className={`absolute top-4 left-4 flex items-center gap-4 z-[10002] ${dir === 'ltr' ? 'flex-row-reverse' : ''}`}>
             <button 
               className="p-2 bg-black/50 hover:bg-white/20 rounded-full text-white transition backdrop-blur-sm"
               onClick={(e) => {
                  e.stopPropagation();
                  setForwardStatus({});
                  setActiveModal('forward');
               }}
               title={language === 'ar' ? "إعادة توجيه" : "Forward"}
             >
                <CornerUpRight className="w-6 h-6" />
             </button>
             <a 
               href={viewingMedia.message.mediaUrl} 
               download={`media_${Date.now()}`}
               className="p-2 bg-black/50 hover:bg-white/20 rounded-full text-white backdrop-blur-sm transition"
               onClick={(e) => e.stopPropagation()}
               title={t.common_download || (language === 'ar' ? "تنزيل" : "Download")}
             >
                <Download className="w-6 h-6" />
             </a>
             <button 
               className="p-2 bg-black/50 hover:bg-red-500/50 rounded-full text-white transition backdrop-blur-sm"
               onClick={(e) => { e.stopPropagation(); setViewingMedia(null); }}
               title={t.common_close || (language === 'ar' ? "إغلاق (Esc)" : "Close (Esc)")}
             >
                <X className="w-6 h-6" />
             </button>
           </div>

           {/* TOP RIGHT CONTROLS */}
           <div className="absolute top-4 right-4 flex items-center gap-4 z-[10002]">
              <button 
                 className="p-2 bg-black/50 hover:bg-white/20 rounded-full text-white backdrop-blur-sm transition"
                 onClick={(e) => { e.stopPropagation(); setZoomLevel(z => Math.max(0.5, z - 0.25)); }}
                 title="تصغير"
              >
                 <ZoomOut className="w-6 h-6" />
              </button>
              <button 
                 className="p-2 bg-black/50 hover:bg-white/20 rounded-full text-white backdrop-blur-sm transition"
                 onClick={(e) => { e.stopPropagation(); setZoomLevel(z => Math.min(3, z + 0.25)); }}
                 title="تكبير"
              >
                 <ZoomIn className="w-6 h-6" />
              </button>
           </div>

           <div 
             className="w-full h-full flex items-center justify-center relative overflow-hidden cursor-move"
             onClick={(e) => e.stopPropagation()}
           >
               {viewingMedia.type === 'video' ? (
                  <div 
                      className="relative w-full h-full flex items-center justify-center"
                      style={{ transform: `translate(${pan.x}px, ${pan.y}px) scale(${zoomLevel})`, transition: isDragging ? 'none' : 'transform 0.2s ease-out' }}
                  >
                      <video 
                        src={viewingMedia.message.mediaUrl} 
                        controls 
                        autoPlay 
                        draggable={false}
                        className="max-w-full max-h-full object-contain shadow-2xl"
                      />
                  </div>
               ) : viewingMedia.type === 'sticker' ? (
                   <img 
                     src={viewingMedia.message.mediaUrl} 
                     alt="Sticker View"
                     className="max-w-md max-h-[80vh] object-contain animate-bounce-in select-none"
                     draggable={false}
                     style={{ transform: `translate(${pan.x}px, ${pan.y}px) scale(${zoomLevel})`, transition: isDragging ? 'none' : 'transform 0.2s ease-out' }}
                   />
               ) : (
                   <img 
                     src={viewingMedia.message.mediaUrl} 
                     alt="Full View" 
                     className="max-w-full max-h-full object-contain shadow-2xl select-none"
                     draggable={false}
                     style={{ transform: `translate(${pan.x}px, ${pan.y}px) scale(${zoomLevel})`, transition: isDragging ? 'none' : 'transform 0.2s ease-out' }}
                   />
               )}
           </div>
        </div>,
        document.body
      )}
    </div>
  );
};

export default ChatWindow;