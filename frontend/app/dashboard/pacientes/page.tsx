// app/pacientes/page.tsx
'use client';

import { useState, useEffect } from 'react';
import { usePaciente } from '@/hooks/usePaciente';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Plus, Search, Edit, Trash2, Filter, Calendar, Phone, Mail, User } from 'lucide-react';
import { formatadores } from '@/lib/formatadores';

export default function PacientesPage() {
    const {
        pacientes,
        loading,
        error,
        criarPaciente,
        atualizarPaciente,
        deletarPaciente,
        listarPacientes
    } = usePaciente();

    const [showDialog, setShowDialog] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState('all');
    const [editingPaciente, setEditingPaciente] = useState<any>(null);
    const [formData, setFormData] = useState({
        nome: '',
        prontuario: '',
        cpf: '',
        rg: '',
        email: '',
        telefone: '',
        dataNascimento: '',
        sexo: '',
        convenio: '',
        enderecoResidencial: '',
        naturalidade: '',
        nacionalidade: '',
        profissao: '',
        estadoCivil: '',
        indicadoPor: '',
        responsavelNome: '',
        responsavelTelefone: ''
    });

    // Carregar pacientes
    useEffect(() => {
        listarPacientes();
    }, [listarPacientes]);

    // Filtrar pacientes
    const filteredPacientes = pacientes.filter(paciente => {
        const matchesSearch = paciente.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
            paciente.cpf?.includes(searchTerm) ||
            paciente.email?.toLowerCase().includes(searchTerm.toLowerCase());

        if (statusFilter === 'all') return matchesSearch;
        if (statusFilter === 'active') return matchesSearch; // Todos estão ativos por padrão

        return matchesSearch;
    });

    // Limpar formulário
    const limparFormulario = () => {
        setFormData({
            nome: '',
            prontuario: '',
            cpf: '',
            rg: '',
            email: '',
            telefone: '',
            dataNascimento: '',
            sexo: '',
            convenio: '',
            enderecoResidencial: '',
            naturalidade: '',
            nacionalidade: '',
            profissao: '',
            estadoCivil: '',
            indicadoPor: '',
            responsavelNome: '',
            responsavelTelefone: ''
        });
        setEditingPaciente(null);
    };

    // Abrir modal para edição
    const handleEdit = (paciente: any) => {
        setEditingPaciente(paciente);
        setFormData({
            nome: paciente.nome || '',
            prontuario: paciente.prontuario || '',
            cpf: paciente.cpf || '',
            rg: paciente.rg || '',
            email: paciente.email || '',
            telefone: paciente.telefone || '',
            dataNascimento: formatadores.dataDoBackend(paciente.dataNascimento) || '',
            sexo: paciente.sexo || '',
            convenio: paciente.convenio || '',
            enderecoResidencial: paciente.enderecoResidencial || '',
            naturalidade: paciente.naturalidade || '',
            nacionalidade: paciente.nacionalidade || '',
            profissao: paciente.profissao || '',
            estadoCivil: paciente.estadoCivil || '',
            indicadoPor: paciente.indicadoPor || '',
            responsavelNome: paciente.responsavelNome || '',
            responsavelTelefone: paciente.responsavelTelefone || ''
        });
        setShowDialog(true);
    };

    // Salvar paciente
    const handleSave = async () => {
        try {
            const dadosParaEnviar = {
                ...formData,
                dataNascimento: formatadores.dataParaBackend(formData.dataNascimento)
            };

            if (editingPaciente) {
                await atualizarPaciente(editingPaciente.id, dadosParaEnviar);
            } else {
                await criarPaciente(dadosParaEnviar);
            }

            setShowDialog(false);
            limparFormulario();
            listarPacientes();
        } catch (error) {
            console.error('Erro ao salvar paciente:', error);
        }
    };

    // Excluir paciente
    const handleDelete = async (id: number) => {
        if (!confirm('Tem certeza que deseja excluir este paciente?')) return;

        try {
            await deletarPaciente(id);
            listarPacientes();
        } catch (error) {
            console.error('Erro ao excluir paciente:', error);
        }
    };

    // Handlers de formatação
    const handleCpfChange = (valor: string) => {
        const formatado = formatadores.cpf(valor);
        setFormData(prev => ({ ...prev, cpf: formatado }));
    };

    const handleTelefoneChange = (valor: string) => {
        const formatado = formatadores.telefone(valor);
        setFormData(prev => ({ ...prev, telefone: formatado }));
    };

    const handleDataChange = (valor: string) => {
        const formatado = formatadores.data(valor);
        setFormData(prev => ({ ...prev, dataNascimento: formatado }));
    };

    return (
        <div className="container mx-auto p-6 space-y-6">
            {/* Header */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Pacientes</h1>
                    <p className="text-muted-foreground">
                        Gerencie os pacientes do consultório
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
                    Novo Paciente
                </Button>
            </div>

            {/* Filtros e Busca */}
            <Card>
                <CardContent className="p-4">
                    <div className="flex flex-col sm:flex-row gap-4">
                        <div className="flex-1 relative">
                            <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                            <Input
                                placeholder="Buscar por nome, CPF ou email..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="pl-10"
                            />
                        </div>
                        <Select value={statusFilter} onValueChange={setStatusFilter}>
                            <SelectTrigger className="w-[180px]">
                                <Filter className="h-4 w-4 mr-2" />
                                <SelectValue placeholder="Filtrar por status" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">Todos</SelectItem>
                                <SelectItem value="active">Ativos</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                </CardContent>
            </Card>

            {/* Tabela de Pacientes */}
            <Card>
                <CardHeader>
                    <CardTitle>Lista de Pacientes</CardTitle>
                    <CardDescription>
                        {filteredPacientes.length} paciente(s) encontrado(s)
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    {loading ? (
                        <div className="flex justify-center items-center py-8">
                            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                        </div>
                    ) : error ? (
                        <div className="text-center py-8 text-destructive">
                            {error}
                        </div>
                    ) : (
                        <div className="rounded-md border">
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>Paciente</TableHead>
                                        <TableHead>Contato</TableHead>
                                        <TableHead>CPF</TableHead>
                                        <TableHead>Data Nasc.</TableHead>
                                        <TableHead>Convênio</TableHead>
                                        <TableHead className="w-[100px]">Ações</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {filteredPacientes.map((paciente) => (
                                        <TableRow key={paciente.id}>
                                            <TableCell>
                                                <div className="flex items-center gap-3">
                                                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
                                                        <User className="h-5 w-5 text-primary" />
                                                    </div>
                                                    <div>
                                                        <div className="font-medium">{paciente.nome}</div>
                                                        <div className="text-sm text-muted-foreground">
                                                            {paciente.email}
                                                        </div>
                                                    </div>
                                                </div>
                                            </TableCell>
                                            <TableCell>
                                                <div className="space-y-1">
                                                    {paciente.telefone && (
                                                        <div className="flex items-center gap-2 text-sm">
                                                            <Phone className="h-3 w-3" />
                                                            {paciente.telefone}
                                                        </div>
                                                    )}
                                                    {paciente.email && (
                                                        <div className="flex items-center gap-2 text-sm">
                                                            <Mail className="h-3 w-3" />
                                                            {paciente.email}
                                                        </div>
                                                    )}
                                                </div>
                                            </TableCell>
                                            <TableCell className="font-mono text-sm">
                                                {paciente.cpf || '-'}
                                            </TableCell>
                                            <TableCell>
                                                {paciente.dataNascimento ? (
                                                    <div className="flex items-center gap-2">
                                                        <Calendar className="h-3 w-3" />
                                                        {formatadores.dataDoBackend(paciente.dataNascimento)}
                                                    </div>
                                                ) : (
                                                    '-'
                                                )}
                                            </TableCell>
                                            <TableCell>
                                                {paciente.convenio ? (
                                                    <Badge variant="secondary">{paciente.convenio}</Badge>
                                                ) : (
                                                    '-'
                                                )}
                                            </TableCell>
                                            <TableCell>
                                                <div className="flex items-center gap-2">
                                                    <Button
                                                        variant="ghost"
                                                        size="icon"
                                                        onClick={() => handleEdit(paciente)}
                                                    >
                                                        <Edit className="h-4 w-4" />
                                                    </Button>
                                                    <Button
                                                        variant="ghost"
                                                        size="icon"
                                                        onClick={() => handleDelete(paciente.id)}
                                                        className="text-destructive hover:text-destructive"
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

                    {!loading && filteredPacientes.length === 0 && (
                        <div className="text-center py-8 text-muted-foreground">
                            Nenhum paciente encontrado
                        </div>
                    )}
                </CardContent>
            </Card>

            {/* Modal de Cadastro/Edição */}
            <Dialog open={showDialog} onOpenChange={setShowDialog}>
                <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
                    <DialogHeader>
                        <DialogTitle>
                            {editingPaciente ? 'Editar Paciente' : 'Novo Paciente'}
                        </DialogTitle>
                        <DialogDescription>
                            {editingPaciente
                                ? 'Atualize as informações do paciente'
                                : 'Preencha os dados do novo paciente'
                            }
                        </DialogDescription>
                    </DialogHeader>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* Dados Pessoais */}
                        <div className="space-y-4">
                            <h3 className="text-lg font-semibold">Dados Pessoais</h3>

                            <div className="space-y-2">
                                <Label htmlFor="nome">Nome Completo *</Label>
                                <Input
                                    id="nome"
                                    value={formData.nome}
                                    onChange={(e) => setFormData(prev => ({ ...prev, nome: e.target.value }))}
                                    placeholder="Digite o nome completo"
                                />
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label htmlFor="cpf">CPF</Label>
                                    <Input
                                        id="cpf"
                                        value={formData.cpf}
                                        onChange={(e) => handleCpfChange(e.target.value)}
                                        placeholder="000.000.000-00"
                                        maxLength={14}
                                    />
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="rg">RG</Label>
                                    <Input
                                        id="rg"
                                        value={formData.rg}
                                        onChange={(e) => setFormData(prev => ({ ...prev, rg: e.target.value }))}
                                        placeholder="Número do RG"
                                    />
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label htmlFor="dataNascimento">Data de Nascimento</Label>
                                    <Input
                                        id="dataNascimento"
                                        value={formData.dataNascimento}
                                        onChange={(e) => handleDataChange(e.target.value)}
                                        placeholder="dd/mm/aaaa"
                                        maxLength={10}
                                    />
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="sexo">Sexo</Label>
                                    <Select value={formData.sexo} onValueChange={(value) => setFormData(prev => ({ ...prev, sexo: value }))}>
                                        <SelectTrigger>
                                            <SelectValue placeholder="Selecione" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="MASCULINO">Masculino</SelectItem>
                                            <SelectItem value="FEMININO">Feminino</SelectItem>
                                            <SelectItem value="OUTRO">Outro</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label htmlFor="estadoCivil">Estado Civil</Label>
                                    <Select value={formData.estadoCivil} onValueChange={(value) => setFormData(prev => ({ ...prev, estadoCivil: value }))}>
                                        <SelectTrigger>
                                            <SelectValue placeholder="Selecione" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="SOLTEIRO">Solteiro(a)</SelectItem>
                                            <SelectItem value="CASADO">Casado(a)</SelectItem>
                                            <SelectItem value="DIVORCIADO">Divorciado(a)</SelectItem>
                                            <SelectItem value="VIUVO">Viúvo(a)</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="profissao">Profissão</Label>
                                    <Input
                                        id="profissao"
                                        value={formData.profissao}
                                        onChange={(e) => setFormData(prev => ({ ...prev, profissao: e.target.value }))}
                                        placeholder="Profissão do paciente"
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Contato e Outras Informações */}
                        <div className="space-y-4">
                            <h3 className="text-lg font-semibold">Contato e Localização</h3>

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
                                <Label htmlFor="telefone">Telefone</Label>
                                <Input
                                    id="telefone"
                                    value={formData.telefone}
                                    onChange={(e) => handleTelefoneChange(e.target.value)}
                                    placeholder="(00) 00000-0000"
                                    maxLength={15}
                                />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="enderecoResidencial">Endereço Residencial</Label>
                                <Textarea
                                    id="enderecoResidencial"
                                    value={formData.enderecoResidencial}
                                    onChange={(e) => setFormData(prev => ({ ...prev, enderecoResidencial: e.target.value }))}
                                    placeholder="Endereço completo"
                                    rows={3}
                                />
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label htmlFor="naturalidade">Naturalidade</Label>
                                    <Input
                                        id="naturalidade"
                                        value={formData.naturalidade}
                                        onChange={(e) => setFormData(prev => ({ ...prev, naturalidade: e.target.value }))}
                                        placeholder="Cidade de nascimento"
                                    />
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="nacionalidade">Nacionalidade</Label>
                                    <Input
                                        id="nacionalidade"
                                        value={formData.nacionalidade}
                                        onChange={(e) => setFormData(prev => ({ ...prev, nacionalidade: e.target.value }))}
                                        placeholder="Nacionalidade"
                                    />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="convenio">Convênio</Label>
                                <Input
                                    id="convenio"
                                    value={formData.convenio}
                                    onChange={(e) => setFormData(prev => ({ ...prev, convenio: e.target.value }))}
                                    placeholder="Plano de saúde"
                                />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="indicadoPor">Indicado Por</Label>
                                <Input
                                    id="indicadoPor"
                                    value={formData.indicadoPor}
                                    onChange={(e) => setFormData(prev => ({ ...prev, indicadoPor: e.target.value }))}
                                    placeholder="Quem indicou o paciente"
                                />
                            </div>
                        </div>
                    </div>

                    {/* Responsável (para menores) */}
                    <div className="space-y-4 border-t pt-4">
                        <h3 className="text-lg font-semibold">Responsável (para menores de idade)</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="responsavelNome">Nome do Responsável</Label>
                                <Input
                                    id="responsavelNome"
                                    value={formData.responsavelNome}
                                    onChange={(e) => setFormData(prev => ({ ...prev, responsavelNome: e.target.value }))}
                                    placeholder="Nome do responsável"
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="responsavelTelefone">Telefone do Responsável</Label>
                                <Input
                                    id="responsavelTelefone"
                                    value={formData.responsavelTelefone}
                                    onChange={(e) => setFormData(prev => ({ ...prev, responsavelTelefone: e.target.value }))}
                                    placeholder="(00) 00000-0000"
                                    maxLength={15}
                                />
                            </div>
                        </div>
                    </div>

                    <DialogFooter>
                        <Button variant="outline" onClick={() => setShowDialog(false)}>
                            Cancelar
                        </Button>
                        <Button onClick={handleSave} disabled={loading}>
                            {loading ? 'Salvando...' : (editingPaciente ? 'Atualizar' : 'Cadastrar')}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    );
}