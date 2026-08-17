/**
 * Query Provider Factory Tests
 * Etapa 9.3.2 - Provider Interface & Mock
 * Atualizado na Etapa 9.18 - Testes determinísticos
 *
 * Todos os testes são determinísticos
 */

import { describe, it, expect, beforeEach, afterEach } from 'vitest'
import { QueryProviderFactory } from '@/lib/consultations/providers/query-provider.factory'
import { MockQueryProvider } from '@/lib/consultations/providers/mock/mock-query.provider'

describe('QueryProviderFactory', () => {
  let factory: QueryProviderFactory

  beforeEach(() => {
    // Reseta a instância singleton antes de cada teste
    QueryProviderFactory.resetInstance()

    // Cria factory em modo test (determinístico)
    factory = QueryProviderFactory.getInstance({
      mode: 'test',
      autoRegisterDefaults: true,
      allowMockInProduction: false,
      debugMode: false,
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

  describe('Configuration', () => {
    it('should have correct default mode', () => {
      expect(factory.getMode()).toBe('test')
    })

    it('should allow changing mode', () => {
      factory.setMode('development')
      expect(factory.getMode()).toBe('development')
    })

    it('should return config', () => {
      const config = factory.getConfig()
      expect(config.mode).toBe('test')
      expect(config.allowMockInProduction).toBe(false)
    })
  })

  describe('Default Providers', () => {
    it('should register Mock provider by default', () => {
      expect(factory.hasProvider('mock')).toBe(true)
    })

    it('should have mock provider active', () => {
      const providers = factory.listProviders()
      const mockProvider = providers.find((p) => p.type === 'mock')
      expect(mockProvider).toBeDefined()
      expect(mockProvider?.active).toBe(true)
    })
  })

  describe('register()', () => {
    it('should register a new provider', () => {
      const newProvider = new MockQueryProvider({ scenario: 'success' })
      factory.register('custom-mock', newProvider, {
        id: 'custom-001',
        slug: 'custom-mock',
        type: 'mock',
        active: true,
      })

      expect(factory.hasProvider('custom-mock')).toBe(true)
    })

    it('should add provider to query type map', () => {
      const newProvider = new MockQueryProvider({ scenario: 'success' })
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
      const newProvider = new MockQueryProvider({ scenario: 'success' })
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
      expect(result.providerUsed).toBeDefined()
      expect(result.environment).toBe('test')
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
      expect(result.providerUsed).toBe('Mock Provider')
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

    it('should include provider info in result', async () => {
      const result = await factory.execute({
        document: '12345678901',
        documentType: 'cpf',
        queryType: 'cpf',
      })

      expect(result.providerUsed).toBeDefined()
      expect(result.providerType).toBeDefined()
      expect(result.environment).toBeDefined()
    })

    it('should indicate if using mock fallback', async () => {
      const result = await factory.execute({
        document: '12345678901',
        documentType: 'cpf',
        queryType: 'cpf',
      })

      // Em modo test, sempre usa mock
      expect(result.wasFallback).toBe(true)
    })
  })

  describe('Production Mode', () => {
    it('should not register mock in production by default', () => {
      QueryProviderFactory.resetInstance()

      const prodFactory = QueryProviderFactory.getInstance({
        mode: 'production',
        autoRegisterDefaults: true,
        allowMockInProduction: false,
      })

      expect(prodFactory.hasProvider('mock')).toBe(false)
    })

    it('should allow mock in production when configured', () => {
      QueryProviderFactory.resetInstance()

      const prodFactory = QueryProviderFactory.getInstance({
        mode: 'production',
        autoRegisterDefaults: true,
        allowMockInProduction: true,
      })

      expect(prodFactory.hasProvider('mock')).toBe(true)
    })

    it('should return error in production without real provider', async () => {
      QueryProviderFactory.resetInstance()

      const prodFactory = QueryProviderFactory.getInstance({
        mode: 'production',
        autoRegisterDefaults: true,
        allowMockInProduction: false,
      })

      const result = await prodFactory.execute({
        document: '12345678901',
        documentType: 'cpf',
        queryType: 'cpf',
      })

      expect(result.success).toBe(false)
      expect(result.errorCode).toBe('NO_PROVIDER_AVAILABLE')
      expect(result.environment).toBe('production')
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

  describe('getStats()', () => {
    it('should return stats', () => {
      const stats = factory.getStats()
      expect(stats.mode).toBe('test')
      expect(stats.registry).toBeDefined()
      expect(stats.registry.totalProviders).toBeGreaterThan(0)
    })
  })
})
