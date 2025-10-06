'use client';

import { useRef } from 'react';
import html2canvas from 'html2canvas';
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
        const style = document.createElement('style');
        style.innerHTML = `
          @media print {
            body {
              background-color: #fff;
            }
            @page {
              size: 80mm auto; /* Adjust width as needed for thermal printers */
              margin: 0;
            }
            .printable-receipt {
              width: 100%;
              padding: 10px;
              font-size: 10px; /* Smaller font for thermal printers */
              line-height: 1.4;
            }
            .printable-receipt * {
              color: #000 !important;
              background: #fff !important;
            }
            .no-print {
                display: none;
            }
          }
        `;
        document.head.appendChild(style);

        const printWindow = window.open('', '', 'height=600,width=800');
        printWindow?.document.write('<html><head><title>Ticket de Venta</title></head><body>');
        printWindow?.document.write('<div class="printable-receipt">');
        printWindow?.document.write(printContent.innerHTML);
        printWindow?.document.write('</div></body></html>');
        printWindow?.document.close();
        printWindow?.focus();
        setTimeout(() => { // Timeout to ensure content is loaded
            printWindow?.print();
            printWindow?.close();
        }, 250);
        document.head.removeChild(style);
    }
  };
  
  const handleShareAsImage = async () => {
    const receiptElement = receiptRef.current;
    if (!receiptElement) return;

    try {
        const canvas = await html2canvas(receiptElement, {
            scale: 2, // Higher scale for better quality
            backgroundColor: '#ffffff',
            useCORS: true,
        });
        const dataUrl = canvas.toDataURL('image/png');
        const blob = await (await fetch(dataUrl)).blob();
        const file = new File([blob], 'ticket-aliru.png', { type: 'image/png' });

        if (navigator.canShare && navigator.canShare({ files: [file] })) {
            await navigator.share({
                files: [file],
                title: 'Ticket de Venta - ALIRU',
                text: 'Aquí está tu ticket de compra. ¡Gracias por tu preferencia!',
            });
        } else {
           alert('La función de compartir no es compatible con este navegador.');
           // Fallback: download the image
           const link = document.createElement('a');
           link.href = dataUrl;
           link.download = 'ticket-aliru.png';
           link.click();
        }
    } catch (error) {
        console.error('Error al compartir la imagen:', error);
        alert('Hubo un error al generar la imagen del ticket.');
    }
  };

  const { cart, total } = saleData;

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-sm">
        <DialogHeader>
          <DialogTitle>Venta Completada</DialogTitle>
        </DialogHeader>
        <div ref={receiptRef} className="p-4 bg-white text-black font-mono text-xs">
            <div className="text-center space-y-1 mb-4">
                <div className='flex justify-center mb-2'>
                    <Logo />
                </div>
                <h2 className='font-bold text-sm'>Refacciones para Remolques ALIRU</h2>
                <p>Av. Principal #123, Col. Centro</p>
                <p>Tel: 123-456-7890</p>
                <p>Fecha: {new Date().toLocaleDateString('es-MX')} {new Date().toLocaleTimeString('es-MX')}</p>
            </div>
            
            <Separator className="my-2 border-dashed bg-black" />

            <div className="space-y-1">
                <div className="grid grid-cols-5 gap-2 font-bold">
                    <div className="col-span-2">PRODUCTO</div>
                    <div className='text-center'>CANT</div>
                    <div className='text-right'>PRECIO</div>
                    <div className="text-right">TOTAL</div>
                </div>
                {cart.map(item => (
                    <div key={item.id} className="grid grid-cols-5 gap-2 items-start">
                        <div className="col-span-2 break-words">{item.name}</div>
                        <div className='text-center'>{item.quantity}</div>
                        <div className='text-right'>${item.price.toFixed(2)}</div>
                        <div className="text-right">${(item.price * item.quantity).toFixed(2)}</div>
                    </div>
                ))}
            </div>

            <Separator className="my-2 border-dashed bg-black" />

            <div className="space-y-1">
                <div className="flex justify-between">
                    <span className="font-medium">Subtotal:</span>
                    <span>${(total / 1.16).toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                    <span className="font-medium">IVA (16%):</span>
                    <span>${(total - (total / 1.16)).toFixed(2)}</span>
                </div>
                 <Separator className="my-1 border-dashed bg-black" />
                <div className="flex justify-between font-bold text-base mt-1">
                    <span>Total:</span>
                    <span>${total.toFixed(2)}</span>
                </div>
            </div>
            
            <Separator className="my-2 border-dashed bg-black" />
            
            <p className="text-center font-semibold">¡Gracias por su compra!</p>
        </div>

        <DialogFooter className='pt-4 grid grid-cols-1 sm:grid-cols-3 gap-2'>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)} className='sm:col-span-1'>Cerrar</Button>
            <div className="sm:col-span-2 grid grid-cols-1 sm:grid-cols-2 gap-2">
                <Button type="button" variant="secondary" onClick={handleShareAsImage} className="gap-2">
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
