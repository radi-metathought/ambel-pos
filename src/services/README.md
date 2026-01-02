# API Service Documentation

This directory contains the centralized API service layer for the application, built with Axios for making HTTP requests.

## Files Overview

- **`api.ts`** - Core API service with Axios configuration and HTTP methods
- **`auth.ts`** - Authentication service for login/logout operations
- **`examples.ts`** - Comprehensive examples of how to use the API service
- **`websocket.ts`** - WebSocket service for real-time communication

## Quick Start

### 1. Basic API Calls

```typescript
import { apiService } from './services/api';

// GET request
const products = await apiService.get('/api/products');

// POST request
const newProduct = await apiService.post('/api/products', {
  name: 'Product Name',
  price: 99.99
});

// PUT request
const updated = await apiService.put('/api/products/123', {
  name: 'Updated Name'
});

// PATCH request
const patched = await apiService.patch('/api/products/123', {
  stock: 50
});

// DELETE request
await apiService.delete('/api/products/123');
```

### 2. Authentication

```typescript
import { authService } from './services/auth';

// Admin Login
try {
  await authService.adminLogin({
    email: 'admin@example.com',
    password: 'password123'
  });
  // Success - navigate to dashboard
} catch (error) {
  // Error is automatically shown via toast
}

// Check if authenticated
const isLoggedIn = authService.isAdminAuthenticated();

// Logout
authService.adminLogout();
```

### 3. With TypeScript Types

```typescript
interface Product {
  id: string;
  name: string;
  price: number;
}

// Type-safe API call
const products = await apiService.get<Product[]>('/api/products');
const product = await apiService.post<Product>('/api/products', newProductData);
```

## Features

### ✅ Automatic Token Management
- Automatically attaches authentication tokens to requests
- Supports both admin and regular user tokens
- Token is stored in localStorage

### ✅ Error Handling
- Centralized error handling with toast notifications
- Handles network errors, server errors, and validation errors
- Custom error messages based on HTTP status codes

### ✅ Request/Response Interceptors
- Automatically adds Authorization header
- Handles 401 (Unauthorized) responses
- Handles 403 (Forbidden) responses
- Handles 404 (Not Found) responses
- Handles 500 (Server Error) responses

### ✅ Base URL Configuration
- Configurable via environment variable `VITE_API_URL`
- Defaults to `http://localhost:3000`
- Easy to switch between development and production

## Configuration

### Environment Variables

Create a `.env` file in the project root:

```env
VITE_API_URL=http://localhost:3000
```

For production:

```env
VITE_API_URL=https://api.yourproduction.com
```

## API Service Methods

### HTTP Methods

| Method | Description | Example |
|--------|-------------|---------|
| `get<T>(url, params?)` | GET request | `apiService.get('/api/products')` |
| `post<T>(url, data?)` | POST request | `apiService.post('/api/products', data)` |
| `put<T>(url, data?)` | PUT request | `apiService.put('/api/products/1', data)` |
| `patch<T>(url, data?)` | PATCH request | `apiService.patch('/api/products/1', data)` |
| `delete<T>(url)` | DELETE request | `apiService.delete('/api/products/1')` |

### Token Management

| Method | Description |
|--------|-------------|
| `setAuthToken(token)` | Set regular user token |
| `clearAuthToken()` | Clear regular user token |
| `setAdminToken(token)` | Set admin token |
| `clearAdminToken()` | Clear admin token and related data |
| `getAuthToken()` | Get current token (admin or regular) |
| `getClient()` | Get Axios instance for custom requests |

### Authentication Methods

| Method | Description |
|--------|-------------|
| `authService.adminLogin(credentials)` | Admin login |
| `authService.login(credentials)` | Regular user login |
| `authService.adminLogout()` | Admin logout |
| `authService.logout()` | Regular user logout |
| `authService.isAdminAuthenticated()` | Check admin auth status |
| `authService.isAuthenticated()` | Check user auth status |
| `authService.getAdminUser()` | Get admin user data |
| `authService.getUser()` | Get user data |

## Usage in React Components

### Basic Example

```typescript
import { useState, useEffect } from 'react';
import { apiService } from '../services/api';
import toast from 'react-hot-toast';

const ProductsPage = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const data = await apiService.get('/api/products');
        setProducts(data);
      } catch (error) {
        // Error already handled by API service
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  const handleCreate = async (productData) => {
    try {
      const newProduct = await apiService.post('/api/products', productData);
      setProducts([...products, newProduct]);
      toast.success('Product created!');
    } catch (error) {
      // Error already handled
    }
  };

  return (
    // Your JSX
  );
};
```

### With React Query

```typescript
import { useQuery, useMutation } from '@tanstack/react-query';
import { apiService } from '../services/api';

const useProducts = () => {
  return useQuery({
    queryKey: ['products'],
    queryFn: () => apiService.get('/api/products'),
  });
};

const useCreateProduct = () => {
  return useMutation({
    mutationFn: (data) => apiService.post('/api/products', data),
  });
};
```

## Error Handling

The API service automatically handles errors and shows toast notifications:

- **401 Unauthorized** - "Unauthorized. Please login again."
- **403 Forbidden** - "Access forbidden"
- **404 Not Found** - "Resource not found"
- **500 Server Error** - "Server error. Please try again later."
- **Network Error** - "Network error. Please check your connection."

You can also add custom error handling in your components:

```typescript
try {
  await apiService.post('/api/products', data);
} catch (error: any) {
  // Custom error handling
  if (error.response?.status === 409) {
    toast.error('Product already exists');
  }
}
```

## Advanced Usage

### File Upload

```typescript
const uploadFile = async (file: File) => {
  const formData = new FormData();
  formData.append('file', file);

  const client = apiService.getClient();
  const response = await client.post('/api/upload', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });

  return response.data;
};
```

### Custom Headers

```typescript
const client = apiService.getClient();
const response = await client.get('/api/data', {
  headers: {
    'X-Custom-Header': 'value',
  },
});
```

## Best Practices

1. **Always use the API service** - Don't use fetch or create new Axios instances
2. **Use TypeScript types** - Define interfaces for your API responses
3. **Handle errors gracefully** - The service handles most errors, but add custom handling when needed
4. **Use React Query** - For better caching and state management
5. **Keep API calls in services** - Don't make API calls directly in components
6. **Use environment variables** - Configure base URL via `.env` file

## Migration Guide

If you have existing fetch calls, here's how to migrate:

### Before (using fetch)
```typescript
const response = await fetch('http://localhost:3000/api/products', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${token}`,
  },
  body: JSON.stringify(data),
});
const result = await response.json();
```

### After (using API service)
```typescript
const result = await apiService.post('/api/products', data);
// Token is automatically added, no need to manually set headers
```

## Support

For more examples, see `examples.ts` in this directory.
