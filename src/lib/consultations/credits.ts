/**
 * Credits System
 * Etapa 9.18 - Fortalecimento do Motor de Consultas
 *
 * Sistema de créditos para controle de consultas.
 * Preparado para uso futuro, mas NÃO implementa cobrança real.
 *
 * REGRAS:
 * 1. Consulta que falha ANTES de ser processada NÃO consome crédito
 * 2. Consulta concluída registra consumo
 * 3. Erro após processamento pode gerar refund
 * 4. Mock queries NÃO consomem créditos
 */

import type { QueryType } from './types'
import type { ProviderType } from './types'

// ============================================================================
// TYPES
// ============================================================================

/**
 * Status de uma transação de crédito
 */
export type CreditTransactionStatus = 'pending' | 'completed' | 'refunded' | 'cancelled'

/**
 * Tipo de transação de crédito
 */
export type CreditTransactionType = 'debit' | 'refund' | 'grant' | 'expiry'

/**
 * Transação de crédito
 */
export interface CreditTransaction {
  /** ID da transação */
  id: string

  /** ID do usuário */
  userId: string

  /** ID da consulta (se aplicável) */
  consultationId?: string

  /** Tipo da transação */
  type: CreditTransactionType

  /** Quantidade de créditos (positivo = ganho, negativo = gasto) */
  amount: number

  /** Saldo após a transação */
  balanceAfter: number

  /** Provider que utilizou o crédito */
  providerType?: ProviderType

  /** Tipo de consulta */
  queryType?: QueryType

  /** Custo real do provider (em centavos) */
  providerCost?: number

  /** Status da transação */
  status: CreditTransactionStatus

  /** Descrição da transação */
  description: string

  /** Metadata adicional */
  metadata?: Record<string, unknown>

  /** Data de criação */
  createdAt: Date

  /** Data de conclusão */
  completedAt?: Date

  /** Data de refund (se aplicável) */
  refundedAt?: Date
}

/**
 * Saldo de créditos do usuário
 */
export interface CreditBalance {
  /** ID do usuário */
  userId: string

  /** Saldo atual */
  balance: number

  /** Total de créditos utilizados */
  totalUsed: number

  /** Total de créditos concedidos */
  totalGranted: number

  /** Total de refunds */
  totalRefunded: number

  /** Data da última atualização */
  lastUpdated: Date
}

/**
 * Configuração de custo por tipo de consulta
 */
export interface QueryCostConfig {
  /** Tipo de consulta */
  queryType: QueryType

  /** Custo base (em centavos) */
  baseCost: number

  /** Provider type */
  providerType: ProviderType

  /** Se está habilitado */
  enabled: boolean

  /** Descrição */
  description: string
}

/**
 * Resultado de verificação de crédito
 */
export interface CreditCheckResult {
  /** Se há créditos suficientes */
  sufficient: boolean

  /** Saldo atual */
  currentBalance: number

  /** Custo da consulta */
  requiredCredits: number

  /** Créditos faltantes (se insuficiente) */
  deficit: number

  /** Mensagem */
  message: string
}

// ============================================================================
// CREDITS SERVICE
// ============================================================================

/**
 * CreditsService
 *
 * Service para gerenciamento de créditos.
 * NÃO implementa cobrança real - apenas estrutura e controle.
 *
 * @example
 * ```typescript
 * const credits = new CreditsService()
 *
 * // Verificar saldo
 * const check = await credits.checkBalance(userId, 'cpf', 'serasa')
 * if (!check.sufficient) {
 *   throw new Error('Créditos insuficientes')
 * }
 *
 * // Debitar créditos
 * const transaction = await credits.debit(userId, {
 *   consultationId: '123',
 *   queryType: 'cpf',
 *   providerType: 'serasa',
 *   amount: 1,
 * })
 *
 * // Refund em caso de erro
 * await credits.refund(transaction.id, 'Erro no provider')
 * ```
 */
export class CreditsService {
  /** Configuração de custos por consulta */
  private costConfig: Map<string, QueryCostConfig> = new Map()

  /** Transações em memória (para desenvolvimento) */
  private transactions: Map<string, CreditTransaction> = new Map()

  /** Saldos em memória (para desenvolvimento) */
  private balances: Map<string, CreditBalance> = new Map()

  constructor() {
    this.initializeDefaultCosts()
  }

  // ============================================================================
  // INITIALIZATION
  // ============================================================================

