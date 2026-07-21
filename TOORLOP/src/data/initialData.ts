
import { User, Post, Story, Photo, Album, Page } from '../types';

// --- Utility for Secure ID Generation ---
export const generateId = (): string => {
  if (typeof crypto !== 'undefined' && crypto.randomUUID) {
    return crypto.randomUUID();
  }
  return `${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;
};

export const initialUser: User = {
  id: 'me',
  name: 'أحمد علي',
  // استخدام رابط الأفاتار الرمادي التقليدي
  avatar: 'https://www.w3schools.com/howto/img_avatar.png', 
  coverPhoto: '',
  online: true
};

// تم إضافة منشورات بتواريخ قديمة لمحاكاة ميزة "في مثل هذا اليوم"
export const initialPosts: Post[] = [
  {
    id: 'mem_1',
    author: initialUser,
    content: 'كان يوماً رائعاً في الرحلة الجبلية! 🏔️✨',
    image: 'https://picsum.photos/800/600?random=1001',
    timestamp: 'منذ عام', // سيتم التعرف عليه كذكرى
    likes: 124,
    comments: [],
    shares: 5,
    isPinned: false
  },
  {
    id: 'mem_2',
    author: initialUser,
    content: 'أول كود برمجي لي يعمل بنجاح! 💻🚀 شعور لا يوصف.',
    timestamp: 'منذ عامين', // سيتم التعرف عليه كذكرى
    likes: 89,
    comments: [],
    shares: 2,
    isPinned: false
  }
];

// Added initial stories to populate the feed immediately
export const initialStories: Story[] = [];

// Populate initial photos from posts that have images
export const initialYourPhotos: Photo[] = initialPosts
  .filter(post => post.image && !post.image.startsWith('data:video') && !post.image.endsWith('.mp4'))
  .map(post => ({
    id: post.id, // استخدام نفس المعرف للمزامنة
    url: post.image!,
    likes: post.likes,
    comments: post.comments,
    description: post.content,
    isLiked: post.isLiked,
    timestamp: post.timestamp
  }));

export const initialAlbums: Album[] = [
  { 
    id: 'a1', 
    title: 'صور الملف الشخصي', 
    coverUrl: initialUser.avatar, 
    type: 'profile',
    photos: [] 
  },
  { 
    id: 'a2', 
    title: 'صور الغلاف', 
    coverUrl: '', 
    type: 'cover',
    photos: [] 
  }
];

export const INITIAL_PAGES: Page[] = [
  { 
    id: '1', 
    name: 'ناشيونال جيوغرافيك', 
    avatar: 'https://picsum.photos/100/100?random=301', 
    coverUrl: 'https://picsum.photos/800/300?random=401',
    category: 'علوم وطبيعة', 
    likesCount: '50M', 
    followersCount: '52M',
    isLiked: true, 
    isFollowed: true,
    notifications: true,
    description: 'اكتشف روعة كوكبنا وما وراءه من خلال قصصنا وصورنا الحائزة على جوائز.',
    website: 'www.nationalgeographic.com',
    ownerId: 'system_1',
    admins: ['system_1'],
    moderators: [],
    membersList: []
  },
  { 
    id: '2', 
    name: 'نادي ليفربول', 
    avatar: 'https://picsum.photos/100/100?random=302', 
    coverUrl: 'https://picsum.photos/800/300?random=402',
    category: 'فريق رياضي', 
    likesCount: '30M', 
    followersCount: '32M',
    isLiked: true, 
    isFollowed: true,
    notifications: false,
    description: 'الصفحة الرسمية لنادي ليفربول لكرة القدم. لن تسير وحدك أبداً.',
    website: 'www.liverpoolfc.com',
    ownerId: 'system_2',
    admins: ['system_2'],
    moderators: [],
    membersList: []
  },
  { 
    id: '3', 
    name: 'أخبار التقنية', 
    avatar: 'https://picsum.photos/100/100?random=303', 
    coverUrl: 'https://picsum.photos/800/300?random=403',
    category: 'تكنولوجيا', 
    likesCount: '1.2M', 
    followersCount: '1.5M',
    isLiked: true,
    isFollowed: false,
    notifications: false,
    description: 'كل ما هو جديد في عالم التكنولوجيا والهواتف الذكية والذكاء الاصطناعي.',
    email: 'contact@technews.com',
    ownerId: 'me', // Owned by currentUser for demo
    admins: ['me'],
    moderators: ['u2', 'u3'],
    membersList: [
        { userId: 'u2', name: 'سارة علي', avatar: 'https://picsum.photos/50/50?random=102', role: 'moderator', joinedAt: '2023-01-15' },
        { userId: 'u3', name: 'أحمد محمد', avatar: 'https://picsum.photos/50/50?random=103', role: 'moderator', joinedAt: '2023-02-20' },
        { userId: 'u4', name: 'محمود حسن', avatar: 'https://picsum.photos/50/50?random=104', role: 'member', joinedAt: '2023-03-10' },
        { userId: 'u5', name: 'خالد عمر', avatar: 'https://picsum.photos/50/50?random=105', role: 'member', joinedAt: '2023-04-05' },
        { userId: 'u6', name: 'منى زكي', avatar: 'https://picsum.photos/50/50?random=106', role: 'member', joinedAt: '2023-05-12' },
        { userId: 'u7', name: 'كريم محمود', avatar: 'https://picsum.photos/50/50?random=107', role: 'member', joinedAt: '2023-06-20' },
        { userId: 'u8', name: 'نور الشريف', avatar: 'https://picsum.photos/50/50?random=108', role: 'member', joinedAt: '2023-07-01' }
    ]
  },
  { 
    id: '4', 
    name: 'مطبخ منال', 
    avatar: 'https://picsum.photos/100/100?random=304', 
    coverUrl: 'https://picsum.photos/800/300?random=404',
    category: 'طعام وشراب', 
    likesCount: '500K', 
    followersCount: '600K',
    isLiked: true, 
    isFollowed: true, 
    notifications: true,
    description: 'وصفات شهية وسهلة التحضير لكل ست بيت.',
    phone: '+201000000000',
    ownerId: 'system_3',
    admins: ['system_3'],
    moderators: [],
    membersList: []
  },
];

export const onlineUsers: User[] = Array.from({ length: 15 }).map((_, i) => ({
  id: `u${i}`,
  name: `مستخدم ${i + 1}`,
  avatar: `https://picsum.photos/50/50?random=${i + 10}`,
  online: Math.random() > 0.3
}));
