
"use client"

import * as React from "react"
import {
  File,
  ListFilter,
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
  DropdownMenuSeparator,
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

export default function CustomersPage() {
  const [customers, setCustomers] = React.useState(initialCustomers);
  const { toast } = useToast();

  const handleAddCustomer = () => {
    const newCustomer: Customer = {
      id: `CUST${String(customers.length + 1).padStart(3, '0')}`,
      name: 'New Customer',
      rfc: 'XAXX010101000',
      email: 'new.customer@email.com',
      phone: '00-0000-0000',
      address: 'New Address',
      type: 'Retail',
    };
    setCustomers(prev => [...prev, newCustomer]);
    toast({
      title: "Customer Added",
      description: "A new customer has been created. Please edit their details.",
    });
  };

  const handleDeleteCustomer = (customerId: string) => {
    setCustomers(prev => prev.filter(c => c.id !== customerId));
    toast({
      variant: "destructive",
      title: "Customer Deleted",
      description: "The customer has been removed.",
    });
  };

  return (
    <div>
        <div className="flex items-center mb-4">
            <h1 className="text-2xl font-semibold">Customers</h1>
            <div className="ml-auto flex items-center gap-2">
                <Button size="sm" variant="outline" className="h-7 gap-1">
                    <File className="h-3.5 w-3.5" />
                    <span className="sr-only sm:not-sr-only sm:whitespace-nowrap">
                    Export
                    </span>
                </Button>
                <Button size="sm" className="h-7 gap-1" onClick={handleAddCustomer}>
                    <PlusCircle className="h-3.5 w-3.5" />
                    <span className="sr-only sm:not-sr-only sm:whitespace-nowrap">
                    Add Customer
                    </span>
                </Button>
            </div>
        </div>
        <Card>
        <CardHeader>
          <CardTitle>Customer Overview</CardTitle>
          <CardDescription>
            Manage your customers and view their purchase history.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Type</TableHead>
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
              {customers.map((customer) => (
                  <TableRow key={customer.id}>
                  <TableCell className="font-medium">
                      {customer.name}
                      <div className="text-xs text-muted-foreground">{customer.rfc}</div>
                  </TableCell>
                  <TableCell>
                      <Badge variant={customer.type === 'Wholesale' ? 'default' : 'secondary'}>{customer.type}</Badge>
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
                          <DropdownMenuLabel>Actions</DropdownMenuLabel>
                          <DropdownMenuItem>View Details</DropdownMenuItem>
                          <DropdownMenuItem>Edit</DropdownMenuItem>
                          <DropdownMenuItem onClick={() => handleDeleteCustomer(customer.id)}>Delete</DropdownMenuItem>
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
            Showing <strong>1-{customers.length}</strong> of <strong>{customers.length}</strong>{" "}
            customers
          </div>
        </CardFooter>
      </Card>
    </div>
  )
}

    