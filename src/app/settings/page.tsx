'use client';

import { useState } from 'react';
import { useFirestore, useCollection } from '@/firebase';
import { collection, doc, updateDoc, deleteDoc, addDoc } from 'firebase/firestore';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { UserPlus, MoreHorizontal } from 'lucide-react';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { UserDialog, UserProfileData } from './components/user-dialog';

// NOTE: Creating a user in Firebase Auth from a frontend admin panel is not secure.
// The standard practice is to use a backend function (like a Firebase Cloud Function)
// that uses the Admin SDK to create the user. The client then calls this function.
// This implementation simulates the UI/Firestore part of that flow. The admin would
// add the user profile here, and then create the corresponding auth user in the Firebase Console.

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
        // NOTE: This only deletes the Firestore document. Deleting the actual
        // Firebase Auth user requires a backend function.
        try {
            await deleteDoc(doc(firestore, "users", userId));
        } catch(e) {
            console.error("Error deleting user document: ", e);
        }
    };

    const handleSaveUser = async (userData: UserProfileData) => {
        try {
            if (editingUser) {
                // Update existing user's Firestore document
                const userRef = doc(firestore, 'users', editingUser.id);
                await updateDoc(userRef, {
                    displayName: userData.displayName,
                    role: userData.role,
                });
            } else {
                // Add new user profile to Firestore.
                // This does NOT create a Firebase Auth user.
                await addDoc(collection(firestore, 'users'), {
                    // A placeholder UID is often used until the real one is known
                    uid: `pending-${Date.now()}`, 
                    displayName: userData.displayName,
                    email: userData.email,
                    role: userData.role,
                });
            }
            setIsDialogOpen(false);
            setEditingUser(null);
        } catch (error) {
            console.error("Error saving user profile: ", error);
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
                    <CardDescription>
                        Agrega perfiles de usuario y asigna roles. Para que puedan iniciar sesión, deberás crear sus cuentas en la consola de Firebase Authentication.
                    </CardDescription>
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
