import React, { useState, useRef, useEffect, useMemo } from 'react';
import { createPortal } from 'react-dom';
import { 
  Check, 
  X, 
  Download, 
  ThumbsUp, 
  MessageCircle, 
  Share2, 
  Send, 
  Smile, 
  Globe, 
  Shield,
  Trash2,
  AlertTriangle,
  CheckCircle
} from 'lucide-react';
import { User, Post, Comment } from '../types';
import { INITIAL_GROUPS, Group, GroupMember } from '../data/groupsData';
import { CreateGroupModal, EditGroupModal, GroupMembersModal, InviteFriendsModal, ConfirmModal } from './groups/GroupModals';
import GroupList from './groups/GroupList';
import GroupDetail from './groups/GroupDetail';
import ProfileMediaLightbox from './ProfileMediaLightbox';
import { safeSetItem, safeGetItem } from '../utils/safeStorage';
import MarketplaceShareModal from './marketplace/MarketplaceShareModal';

interface ProfileGroupsProps {
  currentUser: User;
  onToggleSave?: (item: any) => void;
  onLike?: (id: string, reactionType?: string) => void;
  onComment?: (id: string, text: string) => void;
  onDeleteComment?: (id: string, commentId: string) => void;
  onLikeComment?: (id: string, commentId: string) => void;
  onDeletePostExternal?: (id: string, skipConfirm?: boolean) => void;
  groupPostsStore: Record<string, Post[]>;
  setGroupPostsStore: React.Dispatch<React.SetStateAction<Record<string, Post[]>>>;
}

type TabType = 'all' | 'admin' | 'member' | 'discover';
type ModalActionType = 'leave' | 'delete' | 'delete_post' | null;
type GroupPageTab = 'posts' | 'about' | 'members' | 'photos' | 'videos' | 'files' | 'events' | 'admin';

