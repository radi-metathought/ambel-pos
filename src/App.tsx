import { Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { ThemeProvider } from './contexts/ThemeContext';
import Navbar from './components/Navbar';
import Dashboard from './components/Dashboard';
import Orders from './components/Orders';
import Stock from './components/Stock';
import Table from './components/Table';
import AdminLogin from './components/AdminLogin';
import AdminDashboard from './components/AdminDashboard';
import ProtectedRoute from './components/ProtectedRoute';
import OverviewPage from './pages/admin/OverviewPage';
import { ProductsPage } from './pages/admin/ProductsPage';
import { CategoriesPage } from './pages/admin/CategoriesPage';
import { RecipesPage } from './pages/admin/RecipesPage';
import { BranchesPage } from './pages/admin/BranchesPage';
import TablesManagementPage from './pages/admin/TablesManagementPage';
import PurchaseInvoicesPage from './pages/admin/PurchaseInvoicesPage';
import SuppliersPage from './pages/admin/SuppliersPage';
import PaymentMethodPage from './pages/admin/PaymentMethodPage';
import OtherIncomePage from './pages/admin/OtherIncomePage';
import StockAdjustmentsPage from './pages/admin/StockAdjustmentsPage';
import DiscountsPage from './pages/admin/DiscountsPage';
import PromotionsPage from './pages/admin/PromotionsPage';
import ReportsPage from './pages/admin/ReportsPage';
import {
  PurchaseStockPage,
  EmployeesPage,
  ExchangeRatePage,
  CurrencyManagementPage,
  OtherExpensePage,
  UsersPage,
  TaxSettingsPage,
  SettingsPage,
} from './pages/admin/PlaceholderPages';

function App() {
  return (
    <ThemeProvider>
      <div className="min-h-screen bg-white dark:bg-gray-950 transition-colors duration-300">
        <Toaster position="top-right" />
        
        <Routes>
          {/* Admin Routes - No Navbar */}
          {/* Public: Admin Login Page */}
          <Route path="/" element={<AdminLogin />} />
          
          {/* Protected: Admin Dashboard and all sub-routes */}
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <AdminDashboard />
              </ProtectedRoute>
            }
          >
            <Route index element={<OverviewPage />} />
            <Route path="products" element={<ProductsPage />} />
            <Route path="categories" element={<CategoriesPage />} />
            <Route path="recipes" element={<RecipesPage />} />
            <Route path="purchase-stock" element={<PurchaseStockPage />} />
            <Route path="purchase-invoices" element={<PurchaseInvoicesPage />} />
            <Route path="suppliers" element={<SuppliersPage />} />
            <Route path="stock-adjustments" element={<StockAdjustmentsPage />} />
            <Route path="branches" element={<BranchesPage />} />
            <Route path="tables" element={<TablesManagementPage />} />
            <Route path="payment-method" element={<PaymentMethodPage />} />
            <Route path="discounts" element={<DiscountsPage />} />
            <Route path="promotions" element={<PromotionsPage />} />
            <Route path="exchange-rate" element={<ExchangeRatePage />} />
            <Route path="currency-management" element={<CurrencyManagementPage />} />
            <Route path="other-expense" element={<OtherExpensePage />} />
            <Route path="other-income" element={<OtherIncomePage />} />
            <Route path="reports" element={<ReportsPage />} />
            <Route path="users" element={<UsersPage />} />
            <Route path="tax-settings" element={<TaxSettingsPage />} />
            <Route path="settings" element={<SettingsPage />} />
          </Route>
        </Routes>
      </div>
    </ThemeProvider>
  );
}

export default App;
