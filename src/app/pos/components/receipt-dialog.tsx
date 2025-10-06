'use client';

import { useRef } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import Logo from '@/components/logo';
import type { CartItem } from '../page';
import { Separator } from '@/components/ui/separator';

interface ReceiptDialogProps {
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
  saleData: {
    cart: CartItem[];
    total: number;
  };
}

export function ReceiptDialog({ isOpen, onOpenChange, saleData }: ReceiptDialogProps) {
  const receiptRef = useRef<HTMLDivElement>(null);

  const handlePrint = () => {
    // This is a browser-native print functionality
    const printContent = receiptRef.current;
    if (printContent) {
        const originalContents = document.body.innerHTML;
        document.body.innerHTML = printContent.innerHTML;
        window.print();
        document.body.innerHTML = originalContents;
        window.location.reload(); // To restore event listeners
    }
  };
  
  const { cart, total } = saleData;

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-sm">
        <div ref={receiptRef} className="p-6 bg-white text-black">
            <div className="text-center space-y-2 mb-6">
                <div className='flex justify-center'>
                    <Logo />
                </div>
                <p className='text-xs'>Refacciones para Remolques ALIRU</p>
                <p className='text-xs'>Av. Principal #123, Col. Centro</p>
                <p className='text-xs'>Tel: 123-456-7890</p>
                <p className="text-xs">Fecha: {new Date().toLocaleDateString('es-MX')} Hora: {new Date().toLocaleTimeString('es-MX')}</p>
            </div>
            
            <Separator className="my-4 border-dashed bg-black" />

            <div className="space-y-2 text-xs">
                <div className="grid grid-cols-5 gap-2 font-bold">
                    <div className="col-span-2">PRODUCTO</div>
                    <div>CANT.</div>
                    <div>PRECIO</div>
                    <div className="text-right">TOTAL</div>
                </div>
                {cart.map(item => (
                    <div key={item.id} className="grid grid-cols-5 gap-2">
                        <div className="col-span-2">{item.name}</div>
                        <div>{item.quantity}</div>
                        <div>${item.price.toFixed(2)}</div>
                        <div className="text-right">${(item.price * item.quantity).toFixed(2)}</div>
                    </div>
                ))}
            </div>

            <Separator className="my-4 border-dashed bg-black" />

            <div className="space-y-1 text-xs">
                <div className="flex justify-between">
                    <span className="font-semibold">Subtotal:</span>
                    <span>${(total / 1.16).toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                    <span className="font-semibold">IVA (16%):</span>
                    <span>${(total - (total / 1.16)).toFixed(2)}</span>
                </div>
                <div className="flex justify-between font-bold text-base">
                    <span>Total:</span>
                    <span>${total.toFixed(2)}</span>
                </div>
            </div>
            
            <Separator className="my-4 border-dashed bg-black" />
            
            <p className="text-center text-xs font-semibold">¡Gracias por su compra!</p>
        </div>

        <DialogFooter className='pt-4'>
            <Button type="button" variant="outline" onClick={handlePrint}>Imprimir Ticket</Button>
            <Button type="button" onClick={() => onOpenChange(false)}>Cerrar</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

// Minimal Separator component for receipt styling
const ReceiptSeparator = () => <div className="border-t border-dashed border-black my-2"></div>;
