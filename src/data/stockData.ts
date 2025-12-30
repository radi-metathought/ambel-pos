export interface StockItem {
  id: string;
  name: string;
  sku: string;
  category: string;
  currentStock: number;
  minStock: number;
  maxStock: number;
  unit: string;
  price: number;
  supplier: string;
}

export interface StockRequest {
  id: string;
  items: Array<{
    productId: string;
    productName: string;
    quantity: number;
    priority: 'low' | 'medium' | 'high';
  }>;
  reason: string;
  status: 'pending' | 'approved' | 'rejected';
  requestedBy: string;
  requestDate: string;
}

export interface StockAdjustment {
  id: string;
  productId: string;
  productName: string;
  previousStock: number;
  adjustment: number;
  newStock: number;
  reason: string;
  adjustedBy: string;
  adjustmentDate: string;
}

export interface StockAdjustmentRequest {
  id: string;
  items: Array<{
    productId: string;
    productName: string;
    quantity: number;
    reason: string;
  }>;
  notes?: string;
  status: 'pending' | 'approved' | 'rejected';
  requestedBy: string;
  requestDate: string;
  reviewedBy?: string;
  reviewDate?: string;
}

export interface WarehouseStock {
  id: string;
  warehouseId: string;
  warehouseName: string;
  productId: string;
  productName: string;
  stock: number;
  location: string;
}

export interface GoodsIncome {
  id: string;
  poNumber: string;
  supplier: string;
  items: Array<{
    productId: string;
    productName: string;
    quantity: number;
    received: number;
  }>;
  expectedDate: string;
  receivedDate?: string;
  status: 'pending' | 'partial' | 'completed';
  workflowStatus: 'submitted' | 'review' | 'delivery' | 'arrived' | 'accepted' | 'adjustment_pending';
  adjustmentRequested?: boolean;
  adjustmentReason?: string;
  acceptedBy?: string;
  acceptedDate?: string;
}

// Stock On Hand Data
export const stockItems: StockItem[] = [
  {
    id: 's1',
    name: 'Beef Wellington',
    sku: 'FOOD-001',
    category: 'Main Course',
    currentStock: 45,
    minStock: 20,
    maxStock: 100,
    unit: 'portions',
    price: 22.50,
    supplier: 'Premium Meats Co.',
  },
  {
    id: 's2',
    name: 'Chicken Tofu Soup',
    sku: 'FOOD-002',
    category: 'Soup',
    currentStock: 12,
    minStock: 15,
    maxStock: 50,
    unit: 'portions',
    price: 12.90,
    supplier: 'Fresh Ingredients Ltd.',
  },
  {
    id: 's3',
    name: 'Quinoa Salad',
    sku: 'FOOD-003',
    category: 'Salads',
    currentStock: 78,
    minStock: 30,
    maxStock: 100,
    unit: 'portions',
    price: 4.90,
    supplier: 'Green Farms',
  },
  {
    id: 's4',
    name: 'Crispy Calamari',
    sku: 'FOOD-004',
    category: 'Appetizer',
    currentStock: 5,
    minStock: 10,
    maxStock: 50,
    unit: 'portions',
    price: 22.90,
    supplier: 'Ocean Fresh Seafood',
  },
  {
    id: 's5',
    name: 'Matcha Ice Cream',
    sku: 'FOOD-005',
    category: 'Dessert',
    currentStock: 34,
    minStock: 20,
    maxStock: 60,
    unit: 'servings',
    price: 6.90,
    supplier: 'Sweet Delights',
  },
];

// Stock Requests with Multi-Item Support
export const stockRequests: StockRequest[] = [
  {
    id: 'req1',
    items: [
      {
        productId: 's2',
        productName: 'Chicken Tofu Soup',
        quantity: 20,
        priority: 'high',
      },
      {
        productId: 's4',
        productName: 'Crispy Calamari',
        quantity: 15,
        priority: 'high',
      },
    ],
    reason: 'Low stock - below minimum threshold for multiple items',
    status: 'pending',
    requestedBy: 'John Manager',
    requestDate: '2025-12-18',
  },
  {
    id: 'req2',
    items: [
      {
        productId: 's1',
        productName: 'Beef Wellington',
        quantity: 30,
        priority: 'medium',
      },
      {
        productId: 's3',
        productName: 'Quinoa Salad',
        quantity: 40,
        priority: 'low',
      },
      {
        productId: 's5',
        productName: 'Matcha Ice Cream',
        quantity: 25,
        priority: 'medium',
      },
    ],
    reason: 'Anticipated high demand for weekend - restocking multiple menu items',
    status: 'approved',
    requestedBy: 'Sarah Chef',
    requestDate: '2025-12-17',
  },
  {
    id: 'req3',
    items: [
      {
        productId: 's1',
        productName: 'Beef Wellington',
        quantity: 50,
        priority: 'low',
      },
    ],
    reason: 'Restocking for holiday season',
    status: 'pending',
    requestedBy: 'Mike Kitchen',
    requestDate: '2025-12-16',
  },
];

