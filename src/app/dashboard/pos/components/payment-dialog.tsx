
"use client"

import * as React from "react"
import jsPDF from "jspdf"
import html2canvas from "html2canvas"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { cn } from "@/lib/utils"
import type { Product } from "@/lib/types"
import Receipt from "./receipt"
import WhatsAppIcon from "./whatsapp-icon"
import { useToast } from "@/hooks/use-toast"

type CartItem = {
    product: Product;
    quantity: number;
    discount: number;
};

interface PaymentDialogProps {
  cart: Map<string, CartItem>;
  subtotal: number;
  tax: number;
  total: number
  onPaymentSuccess: () => void
  children: React.ReactNode
}

export default function PaymentDialog({ total, subtotal, tax, cart, onPaymentSuccess, children }: PaymentDialogProps) {
  const [open, setOpen] = React.useState(false)
  const [amountReceived, setAmountReceived] = React.useState("")
  const [paymentMethod, setPaymentMethod] = React.useState<"cash" | "card">("cash")
  const [paymentComplete, setPaymentComplete] = React.useState(false)
  const receiptRef = React.useRef<HTMLDivElement>(null);
  const { toast } = useToast();


  const numpadKeys = ["1", "2", "3", "4", "5", "6", "7", "8", "9", ".", "0", "C"]

  const handleNumpadClick = (key: string) => {
    if (key === "C") {
      setAmountReceived("")
    } else {
      setAmountReceived((prev) => prev + key)
    }
  }

  const received = parseFloat(amountReceived) || 0
  const change = paymentMethod === 'cash' && received > total ? received - total : 0

  const handleConfirmPayment = () => {
    setPaymentComplete(true)
  }

  const handleNewSale = () => {
    onPaymentSuccess()
    resetState()
  }

  const generatePdf = async () => {
    const receiptElement = receiptRef.current;
    if (!receiptElement) return null;
    
    // We need to temporarily make the receipt visible to capture it
    receiptElement.style.display = 'block';
    const canvas = await html2canvas(receiptElement, { scale: 2 });
    receiptElement.style.display = 'none';

    const imgData = canvas.toDataURL('image/jpeg', 0.95);
    
    // Standard receipt paper width is around 80mm
    const pdf = new jsPDF({
      orientation: 'portrait',
      unit: 'mm',
      format: [canvas.height * 80 / canvas.width, 80]
    });
    
    pdf.addImage(imgData, 'JPEG', 0, 0, pdf.internal.pageSize.getWidth(), pdf.internal.pageSize.getHeight());
    return pdf.output('blob');
  };

  const handleSendWhatsApp = async () => {
    const pdfBlob = await generatePdf();
    if (!pdfBlob) {
        toast({ variant: 'destructive', title: "Error", description: "No se pudo generar el recibo PDF." });
        return;
    }

    const pdfFile = new File([pdfBlob], `recibo-aliru-${new Date().getTime()}.pdf`, { type: 'application/pdf' });

    if (navigator.share) {
        try {
            await navigator.share({
                title: 'Recibo de Compra - ALIRU',
                text: 'Aquí está tu recibo de compra de ALIRU Refacciones.',
                files: [pdfFile]
            });
        } catch (error) {
            console.error('Error al compartir:', error);
            toast({ variant: 'destructive', title: "Error", description: "No se pudo compartir el recibo." });
        }
    } else {
         toast({ variant: 'destructive', title: "No Soportado", description: "La función de compartir no está disponible en este navegador." });
    }
  }

  const handlePrintReceipt = async () => {
    const pdfBlob = await generatePdf();
     if (!pdfBlob) {
        toast({ variant: 'destructive', title: "Error", description: "No se pudo generar el recibo PDF." });
        return;
    }
    const pdfUrl = URL.createObjectURL(pdfBlob);
    const printWindow = window.open(pdfUrl);
    if (printWindow) {
        printWindow.onload = () => {
            printWindow.print();
        };
    } else {
        toast({ variant: 'destructive', title: "Error de Impresión", description: "No se pudo abrir la ventana de impresión. Revisa si tu navegador bloquea las ventanas emergentes." });
    }
  }
  
  const resetState = () => {
    setAmountReceived("")
    setPaymentMethod("cash")
    setPaymentComplete(false)
    setOpen(false)
  }


  return (
    <AlertDialog open={open} onOpenChange={setOpen}>
      <AlertDialogTrigger asChild>
        {children}
      </AlertDialogTrigger>
      <AlertDialogContent className="max-w-2xl">
        <AlertDialogHeader>
          <AlertDialogTitle>{paymentComplete ? "Pago Exitoso" : "Completar Pago"}</AlertDialogTitle>
          <AlertDialogDescription>
            {paymentComplete ? "Gracias por su compra. Seleccione una opción para el recibo." : "Seleccione el método de pago e ingrese el monto recibido."}
          </AlertDialogDescription>
        </AlertDialogHeader>

        {paymentComplete ? (
            <div>
                 <div style={{ display: 'none' }}>
                    <Receipt 
                    ref={receiptRef}
                    items={cart}
                    total={total}
                    subtotal={subtotal}
                    tax={tax}
                    paymentMethod={paymentMethod}
                    amountReceived={received}
                    change={change}
                    />
                </div>
                <div className="p-4 bg-gray-100 rounded-md">
                     <p className="text-center">Venta completada. Listo para la siguiente venta.</p>
                </div>
            </div>
        ) : (
             <div className="grid grid-cols-2 gap-8">
                <div className="space-y-6">
                    <div>
                        <div className="flex justify-between text-2xl font-bold text-primary">
                            <span>Total</span>
                            <span>${total.toFixed(2)}</span>
                        </div>
                        {paymentMethod === 'cash' && (
                            <>
                                <div className="flex justify-between mt-4 text-lg">
                                    <span>Monto Recibido</span>
                                    <span>${received.toFixed(2)}</span>
                                </div>
                                <div className="flex justify-between mt-2 font-semibold text-lg text-green-600">
                                    <span>Cambio</span>
                                    <span>${change.toFixed(2)}</span>
                                </div>
                            </>
                        )}
                    </div>
                     <div className="space-y-2">
                        <Label>Método de Pago</Label>
                        <div className="grid grid-cols-2 gap-2">
                            <Button variant={paymentMethod === 'cash' ? 'default' : 'outline'} onClick={() => setPaymentMethod('cash')}>Efectivo</Button>
                            <Button variant={paymentMethod === 'card' ? 'default' : 'outline'} onClick={() => setPaymentMethod('card')}>Tarjeta</Button>
                        </div>
                    </div>
                </div>
                <div className="space-y-4">
                    <Input 
                        type="text"
                        placeholder="Ingresar monto recibido"
                        value={amountReceived}
                        onChange={(e) => setAmountReceived(e.target.value)}
                        className="text-right text-lg h-12"
                        readOnly
                    />
                    <div className="grid grid-cols-3 gap-2">
                        {numpadKeys.map(key => (
                            <Button 
                                key={key}
                                variant="outline"
                                className={cn("h-12 text-xl", key === 'C' && 'col-span-1 bg-destructive/80 text-white hover:bg-destructive hover:text-white')}
                                onClick={() => handleNumpadClick(key)}
                            >
                                {key}
                            </Button>
                        ))}
                    </div>
                </div>
            </div>
        )}

        <AlertDialogFooter>
          {paymentComplete ? (
            <div className="flex justify-between w-full">
                <div className="flex gap-2">
                    <Button variant="outline" onClick={handlePrintReceipt}>Imprimir Recibo</Button>
                    <Button variant="outline" className="bg-green-500 hover:bg-green-600 text-white hover:text-white" onClick={handleSendWhatsApp}>
                        <WhatsAppIcon className="h-5 w-5 mr-2"/>
                        Compartir Recibo
                    </Button>
                </div>
                <Button onClick={handleNewSale}>Nueva Venta</Button>
            </div>
          ) : (
            <>
                <AlertDialogCancel onClick={resetState}>Cancelar</Button>
                <Button 
                    onClick={handleConfirmPayment} 
                    disabled={paymentMethod === 'cash' && received < total}
                >
                    Confirmar Pago
                </Button>
            </>
          )}
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}
