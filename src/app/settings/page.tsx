'use client';

import { useState } from 'react';
import { useFirestore, useCollection } from '@/firebase';
import { collection, doc, updateDoc, deleteDoc, addDoc } from 'firebase/firestore';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { UserPlus, MoreHorizontal } from 'lucide-react';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { UserDialog, UserProfileData } from './components/user-dialog';


export type UserProfile = {
    id: string;
    uid?: string;
    displayName: string;
    email: string;
    role: 'Administrador' | 'Cajero' | 'Supervisor';
};

export default function SettingsPage() {
    const firestore = useFirestore();
    const { data: users, loading } = useCollection(collection(firestore, 'users'));
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [editingUser, setEditingUser] = useState<UserProfile | null>(null);

    const handleRoleChange = async (userId: string, newRole: string) => {
        const userRef = doc(firestore, 'users', userId);
        try {
            await updateDoc(userRef, { role: newRole });
        } catch (error) {
            console.error("Error updating user role: ", error);
        }
    };

    const handleAddUser = () => {
        setEditingUser(null);
        setIsDialogOpen(true);
    };

    const handleEditUser = (user: UserProfile) => {
        setEditingUser(user);
        setIsDialogOpen(true);
    };

    const handleDeleteUser = async (userId: string) => {
        if (!userId) return;
        try {
            await deleteDoc(doc(firestore, "users", userId));
        } catch(e) {
            console.error("Error deleting user: ", e);
        }
    };

    const handleSaveUser = async (userData: UserProfileData) => {
        // NOTE: In a real app, creating a user would involve a backend function
        // to securely create an auth user and then store their profile in Firestore.
        // For this UI, we'll simulate by adding/updating the Firestore document.
        try {
            if (editingUser) {
                // Update existing user
                const userRef = doc(firestore, 'users', editingUser.id);
                await updateDoc(userRef, {
                    displayName: userData.displayName,
                    role: userData.role,
                });
            } else {
                // Add new user profile to Firestore
                // This doesn't create an auth user, just the profile.
                await addDoc(collection(firestore, 'users'), {
                    displayName: userData.displayName,
                    email: userData.email,
                    role: userData.role,
                    uid: `placeholder-${Date.now()}` // Placeholder UID
                });
            }
            setIsDialogOpen(false);
            setEditingUser(null);
        } catch (error) {
            console.error("Error saving user: ", error);
        }
    };


    return (
        <div className="flex flex-col gap-8">
            <div className="flex items-center">
                <h1 className="font-semibold text-4xl">Configuración del Sistema</h1>
                <div className="ml-auto">
                    <Button onClick={handleAddUser}><UserPlus className="mr-2 h-4 w-4" /> Agregar Usuario</Button>
                </div>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>Gestión de Usuarios y Roles</CardTitle>
                    <CardDescription>Asigna roles a los empleados para controlar su nivel de acceso al sistema.</CardDescription>
                </CardHeader>
                <CardContent>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Nombre</TableHead>
                                <TableHead>Email</TableHead>
                                <TableHead>Rol</TableHead>
                                <TableHead><span className="sr-only">Acciones</span></TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {loading ? (
                                <TableRow>
                                    <TableCell colSpan={4} className="h-24 text-center">
                                        Cargando usuarios...
                                    </TableCell>
                                </TableRow>
                            ) : (users as UserProfile[]).map((user) => (
                                <TableRow key={user.id}>
                                    <TableCell className="font-medium">{user.displayName || 'N/A'}</TableCell>
                                    <TableCell>{user.email}</TableCell>
                                    <TableCell>{user.role}</TableCell>
                                    <TableCell className="text-right">
                                        <DropdownMenu>
                                            <DropdownMenuTrigger asChild>
                                                <Button size="icon" variant="ghost">
                                                    <MoreHorizontal className="h-4 w-4" />
                                                    <span className="sr-only">Abrir menú</span>
                                                </Button>
                                            </DropdownMenuTrigger>
                                            <DropdownMenuContent align="end">
                                                <DropdownMenuLabel>Acciones</DropdownMenuLabel>
                                                <DropdownMenuItem onClick={() => handleEditUser(user)}>Editar</DropdownMenuItem>
                                                <DropdownMenuItem 
                                                    onSelect={() => handleRoleChange(user.id, 'Administrador')}
                                                    disabled={user.role === 'Administrador'}
                                                >
                                                    Hacer Administrador
                                                </DropdownMenuItem>
                                                <DropdownMenuItem 
                                                    onSelect={() => handleRoleChange(user.id, 'Cajero')}
                                                    disabled={user.role === 'Cajero'}
                                                >
                                                    Hacer Cajero
                                                </DropdownMenuItem>
                                                <DropdownMenuItem 
                                                    className="text-destructive"
                                                    onClick={() => handleDeleteUser(user.id)}
                                                >
                                                    Eliminar
                                                </DropdownMenuItem>
                                            </DropdownMenuContent>
                                        </DropdownMenu>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>

            <UserDialog 
                isOpen={isDialogOpen}
                onOpenChange={setIsDialogOpen}
                onSave={handleSaveUser}
                user={editingUser}
            />
        </div>
    );
}
