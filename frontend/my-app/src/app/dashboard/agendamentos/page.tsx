"use client"

import { useEffect, useMemo, useState } from "react"
import { Calendar, Clock, Plus, Search, Loader2 } from "lucide-react"
import { toast } from "sonner"

import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  AgendaRequest,
  AgendaResponse,
  atualizarStatusAgendamento,
  criarAgendamento,
  listarAgendamentos,
  listarDentistas,
  listarPacientes,
  PacienteResponse,
  DentistaResponse,
} from "@/lib/api"

interface AgendamentoFormState {
  pacienteId: string
  dentistaId: string
  dataHora: string
  observacoes: string
}

const initialFormState: AgendamentoFormState = {
  pacienteId: "",
  dentistaId: "",
  dataHora: "",
  observacoes: "",
}

const STATUS_STYLES: Record<string, string> = {
  AGENDADO: "bg-blue-100 text-blue-800 dark:bg-blue-900/40 dark:text-blue-200",
  CONFIRMADO: "bg-green-100 text-green-800 dark:bg-green-900/40 dark:text-green-200",
  CONCLUIDO: "bg-emerald-100 text-emerald-800 dark:bg-emerald-900/40 dark:text-emerald-200",
  CANCELADO: "bg-red-100 text-red-800 dark:bg-red-900/40 dark:text-red-200",
}

const STATUS_LABELS: Record<string, string> = {
  AGENDADO: "Agendado",
  CONFIRMADO: "Confirmado",
  CONCLUIDO: "Concluído",
  CANCELADO: "Cancelado",
}

function formatDateTime(value: string) {
  const [datePart, timePart] = value.split("T")
  const [hours, minutes] = timePart?.split(":") ?? []
  const formattedDate = new Date(value).toLocaleDateString("pt-BR")
  return {
    date: formattedDate,
    time: `${hours ?? ""}:${minutes ?? ""}`,
    rawDate: datePart,
  }
}

function getTodayKey() {
  const today = new Date()
  const offset = today.getTimezoneOffset()
  const localDate = new Date(today.getTime() - offset * 60000)
  return localDate.toISOString().slice(0, 10)
}

