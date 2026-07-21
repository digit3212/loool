import { 
  Store, Car, Smartphone, Laptop, Home, Sofa, Shirt, Baby, Dumbbell, 
  Gamepad2, Music, Book, PawPrint, Briefcase, Wrench, Palette, Bike, 
  Watch, Utensils 
} from 'lucide-react';
import { Product } from '../types';
import { TranslationSchema } from '../utils/translations';

// =============================================================================
// RAW CONFIGURATION (Source of Truth)
// Note: Keys here match the keys in translations.ts
// =============================================================================

export const CATEGORY_IDS = [
  { id: 'all', icon: Store },
  { id: 'vehicles', icon: Car },
  { id: 'electronics', icon: Smartphone },
  { id: 'computers', icon: Laptop },
  { id: 'property', icon: Home },
  { id: 'furniture', icon: Sofa },
  { id: 'apparel', icon: Shirt },
  { id: 'baby', icon: Baby },
  { id: 'sports', icon: Dumbbell },
  { id: 'entertainment', icon: Gamepad2 },
  { id: 'hobbies', icon: Music },
  { id: 'books', icon: Book },
  { id: 'pets', icon: PawPrint },
  { id: 'services', icon: Briefcase },
  { id: 'tools', icon: Wrench },
  { id: 'art', icon: Palette },
  { id: 'bikes', icon: Bike },
  { id: 'accessories', icon: Watch },
  { id: 'appliances', icon: Utensils },
] as const;

// Helper to dynamically get categories with translated names
export const getCategories = (t: TranslationSchema) => {
  return CATEGORY_IDS.map((cat) => ({
    ...cat,
    name: cat.id === 'all' 
      ? t.common.all 
      : (t.market.cats as any)[cat.id] || cat.id,
  }));
};

// Legacy export for backward compatibility
export const CATEGORIES = CATEGORY_IDS.map(cat => ({
  ...cat,
  name: cat.id === 'all' ? 'الكل' : cat.id
}));

// =============================================================================
// COUNTRIES & CITIES CONFIGURATION
// =============================================================================

