# Quick Start Guide - API Service

## 🚀 Getting Started in 3 Steps

### Step 1: Import the Service

```typescript
import { apiService, authService } from '../services';
```

### Step 2: Make API Calls

```typescript
// GET data
const data = await apiService.get('/api/endpoint');

// POST data
const result = await apiService.post('/api/endpoint', { key: 'value' });
```

### Step 3: Handle Authentication

```typescript
// Login
await authService.adminLogin({ email, password });

// Check if logged in
const isLoggedIn = authService.isAdminAuthenticated();
```

## 📋 Common Use Cases

### Fetching Data in a Component

```typescript
import { useState, useEffect } from 'react';
import { apiService } from '../services';

const MyComponent = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const result = await apiService.get('/api/products');
        setData(result);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  if (loading) return <div>Loading...</div>;
  return <div>{/* Render data */}</div>;
};
```

### Creating a New Resource

```typescript
const handleCreate = async (formData) => {
  try {
    const newItem = await apiService.post('/api/products', formData);
    toast.success('Created successfully!');
    // Update your state or refetch data
  } catch (error) {
    // Error is automatically shown via toast
  }
};
```

### Updating a Resource

```typescript
const handleUpdate = async (id, updates) => {
  try {
    await apiService.put(`/api/products/${id}`, updates);
    toast.success('Updated successfully!');
  } catch (error) {
    // Error handled automatically
  }
};
```

### Deleting a Resource

```typescript
const handleDelete = async (id) => {
  try {
    await apiService.delete(`/api/products/${id}`);
    toast.success('Deleted successfully!');
  } catch (error) {
    // Error handled automatically
  }
};
```

## 🔐 Authentication Examples

### Admin Login Page

```typescript
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { authService } from '../services';
import toast from 'react-hot-toast';

const LoginPage = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      await authService.adminLogin({ email, password });
      toast.success('Welcome back!');
      navigate('/admin/dashboard');
    } catch (error) {
      // Error shown automatically
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleLogin}>
      <input value={email} onChange={(e) => setEmail(e.target.value)} />
      <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
      <button type="submit" disabled={loading}>
        {loading ? 'Logging in...' : 'Login'}
      </button>
    </form>
  );
};
```

### Protected Route

```typescript
import { Navigate } from 'react-router-dom';
import { authService } from '../services';

const ProtectedRoute = ({ children }) => {
  if (!authService.isAdminAuthenticated()) {
    return <Navigate to="/admin/login" replace />;
  }
  return children;
};

// Usage in routes
<Route
  path="/admin/dashboard"
  element={
    <ProtectedRoute>
      <DashboardPage />
    </ProtectedRoute>
  }
/>
```

### Logout Button

```typescript
import { useNavigate } from 'react-router-dom';
import { authService } from '../services';
import toast from 'react-hot-toast';

const LogoutButton = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    authService.adminLogout();
    toast.success('Logged out successfully');
    navigate('/admin/login');
  };

  return <button onClick={handleLogout}>Logout</button>;
};
```

## 📦 API Endpoints Reference

### Current Implementation

| Endpoint | Method | Description | Service Method |
|----------|--------|-------------|----------------|
| `/auth/dashboard/login` | POST | Admin login | `authService.adminLogin()` |
| `/auth/login` | POST | User login | `authService.login()` |

### Example Endpoints (Add as needed)

```typescript
// Products
GET    /api/products          → apiService.get('/api/products')
GET    /api/products/:id      → apiService.get(`/api/products/${id}`)
POST   /api/products          → apiService.post('/api/products', data)
PUT    /api/products/:id      → apiService.put(`/api/products/${id}`, data)
DELETE /api/products/:id      → apiService.delete(`/api/products/${id}`)

// Orders
GET    /api/orders            → apiService.get('/api/orders')
POST   /api/orders            → apiService.post('/api/orders', data)
PATCH  /api/orders/:id/status → apiService.patch(`/api/orders/${id}/status`, { status })
```

## 🎯 Best Practices

### ✅ DO

- Use the API service for all HTTP requests
- Let the service handle errors (they show toast notifications)
- Use TypeScript types for better type safety
- Keep API calls in useEffect or event handlers
- Use try-catch for custom error handling

### ❌ DON'T

- Don't use fetch() directly
- Don't create new Axios instances
- Don't manually add Authorization headers (automatic)
- Don't forget to handle loading states in UI

## 🔧 Configuration

### Set Base URL

Create `.env` file:
```env
VITE_API_URL=http://localhost:3000
```

### TypeScript Types

```typescript
interface Product {
  id: string;
  name: string;
  price: number;
}

// Type-safe API call
const products = await apiService.get<Product[]>('/api/products');
```

## 📚 More Information

- See `src/services/README.md` for complete documentation
- See `src/services/examples.ts` for more examples
- See `API_INTEGRATION_SUMMARY.md` for implementation details

## 🆘 Troubleshooting

### CORS Errors
Make sure your backend allows requests from your frontend origin.

### 401 Unauthorized
Token might be expired or invalid. User will be prompted to login again.

### Network Errors
Check if the backend server is running on the correct port.

### TypeScript Errors
Make sure to define proper interfaces for your API responses.

---

**You're all set!** Start building with the API service. 🚀
