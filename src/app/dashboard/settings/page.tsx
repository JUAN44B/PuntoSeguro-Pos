
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
      title: "Settings Saved",
      description: "Your business information has been updated.",
    });
  };
  
  const handleAddUser = () => {
    const newUser: User = {
        id: `USR${String(users.length + 1).padStart(3, '0')}`,
        name: 'New User',
        email: 'new.user@example.com',
        role: 'Cashier',
        status: 'Invited'
    };
    setUsers(prev => [...prev, newUser]);
     toast({
      title: "User Added",
      description: "A new user has been invited.",
    });
  }

  const handleDeleteUser = (userId: string) => {
    setUsers(prev => prev.filter(user => user.id !== userId));
     toast({
        variant: "destructive",
      title: "User Deleted",
      description: "The user has been removed from the system.",
    });
  }


  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-semibold">Settings</h1>
        <p className="text-muted-foreground">
          Manage your store settings and preferences.
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Business Information</CardTitle>
          <CardDescription>
            Update your business name, address, and contact details.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSaveChanges} className="grid gap-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="name">Business Name</Label>
                <Input id="name" value={businessInfo.name} onChange={handleInfoChange} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Contact Email</Label>
                <Input id="email" type="email" value={businessInfo.email} onChange={handleInfoChange} />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="address">Address</Label>
              <Textarea id="address" value={businessInfo.address} onChange={handleInfoChange} />
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                    <Label htmlFor="phone">Phone Number</Label>
                    <Input id="phone" type="tel" value={businessInfo.phone} onChange={handleInfoChange} />
                </div>
                 <div className="space-y-2">
                    <Label htmlFor="tax-id">Tax ID (RFC)</Label>
                    <Input id="tax-id" value={businessInfo.taxId} onChange={handleInfoChange} />
                </div>
            </div>
             <div className="flex justify-end">
                <Button type="submit">Save Changes</Button>
            </div>
          </form>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <div className="flex items-center">
            <div className="grid gap-1">
                <CardTitle>Users & Roles</CardTitle>
                <CardDescription>
                    Manage who can access your store and what they can do.
                </CardDescription>
            </div>
            <Button size="sm" className="ml-auto h-7 gap-1" onClick={handleAddUser}>
                <PlusCircle className="h-3.5 w-3.5" />
                <span>Add User</span>
            </Button>
          </div>
        </CardHeader>
        <CardContent>
           <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Role</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>
                  <span className="sr-only">Actions</span>
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
                      variant={user.status === 'Active' ? 'default' : 'secondary'}
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
                        <DropdownMenuLabel>Actions</DropdownMenuLabel>
                        <DropdownMenuItem>Edit Role</DropdownMenuItem>
                        <DropdownMenuItem>Deactivate User</DropdownMenuItem>
                        <DropdownMenuItem onClick={() => handleDeleteUser(user.id)}>Delete</DropdownMenuItem>
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

    