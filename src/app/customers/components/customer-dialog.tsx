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

export type Customer = {
  id?: string;
  name: string;
  phone: string;
  email: string;
  address: string;
};

interface CustomerDialogProps {
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
  onSave: (customer: Omit<Customer, 'id'>) => void;
  customer: Customer | null;
}

const emptyCustomer: Omit<Customer, 'id'> = {
    name: '',
    phone: '',
    email: '',
    address: '',
};

export function CustomerDialog({ isOpen, onOpenChange, onSave, customer }: CustomerDialogProps) {
  const [formData, setFormData] = useState<Omit<Customer, 'id'>>(emptyCustomer);

  useEffect(() => {
    if (isOpen) {
        if (customer) {
            setFormData(customer);
        } else {
            setFormData(emptyCustomer);
        }
    }
  }, [customer, isOpen]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;
    setFormData(prev => ({ ...prev, [id]: value }));
  };

  const handleSubmit = () => {
    onSave(formData);
  };

  const title = customer ? 'Editar Cliente' : 'Agregar Cliente';
  const description = customer ? 'Modifica los detalles del cliente.' : 'Ingresa la información del nuevo cliente.';

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription>
            {description}
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-4 pt-4">
            <div className="space-y-2">
                <Label htmlFor="name">Nombre Completo</Label>
                <Input id="name" value={formData.name} onChange={handleChange} placeholder="Ej. Juan Pérez" />
            </div>
             <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                    <Label htmlFor="phone">Teléfono</Label>
                    <Input id="phone" value={formData.phone} onChange={handleChange} placeholder="Ej. 55 1234 5678" />
                </div>
                <div className="space-y-2">
                    <Label htmlFor="email">Correo Electrónico</Label>
                    <Input id="email" type="email" value={formData.email} onChange={handleChange} placeholder="Ej. juan.perez@correo.com" />
                </div>
            </div>
            <div className="space-y-2">
                <Label htmlFor="address">Dirección</Label>
                <Input id="address" value={formData.address} onChange={handleChange} placeholder="Ej. Av. Siempre Viva 742" />
            </div>
        </div>

        <DialogFooter className='mt-4'>
          <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>Cancelar</Button>
          <Button type="submit" onClick={handleSubmit}>Guardar Cliente</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
