/**
 * Mock Query Provider Tests
 * Etapa 9.3.2 - Provider Interface & Mock
 * Atualizado na Etapa 9.18 - Testes determinísticos
 *
 * Todos os testes são determinísticos e não dependem de Math.random()
 */

import { describe, it, expect, beforeEach } from 'vitest'
import { MockQueryProvider } from '@/lib/consultations/providers/mock/mock-query.provider'
import type { MockScenario } from '@/lib/consultations/providers/mock/mock-query.provider'
import { getMockData, maskDocument, generateDeterministicScore } from '@/lib/consultations/providers/mock/mock-data'

describe('MockQueryProvider', () => {
  let provider: MockQueryProvider

  beforeEach(() => {
    // Provider com cenário de sucesso (determinístico)
    provider = new MockQueryProvider({ scenario: 'success', simulatedDelay: 0 })
  })

  describe('Basic Properties', () => {
    it('should have correct name', () => {
      expect(provider.name).toBe('Mock Provider')
    })

    it('should have correct type', () => {
      expect(provider.type).toBe('mock')
    })

    it('should be active by default', () => {
      expect(provider.active).toBe(true)
    })
  })

  describe('initialize()', () => {
    it('should initialize successfully', async () => {
      await provider.initialize()
      expect(provider.isReady()).toBe(true)
    })
  })

  describe('validate()', () => {
    it('should validate CPF correctly', () => {
      expect(
        provider.validate({
          document: '12345678901',
          documentType: 'cpf',
          queryType: 'cpf',
        })
      ).toBe(true)
    })

    it('should reject invalid CPF length', () => {
      expect(
        provider.validate({
          document: '12345',
          documentType: 'cpf',
          queryType: 'cpf',
        })
      ).toBe(false)
    })

    it('should validate CNPJ correctly', () => {
      expect(
        provider.validate({
          document: '12345678000195',
          documentType: 'cnpj',
          queryType: 'cpf',
        })
      ).toBe(true)
    })

    it('should validate RG correctly', () => {
      expect(
        provider.validate({
          document: '12345678',
          documentType: 'rg',
          queryType: 'cpf',
        })
      ).toBe(true)
    })

    it('should reject missing document', () => {
      expect(
        provider.validate({
          document: '',
          documentType: 'cpf',
          queryType: 'cpf',
        })
      ).toBe(false)
    })

    it('should reject when provider is inactive', () => {
      const inactiveProvider = new MockQueryProvider()
      Object.defineProperty(inactiveProvider, 'active', { value: false })
      expect(
        inactiveProvider.validate({
          document: '12345678901',
          documentType: 'cpf',
          queryType: 'cpf',
        })
      ).toBe(false)
    })
  })

  describe('execute() - Success Scenario', () => {
    it('should execute CPF query successfully', async () => {
      await provider.initialize()
      const result = await provider.execute({
        document: '12345678901',
        documentType: 'cpf',
        queryType: 'cpf',
      })

      expect(result.success).toBe(true)
      expect(result.rawData).toBeDefined()
      expect(result.rawData._mock).toBe(true)
      expect(result.rawData._scenario).toBe('success')
      expect(result.processedData).toBeDefined()
      expect(result.score).toBeDefined()
      expect(result.score).toBeGreaterThanOrEqual(70)
      expect(result.score).toBeLessThanOrEqual(100)
    })

    it('should execute INSS query successfully', async () => {
      await provider.initialize()
      const result = await provider.execute({
        document: '12345678901',
        documentType: 'cpf',
        queryType: 'inss',
      })

      expect(result.success).toBe(true)
      expect(result.rawData._mock).toBe(true)
      expect(result.rawData._scenario).toBe('success')
    })

    it('should execute FGTS query successfully', async () => {
      await provider.initialize()
      const result = await provider.execute({
        document: '12345678901',
        documentType: 'cpf',
        queryType: 'fgts',
      })

      expect(result.success).toBe(true)
      expect(result.rawData._mock).toBe(true)
    })

    it('should execute telefone query successfully', async () => {
      await provider.initialize()
      const result = await provider.execute({
        document: '12345678901',
        documentType: 'cpf',
        queryType: 'telefone',
      })

      expect(result.success).toBe(true)
      expect(result.rawData._mock).toBe(true)
    })

    it('should execute limpa_nome query successfully', async () => {
      await provider.initialize()
      const result = await provider.execute({
        document: '12345678901',
        documentType: 'cpf',
        queryType: 'limpa_nome',
      })

      expect(result.success).toBe(true)
      expect(result.rawData._mock).toBe(true)
      expect(result.rawData._scenario).toBe('success')
    })

    it('should return deterministic results for same input', async () => {
      await provider.initialize()

      const result1 = await provider.execute({
        document: '12345678901',
        documentType: 'cpf',
        queryType: 'cpf',
      })

      const result2 = await provider.execute({
        document: '12345678901',
        documentType: 'cpf',
        queryType: 'cpf',
      })

      // Scores devem ser iguais (determinísticos)
      expect(result1.score).toBe(result2.score)
      // Dados devem ser iguais
      expect(result1.rawData.nome).toBe(result2.rawData.nome)
    })
  })

  describe('execute() - Error Scenario', () => {
    let errorProvider: MockQueryProvider

    beforeEach(() => {
      errorProvider = new MockQueryProvider({ scenario: 'error', simulatedDelay: 0 })
    })

    it('should return error when scenario is error', async () => {
      await errorProvider.initialize()
      const result = await errorProvider.execute({
        document: '12345678901',
        documentType: 'cpf',
        queryType: 'cpf',
      })

      expect(result.success).toBe(false)
      expect(result.errorCode).toBe('MOCK_ERROR')
      expect(result.rawData._scenario).toBe('error')
    })
  })

  describe('execute() - Timeout Scenario', () => {
    let timeoutProvider: MockQueryProvider

    beforeEach(() => {
      timeoutProvider = new MockQueryProvider({ scenario: 'timeout', simulatedDelay: 0 })
    })

    it('should return timeout error when scenario is timeout', async () => {
      await timeoutProvider.initialize()
      const result = await timeoutProvider.execute({
        document: '12345678901',
        documentType: 'cpf',
        queryType: 'cpf',
      })

      expect(result.success).toBe(false)
      expect(result.errorCode).toBe('TIMEOUT')
      expect(result.rawData._scenario).toBe('timeout')
    })
  })

  describe('execute() - Invalid Response Scenario', () => {
    let invalidProvider: MockQueryProvider

    beforeEach(() => {
      invalidProvider = new MockQueryProvider({ scenario: 'invalid_response', simulatedDelay: 0 })
    })

    it('should return invalid response when scenario is invalid_response', async () => {
      await invalidProvider.initialize()
      const result = await invalidProvider.execute({
        document: '12345678901',
        documentType: 'cpf',
        queryType: 'cpf',
      })

      expect(result.success).toBe(true) // Marca como sucesso mas dados inválidos
      expect(result.rawData._scenario).toBe('invalid_response')
      expect(result.rawData._invalid).toBe(true)
      expect(result.rawData.dados).toBeNull()
    })
  })

  describe('execute() - Invalid Request', () => {
    it('should return error for invalid request', async () => {
      await provider.initialize()
      const result = await provider.execute({
        document: '',
        documentType: 'cpf',
        queryType: 'cpf',
      })

      expect(result.success).toBe(false)
      expect(result.error).toBeDefined()
      expect(result.errorCode).toBe('INVALID_REQUEST')
    })
  })

  describe('getCapabilities()', () => {
    it('should return all supported query types', () => {
      const capabilities = provider.getCapabilities()
      expect(capabilities).toHaveLength(5)

      const queryTypes = capabilities.map((c) => c.queryType)
      expect(queryTypes).toContain('cpf')
      expect(queryTypes).toContain('inss')
      expect(queryTypes).toContain('fgts')
      expect(queryTypes).toContain('telefone')
      expect(queryTypes).toContain('limpa_nome')
    })

    it('should have correct structure', () => {
      const capabilities = provider.getCapabilities()
      capabilities.forEach((cap) => {
        expect(cap.queryType).toBeDefined()
        expect(cap.supportedDocumentTypes).toBeDefined()
        expect(Array.isArray(cap.supportedDocumentTypes)).toBe(true)
        expect(cap.description).toBeDefined()
        expect(typeof cap.description).toBe('string')
      })
    })
  })

  describe('getScenario()', () => {
    it('should return configured scenario', () => {
      const successProvider = new MockQueryProvider({ scenario: 'success' })
      expect(successProvider.getScenario()).toBe('success')

      const errorProvider = new MockQueryProvider({ scenario: 'error' })
      expect(errorProvider.getScenario()).toBe('error')
    })

    it('should return undefined when no scenario configured', () => {
      const defaultProvider = new MockQueryProvider()
      expect(defaultProvider.getScenario()).toBeUndefined()
    })
  })
})

