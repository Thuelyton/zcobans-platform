/**
 * Visual Designer Types
 * ZCobans Visual Designer
 *
 * Tipos para o sistema de design visual de landing pages.
 * Baseado em dados (data-driven) — o canvas renderiza a estrutura.
 */

// ============================================================================
// ENUMS / CONSTANTS
// ============================================================================

/**
 * Tipos de elemento disponíveis
 */
export const ELEMENT_TYPES = ['heading', 'text', 'button', 'image'] as const
export type ElementType = (typeof ELEMENT_TYPES)[number]

/**
 * Tipos de seção disponíveis
 */
export const SECTION_TYPES = [
  'hero',
  'features',
  'cta',
  'about',
  'contact',
  'faq',
  'footer',
] as const
export type SectionType = (typeof SECTION_TYPES)[number]

/**
 * Tamanhos de fonte
 */
export const FONT_SIZES = [
  'text-xs',
  'text-sm',
  'text-base',
  'text-lg',
  'text-xl',
  'text-2xl',
  'text-3xl',
  'text-4xl',
  'text-5xl',
  'text-6xl',
] as const
export type FontSize = (typeof FONT_SIZES)[number]

/**
 * Pesos de fonte
 */
export const FONT_WEIGHTS = [
  'font-normal',
  'font-medium',
  'font-semibold',
  'font-bold',
] as const
export type FontWeight = (typeof FONT_WEIGHTS)[number]

/**
 * Alinhamento de conteúdo
 */
export const ALIGNMENTS = ['left', 'center', 'right'] as const
export type Alignment = (typeof ALIGNMENTS)[number]

/**
 * Larguras de device para preview
 */
export const DEVICE_WIDTHS = {
  desktop: '100%',
  tablet: '768px',
  mobile: '375px',
} as const
export type DeviceType = keyof typeof DEVICE_WIDTHS

/**
 * Variantes de botão
 */
export const BUTTON_VARIANTS = ['primary', 'secondary', 'outline', 'ghost'] as const
export type ButtonVariant = (typeof BUTTON_VARIANTS)[number]

// ============================================================================
// SPACING TYPES
// ============================================================================

/**
 * Espaçamento uniforme (top, bottom, left, right)
 */
export interface Spacing {
  top: string
  bottom: string
  left: string
  right: string
}

/**
 * Espaçamento padrão
 */
export const DEFAULT_SPACING: Spacing = {
  top: '0',
  bottom: '0',
  left: '0',
  right: '0',
}

/**
 * Padding padrão para seções
 */
export const DEFAULT_SECTION_PADDING: Spacing = {
  top: '4rem',
  bottom: '4rem',
  left: '1.5rem',
  right: '1.5rem',
}

// ============================================================================
// ELEMENT TYPES
// ============================================================================

/**
 * Propriedades específicas de cada tipo de elemento
 */
export interface HeadingProps {
  text: string
  level: 'h1' | 'h2' | 'h3' | 'h4'
}

export interface TextProps {
  text: string
}

export interface ButtonProps {
  text: string
  url: string
  variant: ButtonVariant
}

export interface ImageProps {
  url: string
  alt: string
}

/**
 * Props genéricas do elemento
 */
export type ElementProps = HeadingProps | TextProps | ButtonProps | ImageProps

/**
 * Estilos visuais de um elemento
 */
export interface ElementStyles {
  fontSize?: FontSize
  fontWeight?: FontWeight
  color?: string
  backgroundColor?: string
  padding?: Spacing
  margin?: Spacing
  alignment?: Alignment
  borderRadius?: string
  maxWidth?: string
}

/**
 * Elemento do Designer
 */
export interface DesignerElement {
  id: string
  type: ElementType
  order: number
  props: ElementProps
  styles: ElementStyles
}

// ============================================================================
// SECTION TYPES
// ============================================================================

/**
 * Estilos visuais de uma seção
 */
export interface SectionStyles {
  backgroundColor: string
  backgroundGradient?: string
  padding: Spacing
  maxWidth?: string
  alignment: Alignment
}

/**
 * Seção do Designer
 */
