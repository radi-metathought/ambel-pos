/**
 * API Service Usage Examples
 * 
 * This file demonstrates how to use the centralized API service
 * for making HTTP requests throughout the application.
 */

import { apiService } from './api';

// ============================================
// Example 1: GET Request - Fetch all products
// ============================================
export const getProducts = async () => {
  try {
    const products = await apiService.get('/api/products');
    return products;
  } catch (error) {
    console.error('Failed to fetch products:', error);
    throw error;
  }
};

// ============================================
// Example 2: GET Request with Query Parameters
// ============================================
export const getProductById = async (id: string) => {
  try {
    const product = await apiService.get(`/api/products/${id}`);
    return product;
  } catch (error) {
    console.error('Failed to fetch product:', error);
    throw error;
  }
};

// With query parameters
export const searchProducts = async (query: string, category?: string) => {
  try {
    const products = await apiService.get('/api/products/search', {
      q: query,
      category: category,
    });
    return products;
  } catch (error) {
    console.error('Failed to search products:', error);
    throw error;
  }
};

// ============================================
// Example 3: POST Request - Create new product
// ============================================
export const createProduct = async (productData: any) => {
  try {
    const newProduct = await apiService.post('/api/products', productData);
    return newProduct;
  } catch (error) {
    console.error('Failed to create product:', error);
    throw error;
  }
};

// ============================================
// Example 4: PUT Request - Update product
// ============================================
export const updateProduct = async (id: string, productData: any) => {
  try {
    const updatedProduct = await apiService.put(`/api/products/${id}`, productData);
    return updatedProduct;
  } catch (error) {
    console.error('Failed to update product:', error);
    throw error;
  }
};

// ============================================
// Example 5: PATCH Request - Partial update
// ============================================
export const updateProductStock = async (id: string, stock: number) => {
  try {
    const updatedProduct = await apiService.patch(`/api/products/${id}`, { stock });
    return updatedProduct;
  } catch (error) {
    console.error('Failed to update product stock:', error);
    throw error;
  }
};

// ============================================
// Example 6: DELETE Request - Delete product
// ============================================
export const deleteProduct = async (id: string) => {
  try {
    await apiService.delete(`/api/products/${id}`);
  } catch (error) {
    console.error('Failed to delete product:', error);
    throw error;
  }
};

// ============================================
// Example 7: Using in React Component
// ============================================
/*
import { useEffect, useState } from 'react';
import { getProducts, createProduct } from '../services/examples';

const ProductsPage = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const data = await getProducts();
        setProducts(data);
      } catch (error) {
        // Error is already handled by the API service
        // You can add additional UI-specific error handling here
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  const handleCreateProduct = async (productData) => {
    try {
      const newProduct = await createProduct(productData);
      setProducts([...products, newProduct]);
      toast.success('Product created successfully!');
    } catch (error) {
      // Error toast is already shown by the API service
    }
  };

  return (
    // Your component JSX
  );
};
*/

// ============================================
// Example 8: Authentication Usage
// ============================================
/*
// Admin Login
const handleAdminLogin = async (email: string, password: string) => {
  try {
    await authService.adminLogin({ email, password });
    // Navigate to admin dashboard
    navigate('/dashboard');
  } catch (error) {
    // Error is already handled
  }
};

// Regular User Login
const handleLogin = async (email: string, password: string) => {
  try {
    await authService.login({ email, password });
    // Navigate to user dashboard
    navigate('/dashboard');
  } catch (error) {
    // Error is already handled
  }
};

// Logout
const handleLogout = () => {
  authService.adminLogout(); // or authService.logout() for regular users
  navigate('/login');
};

// Check if authenticated
const isLoggedIn = authService.isAdminAuthenticated();
*/

// ============================================
// Example 9: TypeScript Types for Better Type Safety
// ============================================
interface Product {
  id: string;
  name: string;
  price: number;
  stock: number;
  category: string;
}

interface CreateProductDto {
  name: string;
  price: number;
  stock: number;
  category: string;
}

export const getProductsTyped = async (): Promise<Product[]> => {
  return await apiService.get<Product[]>('/api/products');
};

export const createProductTyped = async (productData: CreateProductDto): Promise<Product> => {
  return await apiService.post<Product>('/api/products', productData);
};

// ============================================
// Example 10: Advanced - Custom Axios Instance
// ============================================
export const uploadProductImage = async (productId: string, file: File) => {
  try {
    const formData = new FormData();
    formData.append('image', file);

    const client = apiService.getClient();
    const response = await client.post(`/api/products/${productId}/image`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });

    return response.data;
  } catch (error) {
    console.error('Failed to upload image:', error);
    throw error;
  }
};

// ============================================
// Example 11: Using with React Query
// ============================================
/*
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';

// Fetch products with React Query
export const useProducts = () => {
  return useQuery({
    queryKey: ['products'],
    queryFn: getProducts,
  });
};

// Create product mutation
export const useCreateProduct = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createProduct,
    onSuccess: () => {
      // Invalidate and refetch products
      queryClient.invalidateQueries({ queryKey: ['products'] });
    },
  });
};

// Usage in component
const ProductsPage = () => {
  const { data: products, isLoading, error } = useProducts();
  const createMutation = useCreateProduct();

  const handleCreate = (productData) => {
    createMutation.mutate(productData);
  };

  // ... rest of component
};
*/
