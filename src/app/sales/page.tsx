'use client';

import { useState, useMemo } from 'react';
import { useFirestore, useCollection } from '@/firebase';
import { collection, query, orderBy } from 'firebase/firestore';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Search, FileText, Undo } from 'lucide-react';

// Define the shape of a sale item and a sale
type SaleItem = {
    id: string;
    name: string;
    price: number;
    quantity: number;
};

type Sale = {
    id: string; // Document ID from Firestore
    saleId: string; // Human-readable sale ID
    createdAt: {
        seconds: number;
        nanoseconds: number;
    };
    items: SaleItem[];
    total: number;
    paymentMethod: string;
};


const getPaymentMethodName = (method: string) => {
    switch(method) {
      case 'cash': return 'Efectivo';
      case 'card': return 'Tarjeta';
      case 'transfer': return 'Transferencia';
      default: return 'Desconocido';
    }
}

export default function SalesHistoryPage() {
    const firestore = useFirestore();
    // Query sales and order them by creation date, descending
    const salesQuery = query(collection(firestore, 'sales'), orderBy('createdAt', 'desc'));
    const { data: sales, loading } = useCollection(salesQuery);

    const [searchTerm, setSearchTerm] = useState('');

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
                                            <p className="text-sm text-muted-foreground">{getPaymentMethodName(sale.paymentMethod)}</p>
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
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                    <div className="flex justify-end gap-2 mt-4 border-t pt-4">
                                        <Button variant="outline" size="sm" className='gap-2'>
                                            <FileText className='h-4 w-4'/>
                                            Ver Ticket
                                        </Button>
                                        <Button variant="secondary" size="sm" className='gap-2'>
                                            <Undo className='h-4 w-4'/>
                                            Realizar Devolución
                                        </Button>
                                    </div>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
