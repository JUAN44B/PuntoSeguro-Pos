
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
import { Textarea } from "@/components/ui/textarea"
import { useToast } from "@/hooks/use-toast"
import type { Supplier } from "@/lib/types"

interface AddSupplierDialogProps {
  children: React.ReactNode;
  onSupplierAdd: (supplier: Supplier) => void;
}

const initialFormData: Partial<Supplier> = {
  id: '',
  name: '',
  rfc: '',
  contactName: '',
  email: '',
  phone: '',
  address: '',
};

export default function AddSupplierDialog({ children, onSupplierAdd }: AddSupplierDialogProps) {
  const [open, setOpen] = React.useState(false)
  const [formData, setFormData] = React.useState<Partial<Supplier>>(initialFormData);
  const { toast } = useToast()

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { id, value } = e.target;
    setFormData(prev => ({ ...prev, [id]: value }));
  };
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.name || !formData.id) {
        toast({
            variant: "destructive",
            title: "Información Faltante",
            description: "El Nombre y el ID del proveedor son requeridos.",
        });
        return;
    }
    
    const newSupplier: Supplier = {
      id: formData.id || `SUP${Math.floor(Math.random() * 1000)}`,
      name: formData.name || "Proveedor sin nombre",
      rfc: formData.rfc || "",
      contactName: formData.contactName || "",
      email: formData.email || "",
      phone: formData.phone || "",
      address: formData.address || "",
    };

    onSupplierAdd(newSupplier);
    setOpen(false); // Close the dialog
    setFormData(initialFormData); // Reset form
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {children}
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Agregar Nuevo Proveedor</DialogTitle>
          <DialogDescription>
            Completa los detalles para registrar un nuevo proveedor.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="grid gap-4 py-4 max-h-[70vh] overflow-y-auto pr-6">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="name" className="text-right">Nombre</Label>
            <Input id="name" value={formData.name} onChange={handleChange} className="col-span-3" />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="id" className="text-right">ID</Label>
            <Input id="id" value={formData.id} onChange={handleChange} className="col-span-3" />
          </div>
           <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="rfc" className="text-right">RFC</Label>
            <Input id="rfc" value={formData.rfc} onChange={handleChange} className="col-span-3" />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="contactName" className="text-right">Contacto</Label>
            <Input id="contactName" value={formData.contactName} onChange={handleChange} className="col-span-3" />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="email" className="text-right">Email</Label>
            <Input id="email" type="email" value={formData.email} onChange={handleChange} className="col-span-3" />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="phone" className="text-right">Teléfono</Label>
            <Input id="phone" type="tel" value={formData.phone} onChange={handleChange} className="col-span-3" />
          </div>
           <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="address" className="text-right">Dirección</Label>
            <Textarea id="address" value={formData.address} onChange={handleChange} className="col-span-3" />
          </div>
          <DialogFooter>
            <Button type="submit">Guardar Proveedor</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}

