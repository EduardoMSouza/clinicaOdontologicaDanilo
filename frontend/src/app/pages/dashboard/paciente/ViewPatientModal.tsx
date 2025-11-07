// paciente/ViewPatientModal.tsx
"use client"

import { motion } from "framer-motion"
import { X, User, Phone, Mail, Calendar, MapPin, AlertTriangle, Edit } from "lucide-react"
import { Button } from "@/components/ui/button"

interface Patient {
    id: string
    name: string
    email: string
    phone: string
    birthDate: string
    address: string
    emergencyContact: string
    medicalHistory: string
    createdAt: string
}

interface ViewPatientModalProps {
    patient: Patient
    onClose: () => void
    onEdit: () => void
}

export default function ViewPatientModal({ patient, onClose, onEdit }: ViewPatientModalProps) {
    const calculateAge = (birthDate: string) => {
        const today = new Date()
        const birth = new Date(birthDate)
        let age = today.getFullYear() - birth.getFullYear()
        const monthDiff = today.getMonth() - birth.getMonth()

        if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
            age--
        }

        return age
    }

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50 view-patient-modal"
        >
            <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className="bg-white rounded-2xl shadow-custom-medium w-full max-w-2xl max-h-[90vh] overflow-hidden"
            >
                {/* Cabeçalho */}
                <div className="flex items-center justify-between p-6 border-b border-gray-200">
                    <div className="flex items-center gap-3">
                        <div className="w-12 h-12 header-icon-bg rounded-xl flex items-center justify-center">
                            <User className="w-6 h-6 text-white" />
                        </div>
                        <div>
                            <h2 className="text-xl font-bold text-gray-800">{patient.name}</h2>
                            <p className="text-sm text-gray-500">
                                Paciente desde {new Date(patient.createdAt).toLocaleDateString('pt-BR')}
                            </p>
                        </div>
                    </div>
                    <div className="flex items-center gap-2">
                        <Button
                            variant="outline"
                            onClick={onEdit}
                            className="flex items-center gap-2 px-4 py-2 text-primary-600 border-primary-200 hover:bg-primary-50 transition-colors duration-200"
                        >
                            <Edit className="w-4 h-4" />
                            Editar
                        </Button>
                        <Button
                            variant="ghost"
                            size="icon"
                            onClick={onClose}
                            className="rounded-xl hover:bg-gray-100 transition-colors duration-200"
                        >
                            <X className="w-5 h-5 text-gray-500" />
                        </Button>
                    </div>
                </div>

                {/* Conteúdo */}
                <div className="p-6 overflow-y-auto max-h-[60vh]">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* Informações Pessoais */}
                        <div className="space-y-4">
                            <h3 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
                                <User className="w-5 h-5 section-icon-blue" />
                                Informações Pessoais
                            </h3>

                            <div className="space-y-3">
                                <div>
                                    <p className="text-sm text-gray-500">Idade</p>
                                    <p className="font-medium text-gray-800">
                                        {calculateAge(patient.birthDate)} anos
                                    </p>
                                </div>
                                <div>
                                    <p className="text-sm text-gray-500">Data de Nascimento</p>
                                    <p className="font-medium text-gray-800">
                                        {new Date(patient.birthDate).toLocaleDateString('pt-BR')}
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* Contato */}
                        <div className="space-y-4">
                            <h3 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
                                <Phone className="w-5 h-5 section-icon-green" />
                                Contato
                            </h3>

                            <div className="space-y-3">
                                <div className="flex items-center gap-3">
                                    <Mail className="w-4 h-4 text-gray-400" />
                                    <div>
                                        <p className="text-sm text-gray-500">Email</p>
                                        <p className="font-medium text-gray-800">{patient.email}</p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-3">
                                    <Phone className="w-4 h-4 text-gray-400" />
                                    <div>
                                        <p className="text-sm text-gray-500">Telefone</p>
                                        <p className="font-medium text-gray-800">{patient.phone}</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Endereço */}
                        {patient.address && (
                            <div className="md:col-span-2 space-y-4">
                                <h3 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
                                    <MapPin className="w-5 h-5 section-icon-purple" />
                                    Endereço
                                </h3>
                                <p className="text-gray-800">{patient.address}</p>
                            </div>
                        )}

                        {/* Contato de Emergência */}
                        {patient.emergencyContact && (
                            <div className="md:col-span-2 space-y-4">
                                <h3 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
                                    <AlertTriangle className="w-5 h-5 section-icon-orange" />
                                    Contato de Emergência
                                </h3>
                                <p className="text-gray-800">{patient.emergencyContact}</p>
                            </div>
                        )}

                        {/* Histórico Médico */}
                        {patient.medicalHistory && (
                            <div className="md:col-span-2 space-y-4">
                                <h3 className="text-lg font-semibold text-gray-800">Histórico Médico</h3>
                                <div className="medical-history-box">
                                    <p className="text-gray-800 whitespace-pre-wrap">{patient.medicalHistory}</p>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </motion.div>
        </motion.div>
    )
}