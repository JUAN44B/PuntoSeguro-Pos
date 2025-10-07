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
import { useFirestore } from '@/firebase';
import { doc, getDoc } from 'firebase/firestore';

interface ReceiptDialogProps {
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
  saleData: {
    cart: CartItem[];
    total: number;
    paymentMethod: string;
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

export function ReceiptDialog({ isOpen, onOpenChange, saleData, saleIdFromProps }: ReceiptDialogProps) {
  const receiptRef = useRef<HTMLDivElement>(null);
  const saleId = saleIdFromProps || `ALIRU-${Date.now().toString().slice(-6)}`;
  const firestore = useFirestore();
  const [companyProfile, setCompanyProfile] = useState<CompanyProfile | null>(null);
  const [loadingProfile, setLoadingProfile] = useState(true);

  useEffect(() => {
    if (isOpen) {
      const fetchCompanyProfile = async () => {
        try {
          setLoadingProfile(true);
          const docRef = doc(firestore, 'company', 'main');
          const docSnap = await getDoc(docRef);
          if (docSnap.exists()) {
            setCompanyProfile(docSnap.data() as CompanyProfile);
          } else {
            setCompanyProfile({}); // No profile found, use defaults
          }
        } catch (error) {
          console.error("Error fetching company profile:", error);
          setCompanyProfile({});
        } finally {
          setLoadingProfile(false);
        }
      };
      fetchCompanyProfile();
    }
  }, [isOpen, firestore]);

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
  
  const getPaymentMethodName = (method: string) => {
    return method;
  }

  const { cart, total } = saleData;
  const subtotal = total / 1.16;
  const iva = total - subtotal;

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
                      <p className='text-xs'>{companyProfile?.address || 'Av. Principal #123, 00000, Ciudad, Estado'}</p>
                      <p className='text-xs'>TLF: {companyProfile?.phone || '123 456 789'}</p>
                      <p className='text-xs'>{companyProfile?.email || 'contacto@aliru.com'}</p>
                      {companyProfile?.fiscalId && <p className='text-xs'>RFC: {companyProfile.fiscalId}</p>}
                  </div>

                  <div className="mb-4 text-xs space-y-1">
                      <p>Factura simplificada</p>
                      <p>Nº: {saleId}</p>
                      <p>Fecha: {new Date().toLocaleString('es-MX', { dateStyle: 'short', timeStyle: 'medium' })}</p>
                      <p>Forma de pago: {getPaymentMethodName(saleData.paymentMethod)}</p>
                  </div>

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
                      <p className='font-semibold'>{companyProfile?.receiptFooterMessage || '¡Gracias por su compra!'}</p>
                      <p>Este ticket es imprescindible para cualquier cambio o devolución.</p>
                  </footer>
              </div>
            )}
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
