
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
  DropdownMenuCheckboxItem,
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
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs"
import { purchaseOrders as initialPurchaseOrders } from "@/lib/data"
import { useToast } from "@/hooks/use-toast"
import type { PurchaseOrder } from "@/lib/types"
import AddPurchaseOrderDialog from "./components/add-purchase-order-dialog"
import EditPurchaseOrderDialog from "./components/edit-purchase-order-dialog"

export default function PurchasesPage() {
  const [purchaseOrders, setPurchaseOrders] = React.useState(initialPurchaseOrders);
  const [editingOrder, setEditingOrder] = React.useState<PurchaseOrder | null>(null);
  const [isEditDialogOpen, setIsEditDialogOpen] = React.useState(false);
  const { toast } = useToast();

  const handleAddPurchaseOrder = (newPO: PurchaseOrder) => {
    setPurchaseOrders(prev => [newPO, ...prev]);
    toast({
      title: "Orden de Compra Agregada",
      description: "Se ha creado una nueva orden de compra.",
    });
  };

  const handleEditOrder = (order: PurchaseOrder) => {
    setEditingOrder(order);
    setIsEditDialogOpen(true);
  };

  const handleUpdateOrder = (updatedOrder: PurchaseOrder) => {
    setPurchaseOrders(prev => prev.map(o => o.id === updatedOrder.id ? updatedOrder : o));
    toast({
        title: "Orden de Compra Actualizada",
        description: `La orden ${updatedOrder.id} ha sido actualizada.`,
    });
    setIsEditDialogOpen(false);
    setEditingOrder(null);
  };

  const handleDeletePurchaseOrder = (orderId: string) => {
    setPurchaseOrders(prev => prev.filter(order => order.id !== orderId));
    toast({
      variant: "destructive",
      title: "Orden de Compra Eliminada",
      description: "La orden de compra ha sido eliminada.",
    });
  };

  return (
    <>
    <Tabs defaultValue="all">
      <div className="flex items-center">
        <TabsList>
          <TabsTrigger value="all">Todas</TabsTrigger>
          <TabsTrigger value="received">Recibidas</TabsTrigger>
          <TabsTrigger value="pending">Pendientes</TabsTrigger>
          <TabsTrigger value="cancelled" className="hidden sm:flex">
            Canceladas
          </TabsTrigger>
        </TabsList>
        <div className="ml-auto flex items-center gap-2">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm" className="h-7 gap-1">
                <ListFilter className="h-3.5 w-3.5" />
                <span className="sr-only sm:not-sr-only sm:whitespace-nowrap">
                  Filtrar
                </span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>Filtrar por</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuCheckboxItem checked>
                Recibido
              </DropdownMenuCheckboxItem>
              <DropdownMenuCheckboxItem>Pendiente</DropdownMenuCheckboxItem>
              <DropdownMenuCheckboxItem>
                Cancelado
              </DropdownMenuCheckboxItem>
            </DropdownMenuContent>
          </DropdownMenu>
          <Button size="sm" variant="outline" className="h-7 gap-1">
            <File className="h-3.5 w-3.5" />
            <span className="sr-only sm:not-sr-only sm:whitespace-nowrap">
              Exportar
            </span>
          </Button>
          <AddPurchaseOrderDialog onPurchaseOrderAdd={handleAddPurchaseOrder}>
            <Button size="sm" className="h-7 gap-1">
                <PlusCircle className="h-3.5 w-3.5" />
                <span className="sr-only sm:not-sr-only sm:whitespace-nowrap">
                Nueva Orden de Compra
                </span>
            </Button>
          </AddPurchaseOrderDialog>
        </div>
      </div>
      <TabsContent value="all">
        <Card>
          <CardHeader>
            <CardTitle>Órdenes de Compra</CardTitle>
            <CardDescription>
              Rastrea y gestiona tus órdenes de compra a proveedores.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>ID Orden</TableHead>
                  <TableHead>Proveedor</TableHead>
                  <TableHead>Estado</TableHead>
                  <TableHead className="hidden md:table-cell">Fecha</TableHead>
                  <TableHead className="text-right">Monto</TableHead>
                  <TableHead>
                    <span className="sr-only">Acciones</span>
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {purchaseOrders.map((order) => (
                  <TableRow key={order.id}>
                    <TableCell className="font-medium">{order.id}</TableCell>
                    <TableCell>{order.supplierName}</TableCell>
                    <TableCell>
                      <Badge 
                        variant={
                          order.status === 'Recibido' ? 'default' : order.status === 'Pendiente' ? 'secondary' : 'destructive'
                        }
                        className={order.status === 'Pendiente' ? 'bg-yellow-500/80 text-white hover:bg-yellow-500' : ''}
                      >
                        {order.status}
                      </Badge>
                    </TableCell>
                    <TableCell className="hidden md:table-cell">
                      {order.date}
                    </TableCell>
                    <TableCell className="text-right">${order.total.toFixed(2)}</TableCell>
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
                          <DropdownMenuItem onClick={() => handleEditOrder(order)}>Editar</DropdownMenuItem>
                          <DropdownMenuItem>Marcar como Recibido</DropdownMenuItem>
                          <DropdownMenuItem onClick={() => handleDeletePurchaseOrder(order.id)}>Eliminar</DropdownMenuItem>
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
              Mostrando <strong>1-{purchaseOrders.length}</strong> de <strong>{purchaseOrders.length}</strong>{" "}
              órdenes de compra
            </div>
          </CardFooter>
        </Card>
      </TabsContent>
    </Tabs>
    {editingOrder && (
        <EditPurchaseOrderDialog
            key={editingOrder.id}
            open={isEditDialogOpen}
            onOpenChange={setIsEditDialogOpen}
            order={editingOrder}
            onPurchaseOrderUpdate={handleUpdateOrder}
        />
    )}
    </>
  )
}
