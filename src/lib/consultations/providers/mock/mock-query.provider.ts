/**
 * Mock Query Provider
 * Etapa 9.3.2 - Provider Interface & Mock
 * Atualizado na Etapa 9.18 - Provider determinístico e configurável
 *
 * Implementação mock do provider para desenvolvimento e testes.
 * Simula consultas sem conectar a APIs externas.
 *
 * ⚠️ ATENÇÃO: Este provider retorna DADOS SIMULADOS.
 * NÃO utilize em produção. NÃO apresente como dados reais do INSS.
 *
 * CENÁRIOS CONFIGURÁVEIS:
 * - success: retorna dados simulados
 * - error: retorna erro simulado
 * - timeout: simula timeout
 * - invalid_response: retorna resposta inválida
 */

import type {
  QueryRequest,
  QueryResult,
  ProviderCapability,
  ProviderType,
} from '../../types'
import type { IQueryProvider } from '../query-provider.interface'
import { getMockData, simulateDelay, generateDeterministicScore } from './mock-data'
import { generateMockDocument } from './mock-document'

/**
 * Cenários de teste para o Mock Provider
 */
export type MockScenario = 'success' | 'error' | 'timeout' | 'invalid_response'

/**
 * Configuração do Mock Provider
 */
export interface MockProviderConfig {
  /** Delay simulado em ms (padrão: 0 para testes) */
  simulatedDelay?: number
  /**
   * Cenário forçado (para testes determinísticos)
   * Quando definido, ignora successRate e sempre retorna este cenário
   */
  scenario?: MockScenario
  /**
   * @deprecated Use scenario: 'error' em vez de successRate
   * Mantido apenas para compatibilidade
   */
  successRate?: number
}

/**
 * Mock Query Provider
 *
 * Implementa IQueryProvider para simulação de consultas.
 * Utilizado em desenvolvimento e testes.
 *
 * COMPORTAMENTO DETERMINÍSTICO:
 * - Quando scenario é definido, sempre retorna o mesmo resultado
 * - Dados são sempre os mesmos para o mesmo input
 * - Não usa Math.random() internamente
 *
 * @example
 * ```typescript
 * // Sucesso (padrão)
 * const provider = new MockQueryProvider()
 *
 * // Erro forçado
 * const errorProvider = new MockQueryProvider({ scenario: 'error' })
 *
 * // Timeout forçado
 * const timeoutProvider = new MockQueryProvider({ scenario: 'timeout' })
 * ```
 */
export class MockQueryProvider implements IQueryProvider {
  readonly name: string = 'Mock Provider'
  readonly type: ProviderType = 'mock'
  readonly active: boolean = true

  private config: MockProviderConfig
  private initialized: boolean = false

  constructor(config?: MockProviderConfig) {
    this.config = {
      simulatedDelay: 0,
      ...config,
    }
  }

  /**
   * Inicializa o provider
   */
  async initialize(): Promise<void> {
    this.initialized = true
  }

  /**
   * Verifica se o provider está pronto
   */
  isReady(): boolean {
    return this.initialized
  }

