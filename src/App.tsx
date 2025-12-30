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
// import Settings from './components/Settings';

function App() {
  return (
    <ThemeProvider>
      <div className="min-h-screen bg-white dark:bg-gray-950 transition-colors duration-300">
        <Toaster position="top-right" />
        
        <Routes>
          {/* Admin Routes - No Navbar */}
          <Route path="/admin" element={<AdminLogin />} />
          <Route path="/admin/dashboard" element={<AdminDashboard />} />

          {/* Main App Routes - With Navbar */}
          <Route
            path="/*"
            element={
              <>
                <Navbar />
                <main className="pt-24 min-h-screen transition-all duration-300 pb-20 lg:pb-0">
                  <div className="max-w-7xl mx-auto px-6 py-8">
                    <Routes>
                      <Route path="/" element={<Dashboard />} />
                      <Route path="/orders" element={<Orders />} />
                      <Route path="/stock" element={<Stock />} />
                      <Route path="/table" element={<Table />} />
                      {/* <Route path="/history" element={<History />} /> */}
                      {/* <Route path="/settings" element={<Settings />} /> */}
                    </Routes>
                  </div>
                </main>
              </>
            }
          />
        </Routes>
      </div>
    </ThemeProvider>
  );
}

export default App;
