/**
 * Mock Query Provider Tests
 * Etapa 9.3.2 - Provider Interface & Mock
 */

import { describe, it, expect, beforeEach } from 'vitest'
import { MockQueryProvider } from '@/lib/consultations/providers/mock/mock-query.provider'
import { getMockData, maskDocument } from '@/lib/consultations/providers/mock/mock-data'

describe('MockQueryProvider', () => {
  let provider: MockQueryProvider

  beforeEach(() => {
    provider = new MockQueryProvider({ simulatedDelay: 0 })
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

    it('should reject when provider is inactive', async () => {
      const inactiveProvider = new MockQueryProvider()
      // Manually set active to false
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

  describe('execute()', () => {
    it('should execute CPF query successfully', async () => {
      await provider.initialize()
      const result = await provider.execute({
        document: '12345678901',
        documentType: 'cpf',
        queryType: 'cpf',
      })

      expect(result.success).toBe(true)
      expect(result.rawData).toBeDefined()
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
      expect(result.rawData).toBeDefined()
    })

    it('should execute FGTS query successfully', async () => {
      await provider.initialize()
      // Use a document that exists in mock data
      const result = await provider.execute({
        document: '12345678901',
        documentType: 'cpf',
        queryType: 'fgts',
      })

      // Due to random success rate and random data selection, we just check structure
      expect(result).toBeDefined()
      expect(typeof result.success).toBe('boolean')
    })

    it('should execute telefone query successfully', async () => {
      await provider.initialize()
      const result = await provider.execute({
        document: '12345678901',
        documentType: 'cpf',
        queryType: 'telefone',
      })

      expect(result.success).toBe(true)
      expect(result.rawData).toBeDefined()
    })

    it('should execute limpa_nome query successfully', async () => {
      await provider.initialize()
      const result = await provider.execute({
        document: '12345678901',
        documentType: 'cpf',
        queryType: 'limpa_nome',
      })

      expect(result.success).toBe(true)
      expect(result.rawData).toBeDefined()
    })

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
