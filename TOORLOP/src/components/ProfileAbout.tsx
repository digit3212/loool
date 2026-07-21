import React, { useState, useEffect, useRef } from 'react';
import { Briefcase, GraduationCap, MapPin, Heart, Phone, Info, Clock, Globe, Plus, Save, X, Trash2, Users, Lock, ChevronDown, Home, Mail, Link as LinkIcon, Calendar, User as UserIcon, Languages, Mic, Quote, Droplet, PenLine, Star, Pen, Facebook, Instagram, Twitter, Linkedin, Youtube, Github, MessageCircle, Twitch } from 'lucide-react';
import { User } from '../types';
import { useLanguage } from '../context/LanguageContext';
import { 
  COUNTRIES_DATA, 
  SOCIAL_PLATFORMS, 
  LANGUAGES_LIST, 
  MONTHS, 
  RELATIONSHIP_STATUS_OPTIONS, 
  PARTNER_REQUIRED_STATUSES, 
  FAMILY_RELATIONS_OPTIONS, 
  OTHER_NAME_TYPES, 
  MOCK_FRIENDS_LIST, 
  jobTitles, 
  degrees, 
  DAYS, 
  YEARS 
} from '../data/profileData';

interface ProfileAboutProps {
  currentUser: User;
  readonly?: boolean;
  setProfileUser?: React.Dispatch<React.SetStateAction<User>>;
}

type SectionType = 'overview' | 'work' | 'places' | 'contact' | 'family' | 'details' | 'events';
type PrivacyLevel = 'public' | 'friends' | 'friends_of_friends' | 'only_me';
type PlaceType = 'current' | 'hometown';

// Data Interfaces
interface Work {
  id: string;
  role: string;
  company: string;
  privacy: PrivacyLevel;
}

interface University {
  id: string;
  name: string;
  degree: string;
  major: string;
  year: string;
  privacy: PrivacyLevel;
}

interface School {
  id: string;
  name: string;
  year: string;
  privacy: PrivacyLevel;
}

interface Place {
  id: string;
  type: PlaceType;
  country: string;
  city: string;
  privacy: PrivacyLevel;
}

interface SocialLink {
  id: string;
  platform: string;
  url: string;
  privacy: PrivacyLevel;
}

interface Website {
  id: string;
  url: string;
  privacy: PrivacyLevel;
}

interface FamilyMember {
  id: string;
  name: string; // From friends list
  relation: string;
  privacy: PrivacyLevel;
}

interface Relationship {
  status: string;
  partner?: string; // Name from friends list
  year?: string;
  month?: string;
  day?: string;
  privacy: PrivacyLevel;
}

interface OtherName {
  id: string;
  name: string;
  type: string;
  privacy: PrivacyLevel;
}

interface LifeEvent {
  id: string;
  title: string;
  location: string;
  description: string;
  year: string;
  privacy: PrivacyLevel;
}

// --- Privacy Selector Component ---
interface PrivacySelectProps {
  value: PrivacyLevel;
  onChange: (val: PrivacyLevel) => void;
  small?: boolean;
}

