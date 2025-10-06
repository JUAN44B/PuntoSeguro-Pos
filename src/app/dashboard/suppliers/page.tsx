
"use client"
import * as React from "react";
import {
  File,
  MoreHorizontal,
  PlusCircle,
} from "lucide-react"

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
import { suppliers as initialSuppliers } from "@/lib/data"
import { useToast } from "@/hooks/use-toast";
import type { Supplier } from "@/lib/types";
import AddSupplierDialog from "./components/add-supplier-dialog";

export default function SuppliersPage() {
  const [suppliers, setSuppliers] = React.useState(initialSuppliers);
  const { toast } = useToast();

  const handleAddSupplier = (newSupplier: Supplier) => {
    setSuppliers(prev => [...prev, newSupplier]);
    toast({
      title: "Proveedor Agregado",
      description: `El proveedor "${newSupplier.name}" ha sido agregado.`,
    });
  };

  const handleDeleteSupplier = (supplierId: string) => {
    setSuppliers(prev => prev.filter(s => s.id !== supplierId));
    toast({
      variant: "destructive",
      title: "Proveedor Eliminado",
      description: "El proveedor ha sido eliminado.",
    });
  };

  return (
    <div>
        <div className="flex items-center mb-4">
            <h1 className="text-2xl font-semibold">Proveedores</h1>
            <div className="ml-auto flex items-center gap-2">
                <Button size="sm" variant="outline" className="h-7 gap-1">
                    <File className="h-3.5 w-3.5" />
                    <span className="sr-only sm:not-sr-only sm:whitespace-nowrap">
                    Exportar
                    </span>
                </Button>
                <AddSupplierDialog onSupplierAdd={handleAddSupplier}>
                    <Button size="sm" className="h-7 gap-1">
                        <PlusCircle className="h-3.5 w-3.5" />
                        <span className="sr-only sm:not-sr-only sm:whitespace-nowrap">
                        Agregar Proveedor
                        </span>
                    </Button>
                </AddSupplierDialog>
            </div>
        </div>
        <Card>
        <CardHeader>
          <CardTitle>Información de Proveedores</CardTitle>
          <CardDescription>
            Administra tus proveedores y su información de contacto.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Nombre</TableHead>
                <TableHead>Contacto</TableHead>
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
              {suppliers.map((supplier) => (
                  <TableRow key={supplier.id}>
                  <TableCell className="font-medium">
                      {supplier.name}
                      <div className="text-xs text-muted-foreground">{supplier.rfc}</div>
                  </TableCell>
                  <TableCell>
                      {supplier.contactName}
                  </TableCell>
                  <TableCell className="hidden md:table-cell">
                      {supplier.email}
                  </TableCell>
                  <TableCell className="hidden md:table-cell">
                      {supplier.phone}
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
                          <DropdownMenuItem>Ver Detalles</DropdownMenuItem>
                          <DropdownMenuItem>Editar</DropdownMenuItem>
                          <DropdownMenuItem onClick={() => handleDeleteSupplier(supplier.id)}>Eliminar</DropdownMenuItem>
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
            Mostrando <strong>1-{suppliers.length}</strong> de <strong>{suppliers.length}</strong>{" "}
            proveedores
          </div>
        </CardFooter>
      </Card>
    </div>
  )
}
