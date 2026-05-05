import { TipoAeronave } from '../enums/enums'
import { Peca } from './Peca'
import { Etapa } from './Etapa'
import { Teste } from './Teste'

export interface Aeronave {
    codigo: string
    modelo: string
    tipo: TipoAeronave
    capacidade: number
    alcance: number

    pecas: Peca[]
    etapas: Etapa[]
    testes: Teste[]
}