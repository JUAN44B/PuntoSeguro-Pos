
'use client';

import { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Loader2 } from 'lucide-react';
import { OpenCashDrawerDialog } from './components/open-cash-drawer-dialog';
import { CloseCashDrawerDialog } from './components/close-cash-drawer-dialog';
import { useUser } from '@/hooks/use-user';
import { getMockData } from '@/lib/mock-data';

export type CashSession = {
    id: string;
    openedAt: { seconds: number } | null;
    closedAt?: { seconds: number } | null;
    openingBalance: number;
    closingBalance?: number;
    expectedBalance?: number;
    cashSales: number;
    status: 'abierta' | 'cerrada';
    userId: string;
    userName: string;
    difference?: number;
};

const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(amount);
};

export default function CashManagementPage() {
    const { user, loading: userLoading } = useUser();
    const [sessions, setSessions] = useState<CashSession[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const mockData = getMockData();
        // Get the latest session
        const latestSession = mockData.cashSessions.sort((a,b) => b.openedAt!.seconds - a.openedAt!.seconds)[0];
        setSessions(latestSession ? [latestSession] : []);
        setLoading(false);
    }, []);

    const [isOpening, setIsOpening] = useState(false);
    const [isClosing, setIsClosing] = useState(false);

    const activeSession = sessions.length > 0 && sessions[0].status === 'abierta' ? sessions[0] : null;
    const lastClosedSession = sessions.length > 0 && sessions[0].status === 'cerrada' ? sessions[0] : null;

    const isLoading = userLoading || loading;

    const handleOpenSession = async (openingBalance: number) => {
        if (!user) return;
        
        const newSession: CashSession = {
            id: new Date().toISOString(),
            openedAt: { seconds: Date.now() / 1000 },
            openingBalance,
            cashSales: 0,
            status: 'abierta',
            userId: user.uid,
            userName: user.displayName || 'Usuario',
        };

        setSessions([newSession]);
        setIsOpening(false);
    };

    const handleCloseSession = async (closingBalance: number) => {
        if (!activeSession) return;

        const expectedBalance = activeSession.openingBalance + activeSession.cashSales;
        const difference = closingBalance - expectedBalance;

        const closedSession: CashSession = {
            ...activeSession,
            closedAt: { seconds: Date.now() / 1000 },
            closingBalance,
            expectedBalance,
            difference,
            status: 'cerrada',
        };

        setSessions([closedSession]);
        setIsClosing(false);
    };

    return (
        <>
            <div className="flex flex-col gap-8">
                <div className="flex items-center">
                    <h1 className="font-semibold text-4xl">Gestión de Caja</h1>
                </div>

                {isLoading && (
                    <div className='flex justify-center items-center h-64'>
                        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
                    </div>
                )}
                
                {!isLoading && (
                    activeSession ? (
                        <Card>
                            <CardHeader>
                                <CardTitle>Caja Abierta</CardTitle>
                                <CardDescription>
                                    La caja fue abierta por <span className='font-semibold'>{activeSession.userName}</span> el {activeSession.openedAt ? new Date(activeSession.openedAt.seconds * 1000).toLocaleString('es-MX') : 'Calculando...'}.
                                </CardDescription>
                            </CardHeader>
                            <CardContent className="grid md:grid-cols-3 gap-6">
                                <div className="p-6 border rounded-lg">
                                    <p className="text-sm font-medium text-muted-foreground">Fondo Inicial</p>
                                    <p className="text-2xl font-bold">{formatCurrency(activeSession.openingBalance)}</p>
                                </div>
                                <div className="p-6 border rounded-lg">
                                    <p className="text-sm font-medium text-muted-foreground">Ventas en Efectivo</p>
                                    <p className="text-2xl font-bold">{formatCurrency(activeSession.cashSales)}</p>
                                </div>
                                <div className="p-6 border rounded-lg bg-primary/10">
                                    <p className="text-sm font-medium text-primary">Saldo Esperado en Caja</p>
                                    <p className="text-2xl font-bold text-primary">{formatCurrency(activeSession.openingBalance + activeSession.cashSales)}</p>
                                </div>
                                <div className='md:col-span-3'>
                                    <Button size="lg" className='w-full' onClick={() => setIsClosing(true)}>Realizar Corte y Cerrar Caja</Button>
                                </div>
                            </CardContent>
                        </Card>
                    ) : (
                        <Card className="flex flex-col items-center justify-center p-12 text-center">
                            <CardTitle>Caja Cerrada</CardTitle>
                            <CardDescription className='mt-2'>No hay ninguna sesión de caja activa en este momento.</CardDescription>
                            <Button size="lg" className="mt-6" onClick={() => setIsOpening(true)}>Abrir Caja</Button>

                            {lastClosedSession && (
                                <div className='mt-8 pt-6 border-t w-full text-left'>
                                    <h3 className='font-semibold'>Último Corte de Caja</h3>
                                    <p className='text-sm text-muted-foreground'>
                                        Cerrada por <span className='font-semibold'>{lastClosedSession.userName}</span> el {lastClosedSession.closedAt ? new Date(lastClosedSession.closedAt.seconds * 1000).toLocaleString('es-MX') : 'Calculando...'}
                                    </p>
                                    <div className='grid sm:grid-cols-2 lg:grid-cols-4 gap-4 mt-4'>
                                        <div className="p-3 border rounded-lg text-sm">
                                            <p className="font-medium text-muted-foreground">Saldo Esperado</p>
                                            <p className="font-bold">{formatCurrency(lastClosedSession.expectedBalance!)}</p>
                                        </div>
                                        <div className="p-3 border rounded-lg text-sm">
                                            <p className="font-medium text-muted-foreground">Saldo Contado</p>
                                            <p className="font-bold">{formatCurrency(lastClosedSession.closingBalance!)}</p>
                                        </div>
                                        <div className="p-3 border rounded-lg text-sm">
                                            <p className="font-medium text-muted-foreground">Diferencia</p>
                                            <p className={`font-bold ${lastClosedSession.difference! >= 0 ? 'text-green-600' : 'text-destructive'}`}>
                                                {formatCurrency(lastClosedSession.difference!)}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </Card>
                    )
                )}
            </div>
            
            <OpenCashDrawerDialog 
                isOpen={isOpening}
                onOpenChange={setIsOpening}
                onConfirm={handleOpenSession}
            />

            {activeSession && (
                <CloseCashDrawerDialog
                    isOpen={isClosing}
                    onOpenChange={setIsClosing}
                    onConfirm={handleCloseSession}
                    expectedAmount={activeSession.openingBalance + activeSession.cashSales}
                />
            )}
        </>
    );
}
