import { useState, useEffect } from 'react';
import { Loader2, Upload, Save, Plus, Minus } from 'lucide-react';
import Input from './Input';
import Select from './Select';
import Textarea from './Textarea';
import Switch from './Switch';
import DateInput from './DateInput';
import { apiService } from '../../services';
import toast from 'react-hot-toast';

interface Choice {
  label: string;
  value: any;
}

interface FormFieldMetadata {
  name: string;
  label: string;
  type: string;
  required?: string;
  default?: any;
  choices?: Choice[];
  remote_url_for?: string;
  set_width?: number;
  placeholder?: string;
  disabled?: boolean;
  multivalue?: boolean;
}

interface FormTab {
  title: string;
  index: string;
  field: FormFieldMetadata[];
  multivalue?: boolean;
}

interface FormAction {
  text: string;
  url: string;
  color: string;
  navigate_to: string;
  method?: string;
}

interface DynamicFormResponse {
  data: {
    tab: FormTab[];
    header: string;
    action: FormAction[];
  };
}

interface DynamicFormProps {
  formConfig: DynamicFormResponse;
  onSuccess: () => void;
}

const DynamicForm = ({ formConfig, onSuccess }: DynamicFormProps) => {
  const [formData, setFormData] = useState<Record<string, any>>({});
  const [remoteOptions, setRemoteOptions] = useState<Record<string, Choice[]>>({});
  const [loadingRemote, setLoadingRemote] = useState<Record<string, boolean>>({});
  const [submitLoading, setSubmitLoading] = useState(false);
  // Track number of instances for multi-value tabs (grouped fields)
  const [tabInstanceCounts, setTabInstanceCounts] = useState<Record<string, number>>({});

  const tabs = formConfig.data.tab;
  const actions = formConfig.data.action;

  useEffect(() => {
    // Initialize form data with defaults
    const initialData: Record<string, any> = {};
    const initialTabCounts: Record<string, number> = {};
    
    console.log('🔍 DynamicForm Tabs:', tabs.map(t => ({ title: t.title, multivalue: t.multivalue, multi_value: (t as any).multi_value, fields: t.field.length })));
    
    tabs.forEach(tab => {
      const isMultiValueTab = tab.multivalue || (tab as any).multi_value;
      
      if (isMultiValueTab) {
        // Tab-level multi-value: create array with one object containing all fields
        const firstInstance: Record<string, any> = {};
        tab.field.forEach(field => {
          const defaultVal = field.default !== undefined ? field.default : (field.type === 'BooleanField' ? false : '');
          firstInstance[field.name] = defaultVal;
          
          // Fetch remote options if needed
          if (field.type === 'RemoteSelectFields' && field.remote_url_for) {
            fetchRemoteOptions(field.name, field.remote_url_for);
          }
        });
        // Use tab title or index as key for the array
        const tabKey = tab.title.toLowerCase().replace(/\s+/g, '_');
        initialData[tabKey] = [firstInstance];
        initialTabCounts[tabKey] = 1;
      } else {
        // Regular fields
        tab.field.forEach(field => {
          if (field.multivalue) {
            // Individual field multi-value (legacy support)
            initialData[field.name] = [field.default !== undefined ? field.default : (field.type === 'BooleanField' ? false : '')];
          } else {
            if (field.default !== undefined) {
              initialData[field.name] = field.default;
            } else {
              initialData[field.name] = field.type === 'BooleanField' ? false : '';
            }
          }
          
          // Fetch remote options if needed
          if (field.type === 'RemoteSelectFields' && field.remote_url_for) {
            fetchRemoteOptions(field.name, field.remote_url_for);
          }
        });
      }
    });
    setFormData(initialData);
    setTabInstanceCounts(initialTabCounts);
  }, [formConfig]);

  const fetchRemoteOptions = async (fieldName: string, url: string) => {
    const trimmedUrl = url?.trim() || '';
    const normalizedUrl = trimmedUrl.replace(/^\/+|\/+$/g, '').toLowerCase();
    
    if (!trimmedUrl || trimmedUrl === '#' || normalizedUrl === 'all' || normalizedUrl === '') {
      return;
    }

    try {
      setLoadingRemote(prev => ({ ...prev, [fieldName]: true }));
      
      const sanitizedUrl = url.startsWith('/') ? url.substring(1) : url;
      const response = await apiService.get<any>(sanitizedUrl);
      
      let options: Choice[] = [];
      const data = response.data || response;
      
      if (Array.isArray(data)) {
        options = data.map((item: any) => {
          const rawValue = item.id !== undefined ? item.id : (item.ID !== undefined ? item.ID : (item.value || ''));
          return {
            label: String(item.name || item.text || item.title || item.label || 'Unknown'),
            // Keep as raw value (could be number)
            value: rawValue
          };
        });
      }
      
      setRemoteOptions(prev => ({ ...prev, [fieldName]: options }));
    } catch (error) {
      console.error(`Failed to fetch options for ${fieldName}:`, error);
    } finally {
      setLoadingRemote(prev => ({ ...prev, [fieldName]: false }));
    }
  };

  const handleChange = (name: string, value: any, type?: string) => {
    let finalValue = value;

    // 1. Force Boolean conversion if the field is a BooleanField OR it's a boolean-like string
    if (type === 'BooleanField' || value === 'true' || value === 'false') {
      finalValue = value === 'true' || value === true;
    } 
    // 2. Handle Numeric conversion for all numeric field types
    else if (
      type === 'IntegerField' || 
      type === 'DecimalField' || 
      type === 'RemoteSelectFields' || 
      type === 'SelectField'
    ) {
      // If it looks like a number and isn't empty, cast it
      if (typeof value === 'string' && value.trim() !== '' && !isNaN(Number(value))) {
        finalValue = Number(value);
      } else if (value === '') {
        // Avoid sending empty strings for number fields
        finalValue = type === 'RemoteSelectFields' ? null : 0;
      }
    }
    
    setFormData(prev => ({ ...prev, [name]: finalValue }));
  };

  const handleTabGroupChange = (tabKey: string, instanceIndex: number, fieldName: string, value: any, type?: string) => {
    let finalValue = value;

    // Apply type conversion
    if (type === 'BooleanField' || value === 'true' || value === 'false') {
      finalValue = value === 'true' || value === true;
    } else if (
      type === 'IntegerField' || 
      type === 'DecimalField' || 
      type === 'RemoteSelectFields' || 
      type === 'SelectField'
    ) {
      if (typeof value === 'string' && value.trim() !== '' && !isNaN(Number(value))) {
        finalValue = Number(value);
      } else if (value === '') {
        finalValue = type === 'RemoteSelectFields' ? null : 0;
      }
    }
    
    setFormData(prev => {
      const currentArray = Array.isArray(prev[tabKey]) ? [...prev[tabKey]] : [];
      const currentInstance = { ...currentArray[instanceIndex] };
      currentInstance[fieldName] = finalValue;
      currentArray[instanceIndex] = currentInstance;
      return { ...prev, [tabKey]: currentArray };
    });
  };

  const addTabInstance = (tabKey: string, tab: FormTab) => {
    setTabInstanceCounts(prev => ({ ...prev, [tabKey]: (prev[tabKey] || 1) + 1 }));
    setFormData(prev => {
      const currentArray = Array.isArray(prev[tabKey]) ? [...prev[tabKey]] : [];
      const newInstance: Record<string, any> = {};
      tab.field.forEach(field => {
        newInstance[field.name] = field.type === 'BooleanField' ? false : '';
      });
      return { ...prev, [tabKey]: [...currentArray, newInstance] };
    });
  };

  const removeTabInstance = (tabKey: string, instanceIndex: number) => {
    setTabInstanceCounts(prev => ({ ...prev, [tabKey]: Math.max(1, (prev[tabKey] || 1) - 1) }));
    setFormData(prev => {
      const currentArray = Array.isArray(prev[tabKey]) ? [...prev[tabKey]] : [];
      if (currentArray.length > 1) {
        currentArray.splice(instanceIndex, 1);
      }
      return { ...prev, [tabKey]: currentArray };
    });
  };

  const handleMultiValueChange = (name: string, index: number, value: any, type?: string) => {
    let finalValue = value;

    // Apply same type conversion logic
    if (type === 'BooleanField' || value === 'true' || value === 'false') {
      finalValue = value === 'true' || value === true;
    } else if (
      type === 'IntegerField' || 
      type === 'DecimalField' || 
      type === 'RemoteSelectFields' || 
      type === 'SelectField'
    ) {
      if (typeof value === 'string' && value.trim() !== '' && !isNaN(Number(value))) {
        finalValue = Number(value);
      } else if (value === '') {
        finalValue = type === 'RemoteSelectFields' ? null : 0;
      }
    }
    
    setFormData(prev => {
      const currentArray = Array.isArray(prev[name]) ? [...prev[name]] : [];
      currentArray[index] = finalValue;
      return { ...prev, [name]: currentArray };
    });
  };

  const addMultiValueInstance = (fieldName: string, fieldType: string) => {
    setMultiValueCounts(prev => ({ ...prev, [fieldName]: (prev[fieldName] || 1) + 1 }));
    setFormData(prev => {
      const currentArray = Array.isArray(prev[fieldName]) ? [...prev[fieldName]] : [];
      const defaultValue = fieldType === 'BooleanField' ? false : '';
      return { ...prev, [fieldName]: [...currentArray, defaultValue] };
    });
  };

  const removeMultiValueInstance = (fieldName: string, index: number) => {
    setMultiValueCounts(prev => ({ ...prev, [fieldName]: Math.max(1, (prev[fieldName] || 1) - 1) }));
    setFormData(prev => {
      const currentArray = Array.isArray(prev[fieldName]) ? [...prev[fieldName]] : [];
      currentArray.splice(index, 1);
      return { ...prev, [fieldName]: currentArray };
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitLoading(true);

    // Clean up form data: convert tab-based arrays to clean field names
    const cleanedData: Record<string, any> = {};
    
    Object.entries(formData).forEach(([key, value]) => {
      if (Array.isArray(value) && value.length > 0 && typeof value[0] === 'object') {
        // This is a multi-value tab array - clean up the field names
        cleanedData[key] = value.map(item => {
          const cleanedItem: Record<string, any> = {};
          Object.entries(item).forEach(([fieldName, fieldValue]) => {
            // Remove the tab key prefix if it exists (e.g., "items.productId" -> "productId")
            const cleanFieldName = fieldName.includes('.') 
              ? fieldName.split('.').pop() || fieldName 
              : fieldName;
            cleanedItem[cleanFieldName] = fieldValue;
          });
          return cleanedItem;
        });
      } else {
        // Regular field or simple array
        cleanedData[key] = value;
      }
    });

    console.log('📤 Original Form Data:', JSON.stringify(formData, null, 2));
    console.log('✨ Cleaned Form Data:', JSON.stringify(cleanedData, null, 2));

    try {
      const primaryAction = actions[0];
      if (!primaryAction) return;

      const method = (primaryAction.method?.toLowerCase() || 'post') as 'post' | 'patch' | 'put' | 'get';
      
      // Sanitizing URL again for safety
      const sanitizedUrl = primaryAction.url.startsWith('/') ? primaryAction.url.substring(1) : primaryAction.url;

      if (typeof apiService[method] === 'function') {
        await apiService[method](sanitizedUrl, cleanedData);
      } else {
        await apiService.post(sanitizedUrl, cleanedData);
      }

      toast.success('Saved successfully');
      onSuccess();
    } catch (error: any) {
      toast.error(error.message || 'Failed to save data');
    } finally {
      setSubmitLoading(false);
    }
  };

  const renderField = (field: FormFieldMetadata, options: { tabKey?: string; tabInstanceIndex?: number; isLegacyMultiValue?: boolean; instanceIndex?: number } = {}) => {
    const { tabKey, tabInstanceIndex, isLegacyMultiValue, instanceIndex } = options;
    
    // Determine the field value based on context
    let fieldValue;
    if (tabKey !== undefined && tabInstanceIndex !== undefined) {
      // Tab-level multi-value (grouped fields)
      const tabArray = formData[tabKey];
      fieldValue = Array.isArray(tabArray) && tabArray[tabInstanceIndex] ? tabArray[tabInstanceIndex][field.name] : '';
    } else if (isLegacyMultiValue && instanceIndex !== undefined) {
      // Legacy: Individual field multi-value
      fieldValue = Array.isArray(formData[field.name]) ? formData[field.name][instanceIndex] : '';
    } else {
      // Regular field
      fieldValue = formData[field.name];
    }
    
    const handleFieldChange = (val: any) => {
      if (tabKey !== undefined && tabInstanceIndex !== undefined) {
        handleTabGroupChange(tabKey, tabInstanceIndex, field.name, val, field.type);
      } else if (isLegacyMultiValue && instanceIndex !== undefined) {
        handleMultiValueChange(field.name, instanceIndex, val, field.type);
      } else {
        handleChange(field.name, val, field.type);
      }
    };

    const commonProps = {
      label: field.label,
      required: field.required === '*',
      disabled: field.disabled,
      className: ''
    };

    let fieldComponent;
    switch (field.type) {
      case 'TextField':
        fieldComponent = (
          <Input
            {...commonProps}
            value={fieldValue || ''}
            onChange={handleFieldChange}
            placeholder={field.placeholder}
          />
        );
        break;
      
      case 'IntegerField':
      case 'DecimalField':
        fieldComponent = (
          <Input
            {...commonProps}
            type="number"
            value={fieldValue}
            onChange={handleFieldChange}
          />
        );
        break;

      case 'TextAreaField':
        fieldComponent = (
          <Textarea
            {...commonProps}
            value={fieldValue || ''}
            onChange={handleFieldChange}
            placeholder={field.placeholder}
          />
        );
        break;

      case 'SelectField':
        fieldComponent = (
          <Select
            {...commonProps}
            value={fieldValue}
            onChange={handleFieldChange}
            options={field.choices || []}
          />
        );
        break;

      case 'RemoteSelectFields':
        fieldComponent = (
          <Select
            {...commonProps}
            value={fieldValue}
            onChange={handleFieldChange}
            options={remoteOptions[field.name] || []}
            loading={loadingRemote[field.name]}
          />
        );
        break;

      case 'DateField':
        fieldComponent = (
          <DateInput
            {...commonProps}
            value={fieldValue || ''}
            onChange={handleFieldChange}
          />
        );
        break;

      case 'BooleanField':
        fieldComponent = (
          <Switch
            {...commonProps}
            checked={!!fieldValue}
            onChange={handleFieldChange}
          />
        );
        break;

      case 'DocumentField':
        fieldComponent = (
          <div className="space-y-2">
            {(!isLegacyMultiValue || instanceIndex === 0) && (
              <label className="text-sm font-semibold text-gray-700 dark:text-gray-300">
                {field.label} {commonProps.required && <span className="text-red-500">*</span>}
              </label>
            )}
            <div className="flex items-center justify-center w-full">
              <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-gray-300 border-dashed rounded-2xl cursor-pointer bg-gray-50 dark:hover:bg-gray-800 dark:bg-gray-900 hover:bg-gray-100 dark:border-gray-700 transition-all">
                <div className="flex flex-col items-center justify-center pt-5 pb-6">
                  <Upload className="w-8 h-8 mb-3 text-gray-400" />
                  <p className="mb-2 text-sm text-gray-500 dark:text-gray-400">
                    <span className="font-semibold">Click to upload</span> or drag and drop
                  </p>
                  <p className="text-xs text-gray-400 uppercase">JPG, PNG (MAX. 5MB)</p>
                </div>
                <input type="file" className="hidden" />
              </label>
            </div>
          </div>
        );
        break;

      default:
        fieldComponent = (
          <p className="text-xs text-red-400 italic">Unknown field type: {field.type}</p>
        );
    }

    return fieldComponent;
  };

  return (
    <div className="flex flex-col bg-white dark:bg-gray-900">
      <form onSubmit={handleSubmit} className="flex flex-col">
        <div className="space-y-8 pb-6">
          {tabs.map((tab, tabIdx) => {
            const tabKey = tab.title.toLowerCase().replace(/\s+/g, '_');
            const instanceCount = tabInstanceCounts[tabKey] || 1;
            
            return (
              <div key={tabIdx} className="animate-in fade-in slide-in-from-bottom-2 duration-500" style={{ animationDelay: `${tabIdx * 100}ms` }}>
                <div className="mb-5">
                  <h4 className="text-sm font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400 mb-2">
                    {tab.title}
                    {/* Debug indicator */}
                    {(tab.multivalue || (tab as any).multi_value) && (
                      <span className="ml-2 text-[10px] px-2 py-0.5 rounded bg-emerald-100 dark:bg-emerald-900 text-emerald-700 dark:text-emerald-300">
                        MULTI
                      </span>
                    )}
                  </h4>
                  <div className="h-px w-full bg-gradient-to-r from-gray-200 via-gray-100 to-transparent dark:from-gray-700 dark:via-gray-800 dark:to-transparent"></div>
                </div>
                
                {(tab.multivalue || (tab as any).multi_value) ? (
                  // Tab-level multi-value: render groups of fields
                  <div className="space-y-6">
                    {Array.from({ length: instanceCount }).map((_, groupIdx) => (
                      <div key={groupIdx} className="relative">
                        <div className="grid grid-cols-12 gap-x-6 gap-y-6 p-5 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50/50 dark:bg-gray-800/30">
                          {tab.field.map((field, fieldIdx) => (
                            <div 
                              key={fieldIdx} 
                              className="transition-all duration-300"
                              style={{ gridColumn: `span ${field.set_width || 12} / span ${field.set_width || 12}` }}
                            >
                              {renderField(field, { tabKey, tabInstanceIndex: groupIdx })}
                            </div>
                          ))}
                        </div>
                        
                        {/* Add/Remove buttons for groups */}
                        <div className="absolute -bottom-4 right-4 flex gap-2">
                          {groupIdx === instanceCount - 1 && (
                            <button
                              type="button"
                              onClick={() => addTabInstance(tabKey, tab)}
                              className="p-2 rounded-lg bg-emerald-500 hover:bg-emerald-600 text-white shadow-lg transition-all hover:scale-105"
                              title="Add another group"
                            >
                              <Plus className="w-4 h-4" />
                            </button>
                          )}
                          {instanceCount > 1 && (
                            <button
                              type="button"
                              onClick={() => removeTabInstance(tabKey, groupIdx)}
                              className="p-2 rounded-lg bg-red-500 hover:bg-red-600 text-white shadow-lg transition-all hover:scale-105"
                              title="Remove this group"
                            >
                              <Minus className="w-4 h-4" />
                            </button>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  // Regular tab: render fields normally
                  <div className="grid grid-cols-12 gap-x-6 gap-y-6">
                    {tab.field.map((field, fieldIdx) => (
                      <div 
                        key={fieldIdx} 
                        className="transition-all duration-300"
                        style={{ gridColumn: `span ${field.set_width || 12} / span ${field.set_width || 12}` }}
                      >
                        {field.multivalue ? (
                          // Legacy: Individual field multi-value
                          <div className="space-y-4">
                            {Array.from({ length: (formData[field.name] as any[])?.length || 1 }).map((_, instanceIdx) => (
                              <div key={instanceIdx} className="flex gap-2 items-start">
                                <div className="flex-1">
                                  {renderField(field, { isLegacyMultiValue: true, instanceIndex: instanceIdx })}
                                </div>
                                {instanceIdx === ((formData[field.name] as any[])?.length || 1) - 1 && (
                                  <button
                                    type="button"
                                    onClick={() => addMultiValueInstance(field.name, field.type)}
                                    className="mt-8 p-2 rounded-lg bg-emerald-500 hover:bg-emerald-600 text-white transition-all"
                                  >
                                    <Plus className="w-4 h-4" />
                                  </button>
                                )}
                                {((formData[field.name] as any[])?.length || 1) > 1 && (
                                  <button
                                    type="button"
                                    onClick={() => removeMultiValueInstance(field.name, instanceIdx)}
                                    className="mt-8 p-2 rounded-lg bg-red-500 hover:bg-red-600 text-white transition-all"
                                  >
                                    <Minus className="w-4 h-4" />
                                  </button>
                                )}
                              </div>
                            ))}
                          </div>
                        ) : (
                          renderField(field)
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Form Actions - Minimalist Footer */}
        <div className="flex justify-end pt-8 mt-4 border-t border-gray-50 dark:border-gray-800/50">
          {actions.map((action, idx) => (
            <button
              key={idx}
              type="submit"
              disabled={submitLoading}
              className={`min-w-[160px] flex items-center justify-center gap-2.5 px-8 py-3.5 rounded-xl font-bold transition-all active:scale-[0.98] disabled:opacity-50 ${
                action.color === 'success' 
                  ? 'bg-gray-900 dark:bg-white text-white dark:text-gray-900 hover:bg-black dark:hover:bg-gray-100 shadow-xl shadow-black/5 dark:shadow-white/5' 
                  : 'bg-emerald-500 text-white hover:bg-emerald-600 shadow-xl shadow-emerald-500/10'
              }`}
            >
              {submitLoading ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <Save className="w-4 h-4" />
              )}
              <span className="text-sm">{action.text}</span>
            </button>
          ))}
        </div>
      </form>
    </div>
  );
};

export default DynamicForm;
