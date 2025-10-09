
'use client';

import { useState, useMemo, useEffect } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter
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
import { MoreHorizontal, PlusCircle, Search, ChevronLeft, ChevronRight } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import Image from "next/image"
import { Input } from "@/components/ui/input"
import { ProductDialog, Product } from "./components/product-dialog";
import { getMockData } from "@/lib/mock-data";

const ITEMS_PER_PAGE = 10;

export default function ProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Load mock data on component mount
    setProducts(getMockData().products);
    setLoading(false);
  }, []);

  const [page, setPage] = useState(1);
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
  
  const paginatedProducts = useMemo(() => {
    const start = (page - 1) * ITEMS_PER_PAGE;
    const end = start + ITEMS_PER_PAGE;
    return filteredProducts.slice(start, end);
  }, [filteredProducts, page]);

  const totalPages = Math.ceil(filteredProducts.length / ITEMS_PER_PAGE);

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

  const handleNextPage = () => {
    if (page < totalPages) {
        setPage(prev => prev + 1);
    }
  };

  const handlePrevPage = () => {
      if (page > 1) {
          setPage(prev => prev - 1);
      }
  };

  return (
    <div className="flex flex-col gap-6">
        <div className="flex items-center justify-between gap-4">
            <h1 className="font-semibold text-4xl">Productos</h1>
            <div className="flex items-center gap-2 ml-auto">
              <div className="relative w-full max-w-sm">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Buscar producto..."
                    className="pl-9"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
              </div>
              <Button size="sm" variant="outline">
                  Importar
              </Button>
              <Button size="sm" className="gap-1" onClick={handleAddProduct}>
                  <PlusCircle className="h-4 w-4" />
                  Agregar Producto
              </Button>
            </div>
        </div>

        <div className="border rounded-lg w-full">
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
              ) : paginatedProducts.length > 0 ? (
                paginatedProducts.map((product) => (
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
          <div className="flex items-center justify-between border-t p-4">
              <span className="text-sm text-muted-foreground">
                  Mostrando {paginatedProducts.length} de {filteredProducts.length} productos
              </span>
              <div className="flex items-center gap-2">
                  <Button
                      variant="outline"
                      size="sm"
                      onClick={handlePrevPage}
                      disabled={page <= 1}
                  >
                      <ChevronLeft className="h-4 w-4 mr-1" />
                      Anterior
                  </Button>
                   <span className="text-sm font-medium">
                      {page} / {totalPages}
                  </span>
                  <Button
                      variant="outline"
                      size="sm"
                      onClick={handleNextPage}
                      disabled={page >= totalPages}
                  >
                      Siguiente
                      <ChevronRight className="h-4 w-4 ml-1" />
                  </Button>
              </div>
          </div>
        </div>

        <ProductDialog
          isOpen={isDialogOpen}
          onOpenChange={setIsDialogOpen}
          onSave={handleSaveProduct}
          product={editingProduct}
        />
    </div>
  )
}
