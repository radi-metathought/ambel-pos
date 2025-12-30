export interface CurrentOrder {
  id: string;
  tableNumber: string;
  customerName: string;
  items: number;
  total: number;
  progress: number;
}

export interface MenuItem {
  id: string;
  name: string;
  category: string;
  price: number;
  image: string;
  isBestSeller?: boolean;
  quantity?: number;
}

export interface OrderItem extends MenuItem {
  quantity: number;
}

export const currentOrders: CurrentOrder[] = [
  {
    id: '#ID1902',
    tableNumber: 'Table 12',
    customerName: 'Michael Jordan',
    items: 12,
    total: 290,
    progress: 75,
  },
  {
    id: '#ID8991',
    tableNumber: 'Table 09',
    customerName: 'Sujwo Bejo',
    items: 4,
    total: 180,
    progress: 70,
  },
  {
    id: '#ID1712',
    tableNumber: 'Table 10',
    customerName: 'Dere Rozkent',
    items: 6,
    total: 190,
    progress: 60,
  },
  {
    id: '#ID8912',
    tableNumber: 'Table 05',
    customerName: 'Filipus Seris',
    items: 3,
    total: 90,
    progress: 45,
  },
];

export const categories = [
  { id: 'all', label: 'All menu', icon: '🍽️' },
  { id: 'appetizer', label: 'Appetizer', icon: '🥟' },
  { id: 'soup', label: 'Soup', icon: '🍜' },
  { id: 'salads', label: 'Salads', icon: '🥗' },
  { id: 'main-course', label: 'Main Course', icon: '🍖' },
  { id: 'italian', label: 'Italian', icon: '🍝' },
  { id: 'side-dish', label: 'Side Dish', icon: '🍟' },
  { id: 'dessert', label: 'Dessert', icon: '🧁' },
  { id: 'beverages', label: 'Beverages', icon: '🥤' },
];

export const menuItems: MenuItem[] = [
  {
    id: '1',
    name: 'Crispy Calamari',
    category: 'Appetizer',
    price: 22.90,
    image: 'https://images.unsplash.com/photo-1599487488170-d11ec9c172f0?w=400&h=300&fit=crop',
    quantity: 0,
  },
  {
    id: '2',
    name: 'Chicken Tofu Soup',
    category: 'Soup',
    price: 12.90,
    image: 'https://images.unsplash.com/photo-1547592166-23ac45744acd?w=400&h=300&fit=crop',
    isBestSeller: true,
    quantity: 8,
  },
  {
    id: '3',
    name: 'Quinoa Salad',
    category: 'Salads',
    price: 4.90,
    image: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=400&h=300&fit=crop',
    isBestSeller: true,
    quantity: 6,
  },
  {
    id: '4',
    name: 'Beef Wellington',
    category: 'Main Course',
    price: 22.50,
    image: 'https://images.unsplash.com/photo-1558030006-450675393462?w=400&h=300&fit=crop',
    isBestSeller: true,
    quantity: 4,
  },
  {
    id: '5',
    name: 'Seafood Tempting',
    category: 'Main Course',
    price: 18.90,
    image: 'https://images.unsplash.com/photo-1559847844-5315695dadae?w=400&h=300&fit=crop',
    quantity: 0,
  },
  {
    id: '6',
    name: 'Melting Brownie',
    category: 'Dessert',
    price: 8.50,
    image: 'https://images.unsplash.com/photo-1606313564200-e75d5e30476c?w=400&h=300&fit=crop',
    quantity: 0,
  },
  {
    id: '7',
    name: 'Cheesy Pizza',
    category: 'Italian',
    price: 15.90,
    image: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=400&h=300&fit=crop',
    quantity: 0,
  },
  {
    id: '8',
    name: 'Matcha Ice Cream',
    category: 'Dessert',
    price: 6.90,
    image: 'https://images.unsplash.com/photo-1563805042-7684c019e1cb?w=400&h=300&fit=crop',
    quantity: 0,
  },
];

export const initialOrderItems: OrderItem[] = [
  {
    id: '4',
    name: 'Beef Wellington',
    category: 'Main Course',
    price: 22.50,
    image: 'https://images.unsplash.com/photo-1558030006-450675393462?w=400&h=300&fit=crop',
    quantity: 4,
  },
  {
    id: '3',
    name: 'Quinoa Salad',
    category: 'Salads',
    price: 4.90,
    image: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=400&h=300&fit=crop',
    quantity: 6,
  },
  {
    id: '2',
    name: 'Chicken Tofu Soup',
    category: 'Soup',
    price: 12.90,
    image: 'https://images.unsplash.com/photo-1547592166-23ac45744acd?w=400&h=300&fit=crop',
    quantity: 8,
  },
];
