
import React, { useRef, useState } from 'react';
import { 
  X, Camera, Save, Loader2, UserPlus, Search, 
  Trash2, AlertTriangle, LogOut, UserCog, Check, Palette, Shield, Plus, Calendar, MapPin, Clock
} from 'lucide-react';
import { Group } from '../../data/groupsData';

// --- Create Group Modal ---
interface CreateGroupModalProps {
  onClose: () => void;
  onCreate: () => void;
  isLoading: boolean;
  groupName: string;
  setGroupName: (val: string) => void;
  privacy: 'public' | 'private';
  setPrivacy: (val: 'public' | 'private') => void;
  description: string;
  setDescription: (val: string) => void;
}

export const CreateGroupModal: React.FC<CreateGroupModalProps> = ({
  onClose, onCreate, isLoading, groupName, setGroupName, privacy, setPrivacy, description, setDescription
}) => {
  return (
    <div className="fixed inset-0 z-[100] bg-black/60 flex items-center justify-center p-4 animate-fadeIn backdrop-blur-sm">
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-2xl w-full max-w-md overflow-hidden animate-scaleIn">
          <div className="p-4 border-b border-gray-100 dark:border-gray-700 flex justify-between items-center bg-gray-50 dark:bg-gray-700/50">
              <h3 className="font-bold text-lg text-gray-900 dark:text-white flex items-center gap-2">
                  <UserPlus className="w-5 h-5 text-fb-blue" />
                  إنشاء مجموعة جديدة
              </h3>
              <button onClick={onClose} className="text-gray-500 hover:bg-gray-200 dark:hover:bg-gray-600 rounded-full p-1 transition">
                  <X className="w-5 h-5" />
              </button>
          </div>
          <div className="p-6 space-y-5">
              <div>
                  <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1.5">اسم المجموعة</label>
                  <input 
                      type="text" 
                      className="w-full border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-lg p-3 outline-none focus:ring-2 focus:ring-fb-blue focus:border-transparent transition shadow-sm"
                      placeholder="أدخل اسم المجموعة..."
                      value={groupName}
                      onChange={(e) => setGroupName(e.target.value)}
                  />
              </div>
              <div>
                  <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1.5">الخصوصية</label>
                  <select 
                      className="w-full border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-lg p-3 appearance-none outline-none focus:ring-2 focus:ring-fb-blue focus:border-transparent transition shadow-sm"
                      value={privacy}
                      onChange={(e) => setPrivacy(e.target.value as 'public' | 'private')}
                  >
                      <option value="public">عامة</option>
                      <option value="private">خاصة</option>
                  </select>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-1.5 px-1">
                      {privacy === 'public' ? 'يمكن لأي شخص رؤية أعضاء المجموعة وما ينشرونه.' : 'يمكن للأعضاء فقط رؤية من هم في المجموعة وما ينشرونه.'}
                  </p>
              </div>
              <div>
                  <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1.5">الوصف (اختياري)</label>
                  <textarea 
                      className="w-full border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-lg p-3 outline-none focus:ring-2 focus:ring-fb-blue focus:border-transparent transition shadow-sm h-24 resize-none"
                      placeholder="اكتب وصفاً مختصراً للمجموعة..."
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                  />
              </div>
          </div>
          <div className="p-4 border-t border-gray-100 dark:border-gray-700 bg-gray-50 dark:bg-gray-700/50 flex justify-end gap-3">
              <button onClick={onClose} className="px-5 py-2.5 text-gray-700 dark:text-gray-300 font-bold hover:bg-gray-200 dark:hover:bg-gray-600 rounded-lg transition text-sm">إلغاء</button>
              <button 
                onClick={onCreate} 
                disabled={isLoading}
                className="px-6 py-2.5 bg-fb-blue text-white font-bold rounded-lg hover:bg-blue-700 transition shadow-md flex items-center gap-2 disabled:opacity-70 text-sm"
              >
                  {isLoading && <Loader2 className="w-4 h-4 animate-spin" />}
                  إنشاء
              </button>
          </div>
      </div>
    </div>
  );
};

