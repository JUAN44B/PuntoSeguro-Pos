import type { Metadata } from 'next';
import './globals.css';
import { cn } from '@/lib/utils';
import { ThemeProvider } from '@/components/theme-provider';
import AuthProvider from '@/components/auth-provider';

export const metadata: Metadata = {
  title: 'ALIRU POS',
  description: 'Sistema de Punto de Venta para Refacciones',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es" suppressHydrationWarning>
      <body
        className={cn(
          'min-h-screen w-full bg-background font-sans antialiased'
        )}
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <AuthProvider>{children}</AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
