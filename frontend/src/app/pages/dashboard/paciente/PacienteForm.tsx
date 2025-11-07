// paciente/PatientForm.tsx
"use client"

import { motion } from "framer-motion"
import { X, User } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useState, useEffect } from "react"

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

interface PatientFormProps {
    patient?: Patient
    onSubmit: (data: Omit<Patient, 'id' | 'createdAt'>) => void
    onClose: () => void
}

export default function PatientForm({ patient, onSubmit, onClose }: PatientFormProps) {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        phone: '',
        birthDate: '',
        address: '',
        emergencyContact: '',
        medicalHistory: ''
    })

    useEffect(() => {
        if (patient) {
            setFormData({
                name: patient.name,
                email: patient.email,
                phone: patient.phone,
                birthDate: patient.birthDate,
                address: patient.address,
                emergencyContact: patient.emergencyContact,
                medicalHistory: patient.medicalHistory
            })
        }
    }, [patient])

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault()
        onSubmit(formData)
    }

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target
        setFormData(prev => ({ ...prev, [name]: value }))
    }

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50 patient-form-modal"
        >
            <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className="bg-white rounded-2xl shadow-custom-medium w-full max-w-2xl max-h-[90vh] overflow-hidden"
            >
                {/* Cabeçalho */}
                <div className="flex items-center justify-between p-6 border-b border-gray-200">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 header-icon-bg rounded-xl flex items-center justify-center">
                            <User className="w-5 h-5 text-white" />
                        </div>
                        <div>
                            <h2 className="text-xl font-bold text-gray-800">
                                {patient ? 'Editar Paciente' : 'Novo Paciente'}
                            </h2>
                            <p className="text-sm text-gray-500">
                                {patient ? 'Atualize os dados do paciente' : 'Preencha os dados do novo paciente'}
                            </p>
                        </div>
                    </div>
                    <Button
                        variant="ghost"
                        size="icon"
                        onClick={onClose}
                        className="rounded-xl hover:bg-gray-100 transition-colors duration-200"
                    >
                        <X className="w-5 h-5 text-gray-500" />
                    </Button>
                </div>

                {/* Formulário */}
                <form onSubmit={handleSubmit} className="p-6 overflow-y-auto max-h-[60vh]">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* Nome */}
                        <div className="md:col-span-2">
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Nome Completo *
                            </label>
                            <input
                                type="text"
                                name="name"
                                value={formData.name}
                                onChange={handleChange}
                                required
                                placeholder="Digite o nome completo"
                            />
                        </div>

                        {/* Email */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Email *
                            </label>
                            <input
                                type="email"
                                name="email"
                                value={formData.email}
                                onChange={handleChange}
                                required
                                placeholder="email@exemplo.com"
                            />
                        </div>

                        {/* Telefone */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Telefone *
                            </label>
                            <input
                                type="tel"
                                name="phone"
                                value={formData.phone}
                                onChange={handleChange}
                                required
                                placeholder="(11) 99999-9999"
                            />
                        </div>

                        {/* Data de Nascimento */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Data de Nascimento *
                            </label>
                            <input
                                type="date"
                                name="birthDate"
                                value={formData.birthDate}
                                onChange={handleChange}
                                required
                            />
                        </div>

                        {/* Contato de Emergência */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Contato de Emergência
                            </label>
                            <input
                                type="text"
                                name="emergencyContact"
                                value={formData.emergencyContact}
                                onChange={handleChange}
                                placeholder="Nome e telefone"
                            />
                        </div>

                        {/* Endereço */}
                        <div className="md:col-span-2">
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Endereço
                            </label>
                            <input
                                type="text"
                                name="address"
                                value={formData.address}
                                onChange={handleChange}
                                placeholder="Endereço completo"
                            />
                        </div>

                        {/* Histórico Médico */}
                        <div className="md:col-span-2">
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Histórico Médico
                            </label>
                            <textarea
                                name="medicalHistory"
                                value={formData.medicalHistory}
                                onChange={handleChange}
                                rows={4}
                                placeholder="Alergias, condições médicas, medicamentos em uso, etc."
                            />
                        </div>
                    </div>

                    {/* Ações */}
                    <div className="flex gap-3 justify-end pt-6 mt-6 border-t border-gray-200">
                        <Button
                            type="button"
                            variant="outline"
                            onClick={onClose}
                            className="px-6 border-gray-300 text-gray-700 hover:bg-gray-50 transition-colors duration-200"
                        >
                            Cancelar
                        </Button>
                        <Button
                            type="submit"
                            className="form-submit-button px-6 text-white shadow-md hover:shadow-lg transition-all duration-200"
                        >
                            {patient ? 'Atualizar' : 'Cadastrar'} Paciente
                        </Button>
                    </div>
                </form>
            </motion.div>
        </motion.div>
    )
}