const ProfileGroups: React.FC<ProfileGroupsProps> = ({ 
  currentUser,
  onToggleSave,
  onLike,
  onComment,
  onDeleteComment,
  onLikeComment,
  onDeletePostExternal,
  groupPostsStore,
  setGroupPostsStore
}) => {
  
  // Sync local store alias with global store passed in Props
  const postsStore = groupPostsStore;
  const setPostsStore = setGroupPostsStore;

  // Load groups from safe storage or use INITIAL
  const [groups, setGroups] = useState<Group[]>(() => {
      const saved = safeGetItem('tourloop_groups');
      return Array.isArray(saved) ? saved : INITIAL_GROUPS;
  });

  const [searchTerm, setSearchTerm] = useState('');
  const [activeTab, setActiveTab] = useState<TabType>('all');
  
  // Interaction States
  const [notification, setNotification] = useState<{message: string, type: 'success' | 'info' | 'error'} | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  
  // Group Detail View State
  const [viewingGroup, setViewingGroup] = useState<Group | null>(null);
  const [groupPosts, setGroupPosts] = useState<Post[]>([]);
  const [activeGroupTab, setActiveGroupTab] = useState<GroupPageTab>('posts'); 

  // Edit Group State
  const [showEditModal, setShowEditModal] = useState(false);
  const [editGroupName, setEditGroupName] = useState('');
  const [editGroupDescription, setEditGroupDescription] = useState('');
  const [editGroupCover, setEditGroupCover] = useState('');
  const [editGroupPrivacy, setEditGroupPrivacy] = useState<'public' | 'private'>('public');
  const [editGroupEmail, setEditGroupEmail] = useState('');
  const [editGroupWebsite, setEditGroupWebsite] = useState('');
  const [editGroupLocation, setEditGroupLocation] = useState('');
  
  // Create Group Modal States
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [newGroupName, setNewGroupName] = useState('');
  const [newGroupPrivacy, setNewGroupPrivacy] = useState<'public' | 'private'>('public');
  const [newGroupDescription, setNewGroupDescription] = useState('');

  // Invite Modal States
  const [showInviteModal, setShowInviteModal] = useState(false);
  const [inviteSearch, setInviteSearch] = useState('');
  const [invitedUsers, setInvitedUsers] = useState<string[]>([]);

  // Member Management States
  const [showMembersModal, setShowMembersModal] = useState(false);
  const [memberSearchTerm, setMemberSearchTerm] = useState('');
  const [selectedRoleType, setSelectedRoleType] = useState<'admin' | 'moderator' | 'member'>('member');

  // Confirmation Modal State
  const [confirmModal, setConfirmModal] = useState<{ isOpen: boolean; type: ModalActionType; groupId: string | null; groupName: string; targetPostId?: string }>(
    { isOpen: false, type: null, groupId: null, groupName: '', targetPostId: undefined }
  );

  // Lightbox State
  const [viewingMedia, setViewingMedia] = useState<{ url: string, type: 'image' | 'video', postId?: string } | null>(null);
  
  // Share Modal State
  const [showShareModal, setShowShareModal] = useState(false);
  const [postToShare, setPostToShare] = useState<Post | null>(null);

  // --- Persistence Effects using safe storage ---
  useEffect(() => {
      safeSetItem('tourloop_groups', JSON.stringify(groups));
  }, [groups]);

  // Sync posts display when global store changes
  useEffect(() => {
      if (viewingGroup) {
          const loadedPosts = postsStore[viewingGroup.id] || [];
          if (Array.isArray(loadedPosts) && loadedPosts.length > 0) {
              setGroupPosts(loadedPosts);
          } else if (viewingGroup.postsCount && viewingGroup.postsCount > 0 && !postsStore[viewingGroup.id]) {
               const mockPost: Post = {
                  id: `mock_${viewingGroup.id}_1`,
                  author: { id: 'admin', name: 'Admin User', avatar: `https://ui-avatars.com/api/?name=${viewingGroup.name}&background=random` },
                  content: `أهلاً بكم جميعاً في مجموعة ${viewingGroup.name}! نرجو الالتزام بالقوانين والقواعد العامة للمجموعة.\n\nنتمنى لكم وقتاً ممتعاً ومفيداً.`,
                  timestamp: 'منذ ساعتين',
                  likes: 15,
                  comments: [],
                  shares: 2,
                  isPinned: true
              };
              setPostsStore(prev => ({ ...prev, [viewingGroup.id]: [mockPost] }));
              setGroupPosts([mockPost]);
          } else {
              setGroupPosts([]);
          }
      }
  }, [viewingGroup?.id, postsStore, setPostsStore]); 

  const showNotification = (message: string, type: 'success' | 'info' | 'error' = 'success') => {
    setNotification({ message, type });
    setTimeout(() => setNotification(null), 3000);
  };

  const sanitizeInput = (input: string) => {
    return input.replace(/<[^>]*>?/gm, '').trim();
  };

  const readFileAsBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = error => reject(error);
    });
  };

  const handleCreateGroupPost = (content: string, image?: string) => {
      if (!viewingGroup) return;

      const newPost: Post = {
          id: `gp_${Date.now()}`,
          author: currentUser,
          content,
          image,
          timestamp: 'الآن',
          likes: 0,
          comments: [],
          shares: 0,
          isPinned: false
      };
      
      setPostsStore(prev => ({
          ...prev,
          [viewingGroup.id]: [newPost, ...(prev[viewingGroup.id] || [])]
      }));
      
      if (viewingGroup) {
          const updated = { ...viewingGroup, postsCount: (viewingGroup.postsCount || 0) + 1 };
          setViewingGroup(updated);
          setGroups(prev => prev.map(g => g.id === updated.id ? updated : g));
      }
      showNotification('تم نشر المنشور في المجموعة', 'success');
  };

  const handleCreateGroup = () => {
    const sanitizedName = sanitizeInput(newGroupName);
    if (!sanitizedName) { showNotification('يرجى إدخال اسم المجموعة', 'error'); return; }
    if (sanitizedName.length < 3) { showNotification('اسم المجموعة يجب أن يكون 3 أحرف على الأقل', 'error'); return; }

    const newGroup: Group = {
        id: Date.now().toString(),
        name: sanitizedName,
        coverUrl: `https://picsum.photos/800/300?random=${Math.floor(Math.random() * 1000)}`,
        membersCount: '1',
        role: 'admin',
        lastActive: 'الآن',
        privacy: newGroupPrivacy,
        notifications: true,
        isPinned: false,
        description: newGroupDescription || 'مجموعة جديدة تم إنشاؤها للتو.',
        postsCount: 0,
        isJoined: true,
        membersList: [{ userId: currentUser.id, name: currentUser.name, avatar: currentUser.avatar, role: 'admin', joinedAt: new Date().toISOString().split('T')[0] }]
    };

    setGroups(prevGroups => [newGroup, ...prevGroups]);
    setShowCreateModal(false);
    setNewGroupName('');
    setNewGroupPrivacy('public');
    setNewGroupDescription('');
    showNotification('تم إنشاء المجموعة بنجاح', 'success');
    setViewingGroup(newGroup);
    setActiveGroupTab('posts');
    setGroupPosts([]);
  };

  const handleJoinGroup = (groupId: string, e?: React.MouseEvent) => {
      e?.stopPropagation();
      setGroups(prev => prev.map(g => {
          if (g.id === groupId) {
              const currentCount = parseInt(g.membersCount.replace(/[^0-9]/g, '')) || 0;
              const newMember: GroupMember = { userId: currentUser.id, name: currentUser.name, avatar: currentUser.avatar, role: 'member', joinedAt: new Date().toISOString().split('T')[0] };
              const updatedGroup = { ...g, role: 'member' as const, isJoined: true, membersCount: String(currentCount + 1), membersList: [...(g.membersList || []), newMember] };
              if (viewingGroup && viewingGroup.id === groupId) setViewingGroup(updatedGroup);
              return updatedGroup;
          }
          return g;
      }));
      showNotification('تم الانضمام للمجموعة بنجاح', 'success');
  };

  const handleLeaveGroup = (groupId: string) => {
      const group = groups.find(g => g.id === groupId);
      if (group) {
          setGroups(prev => prev.map(g => {
              if (g.id === groupId) {
                  const currentCount = parseInt(g.membersCount.replace(/[^0-9]/g, '')) || 1;
                  const updatedGroup = { ...g, role: 'guest' as const, isJoined: false, membersCount: String(Math.max(0, currentCount - 1)), membersList: (g.membersList || []).filter(m => m.userId !== currentUser.id) };
                  if (viewingGroup && viewingGroup.id === groupId) setViewingGroup(updatedGroup);
                  return updatedGroup;
              }
              return g;
          }));
          showNotification(`لقد غادرت مجموعة "${group.name}"`, 'info');
      }
  };

  const handleUpdateGroup = () => {
      if (!viewingGroup) return;
      if (!editGroupName.trim()) { showNotification('لا يمكن ترك اسم المجموعة فارغاً', 'error'); return; }
      const isCoverChanged = editGroupCover && editGroupCover !== viewingGroup.coverUrl;
      const updatedGroup: Group = { ...viewingGroup, name: editGroupName, description: editGroupDescription, coverUrl: editGroupCover || viewingGroup.coverUrl, privacy: editGroupPrivacy, email: editGroupEmail, website: editGroupWebsite, location: editGroupLocation };
      
      setGroups(prev => prev.map(g => g.id === viewingGroup.id ? updatedGroup : g));
      setViewingGroup(updatedGroup);
      setShowEditModal(false);
      if (isCoverChanged) handleCreateGroupPost(`قام ${currentUser.name} بتحديث صورة الغلاف للمجموعة.`, editGroupCover);
      showNotification('تم تحديث بيانات المجموعة بنجاح', 'success');
  };

  const handleInvite = (userId: string) => {
      setInvitedUsers(prev => [...prev, userId]);
      showNotification('تم إرسال الدعوة بنجاح', 'success');
  };

  const handleCoverUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
      if (e.target.files && e.target.files[0]) {
          const file = e.target.files[0];
          if (file.size > 5 * 1024 * 1024) { showNotification('حجم الصورة كبير جداً', 'error'); return; }
          const base64 = await readFileAsBase64(file);
          setEditGroupCover(base64);
          e.target.value = '';
      }
  };

  const handleCoverChangeMain = async (e: React.ChangeEvent<HTMLInputElement>) => {
      if (e.target.files && e.target.files[0] && viewingGroup) {
          const file = e.target.files[0];
          const base64 = await readFileAsBase64(file);
          const newPostsCount = (viewingGroup.postsCount || 0) + 1;
          const updatedGroup = { ...viewingGroup, coverUrl: base64, postsCount: newPostsCount };
          
          const newPost: Post = { 
              id: `gp_${Date.now()}`, 
              author: currentUser, 
              content: `قام ${currentUser.name} بتحديث صورة الغلاف للمجموعة.`,
              image: base64,
              timestamp: 'الآن',
              likes: 0,
              comments: [],
              shares: 0,
              isPinned: false
          };

          setPostsStore(prev => ({
              ...prev,
              [viewingGroup.id]: [newPost, ...(prev[viewingGroup.id] || [])]
          }));

          setGroups(prev => prev.map(g => g.id === viewingGroup.id ? updatedGroup : g));
          setViewingGroup(updatedGroup);
          
          showNotification('تم تحديث صورة الغلاف بنجاح', 'success');
          e.target.value = '';
      }
  };

  const handleConfirmAction = () => {
      if (confirmModal.type === 'leave' && confirmModal.groupId) {
          handleLeaveGroup(confirmModal.groupId);
      } else if (confirmModal.type === 'delete' && confirmModal.groupId) {
          setGroups(prev => prev.filter(g => g.id !== confirmModal.groupId));
          if (viewingGroup && viewingGroup.id === confirmModal.groupId) setViewingGroup(null);
          showNotification('تم حذف المجموعة بنجاح', 'info');
      } else if (confirmModal.type === 'delete_post' && confirmModal.targetPostId && viewingGroup) {
          const postId = confirmModal.targetPostId;
          if (onDeletePostExternal) onDeletePostExternal(postId, true);
      }
      setConfirmModal({ isOpen: false, type: null, groupId: null, groupName: '', targetPostId: undefined });
  };

  const handleMenuAction = (action: any, id: string) => {
      const group = groups.find(g => g.id === id);
      if (!group) return;

      if (action === 'leave') {
          setConfirmModal({ isOpen: true, type: 'leave', groupId: id, groupName: group.name });
      } else if (action === 'delete') {
          setConfirmModal({ isOpen: true, type: 'delete', groupId: id, groupName: group.name });
      } else if (action === 'pin') {
          const updated = { ...group, isPinned: !group.isPinned };
          setGroups(prev => prev.map(g => g.id === id ? updated : g));
          if (viewingGroup && viewingGroup.id === id) setViewingGroup(updated);
          showNotification(updated.isPinned ? 'تم تثبيت المجموعة' : 'تم إلغاء تثبيت المجموعة', 'success');
      } else if (action === 'notification') {
          const updated = { ...group, notifications: !group.notifications };
          setGroups(prev => prev.map(g => g.id === id ? updated : g));
          if (viewingGroup && viewingGroup.id === id) setViewingGroup(updated);
          showNotification(updated.notifications ? 'تم تفعيل الإشعارات' : 'تم إيقاف الإشعارات', 'info');
      } else if (action === 'copy') {
          navigator.clipboard.writeText(window.location.href); 
          showNotification('تم نسخ رابط المجموعة', 'success');
      } else if (action === 'report') {
          showNotification('تم إرسال البلاغ للمراجعة', 'info');
      }
  };

  const handleAddMember = () => {
      if (!viewingGroup || !memberSearchTerm.trim()) return;
      const newMember = {
          userId: `u_${Date.now()}`,
          name: memberSearchTerm,
          avatar: `https://ui-avatars.com/api/?name=${memberSearchTerm}&background=random`,
          role: selectedRoleType,
          joinedAt: new Date().toISOString().split('T')[0]
      };
      
      const currentCount = parseInt(viewingGroup.membersCount.replace(/[^0-9]/g, '')) || 0;
      const updatedGroup = { 
          ...viewingGroup, 
          membersList: [...(viewingGroup.membersList || []), newMember],
          membersCount: String(currentCount + 1)
      };
      
      setGroups(prev => prev.map(g => g.id === viewingGroup.id ? updatedGroup : g));
      setViewingGroup(updatedGroup);
      setMemberSearchTerm('');
      showNotification(`تم إضافة ${newMember.name} كـ ${selectedRoleType === 'admin' ? 'مسؤول' : 'مشرف'}`, 'success');
  };

  const handleRemoveMember = (id: string) => {
      if (!viewingGroup) return;
      const currentCount = parseInt(viewingGroup.membersCount.replace(/[^0-9]/g, '')) || 0;
      const updatedGroup = { 
          ...viewingGroup, 
          membersList: (viewingGroup.membersList || []).filter(m => m.userId !== id),
          membersCount: String(Math.max(0, currentCount - 1))
      };
      setGroups(prev => prev.map(g => g.id === viewingGroup.id ? updatedGroup : g));
      setViewingGroup(updatedGroup);
      showNotification('تم إزالة العضو بنجاح', 'info');
  };

  const handleMediaUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
      if (e.target.files && e.target.files[0] && viewingGroup) {
          const file = e.target.files[0];
          
          if(file.size > 50 * 1024 * 1024) { // 50MB limit
             showNotification('حجم الملف كبير جداً', 'error');
             e.target.value = '';
             return;
          }

          showNotification('جاري رفع الوسائط...', 'info');

          try {
              const base64 = await readFileAsBase64(file);
              const isVideo = file.type.startsWith('video/');
              
              const newPost: Post = {
                  id: `gp_media_${Date.now()}`,
                  author: currentUser,
                  content: `قام ${currentUser.name} بمشاركة ${isVideo ? 'فيديو' : 'صورة'} في المجموعة.`,
                  image: base64,
                  timestamp: 'الآن',
                  likes: 0,
                  comments: [],
                  shares: 0,
                  isPinned: false
              };

              setPostsStore(prev => ({
                  ...prev,
                  [viewingGroup.id]: [newPost, ...(prev[viewingGroup.id] || [])]
              }));
              
              const updatedGroup = { ...viewingGroup, postsCount: (viewingGroup.postsCount || 0) + 1 };
              setViewingGroup(updatedGroup);
              setGroups(prev => prev.map(g => g.id === updatedGroup.id ? updatedGroup : g));

              showNotification(`تم رفع ${isVideo ? 'الفيديو' : 'الصورة'} بنجاح`, 'success');
          } catch (error) {
              console.error("Upload error", error);
              showNotification('فشل رفع الملف', 'error');
          }
          e.target.value = '';
      }
  };

  // --- Handlers for Likes & Comments ---
  /* Fix: Removed redundant local state updates that conflicted with global handlers, ensuring Like works and comments aren't doubled. */
  const handlePostLike = (postId: string, reactionType?: string) => {
      // Pass specifically selected reaction to parent global sync
      if (onLike) onLike(postId, reactionType);
  };

  const handlePostComment = (postId: string, text: string) => {
      // Pass to parent global sync handler - avoid local state update here to prevent duplication
      if (onComment) onComment(postId, text);
  };

  const handleDeletePostComment = (postId: string, commentId: string) => {
      if (onDeleteComment) onDeleteComment(postId, commentId);
  };

  const handleLikePostComment = (postId: string, commentId: string) => {
      if (onLikeComment) onLikeComment(postId, commentId);
  };

  const handlePostTogglePin = (postId: string) => {
      const updatePosts = (posts: Post[]) => posts.map(p => p.id === postId ? { ...p, isPinned: !p.isPinned } : p);
      if (viewingGroup) {
          setPostsStore(prev => ({
              ...prev,
              [viewingGroup.id]: updatePosts(prev[viewingGroup.id] || [])
          }));
      }
  };

  const handlePostDelete = (postId: string) => {
      if (onDeletePostExternal) {
          onDeletePostExternal(postId);
      }
  };

  const handlePostSave = (post: Post) => {
      if (onToggleSave) onToggleSave(post);
  };
  
  const handlePostCopyLink = (link: string) => {
      navigator.clipboard.writeText(link || window.location.href);
      showNotification('تم نسخ الرابط', 'success');
  };

  const handleShareClick = (post: Post) => {
      setPostToShare(post);
      setShowShareModal(true);
  }

  // --- Lightbox Logic ---
  const groupMediaList = useMemo(() => {
    return groupPosts.filter(p => p.image).map(p => p.image!);
  }, [groupPosts]);

  const viewingPost = useMemo(() => {
    if (!viewingMedia?.postId) return null;
    return groupPosts.find(p => p.id === viewingMedia.postId) || null;
  }, [groupPosts, viewingMedia]);

  const handleNextMedia = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!viewingMedia) return;
    const currentIdx = groupMediaList.indexOf(viewingMedia.url);
    const nextIdx = (currentIdx + 1) % groupMediaList.length;
    const nextUrl = groupMediaList[nextIdx];
    const nextPost = groupPosts.find(p => p.image === nextUrl);
    if (nextPost) {
        setViewingMedia({ 
            url: nextUrl, 
            type: (nextUrl.startsWith('data:video') || nextUrl.endsWith('.mp4')) ? 'video' : 'image', 
            postId: nextPost.id 
        });
    }
  };

  const handlePrevMedia = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!viewingMedia) return;
    const currentIdx = groupMediaList.indexOf(viewingMedia.url);
    const prevIdx = (currentIdx - 1 + groupMediaList.length) % groupMediaList.length;
    const prevUrl = groupMediaList[prevIdx];
    const prevPost = groupPosts.find(p => p.image === prevUrl);
    if (prevPost) {
        setViewingMedia({ 
            url: prevUrl, 
            type: (prevUrl.startsWith('data:video') || prevUrl.endsWith('.mp4')) ? 'video' : 'image', 
            postId: prevPost.id 
        });
    }
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm min-h-[500px] animate-fadeIn p-4 md:p-6 relative transition-colors duration-300">
      
      {/* --- CONTENT AREA --- */}
      {viewingGroup ? (
          <GroupDetail 
            viewingGroup={viewingGroup}
            currentUser={currentUser}
            groupPosts={groupPosts}
            activeGroupTab={activeGroupTab}
            setActiveGroupTab={setActiveGroupTab}
            onBack={() => setViewingGroup(null)}
            onJoin={handleJoinGroup}
            onLeave={(id) => setConfirmModal({ isOpen: true, type: 'leave', groupId: id, groupName: viewingGroup.name })}
            onMenuAction={handleMenuAction}
            onCoverChangeMain={handleCoverChangeMain}
            onCreatePost={handleCreateGroupPost}
            onPostTogglePin={handlePostTogglePin}
            onPostDelete={handlePostDelete}
            onPostLike={handlePostLike}
            onPostSave={handlePostSave}
            onPostCopyLink={handlePostCopyLink}
            onMediaClick={(url, type, postId) => setViewingMedia({ url, type, postId })}
            onMediaUpload={handleMediaUpload}
            onEditGroup={() => {
               setEditGroupName(viewingGroup.name);
               setEditGroupDescription(viewingGroup.description || '');
               setEditGroupCover(viewingGroup.coverUrl);
               setEditGroupPrivacy(viewingGroup.privacy);
               setEditGroupEmail(viewingGroup.email || '');
               setEditGroupWebsite(viewingGroup.website || '');
               setEditGroupLocation(viewingGroup.location || '');
               setShowEditModal(true);
            }}
            onInviteClick={() => setShowInviteModal(true)}
            onManageMembers={() => setShowMembersModal(true)}
            onRemoveMember={handleRemoveMember}
            onPostComment={handlePostComment}
            onDeletePostComment={handleDeletePostComment}
            onLikePostComment={handleLikePostComment}
          />
      ) : (
        <GroupList 
          groups={groups}
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          onJoinGroup={handleJoinGroup}
          onVisitGroup={(g) => { setViewingGroup(g); setActiveGroupTab('posts'); }}
          onMenuAction={handleMenuAction}
          onCreateGroupClick={() => setShowCreateModal(true)}
        />
      )}

      {/* --- MODALS --- */}
      {showCreateModal && (
        <CreateGroupModal
          onClose={() => setShowCreateModal(false)}
          onCreate={handleCreateGroup}
          isLoading={isLoading}
          groupName={newGroupName}
          setGroupName={setNewGroupName}
          privacy={newGroupPrivacy}
          setPrivacy={setNewGroupPrivacy}
          description={newGroupDescription}
          setDescription={setNewGroupDescription}
        />
      )}

      {showEditModal && viewingGroup && (
        <EditGroupModal 
          /* Fix: Corrected function call from setShowEditPageModal to setShowEditModal */
          onClose={() => setShowEditModal(false)}
          onSave={handleUpdateGroup}
          isLoading={isLoading}
          name={editGroupName} setName={setEditGroupName}
          description={editGroupDescription} setDescription={setEditGroupDescription}
          coverUrl={editGroupCover} onCoverUpload={handleCoverUpload}
          privacy={editGroupPrivacy} setPrivacy={setEditGroupPrivacy}
          email={editGroupEmail} setEmail={setEditGroupEmail}
          website={editGroupWebsite} setWebsite={setEditGroupWebsite}
          location={editGroupLocation} setLocation={setEditGroupLocation}
        />
      )}

      {showMembersModal && viewingGroup && (
        <GroupMembersModal 
          group={viewingGroup}
          onClose={() => setShowMembersModal(false)}
          onAddMember={handleAddMember}
          onRemoveMember={handleRemoveMember}
          searchTerm={memberSearchTerm}
          setSearchTerm={setMemberSearchTerm}
          roleType={selectedRoleType}
          setRoleType={setSelectedRoleType}
        />
      )}

      {showInviteModal && (
        <InviteFriendsModal 
          onClose={() => setShowInviteModal(false)}
          onInvite={handleInvite}
          search={inviteSearch}
          setSearch={setInviteSearch}
          invitedUsers={invitedUsers}
        />
      )}

      {confirmModal.isOpen && (confirmModal.type === 'leave' || confirmModal.type === 'delete') && (
        <ConfirmModal 
          onClose={() => setConfirmModal({ ...confirmModal, isOpen: false })}
          onConfirm={handleConfirmAction}
          isLoading={isLoading}
          type={confirmModal.type as 'leave' | 'delete'}
          groupName={confirmModal.groupName}
        />
      )}
      
      {/* Post Deletion Custom Modal */}
      {confirmModal.type === 'delete_post' && confirmModal.isOpen && (
           <div className="fixed inset-0 z-[500000] flex items-center justify-center bg-black/60 p-4 animate-fadeIn backdrop-blur-sm">
              <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-2xl w-full max-w-sm border border-gray-200 dark:border-gray-700 animate-scaleIn">
                  <h3 className="font-bold text-lg mb-2 text-gray-900 dark:text-white flex items-center gap-2">
                    <Trash2 className="w-5 h-5 text-red-500" />
                    حذف المنشور؟
                  </h3>
                  <p className="text-gray-600 dark:text-gray-300 text-sm mb-6 leading-relaxed">
                    هل أنت متأكد من حذف هذا المنشور نهائياً من المجموعة؟
                  </p>
                  <div className="flex justify-end gap-3">
                      <button onClick={() => setConfirmModal({...confirmModal, isOpen: false})} className="px-5 py-2 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg text-sm font-bold transition">إلغاء</button>
                      <button 
                          onClick={handleConfirmAction} 
                          className="px-6 py-2 bg-red-600 text-white rounded-lg text-sm font-bold hover:bg-red-700 transition shadow-lg"
                      >
                          تأكيد الحذف
                      </button>
                  </div>
              </div>
          </div>
      )}

      {/* --- MEDIA VIEWER LIGHTBOX --- */}
      {viewingMedia && typeof document !== 'undefined' && createPortal(
        <ProfileMediaLightbox
            viewingMedia={viewingMedia}
            viewingPost={viewingPost}
            profileImagesList={groupMediaList}
            currentUser={currentUser}
            isOwnProfile={viewingPost?.author.id === currentUser.id || viewingGroup?.role === 'admin'}
            isSaved={false} 
            onClose={() => setViewingMedia(null)}
            onNext={handleNextMedia}
            onPrev={handlePrevMedia}
            onLike={(id, reaction) => handlePostLike(id, reaction)}
            onComment={(text) => viewingPost && handlePostComment(viewingPost.id, text)}
            onDeleteComment={(commentId) => viewingPost && handleDeletePostComment(viewingPost.id, commentId)}
            onDeletePost={() => {
                 if (viewingPost) {
                     handlePostDelete(viewingPost.id);
                     setViewingMedia(null);
                 }
            }}
            onToggleSave={() => viewingPost && handlePostSave(viewingPost)}
            onTogglePin={() => viewingPost && handlePostTogglePin(viewingPost.id)}
            onUpdateAvatar={() => {}} 
            onLikeComment={(commentId) => viewingPost && handleLikePostComment(viewingPost.id, commentId)}
        />,
        document.body
      )}

      {/* --- ADVANCED SHARE MODAL --- */}
      {showShareModal && postToShare && (
           <MarketplaceShareModal 
                product={{
                    id: postToShare.id,
                    title: postToShare.content ? postToShare.content.substring(0, 30) : 'منشور',
                    image: postToShare.image || '',
                    price: 0,
                    currency: '',
                    category: '',
                    location: '',
                    seller: postToShare.author,
                    description: postToShare.content,
                    condition: 'new',
                    date: postToShare.timestamp,
                    timestamp: Date.now()
                }}
                onClose={() => setShowShareModal(false)}
           />
      )}

      {/* استخدام Portal للتنبيهات المحلية لضمان ظهورها في المقدمة دائماً */}
      {notification && typeof document !== 'undefined' && createPortal(
        <div className="fixed bottom-6 right-6 z-[999999] animate-bounce-in w-72">
            <div className={`flex items-center gap-3 px-4 py-3 rounded-lg shadow-xl text-white border border-white/10 ${notification.type === 'success' ? 'bg-emerald-600' : notification.type === 'error' ? 'bg-red-600' : 'bg-blue-600'}`}>
                {notification.type === 'success' ? <CheckCircle className="w-5 h-5" /> : <Shield className="w-5 h-5" />}
                <span className="font-medium text-sm">{notification.message}</span>
                <button onClick={() => setNotification(null)} className="mr-2 text-white/80 hover:text-white transition">
                    <X className="w-4 h-4" />
                </button>
            </div>
        </div>,
        document.body
      )}
    </div>
  );
};

export default ProfileGroups;