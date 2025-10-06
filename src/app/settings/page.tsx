'use client';

import { useState, useEffect } from 'react';
import { useFirestore, useCollection } from '@/firebase';
import { collection, doc, updateDoc, getDocs } from 'firebase/firestore';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

type UserProfile = {
    id: string;
    uid: string;
    displayName: string;
    email: string;
    role: 'Administrador' | 'Cajero' | 'Supervisor';
};

export default function SettingsPage() {
    const firestore = useFirestore();
    const { data: users, loading } = useCollection(collection(firestore, 'users'));

    const handleRoleChange = async (userId: string, newRole: string) => {
        const userRef = doc(firestore, 'users', userId);
        try {
            await updateDoc(userRef, { role: newRole });
            // Optionally, add a toast to confirm the change
        } catch (error) {
            console.error("Error updating user role: ", error);
            // Optionally, add a toast to show an error
        }
    };

    return (
        <div className="flex flex-col gap-8">
            <div className="flex items-center">
                <h1 className="font-semibold text-4xl">Configuración del Sistema</h1>
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
                                <TableHead className="w-[200px]">Rol</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {loading ? (
                                <TableRow>
                                    <TableCell colSpan={3} className="h-24 text-center">
                                        Cargando usuarios...
                                    </TableCell>
                                </TableRow>
                            ) : (users as UserProfile[]).map((user) => (
                                <TableRow key={user.id}>
                                    <TableCell className="font-medium">{user.displayName || 'N/A'}</TableCell>
                                    <TableCell>{user.email}</TableCell>
                                    <TableCell>
                                        <Select
                                            defaultValue={user.role}
                                            onValueChange={(value) => handleRoleChange(user.id, value)}
                                        >
                                            <SelectTrigger>
                                                <SelectValue placeholder="Seleccionar rol" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="Administrador">Administrador</SelectItem>
                                                <SelectItem value="Supervisor">Supervisor</SelectItem>
                                                <SelectItem value="Cajero">Cajero</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>
        </div>
    );
}
