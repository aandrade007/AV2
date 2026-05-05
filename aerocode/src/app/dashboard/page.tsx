'use client'

import { useEffect, useState } from 'react'
import { Funcionario } from '../models/Funcionario'
import { useLocalStorage } from '../hooks/useLocalStorage'
import { Aeronave } from '../models/Aeronave'
import { mockAeronaves } from '../mocks/dadosIniciais'

export default function DashboardInicial() {
    // 1. Estado para guardar quem é o usuário logado
    const [usuario, setUsuario] = useState<Funcionario | null>(null)
    
    // 2. Usando o nosso Custom Hook para puxar as aeronaves salvas (ou os mocks)
    const [aeronaves] = useLocalStorage<Aeronave[]>('aerocode_aeronaves', mockAeronaves)

    // 3. Efeito para ler o usuário do localStorage assim que a tela carregar
    useEffect(() => {
        const sessao = localStorage.getItem('aerocode_sessao')
        if (sessao) {
            setUsuario(JSON.parse(sessao))
        }
    }, [])

    // Se o usuário ainda não carregou, mostramos um aviso rápido
    if (!usuario) {
        return <div className="text-slate-500 font-medium">Carregando painel de controle...</div>
    }

    // Calculando algumas estatísticas rápidas usando a lógica de programação
    const totalPecas = aeronaves.reduce((acc, aviao) => acc + aviao.pecas.length, 0)
    const totalEtapas = aeronaves.reduce((acc, aviao) => acc + aviao.etapas.length, 0)

    return (
        <div className="flex flex-col gap-6 animate-fade-in">
            {/* Cabeçalho de Boas-vindas */}
            <header className="bg-white p-8 rounded-xl shadow-sm border border-slate-200">
                <h1 className="text-3xl font-bold text-slate-800">
                    Bem-vindo(a), {usuario.nome}!
                </h1>
                <p className="text-slate-500 mt-2 text-lg">
                    Aqui está o resumo da produção na Aerocode hoje
                </p>
            </header>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                
                {/* Card 1: Aeronaves */}
                <div className="bg-gray-50 p-6 rounded-xl hover:scale-102 duration-200 border-l-6 border-l-blue-500">
                    <div className="flex items-center justify-between">
                        <h3 className="text-slate-500 text-sm font-bold uppercase tracking-wider">Aeronaves Registradas</h3>
                    </div>
                    <p className="text-4xl font-black text-slate-800 mt-4">{aeronaves.length}</p>
                </div>

                {/* Card 2: Peças */}
                <div className="bg-gray-50 p-6 rounded-xl hover:scale-102 duration-200 border-l-6 border-l-green-500">
                    <div className="flex items-center justify-between">
                        <h3 className="text-slate-500 text-sm font-bold uppercase tracking-wider">Peças em Estoque/Uso</h3>
                    </div>
                    <p className="text-4xl font-black text-slate-800 mt-4">{totalPecas}</p>
                </div>

                {/* Card 3: Etapas */}
                <div className="bg-gray-50 p-6 rounded-xl hover:scale-102 duration-200 border-l-6 border-l-red-500">
                    <div className="flex items-center justify-between">
                        <h3 className="text-slate-500 text-sm font-bold uppercase tracking-wider">Etapas de Produção</h3>
                    </div>
                    <p className="text-4xl font-black text-slate-800 mt-4">{totalEtapas}</p>
                </div>

            </div>

            {/* Seção de Informações Adicionais */}
            <div className="bg-gray-100 p-8 rounded-xl shadow-sm border border-gray-400 mt-4">
                <h2 className="text-xl font-bold text-slate-800 mb-4">Avisos do Sistema</h2>
                <div className="p-4 bg-indigo-50 text-indigo-800 rounded-lg border border-indigo-100">
                    <strong>Nível de Acesso:</strong> Você está logado como <strong>{usuario.nivelPermissao}</strong>. Utilize o menu lateral para navegar pelas opções permitidas ao seu cargo.
                </div>
            </div>
        </div>
    )
}