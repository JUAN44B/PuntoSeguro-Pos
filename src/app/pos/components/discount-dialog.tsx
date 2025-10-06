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

interface DiscountDialogProps {
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
  onSave: (discount: number) => void;
  initialDiscount: number;
  productName: string;
}

export function DiscountDialog({ isOpen, onOpenChange, onSave, initialDiscount, productName }: DiscountDialogProps) {
  const [discount, setDiscount] = useState(0);

  useEffect(() => {
    if (isOpen) {
      setDiscount(initialDiscount);
    }
  }, [isOpen, initialDiscount]);

  const handleSubmit = () => {
    onSave(discount);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-xs">
        <DialogHeader>
          <DialogTitle>Aplicar Descuento</DialogTitle>
          <DialogDescription>
            Ingresa el porcentaje de descuento para <span className="font-semibold">{productName}</span>.
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-4 pt-4">
            <div className="space-y-2">
                <Label htmlFor="discount">Descuento (%)</Label>
                <Input 
                    id="discount" 
                    type="number"
                    value={discount}
                    onChange={(e) => setDiscount(Number(e.target.value))}
                    placeholder="0" 
                    min="0"
                    max="100"
                />
            </div>
        </div>

        <DialogFooter className='mt-4'>
          <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>Cancelar</Button>
          <Button type="submit" onClick={handleSubmit}>Aplicar</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
