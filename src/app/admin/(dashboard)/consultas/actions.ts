'use server'

/**
 * Server Actions para Consultas
 * Integração com CPFHub API
 */

import { CPFHubProvider } from '@/lib/consultations/providers/cpfhub'

interface ConsultationInput {
  client_name: string
  client_document: string
  document_type: 'cpf' | 'cnpj' | 'rg'
  query_type: string
  metadata?: Record<string, unknown>
}

interface ActionResult {
  success: boolean
  data?: Record<string, unknown>
  error?: string
  provider?: string
}

/**
 * Cria uma nova consulta
 */
export async function createConsultation(input: ConsultationInput): Promise<ActionResult> {
  try {
    // Validação básica
    if (!input.client_name || input.client_name.trim().length === 0) {
      return {
        success: false,
        error: 'Nome do cliente é obrigatório',
      }
    }

    if (!input.client_document) {
      return {
        success: false,
        error: 'Documento é obrigatório',
      }
    }

    // Normaliza o documento
    const documentDigits = input.client_document.replace(/\D/g, '')

    if (documentDigits.length < 11) {
      return {
        success: false,
        error: 'CPF deve ter 11 dígitos',
      }
    }

    // Para consultas CPF, usa o CPFHub provider
    if (input.query_type === 'cpf' && input.document_type === 'cpf') {
      const provider = new CPFHubProvider()
      await provider.initialize()

      if (!provider.isReady()) {
        return {
          success: false,
          error: 'Provider CPFHub não está configurado. Verifique as variáveis de ambiente.',
        }
      }

      // Valida a requisição
      const isValid = provider.validate({
        document: documentDigits,
        documentType: 'cpf',
        queryType: 'cpf',
      })

      if (!isValid) {
        return {
          success: false,
          error: 'CPF inválido',
        }
      }

      // Executa a consulta
      const result = await provider.execute({
        document: documentDigits,
        documentType: 'cpf',
        queryType: 'cpf',
      })

      if (result.success) {
        return {
          success: true,
          data: result.rawData,
          provider: 'CPFHub',
        }
      } else {
        return {
          success: false,
          error: result.error || 'Erro ao consultar CPF',
        }
      }
    }

    // Para outros tipos de consulta, retorna erro por enquanto
    return {
      success: false,
      error: `Tipo de consulta "${input.query_type}" ainda não disponível`,
    }
  } catch (error) {
    console.error('[CONSULTATION] Erro:', error)
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Erro interno',
    }
  }
}
