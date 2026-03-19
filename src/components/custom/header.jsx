import React from 'react';
import { Bell, Mail, User } from 'lucide-react';

const Header = () => {
  return (
    <header className="fixed top-0 left-0 right-0 h-16 bg-white border-b border-gray-200 flex items-center justify-between px-6 z-20">
      {/* Left side - Logo + Text */}
      <div className="flex items-center gap-3">
        <div className="w-8 h-8 bg-gradient-to-r from-orange-500 to-purple-600 rounded-full flex items-center justify-center">
          <span className="text-white font-bold text-xs">MP</span>
        </div>
        
        <span className="text-gray-800 font-medium">Majhi Paithani</span>
      </div>

      {/* Right side - Notifications + User Profile */}
      <div className="flex items-center gap-4">
        <button className="relative p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors">
          <Bell size={18} />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full"></span>
        </button>

        <button className="relative p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors">
          <Mail size={18} />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full"></span>
        </button>

        <div className="flex items-center gap-3 pl-4 border-l border-gray-200">
          <span className="text-sm text-gray-700">Rajesh Kumar</span>
          <div className="w-8 h-8 bg-gradient-to-r from-orange-400 to-purple-500 rounded-full flex items-center justify-center">
            <User size={16} className="text-white" />
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
