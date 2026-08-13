/**
 * Visual Designer Module
 * ZCobans Visual Designer
 *
 * Este módulo fornece tipos, schemas e utilitários para o
 * construtor visual de landing pages.
 */

// Store
export { DesignerProvider, useDesigner } from './store'

// Utils
export {
  generateId,
  hexToRgb,
  rgbToHex,
  deepClone,
  debounce,
  saveToLocalStorage,
  loadFromLocalStorage,
  removeFromLocalStorage,
  DESIGNER_STORAGE_KEY,
  AUTO_SAVE_INTERVAL,
  MAX_HISTORY_SIZE,
} from './utils'

// Types
export type {
  ElementType,
  SectionType,
  FontSize,
  FontWeight,
  Alignment,
  DeviceType,
  ButtonVariant,
  Spacing,
  HeadingProps,
  TextProps,
  ButtonProps,
  ImageProps,
  ElementProps,
  ElementStyles,
  DesignerElement,
  SectionStyles,
  DesignerSection,
  PageSettings,
  DesignerPage,
  DesignerState,
  DesignerAction,
  SectionTemplate,
  PropertyConfig,
} from './types'

export {
  ELEMENT_TYPES,
  SECTION_TYPES,
  FONT_SIZES,
  FONT_WEIGHTS,
  ALIGNMENTS,
  DEVICE_WIDTHS,
  BUTTON_VARIANTS,
  DEFAULT_SPACING,
  DEFAULT_SECTION_PADDING,
} from './types'

// Schemas
export {
  elementTypeSchema,
  sectionTypeSchema,
  fontSizeSchema,
  fontWeightSchema,
  alignmentSchema,
  buttonVariantSchema,
  spacingSchema,
  elementPropsSchema,
  elementStylesSchema,
  designerElementSchema,
  sectionStylesSchema,
  designerSectionSchema,
  pageSettingsSchema,
  designerPageSchema,
  savePageInputSchema,
} from './schemas'

// Templates
export {
  SECTION_TEMPLATES,
  getSectionTemplate,
  createSectionFromTemplate,
  createDefaultPage,
} from './templates'
