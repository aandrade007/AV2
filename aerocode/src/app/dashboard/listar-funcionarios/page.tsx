'use client'
import { useState, useEffect } from 'react'
import { useLocalStorage } from '../../hooks/useLocalStorage'
import { Funcionario } from '../../models/Funcionario'
import { NivelPermissao } from '../../enums/enums'
import { mockFuncionarios } from '../../mocks/dadosIniciais'
import { Icon } from 'lucide-react'
import {Pencil, Trash2} from 'lucide-react'

export default function ListarFuncionarios() {
    const [funcionarios, setFuncionarios] = useLocalStorage<Funcionario[]>('aerocode_funcionarios', mockFuncionarios)
    const [isMounted, setIsMounted] = useState(false)
    const [usuarioLogado, setUsuarioLogado] = useState<Funcionario | null>(null)
    const [modalAberto, setModalAberto] = useState(false)
    const [funcionarioEditando, setFuncionarioEditando] = useState<Funcionario | null>(null)
    const [editNome, setEditNome] = useState('')
    const [editUsuario, setEditUsuario] = useState('')
    const [editEndereco, setEditEndereco] = useState('')
    const [editSenha, setEditSenha] = useState('')
    const [editConfirmarSenha, setEditConfirmarSenha] = useState('')
    const [mensagemModal, setMensagemModal] = useState({ texto: '', tipo: '' })
    const [modalDesativarAberto, setModalDesativarAberto] = useState(false)
    const [funcionarioDesativando, setFuncionarioDesativando] = useState<Funcionario | null>(null)
    const [mensagemPrincipal, setMensagemPrincipal] = useState({ texto: '', tipo: '' })

    useEffect(() => {
        setIsMounted(true)
        const sessao = localStorage.getItem('aerocode_sessao')
        if (sessao) setUsuarioLogado(JSON.parse(sessao))
    }, [])

    if (!isMounted) return null

    const isAdmin = usuarioLogado?.nivelPermissao === NivelPermissao.ADMINISTRADOR

    const badgePermissao = (nivel: string) => {
        switch (nivel) {
            case 'ADMINISTRADOR': return 'bg-red-100 text-red-700'
            case 'ENGENHEIRO':    return 'bg-blue-100 text-blue-700'
            default:              return 'bg-slate-100 text-slate-700'
        }
    }

    const abrirModalEditar = (f: Funcionario) => {
        setFuncionarioEditando(f)
        setEditNome(f.nome)
        setEditUsuario(f.usuario)
        setEditEndereco(f.endereco)
        setEditSenha('')
        setEditConfirmarSenha('')
        setMensagemModal({ texto: '', tipo: '' })
        setModalAberto(true)
    }

    const handleSalvarEdicao = (e: React.FormEvent) => {
        e.preventDefault()
        if (!editNome.trim() || !editUsuario.trim() || !editEndereco.trim()) {
            setMensagemModal({ texto: 'Preencha todos os campos obrigatórios!', tipo: 'erro' })
            return
        }
        if (editSenha && editSenha !== editConfirmarSenha) {
            setMensagemModal({ texto: 'As senhas não coincidem!', tipo: 'erro' })
            return
        }
        const usuarioJaExiste = funcionarios.some(f => f.usuario === editUsuario.trim() && f.id !== funcionarioEditando?.id)
        if (usuarioJaExiste) {
            setMensagemModal({ texto: 'Este usuário já está em uso!', tipo: 'erro' })
            return
        }

        setFuncionarios(funcionarios.map(f => {
            if (f.id !== funcionarioEditando?.id) return f
            return {
                ...f,
                nome: editNome.trim(),
                usuario: editUsuario.trim(),
                endereco: editEndereco.trim(),
                ...(editSenha ? { senha: btoa(editSenha.trim()) } : {})
            }
        }))

        setModalAberto(false)
        setMensagemPrincipal({ texto: 'Funcionário atualizado com sucesso!', tipo: 'sucesso' })
        setTimeout(() => setMensagemPrincipal({ texto: '', tipo: '' }), 3000)
    }

    const abrirModalDesativar = (f: Funcionario) => {
        setFuncionarioDesativando(f)
        setModalDesativarAberto(true)
    }

    const handleDesativar = () => {
        setFuncionarios(funcionarios.map(f =>
            f.id === funcionarioDesativando?.id ? { ...f, ativo: false } : f
        ))
        setModalDesativarAberto(false)
        setMensagemPrincipal({ texto: 'Funcionário desativado com sucesso!', tipo: 'sucesso' })
        setTimeout(() => setMensagemPrincipal({ texto: '', tipo: '' }), 3000)
    }

    const inputClass = "text-black w-full px-4 py-2 border border-black rounded-md outline-none focus:border-gray-500 focus:ring-1 focus:ring-black"
    const labelClass = "block text-sm font-semibold text-slate-700 mb-2"

    const AcoesAdmin = ({ f }: { f: Funcionario }) => {
        if (!isAdmin) return null
        const ehEuMesmo = usuarioLogado?.id === f.id
        return (
            <div className="flex items-center gap-2">
                <button
                    onClick={() => abrirModalEditar(f)}
                    title="Editar funcionário"
                    className="p-1.5 rounded-lg text-slate-400 hover:text-blue-600 hover:bg-blue-50 transition"
                >
                    <Pencil size={18} />
                </button>
                <button
                    onClick={() => !ehEuMesmo && f.ativo && abrirModalDesativar(f)}
                    title={ehEuMesmo ? 'Você não pode se desativar' : !f.ativo ? 'Já inativo' : 'Desativar funcionário'}
                    className={`p-1.5 rounded-lg transition ${
                        ehEuMesmo || !f.ativo
                            ? 'text-slate-200 cursor-not-allowed'
                            : 'text-slate-400 hover:text-red-600 hover:bg-red-50'
                    }`}
                >
                    <Trash2 size={18} />
                </button>
            </div>
        )
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

            {/* Mensagem de feedback */}
            {mensagemPrincipal.texto && (
                <div className={`p-4 mb-4 rounded-lg font-medium text-sm ${mensagemPrincipal.tipo === 'erro' ? 'bg-red-50 text-red-600 border border-red-200' : 'bg-emerald-50 text-emerald-600 border border-emerald-200'}`}>
                    {mensagemPrincipal.texto}
                </div>
            )}

            {/* ── MOBILE: Cards ── */}
            <div className="flex flex-col gap-3 md:hidden">
                {funcionarios.length === 0 ? (
                    <div className="p-8 text-center text-slate-100 bg-white/10 rounded-xl">Nenhum funcionário cadastrado.</div>
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
                                        <span className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></span>Ativo
                                    </span>
                                ) : (
                                    <span className="flex items-center gap-1 text-red-500 font-medium text-xs shrink-0">
                                        <span className="w-2 h-2 bg-red-500 rounded-full"></span>Inativo
                                    </span>
                                )}
                            </div>
                            <div className="flex items-center justify-between border-t border-slate-100 pt-3">
                                <span className={`px-2 py-1 rounded-full text-[10px] font-bold ${badgePermissao(f.nivelPermissao)}`}>
                                    {f.nivelPermissao}
                                </span>
                                <div className="flex items-center gap-2">
                                    <span className="text-xs text-slate-500">{f.telefone}</span>
                                    <AcoesAdmin f={f} />
                                </div>
                            </div>
                        </div>
                    ))
                )}
            </div>

            {/* ── DESKTOP: Tabela ── */}
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
                                {isAdmin && <th className="p-4 font-semibold">Ações</th>}
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-300">
                            {funcionarios.length === 0 ? (
                                <tr>
                                    <td colSpan={6} className="p-8 text-center text-slate-500">Nenhum funcionário cadastrado.</td>
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
                                                    <span className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></span>Ativo
                                                </span>
                                            ) : (
                                                <span className="flex items-center gap-1.5 text-red-500 font-medium text-sm">
                                                    <span className="w-2 h-2 bg-red-500 rounded-full"></span>Inativo
                                                </span>
                                            )}
                                        </td>
                                        {isAdmin && (
                                            <td className="p-4">
                                                <AcoesAdmin f={f} />
                                            </td>
                                        )}
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* ── Modal de Edição ── */}
            {modalAberto && funcionarioEditando && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60">
                    <div className="bg-white w-full max-w-lg rounded-xl shadow-2xl border border-slate-200 overflow-hidden">

                        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100">
                            <h2 className="text-lg font-bold text-slate-800">Editar Funcionário</h2>
                            <button onClick={() => setModalAberto(false)} className="text-slate-400 hover:text-slate-700 text-xl font-bold transition">✕</button>
                        </div>

                        <form onSubmit={handleSalvarEdicao} className="p-6 flex flex-col gap-4">
                            <div>
                                <label className={labelClass}>Nome Completo</label>
                                <input type="text" value={editNome} onChange={e => setEditNome(e.target.value)} className={inputClass} placeholder="Nome completo" />
                            </div>
                            <div>
                                <label className={labelClass}>Usuário (Login)</label>
                                <input type="text" value={editUsuario} onChange={e => setEditUsuario(e.target.value)} className={inputClass} placeholder="Usuário" />
                            </div>
                            <div>
                                <label className={labelClass}>Endereço</label>
                                <input type="text" value={editEndereco} onChange={e => setEditEndereco(e.target.value)} className={inputClass} placeholder="Endereço completo" />
                            </div>
                            <div>
                                <label className={labelClass}>Nova Senha <span className="font-normal text-slate-400">(deixe em branco para não alterar)</span></label>
                                <input type="password" value={editSenha} onChange={e => setEditSenha(e.target.value)} className={inputClass} placeholder="Nova senha" />
                            </div>
                            <div>
                                <label className={labelClass}>Confirmar Nova Senha</label>
                                <input type="password" value={editConfirmarSenha} onChange={e => setEditConfirmarSenha(e.target.value)} className={inputClass} placeholder="Confirme a senha" />
                            </div>

                            {mensagemModal.texto && (
                                <div className={`p-3 rounded-lg text-sm font-medium ${mensagemModal.tipo === 'erro' ? 'bg-red-50 text-red-600 border border-red-200' : 'bg-emerald-50 text-emerald-600 border border-emerald-200'}`}>
                                    {mensagemModal.texto}
                                </div>
                            )}

                            <div className="flex flex-col-reverse sm:flex-row sm:justify-end gap-3 border-t border-slate-100 pt-4 mt-2">
                                <button type="button" onClick={() => setModalAberto(false)} className="w-full sm:w-auto px-6 py-2 text-slate-600 hover:bg-slate-100 rounded-lg font-medium transition">
                                    Cancelar
                                </button>
                                <button type="submit" className="w-full sm:w-auto px-6 py-2 bg-lime-600 hover:bg-lime-700 text-white rounded-lg font-medium shadow-md transition">
                                    Salvar Alterações
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* ── Modal de Confirmação de Desativação ── */}
            {modalDesativarAberto && funcionarioDesativando && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60">
                    <div className="bg-white w-full max-w-md rounded-xl shadow-2xl border border-slate-200 p-6">
                        <h2 className="text-lg font-bold text-slate-800 mb-2">Desativar Funcionário</h2>
                        <p className="text-sm text-slate-600 mb-6">
                            Tem certeza que deseja desativar <strong>@{funcionarioDesativando.usuario}</strong>? 
                            O funcionário perderá o acesso ao sistema, mas seus dados serão mantidos.
                        </p>
                        <div className="flex flex-col-reverse sm:flex-row sm:justify-end gap-3">
                            <button onClick={() => setModalDesativarAberto(false)} className="w-full sm:w-auto px-6 py-2 text-slate-600 hover:bg-slate-100 rounded-lg font-medium transition">
                                Cancelar
                            </button>
                            <button onClick={handleDesativar} className="w-full sm:w-auto px-6 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg font-medium shadow-md transition">
                                Confirmar Desativação
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}