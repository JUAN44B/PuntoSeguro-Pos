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
import { Printer, Share2, Loader2, ChevronDown, ChevronUp } from 'lucide-react';
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
  const [isExpanded, setIsExpanded] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setLoadingProfile(true);
      setIsExpanded(false); // Reset to compact view
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
              size: 50mm auto;
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
        
        const printWindow = window.open('', '', 'height=600,width=400');
        
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
    let message = `*Ticket de Compra - ${companyProfile?.name || 'ALIRU'}*\n`;
    message += `Folio: ${saleId}\n`;
    message += `Fecha: ${new Date().toLocaleString('es-MX')}\n\n`;
    message += '*Resumen de Compra:*\n';

    saleData.cart.forEach(item => {
        const finalPrice = item.price * (1 - (item.discount || 0) / 100);
        message += `- ${item.quantity}x ${item.name} ($${(finalPrice * item.quantity).toFixed(2)})\n`;
    });

    message += `\n*Total: $${saleData.total.toFixed(2)}*\n`;
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

  const { cart, total, userName, amountReceived } = saleData;
  const subtotal = total / 1.16;
  const iva = total - subtotal;
  const change = amountReceived ? amountReceived - total : 0;

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-xs bg-slate-50">
        <DialogHeader>
          <DialogTitle>Venta Completada</DialogTitle>
        </DialogHeader>
        
        <div className="flex justify-center overflow-y-auto">
            {loadingProfile ? (
              <div className="h-96 flex items-center justify-center">
                <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
              </div>
            ) : (
              <div ref={receiptRef} className="bg-white p-4 text-black printable-receipt w-[300px]" style={{fontFamily: "'Courier New', Courier, monospace"}}>
                  <div className="text-center mb-4 flex flex-col items-center">
                      <Logo />
                      <p className='text-xs font-bold mt-2'>{companyProfile?.name || 'ALIRU Refacciones'}</p>
                      {isExpanded && (
                          <>
                            <p className='text-xs'>{companyProfile?.address || 'Av. Principal #123, 00000, Ciudad, Estado'}</p>
                            <p className='text-xs'>TLF: {companyProfile?.phone || '123 456 789'}</p>
                            <p className='text-xs'>{companyProfile?.email || 'contacto@aliru.com'}</p>
                            {companyProfile?.fiscalId && <p className='text-xs'>RFC: {companyProfile.fiscalId}</p>}
                          </>
                      )}
                  </div>

                  <div className="mb-4 text-xs space-y-1">
                      <p>Factura simplificada</p>
                      <p>Nº: {saleId}</p>
                      <p>Fecha: {new Date().toLocaleString('es-MX', { dateStyle: 'short', timeStyle: 'medium' })}</p>
                      <p>Forma de pago: {getPaymentMethodName(saleData.paymentMethod)}</p>
                  </div>

                  {isExpanded && (
                    <>
                        <div className="text-xs border-t-2 border-b-2 border-black border-dashed py-1">
                            <div className="flex justify-between font-bold">
                                <span>PRODUCTO</span>
                                <span>SUBTOTAL</span>
                            </div>
                        </div>

                        <div className="text-xs py-2 space-y-2">
                            {cart.map(item => {
                                const finalPrice = item.price * (1 - (item.discount || 0) / 100);
                                return (
                                <div key={item.id}>
                                    <div className="flex justify-between">
                                        <span className='break-all'>{item.name}</span>
                                        <span className='pl-2'>${(finalPrice * item.quantity).toFixed(2)}</span>
                                    </div>
                                    <div className='text-gray-600' style={{fontSize: '10px', paddingLeft: '4px'}}>
                                        {item.quantity} x ${finalPrice.toFixed(2)}
                                        {item.discount > 0 && <span className='ml-2'>(-{item.discount}%)</span>}
                                    </div>
                                    {item.discount > 0 &&
                                        <div className='text-gray-600' style={{fontSize: '10px', paddingLeft: '4px', textDecoration: 'line-through'}}>
                                            Precio original: ${item.price.toFixed(2)}
                                        </div>
                                    }
                                </div>
                            )})}
                        </div>
                         <div className="text-xs mt-2 border-t-2 border-dashed border-black pt-2">
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
                        </div>
                    </>
                  )}
                  
                  <div className="flex justify-between font-bold text-base mt-2 border-t border-black pt-1">
                      <span>TOTAL:</span>
                      <span>${total.toFixed(2)}</span>
                  </div>

                  {paymentMethod === 'Efectivo' && amountReceived && (
                     <div className="text-xs mt-2 border-t border-dashed border-black pt-2">
                      <div className="space-y-1">
                          <div className="flex justify-between">
                              <span>Monto Recibido:</span>
                              <span>${amountReceived.toFixed(2)}</span>
                          </div>
                          <div className="flex justify-between">
                              <span>Cambio:</span>
                              <span>${change.toFixed(2)}</span>
                          </div>
                      </div>
                  </div>
                  )}

                  {isExpanded && (
                    <div className="my-5 flex justify-center">
                        <Barcode text={saleId} />
                    </div>
                  )}
                  
                  <footer className="text-center text-xs space-y-2 mt-4">
                      <p>Fue atendido por: {userName}</p>
                      <p className='font-semibold'>{companyProfile?.receiptFooterMessage || '¡Gracias por su compra!'}</p>
                      {isExpanded && <p>Este ticket es imprescindible para cualquier cambio o devolución.</p>}
                  </footer>

                   <button onClick={() => setIsExpanded(!isExpanded)} className='no-print w-full flex items-center justify-center text-xs text-blue-600 mt-4 gap-1'>
                        {isExpanded ? 'Ocultar detalles' : 'Ver detalles'}
                        {isExpanded ? <ChevronUp className='h-3 w-3'/> : <ChevronDown className='h-3 w-3'/>}
                    </button>
              </div>
            )}
        </div>

        <DialogFooter className='pt-4 grid grid-cols-1 sm:grid-cols-1 gap-2 no-print'>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>Cerrar</Button>
            <div className="grid grid-cols-3 gap-2">
                <Button type="button" variant="secondary" onClick={handleShareOnWhatsApp} className="gap-2">
                    <WhatsAppIcon />
                    WhatsApp
                </Button>
                <Button type="button" variant="secondary" onClick={handleShareAsImage} className="gap-2">
                    <Share2 className="h-4 w-4" />
                    Imagen
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
