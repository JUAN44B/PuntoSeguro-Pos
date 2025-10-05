
"use client";

import * as React from "react";
import Image from "next/image";
import { PlusCircle, Search } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { products } from "@/lib/data";
import type { Product } from "@/lib/types";
import PaymentDialog from "./components/payment-dialog";
import { useToast } from "@/hooks/use-toast";

export default function POSPage() {
  const [cart, setCart] = React.useState<Map<string, { product: Product; quantity: number }>>(new Map());
  const [searchTerm, setSearchTerm] = React.useState("");
  const { toast } = useToast();

  const addToCart = (product: Product) => {
    setCart((prevCart) => {
      const newCart = new Map(prevCart);
      const existingItem = newCart.get(product.id);
      if (existingItem) {
        existingItem.quantity += 1;
      } else {
        newCart.set(product.id, { product, quantity: 1 });
      }
      return newCart;
    });
  };

  const updateQuantity = (productId: string, newQuantity: number) => {
    setCart((prevCart) => {
        const newCart = new Map(prevCart);
        const item = newCart.get(productId);
        if(item) {
            if (newQuantity <= 0) {
                newCart.delete(productId);
            } else {
                item.quantity = newQuantity;
            }
        }
        return newCart;
    });
  };

  const handlePaymentSuccess = () => {
    setCart(new Map());
    toast({
      title: "Sale Completed",
      description: "The transaction was successful.",
    });
  };

  const subtotal = Array.from(cart.values()).reduce(
    (acc, item) => acc + item.product.salePrice * item.quantity,
    0
  );

  const tax = subtotal * 0.16; // Assuming 16% tax
  const total = subtotal + tax;

  const filteredProducts = products.filter(
    (product) =>
      product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.id.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="grid flex-1 grid-cols-1 md:grid-cols-3 gap-8">
      <div className="md:col-span-2">
        <Card>
            <CardHeader>
                <CardTitle>Products</CardTitle>
                <div className="relative mt-2">
                    <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input 
                        placeholder="Search products by name or code..." 
                        className="pl-8"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
            </CardHeader>
            <CardContent className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 max-h-[70vh] overflow-y-auto">
            {filteredProducts.map((product) => (
              <Card key={product.id} className="overflow-hidden flex flex-col">
                <CardContent className="p-0 flex-grow">
                  <Image
                    src={product.imageUrl}
                    alt={product.name}
                    width={200}
                    height={150}
                    className="w-full h-auto aspect-video object-cover"
                    data-ai-hint={product.imageHint}
                  />
                  <div className="p-4">
                    <h3 className="font-semibold text-sm">{product.name}</h3>
                    <p className="text-xs text-muted-foreground">{product.category}</p>
                    <p className="font-bold text-sm mt-1">${product.salePrice.toFixed(2)}</p>
                  </div>
                </CardContent>
                <CardFooter className="p-2 border-t">
                  <Button variant="outline" size="sm" className="w-full gap-1" onClick={() => addToCart(product)}>
                    <PlusCircle className="h-3.5 w-3.5" />
                    Add
                  </Button>
                </CardFooter>
              </Card>
            ))}
            </CardContent>
        </Card>
      </div>
      <div>
        <Card className="sticky top-20">
          <CardHeader>
            <CardTitle>Current Sale</CardTitle>
            <CardDescription>Manage items for this transaction.</CardDescription>
          </CardHeader>
          <CardContent className="max-h-[50vh] overflow-y-auto">
            {cart.size === 0 ? (
                <p className="text-center text-muted-foreground py-8">Cart is empty</p>
            ) : (
                <Table>
                <TableHeader>
                    <TableRow>
                    <TableHead>Product</TableHead>
                    <TableHead>Qty</TableHead>
                    <TableHead className="text-right">Total</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {Array.from(cart.values()).map(({ product, quantity }) => (
                    <TableRow key={product.id}>
                        <TableCell className="font-medium">{product.name}</TableCell>
                        <TableCell>
                            <Input 
                                type="number" 
                                value={quantity} 
                                onChange={(e) => updateQuantity(product.id, parseInt(e.target.value))}
                                className="h-8 w-16"
                                min="0"
                            />
                        </TableCell>
                        <TableCell className="text-right">
                        ${(product.salePrice * quantity).toFixed(2)}
                        </TableCell>
                    </TableRow>
                    ))}
                </TableBody>
                </Table>
            )}
          </CardContent>
          <CardFooter className="flex flex-col space-y-4">
             <div className="w-full space-y-2">
                <div className="flex justify-between text-sm">
                    <span>Subtotal</span>
                    <span>${subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-sm">
                    <span>Tax (16%)</span>
                    <span>${tax.toFixed(2)}</span>
                </div>
                <div className="flex justify-between font-bold text-lg border-t pt-2 mt-2">
                    <span>Total</span>
                    <span>${total.toFixed(2)}</span>
                </div>
             </div>
             <PaymentDialog total={total} onPaymentSuccess={handlePaymentSuccess}>
                <Button className="w-full bg-primary hover:bg-primary/90" size="lg" disabled={cart.size === 0}>
                  Proceed to Payment
                </Button>
            </PaymentDialog>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
}