export interface DesignerSection {
  id: string
  type: SectionType
  order: number
  title: string
  elements: DesignerElement[]
  styles: SectionStyles
}

// ============================================================================
// PAGE TYPES
// ============================================================================

/**
 * Configurações globais da página
 */
export interface PageSettings {
  title: string
  description?: string
  primaryColor: string
  secondaryColor: string
  fontFamily: string
}

/**
 * Página completa do Designer
 */
export interface DesignerPage {
  id: string
  title: string
  slug: string
  description?: string
  sections: DesignerSection[]
  settings: PageSettings
  metadata: {
    createdAt: string
    updatedAt: string
    version: number
  }
}

// ============================================================================
// DESIGNER STATE
// ============================================================================

/**
 * Estado do Designer
 */
export interface DesignerState {
  /** Página sendo editada */
  page: DesignerPage
  /** ID da seção selecionada */
  selectedSectionId: string | null
  /** ID do elemento selecionado */
  selectedElementId: string | null
  /** Device atual para preview */
  device: DeviceType
  /** Histórico para undo/redo */
  history: DesignerPage[]
  /** Índice atual no histórico */
  historyIndex: number
  /** Se está salvando */
  isSaving: boolean
  /** Se há mudanças não salvas */
  hasUnsavedChanges: boolean
}

/**
 * Ações do Designer
 */
export type DesignerAction =
  // Page actions
  | { type: 'SET_PAGE'; payload: DesignerPage }
  | { type: 'UPDATE_SETTINGS'; payload: Partial<PageSettings> }

  // Section actions
  | { type: 'ADD_SECTION'; payload: { section: DesignerSection; index?: number } }
  | { type: 'REMOVE_SECTION'; payload: { sectionId: string } }
  | { type: 'UPDATE_SECTION'; payload: { sectionId: string; updates: Partial<DesignerSection> } }
  | { type: 'UPDATE_SECTION_STYLES'; payload: { sectionId: string; styles: Partial<SectionStyles> } }
  | { type: 'MOVE_SECTION'; payload: { sectionId: string; direction: 'up' | 'down' } }
  | { type: 'REORDER_SECTION'; payload: { sectionId: string; targetIndex: number } }

  // Element actions
  | { type: 'ADD_ELEMENT'; payload: { sectionId: string; element: DesignerElement; index?: number } }
  | { type: 'REMOVE_ELEMENT'; payload: { sectionId: string; elementId: string } }
  | { type: 'UPDATE_ELEMENT'; payload: { sectionId: string; elementId: string; updates: Partial<DesignerElement> } }
  | { type: 'UPDATE_ELEMENT_PROPS'; payload: { sectionId: string; elementId: string; props: Partial<ElementProps> } }
  | { type: 'UPDATE_ELEMENT_STYLES'; payload: { sectionId: string; elementId: string; styles: Partial<ElementStyles> } }
  | { type: 'MOVE_ELEMENT'; payload: { sectionId: string; elementId: string; targetIndex: number } }

  // Selection actions
  | { type: 'SELECT_SECTION'; payload: { sectionId: string | null } }
  | { type: 'SELECT_ELEMENT'; payload: { sectionId: string; elementId: string | null } }
  | { type: 'DESELECT_ALL' }

  // Device
  | { type: 'SET_DEVICE'; payload: DeviceType }

  // History
  | { type: 'UNDO' }
  | { type: 'REDO' }
  | { type: 'PUSH_HISTORY'; payload: DesignerPage }

  // Saving
  | { type: 'SET_SAVING'; payload: boolean }
  | { type: 'SET_UNSAVED'; payload: boolean };

// ============================================================================
// TEMPLATE TYPES
// ============================================================================

/**
 * Template de seção pré-definido
 */
export interface SectionTemplate {
  type: SectionType
  name: string
  description: string
  icon: string
  defaultElements: DesignerElement[]
  defaultStyles: SectionStyles
}

/**
 * Configuração de propriedade para o painel
 */
export interface PropertyConfig {
  key: string
  label: string
  type: 'text' | 'textarea' | 'color' | 'select' | 'number' | 'url'
  options?: { value: string; label: string }[]
  placeholder?: string
  min?: number
  max?: number
}
