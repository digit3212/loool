
import React, { createContext, useContext, useState, useCallback, ReactNode } from 'react';
import { createPortal } from 'react-dom';
import { CheckCircle, AlertCircle, Info, AlertTriangle, X } from 'lucide-react';

// --- Types ---
export type NotificationType = 'success' | 'error' | 'info' | 'warning';

interface Notification {
  id: string;
  message: string;
  type: NotificationType;
  duration?: number;
}

interface NotificationContextType {
  notify: (message: string, type?: NotificationType, duration?: number) => void;
}

// --- Context ---
const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

// --- Provider Component ---
export const NotificationProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [notifications, setNotifications] = useState<Notification[]>([]);

  const removeNotification = useCallback((id: string) => {
    setNotifications((prev) => prev.filter((n) => n.id !== id));
  }, []);

  const notify = useCallback((message: string, type: NotificationType = 'success', duration: number = 4000) => {
    const id = Math.random().toString(36).substr(2, 9);
    setNotifications((prev) => [...prev, { id, message, type, duration }]);

    setTimeout(() => {
      removeNotification(id);
    }, duration);
  }, [removeNotification]);

  return (
    <NotificationContext.Provider value={{ notify }}>
      {children}
      {/* Portal to render notifications at the top level of DOM */}
      {typeof document !== 'undefined' && createPortal(
        <div className="fixed bottom-6 right-6 z-[999999] flex flex-col gap-3 pointer-events-none max-w-[90vw] md:max-w-sm">
          {notifications.map((n) => (
            <Toast key={n.id} notification={n} onClose={() => removeNotification(n.id)} />
          ))}
        </div>,
        document.body
      )}
    </NotificationContext.Provider>
  );
};

// --- Custom Hook ---
export const useNotify = () => {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error('useNotify must be used within a NotificationProvider');
  }
  return context.notify;
};

// --- Toast UI Component ---
const Toast = ({ notification, onClose }: { notification: Notification; onClose: () => void }) => {
  const { type, message, duration = 4000 } = notification;

  const styles = {
    success: {
      bg: 'bg-emerald-600 dark:bg-emerald-700',
      icon: <CheckCircle className="w-5 h-5 text-white" />,
      bar: 'bg-emerald-400',
    },
    error: {
      bg: 'bg-red-600 dark:bg-red-700',
      icon: <AlertCircle className="w-5 h-5 text-white" />,
      bar: 'bg-red-400',
    },
    info: {
      bg: 'bg-blue-600 dark:bg-blue-700',
      icon: <Info className="w-5 h-5 text-white" />,
      bar: 'bg-blue-400',
    },
    warning: {
      bg: 'bg-amber-500 dark:bg-amber-600',
      icon: <AlertTriangle className="w-5 h-5 text-white" />,
      bar: 'bg-amber-300',
    },
  };

  return (
    <div 
      className={`relative flex items-center gap-3 px-5 py-4 rounded-xl shadow-2xl text-white border border-white/10 backdrop-blur-md pointer-events-auto animate-bounce-in overflow-hidden transition-all duration-300 ${styles[type].bg}`}
      role="alert"
    >
      <div className="flex-shrink-0">{styles[type].icon}</div>
      <div className="flex-1 font-bold text-sm leading-tight pr-1">
        {message}
      </div>
      <button 
        onClick={onClose}
        className="p-1 hover:bg-white/20 rounded-full transition-colors duration-200"
      >
        <X className="w-4 h-4 text-white/80" />
      </button>

      {/* Progress Bar Animation */}
      <div className="absolute bottom-0 left-0 h-1 w-full bg-black/10">
        <div 
          className={`h-full transition-all linear ${styles[type].bar}`}
          style={{ 
            animation: `shrinkWidth ${duration}ms linear forwards` 
          }}
        />
      </div>

      <style>{`
        @keyframes shrinkWidth {
          from { width: 100%; }
          to { width: 0%; }
        }
        @keyframes bounce-in {
          0% { transform: scale(0.3) translateY(100px); opacity: 0; }
          50% { transform: scale(1.05); opacity: 1; }
          70% { transform: scale(0.9); }
          100% { transform: scale(1) translateY(0); opacity: 1; }
        }
        .animate-bounce-in {
          animation: bounce-in 0.5s cubic-bezier(0.68, -0.55, 0.265, 1.55) forwards;
        }
      `}</style>
    </div>
  );
};
