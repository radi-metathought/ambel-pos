import type { LucideIcon } from 'lucide-react';
import { motion } from 'framer-motion';

interface StatCardProps {
  title: string;
  value: string | number;
  change?: string;
  changeType?: 'positive' | 'negative' | 'neutral';
  icon: LucideIcon;
  delay?: number;
}

export default function StatCard({
  title,
  value,
  change,
  changeType = 'neutral',
  icon: Icon,
  delay = 0,
}: StatCardProps) {
  const changeColors = {
    positive: 'text-green-600 dark:text-green-400 bg-green-50 dark:bg-green-950',
    negative: 'text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-950',
    neutral: 'text-gray-600 dark:text-gray-400 bg-gray-50 dark:bg-gray-900',
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay }}
      className="group relative bg-white dark:bg-gray-950 rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden border border-gray-200 dark:border-gray-800 hover:border-gray-300 dark:hover:border-gray-700"
    >
      <div className="relative p-6">
        {/* Icon */}
        <div className="w-12 h-12 rounded-xl bg-gray-600 dark:bg-gray-700 flex items-center justify-center mb-4 shadow-sm group-hover:scale-110 transition-transform duration-300">
          <Icon className="w-6 h-6 text-white dark:text-gray-100" />
        </div>

        {/* Title */}
        <h3 className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-2">{title}</h3>

        {/* Value */}
        <div className="flex items-baseline justify-between">
          <p className="text-3xl font-bold text-gray-900 dark:text-white group-hover:scale-105 transition-transform duration-300">
            {value}
          </p>

          {/* Change Badge */}
          {change && (
            <span
              className={`px-2.5 py-1 rounded-full text-xs font-semibold ${changeColors[changeType]}`}
            >
              {change}
            </span>
          )}
        </div>
      </div>

      {/* Animated Border */}
      <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-black dark:via-white to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
    </motion.div>
  );
}
