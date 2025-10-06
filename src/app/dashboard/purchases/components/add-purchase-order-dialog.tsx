
"use client"

import * as React from "react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { useToast } from "@/hooks/use-toast"
import type { PurchaseOrder } from "@/lib/types"
import { suppliers } from "@/lib/data"

interface AddPurchaseOrderDialogProps {
  children: React.ReactNode;
  onPurchaseOrderAdd: (order: PurchaseOrder) => void;
}

const initialFormData: Partial<PurchaseOrder> = {
  id: '',
  supplierName: '',
  date: new Date().toISOString().split('T')[0],
  total: 0,
  status: 'Pendiente',
};

export default function AddPurchaseOrderDialog({ children, onPurchaseOrderAdd }: AddPurchaseOrderDialogProps) {
  const [open, setOpen] = React.useState(false)
  const [formData, setFormData] = React.useState<Partial<PurchaseOrder>>(initialFormData);
  const { toast } = useToast()

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;
    setFormData(prev => ({ ...prev, [id]: value }));
  };

  const handleNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;
    setFormData(prev => ({ ...prev, [id]: parseFloat(value) || 0 }));
  };

  const handleSelectChange = (id: string, value: string) => {
    setFormData(prev => ({ ...prev, [id]: value }));
  };
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.id || !formData.supplierName) {
        toast({
            variant: "destructive",
            title: "Información Faltante",
            description: "El ID de la orden y el proveedor son requeridos.",
        });
        return;
    }
    
    const newOrder: PurchaseOrder = {
      id: formData.id,
      supplierName: formData.supplierName,
      date: formData.date || new Date().toISOString().split('T')[0],
      total: formData.total || 0,
      status: formData.status || 'Pendiente',
    };

    onPurchaseOrderAdd(newOrder);
    setOpen(false);
    setFormData(initialFormData);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {children}
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Nueva Orden de Compra</DialogTitle>
          <DialogDescription>
            Completa los detalles para crear una nueva orden de compra.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="id" className="text-right">ID Orden</Label>
            <Input id="id" value={formData.id} onChange={handleChange} className="col-span-3" />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="supplierName" className="text-right">Proveedor</Label>
            <Select onValueChange={(value) => handleSelectChange('supplierName', value)} value={formData.supplierName}>
              <SelectTrigger className="col-span-3">
                <SelectValue placeholder="Selecciona un proveedor" />
              </SelectTrigger>
              <SelectContent>
                {suppliers.map(s => (
                    <SelectItem key={s.id} value={s.name}>{s.name}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="date" className="text-right">Fecha</Label>
            <Input id="date" type="date" value={formData.date} onChange={handleChange} className="col-span-3" />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="total" className="text-right">Monto</Label>
            <Input id="total" type="number" value={formData.total} onChange={handleNumberChange} className="col-span-3" />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="status" className="text-right">Estado</Label>
            <Select onValueChange={(value) => handleSelectChange('status', value)} value={formData.status}>
              <SelectTrigger className="col-span-3">
                <SelectValue placeholder="Selecciona un estado" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Pendiente">Pendiente</SelectItem>
                <SelectItem value="Recibido">Recibido</SelectItem>
                <SelectItem value="Cancelado">Cancelado</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <DialogFooter>
            <Button type="submit">Guardar Orden</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
