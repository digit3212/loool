
import { 
  Gamepad2, Swords, Crosshair, Compass, Brain, Trophy, Car, Zap, 
  Joystick, Ghost, Box, CircleUser 
} from 'lucide-react';

export interface Game {
  id: string;
  title: string;
  image: string;
  category: string;
  players: string;
  isInstant: boolean;
  rating: number;
  description?: string;
  isPlayable?: boolean;
}

export interface Stream {
  id: string;
  streamerName: string;
  streamerAvatar: string;
  title: string;
  thumbnail: string;
  viewers: string;
  gameName: string;
  tags: string[];
  isLive: boolean;
}

export const CATEGORIES = [
  { id: 'all', name: 'الكل', icon: Gamepad2 },
  { id: 'action', name: 'أكشن', icon: Swords },
  { id: 'shooter', name: 'إطلاق نار', icon: Crosshair },
  { id: 'adventure', name: 'مغامرات', icon: Compass },
  { id: 'strategy', name: 'استراتيجية', icon: Brain },
  { id: 'sports', name: 'رياضة', icon: Trophy },
  { id: 'racing', name: 'سباق', icon: Car },
  { id: 'puzzle', name: 'ألغاز', icon: Zap },
  { id: 'arcade', name: 'أركيد', icon: Joystick },
  { id: 'horror', name: 'رعب', icon: Ghost },
  { id: 'simulation', name: 'محاكاة', icon: Box },
  { id: 'board', name: 'بورد', icon: CircleUser },
];

export const MOCK_GAMES: Game[] = [
  // --- Playable Mini-Games ---
  { 
    id: 'tic-tac-toe', 
    title: 'إكس أو (Tic Tac Toe)', 
    image: 'https://picsum.photos/300/300?random=901', 
    category: 'بورد', 
    players: '2M+', 
    isInstant: true, 
    rating: 4.8, 
    description: 'اللعبة الكلاسيكية الشهيرة. تحدى نفسك!', 
    isPlayable: true 
  },
  { 
    id: 'snake', 
    title: 'لعبة الثعبان (Snake)', 
    image: 'https://picsum.photos/300/300?random=902', 
    category: 'أركيد', 
    players: '5M+', 
    isInstant: true, 
    rating: 4.7, 
    description: 'اجمع الطعام واكبر بالحجم دون الاصطدام.', 
    isPlayable: true 
  },
  { 
    id: 'memory', 
    title: 'ذاكرة البطاقات', 
    image: 'https://picsum.photos/300/300?random=903', 
    category: 'ألغاز', 
    players: '1.5M+', 
    isInstant: true, 
    rating: 4.6, 
    description: 'اختبر ذاكرتك وطابق الصور المتشابهة.', 
    isPlayable: true 
  },
  { 
    id: 'rock-paper-scissors', 
    title: 'حجرة ورقة مقص', 
    image: 'https://picsum.photos/300/300?random=904', 
    category: 'أركيد', 
    players: '1M+', 
    isInstant: true, 
    rating: 4.5, 
    description: 'تحدى الكمبيوتر في اللعبة الكلاسيكية.', 
    isPlayable: true 
  },
  { 
    id: 'math-quiz', 
    title: 'تحدي الرياضيات', 
    image: 'https://picsum.photos/300/300?random=905', 
    category: 'ألغاز', 
    players: '500K+', 
    isInstant: true, 
    rating: 4.4, 
    description: 'حل المسائل الرياضية بسرعة قبل نفاذ الوقت.', 
    isPlayable: true 
  },

  // --- Mock Commercial Games ---
  { id: 'g1', title: 'Ludo Club', image: 'https://picsum.photos/300/300?random=501', category: 'بورد', players: '10M+', isInstant: true, rating: 4.5, description: 'العب لودو مع أصدقائك عبر الإنترنت في أي وقت.' },
  { id: 'g2', title: 'PUBG Mobile', image: 'https://picsum.photos/300/300?random=502', category: 'أكشن', players: '50M+', isInstant: false, rating: 4.8, description: 'لعبة الباتل رويال الشهيرة.' },
  { id: 'g3', title: 'Candy Crush', image: 'https://picsum.photos/300/300?random=503', category: 'ألغاز', players: '100M+', isInstant: true, rating: 4.6, description: 'حل الألغاز وسحق الحلوى.' },
  { id: 'g4', title: 'Subway Surfers', image: 'https://picsum.photos/300/300?random=504', category: 'أركيد', players: '20M+', isInstant: true, rating: 4.4, description: 'اركض بأسرع ما يمكن وتجنب القطارات.' },
  { id: 'g5', title: 'Clash Royale', image: 'https://picsum.photos/300/300?random=505', category: 'استراتيجية', players: '15M+', isInstant: false, rating: 4.7, description: 'ادخل الحلبة وابنِ مجموعتك القتالية.' },
  { id: 'g6', title: '8 Ball Pool', image: 'https://picsum.photos/300/300?random=506', category: 'رياضة', players: '30M+', isInstant: true, rating: 4.5, description: 'لعبة البلياردو رقم 1 في العالم.' },
  { id: 'g7', title: 'Asphalt 9', image: 'https://picsum.photos/300/300?random=507', category: 'سباق', players: '5M+', isInstant: false, rating: 4.9, description: 'تحدى الجاذبية في سباقات مثيرة.' },
  { id: 'g8', title: 'Chess Online', image: 'https://picsum.photos/300/300?random=508', category: 'استراتيجية', players: '2M+', isInstant: true, rating: 4.3, description: 'العب الشطرنج مع لاعبين من جميع أنحاء العالم.' },
];

export const MOCK_STREAMS: Stream[] = [
  { id: 's1', streamerName: 'GamerPro', streamerAvatar: 'https://picsum.photos/50/50?random=601', title: 'تختيم لعبة Elden Ring 🔥', thumbnail: 'https://picsum.photos/600/340?random=701', viewers: '12K', gameName: 'Elden Ring', tags: ['مباشر', 'RPG'], isLive: true },
  { id: 's2', streamerName: 'SpeedRunner', streamerAvatar: 'https://picsum.photos/50/50?random=602', title: 'محاولة كسر رقم قياسي 🚀', thumbnail: 'https://picsum.photos/600/340?random=702', viewers: '5.4K', gameName: 'Minecraft', tags: ['Speedrun', 'Arabic'], isLive: true },
  { id: 's3', streamerName: 'NoobMaster', streamerAvatar: 'https://picsum.photos/50/50?random=603', title: 'بطولة فيفا 24 ⚽', thumbnail: 'https://picsum.photos/600/340?random=703', viewers: '25K', gameName: 'EA FC 24', tags: ['Esports', 'Competitive'], isLive: true },
  { id: 's4', streamerName: 'TechGaming', streamerAvatar: 'https://picsum.photos/50/50?random=604', title: 'تجربة التحديث الجديد', thumbnail: 'https://picsum.photos/600/340?random=704', viewers: '1.2K', gameName: 'Fortnite', tags: ['Update', 'Fun'], isLive: true },
];

export const REACTION_EMOJIS = ["🔥", "😂", "😮", "👏", "🎉", "💯", "🚀", "✨", "💚", "👻", "🤬"];
