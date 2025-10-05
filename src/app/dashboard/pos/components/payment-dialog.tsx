
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
import type { Product } from "@/lib/types"
import Receipt from "./receipt"

interface PaymentDialogProps {
  cart: Map<string, { product: Product; quantity: number }>;
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
     const printContent = receiptRef.current;
    if (printContent) {
      const originalContents = document.body.innerHTML;
      const printHtml = printContent.innerHTML;
      document.body.innerHTML = printHtml;
      window.print();
      document.body.innerHTML = originalContents;
      // Reload to restore styles and event handlers
      window.location.reload();
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
          <AlertDialogTitle>{paymentComplete ? "Payment Successful" : "Complete Payment"}</AlertDialogTitle>
          <AlertDialogDescription>
            {paymentComplete ? "Thank you for your purchase." : "Select payment method and enter amount received."}
          </AlertDialogDescription>
        </AlertDialogHeader>

        {paymentComplete ? (
          <div className="hidden">
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
