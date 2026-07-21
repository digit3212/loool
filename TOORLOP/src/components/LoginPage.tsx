import React, { useState, useRef, useEffect } from 'react';
import { 
  Mail, 
  Lock, 
  User, 
  ArrowRight, 
  Eye, 
  EyeOff, 
  Loader2, 
  CheckCircle, 
  Infinity, 
  Globe, 
  Facebook, 
  Shield, 
  AlertCircle, 
  ChevronRight, 
  X, 
  Phone, 
  Settings, 
  Moon, 
  Sun, 
  Check,
  ChevronLeft
} from 'lucide-react';
import { User as UserType } from '../types';
import { useLanguage } from '../context/LanguageContext';
import { useTheme } from '../context/ThemeContext';

interface LoginPageProps {
  onLogin: (user: UserType) => void;
}

const LoginPage: React.FC<LoginPageProps> = ({ onLogin }) => {
  const { language, setLanguage, dir, t } = useLanguage();
  const { theme, toggleTheme } = useTheme();
  const [isLogin, setIsLogin] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [isForgotPass, setIsForgotPass] = useState(false);
  
  // Settings Menu State
  const [showSettingsMenu, setShowSettingsMenu] = useState(false);
  const settingsRef = useRef<HTMLDivElement>(null);

  // Footer Modal State
  const [footerModal, setFooterModal] = useState<'privacy' | 'terms' | 'contact' | null>(null);
  
  // Advanced Social Login States
  const [socialLoading, setSocialLoading] = useState<'google' | 'facebook' | null>(null);
  const [socialStatus, setSocialStatus] = useState<string>('');

  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  // Form State
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  // Close settings menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
        if (settingsRef.current && !settingsRef.current.contains(event.target as Node)) {
            setShowSettingsMenu(false);
        }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Strict email validation regex
  const validateEmail = (email: string) => {
    return /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(email);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccessMsg(null);

    const cleanEmail = email.trim();
    const cleanPassword = password.trim();
    const cleanName = name.trim();

    // Text for validation based on language
    const t_req = language === 'ar' ? 'يرجى ملء جميع الحقول المطلوبة' : 'Please fill in all required fields';
    const t_email = language === 'ar' ? 'يرجى إدخال عنوان بريد إلكتروني صحيح' : 'Please enter a valid email address';
    const t_name = language === 'ar' ? 'يرجى إدخال اسمك الكامل' : 'Please enter your full name';
    const t_match = language === 'ar' ? 'كلمات المرور غير متطابقة' : 'Passwords do not match';
    const t_len = language === 'ar' ? 'كلمة المرور يجب أن تكون 6 أحرف على الأقل' : 'Password must be at least 6 characters';

    // Strict Validation
    if (!cleanEmail || !cleanPassword) {
      setError(t_req);
      return;
    }
    if (!validateEmail(cleanEmail)) {
      setError(t_email);
      return;
    }
    if (!isLogin && !cleanName) {
      setError(t_name);
      return;
    }
    if (!isLogin && cleanPassword !== confirmPassword.trim()) {
      setError(t_match);
      return;
    }
    if (cleanPassword.length < 6) {
      setError(t_len);
      return;
    }

    setIsLoading(true);

    // Simulate Secure Network Request
    setTimeout(() => {
      setIsLoading(false);
      
      const user: UserType = {
        id: `user_${Date.now()}`,
        name: isLogin ? (cleanEmail.split('@')[0] || 'User') : cleanName,
        avatar: `https://ui-avatars.com/api/?name=${isLogin ? cleanEmail : cleanName}&background=047857&color=fff`,
        online: true,
        coverPhoto: `https://picsum.photos/800/300?random=${Date.now()}`
      };

      onLogin(user);
    }, 1500);
  };

  const handleSocialLogin = (provider: 'google' | 'facebook') => {
    setSocialLoading(provider);
    setError(null);
    setSuccessMsg(null);
    setSocialStatus(language === 'ar' ? 'جاري الاتصال...' : 'Connecting...');
    
    // Simulate Genuine OAuth Flow Stages
    setTimeout(() => {
        setSocialStatus(language === 'ar' ? 'جاري التحقق من البيانات...' : 'Verifying data...');
        setTimeout(() => {
            setSocialStatus(language === 'ar' ? 'جاري تسجيل الدخول...' : 'Logging in...');
            setTimeout(() => {
                const user: UserType = {
                    id: `user_${provider}_${Date.now()}`,
                    name: provider === 'google' ? 'Google User' : 'Facebook User',
                    avatar: `https://ui-avatars.com/api/?name=${provider === 'google' ? 'Google+User' : 'Facebook+User'}&background=${provider === 'google' ? 'DB4437' : '1877F2'}&color=fff`,
                    online: true,
                    coverPhoto: `https://picsum.photos/800/300?random=${Date.now()}`
                };
                setSocialLoading(null);
                setSocialStatus('');
                onLogin(user);
            }, 800);
        }, 800);
    }, 800);
  };

  const handleResetPassword = (e: React.FormEvent) => {
      e.preventDefault();
      setError(null);
      setSuccessMsg(null);

      if (!validateEmail(email)) {
          setError(language === 'ar' ? 'يرجى إدخال بريد إلكتروني صحيح لاستعادة كلمة المرور' : 'Please enter a valid email to reset password');
          return;
      }

      setIsLoading(true);
      setTimeout(() => {
          setIsLoading(false);
          setSuccessMsg(language === 'ar' ? 'تم إرسال رابط إعادة تعيين كلمة المرور إلى بريدك الإلكتروني.' : 'Password reset link sent to your email.');
          setEmail('');
      }, 1500);
  };

  return (
    <div className="min-h-screen w-full flex flex-col md:flex-row items-center justify-between p-4 md:px-24 md:py-12 gap-8 bg-transparent font-sans transition-all duration-300" dir={dir}>
      
      {/* Settings Button (Absolute Top Corner) */}
      <div className="absolute top-6 right-6 md:right-auto md:left-6 z-50" ref={settingsRef}>
        <button 
            onClick={() => setShowSettingsMenu(!showSettingsMenu)}
            className="bg-emerald-700 hover:bg-blue-700 text-white p-2.5 rounded-full transition shadow-lg flex items-center justify-center"
            title={t.nav_settings || (language === 'ar' ? 'الإعدادات' : 'Settings')}
        >
            <Settings className="w-6 h-6" />
        </button>

        {showSettingsMenu && (
            // Positioning Logic:
            // Mobile (Default): right-0 (Aligns to right edge of button container)
            // Desktop (md): right-auto left-0 (Aligns to left edge of button container)
            <div className="absolute top-full mt-2 w-64 bg-white dark:bg-gray-900 rounded-xl shadow-2xl border border-gray-100 dark:border-gray-700 overflow-hidden animate-fadeIn origin-top right-0 md:right-auto md:left-0 z-50">
                {/* Language Options */}
                <div className="p-3 border-b border-gray-100 dark:border-gray-700">
                    <div className="text-xs font-bold text-gray-500 dark:text-gray-400 mb-2 px-2 uppercase text-start">{t.nav_language || (language === 'ar' ? 'اللغة' : 'Language')}</div>
                    <button 
                        onClick={() => { setLanguage('ar'); setShowSettingsMenu(false); }}
                        className={`w-full flex items-center justify-between p-2 rounded-lg transition ${language === 'ar' ? 'bg-emerald-50 dark:bg-emerald-900/20 text-emerald-700 dark:text-emerald-400' : 'hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-700 dark:text-gray-200'}`}
                    >
                        <div className="flex items-center gap-2">
                            <span className="text-lg">🇸🇦</span>
                            <span className="font-medium">العربية</span>
                        </div>
                        {language === 'ar' && <Check className="w-4 h-4" />}
                    </button>
                    <button 
                        onClick={() => { setLanguage('en'); setShowSettingsMenu(false); }}
                        className={`w-full flex items-center justify-between p-2 rounded-lg transition ${language === 'en' ? 'bg-emerald-50 dark:bg-emerald-900/20 text-emerald-700 dark:text-emerald-400' : 'hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-700 dark:text-gray-200'}`}
                    >
                        <div className="flex items-center gap-2">
                            <span className="text-lg">🇺🇸</span>
                            <span className="font-medium">English</span>
                        </div>
                        {language === 'en' && <Check className="w-4 h-4" />}
                    </button>
                </div>

                {/* Theme Toggle */}
                <div className="p-3">
                    <div className="text-xs font-bold text-gray-500 dark:text-gray-400 mb-2 px-2 uppercase text-start">{t.common_appearance || (language === 'ar' ? 'المظهر' : 'Appearance')}</div>
                    <button 
                        onClick={() => { toggleTheme(); setShowSettingsMenu(false); }}
                        className="w-full flex items-center justify-between p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-700 dark:text-gray-200 transition group"
                    >
                        <div className="flex items-center gap-2">
                            {theme === 'dark' ? <Moon className="w-5 h-5" /> : <Sun className="w-5 h-5" />}
                            <span className="font-medium">{theme === 'dark' ? (t.nav_light_mode || (language === 'ar' ? 'الوضع النهاري' : 'Light Mode')) : (t.nav_dark_mode || (language === 'ar' ? 'الوضع الليلي' : 'Dark Mode'))}</span>
                        </div>
                        
                        {/* Switch Visual - Forced LTR for consistent toggle animation regardless of language */}
                        <div className={`w-10 h-6 rounded-full p-1 transition-colors duration-300 ${theme === 'dark' ? 'bg-emerald-600' : 'bg-gray-300'}`} dir="ltr">
                            <div className={`bg-white w-4 h-4 rounded-full shadow-md transform transition-transform duration-300 ${theme === 'dark' ? 'translate-x-4' : 'translate-x-0'}`}></div>
                        </div>
                    </button>
                </div>
            </div>
        )}
      </div>

      {/* Right Side - Branding (Floating) */}
      <div className="hidden md:flex flex-col justify-between max-w-lg text-white z-10 animate-slideRight min-h-[600px] py-4">
        
        {/* Brand Header */}
        <div>
          <div className="flex items-center gap-4 mb-8">
            <div className="bg-emerald-700/90 p-3.5 rounded-2xl shadow-xl backdrop-blur-md border border-emerald-600/30">
              <Infinity className="w-12 h-12 text-white" />
            </div>
            <span 
              className="text-6xl font-extrabold tracking-tight text-[#0F6A33]"
              style={{ 
                fontFamily: 'Cairo, sans-serif',
                WebkitTextStroke: '2px white',
                paintOrder: 'stroke fill'
              }}
            >
              {language === 'ar' ? 'تورلوب' : 'Tourloop'}
            </span>
          </div>
          
          <h1 className="text-5xl font-bold leading-tight mb-4 drop-shadow-xl text-shadow-lg">
            {language === 'ar' ? 'اكتشف عالماً' : 'Discover a world'} <br />
            <span 
              className="text-[#0F6A33] font-extrabold"
              style={{
                WebkitTextStroke: '2px white',
                paintOrder: 'stroke fill'
              }}
            >
              {language === 'ar' ? 'يجمعنا سوياً.' : 'that brings us together.'}
            </span>
          </h1>
          <p className="text-xl text-white/90 font-medium drop-shadow-md max-w-md leading-relaxed">
            {language === 'ar' 
              ? 'منصة التواصل الاجتماعي الأكثر أماناً وتفاعلاً. شارك لحظاتك المميزة مع من تحب.' 
              : 'The most secure and interactive social platform. Share your special moments with those you love.'}
          </p>
        </div>

        {/* Features / Content - Filling vertical space */}
        <div className="space-y-5 my-8">
            <div className="flex items-start gap-4 p-4 rounded-2xl bg-white/10 backdrop-blur-sm border border-white/10 hover:bg-white/20 transition-colors duration-300 cursor-default shadow-lg">
                <div className="p-2.5 bg-emerald-700/40 rounded-xl">
                    <Globe className="w-7 h-7 text-emerald-300" />
                </div>
                <div>
                    <h3 className="font-bold text-lg text-white mb-1">{language === 'ar' ? 'مجتمع عالمي' : 'Global Community'}</h3>
                    <p className="text-sm text-white/80 leading-relaxed">
                      {language === 'ar' ? 'تواصل مع ملايين المستخدمين حول العالم واستكشف ثقافات جديدة بلا حدود.' : 'Connect with millions around the world and explore new cultures without limits.'}
                    </p>
                </div>
            </div>

            <div className="flex items-start gap-4 p-4 rounded-2xl bg-white/10 backdrop-blur-sm border border-white/10 hover:bg-white/20 transition-colors duration-300 cursor-default shadow-lg">
                <div className="p-2.5 bg-blue-600/40 rounded-xl">
                    <Shield className="w-7 h-7 text-blue-300" />
                </div>
                <div>
                    <h3 className="font-bold text-lg text-white mb-1">{language === 'ar' ? 'حماية وخصوصية' : 'Safety & Privacy'}</h3>
                    <p className="text-sm text-white/80 leading-relaxed">
                      {language === 'ar' ? 'بياناتك محمية بأعلى معايير الأمان العالمية لتستمتع بتجربة آمنة ومريحة.' : 'Your data is protected by world-class security standards for a safe experience.'}
                    </p>
                </div>
            </div>
        </div>

        {/* Footer Buttons */}
        <div className="flex items-center gap-4 text-sm text-white/70 font-medium drop-shadow-md pt-6 border-t border-white/10">
          <span className="hover:text-white cursor-pointer transition flex items-center gap-1">
             © 2024 Tourloop
          </span>
          <span className="w-1 h-1 bg-white/50 rounded-full"></span>
          <button type="button" onClick={() => setFooterModal('privacy')} className="hover:text-white cursor-pointer transition">{language === 'ar' ? 'سياسة الخصوصية' : 'Privacy Policy'}</button>
          <span className="w-1 h-1 bg-white/50 rounded-full"></span>
          <button type="button" onClick={() => setFooterModal('terms')} className="hover:text-white cursor-pointer transition">{language === 'ar' ? 'شروط الاستخدام' : 'Terms of Use'}</button>
          <span className="w-1 h-1 bg-white/50 rounded-full"></span>
          <button type="button" onClick={() => setFooterModal('contact')} className="hover:text-white cursor-pointer transition">{language === 'ar' ? 'اتصل بنا' : 'Contact Us'}</button>
        </div>
      </div>

      {/* Left Side - Form Card */}
      <div className="w-full max-w-md relative z-10 animate-fadeIn">
        <div className="bg-white/90 dark:bg-gray-900/90 backdrop-blur-xl px-8 py-12 rounded-3xl shadow-2xl border border-white/50 dark:border-gray-700 min-h-[600px] flex flex-col justify-center transition-colors duration-300">
          
          {/* Mobile Logo */}
          <div className="md:hidden flex flex-col items-center mb-8">
            <div className="bg-emerald-700 p-3 rounded-xl shadow-lg mb-3">
              <Infinity className="w-10 h-10 text-white" />
            </div>
            <h2 className="text-3xl font-bold text-emerald-700 dark:text-emerald-500">
              {language === 'ar' ? 'تورلوب' : 'Tourloop'}
            </h2>
          </div>

          <div className="text-center md:text-start space-y-2 mb-8">
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white">
              {isForgotPass 
                ? (t.auth_reset_pass_title || (language === 'ar' ? 'استعادة كلمة المرور' : 'Reset Password'))
                : (isLogin 
                    ? (t.auth_login_title || (language === 'ar' ? 'تسجيل الدخول' : 'Log In'))
                    : (t.auth_signup_title || (language === 'ar' ? 'إنشاء حساب جديد' : 'Create Account')))}
            </h2>
            <p className="text-gray-500 dark:text-gray-400">
              {isForgotPass 
                ? (t.auth_reset_pass_desc || (language === 'ar' ? 'أدخل بريدك الإلكتروني لإرسال تعليمات إعادة التعيين' : 'Enter your email to send reset instructions'))
                : (isLogin 
                    ? (t.auth_login_desc || (language === 'ar' ? 'يرجى إدخال بياناتك لتسجيل الدخول' : 'Please enter your details to sign in'))
                    : (t.auth_signup_desc || (language === 'ar' ? 'املأ البيانات التالية للانضمام إلينا' : 'Fill in the details to join us')))}
            </p>
          </div>

          {error && (
            <div className="bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 p-4 rounded-xl text-sm flex items-center gap-2 mb-6 animate-fadeIn border border-red-100 dark:border-red-900/30">
              <AlertCircle className="w-5 h-5" />
              {error}
            </div>
          )}

          {successMsg && (
            <div className="bg-green-50 dark:bg-green-900/20 text-green-600 dark:text-green-400 p-4 rounded-xl text-sm flex items-center gap-2 mb-6 animate-fadeIn border border-green-100 dark:border-green-900/30">
              <CheckCircle className="w-5 h-5" />
              {successMsg}
            </div>
          )}

          {isForgotPass ? (
              // --- Forgot Password Form ---
              <form onSubmit={handleResetPassword} className="space-y-5 animate-fadeIn">
                  <div className="space-y-1.5">
                    <label className="text-sm font-medium text-gray-700 dark:text-gray-300">{t.auth_email_label || (language === 'ar' ? 'البريد الإلكتروني' : 'Email Address')}</label>
                    <div className="relative group">
                        <Mail className={`absolute ${dir === 'rtl' ? 'right-3' : 'left-3'} top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 group-focus-within:text-emerald-700 transition-colors`} />
                        <input 
                        type="email" 
                        className={`w-full bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl py-3 ${dir === 'rtl' ? 'pr-10 pl-4' : 'pl-10 pr-4'} outline-none focus:ring-2 focus:ring-emerald-700/20 focus:border-emerald-700 transition-all dark:text-white dark:placeholder-gray-400`}
                        placeholder="name@example.com"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        />
                    </div>
                  </div>
                  
                  <button 
                    type="submit" 
                    disabled={isLoading}
                    className="w-full bg-emerald-700 hover:bg-emerald-800 text-white font-bold py-3.5 rounded-xl shadow-lg shadow-emerald-700/30 transition transform hover:-translate-y-0.5 active:translate-y-0 disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                  >
                    {isLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : (t.auth_send_reset_link || (language === 'ar' ? 'إرسال رابط الاستعادة' : 'Send Reset Link'))}
                  </button>

                  <button 
                    type="button" 
                    onClick={() => { setIsForgotPass(false); setError(null); setSuccessMsg(null); }}
                    className="w-full text-gray-600 dark:text-gray-400 font-medium hover:text-gray-900 dark:hover:text-white flex items-center justify-center gap-1 mt-4"
                  >
                      <ChevronRight className={`w-4 h-4 ${dir === 'rtl' ? 'rotate-180' : ''}`} />
                      {t.auth_back_login || (language === 'ar' ? 'العودة لتسجيل الدخول' : 'Back to Login')}
                  </button>
              </form>
          ) : (
              // --- Login / Signup Form ---
              <form onSubmit={handleSubmit} className="space-y-5 animate-fadeIn">
                {!isLogin && (
                <div className="space-y-1.5 animate-fadeIn">
                    <label className="text-sm font-medium text-gray-700 dark:text-gray-300">{t.auth_name_label || (language === 'ar' ? 'الاسم الكامل' : 'Full Name')}</label>
                    <div className="relative group">
                    <User className={`absolute ${dir === 'rtl' ? 'right-3' : 'left-3'} top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 group-focus-within:text-emerald-700 transition-colors`} />
                    <input 
                        type="text" 
                        className={`w-full bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl py-3 ${dir === 'rtl' ? 'pr-10 pl-4' : 'pl-10 pr-4'} outline-none focus:ring-2 focus:ring-emerald-700/20 focus:border-emerald-700 transition-all dark:text-white dark:placeholder-gray-400`}
                        placeholder={language === 'ar' ? "الاسم الأول واسم العائلة" : "First and Last Name"}
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                    />
                    </div>
                </div>
                )}

                <div className="space-y-1.5">
                <label className="text-sm font-medium text-gray-700 dark:text-gray-300">{t.auth_email_label || (language === 'ar' ? 'البريد الإلكتروني' : 'Email Address')}</label>
                <div className="relative group">
                    <Mail className={`absolute ${dir === 'rtl' ? 'right-3' : 'left-3'} top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 group-focus-within:text-emerald-700 transition-colors`} />
                    <input 
                    type="email" 
                    className={`w-full bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl py-3 ${dir === 'rtl' ? 'pr-10 pl-4' : 'pl-10 pr-4'} outline-none focus:ring-2 focus:ring-emerald-700/20 focus:border-emerald-700 transition-all dark:text-white dark:placeholder-gray-400`}
                    placeholder="name@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    />
                </div>
                </div>

                <div className="space-y-1.5">
                <label className="text-sm font-medium text-gray-700 dark:text-gray-300">{t.auth_password_label || (language === 'ar' ? 'كلمة المرور' : 'Password')}</label>
                <div className="relative group">
                    <Lock className={`absolute ${dir === 'rtl' ? 'right-3' : 'left-3'} top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 group-focus-within:text-emerald-700 transition-colors`} />
                    <input 
                    type={showPassword ? "text" : "password"}
                    className={`w-full bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl py-3 ${dir === 'rtl' ? 'pr-10 pl-10' : 'pl-10 pr-10'} outline-none focus:ring-2 focus:ring-emerald-700/20 focus:border-emerald-700 transition-all dark:text-white dark:placeholder-gray-400`}
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    />
                    {/* Single Eye Button - Only for Main Password */}
                    <button 
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className={`absolute ${dir === 'rtl' ? 'left-3' : 'right-3'} top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 focus:outline-none`}
                    tabIndex={-1}
                    >
                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                    </button>
                </div>
                </div>

                {!isLogin && (
                <div className="space-y-1.5 animate-fadeIn">
                    <label className="text-sm font-medium text-gray-700 dark:text-gray-300">{t.auth_confirm_password_label || (language === 'ar' ? 'تأكيد كلمة المرور' : 'Confirm Password')}</label>
                    <div className="relative group">
                    <Lock className={`absolute ${dir === 'rtl' ? 'right-3' : 'left-3'} top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 group-focus-within:text-emerald-700 transition-colors`} />
                    <input 
                        type="password"
                        className={`w-full bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl py-3 ${dir === 'rtl' ? 'pr-10 pl-4' : 'pl-10 pr-4'} outline-none focus:ring-2 focus:ring-emerald-700/20 focus:border-emerald-700 transition-all dark:text-white dark:placeholder-gray-400`}
                        placeholder="••••••••"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                    />
                    </div>
                </div>
                )}

                {isLogin && (
                <div className="flex items-center justify-between text-sm">
                    <label className="flex items-center gap-2 cursor-pointer text-gray-600 dark:text-gray-400 select-none">
                    <input type="checkbox" className="rounded text-emerald-700 focus:ring-emerald-700 border-gray-300 dark:border-gray-600 dark:bg-gray-700" />
                    <span>{t.auth_remember_me || (language === 'ar' ? 'تذكرني' : 'Remember me')}</span>
                    </label>
                    <button 
                        type="button"
                        onClick={() => { setIsForgotPass(true); setError(null); }}
                        className="text-emerald-700 font-medium hover:text-emerald-800 hover:underline dark:text-emerald-500 dark:hover:text-emerald-400"
                    >
                        {t.auth_forgot_password || (language === 'ar' ? 'نسيت كلمة المرور؟' : 'Forgot Password?')}
                    </button>
                </div>
                )}

                <button 
                type="submit" 
                disabled={isLoading || socialLoading !== null}
                className="w-full bg-emerald-700 hover:bg-emerald-800 text-white font-bold py-3.5 rounded-xl shadow-lg shadow-emerald-700/30 transition transform hover:-translate-y-0.5 active:translate-y-0 disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                {isLoading ? (
                    <>
                        <Loader2 className="w-5 h-5 animate-spin" />
                        {language === 'ar' ? 'جاري التحقق...' : 'Verifying...'}
                    </>
                ) : (
                    <>
                    {isLogin ? (t.auth_login_btn || (language === 'ar' ? 'تسجيل الدخول' : 'Sign In')) : (t.auth_signup_btn || (language === 'ar' ? 'إنشاء حساب' : 'Create Account'))}
                    <ArrowRight className={`w-5 h-5 ${dir === 'rtl' ? 'rotate-180' : ''}`} />
                    </>
                )}
                </button>
            </form>
          )}

          {!isForgotPass && (
              <>
                <div className="relative mt-6 mb-6">
                    <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-gray-200 dark:border-gray-700"></div>
                    </div>
                    <div className="relative flex justify-center text-sm">
                    <span className="px-3 bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm rounded-full text-gray-500 dark:text-gray-400">
                        {t.auth_or_continue || (language === 'ar' ? 'أو المتابعة عبر' : 'Or continue with')}
                    </span>
                    </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                    <button 
                    type="button"
                    onClick={() => handleSocialLogin('google')}
                    disabled={isLoading || socialLoading !== null}
                    className="flex items-center justify-center gap-2 py-2.5 border border-gray-200 dark:border-gray-700 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-800 transition disabled:opacity-70 disabled:cursor-not-allowed relative overflow-hidden bg-white/50 dark:bg-gray-800/50"
                    >
                    {socialLoading === 'google' ? (
                        <div className="flex items-center gap-2 animate-pulse">
                            <Loader2 className="w-5 h-5 animate-spin text-gray-500 dark:text-gray-400" />
                            <span className="text-xs font-medium text-gray-500 dark:text-gray-400">{socialStatus}</span>
                        </div>
                    ) : (
                        <>
                            <Globe className="w-5 h-5 text-red-500" />
                            <span className="font-medium text-gray-700 dark:text-gray-300">Google</span>
                        </>
                    )}
                    </button>
                    <button 
                    type="button"
                    onClick={() => handleSocialLogin('facebook')}
                    disabled={isLoading || socialLoading !== null}
                    className="flex items-center justify-center gap-2 py-2.5 border border-gray-200 dark:border-gray-700 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-800 transition disabled:opacity-70 disabled:cursor-not-allowed relative overflow-hidden bg-white/50 dark:bg-gray-800/50"
                    >
                    {socialLoading === 'facebook' ? (
                        <div className="flex items-center gap-2 animate-pulse">
                            <Loader2 className="w-5 h-5 animate-spin text-gray-500 dark:text-gray-400" />
                            <span className="text-xs font-medium text-gray-500 dark:text-gray-400">{socialStatus}</span>
                        </div>
                    ) : (
                        <>
                            <Facebook className="w-5 h-5 text-blue-600" />
                            <span className="font-medium text-gray-700 dark:text-gray-300">Facebook</span>
                        </>
                    )}
                    </button>
                </div>

                <div className="text-center text-sm text-gray-600 dark:text-gray-400 mt-6">
                    {isLogin ? (t.auth_no_account || (language === 'ar' ? 'ليس لديك حساب؟' : 'Don\'t have an account?')) : (t.auth_have_account || (language === 'ar' ? 'لديك حساب بالفعل؟' : 'Already have an account?'))}{' '}
                    <button 
                    onClick={() => { setIsLogin(!isLogin); setError(null); }}
                    className="text-emerald-700 font-bold hover:underline dark:text-emerald-500"
                    >
                    {isLogin ? (t.auth_signup_btn || (language === 'ar' ? 'سجل الآن' : 'Sign Up')) : (t.auth_login_btn || (language === 'ar' ? 'تسجيل الدخول' : 'Sign In'))}
                    </button>
                </div>
              </>
          )}
          
          <div className="flex items-center justify-center gap-2 text-xs text-gray-400 dark:text-gray-500 mt-auto pt-6">
              <Shield className="w-3 h-3" />
              {t.auth_secure_badge || (language === 'ar' ? 'محمي بواسطة Tourloop Secure' : 'Protected by Tourloop Secure')}
          </div>

        </div>
      </div>

      {/* Footer Info Modal */}
      {footerModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fadeIn" onClick={() => setFooterModal(null)}>
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden animate-scaleIn border border-gray-100 dark:border-gray-700" onClick={e => e.stopPropagation()}>
                <div className="p-6 border-b border-gray-100 dark:border-gray-700 flex justify-between items-center bg-gray-50 dark:bg-gray-800/50">
                    <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                        {footerModal === 'privacy' && (language === 'ar' ? 'سياسة الخصوصية' : 'Privacy Policy')}
                        {footerModal === 'terms' && (language === 'ar' ? 'شروط الاستخدام' : 'Terms of Use')}
                        {footerModal === 'contact' && (language === 'ar' ? 'اتصل بنا' : 'Contact Us')}
                    </h3>
                    <button onClick={() => setFooterModal(null)} className="p-2 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-full transition text-gray-500 dark:text-gray-400">
                        <X className="w-5 h-5" />
                    </button>
                </div>
                <div className="p-6 text-gray-600 dark:text-gray-300 leading-relaxed text-sm md:text-base max-h-[60vh] overflow-y-auto custom-scrollbar">
                    {footerModal === 'privacy' && (
                        <div className="space-y-4">
                            <p>{language === 'ar' ? 'نحن في Tourloop نلتزم بحماية خصوصيتك. توضح هذه السياسة كيفية جمعنا واستخدامنا لبياناتك.' : 'At Tourloop, we are committed to protecting your privacy. This policy explains how we collect and use your data.'}</p>
                            <p>1. <strong>{language === 'ar' ? 'جمع البيانات:' : 'Data Collection:'}</strong> {language === 'ar' ? 'نقوم بجمع المعلومات التي تقدمها لنا عند التسجيل.' : 'We collect information you provide when registering.'}</p>
                            <p>2. <strong>{language === 'ar' ? 'استخدام البيانات:' : 'Data Usage:'}</strong> {language === 'ar' ? 'نستخدم بياناتك لتحسين تجربتك في التطبيق.' : 'We use your data to improve your experience in the app.'}</p>
                            <p>3. <strong>{language === 'ar' ? 'الأمان:' : 'Security:'}</strong> {language === 'ar' ? 'نتبع معايير أمان عالمية لحماية بياناتك.' : 'We follow global security standards to protect your data.'}</p>
                        </div>
                    )}
                    {footerModal === 'terms' && (
                        <div className="space-y-4">
                            <p>{language === 'ar' ? 'أهلاً بك في Tourloop. باستخدامك للمنصة، فإنك توافق على الشروط التالية:' : 'Welcome to Tourloop. By using the platform, you agree to the following terms:'}</p>
                            <p>1. <strong>{language === 'ar' ? 'الاستخدام المقبول:' : 'Acceptable Use:'}</strong> {language === 'ar' ? 'يجب استخدام المنصة لأغراض قانونية فقط.' : 'You must use the platform for lawful purposes only.'}</p>
                            <p>2. <strong>{language === 'ar' ? 'المحتوى:' : 'Content:'}</strong> {language === 'ar' ? 'أنت مسؤول عن المحتوى الذي تشاركه.' : 'You are responsible for the content you share.'}</p>
                            <p>3. <strong>{language === 'ar' ? 'إلغاء الحساب:' : 'Termination:'}</strong> {language === 'ar' ? 'نحتفظ بالحق في إيقاف الحسابات المخالفة.' : 'We reserve the right to terminate violating accounts.'}</p>
                        </div>
                    )}
                    {footerModal === 'contact' && (
                        <div className="space-y-6">
                            <p className="text-lg font-medium text-gray-800 dark:text-white">{language === 'ar' ? 'نحن هنا لمساعدتك! تواصل معنا عبر:' : 'We are here to help! Contact us via:'}</p>
                            <div className="flex items-center gap-4 p-4 bg-gray-50 dark:bg-gray-700/50 rounded-xl border border-gray-100 dark:border-gray-700">
                                <div className="bg-emerald-100 dark:bg-emerald-900/30 p-3 rounded-full text-emerald-600 dark:text-emerald-400">
                                    <Mail className="w-6 h-6" />
                                </div>
                                <div>
                                    <div className="text-xs text-gray-500 dark:text-gray-400 uppercase font-bold">{t.auth_email_label || (language === 'ar' ? 'البريد الإلكتروني' : 'Email')}</div>
                                    <div className="font-medium text-gray-900 dark:text-white" dir="ltr">support@tourloop.com</div>
                                </div>
                            </div>
                            <div className="flex items-center gap-4 p-4 bg-gray-50 dark:bg-gray-700/50 rounded-xl border border-gray-100 dark:border-gray-700">
                                <div className="bg-emerald-100 dark:bg-emerald-900/30 p-3 rounded-full text-emerald-600 dark:text-emerald-400">
                                    <Phone className="w-6 h-6" />
                                </div>
                                <div>
                                    <div className="text-xs text-gray-500 dark:text-gray-400 uppercase font-bold">{t.profile_about_contact_mobile || (language === 'ar' ? 'الهاتف' : 'Phone')}</div>
                                    <div className="font-medium text-gray-900 dark:text-white" dir="ltr">+1 234 567 890</div>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
                <div className="p-4 border-t border-gray-100 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50 flex justify-end">
                    <button onClick={() => setFooterModal(null)} className="px-6 py-2.5 bg-emerald-700 hover:bg-emerald-800 text-white rounded-xl font-bold transition shadow-lg shadow-emerald-700/20">
                        {t.common_close || (language === 'ar' ? 'إغلاق' : 'Close')}
                    </button>
                </div>
            </div>
        </div>
      )}

    </div>
  );
};

export default LoginPage;