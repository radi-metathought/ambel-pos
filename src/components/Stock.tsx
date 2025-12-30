import { useState } from 'react';
import { Search, Plus, AlertTriangle, CheckCircle, Clock, Package, Trash, TimerReset, Form, X } from 'lucide-react';
import {
  stockItems,
  stockRequests,
  stockAdjustments,
  warehouseStock,
  goodsIncome,
} from '../data/stockData';
import Select from './ui/Select';
import Input from './ui/Input';
import { motion } from 'framer-motion';

type TabType = 'stock-on-hand' | 'request-form' | 'stock-adjustment' | 'warehouse-stock' | 'goods-income';

export default function Stock() {
  const [activeTab, setActiveTab] = useState<TabType>('stock-on-hand');
  const [searchQuery, setSearchQuery] = useState('');
  const [requestView, setRequestView] = useState<'list' | 'form'>('list');
  const [requestItems, setRequestItems] = useState([
    { id: 1, productId: '', quantity: '', priority: 'medium' },
  ]);
  const [selectedRequest, setSelectedRequest] = useState<string | null>('req1');
  const [isAdjustmentModalOpen, setIsAdjustmentModalOpen] = useState(false);
  const [adjustmentItems, setAdjustmentItems] = useState([
    { id: 1, productId: '', quantity: '', reason: '' },
  ]);
  const [selectedGoodsIncome, setSelectedGoodsIncome] = useState<string | null>('gi1');
  const [isAdjustingQuantities, setIsAdjustingQuantities] = useState(false);
  const [adjustedQuantities, setAdjustedQuantities] = useState<Record<string, number>>({});

  const tabs = [
    { id: 'stock-on-hand' as TabType, label: 'Stock On Hand', icon: Package },
    { id: 'request-form' as TabType, label: 'Request Form', icon: Plus },
    { id: 'stock-adjustment' as TabType, label: 'Stock Adjustment', icon: AlertTriangle },
    { id: 'warehouse-stock' as TabType, label: 'Warehouse Stock', icon: Package },
    { id: 'goods-income' as TabType, label: 'Goods Income', icon: CheckCircle },
  ];

  const getStockStatus = (current: number, min: number) => {
    if (current < min) return { label: 'Low', color: 'text-red-600 bg-red-100 dark:bg-red-900/30' };
    if (current < min * 1.5) return { label: 'Medium', color: 'text-yellow-600 bg-yellow-100 dark:bg-yellow-900/30' };
    return { label: 'Good', color: 'text-green-600 bg-green-100 dark:bg-green-900/30' };
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'text-red-600 bg-red-100 dark:bg-red-900/30';
      case 'medium': return 'text-yellow-600 bg-yellow-100 dark:bg-yellow-900/30';
      case 'low': return 'text-blue-600 bg-blue-100 dark:bg-blue-900/30';
      default: return 'text-gray-600 bg-gray-100 dark:bg-gray-700';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'text-green-600 bg-green-100 dark:bg-green-900/30';
      case 'approved': return 'text-green-600 bg-green-100 dark:bg-green-900/30';
      case 'pending': return 'text-yellow-600 bg-yellow-100 dark:bg-yellow-900/30';
      case 'partial': return 'text-blue-600 bg-blue-100 dark:bg-blue-900/30';
      case 'rejected': return 'text-red-600 bg-red-100 dark:bg-red-900/30';
      default: return 'text-gray-600 bg-gray-100 dark:bg-gray-700';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Stock Management</h1>
      </div>

      {/* Fixed Tab Navigation */}
      <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 p-2 sticky top-20 z-10">
        <div className="flex gap-2 overflow-x-auto scrollbar-none">
          {tabs.map((tab, index) => {
            const Icon = tab.icon;
            return (
              <motion.button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                initial={{ opacity: 0, y: -5 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ 
                  delay: index * 0.03, 
                  duration: 0.4,
                  ease: [0.4, 0, 0.2, 1]
                }}
                whileHover={{ y: -2 }}
                whileTap={{ scale: 0.98 }}
                className={`flex items-center gap-2 px-4 py-3 rounded-xl font-medium transition-all whitespace-nowrap ${
                  activeTab === tab.id
                    ? 'bg-emerald-500 text-white shadow-md'
                    : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
                }`}
              >
                <Icon className="w-5 h-5" />
                {tab.label}
              </motion.button>
            );
          })}
        </div>
      </div>

      {/* Tab Content */}
      <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 p-6">
        {/* Stock On Hand Tab */}
        {activeTab === 'stock-on-hand' && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-bold text-gray-900 dark:text-white">Current Inventory</h2>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search products..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 pr-4 py-2 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-200 dark:border-gray-700">
                    <th className="text-left py-3 px-4 font-semibold text-gray-900 dark:text-white">Product</th>
                    <th className="text-left py-3 px-4 font-semibold text-gray-900 dark:text-white">SKU</th>
                    <th className="text-left py-3 px-4 font-semibold text-gray-900 dark:text-white">Category</th>
                    <th className="text-right py-3 px-4 font-semibold text-gray-900 dark:text-white">Current</th>
                    <th className="text-right py-3 px-4 font-semibold text-gray-900 dark:text-white">Min</th>
                    <th className="text-center py-3 px-4 font-semibold text-gray-900 dark:text-white">Status</th>
                    <th className="text-right py-3 px-4 font-semibold text-gray-900 dark:text-white">Price</th>
                  </tr>
                </thead>
                <tbody>
                  {stockItems.map((item) => {
                    const status = getStockStatus(item.currentStock, item.minStock);
                    return (
                      <tr key={item.id} className="border-b border-gray-100 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700/50">
                        <td className="py-3 px-4 font-medium text-gray-900 dark:text-white">{item.name}</td>
                        <td className="py-3 px-4 text-gray-600 dark:text-gray-400">{item.sku}</td>
                        <td className="py-3 px-4 text-gray-600 dark:text-gray-400">{item.category}</td>
                        <td className="py-3 px-4 text-right font-semibold text-gray-900 dark:text-white">
                          {item.currentStock} {item.unit}
                        </td>
                        <td className="py-3 px-4 text-right text-gray-600 dark:text-gray-400">
                          {item.minStock} {item.unit}
                        </td>
                        <td className="py-3 px-4">
                          <span className={`inline-block px-3 py-1 rounded-full text-xs font-medium ${status.color}`}>
                            {status.label}
                          </span>
                        </td>
                        <td className="py-3 px-4 text-right font-medium text-gray-900 dark:text-white">
                          ${item.price.toFixed(2)}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Request Form Tab */}
        {activeTab === 'request-form' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-bold text-gray-900 dark:text-white">Stock Requests</h2>
              
              {/* List/Form Toggle */}
              <div className="flex gap-2 bg-gray-100 dark:bg-gray-900 rounded-lg p-1">
                <button
                  onClick={() => setRequestView('list')}
                  className={`px-4 py-1 rounded-lg font-medium transition-all ${
                    requestView === 'list'
                      ? 'bg-white dark:bg-gray-800 text-gray-900 dark:text-white shadow-sm'
                      : 'text-gray-600 dark:text-gray-400'
                  }`}
                >
                  List
                </button>
                <button
                  onClick={() => setRequestView('form')}
                  className={`px-4 py-1 rounded-lg font-medium transition-all ${
                    requestView === 'form'
                      ? 'bg-white dark:bg-gray-800 text-gray-900 dark:text-white shadow-sm'
                      : 'text-gray-600 dark:text-gray-400'
                  }`}
                >
                  Form
                </button>
              </div>
            </div>

            {/* List View */}
            {requestView === 'list' && (
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Request List */}
                <motion.div 
                  className="lg:col-span-1 space-y-3"
                  transition={{ 
                    layout: {
                      duration: 0.3,
                      ease: [0.4, 0, 0.2, 1]
                    }
                  }}
                >
                  {stockRequests.map((request) => (
                    <motion.div
                      key={request.id}
                      initial={false}
                      whileHover={{ 
                        y: -4,
                        boxShadow: "0 10px 30px -10px rgba(0, 0, 0, 0.2)",
                        transition: { duration: 0.2 }
                      }}
                      onClick={() => setSelectedRequest(request.id)}
                      className={`bg-white dark:bg-gray-800 rounded-xl p-4 border-2 cursor-pointer transition-colors ${
                        selectedRequest === request.id
                          ? 'border-emerald-500 shadow-lg shadow-emerald-500/10'
                          : 'border-gray-200 dark:border-gray-700'
                      }`}
                    >
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-2">
                              <h3 className="font-semibold text-gray-900 dark:text-white">
                                {request.items.length > 1 
                                  ? `${request.items[0].productName} +${request.items.length - 1} more`
                                  : request.items[0].productName
                                }
                              </h3>
                              <span className={`inline-block px-2 py-0.5 rounded-full text-xs font-medium ${getStatusColor(request.status)}`}>
                                {request.status.toUpperCase()}
                              </span>
                            </div>
                            <p className="text-sm text-gray-600 dark:text-gray-400">Request ID: {request.id}</p>
                            <div className="flex items-center gap-4 mt-2">
                              <p className="text-sm text-gray-600 dark:text-gray-400">
                                <span className="font-medium">Items:</span> {request.items.length}
                              </p>
                              <p className="text-sm text-gray-600 dark:text-gray-400">
                                <span className="font-medium">Total Qty:</span> {request.items.reduce((sum, item) => sum + item.quantity, 0)} units
                              </p>
                            </div>
                            <p className="text-xs text-gray-500 dark:text-gray-500 mt-2">
                              {request.requestedBy} • {request.requestDate}
                            </p>
                          </div>
                            <CheckCircle className={`w-5 h-5 ${selectedRequest === request.id ? 'text-emerald-500' : 'text-gray-400'}`} />
                        </div>
                      </motion.div>
                    ))}
                </motion.div>

                {/* Request Detail Sidebar */}
                <motion.div 
                  key={selectedRequest}
                  initial={{ opacity: 0.5, x: -50 }}
                  animate={{ 
                    opacity: 1, 
                    x: 0,
                    transition: {
                      duration: 0.5,
                    }
                  }}
                  className="lg:col-span-2 bg-white dark:bg-gray-800 rounded-xl p-6 border-2 border-gray-200 dark:border-gray-700 sticky top-24 h-fit"
                >
                  <div className="mb-6">
                    <h3 className="text-lg font-bold text-gray-900 dark:text-white">Request Details</h3>
                  </div>

                    {stockRequests
                      .filter((r) => r.id === selectedRequest)
                      .map((request) => (
                        <div key={request.id} className="space-y-6">
                          {/* Workflow Status */}
                          <div className="bg-gray-50 dark:bg-gray-900 rounded-xl p-4 border border-gray-200 dark:border-gray-700">
                            <p className="text-xs font-semibold text-gray-600 dark:text-gray-400 mb-4 uppercase tracking-wide">
                              Request Status
                            </p>
                            <div className="flex items-center justify-between">
                              {/* Stage 1: Submitted */}
                              <div className="flex flex-col items-center gap-2">
                                <div className="w-10 h-10 rounded-full flex items-center justify-center bg-emerald-500 text-white shadow-md">
                                  <CheckCircle className="w-5 h-5" />
                                </div>
                                <span className="text-xs font-medium text-gray-900 dark:text-white">Submitted</span>
                              </div>
                              
                              {/* Connector 1 */}
                              <div className={`flex-1 h-1 mx-1 ${
                                request.status === 'approved' || request.status === 'rejected'
                                  ? 'bg-emerald-500'
                                  : 'bg-gray-300 dark:bg-gray-600'
                              }`}></div>
                              
                              {/* Stage 2: Review */}
                              <div className="flex flex-col items-center gap-2">
                                <div className={`w-10 h-10 rounded-full flex items-center justify-center shadow-md ${
                                  request.status === 'approved'
                                    ? 'bg-emerald-500 text-white'
                                    : request.status === 'rejected'
                                    ? 'bg-red-500 text-white'
                                    : 'bg-gray-300 dark:bg-gray-600 text-gray-500'
                                }`}>
                                  {request.status === 'approved' ? (
                                    <CheckCircle className="w-5 h-5" />
                                  ) : request.status === 'rejected' ? (
                                    <AlertTriangle className="w-5 h-5" />
                                  ) : (
                                    <Clock className="w-5 h-5" />
                                  )}
                                </div>
                                <span className="text-xs font-medium text-gray-900 dark:text-white">Review</span>
                              </div>
                              
                              {/* Connector 2 */}
                              <div className={`flex-1 h-1 mx-1 ${
                                request.status === 'approved'
                                  ? 'bg-emerald-500'
                                  : 'bg-gray-300 dark:bg-gray-600'
                              }`}></div>
                              
                              {/* Stage 3: Delivery */}
                              <div className="flex flex-col items-center gap-2">
                                <div className={`w-10 h-10 rounded-full flex items-center justify-center shadow-md ${
                                  request.status === 'approved'
                                    ? 'bg-emerald-500 text-white'
                                    : 'bg-gray-300 dark:bg-gray-600 text-gray-500'
                                }`}>
                                  <Package className="w-5 h-5" />
                                </div>
                                <span className="text-xs font-medium text-gray-900 dark:text-white">Delivery</span>
                              </div>
                              
                              {/* Connector 3 */}
                              <div className="flex-1 h-1 mx-1 bg-gray-300 dark:bg-gray-600"></div>
                              
                              {/* Stage 4: Arrived */}
                              <div className="flex flex-col items-center gap-2">
                                <div className="w-10 h-10 rounded-full flex items-center justify-center bg-gray-300 dark:bg-gray-600 text-gray-500 shadow-md">
                                  <CheckCircle className="w-5 h-5" />
                                </div>
                                <span className="text-xs font-medium text-gray-900 dark:text-white">Arrived</span>
                              </div>
                              
                              {/* Connector 4 */}
                              <div className="flex-1 h-1 mx-1 bg-gray-300 dark:bg-gray-600"></div>
                              
                              {/* Stage 5: Accepted */}
                              <div className="flex flex-col items-center gap-2">
                                <div className="w-10 h-10 rounded-full flex items-center justify-center bg-gray-300 dark:bg-gray-600 text-gray-500 shadow-md">
                                  <CheckCircle className="w-5 h-5" />
                                </div>
                                <span className="text-xs font-medium text-gray-900 dark:text-white">Accepted</span>
                              </div>
                            </div>
                          </div>

                          {/* Header Info */}
                          <div className="bg-gradient-to-br from-emerald-50 to-emerald-100/50 dark:from-emerald-900/20 dark:to-emerald-800/10 rounded-xl p-3 border-2 border-emerald-200 dark:border-emerald-700">
                            <div className="flex items-center justify-between gap-4">
                              {/* Left: Request ID & Requester */}
                              <div className="flex items-center gap-3 flex-1">
                                <div className="w-9 h-9 bg-emerald-500 rounded-full flex items-center justify-center text-white font-bold text-sm">
                                  {request.requestedBy.charAt(0)}
                                </div>
                                <div className="flex-1 min-w-0">
                                  <div className="flex items-center gap-2">
                                    <p className="text-xs font-semibold text-emerald-700 dark:text-emerald-300">
                                      #{request.id}
                                    </p>
                                    <span className="text-xs text-emerald-600 dark:text-emerald-400">•</span>
                                    <p className="text-xs font-medium text-emerald-900 dark:text-emerald-100 truncate">
                                      {request.requestedBy}
                                    </p>
                                  </div>
                                  <p className="text-xs text-emerald-600 dark:text-emerald-400 mt-0.5">
                                    {request.requestDate}
                                  </p>
                                </div>
                              </div>
                              
                              {/* Right: Status Badge */}
                              <span className={`inline-block px-3 py-1 rounded-full text-xs font-semibold whitespace-nowrap ${getStatusColor(request.status)}`}>
                                {request.status.toUpperCase()}
                              </span>
                            </div>
                          </div>

                          {/* Requested Items */}
                          <div>
                            <div className="flex items-center justify-between mb-3">
                              <h4 className="text-sm font-semibold text-gray-900 dark:text-white uppercase tracking-wide">
                                Requested Items
                              </h4>
                              <span className="text-xs font-medium text-gray-500 dark:text-gray-400">
                                {request.items.length} {request.items.length === 1 ? 'Item' : 'Items'}
                              </span>
                            </div>
                            
                            {/* Item Cards */}
                            <div className="space-y-3">
                              {request.items.map((item, index) => (
                                <div key={index} className="bg-white dark:bg-gray-900 rounded-xl p-4 border-2 border-gray-200 dark:border-gray-700">
                                  <div className="flex items-start justify-between mb-3">
                                    <div className="flex-1">
                                      <div className="flex items-center gap-2 mb-1">
                                        <div className="w-6 h-6 bg-emerald-500 text-white rounded-full flex items-center justify-center text-xs font-bold">
                                          {index + 1}
                                        </div>
                                        <h5 className="font-semibold text-gray-900 dark:text-white">{item.productName}</h5>
                                      </div>
                                    </div>
                                    <span className={`inline-block px-2 py-1 rounded-full text-xs font-medium ${getPriorityColor(item.priority)}`}>
                                      {item.priority.toUpperCase()}
                                    </span>
                                  </div>
                                  
                                  <div className="grid grid-cols-2 gap-3 mt-3 pt-3 border-t border-gray-200 dark:border-gray-700">
                                    <div>
                                      <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">Quantity</p>
                                      <p className="text-sm font-semibold text-gray-900 dark:text-white">{item.quantity} units</p>
                                    </div>
                                    <div>
                                      <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">Priority</p>
                                      <p className="text-sm font-semibold text-gray-900 dark:text-white capitalize">{item.priority}</p>
                                    </div>
                                  </div>
                                </div>
                              ))}
                            </div>
                          </div>

                          {/* Reason */}
                          <div>
                            <label className="block text-xs font-semibold text-gray-600 dark:text-gray-400 mb-2 uppercase tracking-wide">
                              Reason for Request
                            </label>
                            <p className="text-sm text-gray-700 dark:text-gray-300 bg-gray-50 dark:bg-gray-900 p-4 rounded-lg border border-gray-200 dark:border-gray-700">
                              {request.reason}
                            </p>
                          </div>
                        </div>
                      ))}
                    </motion.div>
              </div>
            )}

            {/* Form View */}
            {requestView === 'form' && (
              <div className="space-y-6">
                {/* User Information */}
                <div className="bg-emerald-50 dark:bg-emerald-900/20 rounded-xl p-4 border border-emerald-200 dark:border-emerald-800">
                  <h3 className="font-semibold text-emerald-900 dark:text-emerald-100 mb-3">Requester Information</h3>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-emerald-700 dark:text-emerald-300 mb-1">Name</p>
                      <p className="font-medium text-emerald-900 dark:text-emerald-100">John Manager</p>
                    </div>
                    <div>
                      <p className="text-sm text-emerald-700 dark:text-emerald-300 mb-1">Department</p>
                      <p className="font-medium text-emerald-900 dark:text-emerald-100">Kitchen Management</p>
                    </div>
                    <div>
                      <p className="text-sm text-emerald-700 dark:text-emerald-300 mb-1">Employee ID</p>
                      <p className="font-medium text-emerald-900 dark:text-emerald-100">EMP-001</p>
                    </div>
                    <div>
                      <p className="text-sm text-emerald-700 dark:text-emerald-300 mb-1">Date</p>
                      <p className="font-medium text-emerald-900 dark:text-emerald-100">{new Date().toLocaleDateString()}</p>
                    </div>
                  </div>
                </div>

                {/* Request Form */}
                <div className="space-y-6">
                  {/* Form Header */}
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 dark:text-white">New Stock Request</h3>
                      <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                        Add one or more items to your request
                      </p>
                    </div>
                    <button
                      onClick={() => {
                        const newId = Math.max(...requestItems.map((item) => item.id)) + 1;
                        setRequestItems([...requestItems, { id: newId, productId: '', quantity: '', priority: 'medium' }]);
                      }}
                      className="flex items-center gap-2 px-5 py-2.5 bg-emerald-500 hover:bg-emerald-600 text-white rounded-xl font-medium transition-all shadow-sm hover:shadow-md"
                    >
                      <Plus className="w-4 h-4" />
                      Add Item
                    </button>
                  </div>

                  {/* Product Items */}
                  <div className="space-y-4">
                    {requestItems.map((item, index) => (
                      <div
                        key={item.id}
                        className="bg-white dark:bg-gray-800 rounded-xl p-6 border-2 border-gray-200 dark:border-gray-700 relative group hover:border-emerald-300 dark:hover:border-emerald-700 transition-all"
                      >
                        {/* Item Number Badge */}
                        <div className="absolute -top-3 -left-3 w-9 h-9 bg-emerald-500 text-white rounded-full flex items-center justify-center font-bold text-sm shadow-lg">
                          {index + 1}
                        </div>

                        {/* Remove Button */}
                        {requestItems.length > 1 && (
                          <button
                            onClick={() => {
                              setRequestItems(requestItems.filter((i) => i.id !== item.id));
                            }}
                            className="absolute -top-3 -right-3 w-9 h-9 bg-red-500 hover:bg-red-600 text-white rounded-full flex items-center justify-center transition-all shadow-lg opacity-0 group-hover:opacity-100"
                            title="Remove item"
                          >
                            <Trash className="w-4 h-4" />
                          </button>
                        )}

                        <div className="grid grid-cols-1 md:grid-cols-12 gap-5">
                          {/* Product Selection */}
                          <div className="md:col-span-6">
                            <Select
                              label="Product"
                              value={item.productId}
                              onChange={(value) => {
                                const updated = requestItems.map((i) =>
                                  i.id === item.id ? { ...i, productId: value } : i
                                );
                                setRequestItems(updated);
                              }}
                              options={stockItems.map((stockItem) => ({
                                value: stockItem.id,
                                label: `${stockItem.name} (${stockItem.sku}) - Stock: ${stockItem.currentStock}`,
                              }))}
                              placeholder="Select a product"
                              required
                            />
                          </div>

                          {/* Quantity */}
                          <div className="md:col-span-3">
                            <Input
                              label="Quantity"
                              type="number"
                              value={item.quantity}
                              onChange={(value) => {
                                const updated = requestItems.map((i) =>
                                  i.id === item.id ? { ...i, quantity: value } : i
                                );
                                setRequestItems(updated);
                              }}
                              placeholder="0"
                              min={1}
                              required
                            />
                          </div>

                          {/* Priority */}
                          <div className="md:col-span-3">
                            <Select
                              label="Priority"
                              value={item.priority}
                              onChange={(value) => {
                                const updated = requestItems.map((i) =>
                                  i.id === item.id ? { ...i, priority: value } : i
                                );
                                setRequestItems(updated);
                              }}
                              options={[
                                { value: 'low', label: '🔵 Low' },
                                { value: 'medium', label: '🟡 Medium' },
                                { value: 'high', label: '� High' },
                              ]}
                              placeholder="Select priority"
                              required
                            />
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* General Request Information */}
                  <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border-2 border-gray-200 dark:border-gray-700">
                    <h4 className="text-base font-semibold text-gray-900 dark:text-white mb-5 flex items-center gap-2">
                      <Package className="w-5 h-5 text-emerald-500" />
                      General Information
                    </h4>
                    
                    <div className="space-y-5">
                      {/* Reason */}
                      <div>
                        <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-2 uppercase tracking-wide">
                          Reason for Request <span className="text-red-500">*</span>
                        </label>
                        <textarea
                          rows={3}
                          placeholder="Explain why you need these items..."
                          className="w-full px-4 py-3 rounded-lg border-2 border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-900 text-gray-900 dark:text-white text-sm placeholder-gray-400 focus:outline-none focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10 transition-all resize-none"
                        ></textarea>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                        {/* Expected Delivery Date */}
                        <div>
                          <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-2 uppercase tracking-wide">
                            Expected Delivery Date
                          </label>
                          <input
                            type="date"
                            className="w-full h-11 px-4 rounded-lg border-2 border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-900 text-gray-900 dark:text-white text-sm focus:outline-none focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10 transition-all"
                          />
                        </div>

                        {/* Notes */}
                        <div>
                          <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-2 uppercase tracking-wide">
                            Additional Notes
                          </label>
                          <input
                            type="text"
                            placeholder="Optional notes..."
                            className="w-full h-11 px-4 rounded-lg border-2 border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-900 text-gray-900 dark:text-white text-sm placeholder-gray-400 focus:outline-none focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10 transition-all"
                          />
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Summary Card */}
                  <div className="bg-gradient-to-br from-emerald-50 to-emerald-100/50 dark:from-emerald-900/20 dark:to-emerald-800/10 rounded-xl p-4 border-2 border-emerald-200 dark:border-emerald-700">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-lg font-bold text-emerald-600 dark:text-emerald-400 mt-1">
                         <span className='text-lg font-bold text-black dark:text-white'>Total items:</span> {requestItems.length} {requestItems.length === 1 ? 'Item' : 'Items'}
                        </p>
                      </div>
                      <div className="flex gap-3">
                        <button
                          onClick={() => {
                            setRequestItems([{ id: 1, productId: '', quantity: '', priority: 'medium' }]);
                          }}
                          className="flex items-center gap-2 px-8 py-2 bg-white dark:bg-gray-800 hover:bg-grey-50 dark:hover:bg-emerald-700 text-emerald-700 dark:text-gray-300 border-2 border-emerald-600 dark:border-emerald-600 rounded-xl font-semibold transition-all shadow-sm hover:shadow-md"
                        >
                          <Form className="w-5 h-5" /> Reset Form
                        </button>
                        <button className="px-8 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-semibold transition-all shadow-lg hover:shadow-xl flex items-center gap-2">
                          <CheckCircle className="w-5 h-5" />
                          Submit Request
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Stock Adjustment Tab */}
        {activeTab === 'stock-adjustment' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-bold text-gray-900 dark:text-white">Stock Adjustment History</h2>
              <button
                onClick={() => setIsAdjustmentModalOpen(true)}
                className="flex items-center gap-2 px-5 py-2.5 bg-emerald-500 hover:bg-emerald-600 text-white rounded-xl font-medium transition-all shadow-sm hover:shadow-md"
              >
                <Plus className="w-4 h-4" />
                Request Adjustment
              </button>
            </div>
            
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-200 dark:border-gray-700">
                    <th className="text-left py-3 px-4 font-semibold text-gray-900 dark:text-white">Product</th>
                    <th className="text-right py-3 px-4 font-semibold text-gray-900 dark:text-white">Previous</th>
                    <th className="text-right py-3 px-4 font-semibold text-gray-900 dark:text-white">Adjustment</th>
                    <th className="text-right py-3 px-4 font-semibold text-gray-900 dark:text-white">New Stock</th>
                    <th className="text-left py-3 px-4 font-semibold text-gray-900 dark:text-white">Reason</th>
                    <th className="text-left py-3 px-4 font-semibold text-gray-900 dark:text-white">Adjusted By</th>
                    <th className="text-left py-3 px-4 font-semibold text-gray-900 dark:text-white">Date</th>
                  </tr>
                </thead>
                <tbody>
                  {stockAdjustments.map((adj) => (
                    <tr key={adj.id} className="border-b border-gray-100 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700/50">
                      <td className="py-3 px-4 font-medium text-gray-900 dark:text-white">{adj.productName}</td>
                      <td className="py-3 px-4 text-right text-gray-600 dark:text-gray-400">{adj.previousStock}</td>
                      <td className={`py-3 px-4 text-right font-semibold ${adj.adjustment > 0 ? 'text-green-600' : 'text-red-600'}`}>
                        {adj.adjustment > 0 ? '+' : ''}{adj.adjustment}
                      </td>
                      <td className="py-3 px-4 text-right font-semibold text-gray-900 dark:text-white">{adj.newStock}</td>
                      <td className="py-3 px-4 text-gray-600 dark:text-gray-400">{adj.reason}</td>
                      <td className="py-3 px-4 text-gray-600 dark:text-gray-400">{adj.adjustedBy}</td>
                      <td className="py-3 px-4 text-gray-600 dark:text-gray-400">{adj.adjustmentDate}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Warehouse Stock Tab */}
        {activeTab === 'warehouse-stock' && (
          <div className="space-y-6">
            <h2 className="text-xl font-bold text-gray-900 dark:text-white">Warehouse Inventory</h2>
            
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-200 dark:border-gray-700">
                    <th className="text-left py-3 px-4 font-semibold text-gray-900 dark:text-white">Warehouse</th>
                    <th className="text-left py-3 px-4 font-semibold text-gray-900 dark:text-white">Product</th>
                    <th className="text-center py-3 px-4 font-semibold text-gray-900 dark:text-white">Location</th>
                    <th className="text-right py-3 px-4 font-semibold text-gray-900 dark:text-white">Stock</th>
                    <th className="text-center py-3 px-4 font-semibold text-gray-900 dark:text-white">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {warehouseStock.map((ws) => (
                    <tr key={ws.id} className="border-b border-gray-100 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700/50">
                      <td className="py-3 px-4 font-medium text-gray-900 dark:text-white">{ws.warehouseName}</td>
                      <td className="py-3 px-4 text-gray-900 dark:text-white">{ws.productName}</td>
                      <td className="py-3 px-4 text-center">
                        <span className="inline-block px-3 py-1 bg-gray-100 dark:bg-gray-700 rounded-full text-sm font-medium text-gray-900 dark:text-white">
                          {ws.location}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-right font-semibold text-gray-900 dark:text-white">{ws.stock}</td>
                      <td className="py-3 px-4 text-center">
                        <button className="px-3 py-1 text-sm bg-emerald-500 hover:bg-emerald-600 text-white rounded-lg font-medium transition-colors">
                          Transfer
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Goods Income Tab */}
        {activeTab === 'goods-income' && (
          <div className="space-y-6">
            <h2 className="text-xl font-bold text-gray-900 dark:text-white">Incoming Goods</h2>
            
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Goods Income List */}
              <motion.div 
                className="lg:col-span-1 space-y-3"
                transition={{ 
                  layout: {
                    duration: 0.3,
                    ease: [0.4, 0, 0.2, 1]
                  }
                }}
              >
                {goodsIncome.map((gi) => (
                  <motion.div
                    key={gi.id}
                    initial={false}
                    whileHover={{ 
                      y: -4,
                      boxShadow: "0 10px 30px -10px rgba(14, 12, 12, 0.2)",
                      transition: { duration: 0.2 }
                    }}
                    onClick={() => {
                      setSelectedGoodsIncome(gi.id);
                      setIsAdjustingQuantities(false);
                      setAdjustedQuantities({});
                    }}
                    className={`bg-white dark:bg-gray-800 rounded-xl p-4 border-2 cursor-pointer transition-colors ${
                      selectedGoodsIncome === gi.id
                        ? 'border-emerald-500 shadow-lg shadow-emerald-500/10'
                        : 'border-gray-200 dark:border-gray-700'
                    }`}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <h3 className="font-semibold text-gray-900 dark:text-white">
                            PO: {gi.poNumber}
                          </h3>
                          <span className={`inline-block px-2 py-0.5 rounded-full text-xs font-medium ${getStatusColor(gi.status)}`}>
                            {gi.status.toUpperCase()}
                          </span>
                        </div>
                        <p className="text-sm text-gray-600 dark:text-gray-400">Supplier: {gi.supplier}</p>
                        <div className="flex items-center gap-4 mt-2">
                          <p className="text-sm text-gray-600 dark:text-gray-400">
                            <span className="font-medium">Items:</span> {gi.items.length}
                          </p>
                          <p className="text-sm text-gray-600 dark:text-gray-400">
                            <span className="font-medium">Total:</span> {gi.items.reduce((sum, item) => sum + item.quantity, 0)} units
                          </p>
                        </div>
                        <p className="text-xs text-gray-500 dark:text-gray-500 mt-2">
                          Expected: {gi.expectedDate}
                        </p>
                      </div>
                      <CheckCircle className={`w-5 h-5 ${selectedGoodsIncome === gi.id ? 'text-emerald-500' : 'text-gray-400'}`} />
                    </div>
                  </motion.div>
                ))}
              </motion.div>

              {/* Goods Income Detail Sidebar */}
              <motion.div 
                key={selectedGoodsIncome}
                initial={{ opacity: 0.5, x: -50 }}
                animate={{ 
                  opacity: 1, 
                  x: 0,
                  transition: {
                    duration: 0.5,
                  }
                }}
                className="lg:col-span-2 bg-white dark:bg-gray-800 rounded-xl p-6 border-2 border-gray-200 dark:border-gray-700 sticky top-24 h-fit"
              >
                <div className="mb-6">
                  <h3 className="text-lg font-bold text-gray-900 dark:text-white">Goods Income Details</h3>
                </div>

                {goodsIncome
                  .filter((gi) => gi.id === selectedGoodsIncome)
                  .map((gi) => {
                    const allItemsArrived = gi.items.every(item => item.received === item.quantity);
                    const hasDiscrepancy = gi.items.some(item => item.received !== item.quantity && item.received > 0);
                    
                    return (
                      <div key={gi.id} className="space-y-6">
                        {/* Workflow Status */}
                        <div className="bg-gray-50 dark:bg-gray-900 rounded-xl p-4 border border-gray-200 dark:border-gray-700">
                          <p className="text-xs font-semibold text-gray-600 dark:text-gray-400 mb-4 uppercase tracking-wide">
                            Delivery Status
                          </p>
                          <div className="flex items-center justify-between">
                            {/* Stage 1: Submitted */}
                            <div className="flex flex-col items-center gap-2">
                              <div className={`w-10 h-10 rounded-full flex items-center justify-center shadow-md ${
                                gi.workflowStatus === 'submitted' || gi.workflowStatus === 'review' || gi.workflowStatus === 'delivery' || gi.workflowStatus === 'arrived' || gi.workflowStatus === 'accepted'
                                  ? 'bg-emerald-500 text-white'
                                  : 'bg-gray-300 dark:bg-gray-600 text-gray-500'
                              }`}>
                                <CheckCircle className="w-5 h-5" />
                              </div>
                              <span className="text-xs font-medium text-gray-900 dark:text-white">Submitted</span>
                            </div>
                            
                            {/* Connector 1 */}
                            <div className={`flex-1 h-1 mx-1 ${
                              gi.workflowStatus === 'review' || gi.workflowStatus === 'delivery' || gi.workflowStatus === 'arrived' || gi.workflowStatus === 'accepted'
                                ? 'bg-emerald-500'
                                : 'bg-gray-300 dark:bg-gray-600'
                            }`}></div>
                            
                            {/* Stage 2: Review */}
                            <div className="flex flex-col items-center gap-2">
                              <div className={`w-10 h-10 rounded-full flex items-center justify-center shadow-md ${
                                gi.workflowStatus === 'review' || gi.workflowStatus === 'delivery' || gi.workflowStatus === 'arrived' || gi.workflowStatus === 'accepted'
                                  ? 'bg-emerald-500 text-white'
                                  : gi.workflowStatus === 'adjustment_pending'
                                  ? 'bg-yellow-500 text-white'
                                  : 'bg-gray-300 dark:bg-gray-600 text-gray-500'
                              }`}>
                                {gi.workflowStatus === 'adjustment_pending' ? (
                                  <AlertTriangle className="w-5 h-5" />
                                ) : (
                                  <Clock className="w-5 h-5" />
                                )}
                              </div>
                              <span className="text-xs font-medium text-gray-900 dark:text-white">Review</span>
                            </div>
                            
                            {/* Connector 2 */}
                            <div className={`flex-1 h-1 mx-1 ${
                              gi.workflowStatus === 'delivery' || gi.workflowStatus === 'arrived' || gi.workflowStatus === 'accepted'
                                ? 'bg-emerald-500'
                                : 'bg-gray-300 dark:bg-gray-600'
                            }`}></div>
                            
                            {/* Stage 3: Delivery */}
                            <div className="flex flex-col items-center gap-2">
                              <div className={`w-10 h-10 rounded-full flex items-center justify-center shadow-md ${
                                gi.workflowStatus === 'delivery' || gi.workflowStatus === 'arrived' || gi.workflowStatus === 'accepted'
                                  ? 'bg-emerald-500 text-white'
                                  : 'bg-gray-300 dark:bg-gray-600 text-gray-500'
                              }`}>
                                <Package className="w-5 h-5" />
                              </div>
                              <span className="text-xs font-medium text-gray-900 dark:text-white">Delivery</span>
                            </div>
                            
                            {/* Connector 3 */}
                            <div className={`flex-1 h-1 mx-1 ${
                              gi.workflowStatus === 'arrived' || gi.workflowStatus === 'accepted'
                                ? 'bg-emerald-500'
                                : 'bg-gray-300 dark:bg-gray-600'
                            }`}></div>
                            
                            {/* Stage 4: Arrived */}
                            <div className="flex flex-col items-center gap-2">
                              <div className={`w-10 h-10 rounded-full flex items-center justify-center shadow-md ${
                                gi.workflowStatus === 'arrived' || gi.workflowStatus === 'accepted'
                                  ? 'bg-emerald-500 text-white'
                                  : 'bg-gray-300 dark:bg-gray-600 text-gray-500'
                              }`}>
                                <CheckCircle className="w-5 h-5" />
                              </div>
                              <span className="text-xs font-medium text-gray-900 dark:text-white">Arrived</span>
                            </div>
                            
                            {/* Connector 4 */}
                            <div className={`flex-1 h-1 mx-1 ${
                              gi.workflowStatus === 'accepted'
                                ? 'bg-emerald-500'
                                : 'bg-gray-300 dark:bg-gray-600'
                            }`}></div>
                            
                            {/* Stage 5: Accepted */}
                            <div className="flex flex-col items-center gap-2">
                              <div className={`w-10 h-10 rounded-full flex items-center justify-center shadow-md ${
                                gi.workflowStatus === 'accepted'
                                  ? 'bg-emerald-500 text-white'
                                  : 'bg-gray-300 dark:bg-gray-600 text-gray-500'
                              }`}>
                                <CheckCircle className="w-5 h-5" />
                              </div>
                              <span className="text-xs font-medium text-gray-900 dark:text-white">Accepted</span>
                            </div>
                          </div>
                          
                          {/* Adjustment Pending Notice */}
                          {gi.workflowStatus === 'adjustment_pending' && (
                            <div className="mt-4 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg p-3">
                              <div className="flex items-center gap-2">
                                <AlertTriangle className="w-4 h-4 text-yellow-600 dark:text-yellow-400" />
                                <p className="text-sm font-medium text-yellow-900 dark:text-yellow-100">
                                  Adjustment Pending Admin Approval
                                </p>
                              </div>
                              {gi.adjustmentReason && (
                                <p className="text-xs text-yellow-700 dark:text-yellow-300 mt-1">
                                  Reason: {gi.adjustmentReason}
                                </p>
                              )}
                            </div>
                          )}
                        </div>

                        {/* Action Buttons - Show when status is appropriate */}
                        {(allItemsArrived || hasDiscrepancy) && gi.workflowStatus !== 'accepted' && gi.workflowStatus !== 'adjustment_pending' && (
                          <div className="flex gap-3">
                            {allItemsArrived && gi.workflowStatus === 'arrived' && (
                              <button
                                onClick={() => {
                                  console.log('Accept goods income:', gi.id);
                                  // Update workflow status to accepted
                                  // In real app, this would call an API
                                  alert(`Delivery ${gi.poNumber} accepted! Status updated to 'Accepted'.`);
                                }}
                                className="flex items-center gap-2 px-5 py-2.5 bg-emerald-500 hover:bg-emerald-600 text-white rounded-xl font-medium transition-all shadow-sm hover:shadow-md"
                              >
                                <CheckCircle className="w-4 h-4" />
                                Accept Delivery
                              </button>
                            )}
                            {(hasDiscrepancy || allItemsArrived) && (
                              <button
                                onClick={() => {
                                  setIsAdjustingQuantities(!isAdjustingQuantities);
                                  if (!isAdjustingQuantities) {
                                    // Initialize adjusted quantities with current received values
                                    const initialQuantities: Record<string, number> = {};
                                    gi.items.forEach((item, idx) => {
                                      initialQuantities[`${gi.id}-${idx}`] = item.received;
                                    });
                                    setAdjustedQuantities(initialQuantities);
                                  }
                                }}
                                className="flex items-center gap-2 px-5 py-2.5 bg-blue-500 hover:bg-blue-600 text-white rounded-xl font-medium transition-all shadow-sm hover:shadow-md"
                              >
                                <Package className="w-4 h-4" />
                                {isAdjustingQuantities ? 'Cancel Adjust' : 'Adjust Quantities'}
                              </button>
                            )}
                          </div>
                        )}

                        {/* Header Info */}
                        <div className="bg-gradient-to-br from-emerald-50 to-emerald-100/50 dark:from-emerald-900/20 dark:to-emerald-800/10 rounded-xl p-3 border-2 border-emerald-200 dark:border-emerald-700">
                          <div className="flex items-center justify-between gap-4">
                            {/* Left: PO Info */}
                            <div className="flex items-center gap-3 flex-1">
                              <div className="w-9 h-9 bg-emerald-500 rounded-full flex items-center justify-center text-white font-bold text-sm">
                                <Package className="w-5 h-5" />
                              </div>
                              <div className="flex-1 min-w-0">
                                <div className="flex items-center gap-2">
                                  <p className="text-xs font-semibold text-emerald-700 dark:text-emerald-300">
                                    {gi.poNumber}
                                  </p>
                                  <span className="text-xs text-emerald-600 dark:text-emerald-400">•</span>
                                  <p className="text-xs font-medium text-emerald-900 dark:text-emerald-100 truncate">
                                    {gi.supplier}
                                  </p>
                                </div>
                                <p className="text-xs text-emerald-600 dark:text-emerald-400 mt-0.5">
                                  Expected: {gi.expectedDate}
                                  {gi.receivedDate && ` | Received: ${gi.receivedDate}`}
                                </p>
                              </div>
                            </div>
                            
                            {/* Right: Status Badge */}
                            <span className={`inline-block px-3 py-1 rounded-full text-xs font-semibold whitespace-nowrap ${getStatusColor(gi.status)}`}>
                              {gi.status.toUpperCase()}
                            </span>
                          </div>
                        </div>

                        {/* Items List */}
                        <div>
                          <div className="flex items-center justify-between mb-3">
                            <h4 className="text-sm font-semibold text-gray-900 dark:text-white uppercase tracking-wide">
                              Items
                            </h4>
                            <span className="text-xs font-medium text-gray-500 dark:text-gray-400">
                              {gi.items.length} {gi.items.length === 1 ? 'Item' : 'Items'}
                            </span>
                          </div>
                          
                          {/* Item Cards */}
                          <div className="space-y-3">
                            {gi.items.map((item, index) => {
                              const itemKey = `${gi.id}-${index}`;
                              const currentReceived = isAdjustingQuantities 
                                ? (adjustedQuantities[itemKey] ?? item.received)
                                : item.received;
                              const isComplete = currentReceived === item.quantity;
                              const isPartial = currentReceived > 0 && currentReceived < item.quantity;
                              const isOver = currentReceived > item.quantity;
                              
                              return (
                                <div key={index} className="bg-white dark:bg-gray-900 rounded-xl p-4 border-2 border-gray-200 dark:border-gray-700">
                                  <div className="flex items-start justify-between mb-3">
                                    <div className="flex-1">
                                      <div className="flex items-center gap-2 mb-1">
                                        <div className="w-6 h-6 bg-emerald-500 text-white rounded-full flex items-center justify-center text-xs font-bold">
                                          {index + 1}
                                        </div>
                                        <h5 className="font-semibold text-gray-900 dark:text-white">{item.productName}</h5>
                                      </div>
                                    </div>
                                    {isComplete && (
                                      <span className="inline-block px-2 py-1 rounded-full text-xs font-medium bg-green-100 dark:bg-green-900/30 text-green-600">
                                        COMPLETE
                                      </span>
                                    )}
                                    {isPartial && (
                                      <span className="inline-block px-2 py-1 rounded-full text-xs font-medium bg-yellow-100 dark:bg-yellow-900/30 text-yellow-600">
                                        PARTIAL
                                      </span>
                                    )}
                                    {isOver && (
                                      <span className="inline-block px-2 py-1 rounded-full text-xs font-medium bg-blue-100 dark:bg-blue-900/30 text-blue-600">
                                        OVER
                                      </span>
                                    )}
                                  </div>
                                  
                                  <div className="grid grid-cols-3 gap-3 mt-3 pt-3 border-t border-gray-200 dark:border-gray-700">
                                    <div>
                                      <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">Ordered</p>
                                      <p className="text-sm font-semibold text-gray-900 dark:text-white">{item.quantity} units</p>
                                    </div>
                                    <div>
                                      <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">Received</p>
                                      {isAdjustingQuantities ? (
                                        <Input
                                          type="number"
                                          value={currentReceived.toString()}
                                          onChange={(value) => {
                                            setAdjustedQuantities({
                                              ...adjustedQuantities,
                                              [itemKey]: parseInt(value) || 0
                                            });
                                          }}
                                          min={0}
                                          className="h-8 text-sm"
                                        />
                                      ) : (
                                        <p className={`text-sm font-semibold ${
                                          isComplete ? 'text-green-600' : 
                                          isPartial ? 'text-yellow-600' : 
                                          isOver ? 'text-blue-600' :
                                          'text-gray-900 dark:text-white'
                                        }`}>
                                          {currentReceived} units
                                        </p>
                                      )}
                                    </div>
                                    <div>
                                      <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">Difference</p>
                                      <p className={`text-sm font-semibold ${
                                        currentReceived - item.quantity > 0 ? 'text-blue-600' :
                                        currentReceived - item.quantity < 0 ? 'text-red-600' :
                                        'text-green-600'
                                      }`}>
                                        {currentReceived - item.quantity > 0 ? '+' : ''}{currentReceived - item.quantity} units
                                      </p>
                                    </div>
                                  </div>
                                </div>
                              );
                            })}
                          </div>
                        </div>

                        {/* Save Adjusted Quantities */}
                        {isAdjustingQuantities && (
                          <div className="bg-gradient-to-br from-emerald-50 to-emerald-100/50 dark:from-emerald-900/20 dark:to-emerald-800/10 rounded-xl p-4 border-2 border-emerald-200 dark:border-emerald-700">
                            <div className="flex items-center justify-between">
                              <div>
                                <p className="text-sm font-semibold text-emerald-900 dark:text-emerald-100">
                                  Adjust received quantities
                                </p>
                                <p className="text-xs text-emerald-600 dark:text-emerald-400 mt-1">
                                  Update quantities for items received over or under the ordered amount
                                </p>
                              </div>
                              <button
                                onClick={() => {
                                  console.log('Save adjusted quantities:', adjustedQuantities);
                                  // Update status to adjustment_pending
                                  // In real app, this would call an API to create adjustment request
                                  alert(`Adjustment request submitted for ${gi.poNumber}!\n\nStatus updated to 'Adjustment Pending' - waiting for admin approval.\n\nAdjusted quantities: ${JSON.stringify(adjustedQuantities, null, 2)}`);
                                  setIsAdjustingQuantities(false);
                                }}
                                className="px-6 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-semibold transition-all shadow-lg hover:shadow-xl flex items-center gap-2"
                              >
                                <CheckCircle className="w-5 h-5" />
                                Save Changes
                              </button>
                            </div>
                          </div>
                        )}
                      </div>
                    );
                  })}
              </motion.div>
            </div>
          </div>
        )}
      </div>

      {/* Stock Adjustment Request Modal */}
      {isAdjustmentModalOpen && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto"
          >
            {/* Modal Header */}
            <div className="sticky top-0 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 px-6 py-4 flex items-center justify-between z-10">
              <div>
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Request Stock Adjustment</h2>
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                  Submit adjustment request for admin approval
                </p>
              </div>
              <button
                onClick={() => {
                  setIsAdjustmentModalOpen(false);
                  setAdjustmentItems([{ id: 1, productId: '', quantity: '', reason: '' }]);
                }}
                className="w-10 h-10 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 flex items-center justify-center transition-colors"
              >
                <X className="w-5 h-5 text-gray-500" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6 space-y-6">
              {/* User Information */}
              <div className="bg-emerald-50 dark:bg-emerald-900/20 rounded-xl p-4 border border-emerald-200 dark:border-emerald-800">
                <h3 className="font-semibold text-emerald-900 dark:text-emerald-100 mb-3">Requester Information</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-emerald-700 dark:text-emerald-300 mb-1">Name</p>
                    <p className="font-medium text-emerald-900 dark:text-emerald-100">John Manager</p>
                  </div>
                  <div>
                    <p className="text-sm text-emerald-700 dark:text-emerald-300 mb-1">Date</p>
                    <p className="font-medium text-emerald-900 dark:text-emerald-100">{new Date().toLocaleDateString()}</p>
                  </div>
                </div>
              </div>

              {/* Form Header */}
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Adjustment Items</h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                    Add products that need stock adjustment
                  </p>
                </div>
                <button
                  onClick={() => {
                    const newId = Math.max(...adjustmentItems.map((item) => item.id)) + 1;
                    setAdjustmentItems([...adjustmentItems, { id: newId, productId: '', quantity: '', reason: '' }]);
                  }}
                  className="flex items-center gap-2 px-4 py-2 bg-emerald-500 hover:bg-emerald-600 text-white rounded-xl font-medium transition-all shadow-sm hover:shadow-md"
                >
                  <Plus className="w-4 h-4" />
                  Add Item
                </button>
              </div>

              {/* Adjustment Items */}
              <div className="space-y-4">
                {adjustmentItems.map((item, index) => (
                  <div
                    key={item.id}
                    className="bg-white dark:bg-gray-800 rounded-xl p-6 border-2 border-gray-200 dark:border-gray-700 relative group hover:border-emerald-300 dark:hover:border-emerald-700 transition-all"
                  >
                    {/* Item Number Badge */}
                    <div className="absolute -top-3 -left-3 w-9 h-9 bg-emerald-500 text-white rounded-full flex items-center justify-center font-bold text-sm shadow-lg">
                      {index + 1}
                    </div>

                    {/* Remove Button */}
                    {adjustmentItems.length > 1 && (
                      <button
                        onClick={() => {
                          setAdjustmentItems(adjustmentItems.filter((i) => i.id !== item.id));
                        }}
                        className="absolute -top-3 -right-3 w-9 h-9 bg-red-500 hover:bg-red-600 text-white rounded-full flex items-center justify-center transition-all shadow-lg opacity-0 group-hover:opacity-100"
                        title="Remove item"
                      >
                        <Trash className="w-4 h-4" />
                      </button>
                    )}

                    <div className="grid grid-cols-1 md:grid-cols-12 gap-5">
                      {/* Product Selection */}
                      <div className="md:col-span-5">
                        <Select
                          label="Product"
                          value={item.productId}
                          onChange={(value) => {
                            const updated = adjustmentItems.map((i) =>
                              i.id === item.id ? { ...i, productId: value } : i
                            );
                            setAdjustmentItems(updated);
                          }}
                          options={stockItems.map((stockItem) => ({
                            value: stockItem.id,
                            label: `${stockItem.name} (${stockItem.sku}) - Current: ${stockItem.currentStock}`,
                          }))}
                          placeholder="Select a product"
                          required
                        />
                      </div>

                      {/* Quantity */}
                      <div className="md:col-span-3">
                        <Input
                          label="Quantity"
                          type="number"
                          value={item.quantity}
                          onChange={(value) => {
                            const updated = adjustmentItems.map((i) =>
                              i.id === item.id ? { ...i, quantity: value } : i
                            );
                            setAdjustmentItems(updated);
                          }}
                          placeholder="e.g., 2"
                          required
                        />
                      </div>

                      {/* Reason */}
                      <div className="md:col-span-4">
                        <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-2 uppercase tracking-wide">
                          Reason <span className="text-red-500">*</span>
                        </label>
                        <input
                          type="text"
                          value={item.reason}
                          onChange={(e) => {
                            const updated = adjustmentItems.map((i) =>
                              i.id === item.id ? { ...i, reason: e.target.value } : i
                            );
                            setAdjustmentItems(updated);
                          }}
                          placeholder="e.g., Expired"
                          className="w-full h-11 px-4 rounded-lg border-2 border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-900 text-gray-900 dark:text-white text-sm placeholder-gray-400 focus:outline-none focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10 transition-all"
                        />
                      </div>
                    </div>

                    {/* Example hint */}
                    {index === 0 && (
                      <div className="mt-3 text-xs text-gray-500 dark:text-gray-400 italic">
                        Example: Coca-cola, 2 cans, Expired
                      </div>
                    )}
                  </div>
                ))}
              </div>

              {/* Additional Notes */}
              <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border-2 border-gray-200 dark:border-gray-700">
                <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-2 uppercase tracking-wide">
                  Additional Notes
                </label>
                <textarea
                  rows={3}
                  placeholder="Any additional information about this adjustment request..."
                  className="w-full px-4 py-3 rounded-lg border-2 border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-900 text-gray-900 dark:text-white text-sm placeholder-gray-400 focus:outline-none focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10 transition-all resize-none"
                ></textarea>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="sticky bottom-0 bg-gradient-to-br from-emerald-50 to-emerald-100/50 dark:from-emerald-900/20 dark:to-emerald-800/10 border-t-2 border-emerald-200 dark:border-emerald-700 px-6 py-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-lg font-bold text-emerald-600 dark:text-emerald-400">
                    <span className="text-lg font-bold text-black dark:text-white">Total items: </span>
                    {adjustmentItems.length} {adjustmentItems.length === 1 ? 'Item' : 'Items'}
                  </p>
                  <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">
                    Request will be sent to admin for approval
                  </p>
                </div>
                <div className="flex gap-3">
                  <button
                    onClick={() => {
                      setIsAdjustmentModalOpen(false);
                      setAdjustmentItems([{ id: 1, productId: '', quantity: '', reason: '' }]);
                    }}
                    className="px-6 py-2.5 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300 border-2 border-gray-300 dark:border-gray-600 rounded-xl font-semibold transition-all shadow-sm hover:shadow-md"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={() => {
                      // Handle submission here
                      console.log('Adjustment request submitted:', adjustmentItems);
                      setIsAdjustmentModalOpen(false);
                      setAdjustmentItems([{ id: 1, productId: '', quantity: '', reason: '' }]);
                    }}
                    className="px-6 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-semibold transition-all shadow-lg hover:shadow-xl flex items-center gap-2"
                  >
                    <CheckCircle className="w-5 h-5" />
                    Submit Request
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
}
