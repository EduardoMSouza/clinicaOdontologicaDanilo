"use client"

import { useEffect, useMemo, useState } from "react"
import { Search, Plus, Filter, MoreVertical } from "lucide-react"
import { getPacientes, type PacienteDTO } from "@/lib/api"

export default function PacientePage() {
    const [searchTerm, setSearchTerm] = useState("")
    const [pacientes, setPacientes] = useState<PacienteDTO[]>([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)

    useEffect(() => {
        let active = true

        async function loadPacientes() {
            try {
                setLoading(true)
                const response = await getPacientes()
                if (!active) return
                setPacientes(response)
                setError(null)
            } catch (err) {
                if (!active) return
                const message = err instanceof Error ? err.message : "Não foi possível carregar os pacientes"
                setError(message)
            } finally {
                if (active) setLoading(false)
            }
        }

        loadPacientes()

        return () => {
            active = false
        }
    }, [])

    const filteredPacientes = useMemo(() => {
        const term = searchTerm.trim().toLowerCase()
        if (!term) return pacientes

        return pacientes.filter((paciente) => {
            const nome = paciente.nome?.toLowerCase() ?? ""
            const email = paciente.email?.toLowerCase() ?? ""
            const cpf = paciente.cpf?.toLowerCase() ?? ""
            return nome.includes(term) || email.includes(term) || cpf.includes(term)
        })
    }, [pacientes, searchTerm])

    if (loading) {
        return (
            <div className="flex items-center justify-center h-full min-h-[60vh]">
                <p className="text-gray-600 dark:text-gray-300">Carregando lista de pacientes...</p>
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
                    <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Pacientes</h1>
                    <p className="text-gray-600 dark:text-gray-400">Gerencie o cadastro de pacientes</p>
                </div>
                <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition flex items-center gap-2">
                    <Plus className="h-4 w-4" />
                    Novo Paciente
                </button>
            </div>

            {/* Barra de Pesquisa e Filtros */}
            <div className="flex gap-4">
                <div className="flex-1 relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                    <input
                        type="text"
                        placeholder="Buscar pacientes por nome, CPF ou e-mail..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-zinc-600 rounded-lg bg-white dark:bg-zinc-800 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                </div>
                <button className="px-4 py-2 border border-gray-300 dark:border-zinc-600 rounded-lg hover:bg-gray-50 dark:hover:bg-zinc-700 transition flex items-center gap-2">
                    <Filter className="h-4 w-4" />
                    Filtros
                </button>
            </div>

            {/* Tabela de Pacientes */}
            <div className="bg-white dark:bg-zinc-800 rounded-xl shadow-lg border border-gray-100 dark:border-zinc-700 overflow-hidden">
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
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                                Situação
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                                Ações
                            </th>
                        </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200 dark:divide-zinc-600">
                        {filteredPacientes.length === 0 ? (
                            <tr>
                                <td colSpan={5} className="px-6 py-6 text-center text-sm text-gray-500 dark:text-gray-400">
                                    Nenhum paciente encontrado com os critérios informados.
                                </td>
                            </tr>
                        ) : (
                            filteredPacientes.map((paciente) => (
                                <tr key={paciente.id} className="hover:bg-gray-50 dark:hover:bg-zinc-700 transition">
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="flex items-center">
                                            <div className="w-8 h-8 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center text-blue-600 dark:text-blue-400 font-medium text-sm">
                                                {paciente.nome?.charAt(0) ?? "?"}
                                            </div>
                                            <div className="ml-4">
                                                <div className="text-sm font-medium text-gray-900 dark:text-white">
                                                    {paciente.nome}
                                                </div>
                                                <div className="text-sm text-gray-500 dark:text-gray-400">
                                                    {paciente.email ?? "E-mail não informado"}
                                                </div>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="text-sm text-gray-900 dark:text-white">{paciente.cpf ?? "---"}</div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="text-sm text-gray-900 dark:text-white">{paciente.telefone ?? "Telefone não informado"}</div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300">
                                            Ativo
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                                        <button className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition">
                                            <MoreVertical className="h-4 w-4" />
                                        </button>
                                    </td>
                                </tr>
                            ))
                        )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    )
}