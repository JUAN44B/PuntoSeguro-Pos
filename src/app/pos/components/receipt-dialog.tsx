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
        const printStyles = `
          @media print {
            body * {
              visibility: hidden;
            }
            .printable-receipt, .printable-receipt * {
              visibility: visible;
            }
            .printable-receipt {
              position: absolute;
              left: 0;
              top: 0;
              width: 100%;
            }
          }
        `;
        const styleSheet = document.createElement("style");
        styleSheet.type = "text/css";
        styleSheet.innerText = printStyles;
        document.head.appendChild(styleSheet);
        
        // Temporarily add a class for printing
        const receiptClone = printContent.cloneNode(true) as HTMLElement;
        receiptClone.classList.add('printable-receipt');
        document.body.appendChild(receiptClone);
        
        window.print();

        document.head.removeChild(styleSheet);
        document.body.removeChild(receiptClone);
    }
  };
  
  const { cart, total } = saleData;

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-sm">
        <DialogHeader>
          <DialogTitle>Venta Completada</DialogTitle>
        </DialogHeader>
        <div ref={receiptRef} className="p-4 bg-white text-black font-mono">
            <div className="text-center space-y-2 mb-6">
                <div className='flex justify-center mb-2'>
                    <Logo />
                </div>
                <h2 className='font-bold text-lg'>Refacciones para Remolques ALIRU</h2>
                <p className='text-xs'>Av. Principal #123, Col. Centro</p>
                <p className='text-xs'>Tel: 123-456-7890</p>
                <p className="text-xs">Fecha: {new Date().toLocaleDateString('es-MX')} Hora: {new Date().toLocaleTimeString('es-MX')}</p>
            </div>
            
            <Separator className="my-4 border-dashed bg-black" />

            <div className="space-y-2 text-xs">
                <div className="grid grid-cols-5 gap-2 font-bold">
                    <div className="col-span-2">PRODUCTO</div>
                    <div className='text-center'>CANT</div>
                    <div className='text-right'>PRECIO</div>
                    <div className="text-right">TOTAL</div>
                </div>
                {cart.map(item => (
                    <div key={item.id} className="grid grid-cols-5 gap-2 items-start">
                        <div className="col-span-2">{item.name}</div>
                        <div className='text-center'>{item.quantity}</div>
                        <div className='text-right'>${item.price.toFixed(2)}</div>
                        <div className="text-right">${(item.price * item.quantity).toFixed(2)}</div>
                    </div>
                ))}
            </div>

            <Separator className="my-4 border-dashed bg-black" />

            <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                    <span className="font-semibold">Subtotal:</span>
                    <span>${(total / 1.16).toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                    <span className="font-semibold">IVA (16%):</span>
                    <span>${(total - (total / 1.16)).toFixed(2)}</span>
                </div>
                 <Separator className="my-2 border-dashed bg-black" />
                <div className="flex justify-between font-bold text-lg">
                    <span>Total:</span>
                    <span>${total.toFixed(2)}</span>
                </div>
            </div>
            
            <Separator className="my-4 border-dashed bg-black" />
            
            <p className="text-center text-xs font-semibold">¡Gracias por su compra!</p>
        </div>

        <DialogFooter className='pt-4 sm:justify-between'>
            <Button type="button" onClick={() => onOpenChange(false)}>Cerrar</Button>
            <Button type="button" variant="outline" onClick={handlePrint}>Imprimir Ticket</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
