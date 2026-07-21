
// --- Configuration & Constants for CreatePost ---

export const MAX_FILE_SIZE_MB = 10;
export const ALLOWED_IMAGE_TYPES = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
export const ALLOWED_VIDEO_TYPES = ['video/mp4', 'video/webm', 'video/ogg'];

// Use specific green color as requested (Emerald 700/800)
export const THEME_CONFIG = {
  COLOR: 'text-emerald-700',
  BG: 'bg-emerald-700',
  HOVER_BG: 'hover:bg-emerald-800',
  BORDER: 'border-emerald-700',
  RING: 'focus:ring-emerald-700'
};

export const FEELINGS_LIST = [
    { label: 'سعيد', emoji: '😃' }, { label: 'محبوب', emoji: '🥰' }, { label: 'حزين', emoji: '😢' },
    { label: 'متحمس', emoji: '🤩' }, { label: 'محبط', emoji: '😞' }, { label: 'شاكر', emoji: '🙏' },
    { label: 'غاضب', emoji: '😡' }, { label: 'رائع', emoji: '😎' }, { label: 'متعب', emoji: '😫' },
    { label: 'مفكر', emoji: '🤔' }, { label: 'مبارك', emoji: '😇' }, { label: 'حائر', emoji: '😕' },
    { label: 'قوي', emoji: '💪' }, { label: 'نعسان', emoji: '😴' }, { label: 'مريض', emoji: '🤒' },
    { label: 'مصدوم', emoji: '😱' }, { label: 'واثق', emoji: '😌' }, { label: 'ممتن', emoji: '🤗' },
    { label: 'فخور', emoji: '🦁' }, { label: 'مرتاح', emoji: '🧘‍♂️' }, { label: 'قلق', emoji: '😰' },
    { label: 'وحيد', emoji: '🥀' }, { label: 'مندهش', emoji: '😮' }, { label: 'خجول', emoji: '😳' },
    { label: 'جائع', emoji: '😋' }, { label: 'مستاء', emoji: '😒' }, { label: 'متفائل', emoji: '🌟' },
    { label: 'مبدع', emoji: '🎨' }, { label: 'نشيط', emoji: '⚡' }, { label: 'هادئ', emoji: '🍃' }
];

export const ACTIVITIES_LIST = [
    { label: 'يحتفل', emoji: '🎉' }, { label: 'يشاهد', emoji: '📺' }, { label: 'يأكل', emoji: '🍔' },
    { label: 'يشرب', emoji: '☕' }, { label: 'يسافر إلى', emoji: '✈️' }, { label: 'يستمع إلى', emoji: '🎧' },
    { label: 'يقرأ', emoji: '📖' }, { label: 'يلعب', emoji: '🎮' }, { label: 'يفكر في', emoji: '💭' },
    { label: 'يدعم', emoji: '🤝' }, { label: 'يبحث عن', emoji: '🔍' }, { label: 'يتعلم', emoji: '🧠' },
    { label: 'يعمل', emoji: '💼' }, { label: 'يتمرن', emoji: '🏋️‍♂️' }, { label: 'يطبخ', emoji: '🍳' },
    { label: 'يتسوق', emoji: '🛍️' }, { label: 'يسترخي', emoji: '🛀' }, { label: 'يصلي', emoji: '🕌' },
    { label: 'يرسم', emoji: '🎨' }, { label: 'يكتب', emoji: '✍️' }, { label: 'يصور', emoji: '📸' },
    { label: 'يبرمج', emoji: '💻' }, { label: 'ينام', emoji: '💤' }
];

export const MOCK_FRIENDS = [
  { id: '1', name: 'أحمد محمد' }, { id: '2', name: 'سارة علي' }, { id: '3', name: 'خالد عمر' },
  { id: '4', name: 'منى زكي' }, { id: '5', name: 'كريم محمود' }
];

export const MOCK_LOCATIONS = [
  'القاهرة، مصر', 'دبي، الإمارات', 'الرياض، السعودية', 'الإسكندرية، مصر', 
  'جدة، السعودية', 'عمان، الأردن', 'بيروت، لبنان', 'لندن، المملكة المتحدة'
];
