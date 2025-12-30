import React, { forwardRef } from 'react';
import { formatCurrency, formatDate } from '@/lib/utils';
import { CartItem } from '@/store';

interface ReceiptProps {
  orderNumber: string;
  items: CartItem[];
  subtotal: number;
  tax: number;
  total: number;
  storeName: string;
  storeAddress: string;
  footer: string;
  date?: Date;
}

export const Receipt = forwardRef<HTMLDivElement, ReceiptProps>(
  (
    {
      orderNumber,
      items,
      subtotal,
      tax,
      total,
      storeName,
      storeAddress,
      footer,
      date = new Date(),
    },
    ref
  ) => {
    return (
      <div
        ref={ref}
        className="receipt-print bg-white text-black p-6 max-w-[80mm] mx-auto font-mono text-sm"
      >
        {/* Header */}
        <div className="text-center mb-6 border-b-2 border-dashed border-gray-400 pb-4">
          <h1 className="text-xl font-bold mb-2">{storeName}</h1>
          <p className="text-xs text-gray-600">{storeAddress}</p>
          <p className="text-xs text-gray-600 mt-2">
            Order: #{orderNumber}
          </p>
          <p className="text-xs text-gray-600">
            {formatDate(date, 'long')}
          </p>
        </div>

        {/* Items */}
        <div className="mb-6">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-400">
                <th className="text-left py-2">Item</th>
                <th className="text-center py-2">Qty</th>
                <th className="text-right py-2">Price</th>
                <th className="text-right py-2">Total</th>
              </tr>
            </thead>
            <tbody>
              {items.map((item) => (
                <React.Fragment key={item.id}>
                  <tr className="border-b border-gray-200">
                    <td className="py-2">{item.name}</td>
                    <td className="text-center">{item.quantity}</td>
                    <td className="text-right">{formatCurrency(item.price)}</td>
                    <td className="text-right">
                      {formatCurrency(item.price * item.quantity)}
                    </td>
                  </tr>
                  {item.notes && (
                    <tr>
                      <td colSpan={4} className="text-xs text-gray-600 pb-2">
                        Note: {item.notes}
                      </td>
                    </tr>
                  )}
                </React.Fragment>
              ))}
            </tbody>
          </table>
        </div>

        {/* Totals */}
        <div className="mb-6 border-t-2 border-dashed border-gray-400 pt-4">
          <div className="flex justify-between mb-2">
            <span>Subtotal:</span>
            <span>{formatCurrency(subtotal)}</span>
          </div>
          <div className="flex justify-between mb-2">
            <span>Tax:</span>
            <span>{formatCurrency(tax)}</span>
          </div>
          <div className="flex justify-between text-lg font-bold border-t border-gray-400 pt-2">
            <span>Total:</span>
            <span>{formatCurrency(total)}</span>
          </div>
        </div>

        {/* Footer */}
        <div className="text-center border-t-2 border-dashed border-gray-400 pt-4">
          <p className="text-xs">{footer}</p>
          <p className="text-xs mt-2">Powered by POS System</p>
        </div>
      </div>
    );
  }
);

Receipt.displayName = 'Receipt';
