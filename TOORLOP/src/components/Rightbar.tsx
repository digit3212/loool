
import React from 'react';
import { Video, Search, MoreHorizontal } from 'lucide-react';
import { User } from '../types';

interface RightbarProps {
  onlineUsers: User[];
  onChatClick: (user: User) => void;
}

const Rightbar: React.FC<RightbarProps> = ({ onlineUsers, onChatClick }) => {
  return (
    <div className="hidden xl:block w-[300px] h-[calc(100vh-56px)] sticky top-14 p-4 overflow-y-auto hover:overflow-y-scroll no-scrollbar bg-white/80 dark:bg-gray-900/70 backdrop-md transition-colors duration-300 rounded-br-xl">
      <div className="mb-4">
        <h3 className="text-gray-500 font-semibold text-[17px] mb-2">ممول</h3>
        <div className="flex items-center gap-4 p-2 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-lg cursor-pointer transition">
          <img src="https://picsum.photos/120/120?random=99" alt="Ad" className="h-24 w-24 rounded-lg object-cover" />
          <div className="flex flex-col">
            <span className="font-semibold text-[15px] text-gray-900 dark:text-gray-200">منتج رائع</span>
            <span className="text-xs text-gray-500">example.com</span>
          </div>
        </div>
        <div className="flex items-center gap-4 p-2 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-lg cursor-pointer transition">
          <img src="https://picsum.photos/120/120?random=98" alt="Ad" className="h-24 w-24 rounded-lg object-cover" />
          <div className="flex flex-col">
            <span className="font-semibold text-[15px] text-gray-900 dark:text-gray-200">خدمة مميزة</span>
            <span className="text-xs text-gray-500">service.com</span>
          </div>
        </div>
      </div>

      <div className="border-t border-gray-300 dark:border-gray-700 my-4 mx-2"></div>

      <div className="flex items-center justify-between px-2 mb-2">
        <h3 className="text-gray-500 font-semibold text-[17px]">جهات الاتصال</h3>
        <div className="flex gap-2 text-gray-500">
          <Video className="h-4 w-4 cursor-pointer hover:text-gray-700 dark:hover:text-gray-300" />
          <Search className="h-4 w-4 cursor-pointer hover:text-gray-700 dark:hover:text-gray-300" />
          <MoreHorizontal className="h-4 w-4 cursor-pointer hover:text-gray-700 dark:hover:text-gray-300" />
        </div>
      </div>

      <ul className="space-y-1">
        {onlineUsers.map((user) => (
          <li 
            key={user.id} 
            onClick={() => onChatClick(user)}
            className="flex items-center gap-3 p-2 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-lg cursor-pointer transition group"
          >
            <div className="relative">
              <img src={user.avatar} alt={user.name} className="h-9 w-9 rounded-full border border-gray-200" />
              {user.online && (
                <span className="absolute bottom-0 right-0 h-3 w-3 bg-green-500 border-2 border-white rounded-full"></span>
              )}
            </div>
            <span className="font-medium text-[15px] text-gray-900 dark:text-gray-200 group-hover:text-black dark:group-hover:text-white">{user.name}</span>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Rightbar;
