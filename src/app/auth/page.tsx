'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import Logo from '@/components/logo';
import { Loader2, AlertCircle } from 'lucide-react';

// This is a simplified, local-only authentication for demo purposes.
// It does NOT use Firebase.

export default function AuthPage() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);
    const router = useRouter();
    
    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        // Hardcoded credentials for local admin mode
        const isAdmin = email === 'admin@local.com' && password === 'admin123';

        // Simulate network delay
        await new Promise(resolve => setTimeout(resolve, 500));

        if (isAdmin) {
            // In a real app, you'd set a session token. Here, we'll use localStorage.
            try {
                localStorage.setItem('local-admin-auth', JSON.stringify({
                    uid: 'local-admin',
                    email: 'admin@local.com',
                    displayName: 'Admin Local',
                    role: 'Administrador',
                }));
                router.push('/');
            } catch (e) {
                setError('Tu navegador no es compatible con el modo local.');
                setLoading(false);
            }
        } else {
            setError('Credenciales inválidas. Usa "admin@local.com" y "admin123" para el modo local.');
            setLoading(false);
        }
    };

    return (
        <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-primary to-blue-800 p-4">
            <div className="w-full max-w-sm">
                <div className="bg-card rounded-2xl shadow-2xl p-8">
                    <div className="flex justify-center mb-6">
                        <Logo />
                    </div>
                    <h2 className="text-2xl font-bold text-center mb-2">Modo Administrador Local</h2>
                    <p className="text-muted-foreground text-center mb-8">Accede con credenciales de demostración.</p>
                    
                    <form onSubmit={handleLogin} className="space-y-6">
                        <div className="space-y-2">
                            <Label htmlFor="email">Correo Electrónico</Label>
                            <Input
                                id="email"
                                type="email"
                                placeholder="admin@local.com"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                                disabled={loading}
                                className="h-12"
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="password">Contraseña</Label>
                            <Input 
                                id="password" 
                                type="password" 
                                placeholder="admin123"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required 
                                disabled={loading}
                                className="h-12"
                            />
                        </div>
                        
                        {error && (
                            <Alert variant="destructive" className="bg-destructive/10">
                                <AlertCircle className="h-4 w-4" />
                                <AlertDescription>
                                    {error}
                                </AlertDescription>
                            </Alert>
                        )}

                        <Button type="submit" className="w-full h-12 text-base" disabled={loading}>
                            {loading ? <Loader2 className="animate-spin" /> : 'Ingresar'}
                        </Button>
                    </form>
                    <p className="text-xs text-center text-muted-foreground mt-6">
                        Estás en un modo de demostración. Los datos no se guardarán.
                    </p>
                </div>
            </div>
        </div>
    );
}
