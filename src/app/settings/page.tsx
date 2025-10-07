'use client';

import { useState, useEffect } from 'react';
import { useFirestore, useCollection, useAuth } from '@/firebase';
import { collection, doc, updateDoc, deleteDoc, setDoc, getDoc } from 'firebase/firestore';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { UserPlus, MoreHorizontal, Building, Save, Loader2 } from 'lucide-react';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { UserDialog, UserProfileData } from './components/user-dialog';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';

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

type CompanyProfileData = {
    name?: string;
    address?: string;
    phone?: string;
    email?: string;
    fiscalId?: string;
    receiptFooterMessage?: string;
};

export default function SettingsPage() {
    const firestore = useFirestore();
    const auth = useAuth(); // Use the auth instance from the provider
    const { data: users, loading } = useCollection(collection(firestore, 'users'));
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [editingUser, setEditingUser] = useState<UserProfile | null>(null);
    const [error, setError] = useState<string | null>(null);

    const [companyProfile, setCompanyProfile] = useState<CompanyProfileData>({});
    const [loadingCompany, setLoadingCompany] = useState(true);
    const [savingCompany, setSavingCompany] = useState(false);

    useEffect(() => {
        const fetchCompanyProfile = async () => {
            setLoadingCompany(true);
            const docRef = doc(firestore, 'company', 'main');
            const docSnap = await getDoc(docRef);
            if (docSnap.exists()) {
                setCompanyProfile(docSnap.data() as CompanyProfileData);
            }
            setLoadingCompany(false);
        };
        fetchCompanyProfile();
    }, [firestore]);


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
    
    const handleCompanyProfileChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { id, value } = e.target;
        setCompanyProfile(prev => ({ ...prev, [id]: value }));
    };

    const handleSaveCompanyProfile = async () => {
        setSavingCompany(true);
        try {
            const docRef = doc(firestore, 'company', 'main');
            await setDoc(docRef, companyProfile, { merge: true });
        } catch (error) {
            console.error("Error saving company profile:", error);
        } finally {
            setSavingCompany(false);
        }
    };


    return (
        <div className="flex flex-col gap-8">
            <div className="flex items-center">
                <h1 className="font-semibold text-4xl">Configuración del Sistema</h1>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle className='flex items-center gap-2'><Building className='h-5 w-5'/> Datos de la Empresa</CardTitle>
                    <CardDescription>
                        Esta información aparecerá en los recibos de venta y otros documentos.
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    {loadingCompany ? (
                         <div className='flex justify-center items-center h-48'>
                            <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
                        </div>
                    ) : (
                        <div className="space-y-4">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label htmlFor="name">Nombre del Negocio</Label>
                                    <Input id="name" value={companyProfile.name || ''} onChange={handleCompanyProfileChange} />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="fiscalId">RFC / ID Fiscal</Label>
                                    <Input id="fiscalId" value={companyProfile.fiscalId || ''} onChange={handleCompanyProfileChange} />
                                </div>
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="address">Dirección</Label>
                                <Input id="address" value={companyProfile.address || ''} onChange={handleCompanyProfileChange} />
                            </div>
                             <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label htmlFor="phone">Teléfono</Label>
                                    <Input id="phone" value={companyProfile.phone || ''} onChange={handleCompanyProfileChange} />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="email">Correo Electrónico</Label>
                                    <Input id="email" type="email" value={companyProfile.email || ''} onChange={handleCompanyProfileChange} />
                                </div>
                            </div>
                             <div className="space-y-2">
                                <Label htmlFor="receiptFooterMessage">Mensaje al Pie del Ticket</Label>
                                <Textarea id="receiptFooterMessage" value={companyProfile.receiptFooterMessage || ''} onChange={handleCompanyProfileChange} placeholder="Ej. ¡Gracias por su compra!" />
                            </div>
                            <div className='flex justify-end'>
                                <Button onClick={handleSaveCompanyProfile} disabled={savingCompany}>
                                    {savingCompany ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Save className="mr-2 h-4 w-4" />}
                                    Guardar Cambios
                                </Button>
                            </div>
                        </div>
                    )}
                </CardContent>
            </Card>


            <Card>
                <CardHeader>
                    <CardTitle>Gestión de Usuarios y Roles</CardTitle>
                    <CardDescription>
                        Agrega, edita y elimina perfiles de usuario y asigna sus roles en el sistema.
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="flex justify-end mb-4">
                        <Button onClick={handleAddUser}><UserPlus className="mr-2 h-4 w-4" /> Agregar Usuario</Button>
                    </div>
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
