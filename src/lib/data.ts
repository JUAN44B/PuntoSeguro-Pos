import type { Product, Customer, Supplier, SalesOrder, PurchaseOrder, User } from './types';

export const products: Product[] = [
  {
    id: 'LI053',
    name: 'Muelle',
    description: 'Muelle para remolques de alta resistencia.',
    category: 'Remolques',
    stock: 50,
    purchasePrice: 95.00,
    salePrice: 130.00,
    tax: 16,
    discount: 10,
    profitMargin: 51.46,
    supplier: 'Proveedor A',
    imageUrl: 'https://picsum.photos/seed/LI053/400/300',
    imageHint: 'metal spring',
  },
  {
    id: 'FE201',
    name: 'Filtro de Aceite',
    description: 'Filtro de aceite para motor diésel.',
    category: 'Motores',
    stock: 15,
    purchasePrice: 80.00,
    salePrice: 120.00,
    tax: 16,
    discount: 0,
    profitMargin: 50,
    supplier: 'Proveedor B',
    imageUrl: 'https://picsum.photos/seed/FE201/400/300',
    imageHint: 'oil filter',
  },
  {
    id: 'TR455',
    name: 'Tornillo de Rueda',
    description: 'Tornillo de seguridad para ruedas de camión.',
    category: 'Accesorios',
    stock: 150,
    purchasePrice: 10.00,
    salePrice: 25.00,
    tax: 16,
    discount: 5,
    profitMargin: 150,
    supplier: 'Proveedor C',
    imageUrl: 'https://picsum.photos/seed/TR455/400/300',
    imageHint: 'wheel bolt',
  },
  {
    id: 'BA007',
    name: 'Batería 12V',
    description: 'Batería de alto rendimiento para vehículos pesados.',
    category: 'Eléctrico',
    stock: 8,
    purchasePrice: 1200.00,
    salePrice: 1800.00,
    tax: 16,
    discount: 0,
    profitMargin: 50,
    supplier: 'Proveedor D',
    imageUrl: 'https://picsum.photos/seed/BA007/400/300',
    imageHint: 'car battery',
  },
  {
    id: 'LL991',
    name: 'Llanta 22.5"',
    description: 'Llanta para camión de carga pesada.',
    category: 'Llantas',
    stock: 25,
    purchasePrice: 2500.00,
    salePrice: 3500.00,
    tax: 16,
    discount: 0,
    profitMargin: 40,
    supplier: 'Proveedor E',
    imageUrl: 'https://picsum.photos/seed/LL991/400/300',
    imageHint: 'truck tire',
  },
  {
    id: 'FR332',
    name: 'Balata de Freno',
    description: 'Juego de balatas de cerámica.',
    category: 'Frenos',
    stock: 40,
    purchasePrice: 450.00,
    salePrice: 650.00,
    tax: 16,
    discount: 0,
    profitMargin: 44,
    supplier: 'Proveedor A',
    imageUrl: 'https://picsum.photos/seed/FR332/400/300',
    imageHint: 'brake pad',
  },
];

export const customers: Customer[] = [
    { id: 'CUST001', name: 'Juan Perez', rfc: 'PEPJ800101', email: 'juan.perez@email.com', phone: '55-1234-5678', address: 'Calle Falsa 123, CDMX', type: 'Frequent' },
    { id: 'CUST002', name: 'Maria Garcia', rfc: 'GAMM900202', email: 'maria.garcia@email.com', phone: '55-8765-4321', address: 'Av. Siempre Viva 742, GDL', type: 'Wholesale' },
    { id: 'CUST003', name: 'Carlos Sanchez', rfc: 'SACC750303', email: 'carlos.sanchez@email.com', phone: '55-5555-5555', address: 'Privada del Roble 45, MTY', type: 'Retail' },
];

export const suppliers: Supplier[] = [
    { id: 'SUP001', name: 'Proveedor A', rfc: 'PROA123456', contactName: 'Ana Lopez', email: 'contacto@proveedora.com', phone: '81-1111-1111', address: 'Parque Industrial 1, MTY' },
    { id: 'SUP002', name: 'Proveedor B', rfc: 'PROB654321', contactName: 'Luis Martinez', email: 'ventas@proveedorb.com', phone: '33-2222-2222', address: 'Zona Industrial 2, GDL' },
    { id: 'SUP003', name: 'Proveedor C', rfc: 'PROC789012', contactName: 'Sofia Hernandez', email: 'admin@proveedorc.com', phone: '55-3333-3333', address: 'Bodega Central 3, CDMX' },
];

export const recentSales: SalesOrder[] = [
    { id: 'SALE001', date: '2024-07-23', customerName: 'Juan Perez', total: 450.50, status: 'Completed' },
    { id: 'SALE002', date: '2024-07-23', customerName: 'Publico General', total: 120.00, status: 'Completed' },
    { id: 'SALE003', date: '2024-07-22', customerName: 'Maria Garcia', total: 3500.00, status: 'Pending' },
    { id: 'SALE004', date: '2024-07-22', customerName: 'Carlos Sanchez', total: 85.50, status: 'Completed' },
    { id: 'SALE005', date: '2024-07-21', customerName: 'Publico General', total: 99.18, status: 'Cancelled' },
];

export const purchaseOrders: PurchaseOrder[] = [
    { id: 'PO-001', supplierName: 'Proveedor A', date: '2024-07-20', total: 5500.00, status: 'Received' },
    { id: 'PO-002', supplierName: 'Proveedor B', date: '2024-07-21', total: 12000.50, status: 'Pending' },
    { id: 'PO-003', supplierName: 'Proveedor C', date: '2024-07-22', total: 350.00, status: 'Received' },
    { id: 'PO-004', supplierName: 'Proveedor A', date: '2024-07-23', total: 890.00, status: 'Cancelled' },
];

export const users: User[] = [
    { id: 'USR001', name: 'Admin User', email: 'admin@example.com', role: 'Admin', status: 'Active' },
    { id: 'USR002', name: 'Manager User', email: 'manager@example.com', role: 'Manager', status: 'Active' },
    { id: 'USR003', name: 'Cashier User', email: 'cashier@example.com', role: 'Cashier', status: 'Invited' },
];
