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

    useEffect(() => { setIsMounted(true) }, [])
    if (!isMounted) return null

    const badgeStatus = (status: string) => {
        switch (status) {
            case 'CONCLUIDA': return 'bg-emerald-100 text-emerald-700'
            case 'ANDAMENTO': return 'bg-blue-100 text-blue-700'
            case 'PENDENTE':  return 'bg-red-100 text-red-700'
            default:          return 'bg-slate-200 text-slate-700'
        }
    }

    return (
        <div className="max-w-6xl mx-auto animate-fade-in px-4 sm:px-6 lg:px-0 mt-16 lg:mt-0 pb-10">

            <header className="mb-8 flex flex-col sm:flex-row sm:justify-between sm:items-end gap-4">
                <div>
                    <h1 className="text-2xl sm:text-3xl font-bold text-white">Etapas de Produção</h1>
                    <p className="text-slate-100 mt-2">Consulte o andamento da montagem por aeronave.</p>
                </div>
                <div className="text-center text-2xl text-white p-2 font-bold bg-gray-500/70 rounded-2xl hover:scale-105 hover:bg-gray-100/30 duration-200 cursor-default self-start sm:self-auto">
                    Total: {etapas.length}
                </div>
            </header>

            <div className="bg-white p-4 sm:p-6 rounded-xl shadow-sm border border-slate-200 mb-6 flex flex-col sm:flex-row sm:items-center gap-3">
                <label className="font-bold text-slate-700 whitespace-nowrap">Selecione a Aeronave:</label>
                <select
                    value={codigoSelecionado}
                    onChange={(e) => setCodigoSelecionado(e.target.value)}
                    className="text-black w-full sm:w-auto px-4 py-2 border border-black/80 rounded-md outline-none focus:border-gray-500 focus:ring-1 focus:ring-black/50"
                >
                    <option value="">-- Escolha uma aeronave --</option>
                    {aeronaves.map(a => (
                        <option key={a.codigo} value={a.codigo}>
                            {a.codigo} - {a.modelo}
                        </option>
                    ))}
                </select>
            </div>

            <div className="flex flex-col gap-3 md:hidden">
                {!codigoSelecionado ? (
                    <div className="p-8 text-center text-slate-100 bg-white/10 rounded-xl font-medium">
                        Selecione uma aeronave acima para visualizar suas etapas.
                    </div>
                ) : etapas.length === 0 ? (
                    <div className="p-8 text-center text-slate-100 bg-white/10 rounded-xl">
                        Nenhuma etapa cadastrada para esta aeronave ainda.
                    </div>
                ) : (
                    etapas.map((etapa, index) => (
                        <div key={index} className="bg-white rounded-xl shadow-sm border border-slate-200 p-4 flex flex-col gap-3">

                            <div className="flex justify-between items-center gap-2">
                                <span className="font-bold text-slate-800">{etapa.nome}</span>
                                <span className={`px-2 py-1 rounded-full text-[10px] font-bold uppercase whitespace-nowrap ${badgeStatus(etapa.status)}`}>
                                    {etapa.status}
                                </span>
                            </div>

                            <div className="flex gap-4 text-xs text-slate-500 border-t border-slate-100 pt-3">
                                <span>{etapa.prazo} dias</span>
                                <span>{etapa.funcionarios && etapa.funcionarios.length > 0
                                    ? `${etapa.funcionarios.length} funcionário(s)`
                                    : 'Ninguém alocado'}
                                </span>
                            </div>
                        </div>
                    ))
                )}
            </div>

            <div className="hidden md:block bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
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
                                            <span className={`px-2 py-1 rounded-full text-[10px] font-bold uppercase ${badgeStatus(etapa.status)}`}>
                                                {etapa.status}
                                            </span>
                                        </td>
                                        <td className="p-4 text-slate-600 text-sm">
                                            {etapa.funcionarios && etapa.funcionarios.length > 0
                                                ? `${etapa.funcionarios.length} funcionário(s)`
                                                : 'Ninguém alocado'}
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