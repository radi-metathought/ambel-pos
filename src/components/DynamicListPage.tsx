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
  Send
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

interface TabContent {
  column: Column[];
  data: any[];
  limit: number;
  offset: number;
  total: number;
  url: string;
  tab: string;
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
  const [searchQuery, setSearchQuery] = useState('');
  
  // Modal & Form State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalTitle, setModalTitle] = useState('');
  const [formConfig, setFormConfig] = useState<any>(null);

  useEffect(() => {
    fetchPageMetadata();
  }, [endpoint]);

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
  
  const displayData = (activeTabContent?.data || []).filter(item => {
    return Object.values(item).some(val => 
      String(val).toLowerCase().includes(searchQuery.toLowerCase())
    );
  });

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
        <div className="flex flex-col md:flex-row items-center gap-4">
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

          <div className="flex-1 w-full relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder={`Search in ${pageData.tab[activeTabIndex]}...`}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-4 py-2 bg-transparent border-b border-gray-100 dark:border-gray-800 focus:border-emerald-500 outline-none transition-all text-sm text-gray-900 dark:text-white placeholder-gray-400"
            />
          </div>

          <button className="flex items-center gap-2 px-3 py-2 text-gray-400 hover:text-gray-900 dark:hover:text-white transition-all">
            <Filter className="w-4 h-4" />
            <span className="text-sm font-medium">Filter</span>
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
          {activeTabContent && activeTabContent.total > 0 && (
            <div className="px-6 py-4 border-t border-gray-200 dark:border-gray-800 flex items-center justify-between bg-gray-50 dark:bg-gray-800/50">
              <p className="text-sm text-gray-600 dark:text-gray-400">
                <span className="font-medium text-gray-900 dark:text-white">{activeTabContent.total}</span> total entries
              </p>
              <div className="flex gap-1">
                <button className="p-2 text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors disabled:opacity-30">
                  <ChevronLeft className="w-4 h-4" />
                </button>
                <button className="p-2 text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors disabled:opacity-30">
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}
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
    </div>
  );
};