  /**
   * Inicializa configuração de custos padrão
   */
  private initializeDefaultCosts(): void {
    const defaultCosts: QueryCostConfig[] = [
      {
        queryType: 'cpf',
        baseCost: 0, // Mock é gratuito
        providerType: 'mock',
        enabled: true,
        description: 'Consulta CPF (Mock)',
      },
      {
        queryType: 'inss',
        baseCost: 0,
        providerType: 'mock',
        enabled: true,
        description: 'Consulta INSS (Mock)',
      },
      {
        queryType: 'fgts',
        baseCost: 0,
        providerType: 'mock',
        enabled: true,
        description: 'Consulta FGTS (Mock)',
      },
      {
        queryType: 'telefone',
        baseCost: 0,
        providerType: 'mock',
        enabled: true,
        description: 'Consulta Telefone (Mock)',
      },
      {
        queryType: 'limpa_nome',
        baseCost: 0,
        providerType: 'mock',
        enabled: true,
        description: 'Consulta Limpa Nome (Mock)',
      },
      // Providers reais (configuráveis futuramente)
      {
        queryType: 'cpf',
        baseCost: 100, // R$ 1,00
        providerType: 'serasa',
        enabled: false, // Desabilitado até ter credenciais
        description: 'Consulta CPF (Serasa)',
      },
      {
        queryType: 'limpa_nome',
        baseCost: 150, // R$ 1,50
        providerType: 'serasa',
        enabled: false,
        description: 'Consulta Limpa Nome (Serasa)',
      },
    ]

    defaultCosts.forEach((config) => {
      const key = `${config.queryType}_${config.providerType}`
      this.costConfig.set(key, config)
    })
  }

  // ============================================================================
  // COST CONFIGURATION
  // ============================================================================

  /**
   * Obtém custo de uma consulta
   *
   * @param queryType - Tipo de consulta
   * @param providerType - Tipo do provider
   * @returns Custo em centavos ou null se não configurado
   */
  getQueryCost(queryType: QueryType, providerType: ProviderType): number | null {
    const key = `${queryType}_${providerType}`
    const config = this.costConfig.get(key)
    return config?.enabled ? config.baseCost : null
  }

  /**
   * Configura custo de uma consulta
   */
  setQueryCost(config: QueryCostConfig): void {
    const key = `${config.queryType}_${config.providerType}`
    this.costConfig.set(key, config)
  }

  /**
   * Lista configurações de custo
   */
  listCostConfigs(): QueryCostConfig[] {
    return Array.from(this.costConfig.values())
  }

  // ============================================================================
  // BALANCE
  // ============================================================================

  /**
   * Obtém saldo do usuário
   *
   * @param userId - ID do usuário
   * @returns Saldo atual
   */
  async getBalance(userId: string): Promise<CreditBalance> {
    const existing = this.balances.get(userId)
    if (existing) {
      return existing
    }

    // Cria saldo inicial (para desenvolvimento)
    const initialBalance: CreditBalance = {
      userId,
      balance: 1000, // 1000 créditos iniciais para dev
      totalUsed: 0,
      totalGranted: 1000,
      totalRefunded: 0,
      lastUpdated: new Date(),
    }

    this.balances.set(userId, initialBalance)
    return initialBalance
  }

  /**
   * Verifica se há créditos suficientes
   *
   * @param userId - ID do usuário
   * @param queryType - Tipo de consulta
   * @param providerType - Tipo do provider
   * @returns Resultado da verificação
   */
  async checkBalance(
    userId: string,
    queryType: QueryType,
    providerType: ProviderType
  ): Promise<CreditCheckResult> {
    const balance = await this.getBalance(userId)
    const cost = this.getQueryCost(queryType, providerType)

    if (cost === null) {
      return {
        sufficient: false,
        currentBalance: balance.balance,
        requiredCredits: 0,
        deficit: 0,
        message: 'Consulta não disponível para este provider',
      }
    }

    // Mock queries são gratuitas
    if (providerType === 'mock') {
      return {
        sufficient: true,
        currentBalance: balance.balance,
        requiredCredits: 0,
        deficit: 0,
        message: 'Consulta mock - sem custo',
      }
    }

    const deficit = Math.max(0, cost - balance.balance)

    return {
      sufficient: balance.balance >= cost,
      currentBalance: balance.balance,
      requiredCredits: cost,
      deficit,
      message:
        deficit > 0
          ? `Créditos insuficientes. Necessário: ${cost}, Disponível: ${balance.balance}`
          : 'Créditos suficientes',
    }
  }

  // ============================================================================
  // TRANSACTIONS
  // ============================================================================

