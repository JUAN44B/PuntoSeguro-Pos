
"use client"
import * as React from "react";
import Image from "next/image"
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
import { products as initialProducts } from "@/lib/data"
import { useToast } from "@/hooks/use-toast";
import type { Product } from "@/lib/types";
import AddProductDialog from "./components/add-product-dialog";


export default function ProductsPage() {
    const [products, setProducts] = React.useState(initialProducts);
    const { toast } = useToast();

    const handleAddProduct = (newProduct: Product) => {
        setProducts(prev => [newProduct, ...prev]);
        toast({
            title: "Product Added",
            description: `"${newProduct.name}" has been added to your products.`,
        });
    };

    const handleDeleteProduct = (productId: string) => {
        setProducts(prev => prev.filter(p => p.id !== productId));
        toast({
            variant: "destructive",
            title: "Product Deleted",
            description: "The product has been removed.",
        });
    };
  
  return (
    <Tabs defaultValue="all">
      <div className="flex items-center">
        <TabsList>
          <TabsTrigger value="all">All</TabsTrigger>
          <TabsTrigger value="active">Active</TabsTrigger>
          <TabsTrigger value="draft">Draft</TabsTrigger>
          <TabsTrigger value="archived" className="hidden sm:flex">
            Archived
          </TabsTrigger>
        </TabsList>
        <div className="ml-auto flex items-center gap-2">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm" className="h-7 gap-1">
                <ListFilter className="h-3.5 w-3.5" />
                <span className="sr-only sm:not-sr-only sm:whitespace-nowrap">
                  Filter
                </span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>Filter by</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuCheckboxItem checked>
                Active
              </DropdownMenuCheckboxItem>
              <DropdownMenuCheckboxItem>Draft</DropdownMenuCheckboxItem>
              <DropdownMenuCheckboxItem>
                Archived
              </DropdownMenuCheckboxItem>
            </DropdownMenuContent>
          </DropdownMenu>
          <Button size="sm" variant="outline" className="h-7 gap-1">
            <File className="h-3.5 w-3.5" />
            <span className="sr-only sm:not-sr-only sm:whitespace-nowrap">
              Export
            </span>
          </Button>
          <AddProductDialog onProductAdd={handleAddProduct}>
            <Button size="sm" className="h-7 gap-1">
                <PlusCircle className="h-3.5 w-3.5" />
                <span className="sr-only sm:not-sr-only sm:whitespace-nowrap">
                Add Product
                </span>
            </Button>
          </AddProductDialog>
        </div>
      </div>
      <TabsContent value="all">
        <Card>
          <CardHeader>
            <CardTitle>Products</CardTitle>
            <CardDescription>
              Manage your products and view their sales performance.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="hidden w-[100px] sm:table-cell">
                    <span className="sr-only">Image</span>
                  </TableHead>
                  <TableHead>Name</TableHead>
                  <TableHead>Category</TableHead>
                  <TableHead className="hidden md:table-cell">
                    Stock
                  </TableHead>
                  <TableHead className="hidden md:table-cell">
                    Price
                  </TableHead>
                  <TableHead>
                    <span className="sr-only">Actions</span>
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {products.map((product) => (
                    <TableRow key={product.id}>
                    <TableCell className="hidden sm:table-cell">
                        <Image
                        alt={product.name}
                        className="aspect-square rounded-md object-cover"
                        height="64"
                        src={product.imageUrl}
                        width="64"
                        data-ai-hint={product.imageHint}
                        />
                    </TableCell>
                    <TableCell className="font-medium">
                        {product.name}
                        <div className="text-xs text-muted-foreground">{product.id}</div>
                    </TableCell>
                    <TableCell>
                        <Badge variant="outline">{product.category}</Badge>
                    </TableCell>
                    <TableCell className="hidden md:table-cell">
                        {product.stock > 10 ? (
                            <span>{product.stock}</span>
                        ) : (
                            <Badge variant="destructive">Low Stock ({product.stock})</Badge>
                        )}
                    </TableCell>
                    <TableCell className="hidden md:table-cell">
                        ${product.salePrice.toFixed(2)}
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
                            <DropdownMenuItem>Edit</DropdownMenuItem>
                            <DropdownMenuItem onClick={() => handleDeleteProduct(product.id)}>Delete</DropdownMenuItem>
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
              Showing <strong>1-{products.length}</strong> of <strong>{products.length}</strong>{" "}
              products
            </div>
          </CardFooter>
        </Card>
      </TabsContent>
    </Tabs>
  )
}
