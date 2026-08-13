/**
 * Visual Designer Templates
 * ZCobans Visual Designer
 *
 * Templates pré-definidos de seções para o Designer.
 * Cada template define a estrutura padrão de uma seção.
 */

import { randomUUID } from 'crypto'
import type {
  SectionType,
  SectionTemplate,
  DesignerSection,
  DesignerElement,
  DesignerPage,
  SectionStyles,
} from './types'

// ============================================================================
// HELPER: Generate UUID (client-safe)
// ============================================================================

/**
 * Gera um UUID. No cliente usa crypto, no servidor usa módulo crypto.
 */
function generateId(): string {
  if (typeof window !== 'undefined' && window.crypto) {
    return window.crypto.randomUUID()
  }
  // Fallback for SSR/tests
  return randomUUID()
}

// ============================================================================
// SECTION TEMPLATES
// ============================================================================

/**
 * Template: Hero Section
 */
const heroTemplate: SectionTemplate = {
  type: 'hero',
  name: 'Hero',
  description: 'Seção principal com título, subtítulo e chamada para ação',
  icon: 'Layout',
  defaultElements: [
    {
      id: generateId(),
      type: 'heading',
      order: 0,
      props: { text: 'Título Principal', level: 'h1' },
      styles: { fontSize: 'text-5xl', fontWeight: 'font-bold', alignment: 'center', color: '#ffffff' },
    },
    {
      id: generateId(),
      type: 'text',
      order: 1,
      props: { text: 'Subtítulo descritivo da sua proposta de valor.' },
      styles: { fontSize: 'text-xl', alignment: 'center', color: '#94a3b8' },
    },
    {
      id: generateId(),
      type: 'button',
      order: 2,
      props: { text: 'Saiba Mais', url: '#', variant: 'primary' },
      styles: { alignment: 'center' },
    },
  ],
  defaultStyles: {
    backgroundColor: '#1e40af',
    padding: { top: '6rem', bottom: '6rem', left: '1.5rem', right: '1.5rem' },
    alignment: 'center',
  },
}

/**
 * Template: Features Section
 */
const featuresTemplate: SectionTemplate = {
  type: 'features',
  name: 'Features',
  description: 'Lista de recursos ou diferenciais',
  icon: 'CheckCircle',
  defaultElements: [
    {
      id: generateId(),
      type: 'heading',
      order: 0,
      props: { text: 'Nossos Diferenciais', level: 'h2' },
      styles: { fontSize: 'text-3xl', fontWeight: 'font-bold', alignment: 'center' },
    },
    {
      id: generateId(),
      type: 'text',
      order: 1,
      props: { text: 'Conheça o que nos torna especiais.' },
      styles: { fontSize: 'text-lg', alignment: 'center', color: '#64748b' },
    },
  ],
  defaultStyles: {
    backgroundColor: '#ffffff',
    padding: { top: '4rem', bottom: '4rem', left: '1.5rem', right: '1.5rem' },
    alignment: 'center',
  },
}

/**
 * Template: CTA Section
 */
const ctaTemplate: SectionTemplate = {
  type: 'cta',
  name: 'Call to Action',
  description: 'Chamada para ação com botão',
  icon: 'MousePointer',
  defaultElements: [
    {
      id: generateId(),
      type: 'heading',
      order: 0,
      props: { text: 'Pronto para Começar?', level: 'h2' },
      styles: { fontSize: 'text-3xl', fontWeight: 'font-bold', alignment: 'center', color: '#ffffff' },
    },
    {
      id: generateId(),
      type: 'text',
      order: 1,
      props: { text: 'Entre em contato e descubra como podemos ajudar.' },
      styles: { fontSize: 'text-lg', alignment: 'center', color: '#e2e8f0' },
    },
    {
      id: generateId(),
      type: 'button',
      order: 2,
      props: { text: 'Fale Conosco', url: '#', variant: 'secondary' },
      styles: { alignment: 'center' },
    },
  ],
  defaultStyles: {
    backgroundColor: '#0f172a',
    padding: { top: '5rem', bottom: '5rem', left: '1.5rem', right: '1.5rem' },
    alignment: 'center',
  },
}

/**
 * Template: About Section
 */
const aboutTemplate: SectionTemplate = {
  type: 'about',
  name: 'About',
  description: 'Seção sobre a empresa',
  icon: 'Building',
  defaultElements: [
    {
      id: generateId(),
      type: 'heading',
      order: 0,
      props: { text: 'Sobre Nós', level: 'h2' },
      styles: { fontSize: 'text-3xl', fontWeight: 'font-bold' },
    },
    {
      id: generateId(),
      type: 'text',
      order: 1,
      props: { text: 'Somos uma empresa comprometida em oferecer as melhores soluções para nossos clientes.' },
      styles: { fontSize: 'text-base', color: '#64748b' },
    },
  ],
  defaultStyles: {
    backgroundColor: '#ffffff',
    padding: { top: '4rem', bottom: '4rem', left: '1.5rem', right: '1.5rem' },
    alignment: 'left',
  },
}

/**
 * Template: Contact Section
 */
