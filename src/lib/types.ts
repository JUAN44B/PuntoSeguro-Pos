export type Product = {
  id: string;
  name: string;
  description: string;
  category: string;
  stock: number;
  purchasePrice: number;
  salePrice: number;
  tax: number;
  discount: number;
  profitMargin: number;
  supplier: string;
  imageUrl: string;
  imageHint: string;
};

export type Customer = {
  id: string;
  name: string;
  rfc: string;
  email: string;
  phone: string;
  address: string;
  type: 'Frequent' | 'Wholesale' | 'Retail';
};

export type Supplier = {
  id: string;
  name: string;
  rfc: string;
  contactName: string;
  email: string;
  phone: string;
  address: string;
};

export type SalesOrder = {
    id: string;
    date: string;
    customerName: string;
    total: number;
    status: 'Completed' | 'Pending' | 'Cancelled';
};
