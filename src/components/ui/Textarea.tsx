interface TextareaProps {
  label?: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  required?: boolean;
  error?: string;
  rows?: number;
  className?: string;
  disabled?: boolean;
}

export default function Textarea({
  label,
  value,
  onChange,
  placeholder,
  required = false,
  error,
  rows = 4,
  className = '',
  disabled = false,
}: TextareaProps) {
  return (
    <div className={className}>
      {label && (
        <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-2 uppercase tracking-wide">
          {label} {required && <span className="text-red-500">*</span>}
        </label>
      )}
      <textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        rows={rows}
        disabled={disabled}
        className={`w-full px-4 py-3 rounded-lg border-2 bg-white dark:bg-gray-900 text-gray-900 dark:text-white text-sm placeholder-gray-400 focus:outline-none transition-all disabled:opacity-50 disabled:cursor-not-allowed resize-none ${
          error
            ? 'border-red-500 focus:border-red-500 focus:ring-4 focus:ring-red-500/10'
            : 'border-gray-200 dark:border-gray-600 focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10'
        }`}
      />
      {error && <p className="mt-1 text-xs text-red-500">{error}</p>}
    </div>
  );
}
