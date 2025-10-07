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
import { Minus, Plus } from 'lucide-react';
import type { Sale, SaleItem } from '../page';

interface ReturnDialogProps {
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
  sale: Sale;
  onProcessReturn: (returnedItems: { id: string; quantity: number }[]) => void;
}

export function ReturnDialog({ isOpen, onOpenChange, sale, onProcessReturn }: ReturnDialogProps) {
  const [itemsToReturn, setItemsToReturn] = useState<Record<string, number>>({});

  useEffect(() => {
    if (isOpen) {
      // Initialize quantities to 0 when dialog opens
      const initialQuantities = sale.items.reduce((acc, item) => {
        acc[item.id] = 0;
        return acc;
      }, {} as Record<string, number>);
      setItemsToReturn(initialQuantities);
    }
  }, [isOpen, sale]);
  
  const handleQuantityChange = (itemId: string, originalQuantity: number, amount: number) => {
    setItemsToReturn(prev => {
        const currentQuantity = prev[itemId] || 0;
        const newQuantity = currentQuantity + amount;
        if (newQuantity >= 0 && newQuantity <= originalQuantity) {
            return { ...prev, [itemId]: newQuantity };
        }
        return prev;
    });
  };

  const handleSubmit = () => {
    const returnedItems = Object.keys(itemsToReturn)
      .map(id => ({ id, quantity: itemsToReturn[id] }))
      .filter(item => item.quantity > 0);
      
    onProcessReturn(returnedItems);
  };
  
  const totalItemsToReturn = Object.values(itemsToReturn).reduce((sum, qty) => sum + qty, 0);

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>Procesar Devolución</DialogTitle>
          <DialogDescription>
            Selecciona la cantidad de cada producto a devolver para la venta <span className='font-bold'>{sale.saleId}</span>. El stock se reajustará automáticamente.
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-4 pt-4 max-h-[60vh] overflow-y-auto pr-2">
            {sale.items.map((item) => (
                <div key={item.id} className="flex items-center justify-between p-3 border rounded-md">
                    <div>
                        <p className="font-semibold">{item.name}</p>
                        <p className="text-sm text-muted-foreground">Vendido: {item.quantity} | Precio unitario: ${(item.price * (1 - (item.discount || 0)/100)).toFixed(2)}</p>
                    </div>
                    <div className="flex items-center gap-2">
                        <Label htmlFor={`return-${item.id}`} className='sr-only'>Cantidad a devolver</Label>
                        <div className="flex items-center gap-1">
                            <Button variant="outline" size="icon" className="h-8 w-8" onClick={() => handleQuantityChange(item.id, item.quantity, -1)}>
                                <Minus className="h-4 w-4" />
                            </Button>
                            <Input
                                id={`return-${item.id}`}
                                type="number"
                                readOnly
                                value={itemsToReturn[item.id] || 0}
                                className="w-16 h-8 text-center"
                            />
                            <Button variant="outline" size="icon" className="h-8 w-8" onClick={() => handleQuantityChange(item.id, item.quantity, 1)}>
                                <Plus className="h-4 w-4" />
                            </Button>
                        </div>
                    </div>
                </div>
            ))}
        </div>

        <DialogFooter className='mt-4'>
          <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>Cancelar</Button>
          <Button type="submit" onClick={handleSubmit} disabled={totalItemsToReturn === 0}>
            Confirmar Devolución ({totalItemsToReturn} {totalItemsToReturn === 1 ? 'producto' : 'productos'})
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