const RAW_COUNTRIES_DATA: Record<string, { cities: string[], currency: string, symbol: string }> = {
  "السعودية": {
    cities: [
      "الرياض", "جدة", "مكة المكرمة", "المدينة المنورة", "الدمام", "الخبر", "الظهران", "الجبيل", "الهفوف", 
      "المبرز", "الطائف", "تبوك", "بريدة", "عنيزة", "أبها", "خميس مشيط", "جازان", "نجران", "حائل", "عرعر", 
      "سكاكا", "الباحة", "ينبع", "حفر الباطن", "الخرج", "الثقبة", "القطيف", "الرس", "بيشة"
    ],
    currency: "SAR",
    symbol: "ر.س"
  },
  "مصر": {
    cities: [
      "القاهرة", "الجيزة", "الإسكندرية", "شبرا الخيمة", "بورسعيد", "السويس", "المحلة الكبرى", "الأقصر", 
      "المنصورة", "طنطا", "أسيوط", "الإسماعيلية", "الفيوم", "الزقازيق", "أسوان", "دمياط", "دمنهور", "المنيا", 
      "بني سويف", "قنا", "سوهاج", "الغردقة", "6 أكتوبر", "شبين الكوم", "بنها", "كفر الشيخ", "العريش", "ملوي", 
      "العشر من رمضان", "بلبيس", "مرسى مطروح", "إدفو", "ميت غمر", "الحوامدية", "دسوق", "قليوب", "أبو كبير", 
      "كفر الدوار", "جرجا", "أخميم", "المطرية"
    ],
    currency: "EGP",
    symbol: "ج.م"
  },
  "الإمارات": {
    cities: [
      "دبي", "أبو ظبي", "الشارقة", "العين", "عجمان", "رأس الخيمة", "الفجيرة", "أم القيوين", 
      "خورفكان", "كلباء", "جبل علي", "دبا الفجيرة", "مدينة زايد", "الرويس", "ليوا", "الذيد", "الغويفات"
    ],
    currency: "AED",
    symbol: "د.إ"
  },
  "الكويت": {
    cities: [
      "مدينة الكويت", "دسمان", "الشرق", "المرقاب", "جبلة", "الصالحية", "بنيد القار", "الدسمة", "الدعية", 
      "المنصورية", "ضاحية عبد الله السالم", "النزهة", "الفيحاء", "الشامية", "الروضة", "العديلية", "الخالدية", 
      "القادسية", "قرطبة", "السرة", "اليرموك", "الشويخ", "الري", "غرناطة", "الصليبيخات", "الدوحة", "حولي", 
      "الشعب", "السالمية", "الرميثية", "الجبيرية", "سلوى", "بيان", "مشرف", "السلام", "حطين", "الزهراء", 
      "الفروانية", "خيطان", "الأندلس", "اشبيلية", "جليب الشيوخ", "العمرية", "الرابية", "الرحاب", "الرقعي", 
      "الأحمدي", "الفحيحيل", "المنقف", "الصباحية", "الرقة", "هدية", "أبو حليفة", "الفنطاس", "العقيلة", "الجهراء"
    ],
    currency: "KWD",
    symbol: "د.ك"
  },
  "قطر": {
    cities: [
      "الدوحة", "الريان", "الوكرة", "الخور", "أم صلال", "الظعاين", "الشمال", "الشيحانية", 
      "مسيعيد", "لوسيل", "اللؤلؤة", "الخيسة", "روضة اقديم", "أبو هامور", "الوعب", "العزيزية", "عين خالد"
    ],
    currency: "QAR",
    symbol: "ر.ق"
  },
  "البحرين": {
    cities: [
      "المنامة", "المحرق", "الرفاع الغربي", "الرفاع الشرقي", "مدينة عيسى", "مدينة حمد", "مدينة زايد", 
      "سترة", "البديع", "جدحفص", "المالكية", "العدلية", "سنابس", "توبلي", "سار", "الدراز", "الحد", "عراد", "قلالي"
    ],
    currency: "BHD",
    symbol: "د.ب"
  },
  "عمان": {
    cities: [
      "مسقط", "السيب", "صلالة", "بوشر", "صحار", "السويق", "عبري", "صحم", "بركاء", "الرستاق", 
      "نزوى", "البريمي", "صور", "المضيبي", "المصنعة", "بني بو علي", "بهلا", "الخابورة", "شناص", "سمائل", "إزكي"
    ],
    currency: "OMR",
    symbol: "ر.ع"
  },
  "الأردن": {
    cities: [
      "عمان", "الزرقاء", "إربد", "الرصيفة", "القويسمة", "وادي السير", "تلاع العلي", "خريبة السوق", 
      "العقبة", "السلط", "الرمثا", "مادبا", "الجبيحة", "مخيم البقعة", "صويلح", "المفرق", "سحاب", 
      "مخيم حطين", "عين الباشا", "جرش", "معان", "الطفيلة", "الكرك"
    ],
    currency: "JOD",
    symbol: "د.أ"
  },
  "لبنان": {
    cities: [
      "بيروت", "طرابلس", "صيدا", "صور", "النبطية", "جونيه", "زحلة", "بعبدا", "عاليه", 
      "جبيل", "بعلبك", "البترون", "زغرتا", "بشري", "الشوف", "كسروان", "المتن", "المنية", "الضنية"
    ],
    currency: "LBP",
    symbol: "ل.ل"
  },
  "المغرب": {
    cities: [
      "الدار البيضاء", "الرباط", "فاس", "طنجة", "مراكش", "أكادير", "مكناس", "وجدة", "القنيطرة", 
      "تطوان", "آسفي", "تمارة", "العيون", "المحمدية", "الجديدة", "بني ملال", "تازة", "الناظور", 
      "سطات", "العرائش", "الخميسات", "تزنيت", "برشيد", "واد زم", "الفقيه بن صالح", "تاوريرت", 
      "بركان", "سيدي سليمان", "الرشيدية", "سيدي قاسم", "خنيفرة"
    ],
    currency: "MAD",
    symbol: "د.م"
  },
  "العراق": {
    cities: [
      "بغداد", "البصرة", "الموصل", "أربيل", "كركوك", "النجف", "كربلاء", "الناصرية", "العمارة", 
      "الديوانية", "الكوت", "الحلة", "الرمادي", "الفلوجة", "السليمانية", "دهوك", "زاخو", "سامراء", "بعقوبة"
    ],
    currency: "IQD",
    symbol: "ع.د"
  },
  "الجزائر": {
    cities: [
      "الجزائر", "وهران", "قسنطينة", "عنابة", "البليدة", "باتنة", "الجلفة", "سطيف", "سيدي بلعباس", 
      "بسكرة", "تبسة", "الوادي", "سكيكدة", "تيارت", "بجاية", "تلمسان", "ورقلة", "بشار", "مستغانم", "برج بوعريريج"
    ],
    currency: "DZD",
    symbol: "د.ج"
  },
  "تونس": {
    cities: [
      "تونس", "صفاقس", "سوسة", "التضامن", "القيروان", "قابس", "بنزرت", "أريانة", "قفصة", 
      "المروج", "المنستير", "بن عروس", "القصرين", "دوز", "جرجيس", "نابل", "تطاوين", "باجة"
    ],
    currency: "TND",
    symbol: "د.ت"
  }
};

