
"use client"
import Link from "next/link"
import {
  Home,
  LineChart,
  Package,
  Package2,
  ShoppingCart,
  Users,
  Truck,
  Settings,
  Warehouse,
  Receipt,
  Shapes,
} from "lucide-react"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import { useUser } from "@/context/user-context"


const navItems = [
    { href: "/dashboard", icon: Home, label: "Panel", roles: ["Admin", "Gerente", "Cajero"] },
    { href: "/dashboard/pos", icon: ShoppingCart, label: "Punto de Venta", roles: ["Admin", "Gerente", "Cajero"] },
    { href: "/dashboard/products", icon: Package, label: "Productos", roles: ["Admin", "Gerente", "Cajero"] },
    { href: "/dashboard/categories", icon: Shapes, label: "Categorías", roles: ["Admin", "Gerente"] },
    { href: "/dashboard/inventory", icon: Warehouse, label: "Inventario", roles: ["Admin", "Gerente"] },
    { href: "/dashboard/customers", icon: Users, label: "Clientes", roles: ["Admin", "Gerente"] },
    { href: "/dashboard/purchases", icon: Receipt, label: "Compras", roles: ["Admin", "Gerente"] },
    { href: "/dashboard/suppliers", icon: Truck, label: "Proveedores", roles: ["Admin", "Gerente"] },
    { href: "/dashboard/reports", icon: LineChart, label: "Reportes", roles: ["Admin", "Gerente"] },
]


export default function AppSidebar() {
    const { user } = useUser();

  return (
    <aside className="fixed inset-y-0 left-0 z-10 hidden w-14 flex-col border-r bg-background sm:flex">
      <nav className="flex flex-col items-center gap-4 px-2 sm:py-4">
        <Link
          href="#"
          className="group flex h-9 w-9 shrink-0 items-center justify-center gap-2 rounded-full bg-primary text-lg font-semibold text-primary-foreground md:h-8 md:w-8 md:text-base"
        >
          <Package2 className="h-4 w-4 transition-all group-hover:scale-110" />
          <span className="sr-only">PuntoSeguro POS</span>
        </Link>
        <TooltipProvider>
            {navItems.filter(item => item.roles.includes(user.role)).map(item => (
                 <Tooltip key={item.label}>
                    <TooltipTrigger asChild>
                    <Link
                        href={item.href}
                        className="flex h-9 w-9 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:text-foreground md:h-8 md:w-8"
                    >
                        <item.icon className="h-5 w-5" />
                        <span className="sr-only">{item.label}</span>
                    </Link>
                    </TooltipTrigger>
                    <TooltipContent side="right">{item.label}</TooltipContent>
              </Tooltip>
            ))}
        </TooltipProvider>
      </nav>
      <nav className="mt-auto flex flex-col items-center gap-4 px-2 sm:py-4">
        <TooltipProvider>
          {user.role === 'Admin' && (
            <Tooltip>
                <TooltipTrigger asChild>
                <Link
                    href="/dashboard/settings"
                    className="flex h-9 w-9 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:text-foreground md:h-8 md:w-8"
                >
                    <Settings className="h-5 w-5" />
                    <span className="sr-only">Configuración</span>
                </Link>
                </TooltipTrigger>
                <TooltipContent side="right">Configuración</TooltipContent>
            </Tooltip>
           )}
        </TooltipProvider>
      </nav>
    </aside>
  )
}
