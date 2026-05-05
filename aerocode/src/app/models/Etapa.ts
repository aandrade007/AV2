import { StatusEtapa } from '../enums/enums'
import { Funcionario } from './Funcionario'

export interface Etapa {
    nome: string
    prazo: string
    status: StatusEtapa
    funcionarios?: Funcionario[] 
    aeronaveCodigo?: string 
}