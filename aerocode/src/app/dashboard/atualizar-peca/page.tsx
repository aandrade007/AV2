'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useLocalStorage } from '../../hooks/useLocalStorage'
import { Aeronave } from '../../models/Aeronave'
import { mockAeronaves } from '../../mocks/dadosIniciais'

export default function AtualizarPeca() {
    const router = useRouter()
    const [isMounted, setIsMounted] = useState(false)
    const [aeronaves, setAeronaves] = useLocalStorage<Aeronave[]>('aerocode_aeronaves', mockAeronaves)
    
    const [codigoAeronave, setCodigoAeronave] = useState('')
    const [nomePeca, setNomePeca] = useState('')
    const [novoStatus, setNovoStatus] = useState('')
    const [mensagem, setMensagem] = useState({ texto: '', tipo: '' })

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
    const pecasDaAeronave = aeronaveSelecionada ? aeronaveSelecionada.pecas : []
    const pecaSelecionada = pecasDaAeronave.find(p => p.nome === nomePeca)

    const handleAtualizar = (e: React.FormEvent) => {
        e.preventDefault()

        if (!codigoAeronave || !nomePeca || !novoStatus) {
            setMensagem({ texto: 'Por favor, selecione todas as opções!', tipo: 'erro' })
            return
        }

        const aeronavesAtualizadas = aeronaves.map(aeronave => {
            if (aeronave.codigo === codigoAeronave) {
                return {
                    ...aeronave,
                    pecas: aeronave.pecas.map(peca => {
                        if (peca.nome === nomePeca) {
                            return { ...peca, status: novoStatus } as any
                        }
                        return peca
                    })
                }
            }
            return aeronave
        })

        setAeronaves(aeronavesAtualizadas)
        setMensagem({ texto: 'Status da peça atualizado com sucesso!', tipo: 'sucesso' })
        
        setNomePeca('')
        setNovoStatus('')
        
        setTimeout(() => setMensagem({ texto: '', tipo: '' }), 3000)
    }

    const inputClass = "text-black w-full px-4 py-2 border border-black rounded-md outline-none focus:border-gray-500 focus:ring-1 focus:ring-black bg-white"
    const labelClass = "block text-sm font-semibold text-slate-700 mb-2"

    return (
        <div className="w-full max-w-3xl mx-auto px-4 sm:px-6 lg:px-0 mt-16 lg:mt-0 pb-10 animate-fade-in">
            <header className="mb-8">
                <h1 className="text-2xl sm:text-3xl font-bold text-white">Atualizar Peça</h1>
                <p className="text-slate-100 mt-2">Altere o status de uma peça em específico.</p>
            </header>

            <form onSubmit={handleAtualizar} className="bg-white p-5 sm:p-8 rounded-xl shadow-sm border border-slate-200">
                <div className="grid grid-cols-1 gap-6 mb-6">
                    
                    <div>
                        <label className={labelClass}>1. Selecione a Aeronave</label>
                        <select
                            value={codigoAeronave}
                            onChange={(e) => {
                                setCodigoAeronave(e.target.value)
                                setNomePeca('') 
                                setNovoStatus('') 
                            }}
                            className={inputClass}
                        >
                            <option value="">-- Escolha o avião --</option>
                            {aeronaves.map(a => (
                                <option key={a.codigo} value={a.codigo}>
                                    {a.codigo} - {a.modelo}
                                </option>
                            ))}
                        </select>
                    </div>

                    <div>
                        <label className={labelClass}>2. Selecione a Peça</label>
                        <select
                            value={nomePeca}
                            onChange={(e) => {
                                setNomePeca(e.target.value)
                                setNovoStatus('') 
                            }}
                            className={inputClass}
                            disabled={!codigoAeronave}
                        >
                            <option value="">
                                {!codigoAeronave 
                                    ? "Selecione uma aeronave primeiro" 
                                    : pecasDaAeronave.length === 0 
                                        ? "Nenhuma peça cadastrada neste avião" 
                                        : "-- Escolha a peça --"}
                            </option>
                            {pecasDaAeronave.map((p, index) => (
                                <option key={`${p.nome}-${index}`} value={p.nome}>
                                    {p.nome} - Status Atual: {p.status}
                                </option>
                            ))}
                        </select>
                    </div>

                    <div>
                        <label className={labelClass}>3. Novo Status</label>
                        <select
                            value={novoStatus}
                            onChange={(e) => setNovoStatus(e.target.value)}
                            className={inputClass}
                            disabled={!nomePeca || pecaSelecionada?.status === 'PRONTA'}
                        >
                            {!nomePeca ? (
                                <option value="">-- Selecione uma peça primeiro --</option>
                            ) : pecaSelecionada?.status === 'PRONTA' ? (
                                <option value="">Peça finalizada (Não é possível alterar)</option>
                            ) : (
                                <>
                                    <option value="">-- Defina o novo status --</option>
                                    
                                    {pecaSelecionada?.status === 'EM_PRODUCAO' && (
                                        <option value="EM_TRANSPORTE">Em Transporte</option>
                                    )}
                                    
                                    {pecaSelecionada?.status === 'EM_TRANSPORTE' && (
                                        <option value="PRONTA">Pronta </option>
                                    )}

                                    {pecaSelecionada?.status !== 'EM_PRODUCAO' && pecaSelecionada?.status !== 'EM_TRANSPORTE' && (
                                        <option value="PRONTA">Pronta </option>
                                    )}
                                </>
                            )}
                        </select>
                    </div>
                </div>

                {mensagem.texto && (
                    <div className={`p-4 mb-6 rounded-lg font-medium ${mensagem.tipo === 'erro' ? 'bg-red-50 text-red-600 border border-red-200' : 'bg-emerald-50 text-emerald-600 border border-emerald-200'}`}>
                        {mensagem.texto}
                    </div>
                )}

                <div className="flex flex-col-reverse sm:flex-row sm:justify-end gap-3 border-t border-slate-100 pt-6 mt-2">
                    <button 
                        type="button" 
                        onClick={() => router.push('/dashboard')} 
                        className="w-full sm:w-auto px-6 py-2 hover:scale-105 text-slate-600 hover:bg-slate-100 rounded-lg font-medium transition duration-200"
                    >
                        Cancelar
                    </button>
                    <button
                        type="submit" 
                        disabled={!codigoAeronave || !nomePeca || !novoStatus}
                            className="w-full sm:w-auto px-6 py-2 hover:scale-105 duration-200 bg-lime-600 hover:bg-lime-700 text-white rounded-lg font-medium shadow-md transition disabled:opacity-50 disabled:hover:scale-100 disabled:cursor-not-allowed"
                    >
                        Atualizar Status
                    </button>
                </div>
            </form>
        </div>
    )
}