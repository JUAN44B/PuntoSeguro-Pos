
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
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Product } from "../products/components/product-dialog";
import { Save } from "lucide-react";
import { getMockData } from "@/lib/mock-data";

type ProductWithStock = Product & { newStock?: number };

export default function InventoryPage() {
  const [products, setProducts] = useState<ProductWithStock[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setProducts(getMockData().products);
    setLoading(false);
  }, []);

  const [searchTerm, setSearchTerm] = useState("");
  const [stockData, setStockData] = useState<Record<string, number>>({});

  const filteredProducts = useMemo(() => {
    const productList = products || [];
    if (!searchTerm) return productList;
    return productList.filter(product =>
      product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (product.code && product.code.toLowerCase().includes(searchTerm.toLowerCase()))
    );
  }, [products, searchTerm]);

  const handleStockChange = (productId: string, value: string) => {
    const newStock = parseInt(value, 10);
    if (!isNaN(newStock)) {
      setStockData(prev => ({ ...prev, [productId]: newStock }));
    } else if (value === '') {
      setStockData(prev => ({ ...prev, [productId]: 0 }));
    }
  };

  const handleSaveChanges = async (productId: string) => {
    if (stockData[productId] === undefined) return;
    
    // In mock mode, we just update the local state
    setProducts(prev => prev.map(p => {
        if (p.id === productId) {
            return { ...p, stock: stockData[productId] };
        }
        return p;
    }));

    const newStockData = { ...stockData };
    delete newStockData[productId];
    setStockData(newStockData);
  };
  
  return (
    <div className="flex flex-col gap-8">
        <div className="flex items-center">
            <h1 className="font-semibold text-4xl">Gestión de Inventario</h1>
        </div>

        <Card>
            <CardHeader>
                <CardTitle>Control de Existencias</CardTitle>
                <CardDescription>
                Visualiza y ajusta rápidamente las existencias de tus productos. (Modo Demo)
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
                            <TableHead>Código</TableHead>
                            <TableHead>Nombre</TableHead>
                            <TableHead className="hidden md:table-cell">Categoría</TableHead>
                            <TableHead className="w-[200px]">Existencia</TableHead>
                            <TableHead className="w-[100px]"><span className="sr-only">Acciones</span></TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {loading ? (
                            <TableRow>
                                <TableCell colSpan={5} className="h-24 text-center">
                                    Cargando inventario...
                                </TableCell>
                            </TableRow>
                        ) : filteredProducts.length > 0 ? (
                            filteredProducts.map((product) => (
                                <TableRow key={product.id}>
                                    <TableCell className="font-medium">{product.code}</TableCell>
                                    <TableCell>{product.name}</TableCell>
                                    <TableCell className="hidden md:table-cell">{product.category}</TableCell>
                                    <TableCell>
                                        <Input 
                                            type="number" 
                                            className="w-24 text-center"
                                            value={stockData[product.id!] ?? product.stock}
                                            onChange={(e) => handleStockChange(product.id!, e.target.value)}
                                        />
                                    </TableCell>
                                    <TableCell>
                                        <Button 
                                          size="sm" 
                                          onClick={() => handleSaveChanges(product.id!)}
                                          disabled={stockData[product.id!] === undefined || stockData[product.id!] === product.stock}
                                          className="gap-2"
                                        >
                                            <Save className="h-3 w-3"/>
                                            Guardar
                                        </Button>
                                    </TableCell>
                                </TableRow>
                            ))
                        ) : (
                            <TableRow>
                                <TableCell colSpan={5} className="h-24 text-center">
                                    No se encontraron productos.
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </CardContent>
        </Card>
    </div>
  );
}
