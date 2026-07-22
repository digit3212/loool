
import { useState } from 'react';
import { User } from '../../types';
import { initialUser } from '../../data/initialData';

export const useAuth = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [currentUser, setCurrentUser] = useState<User>(initialUser);

  const handleAuthLogin = (user: User) => {
    setCurrentUser(user);
    setIsAuthenticated(true);
  };

  const handleLogout = (callback: () => void) => {
    localStorage.clear();
    sessionStorage.clear();
    document.cookie.split(";").forEach((c) => {
      document.cookie = c.replace(/^ +/, "").replace(/=.*/, "=;expires=" + new Date().toUTCString() + ";path=/");
    });
    setIsAuthenticated(false);
    setCurrentUser(initialUser);
    callback();
  };

  return {
    isAuthenticated,
    currentUser,
    setCurrentUser,
    handleAuthLogin,
    handleLogout
  };
};