// --- Edit Group Modal ---
interface EditGroupModalProps {
  onClose: () => void;
  onSave: () => void;
  isLoading: boolean;
  name: string; setName: (val: string) => void;
  description: string; setDescription: (val: string) => void;
  coverUrl: string; 
  onCoverUpload: (e: React.ChangeEvent<HTMLInputElement>) => void;
  privacy: 'public' | 'private'; setPrivacy: (val: 'public' | 'private') => void;
  email: string; setEmail: (val: string) => void;
  website: string; setWebsite: (val: string) => void;
  location: string; setLocation: (val: string) => void;
  themeColor?: string; setThemeColor?: (val: string) => void;
}

export const EditGroupModal: React.FC<EditGroupModalProps> = ({
  onClose, onSave, isLoading, name, setName, description, setDescription,
  coverUrl, onCoverUpload, privacy, setPrivacy, email, setEmail, website, setWebsite, location, setLocation,
  themeColor = 'emerald', setThemeColor
}) => {
  const fileRef = useRef<HTMLInputElement>(null);
  const [activeTab, setActiveTab] = useState<'general' | 'appearance' | 'rules'>('general');
  const [newRule, setNewRule] = useState('');
  const [rules, setRules] = useState<string[]>([]); 

  const handleAddRule = () => {
      if(newRule.trim()) {
          setRules([...rules, newRule]);
          setNewRule('');
      }
  }

  return (
    <div className="fixed inset-0 z-[100] bg-black/60 flex items-center justify-center p-4 animate-fadeIn backdrop-blur-sm">
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-2xl w-full max-w-lg overflow-hidden animate-scaleIn max-h-[90vh] flex flex-col">
          <div className="p-4 border-b border-gray-100 dark:border-gray-700 flex justify-between items-center bg-gray-50 dark:bg-gray-700/50">
              <h3 className="font-bold text-lg text-gray-900 dark:text-white">تعديل المجموعة</h3>
              <button onClick={onClose} className="text-gray-500 hover:bg-gray-200 dark:hover:bg-gray-600 rounded-full p-1 transition">
                  <X className="w-5 h-5" />
              </button>
          </div>

          <div className="flex border-b dark:border-gray-700 px-2">
              <button onClick={() => setActiveTab('general')} className={`flex-1 py-3 text-sm font-bold border-b-2 transition ${activeTab === 'general' ? 'border-fb-blue text-fb-blue' : 'border-transparent text-gray-500 hover:text-gray-800 dark:hover:text-white'}`}>عام</button>
              <button onClick={() => setActiveTab('appearance')} className={`flex-1 py-3 text-sm font-bold border-b-2 transition ${activeTab === 'appearance' ? 'border-fb-blue text-fb-blue' : 'border-transparent text-gray-500 hover:text-gray-800 dark:hover:text-white'}`}>المظهر</button>
              <button onClick={() => setActiveTab('rules')} className={`flex-1 py-3 text-sm font-bold border-b-2 transition ${activeTab === 'rules' ? 'border-fb-blue text-fb-blue' : 'border-transparent text-gray-500 hover:text-gray-800 dark:hover:text-white'}`}>القواعد</button>
          </div>

          <div className="p-6 space-y-5 overflow-y-auto flex-1">
              {activeTab === 'general' && (
                  <>
                    <div className="relative w-full h-40 bg-gray-200 dark:bg-gray-600 rounded-xl overflow-hidden group cursor-pointer border-2 border-dashed border-gray-400 dark:border-gray-500 hover:border-fb-blue transition" onClick={() => fileRef.current?.click()}>
                        {coverUrl ? (
                            <img src={coverUrl} alt="cover preview" className="w-full h-full object-cover" />
                        ) : (
                            <div className="absolute inset-0 flex flex-col items-center justify-center text-gray-500 dark:text-gray-300">
                                <Camera className="w-10 h-10 mb-2" />
                                <span className="text-sm font-medium">تغيير صورة الغلاف</span>
                            </div>
                        )}
                        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition flex items-center justify-center text-white font-bold">
                            <Camera className="w-6 h-6 mr-2" /> تغيير الصورة
                        </div>
                        <input type="file" ref={fileRef} className="hidden" accept="image/*" onChange={onCoverUpload} />
                    </div>
                    
                    <div>
                        <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1.5">اسم المجموعة</label>
                        <input 
                            type="text" 
                            className="w-full border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-lg p-3 outline-none focus:ring-2 focus:ring-fb-blue transition"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                        />
                    </div>
                    
                    <div>
                        <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1.5">الخصوصية</label>
                        <select 
                            className="w-full border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-lg p-3 outline-none focus:ring-2 focus:ring-fb-blue transition"
                            value={privacy}
                            onChange={(e) => setPrivacy(e.target.value as 'public' | 'private')}
                        >
                            <option value="public">عامة</option>
                            <option value="private">خاصة</option>
                        </select>
                    </div>

                    <div>
                        <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1.5">وصف المجموعة</label>
                        <textarea 
                            className="w-full border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-lg p-3 outline-none focus:ring-2 focus:ring-fb-blue transition h-24 resize-none"
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            placeholder="أضف وصفاً للمجموعة..."
                        />
                    </div>
                    
                    <div className="border-t border-gray-200 dark:border-gray-700 pt-4">
                        <label className="block text-sm font-bold text-gray-500 dark:text-gray-400 mb-4 uppercase tracking-wide">معلومات التواصل (اختياري)</label>
                        
                        <div className="space-y-4">
                            <div>
                                <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">البريد الإلكتروني</label>
                                <input 
                                    type="email"
                                    className="w-full border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-lg p-2.5 text-sm outline-none focus:ring-2 focus:ring-fb-blue transition"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    placeholder="example@email.com"
                                />
                            </div>
                            <div>
                                <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">موقع الويب</label>
                                <input 
                                    type="text"
                                    className="w-full border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-lg p-2.5 text-sm outline-none focus:ring-2 focus:ring-fb-blue transition"
                                    value={website}
                                    onChange={(e) => setWebsite(e.target.value)}
                                    placeholder="www.example.com"
                                />
                            </div>
                            <div>
                                <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">الموقع الجغرافي</label>
                                <input 
                                    type="text"
                                    className="w-full border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-lg p-2.5 text-sm outline-none focus:ring-2 focus:ring-fb-blue transition"
                                    value={location}
                                    onChange={(e) => setLocation(e.target.value)}
                                    placeholder="المدينة، الدولة"
                                />
                            </div>
                        </div>
                    </div>
                  </>
              )}

              {activeTab === 'appearance' && (
                  <div className="space-y-4">
                      <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1.5 flex items-center gap-2">
                          <Palette className="w-4 h-4" /> لون المجموعة
                      </label>
                      <div className="flex gap-3">
                          {['emerald', 'blue', 'purple', 'red', 'orange'].map(color => (
                              <button 
                                key={color}
                                onClick={() => setThemeColor && setThemeColor(color)}
                                className={`w-10 h-10 rounded-full border-2 transition ${themeColor === color ? 'border-gray-900 dark:border-white scale-110' : 'border-transparent'}`}
                                style={{ backgroundColor: color === 'emerald' ? '#047857' : color === 'blue' ? '#2563EB' : color === 'purple' ? '#9333EA' : color === 'red' ? '#DC2626' : '#EA580C' }}
                              />
                          ))}
                      </div>
                      <p className="text-xs text-gray-500 mt-2">سيتم تطبيق هذا اللون على الأزرار والعناوين داخل المجموعة.</p>
                  </div>
              )}

              {activeTab === 'rules' && (
                  <div className="space-y-4">
                      <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1.5 flex items-center gap-2">
                          <Shield className="w-4 h-4" /> قواعد المجموعة
                      </label>
                      <div className="flex gap-2">
                          <input 
                              type="text" 
                              className="flex-1 border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-lg p-2.5 text-sm outline-none focus:ring-2 focus:ring-fb-blue"
                              placeholder="أضف قاعدة جديدة..."
                              value={newRule}
                              onChange={(e) => setNewRule(e.target.value)}
                          />
                          <button onClick={handleAddRule} className="bg-fb-blue text-white p-2.5 rounded-lg hover:bg-blue-700 transition">
                              <Plus className="w-5 h-5" />
                          </button>
                      </div>
                      <ul className="space-y-2 max-h-60 overflow-y-auto">
                          {rules.map((rule, idx) => (
                              <li key={idx} className="flex justify-between items-center bg-gray-50 dark:bg-gray-700/50 p-3 rounded-lg border border-gray-100 dark:border-gray-700">
                                  <span className="text-sm text-gray-700 dark:text-gray-300">{idx + 1}. {rule}</span>
                                  <button onClick={() => setRules(rules.filter((_, i) => i !== idx))} className="text-red-500 hover:bg-red-50 p-1 rounded transition"><Trash2 className="w-4 h-4" /></button>
                              </li>
                          ))}
                          {rules.length === 0 && <li className="text-center text-gray-400 text-sm italic">لم تتم إضافة أي قواعد بعد.</li>}
                      </ul>
                  </div>
              )}
          </div>
          
          <div className="p-4 border-t border-gray-100 dark:border-gray-700 bg-gray-50 dark:bg-gray-700/50 flex justify-end gap-3">
              <button onClick={onClose} className="px-5 py-2.5 text-gray-700 dark:text-gray-300 font-bold hover:bg-gray-200 dark:hover:bg-gray-600 rounded-lg transition text-sm">إلغاء</button>
              <button 
                onClick={onSave} 
                disabled={isLoading}
                className="px-6 py-2.5 bg-fb-blue text-white font-bold rounded-lg hover:bg-blue-700 transition shadow-sm flex items-center gap-2 disabled:opacity-70 text-sm"
              >
                  {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                  حفظ التغييرات
              </button>
          </div>
      </div>
    </div>
  );
};

// --- Members Modal ---
interface MembersModalProps {
  group: Group;
  onClose: () => void;
  onAddMember: () => void;
  onRemoveMember: (id: string) => void;
  searchTerm: string;
  setSearchTerm: (val: string) => void;
  roleType: 'admin' | 'moderator' | 'member';
  setRoleType: (val: 'admin' | 'moderator' | 'member') => void;
}

export const GroupMembersModal: React.FC<MembersModalProps> = ({
  group, onClose, onAddMember, onRemoveMember, searchTerm, setSearchTerm, roleType, setRoleType
}) => {
  return (
    <div className="fixed inset-0 z-[120] bg-black/60 flex items-center justify-center p-4 animate-fadeIn backdrop-blur-sm">
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-2xl w-full max-w-lg overflow-hidden animate-scaleIn flex flex-col max-h-[80vh]">
          <div className="p-4 border-b border-gray-100 dark:border-gray-700 flex justify-between items-center bg-gray-50 dark:bg-gray-700/50">
              <h3 className="font-bold text-lg text-gray-900 dark:text-white flex items-center gap-2">
                  <UserCog className="w-5 h-5 text-fb-blue" />
                  إدارة الأعضاء
              </h3>
              <button onClick={onClose} className="text-gray-500 hover:bg-gray-200 dark:hover:bg-gray-600 rounded-full p-1 transition">
                  <X className="w-5 h-5" />
              </button>
          </div>

          <div className="p-6 overflow-y-auto flex-1">
              <div className="mb-6 bg-blue-50 dark:bg-blue-900/10 p-4 rounded-xl border border-blue-100 dark:border-blue-800/30">
                  <h4 className="font-bold text-sm text-fb-blue mb-3 flex items-center gap-2">
                      <UserPlus className="w-4 h-4" /> إضافة عضو جديد
                  </h4>
                  <div className="flex gap-2 mb-3">
                      <div className="flex-1">
                          <input 
                              type="text" 
                              placeholder="اسم العضو..." 
                              className="w-full border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-lg p-2.5 text-sm focus:ring-2 focus:ring-fb-blue outline-none transition"
                              value={searchTerm}
                              onChange={(e) => setSearchTerm(e.target.value)}
                          />
                      </div>
                      <select 
                          className="border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-lg p-2.5 text-sm focus:ring-2 focus:ring-fb-blue outline-none transition"
                          value={roleType}
                          onChange={(e) => setRoleType(e.target.value as any)}
                      >
                          <option value="member">عضو</option>
                          <option value="moderator">مشرف</option>
                          <option value="admin">مسؤول</option>
                      </select>
                  </div>
                  <button 
                      onClick={onAddMember}
                      disabled={!searchTerm.trim()}
                      className="w-full bg-fb-blue text-white py-2.5 rounded-lg text-sm font-bold hover:bg-blue-700 disabled:opacity-50 transition shadow-sm"
                  >
                      إضافة
                  </button>
              </div>

              <div>
                  <h4 className="font-bold text-gray-700 dark:text-gray-300 mb-3 text-sm">قائمة الأعضاء</h4>
                  <div className="space-y-3">
                      {group.membersList?.map((member) => (
                          <div key={member.userId} className="flex items-center justify-between p-3 bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 hover:shadow-sm transition">
                              <div className="flex items-center gap-3">
                                  <img src={member.avatar} alt={member.name} className="w-10 h-10 rounded-full object-cover" />
                                  <div>
                                      <div className="font-bold text-sm text-gray-900 dark:text-white flex items-center gap-2">
                                          {member.name}
                                          {member.badges?.map(badge => (
                                              <span key={badge} className="text-[9px] bg-yellow-100 text-yellow-700 px-1.5 py-0.5 rounded border border-yellow-200">{badge}</span>
                                          ))}
                                      </div>
                                      <div className="text-xs text-gray-500 dark:text-gray-400 font-medium">
                                          {member.role === 'admin' ? 'مسؤول' : member.role === 'moderator' ? 'مشرف' : 'عضو'}
                                      </div>
                                  </div>
                              </div>
                              <button 
                                  onClick={() => onRemoveMember(member.userId)}
                                  className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-full transition"
                                  title="إزالة"
                              >
                                  <Trash2 className="w-4 h-4" />
                              </button>
                          </div>
                      ))}
                      {(!group.membersList || group.membersList.length === 0) && (
                          <div className="text-center text-gray-400 text-sm py-8 italic bg-gray-50 dark:bg-gray-800 rounded-xl border border-dashed border-gray-200">لا يوجد أعضاء.</div>
                      )}
                  </div>
              </div>
          </div>
          <div className="p-4 border-t border-gray-100 dark:border-gray-700 bg-gray-50 dark:bg-gray-700/50 flex justify-end">
              <button onClick={onClose} className="px-6 py-2.5 bg-gray-200 dark:bg-gray-600 text-gray-700 dark:text-gray-200 font-bold rounded-lg hover:bg-gray-300 dark:hover:bg-gray-500 transition text-sm">
                  إغلاق
              </button>
          </div>
      </div>
    </div>
  );
};

// --- Invite Modal ---
interface InviteModalProps {
  onClose: () => void;
  onInvite: (id: string) => void;
  search: string;
  setSearch: (val: string) => void;
  invitedUsers: string[];
}

export const InviteFriendsModal: React.FC<InviteModalProps> = ({ onClose, onInvite, search, setSearch, invitedUsers }) => {
  return (
    <div className="fixed inset-0 z-[100] bg-black/60 flex items-center justify-center p-4 animate-fadeIn backdrop-blur-sm">
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-2xl w-full max-w-sm overflow-hidden animate-scaleIn">
          <div className="p-4 border-b border-gray-100 dark:border-gray-700 flex justify-between items-center bg-gray-50 dark:bg-gray-700/50">
              <h3 className="font-bold text-lg text-gray-900 dark:text-white flex items-center gap-2">
                  <UserPlus className="w-5 h-5 text-fb-blue" />
                  دعوة الأصدقاء
              </h3>
              <button onClick={onClose} className="text-gray-500 hover:bg-gray-200 dark:hover:bg-gray-600 rounded-full p-1 transition">
                  <X className="w-5 h-5" />
              </button>
          </div>
          <div className="p-4">
              <div className="mb-4 relative">
                  <Search className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input 
                      type="text" 
                      placeholder="بحث عن أصدقاء..." 
                      className="w-full bg-gray-100 dark:bg-gray-700 rounded-full py-2.5 pr-10 pl-4 text-sm outline-none transition focus:ring-2 focus:ring-fb-blue"
                      value={search}
                      onChange={(e) => setSearch(e.target.value)}
                  />
              </div>
              <div className="space-y-2 max-h-60 overflow-y-auto pr-1">
                  {[1, 2, 3, 4, 5].map((i) => {
                      const userId = `friend-${i}`;
                      const isInvited = invitedUsers.includes(userId);
                      return (
                          <div key={i} className="flex items-center justify-between p-2 hover:bg-gray-50 dark:hover:bg-gray-700 rounded-lg cursor-pointer transition">
                              <div className="flex items-center gap-3">
                                  <img src={`https://picsum.photos/40/40?random=${i+50}`} className="w-10 h-10 rounded-full" alt="friend" />
                                  <span className="font-bold text-sm text-gray-800 dark:text-gray-200">صديق مقترح {i}</span>
                              </div>
                              <button 
                                  onClick={() => !isInvited && onInvite(userId)}
                                  disabled={isInvited}
                                  className={`px-4 py-1.5 rounded-full text-xs font-bold transition ${isInvited ? 'bg-gray-200 dark:bg-gray-600 text-gray-500' : 'bg-blue-50 dark:bg-blue-900/30 text-fb-blue hover:bg-blue-100'}`}
                              >
                                  {isInvited ? 'تم الإرسال' : 'دعوة'}
                              </button>
                          </div>
                      );
                  })}
              </div>
          </div>
          <div className="p-4 border-t border-gray-100 dark:border-gray-700 bg-gray-50 dark:bg-gray-700/50 flex justify-end">
              <button onClick={onClose} className="px-6 py-2 bg-fb-blue text-white font-bold rounded-lg hover:bg-blue-700 transition text-sm shadow-sm">تم</button>
          </div>
      </div>
    </div>
  );
};

// --- Create Event Modal ---
interface CreateGroupEventModalProps {
  onClose: () => void;
  onCreate: (eventData: any) => void;
  isLoading: boolean;
}

export const CreateGroupEventModal: React.FC<CreateGroupEventModalProps> = ({ onClose, onCreate, isLoading }) => {
    const [title, setTitle] = useState('');
    const [date, setDate] = useState('');
    const [time, setTime] = useState('');
    const [location, setLocation] = useState('');
    const [description, setDescription] = useState('');

    const handleSubmit = () => {
        if (!title || !date || !location) return;
        onCreate({ title, date, time, location, description });
    };

    return (
        <div className="fixed inset-0 z-[100] bg-black/60 flex items-center justify-center p-4 animate-fadeIn backdrop-blur-sm">
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-2xl w-full max-w-md overflow-hidden animate-scaleIn">
                <div className="p-4 border-b border-gray-100 dark:border-gray-700 flex justify-between items-center bg-gray-50 dark:bg-gray-700/50">
                    <h3 className="font-bold text-lg text-gray-900 dark:text-white flex items-center gap-2">
                        <Calendar className="w-5 h-5 text-fb-blue" />
                        إنشاء مناسبة جديدة
                    </h3>
                    <button onClick={onClose} className="text-gray-500 hover:bg-gray-200 dark:hover:bg-gray-600 rounded-full p-1 transition">
                        <X className="w-5 h-5" />
                    </button>
                </div>
                <div className="p-6 space-y-4">
                    <div>
                        <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1.5">اسم المناسبة</label>
                        <input 
                            type="text" 
                            className="w-full border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-lg p-2.5 text-sm outline-none focus:ring-2 focus:ring-fb-blue transition"
                            placeholder="مثال: ورشة عمل، اجتماع..."
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                        />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1.5">التاريخ</label>
                            <input 
                                type="date" 
                                className="w-full border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-lg p-2.5 text-sm outline-none focus:ring-2 focus:ring-fb-blue transition"
                                value={date}
                                onChange={(e) => setDate(e.target.value)}
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1.5">الوقت</label>
                            <input 
                                type="time" 
                                className="w-full border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-lg p-2.5 text-sm outline-none focus:ring-2 focus:ring-fb-blue transition"
                                value={time}
                                onChange={(e) => setTime(e.target.value)}
                            />
                        </div>
                    </div>
                    <div>
                        <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1.5">الموقع</label>
                        <div className="relative">
                            <MapPin className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                            <input 
                                type="text" 
                                className="w-full border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-lg p-2.5 pr-10 text-sm outline-none focus:ring-2 focus:ring-fb-blue transition"
                                placeholder="إضافة موقع..."
                                value={location}
                                onChange={(e) => setLocation(e.target.value)}
                            />
                        </div>
                    </div>
                    <div>
                        <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1.5">الوصف</label>
                        <textarea 
                            className="w-full border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-lg p-2.5 text-sm outline-none focus:ring-2 focus:ring-fb-blue transition h-20 resize-none"
                            placeholder="تفاصيل إضافية..."
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                        />
                    </div>
                </div>
                <div className="p-4 border-t border-gray-100 dark:border-gray-700 bg-gray-50 dark:bg-gray-700/50 flex justify-end gap-3">
                    <button onClick={onClose} className="px-5 py-2.5 text-gray-700 dark:text-gray-300 font-bold hover:bg-gray-200 dark:hover:bg-gray-600 rounded-lg transition text-sm">إلغاء</button>
                    <button 
                        onClick={handleSubmit} 
                        disabled={isLoading || !title || !date || !location}
                        className="px-6 py-2.5 bg-fb-blue text-white font-bold rounded-lg hover:bg-blue-700 transition shadow-md flex items-center gap-2 disabled:opacity-70 text-sm"
                    >
                        {isLoading && <Loader2 className="w-4 h-4 animate-spin" />}
                        إنشاء المناسبة
                    </button>
                </div>
            </div>
        </div>
    );
};

// --- Confirmation Modal ---
interface ConfirmModalProps {
  onClose: () => void;
  onConfirm: () => void;
  isLoading: boolean;
  type: 'delete' | 'leave' | null;
  groupName: string;
}

export const ConfirmModal: React.FC<ConfirmModalProps> = ({ onClose, onConfirm, isLoading, type, groupName }) => {
  return (
    <div className="fixed inset-0 z-[100] bg-black/60 flex items-center justify-center p-4 animate-fadeIn backdrop-blur-sm">
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-2xl w-full max-w-sm overflow-hidden animate-scaleIn">
            <div className="p-4 border-b border-gray-100 dark:border-gray-700 flex justify-between items-center bg-gray-50 dark:bg-gray-700/50">
                <h3 className="font-bold text-lg text-gray-900 dark:text-white flex items-center gap-2">
                    {type === 'delete' ? <Trash2 className="w-5 h-5 text-red-500" /> : <LogOut className="w-5 h-5 text-orange-500" />}
                    {type === 'delete' ? 'حذف المجموعة' : 'مغادرة المجموعة'}
                </h3>
                <button onClick={onClose} className="text-gray-500 hover:bg-gray-200 dark:hover:bg-gray-600 rounded-full p-1 transition">
                    <X className="w-5 h-5" />
                </button>
            </div>
            <div className="p-6 text-center">
                {type === 'delete' ? (
                    <div className="flex flex-col items-center">
                        <div className="w-16 h-16 bg-red-100 dark:bg-red-900/20 rounded-full flex items-center justify-center mb-4">
                            <AlertTriangle className="w-8 h-8 text-red-600" />
                        </div>
                        <p className="text-gray-700 dark:text-gray-300 font-bold mb-2">
                            هل أنت متأكد من حذف مجموعة "<span className="text-red-600">{groupName}</span>" نهائياً؟
                        </p>
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                            هذا الإجراء لا يمكن التراجع عنه. سيتم إزالة جميع الأعضاء والمحتوى.
                        </p>
                    </div>
                ) : (
                    <div className="flex flex-col items-center">
                        <div className="w-16 h-16 bg-orange-100 dark:bg-orange-900/20 rounded-full flex items-center justify-center mb-4">
                            <LogOut className="w-8 h-8 text-orange-600" />
                        </div>
                        <p className="text-gray-700 dark:text-gray-300 font-bold mb-2">
                            هل تريد حقاً مغادرة مجموعة "<span className="text-fb-blue">{groupName}</span>"؟
                        </p>
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                            لن تتمكن من رؤية منشورات المجموعة أو المشاركة فيها إلا إذا انضممت إليها مرة أخرى.
                        </p>
                    </div>
                )}
            </div>
            <div className="p-4 border-t border-gray-100 dark:border-gray-700 bg-gray-50 dark:bg-gray-700/50 flex justify-end gap-2">
                <button onClick={onClose} className="px-5 py-2.5 text-gray-700 dark:text-gray-300 font-bold hover:bg-gray-200 dark:hover:bg-gray-600 rounded-lg transition text-sm">إلغاء</button>
                <button 
                  onClick={onConfirm} 
                  disabled={isLoading}
                  className={`px-6 py-2.5 text-white font-bold rounded-lg transition shadow-sm flex items-center gap-2 disabled:opacity-70 text-sm ${type === 'delete' ? 'bg-red-600 hover:bg-red-700' : 'bg-orange-600 hover:bg-orange-700'}`}
                >
                    {isLoading && <Loader2 className="w-4 h-4 animate-spin" />}
                    {type === 'delete' ? 'تأكيد الحذف' : 'تأكيد المغادرة'}
                </button>
            </div>
        </div>
    </div>
  );
};
