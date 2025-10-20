"use client"

import { useMemo, useEffect, useState } from "react"
import { CalendarDays, Users, BarChart2, Plus } from "lucide-react"
import { getAgendamentos, getPacientes, type AgendaDTO, type PacienteDTO } from "@/lib/api"

interface UpcomingAppointment {
    id: number
    patient: string
    procedure: string
    time: string
    status: string
}

interface ActivityItem {
    id: number
    description: string
    timestamp: string
}

export default function DashboardPage() {
    const [pacientes, setPacientes] = useState<PacienteDTO[]>([])
    const [agendamentos, setAgendamentos] = useState<AgendaDTO[]>([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)

    useEffect(() => {
        let active = true
        async function loadData() {
            try {
                setLoading(true)
                const [pacientesResponse, agendamentosResponse] = await Promise.all([
                    getPacientes(),
                    getAgendamentos(),
                ])

                if (!active) return

                setPacientes(pacientesResponse)
                setAgendamentos(agendamentosResponse)
                setError(null)
            } catch (err) {
                if (!active) return
                const message = err instanceof Error ? err.message : "Não foi possível carregar os dados"
                setError(message)
            } finally {
                if (active) setLoading(false)
            }
        }

        loadData()

        return () => {
            active = false
        }
    }, [])

    const totalPacientes = pacientes.length
    const totalAgendamentos = agendamentos.length

    const agendamentosHoje = useMemo(() => {
        const hoje = new Date()
        const inicioDia = new Date(hoje.getFullYear(), hoje.getMonth(), hoje.getDate())
        const fimDia = new Date(hoje.getFullYear(), hoje.getMonth(), hoje.getDate() + 1)

        return agendamentos.filter((agenda) => {
            const data = new Date(agenda.dataHora)
            return data >= inicioDia && data < fimDia
        })
    }, [agendamentos])

    const confirmados = agendamentos.filter((agenda) => agenda.status === "CONFIRMADO").length
    const receitaEstimada = confirmados * 220

    const proximosAtendimentos: UpcomingAppointment[] = useMemo(() => {
        const agora = new Date()

        return agendamentos
            .filter((agenda) => {
                const data = new Date(agenda.dataHora)
                return !Number.isNaN(data.getTime()) && data >= agora
            })
            .sort((a, b) => new Date(a.dataHora).getTime() - new Date(b.dataHora).getTime())
            .slice(0, 3)
            .map((agenda) => {
                const data = new Date(agenda.dataHora)
                return {
                    id: agenda.id,
                    patient: agenda.pacienteNome,
                    procedure: agenda.observacoes ?? "Consulta odontológica",
                    time: data.toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" }),
                    status: agenda.status,
                }
            })
    }, [agendamentos])

    const atividadesRecentes: ActivityItem[] = useMemo(() => {
        return agendamentos
            .slice()
            .sort((a, b) => new Date(b.dataHora).getTime() - new Date(a.dataHora).getTime())
            .slice(0, 4)
            .map((agenda) => {
                const data = new Date(agenda.dataHora)
                const status = agenda.status === "CONFIRMADO" ? "Consulta confirmada" : agenda.status === "CANCELADO" ? "Consulta cancelada" : "Consulta agendada"
                return {
                    id: agenda.id,
                    description: `${status} - ${agenda.pacienteNome}`,
                    timestamp: data.toLocaleString("pt-BR", { day: "2-digit", month: "2-digit", hour: "2-digit", minute: "2-digit" }),
                }
            })
    }, [agendamentos])

    if (loading) {
        return (
            <div className="flex items-center justify-center h-full min-h-[60vh]">
                <p className="text-gray-600 dark:text-gray-300">Carregando dados do painel...</p>
            </div>
        )
    }

    if (error) {
        return (
            <div className="flex items-center justify-center h-full min-h-[60vh]">
                <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-200 px-6 py-4 rounded-lg">
                    {error}
                </div>
            </div>
        )
    }

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Dashboard</h1>
                    <p className="text-gray-600 dark:text-gray-400">Visão geral atualizada da clínica</p>
                </div>
                <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition flex items-center gap-2">
                    <Plus className="h-4 w-4" />
                    Nova Consulta
                </button>
            </div>

            {/* Cards de Estatísticas */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-white dark:bg-zinc-800 p-6 rounded-xl shadow-lg border border-gray-100 dark:border-zinc-700">
                    <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center gap-3">
                            <div className="p-3 rounded-xl bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400">
                                <Users className="h-6 w-6" />
                            </div>
                            <h3 className="text-lg font-semibold">Pacientes</h3>
                        </div>
                        <span className="text-xs font-medium px-2 py-1 rounded-full bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300">
                            {totalPacientes}
                        </span>
                    </div>
                    <p className="text-3xl font-bold text-gray-900 dark:text-white mb-2">{totalPacientes}</p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Pacientes cadastrados na base</p>
                </div>

                <div className="bg-white dark:bg-zinc-800 p-6 rounded-xl shadow-lg border border-gray-100 dark:border-zinc-700">
                    <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center gap-3">
                            <div className="p-3 rounded-xl bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400">
                                <CalendarDays className="h-6 w-6" />
                            </div>
                            <h3 className="text-lg font-semibold">Agendamentos</h3>
                        </div>
                        <span className="text-xs font-medium px-2 py-1 rounded-full bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300">
                            {agendamentosHoje.length} hoje
                        </span>
                    </div>
                    <p className="text-3xl font-bold text-gray-900 dark:text-white mb-2">{totalAgendamentos}</p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">{confirmados} confirmados</p>
                </div>

                <div className="bg-white dark:bg-zinc-800 p-6 rounded-xl shadow-lg border border-gray-100 dark:border-zinc-700">
                    <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center gap-3">
                            <div className="p-3 rounded-xl bg-amber-100 dark:bg-amber-900/30 text-amber-600 dark:text-amber-400">
                                <BarChart2 className="h-6 w-6" />
                            </div>
                            <h3 className="text-lg font-semibold">Receita estimada</h3>
                        </div>
                        <span className="text-xs font-medium px-2 py-1 rounded-full bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-300">
                            baseado em consultas confirmadas
                        </span>
                    </div>
                    <p className="text-3xl font-bold text-gray-900 dark:text-white mb-2">R$ {receitaEstimada.toLocaleString("pt-BR")}</p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Considerando ticket médio de R$ 220,00</p>
                </div>
            </div>

            {/* Próximas Consultas */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="bg-white dark:bg-zinc-800 rounded-xl shadow-lg border border-gray-100 dark:border-zinc-700 p-6">
                    <h3 className="text-lg font-semibold mb-4">Próximas Consultas</h3>
                    <div className="space-y-4">
                        {proximosAtendimentos.length === 0 ? (
                            <p className="text-sm text-gray-600 dark:text-gray-400">Nenhum atendimento futuro encontrado.</p>
                        ) : (
                            proximosAtendimentos.map((appointment) => (
                                <div key={appointment.id} className="flex items-center justify-between p-3 border border-gray-100 dark:border-zinc-700 rounded-lg">
                                    <div>
                                        <p className="font-medium text-gray-900 dark:text-white">{appointment.patient}</p>
                                        <p className="text-sm text-gray-600 dark:text-gray-400">{appointment.procedure}</p>
                                    </div>
                                    <div className="text-right">
                                        <p className="font-medium text-gray-900 dark:text-white">{appointment.time}</p>
                                        <span
                                            className={`text-xs px-2 py-1 rounded-full ${
                                                appointment.status === "CONFIRMADO"
                                                    ? "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300"
                                                    : appointment.status === "CANCELADO"
                                                        ? "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300"
                                                        : "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300"
                                            }`}
                                        >
                                            {appointment.status.toLowerCase()}
                                        </span>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                </div>

                <div className="bg-white dark:bg-zinc-800 rounded-xl shadow-lg border border-gray-100 dark:border-zinc-700 p-6">
                    <h3 className="text-lg font-semibold mb-4">Atividades Recentes</h3>
                    <div className="space-y-4">
                        {atividadesRecentes.length === 0 ? (
                            <p className="text-sm text-gray-600 dark:text-gray-400">Nenhuma atividade registrada.</p>
                        ) : (
                            atividadesRecentes.map((activity) => (
                                <div key={activity.id} className="flex items-center gap-3 p-3 border border-gray-100 dark:border-zinc-700 rounded-lg">
                                    <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                                    <div className="flex-1">
                                        <p className="text-sm text-gray-900 dark:text-white">
                                            <span className="font-medium">{activity.description}</span>
                                        </p>
                                        <p className="text-xs text-gray-500 dark:text-gray-400">{activity.timestamp}</p>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                </div>
            </div>
        </div>
    )
}