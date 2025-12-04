'use client';

import { useState, useEffect } from 'react';
import { MobileContainer } from '@/components/layout/MobileContainer';
import { Lock, AlertTriangle } from 'lucide-react';
import { useRouter } from 'next/navigation';

import { Dashboard } from '@/components/admin/Dashboard';

// Simple password for demo purposes. In production, use env vars or a real auth service.
const ADMIN_PASSWORD = 'admin';

export default function AdminPage() {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [attempts, setAttempts] = useState(0);
    const [lockoutUntil, setLockoutUntil] = useState<number | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Check lockout status
        const storedLockout = localStorage.getItem('admin_lockout');
        if (storedLockout) {
            const lockoutTime = parseInt(storedLockout, 10);
            if (Date.now() < lockoutTime) {
                setLockoutUntil(lockoutTime);
            } else {
                localStorage.removeItem('admin_lockout');
                localStorage.removeItem('admin_attempts');
            }
        }

        // Check attempts
        const storedAttempts = localStorage.getItem('admin_attempts');
        if (storedAttempts) {
            setAttempts(parseInt(storedAttempts, 10));
        }

        // Check session
        const session = sessionStorage.getItem('admin_session');
        if (session === 'true') {
            setIsAuthenticated(true);
        }

        setLoading(false);
    }, []);

    const handleLogin = (e: React.FormEvent) => {
        e.preventDefault();

        if (lockoutUntil) return;

        if (password === ADMIN_PASSWORD) {
            setIsAuthenticated(true);
            sessionStorage.setItem('admin_session', 'true');
            localStorage.removeItem('admin_attempts');
            setError('');
        } else {
            const newAttempts = attempts + 1;
            setAttempts(newAttempts);
            localStorage.setItem('admin_attempts', newAttempts.toString());

            if (newAttempts >= 3) {
                // Lock for 30 days (approx 1 month)
                const lockoutTime = Date.now() + (30 * 24 * 60 * 60 * 1000);
                localStorage.setItem('admin_lockout', lockoutTime.toString());
                setLockoutUntil(lockoutTime);
                setError('Demasiados intentos fallidos. Acceso bloqueado por 1 mes.');
            } else {
                setError(`Contraseña incorrecta. Intentos restantes: ${3 - newAttempts}`);
            }
        }
    };

    if (loading) return null;

    if (isAuthenticated) {
        return (
            <MobileContainer>
                <div className="p-4">
                    <Dashboard />
                </div>
            </MobileContainer>
        );
    }

    return (
        <MobileContainer className="flex flex-col items-center justify-center p-8">
            <div className="w-full max-w-sm space-y-8">
                <div className="text-center">
                    <div className="mx-auto h-12 w-12 bg-gray-900 dark:bg-white rounded-full flex items-center justify-center mb-4">
                        <Lock className="h-6 w-6 text-white dark:text-black" />
                    </div>
                    <h2 className="text-2xl font-bold">Acceso Administrativo</h2>
                    <p className="text-gray-500 mt-2">Introduce la contraseña para continuar</p>
                </div>

                {lockoutUntil ? (
                    <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 p-4 rounded-lg flex items-start gap-3">
                        <AlertTriangle className="w-5 h-5 text-red-600 dark:text-red-400 shrink-0 mt-0.5" />
                        <div className="text-sm text-red-600 dark:text-red-400">
                            <p className="font-semibold">Acceso Bloqueado</p>
                            <p>Inténtalo de nuevo después del {new Date(lockoutUntil).toLocaleDateString()}.</p>
                        </div>
                    </div>
                ) : (
                    <form onSubmit={handleLogin} className="space-y-6">
                        <div>
                            <input
                                type="password"
                                required
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-md bg-transparent focus:outline-none focus:ring-2 focus:ring-black dark:focus:ring-white"
                                placeholder="Contraseña"
                            />
                        </div>

                        {error && (
                            <p className="text-sm text-red-500 text-center">{error}</p>
                        )}

                        <button
                            type="submit"
                            className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-black dark:bg-white dark:text-black hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-black"
                        >
                            Entrar
                        </button>
                    </form>
                )}
            </div>
        </MobileContainer>
    );
}
