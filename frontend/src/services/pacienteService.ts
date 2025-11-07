// src/services/pacienteService.ts
import api from "@/lib/api"

export type Paciente = {
    id: number
    prontuario: string
    nome: string
    email: string
    rg: string
    orgaoExpedidor: string
    dataNascimento: string
    naturalidade: string
    nacionalidade: string
    estadoCivil: string
    profissao: string
    enderecoResidencial: string
    cpf: string
    sexo: string
    telefone: string
    indicadoPor: string
    convenio: string
    numeroInscricaoConvenio: string

    responsavelNome: string
    responsavelRg: string
    responsavelOrgao: string
    responsavelEstadoCivil: string
    responsavelCpf: string

    conjugeNome: string
    conjugeRg: string
    conjugeCpf: string

    febreReumatica: boolean
    hepatite: boolean
    diabetes: boolean
    hipertensao: boolean
    hiv: boolean
    alteracaoCoagulacao: boolean
    reacoesAlergicas: boolean
    doencasSistemicas: boolean
    tratamentosMedicos: string
    internacaoRecente: boolean
    medicacaoAtual: string
    fumante: boolean
    quantidadeFumo: string
    bebidas: boolean
    problemasCardiacos: boolean
    problemasRenais: boolean
    problemasGastricos: boolean
    problemasRespiratorios: boolean
    problemasAlergicos: boolean
    problemasArticulares: boolean
    queixaPrincipal: string
    sofreDoenca: boolean
    qualDoenca: string
    tratamentoMedicoAtual: boolean
    gravidez: boolean
    usoMedicacao: boolean
    nomeMedico: string
    alergia: boolean
    alergiaTipo: string
    cirurgia: boolean
    cirurgiaTipo: string
    cicatrizacao: boolean
    anestesia: boolean
    hemorragia: boolean
    habitos: string
    antecedentesFamiliares: string

    lingua: string
    mucosa: string
    palato: string
    face: string
    labios: string
    alteracaoOclusao: string
    tipoOclusao: string
    protese: string
    tipoProtese: string
    gengivas: string
    glandulas: string
    outrasObservacoes: string
    localData: string

    // 🔥 CORREÇÃO: Mudar de criadoEm para dataCadastro
    dataCadastro: string
}

export type CreatePacienteData = Omit<Paciente, "id" | "dataCadastro">

const BASE_URL = "/paciente"

export async function getPacientes(): Promise<Paciente[]> {
    const { data } = await api.get(BASE_URL)
    return data
}

export async function getPacienteById(id: number): Promise<Paciente> {
    const { data } = await api.get(`${BASE_URL}/${id}`)
    return data
}

export async function createPaciente(paciente: CreatePacienteData): Promise<Paciente> {
    const { data } = await api.post(BASE_URL, paciente)
    return data
}

export async function updatePaciente(id: number, paciente: CreatePacienteData): Promise<Paciente> {
    const { data } = await api.put(`${BASE_URL}/${id}`, paciente)
    return data
}

export async function deletePaciente(id: number): Promise<void> {
    await api.delete(`${BASE_URL}/${id}`)
}

export async function searchPacientes(nome: string): Promise<Paciente[]> {
    const { data } = await api.get(`${BASE_URL}/buscar`, { params: { nome } })
    return data
}