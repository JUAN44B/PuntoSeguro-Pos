
import * as React from 'react';
import type { Product } from '@/lib/types';
import Logo from '@/components/ui/logo';

type CartItem = {
    product: Product;
    quantity: number;
    discount: number;
};

interface ReceiptProps {
  items: Map<string, CartItem>;
  total: number;
  subtotal: number;
  tax: number;
  paymentMethod: string;
  amountReceived: number;
  change: number;
}

const Receipt = React.forwardRef<HTMLDivElement, ReceiptProps>(
    ({ items, total, subtotal, tax, paymentMethod, amountReceived, change }, ref) => {
  return (
    <div ref={ref} className="p-4 bg-white text-black text-sm font-mono w-[302px]">
      <div className="text-center mb-4">
        <div className='w-40 mx-auto'>
            <Logo.Icon />
        </div>
        <p className="text-xs">ALIRU Refacciones para Remolques</p>
        <p className="text-xs">Av. Principal 123, Ciudad, País</p>
        <p className="text-xs">{new Date().toLocaleString()}</p>
      </div>
      <div className="border-t border-b border-dashed border-black my-2 py-2">
        {Array.from(items.values()).map(({ product, quantity, discount }) => {
            const itemTotal = product.salePrice * quantity * (1 - discount / 100);
            return (
              <div key={product.id} className="flex justify-between">
                <div className='max-w-[75%]'>
                    <div className='font-semibold'>{product.name}</div>
                    <div className='text-xs pl-2'>{quantity} x ${product.salePrice.toFixed(2)} {discount > 0 && `(-${discount}%)`}</div>
                </div>
                <span className='min-w-fit'>${itemTotal.toFixed(2)}</span>
              </div>
            )
        })}
      </div>
      <div className="space-y-1 my-2">
        <div className="flex justify-between">
            <span>Subtotal:</span>
            <span>${subtotal.toFixed(2)}</span>
        </div>
        <div className="flex justify-between">
            <span>Impuesto (16%):</span>
            <span>${tax.toFixed(2)}</span>
        </div>
        <div className="flex justify-between font-bold text-base">
            <span>Total:</span>
            <span>${total.toFixed(2)}</span>
        </div>
      </div>
       <div className="border-t border-dashed border-black pt-2 mt-2 space-y-1">
         <div className="flex justify-between">
            <span>{paymentMethod === 'cash' ? 'Efectivo' : 'Tarjeta'}:</span>
            <span>${amountReceived.toFixed(2)}</span>
        </div>
        <div className="flex justify-between">
            <span>Cambio:</span>
            <span>${change.toFixed(2)}</span>
        </div>
      </div>
      <p className="text-center mt-4">¡Gracias por su compra!</p>
    </div>
  );
});

Receipt.displayName = "Receipt";

export default Receipt;
