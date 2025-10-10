
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

export type Supplier = {
  id?: string;
  name: string;
  contactName: string;
  phone: string;
  email: string;
  address: string;
  rfc: string;
};

interface SupplierDialogProps {
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
  onSave: (supplier: Omit<Supplier, 'id'>) => void;
  supplier: Supplier | null;
}

const emptySupplier: Omit<Supplier, 'id'> = {
    name: '',
    contactName: '',
    phone: '',
    email: '',
    address: '',
    rfc: '',
};

export function SupplierDialog({ isOpen, onOpenChange, onSave, supplier }: SupplierDialogProps) {
  const [formData, setFormData] = useState<Omit<Supplier, 'id'>>(emptySupplier);

  useEffect(() => {
    if (isOpen) {
        if (supplier) {
            setFormData(supplier);
        } else {
            setFormData(emptySupplier);
        }
    }
  }, [supplier, isOpen]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;
    setFormData(prev => ({ ...prev, [id]: value }));
  };

  const handleSubmit = () => {
    onSave(formData);
  };

  const title = supplier ? 'Editar Proveedor' : 'Agregar Proveedor';
  const description = supplier ? 'Modifica la información de contacto y fiscal del proveedor.' : 'Ingresa los datos del nuevo proveedor.';

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription>
            {description}
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-4 pt-4 max-h-[60vh] overflow-y-auto pr-2">
            <div className="space-y-2">
                <Label htmlFor="name">Nombre o Razón Social</Label>
                <Input id="name" value={formData.name} onChange={handleChange} placeholder="Ej. Refacciones del Norte S.A. de C.V." />
            </div>
            <div className="space-y-2">
                <Label htmlFor="rfc">RFC</Label>
                <Input id="rfc" value={formData.rfc} onChange={handleChange} placeholder="Ej. RNA010203XYZ" />
            </div>
            <div className='p-4 border rounded-md space-y-4 bg-muted/20'>
                <h4 className='font-medium text-sm text-muted-foreground'>Información de Contacto</h4>
                <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                        <Label htmlFor="contactName">Nombre del Contacto</Label>
                        <Input id="contactName" value={formData.contactName} onChange={handleChange} placeholder="Ej. Juan Pérez" />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="phone">Teléfono</Label>
                        <Input id="phone" value={formData.phone} onChange={handleChange} placeholder="Ej. 55 1234 5678" />
                    </div>
                </div>
                 <div className="space-y-2">
                    <Label htmlFor="email">Correo Electrónico</Label>
                    <Input id="email" type="email" value={formData.email} onChange={handleChange} placeholder="Ej. ventas@proveedor.com" />
                </div>
                <div className="space-y-2">
                    <Label htmlFor="address">Dirección</Label>
                    <Input id="address" value={formData.address} onChange={handleChange} placeholder="Ej. Av. Industrial 100, Parque Industrial" />
                </div>
             </div>
        </div>

        <DialogFooter className='mt-4'>
          <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>Cancelar</Button>
          <Button type="submit" onClick={handleSubmit}>Guardar Proveedor</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
