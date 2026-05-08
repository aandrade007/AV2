'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useLocalStorage } from '../../hooks/useLocalStorage'
import { Aeronave } from '../../models/Aeronave'
import { mockAeronaves } from '../../mocks/dadosIniciais'
// Seu novo Enum
import { StatusEtapa } from '../../enums/enums'

export default function GerenciarEtapas() {
    const router = useRouter()
    const [isMounted, setIsMounted] = useState(false)
    const [aeronaves, setAeronaves] = useLocalStorage<Aeronave[]>('aerocode_aeronaves', mockAeronaves)
    
    const [codigoAeronave, setCodigoAeronave] = useState('')
    const [nomeEtapa, setNomeEtapa] = useState('')
    const [prazo, setPrazo] = useState('')
    
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
    const etapasDaAeronave = aeronaveSelecionada ? aeronaveSelecionada.etapas || [] : []

    const handleSalvarEtapa = (e: React.FormEvent) => {
        e.preventDefault()

        if (!codigoAeronave || !nomeEtapa.trim() || !prazo.trim()) {
            setMensagem({ texto: 'Preencha todos os campos da etapa!', tipo: 'erro' })
            return
        }

        const novaEtapa: any = {
            nome: nomeEtapa.trim(),
            prazo: prazo.trim(),
            status: StatusEtapa.PENDENTE,
            funcionarios: [],
            aeronaveCodigo: codigoAeronave
        }

        const aeronavesAtualizadas = aeronaves.map(aeronave => {
            if (aeronave.codigo === codigoAeronave) {
                const etapasAtuais = aeronave.etapas || []
                return { ...aeronave, etapas: [...etapasAtuais, novaEtapa] }
            }
            return aeronave
        })

        setAeronaves(aeronavesAtualizadas)
        setMensagem({ texto: 'Nova etapa registrada!', tipo: 'sucesso' })
        setNomeEtapa('')
        setPrazo('')
        setTimeout(() => setMensagem({ texto: '', tipo: '' }), 3000)
    }

    const avancarStatus = (etapaAlvo: any, index: number) => {
        // Validação de Precedência: Se não for a primeira etapa (index > 0)
        if (index > 0 && etapaAlvo.status === StatusEtapa.PENDENTE) {
            const etapaAnterior = etapasDaAeronave[index - 1]
            if (etapaAnterior.status !== StatusEtapa.CONCLUIDA) {
                setMensagem({ texto: `⚠️ A etapa "${etapaAnterior.nome}" precisa ser CONCLUÍDA primeiro!`, tipo: 'erro' })
                setTimeout(() => setMensagem({ texto: '', tipo: '' }), 4000)
                return
            }
        }

        let novoStatus = etapaAlvo.status
        if (etapaAlvo.status === StatusEtapa.PENDENTE) novoStatus = StatusEtapa.ANDAMENTO
        else if (etapaAlvo.status === StatusEtapa.ANDAMENTO) novoStatus = StatusEtapa.CONCLUIDA

        const aeronavesAtualizadas = aeronaves.map(a => {
            if (a.codigo === codigoAeronave) {
                return {
                    ...a,
                    etapas: a.etapas.map(e => e.nome === etapaAlvo.nome ? { ...e, status: novoStatus } : e)
                }
            }
            return a
        })

        setAeronaves(aeronavesAtualizadas)
    }

    const inputClass = "text-black w-full px-4 py-2 border border-black rounded-md outline-none focus:border-gray-500 focus:ring-1 focus:ring-black bg-white"
    const labelClass = "block text-sm font-semibold text-slate-700 mb-2"
    const isBotaoDesabilitado = !codigoAeronave || !nomeEtapa.trim() || !prazo.trim()

    return (
        <div className="w-full max-w-4xl mx-auto px-4 sm:px-6 lg:px-0 mt-16 lg:mt-0 pb-10 animate-fade-in">
            <header className="mb-8">
                <h1 className="text-2xl sm:text-3xl font-bold text-white">Gerenciar Etapas</h1>
                <p className="text-slate-100 mt-2">Crie o fluxo de montagem e avance as etapas de cada aeronave.</p>
            </header>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">

                <div>
                    <form onSubmit={handleSalvarEtapa} className="bg-white p-5 sm:p-6 rounded-xl shadow-sm border border-slate-200">
                        <h2 className="text-lg font-bold text-slate-800 mb-5 border-b border-slate-200 pb-2">Adicionar Etapa</h2>
                        <div className="flex flex-col gap-5">
                            <div>
                                <label className={labelClass}>Aeronave Alvo</label>
                                <select value={codigoAeronave} onChange={(e) => setCodigoAeronave(e.target.value)} className={inputClass}>
                                    <option value="">-- Selecione a aeronave --</option>
                                    {aeronaves.map(a => <option key={a.codigo} value={a.codigo}>{a.codigo} - {a.modelo}</option>)}
                                </select>
                            </div>
                            <div>
                                <label className={labelClass}>Nome da Etapa</label>
                                <input type="text" value={nomeEtapa} onChange={(e) => setNomeEtapa(e.target.value)} className={inputClass} disabled={!codigoAeronave} />
                            </div>
                            <div>
                                <label className={labelClass}>Prazo Final (Deadline)</label>
                                <input type="date" value={prazo} onChange={(e) => setPrazo(e.target.value)} className={inputClass} disabled={!codigoAeronave} />
                            </div>
                        </div>

                        {mensagem.texto && (
                            <div className={`mt-5 p-3 rounded-lg text-sm font-medium ${mensagem.tipo === 'erro' ? 'bg-red-50 text-red-600 border border-red-200' : 'bg-emerald-50 text-emerald-600 border border-emerald-200'}`}>
                                {mensagem.texto}
                            </div>
                        )}

                        <button type="submit" disabled={isBotaoDesabilitado} className="w-full mt-6 px-6 py-3 hover:scale-[1.02] duration-200 bg-lime-600 hover:bg-lime-700 text-white rounded-lg font-medium shadow-md transition disabled:opacity-50 disabled:hover:scale-100 disabled:cursor-not-allowed">
                            Adicionar Etapa à Linha
                        </button>
                    </form>
                </div>
                
                <div className="bg-white p-5 sm:p-6 rounded-xl shadow-sm border border-slate-200 flex flex-col h-full">
                    <h2 className="text-lg font-bold text-slate-800 mb-5 border-b border-slate-200 pb-2">Cronograma da Aeronave</h2>
                    
                    {!codigoAeronave ? (
                        <div className="flex-1 flex flex-col items-center justify-center text-slate-400 opacity-60 min-h-[200px]">
                            <p className="text-sm font-medium">Selecione uma aeronave</p>
                        </div>
                    ) : etapasDaAeronave.length === 0 ? (
                        <div className="flex-1 flex flex-col items-center justify-center text-amber-500/80 min-h-[200px]">
                            <p className="text-sm font-medium text-amber-700">Nenhuma etapa definida.</p>
                        </div>
                    ) : (
                        <div className="flex flex-col gap-3 overflow-y-auto max-h-[400px] pr-2 [&::-webkit-scrollbar]:w-2 [&::-webkit-scrollbar-thumb]:bg-slate-300 [&::-webkit-scrollbar-thumb]:rounded-full">
                            {etapasDaAeronave.map((etapa: any, index: number) => (
                                <div key={etapa.nome || index} className={`p-4 border rounded-lg transition border-l-4 flex flex-col gap-3 
                                    ${etapa.status === StatusEtapa.PENDENTE ? 'border-slate-200 border-l-slate-400 bg-white' : ''}
                                    ${etapa.status === StatusEtapa.ANDAMENTO ? 'border-blue-200 border-l-blue-500 bg-blue-50' : ''}
                                    ${etapa.status === StatusEtapa.CONCLUIDA ? 'border-emerald-200 border-l-emerald-500 bg-emerald-50 opacity-70' : ''}
                                `}>
                                    <div className="flex justify-between items-start">
                                        <div>
                                            <h3 className="font-bold text-slate-800 text-sm">{index + 1}. {etapa.nome}</h3>
                                            <p className="text-xs text-slate-500 font-medium">Prazo: {etapa.prazo}</p>
                                        </div>
                                        <span className={`text-[10px] font-bold px-2 py-1 rounded-md ${
                                            etapa.status === StatusEtapa.PENDENTE ? 'bg-slate-200 text-slate-600' :
                                            etapa.status === StatusEtapa.ANDAMENTO ? 'bg-blue-600 text-white' :
                                            'bg-emerald-600 text-white'
                                        }`}>
                                            {etapa.status}
                                        </span>
                                    </div>
                                    
                                    {etapa.status !== StatusEtapa.CONCLUIDA && (
                                        <button 
                                            onClick={() => avancarStatus(etapa, index)}
                                            className="text-xs font-bold py-1.5 px-3 rounded-md bg-white border shadow-sm hover:scale-[1.02] text-gray-600 transition-transform self-start w-full text-center"
                                        >
                                            {etapa.status === StatusEtapa.PENDENTE ? 'Iniciar Etapa' : 'Marcar como Concluída'}
                                        </button>
                                    )}
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}