/**
 * Dynamically generates country/city configuration based on the current language.
 * Maps Arabic keys to English if t.countries/t.cities are available.
 */
export const getCountriesConfig = (t: TranslationSchema) => {
  const config: Record<string, { cities: string[], currency: string, symbol: string }> = {};
  
  Object.entries(RAW_COUNTRIES_DATA).forEach(([arabicCountryName, data]) => {
    // Translate Country Name
    const translatedCountry = t.countries ? (t.countries[arabicCountryName] || arabicCountryName) : arabicCountryName;
    
    // Translate Cities
    const translatedCities = data.cities.map(city => 
      t.cities ? (t.cities[city] || city) : city
    );

    // Switch Currency Display based on direction (LTR = Code, RTL = Symbol)
    const displaySymbol = t.dir === 'ltr' ? data.currency : data.symbol;

    config[translatedCountry] = {
      ...data,
      cities: translatedCities,
      symbol: displaySymbol
    };
  });

  return config;
};

// Legacy export
export const COUNTRIES_CONFIG = RAW_COUNTRIES_DATA;

// =============================================================================
// MOCK DATA & CONDITIONS
// =============================================================================

export const INITIAL_PRODUCTS: Product[] = [
  {
    id: 'p1',
    title: 'ايفون 13 برو ماكس بحالة ممتازة',
    price: 3500,
    currency: 'ر.س',
    category: 'electronics',
    image: 'https://picsum.photos/600/600?random=801',
    location: 'الرياض',
    seller: { id: 'u1', name: 'خالد عمر', avatar: 'https://picsum.photos/50/50?random=10' },
    description: 'الجهاز نظيف جداً، بطارية 90%، مع كامل الملحقات والكرتون.',
    condition: 'used_good',
    date: 'منذ ساعتين',
    timestamp: Date.now() - 7200000,
    isSaved: false,
    comments: []
  },
  {
    id: 'p2',
    title: 'شقة للإيجار 3 غرف وصالة',
    price: 25000,
    currency: 'ر.س',
    category: 'property',
    image: 'https://picsum.photos/600/600?random=802',
    location: 'جدة',
    seller: { id: 'u2', name: 'مكتب عقار', avatar: 'https://picsum.photos/50/50?random=11' },
    description: 'شقة واسعة تشطيب ديلوكس، موقع مميز قريب من الخدمات.',
    condition: 'new',
    date: 'منذ يوم',
    timestamp: Date.now() - 86400000,
    isSaved: false,
    comments: [
        { id: 'c1', user: { id: 'u99', name: 'سارة', avatar: 'https://picsum.photos/50/50?random=99' }, text: 'هل السعر قابل للتفاوض؟', timestamp: 'منذ ساعة' }
    ]
  },
  {
    id: 'p3',
    title: 'سيارة تويوتا كامري 2020',
    price: 65000,
    currency: 'ر.س',
    category: 'vehicles',
    image: 'https://picsum.photos/600/600?random=803',
    location: 'الدمام',
    seller: { id: 'u3', name: 'أحمد علي', avatar: 'https://picsum.photos/50/50?random=12' },
    description: 'ممشى قليل، بودي وكالة، صيانة دورية بالوكالة.',
    condition: 'used_good',
    date: 'منذ 3 ساعات',
    timestamp: Date.now() - 10800000,
    isSaved: false,
    comments: []
  },
  {
    id: 'p4',
    title: 'بلايستيشن 5 مع يدين تحكم',
    price: 1800,
    currency: 'ر.س',
    category: 'entertainment',
    image: 'https://picsum.photos/600/600?random=804',
    location: 'الرياض',
    seller: { id: 'u4', name: 'سعد القحطاني', avatar: 'https://picsum.photos/50/50?random=13' },
    description: 'استخدام نظيف، نسخة الأقراص، مع لعبة فيفا 24.',
    condition: 'used_good',
    date: 'منذ 5 ساعات',
    timestamp: Date.now() - 18000000,
    isSaved: false,
    comments: []
  },
  {
    id: 'p7',
    title: 'لابتوب ماك بوك برو M1',
    price: 4500,
    currency: 'ر.س',
    category: 'computers',
    image: 'https://picsum.photos/600/600?random=807',
    location: 'الرياض',
    seller: { id: 'u7', name: 'متجر التقنية', avatar: 'https://picsum.photos/50/50?random=16' },
    description: 'رام 16، هارد 512، اللون رمادي فلكي، الكيبورد عربي انجليزي.',
    condition: 'used_good',
    date: 'منذ 4 ساعات',
    timestamp: Date.now() - 14400000,
    isSaved: false,
    comments: []
  }
];

