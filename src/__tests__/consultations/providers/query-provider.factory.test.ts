/**
 * Query Provider Factory Tests
 * Etapa 9.3.2 - Provider Interface & Mock
 */

import { describe, it, expect, beforeEach, afterEach } from 'vitest'
import { QueryProviderFactory } from '@/lib/consultations/providers/query-provider.factory'
import { MockQueryProvider } from '@/lib/consultations/providers/mock/mock-query.provider'

describe('QueryProviderFactory', () => {
  let factory: QueryProviderFactory

  beforeEach(() => {
    // Reseta a instância singleton antes de cada teste
    QueryProviderFactory.resetInstance()
    
    // Cria factory com mock provider deterministic (successRate: 100)
    factory = QueryProviderFactory.getInstance()
    
    // Remove o mock provider padrão e recria com successRate 100
    factory.unregister('mock')
    const deterministicMock = new MockQueryProvider({ successRate: 100 })
    factory.register('mock', deterministicMock, {
      id: 'mock-001',
      slug: 'mock-provider',
      type: 'mock',
      active: true,
    })
  })

  afterEach(() => {
    QueryProviderFactory.resetInstance()
  })

  describe('Singleton', () => {
    it('should return the same instance', () => {
      const instance1 = QueryProviderFactory.getInstance()
      const instance2 = QueryProviderFactory.getInstance()
      expect(instance1).toBe(instance2)
    })
  })

  describe('Default Providers', () => {
    it('should register Mock provider by default', () => {
      expect(factory.hasProvider('mock')).toBe(true)
    })

    it('should have mock provider active', () => {
      const providers = factory.listProviders()
      const mockProvider = providers.find((p) => p.name === 'mock')
      expect(mockProvider).toBeDefined()
      expect(mockProvider?.active).toBe(true)
    })
  })

  describe('register()', () => {
    it('should register a new provider', () => {
      const newProvider = new MockQueryProvider()
      factory.register('custom-mock', newProvider, {
        id: 'custom-001',
        slug: 'custom-mock',
        type: 'mock',
        active: true,
      })

      expect(factory.hasProvider('custom-mock')).toBe(true)
    })

    it('should add provider to query type map', () => {
      const newProvider = new MockQueryProvider()
      factory.register('custom-mock', newProvider, {
        id: 'custom-001',
        slug: 'custom-mock',
        type: 'mock',
        active: true,
      })

      const provider = factory.getProviderForQuery('cpf')
      expect(provider).toBeDefined()
    })
  })

  describe('unregister()', () => {
    it('should remove a provider', () => {
      const newProvider = new MockQueryProvider()
      factory.register('temp-provider', newProvider, {
        id: 'temp-001',
        slug: 'temp',
        type: 'mock',
        active: true,
      })

      expect(factory.hasProvider('temp-provider')).toBe(true)

      factory.unregister('temp-provider')

      expect(factory.hasProvider('temp-provider')).toBe(false)
    })
  })

  describe('getProviderForQuery()', () => {
    it('should return provider for CPF query', () => {
      const provider = factory.getProviderForQuery('cpf')
      expect(provider).toBeDefined()
      expect(provider?.type).toBe('mock')
    })

    it('should return provider for INSS query', () => {
      const provider = factory.getProviderForQuery('inss')
      expect(provider).toBeDefined()
    })

    it('should return provider for FGTS query', () => {
      const provider = factory.getProviderForQuery('fgts')
      expect(provider).toBeDefined()
    })

    it('should return provider for telefone query', () => {
      const provider = factory.getProviderForQuery('telefone')
      expect(provider).toBeDefined()
    })

    it('should return provider for limpa_nome query', () => {
      const provider = factory.getProviderForQuery('limpa_nome')
      expect(provider).toBeDefined()
    })
  })

  describe('execute()', () => {
    it('should execute query successfully', async () => {
      const result = await factory.execute({
        document: '12345678901',
        documentType: 'cpf',
        queryType: 'cpf',
      })

      expect(result.success).toBe(true)
      expect(result.rawData).toBeDefined()
    })

    it('should execute with preferred provider', async () => {
      const result = await factory.execute(
        {
          document: '12345678901',
          documentType: 'cpf',
          queryType: 'cpf',
        },
        'mock'
      )

      expect(result.success).toBe(true)
    })

    it('should fallback to default provider when preferred not found', async () => {
      const result = await factory.execute(
        {
          document: '12345678901',
          documentType: 'cpf',
          queryType: 'cpf',
        },
        'nonexistent-provider'
      )

      expect(result.success).toBe(true)
    })
  })

  describe('listProviders()', () => {
    it('should list all registered providers', () => {
      const providers = factory.listProviders()
      expect(providers.length).toBeGreaterThanOrEqual(1)
    })

    it('should return provider info with capabilities', () => {
      const providers = factory.listProviders()
      providers.forEach((p) => {
        expect(p.name).toBeDefined()
        expect(p.type).toBeDefined()
        expect(typeof p.active).toBe('boolean')
        expect(Array.isArray(p.capabilities)).toBe(true)
      })
    })
  })

  describe('getSupportedQueryTypes()', () => {
    it('should return all supported query types', () => {
      const types = factory.getSupportedQueryTypes()
      expect(types).toContain('cpf')
      expect(types).toContain('inss')
      expect(types).toContain('fgts')
      expect(types).toContain('telefone')
      expect(types).toContain('limpa_nome')
    })
  })

  describe('isQueryTypeSupported()', () => {
    it('should return true for supported types', () => {
      expect(factory.isQueryTypeSupported('cpf')).toBe(true)
      expect(factory.isQueryTypeSupported('inss')).toBe(true)
      expect(factory.isQueryTypeSupported('fgts')).toBe(true)
      expect(factory.isQueryTypeSupported('telefone')).toBe(true)
      expect(factory.isQueryTypeSupported('limpa_nome')).toBe(true)
    })
  })
})
