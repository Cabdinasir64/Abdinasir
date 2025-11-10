"use client";

import { useState, useRef, useEffect } from 'react';

interface User {
  id: string;
  username: string;
  email: string;
  profileImage?: string;
}

interface UserDropdownProps {
  user: User;
  onLogout: () => void;
  getInitial: () => string;
}

export default function UserDropdown({ user, onLogout, getInitial }: UserDropdownProps) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className="relative" ref={dropdownRef}>
      {/* User Avatar */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center space-x-3 p-2 rounded-lg hover:bg-secondary-100 transition-colors"
      >
        {user.profileImage ? (
          <img
            src={user.profileImage}
            alt={user.username}
            className="w-10 h-10 rounded-full object-cover"
          />
        ) : (
          <div className="w-10 h-10 bg-primary-500 rounded-full flex items-center justify-center">
            <span className="text-white font-semibold text-sm">
              {getInitial()}
            </span>
          </div>
        )}
        
        <div className="hidden md:block text-left">
          <p className="text-sm font-medium text-secondary-800">{user.username}</p>
          <p className="text-xs text-secondary-600">{user.email}</p>
        </div>

        <svg 
          className={`w-4 h-4 text-secondary-500 transition-transform ${isOpen ? 'rotate-180' : ''}`}
          fill="none" 
          stroke="currentColor" 
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {/* Dropdown Menu */}
      {isOpen && (
        <div className="absolute right-0 top-full mt-2 w-64 bg-white rounded-xl shadow-dropdown border border-secondary-200 py-2 z-50">
          {/* User Info */}
          <div className="px-4 py-3 border-b border-secondary-100">
            <p className="text-sm font-medium text-secondary-800">{user.username}</p>
            <p className="text-xs text-secondary-600 truncate">{user.email}</p>
          </div>

          {/* Menu Items */}
          <div className="py-2">
            <a
              href="/admin/profile"
              className="flex items-center px-4 py-2 text-sm text-secondary-700 hover:bg-secondary-50 transition-colors"
            >
              <svg className="w-4 h-4 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
              Profile Settings
            </a>
            
            <a
              href="/admin/messages"
              className="flex items-center px-4 py-2 text-sm text-secondary-700 hover:bg-secondary-50 transition-colors"
            >
              <svg className="w-4 h-4 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
              </svg>
              Messages
            </a>
          </div>

          {/* Logout */}
          <div className="border-t border-secondary-100 pt-2">
            <button
              onClick={onLogout}
              className="flex items-center w-full px-4 py-2 text-sm text-error-600 hover:bg-error-50 transition-colors"
            >
              <svg className="w-4 h-4 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
              </svg>
              Logout
            </button>
          </div>
        </div>
      )}
    </div>
  );
}