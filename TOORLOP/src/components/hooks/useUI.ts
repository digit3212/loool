
import { useState, useEffect } from 'react';
import { View, User } from '../types';

export const useUI = (initialUser: User) => {
  const [currentView, setView] = useState<View>('home');
  const [viewingProfile, setViewingProfile] = useState<User>(initialUser);
  const [appNotification, setAppNotification] = useState<{message: string, type: 'success' | 'info'} | null>(null);
  const [isGlobalLoading, setIsGlobalLoading] = useState(true);

  // محاكاة تحميل البيانات عند تغيير القسم
  useEffect(() => {
    setIsGlobalLoading(true);
    const timer = setTimeout(() => {
      setIsGlobalLoading(false);
    }, 1200);
    return () => clearTimeout(timer);
  }, [currentView]);

  const showNotification = (message: string, type: 'success' | 'info' = 'success') => {
      setAppNotification({ message, type });
      setTimeout(() => setAppNotification(null), 4000);
  };

  return {
    currentView,
    setView,
    viewingProfile,
    setViewingProfile,
    appNotification,
    setAppNotification,
    showNotification,
    isGlobalLoading
  };
};
