'use client';

import { useState, useEffect } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { CreditCard, DollarSign, MonitorSmartphone } from 'lucide-react';
import { cn } from '@/lib/utils';

interface PaymentDialogProps {
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
  totalAmount: number;
  onPaymentSuccess: (paymentMethod: string) => void;
}

const terminals = [
    { id: 'clip', name: 'Clip' },
    { id: 'mercado-pago', name: 'Mercado Pago' },
    { id: 'sr-pago', name: 'Sr. Pago' },
];

export function PaymentDialog({ isOpen, onOpenChange, totalAmount, onPaymentSuccess }: PaymentDialogProps) {
  const [paymentMethod, setPaymentMethod] = useState<'cash' | 'card'>('cash');
  const [amountReceived, setAmountReceived] = useState<number | string>('');
  const [selectedTerminal, setSelectedTerminal] = useState<string>(terminals[0].id);

  const change = Number(amountReceived) - totalAmount;
  const isCashPaymentValid = paymentMethod === 'cash' && change >= 0;

  useEffect(() => {
    if (isOpen) {
      setAmountReceived('');
      setPaymentMethod('cash');
      setSelectedTerminal(terminals[0].id);
    }
  }, [isOpen]);

  const handleConfirmPayment = () => {
    onPaymentSuccess(paymentMethod);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Procesar Pago</DialogTitle>
        </DialogHeader>
        <div className="flex flex-col items-center justify-center p-4 border bg-muted/20 rounded-lg mb-4">
            <p className="text-sm text-muted-foreground">Total a Pagar</p>
            <p className="text-4xl font-bold">${totalAmount.toFixed(2)}</p>
        </div>

        <Tabs defaultValue="cash" onValueChange={(value) => setPaymentMethod(value as 'cash' | 'card')} className="w-full">
            <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="cash"><DollarSign className='h-4 w-4 mr-2'/>Efectivo</TabsTrigger>
                <TabsTrigger value="card"><CreditCard className='h-4 w-4 mr-2'/>Tarjeta</TabsTrigger>
            </TabsList>
            <TabsContent value="cash" className="mt-4 space-y-4">
                <div className="space-y-2">
                    <Label htmlFor="amount-received">Monto Recibido</Label>
                    <Input 
                        id="amount-received" 
                        type="number" 
                        placeholder="$0.00" 
                        value={amountReceived}
                        onChange={(e) => setAmountReceived(e.target.value)}
                        className="text-lg text-center font-bold"
                    />
                </div>
                {Number(amountReceived) > 0 && change >= 0 && (
                     <div className="flex flex-col items-center justify-center p-3 border bg-background rounded-lg">
                        <p className="text-sm text-muted-foreground">Cambio</p>
                        <p className="text-2xl font-bold text-primary">${change.toFixed(2)}</p>
                    </div>
                )}
            </TabsContent>
            <TabsContent value="card" className="mt-4">
                <RadioGroup defaultValue={selectedTerminal} onValueChange={setSelectedTerminal}>
                    <p className="mb-2 text-sm font-medium text-muted-foreground">Seleccionar Terminal</p>
                    <div className="space-y-2">
                        {terminals.map((terminal) => (
                             <Label key={terminal.id} htmlFor={terminal.id} className={cn("flex items-center gap-4 border p-4 rounded-lg cursor-pointer hover:bg-accent", { "border-primary bg-accent": selectedTerminal === terminal.id })}>
                                <RadioGroupItem value={terminal.id} id={terminal.id} />
                                <MonitorSmartphone className="h-6 w-6 text-muted-foreground"/>
                                <span className='font-semibold'>{terminal.name}</span>
                            </Label>
                        ))}
                    </div>
                </RadioGroup>
            </TabsContent>
        </Tabs>
        
        <DialogFooter className='mt-6'>
          <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>Cancelar</Button>
          <Button 
            type="submit" 
            onClick={handleConfirmPayment}
            disabled={paymentMethod === 'cash' ? !isCashPaymentValid : false}
          >
            Confirmar Pago
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
