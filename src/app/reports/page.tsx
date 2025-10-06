'use client';

import { Bar, BarChart, CartesianGrid, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Download } from 'lucide-react';

const salesData = [
  { date: '01/10', value: 4000 },
  { date: '02/10', value: 3000 },
  { date: '03/10', value: 2000 },
  { date: '04/10', value: 2780 },
  { date: '05/10', value: 1890 },
  { date: '06/10', value: 2390 },
  { date: '07/10', value: 3490 },
  { date: '08/10', value: 4200 },
  { date: '09/10', value: 3100 },
  { date: '10/10', value: 2500 },
];

export default function ReportsPage() {
  return (
    <div className="flex flex-col gap-8">
      <div className="flex items-center">
        <h1 className="font-semibold text-4xl">Reportes</h1>
        <div className="ml-auto flex items-center gap-2">
          <Button>
            <Download className="h-4 w-4 mr-2" />
            Exportar
          </Button>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-1">
        <Card>
          <CardHeader>
            <CardTitle>Ventas del Mes</CardTitle>
            <CardDescription>Un resumen de los ingresos de ventas del mes actual.</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={salesData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" />
                  <YAxis />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: 'hsl(var(--background))',
                      borderColor: 'hsl(var(--border))',
                    }}
                  />
                  <Legend />
                  <Bar dataKey="value" fill="hsl(var(--primary))" name="Ventas ($)" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>
      
      <div className="grid gap-4 md:grid-cols-2">
        <Card>
            <CardHeader>
                <CardTitle>Ventas por Producto</CardTitle>
                <CardDescription>Análisis de los productos más vendidos.</CardDescription>
            </CardHeader>
            <CardContent>
                <p className='text-sm text-muted-foreground'>Próximamente...</p>
            </CardContent>
        </Card>
        <Card>
            <CardHeader>
                <CardTitle>Existencias Bajas</CardTitle>
                <CardDescription>Productos que necesitan ser reabastecidos.</CardDescription>
            </CardHeader>
            <CardContent>
                <p className='text-sm text-muted-foreground'>Próximamente...</p>
            </CardContent>
        </Card>
      </div>

    </div>
  );
}
