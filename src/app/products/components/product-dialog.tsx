'use client';

import { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
  } from "@/components/ui/select"
import { Upload } from 'lucide-react';

export type Product = {
  id: string;
  code: string;
  name: string;
  status: 'Activo' | 'Borrador' | 'Archivado';
  purchasePrice: number;
  discount: number;
  profitMargin: number;
  finalPrice: number;
  stock: number;
  category: string;
  image: string;
};

interface ProductDialogProps {
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
  onSave: (product: Product) => void;
  product: Product | null;
}

const emptyProduct: Omit<Product, 'id' | 'image'> = {
    code: '',
    name: '',
    category: '',
    purchasePrice: 0,
    discount: 0,
    profitMargin: 30, // Default profit margin
    finalPrice: 0,
    stock: 0,
    status: 'Activo',
};

export function ProductDialog({ isOpen, onOpenChange, onSave, product }: ProductDialogProps) {
  const [formData, setFormData] = useState<Omit<Product, 'id' | 'image'>>(emptyProduct);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [suggestedPrice, setSuggestedPrice] = useState(0);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (product) {
      setFormData(product);
      setImagePreview(product.image);
    } else {
      setFormData(emptyProduct);
      setImagePreview(null);
    }
  }, [product, isOpen]);

  useEffect(() => {
    const { purchasePrice, discount, profitMargin } = formData;
    const priceAfterDiscount = purchasePrice * (1 - discount / 100);
    const priceWithVat = priceAfterDiscount * 1.16; // Assuming 16% VAT
    const calculatedPrice = priceWithVat * (1 + profitMargin / 100);
    setSuggestedPrice(calculatedPrice);
    if (!product) { // Only auto-update final price for new products
        setFormData(prev => ({...prev, finalPrice: parseFloat(calculatedPrice.toFixed(2))}))
    }
  }, [formData.purchasePrice, formData.discount, formData.profitMargin, product]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;
    setFormData(prev => ({ ...prev, [id]: value }));
  };

  const handleSelectChange = (id: keyof Omit<Product, 'id' | 'image'>, value: string) => {
    setFormData(prev => ({...prev, [id]: value}))
  }

  const handleNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;
    setFormData(prev => ({ ...prev, [id]: Number(value) }));
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = () => {
    onSave({ ...product, ...formData, image: imagePreview || '' } as Product);
  };

  const title = product ? 'Editar Producto' : 'Agregar Producto';
  const description = product ? 'Modifica los detalles del producto.' : 'Ingresa los detalles del nuevo producto.';

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription>
            {description}
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
            <div className='flex flex-col items-center gap-4'>
                <div className="relative w-32 h-32 border rounded-md flex items-center justify-center bg-muted/40">
                    {imagePreview ? (
                        <Image src={imagePreview} alt="Vista previa" layout="fill" objectFit="cover" className="rounded-md" />
                    ) : (
                        <span className="text-xs text-muted-foreground">Imagen</span>
                    )}
                </div>
                <Button variant="outline" size="sm" onClick={() => fileInputRef.current?.click()}>
                    <Upload className="h-4 w-4 mr-2" />
                    Seleccionar archivo
                </Button>
                <Input type="file" ref={fileInputRef} onChange={handleImageChange} className="hidden" accept="image/*" />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="code" className="text-right">Código</Label>
                <Input id="code" value={formData.code} onChange={handleChange} className="col-span-3" />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="name" className="text-right">Nombre</Label>
                <Input id="name" value={formData.name} onChange={handleChange} className="col-span-3" />
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
                <Label htmlFor="purchasePrice" className="text-right">P. Compra</Label>
                <Input id="purchasePrice" type="number" value={formData.purchasePrice} onChange={handleNumberChange} className="col-span-3" />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="discount" className="text-right">Descuento</Label>
                <Input id="discount" type="number" value={formData.discount} onChange={handleNumberChange} className="col-span-3" placeholder="%" />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="profitMargin" className="text-right">Ganancia</Label>
                <Input id="profitMargin" type="number" value={formData.profitMargin} onChange={handleNumberChange} className="col-span-3" placeholder="%" />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
                <Label className="text-right">P. Sugerido</Label>
                <div className="col-span-3 font-bold text-lg">${suggestedPrice.toFixed(2)}</div>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="finalPrice" className="text-right">P. Venta</Label>
                <Input id="finalPrice" type="number" value={formData.finalPrice} onChange={handleNumberChange} className="col-span-3" />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="status" className="text-right">Estado</Label>
                <Select
                value={formData.status}
                onValueChange={(value) => handleSelectChange('status', value)}
                >
                <SelectTrigger className="col-span-3">
                    <SelectValue placeholder="Selecciona un estado" />
                </SelectTrigger>
                <SelectContent>
                    <SelectItem value="Activo">Activo</SelectItem>
                    <SelectItem value="Borrador">Borrador</SelectItem>
                    <SelectItem value="Archivado">Archivado</SelectItem>
                </SelectContent>
                </Select>
            </div>
        </div>
        <DialogFooter>
          <Button type="submit" onClick={handleSubmit}>Guardar Cambios</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
