// app/dentistas/page.tsx
'use client';

import { useState, useEffect } from 'react';
import { dentistaService, DentistaCreateDTO, DentistaUpdateDTO } from '@/services/dentistaService';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Plus, Search, Edit, Trash2, Filter, Phone, Mail, User, Stethoscope } from 'lucide-react';

interface Dentista {
    id: number;
    nome: string;
    cro: string;
    especialidade?: string;
    telefone?: string;
    email?: string;
    ativo: boolean;
}

export default function DentistasPage() {
    const [dentistas, setDentistas] = useState<Dentista[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [showDialog, setShowDialog] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState<'all' | 'active' | 'inactive'>('all');
    const [editingDentista, setEditingDentista] = useState<Dentista | null>(null);

    const [formData, setFormData] = useState({
        nome: '',
        cro: '',
        especialidade: '',
        telefone: '',
        email: '',
        ativo: true
    });

    // Carregar dentistas
    useEffect(() => {
        carregarDentistas();
    }, []);

    const carregarDentistas = async () => {
        try {
            setLoading(true);
            setError(null);
            const dados = await dentistaService.listar();
            setDentistas(dados);
        } catch (error: any) {
            setError(error.message || 'Erro ao carregar dentistas');
        } finally {
            setLoading(false);
        }
    };

    // Filtrar dentistas
    const filteredDentistas = dentistas.filter(dentista => {
        const matchesSearch = dentista.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
            dentista.cro.toLowerCase().includes(searchTerm.toLowerCase()) ||
            dentista.especialidade?.toLowerCase().includes(searchTerm.toLowerCase());

        if (statusFilter === 'all') return matchesSearch;
        if (statusFilter === 'active') return matchesSearch && dentista.ativo;
        return matchesSearch && !dentista.ativo;
    });

    // Limpar formulário
    const limparFormulario = () => {
        setFormData({
            nome: '',
            cro: '',
            especialidade: '',
            telefone: '',
            email: '',
            ativo: true
        });
        setEditingDentista(null);
    };

    // Abrir modal para edição
    const handleEdit = (dentista: Dentista) => {
        setEditingDentista(dentista);
        setFormData({
            nome: dentista.nome,
            cro: dentista.cro,
            especialidade: dentista.especialidade || '',
            telefone: dentista.telefone || '',
            email: dentista.email || '',
            ativo: dentista.ativo
        });
        setShowDialog(true);
    };

    // Salvar dentista
    const handleSave = async () => {
        try {
            setLoading(true);
            setError(null);

            // Validações
            if (!formData.nome.trim()) {
                setError('Nome é obrigatório');
                return;
            }
            if (!formData.cro.trim()) {
                setError('CRO é obrigatório');
                return;
            }

            if (editingDentista) {
                const updateDTO: DentistaUpdateDTO = {
                    nome: formData.nome,
                    cro: formData.cro,
                    especialidade: formData.especialidade || undefined,
                    telefone: formData.telefone || undefined,
                    email: formData.email || undefined,
                    ativo: formData.ativo
                };
                await dentistaService.atualizar(editingDentista.id, updateDTO);
            } else {
                const createDTO: DentistaCreateDTO = {
                    nome: formData.nome,
                    cro: formData.cro,
                    especialidade: formData.especialidade || undefined,
                    telefone: formData.telefone || undefined,
                    email: formData.email || undefined,
                    ativo: formData.ativo
                };
                await dentistaService.criar(createDTO);
            }

            setShowDialog(false);
            limparFormulario();
            await carregarDentistas();
        } catch (error: any) {
            setError(error.message || 'Erro ao salvar dentista');
        } finally {
            setLoading(false);
        }
    };

    // Excluir dentista
    const handleDelete = async (id: number) => {
        if (!confirm('Tem certeza que deseja excluir este dentista?')) return;

        try {
            setLoading(true);
            await dentistaService.deletar(id);
            await carregarDentistas();
        } catch (error: any) {
            setError(error.message || 'Erro ao excluir dentista');
        } finally {
            setLoading(false);
        }
    };

    // Desativar/Ativar dentista
    const handleToggleStatus = async (id: number, ativo: boolean) => {
        try {
            setLoading(true);
            if (ativo) {
                await dentistaService.desativar(id);
            } else {
                // Para ativar, precisamos fazer um update
                await dentistaService.atualizar(id, { ativo: true });
            }
            await carregarDentistas();
        } catch (error: any) {
            setError(error.message || 'Erro ao alterar status do dentista');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="container mx-auto p-6 space-y-6">
            {/* Header */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Dentistas</h1>
                    <p className="text-muted-foreground">
                        Gerencie os dentistas do consultório
                    </p>
                </div>
                <Button
                    onClick={() => {
                        limparFormulario();
                        setShowDialog(true);
                    }}
                    className="flex items-center gap-2"
                >
                    <Plus className="h-4 w-4" />
                    Novo Dentista
                </Button>
            </div>

            {/* Mensagem de erro */}
            {error && (
                <div className="bg-destructive/15 text-destructive p-4 rounded-md">
                    {error}
                </div>
            )}

            {/* Filtros e Busca */}
            <Card>
                <CardContent className="p-4">
                    <div className="flex flex-col sm:flex-row gap-4">
                        <div className="flex-1 relative">
                            <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                            <Input
                                placeholder="Buscar por nome, CRO ou especialidade..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="pl-10"
                            />
                        </div>
                        <Select value={statusFilter} onValueChange={(value: 'all' | 'active' | 'inactive') => setStatusFilter(value)}>
                            <SelectTrigger className="w-[180px]">
                                <Filter className="h-4 w-4 mr-2" />
                                <SelectValue placeholder="Filtrar por status" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">Todos</SelectItem>
                                <SelectItem value="active">Ativos</SelectItem>
                                <SelectItem value="inactive">Inativos</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                </CardContent>
            </Card>

            {/* Tabela de Dentistas */}
            <Card>
                <CardHeader>
                    <CardTitle>Lista de Dentistas</CardTitle>
                    <CardDescription>
                        {filteredDentistas.length} dentista(s) encontrado(s)
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    {loading ? (
                        <div className="flex justify-center items-center py-8">
                            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                        </div>
                    ) : (
                        <div className="rounded-md border">
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>Dentista</TableHead>
                                        <TableHead>CRO</TableHead>
                                        <TableHead>Especialidade</TableHead>
                                        <TableHead>Contato</TableHead>
                                        <TableHead>Status</TableHead>
                                        <TableHead className="w-[150px]">Ações</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {filteredDentistas.map((dentista) => (
                                        <TableRow key={dentista.id}>
                                            <TableCell>
                                                <div className="flex items-center gap-3">
                                                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
                                                        <User className="h-5 w-5 text-primary" />
                                                    </div>
                                                    <div>
                                                        <div className="font-medium">{dentista.nome}</div>
                                                        <div className="text-sm text-muted-foreground">
                                                            {dentista.email}
                                                        </div>
                                                    </div>
                                                </div>
                                            </TableCell>
                                            <TableCell className="font-mono font-medium">
                                                {dentista.cro}
                                            </TableCell>
                                            <TableCell>
                                                {dentista.especialidade ? (
                                                    <div className="flex items-center gap-2">
                                                        <Stethoscope className="h-3 w-3" />
                                                        {dentista.especialidade}
                                                    </div>
                                                ) : (
                                                    '-'
                                                )}
                                            </TableCell>
                                            <TableCell>
                                                <div className="space-y-1">
                                                    {dentista.telefone && (
                                                        <div className="flex items-center gap-2 text-sm">
                                                            <Phone className="h-3 w-3" />
                                                            {dentista.telefone}
                                                        </div>
                                                    )}
                                                    {dentista.email && (
                                                        <div className="flex items-center gap-2 text-sm">
                                                            <Mail className="h-3 w-3" />
                                                            {dentista.email}
                                                        </div>
                                                    )}
                                                </div>
                                            </TableCell>
                                            <TableCell>
                                                <Badge variant={dentista.ativo ? "default" : "secondary"}>
                                                    {dentista.ativo ? 'Ativo' : 'Inativo'}
                                                </Badge>
                                            </TableCell>
                                            <TableCell>
                                                <div className="flex items-center gap-2">
                                                    <Button
                                                        variant="ghost"
                                                        size="icon"
                                                        onClick={() => handleEdit(dentista)}
                                                    >
                                                        <Edit className="h-4 w-4" />
                                                    </Button>
                                                    <Button
                                                        variant="ghost"
                                                        size="icon"
                                                        onClick={() => handleToggleStatus(dentista.id, dentista.ativo)}
                                                        disabled={loading}
                                                    >
                                                        {dentista.ativo ? '🚫' : '✅'}
                                                    </Button>
                                                    <Button
                                                        variant="ghost"
                                                        size="icon"
                                                        onClick={() => handleDelete(dentista.id)}
                                                        className="text-destructive hover:text-destructive"
                                                        disabled={loading}
                                                    >
                                                        <Trash2 className="h-4 w-4" />
                                                    </Button>
                                                </div>
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </div>
                    )}

                    {!loading && filteredDentistas.length === 0 && (
                        <div className="text-center py-8 text-muted-foreground">
                            Nenhum dentista encontrado
                        </div>
                    )}
                </CardContent>
            </Card>

            {/* Modal de Cadastro/Edição */}
            <Dialog open={showDialog} onOpenChange={setShowDialog}>
                <DialogContent className="max-w-2xl">
                    <DialogHeader>
                        <DialogTitle>
                            {editingDentista ? 'Editar Dentista' : 'Novo Dentista'}
                        </DialogTitle>
                        <DialogDescription>
                            {editingDentista
                                ? 'Atualize as informações do dentista'
                                : 'Preencha os dados do novo dentista'
                            }
                        </DialogDescription>
                    </DialogHeader>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-4">
                            <div className="space-y-2">
                                <Label htmlFor="nome">Nome Completo *</Label>
                                <Input
                                    id="nome"
                                    value={formData.nome}
                                    onChange={(e) => setFormData(prev => ({ ...prev, nome: e.target.value }))}
                                    placeholder="Digite o nome completo"
                                />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="cro">CRO *</Label>
                                <Input
                                    id="cro"
                                    value={formData.cro}
                                    onChange={(e) => setFormData(prev => ({ ...prev, cro: e.target.value }))}
                                    placeholder="Ex: SP-12345"
                                />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="especialidade">Especialidade</Label>
                                <Input
                                    id="especialidade"
                                    value={formData.especialidade}
                                    onChange={(e) => setFormData(prev => ({ ...prev, especialidade: e.target.value }))}
                                    placeholder="Especialidade principal"
                                />
                            </div>
                        </div>

                        <div className="space-y-4">
                            <div className="space-y-2">
                                <Label htmlFor="telefone">Telefone</Label>
                                <Input
                                    id="telefone"
                                    value={formData.telefone}
                                    onChange={(e) => setFormData(prev => ({ ...prev, telefone: e.target.value }))}
                                    placeholder="(00) 00000-0000"
                                />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="email">Email</Label>
                                <Input
                                    id="email"
                                    type="email"
                                    value={formData.email}
                                    onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                                    placeholder="email@exemplo.com"
                                />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="ativo">Status</Label>
                                <Select
                                    value={formData.ativo ? 'active' : 'inactive'}
                                    onValueChange={(value) => setFormData(prev => ({ ...prev, ativo: value === 'active' }))}
                                >
                                    <SelectTrigger>
                                        <SelectValue placeholder="Selecione o status" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="active">Ativo</SelectItem>
                                        <SelectItem value="inactive">Inativo</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>
                    </div>

                    <DialogFooter>
                        <Button variant="outline" onClick={() => setShowDialog(false)}>
                            Cancelar
                        </Button>
                        <Button onClick={handleSave} disabled={loading}>
                            {loading ? 'Salvando...' : (editingDentista ? 'Atualizar' : 'Cadastrar')}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    );
}