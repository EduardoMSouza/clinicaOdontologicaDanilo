"use client"

import { useEffect, useMemo, useState } from "react"
import { BarChart2, Download, Calendar, Users, DollarSign } from "lucide-react"
import { getAgendamentos, getPacientes, type AgendaDTO, type PacienteDTO } from "@/lib/api"

interface MonthlySummary {
    key: string
    label: string
    revenue: number
    appointments: number
}

interface DentistSummary {
    dentist: string
    count: number
    color: string
}

const dentistColors = [
    "bg-blue-500",
    "bg-green-500",
    "bg-amber-500",
    "bg-purple-500",
    "bg-rose-500",
]

export default function RelatoriosPage() {
    const [dateRange, setDateRange] = useState("month")
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
                const message = err instanceof Error ? err.message : "Não foi possível carregar os relatórios"
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
    const confirmados = agendamentos.filter((agenda) => agenda.status === "CONFIRMADO").length
    const cancelados = agendamentos.filter((agenda) => agenda.status === "CANCELADO").length
    const receitaEstimada = confirmados * 220

    const monthlySummary: MonthlySummary[] = useMemo(() => {
        const map = new Map<string, MonthlySummary>()

        agendamentos.forEach((agenda) => {
            const data = new Date(agenda.dataHora)
            if (Number.isNaN(data.getTime())) return

            const key = `${data.getFullYear()}-${String(data.getMonth() + 1).padStart(2, "0")}`
            const label = data.toLocaleDateString("pt-BR", { month: "short", year: "numeric" })

            if (!map.has(key)) {
                map.set(key, { key, label, revenue: 0, appointments: 0 })
            }

            const summary = map.get(key)!
            summary.appointments += 1
            if (agenda.status === "CONFIRMADO") {
                summary.revenue += 220
            }
        })

        return Array.from(map.values()).sort((a, b) => a.key.localeCompare(b.key))
    }, [agendamentos])

    const dentistSummary: DentistSummary[] = useMemo(() => {
        const counts = new Map<string, number>()

        agendamentos.forEach((agenda) => {
            const dentist = agenda.dentistaNome || "Não informado"
            counts.set(dentist, (counts.get(dentist) ?? 0) + 1)
        })

        return Array.from(counts.entries()).map(([dentist, count], index) => ({
            dentist,
            count,
            color: dentistColors[index % dentistColors.length],
        }))
    }, [agendamentos])

    if (loading) {
        return (
            <div className="flex items-center justify-center h-full min-h-[60vh]">
                <p className="text-gray-600 dark:text-gray-300">Carregando relatórios...</p>
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
                    <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Relatórios</h1>
                    <p className="text-gray-600 dark:text-gray-400">Acompanhe o desempenho da clínica</p>
                </div>
                <div className="flex gap-3">
                    <select
                        value={dateRange}
                        onChange={(e) => setDateRange(e.target.value)}
                        className="px-4 py-2 border border-gray-300 dark:border-zinc-600 rounded-lg bg-white dark:bg-zinc-800 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    >
                        <option value="week">Esta Semana</option>
                        <option value="month">Este Mês</option>
                        <option value="quarter">Este Trimestre</option>
                        <option value="year">Este Ano</option>
                    </select>
                    <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition flex items-center gap-2">
                        <Download className="h-4 w-4" />
                        Exportar
                    </button>
                </div>
            </div>

            {/* Cards de Métricas */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <div className="bg-white dark:bg-zinc-800 p-6 rounded-xl shadow-lg border border-gray-100 dark:border-zinc-700">
                    <div className="flex items-center justify-between mb-4">
                        <div className="p-3 rounded-xl bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400">
                            <DollarSign className="h-6 w-6" />
                        </div>
                        <span className="text-sm text-green-600 dark:text-green-400 font-medium">{confirmados} confirmados</span>
                    </div>
                    <p className="text-2xl font-bold text-gray-900 dark:text-white mb-1">
                        R$ {receitaEstimada.toLocaleString("pt-BR")}
                    </p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Receita estimada (R$ 220 por consulta)</p>
                </div>

                <div className="bg-white dark:bg-zinc-800 p-6 rounded-xl shadow-lg border border-gray-100 dark:border-zinc-700">
                    <div className="flex items-center justify-between mb-4">
                        <div className="p-3 rounded-xl bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400">
                            <Users className="h-6 w-6" />
                        </div>
                        <span className="text-sm text-green-600 dark:text-green-400 font-medium">Total</span>
                    </div>
                    <p className="text-2xl font-bold text-gray-900 dark:text-white mb-1">{totalPacientes}</p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Pacientes cadastrados</p>
                </div>

                <div className="bg-white dark:bg-zinc-800 p-6 rounded-xl shadow-lg border border-gray-100 dark:border-zinc-700">
                    <div className="flex items-center justify-between mb-4">
                        <div className="p-3 rounded-xl bg-amber-100 dark:bg-amber-900/30 text-amber-600 dark:text-amber-400">
                            <Calendar className="h-6 w-6" />
                        </div>
                        <span className="text-sm text-amber-600 dark:text-amber-400 font-medium">Total</span>
                    </div>
                    <p className="text-2xl font-bold text-gray-900 dark:text-white mb-1">{totalAgendamentos}</p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Consultas agendadas</p>
                </div>

                <div className="bg-white dark:bg-zinc-800 p-6 rounded-xl shadow-lg border border-gray-100 dark:border-zinc-700">
                    <div className="flex items-center justify-between mb-4">
                        <div className="p-3 rounded-xl bg-rose-100 dark:bg-rose-900/30 text-rose-600 dark:text-rose-400">
                            <Users className="h-6 w-6" />
                        </div>
                        <span className="text-sm text-rose-600 dark:text-rose-400 font-medium">Canceladas</span>
                    </div>
                    <p className="text-2xl font-bold text-gray-900 dark:text-white mb-1">{cancelados}</p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Consultas canceladas</p>
                </div>
            </div>

            {/* Gráficos e Tabelas */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Gráfico de Faturamento */}
                <div className="bg-white dark:bg-zinc-800 rounded-xl shadow-lg border border-gray-100 dark:border-zinc-700 p-6">
                    <h3 className="text-lg font-semibold mb-6 flex items-center gap-2">
                        <BarChart2 className="h-5 w-5 text-blue-600" />
                        Faturamento estimado por mês
                    </h3>
                    <div className="space-y-4">
                        {monthlySummary.length === 0 ? (
                            <p className="text-sm text-gray-600 dark:text-gray-400">Sem dados suficientes para gerar o gráfico.</p>
                        ) : (
                            monthlySummary.map((data) => (
                                <div key={data.key} className="space-y-2">
                                    <div className="flex justify-between text-sm">
                                        <span className="font-medium text-gray-900 dark:text-white">{data.label}</span>
                                        <span className="text-gray-600 dark:text-gray-400">R$ {data.revenue.toLocaleString("pt-BR")}</span>
                                    </div>
                                    <div className="w-full bg-gray-200 dark:bg-zinc-600 rounded-full h-2">
                                        <div
                                            className="bg-blue-600 h-2 rounded-full transition-all duration-500"
                                            style={{ width: `${Math.min(100, (data.revenue / Math.max(1, receitaEstimada)) * 100)}%` }}
                                        ></div>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                </div>

                {/* Estatísticas de Consultas */}
                <div className="bg-white dark:bg-zinc-800 rounded-xl shadow-lg border border-gray-100 dark:border-zinc-700 p-6">
                    <h3 className="text-lg font-semibold mb-6">Consultas por dentista</h3>
                    <div className="space-y-4">
                        {dentistSummary.length === 0 ? (
                            <p className="text-sm text-gray-600 dark:text-gray-400">Nenhum agendamento encontrado.</p>
                        ) : (
                            dentistSummary.map((item) => (
                                <div key={item.dentist} className="flex items-center justify-between">
                                    <div className="flex items-center gap-3">
                                        <div className={`w-3 h-3 rounded-full ${item.color}`}></div>
                                        <span className="text-sm text-gray-900 dark:text-white">{item.dentist}</span>
                                    </div>
                                    <span className="text-sm font-medium text-gray-900 dark:text-white">{item.count}</span>
                                </div>
                            ))
                        )}
                    </div>
                </div>
            </div>
        </div>
    )
}