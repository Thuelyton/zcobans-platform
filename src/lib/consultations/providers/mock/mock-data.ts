/**
 * Mock Data for Query Providers
 * Etapa 9.3.2 - Provider Interface & Mock
 *
 * Dados simulados para desenvolvimento e testes.
 * Nenhum dado real deve ser utilizado aqui.
 */

import type { QueryType } from '../../types'

// ============================================================================
// CPF DATA
// ============================================================================

const mockCpfData = [
  {
    cpf: '12345678901',
    nome: 'MARIA DA SILVA',
    dataNascimento: '15/03/1985',
    sexo: 'FEMININO',
    situaçãoCadastral: 'REGULAR',
    dataInscricao: '20/06/2001',
    digitoVerificador: '01',
  },
  {
    cpf: '98765432100',
    nome: 'JOÃO SANTOS',
    dataNascimento: '22/07/1990',
    sexo: 'MASCULINO',
    situaçãoCadastral: 'REGULAR',
    dataInscricao: '10/12/2005',
    digitoVerificador: '00',
  },
  {
    cpf: '11122233344',
    nome: 'ANA OLIVEIRA',
    dataNascimento: '08/11/1978',
    sexo: 'FEMININO',
    situaçãoCadastral: 'REGULAR',
    dataInscricao: '15/03/1995',
    digitoVerificador: '44',
  },
  {
    cpf: '55566677788',
    nome: 'PEDRO COSTA',
    dataNascimento: '30/01/1982',
    sexo: 'MASCULINO',
    situaçãoCadastral: 'REGULAR',
    dataInscricao: '28/09/1998',
    digitoVerificador: '88',
  },
  {
    cpf: '99988877766',
    nome: 'LUCIA FERREIRA',
    dataNascimento: '17/06/1995',
    sexo: 'FEMININO',
    situaçãoCadastral: 'REGULAR',
    dataInscricao: '05/02/2010',
    digitoVerificador: '66',
  },
]

// ============================================================================
// INSS DATA
// ============================================================================

const mockInssData = [
  {
    cpf: '12345678901',
    nome: 'MARIA DA SILVA',
    nis: '12345678901',
    dataNascimento: '15/03/1985',
    valorBeneficio: 2450.0,
    tipoBeneficio: 'APOSENTADORIA POR IDADE',
    dataInicio: '01/04/2020',
    situacao: 'ATIVO',
  },
  {
    cpf: '98765432100',
    nome: 'JOÃO SANTOS',
    nis: '98765432100',
    dataNascimento: '22/07/1990',
    valorBeneficio: 1850.0,
    tipoBeneficio: 'APOSENTADORIA POR TEMPO DE CONTRIBUIÇÃO',
    dataInicio: '15/06/2022',
    situacao: 'ATIVO',
  },
  {
    cpf: '11122233344',
    nome: 'ANA OLIVEIRA',
    nis: '11122233344',
    dataNascimento: '08/11/1978',
    valorBeneficio: 3200.0,
    tipoBeneficio: 'PENSIÃO POR MORTE',
    dataInicio: '01/01/2019',
    situacao: 'ATIVO',
  },
]

// ============================================================================
// FGTS DATA
// ============================================================================

const mockFgtsData = [
  {
    cpf: '12345678901',
    nome: 'MARIA DA SILVA',
    pis: '12345678901',
    empresa: 'EMPRESA ABC LTDA',
    cnpjEmpresa: '12345678000195',
    saldoAtual: 15680.45,
    saldoAnterior: 14250.3,
    dataSaldo: '31/12/2023',
    situacao: 'ATIVO',
  },
  {
    cpf: '98765432100',
    nome: 'JOÃO SANTOS',
    pis: '98765432100',
    empresa: 'COMÉRCIO XYZ ME',
    cnpjEmpresa: '98765432000110',
    saldoAtual: 8920.75,
    saldoAnterior: 7650.2,
    dataSaldo: '31/12/2023',
    situacao: 'ATIVO',
  },
  {
    cpf: '11122233344',
    nome: 'ANA OLIVEIRA',
    pis: '11122233344',
    empresa: 'INDÚSTRIA DEF LTDA',
    cnpjEmpresa: '11222333000144',
    saldoAtual: 22350.9,
    saldoAnterior: 20100.5,
    dataSaldo: '31/12/2023',
    situacao: 'ATIVO',
  },
]

