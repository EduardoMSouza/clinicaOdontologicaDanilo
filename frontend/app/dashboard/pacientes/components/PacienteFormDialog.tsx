"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import { Plus, Edit } from "lucide-react"
import PacienteForm from "./PacienteForm"
import type { Paciente } from "@/services/pacienteService"

interface PacienteFormDialogProps {
    paciente?: Paciente | null
    onSuccess?: () => void
    trigger?: React.ReactNode
}

export default function PacienteFormDialog({
                                               paciente,
                                               onSuccess,
                                               trigger
                                           }: PacienteFormDialogProps) {
    const [isOpen, setIsOpen] = useState(false)
    const [submitting, setSubmitting] = useState(false)

    const handleSuccess = async () => {
        setIsOpen(false)
        onSuccess?.()
    }

    const handleSubmit = async () => {
        setSubmitting(false)
        handleSuccess()
    }

    const handleCancel = () => {
        setIsOpen(false)
    }

    return (
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogTrigger asChild>
                {trigger || (
                    <Button className="gap-2">
                        {paciente ? (
                            <>
                                <Edit className="h-4 w-4" />
                                Editar Paciente
                            </>
                        ) : (
                            <>
                                <Plus className="h-4 w-4" />
                                Novo Paciente
                            </>
                        )}
                    </Button>
                )}
            </DialogTrigger>

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

                <PacienteForm
                    paciente={paciente}
                    onSuccess={handleSubmit}
                    onCancel={handleCancel}
                    submitting={submitting}
                />
            </DialogContent>
        </Dialog>
    )
}