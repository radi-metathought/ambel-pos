import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface Product {
  id: string;
  name: string;
  price: number;
  category: string;
  image?: string;
  stock: number;
  sku?: string;
}

export interface CartItem extends Product {
  quantity: number;
  notes?: string;
}

interface StoreState {
  // Cart
  cart: CartItem[];
  addToCart: (product: Product, quantity?: number) => void;
  removeFromCart: (productId: string) => void;
  updateCartItemQuantity: (productId: string, quantity: number) => void;
  updateCartItemNotes: (productId: string, notes: string) => void;
  clearCart: () => void;
  getCartTotal: () => number;
  getCartItemCount: () => number;

  // User
  user: {
    id: string;
    name: string;
    email: string;
    role: 'admin' | 'cashier' | 'staff';
  } | null;
  setUser: (user: StoreState['user']) => void;
  logout: () => void;

  // Settings
  settings: {
    currency: string;
    taxRate: number;
    receiptFooter: string;
    storeName: string;
    storeAddress: string;
  };
  updateSettings: (settings: Partial<StoreState['settings']>) => void;
}

export const useStore = create<StoreState>()(
  persist(
    (set, get) => ({
      // Cart state
      cart: [],

      addToCart: (product, quantity = 1) => {
        set((state) => {
          const existingItem = state.cart.find((item) => item.id === product.id);

          if (existingItem) {
            return {
              cart: state.cart.map((item) =>
                item.id === product.id
                  ? { ...item, quantity: item.quantity + quantity }
                  : item
              ),
            };
          }

          return {
            cart: [...state.cart, { ...product, quantity }],
          };
        });
      },

      removeFromCart: (productId) => {
        set((state) => ({
          cart: state.cart.filter((item) => item.id !== productId),
        }));
      },

      updateCartItemQuantity: (productId, quantity) => {
        set((state) => ({
          cart: state.cart.map((item) =>
            item.id === productId ? { ...item, quantity } : item
          ),
        }));
      },

      updateCartItemNotes: (productId, notes) => {
        set((state) => ({
          cart: state.cart.map((item) =>
            item.id === productId ? { ...item, notes } : item
          ),
        }));
      },

      clearCart: () => {
        set({ cart: [] });
      },

      getCartTotal: () => {
        const { cart } = get();
        return cart.reduce((total, item) => total + item.price * item.quantity, 0);
      },

      getCartItemCount: () => {
        const { cart } = get();
        return cart.reduce((count, item) => count + item.quantity, 0);
      },

      // User state
      user: null,

      setUser: (user) => {
        set({ user });
      },

      logout: () => {
        set({ user: null, cart: [] });
      },

      // Settings state
      settings: {
        currency: 'USD',
        taxRate: 0.1,
        receiptFooter: 'Thank you for your purchase!',
        storeName: 'My Store',
        storeAddress: '123 Main St, City, Country',
      },

      updateSettings: (newSettings) => {
        set((state) => ({
          settings: { ...state.settings, ...newSettings },
        }));
      },
    }),
    {
      name: 'pos-storage',
      partialize: (state) => ({
        user: state.user,
        settings: state.settings,
      }),
    }
  )
);
