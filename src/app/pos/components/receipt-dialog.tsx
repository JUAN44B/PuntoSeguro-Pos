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
import { Printer, Share2 } from 'lucide-react';

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
        // Create a style element and append it to head
        const style = document.createElement('style');
        style.innerHTML = `
          @media print {
            body > *:not(.printable-receipt) {
              display: none;
            }
            body {
              background-color: #fff;
            }
            .printable-receipt {
              position: absolute;
              left: 0;
              top: 0;
              width: 100%;
              padding: 20px;
              font-size: 12px;
            }
          }
        `;
        document.head.appendChild(style);

        // Add a temporary class for printing and append to body
        const receiptClone = printContent.cloneNode(true) as HTMLElement;
        receiptClone.classList.add('printable-receipt');
        document.body.appendChild(receiptClone);
        
        window.print();

        // Clean up after printing
        document.head.removeChild(style);
        document.body.removeChild(receiptClone);
    }
  };
  
  const handleSendWhatsApp = () => {
    const { cart, total } = saleData;
    let message = `*Resumen de Compra - Refacciones para Remolques ALIRU*\n\n`;
    message += `Fecha: ${new Date().toLocaleDateString('es-MX')} ${new Date().toLocaleTimeString('es-MX')}\n`;
    message += `-----------------------------------\n`;

    cart.forEach(item => {
        message += `*${item.name}*\n`;
        message += `  ${item.quantity} x $${item.price.toFixed(2)} = $${(item.quantity * item.price).toFixed(2)}\n`;
    });

    message += `-----------------------------------\n`;
    const subtotal = total / 1.16;
    const iva = total - subtotal;
    message += `Subtotal: $${subtotal.toFixed(2)}\n`;
    message += `IVA (16%): $${iva.toFixed(2)}\n`;
    message += `*Total: $${total.toFixed(2)}*\n\n`;
    message += `¡Gracias por su compra!`;

    const encodedMessage = encodeURIComponent(message);
    const whatsappUrl = `https://wa.me/?text=${encodedMessage}`;
    window.open(whatsappUrl, '_blank');
  };

  const { cart, total } = saleData;

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-sm">
        <DialogHeader>
          <DialogTitle>Venta Completada</DialogTitle>
        </DialogHeader>
        <div ref={receiptRef} className="p-4 bg-white text-black font-mono text-sm">
            <div className="text-center space-y-1 mb-6">
                <div className='flex justify-center mb-4'>
                    <Logo />
                </div>
                <h2 className='font-bold text-base'>Refacciones para Remolques ALIRU</h2>
                <p className='text-xs'>Av. Principal #123, Col. Centro</p>
                <p className='text-xs'>Tel: 123-456-7890</p>
                <p className="text-xs">Fecha: ${new Date().toLocaleDateString('es-MX')} ${new Date().toLocaleTimeString('es-MX')}</p>
            </div>
            
            <Separator className="my-3 border-dashed bg-black" />

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

            <Separator className="my-3 border-dashed bg-black" />

            <div className="space-y-1 text-xs">
                <div className="flex justify-between">
                    <span className="font-medium">Subtotal:</span>
                    <span>${(total / 1.16).toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                    <span className="font-medium">IVA (16%):</span>
                    <span>${(total - (total / 1.16)).toFixed(2)}</span>
                </div>
                 <Separator className="my-2 border-dashed bg-black" />
                <div className="flex justify-between font-bold text-base">
                    <span>Total:</span>
                    <span>${total.toFixed(2)}</span>
                </div>
            </div>
            
            <Separator className="my-3 border-dashed bg-black" />
            
            <p className="text-center text-xs font-semibold">¡Gracias por su compra!</p>
        </div>

        <DialogFooter className='pt-4 grid grid-cols-1 sm:grid-cols-3 gap-2'>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)} className='sm:col-span-1'>Cerrar</Button>
            <div className="sm:col-span-2 grid grid-cols-1 sm:grid-cols-2 gap-2">
                <Button type="button" variant="secondary" onClick={handleSendWhatsApp} className="gap-2">
                    <Share2 className="h-4 w-4" />
                    Compartir
                </Button>
                <Button type="button" onClick={handlePrint} className="gap-2">
                    <Printer className="h-4 w-4" />
                    Imprimir
                </Button>
            </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
