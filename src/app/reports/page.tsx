

'use client';

import { useMemo, useRef, useState, useEffect } from 'react';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import {
  Bar,
  BarChart,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from 'recharts';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Download, ArrowUp, ArrowDown, Package, TrendingUp, TrendingDown, Loader2, CalendarDays } from 'lucide-react';
import type { Sale } from '../sales/page';
import type { Product } from '../products/components/product-dialog';
import { getMockData } from '@/lib/mock-data';
import Logo from '@/components/logo';

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8', '#ffc658'];

const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(amount);
};

export default function ReportsPage() {
    const [sales, setSales] = useState<Sale[]>([]);
    const [products, setProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const mockData = getMockData();
        setSales(mockData.sales);
        setProducts(mockData.products);
        setLoading(false);
    }, []);

  const reportsRef = useRef<HTMLDivElement>(null);
  const [isExporting, setIsExporting] = useState(false);
  const isLoading = loading;

  const handleExportToPdf = async () => {
    const input = reportsRef.current;
    if (!input) return;

    setIsExporting(true);
    // Temporarily make it visible for capture
    input.style.display = 'block';
    
    try {
        const canvas = await html2canvas(input, { 
            scale: 2,
            useCORS: true,
            backgroundColor: null, // Use transparent background
        });
        const imgData = canvas.toDataURL('image/png');
        
        const pdf = new jsPDF('p', 'mm', 'a4');
        const pdfWidth = pdf.internal.pageSize.getWidth();
        const imgWidth = canvas.width;
        const imgHeight = canvas.height;
        const ratio = imgWidth / imgHeight;
        
        const width = pdfWidth;
        const height = width / ratio;
        
        pdf.addImage(imgData, 'PNG', 0, 0, width, height);
        pdf.save(`reporte-aliru-${new Date().toLocaleDateString('es-MX')}.pdf`);
    } catch(error) {
        console.error("Error al exportar a PDF:", error);
    } finally {
        setIsExporting(false);
        // Hide it again
        input.style.display = 'none';
    }
  };


  const monthlySalesData = useMemo(() => {
    if (sales.length === 0) return { daily: [], total: 0, bestDay: null, worstDay: null };

    const now = new Date();
    const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);
    const daysInMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0).getDate();
    
    const dailySales: { date: string; value: number }[] = Array.from({ length: daysInMonth }, (_, i) => ({
        date: `${i + 1}`,
        value: 0
    }));

    let total = 0;
    
    sales.forEach(sale => {
      const saleDate = new Date(sale.createdAt.seconds * 1000);
      if (saleDate >= monthStart) {
        total += sale.total;
        const dayOfMonth = saleDate.getDate();
        dailySales[dayOfMonth - 1].value += sale.total;
      }
    });

    const validDays = dailySales.filter(d => d.value > 0);
    const bestDay = validDays.length > 0 ? validDays.reduce((max, day) => day.value > max.value ? day : max) : null;
    const worstDay = validDays.length > 0 ? validDays.reduce((min, day) => day.value < min.value ? day : min) : null;

    return { daily: dailySales, total, bestDay, worstDay };
  }, [sales]);

  const productSalesData = useMemo(() => {
    if (sales.length === 0 || products.length === 0) return { topProducts: [], byCategory: [] };

    const productSales: { [key: string]: { name: string; quantity: number, category: string } } = {};

    sales.forEach(sale => {
      sale.items.forEach(item => {
        const productInfo = products.find(p => p.id === item.id);
        if (productSales[item.id]) {
          productSales[item.id].quantity += item.quantity;
        } else {
          productSales[item.id] = {
            name: item.name,
            quantity: item.quantity,
            category: productInfo?.category || 'Sin categoría'
          };
        }
      });
    });
    
    const topProducts = Object.values(productSales)
      .sort((a, b) => b.quantity - a.quantity)
      .slice(0, 5);

    const categorySales: { [key: string]: number } = {};
     Object.values(productSales).forEach(p => {
        if(categorySales[p.category]){
            categorySales[p.category] += p.quantity;
        } else {
            categorySales[p.category] = p.quantity;
        }
     });
    
    const byCategory = Object.keys(categorySales).map(name => ({name, value: categorySales[name]}));

    return { topProducts, byCategory };
  }, [sales, products]);

  const inventoryStatus = useMemo(() => {
    if (products.length === 0) return { lowStock: [], highStock: [] };
    const lowStock = products.filter(p => p.stock <= 5 && p.status === 'Activo').sort((a,b) => a.stock - b.stock);
    const highStock = products.filter(p => p.stock > 50 && p.status === 'Activo').sort((a,b) => b.stock - a.stock);
    return { lowStock, highStock };
  }, [products]);

  if(isLoading) {
    return (
      <div className="flex flex-col gap-8">
        <div className="flex items-center">
            <div className="h-10 w-64 bg-muted rounded-md animate-pulse" />
            <div className="ml-auto h-10 w-24 bg-muted rounded-md animate-pulse" />
        </div>
        <div className='grid gap-4 md:grid-cols-2 lg:grid-cols-7'>
          <Card className="col-span-1 lg:col-span-5"><CardHeader><div className="h-6 w-48 bg-muted rounded-md animate-pulse" /></CardHeader><CardContent><div className='h-[300px] w-full bg-muted rounded-md animate-pulse'/></CardContent></Card>
          <div className="col-span-1 lg:col-span-2 space-y-4">
             <Card><CardContent className='p-6'><div className='h-20 w-full bg-muted rounded-md animate-pulse'/></CardContent></Card>
             <Card><CardContent className='p-6'><div className='h-20 w-full bg-muted rounded-md animate-pulse'/></CardContent></Card>
             <Card><CardContent className='p-6'><div className='h-20 w-full bg-muted rounded-md animate-pulse'/></CardContent></Card>
          </div>
        </div>
      </div>
    )
  }

  return (
    <>
      <div className="flex flex-col gap-8">
        <div className="flex items-center">
          <h1 className="font-semibold text-4xl">Reportes de Rendimiento</h1>
          <div className="ml-auto flex items-center gap-2">
            <Button onClick={handleExportToPdf} disabled={isExporting}>
              {isExporting ? (
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              ) : (
                  <Download className="h-4 w-4 mr-2" />
              )}
              {isExporting ? 'Exportando...' : 'Exportar a PDF'}
            </Button>
          </div>
        </div>
        
        {/* Visible Content */}
        <div className='bg-background p-4 rounded-lg border'>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
            <Card className="col-span-1 lg:col-span-5">
              <CardHeader>
                <CardTitle>Ventas del Mes en Curso</CardTitle>
                <CardDescription>Resumen diario de los ingresos del mes. Total del mes: <span className='font-bold text-primary'>{formatCurrency(monthlySalesData.total)}</span></CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={monthlySalesData.daily}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="date" stroke="#888888" fontSize={12} tickLine={false} axisLine={false} label={{ value: 'Día del Mes', position: 'insideBottom', offset: -5 }}/>
                      <YAxis stroke="#888888" fontSize={12} tickLine={false} axisLine={false} tickFormatter={(value) => `$${value}`}/>
                      <Tooltip
                        contentStyle={{ backgroundColor: 'hsl(var(--background))', borderColor: 'hsl(var(--border))' }}
                        formatter={(value) => [formatCurrency(value as number), "Ventas"]}
                      />
                      <Bar dataKey="value" fill="hsl(var(--primary))" name="Ventas" radius={[4, 4, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>

            <div className="col-span-1 lg:col-span-2 space-y-4">
              <Card>
                <CardHeader className='pb-2'>
                  <CardTitle className="text-sm font-medium">Mejor Día de Ventas (Mes)</CardTitle>
                </CardHeader>
                <CardContent>
                  {monthlySalesData.bestDay ? (
                    <>
                      <div className="text-2xl font-bold text-green-500">{formatCurrency(monthlySalesData.bestDay.value)}</div>
                      <p className="text-xs text-muted-foreground">Ocurrido el día {monthlySalesData.bestDay.date} del mes.</p>
                    </>
                  ) : <p className="text-sm text-muted-foreground">Sin ventas este mes.</p>}
                </CardContent>
              </Card>
              <Card>
                <CardHeader className='pb-2'>
                  <CardTitle className="text-sm font-medium">Peor Día de Ventas (Mes)</CardTitle>
                </CardHeader>
                <CardContent>
                  {monthlySalesData.worstDay ? (
                    <>
                      <div className="text-2xl font-bold text-destructive">{formatCurrency(monthlySalesData.worstDay.value)}</div>
                      <p className="text-xs text-muted-foreground">Ocurrido el día {monthlySalesData.worstDay.date} del mes.</p>
                    </>
                  ) : <p className="text-sm text-muted-foreground">Sin ventas este mes.</p>}
                </CardContent>
              </Card>
            </div>
          </div>
          
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 mt-4">
            <Card>
                <CardHeader>
                    <CardTitle className='flex items-center gap-2'><TrendingUp className='h-5 w-5'/> Top 5 Productos Más Vendidos</CardTitle>
                    <CardDescription>Unidades vendidas en el mes.</CardDescription>
                </CardHeader>
                <CardContent>
                   <div className="h-[250px]">
                     <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={productSalesData.topProducts} layout="vertical">
                          <XAxis type="number" hide />
                          <YAxis type="category" dataKey="name" width={100} stroke="#888888" fontSize={12} tickLine={false} axisLine={false} interval={0} />
                          <Tooltip contentStyle={{ backgroundColor: 'hsl(var(--background))', borderColor: 'hsl(var(--border))' }} formatter={(value) => [value, "Unidades"]} />
                          <Bar dataKey="quantity" fill="hsl(var(--accent))" radius={[0, 4, 4, 0]}/>
                        </BarChart>
                      </ResponsiveContainer>
                    </div>
                </CardContent>
            </Card>
            <Card>
                <CardHeader>
                    <CardTitle>Ventas por Categoría</CardTitle>
                    <CardDescription>Distribución de unidades vendidas por categoría.</CardDescription>
                </CardHeader>
                <CardContent className='flex justify-center'>
                     <div className="h-[250px] w-[250px]">
                        <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                                <Pie data={productSalesData.byCategory} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={80} label>
                                    {productSalesData.byCategory.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                    ))}
                                </Pie>
                                <Tooltip contentStyle={{ backgroundColor: 'hsl(var(--background))', borderColor: 'hsl(var(--border))' }}/>
                                <Legend/>
                            </PieChart>
                        </ResponsiveContainer>
                     </div>
                </CardContent>
            </Card>
            <Card>
                <CardHeader>
                    <CardTitle className='flex items-center gap-2'><Package className='h-5 w-5'/> Estado del Inventario</CardTitle>
                    <CardDescription>Productos que requieren atención.</CardDescription>
                </CardHeader>
                <CardContent>
                    <div className='mb-4'>
                        <h4 className='font-semibold text-sm mb-2 flex items-center gap-2 text-destructive'><ArrowDown/>Pocas Existencias (5 o menos)</h4>
                        {inventoryStatus.lowStock.length > 0 ? (
                            <ul className='text-xs text-muted-foreground list-disc pl-4 space-y-1'>
                                {inventoryStatus.lowStock.map(p => <li key={p.id}>{p.name} ({p.stock} uds.)</li>)}
                            </ul>
                        ) : <p className='text-xs text-muted-foreground'>¡Todo bien por aquí!</p>}
                    </div>
                     <div>
                        <h4 className='font-semibold text-sm mb-2 flex items-center gap-2 text-green-600'><ArrowUp/>Exceso de Existencias (más de 50)</h4>
                        {inventoryStatus.highStock.length > 0 ? (
                            <ul className='text-xs text-muted-foreground list-disc pl-4 space-y-1'>
                                {inventoryStatus.highStock.map(p => <li key={p.id}>{p.name} ({p.stock} uds.)</li>)}
                            </ul>
                        ) : <p className='text-xs text-muted-foreground'>No hay productos con exceso de stock.</p>}
                    </div>
                </CardContent>
            </Card>
          </div>
        </div>
      </div>

      {/* Hidden Content for PDF Export */}
      <div ref={reportsRef} style={{ display: 'none', position: 'absolute', left: '-9999px', width: '1100px' }} className="bg-white text-black p-12 font-sans">
        <header className="flex justify-between items-center pb-8 border-b-2 border-gray-200">
            <div className='w-48'>
                <Logo />
            </div>
            <div className='text-right'>
                <h1 className="text-4xl font-bold text-gray-800">Reporte de Rendimiento</h1>
                <p className="text-lg text-gray-500">{new Date().toLocaleDateString('es-MX', { dateStyle: 'full' })}</p>
            </div>
        </header>

        <section className="mt-10">
            <h2 className="text-2xl font-semibold text-gray-700 border-b-2 border-primary pb-2 mb-6">Resumen del Mes</h2>
            <div className="grid grid-cols-3 gap-6">
                <div className="col-span-1 bg-blue-50 p-6 rounded-xl">
                    <h3 className="text-md font-semibold text-blue-800">Ventas Totales del Mes</h3>
                    <p className="text-4xl font-bold text-blue-900 mt-2">{formatCurrency(monthlySalesData.total)}</p>
                </div>
                 <div className="col-span-1 bg-lime-50 p-6 rounded-xl">
                    <h3 className="text-md font-semibold text-lime-800">Mejor Día de Ventas</h3>
                    {monthlySalesData.bestDay ? (
                        <>
                            <p className="text-2xl font-bold text-lime-900 mt-2">{formatCurrency(monthlySalesData.bestDay.value)}</p>
                            <p className="text-sm text-lime-700">Día {monthlySalesData.bestDay.date} del mes</p>
                        </>
                    ) : <p className="text-sm text-gray-500">N/A</p>}
                </div>
                 <div className="col-span-1 bg-red-50 p-6 rounded-xl">
                    <h3 className="text-md font-semibold text-red-800">Peor Día de Ventas</h3>
                    {monthlySalesData.worstDay ? (
                        <>
                            <p className="text-2xl font-bold text-red-900 mt-2">{formatCurrency(monthlySalesData.worstDay.value)}</p>
                            <p className="text-sm text-red-700">Día {monthlySalesData.worstDay.date} del mes</p>
                        </>
                     ) : <p className="text-sm text-gray-500">N/A</p>}
                </div>
            </div>
        </section>

        <section className="mt-10">
            <h2 className="text-2xl font-semibold text-gray-700 border-b-2 border-primary pb-2 mb-6">Análisis de Ventas</h2>
            <div className="h-[350px] bg-gray-50 p-6 rounded-xl">
                <h3 className='text-lg font-semibold text-gray-600 mb-4'>Ingresos Diarios del Mes</h3>
                <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={monthlySalesData.daily}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="date" stroke="#888888" fontSize={12} tickLine={false} axisLine={false} />
                        <YAxis stroke="#888888" fontSize={12} tickLine={false} axisLine={false} tickFormatter={(value) => `$${value}`}/>
                        <Tooltip formatter={(value) => [formatCurrency(value as number), "Ventas"]} />
                        <Bar dataKey="value" fill="#2563eb" name="Ventas" radius={[4, 4, 0, 0]} />
                    </BarChart>
                </ResponsiveContainer>
            </div>
        </section>

        <section className="mt-10">
             <h2 className="text-2xl font-semibold text-gray-700 border-b-2 border-primary pb-2 mb-6">Análisis de Productos</h2>
             <div className='grid grid-cols-2 gap-8'>
                <div className='bg-gray-50 p-6 rounded-xl'>
                    <h3 className='text-lg font-semibold text-gray-600 mb-4'>Top 5 Productos Más Vendidos</h3>
                    <div className="h-[250px]">
                       <ResponsiveContainer width="100%" height="100%">
                          <BarChart data={productSalesData.topProducts} layout="vertical" margin={{ left: 50 }}>
                            <XAxis type="number" hide />
                            <YAxis type="category" dataKey="name" width={100} stroke="#888888" fontSize={12} tickLine={false} axisLine={false} interval={0} />
                            <Tooltip formatter={(value) => [value, "Unidades"]} />
                            <Bar dataKey="quantity" fill="#8884d8" radius={[0, 4, 4, 0]}/>
                          </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>
                 <div className='bg-gray-50 p-6 rounded-xl flex flex-col items-center'>
                    <h3 className='text-lg font-semibold text-gray-600 mb-4'>Ventas por Categoría</h3>
                     <div className="h-[250px] w-[350px]">
                        <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                                <Pie data={productSalesData.byCategory} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={80} label>
                                    {productSalesData.byCategory.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                    ))}
                                </Pie>
                                <Tooltip/>
                                <Legend/>
                            </PieChart>
                        </ResponsiveContainer>
                     </div>
                </div>
             </div>
        </section>

        <footer className="mt-12 pt-6 border-t-2 border-gray-200 text-center">
            <p className="text-sm text-gray-500">Reporte generado por ALIRU POS System</p>
        </footer>
      </div>
    </>
  );
}

    

    