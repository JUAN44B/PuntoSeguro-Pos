
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
import { Button, buttonVariants } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { cn } from "@/lib/utils"

interface PaymentDialogProps {
  total: number
  onPaymentSuccess: () => void
  children: React.ReactNode
}

export default function PaymentDialog({ total, onPaymentSuccess, children }: PaymentDialogProps) {
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
    // In a real app, you would process the payment here
    setPaymentComplete(true)
  }

  const handleNewSale = () => {
    onPaymentSuccess()
    resetState()
  }

  const handlePrintReceipt = () => {
    window.print()
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
        <style>{`
          @media print {
            body * {
              visibility: hidden;
            }
            #receipt-section, #receipt-section * {
              visibility: visible;
            }
            #receipt-section {
              position: absolute;
              left: 0;
              top: 0;
              width: 100%;
            }
          }
        `}</style>
        <AlertDialogHeader>
          <AlertDialogTitle>{paymentComplete ? "Payment Successful" : "Complete Payment"}</AlertDialogTitle>
          <AlertDialogDescription>
            {paymentComplete ? "Thank you for your purchase." : "Select payment method and enter amount received."}
          </AlertDialogDescription>
        </AlertDialogHeader>

        {paymentComplete ? (
           <div id="receipt-section" className="space-y-4 my-4 p-4 border rounded-lg bg-background">
             <h3 className="text-lg font-semibold text-center">PuntoSeguro POS</h3>
             <p className="text-center text-sm">Av. Principal 123, Ciudad</p>
             <p className="text-center text-sm mb-4">Fecha: {new Date().toLocaleString()}</p>
             <div className="border-t border-b py-2 my-2 space-y-1">
                <div className="flex justify-between"><span>Total:</span> <span>${total.toFixed(2)}</span></div>
                <div className="flex justify-between"><span>Amount Received ({paymentMethod}):</span> <span>${received.toFixed(2)}</span></div>
                <div className="flex justify-between font-bold"><span>Change:</span> <span>${change.toFixed(2)}</span></div>
             </div>
             <p className="text-center text-xs mt-4">Gracias por su compra!</p>
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
                                    <span>Amount Received</span>
                                    <span>${received.toFixed(2)}</span>
                                </div>
                                <div className="flex justify-between mt-2 font-semibold text-lg text-green-600">
                                    <span>Change</span>
                                    <span>${change.toFixed(2)}</span>
                                </div>
                            </>
                        )}
                    </div>
                     <div className="space-y-2">
                        <Label>Payment Method</Label>
                        <div className="grid grid-cols-2 gap-2">
                            <Button variant={paymentMethod === 'cash' ? 'default' : 'outline'} onClick={() => setPaymentMethod('cash')}>Cash</Button>
                            <Button variant={paymentMethod === 'card' ? 'default' : 'outline'} onClick={() => setPaymentMethod('card')}>Card</Button>
                        </div>
                    </div>
                </div>
                <div className="space-y-4">
                    <Input 
                        type="text"
                        placeholder="Enter amount received"
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
            <>
                <Button variant="outline" onClick={handlePrintReceipt}>Print Receipt</Button>
                <Button onClick={handleNewSale}>New Sale</Button>
            </>
          ) : (
            <>
                <AlertDialogCancel onClick={resetState}>Cancel</AlertDialogCancel>
                <Button 
                    onClick={handleConfirmPayment} 
                    disabled={paymentMethod === 'cash' && received < total}
                >
                    Confirm Payment
                </Button>
            </>
          )}
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}
