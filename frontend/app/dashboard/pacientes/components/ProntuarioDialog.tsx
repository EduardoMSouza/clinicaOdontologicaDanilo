"use client"

import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { FileText, Calendar, Mail, Phone, MapPin, User } from "lucide-react"
import type { Paciente } from "@/services/pacienteService"

interface ProntuarioDialogProps {
    paciente: Paciente | null
    open: boolean
    onOpenChange: (open: boolean) => void
}

export default function ProntuarioDialog({ paciente, open, onOpenChange }: ProntuarioDialogProps) {
    if (!paciente) return null

    const formatDate = (dateString: string) => {
        if (!dateString || dateString === "N/A") return "Não informado"
        const date = new Date(dateString)
        if (isNaN(date.getTime())) return "Não informado"
        return date.toLocaleDateString("pt-BR")
    }

    const formatCPF = (cpf: string) => {
        if (!cpf || cpf === "Não informado") return "Não informado"
        return cpf.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, "$1.$2.$3-$4")
    }

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
                <DialogHeader className="space-y-3">
                    <div className="flex items-center gap-3">
                        <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
                            <User className="h-6 w-6 text-primary" />
                        </div>
                        <div>
                            <DialogTitle className="text-2xl font-bold">{paciente.nome}</DialogTitle>
                            <DialogDescription className="text-base">
                                Prontuário médico completo
                            </DialogDescription>
                        </div>
                    </div>
                </DialogHeader>

                <div className="space-y-6">
                    {/* Dados Pessoais */}
                    <section className="space-y-4">
                        <h3 className="text-lg font-semibold flex items-center gap-2">
                            <FileText className="h-5 w-5" />
                            Dados Pessoais
                        </h3>
                        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                            <div className="space-y-1">
                                <p className="text-sm text-muted-foreground">CPF</p>
                                <p className="font-medium">{formatCPF(paciente.cpf || "Não informado")}</p>
                            </div>
                            <div className="space-y-1">
                                <p className="text-sm text-muted-foreground">Data de Nascimento</p>
                                <p className="font-medium">{formatDate(paciente.dataNascimento)}</p>
                            </div>
                            <div className="space-y-1">
                                <p className="text-sm text-muted-foreground">Sexo</p>
                                <p className="font-medium">{paciente.sexo || "Não informado"}</p>
                            </div>
                            <div className="space-y-1">
                                <p className="text-sm text-muted-foreground">Estado Civil</p>
                                <p className="font-medium">{paciente.estadoCivil || "Não informado"}</p>
                            </div>
                            <div className="space-y-1">
                                <p className="text-sm text-muted-foreground">Profissão</p>
                                <p className="font-medium">{paciente.profissao || "Não informado"}</p>
                            </div>
                        </div>
                    </section>

                    {/* Contato */}
                    <section className="space-y-4">
                        <h3 className="text-lg font-semibold flex items-center gap-2">
                            <Phone className="h-5 w-5" />
                            Contato
                        </h3>
                        <div className="grid md:grid-cols-2 gap-4">
                            <div className="space-y-1">
                                <p className="text-sm text-muted-foreground">E-mail</p>
                                <div className="flex items-center gap-2">
                                    <Mail className="h-4 w-4 text-muted-foreground" />
                                    <p className="font-medium">{paciente.email || "Não informado"}</p>
                                </div>
                            </div>
                            <div className="space-y-1">
                                <p className="text-sm text-muted-foreground">Telefone</p>
                                <div className="flex items-center gap-2">
                                    <Phone className="h-4 w-4 text-muted-foreground" />
                                    <p className="font-medium">{paciente.telefone || "Não informado"}</p>
                                </div>
                            </div>
                            <div className="md:col-span-2 space-y-1">
                                <p className="text-sm text-muted-foreground">Endereço</p>
                                <div className="flex items-center gap-2">
                                    <MapPin className="h-4 w-4 text-muted-foreground" />
                                    <p className="font-medium">{paciente.enderecoResidencial || "Não informado"}</p>
                                </div>
                            </div>
                        </div>
                    </section>

                    {/* Convênio */}
                    {paciente.convenio && (
                        <section className="space-y-4">
                            <h3 className="text-lg font-semibold">Convênio</h3>
                            <div className="grid md:grid-cols-2 gap-4">
                                <div className="space-y-1">
                                    <p className="text-sm text-muted-foreground">Convênio</p>
                                    <Badge variant="secondary" className="font-medium">
                                        {paciente.convenio}
                                    </Badge>
                                </div>
                                {paciente.numeroInscricaoConvenio && (
                                    <div className="space-y-1">
                                        <p className="text-sm text-muted-foreground">Número de Inscrição</p>
                                        <p className="font-medium">{paciente.numeroInscricaoConvenio}</p>
                                    </div>
                                )}
                            </div>
                        </section>
                    )}

                    {/* Anamnese */}
                    <section className="space-y-4">
                        <h3 className="text-lg font-semibold">Anamnese</h3>
                        {paciente.queixaPrincipal && (
                            <div className="space-y-1">
                                <p className="text-sm text-muted-foreground">Queixa Principal</p>
                                <p className="font-medium">{paciente.queixaPrincipal}</p>
                            </div>
                        )}
                        {paciente.habitos && (
                            <div className="space-y-1">
                                <p className="text-sm text-muted-foreground">Hábitos</p>
                                <p className="font-medium">{paciente.habitos}</p>
                            </div>
                        )}
                    </section>

                    {/* Data de Cadastro */}
                    <section className="space-y-4 pt-4 border-t">
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                            <Calendar className="h-4 w-4" />
                            <span>Cadastrado em: {formatDate(paciente.dataCadastro)}</span>
                        </div>
                    </section>
                </div>

                <div className="flex gap-3 pt-6 border-t">
                    <Button
                        variant="outline"
                        onClick={() => onOpenChange(false)}
                        className="flex-1"
                    >
                        Fechar
                    </Button>
                    <Button className="flex-1 gap-2">
                        <FileText className="h-4 w-4" />
                        Imprimir Prontuário
                    </Button>
                </div>
            </DialogContent>
        </Dialog>
    )
}