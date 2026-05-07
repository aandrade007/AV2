'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useLocalStorage } from '../../hooks/useLocalStorage'
import { Funcionario } from '../../models/Funcionario'
import { mockFuncionarios } from '../../mocks/dadosIniciais'

export default function DesativarFuncionario() {
    const router = useRouter()
    const [isMounted, setIsMounted] = useState(false)
    const [funcionarios, setFuncionarios] = useLocalStorage<Funcionario[]>('aerocode_funcionarios', mockFuncionarios)
    const [idSelecionado, setIdSelecionado] = useState('')
    const [mensagem, setMensagem] = useState({ texto: '', tipo: '' })
    const [usuarioLogado, setUsuarioLogado] = useState<Funcionario | null>(null)

    useEffect(() => {
        setIsMounted(true)
        const sessao = localStorage.getItem('aerocode_sessao')
        if (sessao) {
            const user = JSON.parse(sessao)
            if (user.nivelPermissao !== 'ADMINISTRADOR') {
                router.push('/dashboard')
            } else {
                setUsuarioLogado(user)
            }
        } else {
            router.push('/')
        }
    }, [router])

    if (!isMounted) return null

    const handleDesativar = (e: React.FormEvent) => {
        e.preventDefault()

        if (!idSelecionado) {
            setMensagem({ texto: 'Selecione um funcionário para desativar!', tipo: 'erro' })
            return
        }

        const funcionariosAtualizados = funcionarios.map(f => {
            if (f.id === idSelecionado) {
                return { ...f, ativo: false }
            }
            return f
        })

        setFuncionarios(funcionariosAtualizados)
        setMensagem({ texto: 'Status do funcionário alterado para INATIVO!', tipo: 'sucesso' })
        setIdSelecionado('')
        
        setTimeout(() => setMensagem({ texto: '', tipo: '' }), 3000)
    }

    const inputClass = "text-black w-full px-4 py-2 border border-black rounded-md outline-none focus:border-gray-500 focus:ring-1 focus:ring-black bg-white"
    const labelClass = "block text-sm font-semibold text-slate-700 mb-2"
    
    // A MÁGICA ACONTECE AQUI:
    // Filtramos para manter apenas os ativos, que não sejam o usuário logado e que não sejam ADMINISTRADOR
    const funcionariosAtivos = funcionarios.filter(f => 
        f.ativo && 
        (!usuarioLogado || f.id !== usuarioLogado.id) &&
        f.nivelPermissao !== 'ADMINISTRADOR'
    )

    return (
        <div className="w-full max-w-3xl mx-auto px-4 sm:px-6 lg:px-0 mt-16 lg:mt-0 pb-10 animate-fade-in">
            <header className="mb-8 flex justify-between items-end">
                <div>
                    <h1 className="text-2xl sm:text-3xl font-bold text-white">Desativar Funcionário</h1>
                    <p className="text-slate-100 mt-2">Remova o acesso de um colaborador alterando seu status para inativo.</p>
                </div>
                <div className="text-center text-xl text-white p-2 font-bold bg-gray-500/70 rounded-2xl hidden sm:block">
                    Ativos: {funcionariosAtivos.length}
                </div>
            </header>

            <form onSubmit={handleDesativar} className="bg-white p-5 sm:p-8 rounded-xl shadow-sm border border-slate-200">
                <div className="mb-6">
                    <label className={labelClass}>Selecione o Colaborador (Nome - Cargo - ID)</label>
                    <select
                        value={idSelecionado}
                        onChange={(e) => setIdSelecionado(e.target.value)}
                        className={inputClass}
                    >
                        <option value="">-- Escolha o funcionário para desligamento --</option>
                        {funcionariosAtivos.map(f => (
                            <option key={f.id} value={f.id}>
                                {f.nome} | {f.nivelPermissao} | Ref: {f.id.substring(0, 8)}
                            </option>
                        ))}
                    </select>
                </div>

                {idSelecionado && (
                    <div className="p-4 mb-6 bg-amber-50 border border-amber-200 rounded-lg">
                        <p className="text-amber-800 text-sm">
                            <strong>Atenção:</strong> Esta ação impedirá que o usuário 
                            <strong> {funcionarios.find(f => f.id === idSelecionado)?.usuario} </strong> 
                            acesse o sistema.
                        </p>
                    </div>
                )}

                {mensagem.texto && (
                    <div className={`p-4 mb-6 rounded-lg font-medium ${mensagem.tipo === 'erro' ? 'bg-red-50 text-red-600 border border-red-200' : 'bg-emerald-50 text-emerald-600 border border-emerald-200'}`}>
                        {mensagem.texto}
                    </div>
                )}

                <div className="flex flex-col-reverse sm:flex-row sm:justify-end gap-3 border-t border-slate-100 pt-6 mt-2">
                    <button type="button" onClick={() => router.push('/dashboard')} className="w-full sm:w-auto px-6 py-2 hover:scale-105 text-slate-600 hover:bg-slate-100 rounded-lg font-medium transition duration-200">
                        Cancelar
                    </button>
                    <button type="submit" className="w-full sm:w-auto px-6 py-2 hover:scale-105 duration-200 bg-red-600 hover:bg-red-700 text-white rounded-lg font-medium shadow-md transition">
                        Confirmar Desativação
                    </button>
                </div>
            </form>
        </div>
    )
}