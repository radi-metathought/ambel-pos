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
  ChevronRight
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
            return (
              <button 
                key={idx}
                onClick={() => onAction?.(action)}
                className={`p-1.5 rounded-lg transition-all ${
                  isDelete 
                    ? 'text-gray-400 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20' 
                    : 'text-gray-400 hover:text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/20'
                }`}
                title={action.text}
              >
                {action.icon === 'pencil' ? <Edit className="w-4 h-4" /> : 
                 action.icon === 'trash' ? <Trash2 className="w-4 h-4" /> : <Plus className="w-4 h-4" />
                }
              </button>
            );
          })}
        </div>
      );
    }

    case 'str':
    default:
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

    // 2. Handle Form/Action triggers for Modal
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

        {/* minimalist Table */}
        <div className="bg-white/50 dark:bg-gray-900/30 rounded-3xl overflow-hidden">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b border-gray-50 dark:border-gray-800">
                {visibleColumns.map((col, idx) => (
                  <th key={idx} className={`px-6 py-5 text-[11px] uppercase tracking-[0.1em] font-semibold text-gray-400 dark:text-gray-500 ${col.type === 'action' || col.type === 'price' ? 'text-right' : ''}`}>
                    {col.text}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50 dark:divide-gray-800">
              <AnimatePresence mode="popLayout">
                {displayData.length > 0 ? (
                  displayData.map((row, rowIdx) => (
                    <motion.tr
                      key={row.ID || rowIdx}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: rowIdx * 0.02 }}
                      className="group transition-colors hover:bg-gray-50/50 dark:hover:bg-gray-800/30"
                    >
                      {visibleColumns.map((col, colIdx) => (
                        <td key={colIdx} className={`px-6 py-5 ${col.type === 'action' || col.type === 'price' ? 'text-right' : ''}`}>
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
                    <td colSpan={visibleColumns.length} className="px-6 py-32 text-center">
                      <div className="flex flex-col items-center opacity-20">
                        <ListIcon className="w-12 h-12 mb-4" />
                        <p className="text-xl font-light">No records found</p>
                      </div>
                    </td>
                  </tr>
                )}
              </AnimatePresence>
            </tbody>
          </table>

          {/* Pagination */}
          {activeTabContent && activeTabContent.total > 0 && (
            <div className="p-6 border-t border-gray-50 dark:border-gray-800 flex items-center justify-between">
              <p className="text-xs text-gray-400">
                <span className="font-medium text-gray-900 dark:text-gray-200">{activeTabContent.total}</span> total entries
              </p>
              <div className="flex gap-1">
                <button className="p-2 text-gray-400 hover:text-gray-900 dark:hover:text-white disabled:opacity-30">
                  <ChevronLeft className="w-5 h-5" />
                </button>
                <button className="p-2 text-gray-400 hover:text-gray-900 dark:hover:text-white disabled:opacity-30">
                  <ChevronRight className="w-5 h-5" />
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
        size="md"
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
