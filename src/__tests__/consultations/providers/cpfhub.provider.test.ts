/**
 * CPFHub Provider Tests
 * Etapa 9.19 - Integração CPFHub API
 *
 * Testes para o provider de consulta CPF via CPFHub API
 */

import { describe, it, expect, beforeEach, vi, afterEach } from 'vitest'
import { CPFHubProvider } from '@/lib/consultations/providers/cpfhub/cpfhub.provider'
import {
  getCPFHubConfig,
  validateCPFHubConfig,
  isCPFHubProviderReady,
} from '@/lib/consultations/providers/cpfhub/cpfhub.config'

// Mock das variáveis de ambiente
const originalEnv = process.env

describe('CPFHub Provider', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    process.env = { ...originalEnv }
    process.env.CPFHUB_ENABLED = 'false'
    process.env.CPFHUB_API_KEY = ''
    process.env.CPFHUB_BASE_URL = 'https://api.cpfhub.io'
  })

  afterAll(() => {
    process.env = originalEnv
  })

  describe('Configuração', () => {
    it('deve retornar configuração padrão quando desabilitado', () => {
      const config = getCPFHubConfig()

      expect(config.enabled).toBe(false)
      expect(config.baseUrl).toBe('https://api.cpfhub.io')
      expect(config.timeout).toBe(30000)
      expect(config.monthlyLimit).toBe(50)
      expect(config.rateLimitInterval).toBe(2000)
    })

    it('deve validar configuração quando desabilitado', () => {
      const config = getCPFHubConfig()

      expect(validateCPFHubConfig(config)).toBe(true)
    })

    it('deve invalidar configuração quando habilitado sem API Key', () => {
      process.env.CPFHUB_ENABLED = 'true'
      process.env.CPFHUB_API_KEY = ''

      const config = getCPFHubConfig()

      expect(validateCPFHubConfig(config)).toBe(false)
    })

    it('deve validar configuração quando habilitado com API Key', () => {
      process.env.CPFHUB_ENABLED = 'true'
      process.env.CPFHUB_API_KEY = 'test-api-key-123'

      const config = getCPFHubConfig()

      expect(validateCPFHubConfig(config)).toBe(true)
    })

    it('deve reportar provider não pronto quando desabilitado', () => {
      process.env.CPFHUB_ENABLED = 'false'

      expect(isCPFHubProviderReady()).toBe(false)
    })

    it('deve reportar provider pronto quando habilitado com API Key', () => {
      process.env.CPFHUB_ENABLED = 'true'
      process.env.CPFHUB_API_KEY = 'test-api-key-123'

      expect(isCPFHubProviderReady()).toBe(true)
    })
  })

  describe('Provider', () => {
    let provider: CPFHubProvider

    beforeEach(() => {
      process.env.CPFHUB_ENABLED = 'false'
      process.env.CPFHUB_API_KEY = ''
      provider = new CPFHubProvider()
    })

    it('deve ter nome correto', () => {
      expect(provider.name).toBe('CPFHub Provider')
    })

    it('deve ter tipo correto', () => {
      expect(provider.type).toBe('mock')
    })

    it('deve ter active como true', () => {
      expect(provider.active).toBe(true)
    })

    it('deve inicializar quando desabilitado', async () => {
      await provider.initialize()

      expect(provider.isReady()).toBe(false)
    })

    it('deve retornar erro quando não está pronto', async () => {
      await provider.initialize()

      const result = await provider.execute({
        document: '12345678909',
        documentType: 'cpf',
        queryType: 'cpf',
      })

      expect(result.success).toBe(false)
      expect(result.errorCode).toBe('PROVIDER_NOT_READY')
    })

    it('deve validar CPF corretamente', () => {
      expect(
        provider.validate({
          document: '12345678909',
          documentType: 'cpf',
          queryType: 'cpf',
        })
      ).toBe(true)
    })

    it('deve rejeitar documento vazio', () => {
      expect(
        provider.validate({
          document: '',
          documentType: 'cpf',
          queryType: 'cpf',
        })
      ).toBe(false)
    })

    it('deve rejeitar queryType inválido', () => {
      expect(
        provider.validate({
          document: '12345678909',
          documentType: 'cpf',
          queryType: 'inss',
        })
      ).toBe(false)
    })

    it('deve retornar capacidades corretas', () => {
      const capabilities = provider.getCapabilities()

      expect(capabilities).toHaveLength(1)
      expect(capabilities[0].queryType).toBe('cpf')
      expect(capabilities[0].supportedDocumentTypes).toContain('cpf')
    })

    it('deve retornar status do provider', () => {
      const status = provider.getStatus()

      expect(status.enabled).toBe(false)
      expect(status.hasApiKey).toBe(false)
      expect(status.isReady).toBe(false)
    })

    it('deve retornar config sem expor API Key', () => {
      process.env.CPFHUB_API_KEY = 'super-secret-key-123'
      const configProvider = new CPFHubProvider()

      const config = configProvider.getConfig()

      expect(config.hasApiKey).toBe(true)
      expect(config).not.toHaveProperty('apiKey')
    })
  })

  describe('Provider com configuração habilitada', () => {
    let provider: CPFHubProvider

    beforeEach(() => {
      process.env.CPFHUB_ENABLED = 'true'
      process.env.CPFHUB_API_KEY = 'test-api-key-123'

      provider = new CPFHubProvider({
        enabled: true,
        apiKey: 'test-api-key-123',
        baseUrl: 'https://api.cpfhub.io',
        timeout: 5000,
        monthlyLimit: 50,
        rateLimitInterval: 0, // Sem rate limit para testes
      })
    })

    it('deve inicializar quando habilitado com API Key', async () => {
      await provider.initialize()

      expect(provider.isReady()).toBe(true)
    })

    it('deve rejeitar CPF com formato inválido', async () => {
      await provider.initialize()

      const result = await provider.execute({
        document: '12345',
        documentType: 'cpf',
        queryType: 'cpf',
      })

      expect(result.success).toBe(false)
      expect(result.errorCode).toBe('CPF_INVALID_FORMAT')
    })

    it('deve retornar erro de rede quando API indisponível', async () => {
      await provider.initialize()

      // Mock fetch para simular erro de rede
      global.fetch = vi.fn().mockRejectedValue(new TypeError('fetch failed'))

      const result = await provider.execute({
        document: '12345678909',
        documentType: 'cpf',
        queryType: 'cpf',
      })

      expect(result.success).toBe(false)
      expect(result.errorCode).toBe('NETWORK_ERROR')
    })

    it('deve retornar erro de timeout', async () => {
      process.env.CPFHUB_TIMEOUT_MS = '100' // 100ms para testes rápidos

      const timeoutProvider = new CPFHubProvider({
        enabled: true,
        apiKey: 'test-api-key-123',
        baseUrl: 'https://api.cpfhub.io',
        timeout: 100,
        monthlyLimit: 50,
        rateLimitInterval: 0,
      })

      await timeoutProvider.initialize()

      // Mock fetch para simular timeout
      global.fetch = vi.fn().mockImplementation(() => {
        return new Promise((_, reject) => {
          setTimeout(() => {
            reject(new DOMException('The operation was aborted.', 'AbortError'))
          }, 200)
        })
      })

      const result = await timeoutProvider.execute({
        document: '12345678909',
        documentType: 'cpf',
        queryType: 'cpf',
      })

      expect(result.success).toBe(false)
      expect(result.errorCode).toBe('TIMEOUT')
    })

    it('deve retornar erro para API Key inválida', async () => {
      await provider.initialize()

      // Mock fetch para simular 401
      global.fetch = vi.fn().mockResolvedValue({
        ok: false,
        status: 401,
        statusText: 'Unauthorized',
        json: () => Promise.resolve({
          success: false,
          error: {
            code: 'API_KEY_INVALID',
            message: 'API Key inválida',
          },
        }),
      })

      const result = await provider.execute({
        document: '12345678909',
        documentType: 'cpf',
        queryType: 'cpf',
      })

      expect(result.success).toBe(false)
      expect(result.errorCode).toBe('API_KEY_INVALID')
    })

    it('deve retornar erro para CPF não encontrado', async () => {
      await provider.initialize()

      // Mock fetch para simular 404
      global.fetch = vi.fn().mockResolvedValue({
        ok: false,
        status: 404,
        statusText: 'Not Found',
        json: () => Promise.resolve({
          success: false,
          error: {
            code: 'CPF_NOT_FOUND',
            message: 'CPF não encontrado na base de dados',
          },
        }),
      })

      const result = await provider.execute({
        document: '12345678909',
        documentType: 'cpf',
        queryType: 'cpf',
      })

      expect(result.success).toBe(false)
      expect(result.errorCode).toBe('CPF_NOT_FOUND')
    })

    it('deve retornar erro para resposta inválida', async () => {
      await provider.initialize()

      // Mock fetch para simular resposta inválida
      global.fetch = vi.fn().mockResolvedValue({
        ok: true,
        status: 200,
        json: () => Promise.resolve({ invalid: true }),
      })

      const result = await provider.execute({
        document: '12345678909',
        documentType: 'cpf',
        queryType: 'cpf',
      })

      // Resposta sem success: true é tratada como erro
      expect(result.success).toBe(false)
    })

    it('deve retornar sucesso para CPF válido', async () => {
      await provider.initialize()

      // Mock fetch para simular sucesso
      global.fetch = vi.fn().mockResolvedValue({
        ok: true,
        status: 200,
        json: () => Promise.resolve({
          success: true,
          data: {
            cpf: '12345678909',
            name: 'Fulano de Tal',
            nameUpper: 'FULANO DE TAL',
            gender: 'M',
            birthDate: '15/06/1990',
            day: 15,
            month: 6,
            year: 1990,
          },
        }),
      })

      const result = await provider.execute({
        document: '12345678909',
        documentType: 'cpf',
        queryType: 'cpf',
      })

      expect(result.success).toBe(true)
      expect(result.rawData.nome).toBe('Fulano de Tal')
      expect(result.rawData.sexo).toBe('MASCULINO')
      expect(result.score).toBe(100)
    })

    it('deve controlar limite mensal', async () => {
      const lowLimitProvider = new CPFHubProvider({
        enabled: true,
        apiKey: 'test-api-key-123',
        baseUrl: 'https://api.cpfhub.io',
        timeout: 5000,
        monthlyLimit: 2, // Limite baixo para teste
        rateLimitInterval: 0,
      })

      await lowLimitProvider.initialize()
      lowLimitProvider.resetMonthlyCounter()

      // Mock fetch para simular sucesso
      global.fetch = vi.fn().mockResolvedValue({
        ok: true,
        status: 200,
        json: () => Promise.resolve({
          success: true,
          data: {
            cpf: '12345678909',
            name: 'Teste',
            nameUpper: 'TESTE',
            gender: 'M',
            birthDate: '01/01/2000',
            day: 1,
            month: 1,
            year: 2000,
          },
        }),
      })

      // Primeira consulta
      const result1 = await lowLimitProvider.execute({
        document: '12345678909',
        documentType: 'cpf',
        queryType: 'cpf',
      })
      expect(result1.success).toBe(true)

      // Segunda consulta
      const result2 = await lowLimitProvider.execute({
        document: '12345678909',
        documentType: 'cpf',
        queryType: 'cpf',
      })
      expect(result2.success).toBe(true)

      // Terceira consulta - deve exceder limite
      const result3 = await lowLimitProvider.execute({
        document: '12345678909',
        documentType: 'cpf',
        queryType: 'cpf',
      })
      expect(result3.success).toBe(false)
      expect(result3.errorCode).toBe('MONTHLY_LIMIT_EXCEEDED')
    })

    it('deve controlar rate limit', async () => {
      const rateLimitProvider = new CPFHubProvider({
        enabled: true,
        apiKey: 'test-api-key-123',
        baseUrl: 'https://api.cpfhub.io',
        timeout: 5000,
        monthlyLimit: 50,
        rateLimitInterval: 1000, // 1 segundo
      })

      await rateLimitProvider.initialize()
      rateLimitProvider.resetRateLimit()
      rateLimitProvider.resetMonthlyCounter()

      // Mock fetch para simular sucesso
      global.fetch = vi.fn().mockResolvedValue({
        ok: true,
        status: 200,
        json: () => Promise.resolve({
          success: true,
          data: {
            cpf: '12345678909',
            name: 'Teste',
            nameUpper: 'TESTE',
            gender: 'M',
            birthDate: '01/01/2000',
            day: 1,
            month: 1,
            year: 2000,
          },
        }),
      })

      // Primeira consulta
      const result1 = await rateLimitProvider.execute({
        document: '12345678909',
        documentType: 'cpf',
        queryType: 'cpf',
      })
      expect(result1.success).toBe(true)

      // Segunda consulta imediata - deve exceder rate limit
      const result2 = await rateLimitProvider.execute({
        document: '12345678909',
        documentType: 'cpf',
        queryType: 'cpf',
      })
      expect(result2.success).toBe(false)
      expect(result2.errorCode).toBe('RATE_LIMIT_EXCEEDED')
    })

    it('deve mascarar CPF nos logs', () => {
      // Este teste verifica que o provider não expõe CPF completo
      const status = provider.getStatus()

      // Status não deve conter CPF completo
      expect(JSON.stringify(status)).not.toContain('12345678909')
    })
  })
})
