import { Sidebar } from '../components/Sidebar'

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="flex min-h-screen bg-[url('/img/fundos.jpg')] bg-cover bg-center bg-no-repeat">
      {/* Sidebar Fixa */}
      <Sidebar />

      {/* Conteúdo da Página que muda (children) */}
      <main className="flex-1 ml-0 lg:ml-72 p-8 transition-all duration-300 ">
        {children}
      </main>
    </div>
  )
}