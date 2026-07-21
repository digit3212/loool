export interface User {
  id: string;
  name: string;
  avatar: string;
  coverPhoto?: string;
  online?: boolean;
  /**
   * Indicates if the user has locked their profile.
   * If true, strictly restricts content visibility (posts, photos, videos) to friends only.
   */
  isLocked?: boolean;
}

export interface Comment {
  id: string;
  author: User;
  content: string;
  timestamp: string;
  likes: number;
  isLiked?: boolean;
}

export interface Post {
  id: string;
  author: User;
  content: string;
  image?: string; // URL or Base64
  likes: number;
  comments: Comment[];
  timestamp: string;
  shares: number;
  isLiked?: boolean;
  reaction?: string; // 'like' | 'love' | 'haha' | 'wow' | 'sad' | 'angry'
  isPinned?: boolean;
  isSaved?: boolean;
}

export interface Story {
  id: string;
  userId: string;
  userName: string;
  userAvatar: string;
  mediaUrl: string; // Image or Video URL/Base64
  type: 'image' | 'text';
  timestamp: string;
  viewed?: boolean;
}

/* Fix: Added optional timestamp property to Photo interface to allow consistent access across media types in the UI */
export interface Photo {
  id: string;
  url: string;
  likes: number;
  comments: Comment[];
  timestamp?: string;
  description?: string;
  isLiked?: boolean;
  reaction?: string;
  isSaved?: boolean;
}

export interface VideoItem {
  id: string;
  url: string; // Base64 or URL
  title: string;
  views: number;
  timestamp: string;
  duration: string;
  type: 'video' | 'reel';
  likes: number;
  comments: Comment[];
  isLiked?: boolean;
  reaction?: string;
  isSaved?: boolean;
}

export interface Album {
  id: string;
  title: string;
  coverUrl: string;
  type?: 'profile' | 'cover' | 'user';
  photos: Photo[];
}

export interface PageMember {
  userId: string;
  name: string;
  avatar: string;
  role: 'admin' | 'moderator' | 'member';
  joinedAt: string;
}

export interface Page {
  id: string;
  name: string;
  avatar: string;
  coverUrl?: string;
  category: string;
  likesCount: string;
  followersCount?: string;
  isLiked: boolean;
  isFollowed?: boolean;
  description?: string;
  notifications?: boolean;
  website?: string;
  email?: string;
  phone?: string;
  // Advanced Permissions Fields
  ownerId: string;
  admins: string[]; // List of User IDs
  moderators: string[]; // List of User IDs
  membersList: PageMember[]; // Mock list for management
}

export interface GroupMember {
  userId: string;
  name: string;
  avatar: string;
  role: 'admin' | 'moderator' | 'member';
  joinedAt: string;
  badges?: string[];
}

export interface Group {
  id: string;
  name: string;
  coverUrl: string;
  membersCount: string;
  role: 'admin' | 'moderator' | 'member' | 'guest';
  lastActive?: string;
  privacy: 'public' | 'private';
  notifications?: boolean;
  isPinned?: boolean;
  description?: string;
  postsCount?: number;
  isJoined?: boolean;
  membersList?: GroupMember[];
  email?: string;
  website?: string;
  location?: string;
  // New Advanced Features
  themeColor?: string;
  rules?: string[];
  pendingMembers?: number;
  files?: any[]; // Simplified for base type
  events?: any[]; // Simplified for base type
}

export type GroupPageTab = 'posts' | 'about' | 'members' | 'photos' | 'videos' | 'files' | 'events' | 'admin';

export interface ProductComment {
  id: string;
  user: User;
  text: string;
  timestamp: string;
}

export interface Product {
  id: string;
  title: string;
  price: number;
  currency: string;
  category: string;
  image: string;
  images?: string[]; // Added support for multiple images
  location: string;
  seller: User;
  description: string;
  condition: 'new' | 'used_good' | 'used_fair';
  date: string;
  isSaved?: boolean;
  timestamp: number; // For sorting
  comments?: ProductComment[];
}

export type View = 
  | 'home' 
  | 'profile' 
  | 'friends' 
  | 'nearby' 
  | 'suggestions' 
  | 'watch' 
  | 'marketplace' 
  | 'saved' 
  | 'profile_videos' 
  | 'gaming'
  | 'memories'  
  | 'groups'    
  | 'events'    
  | 'pages';    

export type TabType = 'posts' | 'about' | 'friends' | 'photos' | 'videos'