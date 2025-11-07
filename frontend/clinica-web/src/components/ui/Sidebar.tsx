"use client"
import Link from "next/link"
import { usePathname } from "next/navigation"

export function Sidebar() {
    const pathname = usePathname()
    const link = (href: string, label: string) => (
        <Link
            href={href}
            className={`block px-4 py-2 rounded hover:bg-gray-800/40 ${pathname===href?"bg-gray-800 text-white":"text-gray-200"}`}
        >{label}</Link>
    )
    return (
        <aside className="w-64 bg-gray-900 text-gray-100 p-4 space-y-2">
            <h2 className="font-semibold text-lg mb-2">Consultório</h2>
            {link("/dashboard", "Dashboard")}
            {link("/pacientes", "Pacientes")}
            {link("/dentistas", "Dentistas")}
            {link("/agendamentos", "Agendamentos")}
        </aside>
    )
}