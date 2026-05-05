'use client'
import { useEffect } from 'react'
import { useState } from 'react'
import { useLocalStorage } from '../../hooks/useLocalStorage'
import { Aeronave } from '../../models/Aeronave'
import { mockAeronaves } from '../../mocks/dadosIniciais'
import { TipoTeste, ResultadoTeste } from '../../enums/enums'

export default function RegistrarTeste() {
    const [isMounted, setIsMounted] = useState(false)
    const [aeronaves, setAeronaves] = useLocalStorage<Aeronave[]>('aerocode_aeronaves', mockAeronaves)
    const [codigoSelecionado, setCodigoSelecionado] = useState('')
    const [tipoTeste, setTipoTeste] = useState<TipoTeste | ''>('')
    const [resultadoTeste, setResultadoTeste] = useState<ResultadoTeste | ''>('')
    const [mensagem, setMensagem] = useState({ texto: '', tipo: '' })

    useEffect(() => {
        setIsMounted(true)
    }, [])

    if (!isMounted) {
        return null
    }

    const handleRegistrar = (e: React.FormEvent) => {
        e.preventDefault()

        if (!codigoSelecionado || !tipoTeste || !resultadoTeste) {
            setMensagem({ texto: 'Por favor, preencha todos os campos do teste!', tipo: 'erro' })
            return
        }

        const novoTeste = {
            tipo: tipoTeste as TipoTeste,
            resultado: resultadoTeste as ResultadoTeste,
            aeronaveCodigo: codigoSelecionado,
            data: new Date().toISOString()
        }

        const aeronavesAtualizadas = aeronaves.map(a => {
            if (a.codigo === codigoSelecionado) {
                return {
                    ...a,
                    testes: [...a.testes, novoTeste]
                }
            }
            return a
        })

        setAeronaves(aeronavesAtualizadas)
        setMensagem({ texto: 'Teste registrado e vinculado à aeronave com sucesso!', tipo: 'sucesso' })
        setTipoTeste('')
        setResultadoTeste('')
        setTimeout(() => setMensagem({ texto: '', tipo: '' }), 3000)
    }

    const totalTestes = aeronaves.reduce((acc, aviao) => acc + aviao.testes.length, 0)

    return (
        <div className="max-w-6xl mx-auto animate-fade-in">
            <header className="mb-8 flex justify-between items-end">
                <div>
                    <h1 className="text-3xl font-bold text-white">Registrar Teste de Qualidade</h1>
                    <p className="text-slate-100 mt-2">Documente os resultados das avaliações das aeronaves.</p>
                </div>
                <div className="text-center text-2xl text-white p-2 font-bold bg-gray-500/70 rounded-2xl hover:scale-105 hover:bg-gray-100/30 duration-200 cursor-default">
                    Total Registrado: {totalTestes}
                </div>
            </header>

            <form onSubmit={handleRegistrar} className="bg-white p-8 rounded-xl shadow-sm border border-slate-200">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                    <div>
                        <label className="block text-sm font-semibold text-slate-700 mb-2">Aeronave Avaliada</label>
                        <select 
                            value={codigoSelecionado}
                            onChange={(e) => setCodigoSelecionado(e.target.value)}
                            className="text-black px-4 py-2 border border-black/80 rounded-md outline-none focus:border-gray-500 focus:ring-1 focus:ring-black/50"
                        >
                            <option value="">-- Selecione --</option>
                            {aeronaves.map(a => (
                                <option key={a.codigo} value={a.codigo}>
                                    {a.codigo} - {a.modelo}
                                </option>
                            ))}
                        </select>
                    </div>

                    <div>
                        <label className="block text-sm font-semibold text-slate-700 mb-2">Tipo de Avaliação</label>
                        <select value={tipoTeste}
                            onChange={(e) => setTipoTeste(e.target.value as TipoTeste)}
                            className="text-black px-4 py-2 border border-black/80 rounded-md outline-none focus:border-gray-500 focus:ring-1 focus:ring-black/50"
                        >
                            <option value="">-- Selecione o Teste --</option>
                            <option value={TipoTeste.AERODINAMICO}>Teste Aerodinâmico</option>
                            <option value={TipoTeste.ELETRICO}>Teste Elétrico</option>
                            <option value={TipoTeste.HIDRAULICO}>Teste Hidraulico</option>
                        </select>
                    </div>

                    <div>
                        <label className="block text-sm font-semibold text-slate-700 mb-2">Resultado Final</label>
                        <select value={resultadoTeste}
                            onChange={(e) => setResultadoTeste(e.target.value as ResultadoTeste)}
                            className="text-black px-4 py-2 border border-black/80 rounded-md outline-none focus:border-gray-500 focus:ring-1 focus:ring-black/50"
                        >
                            <option value="">-- Veredito --</option>
                            <option value={ResultadoTeste.APROVADO}>Aprovado</option>
                            <option value="REPROVADO">Reprovado</option>
                        </select>
                    </div>

                </div>

                {mensagem.texto && (
                    <div className={`p-4 mb-6 rounded-lg font-medium ${mensagem.tipo === 'erro' ? 'bg-red-50 text-red-600 border border-red-200' : 'bg-emerald-50 text-emerald-600 border border-emerald-200'}`}>
                        {mensagem.texto}
                    </div>
                )}
                
                <div className="flex justify-end gap-4 border-t border-slate-700 pt-6 mt-2">
                    <button type="submit" className="px-6 py-2 hover:scale-102 duration-200 bg-lime-600 hover:bg-lime-700 text-white rounded-lg font-medium shadow-md transition">
                        Gravar Teste no Sistema
                    </button>
                </div>
            </form>
        </div>
    )
}