import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { DesignerProvider, useDesigner } from '@/lib/designer/store'
import { ComponentsPanel } from '@/components/designer/ComponentsPanel'
import { SectionItem } from '@/components/designer/SectionItem'
import { ElementItem } from '@/components/designer/ElementItem'
import { createDefaultPage } from '@/lib/designer/templates'

// Mock the generateId function
vi.mock('@/lib/designer/utils', () => ({
  generateId: () => 'test-uuid-123',
  saveToLocalStorage: vi.fn(),
  loadFromLocalStorage: vi.fn(),
  deepClone: (obj: unknown) => JSON.parse(JSON.stringify(obj)),
  DESIGNER_STORAGE_KEY: 'zcobans-designer-test',
  AUTO_SAVE_INTERVAL: 30000,
  MAX_HISTORY_SIZE: 50,
}))

describe('Designer Components', () => {
  describe('SectionItem', () => {
    it('should render section item', () => {
      const mockIcon = ({ className }: { className?: string }) => (
        <span className={className}>Icon</span>
      )
      
      render(
        <SectionItem
          type="hero"
          name="Hero"
          icon={mockIcon}
          description="Seção principal"
          onClick={vi.fn()}
        />
      )
      
      expect(screen.getByText('Hero')).toBeDefined()
      expect(screen.getByText('Seção principal')).toBeDefined()
    })

    it('should call onClick when clicked', () => {
      const mockOnClick = vi.fn()
      const mockIcon = ({ className }: { className?: string }) => (
        <span className={className}>Icon</span>
      )
      
      render(
        <SectionItem
          type="hero"
          name="Hero"
          icon={mockIcon}
          description="Seção principal"
          onClick={mockOnClick}
        />
      )
      
      fireEvent.click(screen.getByText('Hero'))
      expect(mockOnClick).toHaveBeenCalledTimes(1)
    })
  })

  describe('ElementItem', () => {
    it('should render element item', () => {
      const mockIcon = ({ className }: { className?: string }) => (
        <span className={className}>Icon</span>
      )
      
      render(
        <ElementItem
          type="heading"
          name="Heading"
          icon={mockIcon}
          onClick={vi.fn()}
        />
      )
      
      expect(screen.getByText('Heading')).toBeDefined()
    })

    it('should call onClick when clicked', () => {
      const mockOnClick = vi.fn()
      const mockIcon = ({ className }: { className?: string }) => (
        <span className={className}>Icon</span>
      )
      
      render(
        <ElementItem
          type="heading"
          name="Heading"
          icon={mockIcon}
          onClick={mockOnClick}
        />
      )
      
      fireEvent.click(screen.getByText('Heading'))
      expect(mockOnClick).toHaveBeenCalledTimes(1)
    })

    it('should be disabled when disabled prop is true', () => {
      const mockIcon = ({ className }: { className?: string }) => (
        <span className={className}>Icon</span>
      )
      
      render(
        <ElementItem
          type="heading"
          name="Heading"
          icon={mockIcon}
          onClick={vi.fn()}
          disabled
        />
      )
      
      const button = screen.getByRole('button', { name: /heading/i })
      expect(button.hasAttribute('disabled')).toBe(true)
    })
  })

  describe('ComponentsPanel', () => {
    it('should render components panel', () => {
      render(
        <DesignerProvider>
          <ComponentsPanel />
        </DesignerProvider>
      )
      
      expect(screen.getByText('Seções')).toBeDefined()
      expect(screen.getByText('Elementos')).toBeDefined()
    })

    it('should render all section types', () => {
      render(
        <DesignerProvider initialPage={{
          id: 'test',
          title: 'Test',
          slug: 'test',
          sections: [],
          settings: { title: 'Test', primaryColor: '#000', secondaryColor: '#fff', fontFamily: 'Arial' },
          metadata: { createdAt: new Date().toISOString(), updatedAt: new Date().toISOString(), version: 1 },
        }}>
          <ComponentsPanel />
        </DesignerProvider>
      )
      
      expect(screen.getByText('Hero')).toBeDefined()
      expect(screen.getByText('Features')).toBeDefined()
      expect(screen.getByText('CTA')).toBeDefined()
      expect(screen.getByText('About')).toBeDefined()
      expect(screen.getByText('Contact')).toBeDefined()
      expect(screen.getByText('FAQ')).toBeDefined()
      expect(screen.getByText('Footer')).toBeDefined()
    })

    it('should render all element types', () => {
      render(
        <DesignerProvider>
          <ComponentsPanel />
        </DesignerProvider>
      )
      
      expect(screen.getByText('Heading')).toBeDefined()
      expect(screen.getByText('Text')).toBeDefined()
      expect(screen.getByText('Image')).toBeDefined()
      expect(screen.getByText('Button')).toBeDefined()
    })
  })
})

describe('useDesigner hook', () => {
  it('should throw error when used outside provider', () => {
    const TestComponent = () => {
      useDesigner()
      return <div>Test</div>
    }
    
    // Suppress console.error for this test
    const originalError = console.error
    console.error = vi.fn()
    
    expect(() => render(<TestComponent />)).toThrow(
      'useDesigner must be used within a DesignerProvider'
    )
    
    console.error = originalError
  })
})
