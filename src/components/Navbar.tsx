import { useState, useEffect, useRef } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Home, ShoppingCart, Package, Settings, Layers, Headphones, Bell, ChevronDown, User, LogOut, Calendar, Power } from 'lucide-react';
import { useTheme } from '../contexts/ThemeContext';
import logoImage from '../assets/logo.jpg';

const menuItems = [
  { id: 'dashboard', label: 'Dashboard', icon: Home, path: '/' },
  { id: 'orders', label: 'Orders', icon: ShoppingCart, path: '/orders' },
  { id: 'stock', label: 'Stock', icon: Package, path: '/stock' },
  { id: 'table', label: 'Table', icon: Layers, path: '/table' },
];

export default function Navbar() {
  const { toggleTheme } = useTheme();
  const location = useLocation();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);


  return (
    <>
      {/* Top Navbar */}
      <nav className="fixed top-0 left-0 right-0 bg-white dark:bg-gray-950 border-b border-gray-200 dark:border-gray-800 z-50 transform-none">
        <div className="max-w-7xl mx-auto px-4 md:px-6 py-4">
          <div className="flex items-center justify-between">
            {/* Logo - Always visible */}
            <div className="flex items-center space-x-3">
              <img 
                src={logoImage} 
                alt="Salty POS Logo" 
                className="w-10 h-10 rounded-xl object-cover shadow-sm"
              />
              <div>
                <h1 className="text-xl font-bold text-gray-900 dark:text-white">
                  Salty POS
                </h1>
              <p className="text-xs text-gray-500 dark:text-gray-500">Branch: Sonthormuk</p>
              </div>
            </div>

            {/* Desktop Navigation Menu - Hidden on mobile/tablet */}
            <div className="hidden lg:flex items-center space-x-2 bg-gray-100 dark:bg-gray-900 rounded-full p-1.5">
              {menuItems.map((item) => {
                const Icon = item.icon;
                const isActive = location.pathname === item.path;

                return (
                  <Link
                    key={item.id}
                    to={item.path}
                    className={`flex items-center space-x-2 px-4 py-2.5 rounded-full transition-all duration-200 ${
                      isActive
                        ? 'bg-emerald-600 text-white shadow-md scale-105'
                        : 'hover:bg-gray-200 dark:hover:bg-gray-800 text-gray-700 dark:text-gray-300'
                    }`}
                  >
                    <Icon className="w-5 h-5" />
                    <span className="font-medium text-sm">{item.label}</span>
                  </Link>
                );
              })}
            </div>

            {/* Right Section - Icon Buttons & User Profile */}
            <div className="flex items-center space-x-3">
              {/* Support/Headphone Button - Hidden on mobile */}
              <button
                className="hidden md:flex w-11 h-11 rounded-full bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 items-center justify-center hover:bg-gray-50 dark:hover:bg-gray-700 transition-all duration-200 shadow-sm"
                aria-label="Support"
              >
                <Headphones className="w-5 h-5 text-gray-700 dark:text-gray-300" />
              </button>

              {/* Settings Button - Hidden on mobile */}
              <button
                onClick={toggleTheme}
                className="hidden md:flex w-11 h-11 rounded-full bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 items-center justify-center hover:bg-gray-50 dark:hover:bg-gray-700 transition-all duration-200 shadow-sm"
                aria-label="Settings"
              >
                <Settings className="w-5 h-5 text-gray-700 dark:text-gray-300" />
              </button>

              {/* Notification Button with Badge - Always visible */}
              <button
                className="relative w-11 h-11 rounded-full bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 flex items-center justify-center hover:bg-gray-50 dark:hover:bg-gray-700 transition-all duration-200 shadow-sm"
                aria-label="Notifications"
              >
                <Bell className="w-5 h-5 text-gray-700 dark:text-gray-300" />
                {/* Badge */}
                <span className="absolute -top-1 -right-1 w-5 h-5 bg-pink-500 text-white text-xs font-bold rounded-full flex items-center justify-center shadow-md">
                  4
                </span>
              </button>

              {/* User Profile Dropdown - Always visible */}
              <div className="relative" ref={dropdownRef}>
                <button 
                  onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                  className="flex items-center space-x-2 md:space-x-3 pl-2 pr-3 md:pr-4 py-2 rounded-full bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700 transition-all duration-200 shadow-sm"
                >
                  {/* Avatar */}
                  <div className="w-8 h-8 rounded-full bg-gradient-to-br from-emerald-400 to-emerald-600 flex items-center justify-center text-white font-semibold shadow-sm">
                    <User className="w-4 h-4" />
                  </div>
                  {/* Admin Text & Dropdown Icon - Hidden on small mobile */}
                  <div className="hidden sm:flex items-center space-x-2">
                    <span className="text-sm font-semibold text-gray-900 dark:text-white">Admin</span>
                    <ChevronDown className={`w-4 h-4 text-gray-500 dark:text-gray-400 transition-transform duration-200 ${isDropdownOpen ? 'rotate-180' : ''}`} />
                  </div>
                </button>

                {/* Dropdown Menu */}
                {isDropdownOpen && (
                  <div className="absolute right-0 mt-2 w-56 bg-white dark:bg-gray-800 rounded-2xl shadow-xl border border-gray-200 dark:border-gray-700 py-2 z-50 animate-in fade-in slide-in-from-top-2 duration-200">
                    {/* Close Shift */}
                    <button
                      onClick={() => {
                        setIsDropdownOpen(false);
                        console.log('Close Shift clicked');
                      }}
                      className="w-full flex items-center space-x-3 px-4 py-3 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors duration-150 text-left"
                    >
                      <div className="w-9 h-9 rounded-xl bg-orange-100 dark:bg-orange-900/30 flex items-center justify-center">
                        <Power className="w-5 h-5 text-orange-600 dark:text-orange-400" />
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-gray-900 dark:text-white">Close Shift</p>
                        <p className="text-xs text-gray-500 dark:text-gray-400">End current work session</p>
                      </div>
                    </button>

                    {/* EOD (End of Day) */}
                    <button
                      onClick={() => {
                        setIsDropdownOpen(false);
                        console.log('EOD clicked');
                      }}
                      className="w-full flex items-center space-x-3 px-4 py-3 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors duration-150 text-left"
                    >
                      <div className="w-9 h-9 rounded-xl bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center">
                        <Calendar className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-gray-900 dark:text-white">EOD</p>
                        <p className="text-xs text-gray-500 dark:text-gray-400">End of day report</p>
                      </div>
                    </button>

                    {/* Divider */}
                    <div className="my-2 border-t border-gray-200 dark:border-gray-700"></div>

                    {/* Logout */}
                    <button
                      onClick={() => {
                        setIsDropdownOpen(false);
                        console.log('Logout clicked');
                      }}
                      className="w-full flex items-center space-x-3 px-4 py-3 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors duration-150 text-left"
                    >
                      <div className="w-9 h-9 rounded-xl bg-red-100 dark:bg-red-900/30 flex items-center justify-center">
                        <LogOut className="w-5 h-5 text-red-600 dark:text-red-400" />
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-red-600 dark:text-red-400">Logout</p>
                        <p className="text-xs text-gray-500 dark:text-gray-400">Sign out of your account</p>
                      </div>
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </nav>

      {/* Bottom Tab Navigation - Only visible on mobile/tablet */}
      <nav className="lg:hidden fixed bottom-0 left-0 right-0 bg-white dark:bg-gray-950 border-t border-gray-200 dark:border-gray-800 z-50 pb-safe transform-none">
        <div className="grid grid-cols-4 h-16">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.path;

            return (
              <Link
                key={item.id}
                to={item.path}
                className={`flex flex-col items-center justify-center space-y-1 transition-all duration-200 ${
                  isActive
                    ? 'text-emerald-600 dark:text-emerald-400'
                    : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200'
                }`}
              >
                <Icon className={`w-6 h-6 ${isActive ? 'scale-110' : ''} transition-transform`} />
                <span className={`text-xs font-medium ${isActive ? 'font-bold' : ''}`}>
                  {item.label}
                </span>
              </Link>
            );
          })}
        </div>
      </nav>
    </>
  );
}
