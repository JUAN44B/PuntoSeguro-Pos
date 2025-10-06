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
  const saleId = `ALIRU-${Date.now().toString().slice(-6)}`;

  const handlePrint = () => {
    const printContent = receiptRef.current;
    if (printContent) {
        const style = document.createElement('style');
        style.innerHTML = `
          @media print {
            body {
              background-color: #fff;
              -webkit-print-color-adjust: exact;
            }
            @page {
              size: 80mm auto;
              margin: 0;
            }
            .printable-receipt {
              width: 100%;
              padding: 10px;
              color: #000;
              background-color: #fff;
            }
            .printable-receipt * {
              color: #000 !important;
              background: transparent !important;
            }
            .no-print {
                display: none;
            }
          }
        `;
        document.head.appendChild(style);

        const printWindow = window.open('', '', 'height=600,width=800');
        printWindow?.document.write('<html><head><title>Ticket de Venta</title></head><body>');
        printWindow?.document.write(printContent.innerHTML);
        printWindow?.document.write('</body></html>');
        printWindow?.document.close();
        printWindow?.focus();
        setTimeout(() => {
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
            scale: 2.5,
            backgroundColor: '#ffffff',
            useCORS: true,
            windowWidth: receiptElement.scrollWidth,
            windowHeight: receiptElement.scrollHeight,
        });
        const dataUrl = canvas.toDataURL('image/png');
        const blob = await (await fetch(dataUrl)).blob();
        const file = new File([blob], 'ticket-aliru.png', { type: 'image/png' });

        if (navigator.canShare && navigator.canShare({ files: [file] })) {
            await navigator.share({
                files: [file],
                title: 'Ticket de Venta - ALIRU',
                text: `Aquí está tu ticket de compra para la venta ${saleId}. ¡Gracias por tu preferencia!`,
            });
        } else {
           alert('La función de compartir no es compatible con este navegador. El ticket se descargará como imagen.');
           const link = document.createElement('a');
           link.href = dataUrl;
           link.download = `ticket-${saleId}.png`;
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
      <DialogContent className="sm:max-w-md bg-slate-50">
        <DialogHeader>
          <DialogTitle>Venta Completada</DialogTitle>
        </DialogHeader>
        
        {/* Receipt Body */}
        <div ref={receiptRef} className="bg-white p-6 rounded-lg shadow-sm text-gray-800 printable-receipt">
            <header className="text-center mb-6">
                <Logo />
                <h1 className="text-xl font-bold uppercase tracking-wider mt-2">Ticket de Venta</h1>
            </header>

            <div className="grid grid-cols-2 gap-x-4 text-sm mb-6">
                <div>
                    <p className="font-bold">Folio:</p>
                    <p>{saleId}</p>
                </div>
                <div className='text-right'>
                    <p className="font-bold">Fecha:</p>
                    <p>{new Date().toLocaleDateString('es-MX')} {new Date().toLocaleTimeString('es-MX', { hour: '2-digit', minute: '2-digit' })}</p>
                </div>
                <div className='col-span-2 mt-2'>
                    <p className='font-bold'>Empresa:</p>
                    <p>Refacciones para Remolques ALIRU</p>
                    <p>Av. Principal #123, Col. Centro</p>
                </div>
            </div>

            <div className="text-sm">
                <div className="grid grid-cols-12 gap-2 font-bold border-b-2 border-dashed pb-2 mb-2">
                    <div className="col-span-6">Descripción</div>
                    <div className="col-span-2 text-center">Cant.</div>
                    <div className="col-span-4 text-right">Importe</div>
                </div>
                <div className="space-y-2">
                    {cart.map(item => (
                        <div key={item.id} className="grid grid-cols-12 gap-2 items-start">
                            <div className="col-span-6 break-words">{item.name}</div>
                            <div className="col-span-2 text-center">{item.quantity}</div>
                            <div className="col-span-4 text-right">${(item.price * item.quantity).toFixed(2)}</div>
                        </div>
                    ))}
                </div>
            </div>

            <Separator className="my-4 bg-gray-300" />

            <div className="text-sm space-y-2">
                <div className="flex justify-between">
                    <span className="text-gray-600">Subtotal:</span>
                    <span>${(total / 1.16).toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                    <span className="text-gray-600">IVA (16%):</span>
                    <span>${(total - (total / 1.16)).toFixed(2)}</span>
                </div>
                <div className="flex justify-between font-bold text-lg mt-2 p-3 bg-primary text-primary-foreground rounded-md">
                    <span>Total:</span>
                    <span>${total.toFixed(2)}</span>
                </div>
            </div>
            
            <footer className="text-center mt-8">
                <p className="font-semibold text-base">¡Gracias por su compra!</p>
                <p className="text-xs text-gray-500 mt-1">Refacciones para Remolques ALIRU</p>
            </footer>
        </div>

        <DialogFooter className='pt-4 grid grid-cols-1 sm:grid-cols-3 gap-2 no-print'>
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
