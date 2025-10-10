
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
import { MoreHorizontal, Truck } from "lucide-react"
import { Input } from "@/components/ui/input"
import { SupplierDialog, Supplier } from "./components/supplier-dialog";
import { getMockData } from "@/lib/mock-data";

export default function SuppliersPage() {
  const [suppliers, setSuppliers] = useState<Supplier[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setSuppliers(getMockData().suppliers);
    setLoading(false);
  }, []);
  
  const [searchTerm, setSearchTerm] = useState("");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingSupplier, setEditingSupplier] = useState<Supplier | null>(null);

  const filteredSuppliers = useMemo(() => {
    if (!searchTerm) return suppliers;
    return suppliers.filter(supplier =>
      supplier.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (supplier.contactName && supplier.contactName.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (supplier.rfc && supplier.rfc.toLowerCase().includes(searchTerm.toLowerCase()))
    );
  }, [suppliers, searchTerm]);

  const handleAddSupplier = () => {
    setEditingSupplier(null);
    setIsDialogOpen(true);
  };

  const handleEditSupplier = (supplier: Supplier) => {
    setEditingSupplier(supplier);
    setIsDialogOpen(true);
  };

  const handleDeleteSupplier = async (supplierId: string) => {
    if (!supplierId) return;
    setSuppliers(prev => prev.filter(c => c.id !== supplierId));
  };
  
  const handleSaveSupplier = async (supplierData: Omit<Supplier, 'id'>) => {
    if (editingSupplier && editingSupplier.id) {
        setSuppliers(prev => prev.map(s => s.id === editingSupplier.id ? { ...editingSupplier, ...supplierData } : s));
    } else {
        const newSupplier = { ...supplierData, id: new Date().toISOString() };
        setSuppliers(prev => [...prev, newSupplier]);
    }
    setIsDialogOpen(false);
    setEditingSupplier(null);
  };

  return (
    <div className="flex flex-col gap-8">
        <div className="flex items-center">
            <h1 className="font-semibold text-4xl">Proveedores</h1>
            <div className="ml-auto flex items-center gap-2">
            <Button size="sm" className="gap-1" onClick={handleAddSupplier}>
                <Truck className="h-4 w-4" />
                Agregar Proveedor
            </Button>
            </div>
        </div>

        <Card>
            <CardHeader>
                <CardTitle>Directorio de Proveedores</CardTitle>
                <CardDescription>
                Administra la información de tus proveedores. (Modo Demo)
                </CardDescription>
                <Input
                  placeholder="Buscar proveedor por nombre, contacto o RFC..."
                  className="max-w-sm mt-4"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
            </CardHeader>
            <CardContent>
                <Table>
                <TableHeader>
                    <TableRow>
                    <TableHead>Nombre / Razón Social</TableHead>
                    <TableHead>Contacto</TableHead>
                    <TableHead>Teléfono</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>RFC</TableHead>
                    <TableHead>
                        <span className="sr-only">Acciones</span>
                    </TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {loading ? (
                        <TableRow>
                            <TableCell colSpan={6} className="h-24 text-center">
                            Cargando proveedores...
                            </TableCell>
                        </TableRow>
                    ) : filteredSuppliers.length > 0 ? (
                      filteredSuppliers.map((supplier) => (
                          <TableRow key={supplier.id}>
                              <TableCell className="font-medium">
                                  {supplier.name}
                              </TableCell>
                              <TableCell>
                                  {supplier.contactName}
                              </TableCell>
                              <TableCell>
                                  {supplier.phone}
                              </TableCell>
                              <TableCell>
                                  {supplier.email}
                              </TableCell>
                              <TableCell>
                                  {supplier.rfc}
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
                                      <DropdownMenuItem onClick={() => handleEditSupplier(supplier)}>Editar</DropdownMenuItem>
                                      <DropdownMenuItem onClick={() => handleDeleteSupplier(supplier.id!)}>Eliminar</DropdownMenuItem>
                                  </DropdownMenuContent>
                                  </DropdownMenu>
                              </TableCell>
                          </TableRow>
                      ))
                    ) : (
                      <TableRow>
                        <TableCell colSpan={6} className="h-24 text-center">
                          No se encontraron proveedores. Comienza agregando uno nuevo.
                        </TableCell>
                      </TableRow>
                    )}
                </TableBody>
                </Table>
            </CardContent>
        </Card>

        <SupplierDialog
          isOpen={isDialogOpen}
          onOpenChange={setIsDialogOpen}
          onSave={handleSaveSupplier}
          supplier={editingSupplier}
        />
    </div>
  )
}
