import { io, Socket } from 'socket.io-client';

export interface Order {
  id: string;
  items: OrderItem[];
  total: number;
  status: 'pending' | 'preparing' | 'ready' | 'completed' | 'cancelled';
  customerName?: string;
  tableNumber?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface OrderItem {
  id: string;
  name: string;
  quantity: number;
  price: number;
  notes?: string;
}

class WebSocketService {
  private socket: Socket | null = null;
  private url: string;
  private reconnectAttempts = 0;
  private maxReconnectAttempts = 5;

  constructor(url: string = import.meta.env.VITE_WEBSOCKET_URL || 'http://localhost:3000') {
    this.url = url;
  }

  /**
   * Connect to WebSocket server
   */
  connect(): void {
    if (this.socket?.connected) {
      console.log('WebSocket already connected');
      return;
    }

    this.socket = io(this.url, {
      transports: ['websocket', 'polling'],
      reconnection: true,
      reconnectionDelay: 1000,
      reconnectionDelayMax: 5000,
      reconnectionAttempts: this.maxReconnectAttempts,
    });

    this.setupEventListeners();
  }

  /**
   * Disconnect from WebSocket server
   */
  disconnect(): void {
    if (this.socket) {
      this.socket.disconnect();
      this.socket = null;
    }
  }

  /**
   * Setup event listeners
   */
  private setupEventListeners(): void {
    if (!this.socket) return;

    this.socket.on('connect', () => {
      console.log('WebSocket connected');
      this.reconnectAttempts = 0;
    });

    this.socket.on('disconnect', (reason) => {
      console.log('WebSocket disconnected:', reason);
    });

    this.socket.on('connect_error', (error) => {
      console.error('WebSocket connection error:', error);
      this.reconnectAttempts++;
      
      if (this.reconnectAttempts >= this.maxReconnectAttempts) {
        console.error('Max reconnection attempts reached');
      }
    });

    this.socket.on('error', (error) => {
      console.error('WebSocket error:', error);
    });
  }

  /**
   * Listen for new orders
   */
  onNewOrder(callback: (order: Order) => void): void {
    if (!this.socket) {
      console.error('WebSocket not connected');
      return;
    }

    this.socket.on('new_order', callback);
  }

  /**
   * Listen for order updates
   */
  onOrderUpdate(callback: (order: Order) => void): void {
    if (!this.socket) {
      console.error('WebSocket not connected');
      return;
    }

    this.socket.on('order_update', callback);
  }

  /**
   * Listen for order cancellations
   */
  onOrderCancelled(callback: (orderId: string) => void): void {
    if (!this.socket) {
      console.error('WebSocket not connected');
      return;
    }

    this.socket.on('order_cancelled', callback);
  }

  /**
   * Emit order status update
   */
  updateOrderStatus(orderId: string, status: Order['status']): void {
    if (!this.socket) {
      console.error('WebSocket not connected');
      return;
    }

    this.socket.emit('update_order_status', { orderId, status });
  }

  /**
   * Remove all listeners for a specific event
   */
  removeListener(event: string): void {
    if (!this.socket) return;
    this.socket.off(event);
  }

  /**
   * Remove all listeners
   */
  removeAllListeners(): void {
    if (!this.socket) return;
    this.socket.removeAllListeners();
  }

  /**
   * Check if WebSocket is connected
   */
  isConnected(): boolean {
    return this.socket?.connected || false;
  }

  /**
   * Get socket instance
   */
  getSocket(): Socket | null {
    return this.socket;
  }
}

// Export singleton instance
export const wsService = new WebSocketService();
