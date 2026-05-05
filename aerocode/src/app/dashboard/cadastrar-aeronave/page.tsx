'use client'

import { useState } from 'react'
import { useLocalStorage } from '../../hooks/useLocalStorage'
import { Aeronave } from '../../models/Aeronave'
import { TipoAeronave } from '../../enums/enums'
import { mockAeronaves } from '../../mocks/dadosIniciais'

export default function CadastrarAeronave() {
    const [aeronaves, setAeronaves] = useLocalStorage<Aeronave[]>('aerocode_aeronaves', mockAeronaves)
    const [codigo, setCodigo] = useState('')
    const [modelo, setModelo] = useState('')
    const [tipo, setTipo] = useState<TipoAeronave>(TipoAeronave.COMERCIAL)
    const [capacidade, setCapacidade] = useState('')
    const [alcance, setAlcance] = useState('')
    const [mensagem, setMensagem] = useState({ texto: '', tipo: '' })

    const handleSalvar = (e: React.FormEvent) => {
        e.preventDefault()

        if (!codigo || !modelo || !capacidade || !alcance) {
            setMensagem({ texto: 'Por favor, preencha todos os campos!', tipo: 'erro' })
            return
        }

        const codigoJaExiste = aeronaves.some(a => a.codigo === codigo)
        if (codigoJaExiste) {
            setMensagem({ texto: 'Já existe uma aeronave com este código!', tipo: 'erro' })
            return
        }

        const novaAeronave: Aeronave = {
            codigo,
            modelo,
            tipo,
            capacidade: Number(capacidade),
            alcance: Number(alcance),
            pecas: [], 
            etapas: [],
            testes: []
        }

        setAeronaves([...aeronaves, novaAeronave])

        setMensagem({ texto: 'Aeronave cadastrada com sucesso!', tipo: 'sucesso' })
        setCodigo('')
        setModelo('')
        setCapacidade('')
        setAlcance('')
        setTimeout(() => setMensagem({ texto: '', tipo: '' }), 2000)
    }

    return (
        <div className="max-w-3xl mx-auto animate-fade-in">
            <header className="mb-8">
                <h1 className="text-3xl font-bold text-white">Nova Aeronave</h1>
                <p className="text-slate-100 mt-2">Cadastre uma nova aeronave preenchendo todos os campos! </p>
            </header>

            <form onSubmit={handleSalvar} className="bg-white p-8 rounded-xl shadow-sm border border-slate-200">
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                    <div>
                        <label className="block text-sm font-semibold text-slate-700 mb-2">Código Único (Ex: AC-777)</label>
                        <input 
                            type="text" 
                            value={codigo}
                            onChange={(e) => setCodigo(e.target.value.toUpperCase())}
                            className="text-black w-full px-4 py-2 border border-black rounded-md outline-none focus:border-gray-500 focus:ring-1 focus:ring-black"
                            placeholder="Digite o código"
                        />
                    </div>

                    {/* Modelo */}
                    <div>
                        <label className="block text-sm font-semibold text-slate-700 mb-2">Modelo da Aeronave</label>
                        <input 
                            type="text" 
                            value={modelo}
                            onChange={(e) => setModelo(e.target.value)}
                            className="text-black w-full px-4 py-2 border border-black rounded-md outline-none focus:border-gray-500 focus:ring-1 focus:ring-black"
                            placeholder="Ex: Boeing 777X"
                        />
                    </div>

                    {/* Tipo (Select) */}
                    <div>
                        <label className="block text-sm font-semibold text-slate-700 mb-2">Tipo de Aeronave</label>
                        <select 
                            value={tipo}
                            onChange={(e) => setTipo(e.target.value as TipoAeronave)}
                            className="text-black w-full px-4 py-2 border border-black rounded-md outline-none focus:border-gray-500 focus:ring-1 focus:ring-black"
                        >
                            <option value={TipoAeronave.COMERCIAL}>Comercial</option>
                            <option value={TipoAeronave.MILITAR}>Militar</option>
                        </select>
                    </div>

                    {/* Capacidade */}
                    <div>
                        <label className="block text-sm font-semibold text-slate-700 mb-2">Capacidade (Passageiros/Tripulação)</label>
                        <input 
                            type="number" 
                            value={capacidade}
                            onChange={(e) => setCapacidade(e.target.value)}
                            className="text-black w-full px-4 py-2 border border-black rounded-md outline-none focus:border-gray-500 focus:ring-1 focus:ring-black"
                            placeholder="Ex: 350"
                        />
                    </div>

                    {/* Alcance */}
                    <div>
                        <label className="block text-sm font-semibold text-slate-700 mb-2">Alcance Máximo (km)</label>
                        <input 
                            type="number" 
                            value={alcance}
                            onChange={(e) => setAlcance(e.target.value)}
                            className="text-black w-full px-4 py-2 border border-black rounded-md outline-none focus:border-gray-500 focus:ring-1 focus:ring-black"
                            placeholder="Ex: 15000"
                        />
                    </div>
                </div>

                {mensagem.texto && (
                    <div className={`p-4 mb-6 rounded-lg font-medium ${mensagem.tipo === 'erro' ? 'bg-red-50 text-red-600 border border-red-200' : 'bg-emerald-50 text-emerald-600 border border-emerald-200'}`}>
                        {mensagem.texto}
                    </div>
                )}

                {/* Botões de Ação */}
                <div className="flex justify-end gap-4 border-t border-slate-100 pt-6 mt-2">
                    <button type="button" className="px-6 py-2 hover:scale-102 text-slate-600 hover:bg-mist-200 rounded-lg font-medium transition">
                        Cancelar
                    </button>
                    <button type="submit" className="px-6 py-2 hover:scale-102 duration-200 bg-lime-600 hover:bg-lime-700 text-white rounded-lg font-medium shadow-md transition">
                        Salvar Aeronave
                    </button>
                </div>
            </form>
        </div>
    )
}