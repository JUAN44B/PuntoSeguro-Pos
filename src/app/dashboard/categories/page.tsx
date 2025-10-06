
"use client"
import * as React from "react";
import {
  File,
  MoreHorizontal,
  PlusCircle,
} from "lucide-react"

import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { categories as initialCategories } from "@/lib/data"
import { useToast } from "@/hooks/use-toast";
import type { Category } from "@/lib/types";
import AddCategoryDialog from "./components/add-category-dialog";
import EditCategoryDialog from "./components/edit-category-dialog";

export default function CategoriesPage() {
  const [categories, setCategories] = React.useState(initialCategories);
  const [editingCategory, setEditingCategory] = React.useState<Category | null>(null);
  const [isEditDialogOpen, setIsEditDialogOpen] = React.useState(false);
  const { toast } = useToast();

  const handleAddCategory = (newCategory: Category) => {
    setCategories(prev => [...prev, newCategory]);
    toast({
      title: "Categoría Agregada",
      description: `La categoría "${newCategory.name}" ha sido agregada.`,
    });
  };

  const handleEditCategory = (category: Category) => {
    setEditingCategory(category);
    setIsEditDialogOpen(true);
  };

  const handleUpdateCategory = (updatedCategory: Category) => {
    setCategories(prev => prev.map(c => c.id === updatedCategory.id ? updatedCategory : c));
    toast({
        title: "Categoría Actualizada",
        description: `La categoría "${updatedCategory.name}" ha sido actualizada.`,
    });
    setIsEditDialogOpen(false);
    setEditingCategory(null);
  };

  const handleDeleteCategory = (categoryId: string) => {
    setCategories(prev => prev.filter(c => c.id !== categoryId));
    toast({
      variant: "destructive",
      title: "Categoría Eliminada",
      description: "La categoría ha sido eliminada.",
    });
  };

  return (
    <div>
        <div className="flex items-center mb-4">
            <h1 className="text-2xl font-semibold">Categorías</h1>
            <div className="ml-auto flex items-center gap-2">
                <Button size="sm" variant="outline" className="h-7 gap-1">
                    <File className="h-3.5 w-3.5" />
                    <span className="sr-only sm:not-sr-only sm:whitespace-nowrap">
                    Exportar
                    </span>
                </Button>
                <AddCategoryDialog onCategoryAdd={handleAddCategory}>
                    <Button size="sm" className="h-7 gap-1">
                        <PlusCircle className="h-3.5 w-3.5" />
                        <span className="sr-only sm:not-sr-only sm:whitespace-nowrap">
                        Agregar Categoría
                        </span>
                    </Button>
                </AddCategoryDialog>
            </div>
        </div>
        <Card>
        <CardHeader>
          <CardTitle>Lista de Categorías</CardTitle>
          <CardDescription>
            Administra las categorías de tus productos.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Nombre</TableHead>
                <TableHead>Descripción</TableHead>
                <TableHead>
                  <span className="sr-only">Acciones</span>
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {categories.map((category) => (
                  <TableRow key={category.id}>
                  <TableCell className="font-medium">
                      {category.name}
                      <div className="text-xs text-muted-foreground">{category.id}</div>
                  </TableCell>
                  <TableCell>
                      {category.description}
                  </TableCell>
                  <TableCell>
                      <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                          <Button
                          aria-haspopup="true"
                          size="icon"
                          variant="ghost"
                          >
                          <MoreHorizontal className="h-4 w-4" />
                          <span className="sr-only">Toggle menu</span>
                          </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                          <DropdownMenuLabel>Acciones</DropdownMenuLabel>
                          <DropdownMenuItem onClick={() => handleEditCategory(category)}>Editar</DropdownMenuItem>
                          <DropdownMenuItem onClick={() => handleDeleteCategory(category.id)}>Eliminar</DropdownMenuItem>
                      </DropdownMenuContent>
                      </DropdownMenu>
                  </TableCell>
                  </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
        <CardFooter>
          <div className="text-xs text-muted-foreground">
            Mostrando <strong>1-{categories.length}</strong> de <strong>{categories.length}</strong>{" "}
            categorías
          </div>
        </CardFooter>
      </Card>
      {editingCategory && (
        <EditCategoryDialog
            key={editingCategory.id}
            open={isEditDialogOpen}
            onOpenChange={setIsEditDialogOpen}
            category={editingCategory}
            onCategoryUpdate={handleUpdateCategory}
        />
    )}
    </div>
  )
}
