'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { Funcionario } from '../models/Funcionario'

export function useAuth() {
    const [usuario, setUsuario] = useState<Funcionario | null>(null)
    const [carregando, setCarregando] = useState(true)
    const router = useRouter()

    useEffect(() => {
        const sessao = localStorage.getItem('aerocode_sessao')

        if (!sessao) {
            router.replace('/')
            return
        }

        setUsuario(JSON.parse(sessao))
        setCarregando(false)
    }, [router])

    return { usuario, carregando }
}