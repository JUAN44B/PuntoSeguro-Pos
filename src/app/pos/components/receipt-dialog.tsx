
'use client';

import { useRef, useState, useEffect } from 'react';
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
import { Printer, Share2, Loader2 } from 'lucide-react';
import Barcode from '@/components/barcode';
import Logo from '@/components/logo';
import { Separator } from '@/components/ui/separator';

interface ReceiptDialogProps {
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
  saleData: {
    cart: CartItem[];
    total: number;
    paymentMethod: string;
    userName: string;
    amountReceived?: number;
  };
  saleIdFromProps?: string;
}

type CompanyProfile = {
  name?: string;
  address?: string;
  phone?: string;
  email?: string;
  fiscalId?: string;
  receiptFooterMessage?: string;
};

// Mock company profile for demo mode
const mockCompanyProfile: CompanyProfile = {
    name: "ALIRU Refacciones (Demo)",
    address: "Av. Principal #123, 00000, Ciudad, Estado",
    phone: "123 456 789",
    email: "contacto@aliru.com",
    fiscalId: "XAXX010101000",
    receiptFooterMessage: "¡Gracias por su compra! (Modo Demo)",
};

const WhatsAppIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4">
        <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"></path>
    </svg>
);


export function ReceiptDialog({ isOpen, onOpenChange, saleData, saleIdFromProps }: ReceiptDialogProps) {
  const receiptRef = useRef<HTMLDivElement>(null);
  const saleId = saleIdFromProps || `ALIRU-${Date.now().toString().slice(-6)}`;
  const [companyProfile, setCompanyProfile] = useState<CompanyProfile | null>(null);
  const [loadingProfile, setLoadingProfile] = useState(true);

  useEffect(() => {
    if (isOpen) {
      setLoadingProfile(true);
      // In demo mode, we just use the mock profile
      setTimeout(() => {
        setCompanyProfile(mockCompanyProfile);
        setLoadingProfile(false);
      }, 100); // simulate a tiny delay
    }
  }, [isOpen]);

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
              size: 80mm auto;
              margin: 0;
            }
            .printable-receipt {
              width: 100%;
              padding: 4mm;
              color: #000;
              background-color: #fff;
              font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
            }
            .printable-receipt * {
              color: #000 !important;
              background: transparent !important;
            }
            .no-print {
                display: none;
            }
            .receipt-logo svg text, .receipt-logo svg path, .receipt-logo svg g {
                fill: #000 !important;
            }
            .receipt-primary {
                 background-color: #000 !important;
                 color: #fff !important;
            }
          }
        `;
        
        const printWindow = window.open('', '', 'height=800,width=400');
        
        if (printWindow) {
            printWindow.document.write('<html><head><title>Ticket de Venta</title>');
            printWindow.document.head.appendChild(style);
            printWindow.document.write('</head><body>');
            printWindow.document.write(printContent.innerHTML);
            printWindow.document.write('</body></html>');
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
            scale: 2,
            backgroundColor: '#ffffff', // Force white background
            useCORS: true,
            onclone: (document) => {
              // On the cloned document, force styles for dark mode elements
              const clonedReceipt = document.querySelector('.receipt-force-light');
              if (clonedReceipt) {
                const elements = clonedReceipt.querySelectorAll('*');
                elements.forEach((el) => {
                  const htmlEl = el as HTMLElement;
                  htmlEl.style.color = '#000';
                  // Force stroke and fill for SVGs
                  if (el.tagName === 'svg' || el.parentElement?.tagName === 'svg') {
                      htmlEl.style.fill = '#000';
                      htmlEl.style.stroke = '#000';
                  }
                });
                const logoText = clonedReceipt.querySelectorAll('.receipt-logo svg text');
                logoText.forEach(t => (t as HTMLElement).style.fill = '#fff');
                
                const logoPrimaryBg = clonedReceipt.querySelector('.receipt-logo svg rect');
                if(logoPrimaryBg) (logoPrimaryBg as HTMLElement).style.fill = 'hsl(var(--primary))';

                const primaryBgElements = clonedReceipt.querySelectorAll('.receipt-primary');
                primaryBgElements.forEach(el => {
                    (el as HTMLElement).style.backgroundColor = 'hsl(var(--primary))';
                    (el as HTMLElement).style.color = 'hsl(var(--primary-foreground))';
                });
              }
            }
        });

        const dataUrl = canvas.toDataURL('image/png');
        const blob = await (await fetch(dataUrl)).blob();
        const file = new File([blob], `ticket-${saleId}.png`, { type: 'image/png' });

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
  
  const { cart, total, paymentMethod, userName, amountReceived } = saleData;
  const subtotal = total / 1.16;
  const iva = total - subtotal;
  const change = amountReceived ? amountReceived - total : 0;

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Venta Completada</DialogTitle>
        </DialogHeader>
        
        <div className="overflow-y-auto max-h-[70vh] bg-muted/30 p-2 rounded-lg printable-receipt">
            {loadingProfile ? (
              <div className="h-96 flex items-center justify-center">
                <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
              </div>
            ) : (
              <div ref={receiptRef} className="bg-white text-black p-4 rounded-lg shadow-sm receipt-force-light">
                  <div className="text-center mb-6 receipt-logo">
                      <div className="w-32 mx-auto mb-2">
                        <Logo />
                      </div>
                      <p className='font-bold text-lg text-black'>{companyProfile?.name}</p>
                      <p className='text-xs text-gray-600'>{companyProfile?.address}</p>
                      <p className='text-xs text-gray-600'>RFC: {companyProfile?.fiscalId}</p>
                  </div>
                  
                  <Separator className="my-4 bg-gray-300" />

                  <div className='grid grid-cols-2 gap-2 text-xs text-gray-600 mb-4'>
                    <div className='space-y-1'>
                        <p>Folio: <span className='font-semibold text-black'>{saleId}</span></p>
                        <p>Fecha: <span className='font-semibold text-black'>{new Date().toLocaleString('es-MX', { dateStyle: 'short', timeStyle: 'medium' })}</span></p>
                    </div>
                     <div className='space-y-1 text-right'>
                        <p>Cajero: <span className='font-semibold text-black'>{userName}</span></p>
                        <p>Forma de pago: <span className='font-semibold text-black'>{paymentMethod}</span></p>
                    </div>
                  </div>

                  <div className='border border-gray-200 rounded-lg'>
                     <div className='p-3 bg-gray-50 rounded-t-lg'>
                        <h4 className='font-semibold text-sm text-gray-800'>Resumen de la Compra</h4>
                     </div>
                     <div className='p-3 space-y-3 text-sm'>
                        {cart.map(item => {
                            const finalPrice = item.price * (1 - (item.discount || 0) / 100);
                            return (
                              <div key={item.id} className="flex justify-between items-center border-b border-gray-100 py-2">
                                <div>
                                    <p className='font-medium text-black'>{item.name}</p>
                                    <p className='text-xs text-gray-500'>
                                        {item.quantity} x ${finalPrice.toFixed(2)}
                                        {item.discount > 0 && <span className='ml-2 text-green-600'>({item.discount}% off)</span>}
                                    </p>
                                </div>
                                <p className='font-semibold text-black'>${(finalPrice * item.quantity).toFixed(2)}</p>
                              </div>
                            )
                        })}
                     </div>
                  </div>

                  <div className="mt-4 space-y-2 text-sm">
                      <div className='flex justify-between'>
                        <span className='text-gray-600'>Subtotal</span>
                        <span className='text-black'>${subtotal.toFixed(2)}</span>
                      </div>
                       <div className='flex justify-between'>
                        <span className='text-gray-600'>IVA (16%)</span>
                        <span className='text-black'>${iva.toFixed(2)}</span>
                      </div>
                  </div>
                  
                  <div className='mt-4 p-4 bg-primary text-primary-foreground rounded-lg flex justify-between items-center receipt-primary'>
                     <span className='font-bold text-lg'>TOTAL</span>
                     <span className='font-bold text-2xl'>${total.toFixed(2)}</span>
                  </div>

                  {paymentMethod === 'Efectivo' && amountReceived && (
                     <div className="mt-4 space-y-2 text-sm">
                          <div className='flex justify-between'>
                            <span className='text-gray-600'>Recibido</span>
                            <span className='text-black'>${amountReceived.toFixed(2)}</span>
                          </div>
                           <div className='flex justify-between font-semibold'>
                            <span className='text-gray-600'>Cambio</span>
                            <span className='font-bold text-black'>${change.toFixed(2)}</span>
                          </div>
                     </div>
                  )}

                  <div className="my-6 flex justify-center">
                      <Barcode text={saleId} />
                  </div>
                  
                  <footer className="text-center text-xs text-gray-500 space-y-1">
                      <p className='font-semibold text-gray-700'>{companyProfile?.receiptFooterMessage}</p>
                      <p>Este ticket es imprescindible para cualquier cambio o devolución.</p>
                  </footer>
              </div>
            )}
        </div>

        <DialogFooter className='pt-4 grid grid-cols-1 sm:grid-cols-1 gap-2 no-print'>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>Cerrar</Button>
            <div className="grid grid-cols-2 gap-2">
                <Button type="button" variant="secondary" onClick={handleShareAsImage} className="gap-2">
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
