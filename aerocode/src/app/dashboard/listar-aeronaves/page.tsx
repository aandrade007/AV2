'use client'

import { useLocalStorage } from '../../hooks/useLocalStorage'
import { Aeronave } from '../../models/Aeronave'
import { mockAeronaves } from '../../mocks/dadosIniciais'

export default function ListarAeronaves() {
    const [aeronaves] = useLocalStorage<Aeronave[]>('aerocode_aeronaves', mockAeronaves)

    return (
        <div className="max-w-6xl mx-auto animate-fade-in">
            <header className="mb-8 flex justify-between items-end">
                <div>
                    <h1 className="text-3xl font-bold text-white">Aeronaves Registradas</h1>
                    <p className="text-slate-100 mt-2">Lista completa em produção e finalizada.</p>
                </div>
                <div className="text-center text-2xl text-white p-2 font-bold bg-gray-500/70 rounded-2xl hover:scale-105 hover:bg-gray-100/30 duration-200">
                        Total: {aeronaves.length}
                    </div>
            </header>

            <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-slate-200 text-slate-600 text-sm uppercase tracking-wider border-b border-gray-400">
                                <th className="p-4 font-semibold">Código</th>
                                <th className="p-4 font-semibold">Modelo</th>
                                <th className="p-4 font-semibold">Tipo</th>
                                <th className="p-4 font-semibold">Capacidade</th>
                                <th className="p-4 font-semibold">Alcance (km)</th>
                                <th className="p-4 font-semibold">Status (Etapas)</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-300">
                            {aeronaves.length === 0 ? (
                                <tr>
                                    <td colSpan={6} className="p-8 text-center text-slate-500">
                                        Nenhuma aeronave encontrada no sistema.
                                    </td>
                                </tr>
                            ) : (
                                aeronaves.map((aviao) => (
                                    <tr key={aviao.codigo} className="hover:bg-slate-100 transition duration-150">
                                        <td className="p-4 font-bold text-slate-800">{aviao.codigo}</td>
                                        <td className="p-4 text-slate-600">{aviao.modelo}</td>
                                        <td className="p-4">
                                            <span className={`px-2 py-1 rounded-full text-xs font-bold ${
                                                aviao.tipo === 'COMERCIAL' 
                                                ? 'bg-emerald-100 text-emerald-700' 
                                                : 'bg-amber-100 text-amber-700'
                                            }`}>
                                                {aviao.tipo}
                                            </span>
                                        </td>
                                        <td className="p-4 text-slate-600">{aviao.capacidade} pessoa(s)</td>
                                        <td className="p-4 text-slate-600">{aviao.alcance} km</td>
                                        <td className="p-4 text-slate-600">
                                            {aviao.etapas.length} etapa(s)
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