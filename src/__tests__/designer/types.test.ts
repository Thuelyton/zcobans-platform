import { describe, it, expect } from 'vitest'
import {
  ELEMENT_TYPES,
  SECTION_TYPES,
  FONT_SIZES,
  FONT_WEIGHTS,
  ALIGNMENTS,
  DEVICE_WIDTHS,
  BUTTON_VARIANTS,
  DEFAULT_SPACING,
  DEFAULT_SECTION_PADDING,
} from '@/lib/designer/types'
import type {
  ElementType,
  SectionType,
  FontSize,
  FontWeight,
  Alignment,
  DeviceType,
  ButtonVariant,
  Spacing,
  DesignerElement,
  DesignerSection,
  DesignerPage,
} from '@/lib/designer/types'

describe('Designer Types', () => {
  describe('ELEMENT_TYPES', () => {
    it('should have all element types', () => {
      expect(ELEMENT_TYPES).toEqual(['heading', 'text', 'button', 'image'])
    })

    it('should contain heading', () => {
      expect(ELEMENT_TYPES).toContain('heading')
    })

    it('should contain text', () => {
      expect(ELEMENT_TYPES).toContain('text')
    })

    it('should contain button', () => {
      expect(ELEMENT_TYPES).toContain('button')
    })

    it('should contain image', () => {
      expect(ELEMENT_TYPES).toContain('image')
    })
  })

  describe('SECTION_TYPES', () => {
    it('should have all section types', () => {
      expect(SECTION_TYPES).toEqual(['hero', 'features', 'cta', 'about', 'contact', 'faq', 'footer'])
    })

    it('should have 7 section types', () => {
      expect(SECTION_TYPES.length).toBe(7)
    })
  })

  describe('FONT_SIZES', () => {
    it('should have all font sizes', () => {
      expect(FONT_SIZES.length).toBe(10)
    })

    it('should start with text-xs', () => {
      expect(FONT_SIZES[0]).toBe('text-xs')
    })

    it('should end with text-6xl', () => {
      expect(FONT_SIZES[FONT_SIZES.length - 1]).toBe('text-6xl')
    })
  })

  describe('FONT_WEIGHTS', () => {
    it('should have all font weights', () => {
      expect(FONT_WEIGHTS).toEqual(['font-normal', 'font-medium', 'font-semibold', 'font-bold'])
    })
  })

  describe('ALIGNMENTS', () => {
    it('should have all alignments', () => {
      expect(ALIGNMENTS).toEqual(['left', 'center', 'right'])
    })
  })

  describe('DEVICE_WIDTHS', () => {
    it('should have all device widths', () => {
      expect(DEVICE_WIDTHS).toEqual({
        desktop: '100%',
        tablet: '768px',
        mobile: '375px',
      })
    })

    it('should have desktop width as 100%', () => {
      expect(DEVICE_WIDTHS.desktop).toBe('100%')
    })

    it('should have tablet width as 768px', () => {
      expect(DEVICE_WIDTHS.tablet).toBe('768px')
    })

    it('should have mobile width as 375px', () => {
      expect(DEVICE_WIDTHS.mobile).toBe('375px')
    })
  })

  describe('BUTTON_VARIANTS', () => {
    it('should have all button variants', () => {
      expect(BUTTON_VARIANTS).toEqual(['primary', 'secondary', 'outline', 'ghost'])
    })
  })

  describe('DEFAULT_SPACING', () => {
    it('should have zero spacing', () => {
      expect(DEFAULT_SPACING).toEqual({
        top: '0',
        bottom: '0',
        left: '0',
        right: '0',
      })
    })
  })

  describe('DEFAULT_SECTION_PADDING', () => {
    it('should have default section padding', () => {
      expect(DEFAULT_SECTION_PADDING).toEqual({
        top: '4rem',
        bottom: '4rem',
        left: '1.5rem',
        right: '1.5rem',
      })
    })
  })

  describe('TypeScript type compatibility', () => {
    it('should allow valid element type', () => {
      const type: ElementType = 'heading'
      expect(type).toBe('heading')
    })

    it('should allow valid section type', () => {
      const type: SectionType = 'hero'
      expect(type).toBe('hero')
    })

    it('should allow valid font size', () => {
      const size: FontSize = 'text-lg'
      expect(size).toBe('text-lg')
    })

    it('should allow valid font weight', () => {
      const weight: FontWeight = 'font-bold'
      expect(weight).toBe('font-bold')
    })

    it('should allow valid alignment', () => {
      const alignment: Alignment = 'center'
      expect(alignment).toBe('center')
    })

    it('should allow valid device type', () => {
      const device: DeviceType = 'mobile'
      expect(device).toBe('mobile')
    })

    it('should allow valid button variant', () => {
      const variant: ButtonVariant = 'primary'
      expect(variant).toBe('primary')
    })
  })
})

describe('Designer Interfaces', () => {
  describe('Spacing', () => {
    it('should allow valid spacing object', () => {
      const spacing: Spacing = {
        top: '1rem',
        bottom: '2rem',
        left: '0.5rem',
        right: '0.5rem',
      }
      expect(spacing.top).toBe('1rem')
    })
  })

  describe('DesignerElement', () => {
    it('should allow valid element', () => {
      const element: DesignerElement = {
        id: 'test-id',
        type: 'heading',
        order: 0,
        props: { text: 'Test', level: 'h1' },
        styles: { fontSize: 'text-4xl' },
      }
      expect(element.id).toBe('test-id')
      expect(element.type).toBe('heading')
    })
  })

  describe('DesignerSection', () => {
    it('should allow valid section', () => {
      const section: DesignerSection = {
        id: 'test-id',
        type: 'hero',
        order: 0,
        title: 'Hero Section',
        elements: [],
        styles: {
          backgroundColor: '#ffffff',
          padding: DEFAULT_SPACING,
          alignment: 'center',
        },
      }
      expect(section.id).toBe('test-id')
      expect(section.type).toBe('hero')
    })
  })

  describe('DesignerPage', () => {
    it('should allow valid page', () => {
      const page: DesignerPage = {
        id: 'test-id',
        title: 'Test Page',
        slug: 'test-page',
        sections: [],
        settings: {
          title: 'Test Page',
          primaryColor: '#000000',
          secondaryColor: '#ffffff',
          fontFamily: 'Arial',
        },
        metadata: {
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          version: 1,
        },
      }
      expect(page.id).toBe('test-id')
      expect(page.title).toBe('Test Page')
    })
  })
})
