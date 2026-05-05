'use client'
import { useState, useEffect } from 'react'
import { useLocalStorage } from '../../hooks/useLocalStorage'
import { Aeronave } from '../../models/Aeronave'
import { mockAeronaves } from '../../mocks/dadosIniciais'

export default function ListarEtapas() {
    const [aeronaves] = useLocalStorage<Aeronave[]>('aerocode_aeronaves', mockAeronaves)
    const [codigoSelecionado, setCodigoSelecionado] = useState<string>('')
    const aeronaveAtual = aeronaves.find(a => a.codigo === codigoSelecionado)
    const etapas = aeronaveAtual ? aeronaveAtual.etapas : []
    const [isMounted, setIsMounted] = useState(false)
        useEffect(() => {
            setIsMounted(true)
        }, [])
    if (!isMounted) return null

    return (
        <div className="max-w-6xl mx-auto animate-fade-in">
            {/* O SEU CABEÇALHO PERSONALIZADO */}
            <header className="mb-8 flex justify-between items-end">
                <div>
                    <h1 className="text-3xl font-bold text-white">Etapas de Produção</h1>
                    <p className="text-slate-100 mt-2">Consulte o andamento da montagem por aeronave.</p>
                </div>
                <div className="text-center text-2xl text-white p-2 font-bold bg-gray-500/70 rounded-2xl hover:scale-105 hover:bg-gray-100/30 duration-200 cursor-default">
                    Total: {etapas.length}
                </div>
            </header>

            {/* Filtro de Seleção */}
            <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200 mb-6 flex items-center gap-4">
                <label className="font-bold text-slate-700">Selecione a Aeronave:</label>
                <select value={codigoSelecionado}
                    onChange={(e) => setCodigoSelecionado(e.target.value)}
                    className="text-black px-4 py-2 border border-black/80 rounded-md outline-none focus:border-gray-500 focus:ring-1 focus:ring-black/50">
                    <option value="">-- Escolha uma aeronave para ver as etapas --</option>
                    {aeronaves.map(a => (
                        <option key={a.codigo} value={a.codigo}>
                            {a.codigo} - {a.modelo}
                        </option>
                    ))}
                </select>
            </div>

            {/* Tabela de Etapas */}
            <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-slate-200 text-slate-600 text-sm uppercase tracking-wider border-b border-gray-400">
                                <th className="p-4 font-semibold">Nome da Etapa</th>
                                <th className="p-4 font-semibold">Prazo (Dias)</th>
                                <th className="p-4 font-semibold">Status</th>
                                <th className="p-4 font-semibold">Equipe Alocada</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-300">
                            {!codigoSelecionado ? (
                                <tr>
                                    <td colSpan={4} className="p-8 text-center text-slate-500 font-medium">
                                        Selecione uma aeronave acima para visualizar suas etapas.
                                    </td>
                                </tr>
                            ) : etapas.length === 0 ? (
                                <tr>
                                    <td colSpan={4} className="p-8 text-center text-slate-500">
                                        Nenhuma etapa cadastrada para esta aeronave ainda.
                                    </td>
                                </tr>
                            ) : (
                                etapas.map((etapa, index) => (
                                    <tr key={index} className="hover:bg-slate-100 transition duration-150">
                                        <td className="p-4 font-bold text-slate-800">{etapa.nome}</td>
                                        <td className="p-4 text-slate-600">{etapa.prazo}</td>
                                        <td className="p-4">
                                            <span className={`px-2 py-1 rounded-full text-[10px] font-bold uppercase ${
                                                etapa.status === 'CONCLUIDA' ? 'bg-emerald-100 text-emerald-700' :
                                                etapa.status === 'ANDAMENTO' ? 'bg-blue-100 text-blue-700' :
                                                etapa.status === 'PENDENTE' ? 'bg-red-100 text-red-700' :
                                                'bg-slate-200 text-slate-700'
                                            }`}>
                                                {etapa.status}
                                            </span>
                                        </td>
                                        <td className="p-4 text-slate-600 text-sm">
                                            {etapa.funcionarios && etapa.funcionarios.length > 0 
                                                ? `${etapa.funcionarios.length} funcionário(s)` 
                                                : 'Ninguém alocado'
                                            }
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    )
}