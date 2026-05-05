'use client'
import { useState, useEffect } from 'react'
import { useLocalStorage } from '../../hooks/useLocalStorage'
import { Funcionario } from '../../models/Funcionario'
import { mockFuncionarios } from '../../mocks/dadosIniciais'

export default function ListarFuncionarios() {
    const [funcionarios] = useLocalStorage<Funcionario[]>('aerocode_funcionarios', mockFuncionarios)
    const [isMounted, setIsMounted] = useState(false)
        useEffect(() => {
            setIsMounted(true)
        }, [])
    if (!isMounted) return null

    return (
        <div className="max-w-6xl mx-auto animate-fade-in">
            <header className="mb-8 flex justify-between items-end">
                <div>
                    <h1 className="text-3xl font-bold text-white">Funcionários Cadastrados</h1>
                    <p className="text-slate-100 mt-2">Gerencie os acessos e permissões da equipe Aerocode.</p>
                </div>
                <div className="text-center text-2xl text-white p-2 font-bold bg-gray-500/70 rounded-2xl hover:scale-105 hover:bg-gray-100/30 duration-200">
                    Total: {funcionarios.length}
                </div>
            </header>

            <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-slate-200 text-slate-600 text-sm uppercase tracking-wider border-b border-gray-400">
                                <th className="p-4 font-semibold">Nome</th>
                                <th className="p-4 font-semibold">Usuário</th>
                                <th className="p-4 font-semibold">Cargo / Permissão</th>
                                <th className="p-4 font-semibold">Telefone</th>
                                <th className="p-4 font-semibold">Status</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-300">
                            {funcionarios.map((f) => (
                                <tr key={f.id} className="hover:bg-slate-100 transition duration-150">
                                    <td className="p-4">
                                        <div className="flex items-center gap-3">
                                            <div className="w-8 h-8 rounded-full bg-slate-200 flex items-center justify-center font-bold text-slate-600 text-xs">
                                                {f.nome.charAt(0)}
                                            </div>
                                            <span className="font-bold text-slate-800">{f.nome}</span>
                                        </div>
                                    </td>
                                    <td className="p-4 text-slate-600">{f.usuario}</td>
                                    <td className="p-4">
                                        <span className={`px-2 py-1 rounded-full text-[10px] font-bold ${
                                            f.nivelPermissao === 'ADMINISTRADOR' 
                                            ? 'bg-red-100 text-red-700' 
                                            : f.nivelPermissao === 'ENGENHEIRO'
                                            ? 'bg-blue-100 text-blue-700'
                                            : 'bg-slate-100 text-slate-700'
                                        }`}>
                                            {f.nivelPermissao}
                                        </span>
                                    </td>
                                    <td className="p-4 text-slate-600 text-sm">{f.telefone}</td>
                                    <td className="p-4">
                                        <span className="flex items-center gap-1.5 text-emerald-600 font-medium text-sm">
                                            <span className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></span>
                                            Ativo
                                        </span>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    )
}