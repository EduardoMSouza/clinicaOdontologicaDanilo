"use client"

import { useState, useMemo, useEffect } from "react"
import {
    Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/ui/table"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
    DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
    Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select"
import {
    Download, MoreHorizontal, Edit, Trash2, FileText, Eye,
    ChevronLeft, ChevronRight, Search, X,
} from "lucide-react"

interface TableData {
    id: number
    nome: string
    cpf: string
    email: string
    telefone: string
    status: string
    dataNascimento: string
    cidade: string
    convenio: string
}

interface DataTableProps {
    data: TableData[]
    onEdit?: (id: number) => void
    onDelete?: (id: number) => void
    onView?: (id: number) => void
}

export function DataTable({ data, onEdit, onDelete, onView }: DataTableProps) {
    const [searchTerm, setSearchTerm] = useState("")
    const [rowsPerPage, setRowsPerPage] = useState(10)
    const [currentPage, setCurrentPage] = useState(1)
    const [isClient, setIsClient] = useState(false)

    useEffect(() => setIsClient(true), [])

    const clearSearch = () => {
        setSearchTerm("")
        setCurrentPage(1)
    }

    // 🔍 Busca dinâmica unificada
    const filteredData = useMemo(() => {
        const term = searchTerm.trim().toLowerCase()
        if (!term) return data

        return data.filter((item) => {
            // Busca em todos os campos relevantes
            return (
                item.nome.toLowerCase().includes(term) ||
                item.cpf.toLowerCase().includes(term) ||
                item.email.toLowerCase().includes(term) ||
                item.telefone.toLowerCase().includes(term) ||
                item.cidade.toLowerCase().includes(term) ||
                item.convenio.toLowerCase().includes(term) ||
                item.dataNascimento.toLowerCase().includes(term)
            )
        })
    }, [data, searchTerm])

    const totalPages = Math.ceil(filteredData.length / rowsPerPage)
    const paginatedData = useMemo(() => {
        const startIndex = (currentPage - 1) * rowsPerPage
        return filteredData.slice(startIndex, startIndex + rowsPerPage)
    }, [filteredData, currentPage, rowsPerPage])

    const nextPage = () => setCurrentPage((p) => Math.min(p + 1, totalPages))
    const prevPage = () => setCurrentPage((p) => Math.max(p - 1, 1))

    if (!isClient) return <div>Carregando...</div>

    return (
        <div className="bg-card rounded-xl shadow-md border border-border/60 overflow-hidden transition-all hover:shadow-lg">
            {/* HEADER */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 p-6 border-b bg-gradient-to-r from-primary/5 to-background/50">
                <div className="flex items-center gap-3">
                    <div className="h-11 w-11 rounded-xl bg-primary/10 flex items-center justify-center">
                        <FileText className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                        <h3 className="text-xl font-semibold text-foreground">Pacientes</h3>
                        <p className="text-sm text-muted-foreground">
                            {filteredData.length} {filteredData.length === 1 ? "paciente" : "pacientes"} encontrados
                        </p>
                    </div>
                </div>

                {/* AÇÕES */}
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button variant="outline" className="h-10 gap-2 hover:bg-primary/10 hover:text-primary">
                            <MoreHorizontal className="h-4 w-4" />
                            Ações
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-48">
                        <DropdownMenuItem onClick={() => alert("Exportar CSV em breve!")}>
                            <Download className="h-4 w-4 mr-2" />
                            Exportar CSV
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            </div>

            {/* 🔍 BARRA DE BUSCA UNIFICADA */}
            <div className="flex flex-col md:flex-row gap-3 items-start md:items-center justify-between px-6 py-4 border-b bg-muted/30">
                <div className="relative w-full md:w-[400px]">
                    <Input
                        placeholder="Buscar por nome, CPF, email, telefone, cidade, convênio ou data..."
                        value={searchTerm}
                        onChange={(e) => {
                            setSearchTerm(e.target.value)
                            setCurrentPage(1)
                        }}
                        className="pl-10 pr-20"
                    />
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground h-4 w-4" />

                    {searchTerm && (
                        <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-1">
                            <span className="text-xs text-muted-foreground mr-1">
                                {filteredData.length} resultados
                            </span>
                            <Button
                                variant="ghost"
                                size="icon"
                                onClick={clearSearch}
                                className="h-6 w-6 text-muted-foreground hover:text-foreground"
                            >
                                <X className="h-3 w-3" />
                            </Button>
                        </div>
                    )}
                </div>
            </div>

            {/* 🧾 TABELA */}
            <div className="overflow-x-auto">
                <Table>
                    <TableHeader>
                        <TableRow className="bg-muted/40">
                            <TableHead>Nome</TableHead>
                            <TableHead>CPF</TableHead>
                            <TableHead>Email</TableHead>
                            <TableHead>Telefone</TableHead>
                            <TableHead>Data de Nascimento</TableHead>
                            <TableHead>Convênio</TableHead>
                            <TableHead className="text-right">Ações</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {paginatedData.length > 0 ? (
                            paginatedData.map((item) => (
                                <TableRow key={item.id} className="hover:bg-muted/30 transition-colors">
                                    <TableCell>{item.nome}</TableCell>
                                    <TableCell>{item.cpf || "—"}</TableCell>
                                    <TableCell>{item.email || "—"}</TableCell>
                                    <TableCell>{item.telefone || "—"}</TableCell>
                                    <TableCell>
                                        <Badge variant="outline">{item.dataNascimento || "—"}</Badge>
                                    </TableCell>
                                    <TableCell>{item.convenio || "—"}</TableCell>
                                    <TableCell className="text-right">
                                        <div className="flex justify-end gap-1">
                                            <Button variant="ghost" size="icon" onClick={() => onView?.(item.id)}>
                                                <Eye className="h-4 w-4" />
                                            </Button>
                                            <Button variant="ghost" size="icon" className="text-blue-600 hover:bg-blue-100" onClick={() => onEdit?.(item.id)}>
                                                <Edit className="h-4 w-4" />
                                            </Button>
                                            <Button variant="ghost" size="icon" className="text-red-600 hover:bg-red-100" onClick={() => onDelete?.(item.id)}>
                                                <Trash2 className="h-4 w-4" />
                                            </Button>
                                        </div>
                                    </TableCell>
                                </TableRow>
                            ))
                        ) : (
                            <TableRow>
                                <TableCell colSpan={7} className="text-center py-10 text-muted-foreground">
                                    {searchTerm ? "Nenhum paciente encontrado para sua busca" : "Nenhum paciente cadastrado"}
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </div>

            {/* PAGINAÇÃO */}
            <div className="flex flex-col sm:flex-row justify-between items-center gap-4 px-6 py-4 border-t bg-muted/20 text-sm">
                <div className="text-muted-foreground">
                    Mostrando <strong>{paginatedData.length}</strong> de <strong>{filteredData.length}</strong> registros
                </div>

                <div className="flex items-center gap-6">
                    <div className="flex items-center gap-2">
                        <span className="text-muted-foreground">Linhas por página:</span>
                        <Select
                            value={rowsPerPage.toString()}
                            onValueChange={(v) => {
                                setRowsPerPage(Number(v))
                                setCurrentPage(1)
                            }}
                        >
                            <SelectTrigger className="w-20 h-8">
                                <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="10">10</SelectItem>
                                <SelectItem value="20">20</SelectItem>
                                <SelectItem value="30">30</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>

                    <div className="flex items-center gap-2">
                        <Button variant="outline" size="icon" onClick={prevPage} disabled={currentPage === 1}>
                            <ChevronLeft className="h-4 w-4" />
                        </Button>
                        <span>Página {currentPage} de {totalPages || 1}</span>
                        <Button variant="outline" size="icon" onClick={nextPage} disabled={currentPage === totalPages}>
                            <ChevronRight className="h-4 w-4" />
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    )
}