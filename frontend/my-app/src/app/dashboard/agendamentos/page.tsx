"use client"

import { useEffect, useMemo, useState } from "react"
import { Calendar, Clock, Search, Plus } from "lucide-react"
import { getAgendamentos, type AgendaDTO } from "@/lib/api"

interface AppointmentView {
    id: number
    patient: string
    dentist: string
    date: string
    time: string
    notes: string
    status: string
}

const statusColorMap: Record<string, string> = {
    CONFIRMADO: "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300",
    CANCELADO: "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300",
    AGENDADO: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300",
}

function getStatusColor(status: string) {
    return statusColorMap[status] ?? "bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-300"
}

function toAppointmentView(agenda: AgendaDTO): AppointmentView {
    const data = new Date(agenda.dataHora)
    return {
        id: agenda.id,
        patient: agenda.pacienteNome,
        dentist: agenda.dentistaNome,
        date: data.toISOString().split("T")[0],
        time: data.toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" }),
        notes: agenda.observacoes ?? "Consulta odontológica",
        status: agenda.status,
    }
}

export default function AgendamentosPage() {
    const [selectedDate, setSelectedDate] = useState("")
    const [searchTerm, setSearchTerm] = useState("")
    const [agendamentos, setAgendamentos] = useState<AppointmentView[]>([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)

    useEffect(() => {
        let active = true

        async function loadAgendamentos() {
            try {
                setLoading(true)
                const response = await getAgendamentos()
                if (!active) return
                setAgendamentos(response.map(toAppointmentView))
                setError(null)
            } catch (err) {
                if (!active) return
                const message = err instanceof Error ? err.message : "Não foi possível carregar os agendamentos"
                setError(message)
            } finally {
                if (active) setLoading(false)
            }
        }

        loadAgendamentos()

        return () => {
            active = false
        }
    }, [])

    const filteredAppointments = useMemo(() => {
        const term = searchTerm.trim().toLowerCase()
        const dateFilter = selectedDate

        return agendamentos.filter((appointment) => {
            const matchesTerm =
                !term ||
                appointment.patient.toLowerCase().includes(term) ||
                appointment.dentist.toLowerCase().includes(term) ||
                appointment.notes.toLowerCase().includes(term)
            const matchesDate = !dateFilter || appointment.date === dateFilter
            return matchesTerm && matchesDate
        })
    }, [agendamentos, searchTerm, selectedDate])

    const todayKey = new Date().toISOString().split("T")[0]
    const todayAppointments = filteredAppointments.filter((appointment) => appointment.date === todayKey)

    if (loading) {
        return (
            <div className="flex items-center justify-center h-full min-h-[60vh]">
                <p className="text-gray-600 dark:text-gray-300">Carregando agendamentos...</p>
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
                    <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Agendamentos</h1>
                    <p className="text-gray-600 dark:text-gray-400">Gerencie consultas e horários</p>
                </div>
                <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition flex items-center gap-2">
                    <Plus className="h-4 w-4" />
                    Novo Agendamento
                </button>
            </div>

            {/* Filtros e Pesquisa */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="md:col-span-2 relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                    <input
                        type="text"
                        placeholder="Buscar por paciente, dentista ou observação..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-zinc-600 rounded-lg bg-white dark:bg-zinc-800 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                </div>
                <div className="relative">
                    <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                    <input
                        type="date"
                        value={selectedDate}
                        onChange={(e) => setSelectedDate(e.target.value)}
                        className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-zinc-600 rounded-lg bg-white dark:bg-zinc-800 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                </div>
            </div>

            {/* Lista de Agendamentos */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Agendamentos do Dia */}
                <div className="bg-white dark:bg-zinc-800 rounded-xl shadow-lg border border-gray-100 dark:border-zinc-700 p-6">
                    <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                        <Clock className="h-5 w-5 text-blue-600" />
                        Agendamentos do dia
                    </h3>
                    <div className="space-y-4">
                        {todayAppointments.length === 0 ? (
                            <p className="text-sm text-gray-600 dark:text-gray-400">Nenhum agendamento para hoje.</p>
                        ) : (
                            todayAppointments.map((appointment) => (
                                <div key={appointment.id} className="p-4 border border-gray-200 dark:border-zinc-600 rounded-lg hover:bg-gray-50 dark:hover:bg-zinc-700 transition">
                                    <div className="flex justify-between items-start mb-2">
                                        <div>
                                            <p className="font-medium text-gray-900 dark:text-white">{appointment.patient}</p>
                                            <p className="text-sm text-gray-600 dark:text-gray-400">{appointment.notes}</p>
                                            <p className="text-xs text-gray-500 dark:text-gray-400">{appointment.dentist}</p>
                                        </div>
                                        <span className={`px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(appointment.status)}`}>
                                            {appointment.status.toLowerCase()}
                                        </span>
                                    </div>
                                    <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                                        <Clock className="h-4 w-4" />
                                        {appointment.time}
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                </div>

                {/* Todos os Agendamentos */}
                <div className="bg-white dark:bg-zinc-800 rounded-xl shadow-lg border border-gray-100 dark:border-zinc-700 p-6">
                    <h3 className="text-lg font-semibold mb-4">Todos os Agendamentos</h3>
                    <div className="space-y-4">
                        {filteredAppointments.length === 0 ? (
                            <p className="text-sm text-gray-600 dark:text-gray-400">Nenhum agendamento encontrado.</p>
                        ) : (
                            filteredAppointments.map((appointment) => (
                                <div key={appointment.id} className="p-4 border border-gray-200 dark:border-zinc-600 rounded-lg hover:bg-gray-50 dark:hover:bg-zinc-700 transition">
                                    <div className="flex justify-between items-start mb-2">
                                        <div>
                                            <p className="font-medium text-gray-900 dark:text-white">{appointment.patient}</p>
                                            <p className="text-sm text-gray-600 dark:text-gray-400">{appointment.notes}</p>
                                            <p className="text-xs text-gray-500 dark:text-gray-400">{appointment.dentist}</p>
                                        </div>
                                        <span className={`px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(appointment.status)}`}>
                                            {appointment.status.toLowerCase()}
                                        </span>
                                    </div>
                                    <div className="flex justify-between items-center text-sm text-gray-600 dark:text-gray-400">
                                        <div className="flex items-center gap-2">
                                            <Calendar className="h-4 w-4" />
                                            {new Date(appointment.date).toLocaleDateString("pt-BR")}
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <Clock className="h-4 w-4" />
                                            {appointment.time}
                                        </div>
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