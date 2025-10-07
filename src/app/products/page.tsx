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
import { MoreHorizontal, PlusCircle } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import Image from "next/image"
import { Input } from "@/components/ui/input"
import { ProductDialog, Product } from "./components/product-dialog";
import { getMockData } from "@/lib/mock-data";

export default function ProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Load mock data on component mount
    setProducts(getMockData().products);
    setLoading(false);
  }, []);

  const [searchTerm, setSearchTerm] = useState("");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);

  const filteredProducts = useMemo(() => {
    if (!searchTerm) return products;
    return products.filter(product =>
      product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (product.code && product.code.toLowerCase().includes(searchTerm.toLowerCase()))
    );
  }, [products, searchTerm]);

  const handleAddProduct = () => {
    setEditingProduct(null);
    setIsDialogOpen(true);
  };

  const handleEditProduct = (product: Product) => {
    setEditingProduct(product);
    setIsDialogOpen(true);
  };

  const handleDeleteProduct = async (productId: string) => {
    if (!productId) return;
    setProducts(prev => prev.filter(p => p.id !== productId));
  };
  
  const handleSaveProduct = async (productData: Omit<Product, 'id'>) => {
    if (editingProduct && editingProduct.id) {
        // Update existing product
        setProducts(prev => prev.map(p => p.id === editingProduct.id ? { ...editingProduct, ...productData } : p));
    } else {
        // Add new product
        const newProduct = { ...productData, id: new Date().toISOString() }; // Simple unique ID
        setProducts(prev => [...prev, newProduct]);
    }
    setIsDialogOpen(false);
    setEditingProduct(null);
  };

  return (
    <div className="flex flex-col gap-8">
        <div className="flex items-center">
            <h1 className="font-semibold text-4xl">Productos</h1>
            <div className="ml-auto flex items-center gap-2">
            <Button size="sm" variant="outline">
                Importar
            </Button>
            <Button size="sm" className="gap-1" onClick={handleAddProduct}>
                <PlusCircle className="h-4 w-4" />
                Agregar Producto
            </Button>
            </div>
        </div>

        <Card>
            <CardHeader>
                <CardTitle>Inventario de Productos</CardTitle>
                <CardDescription>
                Administra tus productos, actualiza el inventario y consulta los precios. (Modo Demo)
                </CardDescription>
                <Input
                  placeholder="Buscar producto por nombre o código..."
                  className="max-w-sm mt-4"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
            </CardHeader>
            <CardContent>
                <Table>
                <TableHeader>
                    <TableRow>
                    <TableHead className="hidden w-[100px] sm:table-cell">
                        <span className="sr-only">Imagen</span>
                    </TableHead>
                    <TableHead>Código</TableHead>
                    <TableHead>Nombre</TableHead>
                    <TableHead>Estado</TableHead>
                    <TableHead>P. Venta</TableHead>
                    <TableHead className="hidden md:table-cell">
                        Existencia
                    </TableHead>
                    <TableHead className="hidden md:table-cell">
                        Categoría
                    </TableHead>
                    <TableHead>
                        <span className="sr-only">Acciones</span>
                    </TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {loading ? (
                        <TableRow>
                            <TableCell colSpan={8} className="h-24 text-center">
                            Cargando productos...
                            </TableCell>
                        </TableRow>
                    ) : filteredProducts.length > 0 ? (
                      filteredProducts.map((product) => (
                          <TableRow key={product.id}>
                              <TableCell className="hidden sm:table-cell">
                                  <Image
                                      alt={product.name}
                                      className="aspect-square rounded-md object-cover"
                                      height="64"
                                      src={product.image || "https://picsum.photos/seed/placeholder/64/64"}
                                      width="64"
                                      data-ai-hint="product image"
                                  />
                              </TableCell>
                              <TableCell className="font-medium">
                                  {product.code}
                              </TableCell>
                              <TableCell className="font-medium">
                                  {product.name}
                              </TableCell>
                              <TableCell>
                                  <Badge variant={product.status === 'Activo' ? 'default' : 'outline'}>{product.status}</Badge>
                              </TableCell>
                              <TableCell>${product.finalPrice.toFixed(2)}</TableCell>
                              <TableCell className="hidden md:table-cell">
                                  {product.stock}
                              </TableCell>
                              <TableCell className="hidden md:table-cell">
                                  {product.category}
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
                                      <DropdownMenuItem onClick={() => handleEditProduct(product)}>Editar</DropdownMenuItem>
                                      <DropdownMenuItem onClick={() => handleDeleteProduct(product.id!)}>Eliminar</DropdownMenuItem>
                                  </DropdownMenuContent>
                                  </DropdownMenu>
                              </TableCell>
                          </TableRow>
                      ))
                    ) : (
                      <TableRow>
                        <TableCell colSpan={8} className="h-24 text-center">
                          No se encontraron productos. Comienza agregando uno nuevo.
                        </TableCell>
                      </TableRow>
                    )}
                </TableBody>
                </Table>
            </CardContent>
        </Card>

        <ProductDialog
          isOpen={isDialogOpen}
          onOpenChange={setIsDialogOpen}
          onSave={handleSaveProduct}
          product={editingProduct}
        />
    </div>
  )
}
