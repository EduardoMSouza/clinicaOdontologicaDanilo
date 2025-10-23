import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import React from "react";
import { Toaster } from "@/components/ui/sonner";

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
    title: 'OdontoClínica - Sistema de Gestão',
    description: 'Sistema de gestão para clínicas odontológicas',
}

export default function RootLayout({
                                       children,
                                   }: {
    children: React.ReactNode
}) {
    return (
        <html lang="pt-BR">
        <body className={inter.className}>
        {children}
        <Toaster richColors position="top-right" />
        </body>
        </html>
    )
}