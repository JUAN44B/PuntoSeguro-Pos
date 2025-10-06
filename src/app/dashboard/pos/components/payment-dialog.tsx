
"use client"

import * as React from "react"
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
            {paymentComplete ? "Gracias por su compra. La venta ha sido registrada." : "Seleccione el método de pago e ingrese el monto recibido."}
          </AlertDialogDescription>
        </AlertDialogHeader>

        {paymentComplete ? (
            <div>
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
            <div className="flex justify-end w-full">
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
