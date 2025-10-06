
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
import type { Customer } from "@/lib/types"

interface AddCustomerDialogProps {
  children: React.ReactNode;
  onCustomerAdd: (customer: Customer) => void;
}

const initialFormData: Partial<Customer> = {
  id: '',
  name: '',
  rfc: '',
  email: '',
  phone: '',
  address: '',
  type: 'Menudeo',
};

export default function AddCustomerDialog({ children, onCustomerAdd }: AddCustomerDialogProps) {
  const [open, setOpen] = React.useState(false)
  const [formData, setFormData] = React.useState<Partial<Customer>>(initialFormData);
  const { toast } = useToast()

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;
    setFormData(prev => ({ ...prev, [id]: value }));
  };

  const handleTypeChange = (value: 'Frecuente' | 'Mayoreo' | 'Menudeo') => {
    setFormData(prev => ({ ...prev, type: value }));
  };
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.name || !formData.email) {
        toast({
            variant: "destructive",
            title: "Información Faltante",
            description: "El nombre y el email del cliente son requeridos.",
        });
        return;
    }
    
    const newCustomer: Customer = {
      id: formData.id || `CUST${Math.floor(Math.random() * 1000)}`,
      name: formData.name,
      email: formData.email,
      rfc: formData.rfc || '',
      phone: formData.phone || '',
      address: formData.address || '',
      type: formData.type || 'Menudeo',
    };

    onCustomerAdd(newCustomer);
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
          <DialogTitle>Agregar Nuevo Cliente</DialogTitle>
          <DialogDescription>
            Completa los detalles para registrar un nuevo cliente.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="name" className="text-right">Nombre</Label>
            <Input id="name" value={formData.name} onChange={handleChange} className="col-span-3" />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="email" className="text-right">Email</Label>
            <Input id="email" type="email" value={formData.email} onChange={handleChange} className="col-span-3" />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="rfc" className="text-right">RFC</Label>
            <Input id="rfc" value={formData.rfc} onChange={handleChange} className="col-span-3" />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="phone" className="text-right">Teléfono</Label>
            <Input id="phone" value={formData.phone} onChange={handleChange} className="col-span-3" />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="address" className="text-right">Dirección</Label>
            <Input id="address" value={formData.address} onChange={handleChange} className="col-span-3" />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="type" className="text-right">Tipo</Label>
            <Select onValueChange={handleTypeChange} defaultValue={formData.type}>
              <SelectTrigger className="col-span-3">
                <SelectValue placeholder="Selecciona un tipo" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Frecuente">Frecuente</SelectItem>
                <SelectItem value="Mayoreo">Mayoreo</SelectItem>
                <SelectItem value="Menudeo">Menudeo</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <DialogFooter>
            <Button type="submit">Guardar Cliente</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
