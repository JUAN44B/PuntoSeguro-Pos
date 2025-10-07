'use client';

import { useState, useMemo } from 'react';
import { useFirestore, useCollection } from '@/firebase';
import { collection, query, orderBy, doc, updateDoc, increment } from 'firebase/firestore';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Search, FileText, Undo } from 'lucide-react';
import { ReceiptDialog } from '../pos/components/receipt-dialog';
import type { CartItem } from '../pos/page';
import { ReturnDialog } from './components/return-dialog';

// Define the shape of a sale item and a sale
export type SaleItem = {
    id: string;
    name: string;
    price: number;
    quantity: number;
    discount?: number;
};

export type Sale = {
    id: string; // Document ID from Firestore
    saleId: string; // Human-readable sale ID
    createdAt: {
        seconds: number;
        nanoseconds: number;
    };
    items: SaleItem[];
    total: number;
    paymentMethod: string;
    returned?: boolean; // To track if the sale has been returned
    userId: string;
    userName: string;
};


const getPaymentMethodName = (method: string) => {
    return method;
}

export default function SalesHistoryPage() {
    const firestore = useFirestore();
    // Query sales and order them by creation date, descending
    const salesQuery = query(collection(firestore, 'sales'), orderBy('createdAt', 'desc'));
    const { data: sales, loading, error } = useCollection(salesQuery);

    const [searchTerm, setSearchTerm] = useState('');
    const [isReceiptOpen, setIsReceiptOpen] = useState(false);
    const [isReturnOpen, setIsReturnOpen] = useState(false);
    const [selectedSale, setSelectedSale] = useState<Sale | null>(null);

    const handleViewReceipt = (sale: Sale) => {
        setSelectedSale(sale);
        setIsReceiptOpen(true);
    }
    
    const handleReturnClick = (sale: Sale) => {
        setSelectedSale(sale);
        setIsReturnOpen(true);
    }

    const handleProcessReturn = async (returnedItems: { id: string; quantity: number }[]) => {
        if (!selectedSale) return;

        try {
            // 1. Update stock for each returned item
            for (const item of returnedItems) {
                if (item.quantity > 0) {
                    const productRef = doc(firestore, 'products', item.id);
                    await updateDoc(productRef, {
                        stock: increment(item.quantity)
                    });
                }
            }
            
            // 2. Mark the sale as returned in Firestore
            const saleRef = doc(firestore, 'sales', selectedSale.id);
            await updateDoc(saleRef, {
                returned: true
            });

            // Here you could also create a 'returns' document in a new collection for detailed tracking

            console.log('Return processed successfully!');
        } catch (error) {
            console.error("Error processing return: ", error);
        } finally {
            setIsReturnOpen(false);
            setSelectedSale(null);
        }
    };


    const filteredSales = useMemo(() => {
        if (!sales) return [];
        if (!searchTerm) return sales as Sale[];

        const lowercasedFilter = searchTerm.toLowerCase();
        
        return (sales as Sale[]).filter(sale => {
            const saleDate = new Date(sale.createdAt.seconds * 1000).toLocaleDateString('es-MX');
            return (
                sale.saleId.toLowerCase().includes(lowercasedFilter) ||
                saleDate.includes(lowercasedFilter)
            );
        });
    }, [sales, searchTerm]);

    return (
        <>
            <div className="flex flex-col gap-8">
                <div className="flex items-center">
                    <h1 className="font-semibold text-4xl">Ventas Históricas</h1>
                </div>

                <Card>
                    <CardHeader>
                        <CardTitle>Registro de Ventas</CardTitle>
                        <CardDescription>Consulta, busca y gestiona todas las ventas realizadas.</CardDescription>
                        <div className="relative max-w-sm mt-4">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                            <Input
                                placeholder="Buscar por folio o fecha (dd/mm/yyyy)..."
                                className="pl-10"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                        </div>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-4">
                            {loading && <p className="text-muted-foreground text-center">Cargando ventas...</p>}
                            {!loading && error && <p className="text-destructive text-center">Error al cargar las ventas.</p>}
                            {!loading && filteredSales.length === 0 && (
                                <p className="text-muted-foreground text-center py-10">No se encontraron ventas.</p>
                            )}
                            {filteredSales.map(sale => (
                                <Card key={sale.id} className="shadow-sm">
                                    <CardHeader className='pb-4'>
                                        <div className="flex justify-between items-start">
                                            <div>
                                                <CardTitle className="text-lg">Folio: {sale.saleId}</CardTitle>
                                                <CardDescription>
                                                    {new Date(sale.createdAt.seconds * 1000).toLocaleString('es-MX', {
                                                        dateStyle: 'long',
                                                        timeStyle: 'short',
                                                    })}
                                                </CardDescription>
                                            </div>
                                            <div className="text-right">
                                                <p className="text-2xl font-bold">${sale.total.toFixed(2)}</p>
                                                <div className="flex items-center justify-end gap-2">
                                                    {sale.returned && <span className="text-xs font-semibold text-destructive">(Devolución)</span>}
                                                    <p className="text-sm text-muted-foreground">{getPaymentMethodName(sale.paymentMethod)}</p>
                                                </div>
                                            </div>
                                        </div>
                                    </CardHeader>
                                    <CardContent>
                                        <div className="border-t pt-4">
                                            <h4 className="font-semibold mb-2 text-sm">Productos vendidos:</h4>
                                            <ul className="list-disc list-inside text-sm text-muted-foreground space-y-1">
                                                {sale.items.map(item => (
                                                    <li key={item.id}>
                                                        {item.quantity}x {item.name} - ${(item.price * item.quantity).toFixed(2)}
                                                        {item.discount && item.discount > 0 && ` (-${item.discount}%)`}
                                                    </li>
                                                ))}
                                            </ul>
                                        </div>
                                        <div className="flex justify-end gap-2 mt-4 border-t pt-4">
                                            <Button variant="outline" size="sm" className='gap-2' onClick={() => handleViewReceipt(sale)}>
                                                <FileText className='h-4 w-4'/>
                                                Ver Ticket
                                            </Button>
                                            <Button variant="secondary" size="sm" className='gap-2' onClick={() => handleReturnClick(sale)} disabled={sale.returned}>
                                                <Undo className='h-4 w-4'/>
                                                {sale.returned ? 'Devolución Procesada' : 'Realizar Devolución'}
                                            </Button>
                                        </div>
                                    </CardContent>
                                </Card>
                            ))}
                        </div>
                    </CardContent>
                </Card>
            </div>
            {selectedSale && (
                <ReceiptDialog
                    isOpen={isReceiptOpen}
                    onOpenChange={setIsReceiptOpen}
                    saleData={{
                        cart: selectedSale.items.map(item => ({...item, image: '', discount: item.discount || 0})) as CartItem[],
                        total: selectedSale.total,
                        paymentMethod: selectedSale.paymentMethod,
                        userName: selectedSale.userName,
                    }}
                    saleIdFromProps={selectedSale.saleId}
                />
            )}
             {selectedSale && (
                <ReturnDialog
                    isOpen={isReturnOpen}
                    onOpenChange={setIsReturnOpen}
                    sale={selectedSale}
                    onProcessReturn={handleProcessReturn}
                />
            )}
        </>
    );
}
