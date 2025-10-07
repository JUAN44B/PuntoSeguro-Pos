
'use client';

import { usePathname, useRouter } from 'next/navigation';
import './globals.css';
import { cn } from '@/lib/utils';
import Sidebar from '@/components/sidebar';
import { FirebaseProvider } from '@/firebase/provider';
import { ThemeProvider } from '@/components/theme-provider';
import { useUser } from '@/firebase';
import { useEffect } from 'react';
import Logo from '@/components/logo';

function AuthWrapper({ children }: { children: React.ReactNode }) {
  const { user, loading } = useUser();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (!loading && !user && pathname !== '/auth') {
      router.replace('/auth');
    }
  }, [user, loading, router, pathname]);

  if (loading) {
    return (
      <div className="flex h-screen w-screen items-center justify-center bg-background">
          <div className='flex flex-col items-center gap-4'>
            <Logo />
            <p className='text-muted-foreground'>Cargando...</p>
          </div>
      </div>
    );
  }

  if (!user && pathname !== '/auth') {
    return null; // Don't render anything while redirecting
  }

  if (pathname === '/auth') {
    return <>{children}</>;
  }

  return (
    <div className="flex">
      <Sidebar />
      <main className="flex-1 p-8">{children}</main>
    </div>
  );
}


export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es" suppressHydrationWarning>
      <body className={cn('min-h-screen w-full bg-background font-sans antialiased')}>
        <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange
        >
          <FirebaseProvider>
            <AuthWrapper>
              {children}
            </AuthWrapper>
          </FirebaseProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
