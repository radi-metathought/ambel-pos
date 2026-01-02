import { motion } from 'framer-motion';

interface SwitchProps {
  label?: string;
  checked: boolean;
  onChange: (checked: boolean) => void;
  disabled?: boolean;
  className?: string;
}

export default function Switch({
  label,
  checked,
  onChange,
  disabled = false,
  className = '',
}: SwitchProps) {
  return (
    <div className={`flex items-center justify-between ${className}`}>
      {label && (
        <span className="text-sm font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wide">
          {label}
        </span>
      )}
      <button
        type="button"
        disabled={disabled}
        onClick={() => onChange(!checked)}
        className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 ${
          checked ? 'bg-emerald-500' : 'bg-gray-200 dark:bg-gray-700'
        }`}
      >
        <motion.span
          animate={{ x: checked ? 20 : 0 }}
          className="pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out"
        />
      </button>
    </div>
  );
}
