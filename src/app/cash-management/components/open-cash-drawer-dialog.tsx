'use client';

import { useState, useEffect } from 'react';
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

interface OpenCashDrawerDialogProps {
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
  onConfirm: (initialAmount: number) => void;
}

export function OpenCashDrawerDialog({ isOpen, onOpenChange, onConfirm }: OpenCashDrawerDialogProps) {
  const [amount, setAmount] = useState('');

  useEffect(() => {
    if (isOpen) {
      setAmount('');
    }
  }, [isOpen]);

  const handleSubmit = () => {
    const initialAmount = parseFloat(amount);
    if (!isNaN(initialAmount) && initialAmount >= 0) {
      onConfirm(initialAmount);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Abrir Caja</DialogTitle>
          <DialogDescription>
            Ingresa el monto inicial o fondo de caja para empezar la jornada de ventas.
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-4 pt-4">
            <div className="space-y-2">
                <Label htmlFor="initial-amount">Fondo de Caja ($)</Label>
                <Input 
                    id="initial-amount" 
                    type="number" 
                    placeholder="Ej. 1500.00" 
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    className="text-lg h-12"
                />
            </div>
        </div>

        <DialogFooter className='mt-4'>
          <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>Cancelar</Button>
          <Button type="submit" onClick={handleSubmit} disabled={!amount || parseFloat(amount) < 0}>
            Confirmar y Abrir Caja
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
