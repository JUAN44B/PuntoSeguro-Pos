
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
      const printWindow = window.open('', '', 'height=600,width=800');
      if (printWindow) {
        printWindow.document.write('<html><head><title>Print Receipt</title>');
        printWindow.document.write('<style>body { font-family: monospace; } table { width: 100%; border-collapse: collapse; } td, th { padding: 4px; } .text-center { text-align: center; } .font-bold { font-weight: bold; } .text-lg { font-size: 1.125rem; } .mb-4 { margin-bottom: 1rem; } .my-2 { margin-top: 0.5rem; margin-bottom: 0.5rem; } .py-2 { padding-top: 0.5rem; padding-bottom: 0.5rem; } .border-t { border-top: 1px dashed black; } .border-b { border-bottom: 1px dashed black; } .flex { display: flex; } .justify-between { justify-content: space-between; } .space-y-1 > * + * { margin-top: 0.25rem; } .mt-2 { margin-top: 0.5rem; } .pt-2 { padding-top: 0.5rem; } .mt-4 { margin-top: 1rem; } .pl-4 { padding-left: 1rem; } .text-xs { font-size: 0.75rem; } .text-base { font-size: 1rem; }</style>');
        printWindow.document.write('</head><body>');
        printWindow.document.write(printContent.innerHTML);
        printWindow.document.write('</body></html>');
        printWindow.document.close();
        printWindow.focus();
        printWindow.print();
        printWindow.close();
      }
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
            <div>
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
                <div className="p-4 bg-gray-100 rounded-md">
                     <p className="text-center">Sale completed. Ready for the next sale.</p>
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

    