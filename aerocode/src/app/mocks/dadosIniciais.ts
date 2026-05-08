import { Aeronave } from '../models/Aeronave';
import { Funcionario } from '../models/Funcionario';
import { 
    TipoAeronave, 
    NivelPermissao, 
    StatusPeca, 
    TipoPeca, 
    StatusEtapa, 
    TipoTeste, 
    ResultadoTeste 
} from '../enums/enums';
//os dados mokados são para ter alguns dados fixo assim que entrar no sistema! :)
export const mockFuncionarios: Funcionario[] = [
    {
        id: "550e8400-e29b-41d4-a716-446655440000",
        nome: "Gerson Penha",
        telefone: "12999999999",
        endereco: "Sede Aerocode",
        usuario: "admin",
        senha: "MTIz", 
        nivelPermissao: NivelPermissao.ADMINISTRADOR,
        ativo: true
    },
    {
        id: "123e4567-e89b-12d3-a456-426614174000",
        nome: "Davi Andrade",
        telefone: "12988888888",
        endereco: "Fábrica Ásia",
        usuario: "davi",
        senha: "MTIz", 
        nivelPermissao: NivelPermissao.ENGENHEIRO,
        ativo: true
    }
];

export const mockAeronaves: Aeronave[] = [
    {
        codigo: "AC-737",
        modelo: "Boeing 737 MAX",
        tipo: TipoAeronave.COMERCIAL,
        capacidade: 210,
        alcance: 6500,
        pecas: [
            {
                nome: "Motor Turbofan LEAP-1B",
                tipo: TipoPeca.IMPORTADA,
                fornecedor: "CFM International",
                status: StatusPeca.PRONTA,
                aeronaveCodigo: "AC-737"
            }
        ],
        etapas: [
            {
                nome: "Montagem da Fuselagem",
                prazo: "45",
                status: StatusEtapa.ANDAMENTO,
                aeronaveCodigo: "AC-737",
                funcionarios: [] 
            }
        ],
        testes: [
            {
                tipo: TipoTeste.AERODINAMICO,
                resultado: ResultadoTeste.APROVADO,
                aeronaveCodigo: "AC-737",
                data: new Date().toISOString()
            }
        ]
    }
];