// Helper to localize mock data products
export const getLocalizedProducts = (t: TranslationSchema) => {
  return INITIAL_PRODUCTS.map(p => ({
    ...p,
    location: t.cities && t.cities[p.location] ? t.cities[p.location] : p.location,
    currency: t.dir === 'ltr' && p.currency === 'ر.س' ? 'SAR' : p.currency
  }));
};

export const CONDITIONS = [
  { value: 'new', label: 'جديد' },
  { value: 'used_good', label: 'مستعمل - بحالة جيدة' },
  { value: 'used_fair', label: 'مستعمل - بحالة مقبولة' }
];

export const getConditions = (t: TranslationSchema) => [
  { value: 'new', label: t.market.new || 'New' },
  { value: 'used_good', label: t.market.used_good || 'Used - Good' },
  { value: 'used_fair', label: t.market.used_fair || 'Used - Fair' }
];

export const SORT_OPTIONS = [
  { value: 'newest', label: 'الأحدث' },
  { value: 'price_low', label: 'السعر: الأقل أولاً' },
  { value: 'price_high', label: 'السعر: الأعلى أولاً' }
];

export const getSortOptions = (t: TranslationSchema) => [
  { value: 'newest', label: t.market.newest || 'Newest' },
  { value: 'price_low', label: t.market.price_low || 'Price: Low to High' },
  { value: 'price_high', label: t.market.price_high || 'Price: High to Low' }
];