  /**
   * Debita créditos
   *
   * @param userId - ID do usuário
   * @param params - Parâmetros do débito
   * @returns Transação criada
   */
  async debit(
    userId: string,
    params: {
      consultationId: string
      queryType: QueryType
      providerType: ProviderType
      amount: number
      providerCost?: number
    }
  ): Promise<CreditTransaction> {
    const balance = await this.getBalance(userId)

    // Mock queries não debitam
    if (params.providerType === 'mock') {
      const transaction: CreditTransaction = {
        id: `txn_${Date.now()}_${Math.random().toString(36).slice(2, 9)}`,
        userId,
        consultationId: params.consultationId,
        type: 'debit',
        amount: 0,
        balanceAfter: balance.balance,
        providerType: params.providerType,
        queryType: params.queryType,
        providerCost: 0,
        status: 'completed',
        description: 'Consulta mock - sem custo',
        createdAt: new Date(),
        completedAt: new Date(),
      }

      this.transactions.set(transaction.id, transaction)
      return transaction
    }

    // Atualiza saldo
    balance.balance -= params.amount
    balance.totalUsed += params.amount
    balance.lastUpdated = new Date()
    this.balances.set(userId, balance)

    // Cria transação
    const transaction: CreditTransaction = {
      id: `txn_${Date.now()}_${Math.random().toString(36).slice(2, 9)}`,
      userId,
      consultationId: params.consultationId,
      type: 'debit',
      amount: -params.amount,
      balanceAfter: balance.balance,
      providerType: params.providerType,
      queryType: params.queryType,
      providerCost: params.providerCost,
      status: 'completed',
      description: `Consulta ${params.queryType} via ${params.providerType}`,
      createdAt: new Date(),
      completedAt: new Date(),
    }

    this.transactions.set(transaction.id, transaction)
    return transaction
  }

  /**
   * Realiza refund de créditos
   *
   * @param transactionId - ID da transação original
   * @param reason - Motivo do refund
   * @returns Transação de refund
   */
  async refund(
    transactionId: string,
    reason: string
  ): Promise<CreditTransaction | null> {
    const original = this.transactions.get(transactionId)
    if (!original || original.type !== 'debit') {
      return null
    }

    // Mock transactions não podem ser refundadas (não debitaram nada)
    if (original.providerType === 'mock') {
      return null
    }

    // Verifica se já foi refundado
    if (original.status === 'refunded') {
      return null
    }

    const balance = await this.getBalance(original.userId)

    // Restaura saldo
    const refundAmount = Math.abs(original.amount)
    balance.balance += refundAmount
    balance.totalRefunded += refundAmount
    balance.lastUpdated = new Date()
    this.balances.set(original.userId, balance)

    // Atualiza transação original
    original.status = 'refunded'
    original.refundedAt = new Date()

    // Cria transação de refund
    const refundTransaction: CreditTransaction = {
      id: `txn_refund_${Date.now()}_${Math.random().toString(36).slice(2, 9)}`,
      userId: original.userId,
      consultationId: original.consultationId,
      type: 'refund',
      amount: refundAmount,
      balanceAfter: balance.balance,
      providerType: original.providerType,
      queryType: original.queryType,
      status: 'completed',
      description: `Refund: ${reason}`,
      createdAt: new Date(),
      completedAt: new Date(),
      metadata: {
        originalTransactionId: transactionId,
        reason,
      },
    }

    this.transactions.set(refundTransaction.id, refundTransaction)
    return refundTransaction
  }

  /**
   * Lista transações do usuário
   */
  async listTransactions(
    userId: string,
    options?: {
      limit?: number
      offset?: number
      type?: CreditTransactionType
    }
  ): Promise<CreditTransaction[]> {
    const transactions = Array.from(this.transactions.values())
      .filter((t) => t.userId === userId)
      .filter((t) => !options?.type || t.type === options.type)
      .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())

    const offset = options?.offset || 0
    const limit = options?.limit || 50

    return transactions.slice(offset, offset + limit)
  }

  // ============================================================================
  // HELPERS
  // ============================================================================

  /**
   * Gera ID de transação
   */
  private generateTransactionId(): string {
    return `txn_${Date.now()}_${Math.random().toString(36).slice(2, 9)}`
  }

  /**
   * Limpa dados (para testes)
   */
  clear(): void {
    this.transactions.clear()
    this.balances.clear()
  }
}

// ============================================================================
// SINGLETON
// ============================================================================

let creditsServiceInstance: CreditsService | null = null

/**
 * Obtém instância do CreditsService
 */
export function getCreditsService(): CreditsService {
  if (!creditsServiceInstance) {
    creditsServiceInstance = new CreditsService()
  }
  return creditsServiceInstance
}

/**
 * Reseta instância (para testes)
 */
export function resetCreditsService(): void {
  creditsServiceInstance = null
}