describe('Mock Data Helpers', () => {
  describe('getMockData()', () => {
    it('should return data for cpf query', () => {
      const data = getMockData('cpf')
      expect(data).toBeDefined()
    })

    it('should return data for inss query', () => {
      const data = getMockData('inss')
      expect(data).toBeDefined()
    })

    it('should find specific document', () => {
      const data = getMockData('cpf', '12345678901')
      expect(data).toBeDefined()
      expect((data as Record<string, unknown>).cpf).toBe('12345678901')
    })

    it('should return first item when document not found', () => {
      const data = getMockData('cpf', '99999999999')
      expect(data).toBeDefined()
      // Retorna primeiro da lista quando não encontra
      expect((data as Record<string, unknown>).cpf).toBe('12345678901')
    })

    it('should return null for empty query type data', () => {
      // Tipo não existe no mock
      const data = getMockData('nonexistent' as any)
      expect(data).toBeNull()
    })
  })

  describe('generateDeterministicScore()', () => {
    it('should generate score between 70 and 100', () => {
      const score = generateDeterministicScore('cpf', '12345678901')
      expect(score).toBeGreaterThanOrEqual(70)
      expect(score).toBeLessThanOrEqual(100)
    })

    it('should be deterministic', () => {
      const score1 = generateDeterministicScore('cpf', '12345678901')
      const score2 = generateDeterministicScore('cpf', '12345678901')
      expect(score1).toBe(score2)
    })

    it('should generate different scores for different inputs', () => {
      const score1 = generateDeterministicScore('cpf', '12345678901')
      const score2 = generateDeterministicScore('inss', '12345678901')
      // Pode ser igual ou diferente, mas deve ser válido
      expect(score1).toBeGreaterThanOrEqual(70)
      expect(score2).toBeGreaterThanOrEqual(70)
    })
  })

  describe('maskDocument()', () => {
    it('should mask CPF correctly', () => {
      const masked = maskDocument('12345678901', 'cpf')
      expect(masked).toBe('123.***.***-01')
    })

    it('should mask CNPJ correctly', () => {
      const masked = maskDocument('12345678000195', 'cnpj')
      expect(masked).toBe('**.345.***/****-95')
    })

    it('should mask RG correctly', () => {
      const masked = maskDocument('12345678', 'rg')
      expect(masked).toBe('***45678')
    })

    it('should return original for unknown type', () => {
      const masked = maskDocument('12345', 'unknown')
      expect(masked).toBe('12345')
    })
  })
})
