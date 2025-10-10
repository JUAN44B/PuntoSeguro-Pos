import type { Product } from '@/app/products/components/product-dialog';
import type { Category } from '@/app/categories/page';
import type { Customer } from '@/app/customers/components/customer-dialog';
import type { Sale } from '@/app/sales/page';
import type { UserProfile } from '@/app/settings/page';
import type { CashSession } from '@/app/cash-management/page';
import type { Supplier } from '@/app/suppliers/components/supplier-dialog';

export const MOCK_PRODUCTS: Product[] = [
    { id: '1', code: '7501055312345', name: 'Aceite Motor 15W-40', category: 'Lubricantes', purchasePrice: 120, discount: 0, profitMargin: 30, finalPrice: 185.6, stock: 25, status: 'Activo', image: 'https://picsum.photos/seed/prod1/100/100' },
    { id: '2', code: '7501055312346', name: 'Filtro de Aceite', category: 'Filtros', purchasePrice: 80, discount: 5, profitMargin: 40, finalPrice: 125.44, stock: 40, status: 'Activo', image: 'https://picsum.photos/seed/prod2/100/100' },
    { id: '3', code: '7501055312347', name: 'Bujía de Iridio', category: 'Encendido', purchasePrice: 150, discount: 0, profitMargin: 50, finalPrice: 261, stock: 60, status: 'Activo', image: 'https://picsum.photos/seed/prod3/100/100' },
    { id: '4', code: '7501055312348', name: 'Balatas Delanteras', category: 'Frenos', purchasePrice: 400, discount: 10, profitMargin: 35, finalPrice: 563.76, stock: 15, status: 'Activo', image: 'https://picsum.photos/seed/prod4/100/100' },
    { id: '5', code: '7501055312349', name: 'Limpiaparabrisas 24"', category: 'Accesorios', purchasePrice: 90, discount: 0, profitMargin: 30, finalPrice: 130.9, stock: 30, status: 'Activo', image: 'https://picsum.photos/seed/prod5/100/100' },
    { id: '6', code: '7501055312350', name: 'Anticongelante Concentrado', category: 'Lubricantes', purchasePrice: 110, discount: 0, profitMargin: 30, finalPrice: 159.04, stock: 4, status: 'Activo', image: 'https://picsum.photos/seed/prod6/100/100' },
];

export const MOCK_CATEGORIES: Category[] = [
    { id: '1', name: 'Lubricantes' },
    { id: '2', name: 'Filtros' },
    { id: '3', name: 'Encendido' },
    { id: '4', name: 'Frenos' },
    { id: '5', name: 'Accesorios' },
    { id: '6', name: 'Suspensión' },
];

export const MOCK_CUSTOMERS: Customer[] = [
    { id: '1', name: 'Juan Pérez', phone: '55-1234-5678', email: 'juan.perez@example.com', address: 'Av. Siempre Viva 742', rfc: 'PEJU800101XYZ', postalCode: '01000', cfdiUse: 'G03', taxRegime: '612' },
    { id: '2', name: 'Maria García', phone: '81-8765-4321', email: 'maria.garcia@example.com', address: 'Calle Falsa 123', rfc: 'GAGM850202ABC', postalCode: '64000', cfdiUse: 'G01', taxRegime: '626' },
    { id: '3', name: 'Refacciones El Piston S.A. de C.V.', phone: '33-9876-5432', email: 'compras@elpiston.com', address: 'Parque Industrial Roble 45', rfc: 'RPI010203CDE', postalCode: '45010', cfdiUse: 'G01', taxRegime: '601' },
];

export const MOCK_SALES: Sale[] = [
    { id: '1', saleId: 'ALIRU-12345', createdAt: { seconds: new Date('2023-10-26T10:00:00Z').getTime() / 1000, nanoseconds: 0 }, items: [{ id: '1', name: 'Aceite Motor 15W-40', price: 185.6, quantity: 2 }], total: 371.2, paymentMethod: 'Efectivo', userId: 'local-admin', userName: 'Admin Local', returned: false },
    { id: '2', saleId: 'ALIRU-12346', createdAt: { seconds: new Date('2023-10-26T12:30:00Z').getTime() / 1000, nanoseconds: 0 }, items: [{ id: '2', name: 'Filtro de Aceite', price: 125.44, quantity: 1 }, { id: '3', name: 'Bujía de Iridio', price: 261, quantity: 4 }], total: 1169.44, paymentMethod: 'Tarjeta', userId: 'local-admin', userName: 'Admin Local', returned: true },
    { id: '3', saleId: 'ALIRU-12347', createdAt: { seconds: new Date('2023-10-25T15:00:00Z').getTime() / 1000, nanoseconds: 0 }, items: [{ id: '4', name: 'Balatas Delanteras', price: 563.76, quantity: 1 }], total: 563.76, paymentMethod: 'Efectivo', userId: 'local-admin', userName: 'Admin Local', returned: false },
];

export const MOCK_USERS: UserProfile[] = [
    { id: 'local-admin', uid: 'local-admin', displayName: 'Admin Local', email: 'admin@local.com', role: 'Administrador' },
    { id: 'cajero-1', uid: 'cajero-1', displayName: 'Juan Cajero', email: 'juan.cajero@local.com', role: 'Cajero' },
    { id: 'supervisor-1', uid: 'supervisor-1', displayName: 'Super Visor', email: 'super.visor@local.com', role: 'Supervisor' },
];

export const MOCK_CASH_SESSIONS: CashSession[] = [
    { id: '1', openedAt: { seconds: new Date('2023-10-26T09:00:00Z').getTime() / 1000 }, closedAt: null, openingBalance: 1500, cashSales: 934.96, status: 'abierta', userId: 'local-admin', userName: 'Admin Local' }
]

export const MOCK_SUPPLIERS: Supplier[] = [
    { id: '1', name: 'Proveedor de Lubricantes S.A.', contactName: 'Carlos Martinez', phone: '55-5555-1111', email: 'carlos.m@lubricantes.com', rfc: 'LSA010101AAA', address: 'Parque Industrial Norte 1' },
    { id: '2', name: 'Filtros y Partes Nacionales', contactName: 'Ana Gomez', phone: '81-8181-2222', email: 'ana.g@filtros.com', rfc: 'FPN020202BBB', address: 'Av. Industria 456' },
    { id: '3', name: 'Frenos Seguros de México', contactName: 'Pedro Ramirez', phone: '33-3333-4444', email: 'pedro.r@frenos.com', rfc: 'FSM030303CCC', address: 'Calle Seguridad 789' },
];


// Function to get a fresh copy of mock data to simulate non-persistence
export const getMockData = () => ({
    products: JSON.parse(JSON.stringify(MOCK_PRODUCTS)),
    categories: JSON.parse(JSON.stringify(MOCK_CATEGORIES)),
    customers: JSON.parse(JSON.stringify(MOCK_CUSTOMERS)),
    sales: JSON.parse(JSON.stringify(MOCK_SALES)),
    users: JSON.parse(JSON.stringify(MOCK_USERS)),
    cashSessions: JSON.parse(JSON.stringify(MOCK_CASH_SESSIONS)),
    suppliers: JSON.parse(JSON.stringify(MOCK_SUPPLIERS)),
});
