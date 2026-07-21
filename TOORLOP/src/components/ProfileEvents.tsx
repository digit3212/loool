import React, { useState, useEffect, useRef, useMemo, useCallback } from 'react';
import { 
  Calendar, 
  MapPin, 
  Star, 
  MoreHorizontal, 
  Share2, 
  Check, 
  Flag, 
  Bell, 
  X, 
  BellOff, 
  Plus, 
  Search, 
  Clock, 
  Globe, 
  Lock, 
  Trash2, 
  Edit3, 
  Image as ImageIcon,
  Loader2,
  Info
} from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

// --- Types & Interfaces ---

type EventCategory = 'upcoming' | 'past';
type EventStatus = 'going' | 'interested' | 'none';
type EventPrivacy = 'public' | 'private';

interface Event {
  id: string;
  title: string;
  description: string;
  date: { day: string, month: string, fullDate: string };
  time: string;
  location: string;
  interestedCount: number;
  coverUrl: string;
  status: EventStatus;
  category: EventCategory;
  privacy: EventPrivacy;
  organizerId: string; // To check ownership
}

// Mock Current User ID for permission checks (In a real app, this comes from Auth Context)
const CURRENT_USER_ID = 'me'; 

const INITIAL_EVENTS: Event[] = [
  { 
    id: '1', 
    title: 'مؤتمر المطورين السنوي', 
    description: 'انضم إلينا في أكبر تجمع للمطورين في المنطقة. سنتحدث عن أحدث التقنيات في عالم الويب والذكاء الاصطناعي.',
    date: { day: '15', month: 'NOV', fullDate: '2023-11-15' }, 
    time: '09:00 ص',
    location: 'مركز المؤتمرات، القاهرة', 
    interestedCount: 2500, 
    coverUrl: 'https://picsum.photos/800/400?random=401', 
    status: 'going', 
    category: 'upcoming',
    privacy: 'public',
    organizerId: 'system'
  },
  { 
    id: '2', 
    title: 'حفل موسيقي خيري', 
    description: 'حفل موسيقي يعود ريعه للأعمال الخيرية. استمتع بالموسيقى وساهم في عمل الخير.',
    date: { day: '20', month: 'DEC', fullDate: '2023-12-20' }, 
    time: '08:00 م',
    location: 'دار الأوبرا', 
    interestedCount: 500, 
    coverUrl: 'https://picsum.photos/800/400?random=402', 
    status: 'interested', 
    category: 'upcoming',
    privacy: 'public',
    organizerId: 'system'
  },
  { 
    id: '3', 
    title: 'عيد ميلاد خاص', 
    description: 'حفل عيد ميلاد خاص للأصدقاء المقربين.',
    date: { day: '05', month: 'JAN', fullDate: '2024-01-05' }, 
    time: '07:00 م',
    location: 'فيلا خاصة', 
    interestedCount: 15, 
    coverUrl: 'https://picsum.photos/800/400?random=403', 
    status: 'going', 
    category: 'upcoming',
    privacy: 'private',
    organizerId: 'me' // Owned by user
  },
  { 
    id: '4', 
    title: 'معرض الفنون البصرية', 
    description: 'عرض لأحدث الأعمال الفنية للفنانين المحليين.',
    date: { day: '10', month: 'OCT', fullDate: '2023-10-10' }, 
    time: '10:00 ص',
    location: 'وسط البلد', 
    interestedCount: 300, 
    coverUrl: 'https://picsum.photos/800/400?random=404', 
    status: 'none', 
    category: 'past',
    privacy: 'public',
    organizerId: 'system'
  },
];

// --- Helpers ---

const MONTHS_SHORT = ["JAN", "FEB", "MAR", "APR", "MAY", "JUN", "JUL", "AUG", "SEP", "OCT", "NOV", "DEC"];

// Security: Basic Input Sanitization
const sanitizeInput = (input: string) => {
  return input.replace(/<[^>]*>?/gm, '').trim();
};

