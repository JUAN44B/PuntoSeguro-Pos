'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { Home, ShoppingCart, Package, Users, BarChart, Settings, Truck, Building, History, LogOut, User as UserIcon, Wallet } from 'lucide-react';
import { cn } from '@/lib/utils';
import Logo from './logo';
import { ThemeToggle } from './theme-toggle';
import { useUser } from '@/hooks/use-user';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Button } from './ui/button';

const allNavItems = [
  { href: '/', label: 'Inicio', icon: Home, roles: ['Administrador', 'Supervisor', 'Cajero'] },
  { href: '/pos', label: 'Ventas / Caja', icon: ShoppingCart, roles: ['Administrador', 'Supervisor', 'Cajero'] },
  { href: '/products', label: 'Productos', icon: Package, roles: ['Administrador', 'Supervisor'] },
  { href: '/categories', label: 'Categorías', icon: Building, roles: ['Administrador', 'Supervisor'] },
  { href: '/inventory', label: 'Inventario', icon: Package, roles: ['Administrador', 'Supervisor'] },
  { href: '/customers', label: 'Clientes', icon: Users, roles: ['Administrador', 'Supervisor'] },
  { href: '/suppliers', label: 'Proveedores', icon: Truck, roles: ['Administrador', 'Supervisor'] },
  { href: '/sales', label: 'Ventas Históricas', icon: History, roles: ['Administrador', 'Supervisor'] },
  { href: '/cash-management', label: 'Gestión de Caja', icon: Wallet, roles: ['Administrador', 'Supervisor'] },
  { href: '/reports', label: 'Reportes', icon: BarChart, roles: ['Administrador'] },
  { href: '/settings', label: 'Configuración', icon: Settings, roles: ['Administrador'] },
];

export default function Sidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const { user, loading } = useUser();

  const handleLogout = async () => {
    // In local mode, just clear localStorage and redirect
    try {
        localStorage.removeItem('local-admin-auth');
    } catch(e) {
        console.error("Could not clear local session", e);
    }
    router.push('/auth');
  };

  const userRole = user?.role || 'Cajero'; // Default to most restrictive role
  
  const navItems = allNavItems.filter(item => {
    if (user?.role === 'Administrador') return true; // Admins see everything
    return item.roles.includes(userRole);
  });

  if (loading) {
    // You can return a skeleton loader here if you want
    return (
        <div className="hidden border-r bg-muted/40 md:block w-64">
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
                 <div className="mt-auto p-4 space-y-2">
                    <div className="h-10 w-full bg-muted rounded animate-pulse" />
                    <div className="h-10 w-full bg-muted rounded animate-pulse" />
                 </div>
            </div>
        </div>
    );
  }

  return (
    <div className="hidden border-r bg-muted/40 md:block w-64">
      <div className="flex h-full max-h-screen flex-col">
        <div className="flex h-14 items-center border-b px-4 lg:h-[60px] lg:px-6">
          <Logo />
        </div>
        <div className="flex-1 overflow-y-auto">
          <nav className="grid items-start px-2 text-sm font-medium lg:px-4 py-4">
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
        <div className="mt-auto border-t p-4">
          <div className="flex items-center justify-between">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                   <Button variant="ghost" className="w-full justify-start text-left h-auto p-2">
                      <div className="flex items-center gap-2">
                        <div className="h-8 w-8 rounded-full bg-primary flex items-center justify-center text-primary-foreground">
                           <UserIcon className="h-5 w-5" />
                        </div>
                        <div className="flex flex-col">
                          <span className="text-sm font-medium leading-none">{user?.displayName || 'Usuario'}</span>
                          <span className="text-xs text-muted-foreground leading-none mt-1">{user?.role || 'Rol'}</span>
                        </div>
                      </div>
                   </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-56 mb-2" align="end" forceMount>
                  <DropdownMenuLabel className="font-normal">
                    <div className="flex flex-col space-y-1">
                      <p className="text-sm font-medium leading-none">{user?.displayName}</p>
                      <p className="text-xs leading-none text-muted-foreground">
                        {user?.email}
                      </p>
                    </div>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={handleLogout} className="cursor-pointer">
                    <LogOut className="mr-2 h-4 w-4" />
                    <span>Cerrar Sesión</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>

            <ThemeToggle />
          </div>
        </div>
      </div>
    </div>
  );
}
