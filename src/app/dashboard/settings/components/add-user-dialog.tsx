
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
import type { User } from "@/lib/types"

interface AddUserDialogProps {
  children: React.ReactNode;
  onUserAdd: (user: User) => void;
}

const initialFormData = {
  name: '',
  email: '',
  role: 'Cajero' as 'Admin' | 'Gerente' | 'Cajero',
};

export default function AddUserDialog({ children, onUserAdd }: AddUserDialogProps) {
  const [open, setOpen] = React.useState(false)
  const [formData, setFormData] = React.useState(initialFormData);
  const { toast } = useToast()

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;
    setFormData(prev => ({ ...prev, [id]: value }));
  };

  const handleRoleChange = (value: 'Admin' | 'Gerente' | 'Cajero') => {
    setFormData(prev => ({ ...prev, role: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.name || !formData.email) {
        toast({
            variant: "destructive",
            title: "Información Faltante",
            description: "El nombre y el correo electrónico del usuario son requeridos.",
        });
        return;
    }
    
    const newUser: User = {
      id: `USR${Math.floor(Math.random() * 1000)}`,
      name: formData.name,
      email: formData.email,
      role: formData.role,
      status: 'Invitado',
    };

    onUserAdd(newUser);
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
          <DialogTitle>Agregar Nuevo Usuario</DialogTitle>
          <DialogDescription>
            Completa los detalles para invitar a un nuevo usuario a tu tienda.
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
            <Label htmlFor="role" className="text-right">Rol</Label>
            <Select onValueChange={handleRoleChange} defaultValue={formData.role}>
              <SelectTrigger className="col-span-3">
                <SelectValue placeholder="Selecciona un rol" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Admin">Admin</SelectItem>
                <SelectItem value="Gerente">Gerente</SelectItem>
                <SelectItem value="Cajero">Cajero</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <DialogFooter>
            <Button type="submit">Invitar Usuario</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
