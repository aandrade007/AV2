import { Sidebar } from '../components/Sidebar'
import { ProtectedLayout } from '../components/ProtectedLayout'

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <ProtectedLayout>
      <div className="flex min-h-screen bg-[url('/img/fundos.jpg')] bg-cover bg-center bg-no-repeat">
        <Sidebar />
        <main className="flex-1 ml-0 lg:ml-72 p-8 transition-all duration-300">
          {children}
        </main>
      </div>
    </ProtectedLayout>
  )
}