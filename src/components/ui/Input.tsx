interface InputProps {
  label?: string;
  type?: 'text' | 'number' | 'date' | 'email' | 'password';
  value: string | number;
  onChange: (value: string) => void;
  placeholder?: string;
  required?: boolean;
  error?: string;
  min?: number;
  max?: number;
  className?: string;
  disabled?: boolean;
}

export default function Input({
  label,
  type = 'text',
  value,
  onChange,
  placeholder,
  required = false,
  error,
  min,
  max,
  className = '',
  disabled = false,
}: InputProps) {
  return (
    <div className={className}>
      {label && (
        <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-2 uppercase tracking-wide">
          {label} {required && <span className="text-red-500">*</span>}
        </label>
      )}
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        min={min}
        max={max}
        disabled={disabled}
        className={`w-full h-11 px-4 rounded-lg border-2 bg-white dark:bg-gray-900 text-gray-900 dark:text-white text-sm placeholder-gray-400 focus:outline-none transition-all disabled:opacity-50 disabled:cursor-not-allowed ${
          error
            ? 'border-red-500 focus:border-red-500 focus:ring-4 focus:ring-red-500/10'
            : 'border-gray-200 dark:border-gray-600 focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10'
        }`}
      />
      {error && <p className="mt-1 text-xs text-red-500">{error}</p>}
    </div>
  );
}
