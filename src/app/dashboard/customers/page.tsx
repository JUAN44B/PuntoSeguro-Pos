
"use client"

import * as React from "react"
import {
  File,
  MoreHorizontal,
  PlusCircle,
} from "lucide-react"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { customers as initialCustomers } from "@/lib/data"
import { useToast } from "@/hooks/use-toast"
import type { Customer } from "@/lib/types"
import AddCustomerDialog from "./components/add-customer-dialog"
import EditCustomerDialog from "./components/edit-customer-dialog"

export default function CustomersPage() {
  const [customers, setCustomers] = React.useState(initialCustomers);
  const [editingCustomer, setEditingCustomer] = React.useState<Customer | null>(null);
  const [isEditDialogOpen, setIsEditDialogOpen] = React.useState(false);
  const { toast } = useToast();

  const handleAddCustomer = (newCustomer: Customer) => {
    setCustomers(prev => [...prev, newCustomer]);
    toast({
      title: "Cliente Agregado",
      description: `El cliente "${newCustomer.name}" ha sido agregado.`,
    });
  };

  const handleEditCustomer = (customer: Customer) => {
    setEditingCustomer(customer);
    setIsEditDialogOpen(true);
  };

  const handleUpdateCustomer = (updatedCustomer: Customer) => {
    setCustomers(prev => prev.map(c => c.id === updatedCustomer.id ? updatedCustomer : c));
    toast({
      title: "Cliente Actualizado",
      description: `La información de "${updatedCustomer.name}" ha sido actualizada.`,
    });
    setIsEditDialogOpen(false);
    setEditingCustomer(null);
  };

  const handleDeleteCustomer = (customerId: string) => {
    setCustomers(prev => prev.filter(c => c.id !== customerId));
    toast({
      variant: "destructive",
      title: "Cliente Eliminado",
      description: "El cliente ha sido eliminado.",
    });
  };

  return (
    <div>
        <div className="flex items-center mb-4">
            <h1 className="text-2xl font-semibold">Clientes</h1>
            <div className="ml-auto flex items-center gap-2">
                <Button size="sm" variant="outline" className="h-7 gap-1">
                    <File className="h-3.5 w-3.5" />
                    <span className="sr-only sm:not-sr-only sm:whitespace-nowrap">
                    Exportar
                    </span>
                </Button>
                <AddCustomerDialog onCustomerAdd={handleAddCustomer}>
                  <Button size="sm" className="h-7 gap-1">
                      <PlusCircle className="h-3.5 w-3.5" />
                      <span className="sr-only sm:not-sr-only sm:whitespace-nowrap">
                      Agregar Cliente
                      </span>
                  </Button>
                </AddCustomerDialog>
            </div>
        </div>
        <Card>
        <CardHeader>
          <CardTitle>Resumen de Clientes</CardTitle>
          <CardDescription>
            Administra tus clientes y mira su historial de compras.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Nombre</TableHead>
                <TableHead>Tipo</TableHead>
                <TableHead className="hidden md:table-cell">
                  Email
                </TableHead>
                <TableHead className="hidden md:table-cell">
                  Teléfono
                </TableHead>
                <TableHead>
                  <span className="sr-only">Acciones</span>
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {customers.map((customer) => (
                  <TableRow key={customer.id}>
                  <TableCell className="font-medium">
                      {customer.name}
                      <div className="text-xs text-muted-foreground">{customer.rfc}</div>
                  </TableCell>
                  <TableCell>
                      <Badge variant={customer.type === 'Mayoreo' ? 'default' : 'secondary'}>{customer.type}</Badge>
                  </TableCell>
                  <TableCell className="hidden md:table-cell">
                      {customer.email}
                  </TableCell>
                  <TableCell className="hidden md:table-cell">
                      {customer.phone}
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
                          <DropdownMenuItem onClick={() => handleEditCustomer(customer)}>Editar</DropdownMenuItem>
                          <DropdownMenuItem onClick={() => handleDeleteCustomer(customer.id)}>Eliminar</DropdownMenuItem>
                      </DropdownMenuContent>
                      </DropdownMenu>
                  </TableCell>
                  </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
        <CardFooter>
          <div className="text-xs text-muted-foreground">
            Mostrando <strong>1-{customers.length}</strong> de <strong>{customers.length}</strong>{" "}
            clientes
          </div>
        </CardFooter>
      </Card>
      {editingCustomer && (
        <EditCustomerDialog
          key={editingCustomer.id}
          open={isEditDialogOpen}
          onOpenChange={setIsEditDialogOpen}
          customer={editingCustomer}
          onCustomerUpdate={handleUpdateCustomer}
        />
      )}
    </div>
  )
}
