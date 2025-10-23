"use client"

import { useEffect, useMemo, useState } from "react"
import { Plus, Search, Users, Loader2, Trash2 } from "lucide-react"
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
import {
  criarPaciente,
  listarPacientes,
  removerPaciente,
  PacienteRequest,
  PacienteResponse,
} from "@/lib/api"

interface PacienteFormState {
  nome: string
  cpf: string
  telefone: string
  email: string
  dataNascimento: string
}

const initialFormState: PacienteFormState = {
  nome: "",
  cpf: "",
  telefone: "",
  email: "",
  dataNascimento: "",
}

export default function PacientePage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [pacientes, setPacientes] = useState<PacienteResponse[]>([])
  const [loading, setLoading] = useState(true)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [formState, setFormState] = useState(initialFormState)
  const [isSaving, setIsSaving] = useState(false)
  const [deletingId, setDeletingId] = useState<number | null>(null)

  useEffect(() => {
    const loadPacientes = async () => {
      try {
        setLoading(true)
        const data = await listarPacientes()
        setPacientes(data)
      } catch (error) {
        console.error(error)
        toast.error((error as Error).message || "Não foi possível carregar os pacientes")
      } finally {
        setLoading(false)
      }
    }

    loadPacientes()
  }, [])

  const filteredPacientes = useMemo(() => {
    if (!searchTerm) return pacientes

    const term = searchTerm.toLowerCase()
    return pacientes.filter((paciente) =>
      [paciente.nome, paciente.email, paciente.cpf]
        .filter(Boolean)
        .some((field) => field!.toLowerCase().includes(term))
    )
  }, [pacientes, searchTerm])

  const handleInputChange = (field: keyof PacienteFormState, value: string) => {
    setFormState((prev) => ({ ...prev, [field]: value }))
  }

  const handleCreatePaciente = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()

    if (!formState.nome.trim()) {
      toast.error("Informe o nome do paciente")
      return
    }

    setIsSaving(true)

    try {
      const payload: PacienteRequest = {
        nome: formState.nome.trim(),
        cpf: formState.cpf.trim() || undefined,
        telefone: formState.telefone.trim() || undefined,
        email: formState.email.trim() || undefined,
        dataNascimento: formState.dataNascimento || undefined,
      }

      const created = await criarPaciente(payload)
      setPacientes((prev) => [...prev, created])
      toast.success("Paciente cadastrado com sucesso")
      setFormState(initialFormState)
      setIsDialogOpen(false)
    } catch (error) {
      console.error(error)
      toast.error((error as Error).message || "Não foi possível cadastrar o paciente")
    } finally {
      setIsSaving(false)
    }
  }

  const handleDeletePaciente = async (id: number) => {
    setDeletingId(id)
    try {
      await removerPaciente(id)
      setPacientes((prev) => prev.filter((paciente) => paciente.id !== id))
      toast.success("Paciente removido")
    } catch (error) {
      console.error(error)
      toast.error((error as Error).message || "Não foi possível remover o paciente")
    } finally {
      setDeletingId(null)
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Pacientes</h1>
          <p className="text-gray-600 dark:text-gray-400">Gerencie o cadastro de pacientes</p>
        </div>

        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button className="bg-blue-600 hover:bg-blue-700">
              <Plus className="h-4 w-4" />
              Novo Paciente
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Novo paciente</DialogTitle>
              <DialogDescription>
                Preencha os campos abaixo para cadastrar um novo paciente.
              </DialogDescription>
            </DialogHeader>

            <form onSubmit={handleCreatePaciente} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="nome">Nome completo *</Label>
                <Input
                  id="nome"
                  value={formState.nome}
                  onChange={(event) => handleInputChange("nome", event.target.value)}
                  placeholder="Ex.: Maria Oliveira"
                  required
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="cpf">CPF</Label>
                  <Input
                    id="cpf"
                    value={formState.cpf}
                    onChange={(event) => handleInputChange("cpf", event.target.value)}
                    placeholder="000.000.000-00"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="dataNascimento">Data de nascimento</Label>
                  <Input
                    id="dataNascimento"
                    type="date"
                    value={formState.dataNascimento}
                    onChange={(event) => handleInputChange("dataNascimento", event.target.value)}
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="telefone">Telefone</Label>
                  <Input
                    id="telefone"
                    value={formState.telefone}
                    onChange={(event) => handleInputChange("telefone", event.target.value)}
                    placeholder="(00) 00000-0000"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">E-mail</Label>
                  <Input
                    id="email"
                    type="email"
                    value={formState.email}
                    onChange={(event) => handleInputChange("email", event.target.value)}
                    placeholder="nome@email.com"
                  />
                </div>
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

      <div className="flex gap-4">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 h-4 w-4" />
          <Input
            type="text"
            placeholder="Buscar por nome, e-mail ou CPF"
            value={searchTerm}
            onChange={(event) => setSearchTerm(event.target.value)}
            className="pl-10"
          />
        </div>
        <div className="hidden md:flex items-center gap-2 px-4 py-2 border border-gray-300 dark:border-zinc-600 rounded-lg text-sm text-gray-500 dark:text-gray-300">
          <Users className="h-4 w-4" />
          {pacientes.length} pacientes
        </div>
      </div>

      <div className="bg-white dark:bg-zinc-800 rounded-xl shadow-lg border border-gray-100 dark:border-zinc-700 overflow-hidden">
        {loading ? (
          <div className="flex items-center justify-center py-16 text-gray-500 dark:text-gray-400">
            <Loader2 className="h-5 w-5 animate-spin mr-2" />
            Carregando pacientes...
          </div>
        ) : filteredPacientes.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 text-center space-y-2 text-gray-500 dark:text-gray-400">
            <Users className="h-10 w-10" />
            <p className="text-lg font-semibold">Nenhum paciente encontrado</p>
            <p className="text-sm">
              Cadastre um novo paciente ou ajuste os filtros de busca.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 dark:bg-zinc-700">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Paciente
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    CPF
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Contato
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Ações
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 dark:divide-zinc-600">
                {filteredPacientes.map((paciente) => (
                  <tr key={paciente.id} className="hover:bg-gray-50 dark:hover:bg-zinc-700 transition">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center text-blue-600 dark:text-blue-300 font-semibold">
                          {paciente.nome.charAt(0)}
                        </div>
                        <div>
                          <p className="text-sm font-medium text-gray-900 dark:text-white">{paciente.nome}</p>
                          <p className="text-sm text-gray-500 dark:text-gray-400">{paciente.email || "Sem e-mail"}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                      {paciente.cpf || "—"}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                      {paciente.telefone || "—"}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm">
                      <Button
                        variant="ghost"
                        size="sm"
                        className="text-red-500 hover:text-red-600"
                        onClick={() => handleDeletePaciente(paciente.id)}
                        disabled={deletingId === paciente.id}
                      >
                        {deletingId === paciente.id ? (
                          <Loader2 className="h-4 w-4 animate-spin" />
                        ) : (
                          <>
                            <Trash2 className="h-4 w-4" />
                            Remover
                          </>
                        )}
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  )
}
