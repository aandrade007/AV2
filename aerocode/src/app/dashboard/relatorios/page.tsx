'use client'

import { useState, useEffect } from 'react'
import { useLocalStorage } from '../../hooks/useLocalStorage'
import { Aeronave } from '../../models/Aeronave'
import { Funcionario } from '../../models/Funcionario'
import { mockAeronaves, mockFuncionarios } from '../../mocks/dadosIniciais'

export default function Relatorios() {
    const [isMounted, setIsMounted] = useState(false)
    const [aeronaves] = useLocalStorage<Aeronave[]>('aerocode_aeronaves', mockAeronaves)
    const [funcionarios] = useLocalStorage<Funcionario[]>('aerocode_funcionarios', mockFuncionarios)

    useEffect(() => { setIsMounted(true) }, [])
    if (!isMounted) return null
    const totalAeronaves = aeronaves.length
    const comerciais = aeronaves.filter(a => a.tipo === 'COMERCIAL').length
    const militares = aeronaves.filter(a => a.tipo === 'MILITAR').length
    const totalFuncionarios = funcionarios.length
    const engenheiros = funcionarios.filter(f => f.nivelPermissao === 'ENGENHEIRO').length
    const totalTestes = aeronaves.reduce((acc, a) => acc + a.testes.length, 0)
    const testesAprovados = aeronaves.reduce((acc, a) => acc + a.testes.filter(t => t.resultado === 'APROVADO').length, 0)
    const testesReprovados = totalTestes - testesAprovados
    const taxaAprovacao = totalTestes > 0 ? ((testesAprovados / totalTestes) * 100).toFixed(1) : 0

    const handleImprimir = () => { window.print() }

    return (
        <div className="w-full max-w-4xl mx-auto px-4 sm:px-6 lg:px-0 mt-16 lg:mt-0 pb-10">

            <header className="mb-8 flex flex-col sm:flex-row sm:justify-between sm:items-end gap-4 print:hidden">
                <div>
                    <h1 className="text-2xl sm:text-3xl font-bold text-white">Relatório Final</h1>
                    <p className="text-slate-100 mt-2">Gere e exporte o documento oficial consolidado de produção.</p>
                </div>
                <button
                    onClick={handleImprimir}
                    className="flex items-center justify-center gap-2 text-xl text-white p-3 font-bold bg-gray-500/70 rounded-2xl hover:scale-105 hover:bg-sky-600 duration-200 shadow-lg self-start sm:self-auto"
                >
                    Exportar PDF
                </button>
            </header>

            <div className="bg-white p-6 sm:p-12 rounded-xl shadow-md border border-slate-200 text-slate-800 print:shadow-none print:border-none print:p-0">

                <div className="border-b-2 border-slate-800 pb-6 mb-8 flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3">
                    <div>
                        <h2 className="text-2xl font-black tracking-widest uppercase">Aerocode</h2>
                        <p className="text-sm text-slate-500 uppercase font-bold tracking-wider">Aerospace Technology</p>
                    </div>
                    <div className="sm:text-right">
                        <p className="text-sm font-bold">Relatório Oficial de Produção</p>
                        <p className="text-sm text-slate-500">Data: {new Date().toLocaleDateString('pt-BR')}</p>
                    </div>
                </div>

                <div className="mb-8">
                    <h3 className="text-lg font-bold bg-slate-100 p-2 border-l-4 border-slate-800 mb-4">1. Resumo</h3>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-center">
                        <div className="border border-slate-200 p-4 rounded">
                            <p className="text-4xl font-black text-blue-600">{totalAeronaves}</p>
                            <p className="text-sm font-bold text-slate-500 uppercase mt-1">Total Produzido</p>
                        </div>
                        <div className="border border-slate-200 p-4 rounded">
                            <p className="text-4xl font-black text-slate-700">{comerciais}</p>
                            <p className="text-sm font-bold text-slate-500 uppercase mt-1">Comerciais</p>
                        </div>
                        <div className="border border-slate-200 p-4 rounded">
                            <p className="text-4xl font-black text-slate-700">{militares}</p>
                            <p className="text-sm font-bold text-slate-500 uppercase mt-1">Militares</p>
                        </div>
                    </div>
                </div>

                <div className="mb-8">
                    <h3 className="text-lg font-bold bg-slate-100 p-2 border-l-4 border-slate-800 mb-4">2. Controle de Qualidade</h3>
                    <ul className="space-y-3">
                        <li className="flex justify-between border-b border-slate-100 pb-2">
                            <span className="font-medium text-sm sm:text-base">Total de Testes Realizados:</span>
                            <span className="font-bold">{totalTestes}</span>
                        </li>
                        <li className="flex justify-between border-b border-slate-100 pb-2">
                            <span className="font-medium text-sm sm:text-base">Testes com Veredito "Aprovado":</span>
                            <span className="font-bold text-emerald-600">{testesAprovados}</span>
                        </li>
                        <li className="flex justify-between border-b border-slate-100 pb-2">
                            <span className="font-medium text-sm sm:text-base">Testes com Veredito "Reprovado":</span>
                            <span className="font-bold text-red-600">{testesReprovados}</span>
                        </li>
                        <li className="flex justify-between border-b border-slate-100 pb-2">
                            <span className="font-medium text-sm sm:text-base">Taxa de Aprovação Geral:</span>
                            <span className="font-bold">{taxaAprovacao}%</span>
                        </li>
                    </ul>
                </div>

                <div className="mb-12">
                    <h3 className="text-lg font-bold bg-slate-100 p-2 border-l-4 border-slate-800 mb-4">3. Força de Trabalho</h3>
                    <p className="text-slate-600 text-sm sm:text-base">
                        O sistema conta atualmente com <span className="font-bold text-slate-800">{totalFuncionarios} funcionário(s)</span> ativos cadastrados,
                        sendo <span className="font-bold text-slate-800">{engenheiros} engenheiro(s)</span> especializados na linha de produção e montagem.
                    </p>
                </div>

                <div className="mt-16 pt-8 text-center w-64 mx-auto">
                    <div className="border-t border-slate-800 pt-2">
                        <p className="font-bold text-slate-800">Diretoria Aerocode</p>
                        <p className="text-sm text-slate-500">Documento gerado eletronicamente</p>
                    </div>
                </div>
            </div>
        </div>
    )
}