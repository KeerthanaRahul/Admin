import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Menu, Bell, Search, LogOut, User } from 'lucide-react';
import { useAuth } from '../Context/AuthContext';

const Header = ({ toggleSidebar, title }) => {
  const [notifications] = useState(3);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };
  
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
            <div className="relative">
              <button
                onClick={() => setShowUserMenu(!showUserMenu)}
                className="flex items-center space-x-2 p-1 rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-amber-500"
              >
                <div className="h-8 w-8 rounded-full bg-amber-500 flex items-center justify-center">
                  <User size={18} className="text-white" />
                </div>
                <span className="ml-2 text-sm font-medium text-gray-700 hidden md:block">
                  {user?.name || 'Admin User'}
                </span>
              </button>

              {showUserMenu && (
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-50 border border-gray-200">
                  <div className="px-4 py-2 border-b border-gray-100">
                    <p className="text-sm font-medium text-gray-900">{user?.name}</p>
                    <p className="text-sm text-gray-500">{user?.email}</p>
                  </div>
                  <button
                    onClick={handleLogout}
                    className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                  >
                    <LogOut size={16} className="mr-2" />
                    Sign Out
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Overlay to close user menu */}
      {showUserMenu && (
        <div
          className="fixed inset-0 z-40"
          onClick={() => setShowUserMenu(false)}
        />
      )}
    </header>
  );
};

export default Header;