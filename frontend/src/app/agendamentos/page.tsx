"use client"
import { useEffect } from "react"
import { useAgendamentos } from "@/store/useAgendamentos"
import { useDentistas } from "@/store/useDentistas"
import { usePacientes } from "@/store/usePacientes"

export default function AgendamentosPage() {
    const { items, fetch, create, remove } = useAgendamentos()
    const dentistas = useDentistas()
    const pacientes = usePacientes()

    useEffect(() => { fetch(); dentistas.fetch(); pacientes.fetch(); }, [])

    function handleCreate(form: FormData) {
        const v = Object.fromEntries(form) as any
        create({
            pacienteId: v.pacienteId,
            dentistaId: v.dentistaId,
            data: v.data,
            horaInicio: v.horaInicio,
            horaFim: v.horaFim,
            motivo: v.motivo,
            status: "PENDENTE",
            id: 0 as any,
        })
    }

    return (
        <div className="space-y-4">
            <h1 className="text-xl font-semibold">Agendamentos</h1>

            <form action={handleCreate} className="bg-white p-4 rounded-2xl shadow grid md:grid-cols-5 gap-3">
                <select name="pacienteId" className="h-10 rounded-lg border px-3" required>
                    <option value="">Paciente</option>
                    {pacientes.items.map(p => <option key={p.id} value={p.id as any}>{p.nome}</option>)}
                </select>
                <select name="dentistaId" className="h-10 rounded-lg border px-3" required>
                    <option value="">Dentista</option>
                    {dentistas.items.map(d => <option key={d.id} value={d.id as any}>{d.nome}</option>)}
                </select>
                <input type="date" name="data" className="h-10 rounded-lg border px-3" required />
                <input type="time" name="horaInicio" className="h-10 rounded-lg border px-3" required />
                <input type="time" name="horaFim" className="h-10 rounded-lg border px-3" required />
                <input name="motivo" placeholder="Motivo" className="md:col-span-5 h-10 rounded-lg border px-3" />
                <div className="md:col-span-5 text-right">
                    <button className="h-10 px-4 rounded-xl bg-brand text-white">Criar</button>
                </div>
            </form>

            <div className="bg-white rounded-2xl shadow overflow-auto">
                <table className="w-full text-sm">
                    <thead className="bg-gray-50 text-gray-600">
                    <tr>
                        <th className="text-left p-3">Data</th>
                        <th className="text-left p-3">Início</th>
                        <th className="text-left p-3">Fim</th>
                        <th className="text-left p-3">Paciente</th>
                        <th className="text-left p-3">Dentista</th>
                        <th className="p-3">Ações</th>
                    </tr>
                    </thead>
                    <tbody>
                    {items.map((a) => (
                        <tr key={a.id} className="border-t">
                            <td className="p-3">{a.data}</td>
                            <td className="p-3">{a.horaInicio}</td>
                            <td className="p-3">{a.horaFim}</td>
                            <td className="p-3">{pacientes.items.find(p=>p.id===a.pacienteId)?.nome ?? "-"}</td>
                            <td className="p-3">{dentistas.items.find(d=>d.id===a.dentistaId)?.nome ?? "-"}</td>
                            <td className="p-3 text-right">
                                <button className="px-3 py-1 rounded-lg bg-red-100 text-red-700" onClick={() => remove(a.id)}>Excluir</button>
                            </td>
                        </tr>
                    ))}
                    </tbody>
                </table>
            </div>
        </div>
    )
}