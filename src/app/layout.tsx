import type { Metadata } from 'next';
import './globals.css';
import { cn } from '@/lib/utils';
import Sidebar from '@/components/sidebar';

export const metadata: Metadata = {
  title: 'ALIRU POS',
  description: 'Punto de venta para Refacciones para Remolques',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es">
      <body className={cn('min-h-screen w-full bg-background font-sans antialiased')}>
        <div className="flex">
          <Sidebar />
          <main className="flex-1 p-8">
            {children}
          </main>
        </div>
      </body>
    </html>
  );
}
