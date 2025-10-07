
'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { UserPlus, MoreHorizontal, Building, Save, Loader2 } from 'lucide-react';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { UserDialog, UserProfileData } from './components/user-dialog';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { getMockData } from '@/lib/mock-data';

export type UserProfile = {
    id: string;
    uid: string;
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
    const [users, setUsers] = useState<UserProfile[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        setUsers(getMockData().users);
        setLoading(false);
    }, []);

    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [editingUser, setEditingUser] = useState<UserProfile | null>(null);
    const [error, setError] = useState<string | null>(null);

    const [companyProfile, setCompanyProfile] = useState<CompanyProfileData>({
        name: "ALIRU Refacciones (Demo)",
        address: "Av. Principal #123, 00000, Ciudad, Estado",
        phone: "123 456 789",
        email: "contacto@aliru.com",
        fiscalId: "XAXX010101000",
        receiptFooterMessage: "¡Gracias por su compra! (Modo Demo)",
    });
    const [loadingCompany, setLoadingCompany] = useState(false);
    const [savingCompany, setSavingCompany] = useState(false);

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
        if (!userId || userId === 'local-admin') {
            alert("No se puede eliminar al administrador local.");
            return;
        };
        setUsers(prev => prev.filter(u => u.id !== userId));
    };

    const handleSaveUser = async (userData: UserProfileData) => {
        setError(null);
        if (editingUser) {
            // Update existing user
            setUsers(prev => prev.map(u => u.id === editingUser.id ? { ...editingUser, ...userData } : u));
        } else {
            // Create a new user
            if (!userData.password) {
                setError("La contraseña es obligatoria para nuevos usuarios.");
                return;
            }
            if (users.some(u => u.email === userData.email)) {
                setError("Este correo electrónico ya está en uso.");
                return;
            }
            const newUser: UserProfile = {
                id: new Date().toISOString(),
                uid: new Date().toISOString(),
                ...userData,
            };
            setUsers(prev => [...prev, newUser]);
        }
        setIsDialogOpen(false);
        setEditingUser(null);
    };
    
    const handleCompanyProfileChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { id, value } = e.target;
        setCompanyProfile(prev => ({ ...prev, [id]: value }));
    };

    const handleSaveCompanyProfile = async () => {
        setSavingCompany(true);
        // In mock mode, we just show a saving state.
        await new Promise(resolve => setTimeout(resolve, 500));
        setSavingCompany(false);
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
                        Esta información aparecerá en los recibos de venta y otros documentos. (Modo Demo)
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
                        Agrega, edita y elimina perfiles de usuario y asigna sus roles en el sistema. (Modo Demo)
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
                            ) : users.map((user) => (
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
                                                    disabled={user.id === 'local-admin'}
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
