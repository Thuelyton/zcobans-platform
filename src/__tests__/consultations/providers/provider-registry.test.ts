/**
 * Provider Registry Tests
 * Etapa 9.18 - Fortalecimento do Motor de Consultas
 *
 * Testes para o ProviderRegistry
 */

import { describe, it, expect, beforeEach, afterEach } from 'vitest'
import { ProviderRegistry } from '@/lib/consultations/providers/provider-registry'
import { MockQueryProvider } from '@/lib/consultations/providers/mock/mock-query.provider'
import type { ProviderRegistryEntry } from '@/lib/consultations/providers/provider-registry'

describe('ProviderRegistry', () => {
  let registry: ProviderRegistry

  beforeEach(() => {
    ProviderRegistry.resetInstance()
    registry = ProviderRegistry.getInstance()
    registry.setEnvironment('development')
  })

  afterEach(() => {
    ProviderRegistry.resetInstance()
  })

  describe('Singleton', () => {
    it('should return the same instance', () => {
      const instance1 = ProviderRegistry.getInstance()
      const instance2 = ProviderRegistry.getInstance()
      expect(instance1).toBe(instance2)
    })
  })

  describe('register()', () => {
    it('should register a provider', () => {
      const provider = new MockQueryProvider({ scenario: 'success' })
      const entry: ProviderRegistryEntry = {
        id: 'test-mock',
        name: 'Test Mock',
        type: 'mock',
        provider,
        supportedQueryTypes: ['cpf'],
        enabled: true,
        priority: 10,
        environments: ['development', 'test'],
        isMock: true,
        costPerQuery: 0,
      }

      registry.register(entry)

      expect(registry.has('test-mock')).toBe(true)
    })

    it('should update index when registering', () => {
      const provider = new MockQueryProvider({ scenario: 'success' })
      registry.register({
        id: 'test-mock',
        name: 'Test Mock',
        type: 'mock',
        provider,
        supportedQueryTypes: ['cpf', 'inss'],
        enabled: true,
        priority: 10,
        environments: ['development'],
        isMock: true,
        costPerQuery: 0,
      })

      const providers = registry.getProvidersForQueryType('cpf')
      expect(providers).toHaveLength(1)
      expect(providers[0].id).toBe('test-mock')
    })
  })

  describe('unregister()', () => {
    it('should remove a provider', () => {
      const provider = new MockQueryProvider({ scenario: 'success' })
      registry.register({
        id: 'test-mock',
        name: 'Test Mock',
        type: 'mock',
        provider,
        supportedQueryTypes: ['cpf'],
        enabled: true,
        priority: 10,
        environments: ['development'],
        isMock: true,
        costPerQuery: 0,
      })

      expect(registry.has('test-mock')).toBe(true)

      registry.unregister('test-mock')

      expect(registry.has('test-mock')).toBe(false)
    })

    it('should remove from index when unregistering', () => {
      const provider = new MockQueryProvider({ scenario: 'success' })
      registry.register({
        id: 'test-mock',
        name: 'Test Mock',
        type: 'mock',
        provider,
        supportedQueryTypes: ['cpf'],
        enabled: true,
        priority: 10,
        environments: ['development'],
        isMock: true,
        costPerQuery: 0,
      })

      registry.unregister('test-mock')

      const providers = registry.getProvidersForQueryType('cpf')
      expect(providers).toHaveLength(0)
    })
  })

  describe('findProvider()', () => {
    beforeEach(() => {
      // Registra mock provider
      const mockProvider = new MockQueryProvider({ scenario: 'success' })
      registry.register({
        id: 'mock',
        name: 'Mock Provider',
        type: 'mock',
        provider: mockProvider,
        supportedQueryTypes: ['cpf', 'inss', 'fgts', 'telefone', 'limpa_nome'],
        enabled: true,
        priority: 100, // Baixa prioridade
        environments: ['development', 'test'],
        isMock: true,
        costPerQuery: 0,
      })
    })

    it('should find provider for query type', () => {
      const result = registry.findProvider({
        queryType: 'cpf',
        environment: 'development',
      })

      expect(result).not.toBeNull()
      expect(result?.entry.id).toBe('mock')
    })

    it('should return null when no provider available', () => {
      registry.clear()

      const result = registry.findProvider({
        queryType: 'cpf',
        environment: 'production',
      })

      expect(result).toBeNull()
    })

    it('should respect enabled flag', () => {
      const provider = new MockQueryProvider({ scenario: 'success' })
      registry.register({
        id: 'disabled-mock',
        name: 'Disabled Mock',
        type: 'mock',
        provider,
        supportedQueryTypes: ['cpf'],
        enabled: false, // Desabilitado
        priority: 5, // Alta prioridade mas desabilitado
        environments: ['development'],
        isMock: true,
        costPerQuery: 0,
      })

      const result = registry.findProvider({
        queryType: 'cpf',
        environment: 'development',
        onlyActive: true,
      })

      // Deve retornar o mock padrão, não o desabilitado
      expect(result?.entry.id).toBe('mock')
    })

    it('should respect environment', () => {
      const provider = new MockQueryProvider({ scenario: 'success' })
      registry.register({
        id: 'dev-only',
        name: 'Dev Only',
        type: 'mock',
        provider,
        supportedQueryTypes: ['cpf'],
        enabled: true,
        priority: 5,
        environments: ['development'], // Apenas development
        isMock: true,
        costPerQuery: 0,
      })

      // Em development, deve encontrar
      const devResult = registry.findProvider({
        queryType: 'cpf',
        environment: 'development',
      })
      expect(devResult?.entry.id).toBe('dev-only')

      // Em production, não deve encontrar
      const prodResult = registry.findProvider({
        queryType: 'cpf',
        environment: 'production',
      })
      expect(prodResult?.entry.id).toBe('mock')
    })

    it('should respect priority', () => {
      const highPriorityProvider = new MockQueryProvider({ scenario: 'success' })
      registry.register({
        id: 'high-priority',
        name: 'High Priority',
        type: 'mock',
        provider: highPriorityProvider,
        supportedQueryTypes: ['cpf'],
        enabled: true,
        priority: 5, // Alta prioridade
        environments: ['development'],
        isMock: true,
        costPerQuery: 0,
      })

      const result = registry.findProvider({
        queryType: 'cpf',
        environment: 'development',
      })

      expect(result?.entry.id).toBe('high-priority')
    })

    it('should find preferred provider', () => {
      const result = registry.findProvider({
        queryType: 'cpf',
        environment: 'development',
        preferredProvider: 'mock',
      })

      expect(result?.entry.id).toBe('mock')
      expect(result?.reason).toBe('preferred')
    })

    it('should exclude mock when includeMock is false', () => {
      registry.clear()

      const result = registry.findProvider({
        queryType: 'cpf',
        environment: 'development',
        includeMock: false,
      })

      expect(result).toBeNull()
    })
  })

  describe('getSupportedQueryTypes()', () => {
    it('should return all supported query types', () => {
      const provider = new MockQueryProvider({ scenario: 'success' })
      registry.register({
        id: 'mock',
        name: 'Mock',
        type: 'mock',
        provider,
        supportedQueryTypes: ['cpf', 'inss'],
        enabled: true,
        priority: 10,
        environments: ['development'],
        isMock: true,
        costPerQuery: 0,
      })

      const types = registry.getSupportedQueryTypes()
      expect(types).toContain('cpf')
      expect(types).toContain('inss')
    })
  })

  describe('getStats()', () => {
    it('should return correct stats', () => {
      const provider = new MockQueryProvider({ scenario: 'success' })
      registry.register({
        id: 'mock',
        name: 'Mock',
        type: 'mock',
        provider,
        supportedQueryTypes: ['cpf'],
        enabled: true,
        priority: 10,
        environments: ['development'],
        isMock: true,
        costPerQuery: 0,
      })

      const stats = registry.getStats()
      expect(stats.totalProviders).toBe(1)
      expect(stats.activeProviders).toBe(1)
      expect(stats.mockProviders).toBe(1)
      expect(stats.realProviders).toBe(0)
    })
  })

  describe('Environment Management', () => {
    it('should detect environment', () => {
      const env = registry.getEnvironment()
      expect(['development', 'test', 'production']).toContain(env)
    })

    it('should allow setting environment', () => {
      registry.setEnvironment('production')
      expect(registry.getEnvironment()).toBe('production')
    })

    it('should control mock fallback in production', () => {
      registry.setEnvironment('production')
      registry.setAllowMockFallbackInProduction(false)

      expect(registry.canUseMockInCurrentEnvironment()).toBe(false)

      registry.setAllowMockFallbackInProduction(true)

      expect(registry.canUseMockInCurrentEnvironment()).toBe(true)
    })
  })

  describe('clear()', () => {
    it('should clear all providers', () => {
      const provider = new MockQueryProvider({ scenario: 'success' })
      registry.register({
        id: 'mock',
        name: 'Mock',
        type: 'mock',
        provider,
        supportedQueryTypes: ['cpf'],
        enabled: true,
        priority: 10,
        environments: ['development'],
        isMock: true,
        costPerQuery: 0,
      })

      registry.clear()

      expect(registry.list()).toHaveLength(0)
    })
  })
})
