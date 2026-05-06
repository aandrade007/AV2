'use client'

import { useState, useEffect, useRef } from 'react'
import { useRouter } from 'next/navigation'
import { useLocalStorage } from '../../hooks/useLocalStorage'
import { Funcionario } from '../../models/Funcionario'
import { mockFuncionarios } from '../../mocks/dadosIniciais'

export default function ExcluirFuncionario() {
    const router = useRouter()
    const [isMounted, setIsMounted] = useState(false)
    const [funcionarios, setFuncionarios] = useLocalStorage<Funcionario[]>('aerocode_funcionarios', mockFuncionarios)
    const [idSelecionado, setIdSelecionado] = useState('')
    const [mensagem, setMensagem] = useState({ texto: '', tipo: '' })
    const [dropdownAberto, setDropdownAberto] = useState(false)
    const dropdownRef = useRef<HTMLDivElement>(null)

    useEffect(() => { setIsMounted(true) }, [])
    useEffect(() => {
        const handleClickOutside = (e: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
                setDropdownAberto(false)
            }
        }
        document.addEventListener('mousedown', handleClickOutside)
        return () => document.removeEventListener('mousedown', handleClickOutside)
    }, [])

    if (!isMounted) return null

    const sessao = typeof window !== 'undefined' ? localStorage.getItem('aerocode_sessao') : null
    const usuarioLogado = sessao ? JSON.parse(sessao) : null

    const handleDesativar = (e: React.FormEvent) => {
        e.preventDefault()

        if (!idSelecionado) {
            setMensagem({ texto: 'Selecione um funcionário para desativar!', tipo: 'erro' })
            return
        }

        const funcionariosAtualizados = funcionarios.map(f => {
            if (f.id === idSelecionado) return { ...f, ativo: false }
            return f
        })

        setFuncionarios(funcionariosAtualizados)
        setMensagem({ texto: 'Status do funcionário alterado para INATIVO!', tipo: 'sucesso' })
        setIdSelecionado('')
        setTimeout(() => setMensagem({ texto: '', tipo: '' }), 3000)
    }

    const labelClass = "block text-sm font-semibold text-slate-700 mb-2"

    const funcionariosAtivos = funcionarios.filter(f =>
        f.ativo && (!usuarioLogado || f.id !== usuarioLogado.id)
    )

    const funcionarioSelecionado = funcionarios.find(f => f.id === idSelecionado)

    return (
        <div className="w-full max-w-3xl mx-auto px-4 sm:px-6 lg:px-0 mt-16 lg:mt-0 pb-10 animate-fade-in">

            <header className="mb-8 flex flex-col sm:flex-row sm:justify-between sm:items-end gap-4">
                <div>
                    <h1 className="text-2xl sm:text-3xl font-bold text-white">Desativar Funcionário</h1>
                    <p className="text-slate-100 mt-2">Remova o acesso de um colaborador alterando seu status para inativo.</p>
                </div>
                <div className="text-center text-xl text-white p-2 font-bold hover:scale-105 duration-200 hover:bg-gray-100/30 bg-gray-500/70 rounded-2xl self-start sm:self-auto">
                    Ativos: {funcionariosAtivos.length}
                </div>
            </header>

            <form onSubmit={handleDesativar} className="bg-white p-5 sm:p-8 rounded-xl shadow-sm border border-slate-200">

                <div className="mb-6">
                    <label className={labelClass}>Selecione o Colaborador</label>

                    <div ref={dropdownRef} className="relative">
                        <button
                            type="button"
                            onClick={() => setDropdownAberto(!dropdownAberto)}
                            className="text-black w-full px-4 py-2 border border-black rounded-md outline-none focus:border-gray-500 focus:ring-1 focus:ring-black bg-white text-left flex justify-between items-center"
                        >
                            <span className={`truncate ${!idSelecionado ? 'text-gray-400' : ''}`}>
                                {funcionarioSelecionado
                                    ? `${funcionarioSelecionado.nome} | ${funcionarioSelecionado.nivelPermissao}`
                                    : '-- Escolha o funcionário --'}
                            </span>
                            {/* Setinha */}
                            <span className={`ml-2 shrink-0 transition-transform duration-200 ${dropdownAberto ? 'rotate-180' : ''}`}>
                                ▾
                            </span>
                        </button>

                        {/* Lista de opções — dentro do DOM, sem sair da tela */}
                        {dropdownAberto && (
                            <ul className="absolute z-50 w-full mt-1 bg-white border border-black/80 rounded-md shadow-lg max-h-48 overflow-y-auto">
                                <li
                                    onClick={() => { setIdSelecionado(''); setDropdownAberto(false) }}
                                    className="px-4 py-2 text-gray-400 text-sm cursor-pointer hover:bg-slate-100"
                                >
                                    -- Escolha o funcionário --
                                </li>
                                {funcionariosAtivos.map(f => (
                                    <li
                                        key={f.id}
                                        onClick={() => { setIdSelecionado(f.id); setDropdownAberto(false) }}
                                        className={`px-4 py-2 text-sm cursor-pointer hover:bg-slate-100 text-black ${idSelecionado === f.id ? 'bg-slate-100 font-bold' : ''}`}
                                    >
                                        {f.nome} | {f.nivelPermissao}
                                    </li>
                                ))}
                            </ul>
                        )}
                    </div>
                </div>

                {idSelecionado && funcionarioSelecionado && (
                    <div className="p-4 mb-6 bg-amber-50 border border-amber-200 rounded-lg">
                        <p className="text-amber-800 text-sm leading-relaxed">
                            <strong>Atenção:</strong> Esta ação não apagará os dados, mas impedirá que o usuário{' '}
                            <strong>@{funcionarioSelecionado.usuario}</strong>{' '}
                            acesse o sistema Aerocode.
                        </p>
                    </div>
                )}

                {mensagem.texto && (
                    <div className={`p-4 mb-6 rounded-lg font-medium text-sm ${mensagem.tipo === 'erro' ? 'bg-red-50 text-red-600 border border-red-200' : 'bg-emerald-50 text-emerald-600 border border-emerald-200'}`}>
                        {mensagem.texto}
                    </div>
                )}

                <div className="flex flex-col-reverse sm:flex-row sm:justify-end gap-3 border-t border-slate-100 pt-6 mt-2">
                    <button type="button" onClick={() => router.push('/dashboard')}className="w-full sm:w-auto px-6 py-2 hover:scale-105 text-slate-600 hover:bg-slate-100 rounded-lg font-medium transition duration-200">
                        Cancelar
                    </button>
                    <button type="submit"className="w-full sm:w-auto px-6 py-2 hover:scale-105 duration-200 bg-red-600 hover:bg-red-700 text-white rounded-lg font-medium shadow-md transition">
                        Confirmar Desativação
                    </button>
                </div>
            </form>
        </div>
    )
}