'use client';

import { useEffect, useState } from 'react';
import { useFirestore, useCollection } from '@/firebase';
import { collection } from 'firebase/firestore';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { DollarSign, CreditCard, ShoppingBasket, PackageWarning } from 'lucide-react';
import type { Sale } from './sales/page';
import type { Product } from './products/components/product-dialog';


export default function Home() {
  const firestore = useFirestore();
  const { data: sales, loading: loadingSales } = useCollection(collection(firestore, 'sales'));
  const { data: products, loading: loadingProducts } = useCollection(collection(firestore, 'products'));

  const [dailySales, setDailySales] = useState(0);
  const [weeklySales, setWeeklySales] = useState(0);
  const [monthlySales, setMonthlySales] = useState(0);
  const [lowStockCount, setLowStockCount] = useState(0);

  useEffect(() => {
    if (sales) {
      const now = new Date();
      const todayStart = new Date(now.setHours(0, 0, 0, 0));
      const weekStart = new Date(now.setDate(now.getDate() - now.getDay()));
      weekStart.setHours(0, 0, 0, 0);
      const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);

      let daily = 0;
      let weekly = 0;
      let monthly = 0;

      (sales as Sale[]).forEach(sale => {
        const saleDate = new Date(sale.createdAt.seconds * 1000);
        
        if (saleDate >= todayStart) {
          daily += sale.total;
        }
        if (saleDate >= weekStart) {
          weekly += sale.total;
        }
        if (saleDate >= monthStart) {
          monthly += sale.total;
        }
      });
      
      setDailySales(daily);
      setWeeklySales(weekly);
      setMonthlySales(monthly);
    }
  }, [sales]);

  useEffect(() => {
    if (products) {
      const lowStock = (products as Product[]).filter(p => p.stock <= 5).length;
      setLowStockCount(lowStock);
    }
  }, [products]);
  
  const isLoading = loadingSales || loadingProducts;

  return (
    <div>
      <h1 className="text-4xl font-bold mb-8">Dashboard</h1>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Ventas del Día</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            {isLoading ? <div className="h-8 w-24 bg-muted/50 rounded animate-pulse" /> : <div className="text-2xl font-bold">${dailySales.toFixed(2)}</div>}
            <p className="text-xs text-muted-foreground">Total de ventas de hoy</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Ventas de la Semana</CardTitle>
            <ShoppingBasket className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            {isLoading ? <div className="h-8 w-24 bg-muted/50 rounded animate-pulse" /> : <div className="text-2xl font-bold">${weeklySales.toFixed(2)}</div>}
            <p className="text-xs text-muted-foreground">Total de esta semana</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Ventas del Mes</CardTitle>
            <CreditCard className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            {isLoading ? <div className="h-8 w-24 bg-muted/50 rounded animate-pulse" /> : <div className="text-2xl font-bold">${monthlySales.toFixed(2)}</div>}
            <p className="text-xs text-muted-foreground">Total de este mes</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Productos con poca existencia</CardTitle>
            <PackageWarning className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            {isLoading ? <div className="h-8 w-12 bg-muted/50 rounded animate-pulse" /> : <div className="text-2xl font-bold">{lowStockCount}</div>}
            <p className="text-xs text-muted-foreground">Productos con 5 o menos unidades</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
