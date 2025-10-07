'use client';

import { useState, useEffect } from 'react';
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Plus, Minus, X, Search, Save, Ban, Tag, AlertCircle, Trash2, Upload } from 'lucide-react';
import Image from 'next/image';
import { PaymentDialog } from './components/payment-dialog';
import { ReceiptDialog } from './components/receipt-dialog';
import { DiscountDialog } from './components/discount-dialog';
import { useFirestore, useCollection } from '@/firebase';
import { collection, addDoc, serverTimestamp, doc, updateDoc, increment, query, orderBy, limit, deleteDoc } from 'firebase/firestore';
import type { Product } from '../products/components/product-dialog';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { CashSession } from '../cash-management/page';


export type CartItem = {
  id: string;
  name: string;
  price: number;
  quantity: number;
  image: string;
  discount: number; // Percentage discount
};

type PendingSale = {
  id: string;
  savedAt: { seconds: number } | null;
  cart: CartItem[];
}

type ProductFromDB = Product & { id: string };

export default function POSPage() {
  const firestore = useFirestore();
  const { data: products, loading } = useCollection(collection(firestore, 'products'));

  // Get active cash session
  const sessionsQuery = query(
      collection(firestore, 'cashSessions'),
      orderBy('openedAt', 'desc'),
      limit(1)
  );
  const { data: sessions } = useCollection(sessionsQuery);
  const activeSession = sessions.length > 0 && (sessions[0] as CashSession).status === 'abierta' ? sessions[0] as CashSession : null;

  // Get pending sales
  const pendingSalesQuery = query(collection(firestore, 'pendingSales'), orderBy('savedAt', 'desc'));
  const { data: pendingSales, loading: pendingSalesLoading } = useCollection(pendingSalesQuery);

  const [cart, setCart] = useState<CartItem[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [isPaymentOpen, setIsPaymentOpen] = useState(false);
  const [isReceiptOpen, setIsReceiptOpen] = useState(false);
  const [isDiscountOpen, setIsDiscountOpen] = useState(false);
  const [selectedCartItem, setSelectedCartItem] = useState<CartItem | null>(null);
  const [lastSale, setLastSale] = useState<{ cart: CartItem[], total: number, paymentMethod: string } | null>(null);
  const [posError, setPosError] = useState<string | null>(null);

  useEffect(() => {
    // Clear error when cart changes
    if (posError) setPosError(null);
  }, [cart]);

  const handleOpenPayment = () => {
    if (cart.length === 0) {
      setPosError('El carrito está vacío. Agrega productos para poder pagar.');
      return;
    }
    if (!activeSession) {
      setPosError('No hay una sesión de caja abierta. Ve a "Gestión de Caja" para abrir una.');
      return;
    }
    setPosError(null);
    setIsPaymentOpen(true);
  }

  const addToCart = (product: ProductFromDB) => {
    if (product.stock <= 0) {
      setPosError(`El producto "${product.name}" no tiene existencias.`);
      return;
    }

    setCart(prevCart => {
      const existingItem = prevCart.find(item => item.id === product.id);
      if (existingItem) {
         if (existingItem.quantity >= product.stock) {
            setPosError(`No puedes agregar más de ${product.stock} unidades de "${product.name}".`);
            return prevCart;
         }
        return prevCart.map(item =>
          item.id === product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }
      return [...prevCart, { id: product.id, name: product.name, price: product.finalPrice, image: product.image, quantity: 1, discount: 0 }];
    });
  };

  const updateQuantity = (productId: string, amount: number) => {
    setCart(prevCart => {
      return prevCart
        .map(item => {
            if (item.id === productId) {
                const productInDb = (products as ProductFromDB[]).find(p => p.id === productId);
                const newQuantity = item.quantity + amount;
                if (productInDb && newQuantity > productInDb.stock) {
                    setPosError(`No puedes agregar más de ${productInDb.stock} unidades de "${item.name}".`);
                    return item; // return original item
                }
                return { ...item, quantity: newQuantity };
            }
            return item;
        })
        .filter(item => item.quantity > 0);
    });
  };

  const removeFromCart = (productId: string) => {
    setCart(prevCart => prevCart.filter(item => item.id !== productId));
  };
  
  const handleDiscountClick = (item: CartItem) => {
    setSelectedCartItem(item);
    setIsDiscountOpen(true);
  };
  
  const handleSaveDiscount = (discount: number) => {
    if (selectedCartItem) {
        setCart(prevCart => prevCart.map(item => 
            item.id === selectedCartItem.id ? { ...item, discount } : item
        ));
    }
    setIsDiscountOpen(false);
    setSelectedCartItem(null);
  };

  const cancelSale = () => {
    setCart([]);
    setPosError(null);
  }

  const handleSaveSale = async () => {
    if(cart.length === 0) {
      setPosError('No puedes guardar una venta vacía.');
      return;
    }
    try {
        await addDoc(collection(firestore, 'pendingSales'), {
            savedAt: serverTimestamp(),
            cart: cart
        });
        cancelSale();
    } catch(e) {
        console.error('Error saving sale: ', e);
        setPosError('Error al guardar la venta.');
    }
  }
  
  const handleLoadSale = async (pendingSale: PendingSale) => {
    if (cart.length > 0) {
        const proceed = confirm('Tienes una venta en curso. ¿Deseas reemplazarla con la venta guardada?');
        if (!proceed) return;
    }
    setCart(pendingSale.cart);
    await deleteDoc(doc(firestore, 'pendingSales', pendingSale.id));
  };
  
  const handleDeletePendingSale = async (pendingSaleId: string) => {
    await deleteDoc(doc(firestore, 'pendingSales', pendingSaleId));
  }


  const handlePaymentSuccess = async (paymentMethod: string) => {
    const saleId = `ALIRU-${Date.now().toString().slice(-6)}`;
    const saleData = {
      saleId,
      createdAt: serverTimestamp(),
      items: cart.map(({ image, ...item }) => ({
        ...item,
        price: item.price * (1 - item.discount / 100), // Final price with discount
      })),
      total,
      subtotal,
      iva,
      paymentMethod,
    };
    
    try {
      // 1. Save the sale record
      await addDoc(collection(firestore, 'sales'), saleData);
      
      // 2. Update stock for each product sold
      for (const item of cart) {
        const productRef = doc(firestore, 'products', item.id);
        await updateDoc(productRef, {
          stock: increment(-item.quantity)
        });
      }

      // 3. If payment is cash, update the active cash session
      if (paymentMethod === 'Efectivo' && activeSession) {
          const sessionRef = doc(firestore, 'cashSessions', activeSession.id);
          await updateDoc(sessionRef, {
              cashSales: increment(total)
          });
      }
      
      // 4. Prepare for receipt
      setLastSale({ cart, total, paymentMethod });
      setIsPaymentOpen(false);
      setIsReceiptOpen(true);
      setCart([]); // Clear cart after successful payment
    } catch (error) {
      console.error("Error processing sale: ", error);
      setPosError('Hubo un error al procesar la venta. Inténtalo de nuevo.');
    }
  };
  
  const filteredProducts = (products as ProductFromDB[] || []).filter(p => 
    p.status === 'Activo' && (
      p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (p.code && p.code.toLowerCase().includes(searchTerm.toLowerCase()))
    )
  );

  const total = cart.reduce((sum, item) => {
      const finalPrice = item.price * (1 - item.discount / 100);
      return sum + finalPrice * item.quantity;
  }, 0);
  const subtotal = total / 1.16;
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
              {loading && <p>Cargando productos...</p>}
              {filteredProducts.map(product => (
                  <Card 
                      key={product.id} 
                      className="cursor-pointer hover:shadow-lg transition-shadow relative"
                      onClick={() => addToCart(product)}
                  >
                      <CardContent className="p-0 flex flex-col items-center justify-center">
                          <div className="relative w-full aspect-square">
                              <Image 
                                  src={product.image || "https://picsum.photos/seed/placeholder/100/100"} 
                                  alt={product.name}
                                  fill
                                  className="object-cover rounded-t-lg"
                                  data-ai-hint="product image"
                              />
                          </div>
                          {product.stock <= 0 && <div className='absolute inset-0 bg-black/60 flex items-center justify-center rounded-lg'><span className='text-white font-bold text-sm'>SIN STOCK</span></div>}
                          {product.stock > 0 && product.stock <= 5 && <div className='absolute top-1 right-1 bg-destructive text-destructive-foreground text-xs font-bold px-2 py-0.5 rounded-full'>{product.stock} disp.</div>}
                          <p className="text-sm font-medium p-2 text-center h-12 flex items-center">{product.name}</p>
                          <p className="text-xs font-bold p-2 bg-muted w-full text-center rounded-b-lg">${product.finalPrice.toFixed(2)}</p>
                      </CardContent>
                  </Card>
              ))}
          </div>
        </div>

        {/* Cart and Pending Sales */}
        <div className="lg:col-span-1 bg-card border rounded-lg flex flex-col h-full shadow-lg">
          <Tabs defaultValue="current" className="h-full flex flex-col">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="current">Venta Actual</TabsTrigger>
              <TabsTrigger value="pending">Ventas Pendientes ({pendingSales.length})</TabsTrigger>
            </TabsList>
            
            <TabsContent value="current" className="flex-1 flex flex-col">
              <CardHeader>
                <CardTitle>Venta Actual</CardTitle>
                {posError && (
                  <Alert variant="destructive" className="mt-2">
                      <AlertCircle className="h-4 w-4" />
                      <AlertDescription>
                          {posError}
                      </AlertDescription>
                  </Alert>
                )}
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
                      {cart.map(item => {
                          const finalPrice = item.price * (1 - item.discount / 100);
                          const totalItemPrice = finalPrice * item.quantity;
                          return (
                          <TableRow key={item.id}>
                              <TableCell className='font-medium'>
                                <div>{item.name}</div>
                                {item.discount > 0 && (
                                    <div className='text-xs text-green-500'>-{item.discount}%</div>
                                )}
                              </TableCell>
                              <TableCell>
                              <div className="flex items-center gap-1">
                                  <Button variant="ghost" size="icon" className="h-6 w-6" onClick={() => updateQuantity(item.id, -1)}><Minus className="h-3 w-3" /></Button>
                                  <span>{item.quantity}</span>
                                  <Button variant="ghost" size="icon" className="h-6 w-6" onClick={() => updateQuantity(item.id, 1)}><Plus className="h-3 w-3" /></Button>
                              </div>
                              </TableCell>
                              <TableCell>
                                <div className='flex flex-col items-end'>
                                    {item.discount > 0 && <span className='text-xs line-through text-muted-foreground'>${(item.price * item.quantity).toFixed(2)}</span>}
                                    <button onClick={() => handleDiscountClick(item)} className="font-bold flex items-center gap-1 hover:text-primary transition-colors">
                                      ${totalItemPrice.toFixed(2)}
                                      <Tag className='h-3 w-3' />
                                    </button>
                                </div>
                              </TableCell>
                              <TableCell>
                                  <Button variant="ghost" size="icon" className="h-6 w-6" onClick={() => removeFromCart(item.id)}><X className="h-4 w-4 text-destructive" /></Button>
                              </TableCell>
                          </TableRow>
                      )})}
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
                  <Button size="lg" className="h-14 text-lg" onClick={handleOpenPayment} disabled={cart.length === 0}>Pagar</Button>
                  <div className='grid grid-cols-2 gap-2'>
                      <Button variant="outline" className='gap-2' onClick={handleSaveSale} disabled={cart.length === 0}><Save className='h-4 w-4'/>Guardar Venta</Button>
                      <Button variant="destructive" className='gap-2' onClick={cancelSale}><Ban className='h-4 w-4' />Cancelar</Button>
                  </div>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="pending" className="flex-1 flex flex-col overflow-y-auto">
              <CardHeader>
                <CardTitle>Ventas Pendientes</CardTitle>
              </CardHeader>
              <CardContent className="flex-1 space-y-2">
                {pendingSalesLoading && <p className='text-center text-muted-foreground'>Cargando...</p>}
                {!pendingSalesLoading && (pendingSales as PendingSale[]).length === 0 && (
                  <p className='text-center text-muted-foreground py-10'>No hay ventas guardadas.</p>
                )}
                {(pendingSales as PendingSale[]).map(sale => {
                  const saleTotal = sale.cart.reduce((sum, item) => sum + (item.price * (1 - item.discount / 100) * item.quantity), 0);
                  return (
                    <div key={sale.id} className="border p-3 rounded-lg flex justify-between items-center">
                        <div>
                            <p className='font-semibold'>Total: ${saleTotal.toFixed(2)}</p>
                            <p className='text-xs text-muted-foreground'>
                                Guardada: {sale.savedAt ? new Date(sale.savedAt.seconds * 1000).toLocaleTimeString() : 'Guardando...'} | {sale.cart.length} productos
                            </p>
                        </div>
                        <div className='flex gap-2'>
                           <Button size="sm" variant="outline" className='gap-1' onClick={() => handleLoadSale(sale)}><Upload className='h-4 w-4'/> Cargar</Button>
                           <Button size="sm" variant="ghost" className='text-destructive' onClick={() => handleDeletePendingSale(sale.id)}><Trash2 className='h-4 w-4'/> </Button>
                        </div>
                    </div>
                )})}
              </CardContent>
            </TabsContent>

          </Tabs>
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

      <DiscountDialog
        isOpen={isDiscountOpen}
        onOpenChange={setIsDiscountOpen}
        onSave={handleSaveDiscount}
        initialDiscount={selectedCartItem?.discount || 0}
        productName={selectedCartItem?.name || ''}
      />
    </>
  );
}
