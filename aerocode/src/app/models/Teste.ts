import { TipoTeste, ResultadoTeste } from '../enums/enums'

export interface Teste {
    tipo: TipoTeste
    resultado: ResultadoTeste
    aeronaveCodigo: string
    data?: string
}