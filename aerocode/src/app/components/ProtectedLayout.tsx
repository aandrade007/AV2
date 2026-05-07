'use client'

import { useAuth } from '../hooks/useAuth'

export function ProtectedLayout({ children }: { children: React.ReactNode }) {
    const { carregando } = useAuth()

    if (carregando) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-slate-100">
                <div className="flex flex-col items-center gap-3 text-slate-500">
                    <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin" />
                    <span className="text-sm font-medium">Verificando sessão...</span>
                </div>
            </div>
        )
    }

    return <>{children}</>
}