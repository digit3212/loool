import React, { createContext, useContext, useState, useEffect, ReactNode, useMemo } from 'react';
import { translations, Language, TranslationSchema } from '../utils/translations';

// --- Utility: Flatten Nested Object ---
// Converts { nav: { home: 'Home' } } -> { 'nav_home': 'Home' }
const flattenTranslations = (obj: any, prefix = ''): Record<string, string> => {
  return Object.keys(obj).reduce((acc: any, k) => {
    const pre = prefix.length ? prefix + '_' : '';
    if (typeof obj[k] === 'object' && obj[k] !== null && !Array.isArray(obj[k])) {
      Object.assign(acc, flattenTranslations(obj[k], pre + k));
    } else {
      acc[pre + k] = obj[k];
    }
    return acc;
  }, {});
};

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  // t combines the nested TranslationSchema and a flat record for legacy string keys
  t: TranslationSchema & Record<string, any>;
  dir: 'rtl' | 'ltr';
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  // 1. Initialize Language safely from LocalStorage
  const getInitialLanguage = (): Language => {
    try {
      if (typeof window !== 'undefined') {
        const savedLang = localStorage.getItem('tourloop_lang');
        // Validate if saved language exists in translations
        if (savedLang && Object.prototype.hasOwnProperty.call(translations, savedLang)) {
          return savedLang as Language;
        }
      }
    } catch (error) {
      console.warn('LanguageContext: Error reading localStorage', error);
    }
    // Fallback: Arabic if available, else first available
    return (Object.keys(translations).includes('ar') ? 'ar' : Object.keys(translations)[0]) as Language;
  };

  const [language, setLanguageState] = useState<Language>(getInitialLanguage);

  // 2. Language Setter with Persistence
  const setLanguage = (lang: Language) => {
    if (!translations[lang]) {
      console.error(`LanguageContext: Attempted to set unsupported language: ${lang}`);
      return;
    }
    setLanguageState(lang);
    try {
      localStorage.setItem('tourloop_lang', lang);
      
      // Apply direction to document immediately
      const dir = translations[lang].dir || 'ltr';
      document.documentElement.lang = lang;
      document.documentElement.dir = dir;
      document.body.dir = dir;
    } catch (error) {
      console.error('LanguageContext: Error saving to localStorage', error);
    }
  };

  // 3. Build Translation Map (Hybrid: Nested + Flattened + Aliases)
  const t = useMemo(() => {
    const currentTranslation = translations[language];
    if (!currentTranslation) return {} as any;

    // 1. Flatten for legacy support (e.g. t.nav_home)
    const flat = flattenTranslations(currentTranslation);
    
    // 2. Define explicit Aliases for backward compatibility
    const addText = flat['common_add'] || 'Add';
    const aliases: Record<string, string> = {
      // Navbar & Sidebar
      'menu_groups': flat['nav_groups'],
      'menu_events': flat['nav_events'],
      'menu_memories': flat['nav_memories'],
      'menu_saved': flat['nav_saved'],
      'menu_more': flat['common_more'],
      'menu_less': flat['common_less'] || flat['common_view_less'],
      'nav_gaming': flat['nav_gaming'],
      'nav_market': flat['nav_market'],
      'nav_watch': flat['nav_watch'],
      'nav_home': flat['nav_home'],
      'nav_friends': flat['nav_friends'],
      'nav_pages': flat['nav_pages'],
      'search_placeholder': flat['nav_search_placeholder'],
      'shortcuts': flat['sidebar_shortcuts'],
      'privacy_footer': flat['sidebar_privacy_footer'],

      // Post & Feed
      'create_post_placeholder': flat['post_create_placeholder'],
      'btn_live': flat['post_live_video'],
      'btn_photo': flat['post_photo_video'],
      'btn_feeling': flat['post_feeling_activity'],
      'btn_ai': flat['post_magic_ai'],
      'ai_thinking': flat['post_ai_thinking'],
      'btn_post': flat['post_publish'],
      'post_pinned': flat['post_pinned'],
      'btn_like': flat['post_like'],
      'btn_comment': flat['post_comment'],
      'btn_share': flat['common_share'],
      'btn_edit': flat['common_edit'],
      'write_comment': flat['post_write_comment'],
      'btn_save': flat['common_save'],
      'btn_cancel': flat['common_cancel'],
      'btn_delete': flat['common_delete'],
      'btn_add': flat['common_add'],
      'btn_view_more': flat['common_view_more'],
      'btn_tag': flat['post_tag_button'],
      'btn_location': flat['post_location_button'],

      // Profile Header
      'profile_is_friend': flat['profile_is_friend'],
      'profile_friend_request_sent': flat['profile_request_sent'],
      'profile_add_friend': flat['profile_add_friend'],
      'profile_edit_cover': flat['profile_edit_cover'],
      'profile_edit_profile': flat['profile_edit_profile'],
      'profile_add_story': flat['profile_add_story'],
      'profile_message': flat['profile_message'],
      'profile_posts': flat['profile_posts'],
      'profile_about': flat['profile_about'],
      'profile_friends': flat['profile_friends'],
      'profile_photos': flat['profile_photos'],
      'profile_videos': flat['profile_videos'],
      'profile_more': flat['profile_more'],
      'profile_groups': flat['profile_groups'],
      'profile_pages': flat['profile_pages'],
      'profile_events': flat['profile_events'],

      'profile_edit_details': flat['profile_edit_details'],
      'profile_add_hobbies': flat['profile_intro_add_hobbies'],
      'profile_edit_hobbies': flat['profile_intro_edit_hobbies'],
      'profile_add_featured': flat['profile_intro_add_featured'],
      'profile_edit_featured': flat['profile_intro_edit_featured'],
      'joined_recent': flat['profile_intro_joined_recent'],
      'joined_in': flat['profile_intro_joined_in'],
      'friend_count': flat['profile_friend_count'],
      'hobbies_modal_title': flat['profile_intro_hobbies_modal_title'],
      'hobbies_search': flat['profile_intro_hobbies_search'],
      'hobbies_suggested': flat['profile_intro_hobbies_suggested'],
      'featured_info': flat['profile_intro_featured_info'],

      'btn_view_all': flat['common_view_all'],
      'no_posts': flat['profile_no_posts'],
      'no_posts_desc': flat['profile_no_posts_desc'],

      // Privacy Dropdown Keys
      'privacy_public': flat['privacy_public'],
      'privacy_friends': flat['privacy_friends'],
      'privacy_friends_except': flat['privacy_friends_except'],
      'privacy_friends_of_friends': flat['privacy_friends_of_friends'],
      'privacy_only_me': flat['privacy_only_me'],
      'privacy_custom': flat['privacy_custom'],

      // Profile About Section
      'about_overview': flat['profile_about_overview'],
      'about_work_edu': flat['profile_about_work_edu'],
      'about_places': flat['profile_about_places'],
      'about_contact': flat['profile_about_contact_basic'],
      'about_family': flat['profile_about_family_rel'],
      'about_details': flat['profile_about_details'],
      'about_events': flat['profile_about_life_events'],
      
      'work_works_at': flat['profile_about_works_at'],
      'work_role_at': flat['profile_about_role_at'],
      'edu_studied': flat['profile_about_studied'],
      'edu_at': flat['profile_about_at'],
      'edu_school': flat['profile_about_went_to'],
      'edu_graduated': flat['profile_about_class_of'],
      
      'place_lives': flat['profile_about_lives_in'],
      'place_from': flat['profile_about_from'],
      'place_current': flat['profile_about_lives_in'],
      'place_hometown': flat['profile_about_from'],

      'contact_mobile': flat['profile_about_mobile'],
      'contact_email': flat['profile_about_email'],
      'contact_website': flat['profile_about_website'],
      
      'basic_gender': flat['profile_about_gender'],
      'basic_birth': flat['profile_about_birth_date'],
      'basic_lang': flat['profile_about_languages'],

      'details_pronounce': flat['profile_about_pronounce'],
      'details_quotes': flat['profile_about_quotes'],
      'details_blood': flat['profile_about_blood_donation'],
      'family_members': flat['profile_about_family_rel'],

      'no_details': flat['profile_about_no_details'],

      // Dynamic Empty States
      'empty_work': flat['profile_about_add_work'] || `${addText} Work`,
      'empty_uni': flat['profile_about_add_edu'] || `${addText} University`,
      'empty_school': flat['profile_about_add_edu'] || `${addText} School`,
      'empty_current_city': flat['profile_about_add_place'] || `${addText} Current City`,
      'empty_hometown': flat['profile_about_add_place'] || `${addText} Hometown`,
      'empty_mobile': flat['profile_about_add_mobile'] || `${addText} Mobile`,
      'empty_email': `${addText} ${flat['profile_about_email'] || 'Email'}`,
      'empty_website': `${addText} ${flat['profile_about_website'] || 'Website'}`,
      'empty_social': `${addText} ${flat['profile_about_platform'] || 'Social Link'}`,
      'empty_gender': `${addText} ${flat['profile_about_gender'] || 'Gender'}`,
      'empty_birth': `${addText} ${flat['profile_about_birth_date'] || 'Birth Date'}`,
      'empty_lang': `${addText} ${flat['profile_about_languages'] || 'Languages'}`,
      'empty_pronounce': `${addText} ${flat['profile_about_pronounce'] || 'Pronunciation'}`,
      'empty_other_name': `${addText} ${flat['profile_about_name_type'] || 'Other Name'}`,
      'empty_quotes': `${addText} ${flat['profile_about_quotes'] || 'Quotes'}`,
      'empty_events': `${addText} ${flat['profile_about_life_events'] || 'Life Event'}`,
      'empty_bio': flat['profile_about_add_bio'] || `${addText} Bio`,
      'empty_rel': `${addText} ${flat['profile_about_relationship_status'] || 'Relationship'}`,
      'empty_family': `${addText} ${flat['profile_about_family_member'] || 'Family Member'}`,

      // Placeholders
      'ph_position': flat['profile_about_ph_position'],
      'ph_company': flat['profile_about_ph_company'],
      'ph_university': flat['profile_about_ph_school'],
      'ph_school': flat['profile_about_ph_school'],
      'ph_city': flat['profile_about_ph_city'],
      'ph_desc_self': flat['profile_about_ph_desc_self'],
      'ph_quote': flat['profile_about_ph_quote'],
      
      // Gaming Shortcuts (Optional if flattened keys are used directly)
      'gaming_title': flat['gaming_title'],
      'gaming_play_now': flat['gaming_play_now']
    };

    // 3. Return Hybrid Object (Nested + Flat + Aliases)
    // This ensures t.gaming.title works AND t.btn_save works
    return { ...currentTranslation, ...flat, ...aliases };
  }, [language]);

  // 4. Direction & Document Attributes Sync (Initial Load)
  useEffect(() => {
    const currentTranslation = translations[language];
    if (currentTranslation) {
      const dir = currentTranslation.dir || 'ltr';
      document.documentElement.lang = language;
      document.documentElement.dir = dir;
      document.body.dir = dir;
    }
  }, [language]);

  // 5. Context Value
  const value = {
    language,
    setLanguage,
    t,
    dir: (translations[language]?.dir || 'ltr') as 'rtl' | 'ltr'
  };

  return (
    <LanguageContext.Provider value={value}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};