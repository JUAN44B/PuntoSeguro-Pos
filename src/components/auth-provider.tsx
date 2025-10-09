'use client';

import { usePathname, useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { useUser } from '@/hooks/use-user';
import Logo from '@/components/logo';
import Sidebar from '@/components/sidebar';

export default function AuthProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user, loading } = useUser();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (!loading) {
      if (!user && pathname !== '/auth') {
        router.replace('/auth');
      }
      if (user && pathname === '/auth') {
        router.replace('/');
      }
    }
  }, [user, loading, router, pathname]);

  if (loading) {
    return (
      <div className="flex h-screen w-screen items-center justify-center bg-background">
        <div className="flex flex-col items-center gap-4">
          <Logo />
          <p className="text-muted-foreground">Cargando...</p>
        </div>
      </div>
    );
  }

  // While redirecting, don't render children to avoid flash of content
  if ((!user && pathname !== '/auth') || (user && pathname === '/auth')) {
    return (
       <div className="flex h-screen w-screen items-center justify-center bg-background">
        <div className="flex flex-col items-center gap-4">
          <Logo />
          <p className="text-muted-foreground">Redirigiendo...</p>
        </div>
      </div>
    );
  }

  // Render auth page without sidebar, or main content with sidebar
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
