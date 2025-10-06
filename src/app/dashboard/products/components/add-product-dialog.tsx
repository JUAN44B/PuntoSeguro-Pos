
"use client"

import * as React from "react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { useToast } from "@/hooks/use-toast"
import type { Product } from "@/lib/types"

interface AddProductDialogProps {
  children: React.ReactNode;
  onProductAdd: (product: Product) => void;
}

const initialFormData: Partial<Product> = {
  id: '',
  name: '',
  description: '',
  category: '',
  stock: 0,
  purchasePrice: 0,
  salePrice: 0,
  tax: 16, // IVA por defecto
  discount: 0, // Descuento sobre precio de compra
  incrementPercentage: 30, // Porcentaje de incremento por defecto
  supplier: '',
  imageUrl: '',
  imageHint: '',
};

export default function AddProductDialog({ children, onProductAdd }: AddProductDialogProps) {
  const [open, setOpen] = React.useState(false)
  const [formData, setFormData] = React.useState<Partial<Product>>(initialFormData);
  const { toast } = useToast()

  React.useEffect(() => {
    if (formData.purchasePrice !== undefined && formData.discount !== undefined && formData.tax !== undefined && formData.incrementPercentage !== undefined) {
      // 1. Aplicar descuento al precio de compra
      const priceWithDiscount = formData.purchasePrice * (1 - (formData.discount / 100));
      
      // 2. Calcular el precio con IVA
      const priceWithTax = priceWithDiscount * (1 + (formData.tax / 100));

      // 3. Aplicar el porcentaje de incremento
      const suggestedSalePrice = priceWithTax * (1 + (formData.incrementPercentage / 100));

      // Calcular margen de ganancia
      const profitMargin = (suggestedSalePrice > 0 && formData.purchasePrice > 0)
        ? ((suggestedSalePrice - formData.purchasePrice) / formData.purchasePrice) * 100
        : 0;

      setFormData(prev => ({ 
          ...prev, 
          salePrice: parseFloat(suggestedSalePrice.toFixed(2)),
          profitMargin: parseFloat(profitMargin.toFixed(2))
        }));
    }
  }, [formData.purchasePrice, formData.discount, formData.tax, formData.incrementPercentage]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { id, value } = e.target;
    setFormData(prev => ({ ...prev, [id]: value }));
  };
  
  const handleNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;
    setFormData(prev => ({ ...prev, [id]: parseFloat(value) || 0 }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.name || !formData.id) {
        toast({
            variant: "destructive",
            title: "Información Faltante",
            description: "El Nombre y Código del producto son requeridos.",
        });
        return;
    }
    
    const newProduct: Product = {
      id: formData.id || `PROD${Math.floor(Math.random() * 1000)}`,
      name: formData.name || "Producto Sin Nombre",
      description: formData.description || "",
      category: formData.category || "General",
      stock: formData.stock || 0,
      purchasePrice: formData.purchasePrice || 0,
      salePrice: formData.salePrice || 0,
      tax: formData.tax || 16,
      discount: formData.discount || 0,
      incrementPercentage: formData.incrementPercentage || 0,
      profitMargin: formData.profitMargin || 0,
      supplier: formData.supplier || "",
      imageUrl: formData.imageUrl || `https://picsum.photos/seed/${formData.id}/400/300`,
      imageHint: formData.imageHint || formData.name?.toLowerCase() || 'product',
    };

    onProductAdd(newProduct);
    setOpen(false); // Close the dialog
    setFormData(initialFormData); // Reset form
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {children}
      </DialogTrigger>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Agregar Nuevo Producto</DialogTitle>
          <DialogDescription>
            Completa los detalles a continuación para agregar un nuevo producto a tu inventario.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="grid gap-4 py-4 max-h-[70vh] overflow-y-auto pr-6">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="name" className="text-right">Nombre</Label>
            <Input id="name" value={formData.name} onChange={handleChange} className="col-span-3" />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="id" className="text-right">Código</Label>
            <Input id="id" value={formData.id} onChange={handleChange} className="col-span-3" />
          </div>
           <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="description" className="text-right">Descripción</Label>
            <Textarea id="description" value={formData.description} onChange={handleChange} className="col-span-3" />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="category" className="text-right">Categoría</Label>
            <Input id="category" value={formData.category} onChange={handleChange} className="col-span-3" />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="stock" className="text-right">Existencia</Label>
            <Input id="stock" type="number" value={formData.stock} onChange={handleNumberChange} className="col-span-3" />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="purchasePrice" className="text-right">Precio de Compra</Label>
            <Input id="purchasePrice" type="number" value={formData.purchasePrice} onChange={handleNumberChange} className="col-span-3" />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="discount" className="text-right">Descuento Compra (%)</Label>
            <Input id="discount" type="number" value={formData.discount} onChange={handleNumberChange} className="col-span-3" />
          </div>
           <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="tax" className="text-right">IVA (%)</Label>
            <Input id="tax" type="number" value={formData.tax} onChange={handleNumberChange} className="col-span-3" />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="incrementPercentage" className="text-right">Incremento (%)</Label>
            <Input id="incrementPercentage" type="number" value={formData.incrementPercentage} onChange={handleNumberChange} className="col-span-3" />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="salePrice" className="text-right font-bold">Precio de Venta</Label>
            <Input id="salePrice" type="number" value={formData.salePrice} className="col-span-3 font-bold bg-muted" readOnly />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="profitMargin" className="text-right">Margen (%)</Label>
            <Input id="profitMargin" type="number" value={formData.profitMargin} className="col-span-3 bg-muted" readOnly />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="supplier" className="text-right">Proveedor</Label>
            <Input id="supplier" value={formData.supplier} onChange={handleChange} className="col-span-3" />
          </div>
           <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="imageUrl" className="text-right">URL de Imagen</Label>
            <Input id="imageUrl" value={formData.imageUrl} onChange={handleChange} placeholder="https://picsum.photos/seed/..." className="col-span-3" />
          </div>
          <DialogFooter>
            <Button type="submit">Guardar Producto</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
