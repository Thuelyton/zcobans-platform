/**
 * Mock Query Provider
 * Etapa 9.3.2 - Provider Interface & Mock
 *
 * Implementação mock do provider para desenvolvimento e testes.
 * Simula consultas sem conectar a APIs externas.
 */

import type {
  QueryRequest,
  QueryResult,
  ProviderCapability,
  ProviderType,
} from '../../types'
import type { IQueryProvider } from '../query-provider.interface'
import { getMockData, simulateDelay, generateRandomScore } from './mock-data'

/**
 * Configuração do Mock Provider
 */
export interface MockProviderConfig {
  /** Delay simulado em ms (padrão: 500) */
  simulatedDelay?: number
  /** Taxa de sucesso simulada 0-100 (padrão: 95) */
  successRate?: number
}

/**
 * Mock Query Provider
 *
 * Implementa IQueryProvider para simulação de consultas.
 * Utilizado em desenvolvimento e testes.
 *
 * @example
 * ```typescript
 * const provider = new MockQueryProvider()
 * const result = await provider.execute({
 *   document: '12345678901',
 *   documentType: 'cpf',
 *   queryType: 'cpf',
 * })
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
      simulatedDelay: 500,
      successRate: 95,
      ...config,
    }
  }

  /**
   * Inicializa o provider
   */
  async initialize(): Promise<void> {
    // Mock provider não precisa de inicialização real
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
    await simulateDelay(this.config.simulatedDelay || 500)

    // Simula taxa de erro
    const shouldSucceed = Math.random() * 100 < (this.config.successRate || 95)

    if (!shouldSucceed) {
      return {
        success: false,
        rawData: {},
        error: 'Erro simulado no provider mock',
        errorCode: 'MOCK_ERROR',
      }
    }

    // Obtém dados mockados
    const mockData = getMockData(request.queryType, request.document)

    if (!mockData) {
      return {
        success: false,
        rawData: {},
        error: 'Nenhum dado encontrado para este documento',
        errorCode: 'NOT_FOUND',
      }
    }

    // Retorna resultado simulado
    return {
      success: true,
      rawData: mockData as Record<string, unknown>,
      processedData: this.processData(request.queryType, mockData as Record<string, unknown>),
      score: generateRandomScore(),
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
        // CPF deve ter 11 dígitos
        return document.length === 11

      case 'cnpj':
        // CNPJ deve ter 14 dígitos
        return document.length === 14

      case 'rg':
        // RG deve ter entre 5 e 12 dígitos
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
        description: 'Consulta de dados cadastrais por CPF',
      },
      {
        queryType: 'inss',
        supportedDocumentTypes: ['cpf'],
        description: 'Consulta de benefícios do INSS',
      },
      {
        queryType: 'fgts',
        supportedDocumentTypes: ['cpf'],
        description: 'Consulta de saldo e movimentações do FGTS',
      },
      {
        queryType: 'telefone',
        supportedDocumentTypes: ['cpf'],
        description: 'Consulta de dados de telefone',
      },
      {
        queryType: 'limpa_nome',
        supportedDocumentTypes: ['cpf'],
        description: 'Consulta de restrições e negativações',
      },
    ]
  }

  /**
   * Processa os dados brutos para exibição
   *
   * @param queryType - Tipo da consulta
   * @param rawData - Dados brutos
   * @returns Dados processados
   */
  private processData(
    queryType: string,
    rawData: Record<string, unknown>
  ): Record<string, unknown> {
    // Processamento básico - em produção, cada provider teria seu processamento
    const processed: Record<string, unknown> = {
      ...rawData,
      _processedAt: new Date().toISOString(),
      _providerType: 'mock',
    }

    // Adiciona campos formatados conforme o tipo
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
