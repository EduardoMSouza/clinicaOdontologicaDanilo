// paciente/page.tsx
"use client"

import { motion } from "framer-motion"
import { Users, UserPlus, Activity, Search, Edit, Trash2, Eye } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useState, useEffect } from "react"
import PatientForm from "./PacienteForm"
import ViewPatientModal from "@/app/paciente/ViewPatientModal";

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

export default function PacientePage(){
    const [patients, setPatients] = useState<Patient[]>([])
    const [searchTerm, setSearchTerm] = useState("")
    const [showForm, setShowForm] = useState(false)
    const [editingPatient, setEditingPatient] = useState<Patient | null>(null)
    const [viewingPatient, setViewingPatient] = useState<Patient | null>(null)

    // Carregar pacientes do localStorage
    useEffect(() => {
        const savedPatients = localStorage.getItem('odontoPro-patients')
        if (savedPatients) {
            setPatients(JSON.parse(savedPatients))
        }
    }, [])

    // Salvar pacientes no localStorage
    useEffect(() => {
        localStorage.setItem('odontoPro-patients', JSON.stringify(patients))
    }, [patients])

    const filteredPatients = patients.filter(patient =>
        patient.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        patient.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        patient.phone.includes(searchTerm)
    )

    const handleCreatePatient = (patientData: Omit<Patient, 'id' | 'createdAt'>) => {
        const newPatient: Patient = {
            ...patientData,
            id: Date.now().toString(),
            createdAt: new Date().toISOString()
        }
        setPatients(prev => [...prev, newPatient])
        setShowForm(false)
    }

    const handleUpdatePatient = (patientData: Omit<Patient, 'id' | 'createdAt'>) => {
        if (editingPatient) {
            setPatients(prev => prev.map(p =>
                p.id === editingPatient.id
                    ? { ...patientData, id: editingPatient.id, createdAt: editingPatient.createdAt }
                    : p
            ))
            setEditingPatient(null)
        }
    }

    const handleDeletePatient = (id: string) => {
        if (confirm('Tem certeza que deseja excluir este paciente?')) {
            setPatients(prev => prev.filter(p => p.id !== id))
        }
    }

    const handleEdit = (patient: Patient) => {
        setEditingPatient(patient)
        setShowForm(true)
    }

    const handleView = (patient: Patient) => {
        setViewingPatient(patient)
    }

    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.1
            }
        }
    }

    const itemVariants = {
        hidden: { y: 20, opacity: 0 },
        visible: {
            y: 0,
            opacity: 1
        }
    }

    return (
        <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="space-y-6 p-4 md:p-8 patient-page"
        >
            {/* Modal do Formulário */}
            {(showForm || editingPatient) && (
                <PatientForm
                    patient={editingPatient || undefined}
                    onSubmit={editingPatient ? handleUpdatePatient : handleCreatePatient}
                    onClose={() => {
                        setShowForm(false)
                        setEditingPatient(null)
                    }}
                />
            )}

            {/* Modal de Visualização */}
            {viewingPatient && (
                <ViewPatientModal
                    patient={viewingPatient}
                    onClose={() => setViewingPatient(null)}
                    onEdit={() => {
                        setEditingPatient(viewingPatient)
                        setViewingPatient(null)
                        setShowForm(true)
                    }}
                />
            )}

            {/* Cabeçalho */}
            <motion.div variants={itemVariants} className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl md:text-4xl font-extrabold page-title">
                        Pacientes
                    </h1>
                    <p className="text-gray-600 mt-2 text-base md:text-lg">
                        Gerencie seus pacientes e seus históricos médicos
                    </p>
                </div>
                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                    <Button
                        onClick={() => setShowForm(true)}
                        className="new-patient-button text-white px-6 py-3 rounded-xl text-lg flex items-center transition-all duration-300"
                    >
                        <UserPlus className="w-5 h-5 mr-2" />
                        Novo Paciente
                    </Button>
                </motion.div>
            </motion.div>

            {/* Estatísticas */}
            <motion.div variants={itemVariants} className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {[
                    { label: "Total de Pacientes", value: patients.length.toString(), icon: Users, colorClass: "stat-icon-blue" },
                    { label: "Novos Este Mês", value: patients.filter(p => {
                            const monthAgo = new Date()
                            monthAgo.setMonth(monthAgo.getMonth() - 1)
                            return new Date(p.createdAt) > monthAgo
                        }).length.toString(), icon: UserPlus, colorClass: "stat-icon-green" },
                    { label: "Em Tratamento", value: "0", icon: Activity, colorClass: "stat-icon-purple" }
                ].map((stat, index) => (
                    <motion.div
                        key={index}
                        variants={itemVariants}
                        className="stat-card"
                    >
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-gray-600 text-sm font-medium">{stat.label}</p>
                                <p className="text-2xl font-bold text-gray-800 mt-1">{stat.value}</p>
                            </div>
                            <div className={`p-3 rounded-xl ${stat.colorClass}`}>
                                <stat.icon className={`w-6 h-6`} />
                            </div>
                        </div>
                    </motion.div>
                ))}
            </motion.div>

            {/* Barra de Pesquisa */}
            <motion.div variants={itemVariants} className="search-bar-container">
                <div className="flex flex-col md:flex-row items-center gap-4 w-full">
                    <div className="flex-1 relative w-full">
                        <Search className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
                        <input
                            type="text"
                            placeholder="Buscar pacientes por nome, email ou telefone..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full pl-10 pr-4 py-3 search-input rounded-xl focus:outline-none focus:ring-2 transition-all duration-200"
                        />
                    </div>
                    <Button variant="outline" className="whitespace-nowrap w-full md:w-auto px-6 py-3 border-gray-300 text-gray-700 hover:bg-gray-50 transition-colors duration-200">
                        Filtros
                    </Button>
                </div>
            </motion.div>

            {/* Lista de Pacientes */}
            <motion.div variants={itemVariants} className="patient-list-card">
                <div className="p-6 border-b border-gray-200">
                    <h2 className="text-xl font-semibold text-gray-800">
                        Lista de Pacientes ({filteredPatients.length})
                    </h2>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead className="bg-gray-50/80">
                        <tr>
                            <th className="table-header-cell">Paciente</th>
                            <th className="table-header-cell">Contato</th>
                            <th className="table-header-cell hidden md:table-cell">Data Nasc.</th> {/* Ocultar em telas pequenas */}
                            <th className="table-header-cell hidden lg:table-cell">Cadastro</th> {/* Ocultar em telas médias/pequenas */}
                            <th className="table-header-cell text-right">Ações</th>
                        </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200">
                        {filteredPatients.map((patient) => (
                            <motion.tr
                                key={patient.id}
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.3 }}
                                className="table-row"
                            >
                                <td className="px-6 py-4">
                                    <div>
                                        <p className="font-semibold text-gray-800">{patient.name}</p>
                                        <p className="text-sm text-gray-500">{patient.email}</p>
                                    </div>
                                </td>
                                <td className="px-6 py-4">
                                    <p className="text-gray-600">{patient.phone}</p>
                                    <p className="text-sm text-gray-500">{patient.emergencyContact}</p>
                                </td>
                                <td className="px-6 py-4 hidden md:table-cell">
                                    <p className="text-gray-600">
                                        {new Date(patient.birthDate).toLocaleDateString('pt-BR')}
                                    </p>
                                </td>
                                <td className="px-6 py-4 hidden lg:table-cell">
                                    <p className="text-gray-600">
                                        {new Date(patient.createdAt).toLocaleDateString('pt-BR')}
                                    </p>
                                </td>
                                <td className="px-6 py-4">
                                    <div className="flex justify-end gap-2">
                                        <Button
                                            variant="ghost"
                                            size="icon"
                                            onClick={() => handleView(patient)}
                                            className="action-button-view"
                                        >
                                            <Eye className="w-4 h-4" />
                                        </Button>
                                        <Button
                                            variant="ghost"
                                            size="icon"
                                            onClick={() => handleEdit(patient)}
                                            className="action-button-edit"
                                        >
                                            <Edit className="w-4 h-4" />
                                        </Button>
                                        <Button
                                            variant="ghost"
                                            size="icon"
                                            onClick={() => handleDeletePatient(patient.id)}
                                            className="action-button-delete"
                                        >
                                            <Trash2 className="w-4 h-4" />
                                        </Button>
                                    </div>
                                </td>
                            </motion.tr>
                        ))}
                        </tbody>
                    </table>

                    {filteredPatients.length === 0 && (
                        <div className="text-center py-12">
                            <Users className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                            <p className="text-gray-500 text-xl font-medium">
                                {searchTerm ? 'Nenhum paciente encontrado' : 'Nenhum paciente cadastrado'}
                            </p>
                            {!searchTerm && (
                                <Button
                                    onClick={() => setShowForm(true)}
                                    className="mt-6 empty-state-button text-white px-6 py-3 rounded-xl shadow-md hover:shadow-lg transition-all duration-300"
                                >
                                    <UserPlus className="w-5 h-5 mr-2" />
                                    Cadastrar Primeiro Paciente
                                </Button>
                            )}
                        </div>
                    )}
                </div>
            </motion.div>
        </motion.div>
    );
}