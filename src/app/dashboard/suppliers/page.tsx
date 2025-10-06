
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

export default function SuppliersPage() {
  const [suppliers, setSuppliers] = React.useState(initialSuppliers);
  const { toast } = useToast();

  const handleAddSupplier = () => {
    const newSupplier: Supplier = {
      id: `SUP${String(suppliers.length + 1).padStart(3, '0')}`,
      name: 'New Supplier',
      rfc: 'XAXX010101000',
      contactName: 'Contact Name',
      email: 'new.supplier@email.com',
      phone: '00-0000-0000',
      address: 'New Supplier Address',
    };
    setSuppliers(prev => [...prev, newSupplier]);
    toast({
      title: "Supplier Added",
      description: "A new supplier has been created. Please edit their details.",
    });
  };

  const handleDeleteSupplier = (supplierId: string) => {
    setSuppliers(prev => prev.filter(s => s.id !== supplierId));
    toast({
      variant: "destructive",
      title: "Supplier Deleted",
      description: "The supplier has been removed.",
    });
  };

  return (
    <div>
        <div className="flex items-center mb-4">
            <h1 className="text-2xl font-semibold">Suppliers</h1>
            <div className="ml-auto flex items-center gap-2">
                <Button size="sm" variant="outline" className="h-7 gap-1">
                    <File className="h-3.5 w-3.5" />
                    <span className="sr-only sm:not-sr-only sm:whitespace-nowrap">
                    Export
                    </span>
                </Button>
                <Button size="sm" className="h-7 gap-1" onClick={handleAddSupplier}>
                    <PlusCircle className="h-3.5 w-3.5" />
                    <span className="sr-only sm:not-sr-only sm:whitespace-nowrap">
                    Add Supplier
                    </span>
                </Button>
            </div>
        </div>
        <Card>
        <CardHeader>
          <CardTitle>Supplier Information</CardTitle>
          <CardDescription>
            Manage your suppliers and their contact information.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Contact</TableHead>
                <TableHead className="hidden md:table-cell">
                  Email
                </TableHead>
                <TableHead className="hidden md:table-cell">
                  Phone
                </TableHead>
                <TableHead>
                  <span className="sr-only">Actions</span>
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
                          <DropdownMenuLabel>Actions</DropdownMenuLabel>
                          <DropdownMenuItem>View Details</DropdownMenuItem>
                          <DropdownMenuItem>Edit</DropdownMenuItem>
                          <DropdownMenuItem onClick={() => handleDeleteSupplier(supplier.id)}>Delete</DropdownMenuItem>
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
            Showing <strong>1-{suppliers.length}</strong> of <strong>{suppliers.length}</strong>{" "}
            suppliers
          </div>
        </CardFooter>
      </Card>
    </div>
  )
}

    