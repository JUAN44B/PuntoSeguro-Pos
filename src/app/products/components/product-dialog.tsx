'use client';

import { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import { useFirestore, useCollection } from '@/firebase';
import { collection } from 'firebase/firestore';
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
  const firestore = useFirestore();
  const { data: categories } = useCollection(collection(firestore, 'categories'));
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
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4">
            {/* Left Column */}
            <div className="space-y-4">
                <div className="flex flex-col items-center gap-4">
                    <div className="relative w-32 h-32 border rounded-md flex items-center justify-center bg-muted/40">
                        {imagePreview ? (
                            <Image src={imagePreview} alt="Vista previa" fill={true} objectFit="cover" className="rounded-md" />
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
                <div className="space-y-2">
                    <Label htmlFor="code">Código de Barras (EAN-13)</Label>
                    <div className='flex gap-2'>
                        <Input id="code" value={formData.code} onChange={handleCodeChange} maxLength={13} placeholder="Hasta 13 dígitos numéricos" />
                        <Button variant='outline' size='icon' onClick={() => setFormData(prev => ({...prev, code: generateEAN13()}))}><RefreshCw className='h-4 w-4'/></Button>
                    </div>
                    {formData.code && <div className="pt-2"><Barcode text={formData.code}/></div>}
                </div>
                <div className="space-y-2">
                    <Label htmlFor="name">Nombre del Producto</Label>
                    <Input id="name" value={formData.name} onChange={(e) => setFormData(prev => ({...prev, name: e.target.value}))} />
                </div>
                <div className="space-y-2">
                    <Label htmlFor="category">Categoría</Label>
                    <Select value={formData.category} onValueChange={(value) => handleSelectChange('category', value)}>
                        <SelectTrigger>
                            <SelectValue placeholder="Selecciona una categoría..." />
                        </SelectTrigger>
                        <SelectContent>
                            {(categories as Category[] || []).map(cat => (
                                <SelectItem key={cat.id} value={cat.name}>{cat.name}</SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>
                 <div className='grid grid-cols-2 gap-4'>
                    <div className="space-y-2">
                        <Label htmlFor="stock">Existencia</Label>
                        <Input id="stock" type="number" value={formData.stock} onChange={handleNumberChange} />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="status">Estado</Label>
                        <Select value={formData.status} onValueChange={(value) => handleSelectChange('status', value)}>
                            <SelectTrigger>
                                <SelectValue placeholder="Selecciona..." />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="Activo">Activo</SelectItem>
                                <SelectItem value="Borrador">Borrador</SelectItem>
                                <SelectItem value="Archivado">Archivado</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                </div>
            </div>

            {/* Right Column */}
            <div className="space-y-4">
                <div className='p-4 border rounded-md space-y-4 bg-muted/20'>
                    <h4 className='font-medium text-sm text-muted-foreground'>Cálculo de Precios</h4>
                    <div className="grid grid-cols-3 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="purchasePrice">P. Compra</Label>
                            <Input id="purchasePrice" type="number" value={formData.purchasePrice} onChange={handleNumberChange} placeholder="$" />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="discount">Descuento</Label>
                            <Input id="discount" type="number" value={formData.discount} onChange={handleNumberChange} placeholder="%" />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="profitMargin">Ganancia</Label>
                            <Input id="profitMargin" type="number" value={formData.profitMargin} onChange={handleNumberChange} placeholder="%" />
                        </div>
                    </div>
                </div>
                <div className="space-y-2 pt-4">
                    <Label htmlFor="finalPrice">Precio de Venta Final (Automático)</Label>
                    <Input id="finalPrice" type="number" value={formData.finalPrice} onChange={(e) => setFormData(prev => ({...prev, finalPrice: Number(e.target.value)}))} className='border-primary border-2 text-lg font-bold text-center' />
                </div>
            </div>
        </div>

        <DialogFooter className='mt-4'>
          <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>Cancelar</Button>
          <Button type="submit" onClick={handleSubmit}>Guardar Cambios</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
