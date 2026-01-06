import { useState, useEffect } from 'react';
import { 
  TrendingUp, 
  ShoppingCart, 
  Package, 
  DollarSign, 
  Award, 
  Users, 
  Calendar,
  PieChart,
  Grid,
  CreditCard,
  Loader2,
  ArrowLeft,
  Download,
  RefreshCw,
  FileSpreadsheet,
  FileText,
  ChevronDown
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { apiService } from '../../services';
import toast from 'react-hot-toast';

// Report type definition
interface AvailableReport {
  id: string;
  name: string;
  description: string;
  category: string;
  icon: string;
  endpoint: string;
  filters: string[];
}

// Icon mapping
const iconMap: Record<string, React.ElementType> = {
  'trending-up': TrendingUp,
  'shopping-cart': ShoppingCart,
  'package': Package,
  'dollar-sign': DollarSign,
  'award': Award,
  'users': Users,
  'calendar': Calendar,
  'pie-chart': PieChart,
  'grid': Grid,
  'credit-card': CreditCard,
};

// Category colors
const categoryColors: Record<string, { bg: string; text: string; border: string }> = {
  sales: { bg: 'bg-blue-50 dark:bg-blue-900/20', text: 'text-blue-600 dark:text-blue-400', border: 'border-blue-200 dark:border-blue-800' },
  purchase: { bg: 'bg-purple-50 dark:bg-purple-900/20', text: 'text-purple-600 dark:text-purple-400', border: 'border-purple-200 dark:border-purple-800' },
  inventory: { bg: 'bg-amber-50 dark:bg-amber-900/20', text: 'text-amber-600 dark:text-amber-400', border: 'border-amber-200 dark:border-amber-800' },
  financial: { bg: 'bg-emerald-50 dark:bg-emerald-900/20', text: 'text-emerald-600 dark:text-emerald-400', border: 'border-emerald-200 dark:border-emerald-800' },
  performance: { bg: 'bg-rose-50 dark:bg-rose-900/20', text: 'text-rose-600 dark:text-rose-400', border: 'border-rose-200 dark:border-rose-800' },
};

// Available reports data
const availableReports: AvailableReport[] = [
  {
    id: 'sales',
    name: 'Sales Report',
    description: 'Comprehensive sales overview with revenue, orders, and trends',
    category: 'sales',
    icon: 'trending-up',
    endpoint: '/reports/sales',
    filters: ['startDate', 'endDate', 'branchId'],
  },
  {
    id: 'purchase',
    name: 'Purchase Report',
    description: 'Purchase orders and invoices summary',
    category: 'purchase',
    icon: 'shopping-cart',
    endpoint: '/reports/purchase',
    filters: ['startDate', 'endDate'],
  },
  {
    id: 'inventory',
    name: 'Stock Inventory',
    description: 'Current stock levels, low stock alerts, and inventory value',
    category: 'inventory',
    icon: 'package',
    endpoint: '/reports/inventory',
    filters: ['categoryId'],
  },
  {
    id: 'cogs',
    name: 'Cost of Goods Sold',
    description: 'COGS analysis with profit margins',
    category: 'financial',
    icon: 'dollar-sign',
    endpoint: '/reports/cogs',
    filters: ['startDate', 'endDate'],
  },
  {
    id: 'top-products',
    name: 'Top Selling Products',
    description: 'Best performing products by quantity and revenue',
    category: 'performance',
    icon: 'award',
    endpoint: '/reports/top-products',
    filters: ['startDate', 'endDate', 'limit'],
  },
  {
    id: 'sales-by-user',
    name: 'Sales by User',
    description: 'Sales performance breakdown by cashier/staff',
    category: 'performance',
    icon: 'users',
    endpoint: '/reports/sales-by-user',
    filters: ['startDate', 'endDate'],
  },
  {
    id: 'sales-by-day',
    name: 'Sales by Day',
    description: 'Daily sales trends and patterns',
    category: 'sales',
    icon: 'calendar',
    endpoint: '/reports/sales-by-day',
    filters: ['startDate', 'endDate', 'groupBy'],
  },
  {
    id: 'profit-loss',
    name: 'Profit & Loss',
    description: 'Revenue, expenses, and net profit overview',
    category: 'financial',
    icon: 'pie-chart',
    endpoint: '/reports/profit-loss',
    filters: ['startDate', 'endDate'],
  },
  {
    id: 'category-sales',
    name: 'Sales by Category',
    description: 'Sales breakdown by product category',
    category: 'sales',
    icon: 'grid',
    endpoint: '/reports/category-sales',
    filters: ['startDate', 'endDate'],
  },
  {
    id: 'payment-methods',
    name: 'Payment Methods Report',
    description: 'Sales breakdown by payment method',
    category: 'financial',
    icon: 'credit-card',
    endpoint: '/reports/payment-methods',
    filters: ['startDate', 'endDate'],
  },
];

const ReportsPage = () => {
  const [selectedReport, setSelectedReport] = useState<AvailableReport | null>(null);
  const [loading, setLoading] = useState(false);
  const [reportData, setReportData] = useState<any>(null);
  const [startDate, setStartDate] = useState(() => {
    const date = new Date();
    date.setMonth(date.getMonth() - 1);
    return date.toISOString().split('T')[0];
  });
  const [endDate, setEndDate] = useState(() => new Date().toISOString().split('T')[0]);
  const [activeCategory, setActiveCategory] = useState<string>('all');
  const [showExportMenu, setShowExportMenu] = useState(false);

  const categories = ['all', ...new Set(availableReports.map(r => r.category))];

  const filteredReports = activeCategory === 'all' 
    ? availableReports 
    : availableReports.filter(r => r.category === activeCategory);

  const fetchReport = async () => {
    if (!selectedReport) return;
    
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (selectedReport.filters.includes('startDate') && startDate) {
        params.append('startDate', startDate);
      }
      if (selectedReport.filters.includes('endDate') && endDate) {
        params.append('endDate', endDate);
      }
      
      const endpoint = selectedReport.endpoint.startsWith('/') 
        ? selectedReport.endpoint.substring(1) 
        : selectedReport.endpoint;
      
      const url = params.toString() ? `${endpoint}?${params.toString()}` : endpoint;
      const data = await apiService.get<any>(url);
      setReportData(data);
    } catch (error: any) {
      toast.error(error.message || 'Failed to load report');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (selectedReport) {
      fetchReport();
    }
  }, [selectedReport]);

  const handleSelectReport = (report: AvailableReport) => {
    setSelectedReport(report);
    setReportData(null);
  };

  const handleBack = () => {
    setSelectedReport(null);
    setReportData(null);
  };

  // Handle export
  const handleExport = async (format: 'xlsx' | 'csv' | 'json') => {
    if (!selectedReport || !reportData) {
      toast.error('No report data to export');
      return;
    }
    
    setShowExportMenu(false);
    
    const loadingToast = toast.loading(`Generating ${format.toUpperCase()} report...`);
    
    try {
      const params = new URLSearchParams();
      if (startDate) params.append('startDate', startDate);
      if (endDate) params.append('endDate', endDate);
      params.append('format', format);
      
      const endpoint = selectedReport.endpoint.startsWith('/') 
        ? selectedReport.endpoint.substring(1) 
        : selectedReport.endpoint;
      
      // Get auth token from apiService (uses secureTokenStorage)
      const token = apiService.getAuthToken();
      
      // Create download link with auth
      const baseUrl = import.meta.env.VITE_API_URL || 'http://localhost:3000/api/v1';
      const exportUrl = `${baseUrl}/${endpoint}/export?${params.toString()}`;
      
      // Fetch with auth header
      const response = await fetch(exportUrl, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });
      
      if (!response.ok) {
        throw new Error('Export failed');
      }
      
      // Get blob and trigger download
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      
      // Set filename based on format
      const filename = `${selectedReport.id}-report-${startDate}-to-${endDate}.${format}`;
      link.download = filename;
      
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
      
      toast.dismiss(loadingToast);
      toast.success(`Report exported as ${format.toUpperCase()}`);
    } catch (error: any) {
      toast.dismiss(loadingToast);
      toast.error(error.message || 'Export failed');
    }
  };

  // Render report data based on type
  const renderReportData = () => {
    if (!reportData) return null;

    // Unwrap response - API returns {success: true, report: {...}}
    const data = reportData.report || reportData.data || reportData;

    // Handle structured report response with meta, summary, and charts
    if (data.meta && data.summary) {
      const colorClasses: Record<string, string> = {
        success: 'text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-900/20',
        primary: 'text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/20',
        info: 'text-cyan-600 dark:text-cyan-400 bg-cyan-50 dark:bg-cyan-900/20',
        warning: 'text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-900/20',
        danger: 'text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-900/20',
      };

      const iconComponents: Record<string, React.ElementType> = {
        'dollar-sign': DollarSign,
        'shopping-bag': ShoppingCart,
        'package': Package,
        'trending-up': TrendingUp,
        'percent': TrendingUp,
        'users': Users,
        'award': Award,
        'calendar': Calendar,
        'credit-card': CreditCard,
        'pie-chart': PieChart,
        'grid': Grid,
      };

      return (
        <div className="space-y-6">
          {/* Meta Info */}
          <div className="flex items-center justify-between text-xs text-gray-500 dark:text-gray-400">
            <span>
              Period: {data.meta.period?.startDate} to {data.meta.period?.endDate}
            </span>
            <span>
              Generated: {new Date(data.meta.generatedAt).toLocaleString()}
            </span>
          </div>

          {/* Summary Cards */}
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {data.summary.map((item: any, idx: number) => {
              const IconComponent = iconComponents[item.icon] || TrendingUp;
              const colorClass = colorClasses[item.color] || colorClasses.primary;
              
              return (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.05 }}
                  className="bg-white dark:bg-gray-800 rounded-xl p-4 border border-gray-100 dark:border-gray-700"
                >
                  <div className="flex items-center gap-2 mb-2">
                    <div className={`p-1.5 rounded-lg ${colorClass}`}>
                      <IconComponent className="w-3.5 h-3.5" />
                    </div>
                    <span className="text-xs text-gray-500 dark:text-gray-400 font-medium">
                      {item.label}
                    </span>
                  </div>
                  <p className="text-xl font-bold text-gray-900 dark:text-white">
                    {typeof item.value === 'number' 
                      ? item.value.toLocaleString() 
                      : item.value}
                  </p>
                </motion.div>
              );
            })}
          </div>

          {/* Charts placeholder */}
          {data.charts && data.charts.length > 0 && data.charts[0]?.labels?.length > 0 && (
            <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-100 dark:border-gray-700">
              <h4 className="text-sm font-semibold text-gray-900 dark:text-white mb-4">
                {data.charts[0]?.datasets?.[0]?.label || 'Chart'}
              </h4>
              <div className="h-48 flex items-end gap-1">
                {data.charts[0].datasets[0]?.data?.map((value: number, idx: number) => (
                  <div
                    key={idx}
                    className="flex-1 bg-emerald-500 rounded-t transition-all hover:bg-emerald-400"
                    style={{ height: `${Math.max((value / Math.max(...data.charts[0].datasets[0].data)) * 100, 5)}%` }}
                    title={`${data.charts[0].labels[idx]}: $${value.toLocaleString()}`}
                  />
                ))}
              </div>
            </div>
          )}

          {/* Data Table */}
          {data.table && data.table.rows && data.table.rows.length > 0 && (
            <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-100 dark:border-gray-700 overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="bg-gray-50 dark:bg-gray-900/50 border-b border-gray-100 dark:border-gray-700">
                      {data.table.columns.map((col: any) => (
                        <th 
                          key={col.field} 
                          className={`px-4 py-3 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider ${
                            col.align === 'right' ? 'text-right' : col.align === 'center' ? 'text-center' : 'text-left'
                          }`}
                        >
                          {col.header}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-50 dark:divide-gray-800">
                    {data.table.rows.map((row: any, rowIdx: number) => (
                      <tr key={rowIdx} className="hover:bg-gray-50/50 dark:hover:bg-gray-900/30 transition-colors">
                        {data.table.columns.map((col: any) => {
                          const value = row[col.field];
                          let displayValue;
                          
                          // Format based on column type
                          if (col.type === 'currency') {
                            displayValue = `$${typeof value === 'number' ? value.toFixed(2) : value}`;
                          } else if (col.type === 'number') {
                            displayValue = typeof value === 'number' ? value.toLocaleString() : value;
                          } else if (col.type === 'badge') {
                            const badgeColors: Record<string, string> = {
                              'COMPLETED': 'bg-emerald-50 text-emerald-600 dark:bg-emerald-900/30 dark:text-emerald-400',
                              'PENDING': 'bg-amber-50 text-amber-600 dark:bg-amber-900/30 dark:text-amber-400',
                              'CANCELLED': 'bg-red-50 text-red-600 dark:bg-red-900/30 dark:text-red-400',
                              'CASHIER': 'bg-blue-50 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400',
                              'CARD': 'bg-purple-50 text-purple-600 dark:bg-purple-900/30 dark:text-purple-400',
                              'CASH': 'bg-green-50 text-green-600 dark:bg-green-900/30 dark:text-green-400',
                            };
                            const colorClass = badgeColors[value] || 'bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400';
                            displayValue = (
                              <span className={`inline-block px-2 py-0.5 rounded text-xs font-medium ${colorClass}`}>
                                {value}
                              </span>
                            );
                          } else {
                            displayValue = value;
                          }
                          
                          return (
                            <td 
                              key={col.field} 
                              className={`px-4 py-3 text-sm text-gray-700 dark:text-gray-300 ${
                                col.align === 'right' ? 'text-right' : col.align === 'center' ? 'text-center' : 'text-left'
                              } ${col.type === 'currency' ? 'font-medium tabular-nums' : ''}`}
                            >
                              {displayValue}
                            </td>
                          );
                        })}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              
              {/* Pagination Info */}
              {data.table.pagination && (
                <div className="px-4 py-3 border-t border-gray-100 dark:border-gray-700 bg-gray-50/50 dark:bg-gray-900/30">
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    Showing {data.table.rows.length} of {data.table.pagination.total} records
                  </p>
                </div>
              )}
            </div>
          )}
        </div>
      );
    }

    // If it's an array, render as table
    if (Array.isArray(data)) {
      if (data.length === 0) {
        return (
          <div className="text-center py-12 text-gray-500">
            <Package className="w-12 h-12 mx-auto mb-4 opacity-50" />
            <p>No data available for the selected period</p>
          </div>
        );
      }

      const columns = Object.keys(data[0]);
      
      return (
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50">
                {columns.map((col) => (
                  <th key={col} className="px-4 py-3 text-left text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wider">
                    {col.replace(/_/g, ' ')}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
              {data.map((row: any, idx: number) => (
                <tr key={idx} className="hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors">
                  {columns.map((col) => (
                    <td key={col} className="px-4 py-3 text-sm text-gray-700 dark:text-gray-300">
                      {typeof row[col] === 'object' ? JSON.stringify(row[col]) : String(row[col] ?? '-')}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      );
    }

    // If it's a simple object, render as key-value cards
    if (typeof data === 'object') {
      const entries = Object.entries(data).filter(([key]) => !['meta', 'summary', 'charts', 'type'].includes(key));
      
      if (entries.length === 0) {
        return (
          <div className="text-center py-12 text-gray-500">
            <Package className="w-12 h-12 mx-auto mb-4 opacity-50" />
            <p>No data available</p>
          </div>
        );
      }
      
      return (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {entries.map(([key, value]) => (
            <div key={key} className="bg-gray-50 dark:bg-gray-800 rounded-xl p-4 border border-gray-200 dark:border-gray-700">
              <p className="text-xs text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-1">
                {key.replace(/_/g, ' ')}
              </p>
              <p className="text-xl font-bold text-gray-900 dark:text-white">
                {typeof value === 'number' 
                  ? value.toLocaleString() 
                  : typeof value === 'object' 
                  ? JSON.stringify(value) 
                  : String(value)}
              </p>
            </div>
          ))}
        </div>
      );
    }

    // Fallback - show no data message instead of raw JSON
    return (
      <div className="text-center py-12 text-gray-500">
        <Package className="w-12 h-12 mx-auto mb-4 opacity-50" />
        <p>No data available for this report</p>
      </div>
    );
  };

  // Report Selection View
  if (!selectedReport) {
    return (
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Reports</h1>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
              Select a report to view detailed analytics
            </p>
          </div>
        </div>

        {/* Category Tabs */}
        <div className="flex items-center gap-2 overflow-x-auto pb-2">
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => setActiveCategory(category)}
              className={`px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-all ${
                activeCategory === category
                  ? 'bg-gray-900 dark:bg-white text-white dark:text-gray-900'
                  : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700'
              }`}
            >
              {category.charAt(0).toUpperCase() + category.slice(1)}
            </button>
          ))}
        </div>

        {/* Report Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3">
          <AnimatePresence mode="popLayout">
            {filteredReports.map((report, index) => {
              const Icon = iconMap[report.icon] || TrendingUp;
              const colors = categoryColors[report.category] || categoryColors.sales;
              
              return (
                <motion.button
                  key={report.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.98 }}
                  transition={{ delay: index * 0.03 }}
                  onClick={() => handleSelectReport(report)}
                  className="group text-left p-4 rounded-xl bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 hover:border-gray-300 dark:hover:border-gray-700 hover:shadow-sm transition-all duration-150"
                >
                  <div className="flex items-center gap-3 mb-2">
                    <div className={`p-2 rounded-lg ${colors.bg}`}>
                      <Icon className={`w-4 h-4 ${colors.text}`} />
                    </div>
                    <h3 className="font-medium text-sm text-gray-900 dark:text-white">
                      {report.name}
                    </h3>
                  </div>
                  <p className="text-xs text-gray-500 dark:text-gray-400 line-clamp-2 leading-relaxed">
                    {report.description}
                  </p>
                </motion.button>
              );
            })}
          </AnimatePresence>
        </div>
      </div>
    );
  }

  // Report Detail View
  const Icon = iconMap[selectedReport.icon] || TrendingUp;
  const colors = categoryColors[selectedReport.category] || categoryColors.sales;

  return (
    <div className="space-y-6">
      {/* Header with Back Button */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <button
            onClick={handleBack}
            className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
          >
            <ArrowLeft className="w-5 h-5 text-gray-600 dark:text-gray-400" />
          </button>
          <div className="flex items-center gap-3">
            <div className={`p-2 rounded-lg ${colors.bg} ${colors.text}`}>
              <Icon className="w-5 h-5" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-gray-900 dark:text-white">{selectedReport.name}</h1>
              <p className="text-sm text-gray-500 dark:text-gray-400">{selectedReport.description}</p>
            </div>
          </div>
        </div>
        <div className="relative">
          <button
            onClick={() => setShowExportMenu(!showExportMenu)}
            className="flex items-center gap-2 px-4 py-2 bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
          >
            <Download className="w-4 h-4" />
            <span className="text-sm font-medium">Export</span>
            <ChevronDown className="w-4 h-4" />
          </button>
          
          {/* Export Dropdown Menu */}
          <AnimatePresence>
            {showExportMenu && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="absolute right-0 mt-2 w-40 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 overflow-hidden z-50"
              >
              <button
                  onClick={() => handleExport('xlsx')}
                  className="w-full flex items-center gap-3 px-4 py-3 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                >
                  <FileSpreadsheet className="w-4 h-4 text-emerald-500" />
                  <span>Excel (.xlsx)</span>
                </button>
                <button
                  onClick={() => handleExport('csv')}
                  className="w-full flex items-center gap-3 px-4 py-3 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors border-t border-gray-100 dark:border-gray-700"
                >
                  <FileText className="w-4 h-4 text-blue-500" />
                  <span>CSV (.csv)</span>
                </button>
                <button
                  onClick={() => handleExport('json')}
                  className="w-full flex items-center gap-3 px-4 py-3 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors border-t border-gray-100 dark:border-gray-700"
                >
                  <FileText className="w-4 h-4 text-amber-500" />
                  <span>JSON (.json)</span>
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 p-4">
        <div className="flex flex-wrap items-end gap-4">
          {selectedReport.filters.includes('startDate') && (
            <div className="flex-1 min-w-[180px]">
              <label className="block text-xs font-semibold text-gray-600 dark:text-gray-400 mb-2 uppercase tracking-wide">
                Start Date
              </label>
              <input
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="w-full h-11 px-4 rounded-lg border-2 border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white text-sm focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10 focus:outline-none transition-all"
              />
            </div>
          )}
          {selectedReport.filters.includes('endDate') && (
            <div className="flex-1 min-w-[180px]">
              <label className="block text-xs font-semibold text-gray-600 dark:text-gray-400 mb-2 uppercase tracking-wide">
                End Date
              </label>
              <input
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                className="w-full h-11 px-4 rounded-lg border-2 border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white text-sm focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10 focus:outline-none transition-all"
              />
            </div>
          )}
          <button
            onClick={fetchReport}
            disabled={loading}
            className="h-11 px-6 bg-gray-900 dark:bg-white text-white dark:text-gray-900 rounded-lg font-medium text-sm hover:bg-gray-800 dark:hover:bg-gray-100 transition-colors flex items-center gap-2 disabled:opacity-50"
          >
            {loading ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <RefreshCw className="w-4 h-4" />
            )}
            Generate Report
          </button>
        </div>
      </div>

      {/* Report Content */}
      <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 overflow-hidden">
        {loading ? (
          <div className="flex items-center justify-center py-20">
            <Loader2 className="w-8 h-8 animate-spin text-gray-400" />
          </div>
        ) : reportData ? (
          <div className="p-4">
            {renderReportData()}
          </div>
        ) : (
          <div className="text-center py-20 text-gray-500">
            <TrendingUp className="w-12 h-12 mx-auto mb-4 opacity-50" />
            <p>Select date range and click "Generate Report" to view data</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ReportsPage;
