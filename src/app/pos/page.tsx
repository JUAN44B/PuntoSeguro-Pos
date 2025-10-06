'use client';

import { useState } from 'react';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Plus, Minus, X, Search, Save, Ban } from 'lucide-react';
import Image from 'next/image';
import { PaymentDialog } from './components/payment-dialog';
import { ReceiptDialog } from './components/receipt-dialog';

export type CartItem = {
  id: string;
  name: string;
  price: number;
  quantity: number;
  image: string;
};

const initialProducts = [
    { id: "prod-001", name: "Balero 6203", price: 130.00, image: "https://picsum.photos/seed/1/100/100", category: "Baleros" },
    { id: "prod-002", name: "Retén 12345", price: 80.50, image: "https://picsum.photos/seed/2/100/100", category: "Retenes" },
    { id: "prod-003", name: "Aceite Multigrado", price: 250.00, image: "https://picsum.photos/seed/3/100/100", category: "Lubricantes" },
    { id: "prod-004", name: "Tornillo de Rueda", price: 25.00, image: "https://picsum.photos/seed/4/100/100", category: "Tornillería" },
    { id: "prod-005", name: "Gato Hidráulico 2 Ton", price: 1200.00, image: "https://picsum.photos/seed/5/100/100", category: "Herramientas" },
    { id: "prod-006", name: "Filtro de Aire", price: 150.00, image: "https://picsum.photos/seed/6/100/100", category: "Filtros" },
    { id: "prod-007", name: "Bujía de Iridio", price: 220.00, image: "https://picsum.photos/seed/7/100/100", category: "Encendido" },
    { id: "prod-008", name: "Balata Cerámica", price: 450.00, image: "https://picsum.photos/seed/8/100/100", category: "Frenos" },
];


export default function POSPage() {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [isPaymentOpen, setIsPaymentOpen] = useState(false);
  const [isReceiptOpen, setIsReceiptOpen] = useState(false);
  const [lastSale, setLastSale] = useState<{ cart: CartItem[], total: number, paymentMethod: string } | null>(null);

  const addToCart = (product: Omit<CartItem, 'quantity'>) => {
    setCart(prevCart => {
      const existingItem = prevCart.find(item => item.id === product.id);
      if (existingItem) {
        return prevCart.map(item =>
          item.id === product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }
      return [...prevCart, { ...product, quantity: 1 }];
    });
  };

  const updateQuantity = (productId: string, amount: number) => {
    setCart(prevCart => {
      return prevCart
        .map(item =>
          item.id === productId
            ? { ...item, quantity: item.quantity + amount }
            : item
        )
        .filter(item => item.quantity > 0);
    });
  };

  const removeFromCart = (productId: string) => {
    setCart(prevCart => prevCart.filter(item => item.id !== productId));
  };

  const cancelSale = () => {
    setCart([]);
  }

  const handlePaymentSuccess = (paymentMethod: string) => {
    setLastSale({ cart, total, paymentMethod });
    setIsPaymentOpen(false);
    setIsReceiptOpen(true);
    setCart([]); // Clear cart after successful payment
  };
  
  const filteredProducts = initialProducts.filter(p => p.name.toLowerCase().includes(searchTerm.toLowerCase()));

  const subtotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  // Assuming total includes 16% IVA
  const total = subtotal * 1.16;
  const iva = total - subtotal;


  return (
    <>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 h-[calc(100vh-8rem)]">
        {/* Product Grid */}
        <div className="lg:col-span-2 flex flex-col gap-4">
          <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
              <Input 
                  placeholder="Buscar producto por nombre o código..." 
                  className="pl-10"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
              />
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 overflow-y-auto pr-2">
              {filteredProducts.map(product => (
                  <Card 
                      key={product.id} 
                      className="cursor-pointer hover:shadow-lg transition-shadow"
                      onClick={() => addToCart(product)}
                  >
                      <CardContent className="p-0 flex flex-col items-center justify-center">
                          <div className="relative w-full aspect-square">
                              <Image 
                                  src={product.image} 
                                  alt={product.name}
                                  fill
                                  className="object-cover rounded-t-lg"
                                  data-ai-hint="product image"
                              />
                          </div>
                          <p className="text-sm font-medium p-2 text-center h-12 flex items-center">{product.name}</p>
                          <p className="text-xs font-bold p-2 bg-muted w-full text-center rounded-b-lg">${product.price.toFixed(2)}</p>
                      </CardContent>
                  </Card>
              ))}
          </div>
        </div>

        {/* Cart */}
        <div className="lg:col-span-1 bg-card border rounded-lg flex flex-col h-full shadow-lg">
          <CardHeader>
            <CardTitle>Venta Actual</CardTitle>
          </CardHeader>
          <CardContent className="flex-1 overflow-y-auto px-0">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Producto</TableHead>
                  <TableHead>Cant.</TableHead>
                  <TableHead>Total</TableHead>
                  <TableHead></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                  {cart.length === 0 && (
                      <TableRow>
                          <TableCell colSpan={4} className="text-center text-muted-foreground py-10">
                              Agrega productos a la venta
                          </TableCell>
                      </TableRow>
                  )}
                  {cart.map(item => (
                      <TableRow key={item.id}>
                          <TableCell className='font-medium'>{item.name}</TableCell>
                          <TableCell>
                          <div className="flex items-center gap-1">
                              <Button variant="ghost" size="icon" className="h-6 w-6" onClick={() => updateQuantity(item.id, -1)}><Minus className="h-3 w-3" /></Button>
                              <span>{item.quantity}</span>
                              <Button variant="ghost" size="icon" className="h-6 w-6" onClick={() => updateQuantity(item.id, 1)}><Plus className="h-3 w-3" /></Button>
                          </div>
                          </TableCell>
                          <TableCell>${(item.price * item.quantity).toFixed(2)}</TableCell>
                          <TableCell>
                              <Button variant="ghost" size="icon" className="h-6 w-6" onClick={() => removeFromCart(item.id)}><X className="h-4 w-4 text-destructive" /></Button>
                          </TableCell>
                      </TableRow>
                  ))}
              </TableBody>
            </Table>
          </CardContent>
          <div className="p-6 border-t mt-auto">
              <div className="space-y-2 mb-6">
                  <div className="flex justify-between text-sm">
                      <span>Subtotal</span>
                      <span>${subtotal.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                      <span>IVA (16%)</span>
                      <span>${iva.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between font-bold text-lg">
                      <span>Total</span>
                      <span>${total.toFixed(2)}</span>
                  </div>
              </div>
            <div className="grid grid-cols-1 gap-2">
              <Button size="lg" className="h-14 text-lg" onClick={() => setIsPaymentOpen(true)} disabled={cart.length === 0}>Pagar</Button>
              <div className='grid grid-cols-2 gap-2'>
                  <Button variant="outline" className='gap-2'><Save className='h-4 w-4'/>Guardar Venta</Button>
                  <Button variant="destructive" className='gap-2' onClick={cancelSale}><Ban className='h-4 w-4' />Cancelar</Button>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <PaymentDialog
        isOpen={isPaymentOpen}
        onOpenChange={setIsPaymentOpen}
        totalAmount={total}
        onPaymentSuccess={handlePaymentSuccess}
      />

      {lastSale && (
        <ReceiptDialog
          isOpen={isReceiptOpen}
          onOpenChange={setIsReceiptOpen}
          saleData={lastSale}
        />
      )}
    </>
  );
}
