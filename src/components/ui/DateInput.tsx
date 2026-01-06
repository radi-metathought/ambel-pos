import React from 'react';

interface DateInputProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
  required?: boolean;
  disabled?: boolean;
  className?: string;
}

const DateInput: React.FC<DateInputProps> = ({
  label,
  value,
  onChange,
  required = false,
  disabled = false,
  className = '',
}) => {
  // Convert ISO string to YYYY-MM-DD format for input
  const formatDateForInput = (isoString: string) => {
    if (!isoString) return '';
    try {
      const date = new Date(isoString);
      return date.toISOString().split('T')[0];
    } catch {
      return '';
    }
  };

  // Convert YYYY-MM-DD to ISO 8601 format
  const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const dateValue = e.target.value;
    if (!dateValue) {
      onChange('');
      return;
    }
    
    // Convert to ISO 8601 format (YYYY-MM-DDTHH:mm:ss.sssZ)
    const date = new Date(dateValue);
    const isoString = date.toISOString();
    onChange(isoString);
  };

  return (
    <div className={className}>
      <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-2 uppercase tracking-wide">
        {label} {required && <span className="text-red-500">*</span>}
      </label>
      <input
        type="date"
        value={formatDateForInput(value)}
        onChange={handleDateChange}
        disabled={disabled}
        required={required}
        className="w-full h-11 px-4 rounded-lg border-2 bg-white dark:bg-gray-900 text-gray-900 dark:text-white text-sm placeholder-gray-400 focus:outline-none transition-all disabled:opacity-50 disabled:cursor-not-allowed border-gray-200 dark:border-gray-600 focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10"
      />
    </div>
  );
};

export default DateInput;
