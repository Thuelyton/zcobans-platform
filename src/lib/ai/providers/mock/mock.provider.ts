/**
 * Mock AI Provider
 * Etapa 9.2 - Motor de Geração de Landing Pages com IA
 *
 * Provider mockado para testes e desenvolvimento.
 * Retorna uma landing page estruturada sem chamar APIs externas.
 */

import { randomUUID } from 'crypto'
import type { IAIProvider } from '../ai-provider.interface'
import type { AIGenerateParams, AIResponse, LandingPage } from '../../types'

/**
 * Landing page mockada para testes
 */
const MOCK_LANDING_PAGE: LandingPage = {
  id: randomUUID(),
  title: 'Landing Page Mock',
  description: 'Landing page gerada pelo provider mock para testes',
  slug: 'landing-page-mock',
  sections: [
    {
      id: randomUUID(),
      type: 'hero',
      title: 'Bem-vindo à Nossa Empresa',
      subtitle: 'Soluções inovadoras para o seu negócio',
      elements: [
        {
          id: randomUUID(),
          type: 'heading',
          content: 'Transforme Seu Negócio Conosco',
        },
        {
          id: randomUUID(),
          type: 'text',
          content:
            'Oferecemos as melhores soluções para impulsionar sua empresa ao próximo nível.',
        },
        {
          id: randomUUID(),
          type: 'button',
          content: 'Saiba Mais',
          props: { url: '#contato', variant: 'primary' },
        },
      ],
      settings: {
        backgroundColor: 'primary',
        alignment: 'center',
        padding: 'lg',
      },
    },
    {
      id: randomUUID(),
      type: 'features',
      title: 'Nossos Diferenciais',
      subtitle: 'Por que nos escolher',
      elements: [
        {
          id: randomUUID(),
          type: 'heading',
          content: 'Qualidade e Compromisso',
        },
        {
          id: randomUUID(),
          type: 'text',
          content:
            'Trabalhamos com excelência para entregar o melhor resultado para nossos clientes.',
        },
      ],
      settings: {
        backgroundColor: 'light',
        alignment: 'center',
        padding: 'md',
      },
    },
    {
      id: randomUUID(),
      type: 'cta',
      title: 'Pronto para Começar?',
      subtitle: 'Entre em contato conosco hoje mesmo',
      elements: [
        {
          id: randomUUID(),
          type: 'button',
          content: 'Fale Conosco',
          props: { url: '/contato', variant: 'primary' },
        },
      ],
      settings: {
        backgroundColor: 'gradient',
        alignment: 'center',
        padding: 'lg',
      },
    },
  ],
  settings: {
    title: 'Landing Page Mock',
    description: 'Landing page para testes',
    primaryColor: '#1e40af',
    secondaryColor: '#16a34a',
  },
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
}

/**
 * Provider mock de IA para testes e desenvolvimento
 *
 * @example
 * ```typescript
 * const provider = new MockAIProvider()
 * const response = await provider.generate({
 *   messages: [{ role: 'user', content: 'Crie uma landing page' }],
 * })
 * // response.content contém uma landing page JSON válida
 * ```
 */
export class MockAIProvider implements IAIProvider {
  readonly name = 'Mock'
  readonly type = 'mock' as const

  /**
   * Gera uma resposta mockada
   *
   * @param params - Parâmetros (ignorados no mock)
   * @returns Landing page mockada em formato JSON
   */
  async generate(_params: AIGenerateParams): Promise<AIResponse> {
    // Simula um pequeno delay para testes realistas
    await new Promise((resolve) => setTimeout(resolve, 50))

    const landingPage: LandingPage = {
      ...MOCK_LANDING_PAGE,
      id: randomUUID(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      sections: MOCK_LANDING_PAGE.sections.map((section) => ({
        ...section,
        id: randomUUID(),
        elements: section.elements.map((element) => ({
          ...element,
          id: randomUUID(),
        })),
      })),
    }

    return {
      content: JSON.stringify(landingPage),
      tokensUsed: 0,
      model: 'mock',
    }
  }
}