// ============================================================================
// TELEFONE DATA
// ============================================================================

const mockTelefoneData = [
  {
    numero: '987654321',
    ddd: '11',
    operadora: 'VIVO',
    tipo: 'MOVEL',
    portabilidade: false,
    situacao: 'ATIVO',
  },
  {
    numero: '34567890',
    ddd: '21',
    operadora: 'CLARO',
    tipo: 'FIXO',
    portabilidade: false,
    situacao: 'ATIVO',
  },
  {
    numero: '998877665',
    ddd: '31',
    operadora: 'TIM',
    tipo: 'MOVEL',
    portabilidade: true,
    situacao: 'ATIVO',
  },
]

// ============================================================================
// LIMPA NOME DATA
// ============================================================================

const mockLimpaNomeData = [
  {
    cpf: '12345678901',
    nome: 'MARIA DA SILVA',
    possuiRestricao: true,
    quantidadeRestricao: 3,
    valorTotalRestricao: 12500.0,
    fontes: [
      { fonte: 'SERASA', valor: 5000.0, data: '15/03/2022' },
      { fonte: 'SPC', valor: 4500.0, data: '20/06/2022' },
      { fonte: 'SCR', valor: 3000.0, data: '10/09/2023' },
    ],
  },
  {
    cpf: '98765432100',
    nome: 'JOÃO SANTOS',
    possuiRestricao: false,
    quantidadeRestricao: 0,
    valorTotalRestricao: 0,
    fontes: [],
  },
  {
    cpf: '11122233344',
    nome: 'ANA OLIVEIRA',
    possuiRestricao: true,
    quantidadeRestricao: 1,
    valorTotalRestricao: 2800.0,
    fontes: [{ fonte: 'SPC', valor: 2800.0, data: '05/12/2023' }],
  },
]

// ============================================================================
// HELPER FUNCTIONS
// ============================================================================

/**
 * Dados mockados organizados por tipo de consulta
 */
export const mockDatabase: Record<QueryType, unknown[]> = {
  cpf: mockCpfData,
  inss: mockInssData,
  fgts: mockFgtsData,
  telefone: mockTelefoneData,
  limpa_nome: mockLimpaNomeData,
}

/**
 * Obtém dados mockados para um tipo de consulta
 *
 * @param queryType - Tipo da consulta
 * @param document - Documento para busca (opcional)
 * @returns Dados mockados encontrados ou dados aleatórios
 */
export function getMockData(queryType: QueryType, document?: string): unknown {
  const dataArray = mockDatabase[queryType]

  if (!dataArray || dataArray.length === 0) {
    return null
  }

  // Se documento fornecido, tenta encontrar correspondência
  if (document) {
    const normalizedDoc = document.replace(/\D/g, '')
    const found = dataArray.find((item) => {
      const itemObj = item as Record<string, unknown>
      const itemDoc = itemObj.cpf || itemObj.numero || itemObj.nis || ''
      return String(itemDoc).replace(/\D/g, '') === normalizedDoc
    })
    if (found) return found
  }

  // Retorna dados aleatórios se não encontrar
  const randomIndex = Math.floor(Math.random() * dataArray.length)
  return dataArray[randomIndex]
}

/**
 * Simula delay de rede
 *
 * @param ms - Milissegundos para esperar
 */
export function simulateDelay(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms))
}

/**
 * Gera um score aleatório entre 70 e 100
 */
export function generateRandomScore(): number {
  return Math.floor(Math.random() * 31) + 70
}

/**
 * Mascara um documento para exibição
 *
 * @param document - Documento original
 * @param type - Tipo do documento
 * @returns Documento mascarado
 */
export function maskDocument(document: string, type: string): string {
  const digits = document.replace(/\D/g, '')

  switch (type) {
    case 'cpf':
      if (digits.length === 11) {
        return `${digits.slice(0, 3)}.***.***-${digits.slice(9)}`
      }
      break
    case 'cnpj':
      if (digits.length === 14) {
        return `**.${digits.slice(2, 5)}.***/****-${digits.slice(12)}`
      }
      break
    case 'rg':
      if (digits.length >= 5) {
        return `***${digits.slice(3)}`
      }
      break
  }

  return document
}
