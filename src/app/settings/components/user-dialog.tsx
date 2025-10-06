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
import type { UserProfile } from '../page';

export type UserProfileData = {
    displayName: string;
    email: string;
    password?: string;
    role: 'Administrador' | 'Cajero' | 'Supervisor';
};

interface UserDialogProps {
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
  onSave: (userData: UserProfileData) => void;
  user: UserProfile | null;
}

const emptyUser: UserProfileData = {
    displayName: '',
    email: '',
    password: '',
    role: 'Cajero',
};

export function UserDialog({ isOpen, onOpenChange, onSave, user }: UserDialogProps) {
  const [formData, setFormData] = useState<UserProfileData>(emptyUser);
  const isEditing = !!user;

  useEffect(() => {
    if (isOpen) {
        if (user) {
            setFormData({
                displayName: user.displayName,
                email: user.email,
                role: user.role,
            });
        } else {
            setFormData(emptyUser);
        }
    }
  }, [user, isOpen]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;
    setFormData(prev => ({ ...prev, [id]: value }));
  };

  const handleRoleChange = (value: UserProfileData['role']) => {
    setFormData(prev => ({ ...prev, role: value }));
  };

  const handleSubmit = () => {
    onSave(formData);
  };

  const title = isEditing ? 'Editar Usuario' : 'Agregar Nuevo Usuario';
  const description = isEditing ? 'Modifica los detalles del usuario.' : 'Crea una cuenta para un nuevo miembro del equipo.';

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription>{description}</DialogDescription>
        </DialogHeader>
        
        <div className="space-y-4 pt-4">
            <div className="space-y-2">
                <Label htmlFor="displayName">Nombre Completo</Label>
                <Input id="displayName" value={formData.displayName} onChange={handleChange} placeholder="Ej. Juan Pérez" />
            </div>
            <div className="space-y-2">
                <Label htmlFor="email">Correo Electrónico</Label>
                <Input 
                    id="email" 
                    type="email" 
                    value={formData.email} 
                    onChange={handleChange} 
                    placeholder="ej. juan.perez@correo.com"
                    disabled={isEditing}
                />
            </div>
            {!isEditing && (
                <div className="space-y-2">
                    <Label htmlFor="password">Contraseña Temporal</Label>
                    <Input id="password" type="password" value={formData.password} onChange={handleChange} placeholder="Mínimo 6 caracteres" />
                </div>
            )}
            <div className="space-y-2">
                <Label htmlFor="role">Rol</Label>
                <Select value={formData.role} onValueChange={handleRoleChange}>
                    <SelectTrigger id="role">
                        <SelectValue placeholder="Seleccionar rol" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="Administrador">Administrador</SelectItem>
                        <SelectItem value="Supervisor">Supervisor</SelectItem>
                        <SelectItem value="Cajero">Cajero</SelectItem>
                    </SelectContent>
                </Select>
            </div>
        </div>

        <DialogFooter className='mt-4'>
          <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>Cancelar</Button>
          <Button type="submit" onClick={handleSubmit}>Guardar</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