// Stock Adjustments
export const stockAdjustments: StockAdjustment[] = [
  {
    id: 'adj1',
    productId: 's3',
    productName: 'Quinoa Salad',
    previousStock: 68,
    adjustment: 10,
    newStock: 78,
    reason: 'Found additional stock in storage',
    adjustedBy: 'Admin User',
    adjustmentDate: '2025-12-18',
  },
  {
    id: 'adj2',
    productId: 's4',
    productName: 'Crispy Calamari',
    previousStock: 12,
    adjustment: -7,
    newStock: 5,
    reason: 'Damaged during storage',
    adjustedBy: 'Warehouse Manager',
    adjustmentDate: '2025-12-17',
  },
  {
    id: 'adj3',
    productId: 's5',
    productName: 'Matcha Ice Cream',
    previousStock: 30,
    adjustment: 4,
    newStock: 34,
    reason: 'Inventory count correction',
    adjustedBy: 'Admin User',
    adjustmentDate: '2025-12-16',
  },
];

// Stock Adjustment Requests (Pending Approval)
export const stockAdjustmentRequests: StockAdjustmentRequest[] = [
  {
    id: 'adjreq1',
    items: [
      {
        productId: 's2',
        productName: 'Chicken Tofu Soup',
        quantity: -5,
        reason: 'Expired',
      },
    ],
    notes: 'Found expired items during routine check',
    status: 'pending',
    requestedBy: 'Kitchen Staff',
    requestDate: '2025-12-18',
  },
  {
    id: 'adjreq2',
    items: [
      {
        productId: 's1',
        productName: 'Beef Wellington',
        quantity: 3,
        reason: 'Found in secondary storage',
      },
      {
        productId: 's5',
        productName: 'Matcha Ice Cream',
        quantity: -2,
        reason: 'Damaged packaging',
      },
    ],
    notes: 'Multiple adjustments needed after inventory audit',
    status: 'approved',
    requestedBy: 'John Manager',
    requestDate: '2025-12-17',
    reviewedBy: 'Admin User',
    reviewDate: '2025-12-17',
  },
];

// Warehouse Stock
export const warehouseStock: WarehouseStock[] = [
  {
    id: 'ws1',
    warehouseId: 'wh1',
    warehouseName: 'Main Warehouse',
    productId: 's1',
    productName: 'Beef Wellington',
    stock: 30,
    location: 'A-12',
  },
  {
    id: 'ws2',
    warehouseId: 'wh2',
    warehouseName: 'Cold Storage',
    productId: 's1',
    productName: 'Beef Wellington',
    stock: 15,
    location: 'C-05',
  },
  {
    id: 'ws3',
    warehouseId: 'wh1',
    warehouseName: 'Main Warehouse',
    productId: 's2',
    productName: 'Chicken Tofu Soup',
    stock: 8,
    location: 'A-15',
  },
  {
    id: 'ws4',
    warehouseId: 'wh2',
    warehouseName: 'Cold Storage',
    productId: 's2',
    productName: 'Chicken Tofu Soup',
    stock: 4,
    location: 'C-08',
  },
  {
    id: 'ws5',
    warehouseId: 'wh1',
    warehouseName: 'Main Warehouse',
    productId: 's3',
    productName: 'Quinoa Salad',
    stock: 50,
    location: 'B-20',
  },
];

// Goods Income
export const goodsIncome: GoodsIncome[] = [
  {
    id: 'gi1',
    poNumber: 'PO-2025-001',
    supplier: 'Premium Meats Co.',
    items: [
      { productId: 's1', productName: 'Beef Wellington', quantity: 50, received: 50 },
    ],
    expectedDate: '2025-12-15',
    receivedDate: '2025-12-15',
    status: 'completed',
    workflowStatus: 'accepted',
    acceptedBy: 'Admin User',
    acceptedDate: '2025-12-15',
  },
  {
    id: 'gi2',
    poNumber: 'PO-2025-002',
    supplier: 'Ocean Fresh Seafood',
    items: [
      { productId: 's4', productName: 'Crispy Calamari', quantity: 40, received: 25 },
    ],
    expectedDate: '2025-12-18',
    status: 'partial',
    workflowStatus: 'arrived',
  },
  {
    id: 'gi3',
    poNumber: 'PO-2025-003',
    supplier: 'Fresh Ingredients Ltd.',
    items: [
      { productId: 's2', productName: 'Chicken Tofu Soup', quantity: 30, received: 0 },
      { productId: 's3', productName: 'Quinoa Salad', quantity: 50, received: 0 },
    ],
    expectedDate: '2025-12-20',
    status: 'pending',
    workflowStatus: 'delivery',
  },
  {
    id: 'gi4',
    poNumber: 'PO-2025-004',
    supplier: 'Sweet Delights',
    items: [
      { productId: 's5', productName: 'Matcha Ice Cream', quantity: 30, received: 30 },
      { productId: 's1', productName: 'Beef Wellington', quantity: 20, received: 20 },
    ],
    expectedDate: '2025-12-18',
    receivedDate: '2025-12-18',
    status: 'partial',
    workflowStatus: 'arrived',
  },
];
