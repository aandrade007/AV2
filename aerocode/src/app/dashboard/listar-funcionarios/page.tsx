'use client'
import { useState, useEffect } from 'react'
import { useLocalStorage } from '../../hooks/useLocalStorage'
import { Funcionario } from '../../models/Funcionario'
import { mockFuncionarios } from '../../mocks/dadosIniciais'

export default function ListarFuncionarios() {
    const [funcionarios] = useLocalStorage<Funcionario[]>('aerocode_funcionarios', mockFuncionarios)
    const [isMounted, setIsMounted] = useState(false)
    useEffect(() => { setIsMounted(true) }, [])
    if (!isMounted) return null

    const badgePermissao = (nivel: string) => {
        switch (nivel) {
            case 'ADMINISTRADOR': return 'bg-red-100 text-red-700'
            case 'ENGENHEIRO':    return 'bg-blue-100 text-blue-700'
            default:              return 'bg-slate-100 text-slate-700'
        }
    }

    return (
        <div className="w-full max-w-6xl mx-auto px-4 sm:px-6 lg:px-0 mt-16 lg:mt-0 pb-10 overflow-hidden">

            <header className="mb-8 flex flex-col sm:flex-row sm:justify-between sm:items-end gap-4">
                <div>
                    <h1 className="text-2xl sm:text-3xl font-bold text-white">Funcionários Cadastrados</h1>
                    <p className="text-slate-100 mt-2">Gerencie os acessos e permissões da equipe Aerocode.</p>
                </div>
                <div className="text-center text-2xl text-white p-2 font-bold bg-gray-500/70 rounded-2xl hover:scale-105 hover:bg-gray-100/30 duration-200 self-start sm:self-auto">
                    Total: {funcionarios.length}
                </div>
            </header>

            <div className="flex flex-col gap-3 md:hidden">
                {funcionarios.length === 0 ? (
                    <div className="p-8 text-center text-slate-100 bg-white/10 rounded-xl">
                        Nenhum funcionário cadastrado.
                    </div>
                ) : (
                    funcionarios.map((f) => (
                        <div key={f.id} className={`bg-white rounded-xl shadow-sm border border-slate-200 p-4 ${!f.ativo ? 'opacity-60' : ''}`}>

                            <div className="flex items-center gap-3 mb-3">
                                <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold shrink-0 ${f.ativo ? 'bg-slate-200 text-slate-600' : 'bg-gray-300 text-gray-500'}`}>
                                    {f.nome.charAt(0)}
                                </div>
                                <div className="flex-1 min-w-0">
                                    <p className={`font-bold truncate ${f.ativo ? 'text-slate-800' : 'text-gray-500'}`}>{f.nome}</p>
                                    <p className="text-xs text-slate-400">@{f.usuario}</p>
                                </div>
                                {f.ativo ? (
                                    <span className="flex items-center gap-1 text-emerald-600 font-medium text-xs shrink-0">
                                        <span className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></span>
                                        Ativo
                                    </span>
                                ) : (
                                    <span className="flex items-center gap-1 text-red-500 font-medium text-xs shrink-0">
                                        <span className="w-2 h-2 bg-red-500 rounded-full"></span>
                                        Inativo
                                    </span>
                                )}
                            </div>

                            <div className="flex items-center justify-between border-t border-slate-100 pt-3">
                                <span className={`px-2 py-1 rounded-full text-[10px] font-bold ${badgePermissao(f.nivelPermissao)}`}>
                                    {f.nivelPermissao}
                                </span>
                                <span className="text-xs text-slate-500">{f.telefone}</span>
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
                                <th className="p-4 font-semibold">Nome</th>
                                <th className="p-4 font-semibold">Usuário</th>
                                <th className="p-4 font-semibold">Cargo / Permissão</th>
                                <th className="p-4 font-semibold">Telefone</th>
                                <th className="p-4 font-semibold">Status</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-300">
                            {funcionarios.length === 0 ? (
                                <tr>
                                    <td colSpan={5} className="p-8 text-center text-slate-500">
                                        Nenhum funcionário cadastrado.
                                    </td>
                                </tr>
                            ) : (
                                funcionarios.map((f) => (
                                    <tr key={f.id} className={`transition duration-150 ${f.ativo ? 'hover:bg-slate-50' : 'bg-gray-100 opacity-60'}`}>
                                        <td className="p-4">
                                            <div className="flex items-center gap-3">
                                                <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs ${f.ativo ? 'bg-slate-200 text-slate-600' : 'bg-gray-300 text-gray-500'}`}>
                                                    {f.nome.charAt(0)}
                                                </div>
                                                <span className={`font-bold ${f.ativo ? 'text-slate-800' : 'text-gray-500'}`}>{f.nome}</span>
                                            </div>
                                        </td>
                                        <td className="p-4 text-slate-600">{f.usuario}</td>
                                        <td className="p-4">
                                            <span className={`px-2 py-1 rounded-full text-[10px] font-bold ${badgePermissao(f.nivelPermissao)}`}>
                                                {f.nivelPermissao}
                                            </span>
                                        </td>
                                        <td className="p-4 text-slate-600 text-sm">{f.telefone}</td>
                                        <td className="p-4">
                                            {f.ativo ? (
                                                <span className="flex items-center gap-1.5 text-emerald-600 font-medium text-sm">
                                                    <span className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></span>
                                                    Ativo
                                                </span>
                                            ) : (
                                                <span className="flex items-center gap-1.5 text-red-500 font-medium text-sm">
                                                    <span className="w-2 h-2 bg-red-500 rounded-full"></span>
                                                    Inativo
                                                </span>
                                            )}
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