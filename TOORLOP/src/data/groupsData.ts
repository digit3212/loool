
import { User } from '../types';

export interface GroupMember {
  userId: string;
  name: string;
  avatar: string;
  role: 'admin' | 'moderator' | 'member';
  joinedAt: string;
  badges?: string[]; // e.g., "Top Contributor", "New Member"
}

export interface GroupFile {
  id: string;
  name: string;
  type: 'pdf' | 'doc' | 'image' | 'zip';
  size: string;
  uploadedBy: string;
  date: string;
  url: string;
}

export interface GroupEvent {
  id: string;
  title: string;
  date: string;
  location: string;
  description: string;
  attendees: number;
}

export interface Group {
  id: string;
  name: string;
  coverUrl: string;
  membersCount: string;
  /* Fix: Added 'moderator' to role type to allow overlap in GroupList filtering logic */
  role: 'admin' | 'moderator' | 'member' | 'guest';
  lastActive: string;
  privacy: 'public' | 'private';
  isPinned?: boolean;
  notifications?: boolean;
  description?: string;
  email?: string;
  website?: string;
  location?: string;
  postsCount?: number;
  isJoined?: boolean;
  membersList?: GroupMember[];
  
  // New Advanced Features
  themeColor?: string; // Hex code or Tailwind class prefix
  rules?: string[];
  pendingMembers?: number; // Request queue
  files?: GroupFile[];
  events?: GroupEvent[];
}

export const INITIAL_GROUPS: Group[] = [
  { 
    id: '1', 
    name: 'عشاق البرمجة', 
    coverUrl: 'https://picsum.photos/800/300?random=201', 
    membersCount: '15000', 
    role: 'admin', 
    lastActive: 'منذ ساعة',
    privacy: 'public',
    isPinned: true,
    notifications: true,
    description: 'مجموعة مخصصة للمبرمجين والمطورين لتبادل الخبرات والأكواد. نرحب بالجميع من المبتدئين إلى الخبراء.',
    email: 'contact@codinglovers.com',
    location: 'القاهرة، مصر',
    postsCount: 1542,
    isJoined: true,
    themeColor: 'blue',
    pendingMembers: 12,
    rules: [
      'ممنوع نشر الكود بدون تنسيق.',
      'الاحترام المتبادل واجب.',
      'ممنوع الإعلانات التجارية.'
    ],
    files: [
      { id: 'f1', name: 'دليل تعلم React.pdf', type: 'pdf', size: '2.5 MB', uploadedBy: 'أحمد علي', date: '2023-10-01', url: '#' },
      { id: 'f2', name: 'أكواد جاهزة.zip', type: 'zip', size: '15 MB', uploadedBy: 'سارة محمد', date: '2023-10-05', url: '#' }
    ],
    events: [
      { id: 'e1', title: 'ورشة عمل جافا سكريبت', date: '2023-11-20', location: 'أونلاين (Zoom)', description: 'ورشة عمل تفاعلية للمبتدئين', attendees: 150 }
    ],
    membersList: [
        { userId: 'me', name: 'أحمد علي', avatar: 'https://picsum.photos/200/200?random=1', role: 'admin', joinedAt: '2023-01-01', badges: ['Admin', 'Top Contributor'] },
        { userId: 'u2', name: 'سارة محمد', avatar: 'https://picsum.photos/50/50?random=102', role: 'moderator', joinedAt: '2023-02-15', badges: ['Moderator'] },
        { userId: 'u3', name: 'كريم محمود', avatar: 'https://picsum.photos/50/50?random=103', role: 'member', joinedAt: '2023-03-10', badges: ['Rising Star'] },
    ]
  },
  { 
    id: '2', 
    name: 'تصميم الجرافيك العربي', 
    coverUrl: 'https://picsum.photos/800/300?random=202', 
    membersCount: '42000', 
    role: 'member', 
    lastActive: 'منذ 5 ساعات',
    privacy: 'public',
    notifications: true,
    description: 'مجتمع للمصممين العرب لمشاركة أعمالهم ونقدها بشكل بناء.',
    postsCount: 890,
    isJoined: true,
    themeColor: 'purple',
    rules: ['حقوق الملكية محفوظة.', 'النقد البناء فقط.'],
    membersList: []
  },
  { 
    id: '3', 
    name: 'سوق المستعمل', 
    coverUrl: 'https://picsum.photos/800/300?random=203', 
    membersCount: '102000', 
    role: 'member', 
    lastActive: 'منذ يوم',
    privacy: 'private',
    notifications: false,
    description: 'بيع وشراء الأشياء المستعملة في جميع أنحاء البلاد.',
    postsCount: 5200,
    isJoined: true,
    membersList: []
  },
  { 
    id: '4', 
    name: 'وظائف خالية', 
    coverUrl: 'https://picsum.photos/800/300?random=204', 
    membersCount: '250000', 
    role: 'member', 
    lastActive: 'منذ 3 ساعات',
    privacy: 'public',
    notifications: true,
    description: 'نشر أحدث الوظائف المتاحة في السوق.',
    postsCount: 300,
    isJoined: true,
    membersList: []
  },
  { 
    id: '5', 
    name: 'نادي القراءة', 
    coverUrl: 'https://picsum.photos/800/300?random=205', 
    membersCount: '5300', 
    role: 'member', 
    lastActive: 'منذ يومين',
    privacy: 'private',
    notifications: false,
    description: 'نقاشات شهرية حول كتب مختارة.',
    postsCount: 120,
    isJoined: true,
    membersList: []
  },
  // Mock Discoverable Groups
  { 
    id: '6', 
    name: 'محبي السفر', 
    coverUrl: 'https://picsum.photos/800/300?random=206', 
    membersCount: '85000', 
    role: 'guest', 
    lastActive: 'منذ 30 دقيقة',
    privacy: 'public',
    notifications: false,
    description: 'شارك تجارب سفرك وصورك حول العالم.',
    postsCount: 950,
    isJoined: false,
    membersList: []
  },
  { 
    id: '7', 
    name: 'طبخ ووصفات', 
    coverUrl: 'https://picsum.photos/800/300?random=207', 
    membersCount: '300000', 
    role: 'guest', 
    lastActive: 'منذ 10 دقائق',
    privacy: 'public',
    notifications: false,
    description: 'أشهى الوصفات والأكلات من جميع أنحاء العالم.',
    postsCount: 10500,
    isJoined: false,
    membersList: []
  }
];
