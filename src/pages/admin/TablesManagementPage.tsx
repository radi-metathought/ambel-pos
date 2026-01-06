import { useState, useEffect } from 'react';
import { apiService } from '../../services';
import toast from 'react-hot-toast';
import { 
  Plus, 
  Trash2, 
  Save, 
  Users as UsersIcon, 
  MousePointer2,
  Grid3x3,
  X
} from 'lucide-react';

interface Table {
  id: string;
  name: string;
  areaId: string;
  status: 'available' | 'occupied' | 'reserved';
  capacity: number;
}

interface Area {
  id: string;
  name: string;
}

interface TableManagementResponse {
  status: number;
  data: {
    header: string;
    areas: Area[];
    tables: Table[];
    actions: any[];
  };
}

const TablesManagementPage = () => {
  const [loading, setLoading] = useState(true);
  const [pageData, setPageData] = useState<any>(null);
  const [areas, setAreas] = useState<Area[]>([]);
  const [tables, setTables] = useState<Table[]>([]);
  const [activeAreaId, setActiveAreaId] = useState('');
  const [selectedTableId, setSelectedTableId] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newTableName, setNewTableName] = useState('');
  const [newTableCapacity, setNewTableCapacity] = useState(4);
  const [newTableStatus, setNewTableStatus] = useState<'available' | 'occupied' | 'reserved'>('available');

  useEffect(() => {
    fetchPageData();
  }, []);

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isModalOpen) {
        closeModal();
      }
    };

    window.addEventListener('keydown', handleEscape);
    return () => window.removeEventListener('keydown', handleEscape);
  }, [isModalOpen]);

  const fetchPageData = async () => {
    try {
      const response = await apiService.get<TableManagementResponse>('tables');
      const { data } = response;
      
      setPageData(data);
      setAreas(data.areas || []);
      setTables((data.tables || []) as Table[]);
      setActiveAreaId(data.areas?.[0]?.id || '');
      setLoading(false);
    } catch (error) {
      console.error('Failed to fetch table management data:', error);
      toast.error('Failed to load table layout');
      setLoading(false);
    }
  };

  const activeArea = areas.find(a => a.id === activeAreaId);
  const areaTables = tables.filter(t => t.areaId === activeAreaId);
  const selectedTable = tables.find(t => t.id === selectedTableId);

  const openAddTableModal = () => {
    const nextTableNumber = tables.length + 1;
    setNewTableName(`T-${nextTableNumber}`);
    setNewTableCapacity(4);
    setNewTableStatus('available');
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  const handleCreateTable = () => {
    const newTable: Table = {
      id: `t-${Date.now()}`,
      name: newTableName,
      areaId: activeAreaId,
      status: newTableStatus,
      capacity: newTableCapacity,
    };
    setTables([...tables, newTable]);
    setSelectedTableId(newTable.id);
    setIsModalOpen(false);
    toast.success('New table added');
  };

  const deleteTable = (id: string) => {
    setTables(tables.filter(t => t.id !== id));
    setSelectedTableId(null);
    toast.success('Table removed');
  };

  const updateTable = (id: string, updates: Partial<Table>) => {
    setTables(tables.map(t => (t.id === id ? { ...t, ...updates } : t)));
  };

  const handleSave = async () => {
    const saveAction = pageData?.actions?.find((a: any) => a.type === 'save');
    if (!saveAction) return;

    try {
      const method = (saveAction.method?.toLowerCase() || 'post') as 'post' | 'put';
      const url = saveAction.url.startsWith('/') ? saveAction.url.substring(1) : saveAction.url;
      
      await apiService[method](url, { areas, tables });
      toast.success('Layout saved successfully');
    } catch (error: any) {
      toast.error(error.message || 'Failed to save layout');
    }
  };

  if (loading) {
    return (
      <div className="h-full flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-emerald-500"></div>
      </div>
    );
  }

  return (
    <div className="h-[calc(100vh-180px)] flex gap-4 overflow-hidden">
      {/* Sidebar - Area Selection */}
      <div className="w-56 flex flex-col gap-2 overflow-hidden">
        <div className="px-1 mb-1">
          <h3 className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Areas</h3>
        </div>
        <div className="flex-1 space-y-0.5 overflow-y-auto">
          {areas.map(area => (
            <button
              key={area.id}
              onClick={() => setActiveAreaId(area.id)}
              className={`w-full text-left px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                activeAreaId === area.id
                  ? 'bg-gray-900 dark:bg-white text-white dark:text-gray-900'
                  : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800'
              }`}
            >
              {area.name}
            </button>
          ))}
        </div>
      </div>

      <div className="flex-1 relative flex flex-col overflow-hidden">
        {/* Main Grid View */}
        <div className="flex-1 relative flex flex-col overflow-hidden">
          {/* Header with Actions */}
          <div className="flex items-center justify-between px-6 py-4 mb-4 border-b border-gray-200 dark:border-gray-700 ">
            <div>
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                {activeArea?.name || 'Tables'}
              </h2>
              <p className="text-sm text-gray-500 mt-0.5">
                {areaTables.length} {areaTables.length === 1 ? 'table' : 'tables'}
              </p>
            </div>

            <div className="flex items-center gap-2">
              <button 
                onClick={openAddTableModal}
                className="flex items-center gap-2 px-4 py-2 bg-gray-900 dark:bg-white text-white dark:text-gray-900 rounded-lg text-sm font-medium hover:opacity-90 transition-opacity"
              >
                <Plus className="w-4 h-4" />
                Add Table
              </button>

              {pageData?.actions?.filter((a: any) => a.type === 'save').map((action: any, idx: number) => (
                <button 
                  key={idx}
                  onClick={handleSave}
                  className="flex items-center gap-2 px-4 py-2 text-gray-600 dark:text-gray-400 rounded-lg text-sm font-medium hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                >
                  <Save className="w-4 h-4" />
                  {action.label}
                </button>
              ))}
            </div>
          </div>

          {/* Tables Grid */}
          <div className="flex-1 overflow-y-auto px-6 pb-6">
            {areaTables.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-center space-y-3">
                <Grid3x3 className="w-10 h-10 text-gray-300 dark:text-gray-600" />
                <div>
                  <p className="text-base font-medium text-gray-900 dark:text-white">No tables yet</p>
                  <p className="text-sm text-gray-500 mt-1">Add your first table to get started</p>
                </div>
                <button 
                  onClick={openAddTableModal}
                  className="flex items-center gap-2 px-4 py-2 bg-gray-900 dark:bg-white text-white dark:text-gray-900 rounded-lg text-sm font-medium hover:opacity-90 transition-opacity mt-2"
                >
                  <Plus className="w-4 h-4" />
                  Add Table
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-3">
                {areaTables.map(table => (
                  <button
                    key={table.id}
                    onClick={() => setSelectedTableId(table.id)}
                    className={`relative p-4 rounded-lg border border-gray-200 dark:border-gray-700 transition-all duration-150 text-left ${
                      selectedTableId === table.id
                        ? 'bg-gray-900 dark:bg-white text-white dark:text-gray-900'
                        : 'bg-gray-50 dark:bg-gray-800 hover:bg-gray-100 dark:hover:bg-gray-700'
                    }`}
                  >
                    {/* Status Indicator */}
                    <div className="absolute top-3 right-3">
                      <div className={`w-1.5 h-1.5 rounded-full ${
                        table.status === 'available' ? 'bg-emerald-500' :
                        table.status === 'occupied' ? 'bg-rose-500' : 
                        'bg-amber-500'
                      }`} />
                    </div>

                    {/* Table Info */}
                    <div className="space-y-2">
                      <h3 className="text-lg font-semibold">
                        {table.name}
                      </h3>

                      <div className="flex items-center justify-between text-sm">
                        <div className={`flex items-center gap-1.5 ${
                          selectedTableId === table.id 
                            ? 'text-white/70 dark:text-gray-900/70' 
                            : 'text-gray-500'
                        }`}>
                          <UsersIcon className="w-3.5 h-3.5" />
                          <span>{table.capacity}</span>
                        </div>
                        <span className={`text-xs capitalize ${
                          selectedTableId === table.id 
                            ? 'text-white/60 dark:text-gray-900/60' 
                            : 'text-gray-400'
                        }`}>
                          {table.status}
                        </span>
                      </div>
                    </div>
                  </button>
                ))}

                {/* Add Table Card */}
                <button 
                  onClick={openAddTableModal}
                  className="p-4 rounded-lg border border-dashed border-gray-300 dark:border-gray-600 hover:border-gray-900 dark:hover:border-white hover:bg-gray-50 dark:hover:bg-gray-800 transition-all flex flex-col items-center justify-center gap-2 text-gray-400 hover:text-gray-900 dark:hover:text-white min-h-[100px]"
                >
                  <Plus className="w-5 h-5" />
                  <span className="text-xs font-medium">Add Table</span>
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="w-72 flex flex-col gap-4 overflow-y-auto">
        <div className="px-1">
          <h3 className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Properties</h3>
        </div>

        {selectedTable ? (
          <div className="space-y-4">
            <div className="space-y-1.5">
              <label className="text-xs font-medium text-gray-500 dark:text-gray-400">Table Name</label>
              <input 
                type="text"
                value={selectedTable.name}
                onChange={(e) => updateTable(selectedTable.id, { name: e.target.value })}
                className="w-full px-3 py-2 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-gray-900 dark:focus:ring-white focus:border-transparent transition-all text-sm font-medium text-gray-900 dark:text-white"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-medium text-gray-500 dark:text-gray-400">Capacity</label>
              <div className="flex items-center gap-2">
                <button onClick={() => updateTable(selectedTable.id, { capacity: Math.max(1, selectedTable.capacity - 1) })} className="w-9 h-9 flex items-center justify-center bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-lg text-sm font-medium">−</button>
                <input type="number" value={selectedTable.capacity} onChange={(e) => updateTable(selectedTable.id, { capacity: parseInt(e.target.value) || 1 })} className="flex-1 px-3 py-2 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg text-center text-sm font-medium focus:ring-2 focus:ring-gray-900 dark:focus:ring-white focus:border-transparent" />
                <button onClick={() => updateTable(selectedTable.id, { capacity: selectedTable.capacity + 1 })} className="w-9 h-9 flex items-center justify-center bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-lg text-sm font-medium">+</button>
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-medium text-gray-500 dark:text-gray-400">Status</label>
              <div className="grid grid-cols-3 gap-1.5">
                {(['available', 'occupied', 'reserved'] as const).map((status) => (
                  <button
                    key={status}
                    onClick={() => updateTable(selectedTable.id, { status })}
                    className={`px-2 py-1.5 rounded-lg text-xs font-medium capitalize transition-colors ${
                      selectedTable.status === status
                        ? 'bg-gray-900 dark:bg-white text-white dark:text-gray-900'
                        : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700'
                    }`}
                  >
                    {status}
                  </button>
                ))}
              </div>
            </div>

            <div className="pt-2 mt-2">
              <button onClick={() => deleteTable(selectedTable.id)} className="w-full flex items-center justify-center gap-2 px-3 py-2 text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-500/10 rounded-lg text-sm font-medium transition-colors">
                <Trash2 className="w-4 h-4" />
                Remove
              </button>
            </div>
          </div>
        ) : (
          <div className="flex-1 flex flex-col items-center justify-center text-center space-y-2 opacity-40">
            <MousePointer2 className="w-6 h-6 text-gray-400" />
            <p className="text-xs text-gray-500">No table selected</p>
          </div>
        )}
      </div>

      {/* Add Table Modal */}
      {isModalOpen && (
        <div 
          className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4"
          onClick={closeModal}
        >
          <div 
            className="bg-white dark:bg-gray-900 rounded-2xl shadow-2xl w-full max-w-md border border-gray-200 dark:border-gray-800"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 dark:border-gray-800">
              <h3 className="text-lg font-bold text-gray-900 dark:text-white">Add New Table</h3>
              <button
                onClick={closeModal}
                className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors"
              >
                <X className="w-5 h-5 text-gray-400" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6 space-y-5">
              {/* Table Name */}
              <div className="space-y-2">
                <label className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Table Name
                </label>
                <input
                  type="text"
                  value={newTableName}
                  onChange={(e) => setNewTableName(e.target.value)}
                  className="w-full px-4 py-2.5 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all font-medium text-gray-900 dark:text-white"
                  placeholder="e.g., T-1"
                />
              </div>

              {/* Capacity */}
              <div className="space-y-2">
                <label className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Capacity
                </label>
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => setNewTableCapacity(Math.max(1, newTableCapacity - 1))}
                    className="w-10 h-10 flex items-center justify-center bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-lg transition-colors font-bold text-gray-700 dark:text-gray-300"
                  >
                    −
                  </button>
                  <input
                    type="number"
                    value={newTableCapacity}
                    onChange={(e) => setNewTableCapacity(parseInt(e.target.value) || 1)}
                    className="flex-1 px-4 py-2.5 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg text-center font-bold text-gray-900 dark:text-white focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                  />
                  <button
                    onClick={() => setNewTableCapacity(newTableCapacity + 1)}
                    className="w-10 h-10 flex items-center justify-center bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-lg transition-colors font-bold text-gray-700 dark:text-gray-300"
                  >
                    +
                  </button>
                </div>
              </div>

              {/* Status */}
              <div className="space-y-2">
                <label className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Status
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {(['available', 'occupied', 'reserved'] as const).map((status) => (
                    <button
                      key={status}
                      onClick={() => setNewTableStatus(status)}
                      className={`px-3 py-2.5 rounded-lg text-sm font-semibold capitalize transition-all ${
                        newTableStatus === status
                          ? status === 'available'
                            ? 'bg-emerald-500 text-white'
                            : status === 'occupied'
                            ? 'bg-rose-500 text-white'
                            : 'bg-amber-500 text-white'
                          : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700'
                      }`}
                    >
                      {status}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="flex items-center gap-3 px-6 py-4 border-t border-gray-100 dark:border-gray-800">
              <button
                onClick={closeModal}
                className="flex-1 px-4 py-2.5 border border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 rounded-lg font-semibold hover:bg-gray-50 dark:hover:bg-gray-800 transition-all"
              >
                Cancel
              </button>
              <button
                onClick={handleCreateTable}
                className="flex-1 px-4 py-2.5 bg-emerald-500 text-white rounded-lg font-semibold hover:bg-emerald-600 transition-all"
              >
                Create Table
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TablesManagementPage;
