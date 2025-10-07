
'use client';

import { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Trash2, Edit, Save, X } from 'lucide-react';
import { getMockData } from '@/lib/mock-data';

export type Category = {
  id: string;
  name: string;
};

export default function CategoriesPage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setCategories(getMockData().categories);
    setLoading(false);
  }, []);

  const [newCategoryName, setNewCategoryName] = useState('');
  const [editingCategoryId, setEditingCategoryId] = useState<string | null>(null);
  const [editingCategoryName, setEditingCategoryName] = useState('');

  const handleAddCategory = () => {
    if (newCategoryName.trim() === '') return;
    const newCategory: Category = {
        id: new Date().toISOString(),
        name: newCategoryName.trim(),
    };
    setCategories(prev => [...prev, newCategory]);
    setNewCategoryName('');
  };

  const handleEdit = (category: Category) => {
    setEditingCategoryId(category.id);
    setEditingCategoryName(category.name);
  };

  const handleUpdateCategory = () => {
    if (!editingCategoryId || editingCategoryName.trim() === '') return;
    setCategories(prev => prev.map(c => 
        c.id === editingCategoryId ? { ...c, name: editingCategoryName.trim() } : c
    ));
    setEditingCategoryId(null);
    setEditingCategoryName('');
  };

  const handleDeleteCategory = (categoryId: string) => {
    setCategories(prev => prev.filter(c => c.id !== categoryId));
  };

  return (
    <div className="flex flex-col gap-8">
      <div className="flex items-center">
        <h1 className="font-semibold text-4xl">Categorías de Productos</h1>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <Card>
          <CardHeader>
            <CardTitle>Agregar Nueva Categoría</CardTitle>
            <CardDescription>Crea una nueva categoría para organizar tus productos.</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex gap-2">
              <Input
                placeholder="Nombre de la categoría"
                value={newCategoryName}
                onChange={(e) => setNewCategoryName(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleAddCategory()}
              />
              <Button onClick={handleAddCategory}>Agregar</Button>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Categorías Existentes</CardTitle>
            <CardDescription>Administra las categorías de tu inventario.</CardDescription>
          </CardHeader>
          <CardContent>
            {loading && <p className="text-muted-foreground">Cargando categorías...</p>}
            <ul className="space-y-3">
              {categories.map((category) => (
                <li key={category.id} className="flex items-center justify-between p-2 rounded-md border bg-background">
                  {editingCategoryId === category.id ? (
                    <div className="flex-1 flex items-center gap-2">
                      <Input
                        value={editingCategoryName}
                        onChange={(e) => setEditingCategoryName(e.target.value)}
                        className="h-9"
                      />
                      <Button size="icon" className="h-9 w-9" onClick={handleUpdateCategory}><Save className="h-4 w-4" /></Button>
                      <Button size="icon" variant="ghost" className="h-9 w-9" onClick={() => setEditingCategoryId(null)}><X className="h-4 w-4" /></Button>
                    </div>
                  ) : (
                    <>
                      <span className="font-medium">{category.name}</span>
                      <div className="flex items-center gap-2">
                        <Button size="icon" variant="ghost" className="h-8 w-8" onClick={() => handleEdit(category)}>
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button size="icon" variant="ghost" className="h-8 w-8 text-destructive hover:text-destructive" onClick={() => handleDeleteCategory(category.id)}>
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </>
                  )}
                </li>
              ))}
               {!loading && categories.length === 0 && (
                <p className="text-sm text-muted-foreground text-center py-4">No hay categorías. Comienza agregando una.</p>
              )}
            </ul>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
