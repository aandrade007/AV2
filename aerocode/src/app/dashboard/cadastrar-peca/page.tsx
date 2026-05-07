'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useLocalStorage } from '../../hooks/useLocalStorage'
import { Aeronave } from '../../models/Aeronave'
import { mockAeronaves } from '../../mocks/dadosIniciais'
// Importe o seu TipoPeca (ajuste o caminho se necessário)
import { TipoPeca } from '../../enums/enums' 

export default function CadastrarPeca() {
    const router = useRouter()
    const [isMounted, setIsMounted] = useState(false)
    const [aeronaves, setAeronaves] = useLocalStorage<Aeronave[]>('aerocode_aeronaves', mockAeronaves)
    
    // Estados atualizados para a nova interface
    const [codigoAeronave, setCodigoAeronave] = useState('')
    const [nomePeca, setNomePeca] = useState('')
    const [tipo, setTipo] = useState<string>('')
    const [fornecedor, setFornecedor] = useState('')
    
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

    const handleSalvar = (e: React.FormEvent) => {
        e.preventDefault()

        if (!codigoAeronave || !nomePeca.trim() || !tipo || !fornecedor.trim()) {
            setMensagem({ texto: 'Por favor, preencha todos os campos!', tipo: 'erro' })
            return
        }

        const novaPeca: any = {
            nome: nomePeca.trim(),
            tipo: tipo as TipoPeca, 
            fornecedor: fornecedor.trim(),
            status: 'EM_PRODUCAO',
            aeronaveCodigo: codigoAeronave
        }

        const aeronavesAtualizadas = aeronaves.map(aeronave => {
            if (aeronave.codigo === codigoAeronave) {
                return {
                    ...aeronave,
                    pecas: [...aeronave.pecas, novaPeca]
                }
            }
            return aeronave
        })

        setAeronaves(aeronavesAtualizadas)
        setMensagem({ texto: 'Peça cadastrada e vinculada à aeronave com sucesso!', tipo: 'sucesso' })
        setNomePeca('')
        setTipo('')
        setFornecedor('')
        
        setTimeout(() => setMensagem({ texto: '', tipo: '' }), 3000)
    }

    const inputClass = "text-black w-full px-4 py-2 border border-black rounded-md outline-none focus:border-gray-500 focus:ring-1 focus:ring-black bg-white"
    const labelClass = "block text-sm font-semibold text-slate-700 mb-2"
    const isBotaoDesabilitado = aeronaves.length === 0 || !codigoAeronave || !nomePeca || !tipo || !fornecedor

    return (
        <div className="w-full max-w-3xl mx-auto px-4 sm:px-6 lg:px-0 mt-16 lg:mt-0 pb-10 animate-fade-in">
            <header className="mb-8">
                <h1 className="text-2xl sm:text-3xl font-bold text-white">Nova Peça</h1>
                <p className="text-slate-100 mt-2">Registre um novo componente e vincule-o a uma aeronave na linha de montagem.</p>
            </header>

            <form onSubmit={handleSalvar} className="bg-white p-5 sm:p-8 rounded-xl shadow-sm border border-slate-200">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-6">

                    <div className="sm:col-span-2 border-b border-slate-200 pb-6">
                        <label className={labelClass}>Aeronave Destino</label>
                        <select
                            value={codigoAeronave}
                            onChange={(e) => setCodigoAeronave(e.target.value)}
                            className={inputClass}
                        >
                            <option value="">-- Selecione o avião que receberá esta peça --</option>
                            {aeronaves.map(a => (
                                <option key={a.codigo} value={a.codigo}>
                                    {a.codigo} - {a.modelo} ({a.tipo})
                                </option>
                            ))}
                        </select>
                        {aeronaves.length === 0 && (
                            <p className="text-xs text-red-500 mt-2 font-bold">Nenhuma aeronave cadastrada no sistema ainda.</p>
                        )}
                    </div>

                    {/* Nome da Peça */}
                    <div className="sm:col-span-2">
                        <label className={labelClass}>Nome do Componente</label>
                        <input
                            type="text"
                            value={nomePeca}
                            onChange={(e) => setNomePeca(e.target.value)}
                            className={inputClass}
                            placeholder="Ex: Turbina Esquerda"
                        />
                    </div>

                    {/* Tipo da Peça */}
                    <div>
                        <label className={labelClass}>Tipo da Peça</label>
                        <select
                            value={tipo}
                            onChange={(e) => setTipo(e.target.value)}
                            className={inputClass}
                        >
                            <option value="">-- Selecione o Tipo --</option>
                            <option value="NACIONAL"> Nacional</option>
                            <option value="IMPORTADA">Importada</option>
                        </select>
                    </div>
                    <div>
                        <label className={labelClass}>Fornecedor</label>
                        <input
                            type="text"
                            value={fornecedor}
                            onChange={(e) => setFornecedor(e.target.value)}
                            className={inputClass}
                            placeholder="Ex: Embraer, Boeing..."
                        />
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
                        disabled={isBotaoDesabilitado}
                        className="w-full sm:w-auto px-6 py-2 hover:scale-105 duration-200 bg-lime-600 hover:bg-lime-700 text-white rounded-lg font-medium shadow-md transition disabled:opacity-50 disabled:hover:scale-100 disabled:cursor-not-allowed"
                    >
                        Cadastrar Peça
                    </button>
                </div>
            </form>
        </div>
    )
}