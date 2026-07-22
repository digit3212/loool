
import { useState } from 'react';
import { User } from '../../types';

export const useChat = () => {
  const [activeChats, setActiveChats] = useState<User[]>([]);

  const handleOpenChat = (user: User) => {
    if (!activeChats.some(c => c.id === user.id)) {
        setActiveChats(prev => {
            const newState = [...prev, user];
            if (newState.length > 3) return newState.slice(1);
            return newState;
        });
    }
  };

  const handleCloseChat = (userId: string) => {
      setActiveChats(prev => prev.filter(c => c.id !== userId));
  };

  return { activeChats, setActiveChats, handleOpenChat, handleCloseChat };
};
