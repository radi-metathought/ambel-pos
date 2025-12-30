import { useEffect, useState, useCallback } from 'react';
import { wsService, Order } from '@/services/websocket';
import toast from 'react-hot-toast';

export function useWebSocket() {
  const [isConnected, setIsConnected] = useState(false);
  const [orders, setOrders] = useState<Order[]>([]);

  useEffect(() => {
    // Connect to WebSocket
    wsService.connect();
    setIsConnected(wsService.isConnected());

    // Listen for new orders
    wsService.onNewOrder((order) => {
      setOrders((prev) => [order, ...prev]);
      toast.success(`New order received: #${order.id}`);
      
      // Play notification sound
      playNotificationSound();
    });

    // Listen for order updates
    wsService.onOrderUpdate((order) => {
      setOrders((prev) =>
        prev.map((o) => (o.id === order.id ? order : o))
      );
      toast.success(`Order #${order.id} updated`);
    });

    // Listen for order cancellations
    wsService.onOrderCancelled((orderId) => {
      setOrders((prev) => prev.filter((o) => o.id !== orderId));
      toast.error(`Order #${orderId} cancelled`);
    });

    // Cleanup on unmount
    return () => {
      wsService.removeAllListeners();
      wsService.disconnect();
    };
  }, []);

  const updateOrderStatus = useCallback((orderId: string, status: Order['status']) => {
    wsService.updateOrderStatus(orderId, status);
  }, []);

  const playNotificationSound = () => {
    // Create a simple beep sound
    const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
    const oscillator = audioContext.createOscillator();
    const gainNode = audioContext.createGain();

    oscillator.connect(gainNode);
    gainNode.connect(audioContext.destination);

    oscillator.frequency.value = 800;
    oscillator.type = 'sine';

    gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.5);

    oscillator.start(audioContext.currentTime);
    oscillator.stop(audioContext.currentTime + 0.5);
  };

  return {
    isConnected,
    orders,
    updateOrderStatus,
  };
}
