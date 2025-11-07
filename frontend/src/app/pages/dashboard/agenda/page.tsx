// agenda/page.tsx
"use client"

import { motion } from "framer-motion"
import { Calendar, Clock, Plus } from "lucide-react"
import { Button } from "@/components/ui/button"

export default function AgendarPage(){
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

    return(
        <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="space-y-6"
        >
            <motion.div variants={itemVariants} className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                        Agendamentos
                    </h1>
                    <p className="text-gray-600 mt-2">
                        Gerencie seus compromissos e consultas de forma eficiente
                    </p>
                </div>
                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                    <Button className="bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 shadow-lg shadow-blue-500/25">
                        <Plus className="w-4 h-4 mr-2" />
                        Novo Agendamento
                    </Button>
                </motion.div>
            </motion.div>

            <motion.div
                variants={itemVariants}
                className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
            >
                {/* Cards de estatísticas */}
                {[
                    { label: "Agendamentos Hoje", value: "12", icon: Calendar, color: "blue" },
                    { label: "Próximos 7 Dias", value: "34", icon: Clock, color: "green" },
                    { label: "Confirmados", value: "28", icon: Calendar, color: "purple" }
                ].map((stat, index) => (
                    <motion.div
                        key={index}
                        whileHover={{ y: -5, scale: 1.02 }}
                        className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-blue-200/50"
                    >
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-gray-600 text-sm font-medium">{stat.label}</p>
                                <p className="text-2xl font-bold text-gray-800 mt-1">{stat.value}</p>
                            </div>
                            <div className={`p-3 rounded-xl bg-${stat.color}-100`}>
                                <stat.icon className={`w-6 h-6 text-${stat.color}-600`} />
                            </div>
                        </div>
                    </motion.div>
                ))}
            </motion.div>

            <motion.div
                variants={itemVariants}
                className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-blue-200/50"
            >
                <h2 className="text-xl font-semibold text-gray-800 mb-4">Próximos Compromissos</h2>
                <div className="space-y-4">
                    {[1, 2, 3].map((item) => (
                        <motion.div
                            key={item}
                            whileHover={{ x: 4 }}
                            className="flex items-center justify-between p-4 rounded-xl border border-blue-200/30 hover:bg-blue-50/50 transition-colors"
                        >
                            <div className="flex items-center gap-4">
                                <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
                                    <Calendar className="w-6 h-6 text-blue-600" />
                                </div>
                                <div>
                                    <h3 className="font-semibold text-gray-800">Consulta de Rotina</h3>
                                    <p className="text-sm text-gray-600">Dr. João Silva • 14:30</p>
                                </div>
                            </div>
                            <Button variant="outline" size="sm">
                                Detalhes
                            </Button>
                        </motion.div>
                    ))}
                </div>
            </motion.div>
        </motion.div>
    );
}