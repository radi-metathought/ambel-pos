import { Home, ShoppingCart, Package, Users, BarChart3, Settings, LogOut } from 'lucide-react';
import { useState } from 'react';

interface SidebarProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
}

const menuItems = [
  { id: 'dashboard', label: 'Dashboard', icon: Home },
  { id: 'orders', label: 'Orders', icon: ShoppingCart },
  { id: 'products', label: 'Products', icon: Package },
  { id: 'customers', label: 'Customers', icon: Users },
  { id: 'analytics', label: 'Analytics', icon: BarChart3 },
  { id: 'settings', label: 'Settings', icon: Settings },
];

export default function Sidebar({ activeTab, onTabChange }: SidebarProps) {
  const [isCollapsed, setIsCollapsed] = useState(false);

  return (
    <aside
      className={`fixed left-0 top-0 h-screen bg-white dark:bg-gray-950 border-r border-gray-200 dark:border-gray-800 transition-all duration-300 ease-in-out z-40 ${
        isCollapsed ? 'w-20' : 'w-64'
      }`}
    >
      {/* Logo Section */}
      <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-800">
        {!isCollapsed && (
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gray-600 dark:bg-gray-700 rounded-xl flex items-center justify-center shadow-sm">
              <ShoppingCart className="w-6 h-6 text-white dark:text-gray-100" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-gray-900 dark:text-white">
                POS System
              </h1>
            </div>
          </div>
        )}
        <button
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="p-2 hover:bg-gray-100 dark:hover:bg-gray-900 rounded-lg transition-colors"
        >
          <div className="w-5 h-0.5 bg-gray-900 dark:bg-gray-100 mb-1 transition-transform"></div>
          <div className="w-5 h-0.5 bg-gray-900 dark:bg-gray-100 mb-1 transition-transform"></div>
          <div className="w-5 h-0.5 bg-gray-900 dark:bg-gray-100 transition-transform"></div>
        </button>
      </div>

      {/* Navigation Menu */}
      <nav className="p-4 space-y-2">
        {menuItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;

          return (
            <button
              key={item.id}
              onClick={() => onTabChange(item.id)}
              className={`w-full flex items-center ${isCollapsed ? 'justify-center' : 'space-x-3'} px-4 py-3 rounded-xl transition-all duration-200 group ${
                isActive
                  ? 'bg-white dark:bg-gray-900 text-gray-900 dark:text-white shadow-lg border-2 border-gray-200 dark:border-gray-700 scale-105'
                  : 'hover:bg-gray-100 dark:hover:bg-gray-900 text-gray-700 dark:text-gray-300 hover:scale-105 border-2 border-transparent'
              }`}
            >
              <Icon
                className={`${isCollapsed ? 'w-6 h-6' : 'w-5 h-5'} transition-all group-hover:scale-110 ${
                  isActive ? 'text-gray-900 dark:text-white' : 'text-gray-600 dark:text-gray-400'
                }`}
              />
              {!isCollapsed && (
                <span className="font-medium transition-colors">
                  {item.label}
                </span>
              )}
            </button>
          );
        })}
      </nav>

      {/* User Section */}
      <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-gray-200 dark:border-gray-800">
        <button className={`w-full flex items-center ${isCollapsed ? 'justify-center' : 'space-x-3'} px-4 py-3 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-900 transition-all duration-200 group text-gray-700 dark:text-gray-300`}>
          <LogOut className={`${isCollapsed ? 'w-6 h-6' : 'w-5 h-5'} text-gray-600 dark:text-gray-400 group-hover:text-red-500 dark:group-hover:text-red-400 transition-all`} />
          {!isCollapsed && (
            <span className="font-medium group-hover:text-red-500 dark:group-hover:text-red-400 transition-colors">
              Logout
            </span>
          )}
        </button>
      </div>
    </aside>
  );
}
