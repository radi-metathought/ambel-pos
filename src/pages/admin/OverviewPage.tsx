import { motion } from 'framer-motion';
import {
  TrendingUp,
  ShoppingCart,
  Plus,
  FileText,
  Users,
  DollarSign,
  Package,
} from 'lucide-react';

const OverviewPage = () => {
  const stats = [
    {
      title: 'Total Revenue',
      value: '$45,231.89',
      change: '+20.1%',
      icon: DollarSign,
    },
    {
      title: 'Total Orders',
      value: '2,345',
      change: '+15.3%',
      icon: ShoppingCart,
    },
    {
      title: 'Total Products',
      value: '456',
      change: '+4.5%',
      icon: Package,
    },
    {
      title: 'Active Users',
      value: '892',
      change: '+12.5%',
      icon: Users,
    },
  ];

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
    { label: 'Add Product', icon: Plus },
    { label: 'New Order', icon: ShoppingCart },
    { label: 'Add User', icon: Users },
    { label: 'View Reports', icon: FileText },
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
                  <p className="text-xs text-gray-500 dark:text-gray-400 mb-1 uppercase tracking-wide">
                    {stat.title}
                  </p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                    {stat.value}
                  </p>
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
              <h2 className="text-base font-bold text-gray-900 dark:text-white">
                Revenue Overview
              </h2>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                Last 7 days performance
              </p>
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
          <h2 className="text-base font-bold text-gray-900 dark:text-white mb-4">
            Quick Actions
          </h2>
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
            <h3 className="text-sm font-semibold text-gray-900 dark:text-white mb-3">
              System Status
            </h3>
            <div className="space-y-2">
              {[
                { label: 'Server', status: 'Healthy' },
                { label: 'Database', status: 'Healthy' },
                { label: 'API', status: 'Healthy' },
              ].map((item, index) => (
                <div key={index} className="flex items-center justify-between">
                  <span className="text-xs text-gray-600 dark:text-gray-400">
                    {item.label}
                  </span>
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
                <h2 className="text-base font-bold text-gray-900 dark:text-white">
                  Recent Orders
                </h2>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  Latest transactions
                </p>
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
                      <p className="text-sm font-semibold text-gray-900 dark:text-white">
                        {order.id}
                      </p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">
                        {order.customer}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-bold text-gray-900 dark:text-white">
                      {order.amount}
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      {order.items} items
                    </p>
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
                  <span className="text-xs text-gray-400 dark:text-gray-500">
                    {order.time}
                  </span>
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
                <h2 className="text-base font-bold text-gray-900 dark:text-white">
                  Top Products
                </h2>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  Best sellers this week
                </p>
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
                      <p className="text-xs text-gray-500 dark:text-gray-400">
                        {product.sales} sales
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-bold text-gray-900 dark:text-white">
                      {product.revenue}
                    </p>
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

export default OverviewPage;
