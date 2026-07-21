
import { useState, useEffect } from 'react';
import { Story, User } from '../types';
import { initialStories, generateId } from '../data/initialData';

export const useStories = (
  currentUser: User,
  showNotification: (msg: string, type?: 'success' | 'info') => void
) => {
  const [stories, setStories] = useState<Story[]>(initialStories);
  const [viewingStoryIndex, setViewingStoryIndex] = useState<number | null>(null);
  const [storyProgress, setStoryProgress] = useState(0);
  const [isStoryPaused, setIsStoryPaused] = useState(false);

  const handleAddStory = (mediaUrl: string) => {
      const newStory: Story = {
          id: `ns_${generateId()}`,
          userId: currentUser.id,
          userName: currentUser.name,
          userAvatar: currentUser.avatar,
          mediaUrl: mediaUrl,
          type: 'image',
          timestamp: 'الآن'
      };
      setStories([newStory, ...stories]);
      showNotification('تم إضافة القصة بنجاح');
  };

  const handleViewUserStory = (userId: string) => {
      const index = stories.findIndex(s => s.userId === userId);
      if (index !== -1) {
          setViewingStoryIndex(index);
      } else {
          showNotification('لا توجد قصة لهذا المستخدم حالياً', 'info');
      }
  };

  const handleNextStory = () => {
    if (viewingStoryIndex !== null) {
       if (viewingStoryIndex < stories.length - 1) {
          setViewingStoryIndex(viewingStoryIndex + 1);
          setStoryProgress(0);
       } else {
          setViewingStoryIndex(null);
          setStoryProgress(0);
       }
    }
  };

  const handlePrevStory = () => {
    if (viewingStoryIndex !== null && viewingStoryIndex > 0) {
       setViewingStoryIndex(viewingStoryIndex - 1);
       setStoryProgress(0);
    }
  };

  // Timer logic
  useEffect(() => {
    let interval: any;
    if (viewingStoryIndex !== null && !isStoryPaused) {
      interval = setInterval(() => {
        setStoryProgress(prev => {
          if (prev >= 100) {
             if (viewingStoryIndex < stories.length - 1) {
               setViewingStoryIndex(viewingStoryIndex + 1);
               return 0;
             } else {
               setViewingStoryIndex(null);
               return 0;
             }
          }
          return prev + 1;
        });
      }, 50);
    }
    return () => clearInterval(interval);
  }, [viewingStoryIndex, stories.length, isStoryPaused]);

  useEffect(() => {
    setStoryProgress(0);
  }, [viewingStoryIndex]);

  return {
    stories, setStories,
    viewingStoryIndex, setViewingStoryIndex,
    storyProgress, setStoryProgress,
    isStoryPaused, setIsStoryPaused,
    handleAddStory,
    handleViewUserStory,
    handleNextStory,
    handlePrevStory
  };
};
