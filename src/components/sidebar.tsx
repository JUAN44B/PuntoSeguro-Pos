
'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, ShoppingCart, Package, Users, BarChart, Settings, Truck, Building, History } from 'lucide-react';
import { cn } from '@/lib/utils';
import Logo from './logo';
import { ThemeToggle } from './theme-toggle';
import { Separator } from './ui/separator';
import { useUser } from '@/firebase';

const allNavItems = [
  { href: '/', label: 'Inicio', icon: Home, roles: ['Administrador', 'Supervisor', 'Cajero'] },
  { href: '/pos', label: 'Ventas / Caja', icon: ShoppingCart, roles: ['Administrador', 'Supervisor', 'Cajero'] },
  { href: '/products', label: 'Productos', icon: Package, roles: ['Administrador', 'Supervisor'] },
  { href: '/categories', label: 'Categorías', icon: Building, roles: ['Administrador', 'Supervisor'] },
  { href: '/inventory', label: 'Inventario', icon: Truck, roles: ['Administrador', 'Supervisor'] },
  { href: '/customers', label: 'Clientes', icon: Users, roles: ['Administrador', 'Supervisor'] },
  { href: '/sales', label: 'Ventas Históricas', icon: History, roles: ['Administrador', 'Supervisor'] },
  { href: '/reports', label: 'Reportes', icon: BarChart, roles: ['Administrador'] },
  { href: '/settings', label: 'Configuración', icon: Settings, roles: ['Administrador'] },
];

export default function Sidebar() {
  const pathname = usePathname();
  const { user, loading } = useUser();

  const userRole = user?.role || 'Cajero'; // Default to most restrictive role
  
  const navItems = allNavItems.filter(item => {
    if (user?.role === 'Administrador') return true; // Admins see everything
    return item.roles.includes(userRole);
  });

  if (loading) {
    // You can return a skeleton loader here if you want
    return (
        <div className="hidden border-r bg-muted/40 md:block">
            <div className="flex h-full max-h-screen flex-col gap-2">
                <div className="flex h-14 items-center border-b px-4 lg:h-[60px] lg:px-6">
                    <Logo />
                </div>
                <div className="flex-1 overflow-y-auto p-4">
                    <div className="space-y-4">
                        {[...Array(8)].map((_, i) => (
                            <div key={i} className="h-8 w-full bg-muted rounded animate-pulse" />
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
  }

  return (
    <div className="hidden border-r bg-muted/40 md:block">
      <div className="flex h-full max-h-screen flex-col gap-2">
        <div className="flex h-14 items-center border-b px-4 lg:h-[60px] lg:px-6">
          <Logo />
        </div>
        <div className="flex-1 overflow-y-auto">
          <nav className="grid items-start px-2 text-sm font-medium lg:px-4">
            {navItems.map(({ href, label, icon: Icon }) => (
              <Link
                key={href}
                href={href}
                className={cn(
                  'flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-primary',
                  {
                    'bg-muted text-primary': pathname === href,
                  }
                )}
              >
                <Icon className="h-4 w-4" />
                {label}
              </Link>
            ))}
          </nav>
        </div>
        <div className="mt-auto p-4">
          <Separator className='my-4'/>
          <ThemeToggle />
        </div>
      </div>
    </div>
  );
}