const PrivacySelect: React.FC<PrivacySelectProps> = ({ value, onChange, small }) => {
  const { t, language } = useLanguage();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const options: { val: PrivacyLevel; label: string; icon: React.ElementType }[] = [
    { val: 'public', label: t.privacy_public || (language === 'ar' ? 'عام' : 'Public'), icon: Globe },
    { val: 'friends', label: t.privacy_friends || (language === 'ar' ? 'الأصدقاء' : 'Friends'), icon: Users },
    { val: 'friends_of_friends', label: language === 'ar' ? 'أصدقاء الأصدقاء' : 'Friends of friends', icon: Users },
    { val: 'only_me', label: t.privacy_only_me || (language === 'ar' ? 'أنا فقط' : 'Only Me'), icon: Lock },
  ];

  const selected = options.find((o) => o.val === value) || options[0];
  const Icon = selected.icon;

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className="relative inline-block text-left" ref={dropdownRef}>
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className={`flex items-center gap-2 bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 rounded-md transition font-semibold text-gray-700 dark:text-gray-200 ${small ? 'px-2 py-1 text-xs' : 'px-3 py-1.5 text-sm'}`}
      >
        <Icon className={small ? "w-3 h-3" : "w-4 h-4"} />
        <span>{selected.label}</span>
        <ChevronDown className={small ? "w-3 h-3" : "w-3 h-3"} />
      </button>

      {isOpen && (
        <div className="absolute left-0 md:right-auto z-20 mt-1 w-48 bg-white dark:bg-gray-800 shadow-xl rounded-lg border border-gray-100 dark:border-gray-700 overflow-hidden animate-fadeIn">
          {options.map((opt) => (
            <div
              key={opt.val}
              onClick={() => {
                onChange(opt.val);
                setIsOpen(false);
              }}
              className={`flex items-center gap-3 px-4 py-2.5 cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700 text-sm ${
                value === opt.val ? 'bg-blue-50 dark:bg-blue-900/30 text-fb-blue' : 'text-gray-700 dark:text-gray-200'
              }`}
            >
              <opt.icon className="w-4 h-4" />
              <span>{opt.label}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

// --- Helper to render Privacy Icon only ---
const PrivacyIcon: React.FC<{ type: PrivacyLevel }> = ({ type }) => {
    const { t, language } = useLanguage();
    let title = '';
    if (type === 'public') title = t.privacy_public || (language === 'ar' ? 'عام' : 'Public');
    else if (type === 'friends') title = t.privacy_friends || (language === 'ar' ? 'الأصدقاء' : 'Friends');
    else if (type === 'friends_of_friends') title = language === 'ar' ? 'أصدقاء الأصدقاء' : 'Friends of friends';
    else title = t.privacy_only_me || (language === 'ar' ? 'أنا فقط' : 'Only Me');

    if (type === 'public') return <span title={title} className="inline-flex items-center"><Globe className="w-3.5 h-3.5 text-fb-blue/70" /></span>;
    if (type === 'friends') return <span title={title} className="inline-flex items-center"><Users className="w-3.5 h-3.5 text-fb-blue/70" /></span>;
    if (type === 'friends_of_friends') return <span title={title} className="inline-flex items-center"><Users className="w-3.5 h-3.5 text-fb-blue/70" /></span>;
    return <span title={title} className="inline-flex items-center"><Lock className="w-3.5 h-3.5 text-fb-blue/70" /></span>;
};

// --- Helper to render Platform Icon with Brand Colors ---
const getPlatformIcon = (platform: string) => {
  const p = platform.toLowerCase();
  if (p.includes('facebook')) return <Facebook className="w-5 h-5 text-[#1877F2]" />;
  if (p.includes('instagram')) return <Instagram className="w-5 h-5 text-[#E4405F]" />;
  if (p.includes('twitter') || p.includes('x)')) return <Twitter className="w-5 h-5 text-[#1DA1F2]" />;
  if (p.includes('linkedin')) return <Linkedin className="w-5 h-5 text-[#0A66C2]" />;
  if (p.includes('youtube')) return <Youtube className="w-5 h-5 text-[#FF0000]" />;
  if (p.includes('github')) return <Github className="w-5 h-5 text-[#181717]" />;
  
  if (p.includes('whatsapp')) return (
    <svg className="w-5 h-5 text-[#25D366]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M3 21l1.65-3.8a9 9 0 1 1 3.4 2.9L3 21" />
      <path d="M9 10a.5.5 0 0 0 1 0V9a.5.5 0 0 0-1 0v1a5 5 0 0 0 5 5h1a.5.5 0 0 0 0-1h-1a.5.5 0 0 0 0 1" />
    </svg>
  );
  if (p.includes('telegram')) return (
    <svg className="w-5 h-5 text-[#0088cc]" viewBox="0 0 24 24" fill="currentColor">
      <path d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z"/>
    </svg>
  );
  if (p.includes('twitch')) return <Twitch className="w-5 h-5 text-[#9146FF]" />;
  if (p.includes('tiktok')) return (
    <svg className="w-5 h-5 text-[#000000]" viewBox="0 0 24 24" fill="currentColor"><path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.1z"/></svg>
  );
   if (p.includes('snapchat')) return (
    <svg className="w-5 h-5 text-[#FFFC00] fill-current stroke-black" strokeWidth="1.5" viewBox="0 0 24 24"><path d="M12 2.5c-3.5 0-6 2.5-6 6 0 .5 0 1.5.5 2 0 0-1.5 1.5-1.5 3.5 0 1.5 1 2.5 1 2.5s-.5 1-2.5 1c-1 0-1.5.5-1.5.5s.5 2 2.5 2c1.5 0 3 .5 5 .5s3.5-.5 5-.5c2 0 2.5-2 2.5-2s-.5-.5-1.5-.5c-2 0-2.5-1-2.5-1s1-1 1-2.5c0-2-1.5-3.5-1.5-3.5.5-.5.5-1.5.5-2 0-3.5-2.5-6-6-6z"/></svg>
  );
  if (p.includes('soundcloud')) return (
    <svg className="w-5 h-5 text-[#FF5500]" viewBox="0 0 24 24" fill="currentColor">
      <path d="M11.56 3.66c-2.3 0-4.27 1.54-4.85 3.66a4.57 4.57 0 0 0-4.22 4.56c0 2.53 2.05 4.58 4.58 4.58h9.35c2.53 0 4.58-2.05 4.58-4.58 0-2.53-2.05-4.58-4.58-4.58-.2 0-.39.02-.58.05a4.87 4.87 0 0 0-4.28-3.69z"/>
    </svg>
  );
  if (p.includes('pinterest')) return (
    <svg className="w-5 h-5 text-[#E60023]" viewBox="0 0 24 24" fill="currentColor">
      <path d="M12.017 0C5.396 0 .029 5.367.029 11.987c0 5.079 3.158 9.417 7.618 11.162-.105-.949-.199-2.403.041-3.439.219-.937 1.406-5.957 1.406-5.957s-.359-.72-.359-1.781c0-1.663.967-2.911 2.168-2.911 1.024 0 1.518.769 1.518 1.688 0 1.029-.653 2.567-.992 3.992-.285 1.193.6 2.165 1.775 2.165 2.128 0 3.768-2.245 3.768-5.487 0-2.861-2.063-4.869-5.008-4.869-3.41 0-5.409 2.562-5.409 5.199 0 1.033.394 2.143.889 2.741.099.12.112.225.085.345-.09.375-.293 1.199-.334 1.363-.053.225-.172.271-.399.165-1.495-.69-2.433-2.878-2.433-4.646 0-3.776 2.748-7.252 7.951-7.252 4.173 0 7.41 2.967 7.41 6.923 0 4.135-2.607 7.462-6.233 7.462-1.214 0-2.354-.629-2.758-1.379l-.749 2.848c-.269 1.045-1.004 2.352-1.498 3.146 1.123.345 2.306.535 3.55.535 6.607 0 11.985-5.365 11.985-11.987C23.97 5.367 18.62 0 12.017 0z"/>
    </svg>
  );
  if (p.includes('behance')) return (
    <svg className="w-5 h-5 text-[#1769FF]" viewBox="0 0 24 24" fill="currentColor">
      <path d="M22 7h-7v-2h7v2zm1.726 10c-.442 1.297-2.029 3-5.187 3-3.156 0-4.828-1.703-5.271-3H23.726zM13.268 15h10.457c.004-.37.005-.745.005-1.125 0-5.926-4.225-8.875-8.995-8.875-4.838 0-8.995 2.949-8.995 8.875 0 5.925 4.157 8.875 8.995 8.875 4.838 0 8.995-2.949 8.995-8.875 0-.38-.001-.755-.005-1.125h-10.457zM2.875 5h3.625c2.375 0 4.375 1.125 4.375 3.5 0 1.5-.75 2.5-2 3 1.5.5 2.5 1.625 2.5 3.375 0 2.5-2 4.125-4.875 4.125H2.875V5zm3.5 5.5c1.125 0 1.875-.5 1.875-1.625S7.5 7.25 6.375 7.25h-1.5v3.25h1.5zm.375 6.25c1.25 0 2.125-.625 2.125-1.875S8.125 13 6.75 13h-1.875v3.75h1.875z"/>
    </svg>
  );
  return <Globe className="w-5 h-5 text-fb-blue" />;
};

const ProfileAbout: React.FC<ProfileAboutProps> = ({ currentUser, readonly = false, setProfileUser }) => {
  const { t, dir, language } = useLanguage();
  const [activeSection, setActiveSection] = useState<SectionType>('overview');

  // Work
  const [works, setWorks] = useState<Work[]>(() => {
      const saved = localStorage.getItem('pa_works');
      return saved ? JSON.parse(saved) : [];
  });
  useEffect(() => localStorage.setItem('pa_works', JSON.stringify(works)), [works]);

  // University
  const [universities, setUniversities] = useState<University[]>(() => {
      const saved = localStorage.getItem('pa_unis');
      return saved ? JSON.parse(saved) : [];
  });
  useEffect(() => localStorage.setItem('pa_unis', JSON.stringify(universities)), [universities]);

  // School
  const [schools, setSchools] = useState<School[]>(() => {
      const saved = localStorage.getItem('pa_schools');
      return saved ? JSON.parse(saved) : [];
  });
  useEffect(() => localStorage.setItem('pa_schools', JSON.stringify(schools)), [schools]);

  // Places
  const [places, setPlaces] = useState<Place[]>(() => {
      const saved = localStorage.getItem('pa_places');
      return saved ? JSON.parse(saved) : [];
  });
  useEffect(() => localStorage.setItem('pa_places', JSON.stringify(places)), [places]);

  // Contact Info
  const [contactInfo, setContactInfo] = useState(() => {
      const saved = localStorage.getItem('pa_contact');
      return saved ? JSON.parse(saved) : {
        mobile: { value: '', privacy: 'public' as PrivacyLevel },
        email: { value: '', privacy: 'public' as PrivacyLevel },
      };
  });
  useEffect(() => localStorage.setItem('pa_contact', JSON.stringify(contactInfo)), [contactInfo]);
  
  // Websites
  const [websites, setWebsites] = useState<Website[]>(() => {
      const saved = localStorage.getItem('pa_websites');
      return saved ? JSON.parse(saved) : [];
  });
  useEffect(() => localStorage.setItem('pa_websites', JSON.stringify(websites)), [websites]);

  // Social Links
  const [socialLinks, setSocialLinks] = useState<SocialLink[]>(() => {
      const saved = localStorage.getItem('pa_socials');
      return saved ? JSON.parse(saved) : [];
  });
  useEffect(() => localStorage.setItem('pa_socials', JSON.stringify(socialLinks)), [socialLinks]);
  
  // Basic Info
  const [basicInfo, setBasicInfo] = useState(() => {
      const saved = localStorage.getItem('pa_basic');
      return saved ? JSON.parse(saved) : {
        gender: { value: '', privacy: 'public' as PrivacyLevel },
        birthDate: { day: '', month: '', year: '', privacy: 'public' as PrivacyLevel },
        languages: { value: [] as string[], privacy: 'public' as PrivacyLevel }
      };
  });
  useEffect(() => localStorage.setItem('pa_basic', JSON.stringify(basicInfo)), [basicInfo]);

  // Relationship
  const [relationship, setRelationship] = useState<Relationship>(() => {
      const saved = localStorage.getItem('pa_rel');
      return saved ? JSON.parse(saved) : { status: '', privacy: 'public' };
  });
  useEffect(() => localStorage.setItem('pa_rel', JSON.stringify(relationship)), [relationship]);

  // Family Members
  const [familyMembers, setFamilyMembers] = useState<FamilyMember[]>(() => {
      const saved = localStorage.getItem('pa_family');
      return saved ? JSON.parse(saved) : [];
  });
  useEffect(() => localStorage.setItem('pa_family', JSON.stringify(familyMembers)), [familyMembers]);

  // Bio
  const [bio, setBio] = useState(() => {
      const saved = localStorage.getItem('pa_bio');
      return saved ? JSON.parse(saved) : { text: '', privacy: 'public' as PrivacyLevel };
  });
  useEffect(() => localStorage.setItem('pa_bio', JSON.stringify(bio)), [bio]);

  // Pronunciation
  const [pronunciation, setPronunciation] = useState(() => {
      const saved = localStorage.getItem('pa_pronounce');
      return saved ? JSON.parse(saved) : { text: '', privacy: 'public' as PrivacyLevel };
  });
  useEffect(() => localStorage.setItem('pa_pronounce', JSON.stringify(pronunciation)), [pronunciation]);

  // Other Names
  const [otherNames, setOtherNames] = useState<OtherName[]>(() => {
      const saved = localStorage.getItem('pa_othernames');
      return saved ? JSON.parse(saved) : [];
  });
  useEffect(() => localStorage.setItem('pa_othernames', JSON.stringify(otherNames)), [otherNames]);

  // Quotes
  const [quotes, setQuotes] = useState(() => {
      const saved = localStorage.getItem('pa_quotes');
      return saved ? JSON.parse(saved) : { text: '', privacy: 'public' as PrivacyLevel };
  });
  useEffect(() => localStorage.setItem('pa_quotes', JSON.stringify(quotes)), [quotes]);

  // Life Events
  const [lifeEvents, setLifeEvents] = useState<LifeEvent[]>(() => {
      const saved = localStorage.getItem('pa_events');
      return saved ? JSON.parse(saved) : [];
  });
  useEffect(() => localStorage.setItem('pa_events', JSON.stringify(lifeEvents)), [lifeEvents]);

  // --- Form Visibility & Edit Logic State ---
  const [showWorkForm, setShowWorkForm] = useState(false);
  const [editingWorkId, setEditingWorkId] = useState<string | null>(null);

  const [showUniForm, setShowUniForm] = useState(false);
  const [editingUniId, setEditingUniId] = useState<string | null>(null);

  const [showSchoolForm, setShowSchoolForm] = useState(false);
  const [editingSchoolId, setEditingSchoolId] = useState<string | null>(null);
  
  const [editingPlaceType, setEditingPlaceType] = useState<PlaceType | null>(null);

  const [newWork, setNewWork] = useState<Omit<Work, 'id'>>({ role: '', company: '', privacy: 'public' });
  const [newUni, setNewUni] = useState<Omit<University, 'id'>>({ name: '', degree: '', major: '', year: '', privacy: 'public' });
  const [newSchool, setNewSchool] = useState<Omit<School, 'id'>>({ name: '', year: '', privacy: 'public' });
  const [newPlace, setNewPlace] = useState<Omit<Place, 'id' | 'type'>>({ country: '', city: '', privacy: 'public' });

  // Contact/Basic Info Edit States
  const [editingContact, setEditingContact] = useState<'mobile' | 'email' | null>(null);
  const [showWebsiteForm, setShowWebsiteForm] = useState(false);
  const [editingWebsiteId, setEditingWebsiteId] = useState<string | null>(null);

  const [showSocialForm, setShowSocialForm] = useState(false);
  const [editingSocialId, setEditingSocialId] = useState<string | null>(null);

  const [editingBasic, setEditingBasic] = useState<'gender' | 'birthDate' | 'languages' | null>(null);

  // New Inputs for Contact/Basic
  const [tempContact, setTempContact] = useState({ value: '', privacy: 'public' as PrivacyLevel });
  const [newWebsite, setNewWebsite] = useState({ url: '', privacy: 'public' as PrivacyLevel });
  const [newSocial, setNewSocial] = useState({ platform: '', url: '', privacy: 'public' as PrivacyLevel });
  
  const [tempGender, setTempGender] = useState({ value: '', privacy: 'public' as PrivacyLevel });
  const [tempBirthDate, setTempBirthDate] = useState({ day: '', month: '', year: '', privacy: 'public' as PrivacyLevel });
  const [tempLanguages, setTempLanguages] = useState({ value: [] as string[], privacy: 'public' as PrivacyLevel });

  // Family & Relationship Edit States
  const [editingRelationship, setEditingRelationship] = useState(false);
  const [tempRelationship, setTempRelationship] = useState<Relationship>({ status: '', privacy: 'public' });
  const [showFamilyForm, setShowFamilyForm] = useState(false);
  const [editingFamilyId, setEditingFamilyId] = useState<string | null>(null);
  const [newFamilyMember, setNewFamilyMember] = useState<Omit<FamilyMember, 'id'>>({ name: '', relation: '', privacy: 'public' });

  // Details About You Edit States
  const [editingBio, setEditingBio] = useState(false);
  const [tempBio, setTempBio] = useState({ text: '', privacy: 'public' as PrivacyLevel });
  const [editingPronunciation, setEditingPronunciation] = useState(false);
  const [tempPronunciation, setTempPronunciation] = useState('');
  
  const [showOtherNameForm, setShowOtherNameForm] = useState(false);
  const [editingOtherNameId, setEditingOtherNameId] = useState<string | null>(null);
  const [newOtherName, setNewOtherName] = useState<Omit<OtherName, 'id'>>({ name: '', type: 'اسم الشهرة', privacy: 'public' });
  
  const [editingQuotes, setEditingQuotes] = useState(false);
  const [tempQuotes, setTempQuotes] = useState({ text: '', privacy: 'public' as PrivacyLevel });

  // Life Events Edit State
  const [showEventForm, setShowEventForm] = useState(false);
  const [editingEventId, setEditingEventId] = useState<string | null>(null);
  const [newEvent, setNewEvent] = useState<Omit<LifeEvent, 'id'>>({
    title: '',
    location: '',
    description: '',
    year: '',
    privacy: 'public'
  });

  const sections = [
    { id: 'overview', label: t.about_overview, icon: <Globe className="w-5 h-5" /> },
    { id: 'work', label: t.about_work_edu, icon: <Briefcase className="w-5 h-5" /> },
    { id: 'places', label: t.about_places, icon: <MapPin className="w-5 h-5" /> },
    { id: 'contact', label: t.about_contact, icon: <Phone className="w-5 h-5" /> },
    { id: 'family', label: t.about_family, icon: <Heart className="w-5 h-5" /> },
    { id: 'details', label: t.about_details, icon: <Info className="w-5 h-5" /> },
    { id: 'events', label: t.about_events, icon: <Star className="w-5 h-5" /> },
  ];

  // Helper function to translate items from lists
  const translateItem = (item: string, prefix: string) => {
     if (!item) return '';
     // If the current language is Arabic, return the item as is (since profileData is in Arabic)
     if (language === 'ar') return item;
     // If English, try to look up the key in translation file using prefix
     const key = `${prefix}_${item}`;
     return t[key] || item;
  };

  const deleteItem = (type: 'work' | 'uni' | 'school' | 'place' | 'website' | 'social' | 'family' | 'otherName' | 'event', id: string) => {
    if (type === 'work') setWorks(works.filter(w => w.id !== id));
    if (type === 'uni') setUniversities(universities.filter(u => u.id !== id));
    if (type === 'school') setSchools(schools.filter(s => s.id !== id));
    if (type === 'place') setPlaces(places.filter(p => p.id !== id));
    if (type === 'website') setWebsites(websites.filter(w => w.id !== id));
    if (type === 'social') setSocialLinks(socialLinks.filter(s => s.id !== id));
    if (type === 'family') setFamilyMembers(familyMembers.filter(f => f.id !== id));
    if (type === 'otherName') setOtherNames(otherNames.filter(n => n.id !== id));
    if (type === 'event') setLifeEvents(lifeEvents.filter(e => e.id !== id));
  };

  const handleDeleteContact = (field: 'mobile' | 'email') => {
      setContactInfo({ ...contactInfo, [field]: { value: '', privacy: 'public' } });
      setEditingContact(null);
      if (setProfileUser) setProfileUser(prev => ({ ...prev }));
  };

  const handleDeleteRelationship = () => {
      setRelationship({ status: '', privacy: 'public' });
      setEditingRelationship(false);
      if (setProfileUser) setProfileUser(prev => ({ ...prev }));
  };

  const handleDeletePronunciation = () => {
      setPronunciation({ text: '', privacy: 'public' });
      setEditingPronunciation(false);
      if (setProfileUser) setProfileUser(prev => ({ ...prev }));
  };

  const handleDeleteQuotes = () => {
      setQuotes({ text: '', privacy: 'public' });
      setEditingQuotes(false);
      if (setProfileUser) setProfileUser(prev => ({ ...prev }));
  };

  // Work Handlers
  const handleEditWork = (work: Work) => {
      setNewWork(work);
      setEditingWorkId(work.id);
      setShowWorkForm(true);
  };
  const handleSaveWork = () => {
    if (newWork.role && newWork.company) {
      if (editingWorkId) {
          setWorks(works.map(w => w.id === editingWorkId ? { ...newWork, id: editingWorkId } as Work : w));
          setEditingWorkId(null);
      } else {
          setWorks([...works, { ...newWork, id: Date.now().toString() }]);
      }
      setNewWork({ role: '', company: '', privacy: 'public' });
      setShowWorkForm(false);
      if (setProfileUser) setProfileUser(prev => ({ ...prev }));
    }
  };

  // Uni Handlers
  const handleEditUni = (uni: University) => {
      setNewUni(uni);
      setEditingUniId(uni.id);
      setShowUniForm(true);
  };
  const handleSaveUni = () => {
    if (newUni.name && newUni.degree) {
      if (editingUniId) {
          setUniversities(universities.map(u => u.id === editingUniId ? { ...newUni, id: editingUniId } as University : u));
          setEditingUniId(null);
      } else {
          setUniversities([...universities, { ...newUni, id: Date.now().toString() }]);
      }
      setNewUni({ name: '', degree: '', major: '', year: '', privacy: 'public' });
      setShowUniForm(false);
      if (setProfileUser) setProfileUser(prev => ({ ...prev }));
    }
  };

  // School Handlers
  const handleEditSchool = (school: School) => {
      setNewSchool(school);
      setEditingSchoolId(school.id);
      setShowSchoolForm(true);
  };
  const handleSaveSchool = () => {
    if (newSchool.name) {
      if (editingSchoolId) {
          setSchools(schools.map(s => s.id === editingSchoolId ? { ...newSchool, id: editingSchoolId } as School : s));
          setEditingSchoolId(null);
      } else {
          setSchools([...schools, { ...newSchool, id: Date.now().toString() }]);
      }
      setNewSchool({ name: '', year: '', privacy: 'public' });
      setShowSchoolForm(false);
      if (setProfileUser) setProfileUser(prev => ({ ...prev }));
    }
  };

  // Places Handlers
  const handleEditPlace = (place: Place) => {
      setNewPlace(place);
      setEditingPlaceType(place.type);
  }
  const handleSavePlace = () => {
    if (newPlace.country && newPlace.city && editingPlaceType) {
        const filteredPlaces = places.filter(p => p.type !== editingPlaceType);
        setPlaces([...filteredPlaces, { ...newPlace, id: Date.now().toString(), type: editingPlaceType }]);
        setNewPlace({ country: '', city: '', privacy: 'public' });
        setEditingPlaceType(null);
        if (setProfileUser) setProfileUser(prev => ({ ...prev }));
    }
  };

  // Website Handlers
  const handleEditWebsite = (site: Website) => {
      setNewWebsite(site);
      setEditingWebsiteId(site.id);
      setShowWebsiteForm(true);
  };
  const handleSaveWebsite = () => {
    if (newWebsite.url) {
      if (editingWebsiteId) {
          setWebsites(websites.map(w => w.id === editingWebsiteId ? { ...newWebsite, id: editingWebsiteId } as Website : w));
          setEditingWebsiteId(null);
      } else {
          setWebsites([...websites, { ...newWebsite, id: Date.now().toString() }]);
      }
      setNewWebsite({ url: '', privacy: 'public' });
      setShowWebsiteForm(false);
      if (setProfileUser) setProfileUser(prev => ({ ...prev }));
    }
  };

  // Social Handlers
  const handleEditSocial = (social: SocialLink) => {
      setNewSocial(social);
      setEditingSocialId(social.id);
      setShowSocialForm(true);
  };
  const handleSaveSocial = () => {
    if (newSocial.platform && newSocial.url) {
      if (editingSocialId) {
          setSocialLinks(socialLinks.map(s => s.id === editingSocialId ? { ...newSocial, id: editingSocialId } as SocialLink : s));
          setEditingSocialId(null);
      } else {
          setSocialLinks([...socialLinks, { ...newSocial, id: Date.now().toString() }]);
      }
      setNewSocial({ platform: '', url: '', privacy: 'public' });
      setShowSocialForm(false);
      if (setProfileUser) setProfileUser(prev => ({ ...prev }));
      }
  };

  const handleSaveContact = (field: 'mobile' | 'email') => {
      setContactInfo({...contactInfo, [field]: { ...tempContact }});
      setEditingContact(null);
      if (setProfileUser) setProfileUser(prev => ({ ...prev }));
  };

  const handleSaveBasic = (field: 'gender' | 'birthDate' | 'languages') => {
      if (field === 'gender') setBasicInfo({...basicInfo, gender: tempGender});
      if (field === 'birthDate') setBasicInfo({...basicInfo, birthDate: tempBirthDate});
      if (field === 'languages') setBasicInfo({...basicInfo, languages: tempLanguages});
      setEditingBasic(null);
      if (setProfileUser) setProfileUser(prev => ({ ...prev }));
  };

  const handleSaveRelationship = () => {
      setRelationship(tempRelationship);
      setEditingRelationship(false);
      if (setProfileUser) setProfileUser(prev => ({ ...prev }));
  };

  // Family Handlers
  const handleEditFamily = (member: FamilyMember) => {
      setNewFamilyMember(member);
      setEditingFamilyId(member.id);
      setShowFamilyForm(true);
  };
  const handleSaveFamilyMember = () => {
      if (newFamilyMember.name && newFamilyMember.relation) {
          if (editingFamilyId) {
              setFamilyMembers(familyMembers.map(f => f.id === editingFamilyId ? { ...newFamilyMember, id: editingFamilyId } as FamilyMember : f));
              setEditingFamilyId(null);
          } else {
              setFamilyMembers([...familyMembers, { ...newFamilyMember, id: Date.now().toString() }]);
          }
          setNewFamilyMember({ name: '', relation: '', privacy: 'public' });
          setShowFamilyForm(false);
          if (setProfileUser) setProfileUser(prev => ({ ...prev }));
      }
  };

  const handleSaveBio = () => {
      setBio(tempBio);
      setEditingBio(false);
      if (setProfileUser) setProfileUser(prev => ({ ...prev }));
  };

  const handleSavePronunciation = () => {
      setPronunciation({ ...pronunciation, text: tempPronunciation });
      setEditingPronunciation(false);
      if (setProfileUser) setProfileUser(prev => ({ ...prev }));
  };

  // Other Name Handlers
  const handleEditOtherName = (name: OtherName) => {
      setNewOtherName(name);
      setEditingOtherNameId(name.id);
      setShowOtherNameForm(true);
  };
  const handleSaveOtherName = () => {
      if (newOtherName.name) {
          if (editingOtherNameId) {
              setOtherNames(otherNames.map(n => n.id === editingOtherNameId ? { ...newOtherName, id: editingOtherNameId } as OtherName : n));
              setEditingOtherNameId(null);
          } else {
              setOtherNames([...otherNames, { ...newOtherName, id: Date.now().toString() }]);
          }
          setNewOtherName({ name: '', type: 'اسم الشهرة', privacy: 'public' });
          setShowOtherNameForm(false);
          if (setProfileUser) setProfileUser(prev => ({ ...prev }));
      }
  };

  const handleSaveQuotes = () => {
      setQuotes(tempQuotes);
      setEditingQuotes(false);
      if (setProfileUser) setProfileUser(prev => ({ ...prev }));
  };

  // Event Handlers
  const handleEditEvent = (event: LifeEvent) => {
      setNewEvent(event);
      setEditingEventId(event.id);
      setShowEventForm(true);
  };
  const handleSaveEvent = () => {
      if (newEvent.title && newEvent.year) {
          if (editingEventId) {
              setLifeEvents(lifeEvents.map(e => e.id === editingEventId ? { ...newEvent, id: editingEventId } as LifeEvent : e));
              setEditingEventId(null);
          } else {
              setLifeEvents([...lifeEvents, { ...newEvent, id: Date.now().toString() }]);
          }
          setNewEvent({ title: '', location: '', description: '', year: '', privacy: 'public' });
          setShowEventForm(false);
          if (setProfileUser) setProfileUser(prev => ({ ...prev }));
      }
  };

  const renderContent = () => {
    switch (activeSection) {
      case 'overview':
        const overviewBio = bio.text;
        const hasDetails = works.length > 0 || universities.length > 0 || schools.length > 0 || places.length > 0 || relationship.status || familyMembers.length > 0 || contactInfo.mobile.value || contactInfo.email.value || websites.length > 0 || socialLinks.length > 0 || basicInfo.gender.value || basicInfo.birthDate.year || basicInfo.languages.value.length > 0 || pronunciation.text || otherNames.length > 0 || quotes.text || lifeEvents.length > 0;
        return (
          <div className="space-y-6 animate-fadeIn text-gray-800 dark:text-gray-200">
            {overviewBio && (
               <div className="text-center mb-6">
                   <div className="text-lg font-medium text-fb-blue leading-relaxed text-[16px]">{overviewBio}</div>
               </div>
            )}
            
            {/* Work & Education Group */}
            {(works.length > 0 || universities.length > 0 || schools.length > 0) && (
              <div className="mb-6">
                <div className="flex justify-between items-center mb-3 border-b border-gray-100 dark:border-gray-700 pb-2">
                    <h5 className="font-bold text-gray-900 dark:text-white text-[18px] flex items-center gap-2">
                        <Briefcase className="w-5 h-5 text-gray-500" />
                        {t.about_work_edu}
                    </h5>
                    {!readonly && (
                        <button onClick={() => setActiveSection('work')} className="text-fb-blue text-sm font-medium hover:bg-blue-50 dark:hover:bg-blue-900/20 px-2 py-1 rounded transition">
                            {t.btn_edit}
                        </button>
                    )}
                </div>
                <div className="pl-2 space-y-4">
                    {works.map(work => (
                        <div key={work.id} className="flex items-center gap-3">
                          <Briefcase className="w-5 h-5 text-fb-blue" />
                          <div>
                            <span className="text-fb-blue font-medium text-[16px]">{t.work_works_at} </span>
                            <span className="font-medium text-fb-blue text-[16px]">{work.role}</span>
                            <span className="text-fb-blue font-medium text-[16px]"> {t.work_role_at} </span>
                            <span className="font-medium text-fb-blue text-[16px]">{work.company}</span>
                          </div>
                        </div>
                    ))}
                    {universities.map(uni => (
                        <div key={uni.id} className="flex items-start gap-3">
                          <div className="mt-1"><GraduationCap className="w-5 h-5 text-fb-blue" /></div>
                          <div>
                            <div className="flex flex-wrap items-baseline gap-1">
                                <span className="text-fb-blue font-medium text-[16px]">{t.edu_studied}</span>
                                <span className="font-bold text-fb-blue text-[16px]">{uni.major}</span>
                                <span className="text-fb-blue font-medium text-[16px]">{t.edu_at}</span>
                                <span className="font-bold text-fb-blue text-[16px]">{uni.name}</span>
                            </div>
                            {uni.degree && <div className="text-fb-blue text-sm mt-0.5">{uni.degree} {uni.year ? `• ${uni.year}` : ''}</div>}
                          </div>
                        </div>
                    ))}
                    {schools.map(school => (
                        <div key={school.id} className="flex items-center gap-3">
                          <GraduationCap className="w-5 h-5 text-fb-blue" />
                          <div>
                            <span className="text-fb-blue font-medium text-[16px]">{t.edu_school} </span>
                            <span className="font-medium text-fb-blue text-[16px]">{school.name}</span>
                            {school.year && <span className="text-fb-blue font-medium text-[16px]"> {t.edu_graduated} {school.year}</span>}
                          </div>
                        </div>
                    ))}
                </div>
              </div>
            )}

            {/* Places Lived Group */}
            {places.length > 0 && (
              <div className="mb-6">
                <div className="flex justify-between items-center mb-3 border-b border-gray-100 dark:border-gray-700 pb-2">
                    <h5 className="font-bold text-gray-900 dark:text-white text-[18px] flex items-center gap-2">
                        <MapPin className="w-5 h-5 text-gray-500" />
                        {t.about_places}
                    </h5>
                    {!readonly && (
                        <button onClick={() => setActiveSection('places')} className="text-fb-blue text-sm font-medium hover:bg-blue-50 dark:hover:bg-blue-900/20 px-2 py-1 rounded transition">
                            {t.btn_edit}
                        </button>
                    )}
                </div>
                <div className="pl-2 space-y-3">
                    {places.map(place => (
                        <div key={place.id} className="flex items-center gap-3">
                          {place.type === 'current' ? <Home className="w-5 h-5 text-fb-blue" /> : <MapPin className="w-5 h-5 text-fb-blue" />}
                          <div>
                            <span className="text-fb-blue font-medium text-[16px]">{place.type === 'current' ? t.place_lives : t.place_from} </span>
                            <span className="font-medium text-fb-blue text-[16px]">{translateItem(place.city, 'cities')}, {translateItem(place.country, 'countries')}</span>
                          </div>
                        </div>
                    ))}
                </div>
              </div>
            )}

            {/* Family & Relationship Group */}
            {(relationship.status || familyMembers.length > 0) && (
              <div className="mb-6">
                <div className="flex justify-between items-center mb-3 border-b border-gray-100 dark:border-gray-700 pb-2">
                    <h5 className="font-bold text-gray-900 dark:text-white text-[18px] flex items-center gap-2">
                        <Heart className="w-5 h-5 text-gray-500" />
                        {t.about_family}
                    </h5>
                    {!readonly && (
                        <button onClick={() => setActiveSection('family')} className="text-fb-blue text-sm font-medium hover:bg-blue-50 dark:hover:bg-blue-900/20 px-2 py-1 rounded transition">
                            {t.btn_edit}
                        </button>
                    )}
                </div>
                <div className="pl-2 space-y-3">
                    {relationship.status && (
                        <div className="flex items-center gap-3">
                            <Heart className="w-5 h-5 text-fb-blue" />
                            <div>
                                <span className="font-medium text-fb-blue text-[16px]">{translateItem(relationship.status, 'relationship_statuses')}</span>
                                {relationship.partner && <span className="text-fb-blue font-medium text-[16px]"> {dir === 'rtl' ? 'مع' : 'with'} <span className="font-medium text-fb-blue text-[16px]">{relationship.partner}</span></span>}
                                {relationship.year && <span className="text-fb-blue font-medium text-[16px]"> {dir === 'rtl' ? 'منذ' : 'since'} {relationship.year}</span>}
                            </div>
                        </div>
                    )}
                    {familyMembers.map(member => (
                       <div key={member.id} className="flex items-center gap-3">
                           <UserIcon className="w-5 h-5 text-fb-blue" />
                           <span className="text-fb-blue font-medium text-[16px]">{member.name} ({member.relation})</span>
                       </div>
                   ))}
                </div>
              </div>
            )}

            {/* Contact Info Group */}
            {(contactInfo.mobile.value || contactInfo.email.value || websites.length > 0 || socialLinks.length > 0) && (
                <div className="mb-6">
                    <div className="flex justify-between items-center mb-3 border-b border-gray-100 dark:border-gray-700 pb-2">
                        <h5 className="font-bold text-gray-900 dark:text-white text-[18px] flex items-center gap-2">
                            <Phone className="w-5 h-5 text-gray-500" />
                            {t.about_contact}
                        </h5>
                        {!readonly && (
                            <button onClick={() => setActiveSection('contact')} className="text-fb-blue text-sm font-medium hover:bg-blue-50 dark:hover:bg-blue-900/20 px-2 py-1 rounded transition">
                                {t.btn_edit}
                            </button>
                        )}
                    </div>
                    <div className="pl-2 space-y-3">
                        {contactInfo.mobile.value && (
                             <div className="flex items-center gap-3">
                                <Phone className="w-5 h-5 text-fb-blue" />
                                <span dir="ltr" className="text-fb-blue font-medium text-[16px]">{contactInfo.mobile.value}</span>
                                <span className="text-xs text-fb-blue font-medium">{t.contact_mobile}</span>
                            </div>
                        )}
                        {contactInfo.email.value && (
                             <div className="flex items-center gap-3">
                                <Mail className="w-5 h-5 text-fb-blue" />
                                <span className="text-fb-blue font-medium text-[16px]">{contactInfo.email.value}</span>
                            </div>
                        )}
                         {websites.map(site => (
                            <div key={site.id} className="flex items-center gap-3">
                                <LinkIcon className="w-5 h-5 text-fb-blue" />
                                <a href={site.url} target="_blank" rel="noreferrer" className="text-fb-blue hover:underline font-medium text-[16px]">{site.url}</a>
                            </div>
                         ))}
                         {socialLinks.map(link => (
                            <div key={link.id} className="flex items-center gap-3">
                               {getPlatformIcon(link.platform)}
                               <a href={link.url} target="_blank" rel="noreferrer" className="text-fb-blue hover:underline font-medium text-[16px]">{link.platform}</a>
                            </div>
                         ))}
                    </div>
                </div>
            )}
            
            {/* Basic Info Group - Merged visually with Contact in standard FB, but separated here for clarity */}
            {(basicInfo.gender.value || basicInfo.birthDate.year || basicInfo.languages.value.length > 0) && (
                <div className="mb-6">
                    <div className="flex justify-between items-center mb-3 border-b border-gray-100 dark:border-gray-700 pb-2">
                        <h5 className="font-bold text-gray-900 dark:text-white text-[18px] flex items-center gap-2">
                            <Info className="w-5 h-5 text-gray-500" />
                            {t.basic_info || (language === 'ar' ? 'معلومات أساسية' : 'Basic Info')}
                        </h5>
                        {!readonly && (
                            <button onClick={() => setActiveSection('contact')} className="text-fb-blue text-sm font-medium hover:bg-blue-50 dark:hover:bg-blue-900/20 px-2 py-1 rounded transition">
                                {t.btn_edit}
                            </button>
                        )}
                    </div>
                    <div className="pl-2 space-y-3">
                        {basicInfo.gender.value && (
                             <div className="flex items-center gap-3">
                                <UserIcon className="w-5 h-5 text-fb-blue" />
                                <span className="text-fb-blue font-medium text-[16px]">{basicInfo.gender.value}</span>
                            </div>
                        )}
                        {basicInfo.birthDate.year && (
                             <div className="flex items-center gap-3">
                                <Calendar className="w-5 h-5 text-fb-blue" />
                                <span className="text-fb-blue font-medium text-[16px]">{translateItem(basicInfo.birthDate.day, 'days')} {translateItem(basicInfo.birthDate.month, 'months')} {basicInfo.birthDate.year}</span>
                             </div>
                        )}
                        {basicInfo.languages.value.length > 0 && (
                             <div className="flex items-center gap-3">
                                <Languages className="w-5 h-5 text-fb-blue" />
                                <span className="text-fb-blue font-medium text-[16px]">{basicInfo.languages.value.map(l => translateItem(l, 'languages_list')).join('، ')}</span>
                             </div>
                        )}
                    </div>
                </div>
            )}
            
            {/* Other Details */}
             {(pronunciation.text || otherNames.length > 0 || quotes.text) && (
                  <div className="mb-6">
                       <div className="flex justify-between items-center mb-3 border-b border-gray-100 dark:border-gray-700 pb-2">
                            <h5 className="font-bold text-gray-900 dark:text-white text-[18px] flex items-center gap-2">
                                <Star className="w-5 h-5 text-gray-500" />
                                {t.about_details}
                            </h5>
                            {!readonly && (
                                <button onClick={() => setActiveSection('details')} className="text-fb-blue text-sm font-medium hover:bg-blue-50 dark:hover:bg-blue-900/20 px-2 py-1 rounded transition">
                                    {t.btn_edit}
                                </button>
                            )}
                       </div>
                       <div className="pl-2 space-y-3">
                           {pronunciation.text && (
                               <div className="flex items-center gap-3">
                                   <Mic className="w-5 h-5 text-fb-blue" />
                                   <span className="text-fb-blue font-medium text-[16px]">{t.details_pronounce}: {pronunciation.text}</span>
                               </div>
                           )}
                           {otherNames.map(n => (
                               <div key={n.id} className="flex items-center gap-3">
                                   <PenLine className="w-5 h-5 text-fb-blue" />
                                   <span className="text-fb-blue font-medium text-[16px]">{n.name} ({translateItem(n.type, 'name_types')})</span>
                               </div>
                           ))}
                           {quotes.text && (
                                <div className="flex items-center gap-3">
                                   <Quote className="w-5 h-5 text-fb-blue" />
                                   <span className="italic text-fb-blue font-medium text-[16px]">"{quotes.text}"</span>
                               </div>
                           )}
                       </div>
                  </div>
             )}
             
             {/* Events */}
             {lifeEvents.length > 0 && (
                 <div className="mb-6">
                      <div className="flex justify-between items-center mb-3 border-b border-gray-100 dark:border-gray-700 pb-2">
                          <h5 className="font-bold text-gray-900 dark:text-white text-[18px] flex items-center gap-2">
                              <Star className="w-5 h-5 text-fb-blue fill-current" />
                              {t.about_events}
                          </h5>
                          {!readonly && (
                                <button onClick={() => setActiveSection('events')} className="text-fb-blue text-sm font-medium hover:bg-blue-50 dark:hover:bg-blue-900/20 px-2 py-1 rounded transition">
                                    {t.btn_edit}
                                </button>
                            )}
                      </div>
                      <div className="space-y-4 relative border-r-2 border-gray-200 dark:border-gray-700 mr-2 pr-4">
                          {lifeEvents.map(ev => (
                              <div key={ev.id} className="relative">
                                   <div className="absolute top-1.5 -right-[21px] w-3 h-3 bg-fb-blue rounded-full border-2 border-white ring-1 ring-gray-100"></div>
                                   <div>
                                       <div className="font-bold text-fb-blue text-[17px]">{ev.title}</div>
                                       <div className="text-sm text-fb-blue font-medium mt-0.5">{ev.year}</div>
                                       <div className="text-sm text-fb-blue mt-1 flex items-center gap-1">
                                           <MapPin className="w-3 h-3" />
                                           {ev.location}
                                       </div>
                                       {ev.description && <div className="text-sm text-fb-blue mt-1 italic">"{ev.description}"</div>}
                                   </div>
                              </div>
                          ))}
                      </div>
                 </div>
             )}

             {!hasDetails && (
                <div className="text-gray-500 text-center py-10 flex flex-col items-center">
                    <Info className="w-10 h-10 mb-2 text-gray-300" />
                    <p>{t.no_details}</p>
                    {!readonly && (
                        <button onClick={() => setActiveSection('work')} className="mt-4 text-fb-blue font-medium hover:underline">
                            {t.profile_edit_details || (language === 'ar' ? 'إضافة تفاصيل عنك' : 'Add Details About You')}
                        </button>
                    )}
                </div>
            )}
          </div>
        );

      case 'work':
        return (
          <div className="space-y-8 animate-fadeIn">
            {/* Work Section */}
            <div>
              <h4 className="font-bold text-[21px] mb-4 text-gray-900">{t.about_work_edu}</h4>
              
              {works.map((work) => (
                <div key={work.id} className="flex items-start gap-4 mb-4 group relative">
                    <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center flex-shrink-0">
                        <Briefcase className="w-5 h-5 text-fb-blue" />
                    </div>
                    <div className="flex-1">
                        <div className="text-[16px] font-medium text-fb-blue">{translateItem(work.role, 'job_titles')}</div>
                        <div className="text-fb-blue font-medium text-[15px] flex items-center gap-2">
                           {work.company}
                           <span aria-hidden="true">·</span>
                           <PrivacyIcon type={work.privacy} />
                        </div>
                    </div>
                    {!readonly && (
                      <button 
                        onClick={() => handleEditWork(work)}
                        className="p-2 text-gray-500 hover:bg-gray-200 rounded-full transition"
                      >
                        <Pen className="w-5 h-5" />
                      </button>
                    )}
                </div>
              ))}

              {!readonly && (!showWorkForm ? (
                <button 
                  onClick={() => {
                      setNewWork({ role: '', company: '', privacy: 'public' });
                      setEditingWorkId(null);
                      setShowWorkForm(true);
                  }}
                  className="flex items-center gap-2 text-fb-blue hover:underline text-[16px] font-medium mt-2"
                >
                    <Plus className="w-6 h-6 rounded-full bg-blue-50 p-1" />
                    <span>{t.empty_work}</span>
                </button>
              ) : (
                <div className="bg-gray-50 p-4 rounded-lg border border-gray-200 mt-4 fade-in">
                  <div className="space-y-3">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">{t.ph_position}</label>
                      <select 
                        className="w-full border border-gray-300 rounded-md p-2 text-sm bg-white focus:ring-2 focus:ring-fb-blue focus:border-transparent outline-none"
                        value={newWork.role}
                        onChange={(e) => setNewWork({...newWork, role: e.target.value})}
                      >
                        <option value="">{t['placeholders_select_option'] || (language === 'ar' ? 'اختر...' : 'Select...')}</option>
                        {jobTitles.map(title => (
                          <option key={title} value={title}>{translateItem(title, 'job_titles')}</option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">{t.ph_company}</label>
                      <input 
                        type="text" 
                        className="w-full border border-gray-300 rounded-md p-2 text-sm focus:ring-2 focus:ring-fb-blue focus:border-transparent outline-none"
                        placeholder={t.ph_company}
                        value={newWork.company}
                        onChange={(e) => setNewWork({...newWork, company: e.target.value})}
                      />
                    </div>
                    
                    <div className="flex justify-between items-center pt-2 border-t border-gray-200 mt-3">
                         <PrivacySelect 
                            value={newWork.privacy} 
                            onChange={(val) => setNewWork({...newWork, privacy: val})} 
                         />
                         <div className="flex gap-2">
                            {editingWorkId && (
                                 <button onClick={() => { deleteItem('work', editingWorkId); setShowWorkForm(false); setEditingWorkId(null); }} className="px-3 py-1.5 text-red-600 hover:bg-red-50 rounded-md text-sm font-semibold flex items-center gap-1">
                                     <Trash2 className="w-4 h-4" /> {t.btn_delete}
                                 </button>
                            )}
                            <button onClick={() => setShowWorkForm(false)} className="px-3 py-1.5 text-gray-600 hover:bg-gray-200 rounded-md text-sm font-semibold">{t.btn_cancel}</button>
                            <button onClick={handleSaveWork} disabled={!newWork.role || !newWork.company} className="px-4 py-1.5 bg-emerald-700 text-white rounded-md text-sm font-semibold hover:bg-blue-700 disabled:opacity-50">{t.btn_save}</button>
                         </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            
            <div className="border-t border-gray-200"></div>

            {/* University Section */}
            <div>
              <h4 className="font-bold text-[21px] mb-4 text-gray-900">{t.empty_uni}</h4>
              
              {universities.map((uni) => (
                <div key={uni.id} className="flex items-start gap-4 mb-4 group relative">
                    <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center flex-shrink-0">
                        <GraduationCap className="w-5 h-5 text-fb-blue" />
                    </div>
                    <div className="flex-1">
                        <div className="text-[16px] font-medium text-fb-blue">{uni.name}</div>
                        <div className="text-fb-blue font-medium text-[15px] flex items-center gap-2 flex-wrap">
                          {translateItem(uni.degree, 'degrees')} · {uni.major} {uni.year && `· ${t.edu_graduated} ${uni.year}`}
                          <span aria-hidden="true">·</span>
                          <PrivacyIcon type={uni.privacy} />
                        </div>
                    </div>
                    {!readonly && (
                      <button 
                        onClick={() => handleEditUni(uni)}
                        className="p-2 text-gray-500 hover:bg-gray-200 rounded-full transition"
                      >
                        <Pen className="w-5 h-5" />
                      </button>
                    )}
                </div>
              ))}

              {!readonly && (!showUniForm ? (
                <button 
                  onClick={() => {
                      setNewUni({ name: '', degree: '', major: '', year: '', privacy: 'public' });
                      setEditingUniId(null);
                      setShowUniForm(true);
                  }}
                  className="flex items-center gap-2 text-fb-blue hover:underline text-[16px] font-medium mt-2"
                >
                    <Plus className="w-6 h-6 rounded-full bg-blue-50 p-1" />
                    <span>{t.empty_uni}</span>
                </button>
              ) : (
                <div className="bg-gray-50 p-4 rounded-lg border border-gray-200 mt-4 fade-in">
                  {/* ... Uni form inputs ... */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    <div className="md:col-span-2">
                       <label className="block text-sm font-medium text-gray-700 mb-1">{language === 'ar' ? 'اسم الجامعة' : 'University Name'}</label>
                       <input 
                        type="text" 
                        className="w-full border border-gray-300 rounded-md p-2 text-sm focus:ring-2 focus:ring-fb-blue focus:border-transparent outline-none"
                        placeholder={language === 'ar' ? 'مثال: جامعة القاهرة' : 'Ex: Cairo University'}
                        value={newUni.name}
                        onChange={(e) => setNewUni({...newUni, name: e.target.value})}
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">{language === 'ar' ? 'الدرجة العلمية' : 'Degree'}</label>
                      <select 
                        className="w-full border border-gray-300 rounded-md p-2 text-sm bg-white focus:ring-2 focus:ring-fb-blue focus:border-transparent outline-none"
                        value={newUni.degree}
                        onChange={(e) => setNewUni({...newUni, degree: e.target.value})}
                      >
                         <option value="">{t['placeholders_select_option'] || (language === 'ar' ? 'اختر...' : 'Select...')}</option>
                         {degrees.map(d => <option key={d} value={d}>{translateItem(d, 'degrees')}</option>)}
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">{t.edu_graduated}</label>
                      <input 
                        type="number" 
                        placeholder="YYYY"
                        className="w-full border border-gray-300 rounded-md p-2 text-sm focus:ring-2 focus:ring-fb-blue focus:border-transparent outline-none"
                        value={newUni.year}
                        onChange={(e) => setNewUni({...newUni, year: e.target.value})}
                      />
                    </div>
                    <div className="md:col-span-2">
                       <label className="block text-sm font-medium text-gray-700 mb-1">{language === 'ar' ? 'التخصص' : 'Major'}</label>
                       <input 
                        type="text" 
                        className="w-full border border-gray-300 rounded-md p-2 text-sm focus:ring-2 focus:ring-fb-blue focus:border-transparent outline-none"
                        placeholder={language === 'ar' ? 'مثال: هندسة، طب، حقوق...' : 'Ex: Engineering, Medicine, Law...'}
                        value={newUni.major}
                        onChange={(e) => setNewUni({...newUni, major: e.target.value})}
                      />
                    </div>
                  </div>

                  <div className="flex justify-between items-center pt-3 border-t border-gray-200 mt-3">
                        <PrivacySelect 
                            value={newUni.privacy} 
                            onChange={(val) => setNewUni({...newUni, privacy: val})} 
                        />
                        <div className="flex gap-2">
                            {editingUniId && (
                                <button onClick={() => { deleteItem('uni', editingUniId); setShowUniForm(false); setEditingUniId(null); }} className="px-3 py-1.5 text-red-600 hover:bg-red-50 rounded-md text-sm font-semibold flex items-center gap-1">
                                    <Trash2 className="w-4 h-4" /> {t.btn_delete}
                                </button>
                            )}
                            <button onClick={() => setShowUniForm(false)} className="px-3 py-1.5 text-gray-600 hover:bg-gray-200 rounded-md text-sm font-semibold">{t.btn_cancel}</button>
                            <button onClick={handleSaveUni} disabled={!newUni.name || !newUni.degree} className="px-4 py-1.5 bg-emerald-700 text-white rounded-md text-sm font-semibold hover:bg-blue-700 disabled:opacity-50">{t.btn_save}</button>
                        </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="border-t border-gray-200"></div>

             {/* High School Section */}
             <div>
              <h4 className="font-bold text-[21px] mb-4 text-gray-900">{language === 'ar' ? 'إضافة مدرسة' : 'Add School'}</h4>
              
              {schools.map((school) => (
                <div key={school.id} className="flex items-start gap-4 mb-4 group relative">
                    <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center flex-shrink-0">
                        <GraduationCap className="w-5 h-5 text-fb-blue" />
                    </div>
                    <div className="flex-1">
                        <div className="text-[16px] font-medium text-fb-blue">{school.name}</div>
                        <div className="text-fb-blue font-medium text-[15px] flex items-center gap-2">
                           {school.year ? `${t.edu_graduated} ${school.year}` : (language === 'ar' ? 'إضافة مدرسة' : 'Add School')}
                           <span aria-hidden="true">·</span>
                           <PrivacyIcon type={school.privacy} />
                        </div>
                    </div>
                    {!readonly && (
                      <button 
                        onClick={() => handleEditSchool(school)}
                        className="p-2 text-gray-500 hover:bg-gray-200 rounded-full transition"
                      >
                        <Pen className="w-5 h-5" />
                      </button>
                    )}
                </div>
              ))}

              {!readonly && (!showSchoolForm ? (
                <button 
                  onClick={() => {
                      setNewSchool({ name: '', year: '', privacy: 'public' });
                      setEditingSchoolId(null);
                      setShowSchoolForm(true);
                  }}
                  className="flex items-center gap-2 text-fb-blue hover:underline text-[16px] font-medium mt-2"
                >
                    <Plus className="w-6 h-6 rounded-full bg-blue-50 p-1" />
                    <span>{language === 'ar' ? 'إضافة مدرسة' : 'Add School'}</span>
                </button>
              ) : (
                <div className="bg-gray-50 p-4 rounded-lg border border-gray-200 mt-4 fade-in">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    <div className="md:col-span-2">
                       <label className="block text-sm font-medium text-gray-700 mb-1">{t.ph_school}</label>
                       <input 
                        type="text" 
                        className="w-full border border-gray-300 rounded-md p-2 text-sm focus:ring-2 focus:ring-fb-blue focus:border-transparent outline-none"
                        value={newSchool.name}
                        placeholder={language === 'ar' ? 'مثال: مدرسة الثانوية للبنين' : 'Ex: Boys High School'}
                        onChange={(e) => setNewSchool({...newSchool, name: e.target.value})}
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">{t.edu_graduated}</label>
                      <input 
                        type="number" 
                        placeholder="YYYY"
                        className="w-full border border-gray-300 rounded-md p-2 text-sm focus:ring-2 focus:ring-fb-blue focus:border-transparent outline-none"
                        value={newSchool.year}
                        onChange={(e) => setNewSchool({...newSchool, year: e.target.value})}
                      />
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-3 border-t border-gray-200 mt-3">
                      <PrivacySelect 
                            value={newSchool.privacy} 
                            onChange={(val) => setNewSchool({...newSchool, privacy: val})} 
                        />
                      <div className="flex gap-2">
                          {editingSchoolId && (
                               <button onClick={() => { deleteItem('school', editingSchoolId); setShowSchoolForm(false); setEditingSchoolId(null); }} className="px-3 py-1.5 text-red-600 hover:bg-red-50 rounded-md text-sm font-semibold flex items-center gap-1">
                                   <Trash2 className="w-4 h-4" /> {t.btn_delete}
                               </button>
                          )}
                          <button onClick={() => setShowSchoolForm(false)} className="px-3 py-1.5 text-gray-600 hover:bg-gray-200 rounded-md text-sm font-semibold">{t.btn_cancel}</button>
                          <button onClick={handleSaveSchool} disabled={!newSchool.name} className="px-4 py-1.5 bg-emerald-700 text-white rounded-md text-sm font-semibold hover:bg-blue-700 disabled:opacity-50">{t.btn_save}</button>
                      </div>
                  </div>
                </div>
              ))}
            </div>

          </div>
        );
      case 'places':
        const currentCity = places.find(p => p.type === 'current');
        const hometown = places.find(p => p.type === 'hometown');

        const renderPlaceForm = (type: PlaceType) => (
             <div className="bg-gray-50 p-4 rounded-lg border border-gray-200 mt-4 fade-in">
                  <div className="space-y-3">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">{language === 'ar' ? 'الدولة' : 'Country'}</label>
                      <select 
                        className="w-full border border-gray-300 rounded-md p-2 text-sm bg-white focus:ring-2 focus:ring-fb-blue focus:border-transparent outline-none"
                        value={newPlace.country}
                        onChange={(e) => setNewPlace({...newPlace, country: e.target.value, city: ''})}
                      >
                        <option value="">{t['placeholders_select_option'] || (language === 'ar' ? 'اختر الدولة...' : 'Select Country...')}</option>
                        {Object.keys(COUNTRIES_DATA).map(c => (
                          <option key={c} value={c}>{translateItem(c, 'countries')}</option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">{t.ph_city}</label>
                       <select 
                        className="w-full border border-gray-300 rounded-md p-2 text-sm bg-white focus:ring-2 focus:ring-fb-blue focus:border-transparent outline-none disabled:bg-gray-200"
                        value={newPlace.city}
                        onChange={(e) => setNewPlace({...newPlace, city: e.target.value})}
                        disabled={!newPlace.country}
                      >
                        <option value="">{t['placeholders_select_option'] || (language === 'ar' ? 'اختر المدينة...' : 'Select City...')}</option>
                        {newPlace.country && COUNTRIES_DATA[newPlace.country]?.map(city => (
                          <option key={city} value={city}>{translateItem(city, 'cities')}</option>
                        ))}
                      </select>
                    </div>
                    
                    <div className="flex items-center justify-between pt-2 border-t border-gray-200 mt-3">
                         <PrivacySelect 
                            value={newPlace.privacy} 
                            onChange={(val) => setNewPlace({...newPlace, privacy: val})} 
                         />
                      <div className="flex gap-2">
                        {/* Check if place exists to show delete */}
                        {places.find(p => p.type === type) && (
                             <button onClick={() => { deleteItem('place', places.find(p => p.type === type)!.id); setEditingPlaceType(null); }} className="px-3 py-1.5 text-red-600 hover:bg-red-50 rounded-md text-sm font-semibold flex items-center gap-1">
                                 <Trash2 className="w-4 h-4" /> {t.btn_delete}
                             </button>
                        )}
                        <button onClick={() => { setEditingPlaceType(null); setNewPlace({country: '', city: '', privacy: 'public'}); }} className="px-3 py-1.5 text-gray-600 hover:bg-gray-200 rounded-md text-sm font-semibold">{t.btn_cancel}</button>
                        <button onClick={handleSavePlace} disabled={!newPlace.country || !newPlace.city} className="px-4 py-1.5 bg-emerald-700 text-white rounded-md text-sm font-semibold hover:bg-blue-700 disabled:opacity-50">{t.btn_save}</button>
                      </div>
                    </div>
                  </div>
                </div>
        );

        return (
           <div className="space-y-6 animate-fadeIn">
              <h4 className="font-bold text-[21px] mb-2 text-gray-900">{t.about_places}</h4>
              
              {/* Current City Section */}
              <div className="mb-4">
                  {currentCity && editingPlaceType !== 'current' ? (
                    <div className="flex items-start gap-4 mb-4 group relative">
                        <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center flex-shrink-0">
                            <MapPin className="w-5 h-5 text-fb-blue" />
                        </div>
                        <div className="flex-1">
                            <div className="text-[16px] font-medium text-fb-blue">{translateItem(currentCity.city, 'cities')}, {translateItem(currentCity.country, 'countries')}</div>
                            <div className="text-fb-blue font-medium text-[15px] flex items-center gap-2">
                                {t.place_current}
                                <span aria-hidden="true">·</span>
                                <PrivacyIcon type={currentCity.privacy} />
                            </div>
                        </div>
                        {!readonly && (
                            <button 
                                onClick={() => handleEditPlace(currentCity)}
                                className="p-2 text-gray-500 hover:bg-gray-200 rounded-full transition"
                            >
                                <Pen className="w-5 h-5" />
                            </button>
                        )}
                    </div>
                  ) : editingPlaceType !== 'current' ? (
                       !readonly && (
                           <button 
                            onClick={() => setEditingPlaceType('current')}
                            className="flex items-center gap-2 text-fb-blue hover:underline text-[16px] font-medium"
                           >
                                <Plus className="w-6 h-6 rounded-full bg-blue-50 p-1" />
                                <span>{language === 'ar' ? 'إضافة المدينة الحالية' : 'Add Current City'}</span>
                           </button>
                       )
                  ) : renderPlaceForm('current')}
              </div>

              {/* Hometown Section */}
              <div className="mb-4">
                  {hometown && editingPlaceType !== 'hometown' ? (
                    <div className="flex items-start gap-4 mb-4 group relative">
                        <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center flex-shrink-0">
                            <Home className="w-5 h-5 text-fb-blue" />
                        </div>
                        <div className="flex-1">
                            <div className="text-[16px] font-medium text-fb-blue">{translateItem(hometown.city, 'cities')}, {translateItem(hometown.country, 'countries')}</div>
                            <div className="text-fb-blue font-medium text-[15px] flex items-center gap-2">
                                {t.place_hometown || (language === 'ar' ? 'المدينة التي نشأت فيها' : 'Hometown')}
                                <span aria-hidden="true">·</span>
                                <PrivacyIcon type={hometown.privacy} />
                            </div>
                        </div>
                         {!readonly && (
                             <button 
                                onClick={() => handleEditPlace(hometown)}
                                className="p-2 text-gray-500 hover:bg-gray-200 rounded-full transition"
                            >
                                <Pen className="w-5 h-5" />
                            </button>
                         )}
                    </div>
                  ) : editingPlaceType !== 'hometown' ? (
                       !readonly && (
                           <button 
                            onClick={() => setEditingPlaceType('hometown')}
                            className="flex items-center gap-2 text-fb-blue hover:underline text-[16px] font-medium"
                           >
                                <Plus className="w-6 h-6 rounded-full bg-blue-50 p-1" />
                                <span>{language === 'ar' ? 'إضافة مدينة المنشأ' : 'Add Hometown'}</span>
                           </button>
                       )
                  ) : renderPlaceForm('hometown')}
              </div>
           </div>
        );
      case 'contact':
        return (
            <div className="space-y-8 animate-fadeIn">
                {/* Contact Info */}
                <div>
                    <h4 className="font-bold text-[21px] mb-4 text-gray-900">{t.about_contact}</h4>
                    
                    {/* Mobile */}
                    <div className="mb-4 group">
                        {editingContact === 'mobile' ? (
                            <div className="bg-gray-50 p-3 rounded-lg border border-gray-200">
                                <label className="text-xs text-gray-500 mb-1 block">{t.contact_mobile}</label>
                                <input 
                                    type="text" 
                                    className="w-full border p-2 rounded mb-2 text-sm" 
                                    value={tempContact.value} 
                                    onChange={(e) => setTempContact({...tempContact, value: e.target.value})}
                                />
                                <div className="flex justify-between items-center">
                                    <PrivacySelect value={tempContact.privacy} onChange={(val) => setTempContact({...tempContact, privacy: val})} small />
                                    <div className="flex gap-2">
                                        {/* Added Delete Button for Mobile */}
                                        {contactInfo.mobile.value && (
                                            <button onClick={() => handleDeleteContact('mobile')} className="text-xs font-semibold px-2 py-1 text-red-600 hover:bg-red-50 rounded flex items-center gap-1">
                                                <Trash2 className="w-3 h-3" /> {t.btn_delete}
                                            </button>
                                        )}
                                        <button onClick={() => setEditingContact(null)} className="text-xs font-semibold px-2 py-1 bg-gray-200 rounded">{t.btn_cancel}</button>
                                        <button onClick={() => handleSaveContact('mobile')} className="text-xs font-semibold px-2 py-1 bg-emerald-700 text-white rounded hover:bg-blue-700">{t.btn_save}</button>
                                    </div>
                                </div>
                            </div>
                        ) : (
                            <div className="flex items-center gap-3 relative">
                                <Phone className="w-5 h-5 text-fb-blue" />
                                <div className="flex-1 flex items-center justify-between">
                                    <div className="flex flex-col">
                                        {contactInfo.mobile.value ? (
                                            <>
                                                <div className="text-[16px] text-fb-blue font-medium">
                                                    {contactInfo.mobile.value}
                                                </div>
                                                <div className="text-xs text-fb-blue font-medium flex items-center gap-1">{t.contact_mobile} <span aria-hidden="true">·</span> <PrivacyIcon type={contactInfo.mobile.privacy} /></div>
                                            </>
                                        ) : (
                                            !readonly ? (
                                                <button 
                                                    onClick={() => { setTempContact(contactInfo.mobile); setEditingContact('mobile'); }} 
                                                    className="text-[16px] text-fb-blue font-medium hover:underline"
                                                >
                                                    {t.empty_mobile}
                                                </button>
                                            ) : (
                                                <div className="text-[16px] text-gray-400 italic">{t.no_mobile}</div>
                                            )
                                        )}
                                    </div>
                                    {/* Added Pencil Icon for Mobile if value exists */}
                                    {!readonly && contactInfo.mobile.value && (
                                        <button 
                                            onClick={() => { setTempContact(contactInfo.mobile); setEditingContact('mobile'); }} 
                                            className="p-2 text-gray-500 hover:bg-gray-200 rounded-full transition"
                                        >
                                            <Pen className="w-5 h-5" />
                                        </button>
                                    )}
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Email */}
                    <div className="mb-4 group">
                         {editingContact === 'email' ? (
                            <div className="bg-gray-50 p-3 rounded-lg border border-gray-200">
                                <label className="text-xs text-gray-500 mb-1 block">{t.contact_email}</label>
                                <input 
                                    type="text" 
                                    className="w-full border p-2 rounded mb-2 text-sm" 
                                    value={tempContact.value} 
                                    onChange={(e) => setTempContact({...tempContact, value: e.target.value})}
                                />
                                <div className="flex justify-between items-center">
                                    <PrivacySelect value={tempContact.privacy} onChange={(val) => setTempContact({...tempContact, privacy: val})} small />
                                    <div className="flex gap-2">
                                        {/* Added Delete Button for Email */}
                                        {contactInfo.email.value && (
                                            <button onClick={() => handleDeleteContact('email')} className="text-xs font-semibold px-2 py-1 text-red-600 hover:bg-red-50 rounded flex items-center gap-1">
                                                <Trash2 className="w-3 h-3" /> {t.btn_delete}
                                            </button>
                                        )}
                                        <button onClick={() => setEditingContact(null)} className="text-xs font-semibold px-2 py-1 bg-gray-200 rounded">{t.btn_cancel}</button>
                                        <button onClick={() => handleSaveContact('email')} className="text-xs font-semibold px-2 py-1 bg-emerald-700 text-white rounded hover:bg-blue-700">{t.btn_save}</button>
                                    </div>
                                </div>
                            </div>
                        ) : (
                            <div className="flex items-center gap-3 relative">
                                <Mail className="w-5 h-5 text-fb-blue" />
                                <div className="flex-1 flex items-center justify-between">
                                    <div className="flex flex-col">
                                        {contactInfo.email.value ? (
                                            <>
                                                <div className="text-[16px] text-fb-blue font-medium">
                                                    {contactInfo.email.value}
                                                </div>
                                                <div className="text-xs text-fb-blue font-medium flex items-center gap-1">{t.contact_email} <span aria-hidden="true">·</span> <PrivacyIcon type={contactInfo.email.privacy} /></div>
                                            </>
                                        ) : (
                                            !readonly ? (
                                                <button 
                                                    onClick={() => { setTempContact(contactInfo.email); setEditingContact('email'); }} 
                                                    className="text-[16px] text-fb-blue font-medium hover:underline"
                                                >
                                                    {t.empty_email}
                                                </button>
                                            ) : (
                                                <div className="text-[16px] text-gray-400 italic">{t.no_email}</div>
                                            )
                                        )}
                                    </div>
                                    {/* Added Pencil Icon for Email if value exists */}
                                    {!readonly && contactInfo.email.value && (
                                        <button 
                                            onClick={() => { setTempContact(contactInfo.email); setEditingContact('email'); }} 
                                            className="p-2 text-gray-500 hover:bg-gray-200 rounded-full transition"
                                        >
                                            <Pen className="w-5 h-5" />
                                        </button>
                                    )}
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Websites */}
                    <div className="mb-4">
                        {websites.map(site => (
                             <div key={site.id} className="flex items-center gap-3 mb-3 group relative">
                                <LinkIcon className="w-5 h-5 text-fb-blue" />
                                <div className="flex-1">
                                    <a href={site.url} target="_blank" rel="noreferrer" className="text-[16px] text-fb-blue hover:underline block truncate max-w-[200px] font-medium">{site.url}</a>
                                    <div className="text-xs text-fb-blue font-medium flex items-center gap-1">{t.contact_website} <span aria-hidden="true">·</span> <PrivacyIcon type={site.privacy} /></div>
                                </div>
                                {!readonly && <button onClick={() => handleEditWebsite(site)} className="p-2 text-gray-500 hover:bg-gray-100 rounded-full"><Pen className="w-4 h-4" /></button>}
                            </div>
                        ))}
                        {showWebsiteForm ? (
                             <div className="bg-gray-50 p-3 rounded-lg border border-gray-200 mt-2">
                                <label className="text-xs text-gray-500 mb-1 block">{t.contact_website}</label>
                                <input type="text" className="w-full border p-2 rounded mb-2 text-sm text-left" placeholder="https://..." value={newWebsite.url} onChange={(e) => setNewWebsite({...newWebsite, url: e.target.value})} />
                                <div className="flex justify-between items-center">
                                    <PrivacySelect value={newWebsite.privacy} onChange={(val) => setNewWebsite({...newWebsite, privacy: val})} small />
                                    <div className="flex gap-2">
                                        {editingWebsiteId && (
                                            <button onClick={() => { deleteItem('website', editingWebsiteId); setShowWebsiteForm(false); setEditingWebsiteId(null); }} className="text-xs font-semibold px-2 py-1 text-red-500 hover:bg-red-50 rounded">{t.btn_delete}</button>
                                        )}
                                        <button onClick={() => setShowWebsiteForm(false)} className="text-xs font-semibold px-2 py-1 bg-gray-200 rounded">{t.btn_cancel}</button>
                                        <button onClick={handleSaveWebsite} className="text-xs font-semibold px-2 py-1 bg-emerald-700 text-white rounded hover:bg-blue-700">{t.btn_save}</button>
                                    </div>
                                </div>
                            </div>
                        ) : (
                            !readonly && (
                                <button onClick={() => { setNewWebsite({ url: '', privacy: 'public' }); setEditingWebsiteId(null); setShowWebsiteForm(true); }} className="flex items-center gap-2 text-fb-blue hover:underline text-[16px] font-medium mt-1">
                                    <Plus className="w-5 h-5 rounded-full bg-blue-50 p-1" /> <span>{t.empty_website}</span>
                                </button>
                            )
                        )}
                    </div>

                    {/* Social Links */}
                    <div className="mb-2">
                         {socialLinks.map(link => (
                             <div key={link.id} className="flex items-center gap-3 mb-3 group relative">
                                {getPlatformIcon(link.platform)}
                                <div className="flex-1">
                                    <a href={link.url} target="_blank" rel="noreferrer" className="text-[16px] text-fb-blue hover:underline block font-medium">{link.platform}</a>
                                    <div className="text-xs text-fb-blue font-medium flex items-center gap-1">{link.url} <span aria-hidden="true">·</span> <PrivacyIcon type={link.privacy} /></div>
                                </div>
                                {!readonly && <button onClick={() => handleEditSocial(link)} className="p-2 text-gray-500 hover:bg-gray-100 rounded-full"><Pen className="w-4 h-4" /></button>}
                            </div>
                        ))}
                         {showSocialForm ? (
                             <div className="bg-gray-50 p-3 rounded-lg border border-gray-200 mt-2">
                                <div className="mb-2">
                                    <label className="text-xs text-gray-500 mb-1 block">{language === 'ar' ? 'المنصة' : 'Platform'}</label>
                                    <select className="w-full border p-2 rounded text-sm bg-white" value={newSocial.platform} onChange={(e) => setNewSocial({...newSocial, platform: e.target.value})}>
                                        <option value="">{t['placeholders_select_option'] || (language === 'ar' ? 'اختر المنصة...' : 'Select Platform...')}</option>
                                        {SOCIAL_PLATFORMS.map(p => <option key={p} value={p}>{p}</option>)}
                                    </select>
                                </div>
                                <div className="mb-2">
                                    <label className="text-xs text-gray-500 mb-1 block">{language === 'ar' ? 'رابط الحساب / اسم المستخدم' : 'URL / Username'}</label>
                                    <input type="text" className="w-full border p-2 rounded text-sm text-left" placeholder="URL or Username" value={newSocial.url} onChange={(e) => setNewSocial({...newSocial, url: e.target.value})} />
                                </div>
                                <div className="flex justify-between items-center">
                                    <PrivacySelect value={newSocial.privacy} onChange={(val) => setNewSocial({...newSocial, privacy: val})} small />
                                    <div className="flex gap-2">
                                        {editingSocialId && (
                                            <button onClick={() => { deleteItem('social', editingSocialId); setShowSocialForm(false); setEditingSocialId(null); }} className="text-xs font-semibold px-2 py-1 text-red-500 hover:bg-red-50 rounded">{t.btn_delete}</button>
                                        )}
                                        <button onClick={() => setShowSocialForm(false)} className="text-xs font-semibold px-2 py-1 bg-gray-200 rounded">{t.btn_cancel}</button>
                                        <button onClick={handleSaveSocial} className="text-xs font-semibold px-2 py-1 bg-emerald-700 text-white rounded hover:bg-blue-700">{t.btn_save}</button>
                                    </div>
                                </div>
                            </div>
                        ) : (
                            !readonly && (
                                <button onClick={() => { setNewSocial({ platform: '', url: '', privacy: 'public' }); setEditingSocialId(null); setShowSocialForm(true); }} className="flex items-center gap-2 text-fb-blue hover:underline text-[16px] font-medium mt-1">
                                    <Plus className="w-5 h-5 rounded-full bg-blue-50 p-1" /> <span>{t.empty_social}</span>
                                </button>
                            )
                        )}
                    </div>
                </div>

                <div className="border-t border-gray-200"></div>

                {/* Basic Info */}
                <div>
                    <h4 className="font-bold text-[21px] mb-4 text-gray-900">{t.basic_info || (language === 'ar' ? 'المعلومات الأساسية' : 'Basic Info')}</h4>
                    
                    {/* Gender */}
                     <div className="mb-4 group">
                        {editingBasic === 'gender' ? (
                            <div className="bg-gray-50 p-3 rounded-lg border border-gray-200">
                                <label className="text-xs text-gray-500 mb-1 block">{t.basic_gender}</label>
                                <select className="w-full border p-2 rounded mb-2 text-sm bg-white" value={tempGender.value} onChange={(e) => setTempGender({...tempGender, value: e.target.value})}>
                                    <option value="">{t['placeholders_select_option'] || (language === 'ar' ? 'اختر النوع...' : 'Select Gender...')}</option>
                                    <option value="ذكر">{language === 'ar' ? 'ذكر' : 'Male'}</option>
                                    <option value="أنثى">{language === 'ar' ? 'أنثى' : 'Female'}</option>
                                    <option value="مخصص">{language === 'ar' ? 'مخصص' : 'Custom'}</option>
                                </select>
                                <div className="flex justify-between items-center">
                                    <PrivacySelect value={tempGender.privacy} onChange={(val) => setTempGender({...tempGender, privacy: val})} small />
                                    <div className="flex gap-2">
                                        <button onClick={() => setEditingBasic(null)} className="text-xs font-semibold px-2 py-1 bg-gray-200 rounded">{t.btn_cancel}</button>
                                        <button onClick={() => handleSaveBasic('gender')} className="text-xs font-semibold px-2 py-1 bg-emerald-700 text-white rounded hover:bg-blue-700">{t.btn_save}</button>
                                    </div>
                                </div>
                            </div>
                        ) : (
                            <div className="flex items-center gap-3 relative">
                                <UserIcon className="w-5 h-5 text-fb-blue" />
                                <div className="flex-1 flex items-center justify-between">
                                    <div className="flex flex-col">
                                        {basicInfo.gender.value ? (
                                            <>
                                                <div className="text-[16px] text-fb-blue font-medium">
                                                    {basicInfo.gender.value}
                                                </div>
                                                <div className="text-xs text-fb-blue font-medium flex items-center gap-1">{t.basic_gender} <span aria-hidden="true">·</span> <PrivacyIcon type={basicInfo.gender.privacy} /></div>
                                            </>
                                        ) : (
                                            !readonly ? (
                                                <button 
                                                    onClick={() => { setTempGender(basicInfo.gender); setEditingBasic('gender'); }}
                                                    className="text-[16px] text-fb-blue font-medium hover:underline"
                                                >
                                                    {t.empty_gender}
                                                </button>
                                            ) : (
                                                <div className="text-[16px] text-gray-400 italic">{language === 'ar' ? 'النوع غير محدد' : 'Gender not set'}</div>
                                            )
                                        )}
                                    </div>
                                    {/* Added Pencil Icon for Gender if value exists */}
                                    {!readonly && basicInfo.gender.value && (
                                        <button 
                                            onClick={() => { setTempGender(basicInfo.gender); setEditingBasic('gender'); }}
                                            className="p-2 text-gray-500 hover:bg-gray-200 rounded-full transition"
                                        >
                                            <Pen className="w-5 h-5" />
                                        </button>
                                    )}
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Birth Date */}
                     <div className="mb-4 group">
                        {editingBasic === 'birthDate' ? (
                            <div className="bg-gray-50 p-3 rounded-lg border border-gray-200">
                                <label className="text-xs text-gray-500 mb-1 block">{t.basic_birth}</label>
                                <div className="flex gap-2 mb-2">
                                    <select className="border p-1.5 rounded text-sm bg-white flex-1" value={tempBirthDate.day} onChange={(e) => setTempBirthDate({...tempBirthDate, day: e.target.value})}>
                                        {DAYS.map(d => <option key={d} value={d}>{d}</option>)}
                                    </select>
                                    <select className="border p-1.5 rounded text-sm bg-white flex-1" value={tempBirthDate.month} onChange={(e) => setTempBirthDate({...tempBirthDate, month: e.target.value})}>
                                        {MONTHS.map(m => <option key={m} value={m}>{translateItem(m, 'months')}</option>)}
                                    </select>
                                    <select className="border p-1.5 rounded text-sm bg-white flex-1" value={tempBirthDate.year} onChange={(e) => setTempBirthDate({...tempBirthDate, year: e.target.value})}>
                                        {YEARS.map(y => <option key={y} value={y}>{y}</option>)}
                                    </select>
                                </div>
                                <div className="flex justify-between items-center">
                                    <PrivacySelect value={tempBirthDate.privacy} onChange={(val) => setTempBirthDate({...tempBirthDate, privacy: val})} small />
                                    <div className="flex gap-2">
                                        <button onClick={() => setEditingBasic(null)} className="text-xs font-semibold px-2 py-1 bg-gray-200 rounded">{t.btn_cancel}</button>
                                        <button onClick={() => handleSaveBasic('birthDate')} className="text-xs font-semibold px-2 py-1 bg-emerald-700 text-white rounded hover:bg-blue-700">{t.btn_save}</button>
                                    </div>
                                </div>
                            </div>
                        ) : (
                            <div className="flex items-center gap-3 relative">
                                <Calendar className="w-5 h-5 text-fb-blue" />
                                <div className="flex-1 flex items-center justify-between">
                                    <div className="flex flex-col">
                                        {basicInfo.birthDate.year ? (
                                            <>
                                                <div className="text-[16px] text-fb-blue font-medium">
                                                    {basicInfo.birthDate.day} {translateItem(basicInfo.birthDate.month, 'months')} {basicInfo.birthDate.year}
                                                </div>
                                                <div className="text-xs text-fb-blue font-medium flex items-center gap-1">{t.basic_birth} <span aria-hidden="true">·</span> <PrivacyIcon type={basicInfo.birthDate.privacy} /></div>
                                            </>
                                        ) : (
                                            !readonly ? (
                                                <button 
                                                    onClick={() => { setTempBirthDate(basicInfo.birthDate); setEditingBasic('birthDate'); }}
                                                    className="text-[16px] text-fb-blue font-medium hover:underline"
                                                >
                                                    {t.empty_birth}
                                                </button>
                                            ) : (
                                                <div className="text-[16px] text-gray-400 italic">{language === 'ar' ? 'تاريخ الميلاد غير محدد' : 'Birthdate not set'}</div>
                                            )
                                        )}
                                    </div>
                                    {/* Added Pencil Icon for Birthdate if value exists */}
                                    {!readonly && basicInfo.birthDate.year && (
                                        <button 
                                            onClick={() => { setTempBirthDate(basicInfo.birthDate); setEditingBasic('birthDate'); }}
                                            className="p-2 text-gray-500 hover:bg-gray-200 rounded-full transition"
                                        >
                                            <Pen className="w-5 h-5" />
                                        </button>
                                    )}
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Languages */}
                    <div className="mb-4 group">
                        {editingBasic === 'languages' ? (
                            <div className="bg-gray-50 p-3 rounded-lg border border-gray-200">
                                <label className="text-xs text-gray-500 mb-1 block">{t.basic_lang}</label>
                                <div className="flex flex-wrap gap-2 mb-2">
                                    {tempLanguages.value.map(lang => (
                                        <span key={lang} className="bg-white border px-2 py-1 rounded text-sm flex items-center gap-1">
                                            {translateItem(lang, 'languages_list')}
                                            <X className="w-3 h-3 cursor-pointer text-red-500" onClick={() => setTempLanguages({...tempLanguages, value: tempLanguages.value.filter(l => l !== lang)})} />
                                        </span>
                                    ))}
                                </div>
                                <select 
                                    className="w-full border p-2 rounded mb-2 text-sm bg-white" 
                                    onChange={(e) => {
                                        if (e.target.value && !tempLanguages.value.includes(e.target.value)) {
                                            setTempLanguages({...tempLanguages, value: [...tempLanguages.value, e.target.value]})
                                        }
                                    }}
                                    value=""
                                >
                                    <option value="">{t.empty_lang}...</option>
                                    {LANGUAGES_LIST.map(l => <option key={l} value={l}>{translateItem(l, 'languages_list')}</option>)}
                                </select>
                                <div className="flex justify-between items-center">
                                    <PrivacySelect value={tempLanguages.privacy} onChange={(val) => setTempLanguages({...tempLanguages, privacy: val})} small />
                                    <div className="flex gap-2">
                                        <button onClick={() => setEditingBasic(null)} className="text-xs font-semibold px-2 py-1 bg-gray-200 rounded">{t.btn_cancel}</button>
                                        <button onClick={() => handleSaveBasic('languages')} className="text-xs font-semibold px-2 py-1 bg-emerald-700 text-white rounded hover:bg-blue-700">{t.btn_save}</button>
                                    </div>
                                </div>
                            </div>
                        ) : (
                            <div className="flex items-center gap-3 relative">
                                <Languages className="w-5 h-5 text-fb-blue" />
                                <div className="flex-1 flex items-center justify-between">
                                    <div className="flex flex-col">
                                        {basicInfo.languages.value.length > 0 ? (
                                            <>
                                                <div className="text-[16px] text-fb-blue font-medium">
                                                    {basicInfo.languages.value.map(l => translateItem(l, 'languages_list')).join('، ')}
                                                </div>
                                                <div className="text-xs text-fb-blue font-medium flex items-center gap-1">{t.basic_lang} <span aria-hidden="true">·</span> <PrivacyIcon type={basicInfo.languages.privacy} /></div>
                                            </>
                                        ) : (
                                            !readonly ? (
                                                <button 
                                                    onClick={() => { setTempLanguages(basicInfo.languages); setEditingBasic('languages'); }}
                                                    className="text-[16px] text-fb-blue font-medium hover:underline"
                                                >
                                                    {t.empty_lang}
                                                </button>
                                            ) : (
                                                <div className="text-[16px] text-gray-400 italic">{t.no_lang}</div>
                                            )
                                        )}
                                    </div>
                                    {/* Added Pencil Icon for Languages if value exists */}
                                    {!readonly && basicInfo.languages.value.length > 0 && (
                                        <button 
                                            onClick={() => { setTempLanguages(basicInfo.languages); setEditingBasic('languages'); }}
                                            className="p-2 text-gray-500 hover:bg-gray-200 rounded-full transition"
                                        >
                                            <Pen className="w-5 h-5" />
                                        </button>
                                    )}
                                </div>
                            </div>
                        )}
                    </div>

                </div>
            </div>
        );
      case 'family':
          return (
              <div className="space-y-8 animate-fadeIn">
                  {/* Relationship Status Section */}
                  <div>
                      <h4 className="font-bold text-[21px] mb-4 text-gray-900">{t.about_family}</h4>
                      
                      {editingRelationship ? (
                          <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                              <label className="block text-sm font-medium text-gray-700 mb-1">{t.relationship_status}</label>
                              <select 
                                  className="w-full border p-2 rounded mb-3 text-sm bg-white"
                                  value={tempRelationship.status}
                                  onChange={(e) => setTempRelationship({...tempRelationship, status: e.target.value, partner: '', year: '', month: '', day: ''})}
                              >
                                  <option value="">{t['placeholders_select_option'] || (language === 'ar' ? 'اختر الحالة...' : 'Select Status...')}</option>
                                  {RELATIONSHIP_STATUS_OPTIONS.map(s => <option key={s} value={s}>{translateItem(s, 'relationship_statuses')}</option>)}
                              </select>

                              {PARTNER_REQUIRED_STATUSES.includes(tempRelationship.status) && (
                                  <>
                                      <div className="mb-3">
                                          <label className="block text-sm font-medium text-gray-700 mb-1">{t.partner}</label>
                                          <select 
                                              className="w-full border p-2 rounded text-sm bg-white"
                                              value={tempRelationship.partner}
                                              onChange={(e) => setTempRelationship({...tempRelationship, partner: e.target.value})}
                                          >
                                              <option value="">{language === 'ar' ? 'اختر من الأصدقاء...' : 'Choose from friends...'}</option>
                                              {MOCK_FRIENDS_LIST.map(f => <option key={f} value={f}>{f}</option>)}
                                          </select>
                                      </div>
                                      <div className="mb-3">
                                          <label className="block text-sm font-medium text-gray-700 mb-1">{t.date} ({language === 'ar' ? 'اختياري' : 'Optional'})</label>
                                          <div className="flex gap-2">
                                              <select 
                                                  className="w-1/4 border p-2 rounded text-sm bg-white"
                                                  value={tempRelationship.day || ''}
                                                  onChange={(e) => setTempRelationship({...tempRelationship, day: e.target.value})}
                                              >
                                                  <option value="">{language === 'ar' ? 'اليوم' : 'Day'}</option>
                                                  {DAYS.map(d => <option key={d} value={d}>{d}</option>)}
                                              </select>
                                              <select 
                                                  className="w-1/3 border p-2 rounded text-sm bg-white"
                                                  value={tempRelationship.month || ''}
                                                  onChange={(e) => setTempRelationship({...tempRelationship, month: e.target.value})}
                                              >
                                                  <option value="">{language === 'ar' ? 'الشهر' : 'Month'}</option>
                                                  {MONTHS.map(m => <option key={m} value={m}>{translateItem(m, 'months')}</option>)}
                                              </select>
                                              <select 
                                                  className="flex-1 border p-2 rounded text-sm bg-white"
                                                  value={tempRelationship.year || ''}
                                                  onChange={(e) => setTempRelationship({...tempRelationship, year: e.target.value})}
                                              >
                                                  <option value="">{language === 'ar' ? 'السنة' : 'Year'}</option>
                                                  {YEARS.map(y => <option key={y} value={y}>{y}</option>)}
                                              </select>
                                          </div>
                                      </div>
                                  </>
                              )}

                              <div className="flex justify-between items-center pt-2 border-t border-gray-200 mt-3">
                                  <PrivacySelect value={tempRelationship.privacy} onChange={(val) => setTempRelationship({...tempRelationship, privacy: val})} />
                                  <div className="flex gap-2">
                                      {/* Added Delete Button for Relationship */}
                                      {relationship.status && (
                                          <button onClick={handleDeleteRelationship} className="px-3 py-1.5 text-red-600 hover:bg-red-50 rounded-md text-sm font-semibold flex items-center gap-1">
                                              <Trash2 className="w-4 h-4" /> {t.btn_delete}
                                          </button>
                                      )}
                                      <button onClick={() => setEditingRelationship(false)} className="px-3 py-1.5 text-gray-600 hover:bg-gray-200 rounded-md text-sm font-semibold">{t.btn_cancel}</button>
                                      <button onClick={handleSaveRelationship} className="px-4 py-1.5 bg-emerald-700 text-white rounded-md text-sm font-semibold hover:bg-blue-700">{t.btn_save}</button>
                                  </div>
                              </div>
                          </div>
                      ) : (
                          <div className="flex items-center gap-3 group relative mb-4">
                              <Heart className="w-6 h-6 text-fb-blue" />
                              <div className="flex-1 flex items-center justify-between">
                                  <div className="flex flex-col">
                                    {relationship.status ? (
                                        <>
                                            <div className="text-[16px] text-fb-blue font-medium">
                                                {translateItem(relationship.status, 'relationship_statuses')} 
                                                {relationship.partner && <span className={`${!readonly ? 'text-fb-blue' : 'text-gray-900'} font-normal`}> {dir === 'rtl' ? 'مع' : 'with'} <span className="font-medium text-fb-blue text-[16px]">{relationship.partner}</span></span>}
                                            </div>
                                            <div className="text-xs text-fb-blue font-medium flex items-center gap-1">
                                                {relationship.year && (
                                                    <span>
                                                        {dir === 'rtl' ? 'منذ' : 'since'} {relationship.day ? `${relationship.day} ` : ''}
                                                        {relationship.month ? `${translateItem(relationship.month, 'months')} ` : ''}
                                                        {relationship.year}
                                                    </span>
                                                )}
                                                {relationship.year && <span aria-hidden="true">·</span>}
                                                <PrivacyIcon type={relationship.privacy} />
                                            </div>
                                        </>
                                    ) : (
                                        !readonly ? (
                                            <button 
                                                onClick={() => { setTempRelationship(relationship); setEditingRelationship(true); }} 
                                                className="text-[16px] text-fb-blue font-medium hover:underline"
                                            >
                                                {t.empty_rel}
                                            </button>
                                        ) : (
                                            <div className="text-[16px] text-gray-400 italic">{language === 'ar' ? 'لا توجد حالة اجتماعية' : 'No relationship status'}</div>
                                        )
                                    )}
                                  </div>
                                  {/* Added Pencil Icon for Relationship if status exists */}
                                  {!readonly && relationship.status && (
                                      <button 
                                          onClick={() => { setTempRelationship(relationship); setEditingRelationship(true); }} 
                                          className="p-2 text-gray-500 hover:bg-gray-200 rounded-full transition"
                                      >
                                          <Pen className="w-5 h-5" />
                                      </button>
                                  )}
                              </div>
                          </div>
                      )}
                  </div>

                  <div className="border-t border-gray-200"></div>

                  {/* Family Members Section */}
                  <div>
                      <h4 className="font-bold text-[21px] mb-4 text-gray-900">{t.family_members}</h4>
                      
                      {familyMembers.map((member) => (
                          <div key={member.id} className="flex items-start gap-4 mb-4 group relative">
                              <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center flex-shrink-0">
                                  <UserIcon className="w-5 h-5 text-fb-blue" />
                              </div>
                              <div className="flex-1">
                                  <div className="text-[16px] font-medium text-fb-blue">{member.name}</div>
                                  <div className="text-fb-blue font-medium text-[15px] flex items-center gap-2">
                                      {translateItem(member.relation, 'family_relations')}
                                      <span aria-hidden="true">·</span>
                                      <PrivacyIcon type={member.privacy} />
                                  </div>
                              </div>
                              {!readonly && (
                                  <button 
                                      onClick={() => handleEditFamily(member)}
                                      className="p-2 text-gray-500 hover:bg-gray-200 rounded-full transition"
                                  >
                                      <Pen className="w-5 h-5" />
                                  </button>
                              )}
                          </div>
                      ))}

                      {!readonly && (!showFamilyForm ? (
                          <button 
                              onClick={() => {
                                  setNewFamilyMember({ name: '', relation: '', privacy: 'public' });
                                  setEditingFamilyId(null);
                                  setShowFamilyForm(true);
                              }}
                              className="flex items-center gap-2 text-fb-blue hover:underline text-[16px] font-medium mt-2"
                          >
                              <Plus className="w-6 h-6 rounded-full bg-blue-50 p-1" />
                              <span>{t.empty_family}</span>
                          </button>
                      ) : (
                          <div className="bg-gray-50 p-4 rounded-lg border border-gray-200 mt-4 fade-in">
                              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-3">
                                  <div className="md:col-span-2">
                                      <label className="block text-sm font-medium text-gray-700 mb-1">{t.family_member || (language === 'ar' ? 'فرد العائلة' : 'Family Member')}</label>
                                      <select 
                                          className="w-full border p-2 rounded text-sm bg-white"
                                          value={newFamilyMember.name}
                                          onChange={(e) => setNewFamilyMember({...newFamilyMember, name: e.target.value})}
                                      >
                                          <option value="">{language === 'ar' ? 'اختر من الأصدقاء...' : 'Choose from friends...'}</option>
                                          {MOCK_FRIENDS_LIST.map(f => <option key={f} value={f}>{f}</option>)}
                                      </select>
                                  </div>
                                  <div className="md:col-span-2">
                                      <label className="block text-sm font-medium text-gray-700 mb-1">{t.relation}</label>
                                      <select 
                                          className="w-full border p-2 rounded text-sm bg-white"
                                          value={newFamilyMember.relation}
                                          onChange={(e) => setNewFamilyMember({...newFamilyMember, relation: e.target.value})}
                                      >
                                          <option value="">{language === 'ar' ? 'اختر صلة القرابة...' : 'Select Relation...'}</option>
                                          {FAMILY_RELATIONS_OPTIONS.map(r => <option key={r} value={r}>{translateItem(r, 'family_relations')}</option>)}
                                      </select>
                                  </div>
                              </div>

                              <div className="flex justify-between items-center pt-2 border-t border-gray-200 mt-2">
                                  <PrivacySelect value={newFamilyMember.privacy} onChange={(val) => setNewFamilyMember({...newFamilyMember, privacy: val})} />
                                  <div className="flex gap-2">
                                      {editingFamilyId && (
                                          <button onClick={() => { deleteItem('family', editingFamilyId); setShowFamilyForm(false); setEditingFamilyId(null); }} className="text-xs font-semibold px-2 py-1 text-red-500 hover:bg-red-50 rounded">
                                              {t.btn_delete}
                                          </button>
                                      )}
                                      <button onClick={() => setShowFamilyForm(false)} className="px-3 py-1.5 text-gray-600 hover:bg-gray-200 rounded-md text-sm font-semibold">{t.btn_cancel}</button>
                                      <button onClick={handleSaveFamilyMember} disabled={!newFamilyMember.name || !newFamilyMember.relation} className="px-4 py-1.5 bg-emerald-700 text-white rounded-md text-sm font-semibold hover:bg-blue-700 disabled:opacity-50">{t.btn_save}</button>
                                  </div>
                              </div>
                          </div>
                      ))}
                  </div>
              </div>
          );
      case 'details':
          return (
              <div className="space-y-8 animate-fadeIn">
                  {/* Bio */}
                  <div>
                      <h4 className="font-bold text-[21px] mb-4 text-gray-900">{t.about_details}</h4>
                      {editingBio ? (
                          <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                              <textarea 
                                  className="w-full border p-2 rounded mb-2 text-sm h-24 resize-none focus:ring-2 focus:ring-fb-blue focus:border-transparent outline-none"
                                  placeholder={t.ph_desc_self}
                                  value={tempBio.text}
                                  onChange={(e) => setTempBio({...tempBio, text: e.target.value})}
                              />
                              <div className="flex justify-between items-center border-t border-gray-200 pt-2 mt-2">
                                  <PrivacySelect value={tempBio.privacy} onChange={(val) => setTempBio({...tempBio, privacy: val})} />
                                  <div className="flex gap-2">
                                      {/* Added Delete Button for Bio - clears it */}
                                      {bio.text && (
                                          <button onClick={() => { setBio({text:'', privacy: 'public'}); setEditingBio(false); }} className="text-xs font-semibold px-2 py-1 text-red-600 hover:bg-red-50 rounded flex items-center gap-1">
                                              <Trash2 className="w-3 h-3" /> {t.btn_delete}
                                          </button>
                                      )}
                                      <button onClick={() => setEditingBio(false)} className="px-3 py-1.5 text-gray-600 hover:bg-gray-200 rounded-md text-sm font-semibold">{t.btn_cancel}</button>
                                      <button onClick={handleSaveBio} className="px-4 py-1.5 bg-emerald-700 text-white rounded-md text-sm font-semibold hover:bg-blue-700">{t.btn_save}</button>
                                  </div>
                              </div>
                          </div>
                      ) : (
                          <div className="flex items-start gap-3 group relative mb-4">
                              <div className="text-center w-full">
                                {bio.text ? (
                                    <div className="text-[16px] text-fb-blue font-medium text-center mb-1">
                                        {bio.text}
                                    </div>
                                ) : (
                                    !readonly && (
                                        <button onClick={() => { setTempBio(bio); setEditingBio(true); }} className="text-fb-blue hover:underline font-medium text-[16px]">
                                            {t.empty_bio}
                                        </button>
                                    )
                                )}
                                {!readonly && bio.text && (
                                    <div className="flex justify-center items-center gap-1">
                                        <PrivacyIcon type={bio.privacy} />
                                        <button onClick={() => { setTempBio(bio); setEditingBio(true); }} className="text-xs text-fb-blue hover:underline">{t.btn_edit}</button>
                                    </div>
                                )}
                              </div>
                          </div>
                      )}
                  </div>

                  <div className="border-t border-gray-200"></div>

                  {/* Name Pronunciation */}
                  <div>
                      <h4 className="font-bold text-[21px] mb-2 text-gray-900">{t.details_pronounce}</h4>
                      {editingPronunciation ? (
                         <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                             <label className="text-xs text-gray-500 mb-1 block">{t.ph_pronounce || (language === 'ar' ? 'كيف ينطق اسمك؟' : 'How do you pronounce your name?')}</label>
                             <input 
                                  type="text"
                                  className="w-full border p-2 rounded mb-2 text-sm"
                                  placeholder={t.ph_pronounce}
                                  value={tempPronunciation}
                                  onChange={(e) => setTempPronunciation(e.target.value)}
                             />
                             <div className="flex justify-between items-center border-t border-gray-200 pt-2 mt-2">
                                  <PrivacySelect 
                                    value={pronunciation.privacy} 
                                    onChange={(val) => setPronunciation({...pronunciation, privacy: val})} 
                                    small
                                  />
                                  <div className="flex gap-2">
                                      {/* Added Delete Button for Pronunciation */}
                                      {pronunciation.text && (
                                          <button onClick={handleDeletePronunciation} className="px-3 py-1.5 text-red-600 hover:bg-red-50 rounded-md text-sm font-semibold flex items-center gap-1">
                                              <Trash2 className="w-3 h-3" /> {t.btn_delete}
                                          </button>
                                      )}
                                      <button onClick={() => setEditingPronunciation(false)} className="px-3 py-1.5 text-gray-600 hover:bg-gray-200 rounded-md text-sm font-semibold">{t.btn_cancel}</button>
                                      <button onClick={handleSavePronunciation} className="px-4 py-1.5 bg-emerald-700 text-white rounded-md text-sm font-semibold hover:bg-blue-700">{t.btn_save}</button>
                                  </div>
                             </div>
                         </div>
                      ) : (
                         <div className="mb-4">
                             {pronunciation.text ? (
                                 <div className="flex items-center gap-3 group relative">
                                    <Mic className="w-6 h-6 text-fb-blue" />
                                    <div className="flex-1 flex items-center justify-between">
                                        <div className="flex flex-col">
                                            <div className="text-[16px] text-fb-blue font-medium">{pronunciation.text}</div>
                                            <div className="text-xs text-fb-blue font-medium flex items-center gap-1">{t.details_pronounce} <span aria-hidden="true">·</span> <PrivacyIcon type={pronunciation.privacy} /></div>
                                        </div>
                                        {/* Visible Pencil Icon for Pronunciation */}
                                        {!readonly && <button onClick={() => { setTempPronunciation(pronunciation.text); setEditingPronunciation(true); }} className="p-2 text-gray-500 hover:bg-gray-100 rounded-full"><Pen className="w-5 h-5" /></button>}
                                    </div>
                                 </div>
                             ) : (
                                 !readonly && (
                                     <button onClick={() => setEditingPronunciation(true)} className="flex items-center gap-2 text-fb-blue hover:underline text-[16px] font-medium">
                                         <Plus className="w-6 h-6 rounded-full bg-blue-50 p-1" />
                                         <span>{t.empty_pronounce}</span>
                                     </button>
                                 )
                             )}
                         </div>
                      )}
                  </div>
                  
                  <div className="border-t border-gray-200"></div>

                  {/* Other Names */}
                  <div>
                      <h4 className="font-bold text-[21px] mb-4 text-gray-900">{t.other_names || (language === 'ar' ? 'أسماء أخرى' : 'Other Names')}</h4>
                      
                      {otherNames.map(name => (
                          <div key={name.id} className="flex items-center gap-3 mb-3 group relative">
                              <PenLine className="w-6 h-6 text-fb-blue" />
                              <div className="flex-1">
                                  <div className="text-[16px] text-fb-blue font-medium">{name.name}</div>
                                  <div className="text-xs text-fb-blue font-medium flex items-center gap-1">{translateItem(name.type, 'name_types')} <span aria-hidden="true">·</span> <PrivacyIcon type={name.privacy} /></div>
                              </div>
                              {!readonly && <button onClick={() => handleEditOtherName(name)} className="p-2 text-gray-500 hover:bg-gray-100 rounded-full"><Pen className="w-4 h-4" /></button>}
                          </div>
                      ))}

                      {showOtherNameForm ? (
                          <div className="bg-gray-50 p-4 rounded-lg border border-gray-200 mt-2 fade-in">
                              <div className="mb-3">
                                  <label className="text-xs text-gray-500 mb-1 block">{t.name_type}</label>
                                  <select 
                                      className="w-full border p-2 rounded text-sm bg-white"
                                      value={newOtherName.type}
                                      onChange={(e) => setNewOtherName({...newOtherName, type: e.target.value})}
                                  >
                                      {OTHER_NAME_TYPES.map(t => <option key={t} value={t}>{translateItem(t, 'name_types')}</option>)}
                                  </select>
                              </div>
                              <div className="mb-3">
                                  <label className="text-xs text-gray-500 mb-1 block">{t.name_label}</label>
                                  <input 
                                      type="text" 
                                      className="w-full border p-2 rounded text-sm"
                                      value={newOtherName.name}
                                      onChange={(e) => setNewOtherName({...newOtherName, name: e.target.value})}
                                  />
                              </div>
                              <div className="flex items-center justify-between pt-2 border-t border-gray-200 mt-2">
                                  <PrivacySelect value={newOtherName.privacy} onChange={(val) => setNewOtherName({...newOtherName, privacy: val})} />
                                  <div className="flex gap-2">
                                      {editingOtherNameId && (
                                          <button onClick={() => { deleteItem('otherName', editingOtherNameId); setShowOtherNameForm(false); setEditingOtherNameId(null); }} className="text-xs font-semibold px-2 py-1 text-red-500 hover:bg-red-50 rounded">{t.btn_delete}</button>
                                      )}
                                      <button onClick={() => setShowOtherNameForm(false)} className="px-3 py-1.5 text-gray-600 hover:bg-gray-200 rounded-md text-sm font-semibold">{t.btn_cancel}</button>
                                      <button onClick={handleSaveOtherName} disabled={!newOtherName.name} className="px-4 py-1.5 bg-emerald-700 text-white rounded-md text-sm font-semibold hover:bg-blue-700 disabled:opacity-50">{t.btn_save}</button>
                                  </div>
                              </div>
                          </div>
                      ) : (
                          !readonly && (
                              <button onClick={() => { setNewOtherName({ name: '', type: 'اسم الشهرة', privacy: 'public' }); setEditingOtherNameId(null); setShowOtherNameForm(true); }} className="flex items-center gap-2 text-fb-blue hover:underline text-[16px] font-medium">
                                   <Plus className="w-6 h-6 rounded-full bg-blue-50 p-1" />
                                   <span>{t.empty_other_name}</span>
                              </button>
                          )
                      )}
                  </div>

                  <div className="border-t border-gray-200"></div>

                  {/* Favorite Quotes */}
                  <div>
                      <h4 className="font-bold text-[21px] mb-4 text-gray-900">{t.details_quotes}</h4>
                       {editingQuotes ? (
                          <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                              <textarea 
                                  className="w-full border p-2 rounded mb-2 text-sm h-24 resize-none focus:ring-2 focus:ring-fb-blue focus:border-transparent outline-none"
                                  placeholder={t.ph_quote}
                                  value={tempQuotes.text}
                                  onChange={(e) => setTempQuotes({...tempQuotes, text: e.target.value})}
                              />
                              <div className="flex justify-between items-center border-t border-gray-200 pt-2 mt-2">
                                  <PrivacySelect value={tempQuotes.privacy} onChange={(val) => setTempQuotes({...tempQuotes, privacy: val})} />
                                  <div className="flex gap-2">
                                      {/* Added Delete Button for Quotes */}
                                      {quotes.text && (
                                          <button onClick={handleDeleteQuotes} className="text-xs font-semibold px-2 py-1 text-red-600 hover:bg-red-50 rounded flex items-center gap-1">
                                              <Trash2 className="w-3 h-3" /> {t.btn_delete}
                                          </button>
                                      )}
                                      <button onClick={() => setEditingQuotes(false)} className="px-3 py-1.5 text-gray-600 hover:bg-gray-200 rounded-md text-sm font-semibold">{t.btn_cancel}</button>
                                      <button onClick={handleSaveQuotes} className="px-4 py-1.5 bg-emerald-700 text-white rounded-md text-sm font-semibold hover:bg-blue-700">{t.btn_save}</button>
                                  </div>
                              </div>
                          </div>
                       ) : (
                           <div className="mb-4">
                               {quotes.text ? (
                                   <div className="group relative flex items-center justify-between">
                                       <div>
                                            <div className="text-[16px] text-fb-blue font-medium italic font-serif border-r-4 border-gray-300 pr-3 py-1">
                                                "{quotes.text}"
                                            </div>
                                            <div className="text-xs text-fb-blue font-medium flex items-center gap-1 mt-1 pr-3">
                                                    <PrivacyIcon type={quotes.privacy} />
                                            </div>
                                       </div>
                                       {/* Visible Pencil Icon for Quotes */}
                                       {!readonly && <button onClick={() => { setTempQuotes(quotes); setEditingQuotes(true); }} className="p-2 text-gray-500 hover:bg-gray-100 rounded-full"><Pen className="w-5 h-5" /></button>}
                                   </div>
                               ) : (
                                   !readonly && (
                                       <button onClick={() => { setTempQuotes(quotes); setEditingQuotes(true); }} className="flex items-center gap-2 text-fb-blue hover:underline text-[16px] font-medium">
                                           <Plus className="w-6 h-6 rounded-full bg-blue-50 p-1" />
                                           <span>{t.empty_quotes}</span>
                                       </button>
                                   )
                               )}
                           </div>
                       )}
                  </div>

                  <div className="border-t border-gray-200"></div>

                  {/* Blood Donation */}
                  <div>
                      <h4 className="font-bold text-[21px] mb-4 text-gray-900">{t.details_blood}</h4>
                      <div className="flex items-center gap-4 bg-red-50 p-3 rounded-lg border border-red-100">
                          <div className="bg-red-500 rounded-full p-2">
                              <div className="bg-red-500 rounded-full p-2">
                                  <Droplet className="w-6 h-6 text-white" />
                              </div>
                          </div>
                          <div className="flex-1">
                              <div className="font-semibold text-gray-900">{language === 'ar' ? 'تعرف على التبرع بالدم' : 'Learn about blood donation'}</div>
                              <div className="text-xs text-gray-500">{language === 'ar' ? 'يمكنك المساعدة في إنقاذ الأرواح من خلال التبرع بالدم.' : 'You can help save lives by donating blood.'}</div>
                          </div>
                          <button className="text-sm bg-white border border-gray-300 px-3 py-1.5 rounded-md font-semibold hover:bg-gray-50 transition">
                              {t.btn_view_more}
                          </button>
                      </div>
                  </div>

              </div>
          );
      case 'events':
          return (
              <div className="space-y-8 animate-fadeIn">
                  <div>
                      <h4 className="font-bold text-[21px] mb-4 text-gray-900">{t.about_events}</h4>
                      
                      {lifeEvents.map((event) => (
                          <div key={event.id} className="flex items-start gap-4 mb-4 group relative">
                              <div className="w-10 h-10 bg-blue-50 rounded-full flex items-center justify-center flex-shrink-0">
                                  <Star className="w-5 h-5 text-fb-blue" />
                              </div>
                              <div className="flex-1">
                                  <div className="text-[16px] font-medium text-fb-blue">{event.title}</div>
                                  <div className="text-sm text-fb-blue font-medium">{event.location} • {event.year}</div>
                                  {event.description && <div className="text-sm text-fb-blue font-medium mt-1">{event.description}</div>}
                                  <div className="text-xs text-gray-400 mt-1 flex items-center gap-1">
                                    <PrivacyIcon type={event.privacy} />
                                  </div>
                              </div>
                              {!readonly && (
                                  <button 
                                      onClick={() => handleEditEvent(event)}
                                      className="p-2 text-gray-500 hover:bg-gray-200 rounded-full transition"
                                  >
                                      <Pen className="w-4 h-4" />
                                  </button>
                              )}
                          </div>
                      ))}

                      {!readonly && (!showEventForm ? (
                          <button 
                              onClick={() => {
                                  setNewEvent({ title: '', location: '', description: '', year: '', privacy: 'public' });
                                  setEditingEventId(null);
                                  setShowEventForm(true);
                              }}
                              className="flex items-center gap-2 text-fb-blue hover:underline text-[16px] font-medium"
                          >
                              <Plus className="w-6 h-6 rounded-full bg-blue-50 p-1" />
                              <span>{t.empty_events}</span>
                          </button>
                      ) : (
                          <div className="bg-gray-50 p-4 rounded-lg border border-gray-200 mt-4 fade-in">
                              <div className="space-y-3">
                                  <div>
                                      <label className="block text-sm font-medium text-gray-700 mb-1">{t.profile_about_event_name || (language === 'ar' ? 'اسم المناسبة' : 'Event Name')}</label>
                                      <input 
                                          type="text" 
                                          className="w-full border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-lg p-2.5 text-sm focus:ring-2 focus:ring-fb-blue focus:border-transparent outline-none transition"
                                          placeholder={language === 'ar' ? 'مثال: التخرج، وظيفة جديدة...' : 'Ex: Graduation, New Job...'}
                                          value={newEvent.title}
                                          onChange={(e) => setNewEvent({...newEvent, title: e.target.value})}
                                      />
                                  </div>
                                  
                                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                      <div>
                                          <label className="block text-sm font-medium text-gray-700 mb-1">{t.profile_about_event_location || (language === 'ar' ? 'عنوان المناسبة' : 'Event Location')}</label>
                                          <input 
                                              type="text" 
                                              className="w-full border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-lg p-2.5 text-sm focus:ring-2 focus:ring-fb-blue focus:border-transparent outline-none transition"
                                              placeholder={language === 'ar' ? 'المدينة أو المكان' : 'City or Place'}
                                              value={newEvent.location}
                                              onChange={(e) => setNewEvent({...newEvent, location: e.target.value})}
                                          />
                                      </div>
                                      <div>
                                          <label className="block text-sm font-medium text-gray-700 mb-1">{language === 'ar' ? 'سنة المناسبة' : 'Event Year'}</label>
                                          <select 
                                              className="w-full border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-lg p-2.5 text-sm focus:ring-2 focus:ring-fb-blue focus:border-transparent outline-none transition bg-white"
                                              value={newEvent.year}
                                              onChange={(e) => setNewEvent({...newEvent, year: e.target.value})}
                                          >
                                              <option value="">{t['placeholders_select_option'] || (language === 'ar' ? 'اختر السنة...' : 'Select Year...')}</option>
                                              {YEARS.map(y => <option key={y} value={y}>{y}</option>)}
                                          </select>
                                      </div>
                                  </div>

                                  <div>
                                      <label className="block text-sm font-medium text-gray-700 mb-1">{t.description || (language === 'ar' ? 'الوصف' : 'Description')}</label>
                                      <textarea 
                                          className="w-full border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-lg p-2.5 text-sm outline-none focus:ring-2 focus:ring-fb-blue focus:border-transparent outline-none transition h-20 resize-none"
                                          placeholder={language === 'ar' ? 'أضف تفاصيل أكثر...' : 'Add more details...'}
                                          value={newEvent.description}
                                          onChange={(e) => setNewEvent({...newEvent, description: e.target.value})}
                                      />
                                  </div>

                                  <div className="flex items-center justify-between pt-2 border-t border-gray-200 mt-2">
                                      <PrivacySelect value={newEvent.privacy} onChange={(val) => setNewEvent({...newEvent, privacy: val})} />
                                      <div className="flex gap-2">
                                        {editingEventId && (
                                            <button onClick={() => { deleteItem('event', editingEventId); setShowEventForm(false); setEditingEventId(null); }} className="text-xs font-semibold px-2 py-1 text-red-500 hover:bg-red-50 rounded">
                                                {t.btn_delete}
                                            </button>
                                        )}
                                        <button onClick={() => setShowEventForm(false)} className="px-3 py-1.5 text-gray-600 hover:bg-gray-200 rounded-md text-sm font-semibold">{t.btn_cancel}</button>
                                        <button onClick={handleSaveEvent} disabled={!newEvent.title || !newEvent.year} className="px-4 py-1.5 bg-emerald-700 text-white rounded-md text-sm font-semibold hover:bg-blue-700 disabled:opacity-50">{t.btn_save}</button>
                                      </div>
                                  </div>
                              </div>
                          </div>
                      ))}
                  </div>
              </div>
          );
      default:
        return (
            <div className="flex flex-col items-center justify-center py-10 text-gray-500">
                <Info className="w-12 h-12 mb-2 text-gray-300" />
                <p>{t.no_details}</p>
            </div>
        );
    }
  };

  return (
    <div className="bg-white shadow-sm rounded-lg flex flex-col md:flex-row min-h-[500px]">
      {/* Sidebar (Right side in RTL) */}
      <div className="w-full md:w-1/3 border-b md:border-b-0 md:border-l border-gray-200 p-2">
        <h2 className="text-xl font-bold p-3 mb-2">{t.profile_about}</h2>
        <ul className="space-y-1">
          {sections.map((section) => (
            <li
              key={section.id}
              onClick={() => setActiveSection(section.id as SectionType)}
              className={`flex items-center justify-between p-2.5 rounded-lg cursor-pointer transition font-medium text-[15px] ${
                activeSection === section.id
                  ? 'bg-blue-50 text-fb-blue'
                  : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              <span>{section.label}</span>
              {activeSection === section.id && (
                  <div className="w-1 h-full bg-transparent"></div>
              )}
            </li>
          ))}
        </ul>
      </div>

      {/* Content Area */}
      <div className="flex-1 p-6 md:p-8 pb-40">
        {renderContent()}
      </div>
    </div>
  );
};

export default ProfileAbout;