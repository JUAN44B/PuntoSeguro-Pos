
'use client';

import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from '@/components/ui/button';
import { ArrowRight, DollarSign, PackageSearch, TrendingUp } from 'lucide-react';
import type { Sale } from './sales/page';
import type { Product } from './products/components/product-dialog';
import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis, Tooltip } from 'recharts';
import { getMockData } from '@/lib/mock-data';

type DailySalesData = {
  name: string;
  total: number;
};

export default function Home() {
  const [sales, setSales] = useState<Sale[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const mockData = getMockData();
    setSales(mockData.sales);
    setProducts(mockData.products);
    setLoading(false);
  }, []);

  const [dailySales, setDailySales] = useState(0);
  const [weeklySales, setWeeklySales] = useState(0);
  const [monthlySales, setMonthlySales] = useState(0);
  const [lowStockProducts, setLowStockProducts] = useState<Product[]>([]);
  const [salesChartData, setSalesChartData] = useState<DailySalesData[]>([]);

  useEffect(() => {
    if (sales.length > 0) {
      const now = new Date();
      const todayStart = new Date(now.setHours(0, 0, 0, 0));
      const weekStart = new Date(new Date().setDate(now.getDate() - now.getDay() + (now.getDay() === 0 ? -6 : 1)));
      weekStart.setHours(0,0,0,0);
      const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);

      let daily = 0;
      let weekly = 0;
      let monthly = 0;
      
      const last7Days: { [key: string]: number } = {};
      for(let i=0; i<7; i++){
          const d = new Date();
          d.setDate(d.getDate() - i);
          const dayName = d.toLocaleDateString('es-MX', { weekday: 'short' });
          last7Days[dayName] = 0;
      }

      sales.forEach(sale => {
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
        
        const dayDiff = (todayStart.getTime() - new Date(saleDate.setHours(0,0,0,0)).getTime()) / (1000 * 3600 * 24);
        if(dayDiff < 7){
           const dayName = saleDate.toLocaleDateString('es-MX', { weekday: 'short' });
           if(last7Days[dayName] !== undefined){
              last7Days[dayName] += sale.total;
           }
        }
      });
      
      setDailySales(daily);
      setWeeklySales(weekly);
      setMonthlySales(monthly);
      setSalesChartData(Object.keys(last7Days).map(key => ({name: key, total: last7Days[key]})).reverse());
    }
  }, [sales]);

  useEffect(() => {
    if (products.length > 0) {
      const lowStock = products.filter(p => p.stock <= 5);
      setLowStockProducts(lowStock);
    }
  }, [products]);
  
  const isLoading = loading;

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(amount);
  };

  return (
    <div className="flex flex-col gap-6">
      <h1 className="text-4xl font-bold">Dashboard</h1>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Card */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Rendimiento Mensual</CardTitle>
            <CardDescription>Resumen de las ventas del mes en curso.</CardDescription>
          </CardHeader>
          <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
            <div>
              {isLoading ? (
                <div className="space-y-4">
                  <div className="h-12 w-48 bg-muted rounded animate-pulse" />
                  <div className="h-6 w-32 bg-muted rounded animate-pulse" />
                  <div className="h-4 w-full bg-muted rounded animate-pulse" />
                </div>
              ) : (
                <>
                  <p className="text-5xl font-bold text-primary">{formatCurrency(monthlySales)}</p>
                  <p className="text-green-500 flex items-center gap-2 mt-2">
                    <TrendingUp className="h-5 w-5" />
                    <span className="font-semibold">+5.4%</span>
                    <span className="text-muted-foreground">vs. mes pasado (próximamente)</span>
                  </p>
                  <p className="text-muted-foreground mt-4">Este es el ingreso total generado en lo que va del mes.</p>
                </>
              )}
               <Button className="mt-6 bg-accent hover:bg-accent/90 text-accent-foreground gap-2">Ver Reporte Detallado <ArrowRight className="h-4 w-4" /></Button>
            </div>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                {isLoading ? <div className='w-full h-full bg-muted rounded-lg animate-pulse'/> : (
                  <BarChart data={salesChartData}>
                    <XAxis dataKey="name" stroke="#888888" fontSize={12} tickLine={false} axisLine={false} />
                    <YAxis stroke="#888888" fontSize={12} tickLine={false} axisLine={false} tickFormatter={(value) => `$${value}`} />
                    <Tooltip 
                       cursor={{fill: 'hsla(var(--muted))'}}
                       contentStyle={{backgroundColor: 'hsl(var(--background))', border: '1px solid hsl(var(--border))', borderRadius: 'var(--radius)'}}
                    />
                    <Bar dataKey="total" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} />
                  </BarChart>
                )}
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Side Cards */}
        <div className="space-y-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Ventas de la Semana</CardTitle>
              <DollarSign className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              {isLoading ? <div className="h-8 w-24 bg-muted rounded animate-pulse" /> : <div className="text-2xl font-bold">{formatCurrency(weeklySales)}</div>}
              <p className="text-xs text-muted-foreground">Total de esta semana</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Ventas del Día</CardTitle>
              <DollarSign className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              {isLoading ? <div className="h-8 w-24 bg-muted rounded animate-pulse" /> : <div className="text-2xl font-bold">{formatCurrency(dailySales)}</div>}
              <p className="text-xs text-muted-foreground">Total de ventas de hoy</p>
            </CardContent>
          </Card>
           <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium flex items-center justify-between">
                <span>Pocas Existencias</span>
                <PackageSearch className="h-4 w-4 text-muted-foreground" />
              </CardTitle>
            </CardHeader>
            <CardContent>
              {isLoading ? <div className="h-8 w-12 bg-muted rounded animate-pulse mb-2" /> : <div className="text-2xl font-bold">{lowStockProducts.length}</div>}
              <p className="text-xs text-muted-foreground">Productos con 5 o menos unidades.</p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
