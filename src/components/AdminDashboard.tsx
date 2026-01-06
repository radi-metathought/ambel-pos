import { useState, useEffect } from 'react';
import { useNavigate, useLocation, Outlet } from 'react-router-dom';
import {
  Users,
  Package,
  FolderTree,
  Settings,
  LogOut,
  Plus,
  Edit,
  Trash2,
  Search,
  Filter,
  Download,
  TrendingUp,
  ShoppingCart,
  DollarSign,
  Menu,
  X,
  Home,
  Bell,
  FileText,
  ChevronDown,
  ChefHat,
  MapPin,
  CreditCard,
  Percent,
  Gift,
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import toast from 'react-hot-toast';
import logo from '../assets/logo.jpg';

type TabType = 
  | 'overview' 
  | 'products' 
  | 'categories'
  | 'recipes' 
  | 'purchase-stock'
  | 'purchase-invoices'
  | 'suppliers'
  | 'stock-adjustments'
  | 'branches'
  | 'tables'
  | 'payment-method'
  | 'discounts'
  | 'promotions'
  | 'exchange-rate'
  | 'currency-management'
  | 'other-expense'
  | 'other-income'
  | 'reports'
  | 'users'
  | 'tax-settings'
  | 'settings';

const AdminDashboard = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [managementOpen, setManagementOpen] = useState(true);

  // Get current active tab from URL
  const getCurrentTab = (): TabType => {
    const path = location.pathname.split('/').pop();
    return (path === 'dashboard' ? 'overview' : path) as TabType;
  };

  const activeTab = getCurrentTab();

  useEffect(() => {
    const isAuthenticated = localStorage.getItem('adminAuth');
    if (!isAuthenticated) {
      toast.error('Please login to access admin panel');
      navigate('/admin');
    }
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem('adminAuth');
    toast.success('Logged out successfully');
    navigate('/admin');
  };

  const handleNavigation = (tabId: string) => {
    if (tabId === 'overview') {
      navigate('/admin/dashboard');
    } else {
      navigate(`/admin/dashboard/${tabId}`);
    }
  };

  const stats = [
    {
      title: 'Total Revenue',
      value: '$45,231.89',
      change: '+20.1%',
      icon: DollarSign,
      color: 'from-green-500 to-emerald-600',
      bgColor: 'bg-green-50 dark:bg-green-950/20',
    },
    {
      title: 'Total Orders',
      value: '2,345',
      change: '+15.3%',
      icon: ShoppingCart,
      color: 'from-blue-500 to-indigo-600',
      bgColor: 'bg-blue-50 dark:bg-blue-950/20',
    },
    {
      title: 'Total Products',
      value: '456',
      change: '+4.5%',
      icon: Package,
      color: 'from-purple-500 to-pink-600',
      bgColor: 'bg-purple-50 dark:bg-purple-950/20',
    },
    {
      title: 'Active Users',
      value: '892',
      change: '+12.5%',
      icon: Users,
      color: 'from-orange-500 to-red-600',
      bgColor: 'bg-orange-50 dark:bg-orange-950/20',
    },
  ];

  const menuItems = [
    // Main
    {
      id: 'overview',
      label: 'Overview',
      icon: Home,
      group: 'main',
    },
    // Inventory Management
    {
      id: 'products',
      label: 'Products',
      icon: Package,
      group: 'inventory',
    },
    {
      id: 'categories',
      label: 'Categories',
      icon: FolderTree,
      group: 'inventory',
    },
    {
      id: 'recipes',
      label: 'Recipes',
      icon: ChefHat,
      group: 'inventory',
    },
    // Stock Control
    {
      id: 'purchase-stock',
      label: 'Purchase Orders',
      icon: ShoppingCart,
      group: 'stock-control',
    },
    {
      id: 'purchase-invoices',
      label: 'Purchase Invoices',
      icon: FileText,
      group: 'stock-control',
    },
    {
      id: 'suppliers',
      label: 'Suppliers',
      icon: Users,
      group: 'stock-control',
    },
    {
      id: 'stock-adjustments',
      label: 'Stock Adjustments',
      icon: Package,
      group: 'stock-control',
    },
    // Operations
    {
      id: 'branches',
      label: 'Branches',
      icon: MapPin,
      group: 'operations',
    },
    {
      id: 'tables',
      label: 'Tables',
      icon: Package,
      group: 'operations',
    },
    {
      id: 'payment-method',
      label: 'Payment Method',
      icon: CreditCard,
      group: 'operations',
    },
    {
      id: 'discounts',
      label: 'Discounts',
      icon: Percent,
      group: 'operations',
    },
    {
      id: 'promotions',
      label: 'Promotions',
      icon: Gift,
      group: 'operations',
    },
    // Financial
    {
      id: 'exchange-rate',
      label: 'Exchange Rate',
      icon: TrendingUp,
      group: 'financial',
    },
    {
      id: 'currency-management',
      label: 'Currency Management',
      icon: DollarSign,
      group: 'financial',
    },
    {
      id: 'other-expense',
      label: 'Other Expense',
      icon: FileText,
      group: 'financial',
    },
    {
      id: 'other-income',
      label: 'Other Income',
      icon: TrendingUp,
      group: 'financial',
    },
    // Reports
    {
      id: 'reports',
      label: 'Reports',
      icon: FileText,
      group: 'reports',
    },
    // System
    {
      id: 'users',
      label: 'Users',
      icon: Users,
      group: 'system',
    },
    {
      id: 'tax-settings',
      label: 'Tax Settings',
      icon: Settings,
      group: 'system',
    },
    {
      id: 'settings',
      label: 'Settings',
      icon: Settings,
      group: 'system',
    },
  ];

  return (
    <div className="flex h-screen bg-gray-100 dark:bg-gray-950 overflow-hidden">
      {/* Sidebar */}
      <aside
        className={`${
          sidebarOpen ? 'w-64' : 'w-20'
        } bg-white dark:bg-gray-900 border-r border-gray-200 dark:border-gray-800 transition-all duration-300 flex flex-col`}
      >
        {/* Logo Header */}
        <div className="p-4 border-b border-gray-200 dark:border-gray-800">
          <div className="flex items-center justify-between">
            {sidebarOpen ? (
              <div className="flex items-center space-x-3">
                <img src={logo} alt="Logo" className="w-9 h-9 rounded-lg object-cover" />
                <div>
                  <h1 className="text-base font-bold text-gray-900 dark:text-white">
                    Admin Panel
                  </h1>
                  <p className="text-xs text-gray-500 dark:text-gray-400">Management</p>
                </div>
              </div>
            ) : (
              <img src={logo} alt="Logo" className="w-9 h-9 rounded-lg object-cover mx-auto" />
            )}
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="p-1.5 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-md transition-colors"
            >
              {sidebarOpen ? <X className="w-4 h-4 text-gray-600 dark:text-gray-400" /> : <Menu className="w-4 h-4 text-gray-600 dark:text-gray-400" />}
            </button>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 overflow-y-auto p-3 space-y-1">
          {/* Main */}
          {menuItems
            .filter((item) => item.group === 'main')
            .map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => handleNavigation(item.id)}
                  className={`w-full flex items-center ${
                    sidebarOpen ? 'justify-start space-x-3 px-3' : 'justify-center'
                  } py-2.5 rounded-md text-sm font-medium transition-all duration-150 ${
                    isActive
                      ? 'bg-gray-700 text-white'
                      : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800'
                  }`}
                >
                  <Icon className="w-5 h-5" />
                  {sidebarOpen && <span>{item.label}</span>}
                </button>
              );
            })}

          {/* Inventory Management Section */}
          {sidebarOpen && (
            <div className="pt-3 pb-1">
              <button
                onClick={() => setManagementOpen(!managementOpen)}
                className="w-full flex items-center justify-between px-3 py-1.5 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide"
              >
                <span>Inventory</span>
                <ChevronDown
                  className={`w-3.5 h-3.5 transition-transform ${managementOpen ? 'rotate-180' : ''}`}
                />
              </button>
            </div>
          )}

          <AnimatePresence>
            {(managementOpen || !sidebarOpen) &&
              menuItems
                .filter((item) => item.group === 'inventory')
                .map((item) => {
                  const Icon = item.icon;
                  const isActive = activeTab === item.id;
                  return (
                    <motion.button
                      key={item.id}
                      initial={sidebarOpen ? { opacity: 0, height: 0 } : {}}
                      animate={sidebarOpen ? { opacity: 1, height: 'auto' } : {}}
                      exit={sidebarOpen ? { opacity: 0, height: 0 } : {}}
                      onClick={() => handleNavigation(item.id)}
                      className={`w-full flex items-center ${
                        sidebarOpen ? 'justify-start space-x-3 px-3' : 'justify-center'
                      } py-2.5 rounded-md text-sm font-medium transition-all duration-150 ${
                        isActive
                          ? 'bg-gray-700 text-white'
                          : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800'
                      }`}
                    >
                      <Icon className="w-5 h-5" />
                      {sidebarOpen && <span>{item.label}</span>}
                    </motion.button>
                  );
                })}
          </AnimatePresence>

          {/* Stock Control Section */}
          {sidebarOpen && menuItems.some(item => item.group === 'stock-control') && (
            <div className="pt-3 pb-1">
              <div className="px-3 py-1.5 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide">
                Stock Control
              </div>
            </div>
          )}

          {menuItems
            .filter((item) => item.group === 'stock-control')
            .map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => handleNavigation(item.id)}
                  className={`w-full flex items-center ${
                    sidebarOpen ? 'justify-start space-x-3 px-3' : 'justify-center'
                  } py-2.5 rounded-md text-sm font-medium transition-all duration-150 ${
                    isActive
                      ? 'bg-gray-700 text-white'
                      : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800'
                  }`}
                >
                  <Icon className="w-5 h-5" />
                  {sidebarOpen && <span>{item.label}</span>}
                </button>
              );
            })}

          {/* Operations Section */}
          {sidebarOpen && menuItems.some(item => item.group === 'operations') && (
            <div className="pt-3 pb-1">
              <div className="px-3 py-1.5 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide">
                Operations
              </div>
            </div>
          )}

          {menuItems
            .filter((item) => item.group === 'operations')
            .map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => handleNavigation(item.id)}
                  className={`w-full flex items-center ${
                    sidebarOpen ? 'justify-start space-x-3 px-3' : 'justify-center'
                  } py-2.5 rounded-md text-sm font-medium transition-all duration-150 ${
                    isActive
                      ? 'bg-gray-700 text-white'
                      : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800'
                  }`}
                >
                  <Icon className="w-5 h-5" />
                  {sidebarOpen && <span>{item.label}</span>}
                </button>
              );
            })}

          {/* Financial Management Section */}
          {sidebarOpen && menuItems.some(item => item.group === 'financial') && (
            <div className="pt-3 pb-1">
              <div className="px-3 py-1.5 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide">
                Financial
              </div>
            </div>
          )}

          {menuItems
            .filter((item) => item.group === 'financial')
            .map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => handleNavigation(item.id)}
                  className={`w-full flex items-center ${
                    sidebarOpen ? 'justify-start space-x-3 px-3' : 'justify-center'
                  } py-2.5 rounded-md text-sm font-medium transition-all duration-150 ${
                    isActive
                      ? 'bg-gray-700 text-white'
                      : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800'
                  }`}
                >
                  <Icon className="w-5 h-5" />
                  {sidebarOpen && <span>{item.label}</span>}
                </button>
              );
            })}

          {/* Reports Section */}
          {sidebarOpen && menuItems.some(item => item.group === 'reports') && (
            <div className="pt-3 pb-1">
              <div className="px-3 py-1.5 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide">
                Reports
              </div>
            </div>
          )}

          {menuItems
            .filter((item) => item.group === 'reports')
            .map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => handleNavigation(item.id)}
                  className={`w-full flex items-center ${
                    sidebarOpen ? 'justify-start space-x-3 px-3' : 'justify-center'
                  } py-2.5 rounded-md text-sm font-medium transition-all duration-150 ${
                    isActive
                      ? 'bg-gray-700 text-white'
                      : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800'
                  }`}
                >
                  <Icon className="w-5 h-5" />
                  {sidebarOpen && <span>{item.label}</span>}
                </button>
              );
            })}

          {/* System Section */}
          {sidebarOpen && menuItems.some(item => item.group === 'system') && (
            <div className="pt-3 pb-1">
              <div className="px-3 py-1.5 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide">
                System
              </div>
            </div>
          )}

          {menuItems
            .filter((item) => item.group === 'system')
            .map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => handleNavigation(item.id)}
                  className={`w-full flex items-center ${
                    sidebarOpen ? 'justify-start space-x-3 px-3' : 'justify-center'
                  } py-2.5 rounded-md text-sm font-medium transition-all duration-150 ${
                    isActive
                      ? 'bg-gray-700 text-white'
                      : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800'
                  }`}
                >
                  <Icon className="w-5 h-5" />
                  {sidebarOpen && <span>{item.label}</span>}
                </button>
              );
            })}
        </nav>

        {/* Logout Button */}
        <div className="p-3 border-t border-gray-200 dark:border-gray-800">
          <button
            onClick={handleLogout}
            className={`w-full flex items-center ${
              sidebarOpen ? 'justify-start space-x-3 px-3' : 'justify-center'
            } py-2.5 bg-red-600 hover:bg-red-700 text-white rounded-md transition-all duration-150 text-sm font-medium`}
          >
            <LogOut className="w-5 h-5" />
            {sidebarOpen && <span>Logout</span>}
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <header className="bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800 px-6 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-bold text-gray-900 dark:text-white capitalize">
                {activeTab.replace('-', ' ')}
              </h2>
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-0.5">
                Manage your {activeTab.replace('-', ' ')}
              </p>
            </div>
            <div className="flex items-center space-x-3">
              <button className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors relative">
                <Bell className="w-5 h-5 text-gray-600 dark:text-gray-400" />
                <span className="absolute top-1 right-1 w-2 h-2 bg-gray-500 rounded-full"></span>
              </button>
              <div className="flex items-center space-x-3">
                <div className="w-9 h-9 bg-gray-600 dark:bg-gray-700 rounded-full flex items-center justify-center text-white font-semibold text-sm">
                  A
                </div>
              </div>
            </div>
          </div>
        </header>

        {/* Content Area */}
        <main className="flex-1 overflow-y-auto p-6 bg-gray-50 dark:bg-gray-900">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

