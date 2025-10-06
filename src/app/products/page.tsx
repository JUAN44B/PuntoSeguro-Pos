'use client';

import { useState, useMemo } from "react";
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

const initialProducts: Product[] = [
    {
        id: "prod-001",
        code: "41053",
        name: "Balero 6203",
        status: "Activo",
        purchasePrice: 95,
        discount: 10,
        profitMargin: 30,
        finalPrice: 130.00,
        stock: 100,
        category: "Baleros",
        image: "https://picsum.photos/seed/1/64/64"
    },
    {
        id: "prod-002",
        code: "RT-54321",
        name: "Retén 12345",
        status: "Activo",
        purchasePrice: 50,
        discount: 0,
        profitMargin: 40,
        finalPrice: 80.50,
        stock: 50,
        category: "Retenes",
        image: "https://picsum.photos/seed/2/64/64"
    },
    {
        id: "prod-003",
        code: "LUB-MULTI",
        name: "Aceite Multigrado",
        status: "Activo",
        purchasePrice: 180,
        discount: 5,
        profitMargin: 35,
        finalPrice: 250.00,
        stock: 30,
        category: "Lubricantes",
        image: "https://picsum.photos/seed/3/64/64"
    },
    {
        id: "prod-004",
        code: "TORN-RD-01",
        name: "Tornillo de Rueda",
        status: "Borrador",
        purchasePrice: 15,
        discount: 0,
        profitMargin: 50,
        finalPrice: 25.00,
        stock: 200,
        category: "Tornillería",
        image: "https://picsum.photos/seed/4/64/64"
    },
    {
        id: "prod-005",
        code: "GATO-2T",
        name: "Gato Hidráulico 2 Ton",
        status: "Archivado",
        purchasePrice: 800,
        discount: 10,
        profitMargin: 40,
        finalPrice: 1200.00,
        stock: 5,
        category: "Herramientas",
        image: "https://picsum.photos/seed/5/64/64"
    }
];

export default function ProductsPage() {
  const [products, setProducts] = useState(initialProducts);
  const [searchTerm, setSearchTerm] = useState("");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);

  const filteredProducts = useMemo(() => {
    if (!searchTerm) return products;
    return products.filter(product =>
      product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.code.toLowerCase().includes(searchTerm.toLowerCase())
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

  const handleDeleteProduct = (productId: string) => {
    setProducts(prevProducts => prevProducts.filter(p => p.id !== productId));
  };
  
  const handleSaveProduct = (productData: Product) => {
    if (editingProduct) {
      // Update existing product
      setProducts(prevProducts => prevProducts.map(p => p.id === productData.id ? productData : p));
    } else {
      // Add new product
      const newProduct = {
        ...productData,
        id: `prod-${String(products.length + 1).padStart(3, '0')}`,
        // The image is now a data URL from the dialog
      };
      setProducts(prevProducts => [...prevProducts, newProduct]);
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
                Administra tus productos, actualiza el inventario y consulta los precios.
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
                    {filteredProducts.length > 0 ? (
                      filteredProducts.map((product) => (
                          <TableRow key={product.id}>
                              <TableCell className="hidden sm:table-cell">
                                  <Image
                                      alt="Product image"
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
                                      <DropdownMenuItem onClick={() => handleDeleteProduct(product.id)}>Eliminar</DropdownMenuItem>
                                  </DropdownMenuContent>
                                  </DropdownMenu>
                              </TableCell>
                          </TableRow>
                      ))
                    ) : (
                      <TableRow>
                        <TableCell colSpan={8} className="h-24 text-center">
                          No se encontraron resultados.
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
