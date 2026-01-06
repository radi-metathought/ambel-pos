import { motion } from 'framer-motion';

interface PlaceholderPageProps {
  title: string;
  description: string;
}

const PlaceholderPage = ({ title, description }: PlaceholderPageProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="bg-white dark:bg-gray-800 rounded-lg p-8 border border-gray-200 dark:border-gray-700"
    >
      <div className="text-center">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
          {title}
        </h1>
        <p className="text-gray-600 dark:text-gray-400 mb-8">{description}</p>
        <div className="inline-block px-6 py-3 bg-gray-100 dark:bg-gray-700 rounded-lg">
          <p className="text-sm text-gray-600 dark:text-gray-400">
            This page is under development
          </p>
        </div>
      </div>
    </motion.div>
  );
};

// Export individual page components
import { DynamicListPage } from '../../components/DynamicListPage';

export const PurchaseStockPage = () => {
  return <DynamicListPage endpoint="purchase-orders" />;
};

export const ExchangeRatePage = () => {
  return <DynamicListPage endpoint="exchange-rates" />;
};

export const CurrencyManagementPage = () => {
  return <DynamicListPage endpoint="currencies" />;
};

export const EmployeesPage = () => (
  <PlaceholderPage
    title="Employees"
    description="Manage staff members, roles, and permissions"
  />
);

export const OtherExpensePage = () => {
  return <DynamicListPage endpoint="expenses" />;
};

export const ReportsPage = () => (
  <PlaceholderPage
    title="Reports"
    description="View comprehensive business reports and analytics"
  />
);

export const UsersPage = () => {
  return <DynamicListPage endpoint="users" />;
};

export const TaxSettingsPage = () => {
  return <DynamicListPage endpoint="taxes" />;
};

export const SettingsPage = () => (
  <PlaceholderPage
    title="Settings"
    description="Configure system-wide settings and preferences"
  />
);
