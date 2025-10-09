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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

export type Customer = {
  id?: string;
  name: string;
  phone: string;
  email: string;
  address: string;
  rfc: string;
  postalCode: string;
  cfdiUse: string;
  taxRegime: string;
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
    rfc: '',
    postalCode: '',
    cfdiUse: '',
    taxRegime: '',
};

const cfdiUses = [
    { value: 'G01', label: 'G01 - Adquisición de mercancías' },
    { value: 'G03', label: 'G03 - Gastos en general' },
    { value: 'I08', label: 'I08 - Otra maquinaria y equipo' },
    { value: 'P01', label: 'P01 - Por definir' },
];

const taxRegimes = [
    { value: '601', label: '601 - General de Ley Personas Morales' },
    { value: '612', label: '612 - Personas Físicas con Actividades Empresariales y Profesionales' },
    { value: '621', label: '621 - Incorporación Fiscal' },
    { value: '626', label: '626 - Régimen Simplificado de Confianza' },
];

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

  const handleSelectChange = (id: keyof Omit<Customer, 'id'>, value: string) => {
    setFormData(prev => ({...prev, [id]: value}));
  }

  const handleSubmit = () => {
    onSave(formData);
  };

  const title = customer ? 'Editar Cliente' : 'Agregar Cliente';
  const description = customer ? 'Modifica los detalles y datos fiscales del cliente.' : 'Ingresa la información del nuevo cliente.';

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
                <Label htmlFor="name">Nombre Completo o Razón Social</Label>
                <Input id="name" value={formData.name} onChange={handleChange} placeholder="Ej. Juan Pérez o Mi Empresa S.A. de C.V." />
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
             <div className='p-4 border rounded-md space-y-4 bg-muted/20'>
                <h4 className='font-medium text-sm text-muted-foreground'>Información Fiscal (para facturas)</h4>
                <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                        <Label htmlFor="rfc">RFC</Label>
                        <Input id="rfc" value={formData.rfc} onChange={handleChange} placeholder="Ej. XAXX010101000" />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="postalCode">Código Postal</Label>
                        <Input id="postalCode" value={formData.postalCode} onChange={handleChange} placeholder="Ej. 06500" />
                    </div>
                </div>
                 <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                        <Label htmlFor="cfdiUse">Uso del CFDI</Label>
                        <Select value={formData.cfdiUse} onValueChange={(value) => handleSelectChange('cfdiUse', value)}>
                            <SelectTrigger id="cfdiUse">
                                <SelectValue placeholder="Seleccionar..." />
                            </SelectTrigger>
                            <SelectContent>
                                {cfdiUses.map(option => (
                                    <SelectItem key={option.value} value={option.value}>{option.label}</SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="taxRegime">Régimen Fiscal</Label>
                         <Select value={formData.taxRegime} onValueChange={(value) => handleSelectChange('taxRegime', value)}>
                            <SelectTrigger id="taxRegime">
                                <SelectValue placeholder="Seleccionar..." />
                            </SelectTrigger>
                            <SelectContent>
                                {taxRegimes.map(option => (
                                    <SelectItem key={option.value} value={option.value}>{option.label}</SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>
                </div>
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
