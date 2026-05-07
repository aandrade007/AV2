'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import { mockFuncionarios } from './mocks/dadosIniciais'
import { Funcionario } from './models/Funcionario'

export default function TelaLogin() {
    const [usuario, setUsuario] = useState('')
    const [senha, setSenha] = useState('')
    const [erro, setErro] = useState('')
    
    const router = useRouter()

    const handleLogin = (e: React.FormEvent) => {
        e.preventDefault()

        if (!usuario.trim() || !senha.trim()) {
            setErro('Preencha todos os campos!')
            return
        }

        const dadosStorage = localStorage.getItem('aerocode_funcionarios')
        const funcionariosSistema: Funcionario[] = dadosStorage ? JSON.parse(dadosStorage) : mockFuncionarios

        const senhaOfuscada = btoa(senha.trim())

        const funcionarioEncontrado = funcionariosSistema.find(
            (f) => f.usuario === usuario.trim() && f.senha === senhaOfuscada
        )

        if (funcionarioEncontrado) {
            if (!funcionarioEncontrado.ativo) {
                setErro('Acesso negado: Este usuário foi desativado.')
                return
            }

            localStorage.setItem('aerocode_sessao', JSON.stringify(funcionarioEncontrado))
            setErro('')
            router.push('/dashboard') 
        } 
        else {
            setErro('Usuário ou senha inválidos!')
        }
    }

    return (
        <div className="flex min-h-screen items-center justify-center p-4 bg-[url('/img/fundo.jpg')] bg-cover bg-center bg-no-repeat">
            
            <div className="flex w-full max-w-4xl rounded-4xl h-[550px] bg-gray-200/90 shadow-xl overflow-hidden relative">

                <div className="hidden md:flex w-2/2 rounded-r-[150px] z-10 shadow-[5px_0_15px_rgba(0,0,0,0.5)] relative overflow-hidden">
                    <Image 
                        src="/img/aerocodeLOGO.png" 
                        alt="Logo Aerocode Grande"
                        fill
                        className="object-cover"
                        priority 
                    />
                </div>

                <div className="w-full md:w-1/2 flex flex-col items-center justify-center p-12 z-0">

                    <h1 className="text-3xl font-title font-semibold text-slate-800 mb-2 tracking-tight text-center">Bem Vindo(a)!</h1>
                    
                    <p className="text-slate-600 mb-8 font-sans tracking-wide text-2xl">
                        Sistema Aerocode
                    </p>

                    <form onSubmit={handleLogin} className="w-full max-w-xs flex flex-col gap-5">
                        <div>
                            <input 
                                type="text" 
                                placeholder="Digite seu login:" 
                                value={usuario}
                                onChange={(e) => setUsuario(e.target.value)}
                                className="text-black w-full px-4 py-2 border border-black rounded-md outline-none focus:border-gray-500 focus:ring-1 focus:ring-black"
                            />
                        </div>
                        <div>
                            <input 
                                type="password" 
                                placeholder="Digite sua senha:" 
                                value={senha}
                                onChange={(e) => setSenha(e.target.value)}
                                className="text-black w-full px-4 py-2 border border-black rounded-md outline-none focus:border-gray-500 focus:ring-1 focus:ring-black"
                            />
                        </div>

                        {erro && (
                            <p className="text-red-500 text-sm text-center font-medium">{erro}</p>
                        )}

                        <button 
                            type="submit" 
                            className="w-full bg-green-600 hover:bg-green-800 text-white font-medium py-2 px-4 rounded-md hover:scale-110 transition duration-200 mt-2">
                            Entrar
                        </button>
                    </form>
                </div>
            </div>
        </div>
    )
}