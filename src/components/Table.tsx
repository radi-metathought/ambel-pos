import { useState } from 'react';
import { Search, SlidersHorizontal } from 'lucide-react';
import { tables, activeOrders } from '../data/tableData';

export default function Table() {
  const [activeFloor, setActiveFloor] = useState(1);
  const [searchQuery, setSearchQuery] = useState('');

  const filteredTables = tables.filter((table) => table.floor === activeFloor);
  const filteredOrders = activeOrders.filter((order) =>
    order.customerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    order.id.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Create a grid layout for tables
  const maxRow = Math.max(...filteredTables.map((t) => t.gridPosition.row));
  const maxCol = Math.max(...filteredTables.map((t) => t.gridPosition.col));

  const renderTableCard = (table: typeof tables[0]) => {
    const isOccupied = table.status === 'occupied';
    const chairs = table.capacity;

    return (
      <div
        key={table.id}
        className={`relative flex flex-col items-center justify-center p-4 rounded-2xl transition-all cursor-pointer ${
          isOccupied
            ? 'bg-emerald-500 hover:bg-emerald-600'
            : 'bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600'
        }`}
        style={{
          gridRow: table.gridPosition.row + 1,
          gridColumn: table.gridPosition.col + 1,
          minHeight: table.capacity > 4 ? '120px' : '100px',
        }}
      >
        {/* Chairs representation */}
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="relative">
            {/* Top chairs */}
            <div className="absolute -top-6 left-1/2 transform -translate-x-1/2 flex gap-1">
              {Array.from({ length: Math.min(chairs, 2) }).map((_, i) => (
                <div
                  key={`top-${i}`}
                  className={`w-4 h-3 rounded-t ${
                    isOccupied ? 'bg-emerald-600' : 'bg-gray-300 dark:bg-gray-600'
                  }`}
                />
              ))}
            </div>
            
            {/* Bottom chairs */}
            <div className="absolute -bottom-6 left-1/2 transform -translate-x-1/2 flex gap-1">
              {Array.from({ length: Math.min(chairs, 2) }).map((_, i) => (
                <div
                  key={`bottom-${i}`}
                  className={`w-4 h-3 rounded-b ${
                    isOccupied ? 'bg-emerald-600' : 'bg-gray-300 dark:bg-gray-600'
                  }`}
                />
              ))}
            </div>

            {/* Left chairs (for 6-seat tables) */}
            {chairs > 4 && (
              <div className="absolute left-0 top-1/2 transform -translate-x-6 -translate-y-1/2">
                <div
                  className={`w-3 h-4 rounded-l ${
                    isOccupied ? 'bg-emerald-600' : 'bg-gray-300 dark:bg-gray-600'
                  }`}
                />
              </div>
            )}

            {/* Right chairs (for 6-seat tables) */}
            {chairs > 4 && (
              <div className="absolute right-0 top-1/2 transform translate-x-6 -translate-y-1/2">
                <div
                  className={`w-3 h-4 rounded-r ${
                    isOccupied ? 'bg-emerald-600' : 'bg-gray-300 dark:bg-gray-600'
                  }`}
                />
              </div>
            )}
          </div>
        </div>

        {/* Table content */}
        <div className="text-center z-10">
          <p
            className={`font-semibold text-sm ${
              isOccupied ? 'text-white' : 'text-gray-900 dark:text-white'
            }`}
          >
            {isOccupied ? table.number : table.number}
          </p>
          {!isOccupied && table.orderId && (
            <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">{table.orderId}</p>
          )}
        </div>
      </div>
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
          {[1, 2, 3].map((floor) => (
            <button
              key={floor}
              onClick={() => setActiveFloor(floor)}
              className={`px-6 py-3 font-medium transition-all ${
                activeFloor === floor
                  ? 'text-gray-900 dark:text-white border-b-2 border-emerald-500'
                  : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'
              }`}
            >
              {floor === 1 ? '1st' : floor === 2 ? '2nd' : '3rd'} floor
            </button>
          ))}
        </div>

        {/* Table Grid */}
        <div
          className="grid gap-6 p-6 bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700"
          style={{
            gridTemplateRows: `repeat(${maxRow + 1}, minmax(100px, auto))`,
            gridTemplateColumns: `repeat(${maxCol + 1}, minmax(120px, 1fr))`,
          }}
        >
          {filteredTables.map((table) => renderTableCard(table))}
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