// Overview Tab Component
const OverviewTab = ({ stats }: { stats: any[] }) => {
  const recentOrders = [
    {
      id: '#ORD-1234',
      customer: 'John Doe',
      items: 3,
      amount: '$45.50',
      status: 'Completed',
      time: '5 min ago',
    },
    {
      id: '#ORD-1233',
      customer: 'Jane Smith',
      items: 2,
      amount: '$28.00',
      status: 'Processing',
      time: '12 min ago',
    },
    {
      id: '#ORD-1232',
      customer: 'Bob Wilson',
      items: 5,
      amount: '$67.25',
      status: 'Completed',
      time: '18 min ago',
    },
    {
      id: '#ORD-1231',
      customer: 'Alice Brown',
      items: 1,
      amount: '$15.00',
      status: 'Completed',
      time: '25 min ago',
    },
  ];

  const topProducts = [
    { name: 'Espresso Coffee', sales: 145, revenue: '$652.50', trend: '+12%' },
    { name: 'Croissant', sales: 98, revenue: '$294.00', trend: '+8%' },
    { name: 'Latte', sales: 87, revenue: '$391.50', trend: '+15%' },
    { name: 'Chocolate Cake', sales: 76, revenue: '$456.00', trend: '+5%' },
  ];

  const quickActions = [
    { label: 'Add Product', icon: Plus, color: 'from-amber-500 to-yellow-500' },
    { label: 'New Order', icon: ShoppingCart, color: 'from-amber-600 to-orange-500' },
    { label: 'Add User', icon: Users, color: 'from-yellow-500 to-amber-500' },
    { label: 'View Reports', icon: FileText, color: 'from-orange-500 to-amber-600' },
  ];

  return (
    <div className="space-y-6">
      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              className="bg-white dark:bg-gray-800 rounded-lg p-4 border border-gray-200 dark:border-gray-700 hover:border-gray-400 dark:hover:border-gray-500 transition-all duration-200"
            >
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mb-1 uppercase tracking-wide">{stat.title}</p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white mb-2">{stat.value}</p>
                  <span className="text-xs text-green-600 dark:text-green-400 font-medium flex items-center">
                    <TrendingUp className="w-3 h-3 mr-1" />
                    {stat.change}
                  </span>
                </div>
                <div className="p-2 rounded-lg bg-gray-600 dark:bg-gray-700">
                  <Icon className="w-5 h-5 text-white" />
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Revenue Chart & Quick Actions */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Revenue Chart */}
        <div className="lg:col-span-2 bg-white dark:bg-gray-800 rounded-lg p-5 border border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-base font-bold text-gray-900 dark:text-white">Revenue Overview</h2>
              <p className="text-xs text-gray-500 dark:text-gray-400">Last 7 days performance</p>
            </div>
            <select className="px-3 py-1.5 text-xs border border-gray-200 dark:border-gray-700 rounded-md bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:border-transparent">
              <option>7 days</option>
              <option>30 days</option>
              <option>90 days</option>
            </select>
          </div>
          <div className="h-64 flex items-end justify-between space-x-2">
            {[65, 45, 78, 52, 88, 95, 72].map((height, index) => (
              <div key={index} className="flex-1 flex flex-col items-center space-y-2">
                <motion.div
                  initial={{ height: 0 }}
                  animate={{ height: `${height}%` }}
                  transition={{ delay: index * 0.1, duration: 0.5 }}
                  className="w-full bg-gray-600 dark:bg-gray-700 rounded-t hover:bg-gray-700 dark:hover:bg-gray-600 transition-all cursor-pointer relative group"
                >
                  <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 bg-gray-900 dark:bg-gray-100 text-white dark:text-gray-900 text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                    ${(height * 100).toFixed(0)}
                  </div>
                </motion.div>
                <span className="text-xs text-gray-500 dark:text-gray-400">
                  {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'][index]}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Quick Actions */}
        <div className="bg-white dark:bg-gray-800 rounded-lg p-5 border border-gray-200 dark:border-gray-700">
          <h2 className="text-base font-bold text-gray-900 dark:text-white mb-4">Quick Actions</h2>
          <div className="space-y-2">
            {quickActions.map((action, index) => {
              const Icon = action.icon;
              return (
                <motion.button
                  key={index}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="w-full flex items-center space-x-3 p-3 rounded-md border border-gray-200 dark:border-gray-700 hover:border-gray-400 dark:hover:border-gray-500 hover:bg-gray-50 dark:hover:bg-gray-700 transition-all group"
                >
                  <div className="p-2 rounded-md bg-gray-600 dark:bg-gray-700">
                    <Icon className="w-4 h-4 text-white" />
                  </div>
                  <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    {action.label}
                  </span>
                </motion.button>
              );
            })}
          </div>

          {/* System Status */}
          <div className="mt-6 pt-6 border-t border-gray-200 dark:border-gray-700">
            <h3 className="text-sm font-semibold text-gray-900 dark:text-white mb-3">System Status</h3>
            <div className="space-y-2">
              {[
                { label: 'Server', status: 'Healthy' },
                { label: 'Database', status: 'Healthy' },
                { label: 'API', status: 'Healthy' },
              ].map((item, index) => (
                <div key={index} className="flex items-center justify-between">
                  <span className="text-xs text-gray-600 dark:text-gray-400">{item.label}</span>
                  <div className="flex items-center space-x-1">
                    <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                    <span className="text-xs text-green-600 dark:text-green-400 font-medium">
                      {item.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Recent Orders & Top Products */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Orders */}
        <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 overflow-hidden">
          <div className="p-4 border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-base font-bold text-gray-900 dark:text-white">Recent Orders</h2>
                <p className="text-xs text-gray-500 dark:text-gray-400">Latest transactions</p>
              </div>
              <button className="text-xs text-gray-600 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 font-medium">
                View All
              </button>
            </div>
          </div>
          <div className="divide-y divide-gray-200 dark:divide-gray-700">
            {recentOrders.map((order, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.05 }}
                className="p-3 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors cursor-pointer"
              >
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-gray-600 dark:bg-gray-700 rounded-md flex items-center justify-center">
                      <ShoppingCart className="w-4 h-4 text-white" />
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-gray-900 dark:text-white">{order.id}</p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">{order.customer}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-bold text-gray-900 dark:text-white">{order.amount}</p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">{order.items} items</p>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <span
                    className={`px-2 py-0.5 text-xs font-medium rounded-full ${
                      order.status === 'Completed'
                        ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400'
                        : 'bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400'
                    }`}
                  >
                    {order.status}
                  </span>
                  <span className="text-xs text-gray-400 dark:text-gray-500">{order.time}</span>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Top Products */}
        <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 overflow-hidden">
          <div className="p-4 border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-base font-bold text-gray-900 dark:text-white">Top Products</h2>
                <p className="text-xs text-gray-500 dark:text-gray-400">Best sellers this week</p>
              </div>
              <button className="text-xs text-gray-600 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 font-medium">
                View All
              </button>
            </div>
          </div>
          <div className="divide-y divide-gray-200 dark:divide-gray-700">
            {topProducts.map((product, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.05 }}
                className="p-3 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
              >
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-gray-600 dark:bg-gray-700 rounded-md flex items-center justify-center text-white font-bold text-xs">
                      #{index + 1}
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-gray-900 dark:text-white">
                        {product.name}
                      </p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">{product.sales} sales</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-bold text-gray-900 dark:text-white">{product.revenue}</p>
                    <span className="text-xs text-green-600 dark:text-green-400 font-medium">
                      {product.trend}
                    </span>
                  </div>
                </div>
                <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-1.5 overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${(product.sales / 145) * 100}%` }}
                    transition={{ delay: index * 0.1, duration: 0.5 }}
                    className="h-full bg-gray-600 dark:bg-gray-700 rounded-full"
                  />
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

// Products Tab Component
const ProductsTab = ({
  searchQuery,
  setSearchQuery,
}: {
  searchQuery: string;
  setSearchQuery: (q: string) => void;
}) => {
  const products = [
    {
      id: 1,
      name: 'Espresso Coffee',
      category: 'Beverages',
      price: '$4.50',
      stock: 120,
      status: 'Active',
    },
    {
      id: 2,
      name: 'Croissant',
      category: 'Bakery',
      price: '$3.00',
      stock: 45,
      status: 'Active',
    },
    {
      id: 3,
      name: 'Green Tea',
      category: 'Beverages',
      price: '$2.50',
      stock: 80,
      status: 'Active',
    },
    {
      id: 4,
      name: 'Chocolate Cake',
      category: 'Desserts',
      price: '$6.00',
      stock: 15,
      status: 'Low Stock',
    },
  ];

  return (
    <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-xl border border-gray-200 dark:border-gray-800">
      <div className="p-6 border-b border-gray-200 dark:border-gray-800">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Product Management</h2>
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1 md:w-64">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search products..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>
            <button className="flex items-center justify-center space-x-2 px-4 py-2 bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors">
              <Filter className="w-4 h-4" />
              <span>Filter</span>
            </button>
            <button className="flex items-center justify-center space-x-2 px-4 py-2 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-lg shadow-lg hover:from-indigo-700 hover:to-purple-700 transition-all duration-200 hover:scale-105">
              <Plus className="w-4 h-4" />
              <span>Add Product</span>
            </button>
          </div>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50 dark:bg-gray-800">
            <tr>
              <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wider">
                Product Name
              </th>
              <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wider">
                Category
              </th>
              <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wider">
                Price
              </th>
              <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wider">
                Stock
              </th>
              <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wider">
                Status
              </th>
              <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200 dark:divide-gray-800">
            {products.map((product) => (
              <tr key={product.id} className="hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm font-medium text-gray-900 dark:text-white">
                    {product.name}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-700 dark:text-gray-300">{product.category}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm font-semibold text-gray-900 dark:text-white">
                    {product.price}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-700 dark:text-gray-300">{product.stock}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span
                    className={`px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                      product.status === 'Active'
                        ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                        : 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200'
                    }`}
                  >
                    {product.status}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                  <div className="flex items-center space-x-3">
                    <button className="text-indigo-600 hover:text-indigo-900 dark:text-indigo-400 dark:hover:text-indigo-300 transition-colors">
                      <Edit className="w-4 h-4" />
                    </button>
                    <button className="text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-300 transition-colors">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

// Categories Tab Component
const CategoriesTab = ({
  searchQuery,
  setSearchQuery,
}: {
  searchQuery: string;
  setSearchQuery: (q: string) => void;
}) => {
  const categories = [
    {
      id: 1,
      name: 'Beverages',
      products: 45,
      description: 'Hot and cold drinks',
      status: 'Active',
    },
    {
      id: 2,
      name: 'Bakery',
      products: 23,
      description: 'Fresh baked goods',
      status: 'Active',
    },
    {
      id: 3,
      name: 'Desserts',
      products: 18,
      description: 'Sweet treats',
      status: 'Active',
    },
    { id: 4, name: 'Snacks', products: 32, description: 'Quick bites', status: 'Active' },
  ];

  return (
    <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-xl border border-gray-200 dark:border-gray-800">
      <div className="p-6 border-b border-gray-200 dark:border-gray-800">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Category Management</h2>
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1 md:w-64">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search categories..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>
            <button className="flex items-center justify-center space-x-2 px-4 py-2 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-lg shadow-lg hover:from-indigo-700 hover:to-purple-700 transition-all duration-200 hover:scale-105">
              <Plus className="w-4 h-4" />
              <span>Add Category</span>
            </button>
          </div>
        </div>
      </div>

      <div className="p-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {categories.map((category) => (
          <motion.div
            key={category.id}
            whileHover={{ scale: 1.02 }}
            className="bg-gradient-to-br from-gray-50 to-white dark:from-gray-800 dark:to-gray-900 rounded-xl p-6 border border-gray-200 dark:border-gray-700 shadow-lg hover:shadow-xl transition-all duration-300"
          >
            <div className="flex items-start justify-between mb-4">
              <div className="p-3 bg-indigo-100 dark:bg-indigo-900 rounded-lg">
                <FolderTree className="w-6 h-6 text-indigo-600 dark:text-indigo-400" />
              </div>
              <span className="px-3 py-1 text-xs font-semibold rounded-full bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200">
                {category.status}
              </span>
            </div>
            <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">
              {category.name}
            </h3>
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">{category.description}</p>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-500 dark:text-gray-400">
                {category.products} products
              </span>
              <div className="flex items-center space-x-2">
                <button className="p-2 text-indigo-600 hover:bg-indigo-50 dark:text-indigo-400 dark:hover:bg-indigo-900/50 rounded-lg transition-colors">
                  <Edit className="w-4 h-4" />
                </button>
                <button className="p-2 text-red-600 hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-900/50 rounded-lg transition-colors">
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

// Users Tab Component
const UsersTab = ({
  searchQuery,
  setSearchQuery,
}: {
  searchQuery: string;
  setSearchQuery: (q: string) => void;
}) => {
  const users = [
    {
      id: 1,
      name: 'John Doe',
      email: 'john@example.com',
      role: 'Admin',
      status: 'Active',
      lastLogin: '2 hours ago',
    },
    {
      id: 2,
      name: 'Jane Smith',
      email: 'jane@example.com',
      role: 'Manager',
      status: 'Active',
      lastLogin: '1 day ago',
    },
    {
      id: 3,
      name: 'Bob Johnson',
      email: 'bob@example.com',
      role: 'Cashier',
      status: 'Active',
      lastLogin: '3 hours ago',
    },
    {
      id: 4,
      name: 'Alice Brown',
      email: 'alice@example.com',
      role: 'Cashier',
      status: 'Inactive',
      lastLogin: '1 week ago',
    },
  ];

  return (
    <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-xl border border-gray-200 dark:border-gray-800">
      <div className="p-6 border-b border-gray-200 dark:border-gray-800">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">User Management</h2>
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1 md:w-64">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search users..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>
            <button className="flex items-center justify-center space-x-2 px-4 py-2 bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors">
              <Download className="w-4 h-4" />
              <span>Export</span>
            </button>
            <button className="flex items-center justify-center space-x-2 px-4 py-2 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-lg shadow-lg hover:from-indigo-700 hover:to-purple-700 transition-all duration-200 hover:scale-105">
              <Plus className="w-4 h-4" />
              <span>Add User</span>
            </button>
          </div>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50 dark:bg-gray-800">
            <tr>
              <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wider">
                Name
              </th>
              <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wider">
                Email
              </th>
              <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wider">
                Role
              </th>
              <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wider">
                Status
              </th>
              <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wider">
                Last Login
              </th>
              <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200 dark:divide-gray-800">
            {users.map((user) => (
              <tr key={user.id} className="hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    <div className="flex-shrink-0 h-10 w-10 bg-gradient-to-br from-indigo-600 to-purple-600 rounded-full flex items-center justify-center text-white font-semibold">
                      {user.name
                        .split(' ')
                        .map((n) => n[0])
                        .join('')}
                    </div>
                    <div className="ml-4">
                      <div className="text-sm font-medium text-gray-900 dark:text-white">
                        {user.name}
                      </div>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-700 dark:text-gray-300">{user.email}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className="px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200">
                    {user.role}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span
                    className={`px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                      user.status === 'Active'
                        ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                        : 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300'
                    }`}
                  >
                    {user.status}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-700 dark:text-gray-300">{user.lastLogin}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                  <div className="flex items-center space-x-3">
                    <button className="text-indigo-600 hover:text-indigo-900 dark:text-indigo-400 dark:hover:text-indigo-300 transition-colors">
                      <Edit className="w-4 h-4" />
                    </button>
                    <button className="text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-300 transition-colors">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

// Settings Tab Component
const SettingsTab = () => {
  return (
    <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-xl border border-gray-200 dark:border-gray-800 p-6">
      <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">System Settings</h2>
      <div className="space-y-6">
        <div className="p-6 bg-gray-50 dark:bg-gray-800 rounded-xl">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            General Settings
          </h3>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Store Name
              </label>
              <input
                type="text"
                defaultValue="My POS Store"
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Currency
              </label>
              <select className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500">
                <option>USD ($)</option>
                <option>EUR (€)</option>
                <option>GBP (£)</option>
              </select>
            </div>
          </div>
        </div>

        <div className="p-6 bg-gray-50 dark:bg-gray-800 rounded-xl">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Notifications</h3>
          <div className="space-y-3">
            {['Email notifications', 'Low stock alerts', 'New order alerts', 'Daily reports'].map(
              (setting, index) => (
                <div key={index} className="flex items-center justify-between">
                  <span className="text-gray-700 dark:text-gray-300">{setting}</span>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input type="checkbox" className="sr-only peer" defaultChecked />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-indigo-300 dark:peer-focus:ring-indigo-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-indigo-600"></div>
                  </label>
                </div>
              )
            )}
          </div>
        </div>

        <div className="flex justify-end">
          <button className="px-6 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-lg shadow-lg hover:from-indigo-700 hover:to-purple-700 transition-all duration-200 hover:scale-105 font-semibold">
            Save Changes
          </button>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
