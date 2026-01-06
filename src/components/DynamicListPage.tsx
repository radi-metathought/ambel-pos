import { useState, useEffect } from 'react';
import { 
  Search, 
  Filter, 
  Edit, 
  Trash2, 
  Package,
  List as ListIcon,
  Loader2,
  Plus,
  ChevronLeft,
  ChevronRight,
  Send,
  X
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { apiService } from '../services';
import toast from 'react-hot-toast';
import Modal from './ui/Modal';
import DynamicForm from './ui/DynamicForm';

// --- Types ---

interface Column {
  field: string;
  text: string;
  type: string;
}

interface MultiSearchFilter {
  field: string;
  label: string;
  type: 'text' | 'select';
  placeholder?: string;
  options?: { label: string; value: string }[];
  remote_url?: string;
}

interface TabContent {
  column: Column[];
  data: any[];
  limit: number;
  offset: number;
  total: number;
  url: string;
  tab: string;
  multi_search?: MultiSearchFilter[];
}

interface PageContent {
  component: string;
  content: TabContent[];
  title: string;
  types: string;
}

interface PageAction {
  icon: string;
  text: string;
  url: string;
  navigate_to: string;
  color?: string;
  param?: any[];
  method?: string;
}

interface DynamicPageResponse {
  title: string;
  tab: string[];
  more_action: PageAction[];
  content: PageContent[];
  status: number;
  data?: {
    pagination?: {
      currentPage: number;
      totalPages: number;
      totalItems: number;
      itemsPerPage: number;
    };
  };
}

// --- Cell Renderer ---

const CellRenderer = ({ 
  type, 
  value, 
  field, 
  onAction 
}: { 
  type: string, 
  value: any, 
  field: string,
  onAction?: (action: PageAction) => void
}) => {
  switch (type) {
    case 'hidden': return null;
    case 'title': {
      const displayValue = typeof value === 'object' ? value.name : value;
      return (
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-gray-50 dark:bg-gray-800 flex items-center justify-center border border-gray-100 dark:border-gray-700">
            <Package className="w-4 h-4 text-gray-500 dark:text-gray-400" />
          </div>
          <span className="font-medium text-gray-900 dark:text-white">{displayValue || 'N/A'}</span>
        </div>
      );
    }

    case 'price': {
      // Clean up string price (strip currency symbols)
      const numericValue = typeof value === 'string' 
        ? parseFloat(value.replace(/[^0-9.-]+/g, '')) 
        : value;
      return <span className="font-medium text-gray-900 dark:text-white">${(parseFloat(String(numericValue)) || 0).toFixed(2)}</span>;
    }

    case 'action': {
      if (!Array.isArray(value)) return null;
      return (
        <div className="flex items-center justify-end gap-1">
          {value.map((action: PageAction, idx: number) => {
            const isDelete = action.icon === 'trash' || action.color === 'danger';
            const isSend = action.icon === 'send' || action.color === 'info';
            const isEdit = action.icon === 'pencil';
            
            return (
              <button 
                key={idx}
                onClick={() => onAction?.(action)}
                className={`p-1.5 rounded-lg transition-all ${
                  isDelete 
                    ? 'text-gray-400 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20' 
                    : isSend
                    ? 'text-gray-400 hover:text-emerald-600 hover:bg-emerald-50 dark:hover:bg-emerald-900/20'
                    : 'text-gray-400 hover:text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/20'
                }`}
                title={action.text}
              >
                {isEdit ? <Edit className="w-4 h-4" /> : 
                 isDelete ? <Trash2 className="w-4 h-4" /> : 
                 isSend ? <Send className="w-4 h-4" /> : 
                 <Plus className="w-4 h-4" />
                }
              </button>
            );
          })}
        </div>
      );
    }

    case 'str':
    default:
      // Handle object values (like Status with text and color)
      if (typeof value === 'object' && value !== null) {
        // Check if it's a status object with text and color
        if (value.text && value.color) {
          const colorClasses = {
            success: 'bg-emerald-100 dark:bg-emerald-900/20 text-emerald-700 dark:text-emerald-400',
            danger: 'bg-red-100 dark:bg-red-900/20 text-red-700 dark:text-red-400',
            warning: 'bg-amber-100 dark:bg-amber-900/20 text-amber-700 dark:text-amber-400',
            info: 'bg-blue-100 dark:bg-blue-900/20 text-blue-700 dark:text-blue-400',
            default: 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-400'
          };
          const colorClass = colorClasses[value.color as keyof typeof colorClasses] || colorClasses.default;
          
          return (
            <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${colorClass}`}>
              {value.text}
            </span>
          );
        }
        // If it's an object with a 'name' property, display the name
        if (value.name) {
          return <span className="text-gray-500 dark:text-gray-400 text-sm">{value.name}</span>;
        }
        // Otherwise, try to stringify it
        return <span className="text-gray-500 dark:text-gray-400 text-sm">{JSON.stringify(value)}</span>;
      }
      
      if (field === 'Stock') {
        const stock = parseInt(value) || 0;
        return (
          <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${
            stock < 10 ? 'bg-red-50 text-red-600 dark:bg-red-900/20' : 'bg-gray-200 text-gray-600 dark:bg-white'
          }`}>
            {value}
          </span>
        );
      }
      return <span className="text-gray-500 dark:text-gray-400 text-sm">{String(value || '-')}</span>;
  }
};

// --- Main Component ---

interface DynamicListPageProps {
  endpoint: string;
}

export const DynamicListPage = ({ endpoint }: DynamicListPageProps) => {
  const [pageData, setPageData] = useState<DynamicPageResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTabIndex, setActiveTabIndex] = useState(0);
  
  // Modal & Form State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalTitle, setModalTitle] = useState('');
  const [formConfig, setFormConfig] = useState<any>(null);
  
  // Filter State
  const [filterValues, setFilterValues] = useState<Record<string, string>>({});
  const [tempFilterValues, setTempFilterValues] = useState<Record<string, string>>({});
  const [remoteOptions, setRemoteOptions] = useState<Record<string, { label: string; value: string }[]>>({});
  const [isFilterModalOpen, setIsFilterModalOpen] = useState(false);
  
  // Pagination State
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);

  useEffect(() => {
    fetchPageMetadata();
  }, [endpoint]);

  // Fetch remote options for multi_search filters
  useEffect(() => {
    const fetchRemoteOptions = async () => {
      const currentComponent = pageData?.content.find(c => c.component === 'TabBarList');
      const activeTabContent = currentComponent?.content[activeTabIndex];
      const multiSearch = activeTabContent?.multi_search || [];
      
      for (const filter of multiSearch) {
        if (filter.remote_url && filter.type === 'select') {
          try {
            const sanitizedUrl = filter.remote_url.startsWith('/') 
              ? filter.remote_url.substring(1) 
              : filter.remote_url;
            const response = await apiService.get<any>(sanitizedUrl);
            
            // Handle various response formats
            let rawOptions = [];
            if (Array.isArray(response)) {
              rawOptions = response;
            } else if (response.data && Array.isArray(response.data)) {
              rawOptions = response.data;
            } else if (response.options && Array.isArray(response.options)) {
              rawOptions = response.options;
            }

            // Map options to consistent { label, value } format
            const formattedOptions = rawOptions.map((opt: any) => {
              if (typeof opt === 'object' && opt !== null) {
                return {
                  label: opt.name || opt.label || String(opt.id || opt.value || ''),
                  value: String(opt.id !== undefined ? opt.id : (opt.value !== undefined ? opt.value : ''))
                };
              }
              return { label: String(opt), value: String(opt) };
            });
            
            setRemoteOptions(prev => ({
              ...prev,
              [filter.field]: formattedOptions
            }));
          } catch (error) {
            console.error(`Failed to fetch options for ${filter.field}:`, error);
          }
        }
      }
    };
    
    if (pageData) {
      fetchRemoteOptions();
    }
  }, [pageData, activeTabIndex]);

  const fetchPageMetadata = async () => {
    try {
      setLoading(true);
      const sanitizedUrl = endpoint.startsWith('/') ? endpoint.substring(1) : endpoint;
      const response = await apiService.get<DynamicPageResponse>(sanitizedUrl);
      setPageData(response);
    } catch (error) {
      toast.error('Failed to load page configuration');
    } finally {
      setLoading(false);
    }
  };

  // Fetch data with filters applied
  // Fetch data with filters applied
  const fetchWithFilters = async (overrides?: { filters?: Record<string, string>, page?: number }) => {
    const currentComponent = pageData?.content.find(c => c.component === 'TabBarList');
    const activeTabContent = currentComponent?.content[activeTabIndex];
    
    if (!activeTabContent?.url) return;
    
    try {
      setLoading(true);
      const params = new URLSearchParams();
      
      // Use overrides or current state
      const filtersToUse = overrides?.filters || filterValues;
      const pageToUse = overrides?.page || currentPage;
      
      // Add filter values to params
      Object.entries(filtersToUse).forEach(([key, value]) => {
        if (value) {
          params.append(key, value);
        }
      });
      
      // Add pagination params
      params.append('page', String(pageToUse));
      params.append('limit', String(itemsPerPage));
      
      let sanitizedUrl = activeTabContent.url.startsWith('/') 
        ? activeTabContent.url.substring(1) 
        : activeTabContent.url;
      
      // Remove trailing tab name like /All, /Tracked Stock, etc.
      const lastSlashIndex = sanitizedUrl.lastIndexOf('/');
      if (lastSlashIndex > 0) {
        sanitizedUrl = sanitizedUrl.substring(0, lastSlashIndex);
      }
      
      const queryString = params.toString();
      const url = queryString ? `${sanitizedUrl}?${queryString}` : sanitizedUrl;
      
      const response = await apiService.get<DynamicPageResponse>(url);
      setPageData(response);
    } catch (error) {
      toast.error('Failed to apply filters');
    } finally {
      setLoading(false);
    }
  };

  const handleActionClick = async (action: PageAction) => {
    // 1. Handle Deletions (Trash Icon)
    if (action.icon === 'trash' || action.color === 'danger') {
      if (!window.confirm(`Are you sure you want to ${action.text}?`)) return;
      
      try {
        setLoading(true);
        const trimmedUrl = action.url?.trim() || '';
        const sanitizedUrl = trimmedUrl.startsWith('/') ? trimmedUrl.substring(1) : trimmedUrl;
        
        // Construct params for delete
        const params: Record<string, any> = {};
        action.param?.forEach(p => {
          params[p.field] = p.value;
        });

        await apiService.delete(sanitizedUrl);
        toast.success(`${action.text} successful`);
        fetchPageMetadata();
      } catch (error: any) {    
        toast.error(error.message || `Failed to ${action.text.toLowerCase()}`);
      } finally {
        setLoading(false);
      }
      return;
    }

    // 2. Handle Direct Actions with HTTP Methods (e.g., Send with PATCH)
    if (action.method && action.method.toUpperCase() !== 'GET' && action.navigate_to === 'action') {
      if (!window.confirm(`Are you sure you want to ${action.text}?`)) return;
      
      try {
        setLoading(true);
        const trimmedUrl = action.url?.trim() || '';
        const sanitizedUrl = trimmedUrl.startsWith('/') ? trimmedUrl.substring(1) : trimmedUrl;
        
        const method = action.method.toLowerCase() as 'post' | 'patch' | 'put';
        
        // Execute the action with the specified method
        if (typeof apiService[method] === 'function') {
          await apiService[method](sanitizedUrl, {});
        } else {
          await apiService.post(sanitizedUrl, {});
        }
        
        toast.success(`${action.text} successful`);
        fetchPageMetadata();
      } catch (error: any) {
        toast.error(error.message || `Failed to ${action.text.toLowerCase()}`);
      } finally {
        setLoading(false);
      }
      return;
    }

    // 3. Handle Form/Action triggers for Modal
    if (action.navigate_to === 'form' || action.navigate_to === 'action') {
      try {
        setLoading(true);
        const trimmedUrl = action.url?.trim() || '';
        const normalizedUrl = trimmedUrl.replace(/^\/+|\/+$/g, '').toLowerCase();
        
        if (normalizedUrl === 'all' || normalizedUrl === '') return;
        
        // Construct URL with query parameters
        let sanitizedUrl = trimmedUrl.startsWith('/') ? trimmedUrl.substring(1) : trimmedUrl;
        const response = await apiService.get<any>(sanitizedUrl);
        setFormConfig(response);
        setModalTitle(action.text);
        setIsModalOpen(true);
      } catch (error) {
        toast.error('Failed to load form configuration');
      } finally {
        setLoading(false);
      }
    }
  };

  if (loading && !pageData) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] gap-3">
        <Loader2 className="w-8 h-8 text-emerald-500 animate-spin" />
        <p className="text-sm text-gray-400">Loading experience...</p>
      </div>
    );
  }

  if (!pageData) return null;

  const currentComponent = pageData.content.find(c => c.component === 'TabBarList');
  const activeTabContent = currentComponent?.content[activeTabIndex];
  const columns = activeTabContent?.column || [];
  const visibleColumns = columns.filter(col => col.type !== 'hidden');
  
  
  const displayData = activeTabContent?.data || [];

  return (
    <div className="space-y-8 max-w-[1400px] mx-auto px-2">
      {/* minimalist Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-gray-100 dark:border-gray-800 pb-8">
        <div>
          <h1 className="text-4xl font-light tracking-tight text-gray-900 dark:text-white">{pageData.title}</h1>
          <div className="flex items-center gap-2 mt-2">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
            <p className="text-sm text-gray-500 dark:text-gray-400">Manage your business assets and configuration</p>
          </div>
        </div>

        <div className="flex gap-2">
          {pageData.more_action?.map((action, idx) => (
            <button
              key={idx}
              onClick={() => handleActionClick(action)}
              className="flex items-center gap-2 px-5 py-2.5 bg-gray-900 dark:bg-white text-white dark:text-gray-900 rounded-xl text-sm font-semibold transition-all hover:scale-[1.02] active:scale-95 shadow-sm"
            >
              <Plus className="w-4 h-4" />
              {action.text}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 gap-8">
        {/* minimalist Controls */}
        <div className="flex flex-col md:flex-row items-center justify-start gap-4">
          {/* Tabs */}
          <div className="flex p-1 bg-gray-100/80 dark:bg-gray-800/50 rounded-xl backdrop-blur-sm self-start">
            {pageData.tab?.map((tabName, idx) => (
              <button
                key={idx}
                onClick={() => setActiveTabIndex(idx)}
                className={`px-5 py-1.5 rounded-lg text-sm font-medium transition-all ${
                  activeTabIndex === idx
                    ? 'bg-white dark:bg-gray-700 text-gray-900 dark:text-white shadow-sm'
                    : 'text-gray-500 hover:text-gray-700 dark:text-gray-400'
                }`}
              >
                {tabName}
              </button>
            ))}
          </div>

          {/* Simple Search + Filter Button */}
          <div className="min-w-96 flex items-center">
            {/* Quick Search - only show first text filter inline */}
            {activeTabContent?.multi_search?.find(f => f.type === 'text') && (
              <div className="relative flex-1 max-w-md">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="text"
                  placeholder={activeTabContent.multi_search.find(f => f.type === 'text')?.placeholder || 'Search...'}
                  value={filterValues['search'] || ''}
                  onChange={(e) => {
                    setFilterValues(prev => ({ ...prev, search: e.target.value }));
                    setCurrentPage(1);
                  }}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      const newFilters = { ...filterValues, search: (e.target as HTMLInputElement).value };
                      fetchWithFilters({ filters: newFilters, page: 1 });
                    }
                  }}
                  className="w-full pl-9 pr-4 py-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 outline-none transition-all text-sm text-gray-900 dark:text-white placeholder-gray-400"
                />
              </div>
            )}
          </div>

          {/* Filter Button with Badge */}
          <button 
            onClick={() => {
              setTempFilterValues({ ...filterValues });
              setIsFilterModalOpen(true);
            }}
            className={`relative flex items-center gap-2 px-4 py-2 transition-all rounded-lg border ${
              Object.keys(filterValues).filter(k => filterValues[k] && k !== 'search').length > 0
                ? 'text-emerald-600 bg-emerald-50 dark:bg-emerald-900/20 border-emerald-200 dark:border-emerald-800' 
                : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white border-gray-200 dark:border-gray-700 hover:border-gray-300'
            }`}
          >
            <Filter className="w-4 h-4" />
            <span className="text-sm font-medium">Filter</span>
            {/* Active Filter Count Badge */}
            {Object.keys(filterValues).filter(k => filterValues[k] && k !== 'search').length > 0 && (
              <span className="absolute -top-1.5 -right-1.5 w-5 h-5 bg-emerald-500 text-white text-xs font-bold rounded-full flex items-center justify-center">
                {Object.keys(filterValues).filter(k => filterValues[k] && k !== 'search').length}
              </span>
            )}
          </button>
        </div>

        {/* Clean Table */}
        <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 overflow-hidden">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-gray-800/50">
                {visibleColumns.map((col, idx) => (
                  <th key={idx} className={`px-6 py-3 text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider ${col.type === 'action' || col.type === 'price' ? 'text-right' : 'text-left'}`}>
                    {col.text}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
              <AnimatePresence mode="popLayout">
                {displayData.length > 0 ? (
                  displayData.map((row, rowIdx) => (
                    <motion.tr
                      key={row.ID || rowIdx}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: rowIdx * 0.02 }}
                      className="hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors"
                    >
                      {visibleColumns.map((col, colIdx) => (
                        <td key={colIdx} className={`px-6 py-4 ${col.type === 'action' || col.type === 'price' ? 'text-right' : 'text-left'}`}>
                          <CellRenderer 
                            type={col.type} 
                            value={row[col.field]} 
                            field={col.field} 
                            onAction={handleActionClick}
                          />
                        </td>
                      ))}
                    </motion.tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={visibleColumns.length} className="px-6 py-20 text-center">
                      <div className="flex flex-col items-center gap-3 text-gray-400">
                        <ListIcon className="w-10 h-10" />
                        <p className="text-sm font-medium">No records found</p>
                      </div>
                    </td>
                  </tr>
                )}
              </AnimatePresence>
            </tbody>
          </table>

          {/* Pagination */}
          {(() => {
            const pagination = pageData?.data?.pagination;
            const totalItems = pagination?.totalItems || activeTabContent?.total || 0;
            const totalPages = pagination?.totalPages || Math.ceil(totalItems / itemsPerPage);
            const page = pagination?.currentPage || currentPage;
            
            if (totalItems <= 0) return null;
            
            const startItem = (page - 1) * itemsPerPage + 1;
            const endItem = Math.min(page * itemsPerPage, totalItems);
            
            // Generate page numbers to show
            const getPageNumbers = () => {
              const pages: (number | string)[] = [];
              const maxVisible = 5;
              
              if (totalPages <= maxVisible) {
                for (let i = 1; i <= totalPages; i++) pages.push(i);
              } else {
                if (page <= 3) {
                  for (let i = 1; i <= 4; i++) pages.push(i);
                  pages.push('...');
                  pages.push(totalPages);
                } else if (page >= totalPages - 2) {
                  pages.push(1);
                  pages.push('...');
                  for (let i = totalPages - 3; i <= totalPages; i++) pages.push(i);
                } else {
                  pages.push(1);
                  pages.push('...');
                  for (let i = page - 1; i <= page + 1; i++) pages.push(i);
                  pages.push('...');
                  pages.push(totalPages);
                }
              }
              return pages;
            };
            
            const handlePageChange = async (newPage: number) => {
              if (newPage >= 1 && newPage <= totalPages && newPage !== page) {
                setCurrentPage(newPage);
                fetchWithFilters({ page: newPage });
              }
            };
            
            return (
              <div className="px-6 py-4 border-t border-gray-200 dark:border-gray-800 flex items-center justify-between bg-gray-50 dark:bg-gray-800/50">
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Showing <span className="font-medium text-gray-900 dark:text-white">{startItem}</span> to{' '}
                  <span className="font-medium text-gray-900 dark:text-white">{endItem}</span> of{' '}
                  <span className="font-medium text-gray-900 dark:text-white">{totalItems}</span> entries
                </p>
                <div className="flex items-center gap-1">
                  {/* Previous Button */}
                  <button 
                    onClick={() => handlePageChange(page - 1)}
                    disabled={page <= 1}
                    className="p-2 text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
                  >
                    <ChevronLeft className="w-4 h-4" />
                  </button>
                  
                  {/* Page Numbers */}
                  {getPageNumbers().map((pageNum, idx) => (
                    pageNum === '...' ? (
                      <span key={`ellipsis-${idx}`} className="px-2 text-gray-400">...</span>
                    ) : (
                      <button
                        key={pageNum}
                        onClick={() => handlePageChange(pageNum as number)}
                        className={`min-w-[32px] h-8 px-2 rounded-lg text-sm font-medium transition-colors ${
                          page === pageNum
                            ? 'bg-emerald-500 text-white'
                            : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700'
                        }`}
                      >
                        {pageNum}
                      </button>
                    )
                  ))}
                  
                  {/* Next Button */}
                  <button 
                    onClick={() => handlePageChange(page + 1)}
                    disabled={page >= totalPages}
                    className="p-2 text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
                  >
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            );
          })()}
        </div>
      </div>

      {/* Dynamic Form Modal */}
      <Modal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        title={modalTitle}
        size="lg"
      >
        {formConfig && (
          <DynamicForm 
            formConfig={formConfig} 
              onSuccess={() => {
                setIsModalOpen(false);
                fetchPageMetadata();
              }}
            />
        )}
      </Modal>

      {/* Filter Modal */}
      <AnimatePresence>
        {isFilterModalOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
            onClick={() => setIsFilterModalOpen(false)}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="w-full max-w-md bg-white dark:bg-gray-900 rounded-2xl shadow-2xl overflow-hidden"
            >
              {/* Header */}
              <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 dark:border-gray-800">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Filter {pageData?.title}</h3>
                <button
                  onClick={() => setIsFilterModalOpen(false)}
                  className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Filter Fields - Only show select dropdowns */}
              <div className="px-6 py-4 space-y-4 max-h-[60vh] overflow-y-auto">
                {activeTabContent?.multi_search?.filter(f => f.type === 'select').map((filter, idx) => {
                  const options = filter.remote_url 
                    ? remoteOptions[filter.field] || []
                    : filter.options || [];
                  
                  return (
                    <div key={idx}>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        {filter.label}
                      </label>
                      <select
                        value={tempFilterValues[filter.field] || ''}
                        onChange={(e) => setTempFilterValues(prev => ({ ...prev, [filter.field]: e.target.value }))}
                        className="w-full px-4 py-2.5 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 outline-none transition-all text-sm text-gray-900 dark:text-white"
                      >
                        <option value="">All {filter.label}</option>
                        {options.map((opt, optIdx) => (
                          <option key={optIdx} value={opt.value}>
                            {opt.label}
                          </option>
                        ))}
                      </select>
                    </div>
                  );
                })}
              </div>

              {/* Footer */}
              <div className="flex items-center justify-between px-6 py-4 border-t border-gray-100 dark:border-gray-800 bg-gray-50 dark:bg-gray-800/50">
                <button
                  onClick={() => setTempFilterValues({})}
                  className="text-sm text-gray-500 hover:text-gray-700 dark:hover:text-gray-300 transition-colors"
                >
                  Clear All
                </button>
                <div className="flex gap-2">
                  <button
                    onClick={() => setIsFilterModalOpen(false)}
                    className="px-4 py-2 text-sm font-medium text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={() => {
                      setFilterValues(tempFilterValues);
                      setCurrentPage(1);
                      setIsFilterModalOpen(false);
                      // Fetch directly with new values
                      fetchWithFilters({ filters: tempFilterValues, page: 1 });
                    }}
                    className="px-5 py-2 bg-emerald-500 hover:bg-emerald-600 text-white text-sm font-semibold rounded-lg transition-colors"
                  >
                    Apply Filters
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
