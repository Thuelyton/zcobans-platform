/**
 * INSS Consultation Service
 * ZCobans - Service layer para consultas INSS/CNIS
 *
 * ATENÇÃO: Esta é uma implementação MOCK para desenvolvimento.
 * Não integra com APIs reais do INSS.
 * Preparado para integração futura.
 */

import type {
  CreateINSSInput,
  ConsultaINSS,
  INSSConsultationFilters,
  INSSConsultationStats,
} from './inss-types'
import { CONSULTATION_COST, type ConsultationStatus } from './constants'

// ============================================================================
// MOCK DATA STORE
// ============================================================================

const mockConsultations: Map<string, ConsultaINSS> = new Map()

// ============================================================================
// HELPER FUNCTIONS
// ============================================================================

function generateId(): string {
  return `cons_${Date.now()}_${Math.random().toString(36).slice(2, 9)}`
}

function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms))
}

// ============================================================================
// SERVICE IMPLEMENTATION
// ============================================================================

/**
 * Service de consultas INSS/CNIS
 *
 * ATENÇÃO: Implementação MOCK - não conecta com APIs reais
 */
export class INSSService {
  /**
   * Cria uma nova consulta INSS
   *
   * @param input - Dados da consulta
   * @returns Consulta criada com status PENDENTE
   */
  async createConsulta(input: CreateINSSInput): Promise<ConsultaINSS> {
    // Validação básica
    if (!input.document || !input.queryType) {
      throw new Error('Documento e tipo de consulta são obrigatórios')
    }

    const documentDigits = input.document.replace(/\D/g, '')
    if (documentDigits.length < 11) {
      throw new Error('Documento inválido')
    }

    // Cria a consulta
    const consulta: ConsultaINSS = {
      id: generateId(),
      document: documentDigits,
      documentType: input.documentType || (documentDigits.length === 11 ? 'cpf' : 'cnpj'),
      queryType: input.queryType,
      status: 'PENDENTE',
      cost: CONSULTATION_COST,
      qrCode: input.qrCode || false,
      clientName: input.clientName,
      createdAt: new Date().toISOString(),
      pdfUrl: null,
    }

    // Salva no mock store
    mockConsultations.set(consulta.id, consulta)

    // Simula processamento assíncrono
    this.simulateProcessing(consulta.id)

    return consulta
  }

  /**
   * Lista consultas com filtros
   *
   * @param filters - Filtros opcionais
   * @returns Lista de consultas
   */
  async listConsultations(filters?: INSSConsultationFilters): Promise<ConsultaINSS[]> {
    let consultations = Array.from(mockConsultations.values())

    // Aplica filtros
    if (filters) {
      if (filters.status) {
        consultations = consultations.filter((c) => c.status === filters.status)
      }
      if (filters.queryType) {
        consultations = consultations.filter((c) => c.queryType === filters.queryType)
      }
      if (filters.documentType) {
        consultations = consultations.filter((c) => c.documentType === filters.documentType)
      }
      if (filters.search) {
        const search = filters.search.replace(/\D/g, '')
        consultations = consultations.filter((c) => c.document.includes(search))
      }
    }

    // Ordena por data de criação (mais recente primeiro)
    return consultations.sort(
      (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    )
  }

  /**
   * Obtém uma consulta por ID
   *
   * @param id - ID da consulta
   * @returns Consulta ou null
   */
  async getConsultaById(id: string): Promise<ConsultaINSS | null> {
    return mockConsultations.get(id) || null
  }

  /**
   * Obtém estatísticas das consultas
   *
   * @returns Estatísticas
   */
  async getStats(): Promise<INSSConsultationStats> {
    const consultations = Array.from(mockConsultations.values())

    return {
      total: consultations.length,
      pending: consultations.filter((c) => c.status === 'PENDENTE').length,
      processing: consultations.filter((c) => c.status === 'PROCESSANDO').length,
      completed: consultations.filter((c) => c.status === 'CONCLUIDO').length,
      error: consultations.filter((c) => c.status === 'ERRO').length,
      cancelled: consultations.filter((c) => c.status === 'CANCELADO').length,
    }
  }

  /**
   * Cancela uma consulta
   *
   * @param id - ID da consulta
   * @returns true se cancelada, false se não encontrada
   */
  async cancelConsulta(id: string): Promise<boolean> {
    const consulta = mockConsultations.get(id)
    if (!consulta) return false

    if (consulta.status === 'PENDENTE' || consulta.status === 'PROCESSANDO') {
      consulta.status = 'CANCELADO'
      mockConsultations.set(id, consulta)
      return true
    }

    return false
  }

  /**
   * Obtém URL do PDF (preparado para integração futura)
   *
   * @param id - ID da consulta
   * @returns URL do PDF ou null
   */
  async getPdfUrl(id: string): Promise<string | null> {
    const consulta = mockConsultations.get(id)
    if (!consulta) return null

    // Por enquanto retorna null (sem PDF real)
    // Quando integrar com API real, retornará a URL do PDF
    return consulta.pdfUrl || null
  }

  // ============================================================================
  // MOCK PROCESSING
  // ============================================================================

  /**
   * Simula o processamento de uma consulta (MOCK)
   * Em produção, isso seria substituído por webhook ou polling da API real
   */
  private async simulateProcessing(consultaId: string): Promise<void> {
    await sleep(2000) // Simula 2 segundos de processamento

    const consulta = mockConsultations.get(consultaId)
    if (!consulta || consulta.status !== 'PENDENTE') return

    // Muda para PROCESSANDO
    consulta.status = 'PROCESSANDO'
    mockConsultations.set(consultaId, consulta)

    await sleep(3000) // Mais 3 segundos

    // Finaliza (90% sucesso, 10% erro para teste)
    const consultation = mockConsultations.get(consultaId)
    if (!consultation || consultation.status !== 'PROCESSANDO') return

    const success = Math.random() > 0.1
    if (success) {
      consultation.status = 'CONCLUIDO'
      consultation.completedAt = new Date().toISOString()
      // Por enquanto sem PDF real
      consultation.pdfUrl = null
    } else {
      consultation.status = 'ERRO'
      consultation.errorMessage = 'Erro simulado no processamento'
    }

    mockConsultations.set(consultaId, consultation)
  }
}

// ============================================================================
// SINGLETON INSTANCE
// ============================================================================

let serviceInstance: INSSService | null = null

/**
 * Obtém a instância do service
 */
export function getINSSService(): INSSService {
  if (!serviceInstance) {
    serviceInstance = new INSSService()
  }
  return serviceInstance
}

/**
 * Reseta a instância (para testes)
 */
export function resetINSSService(): void {
  serviceInstance = null
  mockConsultations.clear()
}
