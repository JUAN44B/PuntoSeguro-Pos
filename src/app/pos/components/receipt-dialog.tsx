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
              size: 58mm auto;
              margin: 0;
            }
            .printable-receipt {
              font-family: 'monospace', 'Menlo', 'Consolas', 'Courier New', monospace;
              width: 100%;
              padding: 2mm;
              color: #000;
              background-color: #fff;
              font-size: 8px;
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
        
        const printWindow = window.open('', '', 'height=600,width=300');
        
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

  const handleShareOnWhatsApp = () => {
    let message = `*Ticket de Compra - ${companyProfile?.name || 'ALIRU'}*\n\n`;
    message += `Folio: *${saleId}*\n`;
    message += `Fecha: ${new Date().toLocaleString('es-MX')}\n\n`;
    message += '```------------------------------```\n';
    message += '*RESUMEN DE COMPRA*\n';
    
    saleData.cart.forEach(item => {
        const finalPrice = item.price * (1 - (item.discount || 0) / 100);
        message += `\n${item.name}\n`;
        message += `${item.quantity} x $${finalPrice.toFixed(2)} = $${(finalPrice * item.quantity).toFixed(2)}\n`;
    });

    message += '```------------------------------```\n\n';
    message += `Subtotal: $${(saleData.total / 1.16).toFixed(2)}\n`;
    message += `IVA (16%): $${(saleData.total - (saleData.total / 1.16)).toFixed(2)}\n`;
    message += `*TOTAL: $${saleData.total.toFixed(2)}*\n\n`;
    
    if(saleData.paymentMethod === 'Efectivo' && saleData.amountReceived) {
        message += `Monto Recibido: $${saleData.amountReceived.toFixed(2)}\n`;
        message += `Cambio: $${(saleData.amountReceived - saleData.total).toFixed(2)}\n`;
    }
    message += `\n${companyProfile?.receiptFooterMessage || '¡Gracias por su compra!'}`;

    const whatsappUrl = `https://wa.me/?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, '_blank');
  };
  
  const getPaymentMethodName = (method: string) => {
    return method;
  }

  const { cart, total, paymentMethod, userName, amountReceived } = saleData;
  const subtotal = total / 1.16;
  const iva = total - subtotal;
  const change = amountReceived ? amountReceived - total : 0;

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-xs bg-slate-50">
        <DialogHeader>
          <DialogTitle>Venta Completada</DialogTitle>
        </DialogHeader>
        
        <div className="overflow-y-auto max-h-[60vh]">
            {loadingProfile ? (
              <div className="h-96 flex items-center justify-center">
                <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
              </div>
            ) : (
              <div ref={receiptRef} className="bg-white p-2 text-black printable-receipt w-full font-mono text-[10px] leading-tight">
                  <div className="text-center mb-2 flex flex-col items-center">
                      <div className="w-24 -ml-2">
                        <Logo />
                      </div>
                      <p className='font-bold text-[11px]'>{companyProfile?.name}</p>
                      <p>{companyProfile?.address}</p>
                      <p>TLF: {companyProfile?.phone}</p>
                      <p>RFC: {companyProfile?.fiscalId}</p>
                  </div>
                  
                  <div className='border-t border-b border-dashed border-black py-1 my-2'>
                    <p>Folio: {saleId}</p>
                    <p>Fecha: {new Date().toLocaleString('es-MX', { dateStyle: 'short', timeStyle: 'medium' })}</p>
                    <p>Cajero: {userName}</p>
                    <p>Forma de pago: {getPaymentMethodName(paymentMethod)}</p>
                  </div>
                  
                  <table className='w-full'>
                    <thead>
                      <tr className='border-b border-dashed border-black'>
                        <th className='text-left'>CANT</th>
                        <th className='text-left'>PRODUCTO</th>
                        <th className='text-right'>IMPORTE</th>
                      </tr>
                    </thead>
                    <tbody>
                      {cart.map(item => {
                        const finalPrice = item.price * (1 - (item.discount || 0) / 100);
                        return (
                          <tr key={item.id}>
                            <td className='align-top'>{item.quantity}</td>
                            <td>
                              {item.name}
                              {item.discount > 0 && <div className='text-gray-600'>(-{item.discount}%)</div>}
                            </td>
                            <td className='text-right align-top'>${(finalPrice * item.quantity).toFixed(2)}</td>
                          </tr>
                        )
                      })}
                    </tbody>
                  </table>

                  <div className="mt-2 border-t border-dashed border-black pt-2 text-right">
                      <p>Subtotal: <span>${subtotal.toFixed(2)}</span></p>
                      <p>IVA (16%): <span>${iva.toFixed(2)}</span></p>
                      <p className='font-bold text-[12px] mt-1'>TOTAL: <span>${total.toFixed(2)}</span></p>
                  </div>

                  {paymentMethod === 'Efectivo' && amountReceived && (
                     <div className="mt-2 border-t border-dashed border-black pt-2 text-right">
                          <p>Recibido: <span>${amountReceived.toFixed(2)}</span></p>
                          <p>Cambio: <span>${change.toFixed(2)}</span></p>
                     </div>
                  )}

                  <div className="my-4 flex justify-center">
                      <Barcode text={saleId} />
                  </div>
                  
                  <footer className="text-center space-y-1">
                      <p className='font-semibold'>{companyProfile?.receiptFooterMessage}</p>
                      <p>Este ticket es imprescindible para cualquier cambio o devolución.</p>
                  </footer>
              </div>
            )}
        </div>

        <DialogFooter className='pt-4 grid grid-cols-1 sm:grid-cols-1 gap-2 no-print'>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>Cerrar</Button>
            <div className="grid grid-cols-3 gap-2">
                <Button type="button" variant="secondary" onClick={handleShareOnWhatsApp} className="gap-2">
                    <WhatsAppIcon />
                    <span className='hidden sm:inline'>WhatsApp</span>
                </Button>
                <Button type="button" variant="secondary" onClick={handleShareAsImage} className="gap-2">
                    <Share2 className="h-4 w-4" />
                    <span className='hidden sm:inline'>Imagen</span>
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
