"use client"
import Link from "next/link"
import { Calendar, Users, Stethoscope, LayoutDashboard } from "lucide-react"


export default function Sidebar() {
    return (
        <aside className="hidden md:block w-[var(--sidebar-w)] bg-white border-r shadow-sm">
            <div className="p-5 font-semibold text-xl">OdontoClinic</div>
            <nav className="px-2 space-y-1">
                <Link className="flex items-center gap-2 px-4 py-2 rounded-lg hover:bg-gray-100" href="/dashboard">
                    <LayoutDashboard size={18}/> <span>Dashboard</span>
                </Link>
                <Link className="flex items-center gap-2 px-4 py-2 rounded-lg hover:bg-gray-100" href="/pacientes">
                    <Users size={18}/> <span>Pacientes</span>
                </Link>
                <Link className="flex items-center gap-2 px-4 py-2 rounded-lg hover:bg-gray-100" href="/dentistas">
                    <Stethoscope size={18}/> <span>Dentistas</span>
                </Link>
                <Link className="flex items-center gap-2 px-4 py-2 rounded-lg hover:bg-gray-100" href="/agendamentos">
                    <Calendar size={18}/> <span>Agendamentos</span>
                </Link>
            </nav>
        </aside>
    )
}