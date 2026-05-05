import { NivelPermissao } from '../enums/enums'

export interface Funcionario {
    id: string
    nome: string
    telefone: string
    endereco: string
    usuario: string
    senha?: string 
    nivelPermissao: NivelPermissao
    ativo?: boolean 
}