  /**
   * Executa uma consulta mock
   *
   * COMPORTAMENTO:
   * 1. Valida a requisição
   * 2. Simula delay (se configurado)
   * 3. Verifica cenário forçado
   * 4. Retorna dados ou erro conforme cenário
   *
   * @param request - Dados da consulta
   * @returns Resultado simulado
   */
  async execute(request: QueryRequest): Promise<QueryResult> {
    // Valida a requisição primeiro
    if (!this.validate(request)) {
      return {
        success: false,
        rawData: {},
        error: 'Requisição inválida para este provider',
        errorCode: 'INVALID_REQUEST',
      }
    }

    // Simula delay de rede
    await simulateDelay(this.config.simulatedDelay || 0)

    // Verifica cenário forçado
    const scenario = this.config.scenario

    // Cenário: timeout
    if (scenario === 'timeout') {
      return {
        success: false,
        rawData: {
          _mock: true,
          _environment: 'development',
          _scenario: 'timeout',
        },
        error: 'Timeout na consulta (simulado)',
        errorCode: 'TIMEOUT',
      }
    }

    // Cenário: erro
    if (scenario === 'error') {
      return {
        success: false,
        rawData: {
          _mock: true,
          _environment: 'development',
          _scenario: 'error',
        },
        error: 'Erro simulado no provider mock',
        errorCode: 'MOCK_ERROR',
      }
    }

    // Cenário: resposta inválida
    if (scenario === 'invalid_response') {
      return {
        success: true, // Marca como sucesso mas com dados inválidos
        rawData: {
          _mock: true,
          _environment: 'development',
          _scenario: 'invalid_response',
          _invalid: true,
          // Dados malformados intencionalmente
          dados: null,
          codigoRetorno: 'INVALID',
        },
        error: undefined,
        errorCode: undefined,
      }
    }

    // Cenário: sucesso (padrão)
    // Obtém dados mockados (determinístico)
    const mockData = getMockData(request.queryType, request.document)

    if (!mockData) {
      return {
        success: false,
        rawData: {
          _mock: true,
          _environment: 'development',
        },
        error: 'Nenhum dado encontrado para este documento',
        errorCode: 'NOT_FOUND',
      }
    }

    // Adiciona identificação de mock aos dados
    const rawDataWithMeta = {
      ...(mockData as Record<string, unknown>),
      _mock: true,
      _mock_warning: 'DADOS SIMULADOS - NÃO UTILIZAR COMO DADOS REAIS',
      _environment: 'development',
      _provider: 'mock',
      _scenario: 'success',
      _timestamp: '2024-01-01T00:00:00.000Z', // Timestamp fixo para determinismo
    }

    // Gera documento mock (com ID determinístico)
    const mockDocument = generateMockDocument(
      `mock_${request.queryType}_${request.document}`,
      request.queryType,
      request.document
    )

    // Retorna resultado simulado
    return {
      success: true,
      rawData: {
        ...rawDataWithMeta,
        _document: mockDocument,
      },
      processedData: this.processData(request.queryType, mockData as Record<string, unknown>),
      score: generateDeterministicScore(request.queryType, request.document),
    }
  }

  /**
   * Valida se a requisição pode ser processada
   *
   * @param request - Dados da consulta
   * @returns true se válida
   */
  validate(request: QueryRequest): boolean {
    // Verifica se o provider está ativo
    if (!this.active) {
      return false
    }

    // Verifica campos obrigatórios
    if (!request.document || !request.documentType || !request.queryType) {
      return false
    }

    // Normaliza o documento
    const document = request.document.replace(/\D/g, '')

    // Valida por tipo de documento
    switch (request.documentType) {
      case 'cpf':
        return document.length === 11
      case 'cnpj':
        return document.length === 14
      case 'rg':
        return document.length >= 5 && document.length <= 12
      default:
        return false
    }
  }

  /**
   * Retorna as capacidades do provider
   */
  getCapabilities(): ProviderCapability[] {
    return [
      {
        queryType: 'cpf',
        supportedDocumentTypes: ['cpf'],
        description: 'Consulta de dados cadastrais por CPF (MOCK)',
      },
      {
        queryType: 'inss',
        supportedDocumentTypes: ['cpf'],
        description: 'Consulta de benefícios do INSS (MOCK)',
      },
      {
        queryType: 'fgts',
        supportedDocumentTypes: ['cpf'],
        description: 'Consulta de saldo e movimentações do FGTS (MOCK)',
      },
      {
        queryType: 'telefone',
        supportedDocumentTypes: ['cpf'],
        description: 'Consulta de dados de telefone (MOCK)',
      },
      {
        queryType: 'limpa_nome',
        supportedDocumentTypes: ['cpf'],
        description: 'Consulta de restrições e negativações (MOCK)',
      },
    ]
  }

  /**
   * Obtém o cenário configurado
   */
  getScenario(): MockScenario | undefined {
    return this.config.scenario
  }

  /**
   * Processa os dados brutos para exibição
   */
  private processData(
    queryType: string,
    rawData: Record<string, unknown>
  ): Record<string, unknown> {
    const processed: Record<string, unknown> = {
      ...rawData,
      _processedAt: '2024-01-01T00:00:00.000Z', // Timestamp fixo
      _providerType: 'mock',
      _environment: 'development',
    }

    // Processamento específico por tipo
    if (queryType === 'cpf' && rawData.nome) {
      processed.nomeFormatado = String(rawData.nome).toLowerCase()
    }

    if (queryType === 'fgts' && typeof rawData.saldoAtual === 'number') {
      processed.saldoFormatado = `R$ ${rawData.saldoAtual.toFixed(2).replace('.', ',')}`
    }

    if (queryType === 'limpa_nome' && typeof rawData.valorTotalRestricao === 'number') {
      processed.valorFormatado = `R$ ${rawData.valorTotalRestricao.toFixed(2).replace('.', ',')}`
    }

    return processed
  }
}
