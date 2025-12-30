import { useState, useEffect } from 'react';
import { ShoppingBag, TrendingUp, TrendingDown, DollarSign, Coffee, User, Timer, Calendar, CreditCard } from 'lucide-react';
import { motion } from 'framer-motion';

export default function Dashboard() {
  // Shift timer state
  const [shiftTime, setShiftTime] = useState(0);
  const shiftStartTime = new Date();
  shiftStartTime.setHours(9, 0, 0); // Shift started at 9:00 AM

  useEffect(() => {
    const interval = setInterval(() => {
      const now = new Date();
      const diff = Math.floor((now.getTime() - shiftStartTime.getTime()) / 1000);
      setShiftTime(diff);
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  const formatTime = (seconds: number) => {
    const hrs = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    return `${hrs.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  // Current shift user data
  const userData = {
    name: 'John Smith',
    role: 'Barista',
    employeeId: 'EMP-001',
  };

  // Current shift hourly sales (from shift start to now)
  const shiftSalesData = [
    { time: '9:00 am', value: 25 },
    { time: '10:00 am', value: 65 },
    { time: '11:00 am', value: 95 },
    { time: '12:00 pm', value: 135 },
    { time: '1:00 pm', value: 115 },
    { time: '2:00 pm', value: 85 },
    { time: '3:00 pm', value: 95 },
    { time: 'Now', value: 105 },
  ];

  const maxValue = Math.max(...shiftSalesData.map(d => d.value));
  const currentOrders = shiftSalesData[shiftSalesData.length - 1].value;

  // Top drinks sold during this shift
  const topDrinksThisShift = [
    { id: 1, name: 'Iced Americano', category: 'Coffee', icon: '🧊', orders: 42, color: 'bg-blue-100' },
    { id: 2, name: 'Caramel Latte', category: 'Coffee', icon: '☕', orders: 38, color: 'bg-amber-100' },
    { id: 3, name: 'Cappuccino', category: 'Coffee', icon: '☕', orders: 29, color: 'bg-orange-100' },
    { id: 4, name: 'Matcha Latte', category: 'Tea', icon: '🍵', orders: 24, color: 'bg-green-100' },
    { id: 5, name: 'Mango Smoothie', category: 'Smoothie', icon: '🥭', orders: 18, color: 'bg-yellow-100' },
  ];

  // Recent orders from this shift
  const recentShiftOrders = [
    { id: 'ORD-543', time: '14:35', drink: 'Iced Latte', amount: '$5.50', status: 'Completed', type: 'Walk-in', payment: 'Cash' },
    { id: 'ORD-542', time: '14:32', drink: 'Cappuccino', amount: '$4.75', status: 'Completed', type: 'FoodPanda', payment: 'KHQR' },
    { id: 'ORD-541', time: '14:28', drink: 'Americano', amount: '$3.50', status: 'Completed', type: 'Grab', payment: 'KHQR' },
    { id: 'ORD-540', time: '14:25', drink: 'Matcha Latte', amount: '$6.00', status: 'Completed', type: 'Egets', payment: 'Cash' },
    { id: 'ORD-539', time: '14:20', drink: 'Caramel Latte', amount: '$5.25', status: 'Completed', type: 'WowNow', payment: 'Cash' },
  ];

  return (
    <div className="min-h-screen">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="pb-6"
      >
        <div className="max-w-[1600px] mx-auto flex items-center justify-between">
          <div>
            <h1 className="text-4xl font-bold text-gray-900 dark:text-white">Current Shift</h1>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Real-time data from your active shift</p>
          </div>
          <div className="px-4 py-2 bg-emerald-100 dark:bg-emerald-900/30 border border-emerald-200 dark:border-emerald-800 rounded-xl">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></div>
              <span className="text-sm font-bold text-emerald-700 dark:text-emerald-400">Shift Active</span>
            </div>
          </div>
        </div>
      </motion.div>

      <div className="max-w-[1600px] mx-auto space-y-6">
        {/* Shift Information Cards */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
        >
          {/* Current User Card */}
          <div className="bg-white dark:bg-gray-800 rounded-xl p-5 border border-gray-200 dark:border-gray-700 hover:shadow-md transition-all duration-300">
            <div className="flex items-center space-x-3 mb-3">
              <div className="w-10 h-10 rounded-lg bg-gray-100 dark:bg-gray-700 flex items-center justify-center">
                <User className="w-5 h-5 text-gray-600 dark:text-gray-400" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-xs font-medium text-gray-500 dark:text-gray-400 mb-1">Current User</p>
                <h3 className="text-sm font-bold text-gray-900 dark:text-white truncate">{userData.name}</h3>
              </div>
            </div>
            <div className="pt-3 border-t border-gray-100 dark:border-gray-700">
              <p className="text-xs text-gray-600 dark:text-gray-400">{userData.role} • {userData.employeeId}</p>
            </div>
          </div>

          {/* Shift Duration Card */}
          <div className="bg-white dark:bg-gray-800 rounded-xl p-5 border border-gray-200 dark:border-gray-700 hover:shadow-md transition-all duration-300">
            <div className="flex items-center space-x-3 mb-3">
              <div className="w-10 h-10 rounded-lg bg-gray-100 dark:bg-gray-700 flex items-center justify-center">
                <Timer className="w-5 h-5 text-gray-600 dark:text-gray-400" />
              </div>
              <div className="flex-1">
                <p className="text-xs font-medium text-gray-500 dark:text-gray-400 mb-1">Shift Duration</p>
                <div className="text-lg font-bold font-mono text-gray-900 dark:text-white">{formatTime(shiftTime)}</div>
              </div>
            </div>
            <div className="pt-3 border-t border-gray-100 dark:border-gray-700">
              <p className="text-xs text-gray-600 dark:text-gray-400">Started at 09:00 AM</p>
            </div>
          </div>

          {/* Today's Date Card */}
          <div className="bg-white dark:bg-gray-800 rounded-xl p-5 border border-gray-200 dark:border-gray-700 hover:shadow-md transition-all duration-300">
            <div className="flex items-center space-x-3 mb-3">
              <div className="w-10 h-10 rounded-lg bg-gray-100 dark:bg-gray-700 flex items-center justify-center">
                <Calendar className="w-5 h-5 text-gray-600 dark:text-gray-400" />
              </div>
              <div className="flex-1">
                <p className="text-xs font-medium text-gray-500 dark:text-gray-400 mb-1">Today's Date</p>
                <h3 className="text-sm font-bold text-gray-900 dark:text-white">{new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</h3>
              </div>
            </div>
            <div className="pt-3 border-t border-gray-100 dark:border-gray-700">
              <p className="text-xs text-gray-600 dark:text-gray-400">{new Date().toLocaleDateString('en-US', { weekday: 'long' })}</p>
            </div>
          </div>

          {/* Till Balance Card */}
          <div className="bg-white dark:bg-gray-800 rounded-xl p-5 border border-gray-200 dark:border-gray-700 hover:shadow-md transition-all duration-300">
            <div className="flex items-center space-x-3 mb-3">
              <div className="w-10 h-10 rounded-lg bg-gray-100 dark:bg-gray-700 flex items-center justify-center">
                <CreditCard className="w-5 h-5 text-gray-600 dark:text-gray-400" />
              </div>
              <div className="flex-1">
                <p className="text-xs font-medium text-gray-500 dark:text-gray-400 mb-1">Till Balance</p>
                <h3 className="text-sm font-bold text-gray-900 dark:text-white">$1,847.50</h3>
              </div>
            </div>
            <div className="pt-3 border-t border-gray-100 dark:border-gray-700">
              <p className="text-xs text-gray-600 dark:text-gray-400">Starting: $200.00</p>
            </div>
          </div>
        </motion.div>

        {/* Shift Performance Cards */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Shift Hourly Sales Chart */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="lg:col-span-5 bg-white dark:bg-gray-800 rounded-3xl p-6 border border-gray-200 dark:border-gray-700"
          >
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-gray-900 dark:text-white">Shift Sales</h2>
              <div className="flex items-center gap-2 bg-emerald-100 dark:bg-emerald-900/30 px-4 py-2 rounded-2xl">
                <span className="text-sm font-bold text-emerald-700 dark:text-emerald-400">{currentOrders} orders</span>
              </div>
            </div>

            {/* Line Chart */}
            <div className="relative h-48">
              <svg className="w-full h-full" viewBox="0 0 400 150" preserveAspectRatio="none">
                <defs>
                  <linearGradient id="shiftGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                    <stop offset="0%" stopColor="#059669" stopOpacity="0.2" />
                    <stop offset="100%" stopColor="#059669" stopOpacity="0" />
                  </linearGradient>
                </defs>
                
                <path
                  d={`M 0 ${150 - (shiftSalesData[0].value / maxValue) * 120} ${shiftSalesData
                    .map((d, i) => `L ${(i / (shiftSalesData.length - 1)) * 400} ${150 - (d.value / maxValue) * 120}`)
                    .join(' ')} L 400 150 L 0 150 Z`}
                  fill="url(#shiftGradient)"
                />

                <path
                  d={`M 0 ${150 - (shiftSalesData[0].value / maxValue) * 120} ${shiftSalesData
                    .map((d, i) => `L ${(i / (shiftSalesData.length - 1)) * 400} ${150 - (d.value / maxValue) * 120}`)
                    .join(' ')}`}
                  fill="none"
                  stroke="#059669"
                  strokeWidth="3"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />

                <circle
                  cx={(shiftSalesData.findIndex(d => d.value === maxValue) / (shiftSalesData.length - 1)) * 400}
                  cy={150 - (maxValue / maxValue) * 120}
                  r="6"
                  fill="#059669"
                />
              </svg>

              <div className="flex justify-between mt-4 text-xs text-gray-500 dark:text-gray-400">
                <span>9:00 am</span>
                <span>12:00 pm</span>
                <span>2:00 pm</span>
                <span>Now</span>
              </div>
            </div>
          </motion.div>

          {/* Shift Revenue Breakdown */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="lg:col-span-4 bg-white dark:bg-gray-800 rounded-3xl p-6 border border-gray-200 dark:border-gray-700"
          >
            <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">Shift Revenue</h2>

            <div className="flex flex-col items-center justify-center py-4">
              <div className="relative w-48 h-48">
                <svg className="w-full h-full transform -rotate-90">
                  <circle cx="96" cy="96" r="70" fill="none" stroke="#92400e" strokeWidth="24" strokeDasharray="220 440" strokeLinecap="round" />
                  <circle cx="96" cy="96" r="70" fill="none" stroke="#059669" strokeWidth="24" strokeDasharray="110 440" strokeDashoffset="-220" strokeLinecap="round" />
                  <circle cx="96" cy="96" r="70" fill="none" stroke="#f59e0b" strokeWidth="24" strokeDasharray="66 440" strokeDashoffset="-330" strokeLinecap="round" />
                  <circle cx="96" cy="96" r="70" fill="none" stroke="#3b82f6" strokeWidth="24" strokeDasharray="44 440" strokeDashoffset="-396" strokeLinecap="round" />
                </svg>
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="text-3xl font-bold text-gray-900 dark:text-white">$1,647</span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3 mt-6">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-yellow-900"></div>
                  <span className="text-sm text-gray-600 dark:text-gray-400">Coffee</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-emerald-600"></div>
                  <span className="text-sm text-gray-600 dark:text-gray-400">Tea</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-amber-500"></div>
                  <span className="text-sm text-gray-600 dark:text-gray-400">Smoothies</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-blue-500"></div>
                  <span className="text-sm text-gray-600 dark:text-gray-400">Others</span>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Quick Shift Stats */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="lg:col-span-3 space-y-6"
          >
            <div className="bg-white dark:bg-gray-800 rounded-3xl p-6 border border-gray-200 dark:border-gray-700">
              <div className="flex items-start gap-3 mb-4">
                <div className="w-10 h-10 rounded-xl bg-emerald-100 dark:bg-emerald-900/30 flex items-center justify-center">
                  <Coffee className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Total Orders</p>
                  <div className="flex items-center gap-2 mt-1">
                    <TrendingUp className="w-4 h-4 text-emerald-500" />
                    <span className="text-xs text-emerald-500 font-medium">On track</span>
                  </div>
                </div>
              </div>
              <p className="text-3xl font-bold text-gray-900 dark:text-white">294</p>
              <div className="w-16 h-1 bg-emerald-500 mt-2 rounded-full"></div>
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-3xl p-6 border border-gray-200 dark:border-gray-700">
              <div className="flex items-start gap-3 mb-4">
                <div className="w-10 h-10 rounded-xl bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center">
                  <DollarSign className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Avg Order</p>
                  <div className="flex items-center gap-2 mt-1">
                    <TrendingUp className="w-4 h-4 text-emerald-500" />
                    <span className="text-xs text-emerald-500 font-medium">+12%</span>
                  </div>
                </div>
              </div>
              <p className="text-3xl font-bold text-gray-900 dark:text-white">$5.60</p>
              <div className="w-16 h-1 bg-blue-500 mt-2 rounded-full"></div>
            </div>
          </motion.div>
        </div>

        {/* Bottom Section - Top Drinks & Recent Orders */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 pb-8">
          {/* Top Drinks This Shift */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="bg-white dark:bg-gray-800 rounded-3xl p-6 border border-gray-200 dark:border-gray-700"
          >
            <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-6">Top Drinks (This Shift)</h2>

            <div className="grid grid-cols-2 gap-4 mb-4 pb-3 border-b border-gray-100 dark:border-gray-700">
              <p className="text-sm font-semibold text-gray-600 dark:text-gray-400">Drink</p>
              <p className="text-sm font-semibold text-gray-600 dark:text-gray-400 text-right">Orders</p>
            </div>

            <div className="space-y-4">
              {topDrinksThisShift.map((drink) => (
                <div key={drink.id} className="grid grid-cols-2 gap-4 items-center">
                  <div className="flex items-center gap-3">
                    <div className={`w-12 h-12 rounded-full ${drink.color} flex items-center justify-center text-2xl`}>
                      {drink.icon}
                    </div>
                    <div>
                      <p className="font-medium text-gray-900 dark:text-white">{drink.name}</p>
                      <span className="inline-block mt-1 px-3 py-1 bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400 text-xs font-medium rounded-full">
                        {drink.category}
                      </span>
                    </div>
                  </div>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white text-right">{drink.orders}</p>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Recent Shift Orders */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.5 }}
            className="bg-white dark:bg-gray-800 rounded-3xl p-6 border border-gray-200 dark:border-gray-700"
          >
            <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-6">Recent Orders</h2>

            <div className="space-y-3">
              {recentShiftOrders.map((order) => (
                <div key={order.id} className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-700/50 transition-colors">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <p className="font-semibold text-gray-900 dark:text-white">{order.id}</p>
                      <span className="text-xs text-gray-500 dark:text-gray-400">{order.time}</span>
                    </div>
                    <div className="flex items-center gap-2">
                    <p className="text-lg font-bold text-gray-900 dark:text-white">{order.amount}</p>
                    <div className={`p-1 rounded-md text-xs font-semibold ${
                      order.payment === 'Cash'
                        ? 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400'
                        : order.payment === 'KHQR'
                        ? 'bg-red-900/30 dark:bg-red-900 text-red-700 dark:text-red-400'
                        : 'bg-orange-100 dark:bg-orange-900/30 text-orange-700 dark:text-orange-400'
                    }`}>
                      {order.payment}
                    </div>
                  </div>
                    <p className="text-sm text-gray-600 dark:text-gray-400">{order.drink}</p>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className={`px-3 py-1 rounded-lg text-xs font-bold ${
                      order.type === 'Walk-in'
                        ? 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400'
                        : order.type === 'FoodPanda'
                        ? 'bg-red-900/30 dark:bg-red-900 text-red-700 dark:text-red-400'
                        : order.type === 'Grab'
                        ? 'bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400'
                        : order.type === 'Egets'
                        ? 'bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-400'
                        : 'bg-orange-100 dark:bg-orange-900/30 text-orange-700 dark:text-orange-400'
                    }`}>
                      {order.type}
                    </div>
                    <p className="text-lg font-bold text-gray-900 dark:text-white">{order.amount}</p>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
