'use client';

import { useState, useEffect, useMemo } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { cn } from '@/lib/utils';

interface CloseCashDrawerDialogProps {
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
  onConfirm: (countedAmount: number) => void;
  expectedAmount: number;
}

export function CloseCashDrawerDialog({ isOpen, onOpenChange, onConfirm, expectedAmount }: CloseCashDrawerDialogProps) {
  const [countedAmount, setCountedAmount] = useState('');

  const difference = useMemo(() => {
    const counted = parseFloat(countedAmount);
    if (isNaN(counted)) return 0;
    return counted - expectedAmount;
  }, [countedAmount, expectedAmount]);

  useEffect(() => {
    if (isOpen) {
      setCountedAmount('');
    }
  }, [isOpen]);

  const handleSubmit = () => {
    const finalAmount = parseFloat(countedAmount);
    if (!isNaN(finalAmount) && finalAmount >= 0) {
      onConfirm(finalAmount);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Cerrar Caja (Corte)</DialogTitle>
          <DialogDescription>
            Realiza el conteo del efectivo en caja y regístralo para finalizar la sesión.
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-4 pt-4">
            <div className="p-4 border rounded-lg bg-muted/30">
                <p className="text-sm text-muted-foreground">Monto esperado en caja</p>
                <p className="text-2xl font-bold">${expectedAmount.toFixed(2)}</p>
            </div>
            <div className="space-y-2">
                <Label htmlFor="counted-amount">Monto Contado en Caja ($)</Label>
                <Input 
                    id="counted-amount" 
                    type="number" 
                    placeholder="Ingresa el total contado..." 
                    value={countedAmount}
                    onChange={(e) => setCountedAmount(e.target.value)}
                    className="text-lg h-12"
                />
            </div>
            {countedAmount && (
                <div className={cn(
                    "p-4 border rounded-lg text-center",
                    difference === 0 && "bg-green-100 dark:bg-green-900/30",
                    difference > 0 && "bg-yellow-100 dark:bg-yellow-900/30",
                    difference < 0 && "bg-red-100 dark:bg-red-900/30",
                )}>
                    <p className="text-sm font-medium">Diferencia</p>
                    <p className={cn("text-2xl font-bold",
                       difference === 0 && "text-green-700 dark:text-green-400",
                       difference > 0 && "text-yellow-700 dark:text-yellow-400",
                       difference < 0 && "text-destructive",
                    )}>
                        {difference.toFixed(2)}
                    </p>
                    <p className="text-xs text-muted-foreground">
                        {difference === 0 ? "¡Corte exacto!" : (difference > 0 ? "Sobrante" : "Faltante")}
                    </p>
                </div>
            )}
        </div>

        <DialogFooter className='mt-4'>
          <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>Cancelar</Button>
          <Button type="submit" onClick={handleSubmit} disabled={!countedAmount || parseFloat(countedAmount) < 0}>
            Finalizar Corte y Cerrar Caja
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
