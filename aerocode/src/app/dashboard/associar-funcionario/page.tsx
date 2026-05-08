'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useLocalStorage } from '../../hooks/useLocalStorage'
import { Aeronave } from '../../models/Aeronave'
import { Funcionario } from '../../models/Funcionario'
import { mockAeronaves, mockFuncionarios } from '../../mocks/dadosIniciais'
// Seu novo Enum
import { StatusEtapa } from '../../enums/enums'

export default function AssociarFuncionarioEtapa() {
    const router = useRouter()
    const [isMounted, setIsMounted] = useState(false)
    
    const [aeronaves, setAeronaves] = useLocalStorage<Aeronave[]>('aerocode_aeronaves', mockAeronaves)
    const [funcionariosBase] = useLocalStorage<Funcionario[]>('aerocode_funcionarios', mockFuncionarios)
    
    const [codigoAeronave, setCodigoAeronave] = useState('')
    const [nomeEtapa, setNomeEtapa] = useState('')
    const [usuarioFunc, setUsuarioFunc] = useState('')
    const [mensagem, setMensagem] = useState({ texto: '', tipo: '' })

    useEffect(() => {
        setIsMounted(true)
        const sessao = localStorage.getItem('aerocode_sessao')
        if (sessao) {
            const usuarioLogado = JSON.parse(sessao)
            if (usuarioLogado.nivelPermissao === 'OPERADOR') router.push('/dashboard')
        } else {
            router.push('/')
        }
    }, [router])

    if (!isMounted) return null

    const funcionariosAtivos = funcionariosBase.filter(f => f.ativo)
    const aeronaveSelecionada = aeronaves.find(a => a.codigo === codigoAeronave)
    const etapasDaAeronave = aeronaveSelecionada ? aeronaveSelecionada.etapas || [] : []
    const etapaSelecionada = etapasDaAeronave.find((e: any) => e.nome === nomeEtapa)
    const equipeAlocada = etapaSelecionada ? etapaSelecionada.funcionarios || [] : []

    const handleAssociar = (e: React.FormEvent) => {
        e.preventDefault()

        if (!codigoAeronave || !nomeEtapa || !usuarioFunc) {
            setMensagem({ texto: 'Preencha todos os campos!', tipo: 'erro' })
            return
        }

        const funcionarioSelecionado = funcionariosAtivos.find(f => f.usuario === usuarioFunc)
        if (!funcionarioSelecionado) return

        const jaEstaAlocado = equipeAlocada.some((f: Funcionario) => f.usuario === usuarioFunc)
        if (jaEstaAlocado) {
            setMensagem({ texto: 'Este funcionário já está nesta etapa!', tipo: 'erro' })
            return
        }

        const aeronavesAtualizadas = aeronaves.map(aeronave => {
            if (aeronave.codigo === codigoAeronave) {
                return {
                    ...aeronave,
                    etapas: aeronave.etapas.map((etapa: any) => {
                        if (etapa.nome === nomeEtapa) {
                            return { ...etapa, funcionarios: [...(etapa.funcionarios || []), funcionarioSelecionado] }
                        }
                        return etapa
                    })
                }
            }
            return aeronave
        })

        setAeronaves(aeronavesAtualizadas)
        setMensagem({ texto: 'Funcionário alocado com sucesso!', tipo: 'sucesso' })
        setUsuarioFunc('') 
        setTimeout(() => setMensagem({ texto: '', tipo: '' }), 3000)
    }

    const inputClass = "text-black w-full px-4 py-2 border border-black rounded-md outline-none focus:border-gray-500 focus:ring-1 focus:ring-black bg-white"
    const labelClass = "block text-sm font-semibold text-slate-700 mb-2"
    const isBotaoDesabilitado = !codigoAeronave || !nomeEtapa || !usuarioFunc

    return (
        <div className="w-full max-w-4xl mx-auto px-4 sm:px-6 lg:px-0 mt-16 lg:mt-0 pb-10 animate-fade-in">
            <header className="mb-8">
                <h1 className="text-2xl sm:text-3xl font-bold text-white">Equipe de Produção</h1>
                <p className="text-slate-100 mt-2">Aloque os colaboradores para as etapas de montagem das aeronaves.</p>
            </header>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                
                <div>
                    <form onSubmit={handleAssociar} className="bg-white p-5 sm:p-6 rounded-xl shadow-sm border border-slate-200">
                        <h2 className="text-lg font-bold text-slate-800 mb-5 border-b border-slate-200 pb-2">Delegar Tarefa</h2>
                        <div className="flex flex-col gap-5">
                            <div>
                                <label className={labelClass}>1. Aeronave</label>
                                <select value={codigoAeronave} onChange={(e) => { setCodigoAeronave(e.target.value); setNomeEtapa(''); setUsuarioFunc('') }} className={inputClass}>
                                    <option value="">-- Selecione a aeronave --</option>
                                    {aeronaves.map(a => <option key={a.codigo} value={a.codigo}>{a.codigo} - {a.modelo}</option>)}
                                </select>
                            </div>

                            <div>
                                <label className={labelClass}>2. Etapa de Produção</label>
                                <select value={nomeEtapa} onChange={(e) => { setNomeEtapa(e.target.value); setUsuarioFunc('') }} className={inputClass} disabled={!codigoAeronave}>
                                    <option value="">
                                        {!codigoAeronave ? "Selecione uma aeronave primeiro" : etapasDaAeronave.length === 0 ? "Nenhuma etapa cadastrada" : "-- Escolha a etapa --"}
                                    </option>
                                    {etapasDaAeronave.map((e: any, index: number) => (
                                        <option key={`${e.nome}-${index}`} value={e.nome} disabled={e.status === StatusEtapa.CONCLUIDA}>
                                            {e.nome} {e.status === StatusEtapa.CONCLUIDA ? '✅ (Já Finalizada)' : `(${e.status})`}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            <div>
                                <label className={labelClass}>3. Colaborador</label>
                                <select value={usuarioFunc} onChange={(e) => setUsuarioFunc(e.target.value)} className={inputClass} disabled={!nomeEtapa}>
                                    <option value="">{!nomeEtapa ? "Selecione a etapa primeiro" : "-- Selecione o funcionário --"}</option>
                                    {funcionariosAtivos.map((f, index) => <option key={`${f.usuario}-${index}`} value={f.usuario}>{f.nome} - {f.nivelPermissao}</option>)}
                                </select>
                            </div>
                        </div>

                        {mensagem.texto && (
                            <div className={`mt-5 p-3 rounded-lg text-sm font-medium ${mensagem.tipo === 'erro' ? 'bg-red-50 text-red-600 border border-red-200' : 'bg-emerald-50 text-emerald-600 border border-emerald-200'}`}>
                                {mensagem.texto}
                            </div>
                        )}

                        <button type="submit" disabled={isBotaoDesabilitado} className="w-full mt-6 px-6 py-3 hover:scale-[1.02] duration-200 bg-lime-600 hover:bg-lime-700 text-white rounded-lg font-medium shadow-md transition disabled:opacity-50 disabled:hover:scale-100 disabled:cursor-not-allowed">
                            Alocar Colaborador
                        </button>
                    </form>
                </div>

                <div className="bg-white p-5 sm:p-6 rounded-xl shadow-sm border border-slate-200 flex flex-col h-full">
                    <h2 className="text-lg font-bold text-slate-800 mb-5 border-b border-slate-200 pb-2">Equipe Alocada</h2>
                    {!nomeEtapa ? (
                        <div className="flex-1 flex flex-col items-center justify-center text-slate-400 opacity-60 min-h-[200px]">
                            <p className="text-sm font-medium">Selecione uma etapa</p>
                        </div>
                    ) : equipeAlocada.length === 0 ? (
                        <div className="flex-1 flex flex-col items-center justify-center text-blue-500/80 min-h-[200px]">
                            <p className="text-sm font-medium text-blue-700">Nenhum colaborador alocado.</p>
                        </div>
                    ) : (
                        <div className="flex flex-col gap-3 overflow-y-auto max-h-[400px] pr-2 [&::-webkit-scrollbar]:w-2 [&::-webkit-scrollbar-thumb]:bg-slate-300 [&::-webkit-scrollbar-thumb]:rounded-full">
                            {equipeAlocada.map((membro: Funcionario, index: number) => (
                                <div key={`${membro.usuario}-${index}`} className="p-3 border rounded-lg flex items-center gap-3 bg-slate-50 animate-fade-in">
                                    <div className="w-10 h-10 rounded-full bg-slate-300 flex items-center justify-center font-bold text-slate-600 shrink-0">{membro.nome.charAt(0)}</div>
                                    <div className="flex flex-col">
                                        <span className="font-bold text-slate-800 text-sm">{membro.nome}</span>
                                        <span className={`text-[10px] font-bold uppercase w-max px-2 py-0.5 rounded-full mt-1 ${membro.nivelPermissao === 'ENGENHEIRO' ? 'bg-blue-100 text-blue-700' : membro.nivelPermissao === 'ADMINISTRADOR' ? 'bg-red-100 text-red-700' : 'bg-slate-200 text-slate-700'}`}>{membro.nivelPermissao}</span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}