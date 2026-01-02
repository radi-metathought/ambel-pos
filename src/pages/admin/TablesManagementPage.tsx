import { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { apiService } from '../../services';
import toast from 'react-hot-toast';
import { 
  Plus, 
  Trash2, 
  Save, 
  RotateCw, 
  Users as UsersIcon, 
  Layers,
  Layout,
  Square,
  Circle,
  Settings2,
  MousePointer2,
  Grab
} from 'lucide-react';

interface Table {
  id: string;
  name: string;
  areaId: string;
  type: 'square' | 'round';
  status: 'available' | 'occupied' | 'reserved';
  x: number;
  y: number;
  width: number;
  height: number;
  capacity: number;
  rotation: number;
}

interface Area {
  id: string;
  name: string;
  width: number;
  height: number;
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
  const [isEditMode, setIsEditMode] = useState(true);
  const [scale, setScale] = useState(1);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    fetchPageData();
    window.addEventListener('resize', calculateScale);
    return () => window.removeEventListener('resize', calculateScale);
  }, []);

  useEffect(() => {
    calculateScale();
  }, [areas, activeAreaId]);

  const calculateScale = () => {
    if (!containerRef.current || !activeArea) return;
    const container = containerRef.current;
    const padding = 80;
    const availableWidth = container.offsetWidth - padding;
    const availableHeight = container.offsetHeight - padding;
    
    const scaleX = availableWidth / activeArea.width;
    const scaleY = availableHeight / activeArea.height;
    setScale(Math.min(scaleX, scaleY, 1));
  };

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

  const handleDragEnd = (id: string, info: any) => {
    if (!isEditMode || !activeArea) return;
    
    setTables(prev => prev.map(t => {
      if (t.id === id) {
        const newX = Math.max(0, Math.min(t.x + (info.offset.x / scale), activeArea.width - t.width));
        const newY = Math.max(0, Math.min(t.y + (info.offset.y / scale), activeArea.height - t.height));

        return { ...t, x: newX, y: newY };
      }
      return t;
    }));
  };

  const addTable = (type: 'square' | 'round') => {
    const tableWidth = type === 'square' ? 80 : 100;
    const tableHeight = type === 'square' ? 80 : 100;
    
    const centerX = activeArea ? (activeArea.width / 2) - (tableWidth / 2) : 50;
    const centerY = activeArea ? (activeArea.height / 2) - (tableHeight / 2) : 50;

    const newTable: Table = {
      id: `t-${Date.now()}`,
      name: `T-${tables.length + 1}`,
      areaId: activeAreaId,
      type,
      status: 'available',
      x: centerX,
      y: centerY,
      width: tableWidth,
      height: tableHeight,
      capacity: 4,
      rotation: 0
    };
    setTables([...tables, newTable]);
    setSelectedTableId(newTable.id);
    toast.success('New table added to center');
  };

  const deleteTable = (id: string) => {
    setTables(tables.filter(t => t.id !== id));
    setSelectedTableId(null);
    toast.success('Table removed');
  };

  const updateTable = (id: string, updates: Partial<Table>) => {
    setTables(tables.map(t => (t.id === id ? { ...t, ...updates } : t)));
  };

  const rotateTable = (id: string) => {
    const table = tables.find(t => t.id === id);
    if (table) {
      updateTable(id, { rotation: (table.rotation + 45) % 360 });
    }
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
    <div className="h-[calc(100vh-180px)] flex gap-6 overflow-hidden">
      {/* Sidebar - Area Selection */}
      <div className="w-64 flex flex-col gap-4 bg-white dark:bg-gray-900 rounded-2xl p-4 border border-gray-100 dark:border-gray-800 shadow-sm overflow-hidden">
        <div className="flex items-center justify-between mb-2 px-2">
          <h3 className="font-bold text-gray-900 dark:text-white flex items-center gap-2">
            <Layers className="w-4 h-4 text-emerald-500" />
            Areas
          </h3>
          <button className="p-1.5 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors">
            <Plus className="w-4 h-4 text-gray-400" />
          </button>
        </div>
        <div className="flex-1 space-y-1 overflow-y-auto pr-1">
          {areas.map(area => (
            <button
              key={area.id}
              onClick={() => setActiveAreaId(area.id)}
              className={`w-full flex items-center justify-between px-3 py-3 rounded-xl transition-all duration-200 ${
                activeAreaId === area.id
                  ? 'bg-emerald-50 dark:bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border border-emerald-100 dark:border-emerald-500/20'
                  : 'text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800 border border-transparent'
              }`}
            >
              <div className="flex items-center gap-3">
                <Layout className="w-4 h-4" />
                <span className="text-sm font-semibold">{area.name}</span>
              </div>
            </button>
          ))}
        </div>

        <div className="mt-auto pt-4 border-t border-gray-50 dark:border-gray-800">
          <button 
            onClick={() => setIsEditMode(!isEditMode)}
            className={`w-full flex items-center justify-center gap-2 px-4 py-3 rounded-xl font-bold transition-all ${
              isEditMode 
                ? 'bg-emerald-500 text-white shadow-lg shadow-emerald-500/20' 
                : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400'
            }`}
          >
            {isEditMode ? <MousePointer2 className="w-4 h-4" /> : <Grab className="w-4 h-4" />}
            <span className="text-sm">{isEditMode ? 'Design Mode' : 'Live View'}</span>
          </button>
        </div>
      </div>

      <div className="flex-1 relative flex flex-col gap-4 overflow-hidden">
        {/* Main Floor Plan Canvas */}
        <div className="flex-1 relative flex flex-col bg-white dark:bg-gray-900 rounded-3xl border border-gray-100 dark:border-gray-800 shadow-sm overflow-hidden">
          {/* Minimalist Floating Toolbar */}
          <div className="absolute top-6 left-1/2 -translate-x-1/2 flex items-center gap-1.5 p-1.5 bg-white/80 dark:bg-gray-900/80 backdrop-blur-xl border border-white/20 dark:border-gray-800/50 rounded-2xl shadow-2xl z-20">
            <div className="flex items-center gap-1 pr-1 border-r border-gray-100 dark:border-gray-800">
              {pageData?.actions?.filter((a: any) => a.type === 'add_table').map((action: any, idx: number) => (
                <button 
                  key={idx}
                  onClick={() => addTable(action.table_type)}
                  className="flex items-center gap-2 px-3 py-2 hover:bg-gray-50 dark:hover:bg-gray-800 rounded-xl transition-all text-gray-600 dark:text-gray-400 font-bold text-xs group"
                >
                  {action.icon === 'square' ? (
                    <Square className="w-4 h-4 text-emerald-500 group-hover:scale-110 transition-transform" />
                  ) : (
                    <Circle className="w-4 h-4 text-emerald-500 group-hover:scale-110 transition-transform" />
                  )}
                  <span className="hidden sm:inline lowercase first-letter:uppercase">{action.label.split(' ')[0]}</span>
                </button>
              ))}
            </div>

            {pageData?.actions?.filter((a: any) => a.type === 'save').map((action: any, idx: number) => (
              <button 
                key={idx}
                onClick={handleSave}
                className="flex items-center gap-2 px-4 py-2 bg-gray-900 dark:bg-white text-white dark:text-gray-900 rounded-xl font-black text-xs hover:scale-[1.02] transition-all shadow-lg"
              >
                <Save className="w-3.5 h-3.5" />
                {action.label}
              </button>
            ))}
          </div>

          <div 
            ref={containerRef}
            className="flex-1 relative overflow-hidden p-12 bg-gray-50 dark:bg-gray-950/20"
            style={{
              backgroundImage: 'radial-gradient(circle, #888 1px, transparent 1px)',
              backgroundSize: '40px 40px',
              backgroundPosition: 'center'
            }}
            onClick={() => setSelectedTableId(null)}
          >
            {/* Status Legend */}
            <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex items-center gap-6 px-6 py-2.5 bg-white/50 dark:bg-gray-900/50 backdrop-blur-md rounded-full border border-white/10 dark:border-white/5 z-10">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]"></div>
                <span className="text-[10px] font-black uppercase tracking-widest text-gray-500">Available</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-rose-500 shadow-[0_0_8px_rgba(244,63,94,0.5)]"></div>
                <span className="text-[10px] font-black uppercase tracking-widest text-gray-500">Occupied</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-amber-500 shadow-[0_0_8px_rgba(245,158,11,0.5)]"></div>
                <span className="text-[10px] font-black uppercase tracking-widest text-gray-500">Reserved</span>
              </div>
            </div>

            <motion.div 
              className="absolute bg-white dark:bg-gray-900 shadow-2xl rounded-sm border border-gray-200 dark:border-gray-800"
              initial={false}
              animate={{ 
                width: activeArea?.width || 800, 
                height: activeArea?.height || 600,
                scale: scale,
                x: '-50%',
                y: '-50%',
                left: '50%',
                top: '50%'
              }}
              style={{ 
                transformOrigin: 'center center',
              }}
              onClick={(e) => e.stopPropagation()}
            >
              {areaTables.map(table => (
                <motion.div
                  key={table.id}
                  drag={isEditMode}
                  dragMomentum={false}
                  dragElastic={0}
                  onDragEnd={(_, info) => handleDragEnd(table.id, info)}
                  onClick={(e) => {
                    e.stopPropagation();
                    setSelectedTableId(table.id);
                  }}
                  animate={{
                    x: table.x,
                    y: table.y,
                    rotate: table.rotation,
                    scale: selectedTableId === table.id ? 1.05 : 1
                  }}
                  transition={{
                    type: "tween",
                    ease: "linear",
                    duration: 0
                  }}
                  className={`absolute cursor-pointer flex flex-col items-center justify-center transition-colors duration-200 ${
                    table.type === 'round' ? 'rounded-full' : 'rounded-xl'
                  } ${
                    selectedTableId === table.id 
                      ? 'ring-2 ring-emerald-500 ring-offset-4 dark:ring-offset-gray-900 z-50' 
                      : 'hover:ring-2 hover:ring-gray-300 dark:hover:ring-gray-700 hover:ring-offset-4'
                  } ${
                    table.status === 'available' ? 'bg-emerald-500' :
                    table.status === 'occupied' ? 'bg-rose-500' : 'bg-amber-500'
                  }`}
                  style={{
                    width: table.width,
                    height: table.height,
                    boxShadow: '0 10px 25px -5px rgba(0,0,0,0.1)'
                  }}
                >
                  <div className="text-white font-black text-sm select-none">{table.name}</div>
                  <div className="flex items-center gap-1 text-[10px] text-white/80 font-bold select-none">
                    <UsersIcon className="w-3 h-3" />
                    {table.capacity}
                  </div>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </div>

        <div className="h-28 flex gap-3 overflow-x-auto pb-2 scrollbar-none px-1">
          {areaTables.map(table => (
            <button
              key={table.id}
              onClick={() => setSelectedTableId(table.id)}
              className={`flex-shrink-0 w-44 p-3 rounded-2xl border transition-all duration-300 flex flex-col justify-between text-left group ${
                selectedTableId === table.id
                  ? 'bg-emerald-500 border-emerald-500 text-white shadow-lg shadow-emerald-500/20'
                  : 'bg-white dark:bg-gray-900 border-gray-100 dark:border-gray-800 hover:border-emerald-200'
              }`}
            >
              <div className="flex items-center justify-between">
                <span className={`text-[10px] uppercase font-black tracking-widest ${selectedTableId === table.id ? 'text-white/70' : 'text-gray-400'}`}>
                  {table.id.substring(0, 8)}
                </span>
                <div className={`w-1.5 h-1.5 rounded-full ${
                  table.status === 'available' ? 'bg-emerald-400' :
                  table.status === 'occupied' ? 'bg-rose-400' : 'bg-amber-400'
                }`} />
              </div>
              <div className="flex items-end justify-between">
                <div>
                  <p className={`text-base font-black leading-tight ${selectedTableId === table.id ? 'text-white' : 'text-gray-900 dark:text-white'}`}>
                    {table.name}
                  </p>
                  <div className={`flex items-center gap-1 text-[10px] font-bold ${selectedTableId === table.id ? 'text-white/80' : 'text-gray-500'}`}>
                    <UsersIcon className="w-3 h-3" />
                    {table.capacity} Seats
                  </div>
                </div>
                <div className={`p-1.5 rounded-lg ${selectedTableId === table.id ? 'bg-white/20' : 'bg-gray-50 dark:bg-gray-800'}`}>
                  {table.type === 'square' ? <Square className="w-3.5 h-3.5" /> : <Circle className="w-3.5 h-3.5" />}
                </div>
              </div>
            </button>
          ))}
          <button 
            onClick={() => addTable('square')}
            className="flex-shrink-0 w-44 p-3 rounded-2xl border-2 border-dashed border-gray-100 dark:border-gray-800 hover:border-emerald-500/30 hover:bg-emerald-50/10 transition-all flex flex-col items-center justify-center gap-2 text-gray-400 group"
          >
            <div className="p-2 rounded-full bg-gray-50 dark:bg-gray-800 group-hover:bg-emerald-500/10 group-hover:text-emerald-500 transition-colors">
              <Plus className="w-4 h-4" />
            </div>
            <span className="text-[10px] font-black uppercase tracking-widest">Add Table</span>
          </button>
        </div>
      </div>

      <div className="w-80 bg-white dark:bg-gray-900 rounded-2xl p-6 border border-gray-100 dark:border-gray-800 shadow-sm flex flex-col gap-6 overflow-y-auto">
        <div className="flex items-center justify-between">
          <h3 className="font-bold text-gray-900 dark:text-white flex items-center gap-2 text-lg">
            <Settings2 className="w-5 h-5 text-emerald-500" />
            Properties
          </h3>
        </div>

        {selectedTable ? (
          <div className="space-y-5 animate-in fade-in slide-in-from-right-4 duration-300">
            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 px-1">Table Name</label>
              <input 
                type="text"
                value={selectedTable.name}
                onChange={(e) => updateTable(selectedTable.id, { name: e.target.value })}
                className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-800 border-none rounded-xl focus:ring-2 focus:ring-emerald-500 transition-all font-bold text-gray-700 dark:text-gray-300"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 px-1">Capacity</label>
                <div className="flex items-center bg-gray-50 dark:bg-gray-800 rounded-xl px-2">
                  <button onClick={() => updateTable(selectedTable.id, { capacity: Math.max(1, selectedTable.capacity - 1) })} className="p-2 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-lg">-</button>
                  <input type="number" value={selectedTable.capacity} onChange={(e) => updateTable(selectedTable.id, { capacity: parseInt(e.target.value) || 1 })} className="w-full bg-transparent border-none text-center font-bold" />
                  <button onClick={() => updateTable(selectedTable.id, { capacity: selectedTable.capacity + 1 })} className="p-2 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-lg">+</button>
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 px-1">Rotation</label>
                <button 
                  onClick={() => rotateTable(selectedTable.id)}
                  className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-gray-50 dark:bg-gray-800 rounded-xl font-bold"
                >
                  <RotateCw className="w-4 h-4" />
                  {selectedTable.rotation}°
                </button>
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 px-1">Status</label>
              <div className="grid grid-cols-1 gap-2">
                {(['available', 'occupied', 'reserved'] as const).map((status) => (
                  <button
                    key={status}
                    onClick={() => updateTable(selectedTable.id, { status })}
                    className={`px-4 py-3 rounded-xl text-sm font-bold capitalize transition-all border ${
                      selectedTable.status === status
                        ? 'bg-emerald-500 text-white' : 'bg-white dark:bg-gray-900 border-gray-100'
                    }`}
                    style={{
                      backgroundColor: selectedTable.status === status ? (status === 'available' ? '#10b981' : status === 'occupied' ? '#f43f5e' : '#f59e0b') : ''
                    }}
                  >
                    {status}
                  </button>
                ))}
              </div>
            </div>

            <div className="pt-6 border-t border-gray-50 dark:border-gray-800 mt-6 flex flex-col gap-3">
              <button onClick={() => deleteTable(selectedTable.id)} className="w-full flex items-center justify-center gap-2 px-4 py-4 bg-rose-50 text-rose-600 rounded-xl font-bold text-sm">
                <Trash2 className="w-4 h-4" />
                Remove Table
              </button>
            </div>
          </div>
        ) : (
          <div className="flex-1 flex flex-col items-center justify-center text-center space-y-4 opacity-50">
            <MousePointer2 className="w-8 h-8 text-gray-400" />
            <p className="text-sm font-bold text-gray-500">No Table Selected</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default TablesManagementPage;
