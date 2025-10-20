"use client"

import { useState, useEffect } from "react"
import { useRouter, usePathname } from "next/navigation"
import { CalendarDays, Users, BarChart2, LogOut, Bell, Home } from "lucide-react"

interface DashboardLayoutProps {
    children: React.ReactNode
}

export default function DashboardLayout({ children }: DashboardLayoutProps) {
    const router = useRouter()
    const pathname = usePathname()
    const [activeItem, setActiveItem] = useState("")

    // Atualiza o item ativo quando a rota muda
    useEffect(() => {
        if (pathname === '/dashboard') setActiveItem('dashboard')
        else if (pathname.includes('/paciente')) setActiveItem('paciente')
        else if (pathname.includes('/agendamentos')) setActiveItem('agendamentos')
        else if (pathname.includes('/relatorios')) setActiveItem('relatorios')
    }, [pathname])

    const handleLogout = () => {
        document.cookie = "token=; Max-Age=0; path=/;"
        router.push("/login")
    }

    const menuItems = [
        { id: "dashboard", label: "Dashboard", icon: Home, path: "/dashboard" },
        { id: "paciente", label: "Pacientes", icon: Users, path: "/dashboard/paciente" },
        { id: "agendamentos", label: "Agendamentos", icon: CalendarDays, path: "/dashboard/agendamentos" },
        { id: "relatorios", label: "Relatórios", icon: BarChart2, path: "/dashboard/relatorios" },
    ]

    const handleNavigation = (path: string, id: string) => {
        setActiveItem(id)
        router.push(path)
    }

    const getPageTitle = () => {
        switch (activeItem) {
            case 'dashboard': return 'Dashboard'
            case 'paciente': return 'Pacientes'
            case 'agendamentos': return 'Agendamentos'
            case 'relatorios': return 'Relatórios'
            default: return 'Dashboard'
        }
    }

    const getPageDescription = () => {
        switch (activeItem) {
            case 'dashboard': return 'Visão geral da clínica'
            case 'paciente': return 'Gerencie o cadastro de pacientes'
            case 'agendamentos': return 'Controle de consultas e horários'
            case 'relatorios': return 'Relatórios e estatísticas'
            default: return 'Bem-vindo de volta'
        }
    }

    return (
        <div className="flex min-h-screen bg-gray-50 dark:bg-zinc-900">
            {/* Sidebar Fixa */}
            <aside className="w-64 bg-blue-600 text-white flex flex-col fixed left-0 top-0 h-screen shadow-lg z-40">
                <div className="flex-1">
                    <div className="p-6 border-b border-blue-500">
                        <h1 className="text-2xl font-bold">OdontoClínica</h1>
                        <p className="text-sm opacity-80 mt-1">Painel administrativo</p>
                    </div>

                    <nav className="flex flex-col space-y-2 p-4">
                        {menuItems.map((item) => (
                            <button
                                key={item.id}
                                onClick={() => handleNavigation(item.path, item.id)}
                                className={`flex items-center gap-3 p-3 rounded-lg transition-all ${
                                    activeItem === item.id
                                        ? "bg-blue-700 shadow-md"
                                        : "hover:bg-blue-700"
                                }`}
                            >
                                <item.icon className="h-5 w-5" />
                                <span className="font-medium">{item.label}</span>
                            </button>
                        ))}
                    </nav>
                </div>

                <div className="p-4 border-t border-blue-500">
                    <button
                        onClick={handleLogout}
                        className="flex items-center gap-3 p-3 rounded-lg hover:bg-blue-700 transition w-full"
                    >
                        <LogOut className="h-5 w-5" />
                        <span className="font-medium">Sair</span>
                    </button>
                </div>
            </aside>

            {/* Topbar Fixa e Área de Conteúdo */}
            <div className="flex-1 flex flex-col ml-64">
                {/* Topbar Fixa */}
                <header className="bg-white dark:bg-zinc-800 shadow-sm border-b border-gray-200 dark:border-zinc-700 sticky top-0 z-30">
                    <div className="flex justify-between items-center px-6 py-4">
                        <div>
                            <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-100">
                                {getPageTitle()}
                            </h2>
                            <p className="text-sm text-gray-600 dark:text-gray-400">
                                {getPageDescription()}
                            </p>
                        </div>

                        <div className="flex items-center gap-4">
                            <button className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-zinc-700 transition">
                                <Bell className="h-5 w-5" />
                            </button>

                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-full bg-blue-500 flex items-center justify-center text-white font-semibold">
                                    D
                                </div>
                                <div className="text-right">
                                    <p className="text-sm font-medium">Dr. Daniel Souza</p>
                                    <p className="text-xs text-gray-500 dark:text-gray-400">Dentista</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </header>

                {/* Área de Conteúdo Dinâmica */}
                <main className="flex-1 p-6">
                    {children}
                </main>
            </div>
        </div>
    )
}