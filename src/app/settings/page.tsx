'use client';

import { useState } from 'react';
import { useFirestore, useCollection, useAuth } from '@/firebase';
import { collection, doc, updateDoc, deleteDoc, setDoc } from 'firebase/firestore';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { UserPlus, MoreHorizontal } from 'lucide-react';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { UserDialog, UserProfileData } from './components/user-dialog';

// NOTE: This implementation uses the client-side SDK to create users.
// For enhanced security in a production environment, this operation should ideally
// be handled by a backend service (e.g., a Firebase Cloud Function) using the Admin SDK.

export type UserProfile = {
    id: string; // This is the Firestore document ID which is the same as UID
    uid: string; // This is the Firebase Auth UID
    displayName: string;
    email: string;
    role: 'Administrador' | 'Cajero' | 'Supervisor';
};

export default function SettingsPage() {
    const firestore = useFirestore();
    const auth = useAuth(); // Use the auth instance from the provider
    const { data: users, loading } = useCollection(collection(firestore, 'users'));
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [editingUser, setEditingUser] = useState<UserProfile | null>(null);
    const [error, setError] = useState<string | null>(null);

    const handleAddUser = () => {
        setEditingUser(null);
        setError(null);
        setIsDialogOpen(true);
    };

    const handleEditUser = (user: UserProfile) => {
        setEditingUser(user);
        setError(null);
        setIsDialogOpen(true);
    };

    const handleDeleteUser = async (userId: string) => {
        if (!userId) return;
        // NOTE: This only deletes the Firestore document. Deleting the actual
        // Firebase Auth user requires a backend function with the Admin SDK.
        try {
            await deleteDoc(doc(firestore, "users", userId));
        } catch(e) {
            console.error("Error deleting user document: ", e);
            setError("Error al eliminar el perfil de usuario.");
        }
    };

    const handleSaveUser = async (userData: UserProfileData) => {
        setError(null);
        try {
            if (editingUser) {
                // Update existing user's Firestore document
                const userRef = doc(firestore, 'users', editingUser.id);
                await updateDoc(userRef, {
                    displayName: userData.displayName,
                    role: userData.role,
                });
            } else {
                // Create a new user
                if (!userData.password) {
                    setError("La contraseña es obligatoria para nuevos usuarios.");
                    return;
                }
                
                // 1. Create user in Firebase Authentication
                const userCredential = await createUserWithEmailAndPassword(auth, userData.email, userData.password);
                const newUser = userCredential.user;

                // 2. Create user profile in Firestore using the Auth UID as the document ID
                await setDoc(doc(firestore, 'users', newUser.uid), {
                    uid: newUser.uid,
                    displayName: userData.displayName,
                    email: userData.email,
                    role: userData.role,
                });

                // Note: createUserWithEmailAndPassword also signs in the new user.
                // In a real admin panel, you would likely want to sign them out immediately
                // and sign the admin back in, but that requires more complex state management.
            }
            setIsDialogOpen(false);
            setEditingUser(null);
        } catch (error: any) {
            console.error("Error saving user: ", error);
            if (error.code === 'auth/email-already-in-use') {
                setError("Este correo electrónico ya está en uso. Por favor, utiliza otro.");
            } else if (error.code === 'auth/weak-password') {
                setError("La contraseña es demasiado débil. Debe tener al menos 6 caracteres.");
            } else {
                setError("Ocurrió un error al guardar el usuario.");
            }
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
                        Agrega, edita y elimina perfiles de usuario y asigna sus roles en el sistema.
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
                error={error}
            />
        </div>
    );
}
