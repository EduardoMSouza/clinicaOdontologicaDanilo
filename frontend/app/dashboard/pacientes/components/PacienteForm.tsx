"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { Loader2 } from "lucide-react"
import { toast } from "sonner"
import {
    createPaciente,
    updatePaciente,
    type CreatePacienteData,
    type Paciente,
} from "@/services/pacienteService"

interface PacienteFormProps {
    open: boolean
    onOpenChange: (open: boolean) => void
    paciente?: Paciente | null
    onSuccess?: () => void
}

export default function PacienteForm({
                                         open,
                                         onOpenChange,
                                         paciente,
                                         onSuccess
                                     }: PacienteFormProps) {
    const [submitting, setSubmitting] = useState(false)

    const [formData, setFormData] = useState<CreatePacienteData>({
        nome: "",
        cpf: "",
        dataNascimento: "",
        telefone: "",
        email: "",
        endereco: "",
        cidade: "",
        estado: "",
        convenio: "",
        numeroConvenio: "",
        observacoes: "",
        status: "ativo",
    })

    // Preencher formulário quando editar paciente
    useEffect(() => {
        if (paciente && open) {
            setFormData({
                nome: paciente.nome || "",
                cpf: paciente.cpf || "",
                dataNascimento: paciente.dataNascimento || "",
                telefone: paciente.telefone || "",
                email: paciente.email || "",
                endereco: paciente.endereco || "",
                cidade: paciente.cidade || "",
                estado: paciente.estado || "",
                convenio: paciente.convenio || "",
                numeroConvenio: paciente.numeroConvenio || "",
                observacoes: paciente.observacoes || "",
                status: paciente.status || "ativo",
            })
        } else if (!open) {
            // Resetar formulário quando fechar
            resetForm()
        }
    }, [paciente, open])

    const resetForm = () => {
        setFormData({
            nome: "",
            cpf: "",
            dataNascimento: "",
            telefone: "",
            email: "",
            endereco: "",
            cidade: "",
            estado: "",
            convenio: "",
            numeroConvenio: "",
            observacoes: "",
            status: "ativo",
        })
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()

        if (!formData.nome.trim()) {
            toast.error("O nome é obrigatório")
            return
        }

        setSubmitting(true)
        try {
            if (paciente) {
                await updatePaciente(paciente.id, formData)
                toast.success("Paciente atualizado com sucesso!")
            } else {
                await createPaciente(formData)
                toast.success("Paciente cadastrado com sucesso!")
            }

            onOpenChange(false)
            resetForm()
            onSuccess?.()
        } catch (error: any) {
            console.error("Erro ao salvar paciente:", error)
            const msg = error.response?.data?.message || "Erro ao salvar paciente"
            toast.error(msg)
        } finally {
            setSubmitting(false)
        }
    }

    const handleClose = () => {
        onOpenChange(false)
        resetForm()
    }

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle>
                        {paciente ? "Editar Paciente" : "Novo Paciente"}
                    </DialogTitle>
                    <DialogDescription>
                        {paciente
                            ? "Atualize as informações do paciente"
                            : "Preencha os dados para cadastrar um novo paciente"}
                    </DialogDescription>
                </DialogHeader>

                <form onSubmit={handleSubmit} className="space-y-4 mt-4">
                    {/* Nome */}
                    <div className="space-y-2">
                        <Label htmlFor="nome">Nome Completo *</Label>
                        <Input
                            id="nome"
                            value={formData.nome}
                            onChange={(e) => setFormData({ ...formData, nome: e.target.value })}
                            placeholder="Digite o nome completo"
                            required
                        />
                    </div>

                    {/* CPF e Data de Nascimento */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="cpf">CPF</Label>
                            <Input
                                id="cpf"
                                value={formData.cpf}
                                onChange={(e) => setFormData({ ...formData, cpf: e.target.value })}
                                placeholder="000.000.000-00"
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="dataNascimento">Data de Nascimento</Label>
                            <Input
                                id="dataNascimento"
                                type="date"
                                value={formData.dataNascimento}
                                onChange={(e) => setFormData({ ...formData, dataNascimento: e.target.value })}
                            />
                        </div>
                    </div>

                    {/* Telefone e Email */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="telefone">Telefone</Label>
                            <Input
                                id="telefone"
                                value={formData.telefone}
                                onChange={(e) => setFormData({ ...formData, telefone: e.target.value })}
                                placeholder="(00) 00000-0000"
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="email">Email</Label>
                            <Input
                                id="email"
                                type="email"
                                value={formData.email}
                                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                placeholder="paciente@email.com"
                            />
                        </div>
                    </div>

                    {/* Endereço */}
                    <div className="space-y-2">
                        <Label htmlFor="endereco">Endereço</Label>
                        <Input
                            id="endereco"
                            value={formData.endereco}
                            onChange={(e) => setFormData({ ...formData, endereco: e.target.value })}
                            placeholder="Rua, número, bairro"
                        />
                    </div>

                    {/* Cidade, Estado e Status */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="cidade">Cidade</Label>
                            <Input
                                id="cidade"
                                value={formData.cidade}
                                onChange={(e) => setFormData({ ...formData, cidade: e.target.value })}
                                placeholder="Cidade"
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="estado">Estado</Label>
                            <Input
                                id="estado"
                                value={formData.estado}
                                onChange={(e) => setFormData({ ...formData, estado: e.target.value })}
                                placeholder="UF"
                                maxLength={2}
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="status">Status</Label>
                            <Select
                                value={formData.status}
                                onValueChange={(v: "ativo" | "inativo") =>
                                    setFormData({ ...formData, status: v })
                                }
                            >
                                <SelectTrigger>
                                    <SelectValue placeholder="Selecione o status" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="ativo">Ativo</SelectItem>
                                    <SelectItem value="inativo">Inativo</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                    </div>

                    {/* Convênio e Número */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="convenio">Convênio</Label>
                            <Input
                                id="convenio"
                                value={formData.convenio}
                                onChange={(e) => setFormData({ ...formData, convenio: e.target.value })}
                                placeholder="Nome do convênio"
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="numeroConvenio">Número do Convênio</Label>
                            <Input
                                id="numeroConvenio"
                                value={formData.numeroConvenio}
                                onChange={(e) => setFormData({ ...formData, numeroConvenio: e.target.value })}
                                placeholder="Número da carteirinha"
                            />
                        </div>
                    </div>

                    {/* Observações */}
                    <div className="space-y-2">
                        <Label htmlFor="observacoes">Observações</Label>
                        <Textarea
                            id="observacoes"
                            value={formData.observacoes}
                            onChange={(e) => setFormData({ ...formData, observacoes: e.target.value })}
                            placeholder="Informações adicionais sobre o paciente"
                            rows={3}
                        />
                    </div>

                    {/* Botões */}
                    <div className="flex gap-3 pt-4">
                        <Button
                            type="button"
                            variant="outline"
                            className="flex-1"
                            onClick={handleClose}
                            disabled={submitting}
                        >
                            Cancelar
                        </Button>
                        <Button type="submit" className="flex-1" disabled={submitting}>
                            {submitting ? (
                                <>
                                    <Loader2 className="h-4 w-4 animate-spin mr-2" />
                                    Salvando...
                                </>
                            ) : paciente ? (
                                "Salvar Alterações"
                            ) : (
                                "Cadastrar Paciente"
                            )}
                        </Button>
                    </div>
                </form>
            </DialogContent>
        </Dialog>
    )
}