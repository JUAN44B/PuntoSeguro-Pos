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
import { suppliers } from "@/lib/data"

export default function SuppliersPage() {
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
                <Button size="sm" className="h-7 gap-1">
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
                          <DropdownMenuItem>Delete</DropdownMenuItem>
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
