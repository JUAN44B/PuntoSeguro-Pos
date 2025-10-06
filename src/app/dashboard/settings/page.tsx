
"use client"
import * as React from "react"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { users as initialUsers, products as initialProducts } from "@/lib/data"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { MoreHorizontal, PlusCircle } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { useToast } from "@/hooks/use-toast"
import type { User } from "@/lib/types"

export default function SettingsPage() {
  const { toast } = useToast();
  const [businessInfo, setBusinessInfo] = React.useState({
    name: "PuntoSeguro POS",
    email: "contacto@puntoseguro.com",
    address: "Av. Principal 123, Ciudad, País",
    phone: "+52 55 1234 5678",
    taxId: "PSM120315ABC",
  });

  const [users, setUsers] = React.useState<User[]>(initialUsers);

  const handleInfoChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { id, value } = e.target;
    setBusinessInfo(prev => ({ ...prev, [id]: value }));
  };

  const handleSaveChanges = (e: React.FormEvent) => {
    e.preventDefault();
    // Here you would typically save to a backend
    toast({
      title: "Ajustes Guardados",
      description: "La información de tu negocio ha sido actualizada.",
    });
  };
  
  const handleAddUser = () => {
    const newUser: User = {
        id: `USR${String(users.length + 1).padStart(3, '0')}`,
        name: 'Nuevo Usuario',
        email: 'nuevo.usuario@example.com',
        role: 'Cajero',
        status: 'Invitado'
    };
    setUsers(prev => [...prev, newUser]);
     toast({
      title: "Usuario Agregado",
      description: "Un nuevo usuario ha sido invitado.",
    });
  }

  const handleDeleteUser = (userId: string) => {
    setUsers(prev => prev.filter(user => user.id !== userId));
     toast({
        variant: "destructive",
      title: "Usuario Eliminado",
      description: "El usuario ha sido eliminado del sistema.",
    });
  }


  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-semibold">Configuración</h1>
        <p className="text-muted-foreground">
          Administra la configuración y preferencias de tu tienda.
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Información del Negocio</CardTitle>
          <CardDescription>
            Actualiza el nombre de tu negocio, dirección y detalles de contacto.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSaveChanges} className="grid gap-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="name">Nombre del Negocio</Label>
                <Input id="name" value={businessInfo.name} onChange={handleInfoChange} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email de Contacto</Label>
                <Input id="email" type="email" value={businessInfo.email} onChange={handleInfoChange} />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="address">Dirección</Label>
              <Textarea id="address" value={businessInfo.address} onChange={handleInfoChange} />
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                    <Label htmlFor="phone">Número de Teléfono</Label>
                    <Input id="phone" type="tel" value={businessInfo.phone} onChange={handleInfoChange} />
                </div>
                 <div className="space-y-2">
                    <Label htmlFor="tax-id">ID Fiscal (RFC)</Label>
                    <Input id="tax-id" value={businessInfo.taxId} onChange={handleInfoChange} />
                </div>
            </div>
             <div className="flex justify-end">
                <Button type="submit">Guardar Cambios</Button>
            </div>
          </form>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <div className="flex items-center">
            <div className="grid gap-1">
                <CardTitle>Usuarios y Roles</CardTitle>
                <CardDescription>
                    Administra quién puede acceder a tu tienda y qué pueden hacer.
                </CardDescription>
            </div>
            <Button size="sm" className="ml-auto h-7 gap-1" onClick={handleAddUser}>
                <PlusCircle className="h-3.5 w-3.5" />
                <span>Agregar Usuario</span>
            </Button>
          </div>
        </CardHeader>
        <CardContent>
           <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Nombre</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Rol</TableHead>
                <TableHead>Estado</TableHead>
                <TableHead>
                  <span className="sr-only">Acciones</span>
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {users.map((user) => (
                <TableRow key={user.id}>
                  <TableCell className="font-medium">{user.name}</TableCell>
                  <TableCell>{user.email}</TableCell>
                  <TableCell>
                    <Badge variant="outline">{user.role}</Badge>
                  </TableCell>
                  <TableCell>
                    <Badge
                      variant={user.status === 'Activo' ? 'default' : 'secondary'}
                    >
                      {user.status}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button
                          aria-haspopup="true"
                          size="icon"
                          variant="ghost"
                        >
                          <MoreHorizontal className="h-4 w-4" />
                          <span className="sr-only">Toggle menu</span>
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuLabel>Acciones</DropdownMenuLabel>
                        <DropdownMenuItem>Editar Rol</DropdownMenuItem>
                        <DropdownMenuItem>Desactivar Usuario</DropdownMenuItem>
                        <DropdownMenuItem onClick={() => handleDeleteUser(user.id)}>Eliminar</DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )
}
