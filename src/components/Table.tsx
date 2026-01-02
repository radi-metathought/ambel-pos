import { Search, SlidersHorizontal, Users } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import tableLayoutData from '../data/tableLayout.json';
import { activeOrders } from '../data/tableData';
import { useState } from 'react'; // Added useState import

export default function Table() {
  const [areas] = useState(tableLayoutData.areas);
  const [tablesList, setTablesList] = useState(tableLayoutData.tables);
  const [activeAreaId, setActiveAreaId] = useState(areas[0]?.id || '');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTableId, setSelectedTableId] = useState<string | null>(null);

  const activeArea = areas.find(a => a.id === activeAreaId);
  const areaTables = tablesList.filter(t => t.areaId === activeAreaId);
  
  const filteredOrders = activeOrders.filter((order) =>
    order.customerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    order.id.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const renderTableCard = (table: any) => {
    const isOccupied = table.status === 'occupied';
    const isSelected = selectedTableId === table.id;

    return (
      <motion.div
        key={table.id}
        initial={false}
        animate={{
          x: table.x,
          y: table.y,
          rotate: table.rotation,
          scale: isSelected ? 1.05 : 1
        }}
        onClick={(e) => {
          e.stopPropagation();
          setSelectedTableId(table.id);
        }}
        className={`absolute cursor-pointer flex flex-col items-center justify-center transition-all duration-200 ${
          table.type === 'round' ? 'rounded-full' : 'rounded-xl'
        } ${
          isSelected 
            ? 'ring-2 ring-emerald-500 ring-offset-4 dark:ring-offset-gray-900 z-50' 
            : 'hover:ring-2 hover:ring-gray-300 dark:hover:ring-gray-700 hover:ring-offset-2'
        } ${
          table.status === 'available' ? 'bg-emerald-500 shadow-emerald-500/20' :
          table.status === 'occupied' ? 'bg-rose-500 shadow-rose-500/20' : 'bg-amber-500 shadow-amber-500/20'
        } shadow-lg`}
        style={{
          width: table.width,
          height: table.height,
        }}
      >
        <div className="text-white font-bold text-sm select-none">
          {table.name}
        </div>
        <div className="flex items-center gap-1 text-[10px] text-white/80 font-bold select-none">
          <Users className="w-3 h-3" />
          {table.capacity}
        </div>
      </motion.div>
    );
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* Left Section - Table Monitor */}
      <div className="lg:col-span-2 space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Table monitor</h1>
        </div>

        {/* Floor Tabs */}
        <div className="flex gap-2 border-b border-gray-200 dark:border-gray-700">
          {areas.map((area) => (
            <button
              key={area.id}
              onClick={() => setActiveAreaId(area.id)}
              className={`px-6 py-3 font-medium transition-all ${
                activeAreaId === area.id
                  ? 'text-gray-900 dark:text-white border-b-2 border-emerald-500'
                  : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'
              }`}
            >
              {area.name}
            </button>
          ))}
        </div>

        {/* Table Map Container */}
        <div 
          className="relative bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 overflow-hidden"
          style={{ height: '500px' }}
          onClick={() => setSelectedTableId(null)}
        >
          {/* Floor Plan Canvas */}
          <div 
            className="absolute bg-gray-50 dark:bg-gray-900/50 shadow-inner rounded-sm border border-gray-100 dark:border-gray-800 transition-all duration-300 origin-center"
            style={{ 
              width: activeArea?.width || 800, 
              height: activeArea?.height || 600,
              left: '50%',
              top: '50%',
              transform: 'translate(-50%, -50%) scale(0.6)'
            }}
            onClick={(e) => e.stopPropagation()}
          >
            {areaTables.map((table) => renderTableCard(table))}
          </div>
        </div>
      </div>

      {/* Right Section - Table Information */}
      <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 p-6 h-fit sticky top-24">
        <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">Table information</h2>

        {/* Search Bar */}
        <div className="flex items-center gap-3 mb-6">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search customers, ID"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-emerald-500"
            />
          </div>
          <button className="p-2.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
            <SlidersHorizontal className="w-5 h-5 text-gray-600 dark:text-gray-300" />
          </button>
        </div>

        {/* Active Orders List */}
        <div className="space-y-4 max-h-[600px] overflow-y-auto scrollbar-none">
          {filteredOrders.map((order) => (
            <div
              key={order.id}
              className="bg-gray-50 dark:bg-gray-900 rounded-2xl p-4 border border-gray-200 dark:border-gray-700"
            >
              <div className="flex items-start justify-between mb-3">
                <div className="flex-1">
                  <h3 className="font-semibold text-gray-900 dark:text-white mb-1">
                    {order.customerName}
                  </h3>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    {order.id} · {order.tableNumber}
                  </p>
                  <p className="text-sm text-gray-700 dark:text-gray-300 mt-2">
                    {order.items} Items · ${order.total}
                  </p>
                </div>

                {/* Circular Progress */}
                <div className="relative w-16 h-16">
                  <svg className="w-16 h-16 transform -rotate-90">
                    <circle
                      cx="32"
                      cy="32"
                      r="28"
                      stroke="currentColor"
                      strokeWidth="4"
                      fill="none"
                      className="text-gray-200 dark:text-gray-700"
                    />
                    <circle
                      cx="32"
                      cy="32"
                      r="28"
                      stroke="currentColor"
                      strokeWidth="4"
                      fill="none"
                      strokeDasharray={`${2 * Math.PI * 28}`}
                      strokeDashoffset={`${2 * Math.PI * 28 * (1 - order.progress / 100)}`}
                      className="text-emerald-500 transition-all duration-300"
                      strokeLinecap="round"
                    />
                  </svg>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <span className="text-sm font-bold text-gray-900 dark:text-white">
                      {order.progress}%
                    </span>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="grid grid-cols-2 gap-2">
                <button className="py-2 px-4 rounded-lg border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 font-medium hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors">
                  Detail
                </button>
                <button className="py-2 px-4 rounded-lg bg-emerald-500 hover:bg-emerald-600 text-white font-medium transition-colors">
                  Done
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
