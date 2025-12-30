import { useState } from 'react';
import { Search, SlidersHorizontal, Plus, Minus, Trash2 } from 'lucide-react';
import { currentOrders, categories, menuItems, initialOrderItems, type OrderItem } from '../data/mockData';

export default function Orders() {
  const [activeCategory, setActiveCategory] = useState('all');
  const [orderType, setOrderType] = useState<'dine-in' | 'takeaway' | 'delivery'>('dine-in');
  const [orderItems, setOrderItems] = useState<OrderItem[]>(initialOrderItems);
  const [searchQuery, setSearchQuery] = useState('');

  const filteredMenuItems = menuItems.filter((item) => {
    const matchesCategory = activeCategory === 'all' || item.category.toLowerCase().replace(' ', '-') === activeCategory;
    const matchesSearch = item.name.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const addToOrder = (item: typeof menuItems[0]) => {
    const existingItem = orderItems.find((orderItem) => orderItem.id === item.id);
    if (existingItem) {
      setOrderItems(
        orderItems.map((orderItem) =>
          orderItem.id === item.id ? { ...orderItem, quantity: orderItem.quantity + 1 } : orderItem
        )
      );
    } else {
      setOrderItems([...orderItems, { ...item, quantity: 1 }]);
    }
  };

  const updateQuantity = (id: string, delta: number) => {
    setOrderItems(
      orderItems
        .map((item) => (item.id === id ? { ...item, quantity: Math.max(0, item.quantity + delta) } : item))
        .filter((item) => item.quantity > 0)
    );
  };

  const removeItem = (id: string) => {
    setOrderItems(orderItems.filter((item) => item.id !== id));
  };

  const subtotal = orderItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const taxRate = 0.05;
  const taxes = subtotal * taxRate;
  const total = subtotal + taxes;

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-full">
      {/* Left Section - Current Orders & Menu */}
      <div className="lg:col-span-2 space-y-6">
        {/* Current Orders */}
        <div>
          <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">Current order</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
            {currentOrders.map((order) => (
              <div
                key={order.id}
                className="bg-white dark:bg-gray-800 rounded-2xl p-4 border border-gray-200 dark:border-gray-700 hover:shadow-md transition-shadow"
              >
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <p className="text-sm text-gray-600 dark:text-gray-400">{order.customerName}</p>
                    <p className="text-xs font-semibold text-gray-900 dark:text-white">{order.id}</p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">{order.tableNumber}</p>
                  </div>
                  <div className="relative w-14 h-14">
                    <svg className="w-14 h-14 transform -rotate-90">
                      <circle
                        cx="28"
                        cy="28"
                        r="24"
                        stroke="currentColor"
                        strokeWidth="4"
                        fill="none"
                        className="text-gray-200 dark:text-gray-700"
                      />
                      <circle
                        cx="28"
                        cy="28"
                        r="24"
                        stroke="currentColor"
                        strokeWidth="4"
                        fill="none"
                        strokeDasharray={`${2 * Math.PI * 24}`}
                        strokeDashoffset={`${2 * Math.PI * 24 * (1 - order.progress / 100)}`}
                        className="text-emerald-500 transition-all duration-300"
                        strokeLinecap="round"
                      />
                    </svg>
                    <div className="absolute inset-0 flex items-center justify-center">
                      <span className="text-xs font-bold text-gray-900 dark:text-white">{order.progress}%</span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center justify-between text-xs">
                  <span className="text-gray-600 dark:text-gray-400">{order.items} Items</span>
                  <span className="font-bold text-gray-900 dark:text-white">${order.total}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Categories */}
        <div>
          <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4">Categories</h3>
          <div className="flex items-center gap-3 mb-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search menu"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
            </div>
            <button className="p-2.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
              <SlidersHorizontal className="w-5 h-5 text-gray-600 dark:text-gray-300" />
            </button>
          </div>

          <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-none">
            {categories.map((category) => (
              <button
                key={category.id}
                onClick={() => setActiveCategory(category.id)}
                className={`flex flex-col items-center gap-2 px-4 py-3 rounded-xl transition-all whitespace-nowrap ${
                  activeCategory === category.id
                    ? 'bg-emerald-500 text-white shadow-md'
                    : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'
                }`}
              >
                <span className="text-2xl">{category.icon}</span>
                <span className="text-xs font-medium">{category.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Menu Items Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4">
          {filteredMenuItems.map((item) => {
            // Find the current quantity in the order
            const orderItem = orderItems.find((orderItem) => orderItem.id === item.id);
            const currentQuantity = orderItem?.quantity || 0;

            return (
              <div
                key={item.id}
                className="bg-white dark:bg-gray-800 rounded-2xl overflow-hidden border border-gray-200 dark:border-gray-700 hover:shadow-lg transition-all group"
              >
                <div
                  onClick={() => addToOrder(item)}
                  className="cursor-pointer"
                >
                  <div className="relative aspect-[4/3] overflow-hidden">
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                    />
                    {item.isBestSeller && (
                      <div className="absolute top-2 right-2 bg-yellow-400 text-yellow-900 text-xs font-bold px-2 py-1 rounded-full">
                        Best seller
                      </div>
                    )}
                  </div>
                  <div className="p-3">
                    <h4 className="font-semibold text-sm text-gray-900 dark:text-white mb-1">{item.name}</h4>
                    <p className="text-xs text-gray-500 dark:text-gray-400 mb-2">{item.category}</p>
                  </div>
                </div>
                <div className="px-3 pb-3">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-gray-900 dark:text-white">${item.price.toFixed(2)}</span>
                    {currentQuantity > 0 ? (
                      <div className="flex items-center gap-1 bg-gray-100 dark:bg-gray-700 rounded-full px-1 py-1">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            updateQuantity(item.id, -1);
                          }}
                          className="w-6 h-6 rounded-full bg-white dark:bg-gray-600 flex items-center justify-center hover:bg-gray-200 dark:hover:bg-gray-500 transition-colors"
                        >
                          <Minus className="w-3 h-3 text-gray-900 dark:text-white" />
                        </button>
                        <span className="text-xs font-medium text-gray-900 dark:text-white min-w-[20px] text-center">
                          {currentQuantity}
                        </span>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            updateQuantity(item.id, 1);
                          }}
                          className="w-6 h-6 rounded-full bg-gray-900 dark:bg-white flex items-center justify-center hover:scale-110 transition-transform"
                        >
                          <Plus className="w-3 h-3 text-white dark:text-gray-900" />
                        </button>
                      </div>
                    ) : (
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          addToOrder(item);
                        }}
                        className="w-7 h-7 rounded-full bg-gray-900 dark:bg-white flex items-center justify-center hover:scale-110 transition-transform"
                      >
                        <Plus className="w-4 h-4 text-white dark:text-gray-900" />
                      </button>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Right Section - Order Details */}
      <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 p-6 h-fit sticky top-24">
        <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">Order details</h2>

        {/* Order Type Tabs */}
        <div className="flex gap-2 mb-6">
          {(['dine-in', 'takeaway', 'delivery'] as const).map((type) => (
            <button
              key={type}
              onClick={() => setOrderType(type)}
              className={`flex-1 py-2 px-3 rounded-lg text-sm font-medium transition-all ${
                orderType === type
                  ? 'bg-emerald-500 text-white'
                  : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
              }`}
            >
              {type.charAt(0).toUpperCase() + type.slice(1).replace('-', ' ')}
            </button>
          ))}
        </div>

        {/* Customer Info */}
        <div className="grid grid-cols-2 gap-4 mb-6">
          <div>
            <label className="text-xs text-gray-600 dark:text-gray-400 mb-1 block">Customer name</label>
            <div className="bg-gray-50 dark:bg-gray-900 rounded-lg px-3 py-2 text-sm font-medium text-gray-900 dark:text-white">
              Darius Sinarmulia
            </div>
          </div>
          <div>
            <label className="text-xs text-gray-600 dark:text-gray-400 mb-1 block">Table number</label>
            <div className="bg-gray-50 dark:bg-gray-900 rounded-lg px-3 py-2 text-sm font-medium text-gray-900 dark:text-white">
              04
            </div>
          </div>
        </div>

        {/* Ordered Menu */}
        <div className="mb-6">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-sm font-bold text-gray-900 dark:text-white">Ordered menu</h3>
            <span className="text-xs text-gray-500 dark:text-gray-400">{orderItems.length} Items</span>
          </div>
          <div className="space-y-3 max-h-64 overflow-y-auto scrollbar-none">
            {orderItems.map((item) => (
              <div key={item.id} className="flex gap-3">
                <img src={item.image} alt={item.name} className="w-16 h-16 rounded-lg object-cover" />
                <div className="flex-1">
                  <h4 className="font-semibold text-sm text-gray-900 dark:text-white">{item.name}</h4>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">
                    ${item.price.toFixed(2)} x{item.quantity}
                  </p>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => updateQuantity(item.id, -1)}
                      className="w-6 h-6 rounded-full bg-gray-100 dark:bg-gray-700 flex items-center justify-center hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
                    >
                      <Minus className="w-3 h-3 text-gray-900 dark:text-white" />
                    </button>
                    <span className="text-sm font-medium text-gray-900 dark:text-white w-6 text-center">
                      {item.quantity}
                    </span>
                    <button
                      onClick={() => updateQuantity(item.id, 1)}
                      className="w-6 h-6 rounded-full bg-gray-900 dark:bg-white flex items-center justify-center hover:scale-110 transition-transform"
                    >
                      <Plus className="w-3 h-3 text-white dark:text-gray-900" />
                    </button>
                    <button
                      onClick={() => removeItem(item.id)}
                      className="ml-auto w-6 h-6 rounded-full bg-red-100 dark:bg-red-900/30 flex items-center justify-center hover:bg-red-200 dark:hover:bg-red-900/50 transition-colors"
                    >
                      <Trash2 className="w-3 h-3 text-red-600 dark:text-red-400" />
                    </button>
                  </div>
                </div>
                <div className="text-right">
                  <span className="font-bold text-sm text-gray-900 dark:text-white">
                    ${(item.price * item.quantity).toFixed(2)}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Payment Details */}
        <div className="border-t border-gray-200 dark:border-gray-700 pt-4 space-y-2">
          <h3 className="text-sm font-bold text-gray-900 dark:text-white mb-3">Payment Details</h3>
          <div className="flex justify-between text-sm">
            <span className="text-gray-600 dark:text-gray-400">Subtotal</span>
            <span className="font-medium text-gray-900 dark:text-white">${subtotal.toFixed(2)}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-gray-600 dark:text-gray-400">Taxes</span>
            <span className="font-medium text-gray-900 dark:text-white">{(taxRate * 100).toFixed(0)}%</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-gray-600 dark:text-gray-400">Additional fee</span>
            <span className="font-medium text-gray-900 dark:text-white">-</span>
          </div>
          <div className="flex justify-between text-base font-bold pt-2 border-t border-gray-200 dark:border-gray-700">
            <span className="text-gray-900 dark:text-white">Total</span>
            <span className="text-gray-900 dark:text-white">${total.toFixed(2)}</span>
          </div>
        </div>

        {/* Confirm Button */}
        <button className="w-full mt-6 bg-emerald-500 hover:bg-emerald-600 text-white font-semibold py-3 rounded-xl transition-colors shadow-md hover:shadow-lg">
          Confirm
        </button>
      </div>
    </div>
  );
}