export default function AgendamentosPage() {
  const [agendamentos, setAgendamentos] = useState<AgendaResponse[]>([])
  const [pacientes, setPacientes] = useState<PacienteResponse[]>([])
  const [dentistas, setDentistas] = useState<DentistaResponse[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedDate, setSelectedDate] = useState("")
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [formState, setFormState] = useState(initialFormState)
  const [isSaving, setIsSaving] = useState(false)
  const [updatingStatusId, setUpdatingStatusId] = useState<number | null>(null)

  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true)
        const [agendas, pacientesData, dentistasData] = await Promise.all([
          listarAgendamentos(),
          listarPacientes(),
          listarDentistas(),
        ])
        setAgendamentos(agendas)
        setPacientes(pacientesData)
        setDentistas(dentistasData)
      } catch (error) {
        console.error(error)
        toast.error((error as Error).message || "Não foi possível carregar os agendamentos")
      } finally {
        setLoading(false)
      }
    }

    loadData()
  }, [])

  const filteredAgendamentos = useMemo(() => {
    return agendamentos.filter((agendamento) => {
      const matchesSearch = searchTerm
        ? [agendamento.pacienteNome, agendamento.dentistaNome]
            .some((value) => value.toLowerCase().includes(searchTerm.toLowerCase()))
        : true

      const matchesDate = selectedDate
        ? agendamento.dataHora.startsWith(selectedDate)
        : true

      return matchesSearch && matchesDate
    })
  }, [agendamentos, searchTerm, selectedDate])

  const todayKey = getTodayKey()
  const agendamentosHoje = filteredAgendamentos.filter((item) => item.dataHora.startsWith(todayKey))

  const handleFormChange = (field: keyof AgendamentoFormState, value: string) => {
    setFormState((prev) => ({ ...prev, [field]: value }))
  }

  const handleCreateAgendamento = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()

    if (!formState.pacienteId || !formState.dentistaId || !formState.dataHora) {
      toast.error("Selecione paciente, dentista e data/hora")
      return
    }

    setIsSaving(true)

    try {
      const dataHoraNormalizada = formState.dataHora.length === 16
        ? `${formState.dataHora}:00`
        : formState.dataHora

      const payload: AgendaRequest = {
        pacienteId: Number(formState.pacienteId),
        dentistaId: Number(formState.dentistaId),
        dataHora: dataHoraNormalizada,
        observacoes: formState.observacoes.trim() || undefined,
      }

      const created = await criarAgendamento(payload)
      setAgendamentos((prev) =>
        [...prev, created].sort((a, b) => a.dataHora.localeCompare(b.dataHora))
      )
      toast.success("Agendamento criado com sucesso")
      setFormState(initialFormState)
      setIsDialogOpen(false)
    } catch (error) {
      console.error(error)
      toast.error((error as Error).message || "Não foi possível criar o agendamento")
    } finally {
      setIsSaving(false)
    }
  }

  const handleStatusChange = async (id: number, status: string) => {
    setUpdatingStatusId(id)
    try {
      const updated = await atualizarStatusAgendamento(id, status)
      setAgendamentos((prev) => prev.map((item) => (item.id === id ? updated : item)))
      toast.success("Status atualizado")
    } catch (error) {
      console.error(error)
      toast.error((error as Error).message || "Não foi possível atualizar o status")
    } finally {
      setUpdatingStatusId(null)
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Agendamentos</h1>
          <p className="text-gray-600 dark:text-gray-400">Gerencie consultas e horários</p>
        </div>

        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button className="bg-blue-600 hover:bg-blue-700">
              <Plus className="h-4 w-4" />
              Novo Agendamento
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Novo agendamento</DialogTitle>
              <DialogDescription>
                Preencha os dados abaixo para criar um novo agendamento.
              </DialogDescription>
            </DialogHeader>

            <form onSubmit={handleCreateAgendamento} className="space-y-4">
              <div className="space-y-2">
                <Label>Paciente *</Label>
                <Select
                  value={formState.pacienteId}
                  onValueChange={(value) => handleFormChange("pacienteId", value)}
                  disabled={pacientes.length === 0}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Selecione um paciente" />
                  </SelectTrigger>
                  <SelectContent>
                    {pacientes.map((paciente) => (
                      <SelectItem key={paciente.id} value={String(paciente.id)}>
                        {paciente.nome}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {pacientes.length === 0 && (
                  <p className="text-xs text-amber-600">Cadastre um paciente antes de agendar.</p>
                )}
              </div>

              <div className="space-y-2">
                <Label>Dentista *</Label>
                <Select
                  value={formState.dentistaId}
                  onValueChange={(value) => handleFormChange("dentistaId", value)}
                  disabled={dentistas.length === 0}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Selecione um dentista" />
                  </SelectTrigger>
                  <SelectContent>
                    {dentistas.map((dentista) => (
                      <SelectItem key={dentista.id} value={String(dentista.id)}>
                        {dentista.nome}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {dentistas.length === 0 && (
                  <p className="text-xs text-amber-600">Cadastre um dentista para liberar os agendamentos.</p>
                )}
              </div>

              <div className="space-y-2">
                <Label>Data e hora *</Label>
                <Input
                  type="datetime-local"
                  value={formState.dataHora}
                  onChange={(event) => handleFormChange("dataHora", event.target.value)}
                  required
                />
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  O agendamento será criado com status <strong>Agendado</strong>.
                </p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="observacoes">Observações</Label>
                <Textarea
                  id="observacoes"
                  value={formState.observacoes}
                  onChange={(event) => handleFormChange("observacoes", event.target.value)}
                  placeholder="Informações adicionais sobre o atendimento"
                />
              </div>

              <DialogFooter>
                <Button type="button" variant="ghost" onClick={() => setIsDialogOpen(false)}>
                  Cancelar
                </Button>
                <Button type="submit" disabled={isSaving}>
                  {isSaving ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" />
                      Salvando...
                    </>
                  ) : (
                    "Salvar"
                  )}
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="md:col-span-2 relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 h-4 w-4" />
          <Input
            type="text"
            placeholder="Buscar por paciente ou dentista"
            value={searchTerm}
            onChange={(event) => setSearchTerm(event.target.value)}
            className="pl-10"
          />
        </div>
        <div className="relative">
          <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 h-4 w-4" />
          <Input
            type="date"
            value={selectedDate}
            onChange={(event) => setSelectedDate(event.target.value)}
            className="pl-10"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white dark:bg-zinc-800 rounded-xl shadow-lg border border-gray-100 dark:border-zinc-700 p-6">
          <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
            <Clock className="h-5 w-5 text-blue-600" />
            Agendamentos de Hoje
          </h3>

          {loading ? (
            <div className="flex items-center justify-center py-10 text-gray-500 dark:text-gray-400">
              <Loader2 className="h-5 w-5 animate-spin mr-2" />
              Carregando agendamentos...
            </div>
          ) : agendamentosHoje.length === 0 ? (
            <p className="text-sm text-gray-500 dark:text-gray-400">Nenhum agendamento para hoje.</p>
          ) : (
            <div className="space-y-4">
              {agendamentosHoje.map((agendamento) => {
                const { time } = formatDateTime(agendamento.dataHora)
                return (
                  <div
                    key={agendamento.id}
                    className="p-4 border border-gray-200 dark:border-zinc-600 rounded-lg hover:bg-gray-50 dark:hover:bg-zinc-700 transition"
                  >
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <p className="font-medium text-gray-900 dark:text-white">{agendamento.pacienteNome}</p>
                        <p className="text-sm text-gray-600 dark:text-gray-400">{agendamento.dentistaNome}</p>
                      </div>
                      <span className={`px-2 py-1 text-xs font-semibold rounded-full ${STATUS_STYLES[agendamento.status] ?? "bg-gray-100 text-gray-800"}`}>
                        {STATUS_LABELS[agendamento.status] ?? agendamento.status}
                      </span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                      <Clock className="h-4 w-4" />
                      {time}
                    </div>
                  </div>
                )
              })}
            </div>
          )}
        </div>

        <div className="bg-white dark:bg-zinc-800 rounded-xl shadow-lg border border-gray-100 dark:border-zinc-700 p-6">
          <h3 className="text-lg font-semibold mb-4">Todos os Agendamentos</h3>

          {loading ? (
            <div className="flex items-center justify-center py-10 text-gray-500 dark:text-gray-400">
              <Loader2 className="h-5 w-5 animate-spin mr-2" />
              Carregando agendamentos...
            </div>
          ) : filteredAgendamentos.length === 0 ? (
            <p className="text-sm text-gray-500 dark:text-gray-400">Nenhum agendamento encontrado.</p>
          ) : (
            <div className="space-y-4">
              {filteredAgendamentos.map((agendamento) => {
                const { date, time } = formatDateTime(agendamento.dataHora)
                return (
                  <div
                    key={agendamento.id}
                    className="p-4 border border-gray-200 dark:border-zinc-600 rounded-lg hover:bg-gray-50 dark:hover:bg-zinc-700 transition"
                  >
                    <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-4">
                      <div className="space-y-1">
                        <p className="font-medium text-gray-900 dark:text-white">{agendamento.pacienteNome}</p>
                        <p className="text-sm text-gray-600 dark:text-gray-400">{agendamento.dentistaNome}</p>
                        {agendamento.observacoes && (
                          <p className="text-sm text-gray-500 dark:text-gray-400">{agendamento.observacoes}</p>
                        )}
                      </div>
                      <div className="flex flex-col gap-2">
                        <span className={`self-start px-2 py-1 text-xs font-semibold rounded-full ${STATUS_STYLES[agendamento.status] ?? "bg-gray-100 text-gray-800"}`}>
                          {STATUS_LABELS[agendamento.status] ?? agendamento.status}
                        </span>
                        <Select
                          value={agendamento.status}
                          onValueChange={(value) => handleStatusChange(agendamento.id, value)}
                          disabled={updatingStatusId === agendamento.id}
                        >
                          <SelectTrigger className="w-[180px]">
                            <SelectValue placeholder="Status" />
                          </SelectTrigger>
                          <SelectContent>
                            {Object.entries(STATUS_LABELS).map(([value, label]) => (
                              <SelectItem key={value} value={value}>
                                {label}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                    <div className="mt-4 flex flex-col sm:flex-row sm:items-center sm:justify-between text-sm text-gray-600 dark:text-gray-400 gap-2">
                      <div className="flex items-center gap-2">
                        <Calendar className="h-4 w-4" />
                        {date}
                      </div>
                      <div className="flex items-center gap-2">
                        <Clock className="h-4 w-4" />
                        {time}
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
