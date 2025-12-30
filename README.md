# POS Dashboard

A modern Point of Sale (POS) dashboard built with React, Vite, TypeScript, and WebSocket for real-time order management.

## Features

- 🎨 **Modern Dashboard UI** - Clean and responsive dashboard with Tailwind CSS
- 🔄 **Real-time Orders** - WebSocket integration for live order updates from backend
- 🖨️ **Receipt Printing** - Professional receipt generation and printing
- 📊 **State Management** - Zustand for efficient global state management
- 🎯 **Type Safety** - Full TypeScript support
- ⚡ **Fast Development** - Vite with React SWC for lightning-fast HMR
- 🎭 **Beautiful Animations** - Framer Motion for smooth transitions
- 📈 **Data Visualization** - Recharts for sales analytics

## Tech Stack

- **Framework**: React 18 + TypeScript
- **Build Tool**: Vite
- **Styling**: Tailwind CSS
- **State Management**: Zustand
- **API Client**: Axios
- **WebSocket**: Socket.io-client
- **Data Fetching**: TanStack Query (React Query)
- **Routing**: React Router DOM
- **Charts**: Recharts
- **Animations**: Framer Motion
- **UI Components**: Headless UI
- **Icons**: Lucide React
- **Notifications**: React Hot Toast
- **Receipt Printing**: React-to-Print, jsPDF, html2canvas

## Getting Started

### Prerequisites

- Node.js 18+ 
- npm or yarn

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd fe-pos
```

2. Install dependencies:
```bash
npm install
```

3. Configure environment variables:
```bash
cp .env.example .env
```

Edit `.env` and update the following:
- `VITE_API_URL`: Your backend API URL
- `VITE_WEBSOCKET_URL`: Your WebSocket server URL

4. Start the development server:
```bash
npm run dev
```

The application will be available at `http://localhost:5173`

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

## Project Structure

```
fe-pos/
├── src/
│   ├── components/       # React components
│   │   └── Receipt.tsx   # Receipt printing component
│   ├── hooks/           # Custom React hooks
│   │   └── useWebSocket.ts
│   ├── lib/             # Utility functions
│   │   └── utils.ts
│   ├── services/        # API and WebSocket services
│   │   ├── api.ts
│   │   └── websocket.ts
│   ├── store/           # Zustand store
│   │   └── index.ts
│   ├── App.tsx          # Main app component
│   ├── main.tsx         # Entry point
│   └── index.css        # Global styles
├── public/              # Static assets
├── .env                 # Environment variables
├── tailwind.config.js   # Tailwind configuration
├── tsconfig.json        # TypeScript configuration
└── vite.config.ts       # Vite configuration
```

## Features in Detail

### WebSocket Integration

The application connects to a WebSocket server to receive real-time order updates:

```typescript
import { useWebSocket } from '@/hooks/useWebSocket';

function Dashboard() {
  const { isConnected, orders, updateOrderStatus } = useWebSocket();
  
  // Handle new orders automatically
  // Update order status
  updateOrderStatus(orderId, 'completed');
}
```

### Receipt Printing

Generate and print professional receipts:

```typescript
import { useRef } from 'react';
import { useReactToPrint } from 'react-to-print';
import { Receipt } from '@/components/Receipt';

function Checkout() {
  const receiptRef = useRef<HTMLDivElement>(null);
  
  const handlePrint = useReactToPrint({
    content: () => receiptRef.current,
  });
  
  return (
    <>
      <Receipt ref={receiptRef} {...receiptData} />
      <button onClick={handlePrint}>Print Receipt</button>
    </>
  );
}
```

### State Management

Use Zustand for global state:

```typescript
import { useStore } from '@/store';

function Cart() {
  const { cart, addToCart, removeFromCart, getCartTotal } = useStore();
  
  // Add items to cart
  addToCart(product, quantity);
  
  // Get total
  const total = getCartTotal();
}
```

### API Service

Make API calls with built-in error handling:

```typescript
import { apiService } from '@/services/api';

// GET request
const products = await apiService.get('/products');

// POST request
const order = await apiService.post('/orders', orderData);
```

## Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `VITE_API_URL` | Backend API URL | `http://localhost:3000/api` |
| `VITE_WEBSOCKET_URL` | WebSocket server URL | `http://localhost:3000` |
| `VITE_APP_NAME` | Application name | `POS Dashboard` |
| `VITE_APP_VERSION` | Application version | `1.0.0` |

## WebSocket Events

### Listening for Events

- `new_order` - New order received
- `order_update` - Order status updated
- `order_cancelled` - Order cancelled

### Emitting Events

- `update_order_status` - Update order status

## Customization

### Tailwind Theme

Edit `tailwind.config.js` to customize colors, animations, and other design tokens.

### Store Settings

Update store settings in the Zustand store:

```typescript
const { settings, updateSettings } = useStore();

updateSettings({
  storeName: 'My Store',
  currency: 'USD',
  taxRate: 0.1,
});
```

## Building for Production

```bash
npm run build
```

The built files will be in the `dist` directory.

## License

MIT

## Support

For issues and questions, please open an issue on GitHub.
