"use client";

import Link from 'next/link';
import { usePathname } from 'next/navigation';

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

const navigation = [
  { name: 'Dashboard', href: '/admin', icon: '📊' },
  { name: 'Profile', href: '/admin/profile', icon: '👤' },
  { name: 'Messages', href: '/admin/messages', icon: '💬' },
  { name: 'Projects', href: '/admin/projects', icon: '🚀' },
  { name: 'Settings', href: '/admin/settings', icon: '⚙️' },
];

export default function Sidebar({ isOpen, onClose }: SidebarProps) {
  const pathname = usePathname();

  return (
    <>
      {/* Overlay for mobile */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={onClose}
        />
      )}

      {/* Sidebar */}
      <div className={`
        fixed inset-y-0 left-0 z-50 w-64 bg-white border-r border-secondary-200 transform transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static lg:inset-0
        ${isOpen ? 'translate-x-0' : '-translate-x-full'}
      `}>
        <div className="flex flex-col h-full">
          {/* Logo */}
          <div className="flex items-center justify-between px-6 py-4 border-b border-secondary-200">
            <h2 className="text-xl font-bold text-primary-800">Admin Panel</h2>
            <button
              onClick={onClose}
              className="lg:hidden p-2 rounded-lg hover:bg-secondary-100"
            >
              <svg className="w-5 h-5 text-secondary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {/* Navigation */}
          <nav className="flex-1 px-4 py-6 space-y-2">
            {navigation.map((item) => {
              const isActive = pathname === item.href;
              
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className={`
                    flex items-center px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200
                    ${isActive 
                      ? 'bg-primary-50 text-primary-700 border-r-2 border-primary-500' 
                      : 'text-secondary-700 hover:bg-secondary-50 hover:text-secondary-900'
                    }
                  `}
                  onClick={onClose}
                >
                  <span className="text-lg mr-3">{item.icon}</span>
                  {item.name}
                </Link>
              );
            })}
          </nav>

          {/* Footer */}
          <div className="p-4 border-t border-secondary-200">
            <div className="text-xs text-secondary-500 text-center">
              © 2024 My Portfolio
            </div>
          </div>
        </div>
      </div>
    </>
  );
}