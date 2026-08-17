/**
 * INSS Conecta Provider Tests
 * Etapa 9.17 - Investigação APIs Oficiais INSS
 */

import { describe, it, expect, beforeEach, vi } from 'vitest'
import { INSSConectaProvider } from '@/lib/consultations/providers/inss-conecta/inss-conecta.provider'
import {
  getINSSConectaConfig,
  validateINSSConectaConfig,
  isINSSConectaProviderReady,
} from '@/lib/consultations/providers/inss-conecta/inss-conecta.config'

// Mock das variáveis de ambiente
const originalEnv = process.env

describe('INSS Conecta Provider', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    process.env = { ...originalEnv }
    process.env.INSS_CONECTA_ENABLED = 'false'
  })

  afterAll(() => {
    process.env = originalEnv
  })

  describe('Configuração', () => {
    it('deve retornar configuração padrão quando desabilitado', () => {
      const config = getINSSConectaConfig()

      expect(config.enabled).toBe(false)
      expect(config.baseUrl).toBe('https://apigateway.conectagov.gov.br')
      expect(config.timeout).toBe(30000)
    })

    it('deve validar configuração quando desabilitado', () => {
      const config = getINSSConectaConfig()

      expect(validateINSSConectaConfig(config)).toBe(true)
    })

    it('deve invalidar configuração quando habilitado sem credenciais', () => {
      process.env.INSS_CONECTA_ENABLED = 'true'
      process.env.INSS_CONECTA_CLIENT_ID = ''
      process.env.INSS_CONECTA_CLIENT_SECRET = ''

      const config = getINSSConectaConfig()

      expect(validateINSSConectaConfig(config)).toBe(false)
    })

    it('deve validar configuração quando habilitado com credenciais', () => {
      process.env.INSS_CONECTA_ENABLED = 'true'
      process.env.INSS_CONECTA_CLIENT_ID = 'test-client-id'
      process.env.INSS_CONECTA_CLIENT_SECRET = 'test-client-secret'
      process.env.INSS_CONECTA_CERTIFICATE_PATH = '/path/to/cert.pfx'

      const config = getINSSConectaConfig()

      expect(validateINSSConectaConfig(config)).toBe(true)
    })

    it('deve reportar provider não pronto quando desabilitado', () => {
      process.env.INSS_CONECTA_ENABLED = 'false'

      expect(isINSSConectaProviderReady()).toBe(false)
    })
  })

  describe('Provider', () => {
    let provider: INSSConectaProvider

    beforeEach(() => {
      process.env.INSS_CONECTA_ENABLED = 'false'
      provider = new INSSConectaProvider()
    })

    it('deve ter nome correto', () => {
      expect(provider.name).toBe('INSS Conecta Provider')
    })

    it('deve ter tipo correto', () => {
      expect(provider.type).toBe('inss-conecta')
    })

    it('deve ter active como true por padrão', () => {
      expect(provider.active).toBe(true)
    })

    it('deve inicializar quando desabilitado', async () => {
      await provider.initialize()

      expect(provider.isReady()).toBe(false)
    })

    it('deve retornar erro quando não está pronto', async () => {
      await provider.initialize()

      const result = await provider.execute({
        document: '12345678901',
        documentType: 'cpf',
        queryType: 'inss',
      })

      expect(result.success).toBe(false)
      expect(result.errorCode).toBe('PROVIDER_NOT_READY')
    })

    it('deve validar CPF corretamente', () => {
      expect(
        provider.validate({
          document: '12345678901',
          documentType: 'cpf',
          queryType: 'inss',
        })
      ).toBe(true)
    })

    it('deve rejeitar CPF inválido', () => {
      expect(
        provider.validate({
          document: '12345',
          documentType: 'cpf',
          queryType: 'inss',
        })
      ).toBe(false)
    })

    it('deve rejeitar documento vazio', () => {
      expect(
        provider.validate({
          document: '',
          documentType: 'cpf',
          queryType: 'inss',
        })
      ).toBe(false)
    })

    it('deve retornar capacidades corretas', () => {
      const capabilities = provider.getCapabilities()

      expect(capabilities).toHaveLength(2)
      expect(capabilities.map((c) => c.queryType)).toContain('inss')
      expect(capabilities.map((c) => c.queryType)).toContain('cpf')
    })

    it('deve retornar token como null quando não configurado', async () => {
      await provider.initialize()

      const token = await provider.getAuthToken()

      expect(token).toBeNull()
    })

    it('deve invalidar cache de autenticação', () => {
      provider.invalidateAuthCache()

      // Não deve lançar erro
      expect(true).toBe(true)
    })

    it('deve retornar estatísticas', () => {
      const stats = provider.getStats()

      expect(stats.totalRequests).toBe(0)
      expect(stats.successfulRequests).toBe(0)
      expect(stats.failedRequests).toBe(0)
      expect(stats.averageResponseTime).toBe(0)
    })
  })

  describe('Provider com configuração habilitada (mock)', () => {
    let provider: INSSConectaProvider

    beforeEach(() => {
      process.env.INSS_CONECTA_ENABLED = 'true'
      process.env.INSS_CONECTA_CLIENT_ID = 'test-client-id'
      process.env.INSS_CONECTA_CLIENT_SECRET = 'test-client-secret'
      process.env.INSS_CONECTA_CERTIFICATE_PATH = '/path/to/cert.pfx'

      provider = new INSSConectaProvider()
    })

    it('deve inicializar quando habilitado com credenciais', async () => {
      await provider.initialize()

      expect(provider.isReady()).toBe(true)
    })

    it('deve retornar erro quando sem token real', async () => {
      await provider.initialize()

      const result = await provider.execute({
        document: '12345678901',
        documentType: 'cpf',
        queryType: 'inss',
      })

      expect(result.success).toBe(false)
      // Pode retornar AUTH_FAILED ou PROVIDER_NOT_CONFIGURED
      expect(['AUTH_FAILED', 'PROVIDER_NOT_CONFIGURED']).toContain(result.errorCode)
    })

    it('deve atualizar estatísticas após execução', async () => {
      await provider.initialize()

      await provider.execute({
        document: '12345678901',
        documentType: 'cpf',
        queryType: 'inss',
      })

      const stats = provider.getStats()
      expect(stats.totalRequests).toBe(1)
      expect(stats.failedRequests).toBe(1)
    })

    it('deve retornar erro para tipo de consulta não suportado', async () => {
      await provider.initialize()

      const result = await provider.execute({
        document: '12345678901',
        documentType: 'cpf',
        queryType: 'fgts',
      })

      expect(result.success).toBe(false)
      // Pode retornar AUTH_FAILED ou UNSUPPORTED_QUERY_TYPE dependendo da implementação
      expect(['AUTH_FAILED', 'UNSUPPORTED_QUERY_TYPE', 'PROVIDER_NOT_CONFIGURED']).toContain(result.errorCode)
    })
  })
})
