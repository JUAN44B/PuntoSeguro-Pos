
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
import { Upload, RefreshCw } from 'lucide-react';
import Barcode from '@/components/barcode';
import { getMockData } from '@/lib/mock-data';


export type Product = {
  id?: string;
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

type Category = {
    id: string;
    name: string;
};

interface ProductDialogProps {
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
  onSave: (product: Omit<Product, 'id'>) => void;
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
  const [categories, setCategories] = useState<Category[]>([]);

  useEffect(() => {
    setCategories(getMockData().categories);
  }, []);

  const [formData, setFormData] = useState<Omit<Product, 'id' | 'image'>>(emptyProduct);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen) {
        if (product) {
            setFormData(product);
            setImagePreview(product.image);
        } else {
            // For new products, start with empty form and calculate initial price
            const initialPrice = calculateFinalPrice(emptyProduct);
            setFormData({...emptyProduct, finalPrice: initialPrice, code: generateEAN13()});
            setImagePreview(null);
        }
    }
  }, [product, isOpen]);

  const generateEAN13 = () => {
    const code = Math.random().toString().slice(2, 14);
    let sum = 0;
    for (let i = 0; i < 12; i++) {
        sum += parseInt(code[i]) * (i % 2 === 0 ? 1 : 3);
    }
    const checksum = (10 - (sum % 10)) % 10;
    return code + checksum;
  };

  const calculateFinalPrice = (data: Omit<Product, 'id' | 'image'>) => {
    const { purchasePrice, discount, profitMargin } = data;
    const priceAfterDiscount = purchasePrice * (1 - discount / 100);
    const priceWithVat = priceAfterDiscount * 1.16; // Assuming 16% VAT
    const calculatedPrice = priceWithVat * (1 + profitMargin / 100);
    return parseFloat(calculatedPrice.toFixed(2));
  };

  const handleCodeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = e.target;
    // Allow only numbers and limit to 13 digits
    if (/^\d*$/.test(value) && value.length <= 13) {
      setFormData(prev => ({ ...prev, code: value }));
    }
  };

  const handleSelectChange = (id: keyof Omit<Product, 'id' | 'image'>, value: string) => {
    setFormData(prev => ({...prev, [id]: value}));
  }

  const handleNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;
    const newFormData = { ...formData, [id]: Number(value) };
    const newFinalPrice = calculateFinalPrice(newFormData);
    setFormData({ ...newFormData, finalPrice: newFinalPrice });
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
    onSave({ ...formData, image: imagePreview || '' } as Product);
  };

  const title = product ? 'Editar Producto' : 'Agregar Producto';
  const description = product ? 'Modifica los detalles del producto.' : 'Ingresa los detalles del nuevo producto.';

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-2xl">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription>
            {description}
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-4 pt-4 max-h-[70vh] overflow-y-auto pr-4">
            <div className="grid grid-cols-3 items-center gap-4">
              <Label className="text-right">Imagen</Label>
              <div className="col-span-2 flex items-center gap-4">
                <div className="relative w-24 h-24 border rounded-md flex items-center justify-center bg-muted/40 shrink-0">
                    {imagePreview ? (
                        <Image src={imagePreview} alt="Vista previa" fill={true} objectFit="cover" className="rounded-md" />
                    ) : (
                        <span className="text-xs text-muted-foreground text-center">Sin Imagen</span>
                    )}
                </div>
                <Button variant="outline" size="sm" onClick={() => fileInputRef.current?.click()}>
                    <Upload className="h-4 w-4 mr-2" />
                    Seleccionar...
                </Button>
                <Input type="file" ref={fileInputRef} onChange={handleImageChange} className="hidden" accept="image/*" />
              </div>
            </div>
            
            <div className="grid grid-cols-3 items-center gap-4">
              <Label htmlFor="name" className="text-right">Nombre del Producto</Label>
              <Input id="name" value={formData.name} onChange={(e) => setFormData(prev => ({...prev, name: e.target.value}))} className="col-span-2" />
            </div>

            <div className="grid grid-cols-3 items-center gap-4">
              <Label htmlFor="category" className="text-right">Categoría</Label>
               <Select value={formData.category} onValueChange={(value) => handleSelectChange('category', value)}>
                  <SelectTrigger className="col-span-2">
                      <SelectValue placeholder="Selecciona una categoría..." />
                  </SelectTrigger>
                  <SelectContent>
                      {categories.map(cat => (
                          <SelectItem key={cat.id} value={cat.name}>{cat.name}</SelectItem>
                      ))}
                  </SelectContent>
              </Select>
            </div>

            <div className="grid grid-cols-3 items-start gap-4">
              <Label htmlFor="code" className="text-right pt-2">Código de Barras</Label>
              <div className="col-span-2">
                  <div className='flex gap-2'>
                      <Input id="code" value={formData.code} onChange={handleCodeChange} maxLength={13} placeholder="Hasta 13 dígitos numéricos" />
                      <Button variant='outline' size='icon' onClick={() => setFormData(prev => ({...prev, code: generateEAN13()}))}><RefreshCw className='h-4 w-4'/></Button>
                  </div>
                  {formData.code && <div className="pt-2"><Barcode text={formData.code}/></div>}
              </div>
            </div>

            <div className="grid grid-cols-3 items-center gap-4">
                <Label htmlFor="stock" className="text-right">Existencia</Label>
                <Input id="stock" type="number" value={formData.stock} onChange={handleNumberChange} className="col-span-2" />
            </div>

            <div className="grid grid-cols-3 items-center gap-4">
                <Label htmlFor="status" className="text-right">Estado</Label>
                <Select value={formData.status} onValueChange={(value) => handleSelectChange('status', value)}>
                    <SelectTrigger className="col-span-2">
                        <SelectValue placeholder="Selecciona..." />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="Activo">Activo</SelectItem>
                        <SelectItem value="Borrador">Borrador</SelectItem>
                        <SelectItem value="Archivado">Archivado</SelectItem>
                    </SelectContent>
                </Select>
            </div>
            
            <div className='p-4 border rounded-md space-y-4 bg-muted/20 mt-6'>
                <h4 className='font-medium text-center text-sm text-muted-foreground mb-4'>Cálculo de Precios</h4>
                <div className="grid grid-cols-3 items-center gap-4">
                    <Label htmlFor="purchasePrice" className="text-right">Precio Compra</Label>
                    <Input id="purchasePrice" type="number" value={formData.purchasePrice} onChange={handleNumberChange} placeholder="$" className="col-span-2" />
                </div>
                <div className="grid grid-cols-3 items-center gap-4">
                    <Label htmlFor="discount" className="text-right">Descuento (%)</Label>
                    <Input id="discount" type="number" value={formData.discount} onChange={handleNumberChange} placeholder="%" className="col-span-2" />
                </div>
                <div className="grid grid-cols-3 items-center gap-4">
                    <Label htmlFor="profitMargin" className="text-right">Ganancia (%)</Label>
                    <Input id="profitMargin" type="number" value={formData.profitMargin} onChange={handleNumberChange} placeholder="%" className="col-span-2" />
                </div>
            </div>

            <div className="grid grid-cols-3 items-center gap-4 mt-6">
                <Label htmlFor="finalPrice" className="text-right text-base">Precio Venta Final</Label>
                <Input id="finalPrice" type="number" value={formData.finalPrice} onChange={(e) => setFormData(prev => ({...prev, finalPrice: Number(e.target.value)}))} className='col-span-2 border-primary border-2 text-lg font-bold' />
            </div>
        </div>

        <DialogFooter className='mt-4 pt-4 border-t'>
          <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>Cancelar</Button>
          <Button type="submit" onClick={handleSubmit}>Guardar Cambios</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
