
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

export default function AddProductDialog({ children, onProductAdd }: AddProductDialogProps) {
  const [open, setOpen] = React.useState(false)
  const [formData, setFormData] = React.useState<Partial<Product>>({
    id: '',
    name: '',
    description: '',
    category: '',
    stock: 0,
    purchasePrice: 0,
    salePrice: 0,
    tax: 16,
    discount: 0,
    supplier: '',
    imageUrl: '',
    imageHint: '',
  });
  const { toast } = useToast()

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
            title: "Missing Information",
            description: "Product Name and Code are required.",
        });
        return;
    }
    
    const profitMargin = formData.salePrice && formData.purchasePrice 
      ? ((formData.salePrice - formData.purchasePrice) / formData.purchasePrice) * 100
      : 0;

    const newProduct: Product = {
      id: formData.id || `PROD${Math.floor(Math.random() * 1000)}`,
      name: formData.name || "Unnamed Product",
      description: formData.description || "",
      category: formData.category || "General",
      stock: formData.stock || 0,
      purchasePrice: formData.purchasePrice || 0,
      salePrice: formData.salePrice || 0,
      tax: formData.tax || 16,
      discount: formData.discount || 0,
      profitMargin: profitMargin,
      supplier: formData.supplier || "",
      imageUrl: formData.imageUrl || `https://picsum.photos/seed/${formData.id}/400/300`,
      imageHint: formData.imageHint || formData.name?.toLowerCase() || 'product',
    };

    onProductAdd(newProduct);
    setOpen(false); // Close the dialog
    // Reset form
    setFormData({
        id: '', name: '', description: '', category: '', stock: 0,
        purchasePrice: 0, salePrice: 0, tax: 16, discount: 0,
        supplier: '', imageUrl: '', imageHint: ''
    });
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {children}
      </DialogTrigger>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Add New Product</DialogTitle>
          <DialogDescription>
            Fill in the details below to add a new product to your inventory.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="grid gap-4 py-4 max-h-[70vh] overflow-y-auto pr-6">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="name" className="text-right">Name</Label>
            <Input id="name" value={formData.name} onChange={handleChange} className="col-span-3" />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="id" className="text-right">Code</Label>
            <Input id="id" value={formData.id} onChange={handleChange} className="col-span-3" />
          </div>
           <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="description" className="text-right">Description</Label>
            <Textarea id="description" value={formData.description} onChange={handleChange} className="col-span-3" />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="category" className="text-right">Category</Label>
            <Input id="category" value={formData.category} onChange={handleChange} className="col-span-3" />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="stock" className="text-right">Stock</Label>
            <Input id="stock" type="number" value={formData.stock} onChange={handleNumberChange} className="col-span-3" />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="purchasePrice" className="text-right">Purchase Price</Label>
            <Input id="purchasePrice" type="number" value={formData.purchasePrice} onChange={handleNumberChange} className="col-span-3" />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="salePrice" className="text-right">Sale Price</Label>
            <Input id="salePrice" type="number" value={formData.salePrice} onChange={handleNumberChange} className="col-span-3" />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="discount" className="text-right">Discount (%)</Label>
            <Input id="discount" type="number" value={formData.discount} onChange={handleNumberChange} className="col-span-3" />
          </div>
           <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="tax" className="text-right">Tax (%)</Label>
            <Input id="tax" type="number" value={formData.tax} onChange={handleNumberChange} className="col-span-3" />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="supplier" className="text-right">Supplier</Label>
            <Input id="supplier" value={formData.supplier} onChange={handleChange} className="col-span-3" />
          </div>
           <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="imageUrl" className="text-right">Image URL</Label>
            <Input id="imageUrl" value={formData.imageUrl} onChange={handleChange} placeholder="https://picsum.photos/seed/..." className="col-span-3" />
          </div>
          <DialogFooter>
            <Button type="submit">Save Product</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
