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

const initialProducts = [
    {
        id: "prod-001",
        name: "Balero 6203",
        status: "Activo",
        price: 150.00,
        stock: 100,
        category: "Baleros",
        image: "https://picsum.photos/seed/1/64/64"
    },
    {
        id: "prod-002",
        name: "Retén 12345",
        status: "Activo",
        price: 80.50,
        stock: 50,
        category: "Retenes",
        image: "https://picsum.photos/seed/2/64/64"
    },
    {
        id: "prod-003",
        name: "Aceite Multigrado",
        status: "Activo",
        price: 250.00,
        stock: 30,
        category: "Lubricantes",
        image: "https://picsum.photos/seed/3/64/64"
    },
    {
        id: "prod-004",
        name: "Tornillo de Rueda",
        status: "Borrador",
        price: 25.00,
        stock: 200,
        category: "Tornillería",
        image: "https://picsum.photos/seed/4/64/64"
    },
    {
        id: "prod-005",
        name: "Gato Hidráulico 2 Ton",
        status: "Archivado",
        price: 1200.00,
        stock: 5,
        category: "Herramientas",
        image: "https://picsum.photos/seed/5/64/64"
    }
];

export default function ProductsPage() {
  const [products, setProducts] = useState(initialProducts);
  const [searchTerm, setSearchTerm] = useState("");

  const filteredProducts = useMemo(() => {
    if (!searchTerm) return products;
    return products.filter(product =>
      product.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [products, searchTerm]);

  const handleAddProduct = () => {
    const newProduct = {
      id: `prod-${String(products.length + 1).padStart(3, '0')}`,
      name: "Nuevo Producto de Ejemplo",
      status: "Activo",
      price: Math.floor(Math.random() * 1000),
      stock: Math.floor(Math.random() * 100),
      category: "Categoría",
      image: `https://picsum.photos/seed/${products.length + 1}/64/64`,
    };
    setProducts(prevProducts => [...prevProducts, newProduct]);
  };

  const handleDeleteProduct = (productId: string) => {
    setProducts(prevProducts => prevProducts.filter(p => p.id !== productId));
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
                    <TableHead>Nombre</TableHead>
                    <TableHead>Estado</TableHead>
                    <TableHead>Precio</TableHead>
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
                                      src={product.image}
                                      width="64"
                                      data-ai-hint="product image"
                                  />
                              </TableCell>
                              <TableCell className="font-medium">
                                  {product.name}
                              </TableCell>
                              <TableCell>
                                  <Badge variant={product.status === 'Activo' ? 'default' : 'outline'}>{product.status}</Badge>
                              </TableCell>
                              <TableCell>${product.price.toFixed(2)}</TableCell>
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
                                      <DropdownMenuItem>Editar</DropdownMenuItem>
                                      <DropdownMenuItem onClick={() => handleDeleteProduct(product.id)}>Eliminar</DropdownMenuItem>
                                  </DropdownMenuContent>
                                  </DropdownMenu>
                              </TableCell>
                          </TableRow>
                      ))
                    ) : (
                      <TableRow>
                        <TableCell colSpan={7} className="h-24 text-center">
                          No se encontraron resultados.
                        </TableCell>
                      </TableRow>
                    )}
                </TableBody>
                </Table>
            </CardContent>
        </Card>
    </div>
  )
}
