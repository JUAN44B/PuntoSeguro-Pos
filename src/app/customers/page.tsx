
'use client';

import { useState, useMemo, useEffect } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Button } from "@/components/ui/button"
import { MoreHorizontal, UserPlus } from "lucide-react"
import { Input } from "@/components/ui/input"
import { CustomerDialog, Customer } from "./components/customer-dialog";
import { getMockData } from "@/lib/mock-data";

export default function CustomersPage() {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setCustomers(getMockData().customers);
    setLoading(false);
  }, []);
  
  const [searchTerm, setSearchTerm] = useState("");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingCustomer, setEditingCustomer] = useState<Customer | null>(null);

  const filteredCustomers = useMemo(() => {
    if (!searchTerm) return customers;
    return customers.filter(customer =>
      customer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (customer.phone && customer.phone.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (customer.rfc && customer.rfc.toLowerCase().includes(searchTerm.toLowerCase()))
    );
  }, [customers, searchTerm]);

  const handleAddCustomer = () => {
    setEditingCustomer(null);
    setIsDialogOpen(true);
  };

  const handleEditCustomer = (customer: Customer) => {
    setEditingCustomer(customer);
    setIsDialogOpen(true);
  };

  const handleDeleteCustomer = async (customerId: string) => {
    if (!customerId) return;
    setCustomers(prev => prev.filter(c => c.id !== customerId));
  };
  
  const handleSaveCustomer = async (customerData: Omit<Customer, 'id'>) => {
    if (editingCustomer && editingCustomer.id) {
        setCustomers(prev => prev.map(c => c.id === editingCustomer.id ? { ...editingCustomer, ...customerData } : c));
    } else {
        const newCustomer = { ...customerData, id: new Date().toISOString() };
        setCustomers(prev => [...prev, newCustomer]);
    }
    setIsDialogOpen(false);
    setEditingCustomer(null);
  };

  return (
    <div className="flex flex-col gap-8">
        <div className="flex items-center">
            <h1 className="font-semibold text-4xl">Clientes</h1>
            <div className="ml-auto flex items-center gap-2">
            <Button size="sm" className="gap-1" onClick={handleAddCustomer}>
                <UserPlus className="h-4 w-4" />
                Agregar Cliente
            </Button>
            </div>
        </div>

        <Card>
            <CardHeader>
                <CardTitle>Directorio de Clientes</CardTitle>
                <CardDescription>
                Administra la información de tus clientes. (Modo Demo)
                </CardDescription>
                <Input
                  placeholder="Buscar cliente por nombre, RFC o teléfono..."
                  className="max-w-sm mt-4"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
            </CardHeader>
            <CardContent>
                <Table>
                <TableHeader>
                    <TableRow>
                    <TableHead>Nombre</TableHead>
                    <TableHead>RFC</TableHead>
                    <TableHead>Teléfono</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>
                        <span className="sr-only">Acciones</span>
                    </TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {loading ? (
                        <TableRow>
                            <TableCell colSpan={5} className="h-24 text-center">
                            Cargando clientes...
                            </TableCell>
                        </TableRow>
                    ) : filteredCustomers.length > 0 ? (
                      filteredCustomers.map((customer) => (
                          <TableRow key={customer.id}>
                              <TableCell className="font-medium">
                                  {customer.name}
                              </TableCell>
                              <TableCell>
                                  {customer.rfc}
                              </TableCell>
                              <TableCell>
                                  {customer.phone}
                              </TableCell>
                              <TableCell>
                                  {customer.email}
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
                                      <DropdownMenuItem onClick={() => handleDeleteCustomer(customer.id!)}>Eliminar</DropdownMenuItem>
                                  </DropdownMenuContent>
                                  </DropdownMenu>
                              </TableCell>
                          </TableRow>
                      ))
                    ) : (
                      <TableRow>
                        <TableCell colSpan={5} className="h-24 text-center">
                          No se encontraron clientes. Comienza agregando uno nuevo.
                        </TableCell>
                      </TableRow>
                    )}
                </TableBody>
                </Table>
            </CardContent>
        </Card>

        <CustomerDialog
          isOpen={isDialogOpen}
          onOpenChange={setIsDialogOpen}
          onSave={handleSaveCustomer}
          customer={editingCustomer}
        />
    </div>
  )
}
