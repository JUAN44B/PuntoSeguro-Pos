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
import type { CartItem } from '../page';
import { Printer, Share2 } from 'lucide-react';

interface ReceiptDialogProps {
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
  saleData: {
    cart: CartItem[];
    total: number;
    paymentMethod: string;
  };
}

// Function to generate a simple barcode SVG (Code 128 is complex, this is a visual representation)
const Barcode = ({ text }: { text: string }) => {
    // A simple visual representation, not a real scannable barcode
    const bars = text.split('').map((char, i) => {
        const value = (char.charCodeAt(0) % 3) + 1; // Simple transformation to get 1, 2, or 3
        return <rect key={i} x={i * 4} y="0" width={value * 1.5} height="40" fill="black" />;
    });
    return (
        <svg height="40" className='w-full'>{bars}</svg>
    );
};


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
              margin: 0;
            }
            @page {
              size: 50mm auto; /* Standard thermal receipt paper roll width */
              margin: 0;
            }
            .printable-receipt-container {
                padding: 0;
                margin: 0;
            }
            .printable-receipt {
              font-family: 'monospace', 'Menlo', 'Consolas', 'Courier New', monospace;
              width: 100%;
              padding: 2mm; /* Small padding */
              color: #000;
              background-color: #fff;
              font-size: 8px; /* Typical receipt font size */
              line-height: 1.4;
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
        
        const printWindow = window.open('', '', 'height=600,width=400');
        
        if (printWindow) {
            printWindow.document.write('<html><head><title>Ticket de Venta</title>');
            printWindow.document.head.appendChild(style);
            printWindow.document.write('</head><body><div class="printable-receipt-container">');
            printWindow.document.write(printContent.innerHTML);
            printWindow.document.write('</div></body></html>');
            printWindow.document.close();
            printWindow.focus();
            setTimeout(() => {
                printWindow.print();
                printWindow.close();
            }, 250);
        }
    }
  };
  
  const handleShareAsImage = async () => {
    const receiptElement = receiptRef.current;
    if (!receiptElement) return;

    try {
        const canvas = await html2canvas(receiptElement, {
            scale: 2, // Higher scale for better resolution
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

  const { cart, total, paymentMethod } = saleData;
  const subtotal = total / 1.16;
  const iva = total - subtotal;

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-xs bg-slate-50">
        <DialogHeader>
          <DialogTitle>Venta Completada</DialogTitle>
        </DialogHeader>
        
        <div className='max-h-[80vh] overflow-y-auto pr-4 flex justify-center'>
            <div ref={receiptRef} className="bg-white p-4 text-black printable-receipt w-[300px]" style={{fontFamily: "'Courier New', Courier, monospace"}}>
                <div className="text-center mb-4">
                    <h1 className="text-xl font-bold tracking-widest">ALIRU</h1>
                    <p className='text-xs'>Refacciones para Remolques</p>
                    <p className='text-xs'>Av. Principal #123, 00000, Ciudad, Estado</p>
                    <p className='text-xs'>TLF: 123 456 789</p>
                </div>

                <div className="mb-4 text-xs space-y-1">
                    <p>Factura simplificada</p>
                    <p>Nº: {saleId}</p>
                    <p>Fecha: {new Date().toLocaleString('es-MX', { dateStyle: 'short', timeStyle: 'medium' })}</p>
                    <p>Forma de pago: {paymentMethod === 'cash' ? 'Efectivo' : 'Tarjeta'}</p>
                </div>

                <div className="text-xs border-t border-b border-black py-1">
                    <div className="flex justify-between font-bold">
                        <span>PRODUCTO</span>
                        <span>SUBTOTAL</span>
                    </div>
                </div>

                <div className="text-xs py-2 space-y-2">
                    {cart.map(item => (
                        <div key={item.id}>
                            <div className="flex justify-between">
                                <span>{item.name}</span>
                                <span>${(item.price * item.quantity).toFixed(2)}</span>
                            </div>
                            <div className='text-gray-600' style={{fontSize: '10px', paddingLeft: '4px'}}>
                                {item.quantity} x ${item.price.toFixed(2)}
                            </div>
                        </div>
                    ))}
                </div>

                <div className="text-xs mt-2 border-t border-black pt-2">
                    <div className="space-y-1">
                        <div className="flex justify-between">
                            <span>Subtotal:</span>
                            <span>${subtotal.toFixed(2)}</span>
                        </div>
                        <div className="flex justify-between">
                            <span>IVA (16%):</span>
                            <span>${iva.toFixed(2)}</span>
                        </div>
                    </div>
                    <div className="flex justify-between font-bold text-base mt-2 border-t border-black pt-1">
                        <span>TOTAL:</span>
                        <span>${total.toFixed(2)}</span>
                    </div>
                </div>
                
                <div className="my-5 flex justify-center">
                    <Barcode text={saleId} />
                </div>

                <footer className="text-center text-xs space-y-2">
                    <p>Fue atendido por: Vendedor 1</p>
                    <p className='font-semibold'>¡Gracias por su compra!</p>
                    <p>Este ticket es imprescindible para cualquier cambio o devolución.</p>
                </footer>
            </div>
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
