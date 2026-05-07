'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useLocalStorage } from '../../hooks/useLocalStorage'
import { Aeronave } from '../../models/Aeronave'
import { mockAeronaves } from '../../mocks/dadosIniciais'

export default function ListarPecas() {
    const router = useRouter()
    const [isMounted, setIsMounted] = useState(false)
    const [aeronaves] = useLocalStorage<Aeronave[]>('aerocode_aeronaves', mockAeronaves)
    const [codigoAeronave, setCodigoAeronave] = useState('')

    // Proteção de Rota
    useEffect(() => {
        setIsMounted(true)
        const sessao = localStorage.getItem('aerocode_sessao')
        if (sessao) {
            const usuarioLogado = JSON.parse(sessao)
            if (usuarioLogado.nivelPermissao === 'OPERADOR') {
                router.push('/dashboard')
            }
        } else {
            router.push('/')
        }
    }, [router])

    if (!isMounted) return null

    const aeronaveSelecionada = aeronaves.find(a => a.codigo === codigoAeronave)
    const pecas = aeronaveSelecionada ? aeronaveSelecionada.pecas : []

    const getStatusBadge = (status: string) => {
        switch (status) {
            case 'EM_PRODUCAO':
                return <span className="px-3 py-1 rounded-full text-xs font-bold bg-blue-100 text-blue-700 border border-blue-200 shadow-sm flex items-center gap-2 w-max"><span className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></span> Em Produção</span>
            case 'EM_TRANSPORTE':
                return <span className="px-3 py-1 rounded-full text-xs font-bold bg-amber-100 text-amber-700 border border-amber-200 shadow-sm flex items-center gap-2 w-max"><span className="w-2 h-2 bg-amber-500 rounded-full"></span> Em Transporte</span>
            case 'PRONTA':
                return <span className="px-3 py-1 rounded-full text-xs font-bold bg-emerald-100 text-emerald-700 border border-emerald-200 shadow-sm flex items-center gap-2 w-max"><span className="w-2 h-2 bg-emerald-500 rounded-full"></span> Pronta</span>
            default:
                return <span className="px-3 py-1 rounded-full text-xs font-bold bg-slate-100 text-slate-700 border border-slate-200 shadow-sm w-max">{status}</span>
        }
    }

    const inputClass = "text-black w-full px-4 py-2 border border-black rounded-md outline-none focus:border-gray-500 focus:ring-1 focus:ring-black bg-white"

    return (
        <div className="w-full max-w-5xl mx-auto px-4 sm:px-6 lg:px-0 mt-16 lg:mt-0 pb-10 animate-fade-in">
            <header className="mb-8 flex flex-col sm:flex-row sm:justify-between sm:items-end gap-4">
                <div>
                    <h1 className="text-2xl sm:text-3xl font-bold text-white">Inventário de Peças</h1>
                    <p className="text-slate-100 mt-2">Inspecione os componentes e seus status por aeronave.</p>
                </div>
                <div className="text-center text-xl text-white p-2 px-4 font-bold bg-gray-500/70 rounded-2xl hidden sm:block">
                    Total na Aeronave: {pecas.length}
                </div>
            </header>

            <div className="bg-white p-5 sm:p-8 rounded-xl shadow-sm border border-slate-200 mb-8">
                <label className="block text-sm font-semibold text-slate-700 mb-2">Selecione a Aeronave para Inspecionar</label>
                <select
                    value={codigoAeronave}
                    onChange={(e) => setCodigoAeronave(e.target.value)}
                    className={inputClass}
                >
                    <option value="">-- Escolha o avião --</option>
                    {aeronaves.map(a => (
                        <option key={a.codigo} value={a.codigo}>
                            {a.codigo} - {a.modelo} ({a.tipo})
                        </option>
                    ))}
                </select>
            </div>

            {codigoAeronave && (
                <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
                    {pecas.length > 0 ? (
                        <div className="overflow-x-auto">
                            <table className="w-full text-left border-collapse">
                                <thead>
                                    <tr className="bg-slate-200 text-slate-600 text-sm uppercase tracking-wider border-b border-gray-400">
                                        <th className="p-4 font-semibold">Nome da Peça</th>
                                        <th className="p-4 font-semibold">Tipo</th>
                                        <th className="p-4 font-semibold">Fornecedor</th>
                                        <th className="p-4 font-semibold">Status Atual</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-300">
                                    {pecas.map((peca, index) => (
                                        <tr key={index} className="transition duration-150 hover:bg-slate-50">
                                            <td className="p-4 font-bold text-slate-800">{peca.nome}</td>
                                            <td className="p-4 text-slate-600 text-sm">{peca.tipo}</td>
                                            <td className="p-4 text-slate-600 text-sm font-medium">{peca.fornecedor}</td>
                                            <td className="p-4">
                                                {getStatusBadge(peca.status)}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    ) : (
                        <div className="p-12 text-center flex flex-col items-center justify-center">
                            <span className="text-4xl mb-4">🪹</span>
                            <h3 className="text-lg font-bold text-slate-700">Nenhuma peça encontrada</h3>
                            <p className="text-slate-500 mt-1">Esta aeronave ainda não possui componentes cadastrados.</p>
                        </div>
                    )}
                </div>
            )}
        </div>
    )
}