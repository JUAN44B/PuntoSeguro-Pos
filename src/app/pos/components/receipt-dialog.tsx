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

// Inline SVG for WhatsApp icon for better recognition
const WhatsAppIcon = () => (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="currentColor"
    >
      <path d="M16.75 13.96c.25.13.43.2.5.25.25.13.43.2.5.25s.38.18.5.25c.13.06.25.12.38.18.12.06.25.12.37.18.12.06.25.12.37.18.13.06.2.12.25.13s.13.06.19.12c.06.06.12.12.18.18.06.06.12.12.18.18.06.06.12.13.12.19.06.12.06.25.06.37s-.06.25-.06.38a.85.85 0 01-.12.37c-.06.13-.12.25-.19.38-.06.12-.12.25-.18.37s-.12.19-.18.25c-.06.06-.12.12-.18.18-.06.06-.12.12-.18.18h-.12c-.06.06-.12.12-.19.18-.06.06-.12.12-.18.18-.13.06-.25.12-.38.18s-.25.12-.37.18c-.13.06-.25.12-.38.18-.12.06-.25.12-.37.18-.13.06-.25.12-.38.18-.12.06-.25.12-.37.18-.13.06-.25.12-.38.18-.12.06-.25.12-.37.18-.25.12-.5.25-.75.37a8.5 8.5 0 01-1.12.38c-.5.12-1 .25-1.5.37s-1 .12-1.5.12h-1c-.5 0-1-.06-1.5-.12s-1-.12-1.5-.25c-1-.25-2-.62-2.88-1.12s-1.62-.88-2.25-1.38c-.62-.5-1.12-1-1.5-1.37a7.9 7.9 0 01-1-1.13A12.7 12.7 0 013 12a10.4 10.4 0 01.37-2.63c.25-.75.63-1.5 1.13-2.25.5-.75 1.13-1.37 1.88-1.87.75-.5 1.5-.88 2.25-1.13.75-.25 1.5-.37 2.25-.37h.12c.13 0 .25.06.38.12.12.06.25.12.37.19.12.06.25.12.37.18.12.06.25.12.37.18.07.06.13.12.19.18.06.06.12.12.18.18l.12.13c.06.06.12.12.18.18.06.06.12.12.18.18.06.06.12.12.18.18.06.06.12.12.18.18.06.06.12.12.18.18.06.06.12.12.18.18a.85.85 0 01.19.37c.06.13.06.25.06.38s0 .25-.06.37a.85.85 0 01-.19.38c-.06.12-.12.25-.18.37s-.12.19-.18.25c-.06.06-.12.12-.18.18-.06.06-.12.12-.18.18l-.18.18c-.06.06-.12.12-.18.18-.06.06-.12.12-.18.18-.13.06-.25.12-.38.18s-.25.12-.37.18c-.13.06-.25.12-.38.18s-.25.12-.37.18l-.38.18c-.12.06-.25.12-.37.18-.13.06-.25.12-.38.18s-.25.12-.37.18c-.13.06-.25.12-.38.18-.5.25-.87.5-1.25.75-.37.25-.62.5-.87.75l-.38.38c-.12.12-.25.25-.37.37s-.25.25-.37.38a1.9 1.9 0 00-.37.5c-.13.25-.19.5-.25.75-.06.25-.06.5-.06.75s0 .5.06.75c.06.25.12.5.25.75.12.25.25.5.37.62.13.13.25.25.38.38.13.12.25.25.38.37.13.13.25.25.38.38.13.12.25.25.38.37.25.25.5.5.75.75.25.25.5.5.75.75.25.25.5.5.75.75.25.25.5.5.75.75.13.13.25.25.38.38l.37.37c.25.25.5.5.75.75.25.25.5.5.75.75h.38c.12 0 .25-.06.37-.12.13-.06.25-.12.38-.18.12-.06.25-.12.37-.18s.25-.12.38-.18c.12-.06.25-.12.37-.18l.38-.18c.12-.06.25-.12.37-.18s.25-.12.38-.18c.12-.06.25-.12.37-.18s.25-.12.38-.18l.37-.18c.13-.06.25-.12.38-.18s.25-.12.38-.18c.12-.06.25-.12.37-.18a2.5 2.5 0 00.38-.25c.12-.06.25-.12.37-.18.12-.06.25-.12.37-.18.13-.06.25-.12.38-.18.12-.06.25-.12.37-.18.13-.06.25-.12.38-.18.12-.06.25-.12.37-.18.25-.13.5-.25.75-.38.25-.12.5-.25.75-.37.25-.13.5-.25.75-.38.25-.12.5-.25.75-.37.25-.13.5-.25.75-.38.25-.12.5-.25.75-.37.13-.07.25-.13.38-.2.12-.07.25-.13.37-.2.13-.06.25-.13.38-.2.12-.06.25-.13.37-.19.06-.06.12-.13.19-.19.06-.06.12-.13.19-.19.06-.07.12-.13.19-.2.06-.07.12-.14.18-.21.06-.07.12-.15.18-.23.1-.15.2-.3.3-.45.1-.15.2-.3.3-.45l.2-.45c.1-.15.2-.3.3-.45.1-.15.2-.3.3-.45.05-.1.1-.2.15-.3.05-.1.1-.2.15-.3.05-.1.1-.2.15-.3.05-.1.1-.2.15-.3a2.5 2.5 0 000-1z" />
    </svg>
  );

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
                <p className="text-xs">Fecha: {new Date().toLocaleDateString('es-MX')} {new Date().toLocaleTimeString('es-MX')}</p>
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
                    <WhatsAppIcon />
                    WhatsApp
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