const ProfileEvents: React.FC = () => {
  const { t } = useLanguage();
  
  // --- State ---
  const [events, setEvents] = useState<Event[]>(INITIAL_EVENTS);
  const [activeFilter, setActiveFilter] = useState<EventCategory>('upcoming');
  const [searchTerm, setSearchTerm] = useState('');
  
  // Interaction State
  const [activeMenuId, setActiveMenuId] = useState<string | null>(null);
  const [notification, setNotification] = useState<{ message: string, type: 'success' | 'info' | 'error' } | null>(null);
  const [eventNotifications, setEventNotifications] = useState<Record<string, boolean>>({});
  
  // Modal States
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [editingEventId, setEditingEventId] = useState<string | null>(null);
  const [deletingEventId, setDeletingEventId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  // Form State
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    date: '',
    time: '',
    location: '',
    privacy: 'public' as EventPrivacy,
    coverUrl: ''
  });

  const menuRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // --- Effects ---
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setActiveMenuId(null);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // --- Handlers ---

  const showNotification = useCallback((message: string, type: 'success' | 'info' | 'error' = 'success') => {
    setNotification({ message, type });
    setTimeout(() => setNotification(null), 3500);
  }, []);

  // Status Toggle (Going/Interested)
  const handleStatusToggle = useCallback((eventId: string) => {
    setEvents(prevEvents => prevEvents.map(event => {
      if (event.id === eventId) {
        let newStatus: EventStatus = 'none';
        if (event.status === 'none') newStatus = 'interested';
        else if (event.status === 'interested') newStatus = 'going';
        else if (event.status === 'going') newStatus = 'none';
        
        const statusText = newStatus === 'going' ? 'تم تأكيد الحضور ✅' : newStatus === 'interested' ? 'أنت مهتم بهذا الحدث ⭐' : 'تم إلغاء الاهتمام';
        showNotification(statusText, 'info');
        
        // Update count visually
        let newCount = event.interestedCount;
        if (newStatus !== 'none' && event.status === 'none') newCount++;
        if (newStatus === 'none' && event.status !== 'none') newCount--;

        return { ...event, status: newStatus, interestedCount: newCount };
      }
      return event;
    }));
  }, [showNotification]);

  // Share Functionality
  const handleShare = useCallback(async (event: Event) => {
    const url = `${window.location.origin}/events/${event.id}`;
    const shareData = {
      title: event.title,
      text: `Check out this event: ${event.title}`,
      url: url,
    };

    try {
      if (navigator.share) {
        await navigator.share(shareData);
      } else {
        await navigator.clipboard.writeText(url);
        showNotification('تم نسخ رابط المناسبة', 'success');
      }
    } catch (err) {
      // Fallback
      try {
        await navigator.clipboard.writeText(url);
        showNotification('تم نسخ رابط المناسبة', 'success');
      } catch (e) {
        showNotification('تعذر نسخ الرابط', 'error');
      }
    }
  }, [showNotification]);

  // ICS Download
  const downloadICS = (event: Event) => {
    const icsContent = `BEGIN:VCALENDAR
VERSION:2.0
BEGIN:VEVENT
SUMMARY:${event.title}
LOCATION:${event.location}
DESCRIPTION:${event.description}
DTSTART:${event.date.fullDate.replace(/-/g, '')}T${event.time.replace(':', '').replace(/ [AP]M/, '')}00
END:VEVENT
END:VCALENDAR`;

    const blob = new Blob([icsContent], { type: 'text/calendar;charset=utf-8' });
    const link = document.createElement('a');
    link.href = window.URL.createObjectURL(blob);
    link.setAttribute('download', `event_${event.id}.ics`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Menu Actions
  const handleMenuAction = useCallback((action: 'calendar' | 'notifications' | 'report' | 'edit' | 'delete', eventId: string) => {
    setActiveMenuId(null);
    const event = events.find(e => e.id === eventId);
    if (!event) return;

    if (action === 'calendar') {
      downloadICS(event);
      showNotification('تم تنزيل ملف التقويم', 'success');
    } else if (action === 'notifications') {
      setEventNotifications(prev => {
        const newState = !prev[eventId];
        showNotification(newState ? 'تم تفعيل الإشعارات لهذا الحدث' : 'تم إيقاف الإشعارات لهذا الحدث', 'info');
        return { ...prev, [eventId]: newState };
      });
    } else if (action === 'report') {
      showNotification('تم استلام البلاغ، شكراً لك', 'info');
    } else if (action === 'edit') {
      // Check permissions
      if (event.organizerId !== CURRENT_USER_ID) {
        showNotification('ليس لديك صلاحية تعديل هذا الحدث', 'error');
        return;
      }
      setEditingEventId(eventId);
      setFormData({
        title: event.title,
        description: event.description,
        date: event.date.fullDate,
        time: event.time,
        location: event.location,
        privacy: event.privacy,
        coverUrl: event.coverUrl
      });
      setIsEditModalOpen(true);
    } else if (action === 'delete') {
       if (event.organizerId !== CURRENT_USER_ID) {
        showNotification('ليس لديك صلاحية حذف هذا الحدث', 'error');
        return;
      }
      setDeletingEventId(eventId);
      setIsDeleteModalOpen(true);
    }
  }, [events, showNotification]);

  // --- CRUD Logic ---

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        showNotification('حجم الصورة كبير جداً (الحد الأقصى 5 ميجابايت)', 'error');
        return;
      }
      if (!file.type.startsWith('image/')) {
        showNotification('يرجى اختيار ملف صورة صالح', 'error');
        return;
      }

      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData({ ...formData, coverUrl: reader.result as string });
      };
      reader.readAsDataURL(file);
    }
  };

  const resetForm = () => {
    setFormData({
      title: '',
      description: '',
      date: '',
      time: '',
      location: '',
      privacy: 'public',
      coverUrl: ''
    });
    setEditingEventId(null);
    setDeletingEventId(null);
  };

  const handleCreateEvent = () => {
    // Validation
    if (!formData.title || !formData.date || !formData.location) {
      showNotification('يرجى ملء الحقول الإلزامية (العنوان، التاريخ، الموقع)', 'error');
      return;
    }

    setIsLoading(true);
    setTimeout(() => {
      const dateObj = new Date(formData.date);
      const day = dateObj.getDate().toString().padStart(2, '0');
      const month = MONTHS_SHORT[dateObj.getMonth()];

      const newEvent: Event = {
        id: `ev_${Date.now()}`,
        title: sanitizeInput(formData.title),
        description: sanitizeInput(formData.description),
        date: { day, month, fullDate: formData.date },
        time: formData.time || '00:00',
        location: sanitizeInput(formData.location),
        interestedCount: 1, // You are interested
        coverUrl: formData.coverUrl || `https://picsum.photos/800/400?random=${Date.now()}`,
        status: 'going',
        category: 'upcoming',
        privacy: formData.privacy,
        organizerId: CURRENT_USER_ID
      };

      setEvents([newEvent, ...events]);
      showNotification('تم إنشاء المناسبة بنجاح 🎉', 'success');
      setIsLoading(false);
      setIsCreateModalOpen(false);
      resetForm();
    }, 1000);
  };

  const handleUpdateEvent = () => {
    if (!editingEventId) return;
    if (!formData.title || !formData.date || !formData.location) {
      showNotification('يرجى ملء الحقول الإلزامية', 'error');
      return;
    }

    setIsLoading(true);
    setTimeout(() => {
      const dateObj = new Date(formData.date);
      const day = dateObj.getDate().toString().padStart(2, '0');
      const month = MONTHS_SHORT[dateObj.getMonth()];

      setEvents(prev => prev.map(ev => {
        if (ev.id === editingEventId) {
          return {
            ...ev,
            title: sanitizeInput(formData.title),
            description: sanitizeInput(formData.description),
            date: { day, month, fullDate: formData.date },
            time: formData.time,
            location: sanitizeInput(formData.location),
            privacy: formData.privacy,
            coverUrl: formData.coverUrl || ev.coverUrl
          };
        }
        return ev;
      }));

      showNotification('تم تحديث المناسبة بنجاح', 'success');
      setIsLoading(false);
      setIsEditModalOpen(false);
      resetForm();
    }, 1000);
  };

  const handleDeleteConfirm = () => {
    if (!deletingEventId) return;
    setIsLoading(true);
    setTimeout(() => {
      setEvents(prev => prev.filter(e => e.id !== deletingEventId));
      showNotification('تم حذف المناسبة', 'info');
      setIsLoading(false);
      setIsDeleteModalOpen(false);
      resetForm();
    }, 800);
  };

  // --- Filtering ---
  const filteredEvents = useMemo(() => {
    return events.filter(e => {
      const matchesCategory = e.category === activeFilter;
      const matchesSearch = e.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
                            e.location.toLowerCase().includes(searchTerm.toLowerCase());
      return matchesCategory && matchesSearch;
    });
  }, [events, activeFilter, searchTerm]);

  // --- Render Modals ---

  const renderEventForm = (mode: 'create' | 'edit') => (
    <div className="fixed inset-0 z-[100] bg-black/60 flex items-center justify-center p-4 animate-fadeIn backdrop-blur-sm">
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-2xl w-full max-w-lg overflow-hidden animate-scaleIn max-h-[90vh] flex flex-col">
        <div className="p-4 border-b border-gray-100 dark:border-gray-700 flex justify-between items-center bg-gray-50 dark:bg-gray-700/50">
          <h3 className="font-bold text-lg text-gray-900 dark:text-white flex items-center gap-2">
            {mode === 'create' ? <Plus className="w-5 h-5 text-fb-blue" /> : <Edit3 className="w-5 h-5 text-fb-blue" />}
            {mode === 'create' ? 'إنشاء مناسبة جديدة' : 'تعديل المناسبة'}
          </h3>
          <button onClick={() => { mode === 'create' ? setIsCreateModalOpen(false) : setIsEditModalOpen(false); resetForm(); }} className="text-gray-500 hover:bg-gray-200 dark:hover:bg-gray-600 rounded-full p-1 transition">
            <X className="w-5 h-5" />
          </button>
        </div>
        
        <div className="p-6 space-y-4 overflow-y-auto">
          {/* Cover Image Upload */}
          <div 
            onClick={() => fileInputRef.current?.click()}
            className="w-full h-40 bg-gray-100 dark:bg-gray-700 rounded-lg border-2 border-dashed border-gray-300 dark:border-gray-600 flex flex-col items-center justify-center cursor-pointer hover:border-fb-blue transition group relative overflow-hidden"
          >
            {formData.coverUrl ? (
              <img src={formData.coverUrl} alt="Cover" className="w-full h-full object-cover" />
            ) : (
              <>
                <ImageIcon className="w-8 h-8 text-gray-400 group-hover:text-fb-blue mb-2" />
                <span className="text-sm text-gray-500 dark:text-gray-400">اضغط لإضافة صورة غلاف</span>
              </>
            )}
            <div className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 transition flex items-center justify-center">
               <span className="text-white font-medium text-sm">تغيير الصورة</span>
            </div>
            <input type="file" ref={fileInputRef} className="hidden" accept="image/*" onChange={handleFileUpload} />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">اسم المناسبة <span className="text-red-500">*</span></label>
            <input type="text" className="w-full border rounded-md p-2.5 text-sm dark:bg-gray-700 dark:border-gray-600 dark:text-white focus:ring-2 focus:ring-fb-blue outline-none" value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})} placeholder="مثال: حفل تخرج، اجتماع..." />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">التاريخ <span className="text-red-500">*</span></label>
              <input type="date" className="w-full border rounded-md p-2.5 text-sm dark:bg-gray-700 dark:border-gray-600 dark:text-white focus:ring-2 focus:ring-fb-blue outline-none" value={formData.date} onChange={e => setFormData({...formData, date: e.target.value})} />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">الوقت</label>
              <input type="time" className="w-full border rounded-md p-2.5 text-sm dark:bg-gray-700 dark:border-gray-600 dark:text-white focus:ring-2 focus:ring-fb-blue outline-none" value={formData.time} onChange={e => setFormData({...formData, time: e.target.value})} />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">الموقع <span className="text-red-500">*</span></label>
            <div className="relative">
              <MapPin className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input type="text" className="w-full border rounded-md p-2.5 pr-10 text-sm dark:bg-gray-700 dark:border-gray-600 dark:text-white focus:ring-2 focus:ring-fb-blue outline-none" value={formData.location} onChange={e => setFormData({...formData, location: e.target.value})} placeholder="أضف موقعاً..." />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">الخصوصية</label>
            <select 
              className="w-full border rounded-md p-2.5 text-sm dark:bg-gray-700 dark:border-gray-600 dark:text-white focus:ring-2 focus:ring-fb-blue outline-none"
              value={formData.privacy}
              onChange={e => setFormData({...formData, privacy: e.target.value as EventPrivacy})}
            >
              <option value="public">عامة (مرئية للجميع)</option>
              <option value="private">خاصة (للمدعوين فقط)</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">الوصف</label>
            <textarea className="w-full border rounded-md p-2.5 text-sm h-24 resize-none dark:bg-gray-700 dark:border-gray-600 dark:text-white focus:ring-2 focus:ring-fb-blue outline-none" value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} placeholder="أضف تفاصيل أكثر..." />
          </div>
        </div>

        <div className="p-4 border-t border-gray-100 dark:border-gray-700 bg-gray-50 dark:bg-gray-700/50 flex justify-end gap-2">
          <button onClick={() => { mode === 'create' ? setIsCreateModalOpen(false) : setIsEditModalOpen(false); resetForm(); }} className="px-4 py-2 text-gray-700 dark:text-gray-300 font-medium hover:bg-gray-200 dark:hover:bg-gray-600 rounded-md transition">إلغاء</button>
          <button 
            onClick={mode === 'create' ? handleCreateEvent : handleUpdateEvent} 
            disabled={isLoading}
            className="px-6 py-2 bg-fb-blue text-white font-medium rounded-md hover:bg-blue-700 transition shadow-sm flex items-center gap-2 disabled:opacity-70"
          >
            {isLoading && <Loader2 className="w-4 h-4 animate-spin" />}
            {mode === 'create' ? 'إنشاء المناسبة' : 'حفظ التغييرات'}
          </button>
        </div>
      </div>
    </div>
  );

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm min-h-[500px] animate-fadeIn p-4 md:p-6 relative transition-colors duration-300">
      
      {/* --- Modals --- */}
      {isCreateModalOpen && renderEventForm('create')}
      {isEditModalOpen && renderEventForm('edit')}
      
      {/* Delete Confirmation Modal */}
      {isDeleteModalOpen && (
        <div className="fixed inset-0 z-[100] bg-black/60 flex items-center justify-center p-4 animate-fadeIn backdrop-blur-sm">
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-2xl w-full max-w-sm overflow-hidden animate-scaleIn">
            <div className="p-6 text-center">
              <div className="w-16 h-16 bg-red-100 dark:bg-red-900/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <Trash2 className="w-8 h-8 text-red-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">هل أنت متأكد؟</h3>
              <p className="text-gray-500 dark:text-gray-400 text-sm">لا يمكن التراجع عن حذف المناسبة. سيتم إزالتها نهائياً.</p>
            </div>
            <div className="p-4 border-t border-gray-100 dark:border-gray-700 bg-gray-50 dark:bg-gray-700/50 flex justify-end gap-2">
              <button onClick={() => setIsDeleteModalOpen(false)} className="px-4 py-2 text-gray-700 dark:text-gray-300 font-medium hover:bg-gray-200 dark:hover:bg-gray-600 rounded-md transition">إلغاء</button>
              <button 
                onClick={handleDeleteConfirm} 
                disabled={isLoading}
                className="px-6 py-2 bg-red-600 text-white font-medium rounded-md hover:bg-red-700 transition shadow-sm flex items-center gap-2 disabled:opacity-70"
              >
                {isLoading && <Loader2 className="w-4 h-4 animate-spin" />}
                حذف
              </button>
            </div>
          </div>
        </div>
      )}

      {/* --- Header Section --- */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-1">المناسبات</h2>
          <p className="text-sm text-gray-500 dark:text-gray-400">اكتشف وشارك في أحدث الفعاليات</p>
        </div>
        
        <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
           {/* Search */}
           <div className="relative flex-1 sm:w-60 w-full group">
              <Search className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500 dark:text-gray-400 group-focus-within:text-fb-blue transition-colors" />
              <input 
                type="text" 
                placeholder="بحث في المناسبات..."
                className="w-full bg-gray-100 dark:bg-gray-700 focus:bg-white dark:focus:bg-gray-900 border border-transparent focus:border-fb-blue rounded-full py-2 pr-10 pl-4 text-sm transition outline-none text-gray-900 dark:text-white placeholder-gray-500"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
           </div>
           
           <button 
              onClick={() => setIsCreateModalOpen(true)}
              className="bg-fb-blue text-white px-4 py-2 rounded-md font-semibold text-sm hover:bg-blue-700 transition flex items-center justify-center gap-2 shadow-sm"
           >
              <Plus className="w-4 h-4" />
              إنشاء مناسبة
           </button>
        </div>
      </div>

      {/* --- Filters --- */}
      <div className="flex gap-2 mb-6 border-b border-gray-100 dark:border-gray-700 pb-2 overflow-x-auto no-scrollbar">
          <button 
            onClick={() => setActiveFilter('upcoming')}
            className={`text-sm font-semibold px-4 py-2 rounded-full transition-colors whitespace-nowrap ${activeFilter === 'upcoming' ? 'text-fb-blue bg-blue-50 dark:bg-blue-900/20' : 'text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700'}`}
          >
            المناسبات المقبلة
          </button>
          <button 
            onClick={() => setActiveFilter('past')}
            className={`text-sm font-semibold px-4 py-2 rounded-full transition-colors whitespace-nowrap ${activeFilter === 'past' ? 'text-fb-blue bg-blue-50 dark:bg-blue-900/20' : 'text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700'}`}
          >
            المناسبات السابقة
          </button>
      </div>

      {/* --- Events Grid --- */}
      <div className="grid grid-cols-1 gap-4 pb-10">
          {filteredEvents.length > 0 ? filteredEvents.map(event => (
              <div key={event.id} className="flex flex-col md:flex-row border border-gray-200 dark:border-gray-700 rounded-xl overflow-hidden hover:shadow-md transition group relative bg-white dark:bg-gray-800">
                  
                  {/* Cover Image & Date Badge */}
                  <div className="w-full md:w-56 h-40 md:h-auto relative overflow-hidden flex-shrink-0">
                      <img src={event.coverUrl} alt={event.title} className="w-full h-full object-cover group-hover:scale-105 transition duration-500" />
                      <div className="absolute inset-0 bg-black/10 group-hover:bg-transparent transition"></div>
                      <div className="absolute top-2 left-2 bg-white/95 dark:bg-gray-800/95 rounded-lg px-3 py-1.5 text-center shadow-md backdrop-blur-sm">
                          <div className="text-xs font-bold text-red-500 uppercase tracking-wide">{event.date.month}</div>
                          <div className="text-xl font-extrabold text-gray-900 dark:text-white">{event.date.day}</div>
                      </div>
                      <div className="absolute top-2 right-2">
                         {event.privacy === 'private' && (
                            <span className="bg-black/60 text-white text-[10px] px-2 py-0.5 rounded-full flex items-center gap-1 backdrop-blur-sm">
                               <Lock className="w-3 h-3" /> خاص
                            </span>
                         )}
                      </div>
                  </div>

                  {/* Content */}
                  <div className="p-4 flex-1 flex flex-col justify-between">
                      <div>
                          <div className="flex justify-between items-start">
                             <div>
                                <h3 className="font-bold text-lg text-gray-900 dark:text-white mb-1 hover:text-fb-blue transition cursor-pointer">{event.title}</h3>
                                <div className="text-xs text-red-500 font-semibold mb-2 uppercase tracking-wide">{event.date.fullDate} AT {event.time}</div>
                             </div>
                             
                             {/* Menu Button */}
                             <div className="relative" ref={activeMenuId === event.id ? menuRef : null}>
                                <button 
                                  onClick={(e) => { e.stopPropagation(); setActiveMenuId(activeMenuId === event.id ? null : event.id); }}
                                  className={`p-2 rounded-full transition ${activeMenuId === event.id ? 'bg-blue-50 dark:bg-blue-900/20 text-fb-blue' : 'text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-700'}`}
                                >
                                    <MoreHorizontal className="w-5 h-5" />
                                </button>
                                
                                {activeMenuId === event.id && (
                                  <div className="absolute left-0 top-full mt-1 w-52 bg-white dark:bg-gray-800 rounded-lg shadow-xl border border-gray-100 dark:border-gray-700 z-50 overflow-hidden animate-fadeIn origin-top-left">
                                      {event.organizerId === CURRENT_USER_ID && (
                                        <>
                                          <div className="px-4 py-2 text-xs font-bold text-gray-400 uppercase bg-gray-50 dark:bg-gray-900">أدوات المنظم</div>
                                          <button onClick={() => handleMenuAction('edit', event.id)} className="w-full flex items-center gap-2 px-4 py-2.5 hover:bg-gray-50 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-200 text-sm transition">
                                              <Edit3 className="w-4 h-4" /> تعديل المناسبة
                                          </button>
                                          <button onClick={() => handleMenuAction('delete', event.id)} className="w-full flex items-center gap-2 px-4 py-2.5 hover:bg-red-50 dark:hover:bg-red-900/20 text-red-600 dark:text-red-400 text-sm transition">
                                              <Trash2 className="w-4 h-4" /> حذف المناسبة
                                          </button>
                                          <div className="border-t border-gray-100 dark:border-gray-700 my-1"></div>
                                        </>
                                      )}
                                      
                                      <button onClick={() => handleMenuAction('calendar', event.id)} className="w-full flex items-center gap-3 px-4 py-2.5 hover:bg-gray-50 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-200 text-sm transition">
                                          <Calendar className="w-4 h-4" /> إضافة للتقويم
                                      </button>
                                      <button onClick={() => handleMenuAction('notifications', event.id)} className="w-full flex items-center gap-3 px-4 py-2.5 hover:bg-gray-50 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-200 text-sm transition">
                                          {eventNotifications[event.id] ? <BellOff className="w-4 h-4 text-fb-blue" /> : <Bell className="w-4 h-4" />}
                                          {eventNotifications[event.id] ? 'إيقاف الإشعارات' : 'تفعيل الإشعارات'}
                                      </button>
                                      <div className="border-t border-gray-100 dark:border-gray-700 my-1"></div>
                                      <button onClick={() => handleMenuAction('report', event.id)} className="w-full flex items-center gap-3 px-4 py-2.5 hover:bg-gray-50 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-200 text-sm transition">
                                          <Flag className="w-4 h-4" /> إبلاغ عن الحدث
                                      </button>
                                  </div>
                                )}
                            </div>
                          </div>

                          <div className="text-sm text-gray-600 dark:text-gray-300 flex items-center gap-1 mb-2">
                              <MapPin className="w-4 h-4" /> {event.location}
                          </div>
                          <p className="text-sm text-gray-500 dark:text-gray-400 line-clamp-2 mb-3">{event.description}</p>
                          <div className="text-xs text-gray-500 dark:text-gray-400 font-medium">
                             {event.interestedCount > 0 ? `${event.interestedCount} مهتم` : 'كن أول المهتمين'}
                             {event.organizerId === CURRENT_USER_ID && <span className="mr-2 text-fb-blue bg-blue-50 dark:bg-blue-900/20 px-2 py-0.5 rounded-full">أنت المنظم</span>}
                          </div>
                      </div>

                      <div className="flex items-center gap-2 pt-3 border-t border-gray-100 dark:border-gray-700 mt-1">
                          <button 
                            onClick={() => handleStatusToggle(event.id)}
                            className={`flex-1 px-4 py-2 rounded-lg text-sm font-bold transition flex items-center justify-center gap-2 ${
                                event.status === 'going' 
                                ? 'bg-blue-50 dark:bg-blue-900/20 text-fb-blue border border-blue-200 dark:border-blue-800' 
                                : event.status === 'interested' 
                                ? 'bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-white' 
                                : 'bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300'
                            }`}
                          >
                              <Star className={`w-4 h-4 ${event.status !== 'none' ? 'fill-current' : ''}`} />
                              {event.status === 'going' ? 'ذاهب' : event.status === 'interested' ? 'مهتم' : 'مهتم'}
                          </button>
                          
                          <button 
                            onClick={() => handleShare(event)}
                            className="bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-600 dark:text-gray-300 px-4 py-2 rounded-lg transition flex items-center gap-2 text-sm font-bold"
                          >
                              <Share2 className="w-4 h-4" /> مشاركة
                          </button>
                      </div>
                  </div>
              </div>
          )) : (
              <div className="text-center py-20 text-gray-500 dark:text-gray-400 flex flex-col items-center">
                  <div className="bg-gray-100 dark:bg-gray-700 p-5 rounded-full mb-4">
                      <Calendar className="w-12 h-12 text-gray-400 dark:text-gray-500" />
                  </div>
                  <h3 className="text-lg font-bold text-gray-700 dark:text-gray-300 mb-1">لا توجد مناسبات</h3>
                  <p className="text-sm max-w-xs mx-auto">لم يتم العثور على مناسبات {activeFilter === 'upcoming' ? 'قادمة' : 'سابقة'} تطابق بحثك.</p>
                  {activeFilter === 'upcoming' && (
                      <button onClick={() => setIsCreateModalOpen(true)} className="mt-4 text-fb-blue hover:underline font-medium">
                          إنشاء مناسبة جديدة
                      </button>
                  )}
              </div>
          )}
      </div>

      {/* Toast Notification */}
      {notification && (
        <div className="fixed bottom-6 right-6 z-[150] animate-bounce-in">
            <div className={`flex items-center gap-3 px-5 py-3.5 rounded-xl shadow-lg text-white backdrop-blur-md border border-white/10 ${notification.type === 'success' ? 'bg-emerald-600/90' : notification.type === 'error' ? 'bg-red-600/90' : 'bg-blue-600/90'}`}>
                {notification.type === 'success' ? <Check className="w-5 h-5" /> : notification.type === 'error' ? <Info className="w-5 h-5" /> : <Star className="w-5 h-5" />}
                <span className="font-medium text-sm">{notification.message}</span>
                <button onClick={() => setNotification(null)} className="mr-2 text-white/80 hover:text-white transition">
                    <X className="w-4 h-4" />
                </button>
            </div>
        </div>
      )}
    </div>
  );
};

export default ProfileEvents;