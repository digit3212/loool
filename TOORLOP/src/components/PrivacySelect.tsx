
import React, { useState, useRef, useEffect } from 'react';
import { Globe, Users, Lock, ChevronDown } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

export type PrivacyLevel = 'public' | 'friends' | 'friends_of_friends' | 'only_me';

interface PrivacySelectProps { 
  value: PrivacyLevel; 
  onChange: (val: PrivacyLevel) => void; 
  small?: boolean; 
}

const PrivacySelect: React.FC<PrivacySelectProps> = ({ value, onChange, small }) => {
  const { t } = useLanguage();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  
  const options: { val: PrivacyLevel; label: string; icon: React.ElementType }[] = [
    { val: 'public', label: t.dir === 'rtl' ? 'عام' : 'Public', icon: Globe },
    { val: 'friends', label: t.dir === 'rtl' ? 'الأصدقاء' : 'Friends', icon: Users },
    { val: 'friends_of_friends', label: t.dir === 'rtl' ? 'أصدقاءالأصدقاء' : 'Friends of friends', icon: Users },
    { val: 'only_me', label: t.dir === 'rtl' ? 'أنا فقط' : 'Only Me', icon: Lock },
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
      <button type="button" onClick={() => setIsOpen(!isOpen)} className={`flex items-center gap-2 bg-gray-100 hover:bg-gray-200 rounded-md transition font-medium text-gray-700 border border-gray-200 ${small ? 'px-2 py-1 text-xs' : 'px-3 py-1.5 text-sm'}`}>
        <Icon className={small ? "w-3 h-3" : "w-4 h-4"} /> <span>{selected.label}</span> <ChevronDown className={small ? "w-3 h-3" : "w-3 h-3"} />
      </button>
      {isOpen && (
        <div className="absolute right-0 z-20 mt-1 w-36 bg-white shadow-xl rounded-lg border border-gray-100 overflow-hidden animate-fadeIn">
          {options.map((opt) => (
            <div key={opt.val} onClick={() => { onChange(opt.val); setIsOpen(false); }} className={`flex items-center gap-2 px-3 py-2 cursor-pointer hover:bg-gray-100 text-sm ${value === opt.val ? 'bg-blue-50 text-fb-blue' : 'text-gray-700'}`}>
              <opt.icon className="w-4 h-4" /> <span>{opt.label}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default PrivacySelect;
