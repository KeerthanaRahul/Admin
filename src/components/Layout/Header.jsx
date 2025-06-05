import React, { useState } from 'react';
import { Menu, Bell, Search } from 'lucide-react';

const Header = ({ toggleSidebar, title }) => {
  const [notifications] = useState(3);
  
  return (
    <header className="bg-white border-b border-gray-200 z-10">
      <div className="px-4 sm:px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <button
              type="button"
              className="text-gray-500 hover:text-gray-700 focus:outline-none focus:ring-2 focus:ring-amber-500 p-1 rounded-md lg:hidden"
              onClick={toggleSidebar}
            >
              <Menu size={24} />
            </button>
            <h1 className="ml-2 lg:ml-0 text-xl font-semibold text-gray-800">{title}</h1>
          </div>
          
          <div className="flex items-center space-x-4">
            <div className="relative hidden md:block">
              <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                <Search size={18} className="text-gray-400" />
              </div>
              <input
                type="text"
                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-amber-500 focus:border-amber-500 block w-full pl-10 p-2"
                placeholder="Search..."
              />
            </div>
            
            <div className="relative">
              <button 
                className="p-1 rounded-full text-gray-500 hover:text-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-amber-500"
              >
                <Bell size={20} />
                {notifications > 0 && (
                  <span className="absolute top-0 right-0 block h-4 w-4 rounded-full bg-red-500 text-xs text-white text-center">
                    {notifications}
                  </span>
                )}
              </button>
            </div>
            
            <div className="flex items-center">
              <img
                className="h-8 w-8 rounded-full border-2 border-amber-500"
                src="https://images.pexels.com/photos/614810/pexels-photo-614810.jpeg"
                alt="User"
              />
              <span className="ml-2 text-sm font-medium text-gray-700 hidden md:block">
                Admin User
              </span>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;