'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useLocalStorage } from '../../hooks/useLocalStorage'
import { Funcionario } from '../../models/Funcionario'
import { NivelPermissao } from '../../enums/enums'
import { mockFuncionarios } from '../../mocks/dadosIniciais'

export default function CadastrarFuncionario() {
    const router = useRouter()
    const [isMounted, setIsMounted] = useState(false)
    const [funcionarios, setFuncionarios] = useLocalStorage<Funcionario[]>('aerocode_funcionarios', mockFuncionarios)
    
    const [nome, setNome] = useState('')
    const [usuario, setUsuario] = useState('')
    const [senha, setSenha] = useState('')
    const [telefone, setTelefone] = useState('')
    const [endereco, setEndereco] = useState('')
    const [nivelPermissao, setNivelPermissao] = useState<NivelPermissao>(NivelPermissao.OPERADOR)
    
    const [mensagem, setMensagem] = useState({ texto: '', tipo: '' })

    useEffect(() => {
        setIsMounted(true)
        const sessao = localStorage.getItem('aerocode_sessao')
        if (sessao) {
            const usuarioLogado = JSON.parse(sessao)
            if (usuarioLogado.nivelPermissao !== 'ADMINISTRADOR') {
                router.push('/dashboard')
            }
        } else {
            router.push('/')
        }
    }, [router])

    if (!isMounted) return null

    const handleSalvar = (e: React.FormEvent) => {
        e.preventDefault()

        if (!nome.trim() || !usuario.trim() || !senha.trim() || !telefone.trim() || !endereco.trim()) {
            setMensagem({ texto: 'Por favor, preencha todos os campos corretamente!', tipo: 'erro' })
            return
        }

        const usuarioJaExiste = funcionarios.some(f => f.usuario.trim() === usuario.trim())
        if (usuarioJaExiste) {
            setMensagem({ texto: 'Este nome de usuário já está em uso!', tipo: 'erro' })
            return
        }

        const novoFuncionario: Funcionario = {
            id: crypto.randomUUID(),
            nome: nome.trim(),
            telefone: telefone.trim(),
            endereco: endereco.trim(),
            usuario: usuario.trim(),
            senha: btoa(senha.trim()),
            nivelPermissao,
            ativo: true 
        }

        setFuncionarios([...funcionarios, novoFuncionario])
        
        setMensagem({ texto: 'Funcionário cadastrado com sucesso!', tipo: 'sucesso' })
        setNome('')
        setUsuario('')
        setSenha('')
        setTelefone('')
        setEndereco('')
        setNivelPermissao(NivelPermissao.OPERADOR)
        
        setTimeout(() => setMensagem({ texto: '', tipo: '' }), 3000)
    }

    const inputClass = "text-black w-full px-4 py-2 border border-black rounded-md outline-none focus:border-gray-500 focus:ring-1 focus:ring-black"
    const labelClass = "block text-sm font-semibold text-slate-700 mb-2"
    const isBotaoDesabilitado = !nome.trim() || !usuario.trim() || !senha.trim() || !telefone.trim() || !endereco.trim()

    return (
        <div className="w-full max-w-3xl mx-auto px-4 sm:px-6 lg:px-0 mt-16 lg:mt-0 pb-10 animate-fade-in">
            <header className="mb-8">
                <h1 className="text-2xl sm:text-3xl font-bold text-white">Novo Funcionário</h1>
                <p className="text-slate-100 mt-2">Cadastre um novo membro na equipe da Aerocode.</p>
            </header>

            <form onSubmit={handleSalvar} className="bg-white p-5 sm:p-8 rounded-xl shadow-sm border border-slate-200">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-6">
                    <div>
                        <label className={labelClass}>Nome Completo</label>
                        <input
                            type="text"
                            value={nome}
                            onChange={(e) => setNome(e.target.value)}
                            className={inputClass}
                            placeholder="Ex: Gerson Penha"
                        />
                    </div>

                    <div>
                        <label className={labelClass}>Telefone</label>
                        <input
                            type="text"
                            value={telefone}
                            onChange={(e) => setTelefone(e.target.value)}
                            className={inputClass}
                            placeholder="Ex: (12) 99999-9999"
                        />
                    </div>

                    <div>
                        <label className={labelClass}>Usuário (Login)</label>
                        <input
                            type="text"
                            value={usuario}
                            onChange={(e) => setUsuario(e.target.value)}
                            className={inputClass}
                            placeholder="Ex: gerson"
                        />
                    </div>

                    <div>
                        <label className={labelClass}>Senha</label>
                        <input
                            type="password"
                            value={senha}
                            onChange={(e) => setSenha(e.target.value)}
                            className={inputClass}
                            placeholder="Digite uma senha"
                        />
                    </div>

                    <div className="sm:col-span-2">
                        <label className={labelClass}>Endereço Completo</label>
                        <input
                            type="text"
                            value={endereco}
                            onChange={(e) => setEndereco(e.target.value)}
                            className={inputClass}
                            placeholder="Rua, Número, Bairro, Cidade"
                        />
                    </div>

                    <div className="sm:col-span-2">
                        <label className={labelClass}>Nível de Acesso no Sistema</label>
                        <select
                            value={nivelPermissao}
                            onChange={(e) => setNivelPermissao(e.target.value as NivelPermissao)}
                            className={inputClass}
                        >
                            <option value={NivelPermissao.OPERADOR}>Operador</option>
                            <option value={NivelPermissao.ENGENHEIRO}>Engenheiro</option>
                            <option value={NivelPermissao.ADMINISTRADOR}>Administrador</option>
                        </select>
                    </div>
                </div>

                {mensagem.texto && (
                    <div className={`p-4 mb-6 rounded-lg font-medium ${mensagem.tipo === 'erro' ? 'bg-red-50 text-red-600 border border-red-200' : 'bg-emerald-50 text-emerald-600 border border-emerald-200'}`}>
                        {mensagem.texto}
                    </div>
                )}

                <div className="flex flex-col-reverse sm:flex-row sm:justify-end gap-3 border-t border-slate-100 pt-6 mt-2">
                    <button type="button" onClick={() => router.push('/dashboard')} className="w-full sm:w-auto px-6 py-2 hover:scale-105 text-slate-600 hover:bg-slate-100 rounded-lg font-medium transition duration-200">
                        Cancelar
                    </button>
                    <button 
                        type="submit" 
                        disabled={isBotaoDesabilitado}
                        className="w-full sm:w-auto px-6 py-2 hover:scale-105 duration-200 bg-lime-600 hover:bg-lime-700 text-white rounded-lg font-medium shadow-md transition disabled:opacity-50 disabled:hover:scale-100 disabled:cursor-not-allowed"
                    >
                        Salvar Funcionário
                    </button>
                </div>
            </form>
        </div>
    )
}