import { TipoPeca, StatusPeca } from '../enums/enums'

export interface Peca {
    nome: string
    tipo: TipoPeca
    fornecedor: string
    status: StatusPeca
    aeronaveCodigo?: string | null
}