const contactTemplate: SectionTemplate = {
  type: 'contact',
  name: 'Contact',
  description: 'Formulário ou informações de contato',
  icon: 'Mail',
  defaultElements: [
    {
      id: generateId(),
      type: 'heading',
      order: 0,
      props: { text: 'Entre em Contato', level: 'h2' },
      styles: { fontSize: 'text-3xl', fontWeight: 'font-bold', alignment: 'center' },
    },
    {
      id: generateId(),
      type: 'text',
      order: 1,
      props: { text: 'Estamos prontos para ajudar. Envie sua mensagem!' },
      styles: { fontSize: 'text-lg', alignment: 'center', color: '#64748b' },
    },
  ],
  defaultStyles: {
    backgroundColor: '#f8fafc',
    padding: { top: '4rem', bottom: '4rem', left: '1.5rem', right: '1.5rem' },
    alignment: 'center',
  },
}

/**
 * Template: FAQ Section
 */
const faqTemplate: SectionTemplate = {
  type: 'faq',
  name: 'FAQ',
  description: 'Perguntas frequentes',
  icon: 'HelpCircle',
  defaultElements: [
    {
      id: generateId(),
      type: 'heading',
      order: 0,
      props: { text: 'Perguntas Frequentes', level: 'h2' },
      styles: { fontSize: 'text-3xl', fontWeight: 'font-bold', alignment: 'center' },
    },
    {
      id: generateId(),
      type: 'text',
      order: 1,
      props: { text: 'Respondemos as dúvidas mais comuns dos nossos clientes.' },
      styles: { fontSize: 'text-lg', alignment: 'center', color: '#64748b' },
    },
  ],
  defaultStyles: {
    backgroundColor: '#ffffff',
    padding: { top: '4rem', bottom: '4rem', left: '1.5rem', right: '1.5rem' },
    alignment: 'center',
  },
}

/**
 * Template: Footer Section
 */
const footerTemplate: SectionTemplate = {
  type: 'footer',
  name: 'Footer',
  description: 'Rodapé com informações e links',
  icon: 'LayoutTemplate',
  defaultElements: [
    {
      id: generateId(),
      type: 'heading',
      order: 0,
      props: { text: 'Sua Empresa', level: 'h3' },
      styles: { fontSize: 'text-xl', fontWeight: 'font-bold', color: '#ffffff' },
    },
    {
      id: generateId(),
      type: 'text',
      order: 1,
      props: { text: '© 2024 Sua Empresa. Todos os direitos reservados.' },
      styles: { fontSize: 'text-sm', color: '#94a3b8' },
    },
  ],
  defaultStyles: {
    backgroundColor: '#0f172a',
    padding: { top: '3rem', bottom: '2rem', left: '1.5rem', right: '1.5rem' },
    alignment: 'center',
  },
}

// ============================================================================
// ALL TEMPLATES
// ============================================================================

/**
 * Todos os templates de seção disponíveis
 */
export const SECTION_TEMPLATES: SectionTemplate[] = [
  heroTemplate,
  featuresTemplate,
  ctaTemplate,
  aboutTemplate,
  contactTemplate,
  faqTemplate,
  footerTemplate,
]

/**
 * Obtém um template pelo tipo
 */
export function getSectionTemplate(type: SectionType): SectionTemplate | undefined {
  return SECTION_TEMPLATES.find((t) => t.type === type)
}

/**
 * Cria uma seção a partir de um template
 */
export function createSectionFromTemplate(type: SectionType, order: number): DesignerSection {
  const template = getSectionTemplate(type)

  if (!template) {
    // Fallback: cria uma seção genérica
    return {
      id: generateId(),
      type,
      order,
      title: type.charAt(0).toUpperCase() + type.slice(1),
      elements: [
        {
          id: generateId(),
          type: 'heading',
          order: 0,
          props: { text: `Seção ${type}`, level: 'h2' },
          styles: { fontSize: 'text-3xl', fontWeight: 'font-bold', alignment: 'center' },
        },
      ],
      styles: {
        backgroundColor: '#ffffff',
        padding: { top: '4rem', bottom: '4rem', left: '1.5rem', right: '1.5rem' },
        alignment: 'center',
      },
    }
  }

  return {
    id: generateId(),
    type: template.type,
    order,
    title: template.name,
    elements: template.defaultElements.map((el) => ({
      ...el,
      id: generateId(), // Gera novos IDs para cada instância
    })),
    styles: { ...template.defaultStyles },
  }
}

/**
 * Cria uma página inicial padrão
 */
export function createDefaultPage(): DesignerPage {
  const now = new Date().toISOString()

  return {
    id: generateId(),
    title: 'Minha Landing Page',
    slug: 'minha-landing-page',
    description: 'Landing page criada no ZCobans Visual Designer',
    sections: [
      createSectionFromTemplate('hero', 0),
      createSectionFromTemplate('features', 1),
      createSectionFromTemplate('cta', 2),
    ],
    settings: {
      title: 'Minha Landing Page',
      description: 'Landing page criada no ZCobans Visual Designer',
      primaryColor: '#1e40af',
      secondaryColor: '#16a34a',
      fontFamily: 'Geist',
    },
    metadata: {
      createdAt: now,
      updatedAt: now,
      version: 1,
    },
  }
}

// ============================================================================
// RE-EXPORT TYPES
// ============================================================================

export type { SectionTemplate }
