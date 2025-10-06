
"use client"

import * as React from "react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { useToast } from "@/hooks/use-toast"
import type { Product } from "@/lib/types"
import { categories } from "@/lib/data"

interface EditProductDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  product: Product;
  onProductUpdate: (product: Product) => void;
}

export default function EditProductDialog({ open, onOpenChange, product, onProductUpdate }: EditProductDialogProps) {
  const [formData, setFormData] = React.useState<Partial<Product>>(product);
  const { toast } = useToast()

  React.useEffect(() => {
    setFormData(product)
  }, [product])

  React.useEffect(() => {
    if (formData.purchasePrice !== undefined && formData.discount !== undefined && formData.tax !== undefined && formData.incrementPercentage !== undefined) {
      const priceWithDiscount = formData.purchasePrice * (1 - (formData.discount / 100));
      const priceWithTax = priceWithDiscount * (1 + (formData.tax / 100));
      const suggestedSalePrice = priceWithTax * (1 + (formData.incrementPercentage / 100));
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

  const handleCategoryChange = (value: string) => {
    setFormData(prev => ({ ...prev, category: value }));
  }

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
    
    onProductUpdate(formData as Product);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Editar Producto</DialogTitle>
          <DialogDescription>
            Actualiza los detalles del producto.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="grid gap-4 py-4 max-h-[70vh] overflow-y-auto pr-6">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="name" className="text-right">Nombre</Label>
            <Input id="name" value={formData.name} onChange={handleChange} className="col-span-3" />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="id" className="text-right">Código</Label>
            <Input id="id" value={formData.id} onChange={handleChange} className="col-span-3" readOnly />
          </div>
           <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="description" className="text-right">Descripción</Label>
            <Textarea id="description" value={formData.description} onChange={handleChange} className="col-span-3" />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="category" className="text-right">Categoría</Label>
             <Select onValueChange={handleCategoryChange} value={formData.category}>
                <SelectTrigger className="col-span-3">
                    <SelectValue placeholder="Selecciona una categoría" />
                </SelectTrigger>
                <SelectContent>
                    {categories.map(cat => (
                        <SelectItem key={cat.id} value={cat.name}>{cat.name}</SelectItem>
                    ))}
                </SelectContent>
            </Select>
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
            <Button type="submit">Guardar Cambios</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
