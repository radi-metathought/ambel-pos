export interface TableData {
  id: string;
  number: string;
  floor: number;
  capacity: number;
  status: 'available' | 'occupied';
  orderId?: string;
  gridPosition: {
    row: number;
    col: number;
  };
}

export interface TableOrder {
  id: string;
  customerId: string;
  customerName: string;
  tableNumber: string;
  items: number;
  total: number;
  progress: number;
}

export const tables: TableData[] = [
  // 1st Floor
  { id: 't1', number: 'Table 03', floor: 1, capacity: 4, status: 'occupied', orderId: '#ID1902', gridPosition: { row: 0, col: 2 } },
  { id: 't2', number: 'Table 04', floor: 1, capacity: 4, status: 'occupied', orderId: '#ID8991', gridPosition: { row: 0, col: 3 } },
  { id: 't3', number: 'Table 05', floor: 1, capacity: 4, status: 'occupied', orderId: '#ID8991', gridPosition: { row: 1, col: 2 } },
  { id: 't4', number: 'Table 07', floor: 1, capacity: 4, status: 'occupied', orderId: '#ID7712', gridPosition: { row: 1, col: 3 } },
  { id: 't5', number: '#ID9901', floor: 1, capacity: 4, status: 'available', gridPosition: { row: 0, col: 0 } },
  { id: 't6', number: '#ID8912', floor: 1, capacity: 4, status: 'available', gridPosition: { row: 0, col: 1 } },
  { id: 't7', number: '#ID9920', floor: 1, capacity: 4, status: 'available', gridPosition: { row: 0, col: 4 } },
  
  // 2nd Floor
  { id: 't8', number: 'Table 05', floor: 2, capacity: 6, status: 'occupied', orderId: '#ID8991', gridPosition: { row: 0, col: 0 } },
  { id: 't9', number: 'Table 07', floor: 2, capacity: 6, status: 'occupied', orderId: '#ID7712', gridPosition: { row: 0, col: 1 } },
  { id: 't10', number: '#ID9012', floor: 2, capacity: 4, status: 'available', gridPosition: { row: 1, col: 2 } },
  { id: 't11', number: '#ID8991', floor: 2, capacity: 4, status: 'available', gridPosition: { row: 2, col: 0 } },
  { id: 't12', number: '#ID7712', floor: 2, capacity: 4, status: 'available', gridPosition: { row: 2, col: 1 } },
  { id: 't13', number: 'Table 11', floor: 2, capacity: 6, status: 'occupied', orderId: '#ID1712', gridPosition: { row: 2, col: 2 } },
  
  // 3rd Floor
  { id: 't14', number: 'Table 13', floor: 3, capacity: 6, status: 'occupied', orderId: '#ID1902', gridPosition: { row: 0, col: 0 } },
  { id: 't15', number: 'Table 14', floor: 3, capacity: 6, status: 'occupied', orderId: '#ID8991', gridPosition: { row: 0, col: 1 } },
  { id: 't16', number: '#ID5271', floor: 3, capacity: 4, status: 'available', gridPosition: { row: 0, col: 2 } },
  { id: 't17', number: 'Table 16', floor: 3, capacity: 6, status: 'occupied', orderId: '#ID8912', gridPosition: { row: 0, col: 3 } },
  { id: 't18', number: '#ID1902', floor: 3, capacity: 4, status: 'available', gridPosition: { row: 1, col: 0 } },
  { id: 't19', number: '#ID8912', floor: 3, capacity: 4, status: 'available', gridPosition: { row: 1, col: 4 } },
];

export const activeOrders: TableOrder[] = [
  {
    id: '#ID1902',
    customerId: 'c1',
    customerName: 'Michael Jordan',
    tableNumber: 'Table 12',
    items: 12,
    total: 290,
    progress: 100,
  },
  {
    id: '#ID8991',
    customerId: 'c2',
    customerName: 'Sujwo Bejo',
    tableNumber: 'Table 09',
    items: 4,
    total: 180,
    progress: 70,
  },
  {
    id: '#ID1712',
    customerId: 'c3',
    customerName: 'Dere Rizkeni',
    tableNumber: 'Table 10',
    items: 6,
    total: 190,
    progress: 60,
  },
  {
    id: '#ID8912',
    customerId: 'c4',
    customerName: 'Filipus Seris',
    tableNumber: 'Table 02',
    items: 3,
    total: 90,
    progress: 40,
  },
  {
    id: '#ID9012',
    customerId: 'c5',
    customerName: 'Derga Jasava',
    tableNumber: 'Table 17',
    items: 6,
    total: 102,
    progress: 18,
  },
];
