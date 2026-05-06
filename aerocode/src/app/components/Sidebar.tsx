'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Funcionario } from '../models/Funcionario';
import { NivelPermissao } from '../enums/enums';
import { LogOut } from 'lucide-react';

export function Sidebar() {
    const [usuario, setUsuario] = useState<Funcionario | null>(null);
    const [isOpen, setIsOpen] = useState(false);
    const [isMobile, setIsMobile] = useState(false);
    const router = useRouter();

    useEffect(() => {
        const checkMobile = () => setIsMobile(window.innerWidth < 1024);
        checkMobile();
        window.addEventListener('resize', checkMobile);
        return () => window.removeEventListener('resize', checkMobile);
    }, []);

    useEffect(() => {
        const sessao = localStorage.getItem('aerocode_sessao');
        if (sessao) {
            setUsuario(JSON.parse(sessao));
        } else {
            router.push('/');
        }
    }, [router]);

    useEffect(() => {
        const handleClickOutside = (e: MouseEvent) => {
            const sidebar = document.getElementById('sidebar');
            const hamburger = document.getElementById('hamburger-btn');
            if (
                isOpen &&
                sidebar &&
                !sidebar.contains(e.target as Node) &&
                hamburger &&
                !hamburger.contains(e.target as Node)
            ) {
                setIsOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, [isOpen]);

    const handleLogout = () => {
        localStorage.removeItem('aerocode_sessao');
        router.push('/');
    };

    if (!usuario) return null;

    const isAdmin = usuario.nivelPermissao === NivelPermissao.ADMINISTRADOR;
    const isEngenheiro = usuario.nivelPermissao === NivelPermissao.ENGENHEIRO;
    const podeGerenciarProducao = isAdmin || isEngenheiro;
    const sidebarVisible = !isMobile || isOpen;

    const linkBase = "flex items-center gap-3 p-2 rounded-lg transition text-sm";

    return (
        <>
            {/* Botão Hambúrguer */}
            {isMobile && (
                <button
                    id="hamburger-btn"
                    onClick={() => setIsOpen(!isOpen)}
                    className="fixed top-4 left-4 z-50 w-10 h-10 flex flex-col items-center justify-center gap-[6px] bg-blue-950 rounded-lg shadow-lg border border-slate-700"
                    aria-label="Abrir menu"
                >
                    <span className={`block w-5 h-0.5 bg-white rounded transition-all duration-300 origin-center ${isOpen ? 'rotate-45 translate-y-[8px]' : ''}`} />
                    <span className={`block w-5 h-0.5 bg-white rounded transition-all duration-300 ${isOpen ? 'opacity-0 scale-x-0' : ''}`} />
                    <span className={`block w-5 h-0.5 bg-white rounded transition-all duration-300 origin-center ${isOpen ? '-rotate-45 -translate-y-[8px]' : ''}`} />
                </button>
            )}

            {/* Overlay */}
            {isMobile && isOpen && (
                <div onClick={() => setIsOpen(false)} className="fixed inset-0 bg-black/60 z-30" />
            )}

            {/* Sidebar */}
            <aside
                id="sidebar"
                className={`
                    fixed left-0 top-0 h-screen z-40
                    w-72 bg-blue-950 text-slate-300
                    flex flex-col p-4 shadow-2xl overflow-y-auto
                    transition-transform duration-300 ease-in-out
                    ${sidebarVisible ? 'translate-x-0' : '-translate-x-full'}
                `}
            >
                {/* Logo */}
                <div className="flex flex-col items-center mb-8 mt-6 bg-[url('/img/fundo.jpg')] rounded-4xl bg-cover bg-center bg-no-repeat">
                    <h2 className="text-lg font-bold tracking-widest text-white">AEROCODE</h2>
                </div>

                {/* Navegação */}
                <nav className="flex-1 flex flex-col gap-1">

                    <p className="text-[11px] font-bold uppercase text-slate-400 mb-2 mt-4 ml-2 tracking-wider">Geral</p>

                    {[
                        { icon: '📊', label: 'Dashboard',                  href: '/dashboard' },
                        { icon: '👥', label: 'Listar Funcionários',         href: '/dashboard/listar-funcionarios' },
                        { icon: '✈️', label: 'Listar Aeronaves',            href: '/dashboard/listar-aeronaves' },
                        { icon: '📋', label: 'Listar Etapas da Aeronave',  href: '/dashboard/listar-etapas' },
                        { icon: '📝', label: 'Registrar Teste',             href: '/dashboard/registrar-teste' },
                        { icon: '📄', label: 'Gerar Relatório Final',       href: '/dashboard/relatorios' },
                    ].map(({ icon, label, href }) => (
                        <Link key={label} href={href} onClick={() => setIsOpen(false)}
                            className={`${linkBase} hover:bg-amber-50/20 hover:text-white`}>
                            {icon} {label}
                        </Link>
                    ))}

                    {podeGerenciarProducao && (
                        <>
                            <p className="text-[11px] font-bold uppercase text-blue-500 mb-2 mt-6 ml-2 tracking-wider">Produção</p>
                            {[
                                { icon: '➕', label: 'Cadastrar Aeronave',        href: '/dashboard/cadastrar-aeronave' },
                                { icon: '⚙️', label: 'Cadastrar Peça',            href: '/dashboard/cadastrar-peca' },
                                { icon: '🔄', label: 'Atualizar Status da Peça', href: '/dashboard/atualizar-peca' },
                                { icon: '🏗️', label: 'Gerenciar Etapas',          href: '/dashboard/gerenciar-etapas' },
                                { icon: '🔗', label: 'Associar Func. à Etapa',   href: '/dashboard/associar-funcionario' },
                            ].map(({ icon, label, href }) => (
                                <Link key={label} href={href} onClick={() => setIsOpen(false)}
                                    className={`${linkBase} hover:bg-blue-900/30 hover:text-blue-400`}>
                                    {icon} {label}
                                </Link>
                            ))}
                        </>
                    )}

                    {isAdmin && (
                        <>
                            <p className="text-[11px] font-bold uppercase text-green-500/70 mb-2 mt-6 ml-2 tracking-wider">Administração</p>
                            {[
                                { icon: '➕', label: 'Cadastrar Funcionário', href: '/dashboard/cadastrar-funcionario' },
                                { icon: '🗑️', label: 'Excluir Funcionário',   href: '/dashboard/excluir-funcionario' },
                            ].map(({ icon, label, href }) => (
                                <Link key={label} href={href} onClick={() => setIsOpen(false)}
                                    className={`${linkBase} hover:bg-green-900/30 hover:text-green-400`}>
                                    {icon} {label}
                                </Link>
                            ))}
                        </>
                    )}
                </nav>

                {/* Rodapé */}
                <div className="mt-auto pt-4 border-t border-white flex flex-col gap-3">
                    <div className="flex items-center gap-3 px-2 bg-slate-800/50 p-2 rounded-lg">
                        <div className="w-10 h-10 rounded-full bg-emerald-500 text-white flex items-center justify-center font-bold text-sm shrink-0">
                            {usuario.nome.charAt(0)}
                        </div>
                        <div className="flex flex-col overflow-hidden">
                            <span className="text-xs font-bold text-white truncate">{usuario.nome}</span>
                            <span className="text-[10px] text-slate-400 uppercase tracking-tighter truncate">{usuario.nivelPermissao}</span>
                        </div>
                    </div>
                    <button onClick={handleLogout}
                        className="flex items-center justify-center gap-2 p-2 rounded-lg bg-slate-800 hover:bg-red-600 hover:text-white transition text-xs font-medium">
                        <LogOut size={16} />
                        Sair
                    </button>
                </div>
            </aside>
        </>
    );
}